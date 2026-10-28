# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project Overview

Landing page and catering-inquiry site for **Chuy's Tacos**, a family-owned taquería + catering business. Single-page Astro site (anchor sections, no client-side routing) with one serverless endpoint for inquiry-form submissions delivered via Resend.

The site is intentionally small and content-driven. Most edits are copy or asset swaps — search for `TODO` to find every placeholder (phone, address, hours, photos, founding year, package pricing, social URLs).

This project is **standalone** — it is not part of a monorepo and is intentionally decoupled from `catering-event-manager` (a separate Next.js + Go + Postgres backend on its own GitHub repo). The two share no code.

## Commands

```bash
pnpm install                # install deps
pnpm dev                    # http://localhost:4321
pnpm build                  # static output to dist/ + Vercel function bundle
pnpm preview                # preview production build
pnpm typecheck              # astro check
pnpm lint                   # Biome lint (TS/JS/Astro/JSON)
pnpm lint:fix               # Biome auto-fix
pnpm lint:styles            # Stylelint over .css / .astro
pnpm format                 # Biome format
```

## Architecture

- **Astro 7, static output** with `@astrojs/vercel` adapter — every page prerenders to HTML; only `src/pages/api/inquiry.ts` runs as a serverless function (`export const prerender = false`).
- **Tailwind v4** via `@tailwindcss/vite`. Theme tokens (warm earth palette, font stacks) live in `src/styles/global.css` under `@theme`. No external design-system package.
- **Component-scoped styles** — most components use Astro's `<style>` block instead of Tailwind utilities, since each section is one-of-a-kind. Tokens flow through CSS custom properties (`var(--color-terracotta)` etc.).
- **Form flow**: `InquiryForm.astro` posts JSON to `/api/inquiry`. The endpoint validates, runs a honeypot check, and calls `resend.emails.send`. No persistence.

## Directory map

```
chuys-tacos/
├── src/
│   ├── components/         # One .astro per page section (Header, Hero, …)
│   ├── data/menu.ts        # Menu-highlight items (typed array; easy to edit)
│   ├── layouts/BaseLayout.astro  # <html>, meta, fonts, slot
│   ├── pages/
│   │   ├── index.astro     # Composes section components in order
│   │   └── api/inquiry.ts  # POST handler — Resend
│   ├── styles/global.css   # Tailwind import + @theme tokens + base layer
│   └── env.d.ts            # ImportMetaEnv types
├── public/                 # Static assets — favicon, future hero/menu photos
├── docs/
│   ├── 00-overview/        # Quick start and project summary
│   ├── 01-architecture/    # System design + tech stack
│   └── 04-development/     # Setup, conventions, scripts
├── astro.config.mjs        # Vercel adapter, sitemap, Tailwind vite plugin
├── biome.json              # Lint/format — CSS handled by stylelint
├── stylelint.config.mjs
├── tsconfig.json           # Extends astro/tsconfigs/strict + path aliases
├── API.md                  # /api/inquiry reference
├── README.md
└── CLAUDE.md
```

## Conventions

- **TypeScript strict** via `astro/tsconfigs/strict`. Path aliases: `@components/*`, `@layouts/*`, `@data/*`, `@styles/*`, `@/*`.
- **Biome** handles JS/TS/JSON/Astro lint + format. CSS is excluded from Biome (Tailwind v4's `@theme` directive isn't recognized) and handled by stylelint.
- **No tests** in v1. Add Vitest/Playwright when content stabilizes.
- **Astro components** prefer `<style>` blocks over Tailwind utility soup for section-level layout, with `var(--token)` references pulling from `global.css`.
- **Placeholders are explicit** — every TODO is a comment in code, not a magic string. Grep `TODO` before shipping to a new domain.

## Environment

| Var | Purpose | Required for |
| --- | --- | --- |
| `RESEND_API_KEY` | Resend API key | `/api/inquiry` |
| `INQUIRY_TO_EMAIL` | Where inquiries are delivered | `/api/inquiry` |
| `FROM_EMAIL` | Sender address (must be on a Resend-verified domain) | `/api/inquiry` |

The dev server boots without these set — only the inquiry endpoint will 500 until they're filled in.

## Deployment

Deploys to Vercel via `@astrojs/vercel`. `pnpm build` produces both `dist/` (static) and `.vercel/output/` (function bundle for the inquiry route). Vercel project is provisioned interactively by the operator — not by Claude.

## Documentation

- **`README.md`** — install, env vars, scripts, editing
- **`API.md`** — inquiry endpoint reference
- **`docs/00-overview/`** — what's documented and where
- **`docs/01-architecture/`** — system design and tech stack rationale
- **`docs/04-development/`** — setup, scripts, conventions

## Project tracking

Tracked in the personal Obsidian vault at `/mnt/c/Users/jerod/vault/projects/chuys-tacos.md` (create when needed). Add a dated one-liner to its activity log when finishing meaningful work.

---
Last updated: 2026-04-29
