import * as cheerio from "cheerio";
import { fetchText } from "./http";
import {
  normalizeText,
  titleScore,
} from "./text";
import type {
  EventorMatch,
} from "./types";

const EVENTOR_BASE_URL =
  "https://eventor.orientering.se";

type Candidate = {
  eventId: number;
  title: string;
  eventorUrl: string;
  resultListUrl: string;
  score: number;
  discoveredFrom: string;
};

export type EventorResolverDebug = {
  wantedTitle: string;
  domaDate: string;
  databaseId: number;
  searchedDates: string[];
  calendarUrls: string[];
  candidates: Array<{
    eventId: number;
    title: string;
    score: number;
    discoveredFrom: string;
    verifiedByWinSplitsId: boolean;
  }>;
};

export type EventorResolverResult = {
  match: EventorMatch | null;
  debug: EventorResolverDebug;
};

function shiftIsoDate(
  isoDate: string,
  days: number,
): string {
  const date = new Date(
    `${isoDate}T12:00:00Z`,
  );

  if (Number.isNaN(date.getTime())) {
    throw new Error(
      `Ogiltigt DOMA-datum: ${isoDate}`,
    );
  }

  date.setUTCDate(
    date.getUTCDate() + days,
  );

  return date
    .toISOString()
    .slice(0, 10);
}

function createCalendarUrls(
  date: string,
): string[] {
  const urls: string[] = [];

  /*
   * Eventors kalender har ändrat beteende och
   * parameterkrav över tid. Vi provar därför ett
   * litet antal explicita listvyer.
   */
  for (const path of [
    "/events",
    "/Events",
  ]) {
    const normal = new URL(
      path,
      EVENTOR_BASE_URL,
    );

    normal.searchParams.set(
      "startDate",
      date,
    );

    normal.searchParams.set(
      "endDate",
      date,
    );

    normal.searchParams.set(
      "mode",
      "List",
    );

    normal.searchParams.set(
      "map",
      "false",
    );

    urls.push(normal.toString());

    const print = new URL(
      normal.toString(),
    );

    print.searchParams.set(
      "layout",
      "print",
    );

    urls.push(print.toString());

    const searchPanel = new URL(
      normal.toString(),
    );

    searchPanel.searchParams.set(
      "searchPanel",
      "true",
    );

    urls.push(searchPanel.toString());
  }

  return [...new Set(urls)];
}

function parseEventId(
  value: string,
): number | null {
  const patterns = [
    /\/Events\/Show\/(\d+)/i,
    /\/events\/show\/(\d+)/i,
    /[?&]eventId=(\d+)/i,
    /\beventId["']?\s*[:=]\s*["']?(\d+)/i,
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);

    if (!match) {
      continue;
    }

    const eventId = Number(match[1]);

    if (
      Number.isInteger(eventId) &&
      eventId > 0
    ) {
      return eventId;
    }
  }

  return null;
}

function addCandidate(
  candidates: Map<number, Candidate>,
  eventId: number,
  title: string,
  wantedTitle: string,
  discoveredFrom: string,
): void {
  const cleanedTitle =
    normalizeText(title) ||
    `Eventor ${eventId}`;

  const candidate: Candidate = {
    eventId,
    title: cleanedTitle,
    eventorUrl:
      `${EVENTOR_BASE_URL}/Events/Show/${eventId}`,
    resultListUrl:
      `${EVENTOR_BASE_URL}/Events/ResultList` +
      `?eventId=${eventId}`,
    score: titleScore(
      wantedTitle,
      cleanedTitle,
    ),
    discoveredFrom,
  };

  const previous =
    candidates.get(eventId);

  if (
    !previous ||
    candidate.score > previous.score
  ) {
    candidates.set(
      eventId,
      candidate,
    );
  }
}

function extractCandidates(
  html: string,
  wantedTitle: string,
  discoveredFrom: string,
): Candidate[] {
  const $ = cheerio.load(html);
  const candidates =
    new Map<number, Candidate>();

  $("a[href]").each((_index, element) => {
    const href =
      $(element).attr("href") ?? "";

    const eventId =
      parseEventId(href);

    if (eventId === null) {
      return;
    }

    const row = $(element).closest(
      "tr, li, article, div",
    );

    const title =
      normalizeText($(element).text()) ||
      normalizeText(
        row
          .find("a[href]")
          .first()
          .text(),
      ) ||
      normalizeText(row.text());

    addCandidate(
      candidates,
      eventId,
      title,
      wantedTitle,
      discoveredFrom,
    );
  });

  /*
   * Vissa Eventor-vyer bygger länkar med
   * JavaScript eller data-attribut. Läs därför
   * även event-id:n direkt ur hela HTML-källan.
   */
  const patterns = [
    /\/Events\/Show\/(\d+)/gi,
    /\/events\/show\/(\d+)/gi,
    /[?&]eventId=(\d+)/gi,
    /\beventId["']?\s*[:=]\s*["']?(\d+)/gi,
  ];

  for (const pattern of patterns) {
    let match: RegExpExecArray | null;

    while (
      (match = pattern.exec(html)) !==
      null
    ) {
      const eventId = Number(match[1]);

      if (
        !Number.isInteger(eventId) ||
        eventId <= 0
      ) {
        continue;
      }

      const start = Math.max(
        0,
        match.index - 250,
      );

      const end = Math.min(
        html.length,
        match.index + 350,
      );

      const contextHtml =
        html.slice(start, end);

      const contextText =
        normalizeText(
          cheerio
            .load(contextHtml)
            .text(),
        );

      addCandidate(
        candidates,
        eventId,
        contextText,
        wantedTitle,
        discoveredFrom,
      );
    }
  }

  return [...candidates.values()];
}

async function resultPageUsesWinSplitsId(
  resultListUrl: string,
  databaseId: number,
): Promise<boolean> {
  try {
    const html =
      await fetchText(resultListUrl);

    const decoded = cheerio
      .load(`<textarea>${html}</textarea>`)(
        "textarea",
      )
      .text();

    const searchable =
      `${html} ${decoded}`
        .replace(/&amp;/gi, "&")
        .replace(/\s+/g, "");

    return searchable.includes(
      `databaseId=${databaseId}`,
    );
  } catch {
    return false;
  }
}

async function discoverCandidates(
  title: string,
  searchedDates: string[],
  calendarUrls: string[],
): Promise<Candidate[]> {
  const candidates =
    new Map<number, Candidate>();

  for (const date of searchedDates) {
    for (
      const url of createCalendarUrls(date)
    ) {
      calendarUrls.push(url);

      try {
        const html =
          await fetchText(url);

        for (
          const candidate of
            extractCandidates(
              html,
              title,
              url,
            )
        ) {
          const previous =
            candidates.get(
              candidate.eventId,
            );

          if (
            !previous ||
            candidate.score >
              previous.score
          ) {
            candidates.set(
              candidate.eventId,
              candidate,
            );
          }
        }
      } catch {
        /*
         * En misslyckad kalendervariant får inte
         * stoppa de övriga varianterna.
         */
      }
    }
  }

  return [...candidates.values()].sort(
    (left, right) =>
      right.score - left.score,
  );
}

export async function resolveEventorEvent(
  title: string,
  date: string,
  databaseId: number,
): Promise<EventorResolverResult> {
  /*
   * DOMA-datumet kan vara uppladdningsdatum,
   * nattsträckans datum eller dagen före
   * huvudtävlingen. Sök därför inom ±2 dagar.
   */
  const searchedDates = [
    shiftIsoDate(date, -2),
    shiftIsoDate(date, -1),
    date,
    shiftIsoDate(date, 1),
    shiftIsoDate(date, 2),
  ];

  const calendarUrls: string[] = [];

  const candidates =
    await discoverCandidates(
      title,
      searchedDates,
      calendarUrls,
    );

  const debugCandidates:
    EventorResolverDebug["candidates"] = [];

  /*
   * databaseId är den starkaste nyckeln.
   * Kontrollera alla upptäckta tävlingar, inte
   * bara de bästa titelmatchningarna.
   */
  for (const candidate of candidates) {
    const verified =
      await resultPageUsesWinSplitsId(
        candidate.resultListUrl,
        databaseId,
      );

    debugCandidates.push({
      eventId: candidate.eventId,
      title: candidate.title,
      score: candidate.score,
      discoveredFrom:
        candidate.discoveredFrom,
      verifiedByWinSplitsId:
        verified,
    });

    if (verified) {
      return {
        match: {
          eventId:
            candidate.eventId,
          title:
            candidate.title,
          eventorUrl:
            candidate.eventorUrl,
          resultListUrl:
            candidate.resultListUrl,
          score:
            candidate.score,
          verifiedByWinSplitsId:
            true,
        },
        debug: {
          wantedTitle: title,
          domaDate: date,
          databaseId,
          searchedDates,
          calendarUrls,
          candidates:
            debugCandidates,
        },
      };
    }
  }

  /*
   * Fallback används bara när titeln är mycket
   * tydlig och när ingen nästan lika bra kandidat
   * finns.
   */
  const best = candidates[0];
  const second = candidates[1];

  const unambiguous =
    Boolean(best) &&
    best.score >= 90 &&
    (
      !second ||
      best.score - second.score >= 15
    );

  return {
    match:
      best && unambiguous
        ? {
            eventId: best.eventId,
            title: best.title,
            eventorUrl:
              best.eventorUrl,
            resultListUrl:
              best.resultListUrl,
            score: best.score,
            verifiedByWinSplitsId:
              false,
          }
        : null,
    debug: {
      wantedTitle: title,
      domaDate: date,
      databaseId,
      searchedDates,
      calendarUrls,
      candidates:
        debugCandidates.length > 0
          ? debugCandidates
          : candidates.map(
              (candidate) => ({
                eventId:
                  candidate.eventId,
                title:
                  candidate.title,
                score:
                  candidate.score,
                discoveredFrom:
                  candidate.discoveredFrom,
                verifiedByWinSplitsId:
                  false,
              }),
            ),
    },
  };
}
