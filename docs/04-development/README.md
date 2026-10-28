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

The dev server boots without `.dev.vars`. Only `/api/inquiry` is affected: Turnstile is skipped (with a warning) and the endpoint returns `500 {"error":"Server misconfigured"}` until `RESEND_API_KEY` is set. `.dev.vars.example` ships Cloudflare's always-pass Turnstile test secret, and `src/data/business.ts` uses the matching always-pass site key until the real one is set.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Astro dev server on port 4321 |
| `pnpm build` | Produces `dist/client` (static assets) and `dist/server` (Worker + generated `wrangler.json`) |
| `pnpm preview` | Builds, then runs `wrangler dev` on port 8787 (the real workerd runtime) |
| `pnpm deploy` | Builds, then `wrangler deploy` (normally done by Workers Builds on push) |
| `pnpm cf:types` | `wrangler types` |
| `pnpm typecheck` | `astro check` — type-checks `.astro` and `.ts` |
| `pnpm lint` | Biome lint over `src/` |
| `pnpm lint:fix` | Biome auto-fix |
| `pnpm lint:styles` | Stylelint over `.css` and `.astro` `<style>` blocks |
| `pnpm format` | Biome format |

Before committing, the minimum useful gate is:

```bash
pnpm typecheck && pnpm lint && pnpm lint:styles && pnpm build
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

Edit `src/data/menu.ts`. Push a new object to `menuHighlights`. The grid auto-fills.

### Add a catering package

Edit the `packages` array in the frontmatter of `src/components/Catering.astro`.

### Change brand colors

Edit `@theme` tokens in `src/styles/global.css`.

### Add a new section

1. Create `src/components/MySection.astro` with a `<section id="my-id">`.
2. Import and render it in `src/pages/index.astro` between the existing sections.
3. Add `{ href: "#my-id", label: "…" }` to the `navLinks` array in `src/components/Header.astro`.

### Add a new form field

1. Add the input to `src/components/InquiryForm.astro`.
2. Read it with `clean(body.field, max)` and add any validation rule in `src/pages/api/inquiry.ts`, then include it in the email HTML (escaped).
3. Update [`API.md`](../../API.md) — the request schema is the source of truth.

## Troubleshooting

### `pnpm build` fails with module-resolution errors

Run `pnpm install` first. If those errors persist after install, delete `node_modules` and `.astro/`, then reinstall.

### Inquiry form returns `500 {"error":"Server misconfigured"}`

`RESEND_API_KEY` is missing. Check `.dev.vars` locally. In production, run `pnpm exec wrangler secret list`, and re-run `wrangler secret put` from an interactive terminal if needed, because a non-TTY run can store an empty value.

### Inquiry form shows "We couldn't verify you're human"

The endpoint returned `{"error":"captcha"}`. Either the token was missing or expired, or the site key and secret don't belong to the same Turnstile widget. Also check that the widget's hostname list includes the host you're testing on (`localhost`, the `workers.dev` host, or `chuystacos.com`).

### Form POST returns a blank 405 in production

`assets.run_worker_first` is missing `/api/*` in `wrangler.jsonc`. The asset layer answered the request before the Worker saw it.

### Inquiry form 200s but no email arrives

- The honeypot triggered (you posted a non-empty `company` field).
- Resend rejected the message. Check the Worker logs: dashboard → Workers → `chuys-tacos` → Logs (observability is enabled), or run `pnpm exec wrangler tail`.
- `inquiry.from` in `src/data/business.ts` isn't on a domain verified in Resend (`mail.chuystacos.com`).

---
Last updated: 2026-10-28
