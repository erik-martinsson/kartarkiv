import axios from "axios";
import { loadWinSplits } from "@/lib/winsplits";

const EVENTOR_BASE_URL =
  "https://eventor.orientering.se";

const WINSPLITS_BASE_URL =
  "https://obasen.orientering.se/winsplits/online/sv/default.asp";

export type WinSplitsClassLink = {
  name: string;
  url: string;
  databaseId: number;
  categoryId: number;
};

export type EventLinks = {
  eventId: number;
  eventorUrl: string;
  resultListUrl: string;

  title: string;
  date: string;
  club: string;
  location: string;
  raceClass: string;
  discipline: string;
  distanceKm: string;
  time: string;
  position: string;
  starters: string;
  controls: string;
  mistakeTime: string;

  winsplits: WinSplitsClassLink | null;
  liveloxUrl: string | null;
};

type HtmlLink = {
  href: string;
  text: string;
  position: number;
};

type EventInformation = {
  title: string;
  date: string;
  organiser: string;
  location: string;
  discipline: string;
};

type ClassInformation = {
  raceClass: string;
  distanceKm: string;
  starters: string;
};

function normalizeText(value: string): string {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeName(value: string): string {
  return normalizeText(value)
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .toLocaleLowerCase("sv-SE")
    .replace(/[’'`´]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getNameTokens(value: string): string[] {
  return normalizeName(value)
    .split(" ")
    .filter(Boolean);
}

function calculateRunnerNameScore(
  candidateName: string,
  wantedName: string,
): number {
  const candidate = normalizeName(candidateName);
  const wanted = normalizeName(wantedName);

  if (!candidate || !wanted) {
    return 0;
  }

  if (candidate === wanted) {
    return 100;
  }

  const candidateTokens = getNameTokens(candidateName);
  const wantedTokens = getNameTokens(wantedName);

  if (
    candidateTokens.length === 0 ||
    wantedTokens.length === 0
  ) {
    return 0;
  }

  const sortedCandidate = [...candidateTokens]
    .sort()
    .join(" ");

  const sortedWanted = [...wantedTokens]
    .sort()
    .join(" ");

  if (sortedCandidate === sortedWanted) {
    return 99;
  }

  const candidateSet = new Set(candidateTokens);
  const wantedSet = new Set(wantedTokens);

  const sharedTokens = wantedTokens.filter(
    (token) => candidateSet.has(token),
  );

  const sharedSubstantiveTokens = sharedTokens.filter(
    (token) => token.length > 1,
  );

  const wantedSubstantiveTokens = wantedTokens.filter(
    (token) => token.length > 1,
  );

  const candidateSubstantiveTokens =
    candidateTokens.filter(
      (token) => token.length > 1,
    );

  if (
    wantedSubstantiveTokens.length >= 2 &&
    sharedSubstantiveTokens.length < 2
  ) {
    return 0;
  }

  const wantedCoverage =
    sharedTokens.length / wantedTokens.length;

  const candidateCoverage =
    sharedTokens.length / candidateTokens.length;

  const wantedFirst = wantedTokens[0];
  const wantedLast =
    wantedTokens[wantedTokens.length - 1];

  const candidateFirst = candidateTokens[0];
  const candidateLast =
    candidateTokens[candidateTokens.length - 1];

  const sameOuterNames =
    (wantedFirst === candidateFirst &&
      wantedLast === candidateLast) ||
    (wantedFirst === candidateLast &&
      wantedLast === candidateFirst);

  const allWantedNamesPresent =
    wantedSubstantiveTokens.every(
      (token) => candidateSet.has(token),
    );

  const allCandidateNamesPresent =
    candidateSubstantiveTokens.every(
      (token) => wantedSet.has(token),
    );

  if (
    sameOuterNames &&
    (allWantedNamesPresent || allCandidateNamesPresent)
  ) {
    return 96;
  }

  if (allWantedNamesPresent) {
    return 93;
  }

  if (allCandidateNamesPresent) {
    return 91;
  }

  return Math.round(
    Math.min(
      89,
      wantedCoverage * 55 +
        candidateCoverage * 30 +
        (sameOuterNames ? 4 : 0),
    ),
  );
}

function findRunnerByName<
  T extends { name: string },
>(
  runners: T[],
  runnerName: string,
): T | null {
  const ranked = runners
    .map((runner) => ({
      runner,
      score: calculateRunnerNameScore(
        runner.name,
        runnerName,
      ),
    }))
    .filter((candidate) => candidate.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score,
    );

  const best = ranked[0];

  if (!best || best.score < 90) {
    return null;
  }

  const secondBest = ranked[1];

  if (
    secondBest &&
    secondBest.score === best.score
  ) {
    return null;
  }

  return best.runner;
}

function normalizeClassName(
  value: string,
): string {
  return normalizeText(value)
    .replace(/\s+/g, "")
    .replace(/[–—−]/g, "-")
    .toLocaleUpperCase("sv-SE");
}

function normalizeTime(
  value: string | undefined,
): string {
  if (!value) {
    return "";
  }

  const normalized = normalizeText(value);

  const minuteMatch = normalized.match(
    /^(\d{1,3})[.:](\d{2})$/,
  );

  if (minuteMatch) {
    return `${minuteMatch[1]}:${minuteMatch[2]}`;
  }

  return normalized;
}

function escapeRegExp(value: string): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&#x27;/gi, "'")
    .replace(/&nbsp;/gi, " ")
    .replace(/&aring;/gi, "å")
    .replace(/&auml;/gi, "ä")
    .replace(/&ouml;/gi, "ö")
    .replace(/&Aring;/g, "Å")
    .replace(/&Auml;/g, "Ä")
    .replace(/&Ouml;/g, "Ö")
    .replace(
      /&#x([0-9a-f]+);/gi,
      (_, number: string) =>
        String.fromCodePoint(
          Number.parseInt(number, 16),
        ),
    )
    .replace(
      /&#(\d+);/g,
      (_, number: string) =>
        String.fromCodePoint(Number(number)),
    );
}

function stripHtml(value: string): string {
  return normalizeText(
    decodeHtml(
      value
        .replace(
          /<script\b[^>]*>[\s\S]*?<\/script>/gi,
          "",
        )
        .replace(
          /<style\b[^>]*>[\s\S]*?<\/style>/gi,
          "",
        )
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/<[^>]+>/g, " "),
    ),
  );
}

function parseSwedishDate(
  value: string,
): string {
  const normalized = normalizeText(value)
    .toLocaleLowerCase("sv-SE");

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

  const swedishMatch = normalized.match(
    /\b(\d{1,2})\s+(januari|februari|mars|april|maj|juni|juli|augusti|september|oktober|november|december)\s+(\d{4})\b/,
  );

  if (!swedishMatch) {
    return "";
  }

  const months: Record<string, string> = {
    januari: "01",
    februari: "02",
    mars: "03",
    april: "04",
    maj: "05",
    juni: "06",
    juli: "07",
    augusti: "08",
    september: "09",
    oktober: "10",
    november: "11",
    december: "12",
  };

  const day = swedishMatch[1].padStart(
    2,
    "0",
  );

  const month = months[swedishMatch[2]];
  const year = swedishMatch[3];

  return `${year}-${month}-${day}`;
}

function normalizeDiscipline(
  value: string,
): string {
  const normalized = normalizeText(value)
    .toLocaleLowerCase("sv-SE");

  if (
    normalized.includes("ultralång") ||
    normalized.includes("ultralang")
  ) {
    return "Ultralång";
  }

  if (normalized.includes("medel")) {
    return "Medel";
  }

  if (normalized.includes("sprint")) {
    return "Sprint";
  }

  if (normalized.includes("natt")) {
    return "Natt";
  }

  if (normalized.includes("stafett")) {
    return "Stafett";
  }

  if (normalized.includes("lång")) {
    return "Lång";
  }

  return "Annat";
}

function createAbsoluteUrl(
  href: string,
  baseUrl: string,
): string | null {
  try {
    return new URL(
      decodeHtml(href),
      baseUrl,
    ).toString();
  } catch {
    return null;
  }
}

function extractHtmlLinks(
  html: string,
  baseUrl: string,
): HtmlLink[] {
  const links: HtmlLink[] = [];

  const anchorPattern =
    /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

  for (
    const match of html.matchAll(
      anchorPattern,
    )
  ) {
    const href = createAbsoluteUrl(
      match[1],
      baseUrl,
    );

    if (!href) {
      continue;
    }

    links.push({
      href,
      text: stripHtml(match[2]),
      position: match.index ?? 0,
    });
  }

  return links;
}

function findRunnerPosition(
  html: string,
  runnerName: string,
): number {
  const namePattern = normalizeName(
    runnerName,
  )
    .split(" ")
    .filter(Boolean)
    .map(escapeRegExp)
    .join("\\s+");

  const match = new RegExp(
    namePattern,
    "i",
  ).exec(decodeHtml(html));

  if (!match) {
    throw new Error(
      `${runnerName} hittades inte i Eventors resultatlista.`,
    );
  }

  return match.index;
}

function findLastClassInformation(
  htmlBeforePosition: string,
): ClassInformation | null {
  const nearbyText = stripHtml(
    htmlBeforePosition.slice(-50_000),
  );

  /*
   * Exempel från Eventor:
   *
   * H21 4 890 m, 32 startande
   */
  const fullClassPattern =
    /(?:^|\s)((?:H|D)\s*\d{1,3}(?:\s+(?:kort|lång|elit))?)\s+(\d[\d\s]*)\s*m\s*,?\s*(\d+)\s+startande/gi;

  const matches = [
    ...nearbyText.matchAll(
      fullClassPattern,
    ),
  ];

  const match =
    matches[matches.length - 1];

  if (!match) {
    return null;
  }

  const meters = Number(
    match[2].replace(/\s+/g, ""),
  );

  const distanceKm =
    Number.isFinite(meters) && meters > 0
      ? String(
          Number(
            (meters / 1_000).toFixed(3),
          ),
        )
      : "";

  return {
    raceClass: normalizeText(match[1]),
    distanceKm,
    starters: match[3],
  };
}

function findFallbackClassName(
  htmlBeforePosition: string,
): string {
  const headingPattern =
    /<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi;

  let raceClass = "";

  for (
    const match of htmlBeforePosition.matchAll(
      headingPattern,
    )
  ) {
    const text = stripHtml(match[1]);

    const classMatch = text.match(
      /(?:^|\s)((?:H|D)\s*\d{1,3}(?:\s+(?:kort|lång|elit))?)(?=\s|$)/i,
    );

    if (classMatch) {
      raceClass =
        normalizeText(classMatch[1]);
    }
  }

  return raceClass;
}

function parseClassInformation(
  html: string,
  runnerName: string,
): ClassInformation {
  const runnerPosition =
    findRunnerPosition(
      html,
      runnerName,
    );

  const htmlBeforeRunner =
    html.slice(0, runnerPosition);

  const completeInformation =
    findLastClassInformation(
      htmlBeforeRunner,
    );

  if (completeInformation) {
    return completeInformation;
  }

  const fallbackClass =
    findFallbackClassName(
      htmlBeforeRunner,
    );

  if (!fallbackClass) {
    throw new Error(
      `Klassen för ${runnerName} kunde inte identifieras.`,
    );
  }

  return {
    raceClass: fallbackClass,
    distanceKm: "",
    starters: "",
  };
}

function findClassBeforeLink(
  html: string,
  linkPosition: number,
): string {
  const htmlBeforeLink =
    html.slice(0, linkPosition);

  const completeInformation =
    findLastClassInformation(
      htmlBeforeLink,
    );

  if (completeInformation) {
    return completeInformation.raceClass;
  }

  return findFallbackClassName(
    htmlBeforeLink,
  );
}

function readPositiveInteger(
  url: URL,
  parameterName: string,
): number | null {
  const value = Number(
    url.searchParams.get(parameterName),
  );

  if (
    !Number.isInteger(value) ||
    value <= 0
  ) {
    return null;
  }

  return value;
}

function createWinSplitsUrl(
  databaseId: number,
  categoryId: number,
): string {
  const url = new URL(
    WINSPLITS_BASE_URL,
  );

  url.searchParams.set("page", "table");

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

function findWinSplitsLink(
  html: string,
  baseUrl: string,
  raceClass: string,
): WinSplitsClassLink | null {
  const targetClass =
    normalizeClassName(raceClass);

  const links = extractHtmlLinks(
    html,
    baseUrl,
  );

  for (const link of links) {
    const searchableValue =
      `${link.text} ${link.href}`
        .toLocaleLowerCase("sv-SE");

    if (
      !searchableValue.includes(
        "winsplits",
      ) &&
      !searchableValue.includes(
        "obasen.orientering.se",
      )
    ) {
      continue;
    }

    const linkClass = findClassBeforeLink(
      html,
      link.position,
    );

    if (
      normalizeClassName(linkClass) !==
      targetClass
    ) {
      continue;
    }

    let url: URL;

    try {
      url = new URL(link.href);
    } catch {
      continue;
    }

    const databaseId =
      readPositiveInteger(
        url,
        "databaseId",
      );

    const categoryId =
      readPositiveInteger(
        url,
        "categoryId",
      );

    if (
      databaseId === null ||
      categoryId === null
    ) {
      continue;
    }

    return {
      name: raceClass,
      url: createWinSplitsUrl(
        databaseId,
        categoryId,
      ),
      databaseId,
      categoryId,
    };
  }

  return null;
}


type WinSplitsCandidate = WinSplitsClassLink & {
  position: number;
  classMatch: boolean;
  distanceFromRunner: number;
};

function findWinSplitsCandidates(
  html: string,
  baseUrl: string,
  raceClass: string,
  runnerName: string,
): WinSplitsCandidate[] {
  const targetClass =
    normalizeClassName(raceClass);

  const runnerPosition =
    findRunnerPosition(
      html,
      runnerName,
    );

  const candidates = new Map<
    string,
    WinSplitsCandidate
  >();

  for (
    const link of extractHtmlLinks(
      html,
      baseUrl,
    )
  ) {
    const searchableValue =
      `${link.text} ${link.href}`
        .toLocaleLowerCase("sv-SE");

    if (
      !searchableValue.includes(
        "winsplits",
      ) &&
      !searchableValue.includes(
        "obasen.orientering.se",
      )
    ) {
      continue;
    }

    let url: URL;

    try {
      url = new URL(link.href);
    } catch {
      continue;
    }

    const databaseId =
      readPositiveInteger(
        url,
        "databaseId",
      );

    const categoryId =
      readPositiveInteger(
        url,
        "categoryId",
      );

    if (
      databaseId === null ||
      categoryId === null
    ) {
      continue;
    }

    const linkClass =
      findClassBeforeLink(
        html,
        link.position,
      );

    const candidate: WinSplitsCandidate = {
      name:
        normalizeText(linkClass) ||
        raceClass,
      url: createWinSplitsUrl(
        databaseId,
        categoryId,
      ),
      databaseId,
      categoryId,
      position: link.position,
      classMatch:
        normalizeClassName(
          linkClass,
        ) === targetClass,
      distanceFromRunner:
        Math.abs(
          link.position -
            runnerPosition,
        ),
    };

    const key =
      `${databaseId}:${categoryId}`;

    const existing =
      candidates.get(key);

    if (
      !existing ||
      candidate.distanceFromRunner <
        existing.distanceFromRunner
    ) {
      candidates.set(
        key,
        candidate,
      );
    }
  }

  return [...candidates.values()]
    .sort((left, right) => {
      if (
        left.classMatch !==
        right.classMatch
      ) {
        return left.classMatch
          ? -1
          : 1;
      }

      return (
        left.distanceFromRunner -
        right.distanceFromRunner
      );
    });
}

async function findWinSplitsRunner(
  html: string,
  baseUrl: string,
  raceClass: string,
  runnerName: string,
): Promise<{
  winsplits: WinSplitsClassLink | null;
  runner:
    | Awaited<
        ReturnType<
          typeof loadWinSplits
        >
      >[number]
    | null;
  classInformation: ClassInformation | null;
}> {
  const candidates =
    findWinSplitsCandidates(
      html,
      baseUrl,
      raceClass,
      runnerName,
    );

  if (candidates.length === 0) {
    return {
      winsplits: null,
      runner: null,
      classInformation: null,
    };
  }

  const attempts: string[] = [];

  for (const candidate of candidates) {
    try {
      const runners =
        await loadWinSplits(
          candidate.databaseId,
          candidate.categoryId,
        );

      const runner =
        findRunnerByName(
          runners,
          runnerName,
        );

      attempts.push(
        `${candidate.databaseId}/${candidate.categoryId}` +
          ` (${runners.length} löpare)`,
      );

      if (!runner) {
        continue;
      }

      const linkedClassInformation =
        findLastClassInformation(
          html.slice(
            0,
            candidate.position,
          ),
        );

      return {
        winsplits: {
          name:
            linkedClassInformation
              ?.raceClass ||
            candidate.name ||
            raceClass,
          url:
            candidate.url,
          databaseId:
            candidate.databaseId,
          categoryId:
            candidate.categoryId,
        },
        runner,
        classInformation:
          linkedClassInformation,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : String(error);

      attempts.push(
        `${candidate.databaseId}/${candidate.categoryId}` +
          ` (${message})`,
      );
    }
  }

  throw new Error(
    `${runnerName} hittades i Eventor men inte i någon WinSplits-klass. ` +
      `Testade: ${attempts.join("; ")}`,
  );
}

function createLiveloxViewerUrl(
  eventorRedirectUrl: string,
): string | null {
  try {
    const eventorUrl = new URL(
      eventorRedirectUrl,
      EVENTOR_BASE_URL,
    );

    const isLiveloxRedirect =
      eventorUrl.pathname
        .toLocaleLowerCase("sv-SE")
        .endsWith(
          "/home/redirecttolivelox",
        );

    if (!isLiveloxRedirect) {
      return null;
    }

    const redirectUrl =
      eventorUrl.searchParams.get(
        "redirectUrl",
      );

    if (!redirectUrl) {
      return null;
    }

    let decodedRedirectUrl =
      redirectUrl;

    try {
      decodedRedirectUrl =
        decodeURIComponent(redirectUrl);
    } catch {
      /*
       * URLSearchParams kan redan ha
       * avkodat värdet.
       */
    }

    const liveloxUrl = new URL(
      decodedRedirectUrl,
      "https://www.livelox.com",
    );

    liveloxUrl.protocol = "https:";
    liveloxUrl.hostname =
      "www.livelox.com";
    liveloxUrl.hash = "";

    return liveloxUrl.toString();
  } catch {
    return null;
  }
}

function findLiveloxLink(
  html: string,
  baseUrl: string,
  raceClass: string,
): string | null {
  const targetClass =
    normalizeClassName(raceClass);

  const links = extractHtmlLinks(
    html,
    baseUrl,
  );

  for (const link of links) {
    let url: URL;

    try {
      url = new URL(link.href);
    } catch {
      continue;
    }

    const isLiveloxRedirect =
      url.pathname
        .toLocaleLowerCase("sv-SE")
        .endsWith(
          "/home/redirecttolivelox",
        );

    if (!isLiveloxRedirect) {
      continue;
    }

    const linkClass = findClassBeforeLink(
      html,
      link.position,
    );

    if (
      normalizeClassName(linkClass) !==
      targetClass
    ) {
      continue;
    }

    const liveloxUrl =
      createLiveloxViewerUrl(
        link.href,
      );

    if (liveloxUrl) {
      return liveloxUrl;
    }
  }

  return null;
}

async function fetchHtml(
  url: string,
): Promise<string> {
  const response =
    await axios.get<string>(url, {
      responseType: "text",
      timeout: 30_000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 KartarkivStudio EventLinks",
        Accept:
          "text/html,application/xhtml+xml,*/*",
        "Accept-Language":
          "sv-SE,sv;q=0.9,en;q=0.7",
      },
    });

  return response.data;
}

function readEventInformation(
  html: string,
): EventInformation {
  const values = new Map<string, string>();

  function storeValue(
    rawLabel: string,
    rawValue: string,
  ): void {
    const label = stripHtml(rawLabel)
      .toLocaleLowerCase("sv-SE");

    const value = stripHtml(rawValue);

    if (!label || !value) {
      return;
    }

    values.set(label, value);
  }

  /*
   * Eventor visar tävlingsinformationen som tabell på
   * vissa sidor och som dt/dd-lista på andra.
   */
  for (
    const rowMatch of html.matchAll(
      /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi,
    )
  ) {
    const cells = [
      ...rowMatch[1].matchAll(
        /<(?:th|td)\b[^>]*>([\s\S]*?)<\/(?:th|td)>/gi,
      ),
    ];

    if (cells.length >= 2) {
      storeValue(
        cells[0][1],
        cells[1][1],
      );
    }
  }

  for (
    const definitionMatch of html.matchAll(
      /<dt\b[^>]*>([\s\S]*?)<\/dt>\s*<dd\b[^>]*>([\s\S]*?)<\/dd>/gi,
    )
  ) {
    storeValue(
      definitionMatch[1],
      definitionMatch[2],
    );
  }

  function read(
    ...labels: string[]
  ): string {
    for (const label of labels) {
      const wanted =
        label.toLocaleLowerCase("sv-SE");

      const direct = values.get(wanted);

      if (direct) {
        return direct;
      }

      for (
        const [
          storedLabel,
          storedValue,
        ] of values
      ) {
        if (storedLabel.startsWith(wanted)) {
          return storedValue;
        }
      }
    }

    return "";
  }

  const headings = [
    ...html.matchAll(
      /<h[12]\b[^>]*>([\s\S]*?)<\/h[12]>/gi,
    ),
  ]
    .map((match) => stripHtml(match[1]))
    .filter(Boolean);

  return {
    title:
      read("Tävling") ||
      headings[0] ||
      "",

    date: parseSwedishDate(
      read("Datum"),
    ),

    organiser: read(
      "Arrangörsorganisation",
      "Arrangör",
    ),

    location: read(
      "Arena",
      "Tävlingsplats",
      "Plats",
      "Tävlingsområde",
    ),

    discipline: normalizeDiscipline(
      read(
        "Tävlingsdistans",
        "Distans",
      ),
    ),
  };
}

export async function getEventLinks(
  eventId: number,
  runnerName = "Erik Martinsson",
): Promise<EventLinks> {
  if (
    !Number.isInteger(eventId) ||
    eventId <= 0
  ) {
    throw new Error(
      `Ogiltigt Eventor-ID: ${eventId}`,
    );
  }

  const eventorUrl =
    `${EVENTOR_BASE_URL}` +
    `/Events/Show/${eventId}`;

  const resultListUrl =
    `${EVENTOR_BASE_URL}` +
    "/Events/ResultList" +
    `?eventId=${eventId}`;

  const [
    resultHtml,
    eventHtml,
  ] = await Promise.all([
    fetchHtml(resultListUrl),
    fetchHtml(eventorUrl),
  ]);

  const eventInformation =
    readEventInformation(eventHtml);

  const classInformation =

    parseClassInformation(
      resultHtml,
      runnerName,
    );

  const {
    winsplits,
    runner,
    classInformation:
      winSplitsClassInformation,
  } =
    await findWinSplitsRunner(
      resultHtml,
      resultListUrl,
      classInformation.raceClass,
      runnerName,
    );

  const resolvedClassInformation =
    winSplitsClassInformation ??
    classInformation;

  const liveloxUrl =
    findLiveloxLink(
      resultHtml,
      resultListUrl,
      resolvedClassInformation.raceClass,
    );

  return {
    eventId,
    eventorUrl,
    resultListUrl,

    title:
      eventInformation.title,

    date:
      eventInformation.date,

    club:
      eventInformation.organiser ||
      runner?.club ||
      "",

    location:
      eventInformation.location,

    raceClass:
      resolvedClassInformation.raceClass,

    discipline:
      eventInformation.discipline,

    distanceKm:
      resolvedClassInformation.distanceKm,

    time:
      normalizeTime(
        runner?.totalTime,
      ),

    position:
      runner?.place ?? "",

    starters:
      resolvedClassInformation.starters,

    controls:
      runner
        ? String(runner.controls)
        : "",

    mistakeTime:
      normalizeTime(
        runner?.totalMistake,
      ) || "0:00",

    winsplits,
    liveloxUrl,
  };
}