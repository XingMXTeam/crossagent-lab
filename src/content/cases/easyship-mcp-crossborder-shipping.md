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
dateNote: "官方博客与 PRWeb 标注 Apr 30, 2026；2026-10-19 采编；同日按 CASE_TEMPLATE 重排正文；细节以 developers.easyship.com 为准"
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

## 解决什么问题

跨境小包／B2C 履约里，卖家常要在多个承运商后台来回比价、估关税、校验地址，再决定是否买面单。Easyship 把多承运商物流 API 接到 MCP 后，可在 Cursor／Claude／ChatGPT 等客户端里用自然语言做**比价、草稿货件、落地成本估算与轨迹查询**，减少在控制台与聊天之间来回切换。

它解决的是「在 Agent 会话里调用已有 Easyship 账户能力」，不是又一个独立物流商比价网站。与站内「n8n 聚合 FedEx／UPS／DHL 轨迹」不同：那边侧重多承运商**轨迹归一**；这边是**单一 Easyship 账户**上的比价／出单／landed-cost。与「Tariff Code Compliance」类税则研究插件也不同：Easyship 侧重履约与税费估算输出，不是版本化 HS／HTS 归类证据库。

## 人审闸门（必须人工确认）

以下动作**不得**由 Agent 自动执行，须运营人员明确确认后再花 credits 或对外生效：

1. **购买面单**（`create_label` 或等价买标）— 扣 credits
2. **预约承运商取件**（pickup）— 扣 credits／产生取件约定
3. **取消／变更已付款货件** — 可能产生费用或服务窗口限制
4. **把工具返回的运价、ETA、折扣宣传语（如来源「up to 91% off retail」）直接写入客户报价单** — 须人工核对实时返回后再报价
5. **把 API token 粘贴进可分享的 prompt／工单／截图** — 禁止；token 只放环境变量或客户端安全配置

查价、列货件、轨迹与分析按官方 FAQ 为免费能力，仍建议人工扫一眼返回表再决策。

## 可复现步骤

前置（公开文档要求）：

1. 有效的 **Easyship 账号**（已有或新注册；博客称 MCP **无额外 MCP 费用**）
2. 在 Easyship Dashboard 生成按 scope 裁剪的 **API token**（Bearer）
3. MCP 客户端（Cursor／Claude／ChatGPT 等）支持远程 MCP 或本地进程
4. 远程端点：`https://mcp.easyship.com/mcp`（Streamable HTTP）；亦可本地 `uvx easyship-mcp`
5. 将 token 写入客户端配置／环境变量 — **不要**写进对话或本页 Prompt 占位符

跟做路径（据[开发者文档](https://developers.easyship.com/docs/easyship-mcp-server)与博客示例，非本站实测）：

1. 在客户端添加远程 MCP → 确认已列出 rates／shipments／tracking 等相关工具
2. 用自然语言给出起讫地址、包裹尺寸重量、申报价值；目标设为「比价」或「落地成本估算」
3. 让 Agent 只调用 `get_rates`／`validate_address` 等只读或草稿类工具，输出承运商名、价格、时效**以工具返回为准**
4. 若需建单：先 `create_shipment` 且 **不买 label**（`buy_label` false），人工检查草稿
5. 确认后再买面单或预约 pickup；缺 scope 时文档称对应工具会 `403`，其余工具仍可用

本页文末 Prompt 盒可直接复制；先填 `{{…}}` 占位，再在已配置 MCP 的会话里使用。

## 预期结果与失败限制

**预期（公开材料描述）：**

- 比价表：多承运商价格与 delivery time（来自 `get_rates`）
- 地址校验结果；税费／duty 估算随 rates 等返回（工具输出，**非**报关裁定）
- 草稿货件 ID；轨迹事件（若已有单号且工具可用）
- 开发者文档写明 API version **2024-09**；公开规模为 **25** tools、**550+** courier services、**200+** countries and territories

**失败／边界：**

- 无账号或 token 无效 → 无法调用；缺 scope → 单工具 `403`
- 本站**未**跑过实单或比价；页面数字只复述官方博客／PRWeb／开发者文档
- 运价、ETA、折扣以上限营销语勿直接当成交价；以当次工具返回为准
- 来源未声称「已接 Amazon Seller」等渠道时，本页也不写该覆盖

## 来源与核验状态

**公开可核验**

- 主文：[Easyship 官方博客 — MCP Server](https://www.easyship.com/blog/easyship-mcp-server)（标注 Apr 30, 2026）
- 新闻稿：[PRWeb](https://www.prweb.com/releases/easyship-launches-global-shipping-mcp-server-as-commerce-goes-agentic-302759383.html)
- 文档：[developers.easyship.com/docs/easyship-mcp-server](https://developers.easyship.com/docs/easyship-mcp-server)
- 采编：2026-10-19（Asia/Shanghai）；同日按站内 `docs/CASE_TEMPLATE.md` 重排小节。本站仅采编公开材料，**未做 live 实测**。

## 据公开帖摘要

2026-04-30，Easyship 在[官方博客](https://www.easyship.com/blog/easyship-mcp-server)与 [PRWeb 新闻稿](https://www.prweb.com/releases/easyship-launches-global-shipping-mcp-server-as-commerce-goes-agentic-302759383.html)宣布推出 **Easyship MCP Server**：把既有多承运商物流 API 接到 Model Context Protocol，让 Claude、ChatGPT、Cursor、Gemini 等 MCP 客户端用自然语言做比价、出单、轨迹与分析。开发者文档见 [developers.easyship.com/docs/easyship-mcp-server](https://developers.easyship.com/docs/easyship-mcp-server)。

公开页写明的规模与能力（数字均来自上述来源）：

- **25** 个可调用物流／跨境工具（开发者文档写 API version 2024-09）
- **550+** courier services；**200+** countries and territories
- 远程端点：`https://mcp.easyship.com/mcp`（Streamable HTTP）；亦支持本地 `uvx easyship-mcp`
- 鉴权：Dashboard 生成的 API token，Bearer 写入客户端配置／环境变量
- 对已有／新注册账号 **无额外 MCP 费用**；博客 FAQ：抓取运价、列货件、轨迹与分析免费，**购买面单或预约承运商取件才消耗 credits**
- 已上架官方 MCP Registry；博客称亦可接 n8n／Make／Zapier 等 MCP Client

博客按八类概括工具面：Rates、Shipments、Labels、Address Validation、Tax And Duty、Pickups、Tracking、Billing And Analytics。开发者文档工具表列出 `get_rates`、`create_shipment`／`create_label`、`validate_address`、`track_shipment`、若干 `analytics_*` 等；税率／关税估算随 `get_rates` 等返回，按公开文案属于工具输出，不是报关裁定。

## English brief

Official Easyship MCP (`https://mcp.easyship.com/mcp`) exposes **25** shipping tools across **550+** couriers and **200+** countries for rates, draft shipments, labels, address validation, tax/duty (landed cost), pickups, and tracking in Claude／ChatGPT／Cursor. Rate fetches are free; buying labels or booking pickups consumes credits. This Lab page cites the public blog (2026-04-30), PRWeb, and developer docs only — **no live Lab test**. Always require human approval before spend.
