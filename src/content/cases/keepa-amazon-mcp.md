---
title: "Keepa 官方托管 MCP：价格史、Product Finder 与 Deal（需有效 API 订阅）"
titleEn: "Keepa official hosted MCP — price history, Product Finder, and deals (active API subscription)"
summary: "据 Keepa MCP 文档：官方托管端点 https://keepa.com/mcp（Streamable HTTP）把商品、Buy Box、价格史、图表、Product Finder、Deal／Lightning Deals、类目畅销、卖家店面和价格追踪交给 Claude、ChatGPT 等。需要有效的 Keepa API 订阅；OAuth 登录 Keepa 账号，或 Authorization: Bearer API key。每次调用消耗与 REST 相同的 token，工具说明里写明消耗，响应带余额。本站 2026-10-26（Asia/Shanghai）匿名 initialize → HTTP 401。未调用任何工具，未粘贴 key。"
summaryEn: "Keepa’s MCP docs: official hosted Streamable HTTP at https://keepa.com/mcp for product lookup with Buy Box stats, price history, charts, Product Finder, deals and Lightning Deals, category best sellers, sellers and storefronts, and price trackings. An active Keepa API subscription is required — OAuth (Claude/ChatGPT) or Authorization: Bearer API key. Tool calls spend the same tokens as REST; each tool states its cost and each response includes the balance. Lab anonymous initialize on 2026-10-26 (Asia/Shanghai) returned HTTP 401. No tool calls and no API key."
category: sourcing
agents: ["Claude", "ChatGPT", "Claude Code", "Cursor", "VS Code", "Gemini", "Windsurf", "Codex", "Cline"]
tools: ["Keepa MCP", "https://keepa.com/mcp", "Product Finder", "Keepa price history", "Lightning Deals", "Buy Box"]
source: 官网
sourceUrl: https://keepa.com/api-docs/mcp.html
sourceType: public
date: 2026-10-26
dateNote: "2026-10-26（Asia/Shanghai）采编 https://keepa.com/api-docs/mcp.html。同日匿名 POST https://keepa.com/mcp initialize（无 Authorization）→ HTTP 401，JSON-RPC error code -32001，正文要求提供 Keepa API key。www-authenticate 含 Bearer 与 resource_metadata https://keepa.com/.well-known/oauth-protected-resource/mcp 、scope=mcp。未调用 tools/list 或任何数据工具；未持有、未粘贴 API key。"
featured: false
prompt: |
  You research Amazon products only through the official Keepa MCP
  (https://keepa.com/mcp) when the operator has an active Keepa API
  subscription. The key stays in the client config or OAuth session.
  Never ask for the key in chat and never write it into a repository.

  Question: {{price_history | product_finder | deals | best_sellers | seller | tracking}}
  ASIN, category, or finder filters the operator already wrote: {{input}}

  Rules:
  1) Do not call tools until the operator confirms this session may spend
     Keepa tokens. If initialize or a call returns 401, stop. Do not invent
     prices, ranks, offer counts, or deal lists.
  2) Quote token cost from the tool description and the balance field on
     the response. If either is missing, say so.
  3) MCP payloads are shaped for language models. For application code,
     use the Keepa REST API, not a pasted MCP transcript.
  4) Research only. Do not buy, list, reprice, or create a Seller Central
     shipment from these numbers.
  5) Tracking/notification tools change the Keepa account. Propose the
     change and wait for an explicit yes before calling them.
  Output: (a) tool and token fields actually returned, (b) unknowns,
  (c) ACTIONS REQUIRING HUMAN APPROVAL (subscription spend, tracking
  writes, any buy or listing decision).
---

## 解决什么问题

选品要看的是**这条 ASIN 的价格和 Buy Box 怎么走过来**，以及一类目里哪些商品在掉价、谁在卖。模型训练数据补不出 Keepa 那种按 token 计费的历史曲线。Keepa 官方把同一套 API 做成托管 MCP：`https://keepa.com/mcp`，不用自建服务器。

文档写明助手可以：查商品（含价格、统计和 Buy Box）、走解码后的价格史、出 Keepa 图表、搜索亚马逊、跑 Product Finder、看近期降价和 Lightning Deals、拉类目畅销、看卖家及其店面、管理价格追踪和通知。每个工具的说明里写 token 消耗，每次响应带当前余额。响应形状是给语言模型的；写程序应直接用 REST API。

这是 **Keepa 自己的官方价格史／Product Finder 层**。它不登录 Seller Central，也不替你改刊登。

与站内相近篇错位：

- [Glade API](/cases/hn-glade-api-amazon-data-mcp/)：第三方公开数据，REST／GraphQL／MCP，操作面是 product、search、offer、review、seller、category、deal、estimate。不是 Keepa 账号，也不是 Keepa token。
- [SoldScope MCP](/cases/soldscope-mcp-live-amazon-data/)：另一家产品页上的亚马逊关键词／ASIN MCP。数据源不是 Keepa 官方价格史。
- [AMZScout Skill+MCP](/cases/amzscout-mcp-niche-validation/)：AMZScout 仓库里的选品、关键词、Listing 与 PPC 规划 MCP。不是 `keepa.com/mcp`。
- [卖家插件／Agentic Toolkit／广告 MCP](/cases/amazon-selling-partner-claude-plugin/)：那些读的是**卖家自己的**后台或广告账号。Keepa 读的是其 API 订阅下的市场数据，调用花的是 Keepa token，不是卖家后台写权限。

## 人审闸门（必须人工确认）

以下动作不得由 Agent 自动执行：

1. **开通或升级 Keepa API 订阅、继续烧 token** — 文档：必须有有效 API 订阅；工具调用与直接打 API 消耗同一套 token。余额是你的套餐余额
2. **把 API key 写进会提交的配置** — 文档：key 是机密。嵌进会被提交或公开的 `.mcp.json` 等文件，等于把 token 交给拿到文件的人。VS Code 用 `inputs` 询问，Codex 从环境变量读，能用 `${env:…}` 的客户端不要把字面 key 落盘
3. **创建、修改、删除价格追踪或通知** — 文档把 manage price trackings 算进助手能做的事。这是账号写入，先列出将要追踪的 ASIN 和条件，等人说可以
4. **用返回的价格、掉价幅度或畅销名次直接下单、开广告或写 Listing** — 研究输出。买或不买由人决定
5. **把 MCP 文本响应抄进生产代码当稳定 schema** — 文档：给模型看的形状；程序走 REST
6. **在 401 之后编一组「大概的 Keepa 价格」** — 没有工具结果就停

## 可复现步骤

前置（据 [Keepa MCP 文档](https://keepa.com/api-docs/mcp.html)；本站只做了匿名 initialize）：

1. Keepa 账号上有**有效的 API 订阅**。access key 在账号的 API 页。没有订阅就不要配 key
2. 端点 `POST https://keepa.com/mcp`，Streamable HTTP
3. 两种认证：Claude、ChatGPT 这类有连接器界面的用 Keepa 账号 OAuth；配置文件或命令行走 `Authorization: Bearer YOUR_API_KEY`

OAuth（文档）：

1. 把 `https://keepa.com/mcp` 加为自定义连接器。client id／secret 留空
2. 助手打开 keepa.com 页面，写明应用名并请求批准。未登录先登录
3. **Claude（claude.ai 与 Claude 应用）**：Settings → Connectors → Add custom connector，填 URL，再 Connect。Team／Enterprise 要所有者先给组织加上
4. **ChatGPT**：自定义连接器需要 developer mode（Settings → Apps & Connectors → Advanced settings），认证选 OAuth。是否可用取决于套餐
5. **Claude Code（OAuth，不把 key 写进命令）**：

   ```bash
   claude mcp add --transport http keepa https://keepa.com/mcp
   ```

   然后在会话里 `/mcp`，选 keepa，Authenticate

文档对「批准」的含义：应用通过你的 API 额度调用，账号要有有效订阅，每次调用花套餐 token；应用看不到密码和 API key；轮换 API key 后已连接的应用仍可用；可在 API 页的 Connected apps 断开；改密码会断开全部已连接应用。

用 key 的配置（文档中的占位符；**不要**把真实 key 提交进仓库）：

1. **Claude Code**：

   ```bash
   claude mcp add --transport http keepa https://keepa.com/mcp --header "Authorization: Bearer YOUR_API_KEY"
   ```

2. **Cursor**（`~/.cursor/mcp.json` 或项目 `.cursor/mcp.json`）：

   ```json
   {
     "mcpServers": {
       "keepa": {
         "url": "https://keepa.com/mcp",
         "headers": { "Authorization": "Bearer YOUR_API_KEY" }
       }
     }
   }
   ```

3. **VS Code**（`.vscode/mcp.json`）：`inputs` 里 `password: true`，首次启动询问，加密保存。header 使用 `${input:keepa-api-key}`

4. **Gemini CLI**：`gemini mcp add -s user --transport http --header "Authorization: Bearer YOUR_API_KEY" keepa https://keepa.com/mcp`（`-s user` 写到 `~/.gemini/settings.json`；去掉则是项目范围）

5. **Windsurf**：`~/.codeium/windsurf/mcp_config.json` 使用 `serverUrl`

6. **Codex**：`codex mcp add keepa --url https://keepa.com/mcp --bearer-token-env-var KEEPA_API_KEY`。key 来自环境变量，不写入配置文件

7. **Cline**：`type` 必须正好是 `streamableHttp`。文档注：Roo Code 用 `streamable-http`

8. **Claude Desktop** 也可以不写配置文件，改走上面的连接器登录。若走配置，文档给的是 `npx mcp-remote` 桥，header 放在环境变量 `AUTH_HEADER`，改完重启

本站没有执行以上任何一条带 key 的命令。

## 预期结果与失败限制

**预期（文档表述）：**

- 官方托管，无安装包；服务端更新后客户端连上就是新版本
- 能力范围：商品与 Buy Box／统计、解码价格史、Keepa 图表、亚马逊搜索、Product Finder、近期降价与 Lightning Deals、类目畅销、卖家与店面、价格追踪和通知
- 文档里的问法示例：「这只 ASIN 过去一年 Buy Box 价格怎么走？」「找出本周价格至少降了 30% 的厨房商品」。示例是能力说明，**不是**本站跑出来的结果，不要把 30% 当成某次查询的实测降幅
- 每个工具描述写 token 成本；每条响应带当前余额，便于助手按你的套餐节奏调用
- 响应面向语言模型。程序集成用 REST API

**失败与边界：**

- 无凭证的 initialize 在本站为 **HTTP 401**（见下节）。文档与探活一致：没有 key 或 OAuth 就没有数据
- 本站**未**调用 `tools/list`。文档页「What your assistant can do」用能力句子描述，**没有**公开一份函数名清单。本篇不编 `product_lookup` 这类名字
- token 单价、套餐档位不在这份 MCP 页上。不从别的页面补价
- 追踪／通知会改 Keepa 账号。研究问题停在读
- 匿名 401 的正文只说明缺 key，不含商品字段。不能从 401 推出价格

## 来源与核验状态

**公开可核验**

- 主链接：[MCP Server — Keepa API Documentation](https://keepa.com/api-docs/mcp.html)
- 端点：`https://keepa.com/mcp`
- 探活（本站，2026-10-26 Asia/Shanghai，**无 API key**）：

```
POST https://keepa.com/mcp  method=initialize
→ HTTP 401
  www-authenticate: Bearer
    resource_metadata=https://keepa.com/.well-known/oauth-protected-resource/mcp
    scope=mcp
  jsonrpc error code=-32001
  message 要求以 Authorization: Bearer 提供 Keepa API key
    （获取页为文档所述的 keepa.com API 页）

未发送 tools/list
未发送任何商品／Deal／Finder 调用
```

- 采编：2026-10-26（Asia/Shanghai）。与 Glade、SoldScope、AMZScout 以及卖家后台／广告 MCP 的区别见首节。

## 据公开帖摘要

**MCP 文档页：**

- 定位：把 Keepa 的亚马逊数据交给 Claude、ChatGPT 等助手。官方 MCP，全程托管，没有要下载或升级的包
- 客户端连接 `https://keepa.com/mcp`，用 Keepa 账号登录，或发送 API access key
- 前提：有效的 Keepa API 订阅。key 显示在账号 API 页。工具调用消耗与直接 API 请求相同的 token
- 认证两条：OAuth（连接器界面，Claude／ChatGPT）；Bearer key（配置文件或命令行）
- OAuth 批准后：应用使用你的 API 额度；应用拿不到密码和 key；新 key 不影响已连接应用；Connected apps 可断开；改密码断开全部
- 安装片段覆盖 Claude Code、Claude Desktop（`mcp-remote`）、Cursor、VS Code、Gemini CLI、Windsurf、Codex、Cline／Roo Code，以及一份通用 Streamable HTTP JSON
- 助手能力（文档原句归纳，非函数名）：商品价格／统计／Buy Box、解码价格史、Keepa 图表、搜索、Product Finder、近期降价与 Lightning Deals、类目畅销、卖家与店面、价格追踪与通知
- 每个工具描述标明 token 成本；每条响应带余额
- 响应为语言模型整形。写代码用 REST API
- 页末注明代码示例是说明性的

## English brief

Keepa’s official hosted MCP is `https://keepa.com/mcp` (Streamable HTTP). It requires an active Keepa API subscription. Claude and ChatGPT sign in with the Keepa account (OAuth); other clients send `Authorization: Bearer` the API key. Documented capabilities are product lookup with prices, statistics, and Buy Box, decoded price history, Keepa charts, Amazon search, Product Finder, recent drops and Lightning Deals, category best sellers, seller storefronts, and price trackings with notifications. Each tool description states its token cost and each response includes the balance. Payloads are for language models; programs should call the REST API. The docs do not publish a function-name list, so this page does not invent tool ids. Anonymous Lab initialize on 2026-10-26 (Asia/Shanghai) returned HTTP 401 (`-32001`, missing API key; OAuth protected-resource metadata on the challenge). No tools were called and no key was stored. This is Keepa’s own price-history layer, not Glade, SoldScope, or AMZScout, and not a Seller Central or Amazon Ads connector. A human approves subscription spend, tracking writes, and any buy or listing decision.
