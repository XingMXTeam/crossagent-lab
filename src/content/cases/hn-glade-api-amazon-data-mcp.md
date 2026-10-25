---
title: "HN：Glade API 用 REST、GraphQL 或 MCP 取亚马逊公开数据"
titleEn: "HN: Glade API — Amazon public data over REST, GraphQL, or MCP"
summary: "据 Show HN（qwikhost，item 49345107，2026-08-18）：帖文称可通过 REST、GraphQL 或 MCP 使用 product、search、offer、review、seller、category、deal、estimate 数据。gladeapi.com 声称 17 个操作、13 个站点，注册送 100 free units，并声明不隶属 Amazon。这是第三方公开数据接口加 MCP／Skill，不是 Seller Central 账号连接器。"
summaryEn: "Show HN by qwikhost (item 49345107, 2026-08-18): REST, GraphQL, or MCP for product, search, offer, review, seller, category, deal, and estimate data. gladeapi.com claims 17 operations, 13 marketplaces, and 100 free units on signup, and says it is not affiliated with Amazon. A third-party public-data API, not a Seller Central connector."
category: sourcing
agents: ["Claude", "Cursor", "Claude Code", "Codex"]
tools: ["Glade API MCP", "REST/GraphQL", "amazon-data Skill", "https://gladeapi.com/api/mcp"]
source: Hacker News
sourceUrl: https://news.ycombinator.com/item?id=49345107
sourceType: public
date: 2026-08-18
dateNote: "HN Show HN，作者 qwikhost，objectID 49345107，发帖 2026-08-18。2026-10-25（Asia/Shanghai）采编。分数／评论会变（发现时约 4 points）。辅证 https://gladeapi.com ，不是 sourceUrl。"
featured: false
prompt: |
  You help with Amazon product research using Glade API only
  (REST, GraphQL, or MCP at https://gladeapi.com/api/mcp).
  The API key stays in the client config. Never ask me to paste it into chat.
  Do not log into or scrape Seller Central.

  ASIN or query: {{asin_or_query}}
  Domain the operator named: {{domain}}
  Question: {{product | search | offers | reviews | seller | category | deals | estimates}}

  Rules:
  1) Call only operations the connected interface actually exposes. If a call
     fails or a field is absent, say so. Reply "I don't know" instead of
     estimating price, rank, reviews, sales, or offer counts.
  2) Label every figure as a Glade response for planning. It is not an
     official Amazon statistic and not a Seller Central report.
  3) Homepage sample JSON and marketing tiles are examples. Do not repeat
     those sample prices, ratings, or percentages as this ASIN's data.
  4) Stock estimates and sales estimates stay labeled estimates.
  5) Do not place orders, change listings, or spend ad budget.

  Output: (a) operation and fields returned, including freshness metadata if present,
  (b) unknowns, (c) ACTIONS REQUIRING HUMAN APPROVAL before anyone uses the numbers
  in a buy, price, or listing decision.
---

## 解决什么问题

选品和竞品调研要看公开商品、搜索、报价、评论、卖家、类目、促销和估算，又不想自己养一套抓取。Show HN 帖把 Glade API 说成给各种构建用的亚马逊数据：REST、GraphQL 或 MCP，数据类型是 product、search、offer、review、seller、category、deal、estimate。

这是**第三方公开数据 API**，再加 MCP 和可安装的 amazon-data Skill。它不登录 Seller Central，也不读你的广告账户。与站内 [SoldScope MCP](/cases/soldscope-mcp-live-amazon-data/) 同类的是「给 Agent 的市场数据」，但 SoldScope 是另一家产品页上的 MCP；与 [AMZScout Skill+MCP](/cases/amzscout-mcp-niche-validation/) 也不是同一个仓库。与 [SellerForge MCP](/cases/reddit-sellerforge-amazon-mcp/) 方向相反：那边读的是卖家自己在 SellerForge 里的账号记录。

## 人审闸门（必须人工确认）

1. **API key 只放客户端配置** — 站点 MCP 示例把 `API-KEY` 放在 header。不要把 key 贴进聊天、Skill 文件或仓库。
2. **不编造站点指标** — 工具没返回的价格、排名、评论数、销量估算，回答 “I don't know”。首页示例 JSON 和营销插图里的数字是页面示例，不是本 ASIN 的测量。
3. **规划数据，不是亚马逊官方统计** — 站点声明独立数据服务、不隶属 Amazon。stock／sales estimates 是命名操作，不能写成官方销量或官方排名。
4. **不抓 Seller Central、不登卖家后台** — 本接口不替代 SP-API。不要让 Agent 去爬或登录卖家中心补数。
5. **拿去定价、下单或写 Listing 之前人确认** — 页内写每次响应带缓存状态、fetched-at、request id。过期与否由人看这些字段，不由模型宣布「这就是当前 Buy Box」。

## 可复现步骤

前置（据 [HN 帖](https://news.ycombinator.com/item?id=49345107) 与 [gladeapi.com](https://gladeapi.com)，本站未注册、未调用）：

1. 可读该 Show HN 与首页，无需 key 也能读概念
2. 要实际查询：在 Glade 注册组织 key。页首声称注册即 **100 free units**、No card · no commitment。下方 Hobby 档也写 100 units，并列出 REST API。Pro 20K 档列出 REST、GraphQL 与 MCP，站点标价 **$99/month**。免费额度是否包含 MCP 调用，分档表没有写进 Hobby，本页不补
3. 支持远程 MCP 的客户端。页内连接一节点名 Claude Desktop、Cursor、Windsurf、Codex、Claude Code、OpenAI Agents

跟做（公开材料）：

1. 打开 HN `item?id=49345107`，确认标题与链到的 `https://gladeapi.com`
2. 在首页操作目录核对你要的操作。页内列出 17 个：Product details、Product variants、Product offers、Product reviews、Stock estimate、Sales estimates、GTIN from ASIN、ASIN from GTIN、Product search、Autocomplete、Deals、Best sellers、Best-seller categories、Seller、Author、Category taxonomy、Category
3. MCP：按页内示例把 `https://gladeapi.com/api/mcp` 写入客户端的 `mcpServers`，`API-KEY` 放 header，值只留在本机配置
4. Skill：页内安装示例是把 `https://gladeapi.com/skills/amazon-data/SKILL.md` 拉到 `.agents/skills/amazon-data/SKILL.md`。安装前自己打开该文件看范围；本站未执行这条 curl
5. 同一操作也可走 REST 或 GraphQL。页内写成功的 REST、GraphQL 或 MCP 调用计 **1 unit**；内部重试不算在用户头上（站点声称）
6. 读返回里的缓存与 fetched-at。缺字段就停，不要用首页示例里的价格或评分填上

## 预期结果与失败限制

**预期（站点声称）：**

- 商品、搜索、报价、评论、卖家、类目、促销、估算走同一套规范化操作
- 17 个操作、13 个 marketplace（页内地理只写到 North America · Europe · APAC，**没有逐国点名**，本页不列国家）
- 四种接口：REST、GraphQL、MCP、Skill
- 响应带缓存状态、抓取时间、request id、稳定错误和用量元数据
- 注册声称赠送 100 free units，不绑卡

**失败与边界：**

- 页内示例响应标成 “Example Amazon product”。那些价格、评分、评论数是示例，不是 Lab 测到的市场数据，本条不抄进结论
- 营销区块里的 Buy Box、评论比例、排名变化同样当页面插图，不当测量
- Starter 等档的标价和接口列表，本次公开页抓取不完整的部分写「来源未写明」，不补价
- 13 个站点具体是哪些国家：首页未逐条列出
- HN 分数／评论会变。采编时帖页约 4 points；Algolia 上该 story 的评论列表为空。低分不证明接口好坏
- 本站**未**注册、**未**调用 MCP／REST／Skill

## 来源与核验状态

**公开可核验**

- 主帖：[Show HN: Glade API – Amazon data for every build](https://news.ycombinator.com/item?id=49345107)（qwikhost，objectID `49345107`，2026-08-18）
- 辅证（不是 `sourceUrl`）：[gladeapi.com](https://gladeapi.com)
- 采编：2026-10-25（Asia/Shanghai）。与 [SoldScope](/cases/soldscope-mcp-live-amazon-data/)、[AMZScout](/cases/amzscout-mcp-niche-validation/)、[SellerForge](/cases/reddit-sellerforge-amazon-mcp/) 的差别见首节。Lab 未重跑工具。

## 据公开帖摘要

**HN：** 标题 “Show HN: Glade API – Amazon data for every build”，链接 `https://gladeapi.com`。正文一句：用可靠的 Amazon product、search、offer、review、seller、category、deal、estimate 数据来构建，接口是 REST、GraphQL 或 MCP。作者 qwikhost，时间 2026-08-18。

**站点（gladeapi.com，采编日仍显示）：** 覆盖 products、search、offers、reviews、sellers、categories、deals、estimates；声称 17 operations、13 marketplaces、100 free units。MCP 示例 URL 为 `https://gladeapi.com/api/mcp`，header 名 `API-KEY`。Skill 安装示例指向 `https://gladeapi.com/skills/amazon-data/SKILL.md`。FAQ 写明可查的还包括变体、GTIN 对照、库存与销量估算、autocomplete、作者、best sellers；并写 Amazon 是 Amazon.com, Inc. 的商标，Glade 是独立数据服务、不隶属 Amazon。一次成功的 REST、GraphQL 或 MCP 调用计 1 unit。分档表里 Hobby 为 100 units 且列出 REST API；Pro 20K 为 20,000 units，标价 $99/month，并列出 REST、GraphQL 与 MCP。

## English brief

Show HN (2026-08-18, qwikhost) points at Glade API for Amazon product, search, offer, review, seller, category, deal, and estimate data over REST, GraphQL, or MCP. The site claims 17 operations, 13 marketplaces, an MCP URL at `https://gladeapi.com/api/mcp`, an installable amazon-data Skill, and 100 free units on signup, and says it is not affiliated with Amazon. Treat it as third-party planning data, not Seller Central and not official Amazon statistics. Keep the API key in client config. Lab did not call the API. Sample prices on the homepage are examples, not measurements.
