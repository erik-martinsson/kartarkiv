import { XMLParser } from "fast-xml-parser";
import type { GpxAnalysis } from "@/types/race";

type TrackPoint = {
  latitude: number;
  longitude: number;
  elevation: number | null;
  time: Date | null;
};

const EARTH_RADIUS_METERS = 6_371_000;

const normalizeToArray = <T>(value: T | T[] | undefined | null): T[] => {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
};

const toRadians = (degrees: number): number =>
  (degrees * Math.PI) / 180;

const haversineDistance = (
  first: TrackPoint,
  second: TrackPoint,
): number => {
  const latitude1 = toRadians(first.latitude);
  const latitude2 = toRadians(second.latitude);

  const latitudeDifference = toRadians(
    second.latitude - first.latitude,
  );

  const longitudeDifference = toRadians(
    second.longitude - first.longitude,
  );

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(latitude1) *
      Math.cos(latitude2) *
      Math.sin(longitudeDifference / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a),
    );

  return EARTH_RADIUS_METERS * c;
};

const extractTrackPoints = (parsedGpx: unknown): TrackPoint[] => {
  const root = parsedGpx as {
    gpx?: {
      trk?: unknown;
    };
  };

  const tracks = normalizeToArray(root?.gpx?.trk);

  return tracks.flatMap((track) => {
    const typedTrack = track as {
      trkseg?: unknown;
    };

    const segments = normalizeToArray(typedTrack?.trkseg);

    return segments.flatMap((segment) => {
      const typedSegment = segment as {
        trkpt?: unknown;
      };

      const points = normalizeToArray(typedSegment?.trkpt);

      return points
        .map((point) => {
          const typedPoint = point as {
            "@_lat"?: string | number;
            "@_lon"?: string | number;
            ele?: string | number;
            time?: string;
          };

          const latitude = Number(typedPoint["@_lat"]);
          const longitude = Number(typedPoint["@_lon"]);

          const elevationValue =
            typedPoint.ele !== undefined
              ? Number(typedPoint.ele)
              : null;

          const timeValue =
            typedPoint.time !== undefined
              ? new Date(typedPoint.time)
              : null;

          return {
            latitude,
            longitude,
            elevation: Number.isFinite(elevationValue)
              ? elevationValue
              : null,
            time:
              timeValue instanceof Date &&
              !Number.isNaN(timeValue.getTime())
                ? timeValue
                : null,
          };
        })
        .filter(
          (point) =>
            Number.isFinite(point.latitude) &&
            Number.isFinite(point.longitude),
        );
    });
  });
};

const calculateDistance = (points: TrackPoint[]): number => {
  let totalMeters = 0;

  for (let index = 1; index < points.length; index += 1) {
    totalMeters += haversineDistance(
      points[index - 1],
      points[index],
    );
  }

  return totalMeters;
};

const calculateElevationGain = (
  points: TrackPoint[],
  minimumGainMeters = 1,
): number | null => {
  const elevationPoints = points.filter((point) =>
    Number.isFinite(point.elevation),
  );

  if (elevationPoints.length < 2) {
    return null;
  }

  let totalGain = 0;

  for (let index = 1; index < points.length; index += 1) {
    const previousElevation = points[index - 1].elevation;
    const currentElevation = points[index].elevation;

    if (
      !Number.isFinite(previousElevation) ||
      !Number.isFinite(currentElevation)
    ) {
      continue;
    }

    const difference =
      Number(currentElevation) - Number(previousElevation);

    if (difference >= minimumGainMeters) {
      totalGain += difference;
    }
  }

  return totalGain;
};

const findFirstValidTime = (
  points: TrackPoint[],
): Date | null =>
  points.find(
    (point) =>
      point.time instanceof Date &&
      !Number.isNaN(point.time.getTime()),
  )?.time ?? null;

const findLastValidTime = (
  points: TrackPoint[],
): Date | null =>
  [...points]
    .reverse()
    .find(
      (point) =>
        point.time instanceof Date &&
        !Number.isNaN(point.time.getTime()),
    )?.time ?? null;

export const analyseGpx = async (
  file: File,
): Promise<GpxAnalysis> => {
  if (!file) {
    throw new Error("Ingen GPX-fil valdes.");
  }

  const fileName = file.name.toLowerCase();

  if (!fileName.endsWith(".gpx")) {
    throw new Error("Filen måste vara en GPX-fil.");
  }

  const xml = await file.text();

  if (!xml.trim()) {
    throw new Error("GPX-filen är tom.");
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseTagValue: true,
    trimValues: true,
  });

  let parsedGpx: unknown;

  try {
    parsedGpx = parser.parse(xml);
  } catch {
    throw new Error("GPX-filen kunde inte tolkas som XML.");
  }

  const points = extractTrackPoints(parsedGpx);

  if (points.length < 2) {
    throw new Error(
      "GPX-filen innehåller för få giltiga spårpunkter.",
    );
  }

  const distanceMeters = calculateDistance(points);
  const elevationGainMeters =
    calculateElevationGain(points);

  const startTime = findFirstValidTime(points);
  const endTime = findLastValidTime(points);

  const durationSeconds =
    startTime && endTime
      ? Math.max(
          0,
          Math.round(
            (endTime.getTime() - startTime.getTime()) /
              1000,
          ),
        )
      : null;

  const startPoint = points[0];
  const endPoint = points.at(-1);

  if (!endPoint) {
    throw new Error(
      "GPX-filen saknar en giltig slutpunkt.",
    );
  }

  return {
    pointCount: points.length,
    distanceKm: distanceMeters / 1000,
    elevationGainMeters,
    durationSeconds,
    startLatitude: startPoint.latitude,
    startLongitude: startPoint.longitude,
    endLatitude: endPoint.latitude,
    endLongitude: endPoint.longitude,
  };
};