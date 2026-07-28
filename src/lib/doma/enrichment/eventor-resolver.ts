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
};

function createCalendarUrl(
  date: string,
): string {
  const url = new URL(
    "/Events",
    EVENTOR_BASE_URL,
  );

  url.searchParams.set("startDate", date);
  url.searchParams.set("endDate", date);
  url.searchParams.set("mode", "List");

  return url.toString();
}

function parseEventId(
  href: string,
): number | null {
  const patterns = [
    /\/Events\/Show\/(\d+)/i,
    /[?&]eventId=(\d+)/i,
  ];

  for (const pattern of patterns) {
    const match = href.match(pattern);

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

function extractCandidates(
  html: string,
  wantedTitle: string,
): Candidate[] {
  const $ = cheerio.load(html);
  const candidates = new Map<
    number,
    Candidate
  >();

  $("a[href]").each((_index, element) => {
    const href = $(element).attr("href");

    if (!href) {
      return;
    }

    const eventId = parseEventId(href);

    if (eventId === null) {
      return;
    }

    const title =
      normalizeText($(element).text()) ||
      normalizeText(
        $(element)
          .closest("tr, li, article")
          .find("a[href]")
          .first()
          .text(),
      );

    if (!title) {
      return;
    }

    const eventorUrl =
      `${EVENTOR_BASE_URL}/Events/Show/${eventId}`;

    const resultListUrl =
      `${EVENTOR_BASE_URL}/Events/ResultList` +
      `?eventId=${eventId}`;

    const candidate: Candidate = {
      eventId,
      title,
      eventorUrl,
      resultListUrl,
      score: titleScore(
        wantedTitle,
        title,
      ),
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
  });

  return [...candidates.values()].sort(
    (left, right) =>
      right.score - left.score,
  );
}

async function resultPageUsesWinSplitsId(
  resultListUrl: string,
  databaseId: number,
): Promise<boolean> {
  try {
    const html =
      await fetchText(resultListUrl);

    const compact = html
      .replace(/&amp;/gi, "&")
      .replace(/\s+/g, "");

    return compact.includes(
      `databaseId=${databaseId}`,
    );
  } catch {
    return false;
  }
}

export async function resolveEventorEvent(
  title: string,
  date: string,
  databaseId: number,
): Promise<EventorMatch | null> {
  const calendarHtml = await fetchText(
    createCalendarUrl(date),
  );

  const candidates =
    extractCandidates(
      calendarHtml,
      title,
    ).filter(
      (candidate) =>
        candidate.score >= 45,
    );

  if (candidates.length === 0) {
    return null;
  }

  for (
    const candidate of candidates.slice(0, 20)
  ) {
    const verified =
      await resultPageUsesWinSplitsId(
        candidate.resultListUrl,
        databaseId,
      );

    if (verified) {
      return {
        ...candidate,
        verifiedByWinSplitsId: true,
      };
    }
  }

  const best = candidates[0];
  const second = candidates[1];

  const unambiguous =
    best.score >= 90 &&
    (
      !second ||
      best.score - second.score >= 15
    );

  if (!unambiguous) {
    return null;
  }

  return {
    ...best,
    verifiedByWinSplitsId: false,
  };
}
