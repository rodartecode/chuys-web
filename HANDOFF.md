# Handoff

> This file is rewritten in full at each /document-and-clear, and /catchup reads it first. It points to `BACKLOG.md` (agent work, `B-n`), `HUMAN.md` (your tasks) and the vault tracker (`C:/Users/jerod/vault/projects/chuys-tacos.md`) instead of restating them. If they disagree with this file, they win, and so does the code.

**As of:** 2026-11-05 · `b576fe9` + this handoff commit · all green: `pnpm test` (91 unit + 12 e2e), typecheck, lint, lint:styles and build · `b576fe9` is deployed (Workers Build succeeded at 21:41 UTC), and a curl of the live page showed `385-6843` ×3, JSON-LD `+15593856843`, no `6847`, the new Surf & Turf copy and no separate style items · pushed
**Written on:** LAPTOP-ESEL9A3K

## Just shipped

- **Square CLI adopted** (`6a8d33a`). Research findings and the plan are in BACKLOG Done (2026-11-05). Details are in `docs/04-development/` → Square CLI.
  - `pnpm menu:pull` regenerates `docs/menu/square-catalog.csv` from the live catalog, read-only. It replaces the hand export.
  - `pnpm skills:square` installs 6 of the CLI's ~107 agent skills. They're gitignored, so run it once per machine.
  - `.claude/settings.json` allows Square read commands and asks before any write. Both the Bash and the PowerShell rules prompted when tested.
- **Menu synced to the 2026-11-05 catalog** (`7630256`, deployed).
  - The catalog has 54 items. The 10 new "Chuy's Style" and "Street Style" items fold into their base entries through `squareVariants`.
  - Square now uses the name Crispy Barbacoa Taco, so that `squareName` is gone. The plate's is still there.
  - Surf & Turf Fries has a description.
- **Phone (559) 385-6843** (`e683f27`, deployed). It matches Square's location record, and the user confirmed it was the right one.

## Next steps (ordered)

1. **Drop the last `squareName`** (3 Crispy Barbacoa Taco Plate) once Square is renamed: run `pnpm menu:pull`, then remove it. Blocked on HUMAN.md: *Rename the barbacoa plate in Square*.
2. **Menu photos from Square.** 36 of the 58 items have Square photos. If the owners say yes, pull the image URLs (`square catalog catalog-object list --object-types IMAGE`) for the meat cards and dishes. Blocked on HUMAN.md: *Collect owner content*.
3. **BACKLOG B-1:** restore the catering packages. Blocked on HUMAN.md: *Collect owner content*. Run `pnpm test:e2e` afterwards.
4. **Optional:** check B-7 on production. Run `pnpm exec wrangler tail`, then POST a bogus token with the curl from `API.md`. You should see `invalid-input-response`.

## In flight / blocked

- Nothing is uncommitted. The vault entry is pushed (`8ff6d13` in `rodartecode/vault`).
- **The live form hasn't been checked since the Turnstile change.** Blocked on HUMAN.md: *Send a test inquiry and check both inboxes*.
- **The Google listing may still show the old hours and phone** until HUMAN.md: *Update the Google Business Profile* is done. Square has an active "Google My Business" channel, so check whether Square already pushes them.
- **Square CLI auth** expires 2026-12-05. After that, run `square auth login` before `pnpm menu:pull`.

## Open decisions

- None.

## Watch items

- **Harrier needs `pnpm skills:square`** (and `npm i -g @square/cli` plus `square auth login` if those are missing). The skills are gitignored, so this machine's copies don't travel. After installing, check that `git status` shows nothing under `.agents/`.
- **Square writes go live.** Catalog `update`, `upsert` and `delete` have no `--force` or preview. Never run one without the user's go-ahead. See CLAUDE.md Gotchas.
- **Menu re-sync:** run `pnpm menu:pull`, then `git diff docs/menu/`, then update `fullMenu` until `tests/unit/menu.test.ts` passes. The pull keeps items that aren't archived and that sell in an active channel other than Point of Sale. That rule matched the export on all 63 items.
- **Two machines.** Sessions run on LAPTOP-ESEL9A3K and Harrier, and memory doesn't sync between them. A fresh checkout needs `pnpm install` before any check.
- **Biome formats long test lines.** Run `pnpm format` before `pnpm lint`. Biome now covers `scripts/` too.
- **Drink option markup.** In `MenuHighlights.astro`, the options `.map` stays on one line on purpose. A line break renders a space before each comma.
- **Header breakpoint is 900px.** The other sections still use 768px.
- **Hardcoded URLs in e2e specs.** `order-online.spec.ts` (`EXPECTED_LINKS`, 6 Cash App links) and `social.spec.ts` (`SOCIAL`) copy their URLs from `business.ts` by hand.
- **Live copy checks.** Served HTML encodes apostrophes as `&#39;`. To count order links, grep `href="https://cash.app/$chuystacosytaquizas"` with `-F`.
- **Mobile Lighthouse.** Local runs are trustworthy (see B-4), but the paint delay is intermittent. The PSI API usually returns 429.
- **`pnpm test:e2e` needs Chrome installed** (`channel: "chrome"`).
- **Vitest doesn't read tsconfig paths.** A new alias also goes in `vitest.config.ts`.
- **TS 7 support.** TypeScript stays at 6.x until `@astrojs/check` supports TS 7.
- **Turnstile in preview.** `pnpm preview` is a production build, so its widget fails on `localhost`. Use the curl from `API.md`.
- **paint-web, outside this repo.** Its `clear-choice` Turnstile widget still lists `site-b.jerodarte.workers.dev`.
- **chezmoi drift (laptop).** `~/.claude/settings.json` differs from the dotfiles source.
