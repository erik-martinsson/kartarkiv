import {
  normalizePublishedRaceId,
  parsePublishedMarkdown,
  publishedFieldsFromFrontmatter,
  publishedRacePublicUrl,
  publishedRaceRepositoryPath,
  publishedSummaryFromContent,
  serializePublishedMarkdown,
} from "@/lib/publishedRaceCodec";
import type {
  PublishedRaceDocument,
  PublishedRaceFields,
  PublishedRaceSummary,
} from "@/types/published";

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_API_VERSION = "2022-11-28";
const RACES_ROOT = "src/content/races";

type GitHubConfiguration = {
  token: string;
  owner: string;
  repo: string;
  branch: string;
};

type GitHubContentEntry = {
  type?: "file" | "dir" | "symlink" | "submodule";
  name?: string;
  path?: string;
  sha?: string;
  download_url?: string | null;
};

type GitHubContentFile = GitHubContentEntry & {
  content?: string;
  encoding?: string;
};

class GitHubApiError extends Error {
  status: number;
  apiPath: string;

  constructor(status: number, apiPath: string, message: string) {
    super(message);
    this.name = "GitHubApiError";
    this.status = status;
    this.apiPath = apiPath;
  }
}

function requireEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} saknas i Vercels Environment Variables.`);
  }

  return value;
}

function configuration(): GitHubConfiguration {
  return {
    token: requireEnvironmentVariable("GITHUB_TOKEN"),
    owner: requireEnvironmentVariable("GITHUB_OWNER"),
    repo: requireEnvironmentVariable("GITHUB_REPO"),
    branch: process.env.GITHUB_BRANCH?.trim() || "main",
  };
}

function repoBase(config: GitHubConfiguration): string {
  return `/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}`;
}

function encodeRepositoryPath(repositoryPath: string): string {
  return repositoryPath
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/");
}

async function githubRequest<T>(
  config: GitHubConfiguration,
  apiPath: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE}${apiPath}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
      "User-Agent": "KartarkivStudio/1.0",
      "X-GitHub-Api-Version": GITHUB_API_VERSION,
      ...init.headers,
    },
  });

  const text = await response.text();
  let parsed: unknown = null;

  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }

  if (!response.ok) {
    const apiMessage =
      parsed && typeof parsed === "object" && "message" in parsed
        ? String((parsed as { message?: unknown }).message || "")
        : "";

    const message =
      `GitHub API svarade med HTTP ${response.status} för ${apiPath}` +
      (apiMessage ? `: ${apiMessage}` : "");

    throw new GitHubApiError(response.status, apiPath, message);
  }

  return parsed as T;
}

function decodeBase64Utf8(value: string): string {
  return Buffer.from(value.replace(/\s+/g, ""), "base64").toString("utf8");
}

function contentApiPath(
  config: GitHubConfiguration,
  repositoryPath: string,
): string {
  return (
    `${repoBase(config)}/contents/${encodeRepositoryPath(repositoryPath)}` +
    `?ref=${encodeURIComponent(config.branch)}`
  );
}

async function readDirectory(
  config: GitHubConfiguration,
  repositoryPath: string,
): Promise<GitHubContentEntry[]> {
  const result = await githubRequest<GitHubContentEntry[] | GitHubContentFile>(
    config,
    contentApiPath(config, repositoryPath),
  );

  if (!Array.isArray(result)) {
    throw new Error(
      `GitHub-sökvägen ${repositoryPath} är inte en katalog.`,
    );
  }

  return result;
}

async function findMarkdownFiles(
  config: GitHubConfiguration,
  repositoryPath: string,
): Promise<Array<{ path: string; downloadUrl: string | null }>> {
  const entries = await readDirectory(config, repositoryPath);
  const output: Array<{ path: string; downloadUrl: string | null }> = [];

  for (const entry of entries) {
    if (entry.type === "dir" && entry.path) {
      output.push(...(await findMarkdownFiles(config, entry.path)));
      continue;
    }

    if (
      entry.type === "file" &&
      entry.path &&
      entry.path.toLowerCase().endsWith(".md")
    ) {
      output.push({
        path: entry.path,
        downloadUrl:
          typeof entry.download_url === "string" && entry.download_url
            ? entry.download_url
            : null,
      });
    }
  }

  return output;
}

async function readRawUrl(url: string): Promise<string> {
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "User-Agent": "KartarkivStudio/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(
      `GitHub kunde inte läsa Markdown-filen (HTTP ${response.status}).`,
    );
  }

  return response.text();
}

async function readContentFile(
  config: GitHubConfiguration,
  repositoryPath: string,
): Promise<{ content: string; sha: string }> {
  const file = await githubRequest<GitHubContentFile>(
    config,
    contentApiPath(config, repositoryPath),
  );

  if (
    file.type !== "file" ||
    file.encoding !== "base64" ||
    typeof file.content !== "string" ||
    typeof file.sha !== "string" ||
    !file.sha
  ) {
    throw new Error(
      `GitHub returnerade inte filen ${repositoryPath} i förväntat format.`,
    );
  }

  return {
    content: decodeBase64Utf8(file.content),
    sha: file.sha,
  };
}

async function readListedMarkdown(
  config: GitHubConfiguration,
  entry: { path: string; downloadUrl: string | null },
): Promise<string> {
  if (entry.downloadUrl) {
    return readRawUrl(entry.downloadUrl);
  }

  const result = await readContentFile(config, entry.path);
  return result.content;
}

async function mapWithConcurrency<T, R>(
  values: T[],
  concurrency: number,
  mapper: (value: T) => Promise<R>,
): Promise<R[]> {
  const output = new Array<R>(values.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (true) {
      const index = nextIndex;
      nextIndex += 1;

      if (index >= values.length) {
        return;
      }

      output[index] = await mapper(values[index]);
    }
  }

  const workerCount = Math.min(concurrency, values.length);

  await Promise.all(
    Array.from({ length: workerCount }, () => worker()),
  );

  return output;
}

function raceIdFromRepositoryPath(repositoryPath: string): string {
  const prefix = `${RACES_ROOT}/`;

  if (
    !repositoryPath.startsWith(prefix) ||
    !repositoryPath.toLowerCase().endsWith(".md")
  ) {
    throw new Error(`Ogiltig tävlingssökväg från GitHub: ${repositoryPath}`);
  }

  return repositoryPath
    .slice(prefix.length)
    .replace(/\.md$/i, "");
}

export async function listGitHubPublishedRaces(): Promise<
  PublishedRaceSummary[]
> {
  const config = configuration();

  /*
   * Viktigt: listningen använder GitHubs Contents API.
   * Den gamla versionen använde /git/ref och /git/trees och gjorde dessutom
   * om ALLA 404-fel till "Tävlingen hittades inte", vilket dolde det riktiga
   * felet när själva repot/branchen/katalogen inte kunde läsas.
   */
  const files = await findMarkdownFiles(config, RACES_ROOT);

  const summaries = await mapWithConcurrency(
    files,
    20,
    async (entry): Promise<PublishedRaceSummary> => {
      const content = await readListedMarkdown(config, entry);
      const id = raceIdFromRepositoryPath(entry.path);
      return publishedSummaryFromContent(id, content);
    },
  );

  return summaries.sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date);
    return dateCompare || a.title.localeCompare(b.title, "sv-SE");
  });
}

export async function readGitHubPublishedRace(
  id: string,
): Promise<PublishedRaceDocument> {
  const config = configuration();
  const normalizedId = normalizePublishedRaceId(id);
  const repositoryPath = publishedRaceRepositoryPath(normalizedId);

  let content: string;

  try {
    ({ content } = await readContentFile(config, repositoryPath));
  } catch (error) {
    /*
     * Endast när EN SPECIFIK tävlingsfil saknas översätts 404 till ENOENT.
     * Fel vid listning av repo/branch/katalog ska visas som riktiga GitHub-fel.
     */
    if (error instanceof GitHubApiError && error.status === 404) {
      const notFound = new Error("Tävlingen hittades inte.");
      Object.assign(notFound, { code: "ENOENT" });
      throw notFound;
    }

    throw error;
  }

  const parsed = parsePublishedMarkdown(content);

  return {
    id: normalizedId,
    filePath: repositoryPath,
    publicUrl: publishedRacePublicUrl(normalizedId),
    fields: publishedFieldsFromFrontmatter(parsed.frontmatter),
    body: parsed.body,
  };
}

export async function writeGitHubPublishedRace(
  id: string,
  fields: PublishedRaceFields,
  body: string,
): Promise<PublishedRaceDocument> {
  const config = configuration();
  const normalizedId = normalizePublishedRaceId(id);
  const repositoryPath = publishedRaceRepositoryPath(normalizedId);

  let current: { content: string; sha: string };

  try {
    current = await readContentFile(config, repositoryPath);
  } catch (error) {
    if (error instanceof GitHubApiError && error.status === 404) {
      const notFound = new Error("Tävlingen hittades inte.");
      Object.assign(notFound, { code: "ENOENT" });
      throw notFound;
    }

    throw error;
  }

  const nextContent = serializePublishedMarkdown(
    current.content,
    fields,
    body,
  );
  const encodedPath = encodeRepositoryPath(repositoryPath);

  await githubRequest<unknown>(
    config,
    `${repoBase(config)}/contents/${encodedPath}`,
    {
      method: "PUT",
      body: JSON.stringify({
        message: `Update published race ${normalizedId}`,
        content: Buffer.from(nextContent, "utf8").toString("base64"),
        sha: current.sha,
        branch: config.branch,
      }),
    },
  );

  const parsed = parsePublishedMarkdown(nextContent);

  return {
    id: normalizedId,
    filePath: repositoryPath,
    publicUrl: publishedRacePublicUrl(normalizedId),
    fields: publishedFieldsFromFrontmatter(parsed.frontmatter),
    body: parsed.body,
  };
}
