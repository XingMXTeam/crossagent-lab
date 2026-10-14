---
title: "PPC 异常告警：ACOS 漂移与烧钱无转化词的日更推送"
titleEn: "PPC anomaly alerts — ACOS drift & wasted search terms"
summary: "据同一公开文：把广告数据拉进 n8n，标记 ACOS 漂移、无转化浪费与预算过早耗尽，走「有事再找我」而非天天盯盘。"
summaryEn: "Same public guide: pull ads data, flag ACOS drift / wasted terms / early budget burn, alert-only."
category: ads
agents: ["LLM via n8n"]
tools: ["n8n", "Amazon Ads / SP-API"]
source: 博客
sourceUrl: https://www.amzglobalexperts.com/blog/automate-amazon-operations-n8n-ai-workflows-aws-mongodb
sourceType: public
date: 2026-08-01
dateNote: "约；同文"
featured: false
prompt: |
  You are a PPC anomaly analyst. Input: yesterday vs 14-day baseline by campaign and top search terms.
  Flag: ACOS drift > {{threshold}}, spend with 0 orders above {{min_spend}}, budgets exhausted before {{hour}}.
  Output Slack-ready bullets with evidence columns. Suggest actions but do not change bids.
---

## 据公开帖摘要

原文将 PPC 数据采集与异常检测列为「告警优于看板」的典型；改价/出价超出预批范围仍应人工。适合跨境多 ASIN 账户的日常守夜。
