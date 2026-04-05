import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const dailyBrief = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/daily-brief' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    tags: z.array(z.string()).default([]),
  }),
});

const deepDive = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/deep-dive' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    tags: z.array(z.string()).default([]),
  }),
});

const toolRadar = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tool-radar' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    category: z.string().default('tool'),
    url: z.string().optional(),
  }),
});

const knowledge = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/knowledge' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string().default('general'),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  }),
});

const cognition = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cognition' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string().default('framework'),
  }),
});

export const collections = { dailyBrief, deepDive, toolRadar, knowledge, cognition };
