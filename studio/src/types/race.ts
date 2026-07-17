"use client";

export type RaceFormData = {
  title: string;
  date: string;
  club: string;
  country: string;
  location: string;
  raceClass: string;
  discipline: string;
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
};

export type RaceFiles = {
  mapImage: File | null;
  routeImage: File | null;
  gpxFile: File | null;
};

export type GpxAnalysis = {
  pointCount: number;
  distanceKm: number;
  elevationGainMeters: number | null;
  durationSeconds: number | null;
  startLatitude: number;
  startLongitude: number;
  endLatitude: number;
  endLongitude: number;
};

export const initialRaceFormData: RaceFormData = {
  title: "",
  date: "",
  club: "",
  country: "SE",
  location: "",
  raceClass: "H40",
  discipline: "Lång",
  distanceKm: "",
  time: "",
  position: "",
  starters: "",
  controls: "",
  mistakeTime: "0:00",
  livelox: "",
  winsplits: "",
  results: "",
  comment: "",
};

export const initialRaceFiles: RaceFiles = {
  mapImage: null,
  routeImage: null,
  gpxFile: null,
};
