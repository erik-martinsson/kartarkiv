import {
  mkdir,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

import {
  publishFilesToGitHub,
  shouldPublishToGitHub,
  type RepositoryFileTarget,
} from "@/lib/githubRepository";
import {
  assembleRaceUpload,
  cleanupRaceUpload,
  type RaceUploadFileKey,
} from "@/lib/raceUploadChunks";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CreateRaceMetadata = {
  slug: string;
  year: string;
  markdown: string;
  mapImagePath: string | null;
  routeImagePath: string | null;
  gpsFilePath: string | null;
};

type UploadManifest = {
  chunkRefs: string[];
  byteLength: number;
};

type CreateRaceRequest = {
  uploadId?: string;
  metadata?: Partial<CreateRaceMetadata>;
  uploads?: Partial<Record<RaceUploadFileKey, UploadManifest | null>>;
};

type CreatedFile = {
  relativePath: string;
  absolutePath: string;
};

const SAFE_SLUG_PATTERN =
  /^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SAFE_YEAR_PATTERN = /^\d{4}$/;
const SAFE_UPLOAD_ID = /^[a-zA-Z0-9_-]{8,100}$/;

function repositoryRoot(): string {
  return path.resolve(process.cwd(), "..");
}

function safeRepositoryPath(relativePath: string): string {
  const root = repositoryRoot();
  const normalized = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  const absolute = path.resolve(root, normalized);
  const relative = path.relative(root, absolute);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Ogiltig filsökväg i skapandebegäran.");
  }

  return absolute;
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

function readMetadata(
  rawMetadata: Partial<CreateRaceMetadata> | undefined,
): CreateRaceMetadata {
  const slug = rawMetadata?.slug?.trim() ?? "";
  const year = rawMetadata?.year?.trim() ?? "";
  const markdown = rawMetadata?.markdown ?? "";

  if (!SAFE_SLUG_PATTERN.test(slug)) {
    throw new Error(
      "Filnamnet är ogiltigt. Kontrollera datum och tävlingstitel.",
    );
  }

  if (!SAFE_YEAR_PATTERN.test(year)) {
    throw new Error("Tävlingsåret är ogiltigt.");
  }

  if (!markdown.trim()) {
    throw new Error("Den genererade Markdown-filen är tom.");
  }

  return {
    slug,
    year,
    markdown,
    mapImagePath: rawMetadata?.mapImagePath ?? null,
    routeImagePath: rawMetadata?.routeImagePath ?? null,
    gpsFilePath: rawMetadata?.gpsFilePath ?? null,
  };
}

function readUploadId(raw: string | undefined): string {
  const uploadId = raw?.trim() ?? "";

  if (!SAFE_UPLOAD_ID.test(uploadId)) {
    throw new Error("Ogiltigt uppladdnings-ID.");
  }

  return uploadId;
}

function readManifest(
  value: UploadManifest | null | undefined,
  label: string,
): UploadManifest | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (
    !Array.isArray(value.chunkRefs) ||
    value.chunkRefs.length < 1 ||
    !Number.isInteger(value.byteLength) ||
    value.byteLength < 1
  ) {
    throw new Error(`Uppladdningen för ${label} är ogiltig.`);
  }

  return {
    chunkRefs: value.chunkRefs.map(String),
    byteLength: value.byteLength,
  };
}

function repositoryRelativePath(
  metadata: CreateRaceMetadata,
  kind: "markdown" | RaceUploadFileKey,
): string | null {
  if (kind === "markdown") {
    return path.posix.join(
      "src",
      "content",
      "races",
      metadata.year,
      `${metadata.slug}.md`,
    );
  }

  const sourcePath =
    kind === "mapImage"
      ? metadata.mapImagePath
      : kind === "routeImage"
        ? metadata.routeImagePath
        : metadata.gpsFilePath;

  return sourcePath
    ? path.posix.join("public", sourcePath.replace(/^\/+/, ""))
    : null;
}

function githubBranch(): string {
  const raw = process.env.GITHUB_BRANCH?.trim() || "main";
  return raw.split(/\r?\n/, 1)[0].trim() || "main";
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const createdPaths: string[] = [];
  let uploadId = "";

  try {
    let body: CreateRaceRequest;

    try {
      body = (await request.json()) as CreateRaceRequest;
    } catch {
      return NextResponse.json(
        { error: "Skapandebegäran innehåller ogiltig JSON." },
        { status: 400 },
      );
    }

    uploadId = readUploadId(body.uploadId);
    const metadata = readMetadata(body.metadata);

    const uploads = {
      mapImage: readManifest(body.uploads?.mapImage, "blank karta"),
      routeImage: readManifest(body.uploads?.routeImage, "ruttkarta"),
      gpxFile: readManifest(body.uploads?.gpxFile, "GPX-fil"),
    };

    if (!uploads.mapImage) {
      return NextResponse.json(
        { error: "Blank karta måste vara vald." },
        { status: 400 },
      );
    }

    const pairs = [
      [metadata.mapImagePath, uploads.mapImage, "blank karta"],
      [metadata.routeImagePath, uploads.routeImage, "ruttkarta"],
      [metadata.gpsFilePath, uploads.gpxFile, "GPX-fil"],
    ] as const;

    for (const [declaredPath, manifest, label] of pairs) {
      if (Boolean(declaredPath) !== Boolean(manifest)) {
        return NextResponse.json(
          {
            error: `Sökvägen för ${label} stämmer inte överens med uppladdningen.`,
          },
          { status: 400 },
        );
      }
    }

    const targets: RepositoryFileTarget[] = [
      {
        relativePath: repositoryRelativePath(metadata, "markdown")!,
        content: metadata.markdown,
      },
    ];

    const fileEntries: Array<{
      kind: RaceUploadFileKey;
      manifest: UploadManifest | null;
    }> = [
      { kind: "mapImage", manifest: uploads.mapImage },
      { kind: "routeImage", manifest: uploads.routeImage },
      { kind: "gpxFile", manifest: uploads.gpxFile },
    ];

    for (const entry of fileEntries) {
      if (!entry.manifest) continue;

      const relativePath = repositoryRelativePath(metadata, entry.kind);
      if (!relativePath) {
        throw new Error(`Sökvägen för ${entry.kind} kunde inte skapas.`);
      }

      const content = await assembleRaceUpload({
        uploadId,
        fileKey: entry.kind,
        chunkRefs: entry.manifest.chunkRefs,
        byteLength: entry.manifest.byteLength,
      });

      targets.push({ relativePath, content });
    }

    if (shouldPublishToGitHub()) {
      const published = await publishFilesToGitHub(
        targets,
        `Lägg till tävling: ${metadata.slug}`,
      );

      const created: CreatedFile[] = targets.map((target) => ({
        relativePath: target.relativePath,
        absolutePath:
          `${published.repositoryUrl}/blob/${encodeURIComponent(githubBranch())}/` +
          target.relativePath,
      }));

      return NextResponse.json(
        {
          success: true,
          repositoryRoot: published.repositoryUrl,
          created,
          commitSha: published.commitSha,
          commitUrl: published.commitUrl,
          nextStep:
            "Tävlingen publicerades till GitHub. Kartarkivet byggs nu om automatiskt.",
        },
        {
          status: 201,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    const conflicts: string[] = [];

    for (const target of targets) {
      const absolutePath = safeRepositoryPath(target.relativePath);
      if (await exists(absolutePath)) {
        conflicts.push(target.relativePath);
      }
    }

    if (conflicts.length > 0) {
      return NextResponse.json(
        {
          error:
            "Tävlingen kunde inte skapas eftersom följande filer redan finns.",
          conflicts,
        },
        { status: 409 },
      );
    }

    for (const target of targets) {
      const absolutePath = safeRepositoryPath(target.relativePath);
      await mkdir(path.dirname(absolutePath), { recursive: true });
      await writeFile(
        absolutePath,
        typeof target.content === "string"
          ? target.content
          : Buffer.from(target.content),
      );
      createdPaths.push(absolutePath);
    }

    const created: CreatedFile[] = targets.map((target) => ({
      relativePath: target.relativePath,
      absolutePath: safeRepositoryPath(target.relativePath),
    }));

    return NextResponse.json(
      {
        success: true,
        repositoryRoot: repositoryRoot(),
        created,
        nextStep:
          "Filerna skapades lokalt. Publicera dem till GitHub med ditt vanliga arbetsflöde.",
      },
      {
        status: 201,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (caughtError) {
    await Promise.all(
      createdPaths.map((filePath) =>
        rm(filePath, { force: true }).catch(() => undefined),
      ),
    );

    const status =
      caughtError &&
      typeof caughtError === "object" &&
      "status" in caughtError &&
      Number.isInteger(Number(caughtError.status))
        ? Number(caughtError.status)
        : 500;

    const conflicts =
      caughtError &&
      typeof caughtError === "object" &&
      "conflicts" in caughtError &&
      Array.isArray(caughtError.conflicts)
        ? caughtError.conflicts
        : undefined;

    const message =
      caughtError instanceof Error
        ? caughtError.message
        : "Tävlingen kunde inte skapas.";

    console.error("Kunde inte skapa tävling:", caughtError);

    return NextResponse.json(
      { error: message, conflicts },
      {
        status,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } finally {
    if (uploadId) {
      await cleanupRaceUpload(uploadId);
    }
  }
}
