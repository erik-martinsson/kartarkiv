export type DomaLinkKind =
  | "winsplits"
  | "eventor"
  | "livelox"
  | "kml"
  | "map-image"
  | "route-image"
  | "external"
  | "internal";

export type DomaLink = {
  text: string;
  url: string;
  kind: DomaLinkKind;
};

export type DomaCompetition = {
  mapId: number;
  sourceUrl: string;

  title: string | null;
  date: string | null;
  category: string | null;
  organiser: string | null;
  country: string | null;
  discipline: string | null;
  mapName: string | null;

  comment: string | null;
  runningTime: string | null;
  runningDistanceKm: number | null;

  mapImageUrl: string | null;
  routedMapImageUrl: string | null;
  thumbnailUrl: string | null;
  kmlUrl: string | null;

  resultUrl: string | null;
  winsplitsUrl: string | null;
  eventorUrl: string | null;
  liveloxUrl: string | null;

  links: DomaLink[];

  warnings: string[];
  rawFields: Record<string, string>;
  rawHtml: string;
};

export type ReadDomaCompetitionOptions = {
  timeoutMs?: number;
  userAgent?: string;
};
