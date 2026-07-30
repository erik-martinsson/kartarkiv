#!/usr/bin/env tsx

import { readFile } from "node:fs/promises";
import process from "node:process";

import { validateReviewedCompetition } from "./lib/reviewed-validator";

async function main(): Promise<void> {
  const arg = process.argv[2];

  if (!arg) {
    console.error("Usage: tsx scripts/migrate-reviewed-ready.ts <reviewed-json>");
    console.error("Example: tsx scripts/migrate-reviewed-ready.ts migration/reviewed/doma-356.json");
    process.exit(1);
  }

  const text = await readFile(arg, "utf8");
  const reviewed = JSON.parse(text);

  const result = validateReviewedCompetition(reviewed);

  console.log("");
  console.log("=== Publish Readiness Report ===");
  console.log(`File: ${arg}`);
  console.log("");

  if (result.ok) {
    console.log("✔ READY FOR PUBLISH");
  } else {
    console.log("✖ NOT READY FOR PUBLISH");
  }

  console.log("");

  if (result.errors.length) {
    console.log("Errors:");
    for (const err of result.errors) {
      console.log(
        `  ✖ ${err.code}: ${err.message}${err.path ? ` (${err.path})` : ""}`,
      );
    }
    console.log("");
  }

  if (result.warnings.length) {
    console.log("Warnings:");
    for (const warn of result.warnings) {
      console.log(
        `  ⚠ ${warn.code}: ${warn.message}${warn.path ? ` (${warn.path})` : ""}`,
      );
    }
    console.log("");
  }

  console.log(
    `Summary: ${result.errors.length} error(s), ${result.warnings.length} warning(s)`,
  );

  process.exit(result.ok ? 0 : 1);
}

main().catch((error) => {
  console.error("Fatal error:");
  console.error(error);
  process.exit(1);
});