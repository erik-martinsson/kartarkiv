import { NextResponse } from "next/server";

import { listPublishedRaces } from "@/lib/publishedRaceFiles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(): Promise<NextResponse> {
  try {
    const items = await listPublishedRaces();

    return NextResponse.json(
      { items },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Kunde inte lista publicerade tävlingar:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Publicerade tävlingar kunde inte läsas.",
      },
      { status: 500 },
    );
  }
}