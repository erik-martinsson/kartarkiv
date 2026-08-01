import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const races = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/races'
  }),

  schema: z.object({
    title: z.string(),
    event: z.string().nullable().optional(),
    stage: z.number().int().positive().nullable().optional(),

    date: z.coerce.date(),

    club: z.string(),
    country: z.string().length(2),
    location: z.string(),

    discipline: z.string(),
    raceClass: z.string(),

    distanceKm: z.number().nonnegative(),
    gpsDistanceKm: z.number().nonnegative().nullable().optional(),
    gpsClimb: z.number().nonnegative().nullable().optional(),
    time: z.string(),
    
    position: z.number().int().positive(),
    starters: z.number().int().positive().nullable().optional(),

    controls: z.number().int().nonnegative().nullable().optional(),
    mistakeSeconds: z.number().int().nonnegative().default(0),

    mapImage: z.string().nullable().optional(),
    routeImage: z.string().nullable().optional(),
    thumbnailImage: z.string().nullable().optional(),
    mapPdf: z.string().nullable().optional(),
    gpsFile: z.string().nullable().optional(),

    mapScale: z.string().nullable().optional(),
    climb: z.number().nonnegative().nullable().optional(),

    latitude: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),

    livelox: z.string().url().nullable().optional(),
    winsplits: z.string().url().nullable().optional(),
    results: z.string().url().nullable().optional(),

    featured: z.boolean().default(false)
  })
});

export const collections = { races };