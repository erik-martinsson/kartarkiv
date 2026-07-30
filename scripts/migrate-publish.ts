#!/usr/bin/env tsx

/**
 * Publish one approved DOMA migration review into the Astro Kartarkiv archive.
 *
 * Usage:
 *   npx tsx scripts/migrate-publish.ts migration/reviewed/doma-356.json --dry-run
 *   npx tsx scripts/migrate-publish.ts migration/reviewed/doma-356.json
 *   npx tsx scripts/migrate-publish.ts migration/reviewed/doma-356.json --force
 *
 * Options:
 *   --dry-run           Print the publish plan without writing or downloading.
 *   --force             Overwrite existing Markdown/assets.
 *   --no-assets         Write Markdown without downloading DOMA assets.
 *   --country=SE        Country code used in frontmatter (default: SE).
 *   --featured          Set featured: true (default: false).
 *   --description=TEXT  Override the generated Markdown body.
 */

import { relative, resolve } from "node:path";
import process from "node:process";

import {
  PublishValidationError,
  assertPublishable,
  buildPublishPlan,
  publishReviewed,
  readReviewedCompetition,
  sanitizeCountryCode,
} from "./lib/published_reviewed";

import type {
  AssetPlan,
  PublishPlan,
  PublishProgressEvent,
  PublishReviewedOptions,
  ValidationIssueLike,
} from "./lib/published_reviewed";

type CliOptions = {
  inputFile: string;
  dryRun: boolean;
  force: boolean;
  noAssets: boolean;
  country: string;
  featured: boolean;
  description: string | null;
};

const PROJECT_ROOT = process.cwd();

function parseArgs(argv: string[]): CliOptions {
  const positional = argv.filter((arg) => !arg.startsWith("--"));
  const inputFile = positional[0];

  if (!inputFile) {
    printUsage();
    throw new CliUsageError("Missing reviewed JSON file.");
  }

  if (positional.length > 1) {
    throw new CliUsageError(
      `Unexpected positional argument: ${positional.slice(1).join(" ")}`,
    );
  }

  const knownFlags = new Set([
    "--dry-run",
    "--force",
    "--no-assets",
    "--featured",
  ]);

  for (const arg of argv) {
    if (!arg.startsWith("--")) continue;
    if (
      knownFlags.has(arg) ||
      arg.startsWith("--country=") ||
      arg.startsWith("--description=")
    ) {
      continue;
    }
    throw new CliUsageError(`Unknown option: ${arg}`);
  }

  const countryArg = argv.find((arg) => arg.startsWith("--country="));
  const descriptionArg = argv.find((arg) =>
    arg.startsWith("--description="),
  );

  return {
    inputFile,
    dryRun: argv.includes("--dry-run"),
    force: argv.includes("--force"),
    noAssets: argv.includes("--no-assets"),
    country: sanitizeCountryCode(
      countryArg?.slice("--country=".length) ?? "SE",
    ),
    featured: argv.includes("--featured"),
    description: descriptionArg
      ? descriptionArg.slice("--description=".length).trim()
      : null,
  };
}

function printUsage(): void {
  console.error(
    "Usage: npx tsx scripts/migrate-publish.ts <reviewed-json> " +
      "[--dry-run] [--force] [--no-assets] [--country=SE] " +
      "[--featured] [--description=TEXT]",
  );
}

function buildLibraryOptions(
  options: CliOptions,
): PublishReviewedOptions {
  return {
    projectRoot: PROJECT_ROOT,
    sourceFile: resolve(options.inputFile),
    force: options.force,
    noAssets: options.noAssets,
    country: options.country,
    featured: options.featured,
    description: options.description,
    onProgress: printProgress,
  };
}

function printPlan(plan: PublishPlan, options: CliOptions): void {
  console.log("\n=== Kartarkiv publish ===");
  console.log(
    `Source   : ${formatProjectPath(plan.sourceFile ?? options.inputFile)}`,
  );
  console.log(`Title    : ${plan.title}`);
  console.log(`Date     : ${plan.date}`);
  console.log(`Slug     : ${plan.slug}`);
  console.log(`Markdown : ${formatProjectPath(plan.markdownPath)}`);
  console.log(
    `Mode     : ${options.dryRun ? "dry-run" : "write"}${
      options.force ? " + force" : ""
    }`,
  );

  if (plan.assets.length === 0) {
    console.log("Assets   : none");
  } else {
    console.log("Assets   :");
    for (const asset of plan.assets) printAssetPlan(asset);
  }

  printWarnings("Warnings", plan.warnings);
}

function printAssetPlan(asset: AssetPlan): void {
  console.log(`  - ${asset.kind}: ${formatProjectPath(asset.diskPath)}`);
  console.log(`    from: ${asset.sourceUrl}`);
}

function printValidatorWarnings(issues: ValidationIssueLike[]): void {
  if (issues.length === 0) return;

  console.log(`\nValidator warnings (${issues.length}):`);
  for (const issue of issues) {
    const suffix = issue.path ? ` (${issue.path})` : "";
    console.log(`  ⚠ ${issue.code}: ${issue.message}${suffix}`);
  }
}

function printWarnings(title: string, warnings: string[]): void {
  if (warnings.length === 0) return;

  console.log(`\n${title} (${warnings.length}):`);
  for (const warning of warnings) console.log(`  ⚠ ${warning}`);
}

function printProgress(event: PublishProgressEvent): void {
  switch (event.type) {
    case "asset-download-start":
      console.log(`Downloading ${event.asset.kind}...`);
      break;

    case "asset-download-complete":
      break;

    case "markdown-write-start":
      break;

    case "markdown-write-complete":
      break;

    case "publish-complete":
      console.log("\n✔ Publish complete");
      console.log(`  Markdown: ${formatProjectPath(event.result.markdownPath)}`);
      for (const asset of event.result.assets) {
        console.log(`  ${asset.kind}: ${formatProjectPath(asset.diskPath)}`);
      }
      break;

    default:
      return;
  }
}

function formatProjectPath(path: string): string {
  const formatted = relative(PROJECT_ROOT, resolve(path));
  return formatted || ".";
}

class CliUsageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CliUsageError";
  }
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const reviewed = await readReviewedCompetition(options.inputFile);
  const validatorWarnings = assertPublishable(reviewed);
  const libraryOptions = buildLibraryOptions(options);

  const plan = buildPublishPlan(reviewed, {
    projectRoot: PROJECT_ROOT,
    sourceFile: resolve(options.inputFile),
    noAssets: options.noAssets,
    country: options.country,
    featured: options.featured,
    description: options.description,
  });

  printPlan(plan, options);
  printValidatorWarnings(validatorWarnings);

  if (options.dryRun) {
    console.log("\nDry-run: no files written and no assets downloaded.");
    console.log("\n--- Markdown preview ---\n");
    console.log(plan.markdown);
    return;
  }

  await publishReviewed(reviewed, libraryOptions);
}

main().catch((error: unknown) => {
  if (error instanceof CliUsageError) {
    console.error(`\n${error.message}`);
    printUsage();
    process.exitCode = 1;
    return;
  }

  if (error instanceof PublishValidationError) {
    console.error("\nPublish aborted: validation failed.\n");
    for (const issue of error.issues) {
      const suffix = issue.path ? ` (${issue.path})` : "";
      console.error(`✖ ${issue.code}: ${issue.message}${suffix}`);
    }
    process.exitCode = 1;
    return;
  }

  console.error("\nPublish failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});