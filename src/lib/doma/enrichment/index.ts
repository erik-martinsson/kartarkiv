import { readDomaCompetition } from "../index";
import {
  loadWinSplits,
  type WinSplitsRunner,
} from "../../../../studio/src/lib/winsplits";
import { getEventLinks } from "./eventor-links";
import {
  resolveEventorFromWinSplits,
} from "./resolve-eventor";
import type {
  CompetitionDiscipline,
  EnrichedDomaCompetition,
} from "./types";

export type {
  CompetitionDiscipline,
  EnrichedDomaCompetition,
  EnrichedMistake,
} from "./types";

function normalizeName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .toLocaleLowerCase("sv-SE")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findRunner(
  runners: WinSplitsRunner[],
  runnerName: string,
): WinSplitsRunner | null {
  const wanted = normalizeName(runnerName);

  return (
    runners.find(
      (runner) =>
        normalizeName(runner.name) === wanted,
    ) ?? null
  );
}

function readWinSplitsIds(urlValue: string): {
  databaseId: number;
  categoryId: number;
} {
  const url = new URL(urlValue);
  const databaseId = Number(
    url.searchParams.get("databaseId"),
  );
  const categoryId = Number(
    url.searchParams.get("categoryId"),
  );

  if (
    !Number.isInteger(databaseId) ||
    databaseId <= 0 ||
    !Number.isInteger(categoryId) ||
    categoryId <= 0
  ) {
    throw new Error(
      "DOMA:s WinSplits-länk saknar giltigt databaseId eller categoryId.",
    );
  }

  return {
    databaseId,
    categoryId,
  };
}

function normalizeDisciplineText(
  value: string,
): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .toLocaleLowerCase("sv-SE")
    .replace(/[–—−]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function classifyDiscipline(
  relayLeg: number | null,
  eventorDiscipline: string,
  title: string | null,
): CompetitionDiscipline {
  if (relayLeg !== null) {
    return "Stafett";
  }

  const text = normalizeDisciplineText(
    `${eventorDiscipline} ${title ?? ""}`,
  );

  if (
    /\b(stafett|relay|kavle|budkavle)\b/.test(text)
  ) {
    return "Stafett";
  }

  if (
    /\b(ultralang|ultra lang)\b/.test(text)
  ) {
    return "Ultralång";
  }

  if (
    /\b(medel|middle)\b/.test(text)
  ) {
    return "Medel";
  }

  if (
    /\b(lang|long)\b/.test(text)
  ) {
    return "Lång";
  }

  if (
    /\b(sprint)\b/.test(text)
  ) {
    return "Sprint";
  }

  if (
    /\b(natt|night)\b/.test(text)
  ) {
    return "Natt";
  }

  return text ? "Annan" : "Okänd";
}

function cleanOptional(
  value: string | null | undefined,
): string | null {
  const normalized = value?.trim() ?? "";
  return normalized || null;
}

export async function readEnrichedDomaCompetition(
  domaUrl: string,
  runnerName = "Erik Martinsson",
): Promise<EnrichedDomaCompetition> {
  const doma =
    await readDomaCompetition(domaUrl);

  if (!doma.winsplitsUrl) {
    throw new Error(
      `DOMA-karta ${doma.mapId} saknar WinSplits-länk. ` +
        "Eventor-matchning och bomanalys kan därför inte göras automatiskt.",
    );
  }

  const ids =
    readWinSplitsIds(doma.winsplitsUrl);

  const [resolution, runners] =
    await Promise.all([
      resolveEventorFromWinSplits(
        doma.winsplitsUrl,
      ),
      loadWinSplits(
        ids.databaseId,
        ids.categoryId,
      ),
    ]);

  const runner =
    findRunner(runners, runnerName);

  if (!runner) {
    throw new Error(
      `${runnerName} hittades inte i WinSplits-klassen. ` +
        `Klassen innehöll ${runners.length} löpare.`,
    );
  }

  const warnings = [...doma.warnings];
  let eventor:
    EnrichedDomaCompetition["eventor"] = null;
  let liveloxUrl: string | null = null;
  let rawEventorDiscipline = "";

  if (resolution.eventor) {
    const eventLinks =
      await getEventLinks(
        resolution.eventor.eventId,
        runnerName,
      );

    rawEventorDiscipline =
      eventLinks.discipline;

    eventor = {
      eventId: eventLinks.eventId,
      verified: resolution.verified,
      eventorUrl: eventLinks.eventorUrl,
      resultListUrl:
        eventLinks.resultListUrl,
      title: eventLinks.title,
      date: eventLinks.date,
      organiser: eventLinks.club,
      location: eventLinks.location,
      rawDiscipline:
        eventLinks.discipline,
    };

    liveloxUrl =
      eventLinks.liveloxUrl;

    if (!resolution.verified) {
      warnings.push(
        "Eventor-träffen bygger på en entydig namnmatchning men kunde inte verifieras via WinSplits databaseId.",
      );
    }

    if (!liveloxUrl) {
      warnings.push(
        "Ingen klasspecifik Livelox-länk hittades i Eventor.",
      );
    }
  } else {
    warnings.push(
      "Ingen tillräckligt säker Eventor-träff hittades.",
    );
  }

  return {
    doma: {
      mapId: doma.mapId,
      sourceUrl: doma.sourceUrl,
      title: doma.title,
      date: doma.date,
      category: doma.category,
      relayLeg: doma.relayLeg,
      runningTime: doma.runningTime,
      runningDistanceKm:
        doma.runningDistanceKm,
      routeMapImageUrl:
        doma.routeMapImageUrl,
      blankMapImageUrl:
        doma.blankMapImageUrl,
      kmlUrl: doma.kmlUrl,
      winsplitsUrl:
        doma.winsplitsUrl,
    },

    discipline: classifyDiscipline(
      doma.relayLeg,
      rawEventorDiscipline,
      doma.title,
    ),

    result: {
      runnerName,
      raceClass:
        cleanOptional(
          resolution.directImport.raceClass,
        ),
      club: cleanOptional(runner.club),
      position:
        cleanOptional(runner.place),
      starters:
        cleanOptional(
          resolution.directImport.starters,
        ),
      controls: runner.controls,
      time:
        cleanOptional(runner.totalTime),
      totalMistakeTime:
        cleanOptional(runner.totalMistake) ??
        "0:00",
      mistakes: runner.mistakes.map(
        (mistake) => ({
          control: mistake.control,
          time: mistake.loss,
        }),
      ),
    },

    eventor,
    liveloxUrl,
    warnings,
  };
}
