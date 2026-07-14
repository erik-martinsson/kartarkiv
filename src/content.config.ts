import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const races = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/races' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    location: z.string(),
    class: z.string(),
    distanceKm: z.number(),
    time: z.string(),
    position: z.number(),
    participants: z.number().optional(),
    mistakeSeconds: z.number().default(0),
    controls: z.number().optional(),
    mapImage: z.string(),
    mapPdf: z.string().optional(),
    livelox: z.string().url().optional(),
    winsplits: z.string().url().optional(),
    results: z.string().url().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    featured: z.boolean().default(false)
  })
});

export const collections = { races };
