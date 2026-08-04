import {
  chromium,
  type Frame,
  type Page,
} from "playwright";
import * as cheerio from "cheerio";

const WINSPLITS_URL =
  "https://obasen.orientering.se/winsplits/online/sv/default.asp";

const RUNNER_NAME = "Erik Martinsson";

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
  const normalizedHtml = html.toLowerCase();

  return (
    containsRunnerRows(html) ||
    normalizedHtml.includes(
      RUNNER_NAME.toLowerCase(),
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

async function readableFrameHtml(
  frame: Frame,
): Promise<string | null> {
  try {
    return await frame.content();
  } catch {
    return null;
  }
}

async function findSettingsFrame(
  page: Page,
): Promise<Frame> {
  const deadline = Date.now() + 20_000;

  while (Date.now() < deadline) {
    for (const frame of page.frames()) {
      try {
        const bodyText = await frame
          .locator("body")
          .innerText({ timeout: 1_500 });

        const normalizedText = cleanText(
          bodyText,
        ).toLowerCase();

        if (
          normalizedText.includes(
            "utökad information",
          ) ||
          normalizedText.includes(
            "utokad information",
          )
        ) {
          return frame;
        }
      } catch {
        // Ramen kan vara under omladdning.
      }
    }

    await page.waitForTimeout(250);
  }

  throw new Error(
    'Kunde inte hitta WinSplits-inställningen "utökad information".',
  );
}

async function enableExtendedInformation(
  page: Page,
): Promise<void> {
  const settingsFrame =
    await findSettingsFrame(page);

  const checkboxes = settingsFrame.locator(
    'input[type="checkbox"]',
  );

  const checkboxCount =
    await checkboxes.count();

  if (checkboxCount === 0) {
    throw new Error(
      "Inställningsdelen hittades, men den innehåller inga kryssrutor.",
    );
  }

  let checkboxIndex =
    await settingsFrame.evaluate(() => {
      const inputs = Array.from(
        document.querySelectorAll<HTMLInputElement>(
          'input[type="checkbox"]',
        ),
      );

      for (
        let index = 0;
        index < inputs.length;
        index += 1
      ) {
        const checkbox = inputs[index];

        const searchableText = [
          checkbox.name,
          checkbox.id,
          checkbox.value,
          checkbox.title,
          checkbox.parentElement?.textContent,
          checkbox.closest("tr")?.textContent,
          checkbox.nextSibling?.textContent,
        ]
          .filter(Boolean)
          .join(" ")
          .replace(/\s+/g, " ")
          .toLowerCase();

        if (
          searchableText.includes(
            "utökad information",
          ) ||
          searchableText.includes(
            "utokad information",
          )
        ) {
          return index;
        }
      }

      return -1;
    });

  if (checkboxIndex < 0) {
    checkboxIndex = checkboxCount - 1;
  }

  const checkbox =
    checkboxes.nth(checkboxIndex);

  if (!(await checkbox.isChecked())) {
    await checkbox.check({ force: true });
  }

  const okButton = settingsFrame.locator(
    [
      'input[type="submit"][value="OK"]',
      'input[type="button"][value="OK"]',
      'button:has-text("OK")',
    ].join(", "),
  );

  if ((await okButton.count()) === 0) {
    throw new Error(
      'Kunde inte hitta knappen "OK" i WinSplits-inställningarna.',
    );
  }

  await okButton.first().click({ force: true });

  const deadline = Date.now() + 20_000;

  while (Date.now() < deadline) {
    for (const frame of page.frames()) {
      const html =
        await readableFrameHtml(frame);

      if (
        html?.toLowerCase().includes(
          "bommad tid",
        )
      ) {
        return;
      }
    }

    await page.waitForTimeout(250);
  }

  throw new Error(
    "WinSplits svarade inte efter att utökad information aktiverades.",
  );
}

async function findTableHtml(
  page: Page,
  timeoutMs = 20_000,
): Promise<string> {
  const deadline = Date.now() + timeoutMs;
  let bestFallback: string | null = null;
  let bestFallbackScore = -1;

  while (Date.now() < deadline) {
    for (const frame of page.frames()) {
      const html =
        await readableFrameHtml(frame);

      if (!html) {
        continue;
      }

      if (looksLikeResultTable(html)) {
        if (containsRunnerRows(html)) {
          return html;
        }

        const score =
          html.toLowerCase().includes(
            RUNNER_NAME.toLowerCase(),
          )
            ? 2
            : 1;

        if (score > bestFallbackScore) {
          bestFallback = html;
          bestFallbackScore = score;
        }
      }
    }

    await page.waitForTimeout(250);
  }

  if (bestFallback) {
    return bestFallback;
  }

  throw new Error(
    "Kunde inte hitta WinSplits-tabellen.",
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

  const kilometerMatch = normalized.match(
    /(?:banlängd|banlangd|längd|langd|course\s*length)?\s*:?\s*(\d+(?:\.\d+)?)\s*km\b/i,
  );

  if (kilometerMatch) {
    const distance = Number(kilometerMatch[1]);

    return (
      Number.isFinite(distance) &&
      distance >= 0.2 &&
      distance <= 100
    )
      ? distance
      : null;
  }

  const meterMatch = normalized.match(
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
    ? Number((meters / 1_000).toFixed(3))
    : null;
}

async function readClassMetadata(
  page: Page,
  categoryId: number,
): Promise<WinSplitsClassMetadata> {
  const raceClassCandidates: string[] = [];
  const textCandidates: string[] = [];

  for (const frame of page.frames()) {
    try {
      const snapshot = await frame.evaluate(
        ({ wantedCategoryId }) => {
          const clean = (
            value: string | null | undefined,
          ) =>
            (value ?? "")
              .replace(/\u00a0/g, " ")
              .replace(/\s+/g, " ")
              .trim();

          const selectedOptions = Array.from(
            document.querySelectorAll<
              HTMLOptionElement
            >("option:checked, option[selected]"),
          )
            .map((option) => ({
              text: clean(option.textContent),
              value: option.value,
            }))
            .filter((option) => option.text);

          const matchingOption =
            selectedOptions.find(
              (option) =>
                option.value ===
                String(wantedCategoryId),
            ) ??
            selectedOptions[0] ??
            null;

          const headings = Array.from(
            document.querySelectorAll(
              "h1, h2, h3, h4, caption, legend",
            ),
          )
            .map((element) =>
              clean(element.textContent),
            )
            .filter(Boolean);

          return {
            selectedClass:
              matchingOption?.text ?? "",
            headings,
            title: clean(document.title),
            bodyText: clean(
              document.body?.innerText,
            ),
          };
        },
        {
          wantedCategoryId: categoryId,
        },
      );

      if (snapshot.selectedClass) {
        raceClassCandidates.push(
          snapshot.selectedClass,
        );
      }

      raceClassCandidates.push(
        ...snapshot.headings,
      );

      if (snapshot.title) {
        raceClassCandidates.push(
          snapshot.title,
        );
      }

      if (snapshot.bodyText) {
        textCandidates.push(
          snapshot.bodyText,
        );
      }
    } catch {
      // En enskild WinSplits-ram kan vara oläsbar.
    }
  }

  const cleanClassCandidate = (
    value: string,
  ): string | null => {
    const candidate = cleanText(value)
      .replace(
        /\s*(?:resultat|sträcktider|stracktider|winsplits online).*$/i,
        "",
      )
      .replace(/^\s*(?:klass|class)\s*:?\s*/i, "")
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

    return candidate;
  };

  const raceClass =
    raceClassCandidates
      .map(cleanClassCandidate)
      .find(Boolean) ?? null;

  let distanceKm: number | null = null;

  if (raceClass) {
    const escapedClass = raceClass.replace(
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

  if (distanceKm === null) {
    const plausibleDistances = new Set<number>();

    for (const text of textCandidates) {
      for (
        const match of text.matchAll(
          /\b(\d+(?:[.,]\d+)?)\s*km\b|\b(\d[\d\s]{2,6})\s*m\b/gi,
        )
      ) {
        const parsed = parseDistanceKm(
          match[0],
        );

        if (parsed !== null) {
          plausibleDistances.add(parsed);
        }
      }
    }

    if (plausibleDistances.size === 1) {
      distanceKm =
        [...plausibleDistances][0];
    }
  }

  return {
    raceClass,
    distanceKm,
  };
}

async function loadWinSplitsInternal(
  databaseId: number,
  categoryId: number,
): Promise<WinSplitsData> {
  const browser = await chromium.launch({
    headless: true,
  });

  try {
    const context =
      await browser.newContext({
        locale: "sv-SE",
      });

    const page =
      await context.newPage();

    const url =
      `${WINSPLITS_URL}` +
      `?page=table` +
      `&databaseId=${databaseId}` +
      `&categoryId=${categoryId}`;

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });

    await page.waitForTimeout(750);

    let html =
      await findTableHtml(page);

    if (
      !html.toLowerCase().includes(
        "bommad tid",
      )
    ) {
      await enableExtendedInformation(
        page,
      );

      html =
        await findTableHtml(
          page,
          20_000,
        );
    }

    if (
      !html.toLowerCase().includes(
        "bommad tid",
      )
    ) {
      await page.screenshot({
        path: "winsplits-fel.png",
        fullPage: true,
      });

      throw new Error(
        "WinSplits aktiverade inte utökad information. " +
          "Skärmbilden winsplits-fel.png har sparats.",
      );
    }

    const runners =
      parseRunners(html);

    if (runners.length === 0) {
      throw new Error(
        "Tabellen laddades, men inga löpare kunde läsas.",
      );
    }

    const metadata =
      await readClassMetadata(
        page,
        categoryId,
      );

    return {
      runners,
      metadata,
    };
  } finally {
    await browser.close();
  }
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