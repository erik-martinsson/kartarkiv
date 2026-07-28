import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";

import { findEnrichedCompetitionFile } from "@/lib/migrationPaths";
import type { EnrichedDomaCompetition } from "@/types/migration";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const API_VERSION = "doma-migration-route-2026-07-28-v4";

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
      { apiVersion: API_VERSION, error: "Ogiltigt DOMA map-ID." },
      { status: 400 },
    );
  }

  const { filePath, searchedPaths } = await findEnrichedCompetitionFile(mapId);

  if (!filePath) {
    return NextResponse.json(
      {
        apiVersion: API_VERSION,
        error: `Ingen testmigrering hittades för DOMA ${mapId}.`,
        currentWorkingDirectory: process.cwd(),
        searchedPaths,
      },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const content = await readFile(filePath, "utf8");
    const competition = JSON.parse(content) as EnrichedDomaCompetition;

    return NextResponse.json(
      {
        ...competition,
        _migrationApi: { apiVersion: API_VERSION, sourceFile: filePath },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Kunde inte läsa migrationsfil:", filePath, error);
    return NextResponse.json(
      {
        apiVersion: API_VERSION,
        error: "Migrationsfilen hittades men kunde inte läsas.",
        sourceFile: filePath,
      },
      { status: 500 },
    );
  }
}
