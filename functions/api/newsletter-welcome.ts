/**
 * Welcome sample email via Resend (not Mailchimp Journey).
 *
 * GET  /api/newsletter-welcome → { ok, configured, from }
 * POST /api/newsletter-welcome → body { email: string, name?: string }
 *                              → { ok: true, id, contactOk } | { error, ... }
 *
 * Secret (CF Pages → Settings → Environment variables, Production + Preview):
 *   RESEND_API_KEY  — Resend API key for maoxunxing.com. Needs email send
 *                     and contacts write (a send-only key still delivers the
 *                     welcome; contactOk will be false).
 * Optional:
 *   RESEND_FROM        — default "CrossAgent Lab <me@maoxunxing.com>"
 *   RESEND_SEGMENT_ID  — Resend segment that receives broadcast subscribers.
 *                        CF Pages should set this (Production + Preview) so
 *                        ops can rotate the segment without a code change.
 *                        Optional: when unset, defaults to the CrossAgent Lab
 *                        segment b5d0de18-840a-4741-a6e1-40a3375dfe91.
 *
 * After a successful welcome send, the subscriber is upserted as a Resend
 * Contact in that segment (unsubscribed: false). Contact failures are logged
 * and returned as contactOk: false; they do not fail the welcome response.
 * Mailchimp list collection stays on the embed form. Same-origin POST only.
 */

interface WelcomeEnv {
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  RESEND_SEGMENT_ID?: string;
}

type WelcomeContext = {
  request: Request;
  env: WelcomeEnv;
  waitUntil?: (promise: Promise<unknown>) => void;
};

const DEFAULT_FROM = "CrossAgent Lab <me@maoxunxing.com>";
const DEFAULT_SEGMENT_ID = "b5d0de18-840a-4741-a6e1-40a3375dfe91";
const SUBJECT = "CrossAgent Lab sample — 3 Amazon seller agent cases";
const SITE = "https://crossagent.maoxunxing.com";
const CASES = [
  {
    title: "Shopify AI Toolkit / MCP bulk ops",
    url: `${SITE}/cases/reddit-shopify-ai-toolkit-mcp-bulk/`,
  },
  {
    title: "n8n + ChatGPT refund fraud alerts",
    url: `${SITE}/cases/reddit-n8n-chatgpt-refund-fraud-alerts/`,
  },
  {
    title: "Adchestra Google Ads MCP for Shopify",
    url: `${SITE}/cases/hn-adchestra-google-ads-mcp-shopify/`,
  },
] as const;

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

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

function buildText(name?: string): string {
  const hello = name ? `Hi ${name},` : "Hi,";
  const lines = [
    hello,
    "",
    "Thanks for subscribing to CrossAgent Lab. Here is a sample of 3 Amazon / cross-border seller agent cases:",
    "",
    ...CASES.flatMap((c, i) => [`${i + 1}. ${c.title}`, `   ${c.url}`, ""]),
    `Browse more: ${SITE}/`,
    "",
    "You are still on the mxteam list (Mailchimp). Unsubscribe anytime from weekly mail.",
    "",
    "— CrossAgent Lab",
  ];
  return lines.join("\n");
}

function buildHtml(name?: string): string {
  const hello = name ? `Hi ${name},` : "Hi,";
  const items = CASES.map(
    (c) =>
      `<li style="margin:0 0 14px;"><a href="${c.url}" style="color:#0b5fff;text-decoration:none;font-weight:600;">${c.title}</a><br/><span style="color:#667085;font-size:13px;word-break:break-all;">${c.url}</span></li>`,
  ).join("");
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f5f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#101828;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f6f8;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;padding:28px 24px;border:1px solid #e4e7ec;">
        <tr><td>
          <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.04em;text-transform:uppercase;color:#667085;">CrossAgent Lab</p>
          <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;">Your sample: 3 seller agent cases</h1>
          <p style="margin:0 0 16px;font-size:16px;line-height:1.55;">${hello}</p>
          <p style="margin:0 0 16px;font-size:16px;line-height:1.55;">Thanks for subscribing. Here is a short sample of Amazon / cross-border agent workflows you can copy:</p>
          <ol style="margin:0 0 20px;padding-left:20px;font-size:16px;line-height:1.5;">${items}</ol>
          <p style="margin:0 0 20px;">
            <a href="${SITE}/" style="display:inline-block;background:#0b5fff;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:600;font-size:15px;">Browse CrossAgent Lab</a>
          </p>
          <p style="margin:0;font-size:13px;line-height:1.5;color:#667085;">List stays on Mailchimp (mxteam · tag CrossAgent Lab). Unsubscribe anytime from weekly mail. Welcome sample sent via Resend.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function segmentIdFrom(env: WelcomeEnv): string {
  const configured = env.RESEND_SEGMENT_ID?.trim();
  return configured || DEFAULT_SEGMENT_ID;
}

function resendHeaders(apiKey: string): HeadersInit {
  return {
    authorization: `Bearer ${apiKey}`,
    "content-type": "application/json",
  };
}

function errorLabel(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "unknown";
  const obj = payload as { name?: unknown; message?: unknown };
  const name = typeof obj.name === "string" ? obj.name : "";
  const message =
    typeof obj.message === "string" ? obj.message.slice(0, 180) : "";
  return [name, message].filter(Boolean).join(": ") || "unknown";
}

/** 409, or 422 whose body says the contact (or segment membership) already exists. */
function isExistingContact(status: number, payload: unknown): boolean {
  if (status === 409) return true;
  if (status !== 422 || !payload || typeof payload !== "object") return false;
  const obj = payload as { name?: unknown; message?: unknown };
  const name = typeof obj.name === "string" ? obj.name.toLowerCase() : "";
  const message =
    typeof obj.message === "string" ? obj.message.toLowerCase() : "";
  if (name.includes("already_exists") || name.includes("duplicate")) return true;
  return /already exists|already a contact|duplicate contact|already.+(segment|audience)/.test(
    message,
  );
}

async function readJson(res: Response): Promise<unknown> {
  return res.json().catch(() => ({}));
}

/**
 * Upsert the subscriber into the broadcast segment.
 * Create uses the current Contacts API: email, first_name, unsubscribed,
 * segments: [{ id }]. A duplicate contact does not get that segments field
 * applied, so the existing contact is patched and added explicitly.
 * Never throws.
 */
async function upsertResendContact(opts: {
  apiKey: string;
  email: string;
  firstName?: string;
  segmentId: string;
}): Promise<boolean> {
  const headers = resendHeaders(opts.apiKey);
  const createBody: Record<string, unknown> = {
    email: opts.email,
    unsubscribed: false,
    segments: [{ id: opts.segmentId }],
  };
  if (opts.firstName) createBody.first_name = opts.firstName;

  try {
    const created = await fetch("https://api.resend.com/contacts", {
      method: "POST",
      headers,
      body: JSON.stringify(createBody),
    });
    const createdPayload = await readJson(created);
    if (created.ok) return true;

    if (!isExistingContact(created.status, createdPayload)) {
      console.error(
        "resend_contact_failed",
        created.status,
        errorLabel(createdPayload),
      );
      return false;
    }

    const contactUrl = `https://api.resend.com/contacts/${encodeURIComponent(opts.email)}`;
    const patchBody: Record<string, unknown> = { unsubscribed: false };
    if (opts.firstName) patchBody.first_name = opts.firstName;

    const [patched, added] = await Promise.all([
      fetch(contactUrl, {
        method: "PATCH",
        headers,
        body: JSON.stringify(patchBody),
      }),
      fetch(`${contactUrl}/segments/${encodeURIComponent(opts.segmentId)}`, {
        method: "POST",
        headers,
      }),
    ]);
    const patchedPayload = await readJson(patched);
    const addedPayload = await readJson(added);
    const inSegment = added.ok || isExistingContact(added.status, addedPayload);
    if (!patched.ok) {
      console.error(
        "resend_contact_update_failed",
        patched.status,
        errorLabel(patchedPayload),
      );
    }
    if (!inSegment) {
      console.error(
        "resend_contact_segment_failed",
        added.status,
        errorLabel(addedPayload),
      );
    }
    return patched.ok && inSegment;
  } catch (err) {
    console.error(
      "resend_contact_unavailable",
      err instanceof Error ? err.message : "fetch_failed",
    );
    return false;
  }
}

export const onRequestGet = async (context: WelcomeContext): Promise<Response> => {
  const from = (context.env.RESEND_FROM || DEFAULT_FROM).trim();
  return json({
    ok: true,
    configured: Boolean(context.env.RESEND_API_KEY),
    from,
    subject: SUBJECT,
  });
};

export const onRequestPost = async (context: WelcomeContext): Promise<Response> => {
  if (!sameOrigin(context.request)) return json({ error: "forbidden" }, 403);

  const apiKey = context.env.RESEND_API_KEY;
  if (!apiKey) return json({ error: "resend_unconfigured" }, 503);

  const contentType = context.request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json({ error: "bad_content_type" }, 415);
  }

  let body: unknown;
  try {
    const text = await context.request.text();
    if (text.length > 1024) return json({ error: "bad_body" }, 400);
    body = JSON.parse(text);
  } catch {
    return json({ error: "bad_body" }, 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ error: "bad_body" }, 400);
  }
  const { email: rawEmail, name: rawName } = body as {
    email?: unknown;
    name?: unknown;
  };
  if (typeof rawEmail !== "string") return json({ error: "bad_email" }, 400);
  const email = rawEmail.trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return json({ error: "bad_email" }, 400);
  }
  let name: string | undefined;
  if (typeof rawName === "string") {
    const n = rawName.trim().slice(0, 80);
    if (n) name = n;
  }

  const from = (context.env.RESEND_FROM || DEFAULT_FROM).trim();
  const text = buildText(name);
  const html = buildHtml(name);

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
        text,
        html,
        tags: [
          { name: "type", value: "welcome-sample" },
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

    const emailId = payload.id || null;
    // Contact write must not change the welcome status. waitUntil keeps the
    // upsert alive if the Mailchimp form aborts this request after its timeout.
    let contactOk = false;
    try {
      const contactTask = upsertResendContact({
        apiKey,
        email,
        firstName: name,
        segmentId: segmentIdFrom(context.env),
      });
      if (typeof context.waitUntil === "function") {
        context.waitUntil(contactTask);
      }
      contactOk = await contactTask;
    } catch (err) {
      console.error(
        "resend_contact_unavailable",
        err instanceof Error ? err.message : "fetch_failed",
      );
    }
    return json({ ok: true, id: emailId, contactOk });
  } catch {
    return json({ error: "resend_unavailable" }, 503);
  }
};
