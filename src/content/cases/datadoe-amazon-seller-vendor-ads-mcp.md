---
title: "DataDoe：Seller、Vendor、Ads 共用一个 Amazon MCP"
titleEn: "DataDoe: one Amazon MCP for Seller, Vendor, and Ads"
summary: "据 DataDoe 页面 https://www.datadoe.com/connect/amazon/mcp ：一个远程 MCP https://mcp.datadoe.com/mcp/v1 经 Amazon OAuth 2.0 连接 Seller Central、Vendor Central 与 Amazon Ads，页面称无需自建 SP-API 应用，写操作默认关闭，通过 Amazon PII 审核。试用 14 天后 $97／月（页面标价，含其所述的全部亚马逊账号与 MCP 客户端）。页面把这和亚马逊一方、2026-09-23 上线、面向美国站 Seller Central、用在 Claude 与 Amazon Quick 的连接器区分开。本站 2026-10-27（Asia/Shanghai）匿名 POST initialize → HTTP 401，www-authenticate 为 Bearer，resource_metadata 指向 https://mcp.datadoe.com/.well-known/oauth-protected-resource 。未完成 OAuth，未读到任何表。"
summaryEn: "DataDoe’s page at https://www.datadoe.com/connect/amazon/mcp describes one remote MCP, https://mcp.datadoe.com/mcp/v1, that connects Seller Central, Vendor Central, and Amazon Ads with Amazon OAuth 2.0. The page says you do not register your own SP-API app, write actions stay off by default, and the service has passed Amazon’s PII review. Price on the page: 14-day trial, then $97/month, including every Amazon account and MCP client they describe. They distinguish this from Amazon’s first-party connector launched 2026-09-23 for US Seller Central in Claude and Amazon Quick. Lab anonymous initialize on 2026-10-27 (Asia/Shanghai) returned HTTP 401 with a Bearer challenge and resource_metadata https://mcp.datadoe.com/.well-known/oauth-protected-resource. No OAuth and no tables."
category: ops-finance
agents: ["Claude", "Claude Code", "ChatGPT", "Cursor", "Gemini", "Codex", "n8n"]
tools: ["DataDoe Amazon MCP", "https://mcp.datadoe.com/mcp/v1"]
source: 官网
sourceUrl: https://www.datadoe.com/connect/amazon/mcp
sourceType: public
date: 2026-10-27
dateNote: "2026-10-27（Asia/Shanghai）采编 https://www.datadoe.com/connect/amazon/mcp 。同日匿名 POST https://mcp.datadoe.com/mcp/v1 initialize（无 Authorization）→ HTTP 401，JSON-RPC error.code=-32001，message=Authentication required；响应头 www-authenticate 含 Bearer realm=DataDoe MCP、error=invalid_token、resource_metadata=https://mcp.datadoe.com/.well-known/oauth-protected-resource 。GET 该 resource metadata → HTTP 200，authorization_servers 为 https://auth.api.datadoe.com ，scopes_supported 为 mcp:read、mcp:write、offline_access 。未做 OAuth，未调用 tools/list，未登录 Seller Central。"
featured: false
prompt: |
  You answer questions about one Amazon organization using the DataDoe MCP
  only (https://mcp.datadoe.com/mcp/v1) when the operator has already
  completed Amazon OAuth in their own client. You do not change prices,
  listings, shipments, or ads.

  Account label the operator already uses: {{account_label}}
  Question: {{question}}

  Rules:
  1) If initialize returns HTTP 401 or the client has no Bearer token, stop.
     Say authentication is required. Do not invent orders, inventory, fees,
     Buy Box, margins, or ad spend.
  2) Quote figures only as a connected tool returned them. Label them
     DataDoe’s copy of Amazon data. They are not a settlement file you
     reconciled and not a Seller Central export.
  3) Chat mockups on the public marketing page (repricing counts, revenue,
     margins, emails sent) are illustrations. Never repeat them as this
     account’s result.
  4) Writes are off by default on the 2026-10-27 page: listings, prices,
     A+ Content, FBM shipment confirmations, and Sponsored Products, Brands,
     and Display. Leave them off. A dry run still needs a person before
     anything is applied. Do not send email or schedule a report.
  5) Do not request buyer PII into this chat. Do not paste Amazon passwords,
     refresh tokens, or the MCP bearer token.
  6) This is not Amazon’s first-party Selling Partner plugin. Do not claim
     US-only Claude/Amazon Quick availability, or the lack of it, as a
     property of this account’s DataDoe connection.
  Output: (a) tools actually called and status, (b) fields returned,
  (c) unknowns, (d) ACTIONS REQUIRING HUMAN APPROVAL.
---

## 解决什么问题

卖家或代理要在 Claude、ChatGPT 或其他 MCP 客户端里问自己的亚马逊经营数据：订单、库存、费用、广告，有时还有 Vendor Central。DataDoe 这一页的做法是一个 URL：`https://mcp.datadoe.com/mcp/v1`。页面写 Seller Central、Vendor Central、Amazon Ads 走同一端点，授权用 Amazon 的 OAuth 2.0，不让你自己去注册 SP-API 应用，也不把密码交给模型。

写回亚马逊的动作页面称**默认关闭**。打开之后才能改 Listing、价格、A+、FBM 发货确认，以及 Sponsored Products／Brands／Display。每一种 Action 都能先 dry run，调用写入审计。

页面自己和亚马逊一方的连接器对比：一方连接器于 2026-09-23 上线，覆盖美国站 Seller Central，用在 Claude 和 Amazon Quick。DataDoe 在该段声称额外覆盖 Vendor Central、Amazon Ads、可查询的结算级财务、BigQuery 里的历史、各个亚马逊 marketplace，以及任意 MCP 客户端，并写两者可以同时用。站点上的日期写法是 23 September 2026。站内 [卖家插件采编](/cases/amazon-selling-partner-claude-plugin/) 用的是 About Amazon 的 datePublished 2026-09-23，范围也是美国站插件公测。本页不把 DataDoe 的对比段改写成亚马逊公告。

与站内相近篇错位：

- [OpenTabs](/cases/reddit-opentabs-amazon-seller-browser-mcp/)：本机 Chrome 会话，评论里的卖家后台用法不办 LWA。DataDoe 是对方托管的 OAuth MCP，匿名探活要求 Bearer。
- [亚马逊卖家插件](/cases/amazon-selling-partner-claude-plugin/) 与 [Agentic Toolkit](/cases/amzn-selling-partner-agentic-toolkit/)：亚马逊基础设施上的一方工具。DataDoe 不是那条 `sellingpartner-ai.amazon.com` 连接。
- [亚马逊广告官方 MCP](/cases/amazon-ads-mcp-server-open-beta/)：只面向 Ads API。DataDoe 页面把 Ads 和 Seller／Vendor 放在同一个端点后面。
- [SellerForge MCP](/cases/reddit-sellerforge-amazon-mcp/)：读 SellerForge 里保存的账号记录，产品页称不能改 Seller Central 或 Ads。DataDoe 页面写可以在你打开 Action 之后写回亚马逊。
- [Tirnav：SP-API + Ads 经 MCP](/cases/tirnav-amazon-spapi-ads-mcp/)：一篇自己接官方 API 的架构说明。DataDoe 是已经托管的端点，页面称 token、限流和报表调度由他们处理。

## 人审闸门（必须人工确认）

1. **保持写操作关闭** — 页面：每种 Action 初始为关。Listing、价格、A+ Content、FBM shipment confirmation、Sponsored Products／Brands／Display 都要账号所有人单独打开。dry run 的预览不等于已经改站。
2. **不在聊天里发信或建日程** — 页内有「把利润报告电邮给团队」「每周一 8:00 发送」的界面插图。那是营销稿。不要据此发信、加人、或创建定时任务。
3. **插图上的数字不是这个账号** — 同一块插图里的改价件数、利润、Buy Box 和亏损 SKU 是页面示例。工具没返回的字段回答不知道。
4. **买家 PII 默认不要进对话** — 页面写 restricted buyer PII 需另行开通，并称凭证不会交给 AI 客户端。即使账号开了 PII 表，也不要把买家姓名、地址或邮箱贴进共享聊天。
5. **OAuth 只在亚马逊同意页完成** — 不索要 Seller Central 密码、刷新令牌或 MCP Bearer。撤销方式以页面为准：在 DataDoe 里断开账号即切断访问。
6. **$97／月是页面标价，不是本站账单** — 14 天试用结束后的价格由账号所有人在对方流程里接受。本站未注册。
7. **对账回到亚马逊原文** — 页面称 130+ 张规范化表、每日刷新、关键表日内更新。这些句子是厂商声称。拿去改价、索赔或报税前，回到 Seller Central／Vendor Central／Ads 的导出。

## 可复现步骤

前置（据 [该页](https://www.datadoe.com/connect/amazon/mcp) 与本站匿名探活）：

1. 支持远程 Streamable HTTP 的 MCP 客户端。页面目录点名 Claude、Claude Code、Claude Cowork、ChatGPT、Codex、Gemini、Gemini CLI、Cursor、GitHub Copilot、Microsoft Copilot、Grok、Perplexity、Hermes、n8n、Zapier 等，并写端点不变、各客户端有单独安装页。本站只核了这一张总页，没有逐一点开那些安装页
2. DataDoe 账号。页面步骤 1 是注册并开始 14 天试用
3. 你有权在亚马逊同意页上授权的 Seller、Vendor 或 Ads 账号

跟做（页面上的四步；本站未注册、未授权）：

1. 注册 DataDoe，开始试用
2. 用亚马逊官方 OAuth 授权账号。页面写：没有开发者资料要注册，没有代码
3. 在 Integrations 复制 MCP URL。页面给出的端点是 `https://mcp.datadoe.com/mcp/v1`，并称同一 URL 服务该组织里的每个 Seller、Vendor 和 Ads 账号
4. 贴进客户端并批准访问。Claude 另有页面上的分步入口；本站未打开该分步页
5. 先问只读问题（费用、库存、报表）。确认客户端里 Action 类型仍是关闭。任何 dry run 的结果交给人，不自动应用
6. 本站匿名路径只做到 initialize 和读取 OAuth protected-resource 元数据。不要把 401 当成已经连上卖家账号

## 预期结果与失败限制

**预期（页面声称）：**

- 端点 `https://mcp.datadoe.com/mcp/v1`，OAuth 2.0，不抓页面
- Seller、Vendor、Ads 一个 URL；代理可按账号设只读或读写
- 写操作默认关；审计日志记录每次 MCP 调用
- 页面安全块还写：按组织隔离、静态 AES-256、传输 TLS 1.3、OAuth 令牌可撤销、第三方渗透测试、Amazon PII 审核每年续期。这些是页面声明，本站未做安全审计
- 数据层声称 130+ 张表，含订单、结算、库存、Listing、Retail Analytics、采购单、搜索词、广告活动，以及 Amazon Marketing Stream；买家 PII 另开

**失败与边界：**

- 无 Bearer 的 initialize 在本站为 **HTTP 401**。JSON-RPC `message` 为 `Authentication required`，`id` 为 `null`（请求里带了 id）。响应头 `www-authenticate` 要求 Bearer，并给出 resource metadata URL。没有表、没有订单
- protected-resource 文档（HTTP 200）写：`resource` 即上述 MCP URL，`authorization_servers` 为 `https://auth.api.datadoe.com`，scope 为 `mcp:read`、`mcp:write`、`offline_access`，Bearer 放在 header。本站**没有**走授权码，也没有 `tools/list`
- 一方 Selling Partner 插件的美国站范围是 DataDoe FAQ 的对比句，也和 About Amazon 的公测范围同向；它不证明你的 DataDoe 组织已授权了哪些站点
- 页内客户引言和六段示例视频（补货、Vendor 利润、Slack 健康检查、Vendor 看板、FBA 台账、Vendor 库存）本站未核、未播放
- 本站未登录 DataDoe，未连接任何亚马逊账号，未打开试用或付款

## 来源与核验状态

**公开可核验**

- 主页面：[DataDoe — Amazon Seller Central MCP](https://www.datadoe.com/connect/amazon/mcp)
- 端点探活（本站，2026-10-27 Asia/Shanghai，**无 Bearer**）：

```
POST https://mcp.datadoe.com/mcp/v1  method=initialize
→ HTTP 401
  jsonrpc error.code=-32001
  message=Authentication required
  www-authenticate: Bearer realm="DataDoe MCP",
    error="invalid_token",
    error_description="Bearer token required",
    resource_metadata="https://mcp.datadoe.com/.well-known/oauth-protected-resource"
  无业务载荷

GET https://mcp.datadoe.com/.well-known/oauth-protected-resource
→ HTTP 200
  resource=https://mcp.datadoe.com/mcp/v1
  resource_name=DataDoe MCP
  authorization_servers=["https://auth.api.datadoe.com"]
  scopes_supported=["mcp:read","mcp:write","offline_access"]
  bearer_methods_supported=["header"]
```

- 采编：2026-10-27（Asia/Shanghai）。与 OpenTabs、一方卖家插件、Ads 官方 MCP、SellerForge、Tirnav 架构文的差别见首节。Lab 未调用业务工具。

## 据公开材料摘要

**产品页（2026-10-27）：** 标题把该服务称为给任意 AI 客户端用的 Amazon Seller Central MCP。正文写一个端点同时连接 Seller、Vendor 和 Ads，可读数据，并在你允许时行动。端点全文为 `https://mcp.datadoe.com/mcp/v1`。四步是注册、OAuth 授权、从 Integrations 复制 URL、贴进客户端。FAQ 写：不需要自己的 SP-API 应用；写操作包括 Listing、价格、A+、FBM 发货确认和三类 Sponsored 广告，且每类默认关闭、可先 dry run、调用留日志；一个组织的多个账号共用一个 URL；在 DataDoe 断开账号即停访问。与亚马逊一方 MCP 的差别、14 天试用和之后 $97／月，都写在同一 FAQ。页面另有聊天插图和六段构建视频，本站把它们标为页面材料，不标为探活结果。

## English brief

DataDoe publishes one Streamable HTTP MCP at `https://mcp.datadoe.com/mcp/v1` for Amazon Seller Central, Vendor Central, and Amazon Ads. The public page says authorization is Amazon OAuth 2.0, that you do not register your own SP-API app, that write actions (listings, prices, A+ Content, FBM shipment confirmations, and Sponsored Products, Brands, and Display) stay off until enabled, and that dry runs and an audit log are available. It prices the service at $97 per month after a 14-day trial. Its FAQ contrasts this with Amazon’s first-party Selling Partner connector launched on 23 September 2026 for US Seller Central in Claude and Amazon Quick. Marketing chat panels and six demo videos on the page are illustrations. Lab on 2026-10-27 (Asia/Shanghai) sent initialize with no Authorization and received HTTP 401, JSON-RPC -32001, “Authentication required,” and a Bearer `www-authenticate` challenge whose `resource_metadata` is `https://mcp.datadoe.com/.well-known/oauth-protected-resource`. That document names authorization server `https://auth.api.datadoe.com` and scopes `mcp:read`, `mcp:write`, and `offline_access`. No OAuth flow was completed and no table was read. A human turns on any Action, accepts the paid plan, and keeps buyer PII out of chat.
