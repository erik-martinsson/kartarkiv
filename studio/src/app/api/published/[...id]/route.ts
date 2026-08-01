import { NextResponse } from "next/server";

import {
  readPublishedRace,
  writePublishedRace,
} from "@/lib/publishedRaceFiles";
import type { PublishedRaceFields } from "@/types/published";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = {
  params: Promise<{ id: string[] }>;
};

type UpdateRequest = {
  fields?: PublishedRaceFields;
  body?: string;
};

function raceId(parts: string[]): string {
  return parts.map(decodeURIComponent).join("/");
}

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const { id } = await context.params;

  try {
    const race = await readPublishedRace(raceId(id));

    return NextResponse.json(race, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String(error.code)
        : "";

    return NextResponse.json(
      {
        error:
          code === "ENOENT"
            ? "Tävlingen hittades inte."
            : error instanceof Error
              ? error.message
              : "Tävlingen kunde inte läsas.",
      },
      { status: code === "ENOENT" ? 404 : 500 },
    );
  }
}

export async function PUT(
  request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const { id } = await context.params;
  let body: UpdateRequest;

  try {
    body = (await request.json()) as UpdateRequest;
  } catch {
    return NextResponse.json(
      { error: "Begäran innehåller ogiltig JSON." },
      { status: 400 },
    );
  }

  if (!body.fields || typeof body.body !== "string") {
    return NextResponse.json(
      { error: "Tävlingsuppgifter eller brödtext saknas." },
      { status: 400 },
    );
  }

  try {
    const race = await writePublishedRace(
      raceId(id),
      body.fields,
      body.body,
    );

    return NextResponse.json(
      { ok: true, race },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const validationErrors =
      error &&
      typeof error === "object" &&
      "validationErrors" in error &&
      Array.isArray(error.validationErrors)
        ? error.validationErrors
        : null;

    if (validationErrors) {
      return NextResponse.json(
        {
          error: "Tävlingsuppgifterna är ogiltiga.",
          validationErrors,
        },
        { status: 422 },
      );
    }

    console.error("Kunde inte spara publicerad tävling:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Tävlingen kunde inte sparas.",
      },
      { status: 500 },
    );
  }
}