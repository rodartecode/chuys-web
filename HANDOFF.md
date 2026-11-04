# Handoff

> This session handoff is rewritten in full at each /document-and-clear, and /catchup reads it first. It points at `BACKLOG.md` (agent work, `B-n`), `HUMAN.md` (your tasks) and the vault tracker (`C:/Users/jerod/vault/projects/chuys-tacos.md`) rather than restating them. If they disagree, those files and the code win.

**As of:** 2026-11-04 · `35ea72a` + this handoff commit · this session changed only docs. The last code checks are from `6d35975`: `pnpm test` green (30 unit + 2 e2e); typecheck, lint, lint:styles and build green. Lint was re-run on `35ea72a` and is green · pushed
**Written on:** LAPTOP-ESEL9A3K

## Just shipped

- **`35ea72a`:** two new roadmap items in BACKLOG.
  - **B-5:** link to online ordering on Cash App.
  - **B-6:** a full menu with no prices, built from the owners' Square catalog.
  - **Catalog:** the trimmed copy is `docs/menu/square-catalog-2026-11-04.csv`, with 44 items and three columns: name, category and description.
  - **Gitignore:** a new rule, `docs/*_catalog-*.csv`, keeps raw Square exports out of git, because the repo is public.
  - **Decisions:** the user decided to show no prices on the site and to commit the trimmed CSV.

## Next steps (ordered)

1. **BACKLOG B-5:** add the Cash App order links. It's small, needs no owner content, and B-6 depends on it.
2. **BACKLOG B-4, first step only:** run a mobile PageSpeed Insights test of `https://chuystacos.com/`, through Claude in Chrome or the PSI API. Compare its observed FCP with the local 2.4 s.
3. **BACKLOG B-6:** build the full menu after B-5. You can build it now, but it isn't finished until the owners settle the wording. That part is blocked on HUMAN.md: *Ask the owners about two menu wording mismatches*.
4. **BACKLOG B-1:** restore the catering packages. Blocked on HUMAN.md: *Collect owner content*. When that content arrives, run `pnpm test:e2e`, because the page changes.
5. **Re-check the Turnstile hostnames:** read `GET /accounts/{id}/challenges/widgets` through the Cloudflare MCP. On 2026-11-04 the widget still listed `127.0.0.1`, `localhost` and `chuys-web.jerodarte.workers.dev`. Blocked on HUMAN.md: *Trim the Turnstile widget to the live hostnames*.

## In flight / blocked

- Nothing is uncommitted.
- The raw Square export, `docs/ML17GN6ZVCE1X_catalog-2026-11-04-2132.csv`, exists only on LAPTOP-ESEL9A3K because it's gitignored. B-6 needs only the trimmed copy.
- The Cc to jesse@ is covered by a unit test, but nobody has checked delivery end to end. Blocked on HUMAN.md: *Check that inquiries Cc `jesse@chuystacos.com`*.

## Open decisions

- None. Prices are settled: none on the site. They're recorded in B-6.

## Watch items

- **Local mobile Lighthouse may be unreliable on this machine** until B-4 settles it. Take mobile numbers from PSI if they differ.
- **The B-5 URL is spelled "taquizas".** The Square location name is spelled "Taquisas", so don't "fix" the cashtag. `https://cash.app/$chuystacosytaquizas` resolved on 2026-11-04.
- **`pnpm test:e2e` needs installed Chrome** (`channel: "chrome"`). On a machine without it, run `pnpm exec playwright install chromium`; see `docs/04-development/`.
- **Vitest doesn't read tsconfig paths.** If the endpoint imports a new alias, add it to `vitest.config.ts` too.
- **TS 7 support.** TypeScript is held at 6.x. See the tracker's Watch section and the memory note `ts7-support-watch`.
- **Turnstile in preview.** `pnpm preview` is a production build, so its widget fails on `localhost`. Use the curl with the dummy token from `API.md` instead.
- **paint-web, outside this repo.** Its `clear-choice` Turnstile widget still lists `site-b.jerodarte.workers.dev` (re-read 2026-11-04). Check that paint-web's workers.dev is off before removing it.
- **chuys-tacos repo.** The empty `rodartecode/chuys-tacos` repo still exists. Archiving or deleting it is an optional task in HUMAN.md.
- **chezmoi drift.** `~/.claude/settings.json` differs from the dotfiles source, so a `chezmoi apply` would overwrite it.
