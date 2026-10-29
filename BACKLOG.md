# Backlog

> Code work an agent can pick up, with stable IDs (`B-n`) so `HANDOFF.md` can point at them.
> Your own tasks (dashboards, DNS, accounts) live in [`HUMAN.md`](HUMAN.md). Owner content stays as
> `TODO(owner)` comments in the code. The TypeScript 7 watch lives in the vault tracker.
> When an item ships, move it to **Done** with the date and commit.

**Updated:** 2026-10-29

## Open

### B-1 · Restore the catering packages · blocked on owner content
**Why:** the package cards were hidden on 2026-10-29 while the owners finalize names, descriptions and pricing. For now the section is general and points to the form.
**Where:** `src/components/Catering.astro`. Update the `packages` array, add `pricing`, then set `showPackages = true`. The `.grid`/`.card` styles are still in place.
**Done when:** the cards render with the owners' final copy, and "Request this package →" links to `#contact`.

### B-2 · Self-host Playfair Display
**Why:** the Google Fonts stylesheet is the only render-blocking request. Lighthouse (2026-10-29) estimated it at about 950 ms on mobile and 340 ms on desktop. Mobile FCP is 1.9 s and Speed Index is 4.1 s, the only metrics not in the green.
**Where:** `src/layouts/BaseLayout.astro`, which has the `fonts.googleapis.com` preconnects and the stylesheet link. Serve the 600/700 weights from the site itself, through Astro's fonts support or `@fontsource/playfair-display`, preloaded with `font-display: swap`. Drop both Google preconnects.
**Done when:** no requests go to `fonts.googleapis.com` or `fonts.gstatic.com`, Lighthouse no longer flags render-blocking requests, and the headings look the same.

### B-3 · Add tests
**Why:** CLAUDE.md says "No tests in v1". The inquiry endpoint is the only logic that can lose leads.
**Where:**
- Vitest for `src/pages/api/inquiry.ts`: validation, honeypot, a Turnstile failure, and the Resend payload including `cc`. Stub `fetch` and `cloudflare:workers`.
- One Playwright smoke test that the form renders and blocks an empty submit.
- Wire both into `package.json` scripts and the docs.
**Done when:** `pnpm test` runs green locally, and CLAUDE.md's Conventions no longer says "No tests".

## Not doing

- **Cloudflare Web Analytics beacon** (`static.cloudflareinsights.com/beacon.min.js`). Lighthouse flags its one-day cache and about 10 KiB of legacy JS. It's injected by Cloudflare rather than shipped by us, and it's small. Revisit only if Web Analytics gets turned off.

## Lighthouse baseline (2026-10-29, production, Lighthouse 13.6.0)

| Run | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Mobile | 96 | 98 | 100 | 100 | 1.9 s | 0 ms | 0 |
| Desktop | 99 | 98 | 100 | 100 | 0.7 s | 0 ms | 0.001 |

Accessibility was 98 because of the two items fixed in Done below.

## Done

- 2026-10-29 · Footer column titles changed from `<h4>` to `<h3>` (Lighthouse `heading-order`)
- 2026-10-29 · Dropped the header logo link's `aria-label`, so its name matches the visible text (Lighthouse `label-content-name-mismatch`)
