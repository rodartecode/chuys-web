# 04 — Development

Setup, scripts, and conventions.

## Prerequisites

- Node ≥ 22 (the project's `engines.node`; volta-locked to 24.4.1 elsewhere in the workspace)
- pnpm ≥ 10
- A Resend account if you want to test the inquiry form end-to-end

## First-time setup

```bash
pnpm install
cp .env.example .env
# fill in RESEND_API_KEY, INQUIRY_TO_EMAIL, FROM_EMAIL
pnpm dev
```

The dev server boots without env vars set. Only `/api/inquiry` is affected — it returns `500 {"error":"Server misconfigured"}` until they're populated.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Astro dev server on port 4321 |
| `pnpm build` | Produces `dist/` (static) and `.vercel/output/` (function) |
| `pnpm preview` | Serves the production build locally |
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
- CSS is excluded from Biome (`files.includes` excludes `**/*.css`, plus `css.linter` and `css.formatter` are disabled). The reason: Biome 2.4 doesn't yet recognize Tailwind v4's `@theme` directive.

### Placeholders

Every editable string the owners need to replace is marked with a `TODO` comment in code. Before a real launch:

```bash
grep -rn "TODO" src/ public/ docs/ astro.config.mjs
```

…and resolve each one.

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
2. Add the field to the `InquiryPayload` interface and validation in `src/pages/api/inquiry.ts`.
3. Update [`API.md`](../../API.md) — the request schema is the source of truth.

## Troubleshooting

### `pnpm build` fails with module-resolution errors

Run `pnpm install` first. If those errors persist after install, delete `node_modules` and `.astro/`, then reinstall.

### Editor flags `import.meta.env` errors but `pnpm typecheck` is clean

The editor's TypeScript language server is using its default config, not Astro's. `astro check` is the source of truth. Restart the TS server in your editor or run `pnpm exec astro sync` to regenerate `.astro/types.d.ts`.

### Inquiry form returns `500 {"error":"Server misconfigured"}`

One of the three Resend env vars is missing. Check `.env` (locally) or Vercel project settings (in production).

### Inquiry form 200s but no email arrives

- The honeypot triggered (you posted a non-empty `company` field).
- Resend rejected the message — check the function logs in Vercel.
- `FROM_EMAIL` is on a domain you haven't verified in Resend — Resend will accept the API call and silently drop the message.

---
Last updated: 2026-04-29
