import { readDomaCompetition } from "../index";
import {
  loadWinSplits,
  type WinSplitsRunner,
} from "../../../../studio/src/lib/winsplits";
import {
  resolveEventorEvent,
} from "./eventor-resolver";
import {
  readEventorMetadata,
} from "./eventor-metadata";
import {
  cleanOptional,
  comparableText,
  normalizeName,
} from "./text";
import type {
  CompetitionDiscipline,
  EnrichedDomaCompetition,
} from "./types";

export type {
  CompetitionDiscipline,
  EnrichedDomaCompetition,
  EnrichedMistake,
  EventorMatch,
  EventorMetadata,
} from "./types";

function readWinSplitsIds(
  urlValue: string,
): {
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
      "DOMA:s WinSplits-länk saknar ett giltigt " +
        "databaseId eller categoryId.",
    );
  }

  return {
    databaseId,
    categoryId,
  };
}

function findRunner(
  runners: WinSplitsRunner[],
  runnerName: string,
): WinSplitsRunner | null {
  const wanted = normalizeName(runnerName);

  return (
    runners.find(
      (runner) =>
        normalizeName(runner.name) ===
        wanted,
    ) ?? null
  );
}

function classifyDiscipline(
  relayLeg: number | null,
  eventorDiscipline: string,
  title: string | null,
): CompetitionDiscipline {
  if (relayLeg !== null) {
    return "Stafett";
  }

  const text = comparableText(
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

  if (/\bsprint\b/.test(text)) {
    return "Sprint";
  }

  if (/\b(natt|night)\b/.test(text)) {
    return "Natt";
  }

  return text ? "Annan" : "Okänd";
}

export async function readEnrichedDomaCompetition(
  domaUrl: string,
  runnerName = "Erik Martinsson",
): Promise<EnrichedDomaCompetition> {
  const doma =
    await readDomaCompetition(domaUrl);

  if (!doma.title || !doma.date) {
    throw new Error(
      "DOMA-posten saknar titel eller datum.",
    );
  }

  if (!doma.winsplitsUrl) {
    throw new Error(
      `DOMA-karta ${doma.mapId} saknar WinSplits-länk.`,
    );
  }

  const ids =
    readWinSplitsIds(doma.winsplitsUrl);

  /*
   * WinSplits behöver inte längre leverera
   * tävlingens titel eller datum. DOMA är facit
   * för båda värdena.
   */
  const [runners, eventorResolution] =
    await Promise.all([
      loadWinSplits(
        ids.databaseId,
        ids.categoryId,
      ),
      resolveEventorEvent(
        doma.title,
        doma.date,
        ids.databaseId,
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

  const eventorMatch =
    eventorResolution.match;

  const eventor =
    eventorMatch
      ? await readEventorMetadata(
          eventorMatch,
          "",
        )
      : null;

  if (!eventorMatch) {
    warnings.push(
      "Ingen tillräckligt säker Eventor-träff hittades.",
    );
  } else if (
    eventorMatch.verificationMethod ===
    "title-only"
  ) {
    warnings.push(
      "Eventor-träffen bygger på en entydig exakt " +
        "titelmatchning. Eventor exponerade inget " +
        "verifierbart WinSplits databaseId.",
    );
  }

  if (eventor && !eventor.liveloxUrl) {
    warnings.push(
      "Ingen Livelox-länk hittades i Eventors resultatlista.",
    );
  }

  const raceClass =
    cleanOptional(
      /*
       * WinSplits-löparobjektet innehåller inte
       * klassnamnet. Klassen hämtas därför från
       * DOMA-länkens categoryId tills vi lägger till
       * separat klassrubriksläsning i WinSplits.
       */
      null,
    );

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
      eventor?.rawDiscipline ?? "",
      doma.title,
    ),

    result: {
      runnerName,
      raceClass,
      club: cleanOptional(runner.club),
      position:
        cleanOptional(runner.place),
      starters:
        String(runners.length),
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
    eventorMatch,
    eventorResolverDebug:
      eventorResolution.debug,
    liveloxUrl:
      eventor?.liveloxUrl ?? null,
    warnings,
  };
}
