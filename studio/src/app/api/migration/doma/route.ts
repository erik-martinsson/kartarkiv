import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

import { findRepositoryRoot } from "@/lib/migrationPaths";
import type {
  EnrichedDomaCompetition,
  MigrationQueueItem,
  ReviewedDomaCompetition,
} from "@/types/migration";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function readReviewStatus(
  reviewedDirectory: string,
  mapId: number,
): Promise<MigrationQueueItem["status"]> {
  try {
    const content = await readFile(
      path.join(reviewedDirectory, `doma-${mapId}.json`),
      "utf8",
    );
    const review = JSON.parse(content) as ReviewedDomaCompetition;
    return review.status;
  } catch {
    return "pending";
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
          const competition = JSON.parse(content) as EnrichedDomaCompetition;

          return {
            mapId,
            title: competition.doma.title,
            date: competition.doma.date,
            status: await readReviewStatus(reviewedDirectory, mapId),
            confidence: competition.eventorMatch?.confidence ?? null,
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
