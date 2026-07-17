import type { GpxAnalysis, RaceFormData } from "@/types/race";

type CreateRaceMarkdownOptions = {
  form: RaceFormData;
  analysis: GpxAnalysis | null;
  fileBaseName: string;
  mapExtension: string;
  routeExtension: string;
};

const quoteYaml = (value: string): string =>
  JSON.stringify(value.trim());

const optionalTextField = (name: string, value: string): string =>
  value.trim() ? `${name}: ${quoteYaml(value)}` : "";

const optionalNumberField = (
  name: string,
  value: string,
): string => {
  const trimmedValue = value.trim();

  if (!trimmedValue) return "";

  const numberValue = Number(trimmedValue);

  return Number.isFinite(numberValue)
    ? `${name}: ${numberValue}`
    : "";
};

export const timeToSeconds = (value: string): number => {
  const parts = value.trim().split(":").map(Number);

  if (
    parts.length === 0 ||
    parts.some((part) => !Number.isFinite(part))
  ) {
    return 0;
  }

  return parts.reduce((total, part) => total * 60 + part, 0);
};

export const createRaceMarkdown = ({
  form,
  analysis,
  fileBaseName,
  mapExtension,
  routeExtension,
}: CreateRaceMarkdownOptions): string => {
  const year = form.date ? form.date.slice(0, 4) : "ÅR";

  const lines = [
    "---",
    `title: ${quoteYaml(form.title)}`,
    `date: ${form.date}`,
    `club: ${quoteYaml(form.club)}`,
    `country: ${quoteYaml(form.country.toUpperCase())}`,
    `location: ${quoteYaml(form.location)}`,
    `raceClass: ${quoteYaml(form.raceClass)}`,
    `discipline: ${quoteYaml(form.discipline)}`,
    `distanceKm: ${Number(form.distanceKm) || 0}`,
    analysis
      ? `gpsDistanceKm: ${analysis.distanceKm.toFixed(2)}`
      : "",
    `time: ${quoteYaml(form.time)}`,
    `position: ${Number(form.position) || 0}`,
    optionalNumberField("starters", form.starters),
    optionalNumberField("controls", form.controls),
    `mistakeSeconds: ${timeToSeconds(form.mistakeTime)}`,
    analysis?.elevationGainMeters !== null &&
    analysis?.elevationGainMeters !== undefined
      ? `elevationGainMeters: ${Math.round(
          analysis.elevationGainMeters,
        )}`
      : "",
    `mapImage: ${quoteYaml(
      `/maps/${year}/${fileBaseName}_blank.${mapExtension}`,
    )}`,
    `routeImage: ${quoteYaml(
      `/maps/${year}/${fileBaseName}_rutt.${routeExtension}`,
    )}`,
    `gpxFile: ${quoteYaml(
      `/gps/${year}/${fileBaseName}.gpx`,
    )}`,
    analysis ? `latitude: ${analysis.startLatitude}` : "",
    analysis ? `longitude: ${analysis.startLongitude}` : "",
    optionalTextField("livelox", form.livelox),
    optionalTextField("winsplits", form.winsplits),
    optionalTextField("results", form.results),
    "---",
    "",
    form.comment.trim(),
    "",
  ];

  return lines
    .filter(
      (line, index, allLines) =>
        !(line === "" && allLines[index - 1] === ""),
    )
    .join("\n");
};
