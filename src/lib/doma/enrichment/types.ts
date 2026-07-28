export type CompetitionDiscipline =
  | "Lång"
  | "Medel"
  | "Stafett"
  | "Sprint"
  | "Natt"
  | "Ultralång"
  | "Annan"
  | "Okänd";

export type EnrichedMistake = {
  control: number;
  time: string;
};

export type EnrichedDomaCompetition = {
  doma: {
    mapId: number;
    sourceUrl: string;
    title: string | null;
    date: string | null;
    category: string | null;
    relayLeg: number | null;
    runningTime: string | null;
    runningDistanceKm: number | null;
    routeMapImageUrl: string | null;
    blankMapImageUrl: string | null;
    kmlUrl: string | null;
    winsplitsUrl: string | null;
  };

  discipline: CompetitionDiscipline;

  result: {
    runnerName: string;
    raceClass: string | null;
    club: string | null;
    position: string | null;
    starters: string | null;
    controls: number | null;
    time: string | null;
    totalMistakeTime: string;
    mistakes: EnrichedMistake[];
  };

  eventor: {
    eventId: number;
    verified: boolean;
    eventorUrl: string;
    resultListUrl: string;
    title: string;
    date: string;
    organiser: string;
    location: string;
    rawDiscipline: string;
  } | null;

  liveloxUrl: string | null;
  warnings: string[];
};
