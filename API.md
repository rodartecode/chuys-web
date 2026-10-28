# API Reference

The site exposes one server endpoint. Everything else is statically prerendered.

## Overview

| | |
| --- | --- |
| Base URL (local) | `http://localhost:4321` (`pnpm dev`) or `http://localhost:8787` (`pnpm preview`, real Workers runtime) |
| Base URL (prod) | `https://chuystacos.com` |
| Auth | None — public endpoint, bot-checked with Cloudflare Turnstile |
| Rate limiting | Optional Cloudflare WAF rule (see [`docs/05-guides/cloudflare-setup.md`](./docs/05-guides/cloudflare-setup.md)) |
| Persistence | None — submissions are emailed, not stored |

---

## `POST /api/inquiry`

Accepts a catering-inquiry payload, validates it, verifies the Turnstile token, and emails the formatted submission via Resend.

**Source**: [`src/pages/api/inquiry.ts`](./src/pages/api/inquiry.ts)
**Runtime**: Cloudflare Worker (`export const prerender = false`; `wrangler.jsonc` routes `/api/*` to the Worker before the asset layer)

### Request

- **Method**: `POST`
- **Content-Type**: `application/json`
- **Body**: JSON object

String fields have ASCII control characters stripped and are trimmed and truncated to their max length before validation.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | string | yes | 1–100 characters |
| `email` | string | yes | `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`, max 254 characters |
| `eventDate` | string | yes | Real calendar date as `YYYY-MM-DD`, not in the past (UTC yesterday is accepted to cover US time zones) |
| `guestCount` | string | yes | Whole number, 1–2000 |
| `phone` | string | no | Max 30 characters |
| `eventType` | string | no | Max 50 characters. The form sends one of `Wedding`, `Corporate`, `Private Party`, `Quinceañera`, `Fundraiser`, `Other` |
| `message` | string | no | Max 5000 characters (longer input is truncated) |
| `cf-turnstile-response` | string | yes* | Turnstile token; the widget adds this field to the form. *Skipped (with a warning log) when `TURNSTILE_SECRET_KEY` isn't set. |
| `company` | string | no | **Honeypot** — leave empty. If set, the request is silently accepted (`200`) without sending an email. |

Checks run in this order: honeypot → field validation → Turnstile → send.

### Responses

#### `200 OK` — submission delivered (or honeypot triggered)

```json
{ "ok": true }
```

#### `400 Bad Request` — validation failed

```json
{
  "ok": false,
  "errors": ["A valid email is required.", "Guest count must be between 1 and 2000."]
}
```

The `errors` array contains every failing rule from this set:

- `Name is required (max 100 characters).`
- `A valid email is required.`
- `Event date must be today or later.`
- `Guest count must be between 1 and 2000.`

#### `400 Bad Request` — Turnstile failed or token missing

```json
{ "ok": false, "error": "captcha" }
```

The form shows "We couldn't verify you're human" and resets the widget.

#### `400 Bad Request` — malformed JSON or a non-object body

```json
{ "ok": false, "error": "Invalid JSON body" }
```

#### `405 Method Not Allowed` — any `GET`

#### `500 Internal Server Error` — server-side failure

| `error` | Cause |
| --- | --- |
| `Server misconfigured` | `RESEND_API_KEY` secret not set |
| `Failed to send email` | Resend returned a non-2xx (status and body are logged) |
| `Unexpected server error` | Network failure reaching Resend |

### Email behavior

When validation passes and Resend accepts the request:

- **From**: `Chuy's Tacos Inquiries <inquiry.from>`
- **To**: `inquiry.to`
- **Reply-To**: the `email` field from the submission
- **Subject**: `New catering inquiry: {name} — {eventDate}`
- **Body**: HTML containing the name, email, optional phone, event date, guest count, optional event type and optional message. All user-supplied values are HTML-escaped server-side.

`inquiry.to` and `inquiry.from` live in [`src/data/business.ts`](./src/data/business.ts). They're not secrets. The `from` address must be on a domain verified in Resend (`mail.chuystacos.com`).

### Curl examples

Use `pnpm preview` (port 8787) to hit the real Workers runtime. `Sec-Fetch-Mode: navigate` makes curl behave like a browser for the asset layer. `.dev.vars.example` ships Cloudflare's always-pass Turnstile secret, so the dummy token below passes.

Successful submission:

```bash
curl -X POST http://localhost:8787/api/inquiry \
  -H "Content-Type: application/json" -H "Sec-Fetch-Mode: navigate" \
  -d '{
    "name": "Ana Reyes",
    "email": "ana@example.com",
    "eventDate": "2027-06-15",
    "guestCount": "75",
    "eventType": "Wedding",
    "message": "Outdoor reception, two stations.",
    "cf-turnstile-response": "XXXX.DUMMY.TOKEN.XXXX"
  }'
# → {"ok":true}   (500 "Failed to send email" with the placeholder RESEND_API_KEY)
```

Validation failure:

```bash
curl -X POST http://localhost:8787/api/inquiry \
  -H "Content-Type: application/json" \
  -d '{"name":"","email":"bad","eventDate":"2020-01-01","guestCount":"-5"}'
# → 400, {"ok":false,"errors":[...]}
```

Honeypot (silent success):

```bash
curl -X POST http://localhost:8787/api/inquiry \
  -H "Content-Type: application/json" \
  -d '{"name":"Bot","email":"bot@x.com","eventDate":"2027-06-01","guestCount":"50","company":"spam"}'
# → 200, {"ok":true}  (no email sent)
```

### Secrets

Locally these come from `.dev.vars` (copy `.dev.vars.example`). In production they're set with `pnpm exec wrangler secret put <NAME>` and read with `import { env } from "cloudflare:workers"`.

| Secret | Required | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | Sending-only key from [resend.com/api-keys](https://resend.com/api-keys) |
| `TURNSTILE_SECRET_KEY` | yes in prod | From the Turnstile widget. If unset, bot verification is skipped. |

### Notes for future work

- No persistence. Submissions exist only in the recipient's inbox. If history is ever needed, forward to a public inquiry endpoint on `catering-event-manager` rather than adding a database here.

---
Last updated: 2026-10-28
