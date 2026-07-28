import {
  chromium,
  type Browser,
  type BrowserContext,
  type Page,
} from "playwright";
import { NextResponse } from "next/server";
import { loadWinSplits } from "@/lib/winsplits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EVENTOR_BASE_URL =
  "https://eventor.orientering.se";

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
    categoryId <= 0
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

function createWinSplitsHeaderUrl(
  databaseId: number,
): string {
  const url = new URL(
    "https://obasen.orientering.se/winsplits/online/sv/top.asp",
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
    "https://obasen.orientering.se/winsplits/online/sv/default.asp",
  );

  url.searchParams.set("page", "classes");
  url.searchParams.set(
    "databaseId",
    String(databaseId),
  );

  return url.toString();
}

async function openPage(
  page: Page,
  url: string,
): Promise<void> {
  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });

  await page
    .waitForLoadState("networkidle", {
      timeout: 10_000,
    })
    .catch(() => undefined);

  await page.waitForTimeout(1_000);
}

type WinSplitsPageSnapshot = {
  url: string;
  bodyText: string;
  documentTitle: string;
  htmlText: string;
};

function decodeBasicHtmlEntities(
  value: string,
): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function cleanWinSplitsTitle(
  value: string,
  date: string,
): string {
  let title = normalizeText(
    decodeBasicHtmlEntities(value)
      .replace(
        new RegExp(
          `\\[?${date.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\]?`,
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
    title = menuParts[menuParts.length - 1];
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

function extractClassInformation(
  snapshots: WinSplitsPageSnapshot[],
): {
  raceClass: string;
  distanceKm: string;
  starters: string;
} {
  const values = snapshots.flatMap(
    (snapshot) => [
      snapshot.bodyText,
      snapshot.documentTitle,
      snapshot.htmlText,
    ],
  );

  for (const value of values) {
    const normalized = normalizeText(value);

    const match = normalized.match(
      /(?:^|\s)((?:H|D)\s*\d{1,3}(?:\s+(?:kort|lång|elit))?)\s+(\d[\d\s]*)\s*m(?:\s*,?\s*(\d+)\s+startande)?/i,
    );

    if (!match) {
      continue;
    }

    const meters = Number(
      match[2].replace(/\s+/g, ""),
    );

    return {
      raceClass:
        normalizeText(match[1]),
      distanceKm:
        Number.isFinite(meters) &&
        meters > 0
          ? String(
              Number(
                (meters / 1_000).toFixed(3),
              ),
            )
          : "",
      starters: match[3] ?? "",
    };
  }

  for (const value of values) {
    const match =
      normalizeText(value).match(
        /(?:^|\s)((?:H|D)\s*\d{1,3}(?:\s+(?:kort|lång|elit))?)(?=\s|$)/i,
      );

    if (match) {
      return {
        raceClass:
          normalizeText(match[1]),
        distanceKm: "",
        starters: "",
      };
    }
  }

  return {
    raceClass: "",
    distanceKm: "",
    starters: "",
  };
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

function isPlausibleWinSplitsTitle(
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

  const rejectedTitles = new Set([
    "online",
    "ladda upp",
    "start",
    "klasser",
    "resultat",
    "stracktider",
    "om winsplits online",
    "hjalp",
    "winsplits online",
  ]);

  return !rejectedTitles.has(normalized);
}

function extractWinSplitsInformation(
  snapshots: WinSplitsPageSnapshot[],
): {
  title: string;
  date: string;
} | null {
  const values = snapshots.flatMap(
    (snapshot) => [
      snapshot.bodyText,
      snapshot.documentTitle,
      snapshot.htmlText,
    ],
  );

  for (const value of values) {
    const normalized = normalizeText(value);

    const match = normalized.match(
      /(.{2,240}?)\s*\[(\d{4}-\d{2}-\d{2})\]/,
    );

    if (!match) {
      continue;
    }

    const date = match[2];
    const title = cleanWinSplitsTitle(
      match[1],
      date,
    );

    if (
      isPlausibleWinSplitsTitle(title)
    ) {
      return {
        title,
        date,
      };
    }
  }

  for (const snapshot of snapshots) {
    const lines = snapshot.bodyText
      .split(/\r?\n/)
      .map((line) => normalizeText(line))
      .filter(Boolean);

    for (
      let lineIndex = 0;
      lineIndex < lines.length;
      lineIndex += 1
    ) {
      const date = parseDateFromText(
        lines[lineIndex],
      );

      if (!date) {
        continue;
      }

      const titleCandidates = [
        lines[lineIndex],
        lines[lineIndex - 1] ?? "",
        lines[lineIndex + 1] ?? "",
        snapshot.documentTitle,
      ];

      for (const candidate of titleCandidates) {
        const title = cleanWinSplitsTitle(
          candidate,
          date,
        );

        if (
          isPlausibleWinSplitsTitle(title)
        ) {
          return {
            title,
            date,
          };
        }
      }
    }
  }

  return null;
}

async function collectWinSplitsSnapshots(
  page: Page,
): Promise<WinSplitsPageSnapshot[]> {
  const snapshots: WinSplitsPageSnapshot[] = [];

  for (const frame of page.frames()) {
    try {
      const snapshot = await frame.evaluate(() => {
        function clean(
          value:
            | string
            | null
            | undefined,
        ): string {
          return (value ?? "")
            .replace(/\u00a0/g, " ")
            .replace(/\r/g, "")
            .trim();
        }

        const html =
          document.documentElement?.innerHTML ??
          "";

        return {
          url: window.location.href,
          bodyText: clean(
            document.body?.innerText,
          ),
          documentTitle: clean(
            document.title,
          ),
          htmlText: clean(
            html.replace(/<[^>]+>/g, " "),
          ),
        };
      });

      snapshots.push(snapshot);
    } catch {
      // En enskild ram kan vara oläsbar.
    }
  }

  return snapshots;
}

async function readWinSplitsInformation(
  context: BrowserContext,
  winsplitsUrl: string,
): Promise<WinSplitsInformation> {
  const {
    databaseId,
    categoryId,
    normalizedUrl,
  } =
    readWinSplitsIds(winsplitsUrl);

  const urlsToTry = Array.from(
    new Set([
      createWinSplitsHeaderUrl(databaseId),
      winsplitsUrl,
      createWinSplitsClassesUrl(databaseId),
    ]),
  );

  const page = await context.newPage();

  try {
    const allSnapshots:
      WinSplitsPageSnapshot[] = [];

    for (const url of urlsToTry) {
      try {
        await openPage(page, url);

        const snapshots =
          await collectWinSplitsSnapshots(page);

        allSnapshots.push(...snapshots);

        const information =
          extractWinSplitsInformation(
            allSnapshots,
          );

        if (information) {
          const classInformation =
            extractClassInformation(
              allSnapshots,
            );

          return {
            databaseId,
            categoryId,
            url: normalizedUrl,
            title: information.title,
            date: information.date,
            raceClass:
              classInformation.raceClass,
            distanceKm:
              classInformation.distanceKm,
            starters:
              classInformation.starters,
          };
        }
      } catch {
        // Försök nästa WinSplits-vy.
      }
    }

    const combinedText = normalizeText(
      allSnapshots
        .flatMap((snapshot) => [
          snapshot.bodyText,
          snapshot.documentTitle,
          snapshot.htmlText,
        ])
        .join(" "),
    );

    const date =
      parseDateFromText(combinedText);

    if (!date) {
      throw new Error(
        "Kunde inte läsa tävlingsdatumet från WinSplits.",
      );
    }

    throw new Error(
      "Kunde inte läsa tävlingsnamnet från WinSplits.",
    );
  } finally {
    await page.close();
  }
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

  /*
   * Lite extra poäng när de första orden
   * överensstämmer.
   */
  const leftFirstWord =
    left.split(" ")[0];

  const rightFirstWord =
    right.split(" ")[0];

  const firstWordBonus =
    leftFirstWord === rightFirstWord
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
    const eventId = Number(
      pathMatch[1],
    );

    return Number.isInteger(eventId) &&
      eventId > 0
      ? eventId
      : null;
  }

  const queryEventId = Number(
    url.searchParams.get("eventId"),
  );

  if (
    Number.isInteger(queryEventId) &&
    queryEventId > 0
  ) {
    return queryEventId;
  }

  return null;
}

async function readEventorCandidates(
  context: BrowserContext,
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

  const page = await context.newPage();

  try {
    await openPage(
      page,
      calendarUrl.toString(),
    );

    /*
     * Tävlingslistan kan fyllas i efter den
     * första sidladdningen.
     */
    await page
      .waitForSelector(
        'a[href*="/Events/Show/"], a[href*="eventId="]',
        {
          timeout: 15_000,
        },
      )
      .catch(() => undefined);

    await page.waitForTimeout(1_000);

    const rawLinks =
      await page.evaluate(() => {
        function clean(
          value:
            | string
            | null
            | undefined,
        ): string {
          return (value ?? "")
            .replace(/\u00a0/g, " ")
            .replace(/\s+/g, " ")
            .trim();
        }

        return Array.from(
          document.querySelectorAll<
            HTMLAnchorElement
          >("a[href]"),
        ).map((anchor) => ({
          href: anchor.href,
          text: clean(
            anchor.textContent,
          ),
        }));
      });

    const candidatesById =
      new Map<
        number,
        EventorCandidate
      >();

    for (const link of rawLinks) {
      const eventId =
        extractEventId(link.href);

      if (!eventId) {
        continue;
      }

      const title =
        normalizeText(link.text);

      if (!title) {
        continue;
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
    }

    return [
      ...candidatesById.values(),
    ].sort(
      (left, right) =>
        right.nameScore -
        left.nameScore,
    );
  } finally {
    await page.close();
  }
}

async function candidateUsesDatabaseId(
  context: BrowserContext,
  candidate: EventorCandidate,
  databaseId: number,
): Promise<boolean> {
  const page = await context.newPage();

  try {
    await openPage(
      page,
      candidate.resultListUrl,
    );

    const expectedText =
      String(databaseId);

    const foundInMainPage =
      await page.evaluate(
        ({ expectedDatabaseId }) => {
          const html =
            document.documentElement
              .innerHTML;

          const decodedHtml =
            document.createElement(
              "textarea",
            );

          decodedHtml.innerHTML = html;

          const searchableValue =
            `${html} ${decodedHtml.value}`
              .replace(/&amp;/gi, "&")
              .replace(/\s+/g, "");

          return searchableValue.includes(
            `databaseId=${expectedDatabaseId}`,
          );
        },
        {
          expectedDatabaseId:
            expectedText,
        },
      );

    if (foundInMainPage) {
      return true;
    }

    /*
     * Kontrollera även alla ramar, om Eventor
     * skulle lägga länkarna där.
     */
    for (const frame of page.frames()) {
      try {
        const foundInFrame =
          await frame.evaluate(
            ({
              expectedDatabaseId,
            }) => {
              const html =
                document.documentElement
                  .innerHTML;

              const searchableValue =
                html
                  .replace(
                    /&amp;/gi,
                    "&",
                  )
                  .replace(/\s+/g, "");

              return searchableValue.includes(
                `databaseId=${expectedDatabaseId}`,
              );
            },
            {
              expectedDatabaseId:
                expectedText,
            },
          );

        if (foundInFrame) {
          return true;
        }
      } catch {
        // En enskild ram kan vara oläsbar.
      }
    }

    return false;
  } catch {
    return false;
  } finally {
    await page.close();
  }
}

async function createDirectWinSplitsImport(
  winsplits: WinSplitsInformation,
  runnerName = "Erik Martinsson",
): Promise<DirectWinSplitsImport> {
  const runners =
    await loadWinSplits(
      winsplits.databaseId,
      winsplits.categoryId,
    );

  const wantedName =
    normalizeName(runnerName);

  const runner =
    runners.find(
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
    raceClass: winsplits.raceClass,
    distanceKm: winsplits.distanceKm,
    time: normalizeTime(
      runner.totalTime,
    ),
    position: runner.place,
    starters:
      winsplits.starters ||
      String(runners.length),
    controls: String(
      runner.controls,
    ),
    mistakeTime:
      normalizeTime(
        runner.totalMistake,
      ) || "0:00",
    winsplitsUrl: winsplits.url,
  };
}

async function resolveEventorEvent(
  browser: Browser,
  winsplitsUrl: string,
) {
  const context =
    await browser.newContext({
      locale: "sv-SE",

      userAgent:
        "Mozilla/5.0 " +
        "(Windows NT 10.0; Win64; x64) " +
        "AppleWebKit/537.36 " +
        "(KHTML, like Gecko) " +
        "Chrome/131.0.0.0 " +
        "Safari/537.36",
    });

  try {
    const winsplits =
      await readWinSplitsInformation(
        context,
        winsplitsUrl,
      );

    const directImport =
      await createDirectWinSplitsImport(
        winsplits,
      );

    const candidates =
      await readEventorCandidates(
        context,
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

    /*
     * Vi verifierar först de bästa
     * namnkandidaterna.
     */
    const candidatesToVerify =
      candidates.slice(0, 100);

    for (
      const candidate of
        candidatesToVerify
    ) {
      const verified =
        await candidateUsesDatabaseId(
          context,
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

    /*
     * Eventor visar inte alltid WinSplits-länken i
     * HTML-källan. Använd därför en försiktig fallback
     * när namnmatchningen är mycket tydlig.
     */
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
  } finally {
    await context.close();
  }
}

export async function GET(
  request: Request,
) {
  let browser: Browser | null = null;

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

    browser = await chromium.launch({
      headless: true,
    });

    const result =
      await resolveEventorEvent(
        browser,
        winsplitsUrl,
      );

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Ett okänt fel inträffade.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      },
    );
  } finally {
    await browser?.close();
  }
}