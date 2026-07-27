import {
  chromium,
  type Browser,
  type BrowserContext,
  type Page,
} from "playwright";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EVENTOR_BASE_URL =
  "https://eventor.orientering.se";

type WinSplitsInformation = {
  databaseId: number;
  title: string;
  date: string;
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

function readDatabaseId(
  winsplitsUrl: string,
): number {
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

  if (
    !Number.isInteger(databaseId) ||
    databaseId <= 0
  ) {
    throw new Error(
      "WinSplits-länken saknar ett giltigt databaseId.",
    );
  }

  return databaseId;
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
      title &&
      title.toLocaleLowerCase("sv-SE") !==
        "online"
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
          title &&
          title.length >= 3 &&
          title.length <= 200 &&
          title.toLocaleLowerCase("sv-SE") !==
            "online" &&
          !/^(?:klasser|resultat|sträcktider)$/i.test(
            title,
          )
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
  const databaseId =
    readDatabaseId(winsplitsUrl);

  const urlsToTry = Array.from(
    new Set([
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
          return {
            databaseId,
            title: information.title,
            date: information.date,
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

    const candidates =
      await readEventorCandidates(
        context,
        winsplits,
      );

    if (candidates.length === 0) {
      throw new Error(
        `Inga Eventor-tävlingar hittades för ${winsplits.date}.`,
      );
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