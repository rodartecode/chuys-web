# Handoff

> This session handoff is rewritten in full at each /document-and-clear, and /catchup reads it first. It points at `BACKLOG.md` (agent work, `B-n`), `HUMAN.md` (your tasks) and the vault tracker (`C:/Users/jerod/vault/projects/chuys-tacos.md`) rather than restating them. If they disagree, those files and the code win.

**As of:** 2026-10-29 · `288aa23` + this handoff commit · no test suite; typecheck, lint, lint:styles and build were green at `2d98587`, and the Workers build deployed · pushed
**Written on:** LAPTOP-ESEL9A3K

## Just shipped

- **`2d98587` (B-2):** Playfair Display is self-hosted through the Astro Fonts API.
  - Google Fonts and its render-blocking request are gone.
  - Production serves one preloaded variable woff2 with an immutable cache.
  - Headings measure identically to before.
  - Gotchas are in the memory note `astro-fonts-api`.
- **`bef6df7`, `288aa23`:**
  - BACKLOG has B-2 under Done and a before/after Lighthouse baseline table.
  - **B-4** is new: mobile FCP and Speed Index didn't move.

## Next steps (ordered)

1. **BACKLOG B-4, first step only:** run mobile at https://pagespeed.web.dev/ for `https://chuystacos.com/`, either through Claude in Chrome or by retrying the PSI API once its daily quota resets. Compare the observed FCP with the local 2.4 s. The item's two branches say what to do with the result.
2. **BACKLOG B-3:** tests for `/api/inquiry`, plus a form smoke test.
3. **BACKLOG B-1:** restore the catering packages. Blocked on HUMAN.md: *Collect owner content*.
4. Once you've trimmed the Turnstile hostnames, read `GET /accounts/{id}/challenges/widgets` through the Cloudflare MCP and tick the task. At 2026-10-29 evening the widget still listed `127.0.0.1`, `localhost` and `chuys-web.jerodarte.workers.dev`. Blocked on HUMAN.md: *Trim the Turnstile widget to the live hostnames*.

## In flight / blocked

- Nothing is uncommitted in this repo.
- The Cc to jesse@ isn't verified end to end. Blocked on HUMAN.md: *Check that inquiries Cc `jesse@chuystacos.com`*.

## Open decisions

- None.

## Watch items

- **Local mobile Lighthouse may be unreliable on this machine** until B-4 settles it. Take mobile numbers from PSI if they differ.
- **TS 7 support.** TS is held at 6.x; see the tracker's Watch section and the memory note `ts7-support-watch`.
- **Turnstile in preview.** `pnpm preview` is a production build, so its widget fails on `localhost`. Use the curl with the dummy token in `API.md` there.
- **paint-web, outside this repo.** Its `clear-choice` Turnstile widget still lists `site-b.jerodarte.workers.dev`. Check that paint-web's workers.dev is off before removing it.
- **chuys-tacos repo.** The empty `rodartecode/chuys-tacos` repo still exists. It's an optional HUMAN.md task.
- **chezmoi drift.** `~/.claude/settings.json` differs from the dotfiles source, so a `chezmoi apply` would overwrite it.
