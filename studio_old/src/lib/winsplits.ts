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

export async function loadWinSplits(
  databaseId: number,
  categoryId: number,
): Promise<WinSplitsRunner[]> {
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

    return runners;
  } finally {
    await browser.close();
  }
}