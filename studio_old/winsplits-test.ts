import axios from "axios";
import { writeFile } from "node:fs/promises";

const databaseId = 112521;

const targetGivenName = "Erik";
const targetFamilyName = "Martinsson";

const eventorResultListUrl =
  "https://eventor.orientering.se/Events/ResultList?eventId=53201";

type Category = {
  categoryId: number;
  sourceUrl: string;
};

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&#x27;/gi, "'")
    .replace(/&nbsp;/gi, " ")
    .replace(/&aring;/gi, "å")
    .replace(/&auml;/gi, "ä")
    .replace(/&ouml;/gi, "ö")
    .replace(/&Aring;/g, "Å")
    .replace(/&Auml;/g, "Ä")
    .replace(/&Ouml;/g, "Ö")
    .replace(/&#(\d+);/g, (_, number: string) =>
      String.fromCharCode(Number(number))
    );
}

function stripHtml(value: string): string {
  return decodeHtml(
    value
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(?:tr|p|div|li|table|h1|h2|h3)>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalize(value: string): string {
  return decodeHtml(value)
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("sv-SE");
}

function containsTargetRunner(value: string): boolean {
  const normalized = normalize(value);

  return (
    normalized.includes(normalize(targetGivenName)) &&
    normalized.includes(normalize(targetFamilyName))
  );
}

function extractCategories(html: string): Category[] {
  const categories = new Map<number, Category>();

  /*
   * Vi hämtar categoryId från Eventors resultatsida.
   * Klassnamnet behövs inte här. Vi testar istället varje riktig
   * WinSplits-tabell tills Erik Martinsson hittas.
   */
  const linkPattern =
    /href\s*=\s*["']([^"']*databaseId=112521[^"']*categoryId=(\d+)[^"']*)["']/gi;

  for (const match of html.matchAll(linkPattern)) {
    const categoryId = Number(match[2]);

    if (!Number.isInteger(categoryId)) {
      continue;
    }

    categories.set(categoryId, {
      categoryId,
      sourceUrl: decodeHtml(match[1]),
    });
  }

  return [...categories.values()].sort(
    (a, b) => a.categoryId - b.categoryId
  );
}

function buildDirectTableUrl(categoryId: number): string {
  /*
   * Viktigt:
   *
   * Vi använder table.asp direkt.
   *
   * default.asp?page=table returnerade bara cirka 1300 tecken,
   * medan table.asp är själva resultattabellen.
   */
  return (
    "https://obasen.orientering.se/winsplits/online/sv/table.asp" +
    `?databaseId=${databaseId}` +
    `&categoryId=${categoryId}`
  );
}

function printHtmlAroundTarget(html: string): void {
  const lowerHtml = html.toLocaleLowerCase("sv-SE");
  const position = lowerHtml.indexOf(
    targetFamilyName.toLocaleLowerCase("sv-SE")
  );

  console.log("\nHTML RUNT LÖPAREN");
  console.log("------------------------------");

  if (position === -1) {
    console.log("Efternamnet hittades inte i rå HTML.");
    return;
  }

  const start = Math.max(0, position - 3000);
  const end = Math.min(html.length, position + 8000);
  const surroundingHtml = html.slice(start, end);

  console.log(surroundingHtml);
}

function printTextAroundTarget(html: string): void {
  const text = stripHtml(html);
  const lowerText = text.toLocaleLowerCase("sv-SE");
  const position = lowerText.indexOf(
    targetFamilyName.toLocaleLowerCase("sv-SE")
  );

  console.log("\nLÄSBAR TEXT RUNT LÖPAREN");
  console.log("------------------------------");

  if (position === -1) {
    console.log("Efternamnet hittades inte i den konverterade texten.");
    return;
  }

  const start = Math.max(0, position - 1000);
  const end = Math.min(text.length, position + 5000);

  console.log(text.slice(start, end));
}

function printPossibleMistakeData(html: string): void {
  console.log("\nMÖJLIGA BOMTIDSTRÄFFAR");
  console.log("------------------------------");

  const patterns = [
    /bomm[^<\r\n]{0,200}/gi,
    /bomtid[^<\r\n]{0,200}/gi,
    /tidsförlust[^<\r\n]{0,200}/gi,
    /förlorad[^<\r\n]{0,200}/gi,
    /mistake[^<\r\n]{0,200}/gi,
    /time\s*lost[^<\r\n]{0,200}/gi,
    /lost[^<\r\n]{0,200}/gi,
  ];

  const matches = new Set<string>();

  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      matches.add(stripHtml(match[0]));
    }
  }

  if (matches.size === 0) {
    console.log(
      "Inga tydliga ord som bomtid, tidsförlust eller mistake hittades."
    );
    console.log(
      "Informationen kan istället ligga i CSS-klasser, title-attribut eller tabellceller."
    );
    return;
  }

  for (const match of matches) {
    console.log(match);
  }
}

function printInterestingAttributes(html: string): void {
  console.log("\nINTRESSANTA HTML-ATTRIBUT");
  console.log("------------------------------");

  const targetPosition = html
    .toLocaleLowerCase("sv-SE")
    .indexOf(targetFamilyName.toLocaleLowerCase("sv-SE"));

  if (targetPosition === -1) {
    console.log("Löparen hittades inte.");
    return;
  }

  const start = Math.max(0, targetPosition - 3000);
  const end = Math.min(html.length, targetPosition + 10_000);
  const area = html.slice(start, end);

  const attributePattern =
    /\b(?:class|id|title|alt|href|style)\s*=\s*["'][^"']+["']/gi;

  const attributes = new Set(
    [...area.matchAll(attributePattern)].map(match =>
      decodeHtml(match[0])
    )
  );

  if (attributes.size === 0) {
    console.log("Inga relevanta attribut hittades.");
    return;
  }

  for (const attribute of attributes) {
    console.log(attribute);
  }
}

async function fetchHtml(url: string): Promise<string> {
  const response = await axios.get<string>(url, {
    responseType: "text",
    timeout: 20_000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 KartarkivStudio WinSplits-Test",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "sv-SE,sv;q=0.9,en;q=0.7",
    },
  });

  return response.data;
}

async function main(): Promise<void> {
  console.log("Hämtar kategorier från Eventor...");
  console.log(eventorResultListUrl);

  const eventorHtml = await fetchHtml(eventorResultListUrl);
  const categories = extractCategories(eventorHtml);

  if (categories.length === 0) {
    console.log("\nInga categoryId hittades.");
    return;
  }

  console.log(
    `\nHittade ${categories.length} kategorier:`
  );
  console.log(
    categories.map(item => item.categoryId).join(", ")
  );

  console.log("\nSöker efter Erik Martinsson i WinSplits...");
  console.log("------------------------------");

  for (const category of categories) {
    const tableUrl = buildDirectTableUrl(category.categoryId);

    process.stdout.write(
      `categoryId ${String(category.categoryId).padStart(2, " ")} ... `
    );

    try {
      const tableHtml = await fetchHtml(tableUrl);

      if (!containsTargetRunner(tableHtml)) {
        console.log(`ingen träff (${tableHtml.length} tecken)`);
        continue;
      }

      console.log(`TRÄFF (${tableHtml.length} tecken)`);

      console.log("\nLÖPARE HITTAD");
      console.log("------------------------------");
      console.log(
        `Namn: ${targetGivenName} ${targetFamilyName}`
      );
      console.log(`databaseId: ${databaseId}`);
      console.log(`categoryId: ${category.categoryId}`);
      console.log(`URL: ${tableUrl}`);
      console.log(`HTML-längd: ${tableHtml.length}`);

      const outputFilename = "winsplits-erik.html";

      await writeFile(outputFilename, tableHtml, "utf8");

      console.log(
        `\nHela sidan sparades som: ${outputFilename}`
      );

      printTextAroundTarget(tableHtml);
      printPossibleMistakeData(tableHtml);
      printInterestingAttributes(tableHtml);
      printHtmlAroundTarget(tableHtml);

      return;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(
          `HTTP-fel ${error.response?.status ?? "okänt"}`
        );
      } else {
        console.log("okänt fel");
      }
    }
  }

  console.log("\nErik Martinsson hittades inte i någon kategori.");
}

main().catch((error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error("\nHTTP-FEL");
    console.error("Status:", error.response?.status);
    console.error("Meddelande:", error.message);

    if (typeof error.response?.data === "string") {
      console.error(
        stripHtml(error.response.data).slice(0, 2000)
      );
    }

    return;
  }

  console.error(error);
});