import { glob } from "astro/loaders";
import { defineCollection, reference, z } from "astro:content";

const blog = defineCollection({
  loader: glob({
    pattern: ['**/*.md', '**/*.mdx'],
    base: './src/content/blog',
  }),
  schema: ({ image }) => z.object({
    title: z.string(),
    excerpt: z.string(),
    publishedAt: z.coerce.date(),
    image: image(),
    tags: z.array(z.string()),
    project: reference('projects').optional(),
  }),
});

const projects = defineCollection({
  loader: glob({
    pattern: ['**/*.md', '**/*.mdx'],
    base: './src/content/projects',
  }),
  schema: ({ image }) => z.object({
    name: z.string(),
    excerpt: z.string(),
    repo: z.string().optional(),
    publicUrl: z.string().optional(),
    tech: z.array(z.string()),
    preview: image(),
  })
});

export const collections = { blog, projects };