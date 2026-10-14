---
title: "WhatsApp + Gemini：收齐货件要素后调 Warp 出 LTL 运费报价"
titleEn: "WhatsApp freight quoting with Gemini + Warp LTL API"
summary: "据 n8n 官方模板：WhatsApp 进线 → HighLevel 查联系人/DND → Gemini 按固定顺序收齐起讫、重量等 → Warp LTL 报价并加佣金后回复。"
summaryEn: "Official n8n template: Gemini collects shipment details on WhatsApp, quotes via Warp LTL API, applies commission."
category: logistics
agents: ["Google Gemini"]
tools: ["n8n", "WhatsApp", "HighLevel", "Redis", "Warp LTL API"]
source: n8n
sourceUrl: https://n8n.io/workflows/16385-quote-freight-shipments-via-whatsapp-with-google-gemini-highlevel-and-warp/
sourceType: public
date: 2026-06-01
dateNote: "约；模板页写 Last update 约 4 months ago（相对 2026-10）"
featured: false
prompt: |
  You are a freight intake agent on WhatsApp for a cross-border / domestic LTL desk.
  Collect in this order until complete: shipper contact, origin ZIP, destination ZIP,
  pallet/piece count, total weight, dimensions or class if provided, pickup date window.
  When a field is missing, ask one concise question. When complete, output JSON:
  {complete:true, origin, destination, weight, pieces, dims_or_class, pickup_window, notes}
  Never invent rates. Rates come only from the quote API response the workflow attaches.
  If user opts out of contact, mark DND and stop quoting.
---

## 据公开帖摘要

模板（iamvaar）路径：非空 WhatsApp 消息 → HighLevel 查号并拦截 DND → Gemini + Redis 记忆按固定顺序补齐货件字段 → 未齐则继续追问；齐后 POST Warp LTL quote API，加上配置佣金比例再回 WhatsApp。跨境卖家/货代可用同一模式做「先收要素、再出运费」，避免 Agent 口头估价。
