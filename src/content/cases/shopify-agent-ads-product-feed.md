---
title: "Shopify 数据进广告 Agent：爆款、退货率与 Feed 生成"
titleEn: "Shopify data for ad agents — bestsellers, returns, feeds"
summary: "据 GitHub 公开配方：在 Cursor/Claude 等通过 MCP 查 Shopify 订单与商品，生成 Google 购物 Feed、VIP 人群与「正在投又快断货」清单。"
summaryEn: "Public GitHub recipe: MCP over Shopify for product feeds, VIP segments, and low-stock × advertised SKUs."
category: ads
agents: ["Cursor", "Claude Desktop"]
tools: ["Shopify", "Synter MCP", "Google/Meta Ads"]
source: GitHub
sourceUrl: https://github.com/Synter-Media-AI/shopify-agent
sourceType: public
date: 2026-09-01
dateNote: "约；以仓库现文为准"
featured: false
prompt: |
  Using my Shopify tools:
  1) Top 10 products by revenue this month
  2) Products with return rate above {{x}}% that are currently in ad campaigns
  3) Draft a Google Merchant Center product feed excerpt for the top 10 (title, description, link, image_link, price, availability)
  4) VIP segment: customers with 3+ orders — export email list fields only as permitted
  Do not create live campaigns without confirmation.
---

## 据公开帖摘要

仓库定位为「配方」：把 Shopify 订单/商品/客户交给广告向 Agent，例：生成购物 Feed、找复购 VIP、看哪些在投 SKU 库存告急、按退货率审视素材。需自备 MCP/凭据；改投放前保留人工确认。
