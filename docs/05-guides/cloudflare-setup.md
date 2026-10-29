# Cloudflare setup

One-time steps to take the site live on **chuystacos.com**. Most of them happen in the Cloudflare and Resend dashboards. This is adapted from `paint-web`'s runbook (`docs/05-guides/cloudflare-setup.md`), which uses the same stack.

Order matters: do the DNS zone first, and attach the custom domain last.

## 1. DNS zone

`chuystacos.com` already has a mailbox (`chuy@chuystacos.com`), so **protect the mail records**.

If the domain isn't a Cloudflare zone yet:

1. Before touching anything, export or screenshot the current DNS records at the existing DNS host. Note every MX, SPF (`TXT v=spf1…`), DKIM and DMARC record.
2. In Cloudflare, go to Add a domain → `chuystacos.com` → Free plan. Compare the auto-imported records against your export, and add any that are missing, **especially MX and mail TXT records**.
3. Switch the nameservers at the registrar to the two that Cloudflare assigns, then wait for the zone to go Active.
4. Send a test email to `chuy@chuystacos.com` to confirm mail still arrives.

The canonical host is the **apex** (`https://chuystacos.com`), which matches `site` in `astro.config.mjs` and `business.url`.

## 2. Worker with git deploys

Push this repo to GitHub first. Then go to Workers & Pages → Create → Import a repository → this repo.

| Setting | Value |
|---|---|
| Root directory | `/` |
| Build command | `pnpm build` |
| Deploy command | `pnpm exec wrangler deploy` |
| Production branch | `main` |
| Build variable | `PNPM_VERSION` = the version in the `packageManager` field (`11.21.0`) |

The Worker name (`chuys-tacos`) comes from `wrangler.jsonc`. The first deploy lands on `chuys-tacos.<account>.workers.dev`.

The build image defaults to pnpm 10, which ignores the pnpm 11 settings in `pnpm-workspace.yaml`. The `PNPM_VERSION` variable pins it. Node comes from `.node-version`.

## 3. Turnstile

Turnstile → Add widget:

- **Hostnames**: `chuystacos.com`, `www.chuystacos.com`, and `chuys-tacos.<account>.workers.dev` for testing before cutover. The Worker is named `chuys-tacos`, not `chuys-web`.
- **Mode**: Managed

Put the **site key** in `src/data/business.ts` (`inquiry.turnstileSiteKey`) as the production branch, then commit. The **secret key** goes in the Worker secret in step 5.

For local work, `pnpm dev` uses Cloudflare's always-pass test site key (the `import.meta.env.DEV` branch), and `.dev.vars.example` ships the matching test secret. So the widget doesn't need `localhost` in its hostname list. `pnpm preview` is a production build, so its widget uses the real key and fails on `localhost`; test the endpoint there with the curl in [`API.md`](../../API.md) instead. Cloudflare publishes the full set of test keys on the Turnstile testing page.

## 4. Resend

Resend → Domains → add **`mail.chuystacos.com`**. Use a sending subdomain rather than the apex, because the apex already has a mail provider. Add the records Resend lists to the Cloudflare zone, set them to DNS-only (grey cloud), and wait for verification. A strict DMARC policy on the apex still passes, because Resend signs DKIM with the verified subdomain.

Create an API key with **sending access only** and keep it for step 5.

The sender address is `inquiry.from` in `src/data/business.ts` (`inquiries@mail.chuystacos.com`). Inquiries go to `inquiry.to` (`chuy@chuystacos.com`).

## 5. Secrets

Run these from the repo root, **in an interactive terminal**. Each command prompts for its value. Without a TTY (for example Claude Code's `!` prefix), wrangler can upload an empty secret and still report success.

```bash
pnpm exec wrangler secret put RESEND_API_KEY
pnpm exec wrangler secret put TURNSTILE_SECRET_KEY
pnpm exec wrangler secret list        # confirm both exist
```

Before attaching the domain, send a real inquiry through the `workers.dev` URL as a smoke test.

## 6. Custom domain

Attach the apex from the repo root:

```bash
pnpm build && pnpm exec wrangler deploy --domain chuystacos.com
```

This creates the Custom Domain, its DNS record and its certificate. The dashboard's Domains → "Add Domain" button can open the new-zone onboarding wizard instead, which fails silently for a host in an existing zone, so use the command above.

- A Custom Domain can't be created on top of an existing A, AAAA or CNAME record on `chuystacos.com`, such as a parking page. Delete that record first, and **leave MX/TXT mail records alone**.
- For `www`, add an `AAAA` record with content `100::`, **proxied**. Then add a zone Redirect Rule using the "Redirect from WWW to root" template (301).
- Turn on SSL/TLS → Edge Certificates → Always Use HTTPS. Check with `curl -I http://chuystacos.com/`, which should return a 301 to https.
- Later Workers Builds deploys keep the Custom Domain attached. It isn't listed in `wrangler.jsonc`.
- Once the domain works, set `"workers_dev": false` and `"preview_urls": false` in `wrangler.jsonc`, so the `workers.dev` copy stops serving duplicate pages. Also remove that hostname from the Turnstile widget.

## 7. Search

- **Google Search Console**: verify the domain with the DNS TXT record, then submit `https://chuystacos.com/sitemap-index.xml`.
- **Google Business Profile**: claim or update the listing with exactly the name, address, phone and hours in `src/data/business.ts`, and set the website to `https://chuystacos.com`.
- **Rich Results Test**: run it on the homepage to validate the `Restaurant` JSON-LD.
- Bing Webmaster Tools can import from Search Console.

## 8. Optional: rate limit

Security → WAF → Rate limiting rules. Match `http.request.uri.path eq "/api/inquiry"` with method `POST`, allow 5 requests per minute per IP, and set the action to Block.

---
Last updated: 2026-10-28
