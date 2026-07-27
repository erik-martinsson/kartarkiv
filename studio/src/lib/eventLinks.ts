import axios from "axios";
import {
  chromium,
  type Page,
} from "playwright";
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
    .toLocaleLowerCase("sv-SE");
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

  await page.waitForTimeout(500);
}

async function readEventInformation(
  page: Page,
): Promise<EventInformation> {
  const rawInformation =
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

      const values = new Map<
        string,
        string
      >();

      for (
        const row of Array.from(
          document.querySelectorAll(
            "tr",
          ),
        )
      ) {
        const cells = Array.from(
          row.querySelectorAll(
            ":scope > th, :scope > td",
          ),
        );

        if (cells.length < 2) {
          continue;
        }

        const label = clean(
          cells[0].textContent,
        );

        const value = clean(
          cells[1].textContent,
        );

        if (!label || !value) {
          continue;
        }

        values.set(
          label.toLocaleLowerCase(
            "sv-SE",
          ),
          value,
        );
      }

      for (
        const term of Array.from(
          document.querySelectorAll(
            "dt",
          ),
        )
      ) {
        const definition =
          term.nextElementSibling;

        if (
          !definition ||
          definition.tagName
            .toLocaleLowerCase() !== "dd"
        ) {
          continue;
        }

        const label = clean(
          term.textContent,
        );

        const value = clean(
          definition.textContent,
        );

        if (!label || !value) {
          continue;
        }

        values.set(
          label.toLocaleLowerCase(
            "sv-SE",
          ),
          value,
        );
      }

      function read(
        ...labels: string[]
      ): string {
        for (const label of labels) {
          const wanted =
            label.toLocaleLowerCase(
              "sv-SE",
            );

          const direct =
            values.get(wanted);

          if (direct) {
            return direct;
          }

          for (
            const [
              storedLabel,
              storedValue,
            ] of values
          ) {
            if (
              storedLabel.startsWith(
                wanted,
              )
            ) {
              return storedValue;
            }
          }
        }

        return "";
      }

      const headings = Array.from(
        document.querySelectorAll(
          "h1, h2",
        ),
      )
        .map((element) =>
          clean(element.textContent),
        )
        .filter(Boolean);

      return {
        title:
          read("Tävling") ||
          headings[0] ||
          "",

        date: read("Datum"),

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

        discipline: read(
          "Tävlingsdistans",
          "Distans",
        ),
      };
    });

  return {
    title: normalizeText(
      rawInformation.title,
    ),

    date: parseSwedishDate(
      rawInformation.date,
    ),

    organiser: normalizeText(
      rawInformation.organiser,
    ),

    location: normalizeText(
      rawInformation.location,
    ),

    discipline: normalizeDiscipline(
      rawInformation.discipline,
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

  const [resultHtml, browser] =
    await Promise.all([
      fetchHtml(resultListUrl),

      chromium.launch({
        headless: true,
      }),
    ]);

  try {
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

    const page =
      await context.newPage();

    await openPage(
      page,
      eventorUrl,
    );

    const eventInformation =
      await readEventInformation(page);

    const classInformation =
      parseClassInformation(
        resultHtml,
        runnerName,
      );

    const winsplits =
      findWinSplitsLink(
        resultHtml,
        resultListUrl,
        classInformation.raceClass,
      );

    const liveloxUrl =
      findLiveloxLink(
        resultHtml,
        resultListUrl,
        classInformation.raceClass,
      );

    let runner:
      | Awaited<
          ReturnType<
            typeof loadWinSplits
          >
        >[number]
      | null = null;

    if (winsplits) {
      const runners =
        await loadWinSplits(
          winsplits.databaseId,
          winsplits.categoryId,
        );

      runner =
        runners.find(
          (item) =>
            normalizeName(item.name) ===
            normalizeName(runnerName),
        ) ?? null;

      if (!runner) {
        throw new Error(
          `${runnerName} hittades i Eventor men inte i WinSplits.`,
        );
      }
    }

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
        classInformation.raceClass,

      discipline:
        eventInformation.discipline,

      distanceKm:
        classInformation.distanceKm,

      time:
        normalizeTime(
          runner?.totalTime,
        ),

      position:
        runner?.place ?? "",

      starters:
        classInformation.starters,

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
  } finally {
    await browser.close();
  }
}