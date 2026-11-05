# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project Overview

Landing page and catering-inquiry site for **Chuy's Tacos**, a family-owned taquería + catering business. Single-page Astro site (anchor sections, no client-side routing) with one server endpoint for inquiry-form submissions, bot-checked with Cloudflare Turnstile and delivered via Resend. Hosted on Cloudflare Workers (static assets + one Worker route).

The site is intentionally small and content-driven. Most edits are copy or asset swaps — search for `TODO(owner)` to find content still waiting on the owners (story, pricing, hero photo, PDF menu). Contact details, hours, and inquiry addresses live in `src/data/business.ts`.

This project is **standalone** — it is not part of a monorepo and is intentionally decoupled from `catering-event-manager` (a separate Next.js + Go + Postgres backend on its own GitHub repo). The two share no code.

## Commands

```bash
pnpm install                # install deps
pnpm dev                    # http://localhost:4321
pnpm build                  # dist/client (static assets) + dist/server (Worker)
pnpm preview                # build + wrangler dev on :8787 (real Workers runtime)
pnpm cf:deploy              # build + wrangler deploy (Workers Builds does this on push)
pnpm typecheck              # astro check (src/ and tests/)
pnpm test                   # test:unit, then test:e2e
pnpm test:unit              # Vitest: /api/inquiry (fetch + cloudflare:workers stubbed), fullMenu vs Square CSV
pnpm test:e2e               # Playwright: form, full menu, Order Online, social (starts pnpm dev, local Chrome)
pnpm lint                   # Biome lint (TS/JS/Astro/JSON)
pnpm lint:fix               # Biome auto-fix
pnpm lint:styles            # Stylelint over .css / .astro
pnpm format                 # Biome format
pnpm menu:pull              # docs/menu/square-catalog.csv from live Square (needs `square auth login`)
pnpm menu:photos            # dish gallery photos from live Square → src/assets/menu/ (resized, committed)
pnpm skills:square          # install the 6 Square CLI agent skills (gitignored; once per machine)
```

## Architecture

- **Astro 7, static output** with `@astrojs/cloudflare` adapter — every page prerenders to HTML; only `src/pages/api/inquiry.ts` runs in the Worker (`export const prerender = false`). `wrangler.jsonc` sets `run_worker_first: ["/api/*"]` so the asset layer never answers API requests itself.
- **Tailwind v4** via `@tailwindcss/vite`. Theme tokens (warm earth palette, font stacks) live in `src/styles/global.css` under `@theme`. No external design-system package.
- **Component-scoped styles** — most components use Astro's `<style>` block instead of Tailwind utilities, since each section is one-of-a-kind. Tokens flow through CSS custom properties (`var(--color-terracotta)` etc.).
- **Form flow**: `InquiryForm.astro` posts JSON to `/api/inquiry`. A Turnstile widget lazy-loads on first focus and its token rides along in the payload. The endpoint runs honeypot → validation → Turnstile siteverify → Resend (plain `fetch`, no SDK). No persistence.
- **Menu data**: `pnpm menu:pull` (local Square CLI) writes `docs/menu/square-catalog.csv`, with no prices. `fullMenu` in `menu.ts` is hand-written copy, and `tests/unit/menu.test.ts` checks every CSV row against one entry. `pnpm menu:photos` pulls the dish gallery photos (`dishPhotos`, file names only so tests can load `menu.ts` in Node) into `src/assets/menu/`, and `MenuHighlights.astro` resolves them with `import.meta.glob` for `<Image>` (webp srcsets at build). The build never calls Square. Ordering links out to Cash App (`business.orderUrl`).

## Directory map

```
chuys-tacos/
├── src/
│   ├── components/         # One .astro per page section (Header, Hero, …)
│   ├── data/business.ts    # Contact, address, hours, social, inquiry to/from, Turnstile site key
│   ├── assets/menu/        # Dish photos from Square (pnpm menu:photos), optimized by <Image> at build
│   ├── data/menu.ts        # menuHighlights (meat cards), fullMenu (checked against docs/menu CSV), dishPhotos
│   ├── layouts/BaseLayout.astro  # <html>, meta, fonts, slot
│   ├── pages/
│   │   ├── index.astro     # Composes section components in order
│   │   └── api/inquiry.ts  # POST handler — Turnstile + Resend
│   ├── styles/global.css   # Tailwind import + @theme tokens + base layer
│   └── env.d.ts            # Cloudflare.Env secret types
├── tests/
│   ├── unit/               # Vitest — /api/inquiry, fullMenu vs the Square CSV
│   ├── e2e/                # Playwright — form, full menu, Order Online, social
│   └── stubs/              # cloudflare:workers stand-in for Vitest
├── scripts/                # menu-pull.mjs, menu-photos.mjs, skills-square.mjs (local Square CLI tooling)
├── public/                 # Static assets — favicon, OG image, robots.txt
├── docs/
│   ├── 00-overview/        # Quick start and project summary
│   ├── 01-architecture/    # System design + tech stack + menu data flow
│   ├── 04-development/     # Setup, conventions, scripts, Square CLI
│   ├── 05-guides/          # Cloudflare / Resend / Turnstile setup runbook
│   └── menu/square-catalog.csv  # Trimmed Square catalog (no prices); raw exports gitignored
├── astro.config.mjs        # Cloudflare adapter, sitemap, Tailwind vite plugin
├── wrangler.jsonc          # Worker name, compat flags, assets + run_worker_first
├── biome.json              # Lint/format — CSS handled by stylelint
├── stylelint.config.mjs
├── vitest.config.ts        # Aliases (incl. cloudflare:workers stub), tests/unit only
├── playwright.config.ts    # tests/e2e, local Chrome, pnpm dev as webServer
├── tsconfig.json           # Extends astro/tsconfigs/strict + path aliases
├── API.md                  # /api/inquiry reference
├── BACKLOG.md              # Agent-doable code work (B-n IDs)
├── HUMAN.md                # Operator/owner tasks Claude can't do
├── HANDOFF.md              # Session handoff (/document-and-clear, /catchup)
├── README.md
└── CLAUDE.md
```

## Conventions

- **TypeScript strict** via `astro/tsconfigs/strict`. Path aliases: `@components/*`, `@layouts/*`, `@data/*`, `@styles/*`, `@/*`.
- **Biome** handles JS/TS/JSON/Astro lint + format. CSS is excluded from Biome (Tailwind v4's `@theme` directive isn't recognized) and handled by stylelint.
- **Tests**: Vitest in `tests/unit/` runs the inquiry endpoint in Node, with `cloudflare:workers` aliased to `tests/stubs/` and `fetch` stubbed per test, and checks `fullMenu` against the Square CSV. Four Playwright specs in `tests/e2e/` cover the form, the full menu, the Order Online links and the social links. Vitest doesn't read tsconfig paths, so new aliases go in `vitest.config.ts` too. See `docs/04-development/` for details.
- **Astro components** prefer `<style>` blocks over Tailwind utility soup for section-level layout, with `var(--token)` references pulling from `global.css`.
- **Placeholders are explicit** — owner content still pending is marked `TODO(owner)` in a code comment and renders a graceful fallback (hidden or reworded), never visible "TODO"/"TBD" text.

## Environment

Worker secrets, read with `import { env } from "cloudflare:workers"` (typed by `Cloudflare.Env` in `src/env.d.ts`). `import.meta.env` does **not** carry secrets at runtime on Workers.

| Secret | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key (sending only) |
| `TURNSTILE_SECRET_KEY` | Turnstile siteverify secret. If unset, bot checks are skipped with a warning |

Locally: copy `.dev.vars.example` → `.dev.vars` (gitignored; ships Cloudflare's always-pass Turnstile test secret). Production: `pnpm exec wrangler secret put <NAME>` from an **interactive** terminal (without a TTY wrangler can upload an empty value and still report success). Non-secret config (inquiry to/from, Turnstile site key) lives in `src/data/business.ts`.

## Deployment

Cloudflare Workers with static assets via `@astrojs/cloudflare`; Workers Builds deploys `main` on push. The Worker, secrets, Turnstile widget, Resend domain, and custom domain are provisioned by the operator, not by Claude. See `docs/05-guides/cloudflare-setup.md`.

Gotchas (learned on `paint-web`, which uses the same setup):

- `session: false` in `astro.config.mjs`, or the adapter demands a SESSION KV namespace at deploy.
- `assets.run_worker_first: ["/api/*"]`. Browser navigational POSTs otherwise get a blank 405 from the asset layer. Add `-H "Sec-Fetch-Mode: navigate"` to curl tests.
- The Workers Builds image defaults to pnpm 10. Set the build variable `PNPM_VERSION` to match `packageManager`.
- pnpm 11 enforces a minimum release age, so a package published within the last day fails install. Pin the previous patch instead of adding `minimumReleaseAgeExclude`.
- `@cloudflare/workers-types` adds a global `Element.append` overload that shadows the DOM one in client scripts. Use `appendChild`.
- TypeScript is held at 6.x until `@astrojs/check` supports TS 7.
- **Square CLI writes go live.** It talks to the owners' production Square account; there's no sandbox. `catalog … update`/`upsert`/`delete` change the POS and the Cash App order page immediately, with no `--force` or preview, so never run one without the user's go-ahead (`.claude/settings.json` makes them ask). Browser OAuth only, so it's local-only, never in CI. See `docs/04-development/` → Square CLI.

## Documentation

- **`README.md`** — install, env vars, scripts, editing
- **`API.md`** — inquiry endpoint reference
- **`HUMAN.md`** — checklist of operator and owner tasks that Claude can't do (dashboards, secrets, DNS, owner content)
- **`BACKLOG.md`** — code work an agent can pick up, with stable `B-n` IDs that the handoff points at; includes the Lighthouse baseline
- **`docs/00-overview/`** — what's documented and where
- **`docs/01-architecture/`** — system design and tech stack rationale
- **`docs/04-development/`** — setup, scripts, conventions
- **`docs/05-guides/`** — Cloudflare / Resend / Turnstile / DNS setup runbook

## Project tracking

Tracked in the personal Obsidian vault at `C:/Users/jerod/vault/projects/chuys-tacos.md`. Add a dated one-liner to its activity log when finishing meaningful work.

---
Last updated: 2026-11-05
