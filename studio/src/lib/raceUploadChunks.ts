import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  createTemporaryGitHubBlob,
  readTemporaryGitHubBlob,
  shouldPublishToGitHub,
} from "@/lib/githubRepository";

export type RaceUploadFileKey = "mapImage" | "routeImage" | "gpxFile";

const SAFE_UPLOAD_ID = /^[a-zA-Z0-9_-]{8,100}$/;
const SAFE_CHUNK_REF = /^[a-zA-Z0-9:_-]{1,160}$/;
const MAX_CHUNKS_PER_FILE = 100;

function assertUploadId(uploadId: string): void {
  if (!SAFE_UPLOAD_ID.test(uploadId)) {
    throw new Error("Ogiltigt uppladdnings-ID.");
  }
}

function assertFileKey(fileKey: string): asserts fileKey is RaceUploadFileKey {
  if (fileKey !== "mapImage" && fileKey !== "routeImage" && fileKey !== "gpxFile") {
    throw new Error("Ogiltig filtyp i uppladdningen.");
  }
}

function assertChunkIndex(chunkIndex: number, totalChunks: number): void {
  if (
    !Number.isInteger(chunkIndex) ||
    !Number.isInteger(totalChunks) ||
    chunkIndex < 0 ||
    totalChunks < 1 ||
    totalChunks > MAX_CHUNKS_PER_FILE ||
    chunkIndex >= totalChunks
  ) {
    throw new Error("Ogiltigt delnummer i uppladdningen.");
  }
}

function localUploadRoot(uploadId: string): string {
  assertUploadId(uploadId);
  return path.join(tmpdir(), "kartarkiv-studio-uploads", uploadId);
}

function localChunkPath(
  uploadId: string,
  fileKey: RaceUploadFileKey,
  chunkIndex: number,
): string {
  return path.join(
    localUploadRoot(uploadId),
    fileKey,
    `${String(chunkIndex).padStart(4, "0")}.part`,
  );
}

export async function storeRaceUploadChunk(options: {
  uploadId: string;
  fileKey: string;
  chunkIndex: number;
  totalChunks: number;
  content: ArrayBuffer;
}): Promise<string> {
  const { uploadId, fileKey, chunkIndex, totalChunks, content } = options;
  assertUploadId(uploadId);
  assertFileKey(fileKey);
  assertChunkIndex(chunkIndex, totalChunks);

  if (shouldPublishToGitHub()) {
    return createTemporaryGitHubBlob(content);
  }

  const chunkPath = localChunkPath(uploadId, fileKey, chunkIndex);
  await mkdir(path.dirname(chunkPath), { recursive: true });
  await writeFile(chunkPath, Buffer.from(content));

  return `${uploadId}:${fileKey}:${chunkIndex}`;
}

export async function assembleRaceUpload(options: {
  uploadId: string;
  fileKey: RaceUploadFileKey;
  chunkRefs: string[];
  byteLength: number;
}): Promise<ArrayBuffer> {
  const { uploadId, fileKey, chunkRefs, byteLength } = options;
  assertUploadId(uploadId);

  if (
    !Array.isArray(chunkRefs) ||
    chunkRefs.length < 1 ||
    chunkRefs.length > MAX_CHUNKS_PER_FILE ||
    !Number.isInteger(byteLength) ||
    byteLength < 1
  ) {
    throw new Error(`Ogiltigt uppladdningsmanifest för ${fileKey}.`);
  }

  const parts: Buffer[] = [];

  if (shouldPublishToGitHub()) {
    for (const ref of chunkRefs) {
      if (!/^[0-9a-f]{40}$/i.test(ref)) {
        throw new Error(`Ogiltig GitHub-referens för ${fileKey}.`);
      }
      parts.push(Buffer.from(await readTemporaryGitHubBlob(ref)));
    }
  } else {
    for (let index = 0; index < chunkRefs.length; index += 1) {
      const ref = chunkRefs[index];
      if (!SAFE_CHUNK_REF.test(ref)) {
        throw new Error(`Ogiltig lokal uppladdningsreferens för ${fileKey}.`);
      }

      const expectedRef = `${uploadId}:${fileKey}:${index}`;
      if (ref !== expectedRef) {
        throw new Error(`Fel ordning på uppladdningsdelarna för ${fileKey}.`);
      }

      parts.push(await readFile(localChunkPath(uploadId, fileKey, index)));
    }
  }

  const combined = Buffer.concat(parts);

  if (combined.byteLength !== byteLength) {
    throw new Error(
      `Uppladdningen av ${fileKey} är ofullständig (${combined.byteLength} av ${byteLength} byte).`,
    );
  }

  return combined.buffer.slice(
    combined.byteOffset,
    combined.byteOffset + combined.byteLength,
  ) as ArrayBuffer;
}

export async function cleanupRaceUpload(uploadId: string): Promise<void> {
  if (shouldPublishToGitHub()) {
    // Fristående Git-blobs är inte kopplade till någon commit och städas av GitHub.
    return;
  }

  if (!SAFE_UPLOAD_ID.test(uploadId)) {
    return;
  }

  await rm(localUploadRoot(uploadId), {
    recursive: true,
    force: true,
  }).catch(() => undefined);
}
