import {
  mkdir,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

import {
  NextRequest,
  NextResponse,
} from "next/server";

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

type CreatedFile = {
  relativePath: string;
  absolutePath: string;
};

const SAFE_SLUG_PATTERN =
  /^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/;

const SAFE_YEAR_PATTERN = /^\d{4}$/;

function repositoryRoot(): string {
  /*
   * Studio ligger i <kartarkiv>/studio.
   * Next-processen startas från studio-mappen.
   */
  return path.resolve(process.cwd(), "..");
}

function safeRepositoryPath(
  relativePath: string,
): string {
  const root = repositoryRoot();

  const normalized = relativePath
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");

  const absolute = path.resolve(
    root,
    normalized,
  );

  const relative = path.relative(
    root,
    absolute,
  );

  if (
    relative.startsWith("..") ||
    path.isAbsolute(relative)
  ) {
    throw new Error(
      "Ogiltig filsökväg i skapandebegäran.",
    );
  }

  return absolute;
}

async function exists(
  filePath: string,
): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

function readMetadata(
  formData: FormData,
): CreateRaceMetadata {
  const rawMetadata =
    formData.get("metadata");

  if (typeof rawMetadata !== "string") {
    throw new Error(
      "Metadata saknas i begäran.",
    );
  }

  const metadata =
    JSON.parse(rawMetadata) as
      Partial<CreateRaceMetadata>;

  const slug =
    metadata.slug?.trim() ?? "";

  const year =
    metadata.year?.trim() ?? "";

  const markdown =
    metadata.markdown ?? "";

  if (!SAFE_SLUG_PATTERN.test(slug)) {
    throw new Error(
      "Filnamnet är ogiltigt. Kontrollera datum och tävlingstitel.",
    );
  }

  if (!SAFE_YEAR_PATTERN.test(year)) {
    throw new Error(
      "Tävlingsåret är ogiltigt.",
    );
  }

  if (!markdown.trim()) {
    throw new Error(
      "Den genererade Markdown-filen är tom.",
    );
  }

  return {
    slug,
    year,
    markdown,
    mapImagePath:
      metadata.mapImagePath ?? null,
    routeImagePath:
      metadata.routeImagePath ?? null,
    gpsFilePath:
      metadata.gpsFilePath ?? null,
  };
}

function uploadedFile(
  formData: FormData,
  name: string,
): File | null {
  const value = formData.get(name);

  return value instanceof File &&
    value.size > 0
    ? value
    : null;
}

function repositoryRelativePath(
  metadata: CreateRaceMetadata,
  kind:
    | "markdown"
    | "mapImage"
    | "routeImage"
    | "gpxFile",
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
    ? path.posix.join(
        "public",
        sourcePath.replace(/^\/+/, ""),
      )
    : null;
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse> {
  const createdPaths: string[] = [];

  try {
    const formData =
      await request.formData();

    const metadata =
      readMetadata(formData);

    const files = {
      mapImage:
        uploadedFile(
          formData,
          "mapImage",
        ),
      routeImage:
        uploadedFile(
          formData,
          "routeImage",
        ),
      gpxFile:
        uploadedFile(
          formData,
          "gpxFile",
        ),
    };

    if (!files.mapImage) {
      return NextResponse.json(
        {
          error:
            "Blank karta måste vara vald.",
        },
        {
          status: 400,
        },
      );
    }

    const pairs = [
      [
        metadata.mapImagePath,
        files.mapImage,
        "blank karta",
      ],
      [
        metadata.routeImagePath,
        files.routeImage,
        "ruttkarta",
      ],
      [
        metadata.gpsFilePath,
        files.gpxFile,
        "GPX-fil",
      ],
    ] as const;

    for (const [declaredPath, file, label] of pairs) {
      if (Boolean(declaredPath) !== Boolean(file)) {
        return NextResponse.json(
          {
            error:
              `Sökvägen för ${label} stämmer inte överens med uppladdningen.`,
          },
          {
            status: 400,
          },
        );
      }
    }

    const targets: Array<{
      relativePath: string;
      content: string | ArrayBuffer;
    }> = [];

    const markdownRelative =
      repositoryRelativePath(
        metadata,
        "markdown",
      );

    if (!markdownRelative) {
      throw new Error(
        "Markdown-sökvägen kunde inte skapas.",
      );
    }

    targets.push({
      relativePath: markdownRelative,
      content: metadata.markdown,
    });

    const fileEntries = [
      {
        kind: "mapImage" as const,
        file: files.mapImage,
      },
      {
        kind: "routeImage" as const,
        file: files.routeImage,
      },
      {
        kind: "gpxFile" as const,
        file: files.gpxFile,
      },
    ];

    for (const entry of fileEntries) {
      if (!entry.file) {
        continue;
      }

      const relativePath =
        repositoryRelativePath(
          metadata,
          entry.kind,
        );

      if (!relativePath) {
        throw new Error(
          `Sökvägen för ${entry.kind} kunde inte skapas.`,
        );
      }

      targets.push({
        relativePath,
        content:
          await entry.file.arrayBuffer(),
      });
    }

    const conflicts: string[] = [];

    for (const target of targets) {
      const absolutePath =
        safeRepositoryPath(
          target.relativePath,
        );

      if (await exists(absolutePath)) {
        conflicts.push(
          target.relativePath,
        );
      }
    }

    if (conflicts.length > 0) {
      return NextResponse.json(
        {
          error:
            "Tävlingen kunde inte skapas eftersom följande filer redan finns.",
          conflicts,
        },
        {
          status: 409,
        },
      );
    }

    for (const target of targets) {
      const absolutePath =
        safeRepositoryPath(
          target.relativePath,
        );

      await mkdir(
        path.dirname(absolutePath),
        {
          recursive: true,
        },
      );

      await writeFile(
        absolutePath,
        typeof target.content === "string"
          ? target.content
          : Buffer.from(
              target.content,
            ),
      );

      createdPaths.push(absolutePath);
    }

    const created: CreatedFile[] =
      targets.map((target) => ({
        relativePath:
          target.relativePath,
        absolutePath:
          safeRepositoryPath(
            target.relativePath,
          ),
      }));

    return NextResponse.json(
      {
        success: true,
        repositoryRoot:
          repositoryRoot(),
        created,
        nextStep:
          "Kontrollera ändringarna i VS Code och publicera dem sedan med GitHub Desktop: Commit to main och Push origin.",
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (caughtError) {
    /*
     * Om skrivningen avbryts tas bara filer bort som
     * skapades under just detta anrop.
     */
    await Promise.all(
      createdPaths.map((filePath) =>
        rm(filePath, {
          force: true,
        }).catch(() => undefined),
      ),
    );

    const message =
      caughtError instanceof Error
        ? caughtError.message
        : "Tävlingen kunde inte skapas.";

    console.error(
      "Kunde inte skapa tävling:",
      caughtError,
    );

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}