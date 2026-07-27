import axios from "axios";
import * as cheerio from "cheerio";

const url =
  "https://obasen.orientering.se/winsplits/online/sv/table.asp?databaseId=112521&categoryId=1";

async function main(): Promise<void> {
  const response = await axios.get<ArrayBuffer>(url, {
    responseType: "arraybuffer",
    headers: {
      "User-Agent":
        "Mozilla/5.0 KartarkivStudio WinSplits-Cell-Test",
    },
  });

  const html = new TextDecoder("windows-1252").decode(
    new Uint8Array(response.data)
  );

  const $ = cheerio.load(html);

  const row = $("#15_1");

  if (row.length === 0) {
    console.log("Rad 15_1 hittades inte.");
    return;
  }

  console.log("ALLA CELLER I RAD 15_1");
  console.log("------------------------------");

  row.find("td").each((index, element) => {
    const cell = $(element);

    console.log(`\nCELL ${index}`);
    console.log(`Text: ${cell.text().trim()}`);
    console.log("HTML:");
    console.log($.html(element));
  });
}

main().catch(error => {
  console.error(error);
});