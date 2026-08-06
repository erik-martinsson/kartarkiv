import * as cheerio from "cheerio";

const WINSPLITS_ORIGIN = "https://obasen.orientering.se";
const EVENTS_URL = `${WINSPLITS_ORIGIN}/winsplits/online/sv/events.asp`;
const DEFAULT_URL = `${WINSPLITS_ORIGIN}/winsplits/online/sv/default.asp`;
const REQUEST_TIMEOUT_MS = 30_000;

export type WinSplitsCandidate = {
  databaseId: number;
  categoryId: number;
};

type SearchInput = {
  date: string;
  title: string;
  organiser: string;
  raceClass: string;
};

type EventCandidate = {
  databaseId: number;
  text: string;
  score: number;
};

function cleanText(value: unknown): string {
  return String(value ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalize(value: string): string {
  return cleanText(value)
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .toLocaleLowerCase("sv-SE")
    .replace(/[’'`´]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenScore(candidate: string, wanted: string): number {
  const left = normalize(candidate);
  const right = normalize(wanted);

  if (!left || !right) return 0;
  if (left === right) return 100;
  if (left.includes(right)) return 92;
  if (right.includes(left) && left.length >= 5) return 88;

  const leftParts = new Set(left.split(" ").filter((part) => part.length >= 2));
  const rightParts = right.split(" ").filter((part) => part.length >= 2);
  const shared = rightParts.filter((part) => leftParts.has(part)).length;

  return Math.round((shared / Math.max(1, rightParts.length)) * 80);
}

async function fetchText(
  url: string,
  init: RequestInit = {},
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...init,
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml,*/*",
        "Accept-Language": "sv-SE,sv;q=0.9,en;q=0.7",
        "User-Agent": "Mozilla/5.0 KartarkivStudio/1.0",
        ...(init.headers ?? {}),
      },
    });

    const body = await response.text();
    if (!response.ok) {
      throw new Error(`WinSplits svarade med HTTP ${response.status}.`);
    }
    return body;
  } finally {
    clearTimeout(timeout);
  }
}

function buildSearchBodies(input: SearchInput): URLSearchParams[] {
  const sharedEntries: Array<[string, string]> = [
    ["from", input.date],
    ["to", input.date],
    ["dateFrom", input.date],
    ["dateTo", input.date],
    ["fromDate", input.date],
    ["toDate", input.date],
    ["startDate", input.date],
    ["endDate", input.date],
    ["eventName", input.title],
    ["name", input.title],
    ["organiser", input.organiser],
    ["organizer", input.organiser],
    ["search", "Sök tävlingar"],
    ["submit", "Sök tävlingar"],
  ];

  const exactDate = new URLSearchParams(sharedEntries);
  exactDate.set("allDates", "false");
  exactDate.set("dateSelection", "interval");

  const titleSearch = new URLSearchParams(sharedEntries);
  titleSearch.delete("from");
  titleSearch.delete("to");
  titleSearch.set("allDates", "true");
  titleSearch.set("dateSelection", "all");

  return [exactDate, titleSearch];
}

function parseEventCandidates(
  html: string,
  input: SearchInput,
): EventCandidate[] {
  const $ = cheerio.load(html);
  const byDatabase = new Map<number, EventCandidate>();

  $("a[href]").each((_, element) => {
    const rawHref = $(element).attr("href") ?? "";
    let url: URL;

    try {
      url = new URL(rawHref, EVENTS_URL);
    } catch {
      return;
    }

    const databaseId = Number(
      url.searchParams.get("databaseId") ??
      url.searchParams.get("id"),
    );

    if (!Number.isInteger(databaseId) || databaseId <= 0) return;

    const rowText = cleanText($(element).closest("tr").text());
    const linkText = cleanText($(element).text());
    const text = rowText || linkText;

    const dateMatches = !input.date || text.includes(input.date);
    const titleScore = tokenScore(text, input.title);
    const organiserScore = tokenScore(text, input.organiser);
    const score = titleScore + Math.round(organiserScore * 0.35) + (dateMatches ? 35 : 0);

    const previous = byDatabase.get(databaseId);
    if (!previous || score > previous.score) {
      byDatabase.set(databaseId, { databaseId, text, score });
    }
  });

  return [...byDatabase.values()]
    .filter((candidate) => candidate.score >= 65)
    .sort((left, right) => right.score - left.score)
    .slice(0, 8);
}

function classMatches(candidate: string, wanted: string): boolean {
  const left = normalize(candidate).replace(/\s+/g, "");
  const right = normalize(wanted).replace(/\s+/g, "");
  return Boolean(left && right && (left === right || left.startsWith(`${right}(`)));
}

async function findCategories(
  databaseId: number,
  raceClass: string,
): Promise<WinSplitsCandidate[]> {
  const url = new URL(DEFAULT_URL);
  url.searchParams.set("page", "classes");
  url.searchParams.set("databaseId", String(databaseId));

  const html = await fetchText(url.toString());
  const $ = cheerio.load(html);
  const found = new Map<number, WinSplitsCandidate>();

  $("a[href]").each((_, element) => {
    const rawHref = $(element).attr("href") ?? "";
    let link: URL;

    try {
      link = new URL(rawHref, url);
    } catch {
      return;
    }

    const linkedDatabaseId = Number(link.searchParams.get("databaseId"));
    const categoryId = Number(link.searchParams.get("categoryId"));
    const text = cleanText($(element).text());

    if (
      linkedDatabaseId === databaseId &&
      Number.isInteger(categoryId) &&
      categoryId >= 0 &&
      classMatches(text, raceClass)
    ) {
      found.set(categoryId, { databaseId, categoryId });
    }
  });

  return [...found.values()];
}

/**
 * Söker dynamiskt efter en WinSplits-tävling och rätt klass.
 * Resultatet verifieras därefter mot löparen av eventLinks.ts innan det används.
 */
export async function discoverWinSplitsCandidates(
  input: SearchInput,
): Promise<WinSplitsCandidate[]> {
  const events = new Map<number, EventCandidate>();

  const attempts: Array<Promise<string>> = [
    fetchText(EVENTS_URL),
    ...buildSearchBodies(input).map((body) =>
      fetchText(EVENTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: body.toString(),
      }),
    ),
  ];

  const pages = await Promise.allSettled(attempts);
  for (const page of pages) {
    if (page.status !== "fulfilled") continue;
    for (const event of parseEventCandidates(page.value, input)) {
      const previous = events.get(event.databaseId);
      if (!previous || event.score > previous.score) {
        events.set(event.databaseId, event);
      }
    }
  }

  const candidates: WinSplitsCandidate[] = [];
  for (const event of [...events.values()].sort((a, b) => b.score - a.score)) {
    try {
      candidates.push(...await findCategories(event.databaseId, input.raceClass));
    } catch {
      // Prova nästa möjlig tävling.
    }
  }

  return candidates.filter(
    (candidate, index, all) =>
      all.findIndex(
        (other) =>
          other.databaseId === candidate.databaseId &&
          other.categoryId === candidate.categoryId,
      ) === index,
  );
}