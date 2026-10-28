# Handoff

> This session handoff is rewritten in full at each /document-and-clear, and /catchup reads it first. It points at the tracker (`C:/Users/jerod/vault/projects/chuys-tacos.md`) and the runbook rather than restating them. If they disagree, the tracker and the code win.

**As of:** 2026-10-28 · `c55f98c` + this handoff commit · no test suite; typecheck, lint, lint:styles and build are green · **unpushed** (the user asked to hold pushes until they say so)
**Written on:** LAPTOP-ESEL9A3K

## Just shipped

These four commits are on `main`, ahead of `origin/main` (`rodartecode/chuys-web`):
- `77af0aa` Astro 7 dependency upgrade, MDX dropped, pnpm 11 setup
- `f26a79e` Vercel → Cloudflare Workers, Turnstile on `/api/inquiry`, stricter validation, runbook `docs/05-guides/cloudflare-setup.md`
- `cda812d` `src/data/business.ts` as the single data source, `TODO(owner)` fallbacks, OG card, JSON-LD, robots, 404
- `c55f98c` `deploy` script renamed to `cf:deploy`, Turnstile load-failure fallback

These were checked on `wrangler dev`:
- the endpoint test matrix
- the browser form flow, including auto-resubmit after verification and the blocked-script fallback
- layout at 390px

## Next steps (ordered)

1. The user pushes `main` when ready. Once Workers Builds is connected, every push to `main` deploys to production.
2. The operator works through the runbook `docs/05-guides/cloudflare-setup.md` §1–8 (zone, Worker, Turnstile, Resend, secrets, custom domain, search).
3. **When the user supplies the real Turnstile site key:** put it in `inquiry.turnstileSiteKey` in `src/data/business.ts`, then commit and deploy. This must go live *before or together with* the real `TURNSTILE_SECRET_KEY`. A test site key paired with the real secret fails every inquiry with the captcha error, and nothing else signals it.
4. After cutover:
   - Send a real inquiry from a phone and confirm it arrives with reply-to set.
   - Run the Rich Results Test.
   - Set `workers_dev: false` and `preview_urls: false` in `wrangler.jsonc`.
5. Add owner content as it arrives. `grep -rn "TODO(owner)" src/` lists what's pending, and the tracker's Next Milestone has the list.

## In flight / blocked

- Steps 2 and 3 are blocked on the operator. Claude doesn't provision Cloudflare, Resend or DNS.
- Real email delivery is unverified and needs the real Resend key.

## Open decisions

- None open. Settled this session: hosting on Cloudflare Workers (not Vercel or Pages), Turnstile included, launch with fallbacks rather than waiting on the owners.

## Watch items

- **TS 7 support.** TS is held at 6.x. See the tracker's Watch section and the memory note `ts7-support-watch`.
- **`@astrojs/cloudflare` is pinned to `^14.4.2`.** 14.4.3 was inside pnpm's release-age window on 2026-10-28 and can be taken from 2026-10-29.
- The `@vercel/functions` entries in the lockfile are optional peers pulled in by `unstorage` through Astro. They aren't Vercel leftovers.
