import {
  chromium,
  type Frame,
  type Page,
} from "playwright";
import * as cheerio from "cheerio";

const WINSPLITS_URL =
  "https://obasen.orientering.se/winsplits/online/sv/default.asp";

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

async function findSettingsFrame(
  page: Page,
): Promise<Frame> {
  for (const frame of page.frames()) {
    try {
      const bodyText = await frame
        .locator("body")
        .innerText({
          timeout: 2_000,
        });

      if (
        bodyText
          .toLowerCase()
          .includes("utökad information")
      ) {
        return frame;
      }
    } catch {
      // Ramen var ännu inte färdigladdad.
    }
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

  const checkboxCount = await settingsFrame
    .locator('input[type="checkbox"]')
    .count();

  if (checkboxCount === 0) {
    throw new Error(
      "Inställningsdelen hittades, men den innehåller inga kryssrutor.",
    );
  }

  let checkboxIndex =
    await settingsFrame.evaluate(() => {
      const checkboxes = Array.from(
        document.querySelectorAll<HTMLInputElement>(
          'input[type="checkbox"]',
        ),
      );

      for (
        let index = 0;
        index < checkboxes.length;
        index++
      ) {
        const checkbox = checkboxes[index];

        const parentText =
          checkbox.parentElement?.textContent ?? "";

        const rowText =
          checkbox.closest("tr")?.textContent ?? "";

        const nextText =
          checkbox.nextSibling?.textContent ?? "";

        const searchableText = [
          checkbox.name,
          checkbox.id,
          checkbox.value,
          checkbox.title,
          parentText,
          rowText,
          nextText,
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

  /*
   * På den aktuella WinSplits-sidan är
   * "utökad information" den sista kryssrutan.
   */
  if (checkboxIndex < 0) {
    checkboxIndex = checkboxCount - 1;
  }

  const checkbox = settingsFrame
    .locator('input[type="checkbox"]')
    .nth(checkboxIndex);

  if (!(await checkbox.isChecked())) {
    await checkbox.check({
      force: true,
    });
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

  await okButton.first().click({
    force: true,
  });

  await page.waitForFunction(
    () => {
      const documents: Document[] = [
        document,
      ];

      for (
        let index = 0;
        index < window.frames.length;
        index++
      ) {
        try {
          documents.push(
            window.frames[index].document,
          );
        } catch {
          // Ignorera ramar från andra domäner.
        }
      }

      return documents.some((doc) =>
        doc.documentElement?.innerHTML.includes(
          "Bommad tid",
        ),
      );
    },
    undefined,
    {
      timeout: 20_000,
    },
  );
}

async function findTableHtml(
  page: Page,
): Promise<string> {
  for (const frame of page.frames()) {
    try {
      const html = await frame.content();

      if (
        html.includes("Erik Martinsson") ||
        (
          html.includes("<TABLE") &&
          html.includes("sträcktid")
        )
      ) {
        return html;
      }
    } catch {
      // Ignorera ramar som inte kan läsas.
    }
  }

  throw new Error(
    "Kunde inte hitta WinSplits-tabellen.",
  );
}

function calculateControls(
  cellCount: number,
): number {
  /*
   * Cellerna 0–3:
   * 0 = placering
   * 1 = namn
   * 2 = sluttid
   * 3 = differens
   *
   * Därefter finns två celler per sträcka.
   * Sista sträckan går från sista kontrollen
   * till mål och ska inte räknas som kontroll.
   */
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

      /*
       * Sträcktiderna ligger från cell 4,
       * varannan cell:
       *
       * 4, 6, 8, 10 ...
       *
       * Vi läser endast riktiga kontroller,
       * inte den avslutande sträckan till mål.
       */
      for (
        let control = 1;
        control <= controls;
        control++
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

    /*
     * Samma väntetid och laddningsflöde som
     * i den tidigare fungerande versionen.
     */
    await page.waitForTimeout(1_500);

    let html =
      await findTableHtml(page);

    if (!html.includes("Bommad tid")) {
      await enableExtendedInformation(
        page,
      );

      await page.waitForTimeout(1_000);

      html =
        await findTableHtml(page);
    }

    if (!html.includes("Bommad tid")) {
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