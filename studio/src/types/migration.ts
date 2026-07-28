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

export type EventorVerificationMethod =
  | "winsplits-database-id"
  | "title-and-date"
  | "title-only";

export type EventorMatch = {
  eventId: number;
  eventorUrl: string;
  resultListUrl: string;
  title: string;
  score: number;
  verifiedByWinSplitsId: boolean;
  verificationMethod: EventorVerificationMethod;
  confidence: "high" | "medium";
};

export type EventorMetadata = {
  eventId: number;
  eventorUrl: string;
  resultListUrl: string;
  title: string;
  date: string;
  organiser: string;
  location: string;
  rawDiscipline: string;
  liveloxUrl: string | null;
};

export type EventorResolverDebug = {
  wantedTitle: string;
  domaDate: string;
  databaseId: number;
  searchedDates: string[];
  calendarUrls: string[];
  candidates: Array<{
    eventId: number;
    title: string;
    score: number;
    discoveredFrom: string;
    verifiedByWinSplitsId: boolean;
    eventDate: string | null;
    dateMatches: boolean;
    verificationMethod: EventorVerificationMethod | null;
  }>;
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
  eventor: EventorMetadata | null;
  eventorMatch: EventorMatch | null;
  eventorResolverDebug: EventorResolverDebug;
  liveloxUrl: string | null;
  warnings: string[];
};

export type MigrationReviewStatus =
  | "pending"
  | "approved"
  | "needs-review";

export type ReviewedDomaCompetition = {
  schemaVersion: 1;
  status: MigrationReviewStatus;
  reviewedAt: string;
  competition: EnrichedDomaCompetition;
};
