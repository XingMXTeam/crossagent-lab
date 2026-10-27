---
title: "HN：SoldFetch 用 MCP 查 eBay 已售 listing"
titleEn: "HN: SoldFetch MCP for eBay sold listings"
summary: "据 Show HN（qwikhost，item 50020908，2026-10-09）与 soldfetch.com 首页：远程 MCP https://soldfetch.com/api/mcp 用 API-KEY 提供 eBay 已售／在售搜索、类目搜索和单品详情，单次搜索页最多 200 条，上线站点为美国、英国、德国。同一账号可走 REST 或可安装的 ebay-data Skill。注册声称送 100 free units。本站 2026-10-27（Asia/Shanghai）匿名 POST initialize → HTTP 401，JSON-RPC -32001，data.soldfetchCode=7003，无 listing。不要把文档站 Mintlify 搜索 MCP（docs.soldfetch.com/mcp → soldfetch.com/docs/mcp）当成这条 eBay 数据端点。"
summaryEn: "Show HN (qwikhost, item 50020908, 2026-10-09) and soldfetch.com: remote MCP https://soldfetch.com/api/mcp serves eBay sold/active search, category search, and item details with an API-KEY header. Search pages claim up to 200 records; launch sites are US, UK, and Germany. REST and an installable ebay-data Skill share the account. Signup claims 100 free units. Lab anonymous initialize on 2026-10-27 (Asia/Shanghai) returned HTTP 401, JSON-RPC -32001, soldfetchCode 7003, and no listings. The Mintlify docs-search MCP (docs.soldfetch.com/mcp, which redirects to soldfetch.com/docs/mcp) is a different server."
category: sourcing
agents: ["Claude", "Claude Desktop", "Cursor", "Windsurf", "Codex", "Claude Code", "OpenAI Agents"]
tools: ["SoldFetch eBay MCP", "https://soldfetch.com/api/mcp", "ebay-data Skill", "REST /v1"]
source: Hacker News
sourceUrl: https://news.ycombinator.com/item?id=50020908
sourceType: public
date: 2026-10-27
dateNote: "HN Show HN 标题 Show HN: eBay sold listings APIs and MCP，作者 qwikhost，item 50020908，url https://soldfetch.com，Firebase time 1791555557 = 2026-10-09T14:19:17Z。2026-10-27（Asia/Shanghai）采编该帖与 https://soldfetch.com/ 。同日匿名 POST https://soldfetch.com/api/mcp initialize（无 API-KEY）→ HTTP 401，error.code=-32001，message=Unauthorized，data.soldfetchCode=7003；响应头 x-soldfetch-usage-units=0、x-soldfetch-schema-version=2026-10-08。未注册、未调用 tools/list、未安装 Skill。同日 docs.soldfetch.com/mcp 为 HTTP 301 到 https://soldfetch.com/docs/mcp，正文是文档搜索用的 Mintlify 描述（search_sold_fetch 等），不是 eBay 数据 MCP。"
featured: false
prompt: |
  You research public eBay sold and active listings only through the
  SoldFetch eBay-data MCP at https://soldfetch.com/api/mcp.
  The API-KEY stays in the client header. Never ask for it in chat.

  Query: {{keyword_or_item_id}}
  ebaySite the operator named: {{ebay.com | ebay.co.uk | ebay.de | other}}
  Question: {{sold | active | category | item}}

  Rules:
  1) Call only https://soldfetch.com/api/mcp (header API-KEY). If the
     connected server exposes search_sold_fetch, query_docs_filesystem_sold_fetch,
     or submit_feedback, stop: that is the docs-search MCP, not eBay listing
     data. Do not answer listing questions from documentation search.
  2) If initialize or a call returns HTTP 401 or soldfetchCode 7003, say the
     call was unauthorized. Do not invent sold prices, dates, conditions,
     shipping, or seller feedback.
  3) Quote numbers only as returned. Keep quality fields (priceBasis,
     saleDateVerified, cache, fetched-at). A displayed price with
     saleDateVerified=false is not a confirmed sale date.
  4) Homepage sample JSON, item id 377534750427, and the illustrative
     price tiles are examples. Do not repeat them as this query's result.
  5) Launch coverage on the 2026-10-27 homepage is US, UK, and Germany.
     If ebaySite is anything else, say the page did not list that site.
  6) Do not log into eBay, place bids, or buy. Do not treat a SoldFetch
     row as permission to purchase. Paid plans (Starter / Growth / Scale)
     are the account owner's billing decision.
  Output: (a) operation and fields returned, (b) unknowns and quality flags,
  (c) ACTIONS REQUIRING HUMAN APPROVAL before a buy or price decision.
---

## 解决什么问题

转卖、定价和选品要看 eBay 上已经结束的 listing：页面上的价格、成色、运费、卖家公开信息。Show HN 的原文是：一次请求最多取 200 条 eBay sold listings，并在有的时候带上 displayed prices、condition、shipping、seller details。首页把同一句话放在主标题下，并写成给 resellers、pricing tools 和 developers 用。

数据入口是远程 MCP `https://soldfetch.com/api/mcp`，header 为 `API-KEY: soldfetch_live_...`。同一套操作也能走 REST，或装一份 ebay-data Skill。首页 FAQ 写：REST、MCP 和 Skill 走同一批操作、同一套授权和同一个规范化模型。

这是**第三方公开 eBay 数据**，页面声明不隶属 eBay。它不登录卖家后台。

与站内相近篇错位：

- [Glade API](/cases/hn-glade-api-amazon-data-mcp/)：同一 HN 用户名 qwikhost 的另一则 Show HN（item 49345107），对象是亚马逊公开商品数据。SoldFetch 这条是 eBay。两则帖只说明作者用户名相同，本页不把两家产品写成同一份合同。
- [Keepa MCP](/cases/keepa-amazon-mcp/)、[SoldScope MCP](/cases/soldscope-mcp-live-amazon-data/)、[AMZScout Skill+MCP](/cases/amzscout-mcp-niche-validation/)：都是亚马逊市场调研。SoldFetch 不提供 ASIN、Buy Box 或 Keepa token。
- [SellerForge MCP](/cases/reddit-sellerforge-amazon-mcp/)：读的是卖家自己账号里的健康度、报销和 POA。SoldFetch 读的是公开 listing。

另外一条容易装错的端点：`https://docs.soldfetch.com/mcp` 在 2026-10-27 返回 **301**，落到 `https://soldfetch.com/docs/mcp`。那个 URL 的正文是文档站的 Mintlify 描述，工具名是 `search_sold_fetch`、`query_docs_filesystem_sold_fetch`、`submit_feedback`，instructions 写明只搜已发布的站点文档。eBay 已售数据在 `https://soldfetch.com/api/mcp`。

## 人审闸门（必须人工确认）

1. **API key 只放客户端 header** — 首页示例是 `API-KEY: soldfetch_live_...`。不要贴进聊天、Skill 文件或仓库。
2. **先确认连的是数据 MCP** — 出现文档搜索工具就停。文档搜索不能代替已售 listing。
3. **401 之后不补价格** — 无 key 的 initialize 只有 `Unauthorized` / `soldfetchCode` 7003。没有 listing 字段就回答不知道。
4. **首页示例不是这次查询** — FAQ 写初始示例是 illustrative。样本 JSON（item `377534750427`、价格 `37.00`）和价格监控插图（`$89.99` / `$91.20` / `$94.00`，以及 72% / 21% / 7% 成色条）是页面示例。
5. **质量字段留给人看** — 搜索示例里 `quality.priceBasis` 为 `displayed_listing_price`，`saleDateVerified` 为 `false`。FAQ 写搜索最多 200 条，displayed prices 和供应商报告的日期带质量警告。未核验的日期不能写成「成交日已确认」。
6. **站点范围** — 首页规模块写 Marketplaces covered：US · UK · Germany at launch。别的站点不要补。
7. **付费档由账号所有人开通** — 2026-10-27 首页：Basic 100 units、$0；Starter 2,000 units、$9／月；Growth 10,000 units、$29／月；Scale 50,000 units、$79／月。本站未注册、未付款。
8. **不把行项目当成下单指令** — 不登录 eBay，不出价，不购买。

## 可复现步骤

前置（据 [HN 帖](https://news.ycombinator.com/item?id=50020908) 与 [首页](https://soldfetch.com/)，外加本站匿名探活）：

1. 可读帖文和首页，无需 key
2. 要真实查询：在 SoldFetch 注册组织 key。首页写 100 free units、No card · no commitment。Basic 档也是 100 units、$0，并写有 REST & MCP
3. 支持远程 HTTP MCP 的客户端。首页 MCP 块点名 Claude Desktop、Cursor、Windsurf、Codex、Claude Code、OpenAI Agents

跟做（公开材料；本站未注册、未执行安装命令）：

1. 打开 HN `item?id=50020908`。帖文链到 `https://soldfetch.com`。能力以首页和探活为准，不跟帖分数。
2. MCP：按首页示例写入 `mcpServers.soldfetch`，`url` 为 `https://soldfetch.com/api/mcp`，`headers` 里放 `API-KEY`。示例值保持 `soldfetch_live_...`，换成自己的 key 时只留在本机配置。
3. Skill：首页安装示例是

   ```text
   curl -fsSL https://soldfetch.com/skills/ebay-data/SKILL.md \
     -o .agents/skills/ebay-data/SKILL.md
   ```

   安装前自己打开该文件看范围。本站未执行这条 curl。
4. REST 与 MCP 使用同一 key。首页给出的搜索示例是 `GET /v1/scrape?keyword=...&ebaySite=ebay.com&count=60`，item 示例是 `GET /v1/item/{itemId}`。成功的一次搜索页或一次 item lookup 计 **1 unit**（首页文案）。重放成功的 idempotency key 不再计费；失败不计费（页内原句：Pay for useful data. Never for failures.）。
5. 读返回里的 cache、fetched-at、request id 和 `quality`。缺字段就停。
6. 速率是页面档位，本站未压测：Basic 写 10 requests／minute、1 concurrent；Starter／Growth／Scale 写 60 requests／minute、5 concurrent。各档都写 30-day request logs、REST & MCP。

## 预期结果与失败限制

**预期（首页声称 + 本站匿名返回）：**

- eBay 数据 MCP 为 `https://soldfetch.com/api/mcp`，用 `API-KEY` header
- 操作覆盖 sold search、active search、category search、item details（FAQ 用语）。页面同时出现「3 API operations」和四块 GET 示例（Sold listings、Item details、Category search、Active listings），页脚又写「See all 3 APIs」。本页不把这些数字收成单一官方计数
- 规模块写「2 Interfaces」，下一行却是 REST · MCP · installable Skill。FAQ 明确是这三样。以 FAQ 的三接口为准，并保留页面上的「2」作为原文不一致
- 搜索最多 200 条（帖文与 FAQ）
- 上线站点：US、UK、Germany
- 响应声称携带 cache、fetched-at、request id、稳定错误和 usage metadata

**失败与边界：**

- 无 `API-KEY` 的 initialize 在本站为 **HTTP 401**。正文没有商品。不能从 401 推出价格或成交日
- 文档 MCP 的工具列表不能当成 eBay 数据工具列表。本站没有对 `https://soldfetch.com/api/mcp` 做 `tools/list`（401 之后即停）
- 示例响应自带 `saleDateVerified: false`。displayed price 不是已核对的成交证明
- 首页声明独立数据服务，不隶属 eBay
- 本站未注册、未安装 Skill、未走 REST 成功调用、未打开付费结账

## 来源与核验状态

**公开可核验**

- 主链接：[Show HN: eBay sold listings APIs and MCP](https://news.ycombinator.com/item?id=50020908)（qwikhost，2026-10-09T14:19:17Z）
- 产品首页：[soldfetch.com](https://soldfetch.com/)
- 文档搜索描述（**不是**数据端点）：[soldfetch.com/docs/mcp](https://soldfetch.com/docs/mcp)（`docs.soldfetch.com/mcp` 301 到这里）
- 端点探活（本站，2026-10-27 Asia/Shanghai，**无 API key**）：

```
POST https://soldfetch.com/api/mcp  method=initialize
→ HTTP 401
  jsonrpc error.code=-32001
  message=Unauthorized
  data.soldfetchCode=7003
  x-soldfetch-usage-units=0
  x-soldfetch-schema-version=2026-10-08
  无 listing 载荷

POST https://docs.soldfetch.com/mcp  （未跟随重定向）
→ HTTP 301
  Location: https://soldfetch.com/docs/mcp
  跟随之后的正文工具：search_sold_fetch、
  query_docs_filesystem_sold_fetch、submit_feedback
  operationId 含 mintlify_default_search
```

- 采编：2026-10-27（Asia/Shanghai）。HN API 当时 score=1、descendants=0，会变。与 Glade、Keepa、SoldScope、AMZScout、SellerForge 的差别见首节。

## 据公开帖摘要

**HN（item 50020908，2026-10-09，qwikhost）：**

- 标题：Show HN: eBay sold listings APIs and MCP
- 外链：`https://soldfetch.com`
- 正文：一次请求最多 200 条 eBay sold listings，在有数据时带 displayed prices、condition、shipping、seller details。面向 resellers、pricing tools、developers
- 无跟帖（采编日 descendants=0）

**首页（soldfetch.com，2026-10-27 仍可打开）：**

- 主标题下复述同一句 200 条说明，并写 eBay data for agents, now over MCP
- MCP JSON 示例：`url` = `https://soldfetch.com/api/mcp`，header `API-KEY`
- Skill 路径：`https://soldfetch.com/skills/ebay-data/SKILL.md`
- 三档付费加上免费 Basic，单位与月费见人审闸门。免费档与付费档都标 REST & MCP
- FAQ：可查 sold and active search、category search、item details；playground 初始示例是 illustrative，跑预设才走服务端 key；与 eBay 无隶属关系
- 页脚有「SoldFetch vs SoldComps」入口。本站未把该对比页当作事实来源

## English brief

SoldFetch (Show HN item 50020908, qwikhost, 2026-10-09) offers eBay sold and active search, category search, and item details over REST, an installable ebay-data Skill, and a remote MCP at `https://soldfetch.com/api/mcp` with an `API-KEY` header. The post and the FAQ say one search returns up to 200 listings, with displayed prices, condition, shipping, and seller details when present. The homepage says launch marketplaces are the US, UK, and Germany, signup includes 100 free units, and paid tiers are Starter $9 / 2,000 units, Growth $29 / 10,000, and Scale $79 / 50,000 per month. Sample JSON and price tiles are labeled illustrative; a sample quality block sets `saleDateVerified` to false. This is public eBay listing data, distinct from qwikhost’s Glade Amazon API and from Amazon research MCPs or SellerForge account records. Lab on 2026-10-27 (Asia/Shanghai), no key: initialize returned HTTP 401, JSON-RPC -32001, `soldfetchCode` 7003, usage units 0, and no listings. `docs.soldfetch.com/mcp` redirects to a Mintlify docs-search descriptor (`search_sold_fetch` and filesystem query tools). That server does not return eBay sold rows. A human approves any paid plan and any buy or price decision.
