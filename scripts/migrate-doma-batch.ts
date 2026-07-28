import {
  access,
  mkdir,
  readFile,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { readDomaCompetition } from "../src/lib/doma";
import { readEnrichedDomaCompetition } from "../src/lib/doma/enrichment";

const DEFAULT_RUNNER = "Erik Martinsson";
const DEFAULT_USER = "erik";
const DEFAULT_FROM = 356;
const DEFAULT_TO = 356;
const DEFAULT_DELAY_MS = 1_500;

type Options = {
  from: number;
  to: number;
  runner: string;
  user: string;
  delayMs: number;
  force: boolean;
};

type BatchItemStatus = "created" | "skipped" | "failed";
type BatchSkipReason = "existing" | "training";

type BatchItem = {
  mapId: number;
  status: BatchItemStatus;
  skipReason?: BatchSkipReason;
  title?: string | null;
  category?: string | null;
  outputPath?: string;
  error?: string;
};

type BatchSummary = {
  schemaVersion: 1;
  startedAt: string;
  finishedAt: string;
  options: Options;
  counts: {
    total: number;
    created: number;
    skipped: number;
    skippedExisting: number;
    skippedTraining: number;
    failed: number;
  };
  items: BatchItem[];
};

function parsePositiveInteger(
  value: string | undefined,
  fallback: number,
): number {
  if (value === undefined) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Ogiltigt positivt heltal: ${value}`);
  }

  return parsed;
}

function readArgument(
  args: string[],
  name: string,
): string | undefined {
  const prefix = `--${name}=`;
  const inline = args.find((value) => value.startsWith(prefix));

  if (inline) {
    return inline.slice(prefix.length);
  }

  const index = args.indexOf(`--${name}`);

  if (index >= 0) {
    return args[index + 1];
  }

  return undefined;
}

function parseOptions(args: string[]): Options {
  const from = parsePositiveInteger(
    readArgument(args, "from"),
    DEFAULT_FROM,
  );
  const to = parsePositiveInteger(
    readArgument(args, "to"),
    DEFAULT_TO,
  );
  const delayMs = parsePositiveInteger(
    readArgument(args, "delay"),
    DEFAULT_DELAY_MS,
  );

  if (to < from) {
    throw new Error(
      `--to (${to}) måste vara större än eller lika med --from (${from}).`,
    );
  }

  return {
    from,
    to,
    runner: readArgument(args, "runner") ?? DEFAULT_RUNNER,
    user: readArgument(args, "user") ?? DEFAULT_USER,
    delayMs,
    force: args.includes("--force"),
  };
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function createDomaUrl(mapId: number, user: string): string {
  const url = new URL("http://www.lid1.se/erik/doma/show_map.php");

  url.searchParams.set("user", user);
  url.searchParams.set("map", String(mapId));

  return url.toString();
}

function normalizeEventType(value: string | null): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("sv-SE");
}

function isTrainingEvent(category: string | null): boolean {
  const normalized = normalizeEventType(category);

  return normalized === "traning" || normalized === "training";
}

async function readExistingTitle(
  outputPath: string,
): Promise<string | null> {
  try {
    const content = await readFile(outputPath, "utf8");
    const parsed = JSON.parse(content) as {
      doma?: { title?: string | null };
    };

    return parsed.doma?.title ?? null;
  } catch {
    return null;
  }
}

async function main(): Promise<void> {
  const options = parseOptions(process.argv.slice(2));
  const startedAt = new Date().toISOString();
  const items: BatchItem[] = [];
  const total = options.to - options.from + 1;

  console.log("DOMA-batch startar");
  console.log(`Kartor: ${options.from}–${options.to} (${total} st)`);
  console.log(`Löpare: ${options.runner}`);
  console.log(
    `Befintliga filer: ${
      options.force ? "skrivs över" : "hoppas över"
    }`,
  );
  console.log("Träningsposter: hoppas över före extern berikning");
  console.log("");

  for (let mapId = options.from; mapId <= options.to; mapId += 1) {
    const position = mapId - options.from + 1;
    const domaUrl = createDomaUrl(mapId, options.user);
    const outputDirectory = path.resolve(
      process.cwd(),
      "migration",
      "test",
      `doma-${mapId}`,
    );
    const outputPath = path.join(
      outputDirectory,
      "competition-enriched.json",
    );

    console.log(`[${position}/${total}] DOMA ${mapId}`);

    try {
      // Läs endast DOMA först. Kategorin måste kontrolleras innan
      // WinSplits, Eventor eller Livelox får anropas.
      const doma = await readDomaCompetition(domaUrl);

      if (isTrainingEvent(doma.category)) {
        console.log(
          `  skipped (training): ${doma.title ?? "utan titel"}`,
        );
        items.push({
          mapId,
          status: "skipped",
          skipReason: "training",
          title: doma.title,
          category: doma.category,
        });
        continue;
      }

      if (!options.force && (await fileExists(outputPath))) {
        const existingTitle = await readExistingTitle(outputPath);
        const title = existingTitle ?? doma.title;

        console.log(`  skipped (existing): ${title ?? "filen finns"}`);
        items.push({
          mapId,
          status: "skipped",
          skipReason: "existing",
          title,
          category: doma.category,
          outputPath,
        });
        continue;
      }

      const competition = await readEnrichedDomaCompetition(
        domaUrl,
        options.runner,
      );

      await mkdir(outputDirectory, {
        recursive: true,
      });
      await writeFile(
        outputPath,
        `${JSON.stringify(competition, null, 2)}\n`,
        "utf8",
      );

      console.log(`  Sparad: ${competition.doma.title ?? "utan titel"}`);
      console.log(
        `  Matchning: ${competition.eventorMatch?.confidence ?? "ingen"}`,
      );

      items.push({
        mapId,
        status: "created",
        title: competition.doma.title,
        category: competition.doma.category,
        outputPath,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      console.error(`  Misslyckades: ${message}`);
      items.push({
        mapId,
        status: "failed",
        error: message,
      });
    } finally {
      if (mapId < options.to) {
        await sleep(options.delayMs);
      }
    }
  }

  const summary: BatchSummary = {
    schemaVersion: 1,
    startedAt,
    finishedAt: new Date().toISOString(),
    options,
    counts: {
      total: items.length,
      created: items.filter((item) => item.status === "created").length,
      skipped: items.filter((item) => item.status === "skipped").length,
      skippedExisting: items.filter(
        (item) =>
          item.status === "skipped" && item.skipReason === "existing",
      ).length,
      skippedTraining: items.filter(
        (item) =>
          item.status === "skipped" && item.skipReason === "training",
      ).length,
      failed: items.filter((item) => item.status === "failed").length,
    },
    items,
  };

  const reportsDirectory = path.resolve(
    process.cwd(),
    "migration",
    "reports",
  );
  await mkdir(reportsDirectory, {
    recursive: true,
  });

  const reportPath = path.join(
    reportsDirectory,
    `doma-batch-${options.from}-${options.to}.json`,
  );

  await writeFile(
    reportPath,
    `${JSON.stringify(summary, null, 2)}\n`,
    "utf8",
  );

  console.log("");
  console.log("Batchen är klar");
  console.log(`Skapade: ${summary.counts.created}`);
  console.log(`Överhoppade: ${summary.counts.skipped}`);
  console.log(`  Befintliga: ${summary.counts.skippedExisting}`);
  console.log(`  Träning: ${summary.counts.skippedTraining}`);
  console.log(`Misslyckade: ${summary.counts.failed}`);
  console.log(`Rapport: ${reportPath}`);

  if (summary.counts.failed > 0) {
    process.exitCode = 2;
  }
}

main().catch((error) => {
  console.error("");
  console.error(
    error instanceof Error ? error.stack ?? error.message : error,
  );
  process.exitCode = 1;
});
