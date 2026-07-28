import {
  mkdir,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import {
  readEnrichedDomaCompetition,
} from "../src/lib/doma/enrichment";

const DEFAULT_MAP_ID = 356;
const DEFAULT_RUNNER =
  "Erik Martinsson";

function display(
  label: string,
  value: unknown,
): void {
  const rendered =
    value === null ||
    value === undefined ||
    value === ""
      ? "—"
      : String(value);

  console.log(
    `${label.padEnd(27, ".")}${rendered}`,
  );
}

async function main(): Promise<void> {
  const mapId = Number(
    process.argv[2] ??
      DEFAULT_MAP_ID,
  );

  if (
    !Number.isInteger(mapId) ||
    mapId <= 0
  ) {
    throw new Error(
      `Ogiltigt map-ID: ${process.argv[2]}`,
    );
  }

  const runnerName =
    process.argv[3] ??
    DEFAULT_RUNNER;

  const url = new URL(
    "http://www.lid1.se/erik/doma/show_map.php",
  );

  url.searchParams.set("user", "erik");
  url.searchParams.set(
    "map",
    String(mapId),
  );

  console.log(
    `Läser och berikar DOMA-karta ${mapId}`,
  );
  console.log(url.toString());
  console.log("");

  const competition =
    await readEnrichedDomaCompetition(
      url.toString(),
      runnerName,
    );

  display(
    "Titel",
    competition.doma.title,
  );
  display(
    "Datum",
    competition.doma.date,
  );
  display(
    "Disciplin",
    competition.discipline,
  );
  display(
    "Stafettsträcka",
    competition.doma.relayLeg,
  );
  display(
    "Placering",
    competition.result.position,
  );
  display(
    "Startande",
    competition.result.starters,
  );
  display(
    "Kontroller",
    competition.result.controls,
  );
  display(
    "Tid",
    competition.result.time,
  );
  display(
    "Total bomtid",
    competition.result.totalMistakeTime,
  );

  console.log("");
  console.log("Bommar per kontroll:");

  if (
    competition.result.mistakes.length === 0
  ) {
    console.log(
      "- Inga bommar registrerade",
    );
  } else {
    for (
      const mistake of
        competition.result.mistakes
    ) {
      console.log(
        `- Kontroll ${mistake.control}: ` +
          mistake.time,
      );
    }
  }

  console.log("");
  display(
    "Eventor-ID",
    competition.eventor?.eventId,
  );
  display(
    "Eventor verifierad",
    competition.eventorMatch
      ? competition.eventorMatch
          .verifiedByWinSplitsId
        ? "JA"
        : "NEJ"
      : null,
  );
  display(
    "Eventor",
    competition.eventor?.eventorUrl,
  );
  display(
    "Eventor-disciplin",
    competition.eventor?.rawDiscipline,
  );
  display(
    "Arrangör",
    competition.eventor?.organiser,
  );
  display(
    "Plats",
    competition.eventor?.location,
  );
  display(
    "Livelox",
    competition.liveloxUrl,
  );

  const outputDirectory =
    path.resolve(
      process.cwd(),
      "migration",
      "test",
      `doma-${mapId}`,
    );

  await mkdir(outputDirectory, {
    recursive: true,
  });

  const outputPath = path.join(
    outputDirectory,
    "competition-enriched.json",
  );

  await writeFile(
    outputPath,
    JSON.stringify(
      competition,
      null,
      2,
    ),
    "utf8",
  );

  console.log("");
  console.log(
    `Berikad testdata sparades i:\n${outputPath}`,
  );

  if (competition.warnings.length) {
    console.log("");
    console.log("Varningar:");

    for (
      const warning of
        competition.warnings
    ) {
      console.log(`- ${warning}`);
    }
  }
}

main().catch((error) => {
  console.error("");
  console.error(
    error instanceof Error
      ? error.stack ?? error.message
      : error,
  );

  process.exitCode = 1;
});
