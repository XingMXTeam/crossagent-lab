---
title: "SoldScope MCP：让 ChatGPT/Claude/Cursor 查真实亚马逊数据"
titleEn: "SoldScope MCP — live Amazon data in ChatGPT, Claude, Cursor"
summary: "据产品页公开说明：MCP 把关键词、类目筛选与实时 ASIN 数据暴露给 Agent，避免模型瞎猜市场数字。"
summaryEn: "Public product page: MCP tools for keyword research, product search, and live ASIN pulls inside MCP clients."
category: sourcing
agents: ["ChatGPT", "Claude", "Cursor"]
tools: ["SoldScope MCP"]
source: 官网
sourceUrl: https://www.soldscope.com/solutions/mcp
sourceType: public
date: 2026-10-01
dateNote: "约 2026；以页面现文为准"
featured: false
prompt: |
  Using SoldScope (or equivalent Amazon data MCP), for ASIN [ASIN]:
  1. Pull search volume / organic & sponsored ranks / CPC / opportunity scores if available
  2. List top competing ASINs in the same niche with price and review counts
  3. Summarize keyword gaps I could target
  Never invent marketplace metrics — only report tool output; if a field is missing, say so.
---

## 据公开帖摘要

SoldScope 公开页说明：MCP 可做单 ASIN/多 ASIN 关键词研究、类目树与筛选搜品、最多 10 个 ASIN 的实时价格与 Buy Box。权限由用户授予；适用于 ChatGPT、Claude、Cursor 等支持 MCP 的客户端。
