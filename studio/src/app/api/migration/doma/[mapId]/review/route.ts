import { readFile, writeFile } from "node:fs/promises";
import { NextResponse } from "next/server";

import { getReviewedFilePath } from "@/lib/migrationPaths";
import type {
  EnrichedDomaCompetition,
  MigrationReviewStatus,
  ReviewedDomaCompetition,
} from "@/types/migration";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = {
  params: Promise<{ mapId: string }>;
};

type ReviewRequest = {
  status?: MigrationReviewStatus;
  competition?: EnrichedDomaCompetition;
};

function isPositiveInteger(value: string): boolean {
  return /^\d+$/.test(value) && Number(value) > 0;
}

function isReviewStatus(value: unknown): value is MigrationReviewStatus {
  return value === "approved" || value === "needs-review";
}

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const { mapId } = await context.params;

  if (!isPositiveInteger(mapId)) {
    return NextResponse.json({ error: "Ogiltigt DOMA map-ID." }, { status: 400 });
  }

  const filePath = await getReviewedFilePath(mapId);

  if (!filePath) {
    return NextResponse.json(
      { error: "Kunde inte hitta repots migration-mapp." },
      { status: 500 },
    );
  }

  try {
    const content = await readFile(filePath, "utf8");
    return NextResponse.json(JSON.parse(content), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String(error.code)
        : "";

    if (code === "ENOENT") {
      return NextResponse.json({ review: null }, { status: 404 });
    }

    console.error("Kunde inte läsa granskningsfil:", filePath, error);
    return NextResponse.json(
      { error: "Granskningsfilen kunde inte läsas." },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const { mapId } = await context.params;

  if (!isPositiveInteger(mapId)) {
    return NextResponse.json({ error: "Ogiltigt DOMA map-ID." }, { status: 400 });
  }

  let body: ReviewRequest;

  try {
    body = (await request.json()) as ReviewRequest;
  } catch {
    return NextResponse.json({ error: "Ogiltig JSON." }, { status: 400 });
  }

  if (!isReviewStatus(body.status) || !body.competition) {
    return NextResponse.json(
      { error: "Status eller tävlingsdata saknas." },
      { status: 400 },
    );
  }

  if (String(body.competition.doma?.mapId) !== mapId) {
    return NextResponse.json(
      { error: "DOMA map-ID i URL och data stämmer inte överens." },
      { status: 400 },
    );
  }

  const filePath = await getReviewedFilePath(mapId);

  if (!filePath) {
    return NextResponse.json(
      { error: "Kunde inte hitta repots migration-mapp." },
      { status: 500 },
    );
  }

  const reviewed: ReviewedDomaCompetition = {
    schemaVersion: 1,
    status: body.status,
    reviewedAt: new Date().toISOString(),
    competition: body.competition,
  };

  try {
    await writeFile(filePath, `${JSON.stringify(reviewed, null, 2)}\n`, "utf8");

    return NextResponse.json(
      { review: reviewed, savedTo: filePath },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Kunde inte spara granskningsfil:", filePath, error);
    return NextResponse.json(
      { error: "Granskningen kunde inte sparas." },
      { status: 500 },
    );
  }
}
