import { NextRequest, NextResponse } from "next/server";

import { storeRaceUploadChunk } from "@/lib/raceUploadChunks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_CHUNK_BYTES = 2_300_000;

function integerField(formData: FormData, name: string): number {
  const raw = formData.get(name);
  const value = typeof raw === "string" ? Number(raw) : Number.NaN;

  if (!Number.isInteger(value)) {
    throw new Error(`${name} saknas eller är ogiltigt.`);
  }

  return value;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const uploadId = String(formData.get("uploadId") ?? "");
    const fileKey = String(formData.get("fileKey") ?? "");
    const chunkIndex = integerField(formData, "chunkIndex");
    const totalChunks = integerField(formData, "totalChunks");
    const chunk = formData.get("chunk");

    if (!(chunk instanceof File) || chunk.size < 1) {
      return NextResponse.json(
        { error: "Uppladdningsdelen saknas." },
        { status: 400 },
      );
    }

    if (chunk.size > MAX_CHUNK_BYTES) {
      return NextResponse.json(
        {
          error:
            `Uppladdningsdelen är för stor (${chunk.size} byte). ` +
            `Max är ${MAX_CHUNK_BYTES} byte.`,
        },
        { status: 413 },
      );
    }

    const ref = await storeRaceUploadChunk({
      uploadId,
      fileKey,
      chunkIndex,
      totalChunks,
      content: await chunk.arrayBuffer(),
    });

    return NextResponse.json(
      { success: true, ref },
      {
        status: 201,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("Kunde inte lagra uppladdningsdel:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Uppladdningsdelen kunde inte lagras.",
      },
      { status: 500 },
    );
  }
}
