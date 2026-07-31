import { readFile } from "node:fs/promises";

import { NextResponse } from "next/server";

import { findEnrichedCompetitionFile } from "@/lib/migrationPaths";
import type { EnrichedDomaCompetition } from "@/types/migration";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = {
  params: Promise<{ mapId: string }>;
};

function isPositiveInteger(value: string): boolean {
  return /^\d+$/.test(value) && Number(value) > 0;
}

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const { mapId } = await context.params;

  if (!isPositiveInteger(mapId)) {
    return NextResponse.json(
      { error: "Ogiltigt DOMA map-ID." },
      { status: 400 },
    );
  }

  const { filePath, searchedPaths } =
    await findEnrichedCompetitionFile(mapId);

  if (!filePath) {
    return NextResponse.json(
      {
        error:
          `Kunde inte hitta competition-enriched.json för DOMA ${mapId}.`,
        searchedPaths,
      },
      { status: 404 },
    );
  }

  try {
    const content = await readFile(filePath, "utf8");
    const competition =
      JSON.parse(content) as EnrichedDomaCompetition;

    if (String(competition.doma?.mapId) !== mapId) {
      return NextResponse.json(
        {
          error:
            "DOMA map-ID i filen stämmer inte överens med URL:en.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        ...competition,
        _migrationApi: {
          apiVersion:
            "doma-migration-route-2026-07-31-v5",
          sourceFile: filePath,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error(
      `Kunde inte läsa migrationspost för DOMA ${mapId}:`,
      filePath,
      error,
    );

    return NextResponse.json(
      {
        error:
          "Migrationsposten kunde inte läsas eller innehåller ogiltig JSON.",
      },
      { status: 500 },
    );
  }
}