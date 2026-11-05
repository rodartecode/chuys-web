# Handoff

> This session handoff is rewritten in full at each /document-and-clear, and /catchup reads it first. It points at `BACKLOG.md` (agent work, `B-n`), `HUMAN.md` (your tasks) and the vault tracker (`C:/Users/jerod/vault/projects/chuys-tacos.md`) rather than restating them. If they disagree, those files and the code win.

**As of:** 2026-11-04 · `58887ae` + this handoff commit · `pnpm test` green (80 unit + 12 e2e); typecheck, lint, lint:styles and build green · `58887ae` deployed to production; a curl of the live page found the new shrimp copy, the reordered menu and 6 Cash App order links · pushed
**Written on:** Harrier

## Just shipped

- **Spicy Shrimp Taco gets the Chuy's-style toppings (`170f8bb`, deployed).** The user confirmed it comes with all of them, so `src/data/menu.ts` now ends its description with "plus avocado, sour cream, and queso fresco". That settles the last session's open decision.
- **BACKLOG B-7 (`584a3a8`, deployed).** It was filed and done in this session; see BACKLOG Done for what it logs. API.md documents the log lines.
- **The full menu now comes before the meat cards (`58887ae`, deployed; a curl of the live page shows h2 "The full menu", then the categories, then h3 "Pick your meat", plus 6 order links).** In `MenuHighlights.astro`, the section's h2 is now "The full menu", and "Pick your meat" is an h3 that sits with its intro above the cards. Heading levels went down one step (the categories are h3, the card names h4) so heading-order doesn't skip a level. The card names set the display font explicitly, since `global.css` only applies it to h1–h3.
- **Winter hours run until further notice.** The user has planned no end date. Only the HUMAN.md wording changed; `business.ts` stays as it is.

## Next steps (ordered)

1. **Drop `squareName` once Square is renamed.** Update `docs/menu/square-catalog-2026-11-04.csv` to the Crispy names and remove `squareName` from both items. The user deferred this to 2026-11-05. Blocked on HUMAN.md: *Rename the barbacoa dishes in Square*.
2. **BACKLOG B-1:** restore the catering packages. The user deferred this to 2026-11-05. Blocked on HUMAN.md: *Collect owner content*. Run `pnpm test:e2e` afterwards, because the page changes.
3. **Optional:** check B-7 on production. Run `pnpm exec wrangler tail` and POST a bogus token with the curl from `API.md`. A `Turnstile check failed` warning with `invalid-input-response` should appear.

## In flight / blocked

- Nothing is uncommitted.
- **The live form is unverified since the Turnstile change.** Blocked on HUMAN.md: *Send a test inquiry and check both inboxes*. If it fails, B-7's logs in `wrangler tail` now show whether the secret is at fault.
- **The Google listing shows the old hours** until HUMAN.md: *Update the Google Business Profile* is done.
- **Regular hours:** nothing is scheduled. Wait for HUMAN.md: *Tell the agent when the winter hours end*.

## Open decisions

- None.

## Watch items

- **Two machines.** Sessions run on LAPTOP-ESEL9A3K and Harrier. Memory files don't sync between them, so the laptop's `ts7-support-watch` note is missing on Harrier. A fresh checkout needs `pnpm install` before running any check.
- **Biome formats long test lines.** Run `pnpm format` before `pnpm lint` after adding tests, or lint fails on line wrapping alone.
- **Menu re-sync.** `tests/unit/menu.test.ts` pins `CSV_PATH` to `square-catalog-2026-11-04.csv` and matches catalog rows on `squareName ?? name`. It checks names only, not descriptions. A new Square export has to overwrite that file or update `CSV_PATH`.
- **Drink option markup.** In `MenuHighlights.astro`, the options `.map` stays on one line on purpose, because a line break renders a space before each comma.
- **Header breakpoint is 900px.** The other sections still use 768px.
- **Hardcoded URLs in e2e specs.** `order-online.spec.ts` (`EXPECTED_LINKS`, 6 Cash App links) and `social.spec.ts` (`SOCIAL`) copy their URLs from `business.ts` by hand, because Playwright can't import a module that reads `import.meta.env`. Change both when the URLs change, and change `EXPECTED_LINKS` when an order link is added or removed.
- **Live copy checks.** The served HTML encodes apostrophes as `&#39;`, so a curl grep for copy like "Chuy's" has to search for `Chuy&#39;s`. To count order links, grep `href="https://cash.app/$chuystacosytaquizas"` in single quotes with `-F`. Counting the bare URL also picks up the JSON-LD `urlTemplate`.
- **Mobile Lighthouse.** Local runs are trustworthy (see B-4), but the paint delay comes and goes. The PSI API usually returns 429.
- **`pnpm test:e2e` needs Chrome installed** (`channel: "chrome"`). See `docs/04-development/`.
- **Vitest doesn't read tsconfig paths.** A new alias goes in `vitest.config.ts` too.
- **TS 7 support.** TypeScript is held at 6.x until `@astrojs/check` supports TS 7 (see CLAUDE.md).
- **Turnstile in preview.** `pnpm preview` is a production build, so its widget fails on `localhost`. Use the curl from `API.md`.
- **paint-web, outside this repo.** Its `clear-choice` Turnstile widget still lists `site-b.jerodarte.workers.dev` (last checked 2026-11-04). Make sure paint-web's workers.dev is off before removing it.
- **chezmoi drift (laptop).** `~/.claude/settings.json` differs from the dotfiles source, so a `chezmoi apply` would overwrite it.
