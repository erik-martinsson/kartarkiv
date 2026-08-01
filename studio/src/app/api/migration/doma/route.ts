import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

import { findRepositoryRoot } from "@/lib/migrationPaths";
import type {
  EnrichedDomaCompetition,
  MigrationQueueItem,
  ReviewedDomaCompetition,
} from "@/types/migration";

import { buildPublishPlan } from "../../../../../../scripts/lib/published_reviewed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type ReviewQueueState = Pick<
  MigrationQueueItem,
  "status" | "published"
>;

async function readReviewQueueState(
  repositoryRoot: string,
  reviewedDirectory: string,
  mapId: number,
): Promise<ReviewQueueState> {
  const reviewedFile = path.join(
    reviewedDirectory,
    `doma-${mapId}.json`,
  );

  try {
    const content = await readFile(reviewedFile, "utf8");
    const review =
      JSON.parse(content) as ReviewedDomaCompetition;

    let published = false;

    try {
      const plan = buildPublishPlan(review, {
        projectRoot: repositoryRoot,
        sourceFile: reviewedFile,
      });

      await access(plan.markdownPath);
      published = true;
    } catch {
      published = false;
    }

    return {
      status: review.status,
      published,
    };
  } catch {
    return {
      status: "pending",
      published: false,
    };
  }
}

export async function GET(): Promise<NextResponse> {
  const { root, searchedRoots } = await findRepositoryRoot();

  if (!root) {
    return NextResponse.json(
      {
        error: "Kunde inte hitta repots migration-mapp.",
        searchedRoots,
      },
      { status: 404 },
    );
  }

  const testDirectory = path.join(root, "migration", "test");
  const reviewedDirectory = path.join(root, "migration", "reviewed");

  try {
    const entries = await readdir(testDirectory, { withFileTypes: true });
    const ids = entries
      .filter((entry) => entry.isDirectory() && /^doma-\d+$/.test(entry.name))
      .map((entry) => Number(entry.name.replace("doma-", "")))
      .sort((a, b) => a - b);

    const items = await Promise.all(
      ids.map(async (mapId): Promise<MigrationQueueItem | null> => {
        try {
          const content = await readFile(
            path.join(
              testDirectory,
              `doma-${mapId}`,
              "competition-enriched.json",
            ),
            "utf8",
          );
          const competition =
            JSON.parse(content) as EnrichedDomaCompetition;
          const reviewState =
            await readReviewQueueState(
              root,
              reviewedDirectory,
              mapId,
            );

          return {
            mapId,
            title: competition.doma.title,
            date: competition.doma.date,
            status: reviewState.status,
            published: reviewState.published,
            confidence:
              competition.eventorMatch?.confidence ?? null,
            warningCount: competition.warnings.length,
          };
        } catch (error) {
          console.error(`Kunde inte läsa DOMA ${mapId}:`, error);
          return null;
        }
      }),
    );

    return NextResponse.json(
      { items: items.filter((item): item is MigrationQueueItem => item !== null) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Kunde inte läsa migrationskön:", testDirectory, error);
    return NextResponse.json(
      { error: "Migrationskön kunde inte läsas.", testDirectory },
      { status: 500 },
    );
  }
}