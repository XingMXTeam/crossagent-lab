---
title: "n8n 拉取并解析 Amazon SP-API 报表为结构化 TSV 行"
titleEn: "Fetch & parse Amazon SP-API reports into structured TSV rows"
summary: "据 n8n 官方模板：LWA 换 token → Reports API 建报 → 轮询 DONE → 下载（可选 GZIP 解压）→ 按行解析 TSV，供下游库存/对账/广告分析。"
summaryEn: "Official n8n template: LWA auth, create SP-API report, poll DONE, download/decompress, parse TSV into one item per row."
category: ops-finance
agents: ["n8n 工作流"]
tools: ["n8n", "Amazon SP-API", "Login with Amazon"]
source: n8n
sourceUrl: https://n8n.io/workflows/16399-fetch-and-parse-amazon-sp-api-reports-into-structured-tsv-rows/
sourceType: public
date: 2026-07-14
dateNote: "约；模板页写 Last update 约 3 months ago（相对 2026-10）"
featured: false
prompt: |
  You help a seller interpret one Amazon SP-API report row after n8n parsed TSV.
  Report type: {{report_type}}
  Row JSON: {{row}}
  Output:
  1) plain-language what this row means for ops/finance
  2) anomaly flags only if fields in the row justify them (missing SKU, negative qty, empty marketplace)
  3) suggested next human check — no invented metrics outside the row
  Do not invent sales, fees, or inventory not present in the input.
---

## 据公开帖摘要

模板为手动触发的 SP-API 报表底座：用 LWA（refresh_token / client_id / client_secret）换 access token → 按配置的 `report_type` 与 `marketplace_ids` 创建报表 → 轮询至 DONE（失败或超时则报错）→ 取 document 元数据并下载 → 若 GZIP 则解压 → 将 TSV 解析为每行一个 n8n item。下游可自行接到库表、Sheets 或告警流。

## 要点

- 需正确选区域端点（EU / NA / FE）与报表类型。
- 模板本身不做业务判断；适合作为库存、结算、流量等报表的统一入口。
- 凭证与 refresh token 勿提交进公开仓库。

## 注意

SP-API 有配额与角色权限限制；生产应加错误分支与审计日志，再接 LLM 做解读时务必只基于已解析字段。
