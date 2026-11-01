---
title: "HN：StoreRouter 给 Agent 一条跨店目录（CLI／MCP，匿名握手 401）"
titleEn: "HN: StoreRouter — a multi-store catalog for agents (CLI and MCP; anonymous handshake is 401)"
summary: "据 Show HN（marram，item 50264240，created_at 约 2026-10-27T19:12:20Z）与 storerouter.ai：StoreRouter 把多家网店收成给 Agent 和工程师用的目录，用 CLI 与远程 MCP 做搜索、解析和相似品，商家不必各自实现 UCP 或 MCP。首页在 2026-11-01 仍展示截至 2026-10-31 的自述规模：2,978 家店、7,204,386 件商品、21,972 个品牌，本站未复测。同日匿名 POST https://mcp.storerouter.ai/mcp 的 initialize 返回 HTTP 401（invalid_token），WWW-Authenticate 要求 Bearer，resource_metadata 指向 https://mcp.storerouter.ai/.well-known/oauth-protected-resource。未完成 OAuth，未调用工具，也未用付费 key 跑通生产搜索。"
summaryEn: "Show HN (marram, item 50264240, created_at about 2026-10-27T19:12:20Z) and storerouter.ai: StoreRouter indexes many stores into one catalog for agents and engineers, with a CLI and a remote MCP for search, parse, and similar items, so each merchant does not have to ship UCP or MCP. On 2026-11-01 the homepage still showed source counts as of 2026-10-31: 2,978 stores, 7,204,386 products, 21,972 brands. Lab did not re-count them. The same day, an anonymous initialize POST to https://mcp.storerouter.ai/mcp returned HTTP 401 invalid_token, with WWW-Authenticate Bearer and resource_metadata https://mcp.storerouter.ai/.well-known/oauth-protected-resource. No OAuth, no tool calls, and no paid-key search against the production API."
category: ops-finance
agents: ["Claude", "Claude Code", "custom agent"]
tools: ["StoreRouter MCP", "https://mcp.storerouter.ai/mcp", "@storerouter/cli@next", "https://storerouter.ai/playground"]
source: Hacker News
sourceUrl: https://news.ycombinator.com/item?id=50264240
sourceType: public
date: 2026-11-01
dateNote: "HN Show HN 标题 Shop via CLI; for agents and software engineers，作者 marram，objectID 50264240，created_at 约 2026-10-27T19:12:20Z，发现时 points 约 5（分数会变）。2026-11-01（Asia/Shanghai）采编该帖、https://storerouter.ai/ （首页自述截至 2026-10-31：2,978 stores、7,204,386 products、21,972 brands）与 https://storerouter.ai/playground （页内为浏览器 WASM CLI）。文档中的客户端命令为 claude mcp add --transport http storerouter https://mcp.storerouter.ai/mcp ，并要求 OAuth。同日匿名 POST https://mcp.storerouter.ai/mcp initialize → HTTP 401，invalid_token；WWW-Authenticate 为 Bearer，resource_metadata=https://mcp.storerouter.ai/.well-known/oauth-protected-resource 。未打开该 metadata 文档，未完成 OAuth，未 tools/list，未调用搜索。npm：@storerouter/cli@next 为可用线（0.4.0）；latest 0.0.0 是占位包，安装说明指向 @next。未执行 CLI，未使用付费 key 对生产 API 搜索。"
featured: false
prompt: |
  You help an operator look up products across stores through StoreRouter
  only. You do not place orders, pay, or change any merchant catalog.

  Question: {{question}}
  Optional facet or similar-item hint: {{facet_or_similar_or_empty}}

  Rules:
  1) If the client has not finished StoreRouter OAuth, or initialize returns
     HTTP 401 / invalid_token, stop. Tell the operator to approve access
     in the client. Do not ask for API keys, passwords, or bearer tokens
     in chat.
  2) Quote products, prices, stores, and counts only when a StoreRouter
     tool or CLI response in this session returned them. Homepage figures
     (2,978 stores, 7,204,386 products, 21,972 brands as of 2026-10-31)
     and the Show HN author's ~3 second p90 are source claims. Never
     present them as this query's result or as a Lab benchmark.
  3) Install talk: the usable npm line recorded on 2026-11-01 is
     @storerouter/cli@next (0.4.0). The latest tag 0.0.0 is a bootstrap
     that tells you to install @next. Do not claim a search succeeded
     unless this session's command output says so.
  4) StoreRouter here is a catalog (search, parse, similar). It is not
     a checkout. Do not collect card numbers, shipping addresses, or
     "buy now" confirmation.
  5) Do not treat a hit as proof the merchant implemented UCP, Shop MCP,
     or Shopify shop.dev. StoreRouter's public pitch is that it indexes
     stores so each merchant does not have to.
  Output: (a) whether OAuth is present, (b) fields the tool actually
  returned, (c) unknowns, (d) ACTIONS REQUIRING HUMAN APPROVAL.
---

## Lab 探针成品（先看结果）

**方法：** 匿名 · 无 OAuth · 无 Bearer · 2026-11-01（Asia/Shanghai）  
**端点：** `POST https://mcp.storerouter.ai/mcp`（`initialize`）

| 探针 | 结果 |
|------|------|
| 匿名 `initialize` | **HTTP 401**，`invalid_token`；`WWW-Authenticate` 为 Bearer，`resource_metadata` 指向 `https://mcp.storerouter.ai/.well-known/oauth-protected-resource` |

**本站未跑：** 打开 protected-resource 文档、完成 OAuth、`tools/list`、任何搜索／解析／相似品调用、安装 CLI、在 Playground 提交查询、用付费 key 打生产 API。首页店数与帖文时延**不是**本站实测。

| 公开页声称 | 本站探针 | 差注 |
| --- | --- | --- |
| 文档用 `claude mcp add --transport http storerouter https://mcp.storerouter.ai/mcp`，并要求 OAuth | 匿名 initialize → HTTP 401 `invalid_token`，Bearer + 上述 `resource_metadata` | 一致（端点在，未授权被拒） |
| 首页截至 2026-10-31：2,978 店、7,204,386 商品、21,972 品牌 | 未清点目录 | 仅公开（本站未测） |
| `@storerouter/cli@next` 0.4.0 可用；`latest` 0.0.0 只引导安装 `@next` | 未安装、未搜索 | 仅公开（本站未测） |
| `https://storerouter.ai/playground` 为浏览器 WASM CLI | 未提交查询 | 仅公开（本站未测） |
| 帖文作者称搜索 p90 约 3 秒，覆盖小于 Shopify，结果常更好 | 未计时、未并排搜索 | 仅公开（本站未测） |

> 人审提醒：401 只说明这个 MCP 要 OAuth。它不能当成已经搜到货。闸门见下一节。

## 解决什么问题

购物 Agent 要在很多独立站里找货时，常见三条路都贵：自己爬、调用通用网页搜索、或开无头浏览器点页面。另一条路是等每家店实现 UCP、ACP 或 Shopify 的 Shop MCP。Show HN 与 storerouter.ai 的公开做法是第三条：**由 StoreRouter 把多店目录收成一个搜索接口**，Agent 和工程师用 CLI 或远程 MCP 做搜索、解析和相似品，而不是要求每个商家先把协议做完。

这是**发现／目录**用例，不是卖家后台，也不是代客下单。与站内相近篇错位：

- [Agora 统一货盘](/cases/hn-agora-universal-catalog-agents/)：跨店目录加上浏览器 `/agent` 与 REST 结账契约。StoreRouter 本条核验的是 CLI／MCP 目录面，以及匿名握手被 OAuth 挡住。
- [Opencommerce／Agentcard](/cases/hn-opencommerce-agentcard-buy-mcp/)：一条 `buy` 工具，人确认后才下单。StoreRouter 的公开材料讲搜索与解析，不讲本站已测的结账。
- [ShopsForBots](/cases/shopsforbots-agent-ready-shops-mcp/)：收录带机器可读信号的店，并返回对方**声明**的 MCP。StoreRouter 自称替商家做索引，店可以没有自己的 MCP。
- [Shop MCP 可见性对照](/cases/shop-mcp-visibility-tools/)：Shopify Shop MCP 上线后的扫描器名录。StoreRouter 作者在帖里拿 Shopify 的 shop.dev 当对照，产品本身是跨店索引。

## 人审闸门（必须人工确认）

1. **完成 StoreRouter OAuth、开通 API key 或付费额度** — 由账号所有人在对方流程里批准。密钥只放本机客户端或环境变量。
2. **把 token、密码或 Bearer 贴进聊天或仓库** — 禁止。
3. **把首页 2,978／7,204,386／21,972 或帖文里约 3 秒的 p90 写进对外 SLA** — 禁止。那是来源自述；本站未复测覆盖，也未计时。
4. **在这个目录接口上直接下单、收集卡号或改商家商品** — 禁止。公开定位是搜索、解析、相似品。
5. **用 `npm i @storerouter/cli` 的 latest 当作可用 CLI** — 2026-11-01 的记录是 `latest` 0.0.0 只提示改装 `@next`；可用版本线是 `@storerouter/cli@next` 0.4.0。装哪一条由人确认。
6. **把某次命中说成该店已实现 UCP 或 Shop MCP** — 禁止。索引结果不等于商家协议就绪。

## 可复现步骤

前置：

1. 可读 [HN item 50264240](https://news.ycombinator.com/item?id=50264240) 与 [storerouter.ai](https://storerouter.ai/)（无需账号）
2. 浏览器演示：[playground](https://storerouter.ai/playground)（页内为 WASM CLI；本站未提交查询）
3. 要调远程 MCP：支持 HTTP 传输的客户端，并准备在本机完成 OAuth。文档中的添加命令是 `claude mcp add --transport http storerouter https://mcp.storerouter.ai/mcp`
4. 要调 CLI：安装 `@storerouter/cli@next`（记录版本 0.4.0）。不要停在 `latest` 0.0.0

跟做（公开材料 + 本站匿名探活；**未** OAuth、**未**搜索）：

1. 打开 HN `item?id=50264240`。标题为 “Shop via CLI; for agents and software engineers”，链接到 `https://storerouter.ai`。
2. 读首页规模句时注明「截至 2026-10-31 的页面自述」，不要记成 Lab census。
3. 远程 MCP 基址：`https://mcp.storerouter.ai/mcp`。
4. 本站匿名 `initialize` → HTTP 401，`invalid_token`，`WWW-Authenticate` 要求 Bearer，并给出 resource metadata URL。到此停止；401 不是搜索结果。
5. 人在客户端完成 OAuth 之后，再问搜索或相似品。只引用该次工具返回的字段。
6. **不要**在验证流程里提交付款，也不要把 key 贴进对话。

## 预期结果与失败限制

**预期（来源自述 + 本站匿名返回）：**

- 一个跨店目录，CLI 与 MCP 面向 Agent／工程师，而不是逐店自建 UCP
- Playground 用浏览器里的 WASM CLI 演示同一套命令形态
- 未带 token 的 MCP initialize 会被 401 挡住；文档要求 OAuth
- `@next` 才是 2026-11-01 记录的可用 CLI 线

**失败／边界：**

- 未 OAuth 时不能把 401 写成「搜过了」。本站没有 `tools/list`，因此**不列举**生产环境的工具参数
- 未用付费 key 对生产 API 跑通搜索；任何「搜到了某 SKU」都不来自本站
- 首页店数、商品数、品牌数和作者写的 p90 会过期；发现时 HN 约 5 分，分数也会变
- 与卖家改价、广告、报关、代客 `buy` 不是同一产品面

## 来源与核验状态

**公开可核验**

- 主链：[HN item 50264240](https://news.ycombinator.com/item?id=50264240) → [storerouter.ai](https://storerouter.ai/)
- 辅链：[playground](https://storerouter.ai/playground)、MCP `https://mcp.storerouter.ai/mcp`
- 探针表见文首。采编日 2026-11-01（Asia/Shanghai）。未 OAuth、未搜索、未下单。

## 据公开帖摘要

Hacker News Show HN（`item?id=50264240`，作者 marram，created_at 约 2026-10-27T19:12:20Z）标题是 “Shop via CLI; for agents and software engineers”。帖文说他们在做一条通向大量网店的搜索／浏览接口，并在网站里嵌了 CLI 的 WASM，方便 Agent 和个人助理调用。作者把对照写成：与其自建爬虫、使用通用 LLM 搜索 API，或用无头浏览器，不如由他们替品牌做索引，因为指望零售商集体实现 UCP／ACP 不现实。作者同时写明覆盖小于 Shopify，搜索 p90 大约 3 秒（自由文本要先变成分面），并给出一条带颜色与材质分面的墨镜示例，称 shop.dev 会丢掉其中若干分面。这些比较是作者的主观判断，本站没有重跑那条命令。

首页在 2026-11-01 的自述规模（数据日期写 2026-10-31）为 2,978 家店、7,204,386 件商品、21,972 个品牌。npm 上 `@storerouter/cli` 的 `latest` 0.0.0 是占位，可用线是 `@next` 0.4.0。

## English brief

Show HN (about 2026-10-27) introduces StoreRouter as a CLI and MCP catalog over many stores for agents, positioned against per-merchant UCP and against Shopify shop.dev. Lab on 2026-11-01 (Asia/Shanghai) saw homepage counts as source claims and an anonymous MCP initialize of HTTP 401 `invalid_token` with a Bearer challenge. No OAuth, no tool calls, and no paid-key production search. Use `@storerouter/cli@next` (0.4.0); the `latest` tag 0.0.0 is only a pointer at `@next`.
