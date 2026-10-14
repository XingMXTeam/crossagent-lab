---
title: "Scrape.do + GPT-4：批量抽取亚马逊商品页写入 Google Sheets"
titleEn: "Scrape.do + GPT-4 Amazon product extraction to Sheets"
summary: "据 n8n 官方模板：Sheets 读 ASIN/URL → Scrape.do 取 HTML → 清洗预抽 → GPT-4 校验名称/价格/评分/评论数/描述 → 追加结果表，供竞品与选品跟踪。"
summaryEn: "Official n8n template: sheet URLs → Scrape.do HTML → clean/pre-extract → GPT-4 verify fields → append to Google Sheets."
category: sourcing
agents: ["GPT-4 (OpenRouter / LangChain)"]
tools: ["n8n", "Scrape.do", "Google Sheets", "OpenRouter"]
source: n8n
sourceUrl: https://n8n.io/workflows/8678-extract-amazon-product-data-with-scrapedo-gpt-4-and-google-sheets/
sourceType: public
date: 2026-02-14
dateNote: "约；模板页写 Last update 约 8 months ago（相对 2026-10）"
featured: false
prompt: |
  You verify Amazon product fields extracted from HTML.
  Pre-extracted candidates: {{candidates_json}}
  HTML excerpt (title/price/rating/bullets only): {{html_excerpt}}
  Return JSON: {name, price, currency, rating, review_count, description, confidence, notes}.
  Prefer values grounded in the HTML excerpt. Mark unknown rather than inventing price, BSR, or review counts.
---

## 据公开帖摘要

Onur 的模板把竞品/选品采数做成批处理：从 Google Sheet（`TRACK_SHEET_GID`）读商品 URL → Scrape.do 拉取整页 HTML（应对反爬）→ Code 去掉脚本样式并用正则预抽 → LangChain/OpenRouter GPT-4 校验并补齐名称、价格、评分、评论数、描述 → 追加到结果 Sheet（`RESULTS_SHEET_GID`）；`Split In Batches` 控制批量。

## 要点

- 适用卖家跟踪竞品价评、营销采描述、分析建库。
- AI 扮演校验与结构化，不是实时销量数据库；未在页上出现的 BSR/销量不要编。
- 可手动或定时跑，保持监控表新鲜。

## 注意

遵守目标站点与 Scrape.do 服务条款；密钥放 n8n 凭证/变量，勿写进公开案例仓库。HTML 结构变化时需重测选择器与 Prompt。
