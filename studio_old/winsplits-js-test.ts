import axios from "axios";

const url =
  "https://obasen.orientering.se/winsplits/online/sv/table.asp?databaseId=112521&categoryId=1";

async function main() {
  const html = (
    await axios.get(url, {
      responseType: "text",
    })
  ).data as string;

  console.log("\nSCRIPT-FILER");
  console.log("----------------");

  const scriptRegex =
    /<script[^>]+src="([^"]+)"/gi;

  for (const match of html.matchAll(scriptRegex)) {
    console.log(match[1]);
  }

  console.log("\nINLINE SCRIPT");
  console.log("----------------");

  const inlineRegex =
    /<script[^>]*>([\s\S]*?)<\/script>/gi;

  let i = 1;

  for (const match of html.matchAll(inlineRegex)) {
    const js = match[1].trim();

    if (!js)
      continue;

    console.log(`\nSCRIPT ${i++}`);
    console.log(js.substring(0, 5000));
  }
}

main();