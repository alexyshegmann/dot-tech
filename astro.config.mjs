import tailwindcss from '@tailwindcss/vite';
import astroReadingTime from 'astro-reading-time';
import { defineConfig } from 'astro/config';
import pagefind from "astro-pagefind";
import icon from 'astro-icon';
import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  site: "https://alexyshegmann.tech",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [astroReadingTime(), icon(), pagefind(), preact({ devtools: true })],
  markdown: {
    shikiConfig: {
      theme: 'dracula'
    },
  },
});