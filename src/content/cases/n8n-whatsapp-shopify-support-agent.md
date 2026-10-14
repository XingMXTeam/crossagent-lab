---
title: "n8n + LLM：Shopify 品牌 WhatsApp 查单与库存客服 Agent"
titleEn: "n8n WhatsApp support agent for Shopify brands"
summary: "据 n8n 官方模板：WhatsApp 触发 → 意图路由 → Orders/Products Agent 调 Shopify API → 回复或转人工；强调少传 PII。"
summaryEn: "Official n8n template: WhatsApp intent router + LLM agents query Shopify orders/products, else hand off to humans."
category: customer-service
agents: ["OpenAI", "LLM Agent"]
tools: ["n8n", "Shopify Admin API", "WhatsApp"]
source: n8n
sourceUrl: https://n8n.io/workflows/8323-ai-powered-whatsapp-customer-support-for-shopify-brands-with-llm-agents/
sourceType: public
date: 2026-02-01
dateNote: "约；页面写 Last update 约 8 months ago"
featured: true
prompt: |
  You are an Orders Agent for a Shopify store.
  Customer message: "{{message}}"
  Phone-linked customer orders JSON: {{orders}}
  Reply with: order status, ETA if present, tracking URL if present.
  If multiple orders, ask which order number. If data missing, say what is missing — do not invent tracking numbers.
  Escalate to human if refund/address change/legal threat.
---

## 据公开帖摘要

模板作者 Ruthwik 描述路径：查客户 → Switch 意图（welcome / orderStatus / product / support）→ Orders Agent 或 Products Agent 调 Shopify HTTP → WhatsApp 回复；不清不楚则转发支持渠道。注意 WhatsApp 会话计费、Shopify 限流、以及**避免把完整 PII 送给模型**。
