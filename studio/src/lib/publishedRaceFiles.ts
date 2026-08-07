import {
  getLocalPublishedRacesRoot,
  listLocalPublishedRaces,
  readLocalPublishedRace,
  writeLocalPublishedRace,
} from "@/lib/localPublishedRepository";
import {
  listGitHubPublishedRaces,
  readGitHubPublishedRace,
  writeGitHubPublishedRace,
} from "@/lib/githubPublishedRepository";
import type {
  PublishedRaceDocument,
  PublishedRaceFields,
  PublishedRaceSummary,
} from "@/types/published";

function useGitHubRepository(): boolean {
  return process.env.VERCEL === "1";
}

/*
 * Behålls för kompatibilitet med eventuell äldre lokal kod.
 * På Vercel finns ingen meningsfull lokal repository-root.
 */
export async function getPublishedRacesRoot(): Promise<{
  repositoryRoot: string;
  racesRoot: string;
}> {
  if (useGitHubRepository()) {
    throw new Error(
      "getPublishedRacesRoot kan bara användas vid lokal körning.",
    );
  }

  return getLocalPublishedRacesRoot();
}

export async function listPublishedRaces(): Promise<
  PublishedRaceSummary[]
> {
  return useGitHubRepository()
    ? listGitHubPublishedRaces()
    : listLocalPublishedRaces();
}

export async function readPublishedRace(
  id: string,
): Promise<PublishedRaceDocument> {
  return useGitHubRepository()
    ? readGitHubPublishedRace(id)
    : readLocalPublishedRace(id);
}

export async function writePublishedRace(
  id: string,
  fields: PublishedRaceFields,
  body: string,
): Promise<PublishedRaceDocument> {
  return useGitHubRepository()
    ? writeGitHubPublishedRace(id, fields, body)
    : writeLocalPublishedRace(id, fields, body);
}
