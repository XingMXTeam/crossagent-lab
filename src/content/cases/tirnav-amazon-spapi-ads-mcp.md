---
title: "库存感知广告：SP-API + Ads API 经 MCP 喂给 Agent"
titleEn: "Inventory-aware ads — SP-API + Ads API via MCP for agents"
summary: "据 Tirnav 公开文：用 MCP 把 SP-API（订单／库存／Listing）与 Ads API（活动／搜索词／预算）做成只读工具，跨库回答「快断货还在烧广告」类问题；写操作分草稿与人审。"
summaryEn: "Public Tirnav guide: MCP wraps SP-API + Ads API as governed tools so agents can join stock risk with ad waste; writes stay draft/approval-gated."
category: ads
agents: ["Claude Code", "MCP-compatible agents"]
tools: ["MCP", "Amazon SP-API", "Amazon Ads API"]
source: 博客
sourceUrl: https://tirnav.com/blog/connect-amazon-sp-api-and-amazon-ads-api-with-mcp
sourceType: public
date: 2026-10-16
dateNote: "2026-10-16 采编；以页面现文为准"
featured: true
prompt: |
  Using only approved MCP tools (inventory summary + campaign performance + search terms):
  List ASINs with active ad spend in the last 7 days AND days_of_cover < 7.
  Rank by wasted_risk = spend_7d / max(days_of_cover, 0.5).
  For each: suggest pause or budget cut; mark ACTIONS REQUIRING HUMAN APPROVAL.
  Do not call write tools.
---

## 据公开帖摘要

文章论证：只接 SP-API 或只接 Ads API 都不够——运营要的是「库存／Listing 问题 × 广告花费」的交叉判断。推荐架构为 AI 助手 → MCP Connector（鉴权、校验、审计、审批）→ SP-API + Ads API。先上只读工具（库存摘要、订单、Listing 问题、活动表现、搜索词、跨渠道 SKU 汇总），再上草稿与审批写工具（改预算、暂停活动、提交 Feed）。

## 高价值场景（原文归纳）

- 库存感知广告：停烧快断货 SKU，给有货爆款加预算。
- 抑制 Listing 仍在投流：先停浪费再修内容。
- 周经营复盘：订单趋势 + 库存风险 + 广告回报一稿。

## 注意

PII／RDT、多 marketplace 与 Ads profile 映射、报表异步与限流都要在 MCP 层处理；不要把原始凭证暴露给模型。
