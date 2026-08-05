export type RaceMarkdownInput = {
  title: string;
  date: string;
  club: string;
  country: string;
  location: string;
  discipline: string;
  raceClass: string;
  distanceKm: string;
  time: string;
  position: string;
  starters: string;
  controls: string;
  mistakeTime: string;
  livelox: string;
  winsplits: string;
  results: string;
  comment: string;
  slug: string;
  mapImageExtension: string | null;
  routeImageExtension: string | null;
  hasGpxFile: boolean;
  gpsDistanceKm: number | null;
  gpsClimb: number | null;
  latitude: number | null;
  longitude: number | null;
};

export type RaceMarkdownResult = {
  markdown: string;
  year: string;
  filename: string;
  contentPath: string;
  mapImagePath: string | null;
  routeImagePath: string | null;
  gpsFilePath: string | null;
  mistakeSeconds: number;
};

function quoteYaml(value: string): string {
  return JSON.stringify(value.trim());
}

function optionalNumber(
  value: string,
): number | null {
  const normalized = value
    .trim()
    .replace(",", ".");

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

function mistakeTimeToSeconds(
  value: string,
): number {
  const parts = value
    .trim()
    .split(/[.:]/)
    .map(Number);

  if (
    parts.length < 2 ||
    parts.length > 3 ||
    parts.some((part) => !Number.isFinite(part))
  ) {
    return 0;
  }

  return parts.reduce(
    (total, part) => total * 60 + part,
    0,
  );
}

function normalizeExtension(
  extension: string | null,
): string | null {
  if (!extension) {
    return null;
  }

  const normalized =
    extension.trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  return normalized.startsWith(".")
    ? normalized
    : `.${normalized}`;
}

function addOptionalString(
  lines: string[],
  key: string,
  value: string,
): void {
  const trimmed = value.trim();

  if (trimmed) {
    lines.push(`${key}: ${quoteYaml(trimmed)}`);
  }
}

function addOptionalNumber(
  lines: string[],
  key: string,
  value: number | null,
  decimals?: number,
): void {
  if (
    value === null ||
    !Number.isFinite(value)
  ) {
    return;
  }

  lines.push(
    `${key}: ${
      typeof decimals === "number"
        ? Number(value.toFixed(decimals))
        : value
    }`,
  );
}

function normalizeRaceTime(
  value: string,
): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const parts = trimmed
    .split(/[.:]/)
    .map((part) => part.trim());

  if (
    (parts.length !== 2 &&
      parts.length !== 3) ||
    parts.some((part) => !/^\d+$/.test(part))
  ) {
    return trimmed;
  }

  const numbers = parts.map(Number);

  if (parts.length === 2) {
    const [minutes, seconds] = numbers;

    if (seconds >= 60) {
      return trimmed;
    }

    if (minutes < 60) {
      return `${minutes}:${String(seconds).padStart(2, "0")}`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return (
      `${hours}:` +
      `${String(remainingMinutes).padStart(2, "0")}:` +
      String(seconds).padStart(2, "0")
    );
  }

  const [hours, minutes, seconds] = numbers;

  if (minutes >= 60 || seconds >= 60) {
    return trimmed;
  }

  return (
    `${hours}:` +
    `${String(minutes).padStart(2, "0")}:` +
    String(seconds).padStart(2, "0")
  );
}

export function buildRaceMarkdown(
  input: RaceMarkdownInput,
): RaceMarkdownResult {
  const year =
    input.date.slice(0, 4) || "ÅR";

  const filename = `${input.slug}.md`;

  const mapExtension =
    normalizeExtension(
      input.mapImageExtension,
    );

  const routeExtension =
    normalizeExtension(
      input.routeImageExtension,
    );

  const mapImagePath = mapExtension
    ? `/maps/${year}/${input.slug}_blank${mapExtension}`
    : null;

  const routeImagePath = routeExtension
    ? `/maps/${year}/${input.slug}_rutt${routeExtension}`
    : null;

  const gpsFilePath = input.hasGpxFile
    ? `/gps/${year}/${input.slug}.gpx`
    : null;

  const distanceKm =
    optionalNumber(input.distanceKm) ?? 0;

  const position =
    optionalNumber(input.position);

  const starters =
    optionalNumber(input.starters);

  const controls =
    optionalNumber(input.controls);

  const mistakeSeconds =
    mistakeTimeToSeconds(
      input.mistakeTime,
    );

  const lines = [
    "---",
    `title: ${quoteYaml(input.title)}`,
    `date: ${input.date}`,
    "",
    `club: ${quoteYaml(input.club)}`,
    `country: ${quoteYaml(
      input.country.toUpperCase(),
    )}`,
    `location: ${quoteYaml(input.location)}`,
    "",
    `discipline: ${quoteYaml(
      input.discipline,
    )}`,
    `raceClass: ${quoteYaml(
      input.raceClass,
    )}`,
    "",
    `distanceKm: ${distanceKm}`,
  ];

  addOptionalNumber(
    lines,
    "gpsDistanceKm",
    input.gpsDistanceKm,
    2,
  );

  addOptionalNumber(
    lines,
    "gpsClimb",
    input.gpsClimb === null
      ? null
      : Math.round(input.gpsClimb),
  );

  lines.push(
    `time: ${quoteYaml(normalizeRaceTime(input.time))}`,
    "",
  );

  addOptionalNumber(
    lines,
    "position",
    position === null
      ? null
      : Math.round(position),
  );

  addOptionalNumber(
    lines,
    "starters",
    starters === null
      ? null
      : Math.round(starters),
  );

  lines.push("");

  addOptionalNumber(
    lines,
    "controls",
    controls === null
      ? null
      : Math.round(controls),
  );

  lines.push(
    `mistakeSeconds: ${mistakeSeconds}`,
    "",
  );

  if (mapImagePath) {
    lines.push(
      `mapImage: ${quoteYaml(mapImagePath)}`,
    );
  }

  if (routeImagePath) {
    lines.push(
      `routeImage: ${quoteYaml(
        routeImagePath,
      )}`,
    );
  }

  if (gpsFilePath) {
    lines.push(
      `gpsFile: ${quoteYaml(gpsFilePath)}`,
    );
  }

  if (
    mapImagePath ||
    routeImagePath ||
    gpsFilePath
  ) {
    lines.push("");
  }

  addOptionalNumber(
    lines,
    "latitude",
    input.latitude,
    7,
  );

  addOptionalNumber(
    lines,
    "longitude",
    input.longitude,
    7,
  );

  if (
    input.latitude !== null ||
    input.longitude !== null
  ) {
    lines.push("");
  }

  addOptionalString(
    lines,
    "livelox",
    input.livelox,
  );

  addOptionalString(
    lines,
    "winsplits",
    input.winsplits,
  );

  addOptionalString(
    lines,
    "results",
    input.results,
  );

  if (
    input.livelox.trim() ||
    input.winsplits.trim() ||
    input.results.trim()
  ) {
    lines.push("");
  }

  lines.push(
    "featured: false",
    "---",
    "",
    input.comment.trim(),
    "",
  );

  return {
    markdown: lines.join("\n"),
    year,
    filename,
    contentPath:
      `src/content/races/${year}/${filename}`,
    mapImagePath,
    routeImagePath,
    gpsFilePath,
    mistakeSeconds,
  };
}