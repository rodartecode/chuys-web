# Handoff

> This session handoff is rewritten in full at each /document-and-clear, and /catchup reads it first. It points at the tracker (`C:/Users/jerod/vault/projects/chuys-tacos.md`), `HUMAN.md` and the runbook rather than restating them. If they disagree, the tracker and the code win.

**As of:** 2026-10-29 · `228e75b` + this handoff commit · no test suite; typecheck, lint, lint:styles and build were green at `e4c5fd3` · pushed
**Written on:** LAPTOP-ESEL9A3K

## Just shipped

- The site is live at https://chuystacos.com. The user did runbook §1–6, apart from Always Use HTTPS and the `www` record.
- `76ef0fb`: committed the production Turnstile site key, so `main` now matches what's live.
- `e4c5fd3`: bumped `@astrojs/cloudflare` to 14.4.3. **It isn't deployed yet**; see "In flight".
- `eb7daec`: enabled the official `cloudflare@cloudflare` plugin (Cloudflare skills plus the Cloudflare MCP server) at project scope, in the committed `.claude/settings.json`.
  - It replaces the `npx skills` wrangler copy from `3d4ed2e`, which an audit against Cloudflare's setup page ruled out.
  - paint-web got the same change in `da0bad3` and `7a82c7b`.
  - The method is in the memory note `project-scoped-skills`.

## Next steps (ordered)

1. **Get the 14.4.3 bump live.** Blocked on HUMAN.md: *Connect Workers Builds to the GitHub repo*. If the user wants it live sooner, run `pnpm cf:deploy`, but only with their OK, because it deploys to production.
2. **Fix local Turnstile.** The real site key now ships in dev too, and it fails on `localhost`. `docs/05-guides/cloudflare-setup.md:45` is stale. See "Open decisions".
3. **Turn off workers.dev and preview URLs:** set `workers_dev: false` and `preview_urls: false` in `wrangler.jsonc`. Blocked on HUMAN.md: *Send a test inquiry from your phone*, *Fix the `www` DNS record* and *Turn on Always Use HTTPS*.
4. Add owner content as it arrives. HUMAN.md's "Waiting on something else" has the list.

## In flight / blocked

- **Workers Builds isn't deploying.**
  - All 4 Worker deployments are `wrangler` uploads, secret puts and the 18:00 UTC `--domain` deploy.
  - GitHub has no check runs on any commit, and none of today's pushes deployed.
  - A likely cause, not verified: the Worker was created by `wrangler` before the dashboard Git import.
- Inquiry delivery is still unverified end to end; this is HUMAN.md's Start here.

## Open decisions

- **Local Turnstile in dev.** Option (a): add `localhost` to the widget's hostnames, which is a dashboard step. Option (b): use the always-pass test site key when `import.meta.env.DEV`, which is a code change. Ask the user which; (b) matches what `.dev.vars.example` already assumes.

## Watch items

- **TS 7 support.** TS is held at 6.x. See the tracker's Watch section and the memory note `ts7-support-watch`.
- The `@vercel/functions` entries in the lockfile are optional peers pulled in by `unstorage` through Astro. They aren't Vercel leftovers.
- **Cloudflare plugin, not yet exercised.** It's enabled but unused until the user runs `/reload-plugins`. Its skills are namespaced, e.g. `cloudflare:wrangler`. `claude plugin marketplace add` also writes the marketplace into the chezmoi-managed user `settings.json`; it was removed there on purpose.
- **chezmoi drift:** the user's `~/.claude/settings.json` differs a lot from the dotfiles source (`defaultShell`, the allow list). A `chezmoi apply` would overwrite it. This predates the session.
- **Vault:** this session's 2026-10-29 lines in `projects/chuys-tacos.md` and `projects/paint-web.md` are uncommitted. So are the older `projects/jevy.md` edits from another session.
