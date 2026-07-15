import path from 'node:path';
import { analyseGpx } from './lib/gpx.mjs';

const gpxPath = path.resolve(
  'imports/incoming/track.gpx'
);

try {
  const result = await analyseGpx(gpxPath);

  console.log('');
  console.log('GPX-analys');
  console.log('===========');
  console.log(`Fil: ${gpxPath}`);
  console.log(`Punkter: ${result.pointCount}`);
  console.log(
    `Distans: ${result.distanceKm.toFixed(2)} km`
  );
  console.log(
    `Höjdmeter: ${Math.round(
      result.elevationGainMeters
    )} m`
  );
  console.log(
    `Start: ${result.start.latitude}, ${result.start.longitude}`
  );
  console.log(
    `Slut: ${result.end.latitude}, ${result.end.longitude}`
  );

  if (result.durationSeconds !== null) {
    console.log(
      `GPX-tid: ${result.durationSeconds} sekunder`
    );
  }
} catch (error) {
  console.error('');
  console.error('GPX-filen kunde inte analyseras.');
  console.error(
    error instanceof Error
      ? error.message
      : error
  );

  process.exitCode = 1;
}