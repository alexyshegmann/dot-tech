import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

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
  }),
});

export const collections = { blog };