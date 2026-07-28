import * as cheerio from "cheerio";
import { fetchText } from "./http";
import {
  comparableText,
  normalizeText,
} from "./text";
import type {
  EventorMatch,
  EventorMetadata,
} from "./types";

function readLabelledValues(
  $: cheerio.CheerioAPI,
): Map<string, string> {
  const values =
    new Map<string, string>();

  $("tr").each((_index, element) => {
    const cells = $(element)
      .children("th, td");

    if (cells.length < 2) {
      return;
    }

    const label =
      comparableText(cells.eq(0).text());

    const value =
      normalizeText(cells.eq(1).text());

    if (label && value) {
      values.set(label, value);
    }
  });

  $("dt").each((_index, element) => {
    const definition =
      $(element).next("dd");

    if (definition.length === 0) {
      return;
    }

    const label =
      comparableText($(element).text());

    const value =
      normalizeText(definition.text());

    if (label && value) {
      values.set(label, value);
    }
  });

  return values;
}

function readValue(
  values: Map<string, string>,
  labels: string[],
): string {
  for (const label of labels) {
    const wanted = comparableText(label);
    const direct = values.get(wanted);

    if (direct) {
      return direct;
    }

    for (
      const [storedLabel, value] of values
    ) {
      if (
        storedLabel.startsWith(wanted)
      ) {
        return value;
      }
    }
  }

  return "";
}

function parseIsoDate(
  value: string,
): string {
  const iso = value.match(
    /\b(\d{4})-(\d{2})-(\d{2})\b/,
  );

  if (iso) {
    return `${iso[1]}-${iso[2]}-${iso[3]}`;
  }

  const swedish = value.match(
    /\b(\d{1,2})[./-](\d{1,2})[./-](\d{4})\b/,
  );

  if (swedish) {
    return (
      `${swedish[3]}-` +
      `${swedish[2].padStart(2, "0")}-` +
      swedish[1].padStart(2, "0")
    );
  }

  return "";
}

function createLiveloxUrl(
  href: string,
  baseUrl: string,
): string | null {
  try {
    const link = new URL(href, baseUrl);

    if (
      link.hostname
        .toLocaleLowerCase("sv-SE")
        .includes("livelox")
    ) {
      link.protocol = "https:";
      link.hash = "";
      return link.toString();
    }

    if (
      !link.pathname
        .toLocaleLowerCase("sv-SE")
        .includes("redirecttolivelox")
    ) {
      return null;
    }

    const redirect =
      link.searchParams.get("url") ??
      link.searchParams.get("targetUrl") ??
      link.searchParams.get("redirectUrl");

    if (!redirect) {
      return null;
    }

    const decoded =
      decodeURIComponent(redirect);

    const livelox =
      new URL(decoded, "https://www.livelox.com");

    livelox.protocol = "https:";
    livelox.hostname = "www.livelox.com";
    livelox.hash = "";

    return livelox.toString();
  } catch {
    return null;
  }
}

function findLiveloxUrl(
  html: string,
  baseUrl: string,
  raceClass: string,
): string | null {
  const $ = cheerio.load(html);
  const normalizedClass =
    comparableText(raceClass);

  let fallback: string | null = null;

  $("a[href]").each((_index, element) => {
    if (fallback && !normalizedClass) {
      return;
    }

    const href = $(element).attr("href");

    if (!href) {
      return;
    }

    const livelox =
      createLiveloxUrl(href, baseUrl);

    if (!livelox) {
      return;
    }

    fallback ??= livelox;

    const context = comparableText(
      $(element)
        .closest("tr, li, div")
        .text(),
    );

    if (
      normalizedClass &&
      context.includes(normalizedClass)
    ) {
      fallback = livelox;
      return false;
    }
  });

  return fallback;
}

export async function readEventorMetadata(
  match: EventorMatch,
  raceClass: string,
): Promise<EventorMetadata> {
  const [eventHtml, resultHtml] =
    await Promise.all([
      fetchText(match.eventorUrl),
      fetchText(match.resultListUrl),
    ]);

  const $ = cheerio.load(eventHtml);
  const values = readLabelledValues($);

  const heading =
    normalizeText(
      $("h1, h2")
        .first()
        .text(),
    );

  const title =
    readValue(values, ["Tävling"]) ||
    heading ||
    match.title;

  const rawDate =
    readValue(values, ["Datum"]);

  return {
    eventId: match.eventId,
    eventorUrl: match.eventorUrl,
    resultListUrl:
      match.resultListUrl,
    title,
    date: parseIsoDate(rawDate),
    organiser: readValue(values, [
      "Arrangörsorganisation",
      "Arrangör",
    ]),
    location: readValue(values, [
      "Arena",
      "Tävlingsplats",
      "Tävlingsområde",
      "Plats",
    ]),
    rawDiscipline: readValue(values, [
      "Tävlingsdistans",
      "Distans",
    ]),
    liveloxUrl: findLiveloxUrl(
      resultHtml,
      match.resultListUrl,
      raceClass,
    ),
  };
}
