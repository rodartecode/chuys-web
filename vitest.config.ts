import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const path = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// Plain Vite config rather than Astro's getViteConfig, which would pull in the Cloudflare
// adapter and workerd. Unit tests run in Node with the Worker-only imports stubbed.
export default defineConfig({
  resolve: {
    alias: {
      "@": path("./src"),
      "@data": path("./src/data"),
      "cloudflare:workers": path("./tests/stubs/cloudflare-workers.ts"),
    },
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
  },
});
