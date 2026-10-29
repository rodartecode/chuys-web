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

### B-4 · Find what delays first paint on mobile
**Why:** after B-2, nothing blocks render, and every request finishes by about 0.6 s. Even so, three Lighthouse mobile runs *observed* first paint at about 2.4 s, against 0.54 s on desktop. Simulated mobile FCP stays at 1.9 s and Speed Index at about 4.1 s, the only metrics not in the green. The gap predates B-2, since those numbers didn't change, so it isn't the fonts.
**Where:** first, rule out this machine. All three runs were local headless Chrome on LAPTOP-ESEL9A3K, and Lantern's simulated Speed Index draws on the observed filmstrip, so a slow local paint alone would hold SI at about 4.1 s. Run the mobile test on https://pagespeed.web.dev/ (the anonymous PSI API was over its daily quota on 2026-10-29), and compare `observedFirstContentfulPaint` with 2.4 s.
- **If PSI paints well under 2.4 s:** this is a local-emulation artifact. Move B-4 to **Not doing** and take mobile baselines from PSI from then on.
- **If PSI reproduces it:** record a mobile-emulated DevTools Performance trace on production, and see what sits between the end of the response and first paint. Suspects: the Hero's layered gradients and any filter or blur, then the inline CSS size, then `page.*.js`.

**Done when:** the cause is named here, and either fixed with a new mobile baseline row, or moved to **Not doing** with the reason.

### B-3 · Add tests
**Why:** CLAUDE.md says "No tests in v1". The inquiry endpoint is the only logic that can lose leads.
**Where:**
- Vitest for `src/pages/api/inquiry.ts`: validation, honeypot, a Turnstile failure, and the Resend payload including `cc`. Stub `fetch` and `cloudflare:workers`.
- One Playwright smoke test that the form renders and blocks an empty submit.
- Wire both into `package.json` scripts and the docs.
**Done when:** `pnpm test` runs green locally, and CLAUDE.md's Conventions no longer says "No tests".

## Not doing

- **Cloudflare Web Analytics beacon** (`static.cloudflareinsights.com/beacon.min.js`). Lighthouse flags its one-day cache and about 10 KiB of legacy JS. It's injected by Cloudflare rather than shipped by us, and it's small. Revisit only if Web Analytics gets turned off.

## Lighthouse baseline (production, Lighthouse 13.6.0)

| Date · commit | Run | Performance | Accessibility | Best Practices | SEO | FCP | LCP | Speed Index | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-10-29 · `2d98587` (after B-2) | Mobile | 96 | 100 | 100 | 100 | 1.9 s | 1.9 s | 4.1 s | 0 ms | 0 |
| 2026-10-29 · `2d98587` (after B-2) | Desktop | 100 | 100 | 100 | 100 | 0.3 s | 0.3 s | 0.5 s | 0 ms | 0 |
| 2026-10-29 · before B-2 | Mobile | 96 | 98 | 100 | 100 | 1.9 s | 1.9 s | 4.1 s | 0 ms | 0 |
| 2026-10-29 · before B-2 | Desktop | 99 | 98 | 100 | 100 | — | 0.7 s | — | 0 ms | 0.001 |

The mobile row is the same across three runs. Accessibility before B-2 was 98 because of the two items fixed in Done below. Mobile FCP and Speed Index didn't move with B-2; see B-4.

## Done

- 2026-10-29 · B-2: self-hosted Playfair Display through the Astro Fonts API, as one preloaded variable woff2 with an immutable cache (`2d98587`). Google Fonts requests and the render-blocking flag are gone, and headings measure identically. Desktop LCP went from 0.7 s to 0.3 s.

- 2026-10-29 · Footer column titles changed from `<h4>` to `<h3>` (Lighthouse `heading-order`)
- 2026-10-29 · Dropped the header logo link's `aria-label`, so its name matches the visible text (Lighthouse `label-content-name-mismatch`)
