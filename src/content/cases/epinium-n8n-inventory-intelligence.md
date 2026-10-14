---
title: "n8n 库存智能 Agent：销量速度 × 交期 × 促销日历出补货建议"
titleEn: "n8n inventory intelligence agent — reorder with reasoning"
summary: "据 Epinium 公开文：库存 Agent 不只阈值告警，还会结合销量速度、供应商交期与促销计划生成带理由的补货优先级。"
summaryEn: "Public Epinium article: inventory agent combines velocity, lead times, and promo calendar into prioritized reorder recs."
category: ops-finance
agents: ["n8n AI Agent", "GPT-4o / Claude"]
tools: ["n8n", "Shopify/DB", "Slack"]
source: 博客
sourceUrl: https://epinium.com/en/blog/ecommerce-ai-agent-n8n/
sourceType: public
date: 2026-01-15
dateNote: "约 2025–2026 文；以页面现文为准"
featured: true
prompt: |
  You are an inventory intelligence agent.
  Inputs: stock by SKU, 30/90-day sales velocity, supplier lead times (days), upcoming promos, margin floor.
  Output a prioritized reorder table: SKU, days_of_cover, recommended_qty, reasoning, anomaly_flags (e.g. 3x velocity spike).
  Do not place POs — recommendations only for human approval.
---

## 据公开帖摘要

文章列出电商最高 ROI Agent：库存智能、询盘处理（号称可达 30–50% 工单分流）、内容生成管线、竞品定价分析。架构建议从「只推荐」跑 2–4 周再逐步放开写操作；可自托管以降低 PII 外泄。
