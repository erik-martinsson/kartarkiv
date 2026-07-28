import axios from "axios";
import * as cheerio from "cheerio";

const databaseId = 112521;
const categoryId = 1;

const targetGivenName = "Erik";
const targetFamilyName = "Martinsson";

const tableUrl =
  "https://obasen.orientering.se/winsplits/online/sv/table.asp" +
  `?databaseId=${databaseId}` +
  `&categoryId=${categoryId}`;

type FormField = {
  name: string;
  value: string;
  type: string;
  checked: boolean;
  surroundingText: string;
};

type SplitCell = {
  leg: number;
  splitTime: string;
  cssClass: string;
  title: string;
  attributes: Record<string, string>;
};

function decodeWinSplitsBuffer(data: ArrayBuffer): string {
  /*
   * WinSplits använder en äldre västeuropeisk teckenkodning.
   * windows-1252 gör att exempelvis Linköpings OK visas korrekt.
   */
  return new TextDecoder("windows-1252").decode(
    new Uint8Array(data)
  );
}

async function fetchHtml(
  url: string,
  params?: URLSearchParams,
  method: "get" | "post" = "get"
): Promise<string> {
  const commonOptions = {
    responseType: "arraybuffer" as const,
    timeout: 20_000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 KartarkivStudio WinSplits-Bomtid-Test",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "sv-SE,sv;q=0.9,en;q=0.7",
    },
  };

  if (method === "post") {
    const response = await axios.post<ArrayBuffer>(
      url,
      params?.toString() ?? "",
      {
        ...commonOptions,
        headers: {
          ...commonOptions.headers,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return decodeWinSplitsBuffer(response.data);
  }

  const requestUrl = params
    ? `${url}${url.includes("?") ? "&" : "?"}${params.toString()}`
    : url;

  const response = await axios.get<ArrayBuffer>(
    requestUrl,
    commonOptions
  );

  return decodeWinSplitsBuffer(response.data);
}

function normalize(value: string): string {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("sv-SE");
}

function getFormFields(
  $: cheerio.CheerioAPI,
  form: cheerio.Cheerio<any>
): FormField[] {
  const fields: FormField[] = [];

  form.find("input, select, textarea").each((_, element) => {
    const item = $(element);
    const name = item.attr("name");

    if (!name) {
      return;
    }

    const tagName = element.tagName.toLowerCase();
    const type =
      tagName === "input"
        ? (item.attr("type") ?? "text").toLowerCase()
        : tagName;

    let value = item.attr("value") ?? "";

    if (tagName === "select") {
      const selected = item.find("option:selected");

      value =
        selected.attr("value") ??
        selected.text().trim() ??
        "";
    }

    if (tagName === "textarea") {
      value = item.text();
    }

    const checked =
      type === "checkbox" || type === "radio"
        ? item.is(":checked")
        : false;

    /*
     * Tar med texten runt kontrollen för att identifiera den som
     * motsvarar "Visa utökad information", även om namnet är kryptiskt.
     */
    const parentText = normalize(
      item.parent().text() +
      " " +
      item.closest("td, tr, label, div, p").text()
    );

    fields.push({
      name,
      value,
      type,
      checked,
      surroundingText: parentText,
    });
  });

  return fields;
}

function printFormFields(fields: FormField[]): void {
  console.log("\nFORMULÄRFÄLT");
  console.log("------------------------------");

  for (const field of fields) {
    console.log(
      [
        `name=${field.name}`,
        `type=${field.type}`,
        `value=${JSON.stringify(field.value)}`,
        `checked=${field.checked}`,
        `text=${JSON.stringify(
          field.surroundingText.slice(0, 180)
        )}`,
      ].join(" | ")
    );
  }
}

function isExtendedInfoField(field: FormField): boolean {
  const haystack = normalize(
    `${field.name} ${field.value} ${field.surroundingText}`
  );

  return (
    haystack.includes("utökad information") ||
    haystack.includes("utokad information") ||
    haystack.includes("extended information") ||
    haystack.includes("extendedinfo") ||
    haystack.includes("showinfo") ||
    haystack.includes("moreinfo")
  );
}

function buildSubmissionParameters(
  fields: FormField[],
  extendedField: FormField
): URLSearchParams {
  const params = new URLSearchParams();

  for (const field of fields) {
    if (
      field.type === "submit" ||
      field.type === "button" ||
      field.type === "reset" ||
      field.type === "image" ||
      field.type === "file"
    ) {
      continue;
    }

    if (
      (field.type === "checkbox" ||
        field.type === "radio") &&
      !field.checked &&
      field.name !== extendedField.name
    ) {
      continue;
    }

    params.set(field.name, field.value || "1");
  }

  /*
   * Aktivera fältet oavsett om det ursprungligen var avmarkerat.
   */
  params.set(
    extendedField.name,
    extendedField.value || "1"
  );

  /*
   * Säkerställ att tävling och klass följer med även om de inte
   * ligger som formulärfält.
   */
  params.set("databaseId", String(databaseId));
  params.set("categoryId", String(categoryId));

  return params;
}

function findRunnerRow(
  $: cheerio.CheerioAPI
): cheerio.Cheerio<any> | null {
  const targetName = normalize(
    `${targetGivenName} ${targetFamilyName}`
  );

  let result: cheerio.Cheerio<any> | null = null;

  $("tr").each((_, row) => {
    const current = $(row);

    if (normalize(current.text()).includes(targetName)) {
      result = current;
      return false;
    }
  });

  return result;
}

function extractAttributes(
  element: cheerio.Cheerio<any>
): Record<string, string> {
  const raw = element.attr() ?? {};
  const attributes: Record<string, string> = {};

  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") {
      attributes[key] = value;
    }
  }

  return attributes;
}

function extractSplitCells(
  $: cheerio.CheerioAPI,
  row: cheerio.Cheerio<any>
): SplitCell[] {
  const cells = row.find("td").toArray();

  /*
   * Kolumn 1 är placering och kolumn 2 är namn.
   * Därefter följer sträcktiderna. Sista cellen innehåller vanligtvis
   * det upprepade löparnamnet och ska inte räknas som sträcka.
   */
  const timeCells = cells.slice(2, -1);

  return timeCells.map((cell, index) => {
    const item = $(cell);
    const attributes = extractAttributes(item);

    return {
      leg: index + 1,
      splitTime: item.text().trim(),
      cssClass: item.attr("class") ?? "",
      title:
        item.attr("title") ??
        item.attr("alt") ??
        item.attr("data-title") ??
        "",
      attributes,
    };
  });
}

function printSplitCells(cells: SplitCell[]): void {
  console.log("\nERIKS STRÄCKTIDSCELLER");
  console.log("------------------------------");

  for (const cell of cells) {
    console.log(
      [
        `Sträcka ${cell.leg}`,
        `tid=${cell.splitTime}`,
        `klass=${cell.cssClass || "(saknas)"}`,
        `info=${cell.title || "(saknas)"}`,
      ].join(" | ")
    );

    const interestingAttributes = Object.entries(
      cell.attributes
    ).filter(([name]) =>
      !["class", "align", "width", "height"].includes(
        name.toLowerCase()
      )
    );

    for (const [name, value] of interestingAttributes) {
      console.log(`  ${name}=${JSON.stringify(value)}`);
    }
  }
}

function parseTimeToSeconds(value: string): number | null {
  const normalizedTime = value
    .trim()
    .replace(",", ".")
    .replace(/^\+/, "");

  const parts = normalizedTime
    .split(/[.:]/)
    .map(Number);

  if (
    parts.length === 2 &&
    parts.every(Number.isFinite)
  ) {
    return parts[0] * 60 + parts[1];
  }

  if (
    parts.length === 3 &&
    parts.every(Number.isFinite)
  ) {
    return (
      parts[0] * 3600 +
      parts[1] * 60 +
      parts[2]
    );
  }

  return null;
}

function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function extractMistakeTime(info: string): number | null {
  /*
   * Exempel på möjliga texter:
   *
   * "Bommad tid: 0.42"
   * "Bomtid 0:42"
   * "Tidsförlust: 42 s"
   */
  const timeMatch = info.match(
    /(?:bommad\s+tid|bomtid|tidsförlust|time\s+lost|mistake)[^0-9+]*\+?(\d{1,2}[.:]\d{2}(?:[.:]\d{2})?)/i
  );

  if (timeMatch) {
    return parseTimeToSeconds(timeMatch[1]);
  }

  const secondsMatch = info.match(
    /(?:bommad\s+tid|bomtid|tidsförlust|time\s+lost|mistake)[^0-9]*(\d+)\s*(?:s|sek|sekunder)/i
  );

  if (secondsMatch) {
    return Number(secondsMatch[1]);
  }

  return null;
}

function printMistakes(cells: SplitCell[]): void {
  const mistakes = cells
    .map(cell => ({
      ...cell,
      lostSeconds: extractMistakeTime(
        [
          cell.title,
          ...Object.values(cell.attributes),
        ].join(" ")
      ),
    }))
    .filter(
      (
        cell
      ): cell is SplitCell & { lostSeconds: number } =>
        cell.lostSeconds !== null
    );

  console.log("\nREGISTRERAD BOMTID");
  console.log("------------------------------");

  if (mistakes.length === 0) {
    console.log(
      "Ingen bomtid kunde ännu tolkas automatiskt."
    );
    console.log(
      "Kontrollera informationen som skrivs ut under ERIKS STRÄCKTIDSCELLER."
    );
    return;
  }

  let totalSeconds = 0;

  for (const mistake of mistakes) {
    totalSeconds += mistake.lostSeconds;

    console.log(
      `Sträcka ${mistake.leg}: ` +
      `${formatSeconds(mistake.lostSeconds)} bomtid ` +
      `(sträcktid ${mistake.splitTime})`
    );
  }

  console.log(
    `\nTotal bomtid: ${formatSeconds(totalSeconds)}`
  );
}

async function main(): Promise<void> {
  console.log("Hämtar WinSplits grundtabell...");
  console.log(tableUrl);

  const initialHtml = await fetchHtml(tableUrl);
  const initialPage = cheerio.load(initialHtml);

  console.log("Svarslängd:", initialHtml.length);

  const forms = initialPage("form");

  console.log("Antal formulär:", forms.length);

  if (forms.length === 0) {
    console.log(
      "Inget inställningsformulär hittades på sidan."
    );
    return;
  }

  let selectedForm:
    | cheerio.Cheerio<any>
    | null = null;

  let selectedFields: FormField[] = [];
  let extendedField: FormField | undefined;

  forms.each((_, formElement) => {
    const form = initialPage(formElement);
    const fields = getFormFields(initialPage, form);
    const found = fields.find(isExtendedInfoField);

    if (found && !selectedForm) {
      selectedForm = form;
      selectedFields = fields;
      extendedField = found;
    }
  });

  if (!selectedForm || !extendedField) {
    console.log(
      "\nKunde inte identifiera fältet för utökad information."
    );

    /*
     * Skriv ut alla fält så att nästa steg kan anpassas efter
     * WinSplits faktiska formulär.
     */
    forms.each((index, formElement) => {
      console.log(`\nFORMULÄR ${index + 1}`);
      printFormFields(
        getFormFields(
          initialPage,
          initialPage(formElement)
        )
      );
    });

    return;
  }

  printFormFields(selectedFields);

  console.log("\nUTÖKAD INFORMATION HITTAD");
  console.log("------------------------------");
  console.log(`Namn: ${extendedField.name}`);
  console.log(`Värde: ${extendedField.value || "1"}`);
  console.log(`Typ: ${extendedField.type}`);

  const action =
    selectedForm.attr("action") || "table.asp";

  const method =
    selectedForm.attr("method")?.toLowerCase() === "post"
      ? "post"
      : "get";

  const submissionUrl = new URL(
    action,
    tableUrl
  ).toString();

  const params = buildSubmissionParameters(
    selectedFields,
    extendedField
  );

  console.log("\nHämtar tabell med utökad information...");
  console.log(`Metod: ${method.toUpperCase()}`);
  console.log(`Adress: ${submissionUrl}`);
  console.log(`Parametrar: ${params.toString()}`);

  const extendedHtml = await fetchHtml(
    submissionUrl,
    params,
    method
  );

  console.log("Svarslängd:", extendedHtml.length);

  const extendedPage = cheerio.load(extendedHtml);
  const runnerRow = findRunnerRow(extendedPage);

  if (!runnerRow) {
    console.log(
      "\nErik Martinsson hittades inte efter att inställningen skickades."
    );
    return;
  }

  console.log("\nLÖPARRAD HITTAD");
  console.log("------------------------------");
  console.log(`Rad-ID: ${runnerRow.attr("id") ?? "(saknas)"}`);
  console.log(normalize(runnerRow.text()));

  const splitCells = extractSplitCells(
    extendedPage,
    runnerRow
  );

  printSplitCells(splitCells);
  printMistakes(splitCells);
}

main().catch((error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error("\nHTTP-FEL");
    console.error("Status:", error.response?.status);
    console.error("Meddelande:", error.message);

    if (error.response?.data instanceof ArrayBuffer) {
      console.error(
        decodeWinSplitsBuffer(
          error.response.data
        ).slice(0, 2000)
      );
    }

    return;
  }

  console.error(error);
});