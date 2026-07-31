/**
 * Experimental Livelox coordinate test.
 *
 * Usage:
 *   npx tsx scripts/test-livelox.ts 367
 *
 * The script:
 *   1. Reads migration/test/doma-<mapId>/competition-enriched.json
 *   2. Searches the public Livelox events API around the competition date
 *   3. Matches the event by title and, when exposed, Eventor identifiers
 *   4. Downloads public course/control data as IOF XML
 *   5. Calculates a geographic bounding-box centre from control positions
 */

import { readFile } from "node:fs/promises";
import path from "node:path";

type EnrichedCompetition = {
  doma?: {
    mapId?: number;
    title?: string | null;
    date?: string | null;
  };
  eventor?: {
    eventId?: number;
    title?: string;
    liveloxUrl?: string | null;
  } | null;
  eventorMatch?: {
    eventId?: number;
    title?: string;
  } | null;
  liveloxUrl?: string | null;
};

type Coordinate = {
  latitude: number;
  longitude: number;
};

type LiveloxCandidate = {
  id: number;
  name: string;
  raw: Record<string, unknown>;
  score: number;
  reasons: string[];
};

function usage(): never {
  console.error(
    "Usage: npx tsx scripts/test-livelox.ts <DOMA map-ID>",
  );
  process.exit(1);
}

function normalizeText(value: unknown): string {
  return String(value ?? "")
    .toLocaleLowerCase("sv-SE")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function collectObjects(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    return value.flatMap(collectObjects);
  }

  if (!isRecord(value)) {
    return [];
  }

  const nested = Object.values(value).flatMap(collectObjects);
  return [value, ...nested];
}

function firstInteger(
  object: Record<string, unknown>,
  keys: string[],
): number | null {
  for (const key of keys) {
    const value = object[key];
    const number =
      typeof value === "number"
        ? value
        : typeof value === "string"
          ? Number(value)
          : NaN;

    if (Number.isInteger(number) && number > 0) {
      return number;
    }
  }

  return null;
}

function firstString(
  object: Record<string, unknown>,
  keys: string[],
): string {
  for (const key of keys) {
    const value = object[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function extractEventorIdFromViewer(
  viewerUrl: string | null | undefined,
): number | null {
  if (!viewerUrl) {
    return null;
  }

  try {
    const url = new URL(viewerUrl);
    const external =
      url.searchParams.get("eventExternalIdentifier");

    if (!external) {
      return null;
    }

    const match = external.match(/(?:^|:)(\d+)(?:-\d+)?$/);
    return match ? Number(match[1]) : null;
  } catch {
    return null;
  }
}

function addDays(
  isoDate: string,
  days: number,
): string {
  const date = new Date(`${isoDate}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Ogiltigt datum: ${isoDate}`);
  }

  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function deepContainsNumber(
  value: unknown,
  wanted: number,
): boolean {
  if (typeof value === "number") {
    return value === wanted;
  }

  if (typeof value === "string") {
    return new RegExp(
      `(^|[^0-9])${wanted}([^0-9]|$)`,
    ).test(value);
  }

  if (Array.isArray(value)) {
    return value.some((item) =>
      deepContainsNumber(item, wanted),
    );
  }

  if (isRecord(value)) {
    return Object.values(value).some((item) =>
      deepContainsNumber(item, wanted),
    );
  }

  return false;
}

function scoreCandidate(
  candidate: Record<string, unknown>,
  wantedTitle: string,
  eventorId: number | null,
): LiveloxCandidate | null {
  const id = firstInteger(candidate, [
    "id",
    "eventId",
    "eventID",
    "eventIdentifier",
  ]);

  const name = firstString(candidate, [
    "name",
    "title",
    "eventName",
  ]);

  if (!id || !name) {
    return null;
  }

  let score = 0;
  const reasons: string[] = [];
  const normalizedWanted = normalizeText(wantedTitle);
  const normalizedName = normalizeText(name);

  if (normalizedWanted && normalizedName === normalizedWanted) {
    score += 100;
    reasons.push("exakt titel");
  } else if (
    normalizedWanted &&
    (normalizedName.includes(normalizedWanted) ||
      normalizedWanted.includes(normalizedName))
  ) {
    score += 60;
    reasons.push("delvis titel");
  }

  if (
    eventorId !== null &&
    deepContainsNumber(candidate, eventorId)
  ) {
    score += 200;
    reasons.push(`Eventor-ID ${eventorId}`);
  }

  return {
    id,
    name,
    raw: candidate,
    score,
    reasons,
  };
}

function readCoordinatesFromIofXml(
  xml: string,
): Coordinate[] {
  const coordinates: Coordinate[] = [];

  const attributePattern =
    /<Position\b[^>]*\blat(?:itude)?=["'](-?\d+(?:\.\d+)?)["'][^>]*\b(?:lng|lon|longitude)=["'](-?\d+(?:\.\d+)?)["'][^>]*\/?>/gi;

  for (const match of xml.matchAll(attributePattern)) {
    const latitude = Number(match[1]);
    const longitude = Number(match[2]);

    if (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    ) {
      coordinates.push({ latitude, longitude });
    }
  }

  const reversedAttributePattern =
    /<Position\b[^>]*\b(?:lng|lon|longitude)=["'](-?\d+(?:\.\d+)?)["'][^>]*\blat(?:itude)?=["'](-?\d+(?:\.\d+)?)["'][^>]*\/?>/gi;

  for (const match of xml.matchAll(
    reversedAttributePattern,
  )) {
    const longitude = Number(match[1]);
    const latitude = Number(match[2]);

    if (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    ) {
      coordinates.push({ latitude, longitude });
    }
  }

  return coordinates;
}

function calculateCenter(
  coordinates: Coordinate[],
): Coordinate | null {
  if (coordinates.length === 0) {
    return null;
  }

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLon = Infinity;
  let maxLon = -Infinity;

  for (const coordinate of coordinates) {
    minLat = Math.min(minLat, coordinate.latitude);
    maxLat = Math.max(maxLat, coordinate.latitude);
    minLon = Math.min(minLon, coordinate.longitude);
    maxLon = Math.max(maxLon, coordinate.longitude);
  }

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLon + maxLon) / 2,
  };
}

async function fetchJson(url: URL): Promise<unknown> {
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": "kartarkiv-test-livelox/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status} ${response.statusText}: ${url}`,
    );
  }

  return response.json();
}

async function main(): Promise<void> {
  const mapIdValue = process.argv[2];

  if (!mapIdValue || !/^\d+$/.test(mapIdValue)) {
    usage();
  }

  const mapId = Number(mapIdValue);
  const inputPath = path.resolve(
    "migration",
    "test",
    `doma-${mapId}`,
    "competition-enriched.json",
  );

  const competition = JSON.parse(
    await readFile(inputPath, "utf8"),
  ) as EnrichedCompetition;

  const date = competition.doma?.date;
  const wantedTitle =
    competition.eventor?.title ||
    competition.eventorMatch?.title ||
    competition.doma?.title ||
    "";

  if (!date || !wantedTitle) {
    throw new Error(
      "Tävlingsfilen saknar datum eller titel.",
    );
  }

  const viewerUrl =
    competition.liveloxUrl ??
    competition.eventor?.liveloxUrl ??
    null;

  const eventorId =
    competition.eventor?.eventId ??
    competition.eventorMatch?.eventId ??
    extractEventorIdFromViewer(viewerUrl);

  console.log("\n=== Livelox coordinate test ===");
  console.log(`DOMA map-ID..............${mapId}`);
  console.log(`Titel....................${wantedTitle}`);
  console.log(`Datum....................${date}`);
  console.log(
    `Eventor-ID...............${eventorId ?? "—"}`,
  );
  console.log(`Viewer URL................${viewerUrl ?? "—"}`);

  const eventsUrl = new URL(
    "https://api.livelox.com/events",
  );
  eventsUrl.searchParams.set(
    "from",
    `${addDays(date, -1)}T00:00:00Z`,
  );
  eventsUrl.searchParams.set(
    "to",
    `${addDays(date, 2)}T23:59:59Z`,
  );
  eventsUrl.searchParams.set("onlyPublished", "true");
  eventsUrl.searchParams.set(
    "onlyHavingValidMapAndCourses",
    "true",
  );
  eventsUrl.searchParams.set("includeClasses", "true");
  eventsUrl.searchParams.set(
    "includeProperties",
    "true",
  );
  eventsUrl.searchParams.set("cultureCode", "sv-SE");
  eventsUrl.searchParams.set("paging", "0:200");

  console.log("\nSöker Livelox-evenemang...");
  console.log(eventsUrl.toString());

  const eventsPayload = await fetchJson(eventsUrl);
  const candidates = collectObjects(eventsPayload)
    .map((object) =>
      scoreCandidate(object, wantedTitle, eventorId),
    )
    .filter(
      (
        candidate,
      ): candidate is LiveloxCandidate =>
        candidate !== null && candidate.score > 0,
    )
    .sort((a, b) => b.score - a.score);

  const uniqueCandidates = [
    ...new Map(
      candidates.map((candidate) => [
        candidate.id,
        candidate,
      ]),
    ).values(),
  ];

  console.log(
    `Kandidater................${uniqueCandidates.length}`,
  );

  for (const candidate of uniqueCandidates.slice(0, 10)) {
    console.log(
      `- ${candidate.id}: ${candidate.name} ` +
        `(poäng ${candidate.score}; ${
          candidate.reasons.join(", ") || "ingen orsak"
        })`,
    );
  }

  const best = uniqueCandidates[0];

  if (!best) {
    throw new Error(
      "Ingen rimlig Livelox-träff hittades i datumintervallet.",
    );
  }

  if (
    uniqueCandidates[1] &&
    uniqueCandidates[1].score === best.score
  ) {
    throw new Error(
      "Flera Livelox-kandidater fick samma högsta poäng. Ingen väljs automatiskt.",
    );
  }

  console.log("\nVald Livelox-träff");
  console.log(`Internt event-ID.........${best.id}`);
  console.log(`Namn.....................${best.name}`);
  console.log(`Poäng....................${best.score}`);

  const coursesUrl = new URL(
    "https://api.livelox.com/orienteering/courses/iofxml",
  );
  coursesUrl.searchParams.set(
    "eventId",
    String(best.id),
  );
  coursesUrl.searchParams.set(
    "includeControls",
    "true",
  );
  coursesUrl.searchParams.set(
    "includeClassConnections",
    "false",
  );
  coursesUrl.searchParams.set(
    "includeClasses",
    "false",
  );

  console.log("\nHämtar offentlig IOF XML...");
  console.log(coursesUrl.toString());

  const courseResponse = await fetch(coursesUrl, {
    headers: {
      accept:
        "application/xml, text/xml, application/octet-stream",
      "user-agent": "kartarkiv-test-livelox/1.0",
    },
  });

  if (!courseResponse.ok) {
    throw new Error(
      `Kursdata kunde inte hämtas: HTTP ${courseResponse.status} ${courseResponse.statusText}`,
    );
  }

  const xml = await courseResponse.text();
  const coordinates = readCoordinatesFromIofXml(xml);
  const center = calculateCenter(coordinates);

  console.log(
    `Kontrollpositioner.......${coordinates.length}`,
  );

  if (!center) {
    console.log(
      "Resultat..................Inga WGS84-koordinater hittades i offentlig IOF XML.",
    );
    process.exitCode = 2;
    return;
  }

  console.log("\nBeräknat centrum");
  console.log(
    `Latitude.................${center.latitude}`,
  );
  console.log(
    `Longitude................${center.longitude}`,
  );
}

main().catch((error) => {
  console.error(
    `\n✖ ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exitCode = 1;
});