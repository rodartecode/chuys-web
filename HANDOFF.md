# Handoff

> This session handoff is rewritten in full at each /document-and-clear, and /catchup reads it first. It points at the tracker (`C:/Users/jerod/vault/projects/chuys-tacos.md`), `HUMAN.md` and the runbook rather than restating them. If they disagree, the tracker and the code win.

**As of:** 2026-10-28 · `601ab43` + this handoff commit · no test suite; typecheck, lint, lint:styles and build were green at `c55f98c`, and nothing has changed in `src/` since · pushed
**Written on:** LAPTOP-ESEL9A3K

## Just shipped

- All launch work is pushed to `origin/main` (`rodartecode/chuys-web`), `574e536..601ab43`. The commit-by-commit detail is in the tracker's Activity Log.
- `601ab43` added `HUMAN.md`, a checkbox list of every task Claude can't do: the go-live steps from runbook §1–8, the after-cutover checks, and the owner content still to collect. `CLAUDE.md`'s Documentation list now points to it.

## Next steps (ordered)

1. The user works through `HUMAN.md` → Go live (runbook §1–6). Connecting Workers Builds (§2) makes every later push to `main` a production deploy.
2. **When the user supplies the real Turnstile site key:** put it in `inquiry.turnstileSiteKey` in `src/data/business.ts`, then commit and push. It must be live before or together with the real `TURNSTILE_SECRET_KEY`. `HUMAN.md` §3 carries the warning.
3. **After the custom domain works:** set `workers_dev: false` and `preview_urls: false` in `wrangler.jsonc`. `HUMAN.md` asks the user to request this.
4. **From 2026-10-29:** bump `@astrojs/cloudflare` to 14.4.3, which is then outside pnpm's release-age window. Re-run typecheck, lint and build.
5. Add owner content as it arrives. `HUMAN.md` → Owner content has the list, and `grep -rn "TODO(owner)" src/` shows where each item goes.

## In flight / blocked

- Steps 1–3 are blocked on the operator. Claude doesn't provision Cloudflare, Resend or DNS.
- Real email delivery is unverified and needs the real Resend key.

## Open decisions

- None.

## Watch items

- **TS 7 support.** TS is held at 6.x. See the tracker's Watch section and the memory note `ts7-support-watch`.
- The `@vercel/functions` entries in the lockfile are optional peers pulled in by `unstorage` through Astro. They aren't Vercel leftovers.
- **Vault:** `projects/jevy.md` has uncommitted edits from another session (the 2026-10-20 jevy log entries). This session left them alone.
