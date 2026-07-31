import {
  mkdir,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { dirname, resolve } from "node:path";

export type ReverseGeocodeResult = {
  location: string | null;
  warning: string | null;
  source: "cache" | "geoapify" | "none";
};

type GeoapifyProperties = {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
  name?: string;
  formatted?: string;
};

type GeoapifyResponse = {
  results?: GeoapifyProperties[];
  features?: Array<{
    properties?: GeoapifyProperties;
  }>;
};

type CacheEntry = {
  location: string | null;
  updatedAt: string;
};

type CacheFile = Record<string, CacheEntry>;

const CACHE_PATH = resolve(
  process.cwd(),
  "migration",
  "cache",
  "geoapify-reverse.json",
);

function coordinateCacheKey(
  latitude: number,
  longitude: number,
): string {
  return `${latitude.toFixed(5)},${longitude.toFixed(5)}`;
}

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

async function readCache(): Promise<CacheFile> {
  try {
    const raw = await readFile(CACHE_PATH, "utf8");
    const parsed = JSON.parse(raw);

    return parsed && typeof parsed === "object"
      ? (parsed as CacheFile)
      : {};
  } catch {
    return {};
  }
}

async function writeCache(cache: CacheFile): Promise<void> {
  await mkdir(dirname(CACHE_PATH), { recursive: true });

  const temporaryPath =
    `${CACHE_PATH}.tmp-${process.pid}-${Date.now()}`;

  try {
    await writeFile(
      temporaryPath,
      `${JSON.stringify(cache, null, 2)}\n`,
      "utf8",
    );
    await rename(temporaryPath, CACHE_PATH);
  } catch (error) {
    await rm(temporaryPath, { force: true }).catch(
      () => undefined,
    );
    throw error;
  }
}

function chooseLocation(
  properties: GeoapifyProperties | undefined,
): string | null {
  if (!properties) {
    return null;
  }

  const candidates = [
    properties.city,
    properties.town,
    properties.village,
    properties.municipality,
    properties.county,
    properties.state,
    properties.name,
  ];

  for (const candidate of candidates) {
    const normalized = candidate?.trim();

    if (normalized) {
      return normalized;
    }
  }

  return null;
}

function readProperties(
  response: GeoapifyResponse,
): GeoapifyProperties | undefined {
  return (
    response.results?.[0] ??
    response.features?.[0]?.properties
  );
}

export async function reverseGeocodeLocation(
  latitude: number | null,
  longitude: number | null,
  fetchImplementation: typeof globalThis.fetch =
    globalThis.fetch,
): Promise<ReverseGeocodeResult> {
  if (
    latitude === null ||
    longitude === null ||
    !isValidCoordinate(latitude, longitude)
  ) {
    return {
      location: null,
      warning: null,
      source: "none",
    };
  }

  const cacheKey = coordinateCacheKey(
    latitude,
    longitude,
  );
  const cache = await readCache();
  const cached = cache[cacheKey];

  if (cached) {
    return {
      location: cached.location,
      warning: cached.location
        ? "Platsen hämtades från den lokala reverse-geokodningscachen."
        : null,
      source: "cache",
    };
  }

  const apiKey =
    process.env.GEOAPIFY_API_KEY?.trim() ?? "";

  if (!apiKey) {
    return {
      location: null,
      warning:
        "Eventor saknade plats och GEOAPIFY_API_KEY är inte konfigurerad. Platsen kunde därför inte hämtas från koordinaterna.",
      source: "none",
    };
  }

  if (typeof fetchImplementation !== "function") {
    return {
      location: null,
      warning:
        "Eventor saknade plats och någon fetch-implementation finns inte för reverse-geokodning.",
      source: "none",
    };
  }

  const url = new URL(
    "https://api.geoapify.com/v1/geocode/reverse",
  );
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("type", "city");
  url.searchParams.set("lang", "sv");
  url.searchParams.set("limit", "1");
  url.searchParams.set("format", "json");
  url.searchParams.set("apiKey", apiKey);

  try {
    const response = await fetchImplementation(url, {
      redirect: "follow",
      headers: {
        accept: "application/json",
        "user-agent":
          "kartarkiv-doma-enrichment/1.0",
      },
    });

    if (!response.ok) {
      return {
        location: null,
        warning:
          `Geoapify reverse-geokodning misslyckades med HTTP ${response.status}.`,
        source: "none",
      };
    }

    const payload =
      (await response.json()) as GeoapifyResponse;
    const location = chooseLocation(
      readProperties(payload),
    );

    cache[cacheKey] = {
      location,
      updatedAt: new Date().toISOString(),
    };

    await writeCache(cache).catch(() => undefined);

    return {
      location,
      warning: location
        ? `Platsen "${location}" hämtades automatiskt från koordinaterna via Geoapify.`
        : "Geoapify returnerade inget användbart ortsnamn för koordinaterna.",
      source: "geoapify",
    };
  } catch (error) {
    return {
      location: null,
      warning:
        `Geoapify reverse-geokodning misslyckades: ${
          error instanceof Error
            ? error.message
            : String(error)
        }`,
      source: "none",
    };
  }
}