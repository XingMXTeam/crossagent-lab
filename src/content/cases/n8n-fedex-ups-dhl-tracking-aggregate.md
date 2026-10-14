---
title: "n8n 聚合 FedEx/UPS/DHL 轨迹：统一状态表 + 断路器"
titleEn: "Aggregate FedEx/UPS/DHL tracking into one status schema"
summary: "据 n8n 官方模板：每 15 分钟拉取未完结货件，按承运商查轨迹，归一化为 PRE_TRANSIT/IN_TRANSIT/EXCEPTION 等，写入同一张表；429/5xx 走断路器。"
summaryEn: "Official n8n template: poll active shipments every 15 min across FedEx/UPS/DHL, normalize statuses, circuit-break on 429/5xx."
category: logistics
agents: ["n8n 工作流"]
tools: ["n8n", "FedEx Track API", "UPS Track API", "DHL API", "n8n Data Table"]
source: n8n
sourceUrl: https://n8n.io/workflows/16338-aggregate-shipment-tracking-statuses-with-fedex-ups-and-dhl/
sourceType: public
date: 2026-06-01
dateNote: "约；模板页写 Last update 约 4 months ago（相对 2026-10）"
featured: true
prompt: |
  You normalize multi-carrier tracking for a cross-border seller.
  Input rows: trackingNumber, carrier (fedex|ups|dhl|other), rawStatus, httpStatus, lastCheckedAt.
  Output for each row:
  - canonicalStatus: one of PRE_TRANSIT | IN_TRANSIT | OUT_FOR_DELIVERY | DELIVERED | EXCEPTION | RETURNED_TO_SENDER | UNKNOWN
  - exception_hint: short note if EXCEPTION (customs hold, address issue, delay) — only from rawStatus text, never invent
  - action_for_ops: SLA_OK | WATCH | ESCALATE_CARRIER | NOTIFY_BUYER_DRAFT
  Skip rows already DELIVERED or RETURNED_TO_SENDER.
  Do not invent ETAs or tracking events missing from input.
---

## 据公开帖摘要

Kyle T. 的 n8n 模板写明：定时拉取 Data Table `shipment_tracking` 中未完结货件 → 按 `carrier` 路由 FedEx/UPS/DHL → 带断路器调轨迹 API → 归一化 `canonicalStatus`（含 PRE_TRANSIT、IN_TRANSIT、OUT_FOR_DELIVERY、DELIVERED、EXCEPTION、UNKNOWN）→ 以 trackingNumber 回写。适合跨境卖家把头程/尾程多承运商轨迹收成一张异常看板，再交给客服 Agent 起草说明（不自动承诺放行）。
