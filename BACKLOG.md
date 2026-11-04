# Backlog

> Code work an agent can pick up, with stable IDs (`B-n`) so `HANDOFF.md` can point at them.
> Your own tasks (dashboards, DNS, accounts) live in [`HUMAN.md`](HUMAN.md). Owner content stays as
> `TODO(owner)` comments in the code. The TypeScript 7 watch lives in the vault tracker.
> When an item ships, move it to **Done** with the date and commit.

**Updated:** 2026-11-04

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

### B-6 · Expand the menu from the Square catalog
**Why:** the site shows 7 signature tacos and tells visitors to "get in touch" for the full menu. The owners' Square catalog has 44 active items in 5 categories: Main 7, Specialty 8, Combo 7, Sides 2 and Drinks 20.
**Where:**
- **Source:** `docs/menu/square-catalog-2026-11-04.csv`, with the columns name, category and description.
  - It is trimmed from the raw Square export, which is gitignored because this repo is public. The trim kept rows where `Archived = N` and `Square Online Item Visibility ≠ unavailable`. Five active items have a blank visibility value, so they're kept.
  - Prices and Square IDs are dropped on purpose.
  - To re-sync, re-export from Square and apply the same filter.
- **Data:** in `src/data/menu.ts`, add a typed `fullMenu` grouped by category. Write it by hand as static data, and don't parse the CSV at build time. Leave `menuHighlights` as it is, since it's the owners' own copy.
- **Rendering:** put it in `MenuHighlights.astro` or in a new section below it.
  - Fold the 20 drinks into a few grouped lines (Jarritos, canned sodas, bottled drinks, agua fresca) rather than 20 rows.
  - Only 13 items have descriptions. Show the others by name alone.
  - **Show no prices** (decided 2026-11-04). Cash App is the source of truth for prices, so link each category, or the whole section, to `business.orderUrl`.
  - Replace the "Want the full menu? Get in touch" line, and keep its `TODO(owner)` comment about a PDF menu.

**Copy conflicts to raise with the owners, not to settle in code:**
- The Barbacoa highlight says "cabeza, cachete, and labio", but Square says "cachete, lengua, and labio".
- The highlights list "Birria", but Square sells "Quesabirria".

**Done when:**
- Every item in the CSV appears under its category, with no prices.
- An e2e check covers the full menu.
- Mobile Lighthouse holds the baseline. Take the numbers from PSI if B-4 rules out local runs.
- The Barbacoa wording is confirmed with the owners.

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

- 2026-11-04 · B-5: an Order Online link to `business.orderUrl` (Cash App) in the header bar and mobile menu, the Hero, the menu footer note and the footer, each opening in a new tab, plus an `OrderAction` in the Restaurant JSON-LD. The header now collapses to the hamburger at 900px, since two pills need about 880px. `tests/e2e/order-online.spec.ts` checks all five links, the mobile menu and the JSON-LD, and fails when the URL is misspelled. Local Lighthouse Accessibility, Best Practices and SEO stay at 100 on mobile and desktop (`cd16587`).
- 2026-10-29 · B-3: Vitest covers `/api/inquiry` with 30 tests: validation, the honeypot, Turnstile failures and the Resend payload including `cc`. A Playwright smoke test checks that the form renders and blocks an empty submit. `pnpm test` runs both, and lint and typecheck now cover `tests/` (`3096364`).
- 2026-10-29 · B-2: self-hosted Playfair Display through the Astro Fonts API, as one preloaded variable woff2 with an immutable cache (`2d98587`). Google Fonts requests and the render-blocking flag are gone, and headings measure identically. Desktop LCP went from 0.7 s to 0.3 s.

- 2026-10-29 · Footer column titles changed from `<h4>` to `<h3>` (Lighthouse `heading-order`)
- 2026-10-29 · Dropped the header logo link's `aria-label`, so its name matches the visible text (Lighthouse `label-content-name-mismatch`)
