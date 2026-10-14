---
title: "用 ChatGPT 做亚马逊 Niche 验证：先喂真实数据再分析"
titleEn: "ChatGPT for Amazon niche validation — feed real data first"
summary: "据公开博客摘要：ChatGPT 适合分析你粘贴的竞品/评论/BSR，不能当实时数据库；工作流是工具取数 → AI 结构化评估。"
summaryEn: "Public blog: ChatGPT analyzes pasted niche data; it cannot pull live BSR/sales. Gather data, then ask for structured evaluation."
category: sourcing
agents: ["ChatGPT"]
tools: ["Keepa", "Helium 10", "Jungle Scout"]
source: 博客
sourceUrl: https://ooty.io/blog/chatgpt-amazon-product-research
sourceType: public
date: 2026-04-13
featured: true
prompt: |
  I'm evaluating a product niche on Amazon. Here are the details for the top 10 products in [category]:
  
  [Paste: product name, price, review count, rating, BSR, estimated monthly revenue if available]
  
  Analyze this niche. Specifically:
  1. What is the price range and where is demand concentrated?
  2. How many reviews do the top sellers have, and what does that imply about barrier to entry?
  3. Are there signs of market saturation (many similar listings, tight price clustering)?
  4. Are there gaps: price points not covered, features mentioned in reviews but not offered?
  5. What would a new entrant need to differentiate?
  
  Do not invent BSR, sales, or prices I did not provide. Mark missing fields as unknown.
---

## 据公开帖摘要

Ooty 平台分析师 Priya Kapoor（2026-04-13）写明：ChatGPT 能分析你粘贴的 Listing、评论模式、关键词分组与定价框架，但**不能**访问实时 BSR、销量估计或库存。正确用法是「工具取数 → AI 当分析师」。

## 结果/要点

- 给出可复用的 Niche Evaluation Prompt（价位、评论壁垒、饱和信号、缺口、进入差异化）。
- 完整流程约 8 步：从类目候选到财务模型与 Listing 起草，作者称系统做可压到一个下午。

## 注意

文中提到的 MCP/产品连接是作者方工具；摘要只保留「先喂数据再分析」这一通用模式。
