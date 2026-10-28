// @ts-check

import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://chuystacos.com",
  // No sessions: keeps the adapter from requiring a SESSION KV namespace.
  session: false,
  adapter: cloudflare({ imageService: "compile", prerenderEnvironment: "node" }),
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
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
