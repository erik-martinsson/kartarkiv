import {
  access,
  mkdir,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";

import type { ReviewedDomaCompetition } from "../../src/types/migration";
import { validateReviewedCompetition } from "./reviewed-validator";

export type AssetKind = "blank-map" | "route-map" | "track";

export type PublishReviewedOptions = {
  /** Project root containing src/ and public/. Defaults to process.cwd(). */
  projectRoot?: string;
  /** Path to the reviewed JSON source, used for reporting only. */
  sourceFile?: string;
  /** Allow existing Markdown and asset targets to be overwritten. */
  force?: boolean;
  /** Do not plan or download map/track assets. */
  noAssets?: boolean;
  /** Two-letter country code written to frontmatter. Defaults to SE. */
  country?: string;
  /** Value written to the frontmatter featured field. Defaults to false. */
  featured?: boolean;
  /** Override the generated Markdown body. */
  description?: string | null;
  /** Fetch implementation used for asset downloads. Defaults to global fetch. */
  fetch?: typeof globalThis.fetch;
  /** Optional progress callback. */
  onProgress?: (event: PublishProgressEvent) => void;
};

export type BuildPublishPlanOptions = Pick<
  PublishReviewedOptions,
  "projectRoot" | "sourceFile" | "noAssets" | "country" | "featured" | "description"
>;

export type AssetPlan = {
  kind: AssetKind;
  sourceUrl: string;
  diskPath: string;
  publicPath: string;
};

export type PublishPlan = {
  sourceFile: string | null;
  markdownPath: string;
  markdownPublicId: string;
  title: string;
  date: string;
  year: string;
  slug: string;
  assets: AssetPlan[];
  markdown: string;
  warnings: string[];
};

export type PublishedAsset = AssetPlan & {
  byteLength: number;
  contentType: string | null;
};

export type PublishResult = {
  plan: PublishPlan;
  markdownPath: string;
  markdownPublicId: string;
  markdown: string;
  assets: PublishedAsset[];
  warnings: string[];
};

export type PublishProgressEvent =
  | { type: "asset-download-start"; asset: AssetPlan }
  | { type: "asset-download-complete"; asset: PublishedAsset }
  | { type: "markdown-write-start"; path: string }
  | { type: "markdown-write-complete"; path: string }
  | { type: "publish-complete"; result: PublishResult };

export type ValidationIssueLike = {
  code: string;
  message: string;
  path?: string;
};

export class PublishValidationError extends Error {
  readonly issues: ValidationIssueLike[];

  constructor(issues: ValidationIssueLike[]) {
    super(formatValidationErrorMessage(issues));
    this.name = "PublishValidationError";
    this.issues = issues;
  }
}

export class PublishTargetExistsError extends Error {
  readonly targets: string[];

  constructor(targets: string[], projectRoot: string) {
    const formatted = targets
      .map((target) => `  - ${relative(projectRoot, target)}`)
      .join("\n");
    super(`Publish target already exists. Re-run with force enabled to overwrite:\n${formatted}`);
    this.name = "PublishTargetExistsError";
    this.targets = targets;
  }
}

const DEFAULT_COUNTRY = "SE";
const USER_AGENT = "kartarkiv-migrate-publish/1.0";

/** Read and parse a reviewed migration JSON file. */
export async function readReviewedCompetition(
  inputFile: string,
): Promise<ReviewedDomaCompetition> {
  const raw = await readFile(inputFile, "utf8");

  try {
    return JSON.parse(raw) as ReviewedDomaCompetition;
  } catch (error) {
    throw new Error(
      `Could not parse JSON file ${inputFile}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

/**
 * Validate that a reviewed migration can be published.
 * Returns validator warnings and throws for errors or a non-approved status.
 */
export function assertPublishable(
  reviewed: ReviewedDomaCompetition,
): ValidationIssueLike[] {
  const validation = validateReviewedCompetition(reviewed);

  if (!validation.ok) {
    throw new PublishValidationError(validation.errors);
  }

  if (reviewed.status !== "approved") {
    throw new Error(
      `Publish requires status "approved". Current status: ${reviewed.status}`,
    );
  }

  return validation.warnings;
}

/** Create a complete, side-effect-free publish plan. */
export function buildPublishPlan(
  reviewed: ReviewedDomaCompetition,
  options: BuildPublishPlanOptions = {},
): PublishPlan {
  const normalized = normalizePlanOptions({
    ...options,
    country:
      reviewed.competition.country ??
      options.country ??
      DEFAULT_COUNTRY,
  });
  const date = requireIsoDate(reviewed.competition.doma.date);
  const title = chooseTitle(reviewed);
  const year = date.slice(0, 4);
  const slug = `${date}-${slugify(title)}`;
  const markdownPath = join(
    normalized.projectRoot,
    "src",
    "content",
    "races",
    year,
    `${slug}.md`,
  );

  const assets = normalized.noAssets
    ? []
    : [
        createAssetPlan(
          "blank-map",
          reviewed.competition.doma.blankMapImageUrl,
          join(normalized.projectRoot, "public", "maps", year),
          `${slug}_blank`,
          ".jpg",
          normalized.projectRoot,
        ),
        createAssetPlan(
          "route-map",
          reviewed.competition.doma.routeMapImageUrl,
          join(normalized.projectRoot, "public", "maps", year),
          `${slug}_rutt`,
          ".jpg",
          normalized.projectRoot,
        ),
        createAssetPlan(
          "track",
          reviewed.competition.doma.kmlUrl,
          join(normalized.projectRoot, "public", "gps", year),
          slug,
          ".kml",
          normalized.projectRoot,
        ),
      ].filter((asset): asset is AssetPlan => asset !== null);

  const assetByKind = new Map(assets.map((asset) => [asset.kind, asset]));
  const warnings = collectPublishWarnings(reviewed);

  return {
    sourceFile: normalized.sourceFile,
    markdownPath,
    markdownPublicId: `src/content/races/${year}/${slug}.md`,
    title,
    date,
    year,
    slug,
    assets,
    markdown: buildMarkdown(reviewed, normalized, title, date, assetByKind),
    warnings,
  };
}

/**
 * Publish an already parsed review. Validation, asset downloads and writes are
 * performed here. Use buildPublishPlan() for dry-run output without side effects.
 */
export async function publishReviewed(
  reviewed: ReviewedDomaCompetition,
  options: PublishReviewedOptions = {},
): Promise<PublishResult> {
  const validatorWarnings = assertPublishable(reviewed);
  const normalized = normalizePublishOptions(options);
  const plan = buildPublishPlan(reviewed, {
    projectRoot: normalized.projectRoot,
    ...(normalized.sourceFile !== null
      ? { sourceFile: normalized.sourceFile }
      : {}),
    noAssets: normalized.noAssets,
    country: normalized.country,
    featured: normalized.featured,
    description: normalized.description,
  });

  await assertWritableTargets(plan, normalized.force, normalized.projectRoot);

  const downloadedAssets: PublishedAsset[] = [];
  for (const asset of plan.assets) {
    normalized.onProgress?.({ type: "asset-download-start", asset });
    const downloaded = await downloadAsset(
      asset,
      normalized.projectRoot,
      normalized.fetch,
      normalized.force,
    );
    downloadedAssets.push(downloaded);
    normalized.onProgress?.({ type: "asset-download-complete", asset: downloaded });
  }

  // Content-Type can correct an extension selected from the source URL. Build
  // Markdown once more with the final public paths before writing it.
  const finalAssetByKind = new Map<AssetKind, AssetPlan>(
    downloadedAssets.map((asset) => [asset.kind, asset]),
  );
  const finalMarkdown = buildMarkdown(
    reviewed,
    normalized,
    plan.title,
    plan.date,
    finalAssetByKind,
  );

  normalized.onProgress?.({
    type: "markdown-write-start",
    path: plan.markdownPath,
  });
  await atomicWriteFile(plan.markdownPath, finalMarkdown);
  normalized.onProgress?.({
    type: "markdown-write-complete",
    path: plan.markdownPath,
  });

  const result: PublishResult = {
    plan: {
      ...plan,
      assets: downloadedAssets,
      markdown: finalMarkdown,
    },
    markdownPath: plan.markdownPath,
    markdownPublicId: plan.markdownPublicId,
    markdown: finalMarkdown,
    assets: downloadedAssets,
    warnings: [
      ...plan.warnings,
      ...validatorWarnings.map(formatValidationWarning),
    ],
  };

  normalized.onProgress?.({ type: "publish-complete", result });
  return result;
}

/** Convenience wrapper that reads and publishes a reviewed JSON file. */
export async function publishReviewedFile(
  inputFile: string,
  options: Omit<PublishReviewedOptions, "sourceFile"> = {},
): Promise<PublishResult> {
  const reviewed = await readReviewedCompetition(inputFile);
  return publishReviewed(reviewed, { ...options, sourceFile: inputFile });
}

export function buildMarkdown(
  reviewed: ReviewedDomaCompetition,
  options: Pick<PublishReviewedOptions, "country" | "featured" | "description">,
  title: string,
  date: string,
  assetByKind: ReadonlyMap<AssetKind, AssetPlan>,
): string {
  const competition = reviewed.competition;
  const result = competition.result;
  const eventor = competition.eventor;
  const location =
    competition.location?.trim() || eventor?.location?.trim() || "";
  const club = result.club?.trim() || eventor?.organiser?.trim() || "";
  const raceClass = result.raceClass?.trim() || null;
  const raceTime = normalizeRaceTime(
    result.time ?? competition.doma.runningTime,
  );
  const position = parseInteger(result.position);
  const starters = parseInteger(result.starters);
  const mistakeSeconds = durationToSeconds(result.totalMistakeTime);
  const distanceKm =
    competition.doma.courseLengthKm ??
    competition.doma.runningDistanceKm;
  const gpsDistanceKm = competition.doma.runningDistanceKm;
  const latitude = competition.latitude;
  const longitude = competition.longitude;
  const mapImage = assetByKind.get("blank-map")?.publicPath ?? null;
  const routeImage = assetByKind.get("route-map")?.publicPath ?? null;
  const gpsFile = assetByKind.get("track")?.publicPath ?? null;
  const livelox = normalizeHttpUrl(
    competition.liveloxUrl ?? eventor?.liveloxUrl,
  );
  const winsplits = normalizeHttpUrl(competition.doma.winsplitsUrl);
  const results = normalizeHttpUrl(
    eventor?.resultListUrl ?? competition.eventorMatch?.resultListUrl,
  );
  const description = buildDescription(
    reviewed,
    title,
    normalizeDescription(options.description),
  );
  const country = sanitizeCountryCode(
    options.country ??
      competition.country ??
      DEFAULT_COUNTRY,
  );

  if (!raceClass) {
    throw new Error(
      "Cannot publish without raceClass. Fill in the class in Studio/Migrate and approve the review again.",
    );
  }

  if (
    typeof distanceKm !== "number" ||
    !Number.isFinite(distanceKm)
  ) {
    throw new Error(
      "Cannot publish without a valid course distance (distanceKm).",
    );
  }

  const lines: string[] = [
    "---",
    `title: ${yamlString(title)}`,
    `event: ${yamlString(title)}`,
    "",
    `date: ${date}`,
    "",
    `club: ${yamlString(club)}`,
    `country: ${yamlString(country)}`,
    `location: ${yamlString(location)}`,
    "",
    `discipline: ${yamlString(competition.discipline)}`,
    `raceClass: ${yamlString(raceClass)}`,
    "",
    `distanceKm: ${distanceKm}`,
  ];

  if (
    typeof gpsDistanceKm === "number" &&
    Number.isFinite(gpsDistanceKm)
  ) {
    lines.push(`gpsDistanceKm: ${gpsDistanceKm}`);
  }

  // gpsClimb is intentionally omitted until actual climb data exists.

  lines.push(
    "",
    `time: ${yamlNullableString(raceTime)}`,
    "",
    `position: ${yamlNullableNumber(position)}`,
    `starters: ${yamlNullableNumber(starters)}`,
    "",
    `controls: ${yamlNullableNumber(result.controls)}`,
    `mistakeSeconds: ${yamlNullableNumber(mistakeSeconds)}`,
  );

  if (mapImage) {
    lines.push("", `mapImage: ${yamlString(mapImage)}`);
  }

  if (routeImage) {
    if (!mapImage) lines.push("");
    lines.push(`routeImage: ${yamlString(routeImage)}`);
  }

  if (routeImage) {
    lines.push(`thumbnailImage: ${yamlString(routeImage)}`);
  }

  if (gpsFile) {
    lines.push("", `gpsFile: ${yamlString(gpsFile)}`);
  }

  if (
    typeof latitude === "number" &&
    Number.isFinite(latitude)
  ) {
    lines.push("", `latitude: ${latitude}`);
  }

  if (
    typeof longitude === "number" &&
    Number.isFinite(longitude)
  ) {
    if (
      !(
        typeof latitude === "number" &&
        Number.isFinite(latitude)
      )
    ) {
      lines.push("");
    }
    lines.push(`longitude: ${longitude}`);
  }

  const externalLinks: string[] = [];

  if (livelox) {
    externalLinks.push(`livelox: ${yamlString(livelox)}`);
  }

  if (winsplits) {
    externalLinks.push(`winsplits: ${yamlString(winsplits)}`);
  }

  if (results) {
    externalLinks.push(`results: ${yamlString(results)}`);
  }

  if (externalLinks.length > 0) {
    lines.push("", ...externalLinks);
  }

  lines.push(
    "",
    `featured: ${options.featured ? "true" : "false"}`,
    "---",
    "",
    description,
    "",
  );

  return lines.join("\n");
}

export function sanitizeCountryCode(value: string): string {
  const normalized = value.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) {
    throw new Error(
      `Invalid country code: ${value}. Expected two letters, for example SE.`,
    );
  }
  return normalized;
}

export function slugify(value: string): string {
  const slug = value
    .toLocaleLowerCase("sv-SE")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return slug || "tavling";
}

export function normalizeRaceTime(
  value: string | null | undefined,
): string | null {
  if (!value) return null;
  const compact = value.trim().replace(/\s+/g, "");
  if (!compact) return null;

  if (/^\d{1,2}:\d{2}:\d{2}$/.test(compact)) return compact;
  if (/^\d{1,3}:\d{2}$/.test(compact)) return compact;

  const hoursMinutesSeconds = compact.match(
    /^(\d{1,2}):(\d{2})[.,](\d{2})$/,
  );
  if (hoursMinutesSeconds) {
    return `${hoursMinutesSeconds[1]}:${hoursMinutesSeconds[2]}:${hoursMinutesSeconds[3]}`;
  }

  const minutesSeconds = compact.match(/^(\d{1,3})[.,](\d{2})$/);
  if (minutesSeconds) {
    return `${minutesSeconds[1]}:${minutesSeconds[2]}`;
  }

  return compact;
}

export function durationToSeconds(
  value: string | null | undefined,
): number | null {
  if (!value) return null;
  const normalized = normalizeRaceTime(value);
  if (!normalized) return null;

  const parts = normalized
    .split(":")
    .map((part) => Number.parseInt(part, 10));
  if (parts.some((part) => !Number.isFinite(part))) return null;

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return null;
}

export function formatSecondsSwedish(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds} sekunder`;
  if (seconds === 0) return `${minutes} minuter`;
  return `${minutes} minuter och ${seconds} sekunder`;
}

async function assertWritableTargets(
  plan: PublishPlan,
  force: boolean,
  projectRoot: string,
): Promise<void> {
  if (force) return;

  const targets = [
    plan.markdownPath,
    ...plan.assets.map((asset) => asset.diskPath),
  ];
  const existing: string[] = [];

  for (const target of targets) {
    if (await pathExists(target)) existing.push(target);
  }

  if (existing.length > 0) {
    throw new PublishTargetExistsError(existing, projectRoot);
  }
}

async function downloadAsset(
  asset: AssetPlan,
  projectRoot: string,
  fetchImplementation: typeof globalThis.fetch,
  force: boolean,
): Promise<PublishedAsset> {
  const response = await fetchImplementation(asset.sourceUrl, {
    redirect: "follow",
    headers: {
      "user-agent": USER_AGENT,
      accept: "*/*",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to download ${asset.kind}: HTTP ${response.status} ${response.statusText} (${asset.sourceUrl})`,
    );
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength === 0) {
    throw new Error(
      `Downloaded empty asset for ${asset.kind}: ${asset.sourceUrl}`,
    );
  }

  const contentType = response.headers.get("content-type");
  const currentExtension = extname(asset.diskPath);
  const detectedExtension = extensionFromContentType(
    contentType,
    currentExtension,
  );
  const finalDiskPath = replaceExtension(
    asset.diskPath,
    currentExtension,
    detectedExtension,
  );

  // A URL-derived target and a Content-Type-corrected target may differ. Check
  // the corrected target as well so force=false never overwrites it silently.
  if (
    !force &&
    finalDiskPath !== asset.diskPath &&
    (await pathExists(finalDiskPath))
  ) {
    throw new PublishTargetExistsError([finalDiskPath], projectRoot);
  }

  await atomicWriteFile(finalDiskPath, bytes);

  return {
    ...asset,
    diskPath: finalDiskPath,
    publicPath: publicPathFromDiskPath(finalDiskPath, projectRoot),
    byteLength: bytes.byteLength,
    contentType,
  };
}

async function atomicWriteFile(
  path: string,
  data: string | Uint8Array,
): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  const temporaryPath = `${path}.tmp-${process.pid}-${Date.now()}`;

  try {
    await writeFile(temporaryPath, data);
    await rename(temporaryPath, path);
  } catch (error) {
    await rm(temporaryPath, { force: true }).catch(() => undefined);
    throw error;
  }
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function normalizePlanOptions(
  options: BuildPublishPlanOptions,
): Required<
  Pick<BuildPublishPlanOptions, "noAssets" | "country" | "featured">
> & {
  projectRoot: string;
  sourceFile: string | null;
  description: string | null;
} {
  const projectRoot = resolve(options.projectRoot ?? process.cwd());
  return {
    projectRoot,
    sourceFile: options.sourceFile ? resolve(options.sourceFile) : null,
    noAssets: options.noAssets ?? false,
    country: sanitizeCountryCode(options.country ?? DEFAULT_COUNTRY),
    featured: options.featured ?? false,
    description: normalizeDescription(options.description),
  };
}

function normalizePublishOptions(options: PublishReviewedOptions): {
  projectRoot: string;
  sourceFile: string | null;
  force: boolean;
  noAssets: boolean;
  country: string;
  featured: boolean;
  description: string | null;
  fetch: typeof globalThis.fetch;
  onProgress: ((event: PublishProgressEvent) => void) | undefined;
} {
  const planOptions = normalizePlanOptions(options);
  const fetchImplementation = options.fetch ?? globalThis.fetch;

  if (typeof fetchImplementation !== "function") {
    throw new Error(
      "No fetch implementation is available for downloading publish assets.",
    );
  }

  return {
    ...planOptions,
    force: options.force ?? false,
    fetch: fetchImplementation,
    onProgress: options.onProgress,
  };
}

function requireIsoDate(value: string | null): string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(
      `Cannot publish without a valid DOMA date (YYYY-MM-DD). Received: ${String(value)}`,
    );
  }
  return value;
}

function chooseTitle(reviewed: ReviewedDomaCompetition): string {
  const competition = reviewed.competition;
  const candidates = [
    competition.eventor?.title,
    competition.eventorMatch?.title,
    competition.doma.title,
  ];
  const title = candidates.find((value) => value?.trim())?.trim();

  if (!title) {
    throw new Error("Cannot publish without a competition title.");
  }
  return title;
}

function collectPublishWarnings(
  reviewed: ReviewedDomaCompetition,
): string[] {
  const warnings = [...reviewed.competition.warnings];

  if (!reviewed.competition.doma.blankMapImageUrl) {
    warnings.push("DOMA saknar URL till blank karta; mapImage blir null.");
  }
  if (!reviewed.competition.doma.routeMapImageUrl) {
    warnings.push("DOMA saknar URL till vägvalskarta; routeImage blir null.");
  }
  if (!reviewed.competition.doma.kmlUrl) {
    warnings.push("DOMA saknar KML/GPX-URL; gpsFile blir null.");
  }
  if (
    !reviewed.competition.location?.trim() &&
    !reviewed.competition.eventor?.location?.trim()
  ) {
    warnings.push("Plats saknas; location blir en tom sträng.");
  }
  if (
    reviewed.competition.latitude === null ||
    reviewed.competition.longitude === null
  ) {
    warnings.push("DOMA saknar kartcentrum; latitude/longitude blir null.");
  }
  if (!reviewed.competition.result.raceClass?.trim()) {
    warnings.push("Resultatet saknar klass; raceClass blir null.");
  }

  return warnings;
}

function createAssetPlan(
  kind: AssetKind,
  sourceUrl: string | null,
  directory: string,
  fileStem: string,
  fallbackExtension: string,
  projectRoot: string,
): AssetPlan | null {
  const normalizedUrl = normalizeHttpUrl(sourceUrl);
  if (!normalizedUrl) return null;

  const extension = extensionFromUrl(normalizedUrl, fallbackExtension);
  const diskPath = join(directory, `${fileStem}${extension}`);

  return {
    kind,
    sourceUrl: normalizedUrl,
    diskPath,
    publicPath: publicPathFromDiskPath(diskPath, projectRoot),
  };
}

function buildDescription(
  reviewed: ReviewedDomaCompetition,
  title: string,
  customDescription: string | null,
): string {
  if (customDescription) return customDescription;

  const result = reviewed.competition.result;
  const position = parseInteger(result.position);
  const starters = parseInteger(result.starters);
  const mistakeSeconds = durationToSeconds(result.totalMistakeTime) ?? 0;
  const parts: string[] = [];

  if (position !== null && starters !== null) {
    parts.push(`${position}:a av ${starters} i ${title}.`);
  } else if (position !== null) {
    parts.push(`Placering ${position} i ${title}.`);
  } else {
    parts.push(`${title}.`);
  }

  if (mistakeSeconds === 0) {
    parts.push("Ingen registrerad bomtid.");
  } else {
    parts.push(
      `Registrerad bomtid: ${formatSecondsSwedish(mistakeSeconds)}.`,
    );
  }

  return parts.join(" ");
}

function parseInteger(value: string | null | undefined): number | null {
  if (!value) return null;
  const match = value.replace(/\s/g, "").match(/-?\d+/);
  if (!match) return null;
  const parsed = Number.parseInt(match[0], 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeHttpUrl(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;

  try {
    const url = new URL(value.trim());
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
  } catch {
    // The validator reports malformed URLs. Publishing omits them here.
  }

  return null;
}

function extensionFromUrl(url: string, fallback: string): string {
  try {
    const parsed = new URL(url);
    const format = parsed.searchParams.get("format")?.trim().toLowerCase();

    // DOMA exposes tracks through export_kml.php?format=kml. The pathname's
    // .php suffix describes the endpoint, not the downloaded file.
    if (format === "kml") return ".kml";
    if (format === "gpx") return ".gpx";

    const extension = extname(parsed.pathname).toLowerCase();
    if (/^\.(?:jpe?g|png|webp|gif|kml|gpx)$/.test(extension)) {
      return extension === ".jpeg" ? ".jpg" : extension;
    }
  } catch {
    // Use fallback.
  }

  return fallback;
}

function extensionFromContentType(
  contentType: string | null,
  fallback: string,
): string {
  const normalized = contentType?.split(";", 1)[0]?.trim().toLowerCase();
  const mappings: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "application/gpx+xml": ".gpx",
    "application/vnd.google-earth.kml+xml": ".kml",
    "application/xml": fallback,
    "text/xml": fallback,
  };

  return (normalized && mappings[normalized]) || fallback;
}

function replaceExtension(
  path: string,
  currentExtension: string,
  nextExtension: string,
): string {
  if (currentExtension === nextExtension) return path;
  if (!currentExtension) return `${path}${nextExtension}`;
  return path.slice(0, -currentExtension.length) + nextExtension;
}

function publicPathFromDiskPath(
  diskPath: string,
  projectRoot: string,
): string {
  const publicRoot = resolve(projectRoot, "public");
  const absolute = resolve(diskPath);
  const relativePath = relative(publicRoot, absolute).replaceAll("\\", "/");

  if (
    relativePath === ".." ||
    relativePath.startsWith("../") ||
    relativePath.startsWith("/")
  ) {
    throw new Error(`Asset path is outside public/: ${diskPath}`);
  }

  return `/${relativePath}`;
}

function normalizeDescription(
  value: string | null | undefined,
): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function yamlString(value: string): string {
  return JSON.stringify(value);
}

function yamlNullableString(value: string | null | undefined): string {
  const normalized = value?.trim();
  return normalized ? yamlString(normalized) : "null";
}

function yamlNullableNumber(value: number | null | undefined): string {
  return typeof value === "number" && Number.isFinite(value)
    ? String(value)
    : "null";
}

function formatValidationWarning(issue: ValidationIssueLike): string {
  const suffix = issue.path ? ` (${issue.path})` : "";
  return `${issue.code}: ${issue.message}${suffix}`;
}

function formatValidationErrorMessage(issues: ValidationIssueLike[]): string {
  const details = issues
    .map((issue) => {
      const suffix = issue.path ? ` (${issue.path})` : "";
      return `  - ${issue.code}: ${issue.message}${suffix}`;
    })
    .join("\n");

  return details
    ? `Publish aborted: validation failed.\n${details}`
    : "Publish aborted: validation failed.";
}