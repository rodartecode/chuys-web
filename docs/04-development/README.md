# 04 — Development

Setup, scripts, and conventions.

## Prerequisites

- Node 24 (`.node-version`; Astro 7 needs ≥ 22.23.4)
- pnpm 11 (`packageManager` in `package.json`; build scripts are allow-listed in `pnpm-workspace.yaml`)
- A Resend API key if you want to test email delivery end-to-end (everything else works with the placeholder)

## First-time setup

```bash
pnpm install
cp .dev.vars.example .dev.vars
# optional: put a real RESEND_API_KEY in .dev.vars to actually send email
pnpm dev
```

The dev server boots without `.dev.vars`. Only `/api/inquiry` is affected: Turnstile is skipped (with a warning) and the endpoint returns `500 {"error":"Server misconfigured"}` until `RESEND_API_KEY` is set. `.dev.vars.example` ships Cloudflare's always-pass Turnstile test secret, and `src/data/business.ts` uses the matching always-pass site key under `pnpm dev` (the production key in builds).

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Astro dev server on port 4321 |
| `pnpm build` | Produces `dist/client` (static assets) and `dist/server` (Worker + generated `wrangler.json`) |
| `pnpm preview` | Builds, then runs `wrangler dev` on port 8787 (the real workerd runtime) |
| `pnpm cf:deploy` | Builds, then `wrangler deploy` (normally done by Workers Builds on push) |
| `pnpm cf:types` | `wrangler types` |
| `pnpm typecheck` | `astro check` — type-checks `.astro` and `.ts`, including `tests/` |
| `pnpm test` | `test:unit`, then `test:e2e` |
| `pnpm test:unit` | Vitest over `tests/unit/` |
| `pnpm test:e2e` | Playwright over `tests/e2e/`. Starts `pnpm dev` on 4321, or reuses one that's already running |
| `pnpm lint` | Biome lint over `src/`, `tests/`, `scripts/` and the root `*.config.ts` files |
| `pnpm lint:fix` | Biome auto-fix |
| `pnpm lint:styles` | Stylelint over `.css` and `.astro` `<style>` blocks |
| `pnpm format` | Biome format |
| `pnpm menu:pull` | Rewrites `docs/menu/square-catalog.csv` from the live Square catalog (read-only; needs the Square CLI signed in). See [Square CLI](#square-cli) |
| `pnpm skills:square` | Installs the Square CLI's agent skills for this project, trimmed to 6 (gitignored, once per machine) |

Before committing, the minimum useful gate is:

```bash
pnpm typecheck && pnpm lint && pnpm lint:styles && pnpm test && pnpm build
```

## Conventions

### TypeScript

- `astro/tsconfigs/strict` is the base. No `any` without a comment justifying it.
- TypeScript is held at 6.x. `@astrojs/check` peers `^5 || ^6` and its language server can't run on the TS 7 native compiler yet ([withastro/astro#17268](https://github.com/withastro/astro/issues/17268)). Don't bump to 7 until that's resolved.
- Path aliases: `@components/*`, `@layouts/*`, `@data/*`, `@styles/*`, `@/*`. Use them — don't reach into `src/` with relative parents.
- Named exports preferred over default exports (per the user's TS conventions).

### Astro components

- One section per file under `src/components/`.
- Frontmatter holds typed data (event types, packages, nav links). Keep that data near the component that uses it unless it's referenced from more than one place — then promote to `src/data/`.
- Use Astro's scoped `<style>` blocks for section-level layout. Reach for Tailwind utilities only when a class is genuinely reused across components.
- All colors / fonts come from `var(--color-*)` / `var(--font-*)` tokens defined in `src/styles/global.css`.

### Styling tokens

Tokens live in `src/styles/global.css` under `@theme`. Edit them once, see them everywhere.

```css
@theme {
  --color-cream: #faf3e7;
  --color-terracotta: #b34a2a;
  --color-mustard: #d99a2b;
  /* ... */
}
```

When real brand colors arrive, edit those values — not individual components.

### Tests

- **Unit (Vitest, `tests/unit/`)** run in plain Node.
  - `menu.test.ts` matches every row of `docs/menu/square-catalog.csv` to exactly one `fullMenu` entry, and every entry back to a row. Drinks fold into option lines, and `squareVariants` covers the style versions. It also checks there are no prices.
  - `inquiry.test.ts` runs `src/pages/api/inquiry.ts`, covering validation, the honeypot, Turnstile (including the error-code logs) and the Resend payload. `vitest.config.ts` aliases `cloudflare:workers` to `tests/stubs/cloudflare-workers.ts`, whose `env` object the tests set per case, and each test stubs `fetch` by URL. Nothing leaves the machine. Vitest doesn't read tsconfig paths, so a new path alias used by the endpoint needs adding to `vitest.config.ts` too.
- **Browser (Playwright, `tests/e2e/`)** has four specs: `inquiry-form`, `full-menu` (every item renders, there are no prices, and it fits 375px), `order-online` (the Cash App links and JSON-LD `OrderAction`) and `social`. They load the dev server in your installed Chrome (`channel: "chrome"`), so there's no browser download. `order-online.spec.ts` and `social.spec.ts` copy their URLs from `business.ts` by hand, because Playwright can't import a module that reads `import.meta.env`. Update them when those URLs change. Without Chrome, run `pnpm exec playwright install chromium` and drop `channel` from `playwright.config.ts`. The test blocks requests to `challenges.cloudflare.com` and never submits the form, so it doesn't reach Turnstile or Resend.
- Unit tests use a fixed clock (2026-11-15) because the endpoint rejects past event dates.
- Keep tests out of `src/pages/`, where Astro would turn them into routes.

### Linting boundary

- **Biome** owns TS, JS, JSON, and Astro frontmatter / scripts.
- **Stylelint** owns CSS files and Astro `<style>` blocks.
- CSS is excluded from Biome (`files.includes` excludes `**/*.css`, plus `css.linter` and `css.formatter` are disabled). The reason: Biome (as of 2.4, when this was set up) didn't recognize Tailwind v4's `@theme` directive.

### Placeholders

Owner content that's still pending is marked with a `TODO(owner)` comment, and the component renders a graceful fallback in the meantime (the block is hidden or the copy reworded). Placeholder text never appears on the page. To find what's outstanding:

```bash
grep -rn "TODO(owner)" src/
```

After any content change, check that no placeholder leaks into the build:

```bash
pnpm build && grep -nE "TODO|TBD" dist/client/index.html   # should print nothing
```

## Common tasks

### Add a menu item

Edit `src/data/menu.ts`. For a meat card ("Pick your meat"), push a new object to `menuHighlights`; the grid auto-fills. Dishes built on one meat, such as the Quesabirria, belong in `fullMenu` instead. For the full menu, run `pnpm menu:pull` to bring `docs/menu/square-catalog.csv` up to date with Square, then add the item to its category in `fullMenu`. The unit test fails until the two agree. To show a name the owners haven't changed in Square yet, set `name` to the new one and `squareName` to Square's; once Square is renamed, re-pull and drop `squareName`. Square's separate "Chuy's Style X" and "Street Style X" items go in `squareVariants` on item X, whose description covers both styles, instead of getting their own entries. Never add prices: Cash App is the source of truth.

### Square CLI

The [Square CLI](https://developer.squareup.com/docs/cli) (`npm install -g @square/cli`) reads the owners' Square account: catalog, location hours and phone, channels, and sales reports.

- **Sign in:** `square auth login` opens a browser for OAuth. The grant lasts about 30 days. It ignores access tokens, so it can't run in CI or Workers Builds. That's why `pnpm menu:pull` is a local step and the CSV is committed.
- **Live account:** there's no sandbox. `catalog item update`, `upsert` and `delete` change the owners' POS and the Cash App order page immediately, with no `--force` or preview step. `.claude/settings.json` allows read commands and makes Claude ask before any write.
- **Which items `menu:pull` keeps:** not archived, and sold in at least one active channel other than Point of Sale. That matches the export's "Square Online Item Visibility" column. Category is the reporting category.
- **Agent skills:** `pnpm skills:square` runs `square skills add --no-global` and keeps `square`, `square-cli`, `square-catalog`, `square-locations`, `square-reporting` and `square-online` out of ~107. They land in `.agents/skills/`, symlinked into `.claude/skills/`. Both folders are gitignored, because the skills are Square's proprietary files and the repo is public. Re-run it on each machine and after upgrading the CLI. To keep a different set, edit `KEEP` in `scripts/skills-square.mjs`.

### Add a catering package

Edit the `packages` array in the frontmatter of `src/components/Catering.astro`. Each package's `pricing` field is optional.

### Change contact details, hours, or social links

Edit `src/data/business.ts`. The Hero, Visit section, Footer and JSON-LD all pick up the change. Adding the first entry to `social` makes the footer's "Follow" column appear. `hours` (display rows) and `openingHours` (structured data) describe the same schedule, so keep them in sync.

### Swap the Turnstile site key

Replace the production branch of `inquiry.turnstileSiteKey` in `src/data/business.ts` (leave the dev test key), and set the matching secret with `pnpm exec wrangler secret put TURNSTILE_SECRET_KEY`.

### Change brand colors

Edit `@theme` tokens in `src/styles/global.css`.

### Add a new section

1. Create `src/components/MySection.astro` with a `<section id="my-id">`.
2. Import and render it in `src/pages/index.astro` between the existing sections.
3. Add `{ href: "#my-id", label: "…" }` to the `navLinks` array in `src/components/Header.astro`.

### Add a new form field

1. Add the input to `src/components/InquiryForm.astro`.
2. Read it with `clean(body.field, max)` and add any validation rule in `src/pages/api/inquiry.ts`, then include it in the email HTML (escaped).
3. Add cases for the new rule to `tests/unit/inquiry.test.ts`, and add the field to the `valid` payload there.
4. Update [`API.md`](../../API.md) — the request schema is the source of truth.

## Troubleshooting

### `pnpm build` fails with module-resolution errors

Run `pnpm install` first. If those errors persist after install, delete `node_modules` and `.astro/`, then reinstall.

### Inquiry form returns `500 {"error":"Server misconfigured"}`

`RESEND_API_KEY` is missing. Check `.dev.vars` locally. In production, run `pnpm exec wrangler secret list`, and re-run `wrangler secret put` from an interactive terminal if needed, because a non-TTY run can store an empty value.

### Inquiry form shows "We couldn't verify you're human"

The endpoint returned `{"error":"captcha"}`. Either the token was missing or expired, or the site key and secret don't belong to the same Turnstile widget. Also check that the widget's hostname list includes the host you're testing on (`chuystacos.com`). `pnpm dev` uses the always-pass test keys, so it never needs `localhost` listed; `pnpm preview` uses the real key, so its widget fails on `localhost`.

### Form POST returns a blank 405 in production

`assets.run_worker_first` is missing `/api/*` in `wrangler.jsonc`. The asset layer answered the request before the Worker saw it.

### Inquiry form 200s but no email arrives

- The honeypot triggered (you posted a non-empty `company` field).
- Resend rejected the message. Check the Worker logs: dashboard → Workers → `chuys-tacos` → Logs (observability is enabled), or run `pnpm exec wrangler tail`.
- `inquiry.from` in `src/data/business.ts` isn't on a domain verified in Resend (`mail.chuystacos.com`).

---
Last updated: 2026-11-05
