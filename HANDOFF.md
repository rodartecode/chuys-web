# Handoff

> This file is rewritten in full at each /document-and-clear, and /catchup reads it first. It points to `BACKLOG.md` (agent work, `B-n`), `HUMAN.md` (your tasks) and the vault tracker (`C:/Users/jerod/vault/projects/chuys-tacos.md`) instead of restating them. If they disagree with this file, they win, and so does the code.

**As of:** 2026-11-05 · `e23ee33` + this handoff commit
**Checks:** `pnpm test` passes (91 unit + 12 e2e), and so do typecheck, lint, lint:styles and build. Only the 91 unit tests were re-run after `e23ee33`, which changed docs and one code comment.
**Deploy:** `b576fe9` is live. Its Workers Build succeeded at 21:41 UTC. A curl of the live page showed `385-6843` three times, JSON-LD `+15593856843`, no `6847`, the new Surf & Turf copy and no separate style items.
**Push:** pushed.
**Written on:** LAPTOP-ESEL9A3K

## Just shipped

- **Square CLI adopted** (`6a8d33a`). BACKLOG Done (2026-11-05) has the summary, and `docs/04-development/` → Square CLI has the details.
  - `pnpm menu:pull` rebuilds `docs/menu/square-catalog.csv` from the live catalog, read-only. It replaces the hand export.
  - `pnpm skills:square` installs 6 of the CLI's ~107 agent skills. They're gitignored, so it runs once per machine.
  - `.claude/settings.json` allows Square reads and asks before any write. Both the Bash and the PowerShell rules prompted when tested.
- **Menu synced to the 2026-11-05 catalog** (`7630256`, deployed). It now has 54 items.
  - The 10 "Chuy's Style" / "Street Style" items fold into their base entries through `squareVariants`.
  - Square now says Crispy Barbacoa Taco, so that item's `squareName` is gone.
  - Surf & Turf Fries has a description.
- **Phone is (559) 385-6843** (`e683f27`, deployed). It matches Square's location record, and the user confirmed it.
- **Docs synced** (`e23ee33`, via /docs-sync):
  - README: scripts, menu editing and structure.
  - Overview: tests, menu data and ordering.
  - Architecture: a new "Menu data flow" section.
  - Development guide: all four e2e specs.
  - CLAUDE.md: test comments and the directory map.
  - The docs index.
  - `API.md` and `.dev.vars.example` were checked against the code and needed no change. All doc links resolve.

## Next steps (ordered)

1. **Drop the last `squareName`** (3 Crispy Barbacoa Taco Plate) once Square has the new name: run `pnpm menu:pull`, then remove it. Blocked on HUMAN.md: *Rename the barbacoa plate in Square*.
2. **Use the menu photos from Square.** 36 of the 58 items have a photo there. If the owners agree, pull the image URLs with `square catalog catalog-object list --object-types IMAGE` and use them for the meat cards and dishes. Blocked on HUMAN.md: *Collect owner content*.
3. **BACKLOG B-1:** restore the catering packages. Blocked on HUMAN.md: *Collect owner content*. Run `pnpm test:e2e` afterwards.
4. **Optional:** check B-7 on production. Run `pnpm exec wrangler tail`, then POST a bogus token with the curl from `API.md`. Expect `invalid-input-response` in the log.

## In flight / blocked

- Nothing is uncommitted. The vault entry is pushed (`8ff6d13` in `rodartecode/vault`).
- **The live form hasn't been tested since the Turnstile change.** Blocked on HUMAN.md: *Send a test inquiry and check both inboxes*.
- **The Google listing may still show the old hours and phone** until HUMAN.md: *Update the Google Business Profile* is done. Square has an active "Google My Business" channel, so check first whether Square already pushes them to Google.
- **Square CLI auth expires 2026-12-05.** After that, run `square auth login` before `pnpm menu:pull`.

## Open decisions

- None.

## Watch items

- **Harrier needs `pnpm skills:square`**, plus `npm i -g @square/cli` and `square auth login` if those are missing. The skills are gitignored, so the laptop's copies don't travel. After installing, `git status` should show nothing under `.agents/`.
- **Square writes go live.** Catalog `update`, `upsert` and `delete` have no `--force` or preview. Never run one without the user's go-ahead (see CLAUDE.md Gotchas).
- **Re-syncing the menu:** run `pnpm menu:pull`, check `git diff docs/menu/`, then update `fullMenu` until `tests/unit/menu.test.ts` passes. The pull keeps items that aren't archived and that sell in an active channel other than Point of Sale. That rule matched the export on all 63 items.
- **Two machines.** Sessions run on LAPTOP-ESEL9A3K and Harrier, and memory doesn't sync between them. A fresh checkout needs `pnpm install` before any check.
- **Biome formats long test lines.** Run `pnpm format` before `pnpm lint`. Biome now covers `scripts/` as well.
- **Drink option markup.** In `MenuHighlights.astro`, the options `.map` stays on one line on purpose. A line break renders a space before each comma.
- **Header breakpoint is 900px.** The other sections still use 768px.
- **Hardcoded URLs in e2e specs.** `order-online.spec.ts` (`EXPECTED_LINKS`, 6 Cash App links) and `social.spec.ts` (`SOCIAL`) copy their URLs from `business.ts` by hand.
- **Live copy checks.** Served HTML encodes apostrophes as `&#39;`. To count order links, grep with `-F` for `href="https://cash.app/$chuystacosytaquizas"`.
- **Mobile Lighthouse.** Local runs are trustworthy (see B-4), but the paint delay comes and goes. The PSI API usually returns 429.
- **`pnpm test:e2e` needs Chrome installed** (`channel: "chrome"`).
- **Vitest doesn't read tsconfig paths.** A new alias goes in `vitest.config.ts` too.
- **TS 7 support.** TypeScript stays at 6.x until `@astrojs/check` supports TS 7.
- **Turnstile in preview.** `pnpm preview` is a production build, so its widget fails on `localhost`. Use the curl from `API.md`.
- **paint-web, outside this repo.** Its `clear-choice` Turnstile widget still lists `site-b.jerodarte.workers.dev`.
- **chezmoi drift (laptop).** `~/.claude/settings.json` differs from the dotfiles source.
