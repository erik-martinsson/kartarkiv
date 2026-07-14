import fs from 'node:fs';
import path from 'node:path';

type RaceData = {
  latitude?: number;
  longitude?: number;
  gpsFile?: string;
};

export type RaceLocation = {
  latitude: number;
  longitude: number;
  source: 'manual' | 'gpx';
};

function parseGpxCenter(gpxFile: string): RaceLocation | undefined {
  const relativePath = gpxFile.replace(/^\//, '');
  const absolutePath = path.join(process.cwd(), 'public', relativePath);
  if (!fs.existsSync(absolutePath)) return undefined;

  const xml = fs.readFileSync(absolutePath, 'utf8');
  const pointPattern = /<trkpt\s+[^>]*lat=["'](-?\d+(?:\.\d+)?)["'][^>]*lon=["'](-?\d+(?:\.\d+)?)["'][^>]*>/gi;
  const points: Array<{ lat: number; lon: number }> = [];

  for (const match of xml.matchAll(pointPattern)) {
    const lat = Number(match[1]);
    const lon = Number(match[2]);
    if (Number.isFinite(lat) && Number.isFinite(lon)) points.push({ lat, lon });
  }

  if (!points.length) return undefined;

  const latitudes = points.map((point) => point.lat);
  const longitudes = points.map((point) => point.lon);
  return {
    latitude: (Math.min(...latitudes) + Math.max(...latitudes)) / 2,
    longitude: (Math.min(...longitudes) + Math.max(...longitudes)) / 2,
    source: 'gpx'
  };
}

export function getRaceLocation(data: RaceData): RaceLocation | undefined {
  if (data.gpsFile) {
    const location = parseGpxCenter(data.gpsFile);
    if (location) return location;
  }

  if (Number.isFinite(data.latitude) && Number.isFinite(data.longitude)) {
    return { latitude: data.latitude as number, longitude: data.longitude as number, source: 'manual' };
  }

  return undefined;
}
