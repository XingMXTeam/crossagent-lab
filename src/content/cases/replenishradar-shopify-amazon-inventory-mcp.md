---
title: "ReplenishRadar MCP：Shopify＋FBA 库存／断货风险／草稿 PO（须人批）"
titleEn: "ReplenishRadar MCP: Shopify + FBA stockout risk and draft POs (human approval)"
summary: "据 ReplenishRadar 功能页与 2026-10-30 更新的 MCP 指南：本地包 @replenishradar/mcp-server（npm latest 1.1.1）把 Claude Desktop／OpenClaw／n8n 接到多渠道库存——Shopify on-hand、FBA available／inbound、断货风险、需求预测与草稿采购单；公开路径上 PO 先草稿，经理角色批准后才能发送。Agent 不直接持有店铺或亚马逊原始登录。本站 2026-10-31 只核验公开页与 npm 元数据，未注册、未带 key 调用工具。"
summaryEn: "Per ReplenishRadar’s agent-integration page and MCP guide (updated 2026-10-30): local package @replenishradar/mcp-server (npm latest 1.1.1) connects Claude Desktop / OpenClaw / n8n to multi-channel inventory — Shopify on-hand, FBA available/inbound, stockout risk, forecasts, and draft POs. On the public path a PO stays draft until a manager approves send. Agents do not receive raw store or Amazon logins. Lab on 2026-10-31 verified public pages and npm metadata only — no account, no keyed tool calls."
category: logistics
agents: ["Claude Desktop", "OpenClaw", "Cursor", "Windsurf", "n8n", "Make", "custom Python agent"]
tools: ["@replenishradar/mcp-server", "rr_get_stockout_risk", "rr_get_inventory_position", "rr_create_purchase_order", "rr_request_approval", "rr_send_purchase_order", "POST /api/mcp/call"]
source: 官网
sourceUrl: https://replenishradar.com/features/agent-integration
sourceType: public
date: 2026-10-31
dateNote: "2026-10-31（Asia/Shanghai）采编 https://replenishradar.com/features/agent-integration 与 https://replenishradar.com/blog/connect-ai-agent-amazon-shopify-inventory （页内 Updated Oct 30, 2026）。同日 npm registry @replenishradar/mcp-server latest=1.1.1。未创建 API key、未执行 npx、未调用 rr_*、未登录 Shopify／Seller Central。"
featured: false
prompt: |
  You answer inventory questions using ReplenishRadar MCP tools only
  (@replenishradar/mcp-server). You do not change Amazon or Shopify listings.

  Question: {{question}}
  SKU or supplier filter if any: {{sku_or_supplier_or_empty}}

  Rules:
  1) Call only rr_* tools the connector exposes. If a tool is missing or
     errors, say so. Do not invent days-of-supply, FBA inbound ETAs, or PO
     quantities.
  2) Quote numbers only as returned. Label them ReplenishRadar records,
     not a Seller Central export you verified by hand.
  3) Purchase orders: create drafts only. Use rr_request_approval and wait
     for a human manager to approve in ReplenishRadar before any send.
     You have no approve action.
  4) Never ask for Shopify, Seller Central, or ReplenishRadar passwords
     in chat. API keys stay in the local MCP env.
  5) Do not change listing copy, prices, or ad bids. This MCP is inventory
     / replenishment, not Ads or listing ops.
  6) Tier limits (Standard $99 / Growth $199 / Scale $499 and hourly caps)
     are page prices at editorial time — confirm in the product before
     promising access.
---

## 解决什么问题

同时开 Shopify 与亚马逊 FBA 时，断货判断常要在两个后台和表格之间来回。ReplenishRadar 公开页的做法是：把**同一套补货数学**暴露成 MCP 工具——问「未来 14 天谁会断货」「某 SKU 各渠道库存」「按供应商起草 PO」时，Agent 调结构化工具，而不是猜。

公开审批流写明：Agent 可建**草稿 PO** 并请求批准；**经理及以上**在产品里批准后，才能发送。Agent **拿不到**店铺或亚马逊原始凭证，也不能经该 MCP 改 Listing／价格。

与站内相近篇错位：

- [n8n 多平台库存同步](/cases/n8n-shopify-amazon-flipkart-inventory-sync/)：工作流模板同步数量。本条是托管补货产品上的 MCP／REST 工具面。
- [亚马逊卖家插件](/cases/amazon-selling-partner-claude-plugin/)／[DataDoe](/cases/datadoe-amazon-seller-vendor-ads-mcp/)：Seller／Ads 数据面。本条强调跨渠道库存位置与 PO 草稿闸门。
- [OpenTabs](/cases/reddit-opentabs-amazon-seller-browser-mcp/)：浏览器会话。ReplenishRadar 是 API key + 本地 stdio MCP。

## 人审闸门（必须人工确认）

1. **发送采购单／向供应商下真实订单** — 须经理角色在 ReplenishRadar 批准；Agent 不能自批。
2. **开通付费档与提高 rate limit** — 页内 Standard **$99**／月、Growth **$199**、Scale **$499**（采编时标价）。须账号所有人批。
3. **API key 写入聊天、仓库或截图外传** — 禁止；只放本机 `claude_desktop_config.json`／自动化环境变量。
4. **把页内「约 80 小时／年」类时间节省写进对外承诺** — 须标注为营销估算；本站未测。
5. **让 Agent 改亚马逊／Shopify Listing 或广告** — 公开页写该 MCP **不能**改 listing／pricing。

## 可复现步骤

前置（据功能页与指南；本站未注册）：

1. ReplenishRadar 组织账号；Settings → API Keys 创建 key，勾选工具组
2. 已把 Shopify／Amazon 渠道接到该产品（按对方文档；**不要**把渠道密码发给模型）
3. Claude Desktop 或其他能跑本地 stdio MCP 的客户端

跟做（公开材料；本站未执行）：

1. 打开 [Agent Integration](https://replenishradar.com/features/agent-integration) 与 [MCP Guide](https://replenishradar.com/blog/connect-ai-agent-amazon-shopify-inventory)
2. 在 `~/.claude/claude_desktop_config.json` 写入指南示例：`npx -y @replenishradar/mcp-server`，环境变量 `REPLENISHRADAR_API_KEY`
3. 重启客户端后问只读问题，例如 stockout risk（对应页内工具名 `rr_get_stockout_risk`）
4. 草稿 PO：`rr_create_purchase_order` → `rr_request_approval` → **人在产品内批准** → 才可 `rr_send_purchase_order`
5. 无 MCP 客户端时，指南给出 REST：`POST https://api.replenishradar.com/api/mcp/call`（Bearer）
6. 无账号时，指南称可用公开 agent-intake schema／sandbox（本站未调用）

## 预期结果与失败限制

**预期（页面声称）：**

- 工具示例：`rr_get_stockout_risk`、`rr_get_inventory_position`、`rr_get_demand_forecast`、`rr_get_alerts`、`rr_get_suggested_purchase_orders`、`rr_create_purchase_order`、`rr_request_approval`、`rr_send_purchase_order`、`rr_trigger_sync`
- 功能页写 **49** 个 ReplenishRadar 工具外加 knowledge search
- 分档 rate limit：Standard **10**/小时、Growth **100**、Scale **1,000**（页内数字）
- npm 包名 `@replenishradar/mcp-server`，采编时 latest **1.1.1**

**失败／边界：**

- 本站未带 key 调用，不能复述任何真实 SKU 数字
- Standard 对部分读／写为 Limited；以当时控制台权限为准
- 渠道同步失败时，页内有 sync failure 类告警；Agent 看到的是产品内数据，不是直接 SP-API 原始响应
- 预测不能代替人对促销／爆款趋势的判断（页内亦如此写）

## 来源与核验状态

**公开可核验**

- 主链：[Agent Integration](https://replenishradar.com/features/agent-integration)
- 辅链：[Connect Your AI Agent to Inventory (MCP Guide)](https://replenishradar.com/blog/connect-ai-agent-amazon-shopify-inventory)（Updated Oct 30, 2026）
- npm：`@replenishradar/mcp-server@1.1.1`（2026-10-31 查 registry）
- 采编：2026-10-31（Asia/Shanghai）。**未**登录、**未** keyed 探活。

## English brief

ReplenishRadar documents a local MCP (`@replenishradar/mcp-server`) for Shopify + Amazon inventory: stockout risk, cross-channel positions, forecasts, and draft POs with a manager approval gate before send. Lab (2026-10-31 Asia/Shanghai) checked public docs and npm 1.1.1 only — no API key, no tool calls.
