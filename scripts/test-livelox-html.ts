/**
 * Inspect a public Livelox Viewer page for embedded coordinates or map metadata.
 *
 * Usage:
 *   npx tsx scripts/test-livelox-html.ts 367
 *
 * The script reads:
 *   migration/test/doma-<mapId>/competition-enriched.json
 *
 * It then downloads the public Livelox Viewer HTML, saves it beside the
 * enriched JSON, and reports coordinate-like values and useful keywords.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type EnrichedCompetition = {
  doma?: {
    mapId?: number;
    title?: string | null;
  };
  eventor?: {
    liveloxUrl?: string | null;
  } | null;
  liveloxUrl?: string | null;
};

type CoordinatePair = {
  latitude: number;
  longitude: number;
  source: string;
  context: string;
};

function usage(): never {
  console.error(
    "Usage: npx tsx scripts/test-livelox-html.ts <DOMA map-ID>",
  );
  process.exit(1);
}

function isValidCoordinate(
  latitude: number,
  longitude: number,
): boolean {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !(latitude === 0 && longitude === 0)
  );
}

function compactContext(
  text: string,
  index: number,
  length: number,
): string {
  const start = Math.max(0, index - 100);
  const end = Math.min(text.length, index + length + 100);

  return text
    .slice(start, end)
    .replace(/\s+/g, " ")
    .trim();
}

function addPair(
  pairs: CoordinatePair[],
  latitude: number,
  longitude: number,
  source: string,
  context: string,
): void {
  if (!isValidCoordinate(latitude, longitude)) {
    return;
  }

  const duplicate = pairs.some(
    (pair) =>
      Math.abs(pair.latitude - latitude) < 0.0000001 &&
      Math.abs(pair.longitude - longitude) < 0.0000001,
  );

  if (!duplicate) {
    pairs.push({
      latitude,
      longitude,
      source,
      context,
    });
  }
}

function findNamedCoordinates(
  html: string,
): CoordinatePair[] {
  const pairs: CoordinatePair[] = [];

  const patterns: Array<{
    name: string;
    regex: RegExp;
    latGroup: number;
    lonGroup: number;
  }> = [
    {
      name: "latitude/longitude",
      regex:
        /["']?(?:latitude|lat)["']?\s*[:=]\s*["']?(-?\d+(?:\.\d+)?)["']?[\s\S]{0,160}?["']?(?:longitude|lng|lon)["']?\s*[:=]\s*["']?(-?\d+(?:\.\d+)?)["']?/gi,
      latGroup: 1,
      lonGroup: 2,
    },
    {
      name: "longitude/latitude",
      regex:
        /["']?(?:longitude|lng|lon)["']?\s*[:=]\s*["']?(-?\d+(?:\.\d+)?)["']?[\s\S]{0,160}?["']?(?:latitude|lat)["']?\s*[:=]\s*["']?(-?\d+(?:\.\d+)?)["']?/gi,
      latGroup: 2,
      lonGroup: 1,
    },
    {
      name: "center array",
      regex:
        /["']?(?:center|mapCenter|centre)["']?\s*[:=]\s*\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]/gi,
      latGroup: 2,
      lonGroup: 1,
    },
    {
      name: "LatLng",
      regex:
        /(?:LatLng|latLng)\s*\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)/gi,
      latGroup: 1,
      lonGroup: 2,
    },
  ];

  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern.regex)) {
      const latitude = Number(match[pattern.latGroup]);
      const longitude = Number(match[pattern.lonGroup]);

      addPair(
        pairs,
        latitude,
        longitude,
        pattern.name,
        compactContext(
          html,
          match.index ?? 0,
          match[0].length,
        ),
      );
    }
  }

  return pairs;
}

function findSwedishNumericPairs(
  html: string,
): CoordinatePair[] {
  const pairs: CoordinatePair[] = [];

  /*
   * Conservative fallback: Swedish latitude is usually 55–69 and longitude
   * roughly 10–25. This avoids treating arbitrary JavaScript numbers as
   * geographic coordinates.
   */
  const regex =
    /(?<![\d.])((?:5[5-9]|6\d)(?:\.\d{4,}))\s*[,; ]\s*((?:1\d|2[0-5])(?:\.\d{4,}))(?![\d.])/g;

  for (const match of html.matchAll(regex)) {
    addPair(
      pairs,
      Number(match[1]),
      Number(match[2]),
      "Swedish numeric pair",
      compactContext(
        html,
        match.index ?? 0,
        match[0].length,
      ),
    );
  }

  const reversedRegex =
    /(?<![\d.])((?:1\d|2[0-5])(?:\.\d{4,}))\s*[,; ]\s*((?:5[5-9]|6\d)(?:\.\d{4,}))(?![\d.])/g;

  for (const match of html.matchAll(reversedRegex)) {
    addPair(
      pairs,
      Number(match[2]),
      Number(match[1]),
      "Swedish numeric pair reversed",
      compactContext(
        html,
        match.index ?? 0,
        match[0].length,
      ),
    );
  }

  return pairs;
}

function mergePairs(
  ...collections: CoordinatePair[][]
): CoordinatePair[] {
  const merged: CoordinatePair[] = [];

  for (const collection of collections) {
    for (const pair of collection) {
      addPair(
        merged,
        pair.latitude,
        pair.longitude,
        pair.source,
        pair.context,
      );
    }
  }

  return merged;
}

function calculateCenter(
  pairs: CoordinatePair[],
): {
  latitude: number;
  longitude: number;
} | null {
  if (pairs.length === 0) {
    return null;
  }

  let minLatitude = Infinity;
  let maxLatitude = -Infinity;
  let minLongitude = Infinity;
  let maxLongitude = -Infinity;

  for (const pair of pairs) {
    minLatitude = Math.min(minLatitude, pair.latitude);
    maxLatitude = Math.max(maxLatitude, pair.latitude);
    minLongitude = Math.min(minLongitude, pair.longitude);
    maxLongitude = Math.max(maxLongitude, pair.longitude);
  }

  return {
    latitude: (minLatitude + maxLatitude) / 2,
    longitude: (minLongitude + maxLongitude) / 2,
  };
}

function keywordReport(
  html: string,
): Array<{
  keyword: string;
  count: number;
  examples: string[];
}> {
  const keywords = [
    "latitude",
    "longitude",
    "mapCenter",
    "center",
    "bounds",
    "GeoJSON",
    "EPSG",
    "projection",
    "eventExternalIdentifier",
    "classExternalId",
    "control",
    "course",
  ];

  return keywords.map((keyword) => {
    const regex = new RegExp(keyword, "gi");
    const matches = [...html.matchAll(regex)];

    return {
      keyword,
      count: matches.length,
      examples: matches.slice(0, 3).map((match) =>
        compactContext(
          html,
          match.index ?? 0,
          match[0].length,
        ),
      ),
    };
  });
}

function readScriptSources(html: string): string[] {
  const sources: string[] = [];

  for (
    const match of html.matchAll(
      /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi,
    )
  ) {
    sources.push(match[1]);
  }

  return [...new Set(sources)];
}

async function main(): Promise<void> {
  const mapIdValue = process.argv[2];

  if (!mapIdValue || !/^\d+$/.test(mapIdValue)) {
    usage();
  }

  const mapId = Number(mapIdValue);
  const competitionDirectory = path.resolve(
    "migration",
    "test",
    `doma-${mapId}`,
  );
  const inputPath = path.join(
    competitionDirectory,
    "competition-enriched.json",
  );

  const competition = JSON.parse(
    await readFile(inputPath, "utf8"),
  ) as EnrichedCompetition;

  const viewerUrl =
    competition.liveloxUrl ??
    competition.eventor?.liveloxUrl ??
    null;

  if (!viewerUrl) {
    throw new Error(
      `DOMA ${mapId} saknar Livelox Viewer-länk.`,
    );
  }

  console.log("\n=== Livelox HTML inspection ===");
  console.log(`DOMA map-ID..............${mapId}`);
  console.log(
    `Titel....................${competition.doma?.title ?? "—"}`,
  );
  console.log(`Viewer URL................${viewerUrl}`);

  const response = await fetch(viewerUrl, {
    redirect: "follow",
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "accept-language": "sv-SE,sv;q=0.9,en;q=0.7",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/126.0 Safari/537.36",
    },
  });

  console.log(
    `HTTP......................${response.status} ${response.statusText}`,
  );
  console.log(
    `Slutlig URL................${response.url}`,
  );

  if (!response.ok) {
    throw new Error(
      `Livelox Viewer kunde inte hämtas: HTTP ${response.status}.`,
    );
  }

  const html = await response.text();

  await mkdir(competitionDirectory, {
    recursive: true,
  });

  const htmlPath = path.join(
    competitionDirectory,
    "debug-livelox-viewer.html",
  );

  await writeFile(htmlPath, html, "utf8");

  console.log(
    `HTML-storlek...............${Buffer.byteLength(html, "utf8")} byte`,
  );
  console.log(`Sparad HTML................${htmlPath}`);

  const namedPairs = findNamedCoordinates(html);
  const numericPairs = findSwedishNumericPairs(html);
  const pairs = mergePairs(namedPairs, numericPairs);
  const center = calculateCenter(pairs);

  console.log("\nKoordinatfynd");
  console.log(
    `Namngivna koordinater......${namedPairs.length}`,
  );
  console.log(
    `Svenska numeriska par......${numericPairs.length}`,
  );
  console.log(
    `Unika koordinatpar.........${pairs.length}`,
  );

  for (const [index, pair] of pairs
    .slice(0, 25)
    .entries()) {
    console.log(
      `\n${index + 1}. ${pair.latitude}, ${pair.longitude}`,
    );
    console.log(`   Källa: ${pair.source}`);
    console.log(`   Kontext: ${pair.context}`);
  }

  if (pairs.length > 25) {
    console.log(
      `\n... ytterligare ${pairs.length - 25} koordinatpar utelämnades.`,
    );
  }

  if (center) {
    console.log("\nPreliminärt centrum");
    console.log(
      `Latitude.................${center.latitude}`,
    );
    console.log(
      `Longitude................${center.longitude}`,
    );
    console.log(
      "OBS.......................Centrumet är endast tillförlitligt om fynden verkligen avser kartan eller kontrollerna.",
    );
  } else {
    console.log(
      "\nInga användbara koordinater hittades direkt i HTML-källan.",
    );
  }

  console.log("\nNyckelord");
  for (const item of keywordReport(html)) {
    console.log(
      `${item.keyword.padEnd(27, ".")}${item.count}`,
    );

    for (const example of item.examples) {
      console.log(`  - ${example}`);
    }
  }

  const scriptSources = readScriptSources(html);

  console.log("\nExterna script");
  console.log(
    `Antal......................${scriptSources.length}`,
  );

  for (const source of scriptSources.slice(0, 30)) {
    console.log(`- ${source}`);
  }

  if (scriptSources.length > 30) {
    console.log(
      `... ytterligare ${scriptSources.length - 30} script utelämnades.`,
    );
  }
}

main().catch((error) => {
  console.error(
    `\n✖ ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exitCode = 1;
});