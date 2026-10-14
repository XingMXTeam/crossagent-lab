---
title: "询盘处理 Agent：订单库 + FAQ + 物流 API，草稿或自动结案"
titleEn: "Customer inquiry agent with order DB, FAQ, carrier API"
summary: "据同一公开文：客服 Agent 查订单与政策后自动结案或带上下文交人审；适合「物流到哪了」类高频问题。"
summaryEn: "Same public piece: inquiry agent resolves or drafts with context; 30–50% deflection cited for basic order questions."
category: customer-service
agents: ["n8n AI Agent"]
tools: ["订单库", "FAQ", "承运商 API"]
source: 博客
sourceUrl: https://epinium.com/en/blog/ecommerce-ai-agent-n8n/
sourceType: public
date: 2026-01-15
dateNote: "约；同文"
featured: false
prompt: |
  Customer ticket: {{ticket}}
  Tools results: order={{order}}, tracking={{tracking}}, policy_excerpts={{faq}}
  Decide: AUTO_RESOLVE or DRAFT_FOR_HUMAN.
  If AUTO_RESOLVE, write the customer reply using only tool facts.
  If DRAFT_FOR_HUMAN, include suggested reply + unresolved questions.
  Never invent tracking or refund eligibility.
---

## 据公开帖摘要

作者推荐 Research-and-draft 双阶段：先检索事实再生成回复，降低幻觉。数字「30–50% deflection」来自原文对基础订单/产品问题的经验区间，非本站实测。
