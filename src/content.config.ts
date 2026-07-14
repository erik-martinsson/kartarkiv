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
    stage: z.number().optional(),

    date: z.coerce.date(),

    club: z.string(),
    country: z.string(),
    location: z.string(),

    discipline: z.string(),
    raceClass: z.string(),

    distanceKm: z.number(),
    time: z.string(),

    position: z.number(),
    starters: z.number().optional(),

    mistakeSeconds: z.number().default(0),
    controls: z.number().optional(),

    mapImage: z.string(),
    thumbnailImage: z.string().optional(),
    mapPdf: z.string().optional(),
    gpsFile: z.string().optional(),

    mapScale: z.string().optional(),
    climb: z.number().optional(),

    livelox: z.string().url().optional(),
    winsplits: z.string().url().optional(),
    results: z.string().url().optional(),

    latitude: z.number().optional(),
    longitude: z.number().optional(),

    featured: z.boolean().default(false)
  })
});

export const collections = { races };
