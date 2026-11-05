# Documentation

The project's documentation tree, organized by the standard numbered convention.

## Map

| Section | Contents |
| --- | --- |
| [`00-overview/`](./00-overview/README.md) | What this project is and where to go next |
| [`01-architecture/`](./01-architecture/README.md) | System design, tech stack, component model |
| [`04-development/`](./04-development/README.md) | Setup, scripts, conventions, common tasks, troubleshooting |
| [`05-guides/`](./05-guides/cloudflare-setup.md) | Cloudflare Workers, Turnstile, Resend, and DNS setup runbook |

Other top-level docs:

- [`../README.md`](../README.md) — quick-start and editing guide
- [`../CLAUDE.md`](../CLAUDE.md) — AI-agent context
- [`../API.md`](../API.md) — `/api/inquiry` reference
- [`../HUMAN.md`](../HUMAN.md) — operator and owner tasks the agent can't do
- [`../BACKLOG.md`](../BACKLOG.md) — agent-doable code work (`B-n` IDs) and the Lighthouse baseline
- [`../HANDOFF.md`](../HANDOFF.md) — where the last session left off
- [`menu/square-catalog.csv`](./menu/square-catalog.csv) — trimmed Square catalog that `fullMenu` is checked against (`pnpm menu:pull`)

## Skipped (for now)

`02-features/`, `03-api/`, `06-planning/` — not warranted for a single-page site with one endpoint. Promote a topic into its own directory when there's enough material to fill it.

---
Last updated: 2026-11-05
