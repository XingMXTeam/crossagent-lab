---
title: "Easyship MCP：在 Cursor／Claude 里比价、出单与落地成本"
titleEn: "Easyship MCP for rates, labels, and landed cost in Cursor/Claude"
summary: "据 Easyship 官方博客与开发者文档：远程 MCP（mcp.easyship.com）向 Claude／ChatGPT／Cursor 等暴露 25 个物流工具，覆盖 550+ 承运商与 200+ 国家／地区的比价、面单、地址校验、税费／落地成本与轨迹；需账号与 API token，查价免费、出单／预约取件才扣额度。"
summaryEn: "Official blog + docs: remote MCP exposes 25 shipping tools (550+ couriers, 200+ countries) for rates, labels, address validation, tax/duty (landed cost), and tracking in Claude/ChatGPT/Cursor. Needs an Easyship account and API token; rate fetches are free; labels/pickups consume credits."
category: logistics
agents: ["Cursor", "Claude", "ChatGPT"]
tools: ["Easyship MCP", "mcp.easyship.com", "Easyship API token"]
source: 博客
sourceUrl: https://www.easyship.com/blog/easyship-mcp-server
sourceType: public
date: 2026-04-30
dateNote: "官方博客与 PRWeb 标注 Apr 30, 2026；2026-10-19 采编；细节以 developers.easyship.com 为准"
featured: true
prompt: |
  You are a cross-border ops assistant connected to the Easyship MCP server
  (https://mcp.easyship.com/mcp) with a scoped Bearer token already configured
  outside the chat. Do not ask the user to paste API tokens into the prompt.

  Shipment request (fill only known fields; leave unknowns blank):
  - From: {{origin_name_address_zip_country}}
  - To: {{dest_name_address_zip_country}}
  - Parcel: {{weight_kg}}, {{L×W×H_cm}}, category/HS if known
  - Declared value + currency: {{value}}
  - Incoterm preference: {{DDU|DDP|unknown}}
  - Goal: {{compare_rates | draft_shipment_no_label | track | landed_cost_estimate}}

  Rules:
  1) Use only tools the connected Easyship MCP actually exposes (e.g. get_rates,
     validate_address, create_shipment with buy_label false, track_shipment).
     If a tool or scope is missing, say so — do not invent rates, ETAs, or duties.
  2) For rate comparison: call get_rates and report courier name, price, and
     delivery time exactly as returned. Flag duty/tax estimates as tool output,
     not legal advice.
  3) Do not buy a label or book a pickup unless the user explicitly confirms.
     Prefer draft shipment (buy_label false) first.
  4) Never fabricate tracking events, document URLs, or discount percentages.
  Output: (a) tool calls used, (b) options table from live response, (c) open
  questions, (d) ACTIONS REQUIRING HUMAN APPROVAL before spend.
---

## 据公开帖摘要

2026-04-30，Easyship 在[官方博客](https://www.easyship.com/blog/easyship-mcp-server)与 [PRWeb 新闻稿](https://www.prweb.com/releases/easyship-launches-global-shipping-mcp-server-as-commerce-goes-agentic-302759383.html)宣布推出 **Easyship MCP Server**：把既有多承运商物流 API 接到 Model Context Protocol，让 Claude、ChatGPT、Cursor、Gemini 等 MCP 客户端用自然语言做比价、出单、轨迹与分析。开发者文档见 [developers.easyship.com/docs/easyship-mcp-server](https://developers.easyship.com/docs/easyship-mcp-server)。

公开页写明的规模与能力（以下数字均来自上述来源，本站未实测）：

- **25** 个可调用物流／跨境工具（开发者文档写 API version 2024-09）
- **550+** courier services；**200+** countries and territories
- 远程端点：`https://mcp.easyship.com/mcp`（Streamable HTTP）；亦支持本地 `uvx easyship-mcp`
- 鉴权：Easyship Dashboard 生成的 **API token**，以 Bearer 写入客户端配置／环境变量（勿贴进对话）
- 对已有／新注册 Easyship 账号 **无额外 MCP 费用**；博客 FAQ 写明：抓取运价、列货件、轨迹与分析免费，**购买面单或预约承运商取件才消耗 credits**
- 已上架官方 MCP Registry；博客称亦可接 n8n／Make／Zapier 等 MCP Client

博客按八类概括工具面：Rates（多承运商比价）、Shipments（创建／更新／取消／查询）、Labels（国内／国际面单与报关文件）、Address Validation、Tax And Duty（实时落地成本）、Pickups、Tracking、Billing And Analytics。开发者文档工具表进一步列出 `get_rates`、`create_shipment`／`create_label`、`validate_address`、`track_shipment`、若干 `analytics_*` 等；税率／关税估算随 `get_rates` 等返回，按公开文案属于工具输出，不是报关裁定。

典型跨境卖家路径（据文档示例，非本站实测）：在 Cursor／Claude 配置远程 MCP → 用自然语言要求「纽约→多伦多比价／最便宜与最快」→ 必要时先 `create_shipment` 且不买 label → 人工确认后再 `create_label` 或预约 pickup。

## 要点

- 与站内「n8n 聚合 FedEx／UPS／DHL 轨迹」不同：那边是多承运商轨迹归一；这边是 **单一 Easyship 账户** 上的 MCP 比价／出单／落地成本。
- 与「Tariff Code Compliance」税则研究插件不同：Easyship 侧重履约与 landed-cost 估算，不是版本化 HS／HTS 归类证据库。
- 适合在 Cursor／Claude 里做跨境报价对照、草稿货件、轨迹查询；出单与取件必须人工确认后再花 credits。

## 注意

需要有效的 Easyship 账号与按 scope 裁剪的 API token；缺 scope 时文档称对应工具会 `403`，其余仍可用。本页只复述公开博客／新闻稿／开发者文档，**未在本站跑过实单或比价**。运价、折扣（来源宣传「up to 91% off retail」）、ETA 与税费以工具实时返回为准，勿把营销上限抄进客户报价。凭证只放环境变量／客户端安全配置，不要写进可分享的 prompt。
