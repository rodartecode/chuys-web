# Handoff

> This session handoff is rewritten in full at each /document-and-clear, and /catchup reads it first. It points at `BACKLOG.md` (agent work, `B-n`), `HUMAN.md` (your tasks) and the vault tracker (`C:/Users/jerod/vault/projects/chuys-tacos.md`) rather than restating them. If they disagree, those files and the code win.

**As of:** 2026-11-04 · `edc9c1f` + this handoff commit · `pnpm test` green (78 unit + 11 e2e); typecheck, lint, lint:styles and build green · `edc9c1f` deployed to production, and a curl of the live page found the new copy and hours and none of the old · pushed
**Written on:** LAPTOP-ESEL9A3K

## Just shipped

- **Owner copy fixes (`da205ff`, deployed):**
  - The menu blurb says "Tortillas sourced locally" instead of claiming masa is made in-house.
  - The Visit heading is now "Come hungry." instead of "Find the trompo."
  - Our Story says "behind the grill".
  - The Catering intro offers the trompo on request, in both branches of `showPackages`.
- **Winter hours (`93a61a3`, deployed):** Mon–Fri 10 AM – 4 PM in `business.ts`, covering both the `hours` display rows and the JSON-LD `openingHours`. There's no "winter" label on the site, at the user's request.
- **HUMAN.md (`edc9c1f`):** the Google Business Profile task now includes the new hours.

## Next steps (ordered)

1. **Drop `squareName` once Square is renamed.** Update `docs/menu/square-catalog-2026-11-04.csv` to the Crispy names and remove `squareName` from both items. Blocked on HUMAN.md: *Rename the barbacoa dishes in Square*.
2. **BACKLOG B-1:** restore the catering packages. Blocked on HUMAN.md: *Collect owner content*. Run `pnpm test:e2e` after, because the page changes.
3. **Restore the regular hours when winter ends.** Blocked on HUMAN.md: *Tell the agent when the winter hours end*.
4. **Optional, needs the user's go-ahead first:** make `verifyTurnstile` in `src/pages/api/inquiry.ts` log siteverify's `error-codes` on failure. Then a bad Worker secret (`invalid-input-secret`) would show up in Worker logs instead of looking like a bot rejection. It isn't in BACKLOG; file it as a B-n if the user wants it.

## In flight / blocked

- Nothing is uncommitted. The vault tracker entry for this session is committed and pushed (`1747a83` in `rodartecode/vault`).
- **The live form is unverified since the Turnstile change.** Blocked on HUMAN.md: *Send a test inquiry and check both inboxes*.
- **The Google listing still shows the old hours** until HUMAN.md: *Update the Google Business Profile* is done.
- The raw Square export, `docs/ML17GN6ZVCE1X_catalog-2026-11-04-2132.csv`, exists only on LAPTOP-ESEL9A3K because it's gitignored. Nothing needs it.

## Open decisions

- None.

## Watch items

- **Menu re-sync.** `tests/unit/menu.test.ts` pins `CSV_PATH` to `square-catalog-2026-11-04.csv`, and it matches the catalog on `squareName ?? name`. A new Square export has to overwrite that file or update `CSV_PATH`.
- **Drink option markup.** In `MenuHighlights.astro`, the options `.map` stays on one line on purpose, because a line break renders a space before each comma.
- **Header breakpoint is 900px.** The other sections still use 768px.
- **Hardcoded URLs in e2e specs.** `order-online.spec.ts` (`EXPECTED_LINKS`, 5 Cash App links) and `social.spec.ts` (`SOCIAL`) mirror `business.ts` by hand, because Playwright can't import a module that reads `import.meta.env`. Change both when the URLs change.
- **Mobile Lighthouse:** local runs are trustworthy (see B-4), but the paint delay is intermittent. The PSI API usually returns 429.
- **`pnpm test:e2e` needs installed Chrome** (`channel: "chrome"`). See `docs/04-development/`.
- **Vitest doesn't read tsconfig paths.** A new alias goes in `vitest.config.ts` too.
- **TS 7 support.** TypeScript is held at 6.x. See the memory note `ts7-support-watch`.
- **Turnstile in preview.** `pnpm preview` is a production build, so its widget fails on `localhost`. Use the curl from `API.md`.
- **paint-web, outside this repo.** Its `clear-choice` Turnstile widget still lists `site-b.jerodarte.workers.dev` (re-read 2026-11-04). Check that paint-web's workers.dev is off before removing it.
- **chezmoi drift.** `~/.claude/settings.json` differs from the dotfiles source, so a `chezmoi apply` would overwrite it.
