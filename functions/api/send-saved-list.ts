/**
 * Email the reader's saved case list (Resend).
 *
 * POST /api/send-saved-list
 *   body { email: string, newsletter?: boolean, items: { slug, title, url }[] }
 *   → { ok: true, id, newsletterOk?, contactOk? } | { error, ... }
 *
 * One recipient: the address they typed. Links in the mail are always
 * https://crossagent.maoxunxing.com/cases/{slug}/ — client `url` is ignored
 * so a tampered body cannot drop a phishing link into the message.
 *
 * If newsletter is true, also runs deliverNewsletterWelcome (welcome sample
 * + Resend segment upsert), the same path as POST /api/newsletter-welcome.
 * That does not submit Mailchimp. Same secrets: RESEND_API_KEY, RESEND_FROM,
 * RESEND_SEGMENT_ID. Same-origin POST only.
 */

import { deliverNewsletterWelcome } from "./newsletter-welcome";

interface ListEnv {
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  RESEND_SEGMENT_ID?: string;
}

type ListContext = {
  request: Request;
  env: ListEnv;
  waitUntil?: (promise: Promise<unknown>) => void;
};

const DEFAULT_FROM = "CrossAgent Lab <me@maoxunxing.com>";
const SITE = "https://crossagent.maoxunxing.com";
const SUBJECT = "你的 CrossAgent Lab 收藏清单";
const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_ID_LEN = 80;
const MAX_ITEMS = 30;
const MAX_BODY = 24_000;
const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

type SavedItem = { slug: string; title: string; url: string };

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function sameOrigin(request: Request): boolean {
  let requestOrigin: string;
  try {
    requestOrigin = new URL(request.url).origin;
  } catch {
    return false;
  }
  const origin = request.headers.get("Origin");
  if (origin) return origin === requestOrigin;
  return request.headers.get("Sec-Fetch-Site") === "same-origin";
}

function isSlug(id: string): boolean {
  return id.length > 0 && id.length <= MAX_ID_LEN && ID_RE.test(id);
}

function cleanTitle(raw: unknown, slug: string): string {
  if (typeof raw !== "string") return slug;
  const title = raw
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
  return title || slug;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function caseUrl(slug: string): string {
  return `${SITE}/cases/${slug}/`;
}

function parseItems(
  raw: unknown,
): { items: SavedItem[] } | { error: "empty_list" | "list_too_long" | "bad_list" } {
  if (!Array.isArray(raw) || raw.length === 0) return { error: "empty_list" };
  if (raw.length > MAX_ITEMS) return { error: "list_too_long" };
  const seen = new Set<string>();
  const items: SavedItem[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) return { error: "bad_list" };
    const row = entry as { slug?: unknown; title?: unknown; url?: unknown };
    if (typeof row.slug !== "string" || !isSlug(row.slug)) return { error: "bad_list" };
    if (row.title !== undefined && typeof row.title !== "string") return { error: "bad_list" };
    if (row.url !== undefined && typeof row.url !== "string") return { error: "bad_list" };
    if (seen.has(row.slug)) continue;
    seen.add(row.slug);
    items.push({
      slug: row.slug,
      title: cleanTitle(row.title, row.slug),
      url: caseUrl(row.slug),
    });
  }
  return items.length > 0 ? { items } : { error: "empty_list" };
}

function buildText(items: SavedItem[]): string {
  const lines = [
    `你在 CrossAgent Lab 点了「发送清单」。当前收藏 ${items.length} 条：`,
    "",
    ...items.flatMap((item, i) => [`${i + 1}. ${item.title}`, `   ${item.url}`, ""]),
    `在站内继续看：${SITE}/`,
    "",
    "这封邮件只发给你刚填写的邮箱。",
    "",
    "— CrossAgent Lab",
  ];
  return lines.join("\n");
}

function buildHtml(items: SavedItem[]): string {
  const rows = items
    .map(
      (item) =>
        `<li style="margin:0 0 14px;"><a href="${item.url}" style="color:#0b5fff;text-decoration:none;font-weight:600;">${escapeHtml(item.title)}</a><br/><span style="color:#667085;font-size:13px;word-break:break-all;">${escapeHtml(item.url)}</span></li>`,
    )
    .join("");
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f5f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#101828;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f6f8;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;padding:28px 24px;border:1px solid #e4e7ec;">
        <tr><td>
          <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.04em;text-transform:uppercase;color:#667085;">CrossAgent Lab</p>
          <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;">你的收藏清单</h1>
          <p style="margin:0 0 16px;font-size:16px;line-height:1.55;">你点了「发送清单」。当前收藏 ${items.length} 条：</p>
          <ol style="margin:0 0 20px;padding-left:20px;font-size:16px;line-height:1.5;">${rows}</ol>
          <p style="margin:0 0 20px;">
            <a href="${SITE}/" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:600;font-size:15px;">回到 CrossAgent Lab</a>
          </p>
          <p style="margin:0;font-size:13px;line-height:1.5;color:#667085;">这封邮件只发给你刚填写的邮箱。</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export const onRequestPost = async (context: ListContext): Promise<Response> => {
  if (!sameOrigin(context.request)) return json({ error: "forbidden" }, 403);

  const contentType = context.request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json({ error: "bad_content_type" }, 415);
  }

  let body: unknown;
  try {
    const text = await context.request.text();
    if (text.length > MAX_BODY) return json({ error: "bad_body" }, 400);
    body = JSON.parse(text);
  } catch {
    return json({ error: "bad_body" }, 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ error: "bad_body" }, 400);
  }
  const record = body as { email?: unknown; newsletter?: unknown; items?: unknown };
  if (typeof record.email !== "string") return json({ error: "bad_email" }, 400);
  const email = record.email.trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return json({ error: "bad_email" }, 400);
  }
  if (record.newsletter !== undefined && typeof record.newsletter !== "boolean") {
    return json({ error: "bad_newsletter" }, 400);
  }
  const newsletter = record.newsletter === true;
  const parsed = parseItems(record.items);
  if ("error" in parsed) return json({ error: parsed.error }, 400);
  const items = parsed.items;

  const apiKey = context.env.RESEND_API_KEY;
  if (!apiKey) return json({ error: "resend_unconfigured" }, 503);

  const from = (context.env.RESEND_FROM || DEFAULT_FROM).trim();
  let emailId: string | null = null;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: SUBJECT,
        text: buildText(items),
        html: buildHtml(items),
        tags: [
          { name: "type", value: "saved-list" },
          { name: "site", value: "crossagent-lab" },
        ],
      }),
    });
    const payload = (await res.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
      name?: string;
    };
    if (!res.ok) {
      return json(
        {
          error: "resend_failed",
          status: res.status,
          detail: payload.message || payload.name || "send_failed",
        },
        502,
      );
    }
    emailId = payload.id || null;
  } catch {
    return json({ error: "resend_unavailable" }, 503);
  }

  if (!newsletter) return json({ ok: true, id: emailId });

  const welcomed = await deliverNewsletterWelcome({
    env: context.env,
    email,
    waitUntil: context.waitUntil,
  });
  if (!welcomed.ok) {
    return json({ ok: true, id: emailId, newsletterOk: false });
  }
  return json({
    ok: true,
    id: emailId,
    newsletterOk: true,
    contactOk: welcomed.contactOk,
  });
};
