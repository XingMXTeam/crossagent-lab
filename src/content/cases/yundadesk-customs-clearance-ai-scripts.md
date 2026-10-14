---
title: "清关话术进知识库：关税谁付、卡单解释、补资料提醒"
titleEn: "Customs-clearance scripts for AI knowledge bases"
summary: "据 YundaDesk 中文公开文：把清关状态翻译成人话，按目的国政策进知识库；AI 先解释，退款/赔付/改价必须人工审批。"
summaryEn: "YundaDesk Chinese guide: destination-aware customs scripts in the KB; AI explains, humans approve refunds/claims."
category: logistics
agents: ["AI 客服", "知识库 RAG"]
tools: ["跨境 CRM", "目的国政策知识库", "承运商轨迹"]
source: 官网
sourceUrl: https://yundadesk.com/zh/blog/customs-clearance-explainer-scripts/
sourceType: public
date: 2025-12-22
dateNote: "原文标注 2025-12-22，页脚更新于 2026-07-25"
featured: true
prompt: |
  买家问清关/关税。上下文：国家={{country}}，订单税费规则={{duties_rule}}，轨迹原文={{tracking_raw}}，语言={{lang}}。
  从知识库摘录（仅可引用）：{{kb_excerpts}}
  规则：
  1) 把 carriers 状态翻成白话（in progress / held / need info / duties pending），不要承诺「立刻放行」。
  2) 关税谁付：严格按订单是否含税说明；税额以当地通知为准。
  3) 补资料：只说明要准备什么，敏感证件不要走公开评论。
  4) 涉及退款、赔付、改价 → 输出 DRAFT + needs_human=true。
  输出买家语言短回复；信息不足则索取订单号/承运商通知截图，禁止编造税费金额。
---

## 据公开帖摘要

YundaDesk 团队文强调：客户看到 customs clearance 会担心丢件与加价；客服应讲清责任、状态与下一步。文中给出未含税/已含税/质疑三类关税话术，以及 in progress、held、additional information、duties pending 的解释模板，并说明 CRM 记国家 + 知识库按目的国维护 + AI 检索回答、高风险转人工。适合跨境卖家把「卡在海关」高频会话标准化。
