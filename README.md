# Chuy's Tacos

Single-page landing site and catering-inquiry form for **Chuy's Tacos**, a family-owned taquería and catering business. Built with Astro, deployed to Vercel, with inquiries delivered via Resend.

## Highlights

- Single-page anchor layout: Hero, Menu Highlights, About, Catering, Hours/Location, Inquiry Form
- Resend-backed inquiry form with client-side validation and honeypot
- Warm earth-tone theme via Tailwind v4 `@theme` tokens
- Static HTML output + a single serverless function for the inquiry endpoint

## Quick start

```bash
pnpm install
cp .env.example .env   # fill in Resend values to enable the inquiry form
pnpm dev               # http://localhost:4321
```

The dev server runs without environment variables set — only `/api/inquiry` will return 500 until they're populated.

## Environment variables

| Var | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | Resend API key — see [resend.com/api-keys](https://resend.com/api-keys) |
| `INQUIRY_TO_EMAIL` | yes | Inbox that receives inquiry submissions |
| `FROM_EMAIL` | yes | Sender address — must live on a domain you've verified in Resend |

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Run the Astro dev server |
| `pnpm build` | Build static site to `dist/` plus the Vercel function bundle |
| `pnpm preview` | Preview the production build locally |
| `pnpm typecheck` | `astro check` — type-checks `.astro` and `.ts` |
| `pnpm lint` | Biome lint |
| `pnpm lint:fix` | Biome auto-fix |
| `pnpm lint:styles` | Stylelint over `.css` and `.astro` `<style>` blocks |
| `pnpm format` | Biome format the repo |

## Editing content

- **Section copy** — directly in the section's `.astro` file under `src/components/`.
- **Menu highlights** — `src/data/menu.ts` (typed array, six entries).
- **Catering packages** — `src/components/Catering.astro`, `packages` array in the frontmatter.
- **Hours, address, phone** — `src/components/HoursLocation.astro` and `src/components/Footer.astro`.
- **Theme tokens** — `src/styles/global.css` under `@theme` (colors, fonts).

Search for `TODO` in the repo to find every placeholder.

## Deployment

The project deploys to **Vercel**. `pnpm build` generates both `dist/` (static) and `.vercel/output/` (the serverless function bundle for `/api/inquiry`). Configure the Vercel project to run `pnpm install` and `pnpm build`, and set the three Resend env vars in project settings.

## Project structure

See [`docs/00-overview/README.md`](./docs/00-overview/README.md) for a doc-tree walkthrough, [`docs/01-architecture/README.md`](./docs/01-architecture/README.md) for system design, and [`API.md`](./API.md) for the inquiry endpoint reference.

```
src/
├── components/      # Section components (.astro)
├── data/menu.ts     # Menu highlights
├── layouts/         # BaseLayout.astro
├── pages/
│   ├── index.astro
│   └── api/inquiry.ts
├── styles/global.css
└── env.d.ts
```

## Tech stack

Astro 6 · Tailwind v4 · MDX · Resend · Biome · Stylelint · TypeScript strict · Vercel adapter · pnpm. See [`docs/01-architecture/README.md`](./docs/01-architecture/README.md) for rationale.

---
Last updated: 2026-04-29
