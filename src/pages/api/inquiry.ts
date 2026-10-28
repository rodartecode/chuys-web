import { env } from "cloudflare:workers";
import { business, inquiry } from "@data/business";
import type { APIRoute } from "astro";

export const prerender = false;

const MAX_GUESTS = 2000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;"
  );

/** Drop ASCII control characters except tab, newline and carriage return. */
function stripControlChars(value: string): string {
  let out = "";
  for (const ch of value) {
    const code = ch.charCodeAt(0);
    const isControl = (code < 32 && code !== 9 && code !== 10 && code !== 13) || code === 127;
    if (!isControl) out += ch;
  }
  return out;
}

/** Coerce an untrusted field to a trimmed string capped at `max` characters. */
function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return stripControlChars(value).trim().slice(0, max);
}

/** True for a real calendar date in YYYY-MM-DD form that isn't in the past. */
function isUpcomingDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return false;
  // Workers run in UTC; allow "yesterday" so evening submissions in Pacific time aren't rejected.
  const earliest = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return value >= earliest;
}

async function verifyTurnstile(secret: string, token: string, ip: string | null): Promise<boolean> {
  const body = new FormData();
  body.set("secret", secret);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  if (!res.ok) return false;
  const outcome = (await res.json()) as { success?: boolean };
  return outcome.success === true;
}

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return json(400, { ok: false, error: "Invalid JSON body" });
  }

  // Honeypot — silently 200 so bots don't learn anything
  if (clean(body.company, 10)) {
    return json(200, { ok: true });
  }

  const name = clean(body.name, 100);
  const email = clean(body.email, 254);
  const phone = clean(body.phone, 30);
  const eventDate = clean(body.eventDate, 10);
  const guestCount = clean(body.guestCount, 4);
  const eventType = clean(body.eventType, 50);
  const message = clean(body.message, 5000);

  const errors: string[] = [];
  if (!name) errors.push("Name is required (max 100 characters).");
  if (!EMAIL.test(email)) errors.push("A valid email is required.");
  if (!isUpcomingDate(eventDate)) errors.push("Event date must be today or later.");
  const guests = Number(guestCount);
  if (!/^\d+$/.test(guestCount) || guests < 1 || guests > MAX_GUESTS) {
    errors.push(`Guest count must be between 1 and ${MAX_GUESTS}.`);
  }

  if (errors.length) {
    return json(400, { ok: false, errors });
  }

  const ip = request.headers.get("CF-Connecting-IP");
  if (env.TURNSTILE_SECRET_KEY) {
    const token = clean(body["cf-turnstile-response"], 4096);
    const human = token ? await verifyTurnstile(env.TURNSTILE_SECRET_KEY, token, ip) : false;
    if (!human) return json(400, { ok: false, error: "captcha" });
  } else {
    console.warn("TURNSTILE_SECRET_KEY is not set; skipping bot verification");
  }

  if (!env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set; cannot deliver inquiry");
    return json(500, { ok: false, error: "Server misconfigured" });
  }

  const subject = `New catering inquiry: ${name} — ${eventDate}`;

  const html = `
    <h2>New catering inquiry</h2>
    <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
    ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
    <p><strong>Event date:</strong> ${escapeHtml(eventDate)}</p>
    <p><strong>Guest count:</strong> ${guests}</p>
    ${eventType ? `<p><strong>Event type:</strong> ${escapeHtml(eventType)}</p>` : ""}
    ${message ? `<p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>` : ""}
    <hr>
    <p><em>Submitted via the ${escapeHtml(business.name)} inquiry form.</em></p>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${business.name} Inquiries <${inquiry.from}>`,
        to: [inquiry.to],
        reply_to: email,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      console.error("Resend rejected the message", res.status, await res.text());
      return json(500, { ok: false, error: "Failed to send email" });
    }

    return json(200, { ok: true });
  } catch (err) {
    console.error("Inquiry API error:", err);
    return json(500, { ok: false, error: "Unexpected server error" });
  }
};

export const GET: APIRoute = () =>
  new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
