---
title: "Claude + Shopify + Slack：订单/库存/退款分流客服工作流"
titleEn: "Claude + Shopify + Slack ecommerce support workflow"
summary: "据 n8n 模板：Webhook 进单 → 并行拉订单与库存 → Claude 分意图（查单/库存/退款/一般）→ 执行或 Slack 升级并落库。"
summaryEn: "n8n template: Claude classifies support intents against live Shopify data, acts or escalates to Slack."
category: customer-service
agents: ["Claude"]
tools: ["n8n", "Shopify", "Slack", "PostgreSQL"]
source: n8n
sourceUrl: https://n8n.io/workflows/13594-handle-e-commerce-support-orders-and-inventory-with-claude-shopify-and-slack/
sourceType: public
date: 2026-06-01
dateNote: "约；模板页未标精确日"
featured: false
prompt: |
  Classify this ecommerce support message into exactly one of:
  ORDER_INQUIRY | REFUND_REQUEST | INVENTORY_CHECK | PRICING_INQUIRY | GENERAL_SUPPORT
  Message: {{text}}
  Shopify context: {{order_json}} {{inventory_json}}
  Return JSON: {intent, confidence, draft_reply, needs_human, reason}.
  Never auto-approve refunds above {{limit}} without needs_human=true.
---

## 据公开帖摘要

模板说明：用 MCP/HTTP 受控访问库存与订单；可自动处理符合条件的退款、低库存（≤5）Slack 告警，并将互动写入 PostgreSQL。生产环境应对退款额度设人工闸门。
