---
title: "Avalara Cross-Border MCP：在 Cursor／Claude 里按 HS 编码查关税与合规要求"
titleEn: "Avalara Cross-Border MCP: look up HS-code tariffs and import compliance in Cursor/Claude"
summary: "据 Avalara 开发者文档：Cross-Border Trade Services MCP（mcp.avalara.com/cross-border）提供两个工具，按日期区间或当天查询 HS 编码的关税、惩罚性关税、PGA 代码与进口限制；需 Avalara 账号并走 OAuth 授权。可与 Easyship MCP 搭配：Easyship 管运费与面单，Avalara 管税则与合规。"
summaryEn: "Per Avalara's developer docs, the Cross-Border Trade Services MCP (mcp.avalara.com/cross-border) exposes two tools that return duty rates, punitive duties, PGA codes, and import restrictions for an HS code by date range or for today. It needs an Avalara account and OAuth sign-in. Pair it with Easyship MCP: Easyship for rates and labels, Avalara for tariffs and compliance."
category: logistics
agents: ["Cursor", "Claude"]
tools: ["Avalara Cross-Border MCP", "mcp.avalara.com/cross-border", "get_trade_tariff_content_library_by_date", "get_trade_tariff_content_library_for_current_date", "Easyship MCP"]
source: 官网
sourceUrl: https://developer.avalara.com/mcp-servers/cross-border/
sourceType: public
date: 2025-10-06
dateNote: "Avalara 于 2025-10-06 新闻稿宣布 MCP servers；开发者文档页未标日期，2026-10-20（Asia/Shanghai）采编并核对；本站未用 Avalara 账号调用工具"
featured: false
prompt: |
  You are a cross-border compliance assistant connected to the Avalara
  Cross-Border Trade Services MCP (https://mcp.avalara.com/cross-border).
  OAuth sign-in is handled by the MCP client. Never ask for passwords or
  tokens in chat.

  Product (fill only known fields):
  - Product description: {{description}}
  - HS code (10-digit if known): {{hs_code}}
  - Origin country: {{e.g. CN}}  Destination: {{e.g. US}}
  - Date or date range: {{today | MM/DD/YYYY–MM/DD/YYYY}}

  Rules:
  1) Use only get_trade_tariff_content_library_for_current_date (for today)
     or get_trade_tariff_content_library_by_date (for a date range). If a
     tool is missing or returns an error, say so. Do not guess rates.
  2) Report duty rates, punitive/additional duties, PGA codes, restrictions,
     and document requirements exactly as returned, with the date they apply.
  3) If the HS code is unknown or uncertain, list it as an open question.
     Do not pick a code yourself and present it as final classification.
  4) Mark all output as tool data for review, not legal or customs advice.
  5) If I also have Easyship MCP connected, you may compare its landed-cost
     estimate with the Avalara duty line, but do not buy labels.
  Output: (a) tool calls used, (b) duty/compliance table from the live
  response, (c) differences vs. any Easyship estimate, (d) open questions,
  (e) ACTIONS REQUIRING HUMAN APPROVAL (filing, pricing, customer quotes).
---

## Lab 探针成品（先看结果）

**方法：** 匿名 · 无 Avalara 账号 · 无 OAuth · 2026-10-20（Asia/Shanghai）  
**端点：** `https://mcp.avalara.com/cross-border`

| 探针 | 结果 |
|------|------|
| 匿名请求端点 | HTTP **401**；响应头指向 OAuth 元数据（授权服务器 `identity.avalara.com`） |

**本站未跑：** 账号登录后的 `get_trade_tariff_content_library_by_date`／`get_trade_tariff_content_library_for_current_date`。401 **不是**工具调用测试。本页不写任何具体税率。

> 人审提醒：最终 HS 与客户报价须人工确认。闸门见「人审闸门」。

## 解决什么问题

跨境卖家发货前要回答两个问题：这个 HS 编码进目的国要交多少关税？有没有额外的惩罚性关税、PGA（美国政府部门监管）要求或进口限制？

通常要翻税则网站或问报关行。Avalara Cross-Border MCP 让 Agent 在 Cursor／Claude 会话里直接按 HS 编码、起运国、目的国和日期查 Avalara Trade and Tariff Library。

搭配站内 [Easyship MCP 用例](/cases/easyship-mcp-crossborder-shipping/)：Easyship 负责比价、面单和落地成本估算；Avalara 负责税则、惩罚性关税和合规要求。与站内「Tariff Code Compliance」插件用例不同：那篇做版本化 HS／HTS 归类研究证据；本篇是调用 Avalara 官方 MCP 查关税库内容。

## 人审闸门（必须人工确认）

以下动作不得由 Agent 自动执行：

1. **确定最终 HS 编码** — 归类由报关行或合规负责人确认；Agent 只列候选与疑问
2. **把关税数字写进客户报价、商品定价或 DDP 承诺** — 先人工核对工具返回和适用日期
3. **据工具结果提交报关、申报或改变发货决定** — 工具输出不是海关裁定
4. **在 OAuth 授权页给 MCP 客户端授权** — 由账号所有人本人审阅权限后同意
5. **Easyship 侧买面单或约取件** — 沿用 Easyship 用例的闸门

## 可复现步骤

前置（据 Avalara 公开文档）：

1. 有 **Avalara 账号**，且账号有 Cross-Border 服务权限（文档排错项写明：无权限会 permission denied）
2. 支持远程 HTTP MCP 的客户端，如 Cursor
3. 文档写明每个 MCP server 有 production 和 sandbox 两个环境；先在 sandbox 测试

步骤：

1. 在 MCP 配置里加入：

   ```json
   {
     "mcpServers": {
       "avalara-cross-border": {
         "type": "http",
         "url": "https://mcp.avalara.com/cross-border"
       }
     }
   }
   ```

2. 首次连接时，客户端跳到 Avalara 登录页；登录、审阅权限、同意，完成 OAuth
3. 确认客户端列出两个工具：`get_trade_tariff_content_library_by_date`、`get_trade_tariff_content_library_for_current_date`
4. 用文档 sample prompt 试查：`Get tariff information for HS code 6211430591 from CN to the US between 08/01/2025 and 08/01/2025`
5. 查当天合规：`Get current compliance information for HS code 6211430591 from CN to the US`
6. 查 PGA：`Show the PGA code for textile products from China to the US between 08/01/2025 and 08/01/2025 - HS code 6211430591`
7. 如同时接了 Easyship MCP：让 Agent 把 Easyship `get_rates` 的税费估算与 Avalara 关税行并排列出，人工判断差异

## 预期结果与失败限制

**预期（据公开文档描述）：**

- 按日期区间：指定 HS 编码的关税与合规信息（by_date 工具）
- 按当天：当前关税、限制、监管要求和文件要求（current_date 工具）
- 文档 sample 覆盖惩罚性关税（punitive duty）和 PGA 代码查询

**失败与边界：**

- 无 Avalara 账号或无权限 → 无法调用。2026-10-20 本站匿名请求端点得到 HTTP 401，响应头指向 OAuth 元数据（授权服务器 `identity.avalara.com`）；这只说明需登录，**不是**工具调用测试
- 请求过多 → HTTP 429；文档建议等几分钟再试
- 本站**未**用账号调用工具，没有真实返回结果；本页不写任何具体税率
- 公开文档未写明费用与计费方式：来源未写明，开通前向 Avalara 确认
- HS 编码错 → 结果全错；Agent 不替你做最终归类
- 关税政策会变；报价前按发货日期重新查询

## 来源与核验状态

**公开可核验**

探针表见文首「Lab 探针成品」；此处保留主链接与采编说明。

- 主链接：[Avalara Developer — Cross-Border Trade Services MCP server](https://developer.avalara.com/mcp-servers/cross-border/)（含配置 JSON、工具表与 sample prompt）
- 总览与授权步骤：[Avalara Developer — MCP servers](https://developer.avalara.com/mcp-servers/)
- 新闻稿：[Avalara Extends AI Leadership with Avi Everywhere, MCP Servers…](https://newsroom.avalara.com/2025-10-06-Avalara-Extends-AI-Leadership-with-Avi-Everywhere,-MCP-Servers,-and-Global-Compliance-Innovations)（Oct 6, 2025）
- 采编：2026-10-20（Asia/Shanghai）。本站仅采编公开材料，**未用账号实测**。与 Easyship MCP、Tariff Code Compliance 用例的区别见「解决什么问题」。

## 据公开帖摘要

**开发者文档（Cross-Border 页）：**

- 概述：Cross-Border Trade Services MCP 为 AI Agent 提供跨境交易工具，含关税计算，以及 Trade and Tariff 内容库（含进口贸易限制）
- 端点：`https://mcp.avalara.com/cross-border`，类型 `http`；页面提供 Cursor 一键安装，Sandbox／Production 两个环境切换
- 工具 1 `get_trade_tariff_content_library_by_date`：从 Avalara Trade and Tariff Library 返回关税和合规信息，支持指定 HS 编码与日期区间
- 工具 2 `get_trade_tariff_content_library_for_current_date`：返回当前关税、限制、监管要求、合规状态与文件要求
- Sample prompt 含：HS 6211430591 CN→US 关税；HS 8517120000 US→CA 惩罚性关税（Aug 01–Sep 01, 2025）；HS 6211430591 CN→US 的 PGA 代码与当天监管要求

**开发者文档（MCP 总览页）：**

- Avalara MCP servers 还包括 AvaTax、Returns、E-Invoicing and Live Reporting、Tax Registrations and Business Licenses、Exemption Certificate Management
- 授权：客户端跳转到 Avalara 登录页 → 用 Avalara 凭证登录 → 审阅权限 → 同意完成 OAuth
- 排错：Connection failed、Permission denied、HTTP 429

**新闻稿（2025-10-06）：** Avalara 宣布 MCP servers，让第三方 Agent 和系统发现并调用 Avalara 平台 API；同稿提到 Cross-Border Classification 能力，用于确定 HS 编码并标记贸易限制。

## English brief

Avalara's official Cross-Border Trade Services MCP (`https://mcp.avalara.com/cross-border`) exposes two tools — `get_trade_tariff_content_library_by_date` and `get_trade_tariff_content_library_for_current_date` — for duty rates, punitive duties, PGA codes, restrictions, and document requirements by HS code, origin, destination, and date. It needs an Avalara account and OAuth sign-in; production and sandbox environments exist. Pair it with Easyship MCP (rates, labels, landed cost). This Lab page cites the public docs and 2025-10-06 press release only — **no tool calls made with an account**. A human confirms HS classification and any customer-facing duty figure.
