import {
  mkdir,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fetchDomaPage } from "./fetch";
import {
  buildCompetitionYearUrl,
  COMPETITION_CATEGORY_ID,
  discoverCompetitionEntries,
} from "./parser";
import type {
  DiagnosticEntry,
  DiagnosticManifest,
  DomaEntryCandidate,
  YearDiagnostic,
} from "./types";

const MAX_SAMPLE_ENTRIES = 5;

function normalizeComparableText(
  value: string,
): string {
  return value
    .replace(/\u00a0/g, " ")
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .toLocaleLowerCase("sv-SE")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function safeFileName(
  value: string,
): string {
  return (
    normalizeComparableText(value)
      .replace(/\s+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) ||
    "doma-entry"
  );
}

export type RunDiagnosticOptions = {
  baseUrl: string;
  user: string;
  firstYear: number;
  lastYear: number;
  outputDirectory: string;
};

export async function runDomaDiagnostic(
  options: RunDiagnosticOptions,
): Promise<DiagnosticManifest> {
  await mkdir(options.outputDirectory, {
    recursive: true,
  });

  const yearDiagnostics: YearDiagnostic[] = [];
  const errors: DiagnosticManifest["errors"] = [];
  const candidatesByMapId =
    new Map<string, DomaEntryCandidate>();

  console.log(
    "Skannar endast DOMA-kategorin Tävling.",
  );
  console.log(
    `Kategori-ID: ${COMPETITION_CATEGORY_ID}`,
  );
  console.log(
    `År: ${options.firstYear}–${options.lastYear}`,
  );
  console.log("");

  for (
    let year = options.firstYear;
    year <= options.lastYear;
    year += 1
  ) {
    const yearUrl = buildCompetitionYearUrl(
      options.baseUrl,
      options.user,
      year,
    );

    console.log(`Läser ${year}: ${yearUrl}`);

    try {
      const page = await fetchDomaPage(yearUrl);
      const candidates =
        discoverCompetitionEntries(
          page.snapshot,
          year,
          options.user,
        );

      for (const candidate of candidates) {
        candidatesByMapId.set(
          candidate.mapId,
          candidate,
        );
      }

      const htmlFile =
        `doma-index-${year}.html`;

      await writeFile(
        path.join(
          options.outputDirectory,
          htmlFile,
        ),
        page.html,
        "utf8",
      );

      yearDiagnostics.push({
        year,
        url: yearUrl,
        status: "ok",
        candidateCount: candidates.length,
        htmlFile,
      });

      console.log(
        `  Hittade ${candidates.length} tävlingsposter.`,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Okänt fel.";

      yearDiagnostics.push({
        year,
        url: yearUrl,
        status: "error",
        candidateCount: 0,
        error: message,
      });

      errors.push({
        url: yearUrl,
        message,
      });

      console.error(`  Fel: ${message}`);
    }
  }

  const candidates =
    [...candidatesByMapId.values()].sort(
      (left, right) =>
        left.year !== right.year
          ? left.year - right.year
          : Number(left.mapId) -
            Number(right.mapId),
    );

  console.log("");
  console.log(
    `Totalt hittades ${candidates.length} unika tävlingsposter.`,
  );

  const selectedCompetitionEntries:
    DiagnosticEntry[] = [];

  for (const candidate of candidates.slice(
    0,
    MAX_SAMPLE_ENTRIES,
  )) {
    console.log(
      `Läser exempelpost ${candidate.mapId}: ${candidate.sourceUrl}`,
    );

    try {
      const entryPage =
        await fetchDomaPage(candidate.sourceUrl);

      const baseName = [
        String(
          selectedCompetitionEntries.length + 1,
        ).padStart(2, "0"),
        candidate.year,
        `map-${candidate.mapId}`,
        safeFileName(
          entryPage.snapshot.title ||
            candidate.linkText,
        ),
      ].join("-");

      const htmlFile = `${baseName}.html`;
      const jsonFile = `${baseName}.json`;

      await writeFile(
        path.join(
          options.outputDirectory,
          htmlFile,
        ),
        entryPage.html,
        "utf8",
      );

      await writeFile(
        path.join(
          options.outputDirectory,
          jsonFile,
        ),
        JSON.stringify(
          {
            candidate,
            snapshot: entryPage.snapshot,
          },
          null,
          2,
        ),
        "utf8",
      );

      selectedCompetitionEntries.push({
        candidate,
        snapshot: entryPage.snapshot,
        htmlFile,
        jsonFile,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Okänt fel.";

      errors.push({
        url: candidate.sourceUrl,
        message,
      });

      console.error(
        `  Kunde inte läsa karta ${candidate.mapId}: ${message}`,
      );
    }
  }

  const summary = {
    yearsScanned: yearDiagnostics.length,
    yearsWithEntries:
      yearDiagnostics.filter(
        (diagnostic) =>
          diagnostic.candidateCount > 0,
      ).length,
    totalCompetitionEntries:
      candidates.length,
    savedSampleEntries:
      selectedCompetitionEntries.length,
    errors: errors.length,
  };

  const manifest: DiagnosticManifest = {
    generatedAt: new Date().toISOString(),
    baseUrl: options.baseUrl,
    user: options.user,
    competitionCategoryId:
      COMPETITION_CATEGORY_ID,
    years: {
      first: options.firstYear,
      last: options.lastYear,
    },
    yearDiagnostics,
    candidates,
    selectedCompetitionEntries,
    errors,
    summary,
  };

  await writeFile(
    path.join(
      options.outputDirectory,
      "doma-diagnostic-manifest.json",
    ),
    JSON.stringify(manifest, null, 2),
    "utf8",
  );

  return manifest;
}
