import * as cheerio from "cheerio";

import {
  loadWinSplitsWithMetadata,
} from "@/lib/winsplits";

const WINSPLITS_ROOT =
  "https://obasen.orientering.se/winsplits/online/sv";
const WINSPLITS_CLASSES_URL =
  `${WINSPLITS_ROOT}/classes.asp`;

const REQUEST_TIMEOUT_MS = 12_000;

/*
 * WinSplits databaseId följer i praktiken uppladdningsordningen och
 * ökar stabilt över tid. Resolvern använder några breda historiska
 * ankare ENDAST för att hitta ett litet sökområde. Själva träffen
 * godkänns aldrig på databaseId-estimatet, utan verifieras därefter
 * med datum, tävlingsnamn, arrangör, klass och löpare.
 *
 * Dessa ankare behöver därför inte motsvara den aktuella tävlingen.
 */
const DATABASE_DATE_ANCHORS = [
  {
    date: "2021-10-09",
    databaseId: 77936,
  },
  {
    date: "2022-08-28",
    databaseId: 84354,
  },
  {
    date: "2024-11-09",
    databaseId: 101468,
  },
  {
    date: "2026-01-17",
    databaseId: 110058,
  },
  {
    date: "2026-03-22",
    databaseId: 111060,
  },
  /*
   * Verifierat mot WinSplits Online. Under våren 2026 ökade
   * uppladdningstakten kraftigt, så äldre extrapolering hamnade
   * flera hundra databaseId fel.
   */
  {
    date: "2026-05-30",
    databaseId: 112978,
  },
] as const;

type WinSplitsCandidate = {
  databaseId: number;
  categoryId: number;
};

export type ResolvedWinSplits = {
  winsplits: {
    name: string;
    url: string;
    databaseId: number;
    categoryId: number;
  } | null;
  runner:
    | Awaited<
        ReturnType<
          typeof loadWinSplitsWithMetadata
        >
      >["runners"][number]
    | null;
  source:
    | "eventor-html"
    | "winsplits-search"
    | "none";
  confidence: number;
};

type EventSummary = {
  databaseId: number;
  date: string;
  title: string;
  organiser: string;
  categoryIds: number[];
  text: string;
};

type SearchInput = {
  existingCandidates: WinSplitsCandidate[];
  date: string;
  title: string;
  organiser: string;
  raceClass: string;
  runnerName: string;
  eventorTime?: string;
};

function cleanText(value: string): string {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeName(value: string): string {
  return cleanText(value)
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .toLocaleLowerCase("sv-SE")
    .replace(/[’'`´]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value: string): string[] {
  return normalizeName(value)
    .split(" ")
    .filter(
      (part) =>
        part.length >= 2 &&
        ![
          "ok",
          "ol",
          "of",
          "sk",
          "ik",
          "if",
          "dag",
          "etapp",
        ].includes(part),
    );
}

function textScore(
  candidate: string,
  wanted: string,
): number {
  const left = normalizeName(candidate);
  const right = normalizeName(wanted);

  if (!left || !right) {
    return 0;
  }

  if (left === right) {
    return 100;
  }

  if (
    left.includes(right) ||
    right.includes(left)
  ) {
    return 92;
  }

  const leftTokens = new Set(tokens(left));
  const rightTokens = tokens(right);

  if (rightTokens.length === 0) {
    return 0;
  }

  const shared =
    rightTokens.filter(
      (part) => leftTokens.has(part),
    ).length;

  return Math.round(
    100 *
      shared /
      Math.max(
        rightTokens.length,
        leftTokens.size,
        1,
      ),
  );
}

function runnerNameScore(
  candidate: string,
  wanted: string,
): number {
  const left = normalizeName(candidate);
  const right = normalizeName(wanted);

  if (!left || !right) {
    return 0;
  }

  if (left === right) {
    return 100;
  }

  const leftParts = new Set(
    left.split(" ").filter(Boolean),
  );
  const rightParts =
    right.split(" ").filter(Boolean);

  if (
    rightParts.length > 0 &&
    rightParts.every(
      (part) => leftParts.has(part),
    )
  ) {
    return 95;
  }

  return textScore(candidate, wanted);
}

function normalizeTime(value: string): string {
  const raw = cleanText(value);

  const match =
    raw.match(
      /^(?:(\d+):)?(\d{1,3})[.:](\d{2})$/,
    );

  if (!match) {
    return raw;
  }

  const hours = Number(match[1] || 0);
  const minutes = Number(match[2]);
  const seconds = match[3];

  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${seconds}`
    : `${minutes}:${seconds}`;
}

function toUtcDay(date: string): number | null {
  const match =
    date.match(
      /^(\d{4})-(\d{2})-(\d{2})$/,
    );

  if (!match) {
    return null;
  }

  return Math.floor(
    Date.UTC(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3]),
    ) /
      86_400_000,
  );
}

function estimateDatabaseId(
  date: string,
): number | null {
  const targetDay = toUtcDay(date);

  if (targetDay === null) {
    return null;
  }

  const anchors =
    DATABASE_DATE_ANCHORS
      .map((anchor) => ({
        ...anchor,
        day:
          toUtcDay(anchor.date) ?? 0,
      }))
      .sort(
        (a, b) =>
          a.day - b.day,
      );

  let left = anchors[0];
  let right =
    anchors[anchors.length - 1];

  for (
    let index = 0;
    index < anchors.length - 1;
    index += 1
  ) {
    const current = anchors[index];
    const next = anchors[index + 1];

    if (
      targetDay >= current.day &&
      targetDay <= next.day
    ) {
      left = current;
      right = next;
      break;
    }
  }

  if (targetDay < anchors[0].day) {
    left = anchors[0];
    right = anchors[1];
  }

  if (
    targetDay >
    anchors[anchors.length - 1].day
  ) {
    left =
      anchors[anchors.length - 2];
    right =
      anchors[anchors.length - 1];
  }

  const daySpan =
    Math.max(
      1,
      right.day - left.day,
    );
  const idSpan =
    right.databaseId -
    left.databaseId;

  const perDay =
    idSpan / daySpan;

  return Math.max(
    1,
    Math.round(
      left.databaseId +
        (targetDay - left.day) *
          perDay,
    ),
  );
}

async function fetchWithTimeout(
  url: string,
): Promise<Response> {
  const controller =
    new AbortController();

  const timeout =
    setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT_MS,
    );

  try {
    return await fetch(url, {
      method: "GET",
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        Accept:
          "text/html,application/xhtml+xml,*/*",
        "Accept-Language":
          "sv-SE,sv;q=0.9,en;q=0.7",
        "User-Agent":
          "Mozilla/5.0 KartarkivStudio/1.0",
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

function classesUrl(
  databaseId: number,
): string {
  const url =
    new URL(WINSPLITS_CLASSES_URL);

  url.searchParams.set(
    "databaseId",
    String(databaseId),
  );

  return url.toString();
}

function tableUrl(
  databaseId: number,
  categoryId: number,
): string {
  const url =
    new URL(
      `${WINSPLITS_ROOT}/default.asp`,
    );

  url.searchParams.set(
    "page",
    "table",
  );
  url.searchParams.set(
    "databaseId",
    String(databaseId),
  );
  url.searchParams.set(
    "categoryId",
    String(categoryId),
  );

  return url.toString();
}

function parseEventSummary(
  databaseId: number,
  html: string,
): EventSummary | null {
  const $ = cheerio.load(html);

  const bodyText =
    cleanText(
      $("body").text(),
    );

  if (
    !bodyText ||
    bodyText.length < 20
  ) {
    return null;
  }

  const date =
    bodyText.match(
      /\[(\d{4}-\d{2}-\d{2})\]/,
    )?.[1] ??
    bodyText.match(
      /\b(\d{4}-\d{2}-\d{2})\b/,
    )?.[1] ??
    "";

  if (!date) {
    return null;
  }

  const categoryIds =
    new Set<number>();

  $("a[href]").each(
    (_, anchor) => {
      const href =
        $(anchor).attr("href") ?? "";

      let url: URL;

      try {
        url =
          new URL(
            href,
            WINSPLITS_ROOT + "/",
          );
      } catch {
        return;
      }

      const categoryId =
        Number(
          url.searchParams.get(
            "categoryId",
          ),
        );

      if (
        Number.isInteger(categoryId) &&
        categoryId >= 0
      ) {
        categoryIds.add(categoryId);
      }
    },
  );

  /*
   * WinSplits klassida brukar ha formen:
   * "Tävlingsnamn, Arrangör [YYYY-MM-DD]".
   * Vi använder både rubriker och sidtext för att tåla äldre mallar.
   */
  const headingCandidates = [
    $("h1").first().text(),
    $("h2").first().text(),
    $("h3").first().text(),
    $("title").text(),
    bodyText.slice(
      0,
      Math.min(
        500,
        bodyText.length,
      ),
    ),
  ]
    .map(cleanText)
    .filter(Boolean);

  const heading =
    headingCandidates.find(
      (item) => item.includes(date),
    ) ??
    headingCandidates[0] ??
    bodyText;

  const beforeDate =
    cleanText(
      heading
        .replace(
          new RegExp(
            `\\[?${date.replace(
              /-/g,
              "\\-",
            )}\\]?`,
          ),
          "",
        )
        .replace(
          /WinSplits(?:\s+Online)?/gi,
          "",
        ),
    );

  const commaParts =
    beforeDate
      .split(",")
      .map(cleanText)
      .filter(Boolean);

  const title =
    commaParts[0] ??
    beforeDate;

  const organiser =
    commaParts.length >= 2
      ? commaParts[
          commaParts.length - 1
        ]
      : "";

  return {
    databaseId,
    date,
    title,
    organiser,
    categoryIds:
      [...categoryIds],
    text: bodyText,
  };
}

async function readEventSummary(
  databaseId: number,
): Promise<EventSummary | null> {
  try {
    const response =
      await fetchWithTimeout(
        classesUrl(databaseId),
      );

    if (!response.ok) {
      return null;
    }

    return parseEventSummary(
      databaseId,
      await response.text(),
    );
  } catch {
    return null;
  }
}

async function mapWithConcurrency<
  T,
  R
>(
  values: T[],
  concurrency: number,
  mapper: (value: T) => Promise<R>,
): Promise<R[]> {
  const output =
    new Array<R>(values.length);

  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (true) {
      const index = nextIndex;
      nextIndex += 1;

      if (index >= values.length) {
        return;
      }

      output[index] =
        await mapper(values[index]);
    }
  }

  await Promise.all(
    Array.from(
      {
        length:
          Math.min(
            concurrency,
            values.length,
          ),
      },
      () => worker(),
    ),
  );

  return output;
}

function eventMatchScore(
  event: EventSummary,
  input: SearchInput,
): number {
  if (event.date !== input.date) {
    return -1000;
  }

  const title =
    textScore(
      event.title,
      input.title,
    );

  const organiser =
    textScore(
      event.organiser,
      input.organiser,
    );

  const fullTextTitle =
    textScore(
      event.text,
      input.title,
    );

  /*
   * Detta är bara en sorteringssignal. En avvikelse i titel eller
   * arrangör får aldrig filtrera bort rätt tävling; den slutliga
   * verifieringen görs mot klass + löpare + sluttid.
   */
  return (
    Math.max(
      title,
      Math.round(
        fullTextTitle * 0.9,
      ),
    ) *
      0.8 +
    organiser * 0.2
  );
}

function searchOffsets(): number[] {
  /*
   * Först glesa sonderingar. När vi har hittat ett databaseId vars
   * eventdatum ligger nära måldatum görs en tätare scan runt det.
   */
  return [
    0,
    -30,
    30,
    -60,
    60,
    -100,
    100,
    -160,
    160,
    -240,
    240,
    -360,
    360,
    -520,
    520,
  ];
}

async function findDatePivot(
  estimate: number,
  wantedDate: string,
): Promise<number> {
  const ids =
    searchOffsets()
      .map(
        (offset) =>
          Math.max(
            1,
            estimate + offset,
          ),
      );

  const samples =
    (
      await mapWithConcurrency(
        ids,
        8,
        readEventSummary,
      )
    ).filter(
      (
        item,
      ): item is EventSummary =>
        item !== null,
    );

  if (samples.length === 0) {
    return estimate;
  }

  const wantedDay =
    toUtcDay(wantedDate);

  if (wantedDay === null) {
    return estimate;
  }

  samples.sort(
    (a, b) => {
      const aDay =
        toUtcDay(a.date) ??
        Number.MAX_SAFE_INTEGER;
      const bDay =
        toUtcDay(b.date) ??
        Number.MAX_SAFE_INTEGER;

      const aDelta =
        Math.abs(
          aDay - wantedDay,
        );
      const bDelta =
        Math.abs(
          bDay - wantedDay,
        );

      return (
        aDelta - bDelta ||
        Math.abs(
          a.databaseId -
            estimate,
        ) -
          Math.abs(
            b.databaseId -
              estimate,
          )
      );
    },
  );

  const closest =
    samples[0];

  const closestDay =
    toUtcDay(closest.date);

  if (closestDay === null) {
    return estimate;
  }

  /*
   * Justera pivoten med den lokala långsiktiga takten (~15 id/dag).
   * Detta är bara en sökoptimering. Resultatet verifieras exakt senare.
   */
  return Math.max(
    1,
    Math.round(
      closest.databaseId +
        (wantedDay - closestDay) *
          15.5,
    ),
  );
}

async function scanWindowForDate(
  center: number,
  radius: number,
  wantedDate: string,
): Promise<EventSummary[]> {
  const ids =
    Array.from(
      {
        length:
          radius * 2 + 1,
      },
      (_, index) =>
        Math.max(
          1,
          center -
            radius +
            index,
        ),
    );

  const summaries =
    (
      await mapWithConcurrency(
        ids,
        18,
        readEventSummary,
      )
    ).filter(
      (
        item,
      ): item is EventSummary =>
        item !== null &&
        item.date === wantedDate,
    );

  const unique =
    new Map<number, EventSummary>();

  for (const item of summaries) {
    unique.set(
      item.databaseId,
      item,
    );
  }

  return [...unique.values()];
}

async function discoverEvents(
  input: SearchInput,
): Promise<EventSummary[]> {
  const estimate =
    estimateDatabaseId(input.date);

  if (estimate === null) {
    return [];
  }

  const pivot =
    await findDatePivot(
      estimate,
      input.date,
    );

  /*
   * Sök först snävt, sedan bredare. Viktigast är exakt rätt datum.
   * databaseId är bara ett sätt att hitta området och får aldrig vara
   * den slutliga matchningen.
   */
  const radii = [
    140,
    360,
    760,
  ];

  let events: EventSummary[] = [];

  for (const radius of radii) {
    events =
      await scanWindowForDate(
        pivot,
        radius,
        input.date,
      );

    if (events.length > 0) {
      break;
    }
  }

  if (
    events.length === 0 &&
    pivot !== estimate
  ) {
    events =
      await scanWindowForDate(
        estimate,
        760,
        input.date,
      );
  }

  /*
   * Titel och arrangör styr bara testordningen. Alla rimliga tävlingar
   * på exakt rätt datum kan fortfarande verifieras mot Erik, klass och
   * sluttid.
   */
  return events
    .map((event) => ({
      event,
      score:
        eventMatchScore(
          event,
          input,
        ),
    }))
    .sort(
      (a, b) =>
        b.score - a.score,
    )
    .slice(0, 40)
    .map(({ event }) => event);
}

async function verifyCandidate(
  candidate: WinSplitsCandidate,
  input: SearchInput,
): Promise<
  Omit<
    ResolvedWinSplits,
    "source" | "confidence"
  > & {
    classMatches: boolean;
    timeMatches: boolean;
    runnerScore: number;
  }
> {
  const data =
    await loadWinSplitsWithMetadata(
      candidate.databaseId,
      candidate.categoryId,
    );

  const ranked =
    data.runners
      .map((runner) => ({
        runner,
        score:
          runnerNameScore(
            runner.name,
            input.runnerName,
          ),
      }))
      .sort(
        (a, b) =>
          b.score - a.score,
      );

  const best = ranked[0];

  if (
    !best ||
    best.score < 90
  ) {
    return {
      winsplits: null,
      runner: null,
      classMatches: false,
      timeMatches: false,
      runnerScore:
        best?.score ?? 0,
    };
  }

  const candidateClass =
    cleanText(
      data.metadata.raceClass ||
      input.raceClass,
    );

  const classMatches =
    !input.raceClass ||
    normalizeName(candidateClass) ===
      normalizeName(input.raceClass) ||
    textScore(
      candidateClass,
      input.raceClass,
    ) >= 90;

  const eventorTime =
    normalizeTime(
      input.eventorTime ?? "",
    );
  const winsplitsTime =
    normalizeTime(
      best.runner.totalTime ?? "",
    );

  const timeMatches =
    !eventorTime ||
    !winsplitsTime ||
    eventorTime === winsplitsTime;

  return {
    winsplits: {
      name:
        candidateClass ||
        input.raceClass,
      url:
        tableUrl(
          candidate.databaseId,
          candidate.categoryId,
        ),
      databaseId:
        candidate.databaseId,
      categoryId:
        candidate.categoryId,
    },
    runner:
      best.runner,
    classMatches,
    timeMatches,
    runnerScore:
      best.score,
  };
}

async function resolveCandidates(
  candidates: WinSplitsCandidate[],
  input: SearchInput,
  source:
    | "eventor-html"
    | "winsplits-search",
): Promise<ResolvedWinSplits> {
  const unique =
    new Map<
      string,
      WinSplitsCandidate
    >();

  for (const candidate of candidates) {
    unique.set(
      `${candidate.databaseId}:${candidate.categoryId}`,
      candidate,
    );
  }

  const verified = [];

  for (
    const candidate of
    unique.values()
  ) {
    try {
      const result =
        await verifyCandidate(
          candidate,
          input,
        );

      if (!result.winsplits) {
        continue;
      }

      const confidence =
        Math.min(
          100,
          (result.classMatches
            ? 45
            : 0) +
            (result.timeMatches
              ? 25
              : 0) +
            Math.round(
              result.runnerScore *
                0.30,
            ),
        );

      verified.push({
        ...result,
        confidence,
      });
    } catch {
      // En dålig/utgången kandidat får inte stoppa övriga försök.
    }
  }

  verified.sort(
    (a, b) =>
      b.confidence -
      a.confidence,
  );

  const best =
    verified[0];

  /*
   * Vi kräver både rätt person och en stark helhetsmatchning.
   * Om klassnamnet avviker krävs i praktiken exakt tid + mycket stark
   * namnmatchning för att kandidaten ens ska komma nära tröskeln.
   */
  if (
    !best ||
    !best.classMatches ||
    !best.timeMatches ||
    best.confidence < 88
  ) {
    return {
      winsplits: null,
      runner: null,
      source: "none",
      confidence:
        best?.confidence ?? 0,
    };
  }

  return {
    winsplits:
      best.winsplits,
    runner:
      best.runner,
    source,
    confidence:
      best.confidence,
  };
}

export async function resolveWinSplitsForEvent(
  input: SearchInput,
): Promise<ResolvedWinSplits> {
  /*
   * 1. Snabbaste och säkraste vägen: länkar som hittades i Eventors
   *    resultatsida. Den fungerar fortfarande lokalt.
   */
  if (
    input.existingCandidates.length > 0
  ) {
    const direct =
      await resolveCandidates(
        input.existingCandidates,
        input,
        "eventor-html",
      );

    if (direct.winsplits) {
      return direct;
    }
  }

  /*
   * 2. Vercel-fallback: Eventors resultatsida kan ge 403. Då söker vi
   *    i WinSplits kring tävlingsdatumet och verifierar kandidaterna.
   */
  const events =
    await discoverEvents(input);

  for (const event of events) {
    if (
      event.categoryIds.length === 0
    ) {
      continue;
    }

    const candidates =
      event.categoryIds.map(
        (categoryId) => ({
          databaseId:
            event.databaseId,
          categoryId,
        }),
      );

    const resolved =
      await resolveCandidates(
        candidates,
        input,
        "winsplits-search",
      );

    if (resolved.winsplits) {
      return resolved;
    }
  }

  return {
    winsplits: null,
    runner: null,
    source: "none",
    confidence: 0,
  };
}
