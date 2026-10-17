---
title: "亚马逊卖家 Agentic Toolkit：官方连接器管店，写操作必须人审"
titleEn: "Amazon Selling Partner Agentic Toolkit — seller skills with human approval"
summary: "据官方仓库：技能经 Selling Partner Connector MCP 读取卖家账号。授权走 Seller Central，可用工具受角色限制。改 Listing、改价、入库确认等写操作只出草稿，等人批准。"
summaryEn: "Official toolkit: seller skills call Amazon's hosted Selling Partner Connector. OAuth is Seller Central; every write is drafted for approval."
category: ops-finance
agents: ["Claude"]
tools: ["Amazon Selling Partner Connector MCP", "SP-API", "Seller Central OAuth"]
source: GitHub
sourceUrl: https://github.com/amzn/selling-partner-agentic-toolkit
sourceType: public
date: 2026-10-17
dateNote: "README 现文；仓库 pushed 2026-10-15；2026-10-17 采编"
featured: true
prompt: |
  You manage an Amazon seller account only through the Amazon Selling Partner Connector
  (MCP at https://sellingpartner-ai.amazon.com/mcp). Seller Central OAuth is already granted.
  Call only tools allowed by this seller's roles.

  Request: {{request}}
  Marketplace: {{marketplace}}
  SKU or ASIN: {{sku_or_asin}}

  Rules:
  - Reads (inventory, traffic, sales, listing status, settlements): explain only fields the connector returned. Do not invent metrics.
  - finance-month-end-closer is read-and-explain only. Never file, pay, or move money. Bank lines come from the seller, not from a bank feed.
  - listing-compliance is advisory and must not write.
  - Any write (price, listing content, FBA inbound confirmation, support-case submit) is a DRAFT. Stop and list ACTIONS REQUIRING HUMAN APPROVAL.
  - Redact PII from support-case summaries. Do not submit a case without an explicit yes.
  - Do not switch to the local SP-API developer MCP for these seller-account actions.
---

## 据公开帖摘要

`amzn/selling-partner-agentic-toolkit` 是亚马逊官方技能包，用来经 Amazon Selling Partner Connector（MCP）管理卖家账号。仓库中的 `.mcp.json` 注册的地址是 `https://sellingpartner-ai.amazon.com/mcp`。授权使用 Seller Central 的 OAuth。助手只能调用该卖家角色允许的工具。README 写明：写操作始终由人把关，先起草，再等人批准。

技能包括：`seller-analytics`（库存、流量、销售等指标，先找到指标 ID 再查询）；`finance-month-end-closer`（核对已结束月份的净收入与结算、确认回款状态、对照卖家提供的银行入账并写出给会计的摘要；只读解释，不申报、不付款、不划转资金，且没有银行集成）；`stockout-prevention`（用可售天数与动销估计断货风险，建议补多少、何时补，并查看在途入库缺口；不主动给定价建议，若卖家指定价格则按该价格起草待批变更）；`fba-inbound-management`（入库计划从创建、装箱、分仓、运输到确认，每步有审批闸门）。Listing 侧：`listing-troubleshooter` 负责分流；`listing-issues`、`listing-buyability`、`listing-searchability` 先预览再等人批准；`listing-compliance` 在敏感写入前做合规预检，只建议、不写入。`support-case-helper` 整理不含个人数据的支持案例摘要，没有明确确认就不提交。`sp-api-knowledge` 按 SP-API 文档回答集成问题。另有 `invite-secondary-users`：引导管理员在 Seller Central 的 Manage Agents 里给次级用户授权，本身不代替界面操作。

斜杠命令：`/sp-stockout-check`、`/sp-fix-listing`、`/sp-sales-drop`。

Claude 应用市场另有连接器说明：<https://claude.com/marketplace/connectors/amazon-selling-partner>。该页现标 beta，用途是连上 Seller Central 后询问销售、库存与 Listing，并在每个动作前征得批准。本条的主来源仍是上面的 GitHub 仓库。

这套技能跑在亚马逊托管连接器上，服务的是卖家运营。它不同于 Discussion #382 的本地 SP-API 开发 MCP：那边帮开发者查文档和写示例，这边在已授权账号里读经营数据并起草变更。

## 要点

- 改 Listing、改报价、确认入库、提交支持案例都停在草稿，等人点头。
- 月结技能只做核对与说明，不支付、不移动资金。
- 能调用的工具范围等于 Seller Central 角色。换账号或增加次级用户要重新授权。

## 注意

市场连接器处于 beta，可用工具可能变化。不要把刷新令牌交给模型。支持案例摘要应去掉个人数据。不要把它和本地开发 MCP 当成同一种「能否直接改后台」的能力。
