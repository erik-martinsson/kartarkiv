import axios from "axios";

const eventId = 53201;
const runnerName = "Erik Martinsson";

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
    .replace(/&Ouml;/g, "Ö");
}

function stripHtml(value: string): string {
  return decodeHtml(
    value
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchHtml(url: string): Promise<string> {
  const response = await axios.get<string>(url, {
    responseType: "text",
    timeout: 30_000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 KartarkivStudio EventorDiagnostic",
      Accept: "text/html,*/*",
      "Accept-Language": "sv-SE,sv;q=0.9",
    },
  });

  return response.data;
}

async function main(): Promise<void> {
  const eventUrl =
    `https://eventor.orientering.se/Events/Show/${eventId}`;

  const resultsUrl =
    "https://eventor.orientering.se/Events/ResultList" +
    `?eventId=${eventId}`;

  const [eventHtml, resultsHtml] = await Promise.all([
    fetchHtml(eventUrl),
    fetchHtml(resultsUrl),
  ]);

  console.log("\nTÄVLINGSINFORMATION");
  console.log("------------------------------");

  const rows = eventHtml.match(
    /<tr\b[^>]*>[\s\S]*?<\/tr>/gi,
  ) ?? [];

  for (const row of rows) {
    const text = stripHtml(row);

    if (
      /^(Tävling|Arrangörsorganisation|Arena|Datum|Tävlingsdistans)\b/i.test(
        text,
      )
    ) {
      console.log(text);
    }
  }

  console.log("\nKLASSINFORMATION");
  console.log("------------------------------");

  const runnerPosition = resultsHtml
    .toLocaleLowerCase("sv-SE")
    .indexOf(
      runnerName.toLocaleLowerCase("sv-SE"),
    );

  if (runnerPosition < 0) {
    console.log(`${runnerName} hittades inte.`);
    return;
  }

  const area = resultsHtml.slice(
    Math.max(0, runnerPosition - 8_000),
    runnerPosition + 2_000,
  );

  const lines = stripHtml(area)
    .split(/(?=H21\b)|(?=Erik Martinsson\b)/i)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines.slice(-3)) {
    console.log(line.slice(0, 1_000));
  }
}

main().catch((error: unknown) => {
  console.error(
    error instanceof Error
      ? error.message
      : error,
  );

  process.exitCode = 1;
});