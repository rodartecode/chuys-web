# Waiting on you

> Tasks only you can do. Kept up to date by /document-and-clear and read by /catchup.
> Check one off by telling the agent, or delete it yourself. Full detail for each step is in the
> runbook [`docs/05-guides/cloudflare-setup.md`](docs/05-guides/cloudflare-setup.md); the § numbers point there.

**Updated:** 2026-11-05 · LAPTOP-ESEL9A3K

## ▶ Start here

### [ ] Send a test inquiry and check both inboxes · ⏱ 5 min · added 2026-10-29
**Why:** from 2026-10-29, every inquiry email Cc's `jesse@chuystacos.com` (`inquiry.cc` in `src/data/business.ts`). The mailbox exists in Google Workspace (confirmed 2026-11-04), but no inquiry has gone through since the Cc was added. This is also the first live check since the Turnstile hostnames were trimmed on 2026-11-04. Claude can't send the test, because production Turnstile blocks automated submits.

1. Send a test inquiry from https://chuystacos.com/#contact.
2. Check that it arrives in both `chuy@` and `jesse@`. While the form is open, also check that the event-type options are readable.

**Done when:** both inboxes have the inquiry, and Reply still goes to the address you entered.

## ⚡ Quick wins (≤10 min)

### [ ] Rename the barbacoa plate in Square · ⏱ 2 min · added 2026-11-04
**Why:** the site calls it "3 Crispy Barbacoa Taco Plate", so nobody confuses it with the barbacoa meat. The single taco is already renamed in Square ("Crispy Barbacoa Taco", done 2026-11-05), but the plate still says "3 Barbacoa Taco Plate" in Square and on the Cash App order page.

1. Square Dashboard → Items → rename "3 Barbacoa Taco Plate" to **3 Crispy Barbacoa Taco Plate**.
2. Tell the agent. It will run `pnpm menu:pull` and remove the last `squareName` from `src/data/menu.ts`.

**Done when:** the Cash App order page shows the Crispy name, and `menu.ts` has no `squareName` left.

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
**Why:** Google trusts the listing and the site more when they agree on name, address, phone and hours. The site's phone number is **(559) 385-6843**, which matches Square's location record (changed from …6847 on 2026-11-05), so make sure the listing shows that one. Winter hours started on 2026-11-04 (**Mon–Fri 10 AM – 4 PM**, weekends closed), so update the listing's hours too. When the hours change again, change them on the site (`business.ts`) and in the listing at the same time.

1. Open the profile at https://business.google.com.
2. Compare the name, address, phone and hours with `src/data/business.ts`, and fix any that differ.
3. Set the website to `https://chuystacos.com`.

**Done when:** every field matches `business.ts`, and the website field shows `https://chuystacos.com`.

## ⏳ Waiting on something else

- [ ] Collect owner content: the family story and founding year, a pull quote, catering package names, descriptions and pricing, a hero photo and a PDF menu. To see where each one goes, run `grep -rn "TODO(owner)" src/`. Menu photos are done: they come from Square (see Done recently). If the owners have photos of single meats (asada, pastor, and so on), the "Pick your meat" cards could use them too · waiting on the owners · added 2026-10-28
- [ ] Tell the agent when the winter hours end, with the new hours. It will update `business.ts`, and you'll update the Google Business Profile the same day · winter hours run until further notice, no end date planned · added 2026-11-04

## ✅ Done recently

- 2026-11-05 Said go ahead with the Square menu photos. 8 dish photos are now in the menu. You OK'd them, so it's worth letting the owners know their Square photos are on the site.

- 2026-11-05 Installed the Square CLI and signed it in. Square now has the Crispy Barbacoa Taco name and separate Chuy's Style and Street Style items, and the site matches. Confirmed (559) 385-6843 is the right phone (it's in Square).
- 2026-11-04 Flagged the masa and trompo copy and set the winter hours (Mon–Fri 10 AM – 4 PM). All three are live on the site.
- 2026-11-04 Answered Birria vs Quesabirria: Birria and Barbacoa are meats, while the Quesabirria and Crispy Barbacoa Taco are dishes. The cards became "Pick your meat".
- 2026-11-04 Supplied the Instagram and Facebook URLs, which are now in the footer and the JSON-LD
- 2026-11-04 Trimmed the Turnstile widget to `chuystacos.com` and `www.chuystacos.com`. Claude did this through the API, with your OK. No other widget setting changed.
- 2026-10-29 Pointed Workers Builds at `rodartecode/chuys-web` and fixed its deploy command; the first build (`6b95b7a`) deployed at 19:15 UTC