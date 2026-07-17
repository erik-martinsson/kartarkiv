"use client";

import JSZip from "jszip";
import type { RaceFiles } from "@/types/race";

type CreateRaceArchiveOptions = {
  files: RaceFiles;
  markdown: string;
  fileBaseName: string;
  year: string;
  mapExtension: string;
  routeExtension: string;
};

const downloadBlob = (fileName: string, blob: Blob): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};

export const createRaceArchive = async ({
  files,
  markdown,
  fileBaseName,
  year,
  mapExtension,
  routeExtension,
}: CreateRaceArchiveOptions): Promise<void> => {
  if (!files.mapImage || !files.routeImage || !files.gpxFile) {
    throw new Error(
      "Alla tre filer måste vara valda innan paketet kan skapas.",
    );
  }

  const zip = new JSZip();

  zip.file(
    `src/content/races/${year}/${fileBaseName}.md`,
    markdown,
  );
  zip.file(
    `public/maps/${year}/${fileBaseName}_blank.${mapExtension}`,
    files.mapImage,
  );
  zip.file(
    `public/maps/${year}/${fileBaseName}_rutt.${routeExtension}`,
    files.routeImage,
  );
  zip.file(
    `public/gps/${year}/${fileBaseName}.gpx`,
    files.gpxFile,
  );

  const blob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  downloadBlob(`${fileBaseName}-kartarkiv.zip`, blob);
};
