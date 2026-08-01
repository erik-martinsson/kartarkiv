export type PublishedRaceSummary = {
  id: string;
  title: string;
  date: string;
  discipline: string;
  country: string;
  location: string;
};

export type PublishedRaceFields = {
  title: string;
  event: string;
  date: string;
  club: string;
  country: string;
  location: string;
  discipline: string;
  raceClass: string;
  distanceKm: number | null;
  gpsDistanceKm: number | null;
  gpsClimb: number | null;
  time: string;
  position: number | null;
  starters: number | null;
  controls: number | null;
  mistakeSeconds: number | null;
  mapImage: string;
  routeImage: string;
  thumbnailImage: string;
  mapPdf: string;
  gpsFile: string;
  latitude: number | null;
  longitude: number | null;
  livelox: string;
  winsplits: string;
  results: string;
  featured: boolean;
};

export type PublishedRaceDocument = {
  id: string;
  filePath: string;
  publicUrl: string;
  fields: PublishedRaceFields;
  body: string;
};