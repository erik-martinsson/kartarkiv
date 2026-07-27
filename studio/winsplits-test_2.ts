import {
  getEventLinks,
} from "./src/lib/eventLinks";

import {
  loadWinSplits,
} from "./src/lib/winsplits";

const eventId = 53201;
const targetClass = "H21";
const targetRunner = "Erik Martinsson";

async function main(): Promise<void> {
  console.log("Hämtar länkar från Eventor...");

  const links = await getEventLinks(
    eventId,
    targetClass
  );

  console.log("\nEVENTOR");
  console.log("------------------------------");
  console.log(links.eventorUrl);

  console.log("\nWINSPLITS");
  console.log("------------------------------");

  if (!links.winsplits) {
    console.log(
      `Ingen WinSplits-länk hittades för ${targetClass}.`
    );

    return;
  }

  console.log(
    `Klass: ${links.winsplits.name}`
  );

  console.log(
    `databaseId: ${links.winsplits.databaseId}`
  );

  console.log(
    `categoryId: ${links.winsplits.categoryId}`
  );

  console.log(
    `URL: ${links.winsplits.url}`
  );

  console.log("\nLIVELOX");
  console.log("------------------------------");

  if (links.liveloxUrl) {
    console.log(links.liveloxUrl);
  } else {
    console.log(
      "Ingen Livelox-länk hittades på Eventor-sidorna."
    );
  }

  console.log("\nHämtar WinSplits-analys...");

  const runners = await loadWinSplits(
    links.winsplits.databaseId,
    links.winsplits.categoryId
  );

  const normalizedTargetRunner =
    targetRunner.toLocaleLowerCase("sv-SE");

  const runner = runners.find(
    item =>
      item.name.toLocaleLowerCase("sv-SE") ===
      normalizedTargetRunner
  );

  console.log("\nLÖPARE");
  console.log("------------------------------");

  if (!runner) {
    console.log(
      `${targetRunner} hittades inte i WinSplits.`
    );

    console.log("\nDe första fem löparna:");

    console.dir(runners.slice(0, 5), {
      depth: null,
    });

    return;
  }

  console.dir(runner, {
    depth: null,
  });
}

main().catch((error: unknown) => {
  console.error("");

  if (axiosErrorMessage(error)) {
    console.error(axiosErrorMessage(error));
  } else if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exitCode = 1;
});

function axiosErrorMessage(
  error: unknown
): string | null {
  if (
    typeof error !== "object" ||
    error === null
  ) {
    return null;
  }

  const possibleAxiosError = error as {
    isAxiosError?: boolean;
    message?: string;
    response?: {
      status?: number;
    };
  };

  if (!possibleAxiosError.isAxiosError) {
    return null;
  }

  const status =
    possibleAxiosError.response?.status;

  if (status) {
    return (
      `HTTP-fel ${status}: ` +
      (possibleAxiosError.message ??
        "Okänt fel")
    );
  }

  return (
    possibleAxiosError.message ??
    "Okänt HTTP-fel"
  );
}