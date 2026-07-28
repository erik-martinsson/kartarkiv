import axios from "axios";

const eventId = 53201;
const targetClass = "H21";

type WinSplitsClass = {
  categoryId: number;
  name: string;
  url: string;
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
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeClassName(value: string): string {
  return value
    .replace(/\s+/g, "")
    .replace(/[–—−]/g, "-")
    .toLocaleUpperCase("sv-SE");
}

function extractWinSplitsClasses(
  html: string,
  baseUrl: string
): WinSplitsClass[] {
  const classes = new Map<number, WinSplitsClass>();

  // Fångar hela innehållet mellan <a> och </a>, även om länken
  // innehåller exempelvis <span> eller andra HTML-element.
  const anchorPattern =
    /<a\b[^>]*href\s*=\s*["']([^"']*databaseId=112521[^"']*categoryId=(\d+)[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;

  for (const match of html.matchAll(anchorPattern)) {
    const href = decodeHtml(match[1]);
    const categoryId = Number(match[2]);
    const name = stripHtml(match[3]);

    if (!Number.isFinite(categoryId)) {
      continue;
    }

    let url: string;

    try {
      url = new URL(href, baseUrl).toString();
    } catch {
      continue;
    }

    // Samma categoryId kan förekomma flera gånger.
    // Behåll helst träffen som faktiskt har ett klassnamn.
    const existing = classes.get(categoryId);

    if (!existing || name.length > existing.name.length) {
      classes.set(categoryId, {
        categoryId,
        name,
        url,
      });
    }
  }

  return [...classes.values()].sort(
    (a, b) => a.categoryId - b.categoryId
  );
}

async function main(): Promise<void> {
  const resultListUrl =
    `https://eventor.orientering.se/Events/ResultList?eventId=${eventId}`;

  console.log("Hämtar Eventors resultatsida...");
  console.log(resultListUrl);

  const response = await axios.get<string>(resultListUrl, {
    responseType: "text",
    headers: {
      "User-Agent":
        "Mozilla/5.0 KartarkivStudio Eventor-WinSplits-Test",
      Accept: "text/html,application/xhtml+xml",
    },
  });

  const html = response.data;
  const classes = extractWinSplitsClasses(html, resultListUrl);

  console.log("\nKLASSER");
  console.log("------------------------------");

  if (classes.length === 0) {
    console.log("Inga WinSplits-klasser kunde läsas ut.");
    console.log(
      "Kontrollera om HTML-filen fortfarande innehåller categoryId."
    );
    return;
  }

  for (const item of classes) {
    console.log(
      `${String(item.categoryId).padStart(2, " ")}  ${
        item.name || "(klassnamn saknas)"
      }`
    );
  }

  const normalizedTarget = normalizeClassName(targetClass);

  let target = classes.find(
    item => normalizeClassName(item.name) === normalizedTarget
  );

  /*
   * I vissa Eventor-vyer ligger klassnamnet utanför själva länken.
   * Då söker vi i ett större HTML-område runt varje categoryId.
   */
  if (!target) {
    console.log(
      "\nH21 fanns inte direkt i länktexten. Söker i HTML-området runt länkarna..."
    );

    for (const item of classes) {
      const categoryPattern = new RegExp(
        `.{0,500}categoryId=${item.categoryId}.{0,500}`,
        "gis"
      );

      const surroundingHtml = html.match(categoryPattern)?.[0] ?? "";
      const surroundingText = stripHtml(surroundingHtml);

      if (
        new RegExp(
          `(^|[^A-ZÅÄÖ0-9])${targetClass}([^A-ZÅÄÖ0-9]|$)`,
          "i"
        ).test(surroundingText)
      ) {
        target = {
          ...item,
          name: targetClass,
        };

        break;
      }
    }
  }

  if (!target) {
    console.log("\nH21 hittades fortfarande inte.");

    console.log("\nRÅA TEXTRADER SOM INNEHÅLLER H21");
    console.log("------------------------------");

    const h21Matches =
      html.match(/.{0,250}H21.{0,250}/gis) ?? [];

    if (h21Matches.length === 0) {
      console.log("HTML-sidan innehåller inte texten H21.");
    } else {
      for (const match of h21Matches.slice(0, 10)) {
        console.log(stripHtml(match));
        console.log("---");
      }
    }

    return;
  }

  console.log("\nKLASS HITTAD");
  console.log("------------------------------");
  console.log(`Klass: ${target.name}`);
  console.log(`categoryId: ${target.categoryId}`);
  console.log(`URL: ${target.url}`);

  console.log("\nHämtar WinSplits-tabellen...");

  const tableResponse = await axios.get<string>(target.url, {
    responseType: "text",
    headers: {
      "User-Agent":
        "Mozilla/5.0 KartarkivStudio Eventor-WinSplits-Test",
      Accept: "text/html,application/xhtml+xml",
    },
  });

  const tableHtml = tableResponse.data;
  const tableText = stripHtml(tableHtml);

  console.log("Svarslängd:", tableHtml.length);
  console.log(
    "Innehåller Erik:",
    tableText.toLocaleLowerCase("sv-SE").includes("erik")
  );
  console.log(
    "Innehåller Martinsson:",
    tableText.toLocaleLowerCase("sv-SE").includes("martinsson")
  );

  console.log("\nTEXT RUNT MARTINSSON");
  console.log("------------------------------");

  const lowerHtml = tableHtml.toLocaleLowerCase("sv-SE");
  const position = lowerHtml.indexOf("martinsson");

  if (position === -1) {
    console.log("Martinsson hittades inte i den hämtade tabellen.");
    return;
  }

  const start = Math.max(0, position - 1500);
  const end = Math.min(tableHtml.length, position + 3000);
  const surroundingHtml = tableHtml.slice(start, end);

  console.log(stripHtml(surroundingHtml));

  console.log("\nLÄNKAR RUNT MARTINSSON");
  console.log("------------------------------");

  const linkPattern =
    /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

  let linkCount = 0;

  for (const match of surroundingHtml.matchAll(linkPattern)) {
    const label = stripHtml(match[2]);
    const href = decodeHtml(match[1]);

    try {
      const absoluteUrl = new URL(href, target.url).toString();
      console.log(`${label || "(utan text)"}: ${absoluteUrl}`);
      linkCount++;
    } catch {
      // Ignorera trasiga eller ovanliga länkar.
    }
  }

  if (linkCount === 0) {
    console.log("Inga länkar hittades i området runt löparen.");
  }
}

main().catch((error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error("\nHTTP-fel");
    console.error("Status:", error.response?.status);
    console.error("Meddelande:", error.message);

    if (typeof error.response?.data === "string") {
      console.error(
        stripHtml(error.response.data).slice(0, 1000)
      );
    }

    return;
  }

  console.error(error);
});