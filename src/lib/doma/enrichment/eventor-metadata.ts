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

type RunnerClassInformation = {
  raceClass: string;
  distanceKm: number | null;
};

function decodeHtmlText(
  html: string,
): string {
  return normalizeText(
    cheerio
      .load(`<div>${html}</div>`)("div")
      .text(),
  );
}

function normalizeRunnerName(
  value: string,
): string {
  return comparableText(value)
    .replace(/\s+/g, " ")
    .trim();
}

function parseDistanceKm(
  value: string,
): number | null {
  const meterMatch = value.match(
    /\b(\d[\d\s]{2,6})\s*m\b/i,
  );

  if (meterMatch) {
    const meters = Number(
      meterMatch[1].replace(/\s+/g, ""),
    );

    if (
      Number.isFinite(meters) &&
      meters >= 200 &&
      meters <= 100_000
    ) {
      return Number(
        (meters / 1_000).toFixed(3),
      );
    }
  }

  const kilometerMatch = value
    .replace(",", ".")
    .match(
      /\b(\d+(?:\.\d+)?)\s*km\b/i,
    );

  if (!kilometerMatch) {
    return null;
  }

  const kilometers =
    Number(kilometerMatch[1]);

  return (
    Number.isFinite(kilometers) &&
    kilometers >= 0.2 &&
    kilometers <= 100
  )
    ? Number(kilometers.toFixed(3))
    : null;
}

function cleanClassName(
  value: string,
): string {
  return normalizeText(value)
    .replace(
      /^(?:klass|class)\s*:?\s*/i,
      "",
    )
    .replace(
      /\s+\d[\d\s]{2,6}\s*m\b.*$/i,
      "",
    )
    .replace(
      /\s+\d+(?:[.,]\d+)?\s*km\b.*$/i,
      "",
    )
    .replace(
      /\s*,?\s*\d+\s+(?:startande|starting competitors|starters)\b.*$/i,
      "",
    )
    .trim();
}

function parseClassLine(
  value: string,
): RunnerClassInformation | null {
  const text = normalizeText(value)
    .replace(/[()[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) {
    return null;
  }

  /*
   * Läs klass och längd i samma regex så att första
   * siffran i exempelvis "H21 5 300 m" inte råkar
   * hamna i klassnamnet.
   */
  const meterMatch = text.match(
    /^(.+?)\s+(\d(?:[\d\s]*\d)?)\s*m\b/i,
  );

  if (meterMatch) {
    const raceClass =
      cleanClassName(meterMatch[1]);

    const meters = Number(
      meterMatch[2].replace(/\s+/g, ""),
    );

    if (
      raceClass &&
      raceClass.length <= 100 &&
      Number.isFinite(meters) &&
      meters >= 200 &&
      meters <= 100_000
    ) {
      return {
        raceClass,
        distanceKm: Number(
          (meters / 1_000).toFixed(3),
        ),
      };
    }
  }

  const kilometerMatch = text
    .replace(",", ".")
    .match(
      /^(.+?)\s+(\d+(?:\.\d+)?)\s*km\b/i,
    );

  if (!kilometerMatch) {
    return null;
  }

  const raceClass =
    cleanClassName(kilometerMatch[1]);

  const kilometers =
    Number(kilometerMatch[2]);

  if (
    !raceClass ||
    raceClass.length > 100 ||
    !Number.isFinite(kilometers) ||
    kilometers < 0.2 ||
    kilometers > 100
  ) {
    return null;
  }

  return {
    raceClass,
    distanceKm: Number(
      kilometers.toFixed(3),
    ),
  };
}

function findRunnerClassInformation(
  html: string,
  runnerName: string,
): RunnerClassInformation | null {
  const $ = cheerio.load(html);
  const wantedName =
    normalizeRunnerName(runnerName);

  let runnerRowElement:
    Parameters<typeof $>[0] | null = null;

  $("tr").each((_index, element) => {
    if (runnerRowElement) {
      return;
    }

    const rowText =
      normalizeRunnerName($(element).text());

    if (
      rowText &&
      rowText.includes(wantedName)
    ) {
      runnerRowElement = element;
    }
  });

  if (runnerRowElement) {
    const runnerRow =
      $(runnerRowElement);

    /*
     * Sök först bland tidigare syskon i samma tabell.
     */
    let previous =
      runnerRow.prev();

    for (
      let step = 0;
      previous.length > 0 && step < 40;
      step += 1
    ) {
      const information =
        parseClassLine(previous.text());

      if (information) {
        return information;
      }

      previous = previous.prev();
    }

    /*
     * Därefter i rubriker och närliggande block före tabellen.
     */
    const table = runnerRow.closest("table");
    let block = table.prev();

    for (
      let step = 0;
      block.length > 0 && step < 20;
      step += 1
    ) {
      const information =
        parseClassLine(block.text());

      if (information) {
        return information;
      }

      block = block.prev();
    }
  }

  /*
   * Reservmetod: hitta löparens position i den avkodade
   * resultatsidan och välj den sista klass-/längdraden före
   * löparen. Detta fungerar även när Eventor använder en
   * ovanlig tabellstruktur.
   */
  const decoded =
    decodeHtmlText(html);

  const runnerIndex =
    normalizeRunnerName(decoded)
      .indexOf(wantedName);

  if (runnerIndex < 0) {
    return null;
  }

  const beforeRunner =
    decoded.slice(
      Math.max(0, runnerIndex - 60_000),
      runnerIndex,
    );

  const candidates:
    RunnerClassInformation[] = [];

  const patterns = [
    /([^\n\r]{1,120}?\b\d[\d\s]{2,6}\s*m\b(?:\s*,?\s*\d+\s+(?:startande|starting competitors|starters))?)/giu,
    /([^\n\r]{1,120}?\b\d+(?:[.,]\d+)?\s*km\b(?:\s*,?\s*\d+\s+(?:startande|starting competitors|starters))?)/giu,
  ];

  for (const pattern of patterns) {
    for (
      const match of beforeRunner.matchAll(
        pattern,
      )
    ) {
      const information =
        parseClassLine(match[1]);

      if (information) {
        candidates.push(information);
      }
    }
  }

  return candidates.at(-1) ?? null;
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
  runnerName: string,
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

  const runnerClass =
    findRunnerClassInformation(
      resultHtml,
      runnerName,
    );

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
    raceClass:
      runnerClass?.raceClass ?? "",
    distanceKm:
      runnerClass?.distanceKm ?? null,
    liveloxUrl: findLiveloxUrl(
      resultHtml,
      match.resultListUrl,
      runnerClass?.raceClass ?? "",
    ),
  };
}