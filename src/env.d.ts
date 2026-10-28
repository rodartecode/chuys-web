/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

// Secrets set with `wrangler secret put`; available via `import { env } from "cloudflare:workers"`.
declare namespace Cloudflare {
  interface Env {
    RESEND_API_KEY: string;
    TURNSTILE_SECRET_KEY: string;
  }
}
