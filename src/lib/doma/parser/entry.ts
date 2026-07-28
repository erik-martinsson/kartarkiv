import * as cheerio from "cheerio";
import type {
  DomaCompetition,
  DomaLink,
  DomaLinkKind,
} from "../types";

type CheerioRoot = ReturnType<typeof cheerio.load>;

const FIELD_ALIASES: Record<string, string[]> = {
  title: [
    "namn",
    "titel",
    "name",
    "event",
    "competition",
    "tävling",
  ],
  date: [
    "datum",
    "date",
  ],
  category: [
    "kategori",
    "category",
  ],
  organiser: [
    "arrangör",
    "arrangor",
    "organiser",
    "organizer",
    "club",
    "klubb",
  ],
  country: [
    "land",
    "country",
  ],
  discipline: [
    "disciplin",
    "discipline",
  ],
  mapName: [
    "karta",
    "kartnamn",
    "map",
    "map name",
  ],
  comment: [
    "kommentar",
    "comment",
    "comments",
    "anteckning",
    "notes",
  ],
  runningTime: [
    "tid",
    "löptid",
    "loptid",
    "running time",
    "time",
  ],
  runningDistance: [
    "distans",
    "sträcka",
    "stracka",
    "löpt sträcka",
    "lopt stracka",
    "running distance",
    "distance",
  ],
};

function normalizeText(
  value: string | null | undefined,
): string {
  return (value ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeKey(value: string): string {
  return normalizeText(value)
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .toLocaleLowerCase("sv-SE")
    .replace(/[:：]\s*$/u, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveUrl(
  value: string | undefined,
  baseUrl: string,
): string | null {
  if (!value) {
    return null;
  }

  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return null;
  }
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function extractMapId(sourceUrl: string): number {
  const url = new URL(sourceUrl);

  const raw =
    url.searchParams.get("map") ??
    url.searchParams.get("mapID") ??
    url.searchParams.get("mapId") ??
    url.searchParams.get("mapid");

  if (!raw || !/^\d+$/.test(raw)) {
    throw new Error(
      `Kunde inte hitta ett numeriskt map-ID i ${sourceUrl}.`,
    );
  }

  return Number(raw);
}

function collectRawFields(
  $: CheerioRoot,
): Record<string, string> {
  const fields: Record<string, string> = {};

  const add = (
    rawLabel: string,
    rawValue: string,
  ): void => {
    const label = normalizeKey(rawLabel);
    const value = normalizeText(rawValue);

    if (
      !label ||
      !value ||
      label === value ||
      value.length > 4_000
    ) {
      return;
    }

    if (!fields[label]) {
      fields[label] = value;
    }
  };

  $("tr").each((_index, row) => {
    const cells = $(row)
      .children("th, td")
      .toArray();

    if (cells.length < 2) {
      return;
    }

    add(
      $(cells[0]).text(),
      $(cells.slice(1)).text(),
    );
  });

  $("dt").each((_index, element) => {
    const value = $(element).next("dd").first();

    if (value.length > 0) {
      add($(element).text(), value.text());
    }
  });

  $(
    ".label, .field-label, .caption, " +
      "[class*='label'], [class*='caption']",
  ).each((_index, element) => {
    const label = $(element).text();
    const value =
      $(element).next().first().text() ||
      $(element).parent().text().replace(label, "");

    add(label, value);
  });

  $("p, li, div").each((_index, element) => {
    const ownText = normalizeText(
      $(element)
        .clone()
        .children()
        .remove()
        .end()
        .text(),
    );

    const match = ownText.match(
      /^([^:：]{2,40})[:：]\s*(.+)$/u,
    );

    if (match) {
      add(match[1], match[2]);
    }
  });

  return fields;
}

function findField(
  fields: Record<string, string>,
  name: keyof typeof FIELD_ALIASES,
): string | null {
  const aliases = FIELD_ALIASES[name].map(normalizeKey);

  for (const alias of aliases) {
    if (fields[alias]) {
      return fields[alias];
    }
  }

  for (const [key, value] of Object.entries(fields)) {
    if (
      aliases.some(
        (alias) =>
          key.startsWith(`${alias} `) ||
          key.endsWith(` ${alias}`),
      )
    ) {
      return value;
    }
  }

  return null;
}

function parseDate(
  value: string | null,
  bodyText: string,
): string | null {
  const candidates = [
    value,
    bodyText.match(
      /\b(20\d{2}|19\d{2})[-/.](\d{1,2})[-/.](\d{1,2})\b/,
    )?.[0],
    bodyText.match(
      /\b(\d{1,2})[-/.](\d{1,2})[-/.](20\d{2}|19\d{2})\b/,
    )?.[0],
  ].filter((item): item is string => Boolean(item));

  for (const candidate of candidates) {
    const ymd = candidate.match(
      /\b(20\d{2}|19\d{2})[-/.](\d{1,2})[-/.](\d{1,2})\b/,
    );

    if (ymd) {
      return [
        ymd[1],
        ymd[2].padStart(2, "0"),
        ymd[3].padStart(2, "0"),
      ].join("-");
    }

    const dmy = candidate.match(
      /\b(\d{1,2})[-/.](\d{1,2})[-/.](20\d{2}|19\d{2})\b/,
    );

    if (dmy) {
      return [
        dmy[3],
        dmy[2].padStart(2, "0"),
        dmy[1].padStart(2, "0"),
      ].join("-");
    }
  }

  return null;
}

function parseDistanceKm(
  value: string | null,
): number | null {
  if (!value) {
    return null;
  }

  const normalized = value
    .replace(/\s+/g, "")
    .replace(",", ".");

  const match = normalized.match(
    /(\d+(?:\.\d+)?)\s*(km|m)?/i,
  );

  if (!match) {
    return null;
  }

  const amount = Number(match[1]);

  if (!Number.isFinite(amount)) {
    return null;
  }

  return match[2]?.toLowerCase() === "m"
    ? amount / 1_000
    : amount;
}

function classifyLink(
  url: string,
  text: string,
  sourceUrl: string,
): DomaLinkKind {
  const haystack =
    `${url} ${text}`.toLowerCase();

  if (haystack.includes("winsplits")) {
    return "winsplits";
  }

  if (
    haystack.includes("eventor.orienteering.org") ||
    haystack.includes("eventor")
  ) {
    return "eventor";
  }

  if (haystack.includes("livelox")) {
    return "livelox";
  }

  if (
    /\.kml(?:$|[?#])/i.test(url) ||
    haystack.includes("kml")
  ) {
    return "kml";
  }

  if (isImageUrl(url)) {
    return looksLikeRouteImage(url, text)
      ? "route-image"
      : "map-image";
  }

  return new URL(url).origin ===
    new URL(sourceUrl).origin
    ? "internal"
    : "external";
}

function collectLinks(
  $: CheerioRoot,
  sourceUrl: string,
): DomaLink[] {
  const links: DomaLink[] = [];
  const seen = new Set<string>();

  $("a[href]").each((_index, element) => {
    const url = resolveUrl(
      $(element).attr("href"),
      sourceUrl,
    );

    if (!url || seen.has(url)) {
      return;
    }

    seen.add(url);

    const text =
      normalizeText($(element).text()) ||
      normalizeText($(element).attr("title")) ||
      normalizeText(
        $(element).find("img").attr("alt"),
      );

    links.push({
      text,
      url,
      kind: classifyLink(url, text, sourceUrl),
    });
  });

  return links;
}

function isImageUrl(url: string): boolean {
  try {
    return /\.(?:jpe?g|png|gif|webp)(?:$|[?#])/i.test(
      new URL(url).pathname,
    );
  } catch {
    return false;
  }
}

function looksLikeThumbnail(url: string): boolean {
  return /(?:thumbnail|thumb|small|mini)/i.test(url);
}

function looksLikeRouteImage(
  url: string,
  text = "",
): boolean {
  return /(?:route|routes|rutt|vägval|vagval|gps|overlay)/i.test(
    `${url} ${text}`,
  );
}

function scoreImage(
  url: string,
  text: string,
  mapId: number,
  routeWanted: boolean,
): number {
  let score = 0;
  const haystack = `${url} ${text}`.toLowerCase();

  if (haystack.includes(String(mapId))) {
    score += 5;
  }

  if (isImageUrl(url)) {
    score += 3;
  }

  const route = looksLikeRouteImage(url, text);

  if (route === routeWanted) {
    score += 5;
  } else {
    score -= 4;
  }

  if (looksLikeThumbnail(url)) {
    score -= 6;
  }

  if (
    /(?:logo|icon|flag|button|blank|pixel|spacer)/i.test(
      haystack,
    )
  ) {
    score -= 10;
  }

  return score;
}

function collectImageCandidates(
  $: CheerioRoot,
  links: DomaLink[],
  sourceUrl: string,
): Array<{ url: string; text: string }> {
  const candidates: Array<{
    url: string;
    text: string;
  }> = [];

  for (const link of links) {
    if (isImageUrl(link.url)) {
      candidates.push({
        url: link.url,
        text: link.text,
      });
    }
  }

  $("img[src]").each((_index, element) => {
    const url = resolveUrl(
      $(element).attr("src"),
      sourceUrl,
    );

    if (!url) {
      return;
    }

    candidates.push({
      url,
      text: [
        $(element).attr("alt"),
        $(element).attr("title"),
        $(element).parent("a").attr("title"),
      ]
        .map(normalizeText)
        .filter(Boolean)
        .join(" "),
    });
  });

  const seen = new Set<string>();

  return candidates.filter((candidate) => {
    if (seen.has(candidate.url)) {
      return false;
    }

    seen.add(candidate.url);
    return true;
  });
}

function pickImage(
  candidates: Array<{
    url: string;
    text: string;
  }>,
  mapId: number,
  routeWanted: boolean,
): string | null {
  const ranked = candidates
    .map((candidate) => ({
      ...candidate,
      score: scoreImage(
        candidate.url,
        candidate.text,
        mapId,
        routeWanted,
      ),
    }))
    .filter((candidate) => candidate.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score,
    );

  return ranked[0]?.url ?? null;
}

function findFirstLink(
  links: DomaLink[],
  kind: DomaLinkKind,
): string | null {
  return (
    links.find((link) => link.kind === kind)
      ?.url ?? null
  );
}

function findTitle(
  $: CheerioRoot,
  fields: Record<string, string>,
): string | null {
  const fromField = findField(fields, "title");

  if (fromField) {
    return fromField;
  }

  const selectors = [
    "h1",
    "h2",
    ".map-title",
    ".mapTitle",
    "#map-title",
    "#mapTitle",
    "title",
  ];

  for (const selector of selectors) {
    const value = normalizeText(
      $(selector).first().text(),
    );

    if (
      value &&
      !/digitala kartarkiv|digital orienteering map archive/i.test(
        value,
      )
    ) {
      return value;
    }
  }

  return null;
}

function findComment(
  $: CheerioRoot,
  fields: Record<string, string>,
): string | null {
  const fromField = findField(fields, "comment");

  if (fromField) {
    return fromField;
  }

  const selectors = [
    "#comment",
    ".comment",
    "#comments",
    ".comments",
    ".map-comment",
    ".mapComment",
  ];

  for (const selector of selectors) {
    const value = normalizeText(
      $(selector).first().text(),
    );

    if (value) {
      return value;
    }
  }

  return null;
}

export function parseDomaCompetition(
  html: string,
  sourceUrl: string,
): DomaCompetition {
  const $ = cheerio.load(html);
  const mapId = extractMapId(sourceUrl);
  const bodyText = normalizeText($("body").text());
  const rawFields = collectRawFields($);
  const links = collectLinks($, sourceUrl);

  const imageCandidates =
    collectImageCandidates($, links, sourceUrl);

  const thumbnailUrl =
    imageCandidates.find((candidate) =>
      looksLikeThumbnail(candidate.url),
    )?.url ?? null;

  const mapImageUrl = pickImage(
    imageCandidates,
    mapId,
    false,
  );

  const routedMapImageUrl = pickImage(
    imageCandidates,
    mapId,
    true,
  );

  const winsplitsUrl =
    findFirstLink(links, "winsplits");

  const eventorUrl =
    findFirstLink(links, "eventor");

  const liveloxUrl =
    findFirstLink(links, "livelox");

  const kmlUrl =
    findFirstLink(links, "kml");

  const resultUrl =
    winsplitsUrl ??
    eventorUrl ??
    links.find((link) =>
      /resultat|results?/i.test(link.text),
    )?.url ??
    null;

  const warnings: string[] = [];

  if (!mapImageUrl) {
    warnings.push("Kartbild kunde inte identifieras.");
  }

  if (!routedMapImageUrl) {
    warnings.push(
      "Kartbild med rutt kunde inte identifieras.",
    );
  }

  if (!findTitle($, rawFields)) {
    warnings.push("Titel kunde inte identifieras.");
  }

  const date = parseDate(
    findField(rawFields, "date"),
    bodyText,
  );

  if (!date) {
    warnings.push("Datum kunde inte identifieras.");
  }

  return {
    mapId,
    sourceUrl,

    title: findTitle($, rawFields),
    date,
    category: findField(rawFields, "category"),
    organiser: findField(rawFields, "organiser"),
    country: findField(rawFields, "country"),
    discipline: findField(rawFields, "discipline"),
    mapName: findField(rawFields, "mapName"),

    comment: findComment($, rawFields),
    runningTime:
      findField(rawFields, "runningTime"),
    runningDistanceKm: parseDistanceKm(
      findField(rawFields, "runningDistance"),
    ),

    mapImageUrl,
    routedMapImageUrl:
      routedMapImageUrl === mapImageUrl
        ? null
        : routedMapImageUrl,
    thumbnailUrl,
    kmlUrl,

    resultUrl,
    winsplitsUrl,
    eventorUrl,
    liveloxUrl,

    links,
    warnings: unique(warnings),
    rawFields,
    rawHtml: html,
  };
}
