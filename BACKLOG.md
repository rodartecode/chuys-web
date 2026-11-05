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

## Not doing

- **Cloudflare Web Analytics beacon** (`static.cloudflareinsights.com/beacon.min.js`). Lighthouse flags its one-day cache and about 10 KiB of legacy JS. It's injected by Cloudflare rather than shipped by us, and it's small. Revisit only if Web Analytics gets turned off.

### B-4 · Find what delays first paint on mobile · parked 2026-11-04
**Why:** on mobile, Lighthouse observes the first paint at about 2.35 s, against about 0.55 s on desktop. Simulated FCP is 1.6–1.9 s and Speed Index about 3.9–4.1 s, the only metrics not in the green. Every request finishes and the main thread goes idle by about 0.45 s.

**Ruled out (2026-11-04):**
- **This machine.** PSI reproduces it: observed FP, FCP and first visual change are all 2,350 ms, and observed load is 340 ms ([report](https://pagespeed.web.dev/analysis/https-chuystacos-com/1hvgyz54y9?form_factor=mobile)). Local Lighthouse 13.6.0 is a faithful reproduction.
- **Fonts and real work.** The trace shows the renderer idle from load until about 1.24 s, when the first `BeginMainThreadFrame` (and `pagereveal`) arrives. The next frame comes at about 2.24 s and is presented at 2.38 s. Rendering is held back, not slowed down.
- **The Cloudflare Web Analytics beacon.** Blocking it leaves the observed paint at about 2.4 s. It does add about 0.3 s to the *simulated* FCP: 1.6 s without it, 1.9 s with it.
- **Emulation settings that don't matter:** the mobile user agent, DPR 1.75 (DPR 1 is just as slow), and the full-page screenshot.
- **Not every page.** `https://example.com/` under the same mobile config paints at about 0.2 s.

**What it takes:** Lighthouse mobile emulation *and* a narrow viewport.
- The mobile preset at 1350×940 paints at 0.63 s.
- The desktop preset at 412×823 paints at 0.59 s.
- Playwright with the same metrics (412×823, DPR 1.75, `isMobile`) paints at about 0.45 s on production.
- It's intermittent locally: two `pnpm preview` runs painted at 0.29 s and 2.34 s.

**Next suspects, if this gets picked up again:** the narrow-viewport-only CSS (the `<details>` mobile nav under 900px, the sticky header's `backdrop-filter`), then the font preload (Chrome's render-blocking-fonts behavior). Each needs about three Lighthouse runs per variant against an edited `dist/` build, because a single run can be a lucky one.

**Parked because:** the cause isn't isolated, and the delay appears only under Lighthouse's mobile emulation. Playwright with the same phone metrics paints at about 0.45 s, and mobile Performance is already 96–97. **Revisit** if CrUX field data shows a slow mobile FCP for chuystacos.com (PSI showed "No Data" on 2026-11-04), or if a change pushes mobile Performance below 90.

## Lighthouse baseline (production, Lighthouse 13.6.0)

| Date · commit | Run | Performance | Accessibility | Best Practices | SEO | FCP | LCP | Speed Index | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-11-04 · `d3d3e45` (after B-6), PSI | Mobile | 100 | 100 | 100 | 100 | 1.5 s | 1.5 s | 1.5 s | 0 ms | 0.001 |
| 2026-11-04 · `92d2ace` (after B-5), PSI | Mobile | 97 | 100 | 100 | 100 | 1.6 s | 1.6 s | 3.9 s | 0 ms | 0 |
| 2026-10-29 · `2d98587` (after B-2) | Mobile | 96 | 100 | 100 | 100 | 1.9 s | 1.9 s | 4.1 s | 0 ms | 0 |
| 2026-10-29 · `2d98587` (after B-2) | Desktop | 100 | 100 | 100 | 100 | 0.3 s | 0.3 s | 0.5 s | 0 ms | 0 |
| 2026-10-29 · before B-2 | Mobile | 96 | 98 | 100 | 100 | 1.9 s | 1.9 s | 4.1 s | 0 ms | 0 |
| 2026-10-29 · before B-2 | Desktop | 99 | 98 | 100 | 100 | — | 0.7 s | — | 0 ms | 0.001 |

The B-6 row is a single PSI run. Its Speed Index of 1.5 s means the intermittent B-4 paint delay didn't appear in that run, so expect 3.7–3.9 s on other runs. Its CLS of 0.001 is new, and too small to chase. The B-5 row is PageSpeed Insights (Lighthouse 13.6.0); its simulated FCP is 0.3 s lower than local runs of the same build (1.9 s). Local runs with the Cloudflare beacon blocked also give 1.6 s; why PSI matches that with the beacon loaded is unknown. The 2026-10-29 mobile row is the same across three local runs. Accessibility before B-2 was 98 because of the two items fixed in Done below. Mobile FCP and Speed Index didn't move with B-2; see B-4.

## Done

- 2026-11-05 · Square CLI adopted, no B-n: `pnpm menu:pull` (`scripts/menu-pull.mjs`) regenerates `docs/menu/square-catalog.csv` (renamed from the dated file) from the live catalog, read-only. Its channel rule matched the export's visibility column on all 63 items, and it reproduced the old 44-row CSV byte for byte. The catalog grew to 54 items: the 10 Chuy's Style / Street Style items fold into their base entries through `squareVariants`, the Crispy Barbacoa Taco rename landed in Square, and Surf & Turf Fries got a description. `pnpm skills:square` installs 6 of the CLI's ~107 agent skills (gitignored). `.claude/settings.json` allows Square reads and asks before writes. The phone changed to (559) 385-6843 to match Square. Unit tests: 91.
- 2026-11-04 · B-7: `verifyTurnstile` in `src/pages/api/inquiry.ts` now logs why siteverify failed, without the token or secret. `missing-input-secret`/`invalid-input-secret` go to `console.error`, so a bad `TURNSTILE_SECRET_KEY` shows up in `wrangler tail` instead of passing for a bot rejection. Other codes go to `console.warn`, and an HTTP error logs its status. The client still gets 400 `captcha`. Three new unit assertions cover it (80 tests in all) (`584a3a8`).
- 2026-11-04 · B-6: the full menu from the trimmed Square catalog. `fullMenu` in `src/data/menu.ts` holds all 44 items in 5 categories (the 20 drinks folded into 4 lines), with no prices, rendered under the signature cards. The menu note points to Cash App. The Barbacoa card now says cachete, lengua, and labio, as the user confirmed on 2026-11-04. Birria vs Quesabirria was settled later the same day: Birria and Barbacoa are meats, and the Quesabirria and Crispy Barbacoa Taco are dishes, so the cards became "Pick your meat" (`f033551`). `tests/unit/menu.test.ts` maps every CSV row to one exact entry and back. `tests/e2e/full-menu.spec.ts` checks every item and drink option renders, that there are no prices, and that nothing overflows at 375px. Local preview Lighthouse: mobile 99/100/99 Performance over 3 runs, desktop 100, and a11y, Best Practices and SEO at 100 (`d36ab8a`). PSI mobile after deploy: 100/100/100/100 ([report](https://pagespeed.web.dev/analysis/https-chuystacos-com/vlscjsk9py?form_factor=mobile)).
- 2026-11-04 · B-5: an Order Online link to `business.orderUrl` (Cash App) in the header bar and mobile menu, the Hero, the menu footer note and the footer, each opening in a new tab, plus an `OrderAction` in the Restaurant JSON-LD. The header now collapses to the hamburger at 900px, since two pills need about 880px. `tests/e2e/order-online.spec.ts` checks all five links, the mobile menu and the JSON-LD, and fails when the URL is misspelled. Local Lighthouse Accessibility, Best Practices and SEO stay at 100 on mobile and desktop (`cd16587`).
- 2026-10-29 · B-3: Vitest covers `/api/inquiry` with 30 tests: validation, the honeypot, Turnstile failures and the Resend payload including `cc`. A Playwright smoke test checks that the form renders and blocks an empty submit. `pnpm test` runs both, and lint and typecheck now cover `tests/` (`3096364`).
- 2026-10-29 · B-2: self-hosted Playfair Display through the Astro Fonts API, as one preloaded variable woff2 with an immutable cache (`2d98587`). Google Fonts requests and the render-blocking flag are gone, and headings measure identically. Desktop LCP went from 0.7 s to 0.3 s.

- 2026-10-29 · Footer column titles changed from `<h4>` to `<h3>` (Lighthouse `heading-order`)
- 2026-10-29 · Dropped the header logo link's `aria-label`, so its name matches the visible text (Lighthouse `label-content-name-mismatch`)
