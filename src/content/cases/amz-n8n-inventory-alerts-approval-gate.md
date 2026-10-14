---
title: "Amazon n8n 库存预警：Days-of-cover + AI 补货草稿 + 人工闸门"
titleEn: "Amazon n8n inventory alerts with human approval gates"
summary: "据 AMZ Global Experts 公开文：SP-API 拉 FBA 库存与动销，算可售天数，AI 起草补货建议，采购承诺必须过人审。"
summaryEn: "Public AMZ Global Experts guide: SP-API velocity + days-of-cover alerts; AI drafts reorder; humans approve POs."
category: ops-finance
agents: ["LLM via n8n"]
tools: ["n8n", "Amazon SP-API", "MongoDB", "Slack"]
source: 博客
sourceUrl: https://www.amzglobalexperts.com/blog/automate-amazon-operations-n8n-ai-workflows-aws-mongodb
sourceType: public
date: 2026-08-01
dateNote: "约；页面未标精确日"
featured: true
prompt: |
  Given FBA inventory and sell-through for each SKU:
  [paste table: sku, on_hand, inbound, units_7d, units_30d, lead_time_days]
  Compute days_of_cover. Flag SKUs with cover < lead_time + 14.
  Draft reorder recommendations with qty math shown.
  End with: ACTIONS REQUIRING HUMAN APPROVAL (no auto purchase).
---

## 据公开帖摘要

文章归纳卖家社群诉求：怕静默失败、要告警不要看板、**不信任全自动改价/改库存**。推荐 n8n 编排 SP-API → AI 判断 → MongoDB 审计 → 高风险动作人工闸门；库存流是优先落地场景之一。
