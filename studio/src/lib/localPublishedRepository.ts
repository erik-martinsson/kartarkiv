import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { findRepositoryRoot } from "@/lib/migrationPaths";
import {
  normalizePublishedRaceId,
  parsePublishedMarkdown,
  publishedFieldsFromFrontmatter,
  publishedRacePublicUrl,
  publishedSummaryFromContent,
  serializePublishedMarkdown,
} from "@/lib/publishedRaceCodec";
import type {
  PublishedRaceDocument,
  PublishedRaceFields,
  PublishedRaceSummary,
} from "@/types/published";

export async function getLocalPublishedRacesRoot(): Promise<{
  repositoryRoot: string;
  racesRoot: string;
}> {
  const { root, searchedRoots } = await findRepositoryRoot();

  if (!root) {
    throw new Error(
      `Kunde inte hitta repots rot. Sökta mappar: ${searchedRoots.join(", ")}`,
    );
  }

  return {
    repositoryRoot: root,
    racesRoot: path.join(root, "src", "content", "races"),
  };
}

function safeRacePath(racesRoot: string, id: string): string {
  const normalizedId = normalizePublishedRaceId(id);
  const candidate = path.resolve(racesRoot, `${normalizedId}.md`);
  const relative = path.relative(racesRoot, candidate);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Tävlingsfilen ligger utanför races-mappen.");
  }

  return candidate;
}

async function findMarkdownFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await findMarkdownFiles(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

export async function listLocalPublishedRaces(): Promise<
  PublishedRaceSummary[]
> {
  const { racesRoot } = await getLocalPublishedRacesRoot();
  const files = await findMarkdownFiles(racesRoot);

  const summaries = await Promise.all(
    files.map(async (filePath) => {
      const content = await readFile(filePath, "utf8");
      const id = path
        .relative(racesRoot, filePath)
        .replace(/\\/g, "/")
        .replace(/\.md$/i, "");

      return publishedSummaryFromContent(id, content);
    }),
  );

  return summaries.sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date);
    return dateCompare || a.title.localeCompare(b.title, "sv-SE");
  });
}

export async function readLocalPublishedRace(
  id: string,
): Promise<PublishedRaceDocument> {
  const { repositoryRoot, racesRoot } = await getLocalPublishedRacesRoot();
  const normalizedId = normalizePublishedRaceId(id);
  const filePath = safeRacePath(racesRoot, normalizedId);
  const content = await readFile(filePath, "utf8");
  const parsed = parsePublishedMarkdown(content);

  return {
    id: normalizedId,
    filePath: path.relative(repositoryRoot, filePath).replace(/\\/g, "/"),
    publicUrl: publishedRacePublicUrl(normalizedId),
    fields: publishedFieldsFromFrontmatter(parsed.frontmatter),
    body: parsed.body,
  };
}

export async function writeLocalPublishedRace(
  id: string,
  fields: PublishedRaceFields,
  body: string,
): Promise<PublishedRaceDocument> {
  const { racesRoot } = await getLocalPublishedRacesRoot();
  const normalizedId = normalizePublishedRaceId(id);
  const filePath = safeRacePath(racesRoot, normalizedId);
  const originalContent = await readFile(filePath, "utf8");
  const nextContent = serializePublishedMarkdown(
    originalContent,
    fields,
    body,
  );

  await writeFile(filePath, nextContent, "utf8");

  return readLocalPublishedRace(normalizedId);
}
