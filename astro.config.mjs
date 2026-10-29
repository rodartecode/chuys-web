// @ts-check

import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://chuystacos.com",
  // No sessions: keeps the adapter from requiring a SESSION KV namespace.
  session: false,
  adapter: cloudflare({ imageService: "compile", prerenderEnvironment: "node" }),
  integrations: [sitemap()],
  // Self-hosted at build time: no render-blocking request to Google Fonts.
  // Italics stay unloaded; the browser slants the upright face, as before.
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Playfair Display",
      cssVariable: "--font-playfair",
      weights: [600, 700],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["ui-serif", "Georgia", "Times New Roman", "serif"],
    },
  ],
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
