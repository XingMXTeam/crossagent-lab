---
title: "差评根因挖掘：Apify 拉评 + Gemini 归类改进点进 Sheets"
titleEn: "Amazon review mining — Apify scrape + Gemini root-cause into Sheets"
summary: "据 n8n 官方模板：Apify 抓指定 ASIN 的 1–2 星评，Gemini 打情感分、归类（质量／设计／物流等）并给改进建议，写入 Google Sheets，Slack 通知批次完成。"
summaryEn: "Official n8n template: Apify pulls 1–2★ reviews, Gemini scores/categorizes and suggests fixes, appends Sheets rows, Slack on batch done."
category: listing
agents: ["Google Gemini"]
tools: ["n8n", "Apify", "Google Sheets", "Slack"]
source: n8n
sourceUrl: https://n8n.io/workflows/11027-extract-and-analyze-amazon-reviews-with-apify-gemini-ai-and-save-to-google-sheets/
sourceType: public
date: 2026-10-16
dateNote: "模板页 Last update 约 8 months ago；2026-10-16 采编"
featured: false
prompt: |
  For each Amazon review below, return JSON:
  {sentiment_score:1-5, category: Quality|Design|Shipping|Packaging|SizeFit|Other, summary, improvement}.
  Focus on actionable product/listing fixes. Do not invent order IDs.
  Review:
  {{review_text}}
---

## 据公开帖摘要

面向产品经理、FBA／D2C 卖家与竞品调研：用 Apify actor `junglee/amazon-reviews-scraper` 拉取指定商品页评价（默认真对 1–2 星），逐条交给 Gemini 做情感、问题类目、投诉摘要与改进计划，Code 节点规整 JSON 后追加到 Sheets，并 Slack 提示批次结束。默认提示词可输出日文，可改成中英文。

## 要点

- 适合「Voice of Customer」批处理，替代人工通读差评。
- Sheets 表头建议：`sentiment_score` / `category` / `summary` / `improvement`。
- 可换竞品 ASIN 做弱点对照，再回流到标题五点或主图卖点。

## 注意

爬取与站点 ToS／频率限制自行合规；模型建议仅供运营参考，改 Listing／供货前需人工复核。
