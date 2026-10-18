---
title: "HN：实测 20 家「Agent 就绪」Shopify 店，四分之一卡在加购"
titleEn: "HN: 20 'agent-ready' Shopify stores tested — 25% silently fail at add-to-cart"
summary: "据 Hacker News 帖与公开仓：作者用无头浏览器脚本模拟 AI 买家，测了 20 家在 UCP 注册表里标为已验证的 Shopify 店。13 家能走到结账页，5 家点了加购但购物车为空，另有 2 家按钮禁用或没有加购。结论：发了 manifest 不等于 Agent 真能买，卖家应按「能否完成加购到结账」自测。"
summaryEn: "HN post + public repo: a headless-browser buyer tested 20 verified UCP Shopify stores; 13 reached checkout, 5 silently failed at add-to-cart, 2 had disabled or no add button. A manifest is not proof agents can buy — test the actual cart-to-checkout path."
category: ops-finance
agents: ["AI 购物 Agent（ChatGPT／Perplexity／Google 等）", "Playwright 脚本"]
tools: ["headless Chromium", "UCP manifest", "Shopify 店铺"]
source: Hacker News
sourceUrl: https://news.ycombinator.com/item?id=49396489
sourceType: public
date: 2026-08-22
dateNote: "HN 发帖日；数据与脚本见 github.com/MythrilS/agent-ready-checkout（README／results.json／checkout_test.py）；2026-10-18 采编"
featured: false
prompt: |
  You are a QA agent checking whether store {{store_url}} works for AI shopping agents.
  Use a browser tool. Do NOT submit payment.

  For {{n}} products picked from different collections:
  1) Open the product page; if variants exist, select an in-stock variant.
  2) Click add-to-cart, then open /cart and confirm the line item really exists.
  3) Click checkout and confirm the email/payment fields render.
  4) Record per product: url | variant_selected | add_clicked | cart_has_item | checkout_reached | notes.

  Rules:
  - "Clicked" is not success; only a line item in /cart counts.
  - If a result is ambiguous (cart state unreadable), mark it UNVERIFIED, not FAIL.
  - Summarize: pass rate, failure types, and the 3 fixes most likely to help (e.g. variant selector not exposed, JS-only cart drawer, disabled button).
---

## 据公开帖摘要

Hacker News 帖（`https://news.ycombinator.com/item?id=49396489`，2026-08-22）链接作者 MythrilS 的公开仓 `agent-ready-checkout`。作者从公开的 UCP 注册表里挑了 20 家标为已验证的 Shopify 店，这些店都发布了 UCP manifest，向 AI 购物 Agent 声明「可以来买」。他用无头 Chromium 加一个标明身份的 UA 做自动买家：找真实商品、选变体、点加购、去 `/cart` 确认有没有商品行、再点结账，**全程不提交付款**。

仓内 README 给的结果：13 家（65%）能走到结账页；5 家（25%）点了加购但购物车仍为空；1 家加购按钮一直禁用，自动化拿不到可选变体；1 家根本没有加购（商品其实是活动页）。作者自己列了局限：这是脚本不是 LLM Agent；走到结账不等于成交，支付、3DS 和风控没测；样本只有 20 家、单一平台；5 家加购失败里有 3 家结果存疑，可能是检测器的问题。逐店结果和脚本都在仓里（`results.json`、`checkout_test.py`），可以复跑。

## 要点

- 现有检查工具多数只看 manifest 是否存在、格式是否正确，不看购买链路能不能走通。
- 卖家自测重点：变体选择器是否对自动化可见、加购后购物车是否真的有货、结账页能否打开。
- 用 Agent 做回归巡检：每次改主题或装插件后跑一遍「加购到结账」，比只看评分可靠。

## 注意

样本小且是自选群体，65% 只能看作偏乐观的上限，不代表全平台比例。测试时不要提交真实付款，并遵守店铺的 robots 和服务条款。
