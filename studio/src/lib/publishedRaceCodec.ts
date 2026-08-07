import type {
  PublishedRaceFields,
  PublishedRaceSummary,
} from "@/types/published";

const FIELD_ORDER = [
  "title",
  "event",
  "date",
  "club",
  "country",
  "location",
  "discipline",
  "raceClass",
  "distanceKm",
  "gpsDistanceKm",
  "gpsClimb",
  "time",
  "position",
  "starters",
  "controls",
  "mistakeSeconds",
  "mapImage",
  "routeImage",
  "thumbnailImage",
  "mapPdf",
  "gpsFile",
  "latitude",
  "longitude",
  "livelox",
  "winsplits",
  "results",
  "featured",
] as const;

type FieldName = (typeof FIELD_ORDER)[number];

export type ParsedPublishedMarkdown = {
  frontmatter: Record<string, unknown>;
  body: string;
  frontmatterLines: string[];
};

function parseScalar(rawValue: string): unknown {
  const value = rawValue.trim();

  if (value === "null" || value === "~") return null;
  if (value === "true") return true;
  if (value === "false") return false;

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    if (value.startsWith('"')) {
      try {
        return JSON.parse(value);
      } catch {
        return value.slice(1, -1);
      }
    }

    return value.slice(1, -1).replace(/''/g, "'");
  }

  if (/^-?\d+(?:\.\d+)?$/.test(value)) {
    const number = Number(value);
    return Number.isFinite(number) ? number : value;
  }

  return value;
}

export function parsePublishedMarkdown(
  content: string,
): ParsedPublishedMarkdown {
  const normalized = content.replace(/\r\n/g, "\n");

  if (!normalized.startsWith("---\n")) {
    throw new Error("Markdown-filen saknar YAML-frontmatter.");
  }

  const endIndex = normalized.indexOf("\n---", 4);

  if (endIndex < 0) {
    throw new Error("Markdown-filens frontmatter är inte avslutad.");
  }

  const frontmatterText = normalized.slice(4, endIndex);
  const bodyStart = endIndex + 4;
  const body = normalized.slice(bodyStart).replace(/^\n/, "");
  const frontmatterLines = frontmatterText.split("\n");
  const frontmatter: Record<string, unknown> = {};

  for (const line of frontmatterLines) {
    const match = /^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/.exec(line);

    if (!match) continue;

    frontmatter[match[1]] = parseScalar(match[2]);
  }

  return { frontmatter, body, frontmatterLines };
}

function asString(value: unknown): string {
  return typeof value === "string"
    ? value
    : value === null || value === undefined
      ? ""
      : String(value);
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function asBoolean(value: unknown): boolean {
  return value === true || value === "true";
}

export function publishedFieldsFromFrontmatter(
  frontmatter: Record<string, unknown>,
): PublishedRaceFields {
  return {
    title: asString(frontmatter.title),
    event: asString(frontmatter.event),
    date: asString(frontmatter.date),
    club: asString(frontmatter.club),
    country: asString(frontmatter.country),
    location: asString(frontmatter.location),
    discipline: asString(frontmatter.discipline),
    raceClass: asString(frontmatter.raceClass),
    distanceKm: asNumber(frontmatter.distanceKm),
    gpsDistanceKm: asNumber(frontmatter.gpsDistanceKm),
    gpsClimb: asNumber(frontmatter.gpsClimb),
    time: asString(frontmatter.time),
    position: asNumber(frontmatter.position),
    starters: asNumber(frontmatter.starters),
    controls: asNumber(frontmatter.controls),
    mistakeSeconds: asNumber(frontmatter.mistakeSeconds),
    mapImage: asString(frontmatter.mapImage),
    routeImage: asString(frontmatter.routeImage),
    thumbnailImage: asString(frontmatter.thumbnailImage),
    mapPdf: asString(frontmatter.mapPdf),
    gpsFile: asString(frontmatter.gpsFile),
    latitude: asNumber(frontmatter.latitude),
    longitude: asNumber(frontmatter.longitude),
    livelox: asString(frontmatter.livelox),
    winsplits: asString(frontmatter.winsplits),
    results: asString(frontmatter.results),
    featured: asBoolean(frontmatter.featured),
  };
}

function quoteYaml(value: string): string {
  return JSON.stringify(value);
}

function serializeValue(
  field: FieldName,
  value: PublishedRaceFields[FieldName],
): string | null {
  if (field === "featured") {
    return value === true ? "true" : "false";
  }

  if (
    field === "distanceKm" ||
    field === "gpsDistanceKm" ||
    field === "gpsClimb" ||
    field === "position" ||
    field === "starters" ||
    field === "controls" ||
    field === "mistakeSeconds" ||
    field === "latitude" ||
    field === "longitude"
  ) {
    return typeof value === "number" && Number.isFinite(value)
      ? String(value)
      : null;
  }

  const text = typeof value === "string" ? value.trim() : "";
  return text ? quoteYaml(text) : null;
}

function updateFrontmatter(
  originalLines: string[],
  fields: PublishedRaceFields,
): string[] {
  const replacements = new Map<FieldName, string | null>(
    FIELD_ORDER.map((field) => [
      field,
      serializeValue(field, fields[field]),
    ]),
  );
  const seen = new Set<FieldName>();
  const output: string[] = [];

  for (const line of originalLines) {
    const match = /^([A-Za-z][A-Za-z0-9_-]*):/.exec(line);
    const field = match?.[1] as FieldName | undefined;

    if (!field || !replacements.has(field)) {
      output.push(line);
      continue;
    }

    seen.add(field);
    const serialized = replacements.get(field);

    if (serialized !== null) {
      output.push(`${field}: ${serialized}`);
    }
  }

  for (const field of FIELD_ORDER) {
    if (seen.has(field)) continue;

    const serialized = replacements.get(field);
    if (serialized !== null) {
      output.push(`${field}: ${serialized}`);
    }
  }

  return output;
}

export function validatePublishedFields(
  fields: PublishedRaceFields,
): string[] {
  const errors: string[] = [];

  if (!fields.title.trim()) errors.push("Titel måste anges.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fields.date)) {
    errors.push("Datum måste anges som ÅÅÅÅ-MM-DD.");
  }
  if (!fields.club.trim()) errors.push("Klubb/arrangör måste anges.");
  if (!/^[A-Za-z]{2}$/.test(fields.country.trim())) {
    errors.push("Land måste vara en tvåställig landskod.");
  }
  if (!fields.location.trim()) errors.push("Plats måste anges.");
  if (!fields.discipline.trim()) errors.push("Disciplin måste anges.");
  if (!fields.raceClass.trim()) errors.push("Klass måste anges.");
  if (fields.distanceKm === null || fields.distanceKm < 0) {
    errors.push("Banlängd måste vara ett tal som är 0 eller större.");
  }
  if (!fields.time.trim()) errors.push("Tid måste anges.");
  if (
    fields.position === null ||
    !Number.isInteger(fields.position) ||
    fields.position < 1
  ) {
    errors.push("Placering måste vara ett heltal som är minst 1.");
  }

  for (const [label, value] of [
    ["GPS-distans", fields.gpsDistanceKm],
    ["GPS-stigning", fields.gpsClimb],
    ["Startande", fields.starters],
    ["Kontroller", fields.controls],
    ["Bomtid", fields.mistakeSeconds],
  ] as const) {
    if (value !== null && value < 0) {
      errors.push(`${label} kan inte vara negativt.`);
    }
  }

  if (
    fields.latitude !== null &&
    (fields.latitude < -90 || fields.latitude > 90)
  ) {
    errors.push("Latitud måste vara mellan -90 och 90.");
  }

  if (
    fields.longitude !== null &&
    (fields.longitude < -180 || fields.longitude > 180)
  ) {
    errors.push("Longitud måste vara mellan -180 och 180.");
  }

  for (const [label, value] of [
    ["Livelox", fields.livelox],
    ["WinSplits", fields.winsplits],
    ["Resultat", fields.results],
  ] as const) {
    if (!value.trim()) continue;

    try {
      const url = new URL(value);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        errors.push(`${label}-länken måste vara en http- eller https-URL.`);
      }
    } catch {
      errors.push(`${label}-länken är ogiltig.`);
    }
  }

  return errors;
}

export function serializePublishedMarkdown(
  originalContent: string,
  fields: PublishedRaceFields,
  body: string,
): string {
  const errors = validatePublishedFields(fields);

  if (errors.length > 0) {
    const error = new Error("Tävlingsuppgifterna är ogiltiga.");
    Object.assign(error, { validationErrors: errors });
    throw error;
  }

  const parsed = parsePublishedMarkdown(originalContent);
  const updatedFrontmatter = updateFrontmatter(parsed.frontmatterLines, {
    ...fields,
    country: fields.country.trim().toUpperCase(),
  });
  const normalizedBody = body
    .replace(/\r\n/g, "\n")
    .replace(/^\n+/, "");

  return `---\n${updatedFrontmatter.join("\n")}\n---\n\n${normalizedBody}`;
}

export function publishedSummaryFromContent(
  id: string,
  content: string,
): PublishedRaceSummary {
  const parsed = parsePublishedMarkdown(content);
  const fields = publishedFieldsFromFrontmatter(parsed.frontmatter);

  return {
    id,
    title: fields.title,
    date: fields.date,
    discipline: fields.discipline,
    country: fields.country,
    location: fields.location,
  };
}

export function normalizePublishedRaceId(id: string): string {
  const normalized = id
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "")
    .replace(/\.md$/i, "");

  if (
    !normalized ||
    normalized.split("/").some((part) => part === ".." || part === ".")
  ) {
    throw new Error("Ogiltigt tävlings-ID.");
  }

  return normalized;
}

export function publishedRaceRepositoryPath(id: string): string {
  return `src/content/races/${normalizePublishedRaceId(id)}.md`;
}

export function publishedRacePublicUrl(id: string): string {
  const base =
    process.env.KARTARKIV_PUBLIC_URL?.trim().replace(/\/+$/, "") ||
    "https://kartarkiv.erik-martinsson.se";

  return `${base}/races/${normalizePublishedRaceId(id)}/`;
}
