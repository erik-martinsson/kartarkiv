import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

import type { EnrichedDomaCompetition } from "@/types/migration";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const API_VERSION = "doma-migration-route-2026-07-28-v3";

type RouteContext = {
  params: Promise<{
    mapId: string;
  }>;
};

function isPositiveInteger(value: string): boolean {
  return /^\d+$/.test(value) && Number(value) > 0;
}

async function pathExists(candidate: string): Promise<boolean> {
  try {
    await access(candidate);
    return true;
  } catch {
    return false;
  }
}

function createSearchRoots(): string[] {
  const roots: string[] = [];
  let current = path.resolve(process.cwd());

  for (let level = 0; level < 6; level += 1) {
    roots.push(current);

    const parent = path.dirname(current);

    if (parent === current) {
      break;
    }

    current = parent;
  }

  return [...new Set(roots)];
}

async function findMigrationFile(mapId: string): Promise<{
  filePath: string | null;
  searchedPaths: string[];
}> {
  const searchedPaths = createSearchRoots().map((root) =>
    path.join(
      root,
      "migration",
      "test",
      `doma-${mapId}`,
      "competition-enriched.json",
    ),
  );

  for (const candidate of searchedPaths) {
    if (await pathExists(candidate)) {
      return {
        filePath: candidate,
        searchedPaths,
      };
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
        apiVersion: API_VERSION,
        error: "Ogiltigt DOMA map-ID.",
      },
      { status: 400 },
    );
  }

  const { filePath, searchedPaths } = await findMigrationFile(mapId);

  if (!filePath) {
    return NextResponse.json(
      {
        apiVersion: API_VERSION,
        error: `Ingen testmigrering hittades för DOMA ${mapId}.`,
        currentWorkingDirectory: process.cwd(),
        searchedPaths,
      },
      {
        status: 404,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    );
  }

  try {
    const content = await readFile(filePath, "utf8");
    const competition = JSON.parse(content) as EnrichedDomaCompetition;

    return NextResponse.json(
      {
        ...competition,
        _migrationApi: {
          apiVersion: API_VERSION,
          sourceFile: filePath,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
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
