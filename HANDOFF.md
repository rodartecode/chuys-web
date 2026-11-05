# Handoff

> This session handoff is rewritten in full at each /document-and-clear, and /catchup reads it first. It points at `BACKLOG.md` (agent work, `B-n`), `HUMAN.md` (your tasks) and the vault tracker (`C:/Users/jerod/vault/projects/chuys-tacos.md`) rather than restating them. If they disagree, those files and the code win.

**As of:** 2026-11-04 · `163abe8` + this handoff commit · `pnpm test` green (78 unit + 12 e2e); typecheck, lint, lint:styles and build green · `163abe8` deployed to production. A curl of the live page found the new copy, 6 Cash App order links, and no "Hungry now?" line · pushed
**Written on:** Harrier

## Just shipped

- **Menu copy (`6407cbc`, `163abe8`, deployed).** All in `src/data/menu.ts`:
  - **Burrito:** 12-inch tortilla for street style, 14-inch for Chuy's style.
  - **Taco:** street style is two small tortillas with no cheese between them. Chuy's style is two larger tortillas with melted cheese between them.
  - **Quesadilla:** Chuy's style uses a larger tortilla and adds avocado, queso fresco and sour cream.
  - **Spicy Shrimp Taco:** now "served Chuy's style on two larger tortillas with melted cheese between them".
  - **Torta:** already offered Chuy's style, so it didn't change.
- **Order Online buttons (`a10dd9e`, deployed).** New `src/components/OrderButton.astro`: a terracotta pill with "Prices and ordering on Cash App" in small text underneath.
  - `MenuHighlights.astro` renders it under the "Pick your meat" intro and again below the full menu, replacing the old "Hungry now?" line.
  - In `order-online.spec.ts`, `EXPECTED_LINKS` went from 5 to 6, and a new test checks that both menu buttons are present.

## Next steps (ordered)

1. **Drop `squareName` once Square is renamed.** Update `docs/menu/square-catalog-2026-11-04.csv` to the Crispy names and remove `squareName` from both items. Blocked on HUMAN.md: *Rename the barbacoa dishes in Square*.
2. **BACKLOG B-1:** restore the catering packages. Blocked on HUMAN.md: *Collect owner content*. Run `pnpm test:e2e` afterwards, because the page changes.
3. **Restore the regular hours when winter ends.** Blocked on HUMAN.md: *Tell the agent when the winter hours end*.
4. **Optional, ask the user first:** make `verifyTurnstile` in `src/pages/api/inquiry.ts` log siteverify's `error-codes` on failure, so a bad secret shows up in the Worker logs instead of looking like a bot rejection. It isn't in BACKLOG; file it as a B-n if the user wants it.

## In flight / blocked

- Nothing is uncommitted.
- **The live form is unverified since the Turnstile change.** Blocked on HUMAN.md: *Send a test inquiry and check both inboxes*.
- **The Google listing shows the old hours** until HUMAN.md: *Update the Google Business Profile* is done.

## Open decisions

- **Spicy Shrimp Taco toppings.** The copy states the Chuy's-style tortillas and cheese but leaves out the Chuy's-style toppings (avocado, sour cream, queso fresco), because nobody has confirmed the shrimp taco gets them. Add them if the user says it does.

## Watch items

- **Two machines.** Sessions now run on LAPTOP-ESEL9A3K and Harrier. Memory files don't sync between them, so the laptop's `ts7-support-watch` note is missing on Harrier. A fresh checkout needs `pnpm install` before running any check.
- **Menu re-sync.** `tests/unit/menu.test.ts` pins `CSV_PATH` to `square-catalog-2026-11-04.csv` and matches catalog rows on `squareName ?? name`. It checks names only, not descriptions. A new Square export has to overwrite that file or update `CSV_PATH`.
- **Drink option markup.** In `MenuHighlights.astro`, the options `.map` stays on one line on purpose, because a line break renders a space before each comma.
- **Header breakpoint is 900px.** The other sections still use 768px.
- **Hardcoded URLs in e2e specs.** `order-online.spec.ts` (`EXPECTED_LINKS`, 6 Cash App links) and `social.spec.ts` (`SOCIAL`) copy their URLs from `business.ts` by hand, because Playwright can't import a module that reads `import.meta.env`. Change both when the URLs change, and change `EXPECTED_LINKS` when an order link is added or removed.
- **Live link count.** To count order links with curl, grep `href="https://cash.app/$chuystacosytaquizas"` in single quotes with `-F`. Counting the bare URL also picks up the JSON-LD `urlTemplate`.
- **Mobile Lighthouse.** Local runs are trustworthy (see B-4), but the paint delay comes and goes. The PSI API usually returns 429.
- **`pnpm test:e2e` needs Chrome installed** (`channel: "chrome"`). See `docs/04-development/`.
- **Vitest doesn't read tsconfig paths.** A new alias goes in `vitest.config.ts` too.
- **TS 7 support.** TypeScript is held at 6.x until `@astrojs/check` supports TS 7 (see CLAUDE.md).
- **Turnstile in preview.** `pnpm preview` is a production build, so its widget fails on `localhost`. Use the curl from `API.md`.
- **paint-web, outside this repo.** Its `clear-choice` Turnstile widget still lists `site-b.jerodarte.workers.dev` (last checked 2026-11-04). Make sure paint-web's workers.dev is off before removing it.
- **chezmoi drift (laptop).** `~/.claude/settings.json` differs from the dotfiles source, so a `chezmoi apply` would overwrite it.
