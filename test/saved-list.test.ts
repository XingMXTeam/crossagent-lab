import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";
import { onRequestPost as sendList } from "../functions/api/send-saved-list";
import {
  deliverNewsletterWelcome,
  onRequestPost as welcome,
} from "../functions/api/newsletter-welcome";

const ORIGIN = "https://crossagent.maoxunxing.com";
const SITE = ORIGIN;
const originalFetch = globalThis.fetch;

type Call = { url: string; body: Record<string, unknown> | null };

function installFetch(handler: (url: string, body: Record<string, unknown> | null) => Response) {
  const calls: Call[] = [];
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const body = init?.body ? (JSON.parse(String(init.body)) as Record<string, unknown>) : null;
    calls.push({ url, body });
    return handler(url, body);
  }) as typeof fetch;
  return calls;
}

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function okResend(url: string): Response {
  if (url.includes("/emails")) return jsonResponse({ id: "email_1" });
  if (url.includes("/contacts")) return jsonResponse({ id: "contact_1" });
  return jsonResponse({ message: "unexpected" }, 500);
}

function env(extra: Record<string, string> = {}) {
  return { RESEND_API_KEY: "re_test", RESEND_FROM: "CrossAgent Lab <me@maoxunxing.com>", ...extra };
}

function post(
  path: string,
  body: unknown,
  headers: Record<string, string> = {},
): Request {
  return new Request(`${ORIGIN}${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: ORIGIN,
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const item = {
  slug: "n8n-shopify-email-return-refunds-claude",
  title: "Shopify 退货邮件",
  url: "https://evil.example/phish",
};

describe("POST /api/newsletter-welcome", () => {
  test("rejects a cross-origin request", async () => {
    const res = await welcome({
      request: post("/api/newsletter-welcome", { email: "a@b.co" }, { origin: "https://evil.example" }),
      env: env(),
    });
    assert.equal(res.status, 403);
  });

  test("rejects a bad email before sending", async () => {
    const calls = installFetch(() => jsonResponse({ id: "x" }));
    const res = await welcome({
      request: post("/api/newsletter-welcome", { email: "not-an-email" }),
      env: env(),
    });
    assert.equal(res.status, 400);
    assert.equal(calls.length, 0);
  });

  test("sends the welcome sample and upserts the segment", async () => {
    const calls = installFetch((url) => okResend(url));
    const waited: Promise<unknown>[] = [];
    const res = await welcome({
      request: post("/api/newsletter-welcome", { email: "A@Example.com", name: "  毛  " }),
      env: env(),
      waitUntil: (p) => waited.push(p),
    });
    assert.equal(res.status, 200);
    const payload = (await res.json()) as { ok: boolean; id: string; contactOk: boolean };
    assert.deepEqual(payload, { ok: true, id: "email_1", contactOk: true });
    assert.equal(waited.length, 1);
    assert.equal(calls[0].url, "https://api.resend.com/emails");
    assert.equal((calls[0].body?.to as string[])[0], "a@example.com");
    assert.match(String(calls[0].body?.subject), /sample/i);
    assert.equal(calls[1].url, "https://api.resend.com/contacts");
    assert.equal(calls[1].body?.email, "a@example.com");
    assert.equal(calls[1].body?.first_name, "毛");
    assert.equal(calls[1].body?.unsubscribed, false);
    const segments = calls[1].body?.segments as { id: string }[];
    assert.equal(segments[0].id, "b5d0de18-840a-4741-a6e1-40a3375dfe91");
  });

  test("keeps ok when the contact write fails", async () => {
    const calls = installFetch((url) => {
      if (url.includes("/emails")) return jsonResponse({ id: "email_1" });
      return jsonResponse({ name: "internal", message: "nope" }, 500);
    });
    const res = await welcome({
      request: post("/api/newsletter-welcome", { email: "a@b.co" }),
      env: env(),
    });
    assert.equal(res.status, 200);
    const payload = (await res.json()) as { ok: boolean; contactOk: boolean };
    assert.equal(payload.ok, true);
    assert.equal(payload.contactOk, false);
    assert.equal(calls.length, 2);
  });

  test("returns 502 when Resend rejects the welcome email", async () => {
    installFetch(() => jsonResponse({ message: "invalid" }, 422));
    const res = await welcome({
      request: post("/api/newsletter-welcome", { email: "a@b.co" }),
      env: env(),
    });
    assert.equal(res.status, 502);
    const payload = (await res.json()) as { error: string; status: number; detail: string };
    assert.equal(payload.error, "resend_failed");
    assert.equal(payload.status, 422);
    assert.equal(payload.detail, "invalid");
  });

  test("returns 503 when the key is missing, before reading the body", async () => {
    const res = await welcome({
      request: post("/api/newsletter-welcome", "{"),
      env: {},
    });
    assert.equal(res.status, 503);
    const payload = (await res.json()) as { error: string };
    assert.equal(payload.error, "resend_unconfigured");
  });
});

describe("POST /api/send-saved-list", () => {
  test("rejects a missing origin", async () => {
    const res = await sendList({
      request: new Request(`${ORIGIN}/api/send-saved-list`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "a@b.co", items: [item] }),
      }),
      env: env(),
    });
    assert.equal(res.status, 403);
  });

  test("accepts a same-origin fetch without an Origin header", async () => {
    installFetch((url) => okResend(url));
    const res = await sendList({
      request: new Request(`${ORIGIN}/api/send-saved-list`, {
        method: "POST",
        headers: { "content-type": "application/json", "sec-fetch-site": "same-origin" },
        body: JSON.stringify({ email: "a@b.co", items: [item] }),
      }),
      env: env(),
    });
    assert.equal(res.status, 200);
  });

  test("rejects a bad email and an empty list", async () => {
    const calls = installFetch((url) => okResend(url));
    const badEmail = await sendList({
      request: post("/api/send-saved-list", { email: "nope", items: [item] }),
      env: env(),
    });
    assert.equal(badEmail.status, 400);
    assert.equal(((await badEmail.json()) as { error: string }).error, "bad_email");

    const empty = await sendList({
      request: post("/api/send-saved-list", { email: "a@b.co", items: [] }),
      env: env(),
    });
    assert.equal(((await empty.json()) as { error: string }).error, "empty_list");

    const badSlug = await sendList({
      request: post("/api/send-saved-list", {
        email: "a@b.co",
        items: [{ slug: "../etc", title: "x", url: "https://evil.example" }],
      }),
      env: env(),
    });
    assert.equal(((await badSlug.json()) as { error: string }).error, "bad_list");

    const badNews = await sendList({
      request: post("/api/send-saved-list", { email: "a@b.co", newsletter: "true", items: [item] }),
      env: env(),
    });
    assert.equal(((await badNews.json()) as { error: string }).error, "bad_newsletter");
    assert.equal(calls.length, 0);
  });

  test("emails canonical case links and ignores the client url", async () => {
    const calls = installFetch((url) => okResend(url));
    const res = await sendList({
      request: post("/api/send-saved-list", {
        email: "You@Example.com",
        newsletter: false,
        items: [
          { ...item, title: "A & B <script>\nBcc: evil" },
          { ...item, title: "duplicate should drop" },
        ],
      }),
      env: env(),
    });
    assert.equal(res.status, 200);
    const payload = (await res.json()) as { ok: boolean; newsletterOk?: boolean };
    assert.deepEqual(payload, { ok: true, id: "email_1" });
    assert.equal(calls.length, 1);
    const mail = calls[0].body!;
    assert.equal((mail.to as string[])[0], "you@example.com");
    assert.equal(mail.subject, "你的 CrossAgent Lab 收藏清单");
    const text = String(mail.text);
    const html = String(mail.html);
    const canonical = `${SITE}/cases/${item.slug}/`;
    assert.match(text, /1\. A & B <script> Bcc: evil/);
    assert.equal(text.includes(canonical), true);
    assert.equal(text.includes("evil.example"), false);
    assert.equal(text.includes("duplicate should drop"), false);
    assert.equal(html.includes("<script>"), false);
    assert.equal(html.includes("&lt;script&gt;"), true);
    assert.equal(html.includes("A &amp; B"), true);
    assert.equal(html.includes(canonical), true);
    assert.equal(html.includes("evil.example"), false);
  });

  test("opts into the same welcome dual-write when newsletter is checked", async () => {
    const calls = installFetch((url) => okResend(url));
    const res = await sendList({
      request: post("/api/send-saved-list", {
        email: "a@b.co",
        newsletter: true,
        items: [item],
      }),
      env: env(),
    });
    assert.equal(res.status, 200);
    const payload = (await res.json()) as { newsletterOk: boolean; contactOk: boolean };
    assert.equal(payload.newsletterOk, true);
    assert.equal(payload.contactOk, true);
    assert.equal(calls.length, 3);
    assert.equal(calls[0].body?.subject, "你的 CrossAgent Lab 收藏清单");
    assert.match(String(calls[1].body?.subject), /sample/i);
    assert.equal(calls[1].body && (calls[1].body.to as string[])[0], "a@b.co");
    assert.equal(calls[2].url, "https://api.resend.com/contacts");
    assert.equal(calls[2].body?.email, "a@b.co");
  });

  test("still returns the list send when the welcome send fails", async () => {
    const calls = installFetch((url, body) => {
      if (url.includes("/contacts")) return jsonResponse({ id: "c" });
      if (String(body?.subject).includes("收藏")) return jsonResponse({ id: "list_1" });
      return jsonResponse({ message: "nope" }, 500);
    });
    const res = await sendList({
      request: post("/api/send-saved-list", { email: "a@b.co", newsletter: true, items: [item] }),
      env: env(),
    });
    assert.equal(res.status, 200);
    const payload = (await res.json()) as { ok: boolean; id: string; newsletterOk: boolean };
    assert.deepEqual(payload, { ok: true, id: "list_1", newsletterOk: false });
    assert.equal(calls.some((c) => c.url.includes("/contacts")), false);
  });

  test("does not subscribe when the list email fails", async () => {
    const calls = installFetch(() => jsonResponse({ message: "nope" }, 500));
    const res = await sendList({
      request: post("/api/send-saved-list", { email: "a@b.co", newsletter: true, items: [item] }),
      env: env(),
    });
    assert.equal(res.status, 502);
    assert.equal(calls.length, 1);
  });

  test("returns 503 when Resend is not configured", async () => {
    const calls = installFetch((url) => okResend(url));
    const res = await sendList({
      request: post("/api/send-saved-list", { email: "a@b.co", items: [item] }),
      env: {},
    });
    assert.equal(res.status, 503);
    assert.equal(calls.length, 0);
  });

  test("rejects a list over the cap", async () => {
    const items = Array.from({ length: 31 }, (_, i) => ({
      slug: `case-${i}`,
      title: "t",
      url: "https://evil.example",
    }));
    const res = await sendList({
      request: post("/api/send-saved-list", { email: "a@b.co", items }),
      env: env(),
    });
    assert.equal(res.status, 400);
    assert.equal(((await res.json()) as { error: string }).error, "list_too_long");
  });
});

describe("deliverNewsletterWelcome", () => {
  test("uses the configured segment id", async () => {
    const calls = installFetch((url) => okResend(url));
    const result = await deliverNewsletterWelcome({
      env: env({ RESEND_SEGMENT_ID: "seg_custom" }),
      email: "a@b.co",
    });
    assert.equal(result.ok, true);
    const segments = calls[1].body?.segments as { id: string }[];
    assert.equal(segments[0].id, "seg_custom");
  });
});
