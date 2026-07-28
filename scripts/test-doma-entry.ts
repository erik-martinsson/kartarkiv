import {
  mkdir,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import {
  readDomaCompetition,
} from "../src/lib/doma";

const DEFAULT_MAP_ID = 356;
const DEFAULT_USER = "erik";
const DEFAULT_BASE_URL =
  "http://www.lid1.se/erik/doma/show_map.php";

function parseMapId(
  rawValue: string | undefined,
): number {
  if (!rawValue) {
    return DEFAULT_MAP_ID;
  }

  const mapId = Number(rawValue);

  if (
    !Number.isInteger(mapId) ||
    mapId <= 0
  ) {
    throw new Error(
      `Ogiltigt map-ID: ${rawValue}`,
    );
  }

  return mapId;
}

function status(
  value: string | number | null,
): string {
  return value === null ||
    value === ""
    ? "SAKNAS"
    : "OK";
}

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
    `${label.padEnd(24, ".")}${rendered}`,
  );
}

async function main(): Promise<void> {
  const mapId = parseMapId(process.argv[2]);
  const user = process.argv[3] ?? DEFAULT_USER;

  const url = new URL(DEFAULT_BASE_URL);
  url.searchParams.set("user", user);
  url.searchParams.set("map", String(mapId));

  console.log(`Läser DOMA-karta ${mapId}:`);
  console.log(url.toString());
  console.log("");

  const competition =
    await readDomaCompetition(url.toString());

  display("Map ID", competition.mapId);
  display("Titel", competition.title);
  display("Datum", competition.date);
  display("Kategori", competition.category);
  display(
    "Stafettsträcka",
    competition.relayLeg,
  );
  display("Tid", competition.runningTime);
  display(
    "Löpt distans",
    competition.runningDistanceKm === null
      ? null
      : `${competition.runningDistanceKm} km`,
  );
  display(
    "Karta med vägval",
    status(competition.routeMapImageUrl),
  );
  display(
    "Blank karta",
    status(competition.blankMapImageUrl),
  );
  display("KML", status(competition.kmlUrl));
  display(
    "WinSplits",
    status(competition.winsplitsUrl),
  );
  display(
    "Eventor",
    status(competition.eventorUrl),
  );
  display(
    "Livelox",
    status(competition.liveloxUrl),
  );

  if (competition.mapCenter) {
    display(
      "Kartcentrum",
      `${competition.mapCenter.latitude}, ` +
        `${competition.mapCenter.longitude}`,
    );
  }

  if (
    competition.imageWidth !== null &&
    competition.imageHeight !== null
  ) {
    display(
      "Bildstorlek",
      `${competition.imageWidth} × ` +
        `${competition.imageHeight}`,
    );
  }

  const outputDirectory = path.resolve(
    process.cwd(),
    "migration",
    "test",
    `doma-${mapId}`,
  );

  await mkdir(outputDirectory, {
    recursive: true,
  });

  const {
    rawHtml,
    ...serializableCompetition
  } = competition;

  await Promise.all([
    writeFile(
      path.join(outputDirectory, "page.html"),
      rawHtml,
      "utf8",
    ),
    writeFile(
      path.join(
        outputDirectory,
        "competition.json",
      ),
      JSON.stringify(
        serializableCompetition,
        null,
        2,
      ),
      "utf8",
    ),
  ]);

  console.log("");
  console.log(
    `Testfiler sparades i:\n${outputDirectory}`,
  );

  if (competition.warnings.length > 0) {
    console.log("");
    console.log("Varningar:");

    for (const warning of competition.warnings) {
      console.log(`- ${warning}`);
    }
  }
}

main().catch((error) => {
  console.error("");
  console.error(
    error instanceof Error
      ? error.message
      : error,
  );

  process.exitCode = 1;
});
