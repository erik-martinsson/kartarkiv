import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

import type {
  EnrichedDomaCompetition,
} from "@/types/migration";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    mapId: string;
  }>;
};

function isPositiveInteger(
  value: string,
): boolean {
  return (
    /^\d+$/.test(value) &&
    Number(value) > 0
  );
}

function createCandidatePaths(
  mapId: string,
): string[] {
  const relativeParts = [
    "migration",
    "test",
    `doma-${mapId}`,
    "competition-enriched.json",
  ];

  const cwd = process.cwd();

  return [
    // Studio startad från repots rot.
    path.resolve(
      cwd,
      ...relativeParts,
    ),

    // Studio startad från kartarkiv/studio.
    path.resolve(
      cwd,
      "..",
      ...relativeParts,
    ),

    // Reserv om Next kör med .next som cwd.
    path.resolve(
      cwd,
      "..",
      "..",
      ...relativeParts,
    ),
  ].filter(
    (value, index, values) =>
      values.indexOf(value) === index,
  );
}

async function findMigrationFile(
  mapId: string,
): Promise<{
  filePath: string | null;
  searchedPaths: string[];
}> {
  const searchedPaths =
    createCandidatePaths(mapId);

  for (const filePath of searchedPaths) {
    try {
      await access(filePath);

      return {
        filePath,
        searchedPaths,
      };
    } catch {
      // Prova nästa möjlig sökväg.
    }
  }

  return {
    filePath: null,
    searchedPaths,
  };
}

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const { mapId } = await context.params;

  if (!isPositiveInteger(mapId)) {
    return NextResponse.json(
      {
        error: "Ogiltigt DOMA map-ID.",
      },
      {
        status: 400,
      },
    );
  }

  const {
    filePath,
    searchedPaths,
  } = await findMigrationFile(mapId);

  if (!filePath) {
    return NextResponse.json(
      {
        error:
          `Ingen testmigrering hittades för DOMA ${mapId}.`,
        searchedPaths,
        currentWorkingDirectory:
          process.cwd(),
        command:
          `npx tsx scripts/test-doma-enriched.ts ${mapId}`,
      },
      {
        status: 404,
      },
    );
  }

  try {
    const content = await readFile(
      filePath,
      "utf8",
    );

    const competition =
      JSON.parse(
        content,
      ) as EnrichedDomaCompetition;

    return NextResponse.json(
      competition,
      {
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error(
      "Kunde inte läsa migrationsfil:",
      filePath,
      error,
    );

    return NextResponse.json(
      {
        error:
          "Migrationsfilen hittades men kunde inte läsas.",
        filePath,
      },
      {
        status: 500,
      },
    );
  }
}