import * as cheerio from "cheerio";

const WINSPLITS_URL =
  "https://obasen.orientering.se/winsplits/online/sv/default.asp";

const RUNNER_NAME = "Erik Martinsson";
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_FRAME_DEPTH = 3;

export interface WinSplitsMistake {
  control: number;
  loss: string;
}

export interface WinSplitsRunner {
  name: string;
  club: string;
  place: string;
  totalTime: string;
  diff: string;
  controls: number;
  totalMistake?: string;
  mistakes: WinSplitsMistake[];
}

export interface WinSplitsClassMetadata {
  raceClass: string | null;
  distanceKm: number | null;
}

export interface WinSplitsData {
  runners: WinSplitsRunner[];
  metadata: WinSplitsClassMetadata;
}

type LoadedPage = {
  url: string;
  html: string;
};

class CookieJar {
  private readonly cookies =
    new Map<string, string>();

  addFromResponse(response: Response): void {
    const headers = response.headers as Headers & {
      getSetCookie?: () => string[];
    };

    const setCookieValues =
      typeof headers.getSetCookie === "function"
        ? headers.getSetCookie()
        : response.headers.get("set-cookie")
          ? [response.headers.get("set-cookie") as string]
          : [];

    for (const setCookie of setCookieValues) {
      /*
       * Flera Set-Cookie-värden kan vara hopslagna av
       * fetch-implementationen. Dela bara vid kommatecken
       * som följs av ett nytt cookie-namn.
       */
      const cookieParts = setCookie.split(
        /,(?=\s*[^;,=\s]+=[^;,]*)/,
      );

      for (const cookiePart of cookieParts) {
        const firstPart =
          cookiePart.split(";")[0]?.trim();

        const separatorIndex =
          firstPart?.indexOf("=") ?? -1;

        if (
          !firstPart ||
          separatorIndex <= 0
        ) {
          continue;
        }

        const name = firstPart
          .slice(0, separatorIndex)
          .trim();

        const value = firstPart
          .slice(separatorIndex + 1)
          .trim();

        if (name) {
          this.cookies.set(name, value);
        }
      }
    }
  }

  toHeader(): string {
    return [...this.cookies.entries()]
      .map(([name, value]) =>
        `${name}=${value}`,
      )
      .join("; ");
  }
}

function cleanText(value: string): string {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMistake(
  title: string | undefined,
): string | undefined {
  if (!title) {
    return undefined;
  }

  return title.match(
    /Bommad tid:\s*([0-9:.]+)/i,
  )?.[1];
}

function containsRunnerRows(
  html: string,
): boolean {
  const $ = cheerio.load(html);

  return $("tr[id$='_0']").toArray().some(
    (rowElement) =>
      $(rowElement).children("td").length >= 6,
  );
}

function looksLikeResultTable(
  html: string,
): boolean {
  const normalizedHtml =
    html.toLocaleLowerCase("sv-SE");

  return (
    containsRunnerRows(html) ||
    normalizedHtml.includes(
      RUNNER_NAME.toLocaleLowerCase("sv-SE"),
    ) ||
    (
      normalizedHtml.includes("<table") &&
      (
        normalizedHtml.includes("sträcktid") ||
        normalizedHtml.includes("stracktid") ||
        normalizedHtml.includes("sluttid")
      )
    )
  );
}

function createRequestHeaders(
  cookieJar: CookieJar,
  referer?: string,
): HeadersInit {
  const cookie = cookieJar.toHeader();

  return {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) " +
      "Chrome/131.0.0.0 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,*/*",
    "Accept-Language":
      "sv-SE,sv;q=0.9,en;q=0.7",
    ...(cookie ? { Cookie: cookie } : {}),
    ...(referer ? { Referer: referer } : {}),
  };
}

async function requestHtml(
  url: string,
  cookieJar: CookieJar,
  options: {
    method?: "GET" | "POST";
    body?: URLSearchParams;
    referer?: string;
  } = {},
): Promise<LoadedPage> {
  const controller =
    new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS,
  );

  try {
    const method = options.method ?? "GET";

    const response = await fetch(url, {
      method,
      redirect: "follow",
      cache: "no-store",
      headers: {
        ...createRequestHeaders(
          cookieJar,
          options.referer,
        ),
        ...(method === "POST"
          ? {
              "Content-Type":
                "application/x-www-form-urlencoded",
            }
          : {}),
      },
      body:
        method === "POST"
          ? options.body?.toString()
          : undefined,
      signal: controller.signal,
    });

    cookieJar.addFromResponse(response);

    if (!response.ok) {
      throw new Error(
        `WinSplits svarade med HTTP ${response.status}.`,
      );
    }

    return {
      url: response.url || url,
      html: await response.text(),
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      throw new Error(
        "WinSplits svarade inte inom 30 sekunder.",
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function frameUrls(
  page: LoadedPage,
): string[] {
  const $ = cheerio.load(page.html);
  const urls = new Set<string>();

  $("frame[src], iframe[src]").each(
    (_, element) => {
      const source =
        $(element).attr("src")?.trim();

      if (!source) {
        return;
      }

      try {
        urls.add(
          new URL(source, page.url).toString(),
        );
      } catch {
        // Ignorera felaktiga ramadresser.
      }
    },
  );

  return [...urls];
}

async function loadPageTree(
  rootUrl: string,
  cookieJar: CookieJar,
): Promise<LoadedPage[]> {
  const pages: LoadedPage[] = [];
  const visited = new Set<string>();

  async function visit(
    url: string,
    depth: number,
    referer?: string,
  ): Promise<void> {
    if (
      depth > MAX_FRAME_DEPTH ||
      visited.has(url)
    ) {
      return;
    }

    visited.add(url);

    const page = await requestHtml(
      url,
      cookieJar,
      { referer },
    );

    pages.push(page);

    const childUrls = frameUrls(page);

    await Promise.all(
      childUrls.map((childUrl) =>
        visit(
          childUrl,
          depth + 1,
          page.url,
        ).catch(() => undefined),
      ),
    );
  }

  await visit(rootUrl, 0);

  return pages;
}

function findResultPage(
  pages: LoadedPage[],
): LoadedPage | null {
  const candidates = pages
    .filter((page) =>
      looksLikeResultTable(page.html),
    )
    .sort((left, right) => {
      const leftScore =
        containsRunnerRows(left.html)
          ? 2
          : 1;

      const rightScore =
        containsRunnerRows(right.html)
          ? 2
          : 1;

      return rightScore - leftScore;
    });

  return candidates[0] ?? null;
}

function inputValue(
  $: cheerio.CheerioAPI,
  element: any,
): string {
  const value =
    $(element).attr("value");

  return value ?? "on";
}

function findExtendedInformationForm(
  pages: LoadedPage[],
): {
  page: LoadedPage;
  formIndex: number;
} | null {
  for (const page of pages) {
    const $ = cheerio.load(page.html);
    const forms = $("form").toArray();

    for (
      let formIndex = 0;
      formIndex < forms.length;
      formIndex += 1
    ) {
      const form = $(forms[formIndex]);

      const searchableText = cleanText(
        [
          form.text(),
          form.html() ?? "",
        ].join(" "),
      ).toLocaleLowerCase("sv-SE");

      if (
        searchableText.includes(
          "utökad information",
        ) ||
        searchableText.includes(
          "utokad information",
        )
      ) {
        return {
          page,
          formIndex,
        };
      }
    }
  }

  return null;
}

function buildFormSubmission(
  page: LoadedPage,
  formIndex: number,
): {
  url: string;
  method: "GET" | "POST";
  values: URLSearchParams;
} {
  const $ = cheerio.load(page.html);
  const form = $("form").eq(formIndex);

  const action =
    form.attr("action")?.trim() ||
    page.url;

  const url =
    new URL(action, page.url).toString();

  const method =
    form.attr("method")
      ?.toLocaleUpperCase("sv-SE") === "POST"
      ? "POST"
      : "GET";

  const values = new URLSearchParams();

  form.find(
    "input[name], select[name], textarea[name]",
  ).each((_, element) => {
    const node = $(element);
    const name =
      node.attr("name")?.trim();

    if (!name) {
      return;
    }

    const tagName =
      element.tagName.toLocaleLowerCase(
        "sv-SE",
      );

    if (tagName === "select") {
      const selected =
        node.find("option[selected]").first();

      const option =
        selected.length > 0
          ? selected
          : node.find("option").first();

      values.append(
        name,
        option.attr("value") ??
          cleanText(option.text()),
      );

      return;
    }

    if (tagName === "textarea") {
      values.append(
        name,
        node.text(),
      );

      return;
    }

    const type =
      node.attr("type")
        ?.toLocaleLowerCase("sv-SE") ??
      "text";

    const searchableText = cleanText(
      [
        name,
        node.attr("id") ?? "",
        node.attr("title") ?? "",
        node.attr("value") ?? "",
        node.parent().text(),
        node.closest("tr").text(),
      ].join(" "),
    ).toLocaleLowerCase("sv-SE");

    if (
      type === "checkbox" ||
      type === "radio"
    ) {
      const isExtendedInformation =
        searchableText.includes(
          "utökad information",
        ) ||
        searchableText.includes(
          "utokad information",
        );

      const isChecked =
        node.is("[checked]");

      if (
        isExtendedInformation ||
        isChecked
      ) {
        values.append(
          name,
          inputValue($, element),
        );
      }

      return;
    }

    if (
      type === "submit" ||
      type === "button" ||
      type === "image"
    ) {
      const value =
        node.attr("value") ?? "";

      if (
        /^ok$/i.test(value) ||
        /uppdatera|visa/i.test(value)
      ) {
        values.append(name, value);
      }

      return;
    }

    values.append(
      name,
      node.attr("value") ?? "",
    );
  });

  return {
    url,
    method,
    values,
  };
}

async function enableExtendedInformation(
  pages: LoadedPage[],
  cookieJar: CookieJar,
): Promise<void> {
  const found =
    findExtendedInformationForm(pages);

  if (!found) {
    throw new Error(
      'Kunde inte hitta WinSplits-inställningen "utökad information".',
    );
  }

  const submission =
    buildFormSubmission(
      found.page,
      found.formIndex,
    );

  if (submission.method === "POST") {
    await requestHtml(
      submission.url,
      cookieJar,
      {
        method: "POST",
        body: submission.values,
        referer: found.page.url,
      },
    );

    return;
  }

  const url = new URL(submission.url);

  for (
    const [name, value] of
    submission.values.entries()
  ) {
    url.searchParams.set(name, value);
  }

  await requestHtml(
    url.toString(),
    cookieJar,
    {
      referer: found.page.url,
    },
  );
}

function calculateControls(
  cellCount: number,
): number {
  const splitCount = Math.floor(
    (cellCount - 4) / 2,
  );

  return Math.max(0, splitCount - 1);
}

function parseRunners(
  html: string,
): WinSplitsRunner[] {
  const $ = cheerio.load(html);
  const runners: WinSplitsRunner[] = [];

  $("tr[id$='_0']").each(
    (_, rowElement) => {
      const row = $(rowElement);
      const cells = row.children("td");

      if (cells.length < 6) {
        return;
      }

      const place = cleanText(
        cells.eq(0).text(),
      );

      const name = cleanText(
        cells.eq(1).text(),
      );

      if (!name) {
        return;
      }

      const totalCell = cells.eq(2);

      const totalTime = cleanText(
        totalCell.text(),
      );

      const totalTitle = totalCell
        .find("a")
        .first()
        .attr("title");

      const diff = cleanText(
        cells.eq(3).text(),
      );

      const rowId =
        row.attr("id") ?? "";

      const runnerNumber =
        rowId.replace(/_0$/, "");

      const club = cleanText(
        $(`tr#${runnerNumber}_1`)
          .children("td")
          .first()
          .text(),
      );

      const controls =
        calculateControls(cells.length);

      const runner: WinSplitsRunner = {
        name,
        club,
        place,
        totalTime,
        diff,
        controls,
        totalMistake:
          extractMistake(totalTitle),
        mistakes: [],
      };

      for (
        let control = 1;
        control <= controls;
        control += 1
      ) {
        const cellIndex =
          4 + (control - 1) * 2;

        const title = cells
          .eq(cellIndex)
          .find("a")
          .first()
          .attr("title");

        const loss =
          extractMistake(title);

        if (!loss) {
          continue;
        }

        runner.mistakes.push({
          control,
          loss,
        });
      }

      runners.push(runner);
    },
  );

  return runners;
}

function parseDistanceKm(
  value: string,
): number | null {
  const normalized = cleanText(value)
    .replace(",", ".");

  const kilometerMatch =
    normalized.match(
      /(?:banlängd|banlangd|längd|langd|course\s*length)?\s*:?\s*(\d+(?:\.\d+)?)\s*km\b/i,
    );

  if (kilometerMatch) {
    const distance =
      Number(kilometerMatch[1]);

    return (
      Number.isFinite(distance) &&
      distance >= 0.2 &&
      distance <= 100
    )
      ? distance
      : null;
  }

  const meterMatch =
    normalized.match(
      /(?:banlängd|banlangd|längd|langd|course\s*length)?\s*:?\s*(\d[\d\s]{2,6})\s*m\b/i,
    );

  if (!meterMatch) {
    return null;
  }

  const meters = Number(
    meterMatch[1].replace(/\s+/g, ""),
  );

  return (
    Number.isFinite(meters) &&
    meters >= 200 &&
    meters <= 100_000
  )
    ? Number(
        (meters / 1_000).toFixed(3),
      )
    : null;
}

function cleanClassCandidate(
  value: string,
): string | null {
  const candidate = cleanText(value)
    .replace(
      /\s*(?:resultat|sträcktider|stracktider|winsplits online).*$/i,
      "",
    )
    .replace(
      /^\s*(?:klass|class)\s*:?\s*/i,
      "",
    )
    .trim();

  if (
    !candidate ||
    candidate.length > 100 ||
    /^(?:resultat|sträcktider|stracktider|klasser|start)$/i.test(
      candidate,
    )
  ) {
    return null;
  }

  const classMatch = candidate.match(
    /(?:^|\s)((?:H|D)\s*\d{1,3}(?:\s+(?:kort|lång|elit))?)(?=\s|$)/i,
  );

  return classMatch
    ? cleanText(classMatch[1])
    : null;
}

function readClassMetadata(
  pages: LoadedPage[],
  categoryId: number,
): WinSplitsClassMetadata {
  const raceClassCandidates: string[] = [];
  const textCandidates: string[] = [];

  for (const page of pages) {
    const $ = cheerio.load(page.html);

    const matchingOption =
      $(
        `option[value="${categoryId}"]`,
      ).first();

    if (matchingOption.length > 0) {
      raceClassCandidates.push(
        cleanText(matchingOption.text()),
      );
    }

    $(
      "option[selected], h1, h2, h3, h4, caption, legend, title",
    ).each((_, element) => {
      raceClassCandidates.push(
        cleanText($(element).text()),
      );
    });

    textCandidates.push(
      cleanText($.root().text()),
    );
  }

  const raceClass =
    raceClassCandidates
      .map(cleanClassCandidate)
      .find(
        (
          candidate,
        ): candidate is string =>
          Boolean(candidate),
      ) ?? null;

  let distanceKm: number | null = null;

  if (raceClass) {
    const escapedClass =
      raceClass.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );

    for (const text of textCandidates) {
      const nearbyMatch = text.match(
        new RegExp(
          `${escapedClass}.{0,160}`,
          "i",
        ),
      );

      distanceKm = parseDistanceKm(
        nearbyMatch?.[0] ?? "",
      );

      if (distanceKm !== null) {
        break;
      }
    }
  }

  if (distanceKm === null) {
    for (const text of textCandidates) {
      const labelled = text.match(
        /(?:banlängd|banlangd|längd|langd|course\s*length)\s*:?\s*(?:\d+(?:[.,]\d+)?\s*km|\d[\d\s]{2,6}\s*m)/i,
      );

      distanceKm = parseDistanceKm(
        labelled?.[0] ?? "",
      );

      if (distanceKm !== null) {
        break;
      }
    }
  }

  return {
    raceClass,
    distanceKm,
  };
}

function createWinSplitsUrl(
  databaseId: number,
  categoryId: number,
): string {
  const url = new URL(WINSPLITS_URL);

  url.searchParams.set("page", "table");
  url.searchParams.set(
    "databaseId",
    String(databaseId),
  );
  url.searchParams.set(
    "categoryId",
    String(categoryId),
  );

  return url.toString();
}

async function loadWinSplitsInternal(
  databaseId: number,
  categoryId: number,
): Promise<WinSplitsData> {
  if (
    !Number.isInteger(databaseId) ||
    databaseId <= 0 ||
    !Number.isInteger(categoryId) ||
    categoryId < 0
  ) {
    throw new Error(
      "Ogiltigt databaseId eller categoryId för WinSplits.",
    );
  }

  const url = createWinSplitsUrl(
    databaseId,
    categoryId,
  );

  const cookieJar = new CookieJar();

  let pages = await loadPageTree(
    url,
    cookieJar,
  );

  let resultPage =
    findResultPage(pages);

  if (!resultPage) {
    throw new Error(
      "Kunde inte hitta WinSplits-tabellen.",
    );
  }

  if (
    !resultPage.html
      .toLocaleLowerCase("sv-SE")
      .includes("bommad tid")
  ) {
    await enableExtendedInformation(
      pages,
      cookieJar,
    );

    pages = await loadPageTree(
      url,
      cookieJar,
    );

    resultPage =
      findResultPage(pages);
  }

  if (!resultPage) {
    throw new Error(
      "Kunde inte hitta WinSplits-tabellen efter att inställningarna uppdaterats.",
    );
  }

  const runners =
    parseRunners(resultPage.html);

  if (runners.length === 0) {
    throw new Error(
      "Tabellen laddades, men inga löpare kunde läsas.",
    );
  }

  /*
   * Enstaka äldre WinSplits-poster kan sakna
   * verktygstips trots aktiverad utökad information.
   * Resultat, tider och kontroller returneras ändå.
   */
  const metadata =
    readClassMetadata(
      pages,
      categoryId,
    );

  return {
    runners,
    metadata,
  };
}

export async function loadWinSplitsWithMetadata(
  databaseId: number,
  categoryId: number,
): Promise<WinSplitsData> {
  return loadWinSplitsInternal(
    databaseId,
    categoryId,
  );
}

export async function loadWinSplits(
  databaseId: number,
  categoryId: number,
): Promise<WinSplitsRunner[]> {
  const data =
    await loadWinSplitsInternal(
      databaseId,
      categoryId,
    );

  return data.runners;
}