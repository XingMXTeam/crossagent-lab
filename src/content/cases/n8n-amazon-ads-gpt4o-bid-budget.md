---
title: "Amazon 广告周复盘：n8n + GPT-4o 出价／预算／关键词建议"
titleEn: "Amazon Ads weekly review — n8n + GPT-4o bid, budget & keyword recs"
summary: "据 n8n 官方模板：从 Google Drive 拉取 Sponsored Products 五类报表，GPT-4o 分析活动／搜索词／版位／预算，结构化优化建议发到 Gmail；不自动改价。"
summaryEn: "Official n8n template: pull five Sponsored Products reports from Drive, GPT-4o analyzes campaigns/search terms/placements/budgets, emails structured recs — no auto bid changes."
category: ads
agents: ["GPT-4o"]
tools: ["n8n", "Amazon Ads reports", "Google Drive", "Gmail", "OpenAI"]
source: n8n
sourceUrl: https://n8n.io/workflows/3793-optimize-amazon-ads-with-gpt-4o-for-bid-budget-and-keyword-recommendations/
sourceType: public
date: 2026-10-16
dateNote: "模板页 Last update 约 8 months ago；2026-10-16 采编"
featured: true
prompt: |
  You are an Amazon Sponsored Products analyst. Input: last-30-days Campaign, Targeting, Search Term, Placement, and Budget reports (tables attached).
  For each ASIN/campaign family: (1) flag ACOS/ROAS outliers vs account median, (2) list wasteful search terms (spend>X, 0 orders), (3) placement skew, (4) budget-capped winners.
  Output Gmail-ready markdown with: evidence columns, suggested bid/budget/negative actions, and CONFIDENCE. Do not claim you changed live bids.
---

## 解决什么问题

据 n8n 官方模板，卖家／广告主把 Amazon Ads Console 导出的 Sponsored Products 报表落到 Google Drive，n8n 拉取后由 GPT-4o 分析活动、搜索词、版位与预算。结构化优化建议发到 Gmail，不自动改价。

## 用什么工具

- n8n
- Amazon Ads reports
- Google Drive
- Gmail
- OpenAI
- GPT-4o

## 输入 → 输出

输入：落到 Google Drive 的 Sponsored Products 报表文件（csv／xlsx），五类为 Search Term／Targeting 明细与 Campaign／Placement／Budget 汇总（Last 30 Days、Daily）。输出：经 Gmail 发出的结构化优化建议（活动、关键词、定向、版位与预算分析）。

## 限制 / 须人审

不自动改出价或预算，须人工审核。生产环境应把出价／预算变更留给人工或带审批闸门的下游工作流；模板本身只产出建议邮件。

## 原始出处

[https://n8n.io/workflows/3793-optimize-amazon-ads-with-gpt-4o-for-bid-budget-and-keyword-recommendations/](https://n8n.io/workflows/3793-optimize-amazon-ads-with-gpt-4o-for-bid-budget-and-keyword-recommendations/)

## 据公开帖摘要

模板面向卖家／广告主：把 Amazon Ads Console 导出的 Sponsored Products 报表落到 Google Drive，n8n 自动下载并规范化文件名，送入 GPT-4o 做活动、关键词、定向、版位与预算分析，再经 Gmail 发出结构化优化指令。支持多 ASIN、多广告账户复制；可选日后接 Ads API 全自动拉报。

## 要点

- 输入是 **报表文件**（csv／xlsx），不是静默改价 API。
- 需在 Ads Console 定时导出五类报表（Search Term／Targeting 明细 + Campaign／Placement／Budget 汇总），Last 30 Days、Daily。
- 适合跨境多站点的「周复盘／日摘要」守夜，而不是无人值守调价。

## 注意

生产环境应把出价／预算变更留给人工或带审批闸门的下游工作流；模板本身只产出建议邮件。
