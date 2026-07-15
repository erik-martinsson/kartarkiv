import fs from 'node:fs/promises';
import { XMLParser } from 'fast-xml-parser';

const EARTH_RADIUS_METERS = 6371000;

const toRadians = (degrees) => (degrees * Math.PI) / 180;

const normalizeToArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const haversineDistance = (first, second) => {
  const lat1 = toRadians(first.latitude);
  const lat2 = toRadians(second.latitude);

  const dLat = toRadians(second.latitude - first.latitude);
  const dLon = toRadians(second.longitude - first.longitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLon / 2) ** 2;

  const c =
    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return EARTH_RADIUS_METERS * c;
};

const extractTrackPoints = (parsedGpx) => {
  const tracks = normalizeToArray(parsedGpx?.gpx?.trk);

  return tracks.flatMap((track) => {
    const segments = normalizeToArray(track?.trkseg);

    return segments.flatMap((segment) => {
      const points = normalizeToArray(segment?.trkpt);

      return points
        .map((point) => ({
          latitude: Number(point['@_lat']),
          longitude: Number(point['@_lon']),
          elevation:
            point.ele !== undefined
              ? Number(point.ele)
              : null,
          time:
            point.time !== undefined
              ? new Date(point.time)
              : null
        }))
        .filter(
          (point) =>
            Number.isFinite(point.latitude) &&
            Number.isFinite(point.longitude)
        );
    });
  });
};

const calculateDistance = (points) => {
  let totalMeters = 0;

  for (let i = 1; i < points.length; i++) {
    totalMeters += haversineDistance(
      points[i - 1],
      points[i]
    );
  }

  return totalMeters;
};

const calculateElevationGain = (points) => {
  let gain = 0;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1].elevation;
    const curr = points[i].elevation;

    if (
      Number.isFinite(prev) &&
      Number.isFinite(curr) &&
      curr > prev
    ) {
      gain += curr - prev;
    }
  }

  return gain;
};

const findFirstValidTime = (points) =>
  points.find(
    (point) =>
      point.time instanceof Date &&
      !Number.isNaN(point.time.getTime())
  )?.time ?? null;

const findLastValidTime = (points) =>
  [...points]
    .reverse()
    .find(
      (point) =>
        point.time instanceof Date &&
        !Number.isNaN(point.time.getTime())
    )?.time ?? null;

export async function analyseGpx(filePath) {
  const xml = await fs.readFile(filePath, 'utf8');

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    parseTagValue: true
  });

  const parsed = parser.parse(xml);

  const points = extractTrackPoints(parsed);

  if (points.length < 2) {
    throw new Error(
      'GPX-filen innehåller för få punkter.'
    );
  }

  const pointsWithElevation = points.filter(
    (p) => Number.isFinite(p.elevation)
  );

  const hasElevation =
    pointsWithElevation.length > 0;

  if (!hasElevation) {
    console.warn(
      '⚠ GPX-filen innehåller ingen höjdinformation.'
    );
  }

  const distanceMeters =
    calculateDistance(points);

  const startTime =
    findFirstValidTime(points);

  const endTime =
    findLastValidTime(points);

  const durationSeconds =
    startTime && endTime
      ? Math.round(
          (endTime - startTime) / 1000
        )
      : null;

  return {
    pointCount: points.length,

    distanceMeters,
    distanceKm: distanceMeters / 1000,

    hasElevation,
    elevationGainMeters: hasElevation
      ? calculateElevationGain(points)
      : null,

    start: points[0],
    end: points[points.length - 1],

    startTime,
    endTime,
    durationSeconds
  };
}