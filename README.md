# Chuy's Tacos

Single-page landing site and catering-inquiry form for **Chuy's Tacos**, a family-owned taquería and catering business. Built with Astro, deployed to Cloudflare Workers, with inquiries bot-checked by Turnstile and delivered via Resend.

## Highlights

- Single-page anchor layout: Hero, Menu Highlights, About, Catering, Hours/Location, Inquiry Form
- Resend-backed inquiry form with client-side validation, honeypot, and lazy-loaded Cloudflare Turnstile
- Warm earth-tone theme via Tailwind v4 `@theme` tokens
- Static HTML served as Worker assets + a single Worker route for the inquiry endpoint

## Quick start

```bash
pnpm install
cp .dev.vars.example .dev.vars   # Resend key + Turnstile test secret
pnpm dev                         # http://localhost:4321
pnpm preview                     # build + real Workers runtime at http://localhost:8787
```

The dev server runs without secrets set. Only `/api/inquiry` is affected: it skips Turnstile and returns 500 until `RESEND_API_KEY` is populated.

## Secrets

| Secret | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | Resend API key with sending access only. See [resend.com/api-keys](https://resend.com/api-keys) |
| `TURNSTILE_SECRET_KEY` | yes in prod | Turnstile widget secret. `.dev.vars.example` ships Cloudflare's always-pass test key |

Set them locally in `.dev.vars` and in production with `pnpm exec wrangler secret put <NAME>`. The inquiry recipient, the sender address and the Turnstile site key aren't secret, so they live in `src/data/business.ts`.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Run the Astro dev server |
| `pnpm build` | Build static assets to `dist/client` and the Worker to `dist/server` |
| `pnpm preview` | Build, then run `wrangler dev` (real Workers runtime) on port 8787 |
| `pnpm cf:deploy` | Build, then `wrangler deploy` (Workers Builds does this on push to `main`) |
| `pnpm cf:types` | Regenerate Worker runtime types with `wrangler types` |
| `pnpm typecheck` | `astro check` — type-checks `.astro` and `.ts` |
| `pnpm test` | Unit tests, then the browser smoke test |
| `pnpm test:unit` | Vitest over `/api/inquiry` (`tests/unit/`) |
| `pnpm test:e2e` | Playwright smoke test of the inquiry form (`tests/e2e/`). Starts `pnpm dev` and uses your local Chrome |
| `pnpm lint` | Biome lint |
| `pnpm lint:fix` | Biome auto-fix |
| `pnpm lint:styles` | Stylelint over `.css` and `.astro` `<style>` blocks |
| `pnpm format` | Biome format the repo |

## Editing content

- **Section copy** — directly in the section's `.astro` file under `src/components/`.
- **Menu highlights**: `src/data/menu.ts`, a typed array with one entry per taco.
- **Catering packages**: the `packages` array in the frontmatter of `src/components/Catering.astro`. `pricing` is optional, and the line is hidden while it's unset.
- **Contact, address, hours, social links**: `src/data/business.ts`. Hero, Visit, Footer and the `Restaurant` JSON-LD all read from it. If you change `hours`, update `openingHours` too.
- **Pull quote**: `quote` in `src/components/About.astro`. The aside is hidden while it's `undefined`.
- **Social share card**: `public/og.png` (1200×630) and `public/apple-touch-icon.png`.
- **Theme tokens** — `src/styles/global.css` under `@theme` (colors, fonts).

Run `grep -rn "TODO(owner)" src/` to find content that's still waiting on the owners. Every placeholder has a graceful fallback, so nothing unfinished shows on the page.

## Deployment

The project deploys to **Cloudflare Workers** with static assets. Workers Builds runs `pnpm build`, then `pnpm exec wrangler deploy` on every push to `main`. One-time setup covers the zone, the Worker, secrets, Turnstile, the Resend domain and the custom domain, and is in [`docs/05-guides/cloudflare-setup.md`](./docs/05-guides/cloudflare-setup.md).

## Project structure

See [`docs/00-overview/README.md`](./docs/00-overview/README.md) for a doc-tree walkthrough, [`docs/01-architecture/README.md`](./docs/01-architecture/README.md) for system design, and [`API.md`](./API.md) for the inquiry endpoint reference.

```
src/
├── components/      # Section components (.astro)
├── data/          # business.ts (contact/hours/inquiry), menu.ts
├── layouts/         # BaseLayout.astro
├── pages/
│   ├── index.astro
│   ├── 404.astro
│   └── api/inquiry.ts
├── styles/global.css
└── env.d.ts
```

## Tech stack

Astro 7 · Tailwind v4 · Cloudflare Workers + Turnstile · Resend · Biome · Stylelint · TypeScript strict · pnpm 11. See [`docs/01-architecture/README.md`](./docs/01-architecture/README.md) for rationale.

---
Last updated: 2026-10-28
