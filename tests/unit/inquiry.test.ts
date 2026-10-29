import { env } from "cloudflare:workers";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "@/pages/api/inquiry";

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const RESEND = "https://api.resend.com/emails";

// Fixed clock: "today" is 2026-11-15 in UTC, so the earliest accepted event date is 2026-11-14.
const NOW = new Date("2026-11-15T12:00:00Z");
const GUEST_ERROR = "Guest count must be between 1 and 2000.";

const valid = {
  name: "Ana Pérez",
  email: "ana@example.com",
  phone: "(559) 555-0100",
  eventDate: "2026-12-05",
  guestCount: "80",
  eventType: "Wedding",
  message: "Outdoor venue.\nVegetarian options, please.",
  "cf-turnstile-response": "token-abc",
};

type Context = Parameters<typeof POST>[0];

function post(body: unknown, headers: Record<string, string> = {}) {
  const request = new Request("https://chuystacos.com/api/inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  return POST({ request } as Context);
}

/** Routes stubbed fetch calls by URL; each handler returns the Response for that service. */
function stubFetch(handlers: { siteverify?: () => Response; resend?: () => Response } = {}) {
  const {
    siteverify = () => Response.json({ success: true }),
    resend = () => Response.json({ id: "email-1" }),
  } = handlers;
  const fetchMock = vi.fn(async (input: RequestInfo | URL, _init?: RequestInit) => {
    const url = String(input);
    if (url === SITEVERIFY) return siteverify();
    if (url === RESEND) return resend();
    throw new Error(`Unexpected fetch: ${url}`);
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

const callsTo = (fetchMock: ReturnType<typeof stubFetch>, url: string) =>
  fetchMock.mock.calls.filter(([input]) => String(input) === url);

/** The parsed JSON body and headers of the single Resend call. */
function resendRequest(fetchMock: ReturnType<typeof stubFetch>) {
  const calls = callsTo(fetchMock, RESEND);
  expect(calls).toHaveLength(1);
  const init = calls[0][1] as RequestInit;
  return {
    headers: init.headers as Record<string, string>,
    body: JSON.parse(init.body as string) as Record<string, unknown>,
  };
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(NOW);
  env.RESEND_API_KEY = "re_test";
  env.TURNSTILE_SECRET_KEY = "turnstile-secret";
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/inquiry", () => {
  describe("happy path", () => {
    it("verifies the Turnstile token and sends the inquiry through Resend", async () => {
      const fetchMock = stubFetch();
      const res = await post(valid, { "CF-Connecting-IP": "203.0.113.7" });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ok: true });

      const verifyCalls = callsTo(fetchMock, SITEVERIFY);
      expect(verifyCalls).toHaveLength(1);
      const form = (verifyCalls[0][1] as RequestInit).body as FormData;
      expect(form.get("secret")).toBe("turnstile-secret");
      expect(form.get("response")).toBe("token-abc");
      expect(form.get("remoteip")).toBe("203.0.113.7");
    });

    it("addresses the email to the owner, Cc's jesse@ and replies to the sender", async () => {
      const fetchMock = stubFetch();
      await post(valid);

      const { headers, body } = resendRequest(fetchMock);
      expect(headers.Authorization).toBe("Bearer re_test");
      expect(body).toMatchObject({
        from: "Chuy's Tacos Inquiries <inquiries@mail.chuystacos.com>",
        to: ["chuy@chuystacos.com"],
        cc: ["jesse@chuystacos.com"],
        reply_to: "ana@example.com",
        subject: "New catering inquiry: Ana Pérez — 2026-12-05",
      });
      const html = body.html as string;
      expect(html).toContain("<strong>Guest count:</strong> 80");
      expect(html).toContain("<strong>Event type:</strong> Wedding");
      expect(html).toContain("Outdoor venue.<br>Vegetarian options, please.");
    });

    it("escapes HTML in submitted fields", async () => {
      const fetchMock = stubFetch();
      await post({ ...valid, name: "<script>alert(1)</script>", message: 'a & b "c"' });

      const html = resendRequest(fetchMock).body.html as string;
      expect(html).not.toContain("<script>");
      expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
      expect(html).toContain("a &amp; b &quot;c&quot;");
    });

    it("omits optional fields that were left blank", async () => {
      const fetchMock = stubFetch();
      await post({ ...valid, phone: "", eventType: "", message: "" });

      const html = resendRequest(fetchMock).body.html as string;
      expect(html).not.toContain("Phone:");
      expect(html).not.toContain("Event type:");
      expect(html).not.toContain("Message:");
    });

    it("skips Turnstile when no secret is configured", async () => {
      env.TURNSTILE_SECRET_KEY = "";
      const fetchMock = stubFetch();
      const res = await post({ ...valid, "cf-turnstile-response": "" });

      expect(res.status).toBe(200);
      expect(callsTo(fetchMock, SITEVERIFY)).toHaveLength(0);
      expect(callsTo(fetchMock, RESEND)).toHaveLength(1);
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe("malformed requests", () => {
    it.each([
      ["invalid JSON", "{not json"],
      ["a JSON array", "[]"],
      ["JSON null", "null"],
    ])("rejects %s", async (_, raw) => {
      const fetchMock = stubFetch();
      const res = await post(raw);

      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ ok: false, error: "Invalid JSON body" });
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe("honeypot", () => {
    it("pretends to succeed without verifying or sending", async () => {
      const fetchMock = stubFetch();
      const res = await post({ ...valid, company: "Acme Bots LLC" });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ok: true });
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe("validation", () => {
    it.each([
      ["a missing name", { name: "" }, "Name is required"],
      ["a whitespace-only name", { name: "   " }, "Name is required"],
      ["a malformed email", { email: "ana@example" }, "A valid email is required."],
      ["a non-calendar date", { eventDate: "2026-02-30" }, "Event date must be today or later."],
      ["a non-ISO date", { eventDate: "12/05/2026" }, "Event date must be today or later."],
      ["a date two days ago", { eventDate: "2026-11-13" }, "Event date must be today or later."],
      ["zero guests", { guestCount: "0" }, GUEST_ERROR],
      ["too many guests", { guestCount: "2001" }, GUEST_ERROR],
      ["a fractional guest count", { guestCount: "1.5" }, GUEST_ERROR],
      ["a numeric guest count", { guestCount: 80 }, GUEST_ERROR],
    ])("rejects %s", async (_, override, message) => {
      const fetchMock = stubFetch();
      const res = await post({ ...valid, ...override });

      expect(res.status).toBe(400);
      const body = (await res.json()) as { ok: boolean; errors: string[] };
      expect(body.ok).toBe(false);
      expect(body.errors).toEqual([expect.stringContaining(message)]);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("reports every invalid field at once", async () => {
      stubFetch();
      const res = await post({ name: "", email: "", eventDate: "", guestCount: "" });

      const body = (await res.json()) as { errors: string[] };
      expect(body.errors).toHaveLength(4);
    });

    it.each([
      ["today", "2026-11-15"],
      ["yesterday, for evening submissions in Pacific time", "2026-11-14"],
    ])("accepts an event date of %s", async (_, eventDate) => {
      stubFetch();
      const res = await post({ ...valid, eventDate });
      expect(res.status).toBe(200);
    });

    it("accepts the guest-count bounds", async () => {
      stubFetch();
      expect((await post({ ...valid, guestCount: "1" })).status).toBe(200);
      expect((await post({ ...valid, guestCount: "2000" })).status).toBe(200);
    });
  });

  describe("Turnstile", () => {
    it("rejects a submission with no token without calling siteverify", async () => {
      const fetchMock = stubFetch();
      const res = await post({ ...valid, "cf-turnstile-response": "" });

      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ ok: false, error: "captcha" });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("rejects a token that siteverify fails, without sending email", async () => {
      const fetchMock = stubFetch({ siteverify: () => Response.json({ success: false }) });
      const res = await post(valid);

      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ ok: false, error: "captcha" });
      expect(callsTo(fetchMock, RESEND)).toHaveLength(0);
    });

    it("treats a siteverify outage as a failed check", async () => {
      const fetchMock = stubFetch({ siteverify: () => new Response("busy", { status: 503 }) });
      const res = await post(valid);

      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ ok: false, error: "captcha" });
      expect(callsTo(fetchMock, RESEND)).toHaveLength(0);
    });
  });

  describe("delivery failures", () => {
    it("returns 500 when the Resend key is missing", async () => {
      env.RESEND_API_KEY = "";
      const fetchMock = stubFetch();
      const res = await post(valid);

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ ok: false, error: "Server misconfigured" });
      expect(callsTo(fetchMock, RESEND)).toHaveLength(0);
    });

    it("returns 500 when Resend rejects the message", async () => {
      stubFetch({ resend: () => new Response("domain not verified", { status: 403 }) });
      const res = await post(valid);

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ ok: false, error: "Failed to send email" });
      expect(console.error).toHaveBeenCalledWith(
        "Resend rejected the message",
        403,
        "domain not verified"
      );
    });

    it("returns 500 when the Resend request throws", async () => {
      stubFetch({
        resend: () => {
          throw new TypeError("network down");
        },
      });
      const res = await post(valid);

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ ok: false, error: "Unexpected server error" });
    });
  });
});

describe("GET /api/inquiry", () => {
  it("is not allowed", async () => {
    const res = await GET({} as Context);
    expect(res.status).toBe(405);
    expect(res.headers.get("Allow")).toBe("POST");
  });
});
