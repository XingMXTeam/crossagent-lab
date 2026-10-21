---
title: "n8n：同一库存每 10 分钟同步到 Shopify、Amazon 与 Flipkart"
titleEn: "n8n: sync one inventory count to Shopify, Amazon, and Flipkart every 10 minutes"
summary: "据 n8n 模板 #21270（作者 Rahul Joshi）：用 Google Sheets 当库存主数据与流水账，每 10 分钟把同一库存数同步到 Shopify、Amazon（SP-API）和 Flipkart；可售数先扣安全缓冲，低库存、超卖、缺货和渠道推送失败走 Slack。本站未导入、未跑该工作流。"
summaryEn: "n8n template #21270 (Rahul Joshi): Google Sheets is the inventory master and ledger; every 10 minutes it syncs one count to Shopify, Amazon SP-API, and Flipkart, subtracts a safety buffer, and Slack-alerts low stock, oversell, OOS, and failed channel pushes. Lab did not import or run it."
category: ops-finance
agents: ["n8n"]
tools: ["n8n", "Google Sheets", "Shopify Admin GraphQL", "Amazon SP-API", "Flipkart Seller API", "Slack"]
source: n8n
sourceUrl: https://n8n.io/workflows/21270-sync-inventory-across-shopify-amazon-flipkart-with-google-sheets-and-slack-alerts/
sourceType: public
date: 2026-10-21
dateNote: "模板页作者 Rahul Joshi；公开页未给出更早的 createdAt。2026-10-21 采编 Asia/Shanghai 时页面显示 Last update 8 hours ago"
featured: false
prompt: |
  You are reviewing a dry run of n8n template #21270 before any live quantity push.
  Do not call Shopify, Amazon SP-API, or Flipkart. Do not invent on-hand counts.

  I will paste:
  - Inventory Master rows: SKU, channel ids, on-hand, safety buffer
  - A few order lines already marked processed, plus any pending Stock Adjustments
  - The last cursor timestamp

  Do this:
  1) Flag SKUs whose Shopify / Amazon / Flipkart identifiers are blank or point at two different products.
  2) For each pasted SKU, show sellable qty = on-hand minus safety buffer minus new demand
     you can justify from the pasted lines only. If a line might already be in Processed Lines, say DEDUPE — do not subtract twice.
  3) List which SKUs would be pushed, and which would wait for the nightly full sync.
  4) Draft the Slack text for oversold, out-of-stock, or low-stock only when the paste supports it.
     Include velocity and days of cover only if I pasted the inputs for them.

  Rules:
  - Quantity pushes to Amazon and Flipkart are production writes. End with:
    DO NOT ACTIVATE THE SCHEDULE until a human has run this once manually.
  - Never ask me to paste LWA client secret, refresh token, or X-Shopify-Access-Token.
  - If a mapping is ambiguous, stop that SKU. Wrong SKU mapping can oversell.
---

## 解决什么问题

同一批货同时挂在 Shopify、Amazon 和 Flipkart 上时，三个后台各写各的可售数，容易超卖或一边断货、另一边仍在卖。模板 #21270 把 **Google Sheets 当作库存主数据与流水账**，每 **10 分钟**用这一份数量去回写三个渠道，并在推送失败或库存告急时发 Slack。

它解决的是**多渠道可售数对齐**，不是补货采购，也不是客服查单。与站内「Amazon n8n 库存预警」（按可售天数起草补货、采购须人批）不同：那边停在建议；本模板会把数量写回 Shopify、Amazon 和 Flipkart。与「n8n＋Claude 处理支持／库存／订单」也不同：那边是客服意图分流，不维护跨三站的库存主数据。

## 人审闸门（必须人工确认）

1. **SKU 映射** — 映射错会把 A 的库存写成 B，直接超卖。激活定时任务前，人工对过 Inventory Master 里的 Shopify inventory item／location、Amazon SKU、Flipkart SKU／product／location。
2. **先手动干跑** — 模板 Setup 写明：先手动跑一次，核对映射和初始 cursor，再打开 schedule。Lab 建议在这一步停住。
3. **渠道写入是生产操作** — 推到 Amazon、Flipkart 的数量会改变在售可买数；Shopify inventory 同样是写。不要用真实在售 SKU 做第一次试验，除非已接受超卖风险。
4. **密钥不进对话** — Amazon LWA client id／secret／refresh token、Shopify `X-Shopify-Access-Token`、Flipkart Basic Auth 只放 n8n credentials 与配置节点。不要贴进聊天或仓库。
5. **Slack 告警不是审批** — 低库存、超卖、缺货、推送失败会发消息；发不发推送仍由工作流自己决定。若要「人点头才改库存」，需在激活前自己加闸，模板页未把人工批准写成默认步骤。

## 可复现步骤

前置（模板页 Setup）：

1. Google Sheet，四个 tab：**Inventory Master**、**Processed Lines**、**Stock Adjustments**、**Sync State**。主数据含 SKU 映射与渠道 id，以及安全缓冲字段
2. n8n 凭证：Google Sheets、Slack、Shopify Admin API（HTTP Header Auth，头为 `X-Shopify-Access-Token`）、Flipkart Seller API（HTTP Basic Auth）
3. 配置代码里填写：Shopify domain、Amazon seller ID、marketplace ID、LWA client id／secret／refresh token、Flipkart location ID、full-sync hour
4. 在 Google Sheets 与 Slack 节点里填文档 ID 和频道 ID

跟做（模板页「How it works」的 7 步，本站未导入）：

1. 每 10 分钟触发，从 Sheets 读上次订单 cursor，并带一段重叠窗口，避免漏单
2. 读入 Inventory Master、Processed Lines，以及尚未处理的手工库存调整
3. 拉单：Shopify 用 Admin GraphQL 取最近更新的订单；Amazon 用 LWA token 走 SP-API 取订单与行项目；Flipkart 取 pre-dispatch 与 cancelled
4. 按 SKU 算进出：用 Processed Lines 去重，计入取消和排队中的手工调整，可售数减去该 SKU 的安全缓冲
5. 只把有变化的 SKU 推到 Shopify inventory、Amazon listing availability、Flipkart inventory；夜间 full sync 则推全部 SKU
6. 把 SKU 总量写回 Inventory Master，新流水追加到 Processed Lines，调整标记为已应用，cursor 写入 Sync State
7. Slack：超卖／缺货／低库存（含近期销量速度和 days of cover）；任一渠道推送失败另发一条

公开模板：[n8n #21270](https://n8n.io/workflows/21270-sync-inventory-across-shopify-amazon-flipkart-with-google-sheets-and-slack-alerts/)。

## 预期结果与失败限制

**预期（模板页概述）：**

- 三个渠道共用一份库存数，节奏为每 10 分钟
- Sheets 同时当主数据、已处理订单行、手工调整和同步状态
- 可售数 = 扣过安全缓冲之后的数量
- 告警覆盖低库存、超卖、缺货，以及渠道推送失败

**失败／边界：**

- 映射或 cursor 未核对就开定时任务，可能重复扣减或把数量推错 SKU
- SP-API、Shopify Admin、Flipkart Seller API 任一鉴权失败时，模板设计是发 Slack，而不是静默成功
- 模板页未写月费、未写「不会超卖」的保证；安全缓冲只是计算步骤里的减法
- 本站**未**导入 JSON、未用测试店跑通，也未核对节点内部表达式是否与概述逐句一致

## 来源与核验状态

**官方模板**

- 主链：[n8n #21270 — Sync inventory across Shopify, Amazon, Flipkart with Google Sheets and Slack alerts](https://n8n.io/workflows/21270-sync-inventory-across-shopify-amazon-flipkart-with-google-sheets-and-slack-alerts/)
- 作者 Rahul Joshi。公开页在 2026-10-21 采编时显示 Last update **8 hours ago**，页面上没有更早的 createdAt。本站未导入、未执行。

## 据公开帖摘要

n8n 模板 **#21270** 的概述：把**一份库存数量**同步到 Shopify、Amazon（SP-API）和 Flipkart，频率为每 10 分钟；Google Sheets 是库存主数据和流水账；回写渠道前减去安全缓冲；低库存与失败告警发到 Slack。

页面上的 7 步：定时读取带重叠窗口的订单 cursor；装载 Inventory Master、Processed Lines 和待处理的 Stock Adjustments；分别拉取 Shopify GraphQL 订单、经 LWA 的 Amazon 订单行、Flipkart 的 pre-dispatch 与 cancelled；按 SKU 计算变动并去重，应用取消和手工调整，再减安全缓冲得到可售数；仅推送有变化的 SKU（夜间 full sync 推全部）到三边库存；回写表格并保存 cursor；Slack 报告超卖、缺货、低库存（含速度与 days of cover），推送失败单独告警。

Setup 要求四个 Sheet tab，以及 Google Sheets、Slack、Shopify Header Auth、Flipkart Basic Auth。配置项包括 Shopify 域名、Amazon seller／marketplace、LWA 三段凭证、Flipkart location ID 和 full-sync hour。页面要求先手动跑一遍，确认映射和初始 cursor，再激活 schedule。

## English brief

n8n #21270 (Rahul Joshi) keeps one inventory count in Google Sheets and, every 10 minutes, pushes sellable qty (after a safety buffer) to Shopify, Amazon SP-API, and Flipkart, with Slack alerts for low stock, oversell, OOS, and failed pushes. Run it once by hand before enabling the schedule. Lab did not import or execute the workflow.
