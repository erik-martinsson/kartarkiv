import * as cheerio from "cheerio";
import { NextResponse } from "next/server";
import {
  loadWinSplitsWithMetadata,
} from "@/lib/winsplits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EVENTOR_BASE_URL =
  "https://eventor.orientering.se";

const WINSPLITS_BASE_URL =
  "https://obasen.orientering.se/winsplits/online/sv";

const REQUEST_TIMEOUT_MS = 30_000;

type WinSplitsInformation = {
  databaseId: number;
  categoryId: number;
  url: string;
  title: string;
  date: string;
  raceClass: string;
  distanceKm: string;
  starters: string;
};

type DirectWinSplitsImport = {
  title: string;
  date: string;
  club: string;
  raceClass: string;
  distanceKm: string;
  time: string;
  position: string;
  starters: string;
  controls: string;
  mistakeTime: string;
  winsplitsUrl: string;
};

type EventorCandidate = {
  eventId: number;
  title: string;
  eventorUrl: string;
  resultListUrl: string;
  nameScore: number;
  verified: boolean;
};

function normalizeText(value: string): string {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeComparableText(
  value: string,
): string {
  return normalizeText(value)
    .toLocaleLowerCase("sv-SE")
    .replace(/[–—−]/g, "-")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeName(
  value: string,
): string {
  return normalizeText(value)
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .toLocaleLowerCase("sv-SE")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeTime(
  value: string | undefined,
): string {
  if (!value) {
    return "";
  }

  const normalized =
    normalizeText(value);

  const match = normalized.match(
    /^(\d{1,3})[.:](\d{2})$/,
  );

  return match
    ? `${match[1]}:${match[2]}`
    : normalized;
}

function parseDateFromText(
  value: string,
): string {
  const normalized = normalizeText(value);

  const isoMatch = normalized.match(
    /\b(\d{4})-(\d{2})-(\d{2})\b/,
  );

  if (isoMatch) {
    return (
      `${isoMatch[1]}-` +
      `${isoMatch[2]}-` +
      `${isoMatch[3]}`
    );
  }

  const yearFirstMatch = normalized.match(
    /\b(\d{4})[./-](\d{1,2})[./-](\d{1,2})\b/,
  );

  if (yearFirstMatch) {
    return (
      `${yearFirstMatch[1]}-` +
      `${yearFirstMatch[2].padStart(2, "0")}-` +
      yearFirstMatch[3].padStart(2, "0")
    );
  }

  const dayFirstMatch = normalized.match(
    /\b(\d{1,2})[./-](\d{1,2})[./-](\d{4})\b/,
  );

  if (dayFirstMatch) {
    return (
      `${dayFirstMatch[3]}-` +
      `${dayFirstMatch[2].padStart(2, "0")}-` +
      dayFirstMatch[1].padStart(2, "0")
    );
  }

  return "";
}

function readWinSplitsIds(
  winsplitsUrl: string,
): {
  databaseId: number;
  categoryId: number;
  normalizedUrl: string;
} {
  let url: URL;

  try {
    url = new URL(winsplitsUrl);
  } catch {
    throw new Error(
      "WinSplits-länken är inte en giltig URL.",
    );
  }

  const hostname =
    url.hostname.toLocaleLowerCase("sv-SE");

  const pathname =
    url.pathname.toLocaleLowerCase("sv-SE");

  if (
    hostname !==
      "obasen.orientering.se" ||
    !pathname.includes("/winsplits/")
  ) {
    throw new Error(
      "Länken ser inte ut att vara en giltig WinSplits-länk.",
    );
  }

  const databaseId = Number(
    url.searchParams.get("databaseId"),
  );

  const categoryId = Number(
    url.searchParams.get("categoryId"),
  );

  if (
    !Number.isInteger(databaseId) ||
    databaseId <= 0
  ) {
    throw new Error(
      "WinSplits-länken saknar ett giltigt databaseId.",
    );
  }

  if (
    !Number.isInteger(categoryId) ||
    categoryId < 0
  ) {
    throw new Error(
      "WinSplits-länken saknar ett giltigt categoryId.",
    );
  }

  url.searchParams.set("page", "table");
  url.searchParams.set(
    "databaseId",
    String(databaseId),
  );
  url.searchParams.set(
    "categoryId",
    String(categoryId),
  );
  url.hash = "";

  return {
    databaseId,
    categoryId,
    normalizedUrl: url.toString(),
  };
}

async function fetchHtml(
  url: string,
): Promise<string> {
  const controller =
    new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS,
  );

  try {
    const response = await fetch(url, {
      cache: "no-store",
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 KartarkivStudio",
        Accept:
          "text/html,application/xhtml+xml,*/*",
        "Accept-Language":
          "sv-SE,sv;q=0.9,en;q=0.7",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status} från ${new URL(url).hostname}.`,
      );
    }

    return response.text();
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      throw new Error(
        "Den externa tjänsten svarade inte inom 30 sekunder.",
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function htmlText(
  html: string,
): string {
  const $ = cheerio.load(html);

  return normalizeText(
    $.root().text(),
  );
}

function cleanWinSplitsTitle(
  value: string,
  date: string,
): string {
  let title = normalizeText(
    value
      .replace(
        new RegExp(
          `\\[?${date.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&",
          )}\\]?`,
          "g",
        ),
        " ",
      )
      .replace(/>>.*$/i, " ")
      .replace(/\bKlasser\b.*$/i, " ")
      .replace(/\bResultat\b.*$/i, " ")
      .replace(/\bSträcktider\b.*$/i, " "),
  );

  const orienteringIndex = title
    .toLocaleLowerCase("sv-SE")
    .lastIndexOf("orientering.se");

  if (orienteringIndex >= 0) {
    title = title.slice(
      orienteringIndex +
        "orientering.se".length,
    );
  }

  const menuParts = title.split("|");

  if (menuParts.length > 1) {
    title =
      menuParts[menuParts.length - 1];
  }

  return normalizeText(
    title
      .replace(/^WinSplits\s+Online\s*/i, "")
      .replace(/^Online\s*/i, "")
      .replace(
        /^(?:Start|Om WinSplits Online|Hjälp)\s*/i,
        "",
      )
      .replace(/^[>:\-|]+/, "")
      .replace(/[>:\-|]+$/, ""),
  );
}

function isPlausibleTitle(
  value: string,
): boolean {
  const normalized =
    normalizeComparableText(value);

  if (
    !normalized ||
    normalized.length < 3 ||
    normalized.length > 200
  ) {
    return false;
  }

  return !new Set([
    "online",
    "ladda upp",
    "start",
    "klasser",
    "resultat",
    "stracktider",
    "om winsplits online",
    "hjalp",
    "winsplits online",
  ]).has(normalized);
}

function extractTitleAndDate(
  htmlDocuments: string[],
): {
  title: string;
  date: string;
} {
  const values = htmlDocuments.flatMap(
    (html) => {
      const $ = cheerio.load(html);

      return [
        htmlText(html),
        normalizeText($("title").text()),
      ];
    },
  );

  for (const value of values) {
    const match = value.match(
      /(.{2,240}?)\s*\[(\d{4}-\d{2}-\d{2})\]/,
    );

    if (!match) {
      continue;
    }

    const date = match[2];
    const title =
      cleanWinSplitsTitle(
        match[1],
        date,
      );

    if (isPlausibleTitle(title)) {
      return { title, date };
    }
  }

  for (const value of values) {
    const date =
      parseDateFromText(value);

    if (!date) {
      continue;
    }

    const title =
      cleanWinSplitsTitle(
        value.slice(0, 240),
        date,
      );

    if (isPlausibleTitle(title)) {
      return { title, date };
    }
  }

  throw new Error(
    "Kunde inte läsa tävlingsnamn och datum från WinSplits.",
  );
}

function createWinSplitsHeaderUrl(
  databaseId: number,
): string {
  const url = new URL(
    `${WINSPLITS_BASE_URL}/top.asp`,
  );

  url.searchParams.set(
    "page",
    "classes",
  );
  url.searchParams.set(
    "databaseId",
    String(databaseId),
  );

  return url.toString();
}

function createWinSplitsClassesUrl(
  databaseId: number,
): string {
  const url = new URL(
    `${WINSPLITS_BASE_URL}/default.asp`,
  );

  url.searchParams.set(
    "page",
    "classes",
  );
  url.searchParams.set(
    "databaseId",
    String(databaseId),
  );

  return url.toString();
}

async function readWinSplitsInformation(
  winsplitsUrl: string,
): Promise<WinSplitsInformation> {
  const {
    databaseId,
    categoryId,
    normalizedUrl,
  } = readWinSplitsIds(winsplitsUrl);

  const [
    headerHtml,
    classesHtml,
    tableHtml,
    data,
  ] = await Promise.all([
    fetchHtml(
      createWinSplitsHeaderUrl(databaseId),
    ).catch(() => ""),
    fetchHtml(
      createWinSplitsClassesUrl(databaseId),
    ).catch(() => ""),
    fetchHtml(normalizedUrl).catch(() => ""),
    loadWinSplitsWithMetadata(
      databaseId,
      categoryId,
    ),
  ]);

  const {
    title,
    date,
  } = extractTitleAndDate(
    [
      headerHtml,
      classesHtml,
      tableHtml,
    ].filter(Boolean),
  );

  return {
    databaseId,
    categoryId,
    url: normalizedUrl,
    title,
    date,
    raceClass:
      data.metadata.raceClass ?? "",
    distanceKm:
      data.metadata.distanceKm !== null
        ? String(data.metadata.distanceKm)
        : "",
    starters:
      String(data.runners.length),
  };
}

function calculateNameScore(
  winsplitsTitle: string,
  eventorTitle: string,
): number {
  const left =
    normalizeComparableText(
      winsplitsTitle,
    );

  const right =
    normalizeComparableText(
      eventorTitle,
    );

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
    return 90;
  }

  const leftWords = new Set(
    left
      .split(" ")
      .filter(
        (word) => word.length >= 2,
      ),
  );

  const rightWords = new Set(
    right
      .split(" ")
      .filter(
        (word) => word.length >= 2,
      ),
  );

  const commonWords = [
    ...leftWords,
  ].filter((word) =>
    rightWords.has(word),
  );

  const largestWordCount = Math.max(
    leftWords.size,
    rightWords.size,
  );

  if (largestWordCount === 0) {
    return 0;
  }

  const wordScore =
    (commonWords.length /
      largestWordCount) *
    80;

  const firstWordBonus =
    left.split(" ")[0] ===
    right.split(" ")[0]
      ? 10
      : 0;

  return Math.min(
    89,
    Math.round(
      wordScore + firstWordBonus,
    ),
  );
}

function extractEventId(
  href: string,
): number | null {
  let url: URL;

  try {
    url = new URL(
      href,
      EVENTOR_BASE_URL,
    );
  } catch {
    return null;
  }

  const pathMatch =
    url.pathname.match(
      /\/Events\/Show\/(\d+)/i,
    );

  if (pathMatch) {
    const eventId =
      Number(pathMatch[1]);

    return Number.isInteger(eventId) &&
      eventId > 0
      ? eventId
      : null;
  }

  const queryEventId = Number(
    url.searchParams.get("eventId"),
  );

  return (
    Number.isInteger(queryEventId) &&
    queryEventId > 0
  )
    ? queryEventId
    : null;
}

async function readEventorCandidates(
  winsplits: WinSplitsInformation,
): Promise<EventorCandidate[]> {
  const calendarUrl = new URL(
    `${EVENTOR_BASE_URL}/Events`,
  );

  calendarUrl.searchParams.set(
    "startDate",
    winsplits.date,
  );
  calendarUrl.searchParams.set(
    "endDate",
    winsplits.date,
  );
  calendarUrl.searchParams.set(
    "mode",
    "List",
  );
  calendarUrl.searchParams.set(
    "organisations",
    "1",
  );

  const html = await fetchHtml(
    calendarUrl.toString(),
  );

  const $ = cheerio.load(html);

  const candidatesById =
    new Map<number, EventorCandidate>();

  $("a[href]").each(
    (_, anchor) => {
      const href =
        $(anchor).attr("href");

      if (!href) {
        return;
      }

      const eventId =
        extractEventId(href);

      if (!eventId) {
        return;
      }

      const title =
        normalizeText($(anchor).text());

      if (!title) {
        return;
      }

      const eventorUrl =
        `${EVENTOR_BASE_URL}` +
        `/Events/Show/${eventId}`;

      const resultListUrl =
        `${EVENTOR_BASE_URL}` +
        "/Events/ResultList" +
        `?eventId=${eventId}`;

      const candidate: EventorCandidate = {
        eventId,
        title,
        eventorUrl,
        resultListUrl,
        nameScore:
          calculateNameScore(
            winsplits.title,
            title,
          ),
        verified: false,
      };

      const existing =
        candidatesById.get(eventId);

      if (
        !existing ||
        candidate.nameScore >
          existing.nameScore
      ) {
        candidatesById.set(
          eventId,
          candidate,
        );
      }
    },
  );

  return [...candidatesById.values()]
    .sort(
      (left, right) =>
        right.nameScore -
        left.nameScore,
    );
}

async function candidateUsesDatabaseId(
  candidate: EventorCandidate,
  databaseId: number,
): Promise<boolean> {
  try {
    const html = await fetchHtml(
      candidate.resultListUrl,
    );

    const searchableValue = html
      .replace(/&amp;/gi, "&")
      .replace(/\s+/g, "");

    return searchableValue.includes(
      `databaseId=${databaseId}`,
    );
  } catch {
    return false;
  }
}

async function createDirectWinSplitsImport(
  winsplits: WinSplitsInformation,
  runnerName = "Erik Martinsson",
): Promise<DirectWinSplitsImport> {
  const data =
    await loadWinSplitsWithMetadata(
      winsplits.databaseId,
      winsplits.categoryId,
    );

  const wantedName =
    normalizeName(runnerName);

  const runner =
    data.runners.find(
      (candidate) =>
        normalizeName(candidate.name) ===
        wantedName,
    ) ?? null;

  if (!runner) {
    throw new Error(
      `${runnerName} hittades inte i den valda WinSplits-klassen.`,
    );
  }

  return {
    title: winsplits.title,
    date: winsplits.date,
    club: runner.club,
    raceClass:
      winsplits.raceClass,
    distanceKm:
      winsplits.distanceKm,
    time:
      normalizeTime(
        runner.totalTime,
      ),
    position: runner.place,
    starters:
      winsplits.starters ||
      String(data.runners.length),
    controls:
      String(runner.controls),
    mistakeTime:
      normalizeTime(
        runner.totalMistake,
      ) || "0:00",
    winsplitsUrl:
      winsplits.url,
  };
}

async function resolveEventorEvent(
  winsplitsUrl: string,
) {
  const winsplits =
    await readWinSplitsInformation(
      winsplitsUrl,
    );

  const directImport =
    await createDirectWinSplitsImport(
      winsplits,
    );

  const candidates =
    await readEventorCandidates(
      winsplits,
    );

  if (candidates.length === 0) {
    return {
      winsplits,
      directImport,
      eventor: null,
      verified: false,
      candidates: [],
    };
  }

  const candidatesToVerify =
    candidates.slice(0, 100);

  for (
    const candidate of
    candidatesToVerify
  ) {
    const verified =
      await candidateUsesDatabaseId(
        candidate,
        winsplits.databaseId,
      );

    candidate.verified = verified;

    if (verified) {
      return {
        winsplits,
        directImport,
        eventor: {
          eventId:
            candidate.eventId,
          title:
            candidate.title,
          eventorUrl:
            candidate.eventorUrl,
          resultListUrl:
            candidate.resultListUrl,
        },
        verified: true,
        candidates:
          candidatesToVerify.slice(0, 20),
      };
    }
  }

  const fallbackCandidate =
    candidatesToVerify[0];

  const secondBestCandidate =
    candidatesToVerify[1];

  const fallbackIsUnambiguous =
    Boolean(fallbackCandidate) &&
    fallbackCandidate.nameScore >= 90 &&
    (
      !secondBestCandidate ||
      fallbackCandidate.nameScore -
        secondBestCandidate.nameScore >= 20
    );

  if (
    fallbackCandidate &&
    fallbackIsUnambiguous
  ) {
    return {
      winsplits,
      directImport,
      eventor: {
        eventId:
          fallbackCandidate.eventId,
        title:
          fallbackCandidate.title,
        eventorUrl:
          fallbackCandidate.eventorUrl,
        resultListUrl:
          fallbackCandidate.resultListUrl,
      },
      verified: false,
      candidates:
        candidatesToVerify.slice(0, 20),
    };
  }

  return {
    winsplits,
    directImport,
    eventor: null,
    verified: false,
    candidates:
      candidatesToVerify.slice(0, 20),
  };
}

export async function GET(
  request: Request,
) {
  try {
    const requestUrl =
      new URL(request.url);

    const winsplitsUrl =
      requestUrl.searchParams.get("url");

    if (!winsplitsUrl) {
      return NextResponse.json(
        {
          error:
            "Query-parametern url saknas.",
        },
        {
          status: 400,
        },
      );
    }

    const result =
      await resolveEventorEvent(
        winsplitsUrl,
      );

    return NextResponse.json(
      result,
      {
        headers: {
          "Cache-Control":
            "no-store",
        },
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Ett okänt fel inträffade.";

    console.error(
      "WinSplits-import misslyckades:",
      error,
    );

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
        headers: {
          "Cache-Control":
            "no-store",
        },
      },
    );
  }
}