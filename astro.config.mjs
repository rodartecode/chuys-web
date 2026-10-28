// @ts-check

import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  // TODO: set to production domain when known (e.g. https://chuystacos.com)
  site: "https://chuys-tacos.example.com",
  adapter: vercel(),
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  output: "static",
  build: {
    inlineStylesheets: "always",
    assets: "_assets",
    format: "directory",
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "viewport",
  },
  compressHTML: true,
});
