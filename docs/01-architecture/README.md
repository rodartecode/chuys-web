# 01 — Architecture

How the site is put together and why.

## High-level shape

```
Browser  ──GET /──►  Astro static HTML (prerendered at build)
Browser  ──POST /api/inquiry──►  Cloudflare Worker ──► Turnstile siteverify
                                                     └──► Resend ──► email inbox
```

Everything except the inquiry endpoint is static. There is no database, no auth, no client-side router, no React/Vue/Svelte runtime.

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **Astro 7** (static output) | Component-driven static site with islands available if ever needed; no JS shipped to the browser unless a component opts in. |
| Adapter | **`@astrojs/cloudflare`** | Prerendered pages ship as Worker static assets; `/api/inquiry` runs in the Worker. `run_worker_first: ["/api/*"]` keeps the asset layer from answering API requests. |
| Styling | **Tailwind v4** via `@tailwindcss/vite`, with **CSS-first `@theme` tokens** in `src/styles/global.css` | v4's CSS-first configuration keeps the design tokens in the same file as the base layer. Sections that need bespoke layout use Astro's scoped `<style>` blocks and reference `var(--token)`. |
| Type-safety | **TypeScript 6 strict** via `astro/tsconfigs/strict` (held below 7 until `@astrojs/check` supports it) | Catches form field name drift between `InquiryForm.astro` and `api/inquiry.ts`. |
| Linting | **Biome** (TS/JS/JSON/Astro) + **Stylelint** (CSS / `<style>`) | Biome's CSS parser doesn't yet understand Tailwind v4's `@theme`, so CSS is excluded from Biome and handled by stylelint. |
| Email | **Resend** via plain `fetch` | Lightweight transactional email; no SDK needed in the Worker. Sends from the verified subdomain `mail.chuystacos.com` so the apex's existing mailbox is untouched. |
| Bot protection | **Cloudflare Turnstile** + honeypot | Turnstile script is lazy-loaded on first form focus (it's several hundred KB). Honeypot still filters naive bots before a siteverify call is spent. |
| Hosting | **Cloudflare Workers** (static assets) | Free tier allows commercial use (Vercel Hobby doesn't), and it matches `paint-web`, so the Cloudflare/Resend/Turnstile setup and gotchas are already known. |
| Package manager | **pnpm 11** | Standard across the user's projects. Build scripts are allow-listed in `pnpm-workspace.yaml`. |

## Source layout

```
src/
├── components/        # One .astro file per page section, plus Header/Footer
├── data/
│   ├── business.ts    # Contact, address, hours, social, inquiry to/from, Turnstile site key
│   └── menu.ts        # Menu highlights + full menu (no prices) — single-file edit surface
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   ├── index.astro    # Composes section components in order
│   └── api/
│       └── inquiry.ts # Turnstile + Resend POST handler
├── styles/
│   └── global.css     # @import "tailwindcss" + @theme + @layer base
└── env.d.ts
```

## Component model

`src/pages/index.astro` is a flat composition:

```astro
<BaseLayout>
  <Header />
  <main id="main">
    <Hero />
    <MenuHighlights />
    <About />
    <Catering />
    <HoursLocation />
    <InquiryForm />
  </main>
  <Footer />
</BaseLayout>
```

Each section component owns its own markup and `<style>` block. There is no shared "Section" wrapper component — each section gets to look the way it wants. Theme tokens in `global.css` are the contract that keeps them visually coherent.

## Inquiry form flow

1. `InquiryForm.astro` renders an HTML form with an empty `.cf-turnstile` container.
2. On first `focusin`, the script loads Turnstile (`render=explicit`) and renders the widget, which adds a `cf-turnstile-response` input.
3. On submit, the script runs `checkValidity()` per field. If there's no token yet, it shows "Verifying…" and resubmits from the Turnstile callback.
4. It POSTs the `FormData` as JSON to `/api/inquiry`.
5. `src/pages/api/inquiry.ts` handles the request in this order: honeypot, validation, Turnstile siteverify, then Resend.
6. The form shows success, captcha or error UI based on the response, then resets the widget, because tokens are single-use.

See [`API.md`](../../API.md) for the wire contract.

## Menu data flow

The full menu comes from the owners' Square catalog, but only at dev time:

```
Square catalog ──square CLI (local, browser OAuth)──► pnpm menu:pull ──► docs/menu/square-catalog.csv (committed)
                                                                            │
src/data/menu.ts (fullMenu, hand-written copy) ◄── tests/unit/menu.test.ts ─┘  every CSV row ↔ one menu entry
```

- `scripts/menu-pull.mjs` keeps items that aren't archived and are sold in an active channel other than Point of Sale. It writes name, category and description only, never prices. Cash App, linked from the site, shows the prices.
- `fullMenu` copy is edited by hand: Square's descriptions, lightly tightened. The test only checks that the names line up. `squareName` covers a rename the owners haven't made in Square yet, and `squareVariants` folds Square's "Chuy's Style" and "Street Style" items into one entry.
- Dish photos take a parallel path: `pnpm menu:photos` (`scripts/menu-photos.mjs`) downloads the Square images listed in its `PHOTOS` map, resizes them to 1600 px JPEGs in `src/assets/menu/` (committed), and `<Image>` emits 320–960w webp srcsets at build. `dishPhotos` in `menu.ts` holds file names only, so the Playwright spec can still import `menu.ts` in plain Node; `MenuHighlights.astro` resolves them with `import.meta.glob`.
- The CLI can't run in Workers Builds, because it signs in through the browser only. So the build never talks to Square, and the CSV is the snapshot the build trusts.

## Decoupling from `catering-event-manager`

There is a separate backend project, `catering-event-manager` (Next.js + Go Fiber + Postgres + tRPC), that handles event lifecycle management for the same business. **It is intentionally not integrated into this repo.**

Reasons:

- Different audiences (public marketing vs. magic-link admin)
- Different deploy lifecycles
- Different security posture (public CDN vs. authenticated API + DB)
- No shared code in v1

If a future need calls for inquiries to land in the backend's database, the cleanest seam is a public POST endpoint on `catering-event-manager` that this site forwards to — keeping deploys and tooling independent.

## Performance posture

- Static prerender + `compressHTML` + `inlineStylesheets: "always"`.
- Playfair Display is self-hosted through the Astro Fonts API (`fonts` in `astro.config.mjs`, `<Font>` in `BaseLayout.astro`). The build downloads one variable woff2 covering 600–700, and the page preloads it with `font-display: swap` plus a metric-matched fallback face. The adapter's `_headers` caches `/_assets/*` as immutable. There are no requests to Google.
- The hero is still a CSS gradient. Menu photos use Astro's `<Image />` (compile-time optimization, lazy-loaded below the fold). The gallery's `sizes` string mirrors its grid CSS, so change both together.
- No client-side framework, no hydration. The only JS that ships is the small script inside `InquiryForm.astro`, plus Turnstile once someone interacts with the form.

---
Last updated: 2026-11-05
