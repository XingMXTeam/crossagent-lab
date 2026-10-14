# CrossAgent Lab — UX gap notes (submit / newsletter / sponsor)

Date: 2026-10-13 (Asia/Shanghai)

## Update 2026-10-14 — 「我想要这个」 is a like

Card and case-detail 「我想要这个」 toggles a public count via `GET/POST /api/votes` (`{ id, on }`). It does not open a form or mailto. Same-browser state is `localStorage` key `crossagent-votes`. `/want/*` FormSubmit pages remain for direct URLs only. Newsletter stays Mailchimp. `/submit/` mailto is unchanged. Production KV binding name: `VOTES` (not created in this change).

## Form delivery path

**Chosen: `mailto:xunxing1989@gmail.com`** (client-side prefilled subject + body).

Checked repo / env / stores for Web3Forms `access_key`, Formspree endpoint, Buttondown public form, Lemon Squeezy / Paddle URLs — **none found**. Did not invent keys.

| Surface | Mechanism |
|--------|-----------|
| `/submit/` | JS builds mailto with title, source URL, description, agent, optional credit/email |
| `/newsletter/` | JS builds mailto subscribe intent |
| Homepage compact form | Same mailto subscribe intent |
| `/sponsor/` CTA「立即赞助」 | mailto Founding sponsorship; note「付款链接接入中」 |

When a Web3Forms / Formspree / ESP key or Lemon/Paddle URL is available, swap the form `action` / CTA `href` and keep the same fields.

## Nav

`BaseLayout.astro` meta + plain nav rows now include **提交** → `/submit/`.

## Case content

`src/content/cases/**` was not modified.
