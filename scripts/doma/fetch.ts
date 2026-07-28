import * as cheerio from "cheerio";
import type {
  FetchedPage,
  LinkSnapshot,
} from "./types";

const REQUEST_TIMEOUT_MS = 30_000;

function normalizeText(
  value: string | null | undefined,
): string {
  return (value ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveUrl(
  value: string,
  baseUrl: string,
): string | null {
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return null;
  }
}

export async function fetchDomaPage(
  requestedUrl: string,
): Promise<FetchedPage> {
  const controller = new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS,
  );

  try {
    const response = await fetch(requestedUrl, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
          "AppleWebKit/537.36 (KHTML, like Gecko) " +
          "Chrome/131.0.0.0 Safari/537.36",
        accept:
          "text/html,application/xhtml+xml," +
          "application/xml;q=0.9,*/*;q=0.8",
        "accept-language":
          "sv-SE,sv;q=0.9,en;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status} ${response.statusText}`,
      );
    }

    const html = await response.text();
    const finalUrl = response.url || requestedUrl;
    const $ = cheerio.load(html);

    const links: LinkSnapshot[] = [];

    $("a[href]").each((_index, element) => {
      const href = $(element).attr("href");

      if (!href) {
        return;
      }

      const resolved = resolveUrl(href, finalUrl);

      if (!resolved) {
        return;
      }

      links.push({
        text: normalizeText($(element).text()),
        href: resolved,
        title: normalizeText(
          $(element).attr("title"),
        ),
      });
    });

    const imageUrls = new Set<string>();

    $("img[src]").each((_index, element) => {
      const src = $(element).attr("src");

      if (!src) {
        return;
      }

      const resolved = resolveUrl(src, finalUrl);

      if (resolved) {
        imageUrls.add(resolved);
      }
    });

    return {
      html,
      snapshot: {
        requestedUrl,
        finalUrl,
        status: response.status,
        contentType:
          response.headers.get("content-type") ?? "",
        title: normalizeText(
          $("title").first().text(),
        ),
        bodyText: normalizeText($("body").text()),
        links,
        imageUrls: [...imageUrls],
      },
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      throw new Error(
        `Begäran tog längre än ${
          REQUEST_TIMEOUT_MS / 1000
        } sekunder.`,
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
