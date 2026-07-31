export type MapCenter = {
  latitude: number;
  longitude: number;
};

type Coordinate = {
  latitude: number;
  longitude: number;
};

function isValidCoordinate(
  latitude: number,
  longitude: number,
): boolean {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

function parseCoordinateTuple(
  value: string,
): Coordinate | null {
  const parts = value
    .trim()
    .split(",")
    .map((part) => part.trim());

  if (parts.length < 2) {
    return null;
  }

  const longitude = Number(parts[0]);
  const latitude = Number(parts[1]);

  return isValidCoordinate(latitude, longitude)
    ? { latitude, longitude }
    : null;
}

function parseGxCoordinate(
  value: string,
): Coordinate | null {
  const parts = value
    .trim()
    .split(/\s+/)
    .map((part) => part.trim());

  if (parts.length < 2) {
    return null;
  }

  const longitude = Number(parts[0]);
  const latitude = Number(parts[1]);

  return isValidCoordinate(latitude, longitude)
    ? { latitude, longitude }
    : null;
}

export function readKmlCoordinates(
  kml: string,
): Coordinate[] {
  const coordinates: Coordinate[] = [];

  for (
    const block of kml.matchAll(
      /<coordinates\b[^>]*>([\s\S]*?)<\/coordinates>/gi,
    )
  ) {
    const content = block[1] ?? "";

    for (const tuple of content.split(/\s+/)) {
      const coordinate = parseCoordinateTuple(tuple);

      if (coordinate) {
        coordinates.push(coordinate);
      }
    }
  }

  for (
    const block of kml.matchAll(
      /<(?:gx:)?coord\b[^>]*>([\s\S]*?)<\/(?:gx:)?coord>/gi,
    )
  ) {
    const coordinate = parseGxCoordinate(block[1] ?? "");

    if (coordinate) {
      coordinates.push(coordinate);
    }
  }

  return coordinates;
}

export function calculateCoordinateBoundsCenter(
  coordinates: Coordinate[],
): MapCenter | null {
  if (coordinates.length === 0) {
    return null;
  }

  let minimumLatitude = Infinity;
  let maximumLatitude = -Infinity;
  let minimumLongitude = Infinity;
  let maximumLongitude = -Infinity;

  for (const coordinate of coordinates) {
    minimumLatitude = Math.min(
      minimumLatitude,
      coordinate.latitude,
    );
    maximumLatitude = Math.max(
      maximumLatitude,
      coordinate.latitude,
    );
    minimumLongitude = Math.min(
      minimumLongitude,
      coordinate.longitude,
    );
    maximumLongitude = Math.max(
      maximumLongitude,
      coordinate.longitude,
    );
  }

  const latitude =
    (minimumLatitude + maximumLatitude) / 2;
  const longitude =
    (minimumLongitude + maximumLongitude) / 2;

  return isValidCoordinate(latitude, longitude)
    ? { latitude, longitude }
    : null;
}

export async function resolveMapCenterFromKml(
  kmlUrl: string | null,
  fetchImplementation: typeof globalThis.fetch =
    globalThis.fetch,
): Promise<MapCenter | null> {
  if (!kmlUrl) {
    return null;
  }

  if (typeof fetchImplementation !== "function") {
    return null;
  }

  try {
    const response = await fetchImplementation(kmlUrl, {
      redirect: "follow",
      headers: {
        accept:
          "application/vnd.google-earth.kml+xml, application/xml, text/xml, */*",
        "user-agent": "kartarkiv-doma-enrichment/1.0",
      },
    });

    if (!response.ok) {
      return null;
    }

    const kml = await response.text();
    const coordinates = readKmlCoordinates(kml);

    return calculateCoordinateBoundsCenter(coordinates);
  } catch {
    return null;
  }
}