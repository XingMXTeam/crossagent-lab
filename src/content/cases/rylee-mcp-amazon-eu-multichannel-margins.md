---
title: "Rylee MCP：把 Amazon 欧洲站＋bol／Kaufland／Shopify 店铺数据接到 ChatGPT／Claude／n8n"
titleEn: "Rylee MCP — Amazon EU plus bol, Kaufland, Shopify shop data into ChatGPT, Claude, and n8n"
summary: "据 Rylee 博客（Noud van Workum，2026-08-18 发布，2026-10-10 更新）：托管 MCP https://rylee.nl/mcp 把 Rylee 环境里的订单、销量和库存（Amazon 欧洲各站、bol、Kaufland、Shopify、WooCommerce）以及成本、单品贡献毛利与合并 P&L 接到 ChatGPT、Claude 或 n8n；连接从 AI 客户端发起；文称偏只读、不改卖家后台。本站 2026-11-03（Asia/Shanghai）匿名 initialize → HTTP 401 Unauthenticated；GET /.well-known/oauth-protected-resource/mcp → 200，scopes_supported 含 mcp:read 与 mcp:propose。未 OAuth、未 tools/list、未调用工具。"
summaryEn: "Rylee blog (Noud van Workum, published 2026-08-18, updated 2026-10-10): hosted MCP https://rylee.nl/mcp exposes Rylee’s orders, sales, and stock (Amazon European marketplaces, bol, Kaufland, Shopify, WooCommerce) plus costs, per-product contribution margin, and consolidated P&L to ChatGPT, Claude, or n8n. Connection starts in the AI client. The post describes a read-oriented link that does not change the selling account. Lab anonymous initialize on 2026-11-03 (Asia/Shanghai) returned HTTP 401 Unauthenticated; GET /.well-known/oauth-protected-resource/mcp returned 200 with scopes_supported mcp:read and mcp:propose. No OAuth, no tools/list, no tool calls."
category: ops-finance
agents: ["ChatGPT", "Claude", "n8n"]
tools: ["https://rylee.nl/mcp", "Rylee MCP", "contribution margin", "consolidated P&L"]
source: 官网
sourceUrl: https://rylee.nl/en/blog/mcp-amazon
sourceType: public
date: 2026-11-03
dateNote: "2026-11-03（Asia/Shanghai）采编 https://rylee.nl/en/blog/mcp-amazon （Noud van Workum；文首 18 August 2026，Last updated 10 October 2026）。同日匿名 POST https://rylee.nl/mcp initialize（JSON-RPC，无 Authorization）→ HTTP 401，JSON {\"message\":\"Unauthenticated.\"}。GET https://rylee.nl/.well-known/oauth-protected-resource/mcp → HTTP 200，JSON 含 resource=https://rylee.nl/mcp ，authorization_servers=[\"https://rylee.nl\"]，scopes_supported=[\"mcp:read\",\"mcp:propose\"]，bearer_methods_supported=[\"header\"]。未 OAuth，未 tools/list，未调用订单／毛利工具，未注册 Rylee。"
featured: false
prompt: |
  You answer margin and multi-channel shop questions only through Rylee MCP
  (https://rylee.nl/mcp) after the operator finished auth in their client.
  You do not change listings, prices, or ads on any marketplace.

  Question: {{margin drop | stock risk | channel mix | weekly summary | other}}
  Channels / SKUs the operator already named: {{input}}

  Rules:
  1) If initialize returns HTTP 401 / Unauthenticated, stop. Do not invent
     revenue, contribution margin, stock days, or P&L lines.
  2) Quote figures only as Rylee tools returned them. Label them Rylee’s
     copy of shop data — not a bank statement you reconciled.
  3) The blog says the link is read-oriented and does not modify the selling
     account. If a propose/write-shaped tool appears, wait for an explicit
     yes that names the SKU and field. Scope mcp:propose is not a blank cheque.
  4) Bad COGS in Rylee stay bad in the answer. Say when cost inputs look
     missing instead of inventing purchase prices.
  5) Never paste Rylee or marketplace passwords, or the MCP bearer, in chat.
  Output: (a) tools called, (b) fields returned, (c) unknowns,
  (d) ACTIONS REQUIRING HUMAN APPROVAL.
---

## 解决什么问题

欧洲多渠道卖家若要把销量、库存和**单品贡献毛利**丢给 ChatGPT／Claude 做追问，以往路径是导出 → 清洗 → 上传，第二天数据又过期。Rylee 博客 [MCP for Amazon sellers](https://rylee.nl/en/blog/mcp-amazon)（2026-08-18，更新 2026-10-10）把解决办法写成托管 MCP：在 AI 客户端里添加 `https://rylee.nl/mcp`，模型按问题取数，而不是先拿一份静态表。

博客写明暴露的是 **Rylee 环境里已有的店铺数据**：Amazon 欧洲各站、bol、Kaufland、Shopify、WooCommerce 的订单／销量／库存，外加成本、单品贡献毛利与合并 P&L。重点句：只看见收入的模型给收入建议；能看见贡献毛利的模型才给毛利建议。连接从 AI 工具发起；文称偏只读、不改卖家账号。也点名可在 n8n 一类自动化里用同一标准。

与站内相近篇错位：

- [DataDoe Amazon MCP](/cases/datadoe-amazon-seller-vendor-ads-mcp/)：Amazon Seller／Vendor／Ads 托管 MCP，美国向叙事更重。Rylee 本条强调欧洲站 + bol／Kaufland 与自有成本结构。
- [Helium 10 MCP](/cases/helium10-mcp-amazon-seller-research-ads/)：Helium 10 账号内的选品／广告／利润研究数据。Rylee 是卖家自己店铺账与成本。
- [Keepa](/cases/keepa-amazon-mcp/)：市场公开价格史，不是你的贡献毛利。
- [n8n 多平台库存同步](/cases/n8n-shopify-amazon-flipkart-inventory-sync/)：工作流模板搬库存。Rylee 是 MCP 问自有 P&L／毛利。

## 人审闸门（必须人工确认）

1. **先认证再问数** — 匿名 initialize 为 401。没有会话就不要编毛利。
2. **金额先复核** — 博客：语言模型算数不完美；要到金额就人工核一遍。
3. **成本结构不对就停** — 博客：采购价／费用错了，AI 会给出很有信心的错毛利。缺 COGS 时明说不知道。
4. **mcp:propose 不是自动改站** — well-known 元数据列出 `mcp:read` 与 `mcp:propose`。博客主体仍写不改卖家账号。任何提案／写形工具都要人点名批准。
5. **数据会离开你的电脑** — 博客提醒权衡 AI 厂商与条款。本站不代你接受条款。
6. **不在聊天里贴密钥** — Rylee 或平台密码、Bearer 都不进对话。

## 可复现步骤

前置（据[该博客](https://rylee.nl/en/blog/mcp-amazon) 与本站探针）：

1. 已在 Rylee 维护好多渠道店铺与成本
2. ChatGPT／Claude／n8n 等支持添加远程 MCP 的客户端
3. 能在 `https://rylee.nl` 授权服务器完成登录的人

跟做（公开材料 + 匿名探活；**未**注册）：

1. 在客户端添加 `https://rylee.nl/mcp`
2. 本站匿名 `initialize` → HTTP 401 `Unauthenticated.`
3. 可选：读 `https://rylee.nl/.well-known/oauth-protected-resource/mcp`（本站 200，见 dateNote）
4. 人完成授权后，先问只读：哪几个 SKU 毛利环比下降、哪几个按当前流速会在六周内缺货、Amazon 与其它渠道的毛利对比
5. 周报／异常摘要可放进 n8n；改价、改库存、改广告仍回各平台后台由人操作

## 预期结果与失败限制

**预期（博客表述，不是本站实测）：**

- 在对话里追问自有多渠道销量、库存与贡献毛利，无需每次导出
- 同一 MCP 标准可用于 ChatGPT、Claude 与 n8n
- 不想接 MCP 时，博客指向站内 Amazon seller AI advisor 作为替代产品路径（本站未测）

**失败与边界：**

- 匿名：**HTTP 401**
- 模型看不到你没写入 Rylee 的上下文（换供、大促），人要自己补解释
- `mcp:propose` 的真实工具面以登录后 `tools/list` 为准；本站未 list
- 博客是 Amazon sellers 向说明，渠道列表以该文为准，不扩展成全球所有站点承诺

## 来源与核验状态

**公开可核验**

- 主链：[MCP for Amazon sellers（Rylee 博客）](https://rylee.nl/en/blog/mcp-amazon)
- 端点：`https://rylee.nl/mcp`；OAuth protected-resource：`https://rylee.nl/.well-known/oauth-protected-resource/mcp`
- 探针：2026-11-03（Asia/Shanghai）initialize 401；well-known 200。未 OAuth、未调用工具。

## English brief

Rylee’s hosted MCP at `https://rylee.nl/mcp` exposes the merchant’s own multi-channel shop data in Rylee — Amazon European marketplaces, bol, Kaufland, Shopify, WooCommerce — plus costs, contribution margin, and consolidated P&L to ChatGPT, Claude, or n8n. The 2026-08-18 blog (updated 2026-10-10) describes a read-oriented connection that starts in the AI client. Lab anonymous initialize on 2026-11-03 (Asia/Shanghai) returned HTTP 401; the OAuth protected-resource document lists scopes `mcp:read` and `mcp:propose`. No OAuth and no tool calls.
