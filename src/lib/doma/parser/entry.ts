import * as cheerio from "cheerio";
import type {
  DomaCompetition,
  DomaLink,
  DomaLinkKind,
  DomaProperty,
} from "../types";

type CheerioRoot = ReturnType<typeof cheerio.load>;

function normalizeText(
  value: string | null | undefined,
): string {
  return (value ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeCaption(value: string): string {
  return normalizeText(value)
    .replace(/[:：]\s*$/u, "")
    .toLocaleLowerCase("sv-SE");
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

function parsePositiveInteger(
  value: string | null | undefined,
): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isInteger(parsed) && parsed >= 0
    ? parsed
    : null;
}

function parseMapId(
  $: CheerioRoot,
  sourceUrl: string,
): number {
  const fromInput = parsePositiveInteger(
    $("#id").attr("value"),
  );

  if (fromInput !== null) {
    return fromInput;
  }

  const url = new URL(sourceUrl);

  const raw =
    url.searchParams.get("map") ??
    url.searchParams.get("mapID") ??
    url.searchParams.get("mapId") ??
    url.searchParams.get("mapid");

  const fromUrl = parsePositiveInteger(raw);

  if (fromUrl === null) {
    throw new Error(
      `Kunde inte hitta ett numeriskt map-ID i ${sourceUrl}.`,
    );
  }

  return fromUrl;
}

function parseNameAndDate(
  value: string,
): {
  title: string | null;
  date: string | null;
} {
  const normalized = normalizeText(value);

  if (!normalized) {
    return {
      title: null,
      date: null,
    };
  }

  const match = normalized.match(
    /^(.*?)\s*\((\d{4}-\d{2}-\d{2})\)\s*$/u,
  );

  if (!match) {
    return {
      title: normalized,
      date: null,
    };
  }

  return {
    title: normalizeText(match[1]) || null,
    date: match[2],
  };
}

function collectProperties(
  $: CheerioRoot,
  sourceUrl: string,
): DomaProperty[] {
  const properties: DomaProperty[] = [];

  $("#propertyContainer .property").each(
    (_index, element) => {
      const property = $(element);
      const captionElement = property
        .find(".caption")
        .first();

      const caption =
        normalizeText(captionElement.text())
          .replace(/[:：]\s*$/u, "");

      const link = property.find("a[href]").first();
      const url = resolveUrl(
        link.attr("href"),
        sourceUrl,
      );

      const cloned = property.clone();
      cloned.find(".caption").remove();

      const value =
        normalizeText(cloned.text()) || null;

      if (!caption && !value && !url) {
        return;
      }

      properties.push({
        caption:
          caption ||
          normalizeText(link.text()) ||
          "Okänt",
        value,
        url,
      });
    },
  );

  return properties;
}

function firstPropertyValue(
  properties: DomaProperty[],
  caption: string,
): string | null {
  const normalizedCaption =
    normalizeCaption(caption);

  return (
    properties.find(
      (property) =>
        normalizeCaption(property.caption) ===
        normalizedCaption,
    )?.value ?? null
  );
}

function parseRelayLeg(
  properties: DomaProperty[],
): number | null {
  for (const property of properties) {
    if (
      normalizeCaption(property.caption) !==
      "sträcka"
    ) {
      continue;
    }

    const value = property.value;

    if (
      !value ||
      /\b(?:km|m)\b/i.test(value)
    ) {
      continue;
    }

    const match = value.match(/^\d+$/);

    if (match) {
      return Number.parseInt(match[0], 10);
    }
  }

  return null;
}

function parseRunningDistanceKm(
  properties: DomaProperty[],
): number | null {
  for (const property of properties) {
    if (
      normalizeCaption(property.caption) !==
      "sträcka"
    ) {
      continue;
    }

    const value = property.value;

    if (!value) {
      continue;
    }

    const match = value
      .replace(",", ".")
      .match(
        /(\d+(?:\.\d+)?)\s*(km|m)\b/i,
      );

    if (!match) {
      continue;
    }

    const amount = Number(match[1]);

    if (!Number.isFinite(amount)) {
      continue;
    }

    return match[2].toLowerCase() === "m"
      ? amount / 1_000
      : amount;
  }

  return null;
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

  if (haystack.includes("eventor")) {
    return "eventor";
  }

  if (haystack.includes("livelox")) {
    return "livelox";
  }

  if (
    haystack.includes("export_kml.php") ||
    /\.kml(?:$|[?#])/i.test(url)
  ) {
    return "kml";
  }

  if (/\.(?:jpe?g|png|gif|webp)(?:$|[?#])/i.test(url)) {
    return /(?:blank|without|no-route)/i.test(url)
      ? "map-image"
      : "route-image";
  }

  try {
    return new URL(url).origin ===
      new URL(sourceUrl).origin
      ? "internal"
      : "external";
  } catch {
    return "external";
  }
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
      kind: classifyLink(
        url,
        text,
        sourceUrl,
      ),
    });
  });

  return links;
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

function parseMapCenter(
  $: CheerioRoot,
): DomaCompetition["mapCenter"] {
  const raw = normalizeText(
    $("#gmap_coordinates").attr("value"),
  );

  const match = raw.match(
    /^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/,
  );

  if (!match) {
    return null;
  }

  const latitude = Number(match[1]);
  const longitude = Number(match[2]);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  return {
    latitude,
    longitude,
  };
}

function parseComment(
  $: CheerioRoot,
): string | null {
  const comments = $("#postedComments")
    .children()
    .toArray()
    .map((element) =>
      normalizeText($(element).text()),
    )
    .filter(Boolean);

  return comments.length > 0
    ? comments.join("\n\n")
    : null;
}

export function parseDomaCompetition(
  html: string,
  sourceUrl: string,
): DomaCompetition {
  const $ = cheerio.load(html);

  const mapId = parseMapId($, sourceUrl);
  const name = parseNameAndDate(
    $("#name").first().text(),
  );

  const properties = collectProperties(
    $,
    sourceUrl,
  );

  const links = collectLinks($, sourceUrl);

  const routeMapImageUrl = resolveUrl(
    $("#mapImage").attr("src"),
    sourceUrl,
  );

  const blankMapImageUrl = resolveUrl(
    $("#hiddenMapImage").attr("src"),
    sourceUrl,
  );

  const kmlUrl =
    resolveUrl(
      $('a[href*="export_kml.php"]').first().attr("href"),
      sourceUrl,
    ) ??
    findFirstLink(links, "kml");

  const winsplitsUrl =
    findFirstLink(links, "winsplits");

  const eventorUrl =
    findFirstLink(links, "eventor");

  const liveloxUrl =
    findFirstLink(links, "livelox");

  const resultUrl =
    winsplitsUrl ??
    eventorUrl ??
    properties.find(
      (property) =>
        normalizeCaption(property.caption) ===
          "resultat" &&
        property.url,
    )?.url ??
    null;

  const warnings: string[] = [];

  if (!name.title) {
    warnings.push(
      "Titel kunde inte identifieras från #name.",
    );
  }

  if (!name.date) {
    warnings.push(
      "Datum kunde inte identifieras från #name.",
    );
  }

  if (!routeMapImageUrl) {
    warnings.push(
      "Kartbild med vägval saknas (#mapImage).",
    );
  }

  if (!blankMapImageUrl) {
    warnings.push(
      "Blank kartbild saknas (#hiddenMapImage).",
    );
  }

  return {
    mapId,
    sourceUrl,

    title: name.title,
    date: name.date,
    category: firstPropertyValue(
      properties,
      "Kategori",
    ),

    relayLeg: parseRelayLeg(properties),
    runningTime: firstPropertyValue(
      properties,
      "Tid",
    ),
    runningDistanceKm:
      parseRunningDistanceKm(properties),

    comment: parseComment($),

    routeMapImageUrl,
    blankMapImageUrl,
    kmlUrl,

    resultUrl,
    winsplitsUrl,
    eventorUrl,
    liveloxUrl,

    mapCenter: parseMapCenter($),

    imageWidth: parsePositiveInteger(
      $("#imageWidth").attr("value"),
    ),
    imageHeight: parsePositiveInteger(
      $("#imageHeight").attr("value"),
    ),

    properties,
    links,
    warnings,
    rawHtml: html,
  };
}
