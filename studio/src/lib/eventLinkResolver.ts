const LIVELOX_BASE_URL = "https://www.livelox.com";
const LIVELOX_TIMEOUT_MS = 15_000;

export type ResolvedEventLinks = {
  liveloxUrl: string | null;
  liveloxSource:
    | "eventor-html"
    | "eventor-identifiers"
    | "none";
};

function directLiveloxViewerUrl(
  eventId: number,
  eventClassId: number,
): string {
  const url = new URL("/Viewer", LIVELOX_BASE_URL);

  /*
   * Livelox använder Eventors externa identifierare enligt mönstret
   * 0:<eventId>-1 och Eventors klass-id som <classId>-1.
   *
   * Exempel:
   *   eventExternalIdentifier=0:53201-1
   *   classExternalId=664496-1
   */
  url.searchParams.set(
    "eventExternalIdentifier",
    `0:${eventId}-1`,
  );
  url.searchParams.set(
    "classExternalId",
    `${eventClassId}-1`,
  );

  return url.toString();
}

async function fetchWithTimeout(
  url: string,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    LIVELOX_TIMEOUT_MS,
  );

  try {
    return await fetch(url, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept:
          "text/html,application/xhtml+xml,*/*",
        "Accept-Language":
          "sv-SE,sv;q=0.9,en;q=0.7",
        "User-Agent":
          "Mozilla/5.0 KartarkivStudio/1.0",
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

function looksLikeMissingLiveloxEvent(
  html: string,
): boolean {
  const normalized = html
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("sv-SE");

  return (
    normalized.includes("event not found") ||
    normalized.includes("could not find the event") ||
    normalized.includes("tävlingen kunde inte hittas") ||
    normalized.includes("händelsen kunde inte hittas")
  );
}

async function verifyLiveloxViewerUrl(
  url: string,
): Promise<string | null> {
  try {
    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      console.info(
        "Livelox identifier lookup did not resolve:",
        {
          status: response.status,
          url,
        },
      );
      return null;
    }

    const finalUrl = new URL(response.url || url);

    if (
      !finalUrl.hostname
        .toLocaleLowerCase("sv-SE")
        .endsWith("livelox.com")
    ) {
      return null;
    }

    const html = await response.text();

    if (looksLikeMissingLiveloxEvent(html)) {
      return null;
    }

    /*
     * Behåll den deterministiska Viewer-länken i stället för en
     * eventuell sessions-/språkberoende redirect.
     */
    return url;
  } catch (error) {
    console.info(
      "Livelox identifier lookup failed:",
      error,
    );
    return null;
  }
}

export async function resolveEventLinks(input: {
  eventId: number;
  eventClassId: number | null;
  eventorHtmlLiveloxUrl?: string | null;
}): Promise<ResolvedEventLinks> {
  const htmlUrl =
    input.eventorHtmlLiveloxUrl?.trim() || "";

  if (htmlUrl) {
    return {
      liveloxUrl: htmlUrl,
      liveloxSource: "eventor-html",
    };
  }

  if (
    !Number.isInteger(input.eventId) ||
    input.eventId <= 0 ||
    !Number.isInteger(input.eventClassId) ||
    (input.eventClassId ?? 0) <= 0
  ) {
    return {
      liveloxUrl: null,
      liveloxSource: "none",
    };
  }

  const candidate = directLiveloxViewerUrl(
    input.eventId,
    input.eventClassId as number,
  );

  const verified =
    await verifyLiveloxViewerUrl(candidate);

  return verified
    ? {
        liveloxUrl: verified,
        liveloxSource:
          "eventor-identifiers",
      }
    : {
        liveloxUrl: null,
        liveloxSource: "none",
      };
}
