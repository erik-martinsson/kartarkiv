import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const races = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/races'
  }),

  schema: z.object({
    title: z.string(),
    event: z.string().optional(),
    stage: z.number().int().positive().optional(),

    date: z.coerce.date(),

    club: z.string(),
    country: z.string().length(2),
    location: z.string(),

    discipline: z.string(),
    raceClass: z.string(),

    distanceKm: z.number().nonnegative(),
    gpsDistanceKm: z.number().nonnegative().optional(),
    gpsClimb: z.number().nonnegative().optional(),
    time: z.string(),

    position: z.number().int().positive(),
    starters: z.number().int().positive().optional(),

    controls: z.number().int().nonnegative().optional(),
    mistakeSeconds: z.number().int().nonnegative().default(0),

    mapImage: z.string(),
    routeImage: z.string().optional(),
    thumbnailImage: z.string().optional(),
    mapPdf: z.string().optional(),
    gpsFile: z.string().optional(),

    mapScale: z.string().optional(),
    climb: z.number().nonnegative().optional(),

    latitude: z.number().optional(),
    longitude: z.number().optional(),

    livelox: z.string().url().optional(),
    winsplits: z.string().url().optional(),
    results: z.string().url().optional(),

    featured: z.boolean().default(false)
  })
});

export const collections = { races };