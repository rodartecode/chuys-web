# Handoff

> This session handoff is rewritten in full at each /document-and-clear, and /catchup reads it first. It points at `BACKLOG.md` (agent work, `B-n`), `HUMAN.md` (your tasks) and the vault tracker (`C:/Users/jerod/vault/projects/chuys-tacos.md`) rather than restating them. If they disagree, those files and the code win.

**As of:** 2026-10-29 · `4111433` + this handoff commit · no test suite; typecheck, lint, lint:styles and build were green at `4111433`, and the Workers build succeeded · pushed
**Written on:** LAPTOP-ESEL9A3K

## Just shipped

- **Workers Builds works.**
  - The trigger was attached to the empty `rodartecode/chuys-tacos` repo, and its deploy command was `npx exec wrangler deploy`. You reconnected it to `chuys-web`.
  - Every push since `6b95b7a` has built and deployed in about 50–90 s.
  - The Worker is named `chuys-tacos`; see the memory note on names.
- **`75bf4c0`:** `pnpm dev` uses Cloudflare's always-pass Turnstile site key (`import.meta.env.DEV`), and builds use the real one.
- **`36a433e`:** `workers_dev` and `preview_urls` are off. The workers.dev host returns 404.
- **Owner change list:**
  - `876f47d`: asada copy and phone (559) 385-6847.
  - `67ee466`: catering packages hidden behind `showPackages`.
  - `2d65801`: `inquiry.cc` adds jesse@.
  - `bc89910`: dropdown readability via `color-scheme: dark`.
- **Lighthouse on production:** 96/98/100/100 on mobile and 99/98/100/100 on desktop. The two accessibility misses were fixed in `ef6dffa`. The baseline is in `BACKLOG.md`.
- **`4111433`:** `BACKLOG.md` is new: code work an agent can pick up, with `B-n` IDs.

## Next steps (ordered)

1. **BACKLOG B-2:** self-host Playfair Display. It's the only render-blocking request, about 950 ms on mobile. Afterwards, re-run Lighthouse and update the baseline table.
2. **BACKLOG B-3:** tests for `/api/inquiry`, plus a form smoke test.
3. **BACKLOG B-1:** restore the catering packages. Blocked on HUMAN.md: *Collect owner content*.
4. After you trim the Turnstile hostnames, read the widget through the Cloudflare MCP (`GET /accounts/{id}/challenges/widgets`) to confirm, and tick the task.

## In flight / blocked

- Nothing is uncommitted in this repo.
- The Cc to jesse@ isn't verified end to end. Blocked on HUMAN.md: *Check that inquiries Cc `jesse@chuystacos.com`*.

## Open decisions

- None.

## Watch items

- **TS 7 support.** TS is held at 6.x; see the tracker's Watch section and the memory note `ts7-support-watch`.
- **Turnstile in preview.** `pnpm preview` is a production build, so its widget fails on `localhost`. Use the curl with the dummy token in `API.md` there, which is documented.
- **paint-web, outside this repo.** Its `clear-choice` Turnstile widget still lists `site-b.jerodarte.workers.dev`. Check that paint-web's workers.dev is off before removing it.
- **chuys-tacos repo.** The empty `rodartecode/chuys-tacos` repo still exists and isn't archived. It's an optional HUMAN.md task.
- **chezmoi drift.** `~/.claude/settings.json` differs from the dotfiles source, so a `chezmoi apply` would overwrite it. This predates the session.
