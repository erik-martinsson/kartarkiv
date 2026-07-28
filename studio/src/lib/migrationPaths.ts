import { access, mkdir } from "node:fs/promises";
import path from "node:path";

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

  for (let level = 0; level < 8; level += 1) {
    roots.push(current);
    const parent = path.dirname(current);

    if (parent === current) {
      break;
    }

    current = parent;
  }

  return [...new Set(roots)];
}

export async function findRepositoryRoot(): Promise<{
  root: string | null;
  searchedRoots: string[];
}> {
  const searchedRoots = createSearchRoots();

  for (const root of searchedRoots) {
    if (await pathExists(path.join(root, "migration"))) {
      return { root, searchedRoots };
    }
  }

  return { root: null, searchedRoots };
}

export async function findEnrichedCompetitionFile(mapId: string): Promise<{
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
      return { filePath: candidate, searchedPaths };
    }
  }

  return { filePath: null, searchedPaths };
}

export async function getReviewedDirectory(): Promise<string | null> {
  const { root } = await findRepositoryRoot();

  if (!root) {
    return null;
  }

  const reviewedDirectory = path.join(root, "migration", "reviewed");
  await mkdir(reviewedDirectory, { recursive: true });
  return reviewedDirectory;
}

export async function getReviewedFilePath(
  mapId: string,
): Promise<string | null> {
  const reviewedDirectory = await getReviewedDirectory();

  return reviewedDirectory
    ? path.join(reviewedDirectory, `doma-${mapId}.json`)
    : null;
}
