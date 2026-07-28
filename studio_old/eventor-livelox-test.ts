import { chromium, type Locator } from "playwright";

const eventId = 53201;
const targetClass = "H21";

type LiveloxCandidate = {
  text: string;
  href: string;
  outerHtml: string;
  nearbyText: string;
  nearbyHtml: string;
};

function normalizeText(value: string): string {
  return value
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("sv-SE");
}

function containsTargetClass(value: string): boolean {
  const normalizedValue = normalizeText(value);
  const normalizedClass = normalizeText(targetClass);

  return (
    normalizedValue === normalizedClass ||
    normalizedValue.startsWith(`${normalizedClass} `) ||
    normalizedValue.includes(` ${normalizedClass} `)
  );
}

async function findUsefulContainer(
  link: Locator
): Promise<Locator> {
  /*
   * Börja vid själva länken och gå uppåt tills vi hittar
   * ett område som både innehåller Livelox och klassnamnet.
   */
  let current = link;

  for (let level = 0; level < 8; level += 1) {
    const text = await current
      .innerText()
      .catch(() => "");

    if (
      normalizeText(text).includes("livelox") &&
      containsTargetClass(text)
    ) {
      return current;
    }

    const parent = current.locator("..");

    if ((await parent.count()) === 0) {
      break;
    }

    current = parent;
  }

  /*
   * Om klassnamnet inte finns i samma block använder vi
   * ett mindre område runt länken som diagnostik.
   */
  current = link;

  for (let level = 0; level < 4; level += 1) {
    const parent = current.locator("..");

    if ((await parent.count()) === 0) {
      break;
    }

    current = parent;
  }

  return current;
}

async function main(): Promise<void> {
  const resultListUrl =
    "https://eventor.orientering.se/Events/ResultList" +
    `?eventId=${eventId}`;

  console.log("Öppnar Eventors resultatlista...");
  console.log(resultListUrl);

  const browser = await chromium.launch({
    headless: true,
  });

  try {
    const context = await browser.newContext({
      locale: "sv-SE",
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) " +
        "Chrome/131.0.0.0 Safari/537.36",
    });

    const page = await context.newPage();

    await page.goto(resultListUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });

    await page.waitForLoadState("networkidle", {
      timeout: 15_000,
    }).catch(() => {
      console.log(
        "Sidan blev inte helt nätverksinaktiv, fortsätter ändå."
      );
    });

    await page.waitForTimeout(1_500);

    console.log("\nSidtitel:");
    console.log(await page.title());

    console.log("\nAktuell URL:");
    console.log(page.url());

    /*
     * Hitta både vanliga Livelox-länkar och länkar där
     * Livelox bara förekommer i href, title eller aria-label.
     */
    const liveloxLinks = page.locator(
      [
        'a:has-text("Livelox")',
        'a[href*="livelox" i]',
        'a[title*="livelox" i]',
        'a[aria-label*="livelox" i]',
      ].join(", ")
    );

    const count = await liveloxLinks.count();

    console.log("\nAntal möjliga Livelox-länkar:");
    console.log(count);

    if (count === 0) {
      console.log(
        "\nIngen Livelox-länk hittades direkt i DOM:en."
      );

      console.log(
        "\nAlla länkar nära texten H21:"
      );

      const classElements = page.getByText(
        targetClass,
        {
          exact: true,
        }
      );

      const classCount = await classElements.count();

      console.log(
        `Antal exakta ${targetClass}-träffar: ${classCount}`
      );

      for (let index = 0; index < classCount; index += 1) {
        const classElement = classElements.nth(index);
        const container = await findUsefulContainer(
          classElement
        );

        const links = container.locator("a[href]");
        const linkCount = await links.count();

        console.log(
          `\n${targetClass}-område ${index + 1}:`
        );

        for (
          let linkIndex = 0;
          linkIndex < linkCount;
          linkIndex += 1
        ) {
          const link = links.nth(linkIndex);

          console.log({
            text: await link.innerText().catch(() => ""),
            href: await link
              .getAttribute("href")
              .catch(() => null),
            absoluteHref: await link
              .evaluate(element =>
                (element as HTMLAnchorElement).href
              )
              .catch(() => ""),
          });
        }
      }

      return;
    }

    const candidates: LiveloxCandidate[] = [];

    for (let index = 0; index < count; index += 1) {
      const link = liveloxLinks.nth(index);
      const container = await findUsefulContainer(link);

      const candidate: LiveloxCandidate = {
        text: await link.innerText().catch(() => ""),
        href: await link
          .evaluate(element =>
            (element as HTMLAnchorElement).href
          )
          .catch(() => ""),
        outerHtml: await link
          .evaluate(element => element.outerHTML)
          .catch(() => ""),
        nearbyText: await container
          .innerText()
          .catch(() => ""),
        nearbyHtml: await container
          .evaluate(element => element.outerHTML)
          .catch(() => ""),
      };

      candidates.push(candidate);
    }

    candidates.forEach((candidate, index) => {
      console.log(
        `\n========================================`
      );

      console.log(
        `LIVELOX-KANDIDAT ${index + 1}`
      );

      console.log(
        `========================================`
      );

      console.log("\nTEXT:");
      console.log(candidate.text);

      console.log("\nURL:");
      console.log(candidate.href);

      console.log("\nLÄNKENS HTML:");
      console.log(candidate.outerHtml);

      console.log("\nTEXT I OMGIVANDE OMRÅDE:");
      console.log(candidate.nearbyText);

      console.log("\nHTML I OMGIVANDE OMRÅDE:");
      console.log(candidate.nearbyHtml);
    });

    const classCandidate = candidates.find(candidate =>
      containsTargetClass(candidate.nearbyText)
    );

    console.log(
      "\n========================================"
    );

    console.log(`RESULTAT FÖR ${targetClass}`);

    console.log(
      "========================================"
    );

    if (!classCandidate) {
      console.log(
        `En eller flera Livelox-länkar hittades, men ingen ` +
        `kunde säkert kopplas till ${targetClass}.`
      );

      return;
    }

    console.log(classCandidate.href);
  } finally {
    await browser.close();
  }
}

main().catch((error: unknown) => {
  console.error("\nTestet misslyckades.");

  if (error instanceof Error) {
    console.error(error.message);
    console.error(error.stack);
  } else {
    console.error(error);
  }

  process.exitCode = 1;
});