import type {
  ReadDomaCompetitionOptions,
} from "./types";

const DEFAULT_TIMEOUT_MS = 30_000;

const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/131.0.0.0 Safari/537.36";

export async function fetchDomaHtml(
  url: string,
  options: ReadDomaCompetitionOptions = {},
): Promise<{
  html: string;
  finalUrl: string;
  status: number;
}> {
  const controller = new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  );

  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent":
          options.userAgent ?? DEFAULT_USER_AGENT,
        accept:
          "text/html,application/xhtml+xml," +
          "application/xml;q=0.9,*/*;q=0.8",
        "accept-language":
          "sv-SE,sv;q=0.9,en;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error(
        `DOMA svarade med HTTP ${response.status} ` +
          `${response.statusText}.`,
      );
    }

    return {
      html: await response.text(),
      finalUrl: response.url || url,
      status: response.status,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      throw new Error(
        "Hämtningen från DOMA tog för lång tid.",
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
