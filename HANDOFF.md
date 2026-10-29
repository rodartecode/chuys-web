# Handoff

> This session handoff is rewritten in full at each /document-and-clear, and /catchup reads it first. It points at `BACKLOG.md` (agent work, `B-n`), `HUMAN.md` (your tasks) and the vault tracker (`C:/Users/jerod/vault/projects/chuys-tacos.md`) rather than restating them. If they disagree, those files and the code win.

**As of:** 2026-10-29 · `6d35975` + this handoff commit · `pnpm test` green (30 unit + 2 e2e); typecheck, lint, lint:styles and build green; Workers build for `6d35975` deployed · pushed
**Written on:** LAPTOP-ESEL9A3K

## Just shipped

- **`3096364` (B-3):** the repo's first test suite. `pnpm test` runs both parts, and the details are in `docs/04-development/` under Tests.
  - Vitest covers `/api/inquiry` with 30 tests.
  - One Playwright smoke test covers the form.
  - Lint and typecheck now include `tests/` and the root `*.config.ts`.
  - Before committing, I broke the code three ways (dropped the Cc, disabled the honeypot, removed the client-side validation guard). Each made its test fail.
- **`6d35975`:** BACKLOG has B-3 under Done.

## Next steps (ordered)

1. **BACKLOG B-4, first step only:** run a mobile PageSpeed Insights test of `https://chuystacos.com/`, either through Claude in Chrome or the PSI API once its daily quota resets. Compare the observed FCP with the local 2.4 s. The item's two branches say what to do with the result.
2. **BACKLOG B-1:** restore the catering packages. Blocked on HUMAN.md: *Collect owner content*. When it lands, the inquiry tests are unaffected, but run `pnpm test:e2e` because the page changes.
3. **Check the Turnstile hostnames once you've trimmed them:** read `GET /accounts/{id}/challenges/widgets` through the Cloudflare MCP and tick the task. On 2026-10-29 at 20:20 UTC the widget still listed `127.0.0.1`, `localhost` and `chuys-web.jerodarte.workers.dev`. Blocked on HUMAN.md: *Trim the Turnstile widget to the live hostnames*.

## In flight / blocked

- Nothing is uncommitted in this repo.
- The Cc to jesse@ is now covered by a unit test (the Resend payload), but nobody has checked delivery end to end. Blocked on HUMAN.md: *Check that inquiries Cc `jesse@chuystacos.com`*.

## Open decisions

- None.

## Watch items

- **Local mobile Lighthouse may be unreliable on this machine** until B-4 settles it. Take mobile numbers from PSI if they differ.
- **`pnpm test:e2e` needs installed Chrome** (`channel: "chrome"`). A machine without it needs `pnpm exec playwright install chromium`; see `docs/04-development/`.
- **Vitest doesn't read tsconfig paths.** If the endpoint starts importing a new alias, add it to `vitest.config.ts`, or `pnpm test:unit` fails to resolve it.
- **TS 7 support.** TS is held at 6.x; see the tracker's Watch section and the memory note `ts7-support-watch`.
- **Turnstile in preview.** `pnpm preview` is a production build, so its widget fails on `localhost`. Use the curl with the dummy token in `API.md` there.
- **paint-web, outside this repo.** Its `clear-choice` Turnstile widget still lists `site-b.jerodarte.workers.dev` (re-read 2026-10-29). Check that paint-web's workers.dev is off before removing it.
- **chuys-tacos repo.** The empty `rodartecode/chuys-tacos` repo still exists. It's an optional HUMAN.md task.
- **chezmoi drift.** `~/.claude/settings.json` differs from the dotfiles source, so a `chezmoi apply` would overwrite it.
