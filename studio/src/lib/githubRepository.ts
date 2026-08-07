const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_API_VERSION = "2022-11-28";

export type RepositoryFileTarget = {
  relativePath: string;
  content: string | ArrayBuffer;
};

type GitHubConfiguration = {
  token: string;
  owner: string;
  repo: string;
  branch: string;
};

type GitHubReference = {
  object?: {
    sha?: string;
  };
};

type GitHubCommit = {
  sha?: string;
  tree?: {
    sha?: string;
  };
};

type GitHubObject = {
  sha?: string;
};

type GitHubBlob = {
  sha?: string;
  content?: string;
  encoding?: string;
};

export type GitHubPublishResult = {
  commitSha: string;
  commitUrl: string;
  repositoryUrl: string;
};

function requireEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `${name} saknas i Vercels Environment Variables.`,
    );
  }

  return value;
}

function normalizedBranch(): string {
  const raw = process.env.GITHUB_BRANCH?.trim() || "main";
  return raw.split(/\r?\n/, 1)[0].trim() || "main";
}

function configuration(): GitHubConfiguration {
  return {
    token: requireEnvironmentVariable("GITHUB_TOKEN"),
    owner: requireEnvironmentVariable("GITHUB_OWNER"),
    repo: requireEnvironmentVariable("GITHUB_REPO"),
    branch: normalizedBranch(),
  };
}

function encodeRepositoryPath(relativePath: string): string {
  return relativePath
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

async function githubRequest<T>(
  config: GitHubConfiguration,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE}${path}`, {
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

  const body = await response.text();
  let parsed: unknown = null;

  if (body) {
    try {
      parsed = JSON.parse(body);
    } catch {
      parsed = body;
    }
  }

  if (!response.ok) {
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

async function repositoryPathExists(
  config: GitHubConfiguration,
  relativePath: string,
): Promise<boolean> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(
      config.repo,
    )}/contents/${encodeRepositoryPath(relativePath)}?ref=${encodeURIComponent(
      config.branch,
    )}`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${config.token}`,
        "User-Agent": "KartarkivStudio/1.0",
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
      },
    },
  );

  if (response.status === 404) {
    return false;
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Kunde inte kontrollera ${relativePath} i GitHub (HTTP ${response.status}): ${body.slice(
        0,
        240,
      )}`,
    );
  }

  return true;
}

function targetAsBase64(target: RepositoryFileTarget): string {
  return typeof target.content === "string"
    ? Buffer.from(target.content, "utf8").toString("base64")
    : Buffer.from(target.content).toString("base64");
}

function blobApiBase(config: GitHubConfiguration): string {
  return `/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(
    config.repo,
  )}/git/blobs`;
}

export function shouldPublishToGitHub(): boolean {
  return process.env.VERCEL === "1";
}

/**
 * Lagrar en uppladdningsdel som en fristående Git-blob.
 * Blobben behöver inte ligga i ett filträd och kan därför användas som
 * tillfällig lagring tills alla delar av filen har laddats upp.
 */
export async function createTemporaryGitHubBlob(
  content: ArrayBuffer,
): Promise<string> {
  const config = configuration();
  const blob = await githubRequest<GitHubObject>(
    config,
    blobApiBase(config),
    {
      method: "POST",
      body: JSON.stringify({
        content: Buffer.from(content).toString("base64"),
        encoding: "base64",
      }),
    },
  );

  if (!blob.sha) {
    throw new Error("GitHub skapade ingen tillfällig blob för uppladdningen.");
  }

  return blob.sha;
}

/** Läser tillbaka en tidigare uppladdad Git-blob. */
export async function readTemporaryGitHubBlob(
  sha: string,
): Promise<ArrayBuffer> {
  if (!/^[0-9a-f]{40}$/i.test(sha)) {
    throw new Error("Ogiltig GitHub-referens för uppladdningsdel.");
  }

  const config = configuration();
  const blob = await githubRequest<GitHubBlob>(
    config,
    `${blobApiBase(config)}/${encodeURIComponent(sha)}`,
  );

  if (blob.encoding !== "base64" || typeof blob.content !== "string") {
    throw new Error("GitHub returnerade uppladdningsdelen i ett oväntat format.");
  }

  const buffer = Buffer.from(blob.content.replace(/\s+/g, ""), "base64");
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;
}

export async function publishFilesToGitHub(
  targets: RepositoryFileTarget[],
  commitMessage: string,
): Promise<GitHubPublishResult> {
  const config = configuration();

  const conflicts = (
    await Promise.all(
      targets.map(async (target) => ({
        relativePath: target.relativePath,
        exists: await repositoryPathExists(config, target.relativePath),
      })),
    )
  )
    .filter((target) => target.exists)
    .map((target) => target.relativePath);

  if (conflicts.length > 0) {
    const error = new Error(
      "Tävlingen kunde inte skapas eftersom följande filer redan finns.",
    );
    Object.assign(error, { conflicts, status: 409 });
    throw error;
  }

  const owner = encodeURIComponent(config.owner);
  const repo = encodeURIComponent(config.repo);
  const branch = encodeURIComponent(config.branch);

  const reference = await githubRequest<GitHubReference>(
    config,
    `/repos/${owner}/${repo}/git/ref/heads/${branch}`,
  );
  const parentSha = reference.object?.sha;

  if (!parentSha) {
    throw new Error("GitHub returnerade ingen commit för målgrenen.");
  }

  const parentCommit = await githubRequest<GitHubCommit>(
    config,
    `/repos/${owner}/${repo}/git/commits/${parentSha}`,
  );
  const baseTreeSha = parentCommit.tree?.sha;

  if (!baseTreeSha) {
    throw new Error("GitHub returnerade inget filträd för målgrenen.");
  }

  const treeEntries = await Promise.all(
    targets.map(async (target) => {
      const blob = await githubRequest<GitHubObject>(
        config,
        `/repos/${owner}/${repo}/git/blobs`,
        {
          method: "POST",
          body: JSON.stringify({
            content: targetAsBase64(target),
            encoding: "base64",
          }),
        },
      );

      if (!blob.sha) {
        throw new Error(`GitHub skapade ingen blob för ${target.relativePath}.`);
      }

      return {
        path: target.relativePath,
        mode: "100644",
        type: "blob",
        sha: blob.sha,
      };
    }),
  );

  const tree = await githubRequest<GitHubObject>(
    config,
    `/repos/${owner}/${repo}/git/trees`,
    {
      method: "POST",
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: treeEntries,
      }),
    },
  );

  if (!tree.sha) {
    throw new Error("GitHub skapade inget nytt filträd.");
  }

  const commit = await githubRequest<GitHubObject>(
    config,
    `/repos/${owner}/${repo}/git/commits`,
    {
      method: "POST",
      body: JSON.stringify({
        message: commitMessage,
        tree: tree.sha,
        parents: [parentSha],
      }),
    },
  );

  if (!commit.sha) {
    throw new Error("GitHub skapade ingen commit.");
  }

  await githubRequest<unknown>(
    config,
    `/repos/${owner}/${repo}/git/refs/heads/${branch}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        sha: commit.sha,
        force: false,
      }),
    },
  );

  const repositoryUrl = `https://github.com/${config.owner}/${config.repo}`;

  return {
    commitSha: commit.sha,
    commitUrl: `${repositoryUrl}/commit/${commit.sha}`,
    repositoryUrl,
  };
}
