# Handoff

> This file is rewritten in full at each /document-and-clear, and /catchup reads it first. It points to `BACKLOG.md` (agent work, `B-n`), `HUMAN.md` (your tasks) and the vault tracker (`C:/Users/jerod/vault/projects/chuys-tacos.md`) instead of restating them. If they disagree with this file, they win, and so does the code.

**As of:** 2026-11-05 · `47fe860` + this handoff commit · 108 unit + 13 e2e tests pass · pushed
**Checks:** `pnpm test`, typecheck, lint, lint:styles and build all pass on `4dda6ca`. Later commits changed docs only.
**Deploy:** `94ca03b` is live. Its Workers Build succeeded at 22:30 UTC and generated 38 webp variants on Linux. The live `#menu` has 8 gallery `<img>` tags with webp srcsets. One `/_assets/*.webp` fetch returned 200 `image/webp` with an `immutable` cache.
**Written on:** LAPTOP-ESEL9A3K

## Just shipped

- **B-8 dish photo gallery** (`4dda6ca`, deployed). BACKLOG Done (B-8) has the details.
  - 8 owner photos from Square sit between the full menu and "Pick your meat". The user OK'd using them.
  - The meat cards are text-only now, because Square has no photos of single meats.
  - `pnpm menu:photos` pulls and resizes the photos into `src/assets/menu/`. `sharp` is a new devDependency.
- **B-7 verified on production.** A labelled bogus-token inquiry got 400 `captcha`, and `wrangler tail` showed `invalid-input-response`, so the live Turnstile secret is valid. No email was sent.
- Docs (README, CLAUDE.md, overview, architecture, development guide), BACKLOG, HUMAN.md and the vault log (`6806aa3` in `rodartecode/vault`) are all updated.
- Earlier the same day: Square CLI adoption, menu sync and the phone fix (`6a8d33a`..`e23ee33`). See BACKLOG Done.

## Next steps (ordered)

1. **Drop the last `squareName`** (3 Crispy Barbacoa Taco Plate) once Square has the new name: run `pnpm menu:pull`, then remove it. Blocked on HUMAN.md: *Rename the barbacoa plate in Square*.
2. **BACKLOG B-1:** restore the catering packages. Blocked on HUMAN.md: *Collect owner content*. Run `pnpm test:e2e` afterwards.
3. **Hero photo** (`Hero.astro` TODO), only if the owners want one. It stays a gradient on purpose, because a photo becomes the LCP element. Measure mobile Lighthouse before and after. The candidate is `src/assets/menu/chuys-style-tacos.jpg`, or a new shot.

## In flight / blocked

- Nothing is uncommitted.
- **The live form hasn't delivered an email since the Turnstile change.** B-7 proved the secret works, but not that delivery does. Blocked on HUMAN.md: *Send a test inquiry and check both inboxes*.
- **The Google listing may still show the old hours and phone** until HUMAN.md: *Update the Google Business Profile* is done. Square has an active "Google My Business" channel, so check first whether Square already pushes them to Google.
- **Square CLI auth expires 2026-12-05.** After that, run `square auth login` before `pnpm menu:pull` or `pnpm menu:photos`.

## Open decisions

- None.

## Watch items

- **Mobile Lighthouse is 98 now, down from 99–100.** The shipped build ran 98 ×3 locally, with FCP and LCP at 1.1 s. That's well above the B-4 revisit trigger (below 90). A PSI run on production hasn't been done for B-8 yet. Run one through pagespeed.web.dev if you want a baseline row.
- **Dish gallery `sizes`.** `DISH_SIZES` in `MenuHighlights.astro` mirrors the `.dishes` grid CSS (15rem columns, 2 columns at ≤548px). Change both together, or phones fetch an image too big.
- **`dishPhotos` stays plain strings.** `tests/e2e/full-menu.spec.ts` imports `menu.ts` in Node, so no image imports or aliases go there. `MenuHighlights.astro` resolves the files with `import.meta.glob`.
- **Harrier needs `pnpm install`** (for the new `sharp` devDependency) **and `pnpm skills:square`**, plus `npm i -g @square/cli` and `square auth login` if those are missing.
- **Square writes go live.** Catalog `update`, `upsert` and `delete` have no `--force` or preview. Never run one without the user's go-ahead (see CLAUDE.md Gotchas).
- **Re-syncing the menu:** run `pnpm menu:pull`, check `git diff docs/menu/`, then update `fullMenu` until `tests/unit/menu.test.ts` passes.
- **Two machines.** Sessions run on LAPTOP-ESEL9A3K and Harrier, and memory doesn't sync between them.
- **Biome formats long lines and sorts imports.** Run `pnpm format`, then `pnpm lint:fix` if lint flags import order.
- **Drink option markup.** In `MenuHighlights.astro`, the options `.map` stays on one line on purpose. A line break renders a space before each comma.
- **Header breakpoint is 900px.** The other sections use 768px, and the dish gallery uses 548px.
- **Hardcoded URLs in e2e specs.** `order-online.spec.ts` (`EXPECTED_LINKS`) and `social.spec.ts` (`SOCIAL`) copy their URLs from `business.ts` by hand.
- **Live copy checks.** Served HTML encodes apostrophes as `&#39;`.
- **`pnpm test:e2e` needs Chrome installed** (`channel: "chrome"`).
- **Vitest doesn't read tsconfig paths.** A new alias goes in `vitest.config.ts` too.
- **TS 7 support.** TypeScript stays at 6.x until `@astrojs/check` supports TS 7.
- **Turnstile in preview.** `pnpm preview` is a production build, so its widget fails on `localhost`. Use the curl from `API.md`.
- **paint-web, outside this repo.** Its `clear-choice` Turnstile widget still lists `site-b.jerodarte.workers.dev`.
- **chezmoi drift (laptop).** `~/.claude/settings.json` differs from the dotfiles source.
