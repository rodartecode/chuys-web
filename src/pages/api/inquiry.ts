import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

interface InquiryPayload {
  name?: string;
  email?: string;
  phone?: string;
  eventDate?: string;
  guestCount?: string;
  eventType?: string;
  message?: string;
  company?: string; // honeypot
}

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;"
  );

export const POST: APIRoute = async ({ request }) => {
  let body: InquiryPayload;
  try {
    body = (await request.json()) as InquiryPayload;
  } catch {
    return json(400, { ok: false, error: "Invalid JSON body" });
  }

  // Honeypot — silently 200 so bots don't learn anything
  if (body.company) {
    return json(200, { ok: true });
  }

  const errors: string[] = [];
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const eventDate = body.eventDate?.trim() ?? "";
  const guestCount = body.guestCount?.trim() ?? "";

  if (!name || name.length > 100) errors.push("Name is required (max 100 characters).");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    errors.push("A valid email is required.");
  }
  if (!eventDate) errors.push("Event date is required.");
  if (!guestCount || Number.isNaN(Number(guestCount))) {
    errors.push("Guest count is required.");
  }
  if (body.message && body.message.length > 5000) {
    errors.push("Message is too long (max 5000 characters).");
  }

  if (errors.length) {
    return json(400, { ok: false, errors });
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.INQUIRY_TO_EMAIL;
  const from = import.meta.env.FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.error("Inquiry API misconfigured: missing env vars");
    return json(500, { ok: false, error: "Server misconfigured" });
  }

  const phone = body.phone?.trim() ?? "";
  const eventType = body.eventType?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  const subject = `New catering inquiry: ${name} — ${eventDate}`;

  const html = `
    <h2>New catering inquiry</h2>
    <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
    ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
    <p><strong>Event date:</strong> ${escapeHtml(eventDate)}</p>
    <p><strong>Guest count:</strong> ${escapeHtml(guestCount)}</p>
    ${eventType ? `<p><strong>Event type:</strong> ${escapeHtml(eventType)}</p>` : ""}
    ${message ? `<p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>` : ""}
    <hr>
    <p><em>Submitted via the chuy's tacos inquiry form.</em></p>
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: `Chuy's Tacos Inquiries <${from}>`,
      to,
      replyTo: email,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return json(500, { ok: false, error: "Failed to send email" });
    }

    return json(200, { ok: true });
  } catch (err) {
    console.error("Inquiry API error:", err);
    return json(500, { ok: false, error: "Unexpected server error" });
  }
};
