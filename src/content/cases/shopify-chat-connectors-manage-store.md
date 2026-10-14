---
title: "Shopify 官方：在 ChatGPT/Claude 里管店（查单、改价、看报表）"
titleEn: "Shopify chat connectors — manage store from ChatGPT/Claude"
summary: "据 Shopify 官网 Build with AI：商家可用 ChatGPT/Claude 等连接店铺，自然语言加品、查单、改价与拉报表；权限可随时收回。"
summaryEn: "Shopify official Build with AI: chat connectors for orders, prices, reports; revoke permissions anytime."
category: ops-finance
agents: ["ChatGPT", "Claude"]
tools: ["Shopify"]
source: 官网
sourceUrl: https://www.shopify.com/build-with-ai
sourceType: public
date: 2026-05-01
dateNote: "约；以官网现文为准"
featured: false
prompt: |
  You are connected to my Shopify store with read/write scopes I approved.
  1) Summarize yesterday's orders: count, revenue, top SKUs, refunds
  2) List products with inventory < 5
  3) Propose price updates for [SKU list] with rationale — wait for my OK before applying
  Never touch checkout/payment settings. Confirm each write.
---

## 据公开帖摘要

Shopify 说明可用聊天助手「保持生意运转」，并列出 ChatGPT、Claude、Muse、Perplexity；开发向则有 AI Toolkit（Claude Code、Cursor 等）。敏感结账与支付仍由 Shopify 处理；应用权限可在后台审查与撤销。
