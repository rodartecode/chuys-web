# Waiting on you

> Tasks only you can do. Kept up to date by /document-and-clear and read by /catchup.
> Check one off by telling the agent, or delete it yourself. Full detail for each step is in the
> runbook [`docs/05-guides/cloudflare-setup.md`](docs/05-guides/cloudflare-setup.md); the § numbers point there.

**Updated:** 2026-10-29 · LAPTOP-ESEL9A3K

## ▶ Start here

### [ ] Send a test inquiry from your phone · ⏱ 5 min
**Why:** the site is live, but no inquiry has gone end to end yet. A broken form loses catering leads and doesn't warn anyone.

1. On your phone, open https://chuystacos.com/#contact
2. Fill in the form with your own email address and submit it.
3. Open the `chuy@chuystacos.com` inbox and find the inquiry.
4. Press Reply and check that the To address is the email you entered on the form.

**Done when:** the inquiry is in `chuy@chuystacos.com`, and Reply goes to the address you entered. (This covers the runbook's §5 smoke test as well.)

## ⚡ Quick wins (≤10 min)

### [ ] Connect Workers Builds to the GitHub repo · ⏱ 10 min · added 2026-10-29
**Why:** pushes to `main` don't deploy. All 4 deployments so far came from `wrangler` on your laptop, and the 2026-10-29 push didn't deploy, so the `@astrojs/cloudflare` 14.4.3 bump isn't live.

1. Cloudflare dashboard → Workers & Pages → `chuys-web` → Settings → Build → Connect.
2. Pick GitHub → `rodartecode/chuys-web`, branch `main`.
3. Set the build command to `pnpm build` and the deploy command to `pnpm exec wrangler deploy`.
4. Add a build variable: `PNPM_VERSION` = `11.21.0`.
5. Save, then start a build from the Deployments tab (or ask Claude to push a commit).

**Done when:** this command shows a deployment newer than `2026-10-29T18:00`:
```bash
pnpm exec wrangler deployments list
```

### [ ] Fix the `www` DNS record · ⏱ 10 min · added 2026-10-29
**Why:** `www.chuystacos.com` doesn't exist in public DNS (NXDOMAIN on 1.1.1.1 on 2026-10-29), so anyone who types `www` gets an error page.

1. Cloudflare dashboard → `chuystacos.com` → DNS → Records.
2. Look for an `AAAA` record named `www`. If it's missing, add one: content `100::`, Proxy **on** (orange cloud).
3. Rules → Redirect Rules: check that "Redirect from WWW to root" (301) is there and enabled.
4. Check it:
   ```bash
   curl -sI https://www.chuystacos.com/
   ```

**Done when:** the curl shows `301` with `location: https://chuystacos.com/`.

### [ ] Turn on Always Use HTTPS · ⏱ 2 min · added 2026-10-28
**Why:** `http://chuystacos.com/` serves the page over plain HTTP (it returns 200) instead of redirecting to HTTPS.

1. Cloudflare dashboard → `chuystacos.com` → SSL/TLS → Edge Certificates.
2. Switch **Always Use HTTPS** on.
3. Check it:
   ```bash
   curl -sI http://chuystacos.com/
   ```

**Done when:** the curl shows `301`.

### [ ] Add a rate limit on the inquiry endpoint (optional, §8) · ⏱ 10 min · added 2026-10-28
**Why:** Turnstile stops bots, but a rate limit caps how many emails a single IP can trigger.

1. Cloudflare dashboard → `chuystacos.com` → Security → WAF → Rate limiting rules → Create rule.
2. Match: URI path equals `/api/inquiry`, and request method equals `POST`.
3. Rate: more than 5 requests per 1 minute, counted per IP. Action: Block.

**Done when:** the rule shows as enabled in the list.

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
**Why:** Google trusts the listing and the site more when they agree on name, address, phone and hours.

1. Open the profile at https://business.google.com.
2. Compare the name, address, phone and hours with `src/data/business.ts`, and fix any that differ.
3. Set the website to `https://chuystacos.com`.

**Done when:** every field matches `business.ts`, and the website field shows `https://chuystacos.com`.

## ⏳ Waiting on something else

- [ ] Ask Claude to set `workers_dev: false` and `preview_urls: false` in `wrangler.jsonc`, then remove the `workers.dev` hostname from the Turnstile widget · waiting on the test inquiry and the `www`/HTTPS fixes · added 2026-10-28
- [ ] Collect owner content: the family story and founding year, a pull quote, catering package names, descriptions and pricing, the Instagram and Facebook URLs, a hero photo, menu photos and a PDF menu. To see where each one goes, run `grep -rn "TODO(owner)" src/` · waiting on the owners · added 2026-10-28

## ✅ Done recently

- 2026-10-29 Deployed to the custom domain with `wrangler deploy --domain chuystacos.com` (§6)
- 2026-10-29 Set `RESEND_API_KEY` and `TURNSTILE_SECRET_KEY` as Worker secrets (§5)
- 2026-10-29 Verified `mail.chuystacos.com` in Resend (§4)
- 2026-10-29 Created the Turnstile widget and put the production site key in the site; Claude committed it as `76ef0fb` (§3)
- 2026-10-29 Moved DNS to Cloudflare and created the `chuys-web` Worker (§1–2)
