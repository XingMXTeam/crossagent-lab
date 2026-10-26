import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { onRequestGet, onRequestPost } from "../functions/api/activation";

const ORIGIN = "https://crossagent.maoxunxing.com";

type Point = {
  indexes?: string[];
  blobs?: string[];
  doubles?: number[];
};

function post(
  body: unknown,
  headers: Record<string, string> = {},
): Request {
  return new Request(`${ORIGIN}/api/activation`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: ORIGIN,
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function dataset() {
  const points: Point[] = [];
  return {
    points,
    ACTIVATION: {
      writeDataPoint(point: Point) {
        points.push(point);
      },
    },
  };
}

const valid = {
  event: "prompt_copy",
  slug: "shop-mcp-visibility-tools",
  locale: "zh-CN",
  via: "clipboard",
};

describe("POST /api/activation", () => {
  test("writes one data point and nothing else", async () => {
    const store = dataset();
    const res = await onRequestPost({
      request: post({
        ...valid,
        email: "person@example.com",
        prompt: "ignore this",
      }),
      env: { ACTIVATION: store.ACTIVATION },
    });
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { ok: true });
    assert.equal(store.points.length, 1);
    assert.deepEqual(store.points[0], {
      indexes: ["activation"],
      blobs: ["prompt_copy", "shop-mcp-visibility-tools", "zh-CN", "clipboard"],
      doubles: [1],
    });
    assert.equal(JSON.stringify(store.points[0]).includes("person@example.com"), false);
    assert.equal(JSON.stringify(store.points[0]).includes("ignore this"), false);
  });

  test("accepts case_detail_open only with via=page", async () => {
    const store = dataset();
    const ok = await onRequestPost({
      request: post({
        event: "case_detail_open",
        slug: "shop-mcp-visibility-tools",
        locale: "zh-CN",
        via: "page",
      }),
      env: { ACTIVATION: store.ACTIVATION },
    });
    assert.equal(ok.status, 200);
    assert.equal(store.points[0]?.blobs?.[0], "case_detail_open");
    assert.equal(store.points[0]?.blobs?.[3], "page");

    const bad = await onRequestPost({
      request: post({
        event: "case_detail_open",
        slug: "shop-mcp-visibility-tools",
        locale: "zh-CN",
        via: "clipboard",
      }),
      env: { ACTIVATION: store.ACTIVATION },
    });
    assert.equal(bad.status, 400);
    assert.equal(store.points.length, 1);
  });

  test("accepts prompt_copy via select", async () => {
    const store = dataset();
    const res = await onRequestPost({
      request: post({ ...valid, via: "select" }),
      env: { ACTIVATION: store.ACTIVATION },
    });
    assert.equal(res.status, 200);
    assert.equal(store.points[0]?.blobs?.[3], "select");
  });

  test("rejects a cross-origin request before writing", async () => {
    const store = dataset();
    const res = await onRequestPost({
      request: post(valid, { origin: "https://evil.example" }),
      env: { ACTIVATION: store.ACTIVATION },
    });
    assert.equal(res.status, 403);
    assert.equal(store.points.length, 0);
  });

  test("rejects unknown events, slugs, locales, and copy methods", async () => {
    const store = dataset();
    const cases = [
      { ...valid, event: "page_view" },
      { ...valid, slug: "../etc/passwd" },
      { ...valid, slug: "Person@Email" },
      { ...valid, locale: "zh-cn" },
      { ...valid, locale: "en-US<script>" },
      { ...valid, via: "pixel" },
      { ...valid, event: "prompt_copy", via: "page" },
    ];
    for (const body of cases) {
      const res = await onRequestPost({
        request: post(body),
        env: { ACTIVATION: store.ACTIVATION },
      });
      assert.equal(res.status, 400, JSON.stringify(body));
    }
    assert.equal(store.points.length, 0);
  });

  test("returns 503 and writes nothing when the binding is missing", async () => {
    const res = await onRequestPost({
      request: post(valid),
      env: {},
    });
    assert.equal(res.status, 503);
    assert.deepEqual(await res.json(), { ok: false, error: "activation_unconfigured" });
  });
});

describe("GET /api/activation", () => {
  test("reports whether the binding exists and no counts", async () => {
    const missing = await onRequestGet({
      request: new Request(`${ORIGIN}/api/activation`),
      env: {},
    });
    assert.deepEqual(await missing.json(), { ok: true, configured: false });

    const ready = await onRequestGet({
      request: new Request(`${ORIGIN}/api/activation`),
      env: { ACTIVATION: { writeDataPoint() {} } },
    });
    const body = await ready.json();
    assert.deepEqual(body, { ok: true, configured: true });
    assert.equal("count" in (body as object), false);
  });
});
