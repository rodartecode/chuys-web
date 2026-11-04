# Handoff

> This session handoff is rewritten in full at each /document-and-clear, and /catchup reads it first. It points at `BACKLOG.md` (agent work, `B-n`), `HUMAN.md` (your tasks) and the vault tracker (`C:/Users/jerod/vault/projects/chuys-tacos.md`) rather than restating them. If they disagree, those files and the code win.

**As of:** 2026-11-04 · `a9c66d9` + this handoff commit · `pnpm test` green (77 unit + 8 e2e); typecheck, lint, lint:styles and build green · B-6 deployed to production (build for `d3d3e45` succeeded) · pushed
**Written on:** LAPTOP-ESEL9A3K

## Just shipped

- **BACKLOG B-6 (`d36ab8a`..`a9c66d9`, deployed):** the full menu now appears under the signature tacos, and the Barbacoa card is corrected. The details are in BACKLOG Done.
- **Baseline:** a new PSI mobile row after B-6, at 100/100/100/100. That was a single run, so read the note under the table.

## Next steps (ordered)

1. **Rename the "Birria" card** in `menuHighlights` if the owners say it is Quesabirria. Blocked on HUMAN.md: *Ask the owners: Birria or Quesabirria?*
2. **BACKLOG B-1:** restore the catering packages. Blocked on HUMAN.md: *Collect owner content*. Run `pnpm test:e2e` after, because the page changes.
3. **Re-check the Turnstile hostnames** through the Cloudflare MCP (`GET /accounts/{id}/challenges/widgets`). The last re-read, late on 2026-11-04, was unchanged. Blocked on HUMAN.md: *Trim the Turnstile widget to the live hostnames*.

The backlog has no open item that isn't blocked on the owners. Anything new would start from a fresh idea or an owner request.

## In flight / blocked

- Nothing is uncommitted in this repo. The vault tracker edits from this session and the last one are committed and pushed to `rodartecode/vault`.
- The raw Square export, `docs/ML17GN6ZVCE1X_catalog-2026-11-04-2132.csv`, exists only on LAPTOP-ESEL9A3K because it's gitignored. Nothing needs it now: the trimmed copy in `docs/menu/` is what `fullMenu` and its test use.
- The Cc to jesse@ isn't checked end to end. Blocked on HUMAN.md: *Check that inquiries Cc `jesse@chuystacos.com`*.

## Open decisions

- None.

## Watch items

- **Menu re-sync.** `tests/unit/menu.test.ts` pins `CSV_PATH` to `square-catalog-2026-11-04.csv`. A new Square export has to overwrite that file or update `CSV_PATH`. The `menu.ts` header comment says the same.
- **Drink option markup.** In `MenuHighlights.astro`, the options `.map` stays on one line on purpose, because a line break renders a space before each comma. The e2e spec matches each option `<span>` exactly.
- **Header breakpoint is 900px.** Header.astro collapses at 900px, while the other sections still use 768px. Adding a third header item would need about 1000px.
- **Order Online links.** There are 5 of them. `EXPECTED_LINKS` in `tests/e2e/order-online.spec.ts` hardcodes both the count and the Cash App URL. The URL is spelled "taquizas" on purpose.
- **Mobile Lighthouse:** local runs are trustworthy (see B-4), but the paint delay is intermittent. The PSI API usually returns 429, and the PSI web UI exposes the full JSON as `window.__LIGHTHOUSE_MOBILE_JSON__`.
- **`pnpm test:e2e` needs installed Chrome** (`channel: "chrome"`). On a machine without it, run `pnpm exec playwright install chromium`; see `docs/04-development/`.
- **Vitest doesn't read tsconfig paths.** If a test imports a new alias, add it to `vitest.config.ts` too.
- **TS 7 support.** TypeScript is held at 6.x. See the tracker's Watch section and the memory note `ts7-support-watch`.
- **Turnstile in preview.** `pnpm preview` is a production build, so its widget fails on `localhost`. Use the curl with the dummy token from `API.md` instead.
- **paint-web, outside this repo.** Its `clear-choice` Turnstile widget still lists `site-b.jerodarte.workers.dev` (re-read 2026-11-04). Check that paint-web's workers.dev is off before removing it.
- **chuys-tacos repo.** The empty `rodartecode/chuys-tacos` repo still exists. Archiving or deleting it is an optional task in HUMAN.md.
- **chezmoi drift.** `~/.claude/settings.json` differs from the dotfiles source, so a `chezmoi apply` would overwrite it.
