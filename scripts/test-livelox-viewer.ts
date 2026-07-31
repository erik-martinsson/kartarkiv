/**
 * Inspect a public Livelox Viewer page with Playwright and collect
 * coordinate-like values from network responses and browser globals.
 *
 * Usage:
 *   npx tsx scripts/test-livelox-viewer.ts 367
 *
 * Output:
 *   migration/test/doma-<mapId>/debug-livelox-viewer-network.json
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { chromium, type Response } from "playwright";

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
  url?: string;
  context?: string;
};

type NetworkRecord = {
  url: string;
  status: number;
  contentType: string | null;
  byteLength: number | null;
  coordinateCount: number;
  error?: string;
};

function usage(): never {
  console.error(
    "Usage: npx tsx scripts/test-livelox-viewer.ts <DOMA map-ID>",
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

function addPair(
  pairs: CoordinatePair[],
  latitude: number,
  longitude: number,
  source: string,
  url?: string,
  context?: string,
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
      ...(url ? { url } : {}),
      ...(context ? { context } : {}),
    });
  }
}

function collectNamedCoordinates(
  value: unknown,
  pairs: CoordinatePair[],
  source: string,
  url?: string,
  trail = "$",
): void {
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      collectNamedCoordinates(
        value[index],
        pairs,
        source,
        url,
        `${trail}[${index}]`,
      );
    }
    return;
  }

  if (
    typeof value !== "object" ||
    value === null
  ) {
    return;
  }

  const object = value as Record<string, unknown>;
  const lowerEntries = Object.entries(object).map(
    ([key, item]) => [key.toLowerCase(), item] as const,
  );

  const latValue =
    lowerEntries.find(([key]) =>
      ["lat", "latitude"].includes(key),
    )?.[1] ?? null;

  const lonValue =
    lowerEntries.find(([key]) =>
      ["lng", "lon", "longitude"].includes(key),
    )?.[1] ?? null;

  const latitude =
    typeof latValue === "number"
      ? latValue
      : typeof latValue === "string"
        ? Number(latValue)
        : NaN;

  const longitude =
    typeof lonValue === "number"
      ? lonValue
      : typeof lonValue === "string"
        ? Number(lonValue)
        : NaN;

  if (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude)
  ) {
    addPair(
      pairs,
      latitude,
      longitude,
      source,
      url,
      trail,
    );
  }

  for (const [key, item] of Object.entries(object)) {
    collectNamedCoordinates(
      item,
      pairs,
      source,
      url,
      `${trail}.${key}`,
    );
  }
}

function collectCoordinatesFromText(
  text: string,
  pairs: CoordinatePair[],
  source: string,
  url?: string,
): void {
  const namedPatterns: Array<{
    regex: RegExp;
    latGroup: number;
    lonGroup: number;
  }> = [
    {
      regex:
        /["']?(?:latitude|lat)["']?\s*[:=]\s*["']?(-?\d+(?:\.\d+)?)["']?[\s\S]{0,160}?["']?(?:longitude|lng|lon)["']?\s*[:=]\s*["']?(-?\d+(?:\.\d+)?)["']?/gi,
      latGroup: 1,
      lonGroup: 2,
    },
    {
      regex:
        /["']?(?:longitude|lng|lon)["']?\s*[:=]\s*["']?(-?\d+(?:\.\d+)?)["']?[\s\S]{0,160}?["']?(?:latitude|lat)["']?\s*[:=]\s*["']?(-?\d+(?:\.\d+)?)["']?/gi,
      latGroup: 2,
      lonGroup: 1,
    },
  ];

  for (const pattern of namedPatterns) {
    for (const match of text.matchAll(pattern.regex)) {
      addPair(
        pairs,
        Number(match[pattern.latGroup]),
        Number(match[pattern.lonGroup]),
        source,
        url,
        match[0].slice(0, 240),
      );
    }
  }

  const swedenLatLon =
    /(?<![\d.])((?:5[5-9]|6\d)(?:\.\d{4,}))\s*[,; ]\s*((?:1\d|2[0-5])(?:\.\d{4,}))(?![\d.])/g;

  for (const match of text.matchAll(swedenLatLon)) {
    addPair(
      pairs,
      Number(match[1]),
      Number(match[2]),
      source,
      url,
      match[0],
    );
  }

  const swedenLonLat =
    /(?<![\d.])((?:1\d|2[0-5])(?:\.\d{4,}))\s*[,; ]\s*((?:5[5-9]|6\d)(?:\.\d{4,}))(?![\d.])/g;

  for (const match of text.matchAll(swedenLonLat)) {
    addPair(
      pairs,
      Number(match[2]),
      Number(match[1]),
      source,
      url,
      match[0],
    );
  }
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
    minLatitude = Math.min(
      minLatitude,
      pair.latitude,
    );
    maxLatitude = Math.max(
      maxLatitude,
      pair.latitude,
    );
    minLongitude = Math.min(
      minLongitude,
      pair.longitude,
    );
    maxLongitude = Math.max(
      maxLongitude,
      pair.longitude,
    );
  }

  return {
    latitude:
      (minLatitude + maxLatitude) / 2,
    longitude:
      (minLongitude + maxLongitude) / 2,
  };
}

async function inspectResponse(
  response: Response,
  pairs: CoordinatePair[],
): Promise<NetworkRecord | null> {
  const request = response.request();

  if (
    !["xhr", "fetch", "document", "script"].includes(
      request.resourceType(),
    )
  ) {
    return null;
  }

  const headers = await response.allHeaders();
  const contentType =
    headers["content-type"] ?? null;

  const record: NetworkRecord = {
    url: response.url(),
    status: response.status(),
    contentType,
    byteLength: null,
    coordinateCount: 0,
  };

  if (!response.ok()) {
    return record;
  }

  try {
    const body = await response.body();
    record.byteLength = body.byteLength;

    if (body.byteLength > 10_000_000) {
      return record;
    }

    const before = pairs.length;
    const text = body.toString("utf8");

    if (
      contentType?.includes("json") ||
      /^[\s\r\n]*[\[{]/.test(text)
    ) {
      try {
        const json = JSON.parse(text);
        collectNamedCoordinates(
          json,
          pairs,
          "network-json",
          response.url(),
        );
      } catch {
        collectCoordinatesFromText(
          text,
          pairs,
          "network-text",
          response.url(),
        );
      }
    } else if (
      contentType?.includes("xml") ||
      contentType?.includes("text") ||
      contentType?.includes("javascript") ||
      request.resourceType() === "script"
    ) {
      collectCoordinatesFromText(
        text,
        pairs,
        "network-text",
        response.url(),
      );
    }

    record.coordinateCount =
      pairs.length - before;
    return record;
  } catch (error) {
    record.error =
      error instanceof Error
        ? error.message
        : String(error);
    return record;
  }
}

async function main(): Promise<void> {
  const mapIdValue = process.argv[2];

  if (
    !mapIdValue ||
    !/^\d+$/.test(mapIdValue)
  ) {
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

  console.log(
    "\n=== Livelox Viewer network inspection ===",
  );
  console.log(
    `DOMA map-ID..............${mapId}`,
  );
  console.log(
    `Titel....................${competition.doma?.title ?? "—"}`,
  );
  console.log(
    `Viewer URL................${viewerUrl}`,
  );

  const browser = await chromium.launch({
    headless: true,
  });

  try {
    const context = await browser.newContext({
      locale: "sv-SE",
      viewport: {
        width: 1440,
        height: 1000,
      },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) " +
        "Chrome/126.0 Safari/537.36",
    });

    const page = await context.newPage();
    const pairs: CoordinatePair[] = [];
    const networkRecords: NetworkRecord[] = [];
    const pending = new Set<Promise<void>>();

    page.on("response", (response) => {
      const task = inspectResponse(
        response,
        pairs,
      )
        .then((record) => {
          if (record) {
            networkRecords.push(record);
          }
        })
        .catch(() => undefined)
        .finally(() => {
          pending.delete(task);
        });

      pending.add(task);
    });

    page.on("console", (message) => {
      const text = message.text();

      if (
        /error|failed|warning/i.test(text)
      ) {
        console.log(
          `[browser ${message.type()}] ${text}`,
        );
      }
    });

    console.log("\nÖppnar Viewer...");
    await page.goto(viewerUrl, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    await page.waitForTimeout(12_000);

    const pageSnapshot = await page.evaluate(() => {
      const selected: Record<string, unknown> = {};

      for (const key of Object.keys(window)) {
        if (
          /livelox|viewer|event|course|control|map/i.test(
            key,
          )
        ) {
          try {
            const value =
              (window as unknown as Record<
                string,
                unknown
              >)[key];

            if (
              value === null ||
              ["string", "number", "boolean"].includes(
                typeof value,
              )
            ) {
              selected[key] = value;
            }
          } catch {
            // Ignore inaccessible browser globals.
          }
        }
      }

      return {
        url: location.href,
        title: document.title,
        selectedGlobals: selected,
        bodyText: document.body.innerText.slice(
          0,
          200_000,
        ),
        html: document.documentElement.outerHTML.slice(
          0,
          1_000_000,
        ),
      };
    });

    collectNamedCoordinates(
      pageSnapshot.selectedGlobals,
      pairs,
      "browser-globals",
      pageSnapshot.url,
    );
    collectCoordinatesFromText(
      pageSnapshot.bodyText,
      pairs,
      "browser-body",
      pageSnapshot.url,
    );
    collectCoordinatesFromText(
      pageSnapshot.html,
      pairs,
      "browser-html",
      pageSnapshot.url,
    );

    await Promise.allSettled([...pending]);

    const center = calculateCenter(pairs);

    const interestingResponses =
      networkRecords
        .filter(
          (record) =>
            record.coordinateCount > 0 ||
            /event|course|control|route|map|viewer|position|coordinate/i.test(
              record.url,
            ),
        )
        .sort(
          (a, b) =>
            b.coordinateCount -
            a.coordinateCount,
        );

    console.log(
      `Slutlig URL................${pageSnapshot.url}`,
    );
    console.log(
      `Sidtitel...................${pageSnapshot.title}`,
    );
    console.log(
      `Nätverkssvar...............${networkRecords.length}`,
    );
    console.log(
      `Intressanta svar............${interestingResponses.length}`,
    );
    console.log(
      `Unika koordinatpar.........${pairs.length}`,
    );

    for (const record of interestingResponses.slice(
      0,
      40,
    )) {
      console.log(
        `- ${record.status} ${record.url}`,
      );
      console.log(
        `  type=${record.contentType ?? "—"}, bytes=${record.byteLength ?? "—"}, coordinates=${record.coordinateCount}`,
      );
    }

    if (pairs.length > 0) {
      console.log("\nKoordinatfynd");

      for (const [index, pair] of pairs
        .slice(0, 30)
        .entries()) {
        console.log(
          `${index + 1}. ${pair.latitude}, ${pair.longitude}`,
        );
        console.log(
          `   Källa: ${pair.source}`,
        );

        if (pair.url) {
          console.log(`   URL: ${pair.url}`);
        }

        if (pair.context) {
          console.log(
            `   Kontext: ${pair.context}`,
          );
        }
      }

      if (center) {
        console.log("\nPreliminärt centrum");
        console.log(
          `Latitude.................${center.latitude}`,
        );
        console.log(
          `Longitude................${center.longitude}`,
        );
      }
    } else {
      console.log(
        "\nInga koordinater hittades i nätverkssvar eller sidans laddade data.",
      );
    }

    await mkdir(competitionDirectory, {
      recursive: true,
    });

    const outputPath = path.join(
      competitionDirectory,
      "debug-livelox-viewer-network.json",
    );

    await writeFile(
      outputPath,
      `${JSON.stringify(
        {
          mapId,
          viewerUrl,
          finalUrl: pageSnapshot.url,
          title: pageSnapshot.title,
          center,
          coordinates: pairs,
          responses: interestingResponses,
          selectedGlobals:
            pageSnapshot.selectedGlobals,
        },
        null,
        2,
      )}\n`,
      "utf8",
    );

    console.log(
      `\nDiagnostik sparad..........${outputPath}`,
    );

    await context.close();
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(
    `\n✖ ${
      error instanceof Error
        ? error.message
        : String(error)
    }`,
  );
  process.exitCode = 1;
});