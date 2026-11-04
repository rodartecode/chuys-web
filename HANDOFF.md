# Handoff

> This session handoff is rewritten in full at each /document-and-clear, and /catchup reads it first. It points at `BACKLOG.md` (agent work, `B-n`), `HUMAN.md` (your tasks) and the vault tracker (`C:/Users/jerod/vault/projects/chuys-tacos.md`) rather than restating them. If they disagree, those files and the code win.

**As of:** 2026-11-04 · `58aaa8e` + this handoff commit · `pnpm test` green (30 unit + 5 e2e); typecheck, lint, lint:styles and build green on `cd16587` · B-5 deployed to production · pushed
**Written on:** LAPTOP-ESEL9A3K

## Just shipped

- **BACKLOG B-5 (`cd16587`, deployed):** an Order Online link to Cash App in five places, plus an `OrderAction` in the JSON-LD. The header now collapses to the hamburger at **900px**, not 768px, because two pills need about 880px.
- **BACKLOG B-4:** investigated, then **parked** under "Not doing" at the user's call. The findings and revisit triggers are in that entry (`58aaa8e` plus this commit).
- **Baseline:** a new PSI mobile row after B-5, at 97/100/100/100.

## Next steps (ordered)

1. **BACKLOG B-6:** build the full menu. It's unblocked to build, but it can't be *finished* until the owners settle the wording. Blocked on HUMAN.md: *Ask the owners about two menu wording mismatches*.
2. **BACKLOG B-1:** restore the catering packages. Blocked on HUMAN.md: *Collect owner content*. Run `pnpm test:e2e` after, because the page changes.
3. **Re-check the Turnstile hostnames** through the Cloudflare MCP (`GET /accounts/{id}/challenges/widgets`). On 2026-11-04, late session, it still listed `127.0.0.1`, `localhost` and `chuys-web.jerodarte.workers.dev`. Blocked on HUMAN.md: *Trim the Turnstile widget to the live hostnames*.

## In flight / blocked

- Nothing is uncommitted in this repo.
- **The vault tracker has an uncommitted edit.** `C:/Users/jerod/vault/projects/chuys-tacos.md` was already modified before this session. This session appended today's activity line to it and didn't commit the vault.
- The raw Square export, `docs/ML17GN6ZVCE1X_catalog-2026-11-04-2132.csv`, exists only on LAPTOP-ESEL9A3K because it's gitignored. B-6 needs only the trimmed copy.
- The Cc to jesse@ isn't checked end to end. Blocked on HUMAN.md: *Check that inquiries Cc `jesse@chuystacos.com`*.

## Open decisions

- None. Prices are settled (none on the site, per B-6), and so is B-4 (parked).

## Watch items

- **B-6 touches the B-5 menu note.** B-6 replaces the menu's "Want the full menu?" line, which now also holds the "Hungry now? Order online" link. Keep one Order Online link there, or update `EXPECTED_LINKS` in `tests/e2e/order-online.spec.ts`. That spec hardcodes the Cash App URL, because `business.ts` reads `import.meta.env`, which Playwright's Node runner doesn't provide.
- **Header breakpoint is 900px.** Header.astro collapses at 900px, while the other sections still use 768px. Adding a third header item would need about 1000px.
- **Mobile Lighthouse:** local runs are trustworthy (see B-4). The PSI API usually returns 429; the PSI web UI exposes the full JSON as `window.__LIGHTHOUSE_MOBILE_JSON__`.
- **The B-5 URL is spelled "taquizas" on purpose,** so don't "fix" the cashtag. There's a comment in `business.ts`.
- **`pnpm test:e2e` needs installed Chrome** (`channel: "chrome"`). On a machine without it, run `pnpm exec playwright install chromium`; see `docs/04-development/`.
- **Vitest doesn't read tsconfig paths.** If the endpoint imports a new alias, add it to `vitest.config.ts` too.
- **TS 7 support.** TypeScript is held at 6.x. See the tracker's Watch section and the memory note `ts7-support-watch`.
- **Turnstile in preview.** `pnpm preview` is a production build, so its widget fails on `localhost`. Use the curl with the dummy token from `API.md` instead.
- **paint-web, outside this repo.** Its `clear-choice` Turnstile widget still lists `site-b.jerodarte.workers.dev` (re-read 2026-11-04). Check that paint-web's workers.dev is off before removing it.
- **chuys-tacos repo.** The empty `rodartecode/chuys-tacos` repo still exists. Archiving or deleting it is an optional task in HUMAN.md.
- **chezmoi drift.** `~/.claude/settings.json` differs from the dotfiles source, so a `chezmoi apply` would overwrite it.
