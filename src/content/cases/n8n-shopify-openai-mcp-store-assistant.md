---
title: "n8n：用 OpenAI＋Shopify MCP 管店——商品／订单自然语言操作"
titleEn: "n8n: OpenAI + Shopify MCP store assistant for products and orders"
summary: "据 n8n 官方模板（#12296，SpaGreen）：工作流内建 Shopify MCP Server，OpenAI 助手用自然语言查改商品与订单、看店况；删除等不可逆操作要确认，并带限速与 Discord／Telegram／WhatsApp／Gmail 通知。需 Shopify Access Token 与 OpenAI 凭证。"
summaryEn: "n8n template #12296 (SpaGreen): ships a Shopify MCP Server so an OpenAI assistant can manage products/orders and analytics in natural language; deletions need confirmation, with rate limits and Discord/Telegram/WhatsApp/Gmail notifies. Needs Shopify Access Token + OpenAI credentials."
category: ops-finance
agents: ["ChatGPT", "n8n"]
tools: ["n8n", "Shopify MCP Server", "OpenAI", "Discord", "Telegram", "WhatsApp", "Gmail"]
source: n8n
sourceUrl: https://n8n.io/workflows/12296-manage-your-shopify-store-via-ai-assistant-with-openai-and-mcp-server/
sourceType: public
date: 2026-04-19
dateNote: "模板页写 Last update 约 6 months ago（相对 2026-10-19）；作者 SpaGreen Creative；2026-10-19 采编"
featured: false
prompt: |
  You are a Shopify store ops assistant running inside an n8n workflow that exposes
  Shopify tools via an MCP server. Credentials are configured outside this chat.

  Store: {{shop_domain}}
  Operator request: {{request}}

  Rules:
  1) Prefer read tools (search/get product, get order, analytics) before any write.
  2) For create/update product or order/fulfillment changes: show a short CHANGESET
     (fields changed + values) and wait for confirmation when the request is ambiguous.
  3) Deletions and other irreversible actions REQUIRE explicit human confirmation.
  4) Respect rate limits; do not hammer the Admin API in a loop.
  5) After approved writes, send the configured notification channel a one-line success
     summary (no secrets, no full access tokens).
  6) Never invent stock, price, or order status — only what tools returned.
---

## 据公开帖摘要

n8n 模板库条目「Manage your Shopify store via AI assistant with OpenAI and MCP server」（workflow id `12296`，作者 SpaGreen Creative；页面相对 2026-10-19 显示约 6 个月前更新）面向想用自然语言管店的 Shopify 店主与电商运营。工作流把对话界面接到店数据：用 OpenAI 做助手，用内建的 **Shopify MCP Server** 做商品与订单侧操作。

模板页写明的能力包括：商品创建／更新／搜索／读取／删除；订单创建／更新／读取与履约状态；结合会话历史与 Shopify 数据减少重复提问。前置条件：Shopify Access Token、OpenAI API（示例模型名页上写 gpt-4.1-mini 或类似）、以及可选的 Discord／Telegram／Rapiwa（WhatsApp）／Gmail OAuth2 通知。

重要说明（页面原文口径）：生产环境要正确配置 MCP Server；MCP Client 上的 Shopify 工具可按需开关；系统提示可改；**删除等不可逆操作需要确认**；流程含限速以免打爆 API；通知文案可自定义。页面另有「Production Deployment for MCP Server」小节指向生产部署步骤（以模板页现文为准）。

本条与仓内「Claude＋Shopify＋Slack 客服」（workflow 13594）不同：本模板强调 **OpenAI＋Shopify MCP 店务助手**（商品／订单／分析），而非客服分流。

## 要点

- 适合已在 n8n 跑店务的跨境 Shopify 卖家，把 Admin 操作收成对话＋工具调用。
- 删除与不可逆写操作必须确认；上线前在开发店测。
- 通知多通道可选，便于值班群收到「已执行」回执。

## 注意

模板由社区作者发布，能力以 n8n.io 该页与导入后的节点为准；MCP／Admin 权限过大时风险高，建议先只读再开写。不要把 Access Token 贴进提示词。
