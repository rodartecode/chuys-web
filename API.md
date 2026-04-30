# API Reference

The site exposes one serverless endpoint. Everything else is statically prerendered.

## Overview

| | |
| --- | --- |
| Base URL (local) | `http://localhost:4321` |
| Base URL (prod) | The deployed Vercel domain |
| Auth | None — public endpoint |
| Rate limiting | Not implemented in v1 |
| Persistence | None — submissions are emailed, not stored |

---

## `POST /api/inquiry`

Accepts a catering-inquiry payload, validates it, and emails the formatted submission to the address in `INQUIRY_TO_EMAIL` via Resend.

**Source**: [`src/pages/api/inquiry.ts`](./src/pages/api/inquiry.ts)
**Runtime**: Vercel serverless function (`export const prerender = false`)

### Request

- **Method**: `POST`
- **Content-Type**: `application/json`
- **Body**: JSON object

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | string | yes | 1–100 characters |
| `email` | string | yes | RFC-ish format (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`), max 254 characters |
| `eventDate` | string | yes | ISO date string (the form sends `YYYY-MM-DD` from `<input type="date">`) |
| `guestCount` | string | yes | Numeric string — coerced via `Number()`, must not be `NaN` |
| `phone` | string | no | Free-form |
| `eventType` | string | no | One of: `Wedding`, `Corporate`, `Private Party`, `Quinceañera`, `Fundraiser`, `Other` |
| `message` | string | no | Max 5000 characters |
| `company` | string | no | **Honeypot** — leave empty. If set, the request is silently accepted (`200`) without sending an email. |

### Responses

#### `200 OK` — submission delivered (or honeypot triggered)

```json
{ "ok": true }
```

#### `400 Bad Request` — validation failed

```json
{
  "ok": false,
  "errors": [
    "Name is required (max 100 characters).",
    "A valid email is required."
  ]
}
```

The `errors` array contains all failing rules from this set:

- `Name is required (max 100 characters).`
- `A valid email is required.`
- `Event date is required.`
- `Guest count is required.`
- `Message is too long (max 5000 characters).`

#### `400 Bad Request` — malformed JSON

```json
{ "ok": false, "error": "Invalid JSON body" }
```

#### `500 Internal Server Error` — server-side failure

```json
{ "ok": false, "error": "Server misconfigured" }
```

or

```json
{ "ok": false, "error": "Failed to send email" }
```

or

```json
{ "ok": false, "error": "Unexpected server error" }
```

`"Server misconfigured"` is returned when any of `RESEND_API_KEY`, `INQUIRY_TO_EMAIL`, or `FROM_EMAIL` is missing at request time.

### Email behavior

When validation passes and Resend accepts the request:

- **From**: `Chuy's Tacos Inquiries <{FROM_EMAIL}>`
- **To**: `INQUIRY_TO_EMAIL`
- **Reply-To**: the `email` field from the submission
- **Subject**: `New catering inquiry: {name} — {eventDate}`
- **Body**: HTML — name, email, optional phone, event date, guest count, optional event type, optional message. All user-supplied values are HTML-escaped server-side.

### Curl examples

Successful submission:

```bash
curl -X POST http://localhost:4321/api/inquiry \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana Reyes",
    "email": "ana@example.com",
    "eventDate": "2026-06-15",
    "guestCount": "75",
    "eventType": "Wedding",
    "message": "Outdoor reception, two stations."
  }'
# → {"ok":true}
```

Validation failure:

```bash
curl -X POST http://localhost:4321/api/inquiry \
  -H "Content-Type: application/json" \
  -d '{"name":"","email":"bad","eventDate":"","guestCount":""}'
# → 400, {"ok":false,"errors":[...]}
```

Honeypot (silent success):

```bash
curl -X POST http://localhost:4321/api/inquiry \
  -H "Content-Type: application/json" \
  -d '{"name":"Bot","email":"bot@x.com","eventDate":"2026-06-01","guestCount":"50","company":"spam"}'
# → 200, {"ok":true}  (no email sent)
```

### Environment variables

| Var | Required | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | Generate at [resend.com/api-keys](https://resend.com/api-keys) |
| `INQUIRY_TO_EMAIL` | yes | Address that receives inquiries |
| `FROM_EMAIL` | yes | Sender address; must be on a Resend-verified domain |

### Notes for future work

- No rate limiting in v1 — add Vercel edge middleware or a Resend audience-side check if abuse appears.
- No persistence — submissions exist only in the recipient inbox. If we ever need history, the cleanest move is forwarding to a public inquiry endpoint on `catering-event-manager` rather than adding a DB here.
- The honeypot is the only spam protection; it's effective against naive bots but not targeted abuse.

---
Last updated: 2026-04-29
