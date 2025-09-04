import tailwindcss from '@tailwindcss/vite';
import astroReadingTime from 'astro-reading-time';
import { defineConfig } from 'astro/config';
import pagefind from "astro-pagefind";
import icon from 'astro-icon';
import preact from '@astrojs/preact';

import relatinator from 'astro-relatinator';

// https://astro.build/config
export default defineConfig({
  site: "https://alexyshegmann.tech",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [astroReadingTime(), icon(), pagefind(), preact({ devtools: true }), relatinator({
    paths: ["./src/content/blog"],
    schema: ["title", "excerpt", "tags"],
    similarityMethod: "bm25",
  })],
  markdown: {
    shikiConfig: {
      theme: 'dracula'
    },
  },
});