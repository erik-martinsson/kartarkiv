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

type XmlMetadata = {
  distanceKm: string;
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

function parseDistanceKm(
  value: unknown,
): string {
  const text = cleanText(value);

  if (!text) {
    return "";
  }

  const numeric = Number(
    text.replace(",", "."),
  );

  if (
    !Number.isFinite(numeric) ||
    numeric <= 0
  ) {
    return "";
  }

  /*
   * IOF/Eventor anger normalt banlängd i meter.
   * Om värdet redan är ett rimligt km-värde behålls det.
   */
  const kilometres =
    numeric > 100
      ? numeric / 1000
      : numeric;

  return String(
    Number(kilometres.toFixed(3)),
  );
}

function findDistanceInRecord(
  value: unknown,
): string {
  const directKeys = [
    "CourseLength",
    "RaceCourseLength",
    "Length",
    "Distance",
    "@_length",
    "@_courseLength",
  ];

  function visit(
    current: unknown,
  ): string {
    if (Array.isArray(current)) {
      for (const item of current) {
        const found = visit(item);
        if (found) return found;
      }
      return "";
    }

    const object = asRecord(current);
    if (!object) return "";

    for (const key of directKeys) {
      if (key in object) {
        const found = parseDistanceKm(
          object[key],
        );
        if (found) return found;
      }
    }

    for (const child of Object.values(object)) {
      const found = visit(child);
      if (found) return found;
    }

    return "";
  }

  return visit(value);
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
          findDistanceInRecord(
            raceInfo,
          ) ||
          findDistanceInRecord(
            eventClass,
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

function collectStrings(
  value: unknown,
): string[] {
  const strings: string[] = [];

  function visit(
    current: unknown,
  ): void {
    if (
      typeof current === "string" ||
      typeof current === "number"
    ) {
      const text = cleanText(current);
      if (text) strings.push(text);
      return;
    }

    if (Array.isArray(current)) {
      current.forEach(visit);
      return;
    }

    const object = asRecord(current);
    if (!object) return;

    Object.values(object).forEach(visit);
  }

  visit(value);
  return strings;
}

function parseWinSplitsCandidatesFromXml(
  ...sources: unknown[]
): XmlMetadata["winsplitsCandidates"] {
  const candidates = new Map<
    string,
    { databaseId: number; categoryId: number }
  >();

  for (const text of sources.flatMap(collectStrings)) {
    const decoded = text.replace(/&amp;/gi, "&");
    const urls = decoded.match(/https?:\/\/[^\s<>"']+/gi) ?? [decoded];

    for (const raw of urls) {
      try {
        const url = new URL(raw, EVENTOR_BASE_URL);
        if (
          !url.hostname.toLocaleLowerCase("sv-SE").includes("orientering.se") ||
          !url.pathname.toLocaleLowerCase("sv-SE").includes("winsplits")
        ) {
          continue;
        }

        const databaseId = Number(
          url.searchParams.get("databaseId"),
        );
        const categoryId = Number(
          url.searchParams.get("categoryId"),
        );

        if (
          Number.isInteger(databaseId) &&
          databaseId > 0 &&
          Number.isInteger(categoryId) &&
          categoryId >= 0
        ) {
          candidates.set(
            `${databaseId}:${categoryId}`,
            { databaseId, categoryId },
          );
        }
      } catch {
        // Texten var ingen URL.
      }
    }
  }

  return [...candidates.values()];
}

function createLiveloxViewerUrl(
  eventId: number,
  classId: number | null,
): string | null {
  if (!classId) {
    return null;
  }

  const url = new URL(
    "/Viewer",
    "https://www.livelox.com",
  );

  url.searchParams.set(
    "eventExternalIdentifier",
    `0:${eventId}-1`,
  );
  url.searchParams.set(
    "classExternalId",
    `${classId}-1`,
  );

  return url.toString();
}

function parseXmlMetadata(
  eventId: number,
  eventClass: EventorClass,
  eventXml: unknown,
  classesXml: unknown,
  resultXml: unknown,
): XmlMetadata {
  return {
    distanceKm:
      eventClass.distanceKm ||
      findDistanceInRecord(resultXml),
    winsplitsCandidates:
      parseWinSplitsCandidatesFromXml(
        eventXml,
        classesXml,
        resultXml,
      ),
    liveloxUrl:
      createLiveloxViewerUrl(
        eventId,
        eventClass.id,
      ),
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
  candidates: XmlMetadata[
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
  ]);

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

  const xmlMetadata =
    parseXmlMetadata(
      eventId,
      eventClass,
      eventXml,
      classesXml,
      resultXml,
    );

  const {
    winsplits,
    runner:
      winSplitsRunner,
  } = await resolveWinSplits(
    xmlMetadata
      .winsplitsCandidates,
    runnerName,
    eventClass.name,
  );

  /*
   * Ansvarsfördelning:
   *
   * Eventors XML-API:
   * titel, datum, arrangör, plats, disciplin, klass,
   * banlängd, placering, startande och Livelox-länk.
   *
   * WinSplits används när XML-svaret innehåller en
   * WinSplits-referens; annars används Eventors resultatdata.
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
      xmlMetadata.distanceKm,
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
      xmlMetadata.liveloxUrl,
  };
}