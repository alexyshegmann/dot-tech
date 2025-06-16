import tailwindcss from '@tailwindcss/vite';
import astroReadingTime from 'astro-reading-time';
import { defineConfig } from 'astro/config';

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [astroReadingTime(), icon()],
  markdown: {
    shikiConfig: {
      theme: 'dracula'
    },
  },
});