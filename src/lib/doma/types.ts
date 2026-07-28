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

export type DomaProperty = {
  caption: string;
  value: string | null;
  url: string | null;
};

export type DomaCompetition = {
  mapId: number;
  sourceUrl: string;

  title: string | null;
  date: string | null;
  category: string | null;

  relayLeg: number | null;
  runningTime: string | null;
  runningDistanceKm: number | null;

  comment: string | null;

  routeMapImageUrl: string | null;
  blankMapImageUrl: string | null;
  kmlUrl: string | null;

  resultUrl: string | null;
  winsplitsUrl: string | null;
  eventorUrl: string | null;
  liveloxUrl: string | null;

  mapCenter: {
    latitude: number;
    longitude: number;
  } | null;

  imageWidth: number | null;
  imageHeight: number | null;

  properties: DomaProperty[];
  links: DomaLink[];
  warnings: string[];

  rawHtml: string;
};

export type ReadDomaCompetitionOptions = {
  timeoutMs?: number;
  userAgent?: string;
};
