import { chromium, type Response } from "playwright";

export type LiveloxMapCenter = {
  latitude: number;
  longitude: number;
  source:
    | "map-center"
    | "class-bounding-box"
    | "course-controls";
};

type Coordinate = {
  latitude: number;
  longitude: number;
};

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function readNumber(
  value: unknown,
): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function readCoordinate(
  value: unknown,
): Coordinate | null {
  if (!isRecord(value)) {
    return null;
  }

  const latitude =
    readNumber(value.latitude) ??
    readNumber(value.lat);

  const longitude =
    readNumber(value.longitude) ??
    readNumber(value.lng) ??
    readNumber(value.lon);

  if (
    latitude === null ||
    longitude === null ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  return { latitude, longitude };
}

function findMapCenter(
  value: unknown,
): Coordinate | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findMapCenter(item);

      if (found) {
        return found;
      }
    }

    return null;
  }

  if (!isRecord(value)) {
    return null;
  }

  const map = value.map;

  if (isRecord(map)) {
    const center = readCoordinate(map.center);

    if (center) {
      return center;
    }
  }

  for (const item of Object.values(value)) {
    const found = findMapCenter(item);

    if (found) {
      return found;
    }
  }

  return null;
}

function findClassBoundingBoxCenter(
  value: unknown,
): Coordinate | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found =
        findClassBoundingBoxCenter(item);

      if (found) {
        return found;
      }
    }

    return null;
  }

  if (!isRecord(value)) {
    return null;
  }

  const general = value.general;

  if (isRecord(general)) {
    const classValue = general.class;

    if (isRecord(classValue)) {
      const boundingBox = classValue.boundingBox;

      if (isRecord(boundingBox)) {
        const center = readCoordinate(
          boundingBox.center,
        );

        if (center) {
          return center;
        }
      }
    }
  }

  for (const item of Object.values(value)) {
    const found =
      findClassBoundingBoxCenter(item);

    if (found) {
      return found;
    }
  }

  return null;
}

function collectControlCoordinates(
  value: unknown,
  coordinates: Coordinate[],
  path = "",
): void {
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      collectControlCoordinates(
        value[index],
        coordinates,
        `${path}[${index}]`,
      );
    }

    return;
  }

  if (!isRecord(value)) {
    return;
  }

  if (
    /controls\[\d+\]\.control\.position$/i.test(path)
  ) {
    const coordinate = readCoordinate(value);

    if (coordinate) {
      coordinates.push(coordinate);
    }
  }

  for (const [key, item] of Object.entries(value)) {
    collectControlCoordinates(
      item,
      coordinates,
      path ? `${path}.${key}` : key,
    );
  }
}

function calculateBoundsCenter(
  coordinates: Coordinate[],
): Coordinate | null {
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

  return {
    latitude:
      (minimumLatitude + maximumLatitude) / 2,
    longitude:
      (minimumLongitude + maximumLongitude) / 2,
  };
}

async function readJsonResponse(
  response: Response,
): Promise<unknown | null> {
  const requestType =
    response.request().resourceType();

  if (
    !response.ok() ||
    !["xhr", "fetch"].includes(requestType)
  ) {
    return null;
  }

  const contentType =
    (await response.allHeaders())["content-type"] ?? "";

  if (!contentType.includes("json")) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function resolveMapCenterFromLiveloxViewer(
  viewerUrl: string | null,
): Promise<LiveloxMapCenter | null> {
  if (!viewerUrl) {
    return null;
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(viewerUrl);
  } catch {
    return null;
  }

  if (
    parsedUrl.protocol !== "https:" ||
    !parsedUrl.hostname.endsWith("livelox.com")
  ) {
    return null;
  }

  const browser = await chromium.launch({
    headless: true,
  });

  try {
    const context = await browser.newContext({
      locale: "sv-SE",
      viewport: {
        width: 1280,
        height: 900,
      },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) " +
        "Chrome/126.0 Safari/537.36",
    });

    const page = await context.newPage();
    const pending = new Set<Promise<void>>();

    const found: {
      mapCenter: Coordinate | null;
      classCenter: Coordinate | null;
      controlCoordinates: Coordinate[];
    } = {
      mapCenter: null,
      classCenter: null,
      controlCoordinates: [],
    };

    page.on("response", (response) => {
      const task = readJsonResponse(response)
        .then((payload) => {
          if (!payload) {
            return;
          }

          found.mapCenter ??= findMapCenter(payload);
          found.classCenter ??=
            findClassBoundingBoxCenter(payload);

          collectControlCoordinates(
            payload,
            found.controlCoordinates,
          );
        })
        .catch(() => undefined)
        .finally(() => {
          pending.delete(task);
        });

      pending.add(task);
    });

    await page.goto(viewerUrl, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    await page.waitForTimeout(10_000);
    await Promise.allSettled([...pending]);
    await context.close();

    const mapCenter = found.mapCenter;
    if (mapCenter !== null) {
      return {
        latitude: mapCenter.latitude,
        longitude: mapCenter.longitude,
        source: "map-center",
      };
    }

    const classCenter = found.classCenter;
    if (classCenter !== null) {
      return {
        latitude: classCenter.latitude,
        longitude: classCenter.longitude,
        source: "class-bounding-box",
      };
    }

    const controlsCenter =
      calculateBoundsCenter(found.controlCoordinates);

    return controlsCenter
      ? {
          ...controlsCenter,
          source: "course-controls",
        }
      : null;
  } catch {
    return null;
  } finally {
    await browser.close();
  }
}