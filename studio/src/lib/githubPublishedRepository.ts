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
const RACES_PREFIX = "src/content/races/";

type GitHubConfiguration = {
  token: string;
  owner: string;
  repo: string;
  branch: string;
};

type GitHubReference = {
  object?: { sha?: string };
};

type GitHubCommit = {
  tree?: { sha?: string };
};

type GitHubTreeEntry = {
  path?: string;
  type?: string;
  sha?: string;
};

type GitHubTree = {
  tree?: GitHubTreeEntry[];
  truncated?: boolean;
};

type GitHubBlob = {
  content?: string;
  encoding?: string;
};

type GitHubContentFile = {
  sha?: string;
  content?: string;
  encoding?: string;
};

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
    if (response.status === 404) {
      const error = new Error("Tävlingen hittades inte.");
      Object.assign(error, { code: "ENOENT" });
      throw error;
    }

    const apiMessage =
      parsed && typeof parsed === "object" && "message" in parsed
        ? String((parsed as { message?: unknown }).message || "")
        : "";

    throw new Error(
      `GitHub API svarade med HTTP ${response.status}${
        apiMessage ? `: ${apiMessage}` : ""
      }`,
    );
  }

  return parsed as T;
}

function decodeBase64Utf8(value: string): string {
  return Buffer.from(value.replace(/\s+/g, ""), "base64").toString("utf8");
}

async function currentTreeSha(
  config: GitHubConfiguration,
): Promise<string> {
  const reference = await githubRequest<GitHubReference>(
    config,
    `${repoBase(config)}/git/ref/heads/${encodeURIComponent(config.branch)}`,
  );
  const commitSha = reference.object?.sha;

  if (!commitSha) {
    throw new Error("GitHub returnerade ingen commit för målgrenen.");
  }

  const commit = await githubRequest<GitHubCommit>(
    config,
    `${repoBase(config)}/git/commits/${encodeURIComponent(commitSha)}`,
  );
  const treeSha = commit.tree?.sha;

  if (!treeSha) {
    throw new Error("GitHub returnerade inget filträd för målgrenen.");
  }

  return treeSha;
}

async function raceTreeEntries(
  config: GitHubConfiguration,
): Promise<Array<{ path: string; sha: string }>> {
  const treeSha = await currentTreeSha(config);
  const tree = await githubRequest<GitHubTree>(
    config,
    `${repoBase(config)}/git/trees/${encodeURIComponent(treeSha)}?recursive=1`,
  );

  if (tree.truncated) {
    throw new Error(
      "GitHubs filträd blev för stort för att listas komplett. Publicerade tävlingar kan därför inte visas säkert.",
    );
  }

  return (tree.tree ?? [])
    .filter(
      (entry): entry is GitHubTreeEntry & { path: string; sha: string } =>
        entry.type === "blob" &&
        typeof entry.path === "string" &&
        entry.path.startsWith(RACES_PREFIX) &&
        entry.path.endsWith(".md") &&
        typeof entry.sha === "string" &&
        Boolean(entry.sha),
    )
    .map((entry) => ({ path: entry.path, sha: entry.sha }));
}

async function readBlobText(
  config: GitHubConfiguration,
  sha: string,
): Promise<string> {
  const blob = await githubRequest<GitHubBlob>(
    config,
    `${repoBase(config)}/git/blobs/${encodeURIComponent(sha)}`,
  );

  if (blob.encoding !== "base64" || typeof blob.content !== "string") {
    throw new Error("GitHub returnerade ett okänt filformat.");
  }

  return decodeBase64Utf8(blob.content);
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

      if (index >= values.length) return;
      output[index] = await mapper(values[index]);
    }
  }

  const workerCount = Math.min(concurrency, values.length);
  await Promise.all(
    Array.from({ length: workerCount }, () => worker()),
  );

  return output;
}

async function readContentFile(
  config: GitHubConfiguration,
  repositoryPath: string,
): Promise<{ content: string; sha: string }> {
  const encodedPath = repositoryPath
    .split("/")
    .map(encodeURIComponent)
    .join("/");

  const file = await githubRequest<GitHubContentFile>(
    config,
    `${repoBase(config)}/contents/${encodedPath}?ref=${encodeURIComponent(config.branch)}`,
  );

  if (
    file.encoding !== "base64" ||
    typeof file.content !== "string" ||
    typeof file.sha !== "string" ||
    !file.sha
  ) {
    throw new Error("GitHub returnerade inte den publicerade filen korrekt.");
  }

  return {
    content: decodeBase64Utf8(file.content),
    sha: file.sha,
  };
}

export async function listGitHubPublishedRaces(): Promise<
  PublishedRaceSummary[]
> {
  const config = configuration();
  const entries = await raceTreeEntries(config);

  const summaries = await mapWithConcurrency(entries, 16, async (entry) => {
    const content = await readBlobText(config, entry.sha);
    const id = entry.path
      .slice(RACES_PREFIX.length)
      .replace(/\.md$/i, "");

    return publishedSummaryFromContent(id, content);
  });

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
  const { content } = await readContentFile(config, repositoryPath);
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
  const current = await readContentFile(config, repositoryPath);
  const nextContent = serializePublishedMarkdown(
    current.content,
    fields,
    body,
  );
  const encodedPath = repositoryPath
    .split("/")
    .map(encodeURIComponent)
    .join("/");

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

  /*
   * Bygg dokumentet från den data vi precis skrev. Då behöver vi inte göra
   * ytterligare ett GitHub-anrop innan API-rutten kan svara.
   */
  const parsed = parsePublishedMarkdown(nextContent);

  return {
    id: normalizedId,
    filePath: repositoryPath,
    publicUrl: publishedRacePublicUrl(normalizedId),
    fields: publishedFieldsFromFrontmatter(parsed.frontmatter),
    body: parsed.body,
  };
}
