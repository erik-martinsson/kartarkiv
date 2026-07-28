import { fetchDomaHtml } from "./client";
import { parseDomaCompetition } from "./parser/entry";
import type {
  DomaCompetition,
  ReadDomaCompetitionOptions,
} from "./types";

export type {
  DomaCompetition,
  DomaLink,
  DomaLinkKind,
  ReadDomaCompetitionOptions,
} from "./types";

export async function readDomaCompetition(
  url: string,
  options: ReadDomaCompetitionOptions = {},
): Promise<DomaCompetition> {
  const parsedUrl = new URL(url);

  if (
    !/show_map\.php$/i.test(parsedUrl.pathname)
  ) {
    throw new Error(
      "URL:en måste peka på DOMA show_map.php.",
    );
  }

  const page = await fetchDomaHtml(url, options);

  return parseDomaCompetition(
    page.html,
    page.finalUrl,
  );
}
