import path from "node:path";
import { runDomaDiagnostic } from "./diagnostic";

const DEFAULT_BASE_URL =
  "http://www.lid1.se/erik/doma/index.php";

const DEFAULT_USER = "erik";
const FIRST_YEAR = 2011;
const LAST_YEAR = 2022;

async function main(): Promise<void> {
  const baseUrl =
    process.argv[2] ?? DEFAULT_BASE_URL;

  const user =
    process.argv[3] ?? DEFAULT_USER;

  try {
    new URL(baseUrl);
  } catch {
    throw new Error(
      "Baslänken är inte en giltig URL.",
    );
  }

  const outputDirectory =
    path.resolve(
      process.cwd(),
      "migration",
      "doma-diagnostics",
    );

  const manifest =
    await runDomaDiagnostic({
      baseUrl,
      user,
      firstYear: FIRST_YEAR,
      lastYear: LAST_YEAR,
      outputDirectory,
    });

  console.log("");
  console.log("Diagnosen är klar.");
  console.log(
    `Skannade år: ${manifest.summary.yearsScanned}`,
  );
  console.log(
    `År med tävlingar: ${manifest.summary.yearsWithEntries}`,
  );
  console.log(
    `Tävlingsposter: ${manifest.summary.totalCompetitionEntries}`,
  );
  console.log(
    `Sparade exempelposter: ${manifest.summary.savedSampleEntries}`,
  );
  console.log(
    `Fel: ${manifest.summary.errors}`,
  );
  console.log("");
  console.log(
    `Filerna finns i:\n${outputDirectory}`,
  );
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
