---
title: "用 MCP 把 Agent 变成选品助理：一句话拉蓝海短名单"
titleEn: "MCP seller agent — blue-ocean shortlist in one prompt"
summary: "据公开教程：安装 Sorftime Seller Agent（MCP）后，用 Claude Code / Cursor 等查询类目、竞争与 FBA 盈亏，替代多标签页翻数据。"
summaryEn: "Public tutorial: connect sorftime-seller-agent MCP so Claude/Cursor queries marketplace data and returns ranked opportunities."
category: sourcing
agents: ["Claude Code", "Cursor"]
tools: ["Sorftime MCP", "Amazon"]
source: 博客
sourceUrl: https://tomi431.github.io/Tomi/2026/07/27/ai-agent-product-research-assistant.html
sourceType: public
date: 2026-07-27
featured: true
prompt: |
  Find blue ocean products in kitchen storage on Amazon US.
  Identify ones with low brand concentration, strong demand, and manageable competition for a new seller.
  For each candidate return: opportunity score rationale, brand concentration risk, FBA fee / breakeven notes, and keyword gaps vs top ASINs.
  Flag uncertain / modeled sales estimates explicitly.
---

## 据公开帖摘要

Seller MCP Playbook（2026-07-27）介绍开源 `sorftime-seller-agent`：经 MCP 把 `product_search`、`category_report`、`keyword_detail` 等交给 Agent。作者对比人工 15–30 分钟/品 vs Agent 约 1 分钟内的结构化短名单，并明确**不保证爆款**、销量多为模型估计。
