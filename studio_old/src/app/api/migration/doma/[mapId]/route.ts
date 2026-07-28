import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import type { EnrichedDomaCompetition } from "@/types/migration";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    mapId: string;
  }>;
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

  const filePath = path.resolve(
    process.cwd(),
    "migration",
    "test",
    `doma-${mapId}`,
    "competition-enriched.json",
  );

  try {
    const content = await readFile(filePath, "utf8");
    const competition = JSON.parse(content) as EnrichedDomaCompetition;

    return NextResponse.json(competition, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String(error.code)
        : "";

    if (code === "ENOENT") {
      return NextResponse.json(
        {
          error:
            `Ingen testmigrering hittades för DOMA ${mapId}. ` +
            `Kör först: npx tsx scripts/test-doma-enriched.ts ${mapId}`,
          expectedPath: filePath,
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        error: "Migrationsfilen kunde inte läsas.",
      },
      { status: 500 },
    );
  }
}
