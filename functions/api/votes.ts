/**
 * Public like counts for case slugs.
 *
 * GET  /api/votes          → { "<slug>": <count>, ... }   (zeros omitted)
 * POST /api/votes          → body { id: string, on: boolean }
 *                          → { id, on, count }
 *
 * Binding: env.VOTES (Pages KV). One JSON document under key "counts".
 * Same-origin POST only. Repeat clicks from one browser are handled in
 * localStorage; this endpoint still applies a single +1 or -1 per request.
 */

interface VoteKV {
  get(key: string, type: "json"): Promise<unknown>;
  put(key: string, value: string): Promise<void>;
}

interface VoteEnv {
  VOTES?: VoteKV;
}

type VoteContext = {
  request: Request;
  env: VoteEnv;
};

const COUNTS_KEY = "counts";
const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_ID_LEN = 80;
const MAX_KEYS = 500;

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

function sanitize(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const counts: Record<string, number> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!isId(key) || typeof value !== "number" || !Number.isInteger(value) || value <= 0) continue;
    counts[key] = value;
  }
  return counts;
}

function isId(id: string): boolean {
  return id.length > 0 && id.length <= MAX_ID_LEN && ID_RE.test(id);
}

async function readCounts(kv: VoteKV): Promise<Record<string, number>> {
  return sanitize(await kv.get(COUNTS_KEY, "json"));
}

export const onRequestGet = async (context: VoteContext): Promise<Response> => {
  if (!context.env.VOTES) return json({ error: "votes_unconfigured" }, 503);
  try {
    return json(await readCounts(context.env.VOTES));
  } catch {
    return json({ error: "votes_unavailable" }, 503);
  }
};

export const onRequestPost = async (context: VoteContext): Promise<Response> => {
  if (!sameOrigin(context.request)) return json({ error: "forbidden" }, 403);
  if (!context.env.VOTES) return json({ error: "votes_unconfigured" }, 503);

  const contentType = context.request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json({ error: "bad_content_type" }, 415);
  }

  let body: unknown;
  try {
    const text = await context.request.text();
    if (text.length > 512) return json({ error: "bad_body" }, 400);
    body = JSON.parse(text);
  } catch {
    return json({ error: "bad_body" }, 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ error: "bad_body" }, 400);
  }
  const { id, on } = body as { id?: unknown; on?: unknown };
  if (typeof id !== "string" || !isId(id) || typeof on !== "boolean") {
    return json({ error: "bad_vote" }, 400);
  }

  try {
    const counts = await readCounts(context.env.VOTES);
    if (on && !(id in counts) && Object.keys(counts).length >= MAX_KEYS) {
      return json({ error: "vote_limit" }, 400);
    }
    const next = Math.max(0, (counts[id] ?? 0) + (on ? 1 : -1));
    if (next === 0) delete counts[id];
    else counts[id] = next;
    await context.env.VOTES.put(COUNTS_KEY, JSON.stringify(counts));
    return json({ id, on, count: next });
  } catch {
    return json({ error: "votes_unavailable" }, 503);
  }
};
