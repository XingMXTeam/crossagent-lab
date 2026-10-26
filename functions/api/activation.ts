/**
 * First-party activation beacon.
 *
 * Cloudflare Web Analytics does not support custom events (FAQ: not yet).
 * This endpoint records two named events in Workers Analytics Engine:
 *   case_detail_open — a case detail page was opened
 *   prompt_copy      — the detail-page Prompt control ran (clipboard or select)
 *
 * POST /api/activation
 *   { event, slug, locale, via }
 *   → { ok: true }                         when ACTIVATION is bound
 *   → { ok: false, error }                 otherwise
 *
 * GET /api/activation
 *   → { ok: true, configured: boolean }
 *   No counts. This is a binding probe, not a metrics feed.
 *
 * Binding (dashboard, not wrangler.toml — that file is local-only until
 * pages_build_output_dir is adopted):
 *   Pages → crossagent-lab → Settings → Bindings → Analytics engine
 *   Variable name: ACTIVATION
 *   Dataset: crossagent_activation
 *   Production and Preview. Redeploy after adding the binding.
 *
 * Data point (no IP, cookie, email, or prompt text):
 *   index1  activation
 *   blob1   event
 *   blob2   slug
 *   blob3   locale
 *   blob4   via
 *   double1 1
 */

interface AnalyticsEngineDataPoint {
  indexes?: string[];
  blobs?: string[];
  doubles?: number[];
}

interface AnalyticsEngineDataset {
  writeDataPoint(event: AnalyticsEngineDataPoint): void;
}

interface ActivationEnv {
  ACTIVATION?: AnalyticsEngineDataset;
}

type ActivationContext = {
  request: Request;
  env: ActivationEnv;
};

const EVENTS = ["case_detail_open", "prompt_copy"] as const;
type ActivationEvent = (typeof EVENTS)[number];

const VIA = ["page", "clipboard", "select"] as const;
type ActivationVia = (typeof VIA)[number];

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LOCALE_RE = /^[a-z]{2,3}(?:-[A-Z]{2})?$/;
const MAX_SLUG_LEN = 80;
const MAX_BODY = 512;

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

function isEvent(value: string): value is ActivationEvent {
  return (EVENTS as readonly string[]).includes(value);
}

function isVia(value: string): value is ActivationVia {
  return (VIA as readonly string[]).includes(value);
}

function isSlug(value: string): boolean {
  return value.length > 0 && value.length <= MAX_SLUG_LEN && SLUG_RE.test(value);
}

function pairAllowed(event: ActivationEvent, via: ActivationVia): boolean {
  if (event === "case_detail_open") return via === "page";
  return via === "clipboard" || via === "select";
}

export const onRequestGet = async (context: ActivationContext): Promise<Response> => {
  return json({ ok: true, configured: Boolean(context.env.ACTIVATION) });
};

export const onRequestPost = async (context: ActivationContext): Promise<Response> => {
  if (!sameOrigin(context.request)) return json({ ok: false, error: "forbidden" }, 403);

  const contentType = context.request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json({ ok: false, error: "bad_content_type" }, 415);
  }

  let body: unknown;
  try {
    const text = await context.request.text();
    if (text.length > MAX_BODY) return json({ ok: false, error: "bad_body" }, 400);
    body = JSON.parse(text);
  } catch {
    return json({ ok: false, error: "bad_body" }, 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ ok: false, error: "bad_body" }, 400);
  }

  const { event, slug, locale, via } = body as {
    event?: unknown;
    slug?: unknown;
    locale?: unknown;
    via?: unknown;
  };

  if (typeof event !== "string" || !isEvent(event)) {
    return json({ ok: false, error: "bad_event" }, 400);
  }
  if (typeof slug !== "string" || !isSlug(slug)) {
    return json({ ok: false, error: "bad_slug" }, 400);
  }
  if (typeof locale !== "string" || !LOCALE_RE.test(locale)) {
    return json({ ok: false, error: "bad_locale" }, 400);
  }
  if (typeof via !== "string" || !isVia(via) || !pairAllowed(event, via)) {
    return json({ ok: false, error: "bad_via" }, 400);
  }

  const point: AnalyticsEngineDataPoint = {
    indexes: ["activation"],
    blobs: [event, slug, locale, via],
    doubles: [1],
  };

  const dataset = context.env.ACTIVATION;
  if (!dataset) {
    console.info(
      JSON.stringify({
        msg: "activation_unconfigured",
        event,
        slug,
        locale,
        via,
      }),
    );
    return json({ ok: false, error: "activation_unconfigured" }, 503);
  }

  try {
    dataset.writeDataPoint(point);
  } catch {
    return json({ ok: false, error: "activation_unavailable" }, 503);
  }

  return json({ ok: true });
};
