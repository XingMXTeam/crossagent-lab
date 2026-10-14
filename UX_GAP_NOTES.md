# CrossAgent Lab — UX gap notes (submit / newsletter / sponsor)

Date: 2026-10-13 (Asia/Shanghai)

## Update 2026-10-14 — 「我想要这个」

Card and case-detail CTA go to `/want/{slug}/`. Delivery is FormSubmit → `xunxing1989@gmail.com` (on-site form). Newsletter stays Mailchimp. `/submit/` mailto is unchanged.

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
