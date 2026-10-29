# Human tasks

Work that only a person can do: dashboards, DNS, secrets, and content from the owners. Tick items off as they're done. The full detail for each go-live step is in [`docs/05-guides/cloudflare-setup.md`](docs/05-guides/cloudflare-setup.md); the section numbers below point there.

## Go live

- [x] **§1 DNS zone.** Export the current DNS records first, especially MX, SPF, DKIM and DMARC. Add `chuystacos.com` to Cloudflare, check that the mail records came across, switch the nameservers, then send a test email to `chuy@chuystacos.com`.
- [x] **§2 Worker.** Workers & Pages → Import a repository → `rodartecode/chuys-web`. Build `pnpm build`, deploy `pnpm exec wrangler deploy`, branch `main`, build variable `PNPM_VERSION=11.21.0`.
- [x] **§3 Turnstile widget.** Hostnames `chuystacos.com`, `www.chuystacos.com`, and the `workers.dev` host. Mode: Managed.
  - [x] Send the **site key** to Claude (or paste it into `inquiry.turnstileSiteKey` in `src/data/business.ts`), then commit and push.
  - ⚠️ The real site key must be live **before or together with** the real secret. A test site key paired with the real secret fails every inquiry, and nothing else warns you.
- [x] **§4 Resend.** Add the domain `mail.chuystacos.com`, add its records to Cloudflare as DNS-only (grey cloud), and wait for it to verify. Create an API key with sending access only.
- [x] **§5 Secrets.** In a real interactive terminal, not Claude's `!` prefix:
  ```bash
  pnpm exec wrangler secret put RESEND_API_KEY
  pnpm exec wrangler secret put TURNSTILE_SECRET_KEY
  pnpm exec wrangler secret list
  ```
  - [ ] Smoke test: send an inquiry through the `workers.dev` URL and confirm it arrives.
- [ ] **§6 Custom domain.**
  - [x] Run `pnpm build && pnpm exec wrangler deploy --domain chuystacos.com`. Use this command, not the dashboard button.
  - [x] `www`: add a proxied `AAAA` record with content `100::`, then add the "Redirect from WWW to root" rule (301).
  - [ ] Turn on Always Use HTTPS. Check with `curl -I http://chuystacos.com/`, which should return a 301.

## After cutover

- [ ] Send a real inquiry from a phone. Confirm it arrives at `chuy@chuystacos.com` and that Reply goes to the customer.
- [ ] Ask Claude to set `workers_dev: false` and `preview_urls: false` in `wrangler.jsonc`. Then remove the `workers.dev` hostname from the Turnstile widget.
- [ ] **§7 Search.**
  - [ ] Google Search Console: verify the domain by DNS, then submit `https://chuystacos.com/sitemap-index.xml`.
  - [ ] Google Business Profile: the name, address, phone and hours must match `src/data/business.ts`. Set the website to `https://chuystacos.com`.
  - [ ] Run the Rich Results Test on the homepage.
  - [ ] Optional: import into Bing Webmaster Tools from Search Console.
- [ ] **§8 (optional) Rate limit.** Add a WAF rule for `POST /api/inquiry` that blocks more than 5 requests per minute per IP.

## Owner content

Collect these from the owners. Each one has a graceful fallback until it arrives, and `grep -rn "TODO(owner)" src/` lists where each one goes.

- [ ] Family origin story and founding year (About)
- [ ] A pull quote: an owner line or a customer review (About)
- [ ] Confirmed catering package names and descriptions, plus pricing (Catering)
- [ ] Instagram and Facebook URLs (Footer)
- [ ] Hero photo
- [ ] Menu item photos
- [ ] Downloadable PDF menu

---
Last updated: 2026-10-28
