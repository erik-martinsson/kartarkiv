const DEFAULT_TIMEOUT_MS = 30_000;

export async function fetchText(
  url: string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<string> {
  const controller = new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    timeoutMs,
  );

  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 Kartarkiv DOMA migration",
        Accept:
          "text/html,application/xhtml+xml," +
          "application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language":
          "sv-SE,sv;q=0.9,en;q=0.7",
      },
    });

    if (!response.ok) {
      throw new Error(
        `${new URL(url).hostname} svarade med HTTP ` +
          `${response.status} ${response.statusText}.`,
      );
    }

    return await response.text();
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      throw new Error(
        `Hämtningen från ${new URL(url).hostname} ` +
          "tog för lång tid.",
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
