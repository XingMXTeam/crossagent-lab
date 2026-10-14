---
title: "搜索词报告否词：阈值自算 + AI 只做分类与说明"
titleEn: "Search-term negatives — your math, AI classification"
summary: "据 AMZBase 方法文 + Trellis 工作流思路：否词阈值按自己的转化率/边际算；可用 AI 辅助分类，但别让模型替你定阈值。"
summaryEn: "AMZBase method + Trellis idea: derive negate thresholds from your CVR/margin; AI can classify, not invent rules."
category: ads
agents: ["ChatGPT"]
tools: ["Sponsored Products Search Term Report"]
source: 博客
sourceUrl: https://amzbase.com/guides/amazon-ppc-negative-keywords/
sourceType: public
date: 2026-09-01
featured: false
prompt: |
  My storefront CVR is {{cvr}}%. Break-even cost per order is ${{be}}.
  From this search term report (30–60d, exclude last 7d for attribution lag):
  [paste CSV]
  1) List NEGATE candidates: 0 orders and (clicks high enough that (1-cvr)^n < 5% OR spend ≥ 2× break-even)
  2) List semantic-wrong terms to negate immediately
  3) For each: recommend negative exact vs phrase and campaign vs ad group level
  Explain the click math. Do not negate converting terms.
---

## 据公开帖摘要

AMZBase（2026-09-01）详解搜索词报告四过滤器、否词 exact/phrase 与广告组/广告活动层级；强调阈值来自你的转化率算术而非平台「标准 N 次点击」。与 Trellis「你定规则、模型应用」一致——适合跨境卖家周度 20 分钟复盘。
