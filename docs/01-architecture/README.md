# 01 — Architecture

How the site is put together and why.

## High-level shape

```
Browser  ──GET /──►  Astro static HTML (prerendered at build)
Browser  ──POST /api/inquiry──►  Vercel serverless function ──► Resend ──► email inbox
```

Everything except the inquiry endpoint is static. There is no database, no auth, no client-side router, no React/Vue/Svelte runtime.

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **Astro 6** (`output: "static"`) | Component-driven static site with islands available if ever needed; no JS shipped to the browser unless a component opts in. |
| Adapter | **`@astrojs/vercel`** | Lets us mix prerendered pages with a single serverless function (`/api/inquiry`) on the same deploy. |
| Styling | **Tailwind v4** via `@tailwindcss/vite`, with **CSS-first `@theme` tokens** in `src/styles/global.css` | v4's CSS-first configuration keeps the design tokens in the same file as the base layer. Sections that need bespoke layout use Astro's scoped `<style>` blocks and reference `var(--token)`. |
| Type-safety | **TypeScript strict** via `astro/tsconfigs/strict` | Catches form field name drift between `InquiryForm.astro` and `api/inquiry.ts`. |
| Linting | **Biome** (TS/JS/JSON/Astro) + **Stylelint** (CSS / `<style>`) | Biome's CSS parser doesn't yet understand Tailwind v4's `@theme`, so CSS is excluded from Biome and handled by stylelint. |
| Email | **Resend** | Lightweight transactional email; the rodarte site uses the same SDK. |
| Hosting | **Vercel** | Static HTML on the CDN, the inquiry function on Vercel's runtime. Free tier is plenty. |
| Package manager | **pnpm** | Standard across the user's projects. |

## Source layout

```
src/
├── components/        # One .astro file per page section, plus Header/Footer
├── data/menu.ts       # Typed array of menu highlights — single-file edit surface
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   ├── index.astro    # Composes section components in order
│   └── api/
│       └── inquiry.ts # Resend POST handler
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

1. `InquiryForm.astro` renders an HTML form.
2. The script in the same file intercepts submit, runs `checkValidity()` per field, and serializes the `FormData` to JSON.
3. It POSTs JSON to `/api/inquiry` with `Content-Type: application/json`.
4. `src/pages/api/inquiry.ts` parses, validates, runs the honeypot check, and calls `resend.emails.send`.
5. The form shows success or error UI based on `{ ok: true }` / `{ ok: false }`.

See [`API.md`](../../API.md) for the wire contract.

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
- Google Fonts (Playfair Display) preconnected and lazily loaded.
- Hero/menu visuals are CSS gradients in v1 — when real photos arrive, swap to Astro's `<Image />` component.
- No client-side framework, no hydration. The only JS that ships is the small inline script inside `InquiryForm.astro`.

---
Last updated: 2026-04-29
