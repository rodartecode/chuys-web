# 00 — Overview

Entry point for the project's documentation tree.

## What this project is

A single-page Astro landing site for **Chuy's Tacos** with one inquiry endpoint. The marketing page is fully prerendered HTML; the only dynamic surface is `POST /api/inquiry`, which checks Turnstile and sends catering submissions through Resend.

The project is intentionally small. v1 ships a placeholder-content site that *exists* and accepts catering inquiries — real content (photos, copy, hours, packages) is filled in over time.

## Where to go next

| Looking for… | Read |
| --- | --- |
| Install + run locally | [`../04-development/README.md`](../04-development/README.md) |
| How the site is put together | [`../01-architecture/README.md`](../01-architecture/README.md) |
| The inquiry endpoint contract | [`../../API.md`](../../API.md) |
| Editable copy / content | [`../../README.md#editing-content`](../../README.md#editing-content) |
| Deploying / Cloudflare, Resend, Turnstile setup | [`../05-guides/cloudflare-setup.md`](../05-guides/cloudflare-setup.md) |
| AI-agent context for this repo | [`../../CLAUDE.md`](../../CLAUDE.md) |

## Key facts

- **Framework**: Astro 7, static output, Cloudflare adapter
- **Styling**: Tailwind v4 (CSS-first `@theme` tokens) + per-component `<style>` blocks
- **Email**: Resend (bot-checked with Cloudflare Turnstile)
- **Tooling**: Biome (TS/JS/JSON/Astro), Stylelint (CSS / `<style>` blocks), TypeScript strict
- **Tests**: Vitest unit tests for `/api/inquiry` and a Playwright smoke test of the form (`pnpm test`)
- **Hosting**: Cloudflare Workers (static assets), `chuystacos.com`

## Out of scope for v1

- Multi-page routes, real photography, real brand colors
- Online ordering or POS integration
- Persistence of inquiries (they're emailed, not stored)
- Spanish localization
- Integration with `catering-event-manager` (deliberately decoupled)

---
Last updated: 2026-10-28
