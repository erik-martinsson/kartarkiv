import type {
  DomaEntryCandidate,
  PageSnapshot,
} from "./types";

export const COMPETITION_CATEGORY_ID = "6";

export function buildCompetitionYearUrl(
  baseUrl: string,
  user: string,
  year: number,
): string {
  const url = new URL(baseUrl);

  url.searchParams.set("user", user);
  url.searchParams.set(
    "categoryID",
    COMPETITION_CATEGORY_ID,
  );
  url.searchParams.set("year", String(year));
  url.searchParams.set("filter", "");
  url.searchParams.set("displayMode", "list");

  return url.toString();
}

function extractMapId(
  url: URL,
): string | null {
  const keys = [
    "map",
    "mapID",
    "mapId",
    "mapid",
  ];

  for (const key of keys) {
    const value = url.searchParams.get(key);

    if (value && /^\d+$/.test(value)) {
      return value;
    }
  }

  const pathMatch = url.pathname.match(
    /(?:show_?map|map)[^0-9]*(\d+)/i,
  );

  return pathMatch?.[1] ?? null;
}

function looksLikeMapEntry(
  url: URL,
): boolean {
  const mapId = extractMapId(url);

  if (!mapId) {
    return false;
  }

  return (
    /show_?map|map\.php|viewmap|showmap/i.test(
      url.pathname,
    ) ||
    url.searchParams.has("map") ||
    url.searchParams.has("mapID") ||
    url.searchParams.has("mapId") ||
    url.searchParams.has("mapid")
  );
}

export function discoverCompetitionEntries(
  snapshot: PageSnapshot,
  year: number,
  user: string,
): DomaEntryCandidate[] {
  const byMapId =
    new Map<string, DomaEntryCandidate>();

  for (const link of snapshot.links) {
    let url: URL;

    try {
      url = new URL(link.href);
    } catch {
      continue;
    }

    if (!looksLikeMapEntry(url)) {
      continue;
    }

    const mapId = extractMapId(url);

    if (!mapId) {
      continue;
    }

    url.hash = "";

    const candidate: DomaEntryCandidate = {
      mapId,
      sourceUrl: url.toString(),
      linkText:
        link.text ||
        link.title ||
        `Karta ${mapId}`,
      year,
    };

    const existing = byMapId.get(mapId);

    if (
      !existing ||
      candidate.linkText.length >
        existing.linkText.length
    ) {
      byMapId.set(mapId, candidate);
    }
  }

  /*
   * DOMA kan visa kartan som en thumbnail utan
   * tydlig textlänk. Då hittar vi kart-ID från
   * exempelvis "356.thumbnail.jpg".
   */
  for (const imageUrlText of snapshot.imageUrls) {
    let imageUrl: URL;

    try {
      imageUrl = new URL(imageUrlText);
    } catch {
      continue;
    }

    const match = imageUrl.pathname.match(
      /\/(\d+)\.thumbnail\.(?:jpe?g|png|gif)$/i,
    );

    const mapId = match?.[1];

    if (!mapId || byMapId.has(mapId)) {
      continue;
    }

    const sourceUrl = new URL(
      "show_map.php",
      snapshot.finalUrl,
    );

    sourceUrl.searchParams.set("user", user);
    sourceUrl.searchParams.set("map", mapId);

    byMapId.set(mapId, {
      mapId,
      sourceUrl: sourceUrl.toString(),
      linkText: `Karta ${mapId}`,
      year,
    });
  }

  return [...byMapId.values()].sort(
    (left, right) =>
      Number(right.mapId) - Number(left.mapId),
  );
}
