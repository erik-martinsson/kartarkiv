import * as cheerio from "cheerio";
import { XMLParser } from "fast-xml-parser";
import {
  loadWinSplitsWithMetadata,
} from "@/lib/winsplits";

const EVENTOR_BASE_URL =
  "https://eventor.orientering.se";

const WINSPLITS_BASE_URL =
  "https://obasen.orientering.se/winsplits/online/sv/default.asp";

const REQUEST_TIMEOUT_MS = 30_000;

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

type XmlRecord =
  Record<string, unknown>;

type EventorRunner = {
  name: string;
  club: string;
  raceClass: string;
  classId: number | null;
  time: string;
  position: string;
  controls: number;
};

type EventorClass = {
  id: number | null;
  name: string;
  starters: number;
  distanceKm: string;
};

type ResultPageMetadata = {
  distanceKm: string;
  starters: number;
  winsplitsCandidates: Array<{
    databaseId: number;
    categoryId: number;
  }>;
  liveloxUrl: string | null;
};

const xmlParser =
  new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    textNodeName: "#text",
    trimValues: true,
    parseTagValue: false,
    parseAttributeValue: false,
    removeNSPrefix: true,
  });

function asRecord(
  value: unknown,
): XmlRecord | null {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  )
    ? value as XmlRecord
    : null;
}

function asArray<T>(
  value: T | T[] | null | undefined,
): T[] {
  if (
    value === null ||
    value === undefined
  ) {
    return [];
  }

  return Array.isArray(value)
    ? value
    : [value];
}

function firstValue(
  source: XmlRecord | null,
  ...keys: string[]
): unknown {
  if (!source) {
    return undefined;
  }

  for (const key of keys) {
    const current = source[key];

    if (
      current !== null &&
      current !== undefined
    ) {
      return current;
    }
  }

  return undefined;
}

function cleanText(
  value: unknown,
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value)
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  const object = asRecord(value);

  return object && "#text" in object
    ? cleanText(object["#text"])
    : "";
}

function childText(
  source: XmlRecord | null,
  ...keys: string[]
): string {
  return cleanText(
    firstValue(source, ...keys),
  );
}

function findByKey(
  value: unknown,
  wantedKey: string,
): unknown[] {
  const found: unknown[] = [];

  function visit(
    current: unknown,
  ): void {
    if (Array.isArray(current)) {
      current.forEach(visit);
      return;
    }

    const object = asRecord(current);

    if (!object) {
      return;
    }

    for (
      const [key, child] of
      Object.entries(object)
    ) {
      if (key === wantedKey) {
        found.push(
          ...asArray(child),
        );
      }

      visit(child);
    }
  }

  visit(value);

  return found;
}

function numericId(
  value: unknown,
): number | null {
  const object = asRecord(value);

  const raw =
    object
      ? firstValue(
          object,
          "@_id",
          "EventClassId",
          "Id",
        )
      : value;

  const parsed =
    Number(cleanText(raw));

  return (
    Number.isInteger(parsed) &&
    parsed > 0
  )
    ? parsed
    : null;
}

function normalizeName(
  value: string,
): string {
  return cleanText(value)
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .toLocaleLowerCase("sv-SE")
    .replace(/[’'`´]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function nameScore(
  candidate: string,
  wanted: string,
): number {
  const left =
    normalizeName(candidate);

  const right =
    normalizeName(wanted);

  if (!left || !right) {
    return 0;
  }

  if (left === right) {
    return 100;
  }

  const leftParts =
    left.split(" ").filter(Boolean);

  const rightParts =
    right.split(" ").filter(Boolean);

  const leftSet =
    new Set(leftParts);

  const rightSet =
    new Set(rightParts);

  if (
    rightParts.every(
      (part) => leftSet.has(part),
    )
  ) {
    return 95;
  }

  if (
    leftParts.every(
      (part) => rightSet.has(part),
    )
  ) {
    return 92;
  }

  const shared =
    rightParts.filter(
      (part) => leftSet.has(part),
    ).length;

  return Math.round(
    Math.min(
      89,
      shared /
        Math.max(
          1,
          rightParts.length,
        ) *
        60 +
      shared /
        Math.max(
          1,
          leftParts.length,
        ) *
        25,
    ),
  );
}

function normalizeTime(
  value: string | undefined,
): string {
  const normalized =
    cleanText(value);

  if (!normalized) {
    return "";
  }

  const hms =
    normalized.match(
      /^(\d+):(\d{2}):(\d{2})(?:\.\d+)?$/,
    );

  if (hms) {
    const hours =
      Number(hms[1]);

    return hours > 0
      ? `${hours}:${hms[2]}:${hms[3]}`
      : `${Number(hms[2])}:${hms[3]}`;
  }

  /*
   * WinSplits använder ibland punkt mellan
   * minuter och sekunder, exempelvis 38.29.
   */
  const minuteTime =
    normalized.match(
      /^(\d{1,3})[.:](\d{2})$/,
    );

  if (minuteTime) {
    return (
      `${Number(minuteTime[1])}:` +
      `${minuteTime[2]}`
    );
  }

  const seconds =
    Number(normalized);

  if (
    Number.isFinite(seconds) &&
    seconds >= 0
  ) {
    const rounded =
      Math.round(seconds);

    const hours =
      Math.floor(rounded / 3600);

    const minutes =
      Math.floor(
        (rounded % 3600) / 60,
      );

    const remaining =
      rounded % 60;

    return hours > 0
      ? `${hours}:${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`
      : `${minutes}:${String(remaining).padStart(2, "0")}`;
  }

  return normalized;
}

function normalizeDiscipline(
  value: string,
): string {
  const normalized =
    cleanText(value)
      .toLocaleLowerCase("sv-SE");

  if (
    normalized.includes("ultralång") ||
    normalized.includes("ultralang") ||
    normalized.includes("ultra long")
  ) {
    return "Ultralång";
  }

  if (
    normalized.includes("medel") ||
    normalized.includes("middle")
  ) {
    return "Medel";
  }

  if (
    normalized.includes("sprint")
  ) {
    return "Sprint";
  }

  if (
    normalized.includes("natt") ||
    normalized.includes("night")
  ) {
    return "Natt";
  }

  if (
    normalized.includes("stafett") ||
    normalized.includes("relay")
  ) {
    return "Stafett";
  }

  if (
    normalized.includes("lång") ||
    normalized.includes("lang") ||
    normalized.includes("long")
  ) {
    return "Lång";
  }

  return "Annat";
}

function readDate(
  value: unknown,
): string {
  const direct =
    cleanText(value).match(
      /\b(\d{4}-\d{2}-\d{2})\b/,
    )?.[1];

  if (direct) {
    return direct;
  }

  const object =
    asRecord(value);

  return cleanText(
    firstValue(
      object,
      "Date",
      "EventDate",
    ),
  ).match(
    /\b(\d{4}-\d{2}-\d{2})\b/,
  )?.[1] ?? "";
}

function requireApiKey(): string {
  const key =
    process.env.EVENTOR_API_KEY
      ?.trim();

  if (!key) {
    throw new Error(
      "EVENTOR_API_KEY saknas. Lägg nyckeln i studio/.env.local och i Vercels Environment Variables.",
    );
  }

  return key;
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
): Promise<Response> {
  const controller =
    new AbortController();

  const timeout =
    setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT_MS,
    );

  try {
    return await fetch(
      url,
      {
        ...init,
        signal:
          controller.signal,
      },
    );
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

async function fetchEventorXml(
  path: string,
): Promise<unknown> {
  const response =
    await fetchWithTimeout(
      `${EVENTOR_BASE_URL}${path}`,
      {
        cache: "no-store",
        headers: {
          ApiKey:
            requireApiKey(),
          Accept:
            "application/xml,text/xml,*/*",
          "User-Agent":
            "KartarkivStudio/1.0",
        },
      },
    );

  const body =
    await response.text();

  if (!response.ok) {
    throw new Error(
      `Eventors API svarade med HTTP ${response.status}: ${cleanText(body).slice(0, 220)}`,
    );
  }

  return xmlParser.parse(body);
}

async function fetchResultHtml(
  resultListUrl: string,
): Promise<string | null> {
  try {
    const response =
      await fetchWithTimeout(
        resultListUrl,
        {
          cache: "no-store",
          redirect: "follow",
          headers: {
            ApiKey:
              requireApiKey(),
            Accept:
              "text/html,application/xhtml+xml,*/*",
            "Accept-Language":
              "sv-SE,sv;q=0.9,en;q=0.7",
            "User-Agent":
              "Mozilla/5.0 KartarkivStudio/1.0",
          },
        },
      );

    if (!response.ok) {
      console.error(
        "fetchResultHtml failed:",
        {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
        },
      );

      return null;
    }

    return response.text();
  } catch (error) {
    console.error(
      "fetchResultHtml failed:",
      error,
    );

    return null;
  }
}

function parsePersonName(
  personResult: XmlRecord,
): string {
  const person =
    asRecord(
      firstValue(
        personResult,
        "Person",
        "Competitor",
      ),
    );

  const personName =
    asRecord(
      firstValue(
        person,
        "PersonName",
        "Name",
      ),
    );

  const given =
    childText(
      personName,
      "Given",
      "GivenName",
      "FirstName",
    );

  const family =
    childText(
      personName,
      "Family",
      "FamilyName",
      "LastName",
    );

  return (
    cleanText(
      `${given} ${family}`,
    ) ||
    childText(
      person,
      "DisplayName",
      "Name",
    ) ||
    childText(
      personResult,
      "Name",
    )
  );
}

function parseOrganisationName(
  personResult: XmlRecord,
): string {
  const organisation =
    asRecord(
      firstValue(
        personResult,
        "Organisation",
        "Club",
      ),
    );

  return (
    childText(
      organisation,
      "Name",
      "ShortName",
    ) ||
    childText(
      personResult,
      "OrganisationName",
      "ClubName",
    )
  );
}

function parseEventorRunners(
  resultXml: unknown,
): EventorRunner[] {
  const runners:
    EventorRunner[] = [];

  for (
    const classValue of
    findByKey(
      resultXml,
      "ClassResult",
    )
  ) {
    const classResult =
      asRecord(classValue);

    if (!classResult) {
      continue;
    }

    const eventClassValue =
      firstValue(
        classResult,
        "EventClass",
        "Class",
      );

    const eventClass =
      asRecord(eventClassValue);

    const raceClass =
      childText(
        eventClass,
        "Name",
        "ClassName",
      ) ||
      childText(
        classResult,
        "ClassName",
        "Name",
      );

    for (
      const personValue of
      asArray(
        firstValue(
          classResult,
          "PersonResult",
          "TeamResult",
        ),
      )
    ) {
      const personResult =
        asRecord(personValue);

      if (!personResult) {
        continue;
      }

      const name =
        parsePersonName(
          personResult,
        );

      if (!name) {
        continue;
      }

      const result =
        asRecord(
          firstValue(
            personResult,
            "Result",
            "RaceResult",
          ),
        );

      const splitTimes =
        asArray(
          firstValue(
            result,
            "SplitTime",
          ),
        );

      const controls =
        splitTimes.filter(
          (splitValue) => {
            const split =
              asRecord(splitValue);

            const code =
              childText(
                split,
                "ControlCode",
                "ControlId",
              );

            /*
             * Eventor kan ta med målstämplingen
             * som kontrollkod 100.
             */
            return (
              code !== "100" &&
              code !== "999"
            );
          },
        ).length;

      runners.push({
        name,
        club:
          parseOrganisationName(
            personResult,
          ),
        raceClass,
        classId:
          numericId(
            eventClassValue,
          ),
        time:
          normalizeTime(
            childText(
              result,
              "Time",
              "ResultTime",
            ),
          ),
        position:
          childText(
            result,
            "ResultPosition",
            "Position",
            "Place",
          ),
        controls,
      });
    }
  }

  return runners;
}

function findRunner(
  runners: EventorRunner[],
  wantedName: string,
): EventorRunner | null {
  const ranked =
    runners
      .map((runner) => ({
        runner,
        score:
          nameScore(
            runner.name,
            wantedName,
          ),
      }))
      .filter(
        ({ score }) =>
          score > 0,
      )
      .sort(
        (left, right) =>
          right.score -
          left.score,
      );

  if (
    !ranked[0] ||
    ranked[0].score < 90
  ) {
    return null;
  }

  if (
    ranked[1] &&
    ranked[1].score ===
      ranked[0].score
  ) {
    return null;
  }

  return ranked[0].runner;
}

function parseDistanceKmValue(
  value: unknown,
): string {
  const record = asRecord(value);
  const rawText = cleanText(
    record
      ? firstValue(
          record,
          "#text",
          "Value",
          "Length",
          "Distance",
        )
      : value,
  );

  if (!rawText) {
    return "";
  }

  const normalized = rawText
    .replace(/\u00a0/g, " ")
    .replace(/,/g, ".")
    .trim();

  const match = normalized.match(
    /(-?\d+(?:\.\d+)?)\s*(km|kilometer|kilometre|m|meter|metre)?/i,
  );

  if (!match) {
    return "";
  }

  const numeric = Number(match[1]);

  if (!Number.isFinite(numeric) || numeric <= 0) {
    return "";
  }

  const unit = (
    match[2] ||
    cleanText(
      record
        ? firstValue(
            record,
            "@_unit",
            "@_unitCode",
            "Unit",
          )
        : undefined,
    )
  ).toLocaleLowerCase("sv-SE");

  const kilometres =
    unit.startsWith("km") ||
    unit.startsWith("kilo")
      ? numeric
      : unit === "m" ||
        unit.startsWith("meter") ||
        unit.startsWith("metre") ||
        numeric >= 100
        ? numeric / 1000
        : numeric;

  if (kilometres <= 0 || kilometres > 100) {
    return "";
  }

  return String(
    Number(kilometres.toFixed(3)),
  );
}

function readClassDistanceKm(
  eventClass: XmlRecord,
  raceInfo: XmlRecord | null,
): string {
  const preferredKeys = [
    "CourseLength",
    "ClassCourseLength",
    "RaceCourseLength",
    "Length",
    "Distance",
  ];

  for (const source of [raceInfo, eventClass]) {
    if (!source) {
      continue;
    }

    for (const key of preferredKeys) {
      const direct = parseDistanceKmValue(
        firstValue(source, key),
      );

      if (direct) {
        return direct;
      }
    }

    const course = asRecord(
      firstValue(
        source,
        "Course",
        "RaceCourse",
      ),
    );

    if (course) {
      for (const key of preferredKeys) {
        const nested = parseDistanceKmValue(
          firstValue(course, key),
        );

        if (nested) {
          return nested;
        }
      }
    }
  }

  return "";
}

function parseEventorClasses(
  classesXml: unknown,
): EventorClass[] {
  return findByKey(
    classesXml,
    "EventClass",
  )
    .map((classValue) => {
      const eventClass =
        asRecord(classValue);

      if (!eventClass) {
        return null;
      }

      const name =
        childText(
          eventClass,
          "Name",
          "ClassName",
        );

      if (!name) {
        return null;
      }

      const raceInfo =
        asRecord(
          firstValue(
            eventClass,
            "ClassRaceInfo",
          ),
        );

      return {
        id:
          numericId(
            firstValue(
              eventClass,
              "EventClassId",
            ),
          ),
        name,
        starters:
          Number(
            childText(
              raceInfo,
              "@_noOfStarts",
              "NoOfStarts",
              "NumberOfStarts",
            ),
          ) || 0,
        distanceKm:
          readClassDistanceKm(
            eventClass,
            raceInfo,
          ),
      };
    })
    .filter(
      (
        item,
      ): item is EventorClass =>
        item !== null,
    );
}

function parseEventInformation(
  eventXml: unknown,
) {
  const root =
    asRecord(eventXml);

  const event =
    asRecord(
      firstValue(
        root,
        "Event",
      ),
    ) ??
    root;

  const eventRace =
    asRecord(
      firstValue(
        event,
        "EventRace",
        "Race",
      ),
    );

  const organiserWrapper =
    asRecord(
      firstValue(
        event,
        "Organiser",
      ),
    );

  const organiser =
    asRecord(
      firstValue(
        organiserWrapper,
        "Organisation",
      ),
    ) ??
    organiserWrapper;

  const arena =
    asRecord(
      firstValue(
        eventRace,
        "Arena",
        "EventCentre",
      ),
    ) ??
    asRecord(
      firstValue(
        event,
        "Arena",
        "EventCentre",
      ),
    );

  const wrsInfo =
    asRecord(
      firstValue(
        eventRace,
        "WRSInfo",
      ),
    );

  return {
    title:
      childText(
        event,
        "Name",
        "EventName",
      ),
    date:
      readDate(
        firstValue(
          eventRace,
          "RaceDate",
        ),
      ) ||
      readDate(
        firstValue(
          event,
          "StartDate",
          "EventDate",
          "Date",
        ),
      ),
    organiser:
      childText(
        organiser,
        "Name",
        "ShortName",
      ),
    location:
      childText(
        arena,
        "Name",
        "Address",
      ) ||
      childText(
        eventRace,
        "Location",
      ) ||
      childText(
        event,
        "Location",
        "Place",
      ),
    discipline:
      normalizeDiscipline(
        childText(
          wrsInfo,
          "Distance",
        ) ||
        childText(
          eventRace,
          "EventRaceDiscipline",
          "RaceDiscipline",
          "Discipline",
          "EventRaceFormat",
        ) ||
        childText(
          event,
          "EventForm",
          "Discipline",
        ),
      ),
  };
}

function decodeHtml(
  value: string,
): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&#x27;/gi, "'")
    .replace(/&nbsp;/gi, " ");
}

function buildLiveloxViewerUrl(
  redirectHref: string,
): string | null {
  let eventorUrl: URL;

  try {
    eventorUrl =
      new URL(
        redirectHref,
        EVENTOR_BASE_URL,
      );
  } catch {
    return null;
  }

  const redirectUrl =
    eventorUrl.searchParams.get(
      "redirectUrl",
    );

  if (!redirectUrl) {
    return null;
  }

  try {
    /*
     * Eventor lagrar den interna Livelox-sökvägen i
     * redirectUrl, exempelvis:
     *
     * /Viewer?eventExternalIdentifier=0%3A53201-1
     * &classExternalId=664496-1
     *
     * Den kan användas direkt mot www.livelox.com utan
     * att Eventors inloggningsberoende redirect följs.
     */
    const decodedPath =
      decodeURIComponent(
        redirectUrl,
      );

    const liveloxUrl =
      new URL(
        decodedPath,
        "https://www.livelox.com",
      );

    return (
      liveloxUrl.hostname
        .toLocaleLowerCase("sv-SE")
        .endsWith("livelox.com") &&
      liveloxUrl.pathname
        .toLocaleLowerCase("sv-SE")
        .startsWith("/viewer")
    )
      ? liveloxUrl.toString()
      : null;
  } catch {
    return null;
  }
}

function parseResultPageMetadata(
  html: string | null,
  raceClass: string,
): ResultPageMetadata {
  if (!html) {
    return {
      distanceKm: "",
      starters: 0,
      winsplitsCandidates: [],
      liveloxUrl: null,
    };
  }

  const $ =
    cheerio.load(html);

  const escapedClass =
    raceClass.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

  /*
   * Leta i enskilda element i stället för hela body-texten.
   * Cheerio kan annars slå ihop text från närliggande taggar,
   * exempelvis "H214 890 m, 32 startande".
   */
  const classHeaderPattern =
    new RegExp(
      `(?:^|\\s)${escapedClass}\\s*(\\d[\\d\\s]*)\\s*m\\s*,?\\s*(\\d+)\\s*startande(?:\\s|$)`,
      "i",
    );

  let classHeader:
    RegExpMatchArray | null = null;

  let shortestMatchingText =
    Number.POSITIVE_INFINITY;

  $("body *").each(
    (_, element) => {
      const elementText =
        cleanText(
          $(element).text(),
        );

      if (
        !elementText ||
        elementText.length >
          shortestMatchingText
      ) {
        return;
      }

      const match =
        elementText.match(
          classHeaderPattern,
        );

      if (match) {
        classHeader = match;
        shortestMatchingText =
          elementText.length;
      }
    },
  );

  /*
   * Reserv om resultatrubriken mot förmodan ligger direkt
   * i body utan ett eget omslutande element.
   */
  if (!classHeader) {
    classHeader =
      cleanText(
        $("body").text(),
      ).match(
        classHeaderPattern,
      );
  }

  const distanceKm =
    classHeader
      ? String(
          Number(
            (
              Number(
                classHeader[1]
                  .replace(
                    /\s+/g,
                    "",
                  ),
              ) / 1000
            ).toFixed(3),
          ),
        )
      : "";

  const starters =
    classHeader
      ? Number(
          classHeader[2],
        )
      : 0;

  const candidates =
    new Map<
      string,
      {
        databaseId: number;
        categoryId: number;
      }
    >();

  $("a[href]").each(
    (_, anchor) => {
      const href =
        decodeHtml(
          $(anchor).attr("href") ??
          "",
        );

      if (!href) {
        return;
      }

      let url: URL;

      try {
        url =
          new URL(
            href,
            EVENTOR_BASE_URL,
          );
      } catch {
        return;
      }

      if (
        url.hostname
          .toLocaleLowerCase("sv-SE") !==
          "obasen.orientering.se" ||
        !url.pathname
          .toLocaleLowerCase("sv-SE")
          .includes("/winsplits/")
      ) {
        return;
      }

      const databaseId =
        Number(
          url.searchParams.get(
            "databaseId",
          ),
        );

      const categoryId =
        Number(
          url.searchParams.get(
            "categoryId",
          ),
        );

      if (
        Number.isInteger(databaseId) &&
        databaseId > 0 &&
        Number.isInteger(categoryId) &&
        categoryId >= 0
      ) {
        candidates.set(
          `${databaseId}:${categoryId}`,
          {
            databaseId,
            categoryId,
          },
        );
      }
    },
  );

  let liveloxUrl:
    string | null = null;

  /*
   * Välj Livelox-länken i rätt klassblock.
   * Varje .eventClassHeader innehåller klassnamn,
   * banlängd, WinSplits och Livelox för samma klass.
   */
  $(".eventClassHeader").each(
    (_, header) => {
      if (liveloxUrl) {
        return;
      }

      const headerClass =
        cleanText(
          $(header)
            .find("h3")
            .first()
            .text(),
        );

      if (
        normalizeName(
          headerClass,
        ) !==
        normalizeName(
          raceClass,
        )
      ) {
        return;
      }

      const liveloxAnchor =
        $(header)
          .find(
            'a[href*="RedirectToLivelox"]',
          )
          .first();

      const rawHref =
        decodeHtml(
          liveloxAnchor.attr(
            "href",
          ) ?? "",
        );

      liveloxUrl =
        buildLiveloxViewerUrl(
          rawHref,
        );
    },
  );

  return {
    distanceKm,
    starters,
    winsplitsCandidates:
      [...candidates.values()],
    liveloxUrl,
  };
}

function createWinSplitsUrl(
  databaseId: number,
  categoryId: number,
): string {
  const url =
    new URL(
      WINSPLITS_BASE_URL,
    );

  url.searchParams.set(
    "page",
    "table",
  );

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

async function resolveWinSplits(
  candidates: ResultPageMetadata[
    "winsplitsCandidates"
  ],
  runnerName: string,
  raceClass: string,
) {
  const wantedClass =
    normalizeName(raceClass);

  const successful = [];

  for (const candidate of candidates) {
    try {
      const data =
        await loadWinSplitsWithMetadata(
          candidate.databaseId,
          candidate.categoryId,
        );

      const ranked =
        data.runners
          .map((runner) => ({
            runner,
            score:
              nameScore(
                runner.name,
                runnerName,
              ),
          }))
          .sort(
            (left, right) =>
              right.score -
              left.score,
          );

      const best =
        ranked[0];

      if (
        !best ||
        best.score < 90
      ) {
        continue;
      }

      const candidateClass =
        data.metadata.raceClass ||
        raceClass;

      successful.push({
        classMatches:
          !wantedClass ||
          normalizeName(
            candidateClass,
          ) === wantedClass,
        winsplits: {
          name:
            candidateClass,
          url:
            createWinSplitsUrl(
              candidate.databaseId,
              candidate.categoryId,
            ),
          databaseId:
            candidate.databaseId,
          categoryId:
            candidate.categoryId,
        } satisfies WinSplitsClassLink,
        runner:
          best.runner,
      });
    } catch {
      // Prova nästa WinSplits-länk.
    }
  }

  return (
    successful.find(
      (item) =>
        item.classMatches,
    ) ??
    successful[0] ?? {
      winsplits: null,
      runner: null,
    }
  );
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
    eventXml,
    classesXml,
    resultXml,
    resultHtml,
  ] = await Promise.all([
    fetchEventorXml(
      `/api/event/${eventId}`,
    ),
    fetchEventorXml(
      `/api/eventclasses?eventId=${eventId}`,
    ),
    fetchEventorXml(
      `/api/results/event?eventId=${eventId}&includeSplitTimes=true`,
    ),
    fetchResultHtml(
      resultListUrl,
    ),
  ]);

  console.log(
    "Result HTML:",
    resultHtml
      ? resultHtml.length
      : "NULL",
  );

  const eventInformation =
    parseEventInformation(
      eventXml,
    );

  const apiRunner =
    findRunner(
      parseEventorRunners(
        resultXml,
      ),
      runnerName,
    );

  if (!apiRunner) {
    throw new Error(
      `${runnerName} hittades inte i Eventors API-resultat för tävlingen.`,
    );
  }

  const eventClasses =
    parseEventorClasses(
      classesXml,
    );

  const eventClass =
    eventClasses.find(
      (item) =>
        item.id !== null &&
        item.id ===
          apiRunner.classId,
    ) ??
    eventClasses.find(
      (item) =>
        normalizeName(
          item.name,
        ) ===
        normalizeName(
          apiRunner.raceClass,
        ),
    ) ?? {
      id:
        apiRunner.classId,
      name:
        apiRunner.raceClass,
      starters: 0,
      distanceKm: "",
    };

  const pageMetadata =
    parseResultPageMetadata(
      resultHtml,
      eventClass.name,
    );

  const {
    winsplits,
    runner:
      winSplitsRunner,
  } = await resolveWinSplits(
    pageMetadata
      .winsplitsCandidates,
    runnerName,
    eventClass.name,
  );

  /*
   * Ansvarsfördelning:
   *
   * Eventor:
   * titel, datum, arrangör, plats, disciplin,
   * officiell banlängd, placering, startande.
   *
   * WinSplits:
   * tid, kontroller, bomtid och WinSplits-länk.
   */
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
      apiRunner.club,
    location:
      eventInformation.location,
    raceClass:
      eventClass.name,
    discipline:
      eventInformation.discipline,
    distanceKm:
      eventClass.distanceKm ||
      pageMetadata.distanceKm,
    time:
      normalizeTime(
        winSplitsRunner?.totalTime ||
        apiRunner.time,
      ),
    position:
      apiRunner.position ||
      winSplitsRunner?.place ||
      "",
    starters:
      String(
        pageMetadata.starters ||
        eventClass.starters ||
        0,
      ),
    controls:
      String(
        winSplitsRunner?.controls ??
        apiRunner.controls ??
        0,
      ),
    mistakeTime:
      normalizeTime(
        winSplitsRunner?.totalMistake,
      ) || "0:00",
    winsplits,
    liveloxUrl:
      pageMetadata.liveloxUrl,
  };
}