import { access, readFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import {
  findRepositoryRoot,
  getReviewedFilePath,
} from "@/lib/migrationPaths";
import type { ReviewedDomaCompetition } from "@/types/migration";

import {
  PublishTargetExistsError,
  PublishValidationError,
  buildPublishPlan,
  publishReviewed,
} from "../../../../../../../../scripts/lib/published_reviewed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = {
  params: Promise<{ mapId: string }>;
};

type PublishRequest = {
  force?: boolean;
};

function isPositiveInteger(value: string): boolean {
  return /^\d+$/.test(value) && Number(value) > 0;
}

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : String(error);
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

  const reviewedFile = await getReviewedFilePath(mapId);
  const { root: repositoryRoot } =
    await findRepositoryRoot();

  if (!reviewedFile || !repositoryRoot) {
    return NextResponse.json(
      {
        error:
          "Kunde inte hitta repots reviewed-fil eller projektrot.",
      },
      { status: 500 },
    );
  }

  try {
    const reviewed = JSON.parse(
      await readFile(reviewedFile, "utf8"),
    ) as ReviewedDomaCompetition;

    if (String(reviewed.competition?.doma?.mapId) !== mapId) {
      return NextResponse.json(
        {
          error:
            "DOMA map-ID i granskningsfilen stämmer inte överens med URL:en.",
        },
        { status: 400 },
      );
    }

    const plan = buildPublishPlan(reviewed, {
      projectRoot: repositoryRoot,
      sourceFile: reviewedFile,
    });

    let published = false;

    try {
      await access(plan.markdownPath);
      published = true;
    } catch {
      published = false;
    }

    return NextResponse.json(
      {
        published,
        markdown: path.relative(
          repositoryRoot,
          plan.markdownPath,
        ),
        publicId: plan.markdownPublicId,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    const code =
      error &&
      typeof error === "object" &&
      "code" in error
        ? String(error.code)
        : "";

    if (code === "ENOENT") {
      return NextResponse.json(
        {
          published: false,
          markdown: null,
          publicId: null,
        },
        {
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    return NextResponse.json(
      {
        error:
          `Publiceringsstatus kunde inte läsas: ${errorMessage(error)}`,
      },
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
    return NextResponse.json(
      { error: "Ogiltigt DOMA map-ID." },
      { status: 400 },
    );
  }

  let body: PublishRequest = {};

  try {
    body = (await request.json()) as PublishRequest;
  } catch {
    // Tom body är tillåten och betyder force=false.
  }

  const reviewedFile = await getReviewedFilePath(mapId);
  const { root: repositoryRoot } =
    await findRepositoryRoot();

  if (!reviewedFile || !repositoryRoot) {
    return NextResponse.json(
      {
        error:
          "Kunde inte hitta repots reviewed-fil eller projektrot.",
      },
      { status: 500 },
    );
  }

  let reviewed: ReviewedDomaCompetition;

  try {
    reviewed = JSON.parse(
      await readFile(reviewedFile, "utf8"),
    ) as ReviewedDomaCompetition;
  } catch (error) {
    return NextResponse.json(
      {
        error:
          `Granskningsfilen kunde inte läsas: ${errorMessage(error)}`,
      },
      { status: 500 },
    );
  }

  if (String(reviewed.competition?.doma?.mapId) !== mapId) {
    return NextResponse.json(
      {
        error:
          "DOMA map-ID i granskningsfilen stämmer inte överens med URL:en.",
      },
      { status: 400 },
    );
  }

  try {
    const result = await publishReviewed(reviewed, {
      projectRoot: repositoryRoot,
      sourceFile: reviewedFile,
      force: body.force === true,
    });

    return NextResponse.json(
      {
        ok: true,
        markdown: path.relative(
          repositoryRoot,
          result.markdownPath,
        ),
        publicId: result.markdownPublicId,
        assets: result.assets.map((asset) => ({
          kind: asset.kind,
          path: path.relative(
            repositoryRoot,
            asset.diskPath,
          ),
          publicPath: asset.publicPath,
          byteLength: asset.byteLength,
          contentType: asset.contentType,
        })),
        warnings: result.warnings,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    if (error instanceof PublishTargetExistsError) {
      return NextResponse.json(
        {
          error:
            "Tävlingen är redan publicerad. Bekräfta överskrivning för att fortsätta.",
          code: "target-exists",
          existingTargets: error.targets.map((target) =>
            path.relative(repositoryRoot, target),
          ),
        },
        { status: 409 },
      );
    }

    if (error instanceof PublishValidationError) {
      return NextResponse.json(
        {
          error: error.message,
          code: "validation-error",
          issues: error.issues,
        },
        { status: 422 },
      );
    }

    console.error(
      `Kunde inte publicera DOMA ${mapId}:`,
      error,
    );

    return NextResponse.json(
      {
        error:
          `Publiceringen misslyckades: ${errorMessage(error)}`,
        code: "publish-error",
      },
      { status: 500 },
    );
  }
}