import { chromium } from "playwright";

const eventId = 53201;
const targetClass = "H21";

async function main(): Promise<void> {
  const browser = await chromium.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage();

    await page.goto(
      `https://eventor.orientering.se/Events/ResultList?eventId=${eventId}`,
      {
        waitUntil: "networkidle",
      }
    );

    const classHeading = page.getByText(targetClass, {
      exact: true,
    }).first();

    const classContainer = classHeading.locator(
      "xpath=ancestor::*[.//a[contains(., 'Livelox')]][1]"
    );

    const liveloxLink = classContainer
      .getByRole("link", {
        name: /Livelox/i,
      })
      .first();

    console.log("HTML:");
    console.log(
      await liveloxLink.evaluate(element => element.outerHTML)
    );

    await Promise.all([
      page.waitForURL(
        url => url.hostname.includes("livelox.com"),
        {
          timeout: 30_000,
        }
      ),
      liveloxLink.click(),
    ]);

    console.log("\nSlutlig URL:");
    console.log(page.url());
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});