# Waiting on you

> Tasks only you can do. Kept up to date by /document-and-clear and read by /catchup.
> Check one off by telling the agent, or delete it yourself. Full detail for each step is in the
> runbook [`docs/05-guides/cloudflare-setup.md`](docs/05-guides/cloudflare-setup.md); the § numbers point there.

**Updated:** 2026-10-29 · LAPTOP-ESEL9A3K

## ▶ Start here

### [ ] Trim the Turnstile widget to the live hostnames (§6) · ⏱ 2 min · added 2026-10-29
**Why:** the widget still accepts tokens from hosts the site no longer uses:
- `chuys-web.jerodarte.workers.dev`. The workers.dev copy has been off since 2026-10-29 (it returns 404), and it was never this Worker's real name.
- `localhost` and `127.0.0.1`. `pnpm dev` now uses Cloudflare's test key, so it doesn't need them.

I read this list through the Cloudflare API on 2026-10-29.

1. Cloudflare dashboard → Turnstile → the widget named `chuystacos.com +2 (Spin)` → Settings → Hostnames.
2. Remove `chuys-web.jerodarte.workers.dev`, `localhost` and `127.0.0.1`.
3. Keep `chuystacos.com` and `www.chuystacos.com`, then Save.

**Done when:** the widget lists only `chuystacos.com` and `www.chuystacos.com`. (Claude can check this with the Cloudflare MCP.)

## ⚡ Quick wins (≤10 min)

### [ ] Check that inquiries Cc `jesse@chuystacos.com` · ⏱ 5 min · added 2026-10-29
**Why:** from 2026-10-29, every inquiry email Cc's `jesse@chuystacos.com` (`inquiry.cc` in `src/data/business.ts`). It only arrives if that mailbox exists at the apex's mail provider. Claude can't send a test, because production Turnstile blocks automated submits.

1. Make sure `jesse@chuystacos.com` exists as a mailbox or alias with your mail provider.
2. Send a test inquiry from https://chuystacos.com/#contact.
3. Check that it arrives in both `chuy@` and `jesse@`. While the form is open, also check that the event-type options are readable.

**Done when:** both inboxes have the inquiry, and Reply still goes to the address you entered.

### [ ] Load the Cloudflare plugin in paint-web · ⏱ 1 min · added 2026-10-29
**Why:** the plugin and its MCP sign-in work in chuys-web. paint-web enables the same plugin, but it hasn't been reloaded there yet.

1. In a Claude Code session in `C:\Users\jerod\code\paint-web`, type `/reload-plugins`.

**Done when:** `/mcp` in that session lists `cloudflare` as connected.

### [ ] Delete or archive the empty `rodartecode/chuys-tacos` repo (optional) · ⏱ 2 min · added 2026-10-29
**Why:** it's a private placeholder from 2026-04-30 with one "Initial commit". The Workers Build trigger pointed at it by mistake until 2026-10-29. Nothing uses it now, and keeping it makes the same mix-up easy to repeat.

1. https://github.com/rodartecode/chuys-tacos → Settings → Danger Zone → Archive (or Delete).

**Done when:** the repo is archived or gone.

## 🎯 Needs a focus block

### [ ] Set up Google Search Console (§7) · ⏱ 20 min · added 2026-10-28
**Why:** Google finds and ranks the site sooner once the sitemap has been submitted.

1. Go to https://search.google.com/search-console, then Add property → Domain → `chuystacos.com`.
2. Copy the TXT record Google gives you, then add it in Cloudflare → DNS → Records with Proxy off.
3. Back in Search Console, press Verify.
4. Sitemaps → submit `https://chuystacos.com/sitemap-index.xml`.
5. Run the homepage through https://search.google.com/test/rich-results.
6. Optional: in Bing Webmaster Tools, import the site from Search Console.

**Done when:** the sitemap shows "Success" and the Rich Results Test finds the restaurant data with no errors.

### [ ] Update the Google Business Profile (§7) · ⏱ 20 min · added 2026-10-28
**Why:** Google trusts the listing and the site more when they agree on name, address, phone and hours. The site's phone number changed to **(559) 385-6847** on 2026-10-29, so make sure the listing shows the new one.

1. Open the profile at https://business.google.com.
2. Compare the name, address, phone and hours with `src/data/business.ts`, and fix any that differ.
3. Set the website to `https://chuystacos.com`.

**Done when:** every field matches `business.ts`, and the website field shows `https://chuystacos.com`.

## ⏳ Waiting on something else

- [ ] Collect owner content: the family story and founding year, a pull quote, catering package names, descriptions and pricing, the Instagram and Facebook URLs, a hero photo, menu photos and a PDF menu. To see where each one goes, run `grep -rn "TODO(owner)" src/` · waiting on the owners · added 2026-10-28

## ✅ Done recently

- 2026-10-29 Pointed Workers Builds at `rodartecode/chuys-web` and fixed its deploy command; the first build (`6b95b7a`) deployed at 19:15 UTC
- 2026-10-29 Added the `www` record and redirect, turned on Always Use HTTPS, and added the `/api/inquiry` rate limit (§6, §8)
- 2026-10-29 Sent a test inquiry from a phone: it reached `chuy@chuystacos.com`, and Reply goes to the sender (§5 smoke test)
- 2026-10-29 Signed in to the Cloudflare MCP server and loaded the plugin in chuys-web
- 2026-10-29 Deployed to the custom domain with `wrangler deploy --domain chuystacos.com` (§6)
