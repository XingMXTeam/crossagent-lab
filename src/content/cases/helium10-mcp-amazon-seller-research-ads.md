---
title: "Helium 10 官方 MCP：在 Claude／ChatGPT／Cursor 里查 Research、Ads 与 Profits（Diamond，匿名握手 401）"
titleEn: "Helium 10 official MCP — Research, Ads, and Profits in Claude, ChatGPT, and Cursor (Diamond; anonymous handshake is 401)"
summary: "据 Helium 10 博客（Raeanna Murray，发布 2026-07-16，修改 2026-09-02）、知识库（页内 2026-10-15）、Claude 连接器页与 GitHub README：托管端点 https://mcp.helium10.com/mcp 把账号里的选品／关键词、广告和利润数据接到 AI 客户端，Diamond（知识库写 Diamond 及以上）不含额外 MCP 月费。知识库写明 158 个工具、27 个类目、每月 1,000 次调用，并覆盖 Amazon、Walmart 与 TikTok Shop；广告规则工具被写成先草稿、须明确确认。落地页另写「40+ 工具」。本站 2026-11-02（Asia/Shanghai）匿名 initialize → HTTP 401、空正文。未登录、未 tools/list、未调用任何数据或写工具。"
summaryEn: "Helium 10’s blog (Raeanna Murray, published 2026-07-16, modified 2026-09-02), knowledge base (dated 2026-10-15 on the page), Claude connector, and GitHub README describe a hosted MCP at https://mcp.helium10.com/mcp for account research, ads, and profits inside AI clients. Diamond (Diamond and above in the KB) includes it with no extra MCP fee. The KB states 158 tools, 27 categories, and 1,000 calls a month, covering Amazon, Walmart, and TikTok Shop, and says the ads-rules tool is draft-first until you confirm. The landing page says “40+ tools.” Lab anonymous initialize on 2026-11-02 (Asia/Shanghai) returned HTTP 401 with an empty body. No login, no tools/list, and no data or write calls."
category: sourcing
agents: ["Claude", "ChatGPT", "Cursor", "Claude Code", "Codex", "Muse"]
tools: ["Helium 10 MCP", "https://mcp.helium10.com/mcp", "get_keywords_by_asin", "analyze_keywords", "execute_ads_query", "get_account_profit_and_loss_summary", "manage_ads_rule"]
source: 官网
sourceUrl: https://www.helium10.com/blog/helium-10-mcp/
sourceType: public
date: 2026-11-02
dateNote: "2026-11-02（Asia/Shanghai）采编博客 https://www.helium10.com/blog/helium-10-mcp/ （Raeanna Murray，Associate Product Marketing Manager；Published July 16, 2026；Modified September 2, 2026）、知识库 https://kb.helium10.com/hc/en-us/articles/51580564409883-Getting-Started-with-Helium-10-MCP （页首 October 15, 2026 14:16）、Claude 市场 https://claude.com/marketplace/connectors/helium-10 （连接器 URL 为 https://mcp.helium10.com/mcp ，Requires an active Helium 10 Diamond plan）、落地页 https://www.helium10.com/tools/mcp/ 、GitHub https://github.com/helium10/Helium10-MCP （非空：README／README-CN、LICENSE、插件目录与 skills；README 端点同为 https://mcp.helium10.com/mcp ，最近可见提交日期 2026-10-27）。同日匿名 POST https://mcp.helium10.com/mcp initialize（无 Authorization）→ HTTP 401，content-length 0，正文空；www-authenticate 为 Bearer，resource_metadata=\"https://mcp.helium10.com/.well-known/oauth-protected-resource/mcp\"。未 GET 该 metadata，未 OAuth，未 tools/list，未调用工具，未粘贴凭证。"
featured: false
prompt: |
  You answer Amazon / Walmart / TikTok Shop questions only through the
  official Helium 10 MCP (https://mcp.helium10.com/mcp) after the
  operator has finished OAuth on a Diamond (or higher) account.
  Never ask for the password, OAuth token, or any API key in chat.

  Question: {{research | ads | profits | inventory | keyword_tracker}}
  ASIN, keyword, marketplace, or account the operator already named: {{input}}

  Rules:
  1) If initialize returns HTTP 401, or the client is not connected, stop.
     Do not invent search volume, ranks, ACoS, ROAS, margins, or fees.
  2) Quote a number only when a tool result in this session returned it.
     Label it with the tool name. The public pages disagree on catalog
     size (KB: 158 tools / 27 categories; landing: 40+; GitHub README
     tables name 32; the Claude marketplace page Lab read listed 34
     names). None of those is a tools/list from this session.
  3) Read tools only, unless the operator types APPROVE WRITE and names
     the exact action. Ads Rules (manage_ads_rule) are draft-first in
     the KB and still need that yes. Campaign actions, Keyword Tracker
     adds/deletes, COGS create/edit/delete, and sync_listing_to_amazon
     change the account; the KB marks the listing sync DESTRUCTIVE.
  4) Do not buy a call top-up, switch an Ads profile to Managed, or
     accept a fee. The KB states a $50 pack for 500 extra calls and a
     2% fee on ad spend when a profile is Managed. Those are billing
     decisions.
  5) One Helium 10 connection is one account in the KB. Do not assume a
     second marketplace login is included. TikTok finance figures can
     lag; if a response includes a data status, quote it.
  Output: (a) connection state, (b) tool names and fields actually
  returned, (c) unknowns, (d) ACTIONS REQUIRING HUMAN APPROVAL.
---

## Lab 探针成品（先看结果）

**方法：** 匿名 · 无 OAuth · 无 Bearer · 2026-11-02（Asia/Shanghai）  
**端点：** `POST https://mcp.helium10.com/mcp`（`initialize`）

| 探针 | 结果 |
|------|------|
| 匿名 `initialize` | **HTTP 401**。正文长度为 0（空）。`WWW-Authenticate` 为 Bearer，`resource_metadata` 指向 `https://mcp.helium10.com/.well-known/oauth-protected-resource/mcp` |

**本站未跑：** 打开 protected-resource 文档、完成 OAuth、`tools/list`、任何关键词／广告／利润／库存调用、任何写操作（广告、Keyword Tracker、COGS、刊登同步）。页面上的 158、40+、1,000 次、Diamond、2% 广告费都不是这次握手的返回值。

| 公开页声称 | 本站探针 | 差注 |
| --- | --- | --- |
| 博客、知识库、README、Claude 市场页都把连接放在 `https://mcp.helium10.com/mcp`，并要求登录／OAuth | 匿名 initialize → HTTP 401，空正文，Bearer + 上述 `resource_metadata` | 一致（端点在，未授权被拒） |
| 知识库：158 个工具、27 个类目 | 未 `tools/list` | 仅公开（本站未测） |
| 落地页：「40+ MCP tools」 | 未 `tools/list` | 口径不同（见注） |
| GitHub README 工具表写出 32 个名字；Claude 市场页正文里可抽出 34 个工具名 | 未 `tools/list` | 口径不同（见注） |
| Diamond 不含额外 MCP 费；知识库另写每月 1,000 次，加量包为 $50／500 次 | 未登录、未看账单 | 仅公开（本站未测） |
| 公开仓库「可能是空的」 | 2026-11-02 仓库根目录有 README、README-CN、LICENSE、插件目录和 `skills/` | 本站未见空仓库 |

> 人审提醒：401 只说明这个 MCP 要 OAuth。它不能当成已经查到关键词、广告或利润。闸门见下一节之后的人审清单。

## 解决什么问题

卖家要回答的问题经常跨三块屏幕：Helium 10 里的关键词和竞品、广告后台里的花费、Profits 里的成本和费用。博客的说法是，接上 MCP 之后，可以在已经打开的 Claude、ChatGPT 或 Cursor 里直接问账号数据，而不必先导出报表再贴进对话。

这是 **Helium 10 账号数据层**（Research、Ads、Profits，知识库还写了 Walmart 与 TikTok Shop）。它不是 Seller Central 官方插件，也不是亚马逊广告官方 MCP。类目放在选品与调研，因为公开材料的主路径仍是关键词、ASIN 和机会发现；广告诊断和利润拆解是同一条连接里的后半段，写操作另计。

与站内相近篇错位：

- [亚马逊卖家插件](/cases/amazon-selling-partner-claude-plugin/)：亚马逊一方，把刊登、表现、库存和销售分析接进 Claude／Amazon Quick，插件公测范围是美国站。Helium 10 读的是 Helium 10 账号有权看到的研究、广告和利润数据，不是那条 Seller Central 连接。
- [亚马逊广告官方 MCP](/cases/amazon-ads-mcp-server-open-beta/)：Ads API 开放测试，面向持有广告 API 凭证的合作伙伴，写操作仍要人审。Helium 10 的广告面是它自己的查询和战役管理工具，知识库还单列一条先草稿的 Ads Rules。
- [Keepa 官方 MCP](/cases/keepa-amazon-mcp/)：Keepa API 订阅下的价格史、Product Finder 和 Deal，调用消耗 Keepa token。不是 Helium 10 的 Cerebro／Magnet／Profits。
- [AMZScout Skill+MCP](/cases/amzscout-mcp-niche-validation/)：另一家托管选品 MCP。端点不是 `mcp.helium10.com`。
- [SoldScope MCP](/cases/soldscope-mcp-live-amazon-data/)：产品页上的关键词／ASIN MCP。数据源不是 Helium 10 账号。

## 人审闸门（必须人工确认）

1. **开通或维持 Diamond（知识库写 Diamond 及以上）、购买调用加量包、把广告资料设成 Managed** — 博客和落地页写 Diamond 不含额外 MCP 费。知识库另写：含在套餐里的是每月 1,000 次调用（翻页另计），加量包为 $50 换 500 次，按购买日在账期里剩余天数比例分配；广告资料设成 Managed 后，对全部广告花费收 2% 的费用，即便没有自动动作。这些是账单，不在对话里点头。
2. **把密码、OAuth token 或 key 贴进聊天或仓库** — 禁止。README 要求客户端只填 URL、不要加 `headers`，登录在浏览器里完成。
3. **Ads Rules（`manage_ads_rule`）** — 知识库原句：先草稿、approval-gated，明确确认之前不会上线。即便如此，仍要人在本对话里写出将要生效的规则再批准。
4. **广告战役动作（`execute_ads_campaign_mgmt_actions`）** — 知识库把它写成暂停、恢复、创建、调整出价的执行步骤，并建议先在小集合上试。这不是上面那句「approval-gated」。没有人的书面同意，不要调用。
5. **Keyword Tracker 的增删** — 知识库把添加／删除追踪关键词、删除整个商品、给关键词加竞品、打标签和写备注算进可做的写操作。先列出 ASIN、关键词和站点，等人说可以。
6. **COGS 与间接费用的创建、修改、删除** — 知识库写了 Amazon 与 Walmart 的成本配置工具，删除支持按 id 批量（最多 100）。改成本会改利润数字。先停。
7. **`sync_listing_to_amazon`** — 知识库标为 DESTRUCTIVE：把 Helium 10 里的标题、五点、描述和 A+ 推到亚马逊卖家账号。README 里的 listing-builder skill 也把发布写成必须单独授权的破坏性步骤。没有「可以同步到亚马逊」这句话，不要做。
8. **用落地页营销句当本店结论** — 「大约 25 秒」「月销超过 $1M 且评论少于 50」是落地页上的说法，不是这次查询的结果。知识库示例里的「月销 500、评论少于 200」「ACoS 超过 50%」同样只是问法示例。

## 可复现步骤

前置（公开页；本站只做了匿名 initialize）：

1. Helium 10 账号在 Diamond。博客与 Claude 市场页写 Diamond；知识库写 Diamond plan or higher，并写 MCP 对 Diamond 及以上成员免费。低于该档的账号，市场页写明不支持。
2. 端点 `https://mcp.helium10.com/mcp`。README 称为 streamable HTTP，认证写成 OAuth 2.1（Authorization Code + PKCE，以及 Dynamic Client Registration）。知识库写成 OAuth 2.0，并写 AI 看不到你的凭证。两页用词不同，本站没有对照令牌请求。
3. 客户端支持范围，三份材料并不相同，跟做时以你实际要打开的那一页为准：
   - 博客：Claude.ai、Claude Code、Cursor、ChatGPT
   - 知识库：已测试并受支持的是 Claude（Web 与 Desktop）、ChatGPT、Codex；并写明 Copilot、Gemini、Grok 等不在支持范围，不要为此找客服
   - README：Cursor、Claude Code、Claude Desktop、ChatGPT、Codex、Muse，以及任何能完成上述 OAuth 的客户端（文中点名 VS Code Copilot、Windsurf、Cline）
4. Claude 市场连接器：在 Claude 的 Connectors 里搜索 Helium 10（知识库路径：Claude Web → Customize → Connectors → Browse）。市场页上的 Connector URL 是 `https://mcp.helium10.com/mcp`。README 也写了自定义连接器可以手填同一 URL。
5. 子账号：知识库写主账号须在 Access Management 里勾选 MCP，子账号用同一个邮箱完成 OAuth，并选择被授权的主账号。

跟做（公开材料 + 本站匿名探活；**未** OAuth、**未**查询）：

1. 打开博客与知识库，确认套餐仍然是 Diamond 及以上，再决定要不要连接。
2. 在客户端加入 `https://mcp.helium10.com/mcp`，不要在配置里写 token。浏览器登录并授权。
3. 本站匿名 `initialize` 停在 HTTP 401、空正文。401 不是关键词结果，也不是利润表。
4. 人完成 OAuth 之后，先问只读问题：某个 ASIN 的关键词、账号或单品 P&L、广告查询五步里的只读步骤。只引用该次工具返回的字段。
5. 写操作停在人审清单。广告查询的终端步骤是 `execute_ads_query`（读表现）。战役管理的终端步骤是另一个工具，不要把它当成同一次只读查询。

本站没有执行任何一条带登录的命令。

## 预期结果与失败限制

**预期（文档表述，不是本站实测）：**

- 一次 OAuth 之后，在客户端里问 Helium 10 账号已经有的研究、广告和利润数据
- 知识库的能力句子覆盖：关键词研究、选品、排名追踪（含 Walmart US）、刊登分析与生成、Amazon／Walmart／TikTok Shop 的 P&L、库存与动销、流量、品牌分析、广告查询与战役管理、账号健康、评论、Buy Box、FBA 尺寸档、成本配置、Keyword Tracker、My List、网红、Follow-Up 邮件表现、Market Tracker 360（需加购）
- README 的工具表更窄，按职能分成 Keyword Research、Product Research、Brand Analytics、Keyword Tracking、Listings、Profits、Inventory、Ads Query，并写明账号权限决定代理能看见哪些工具；schema 在运行时发现，仓库里没有一份要保持同步的静态总表
- 广告只读的固定顺序（README 与知识库一致）：`get_ads_query_platforms` → `get_ads_query_list` → `get_ads_query_schema` → `get_ads_query_materials` → `execute_ads_query`
- 知识库：简单问题大约 1–2 次调用，完整报告大约 5–10 次；响应时间大约 2–5 秒（简单）或 5–15 秒（复杂）。这是文档区间，不是本站计时

**失败与边界：**

- 无凭证的 initialize 在本站为 **HTTP 401、空正文**。没有工具结果就停
- 工具数量三套口径：知识库 158／27 类目；落地页「40+」；README 表 32 个名字；Claude 市场页在 2026-11-02 的正文里可抽出 34 个名字（README 的 32 个，外加 `get_search_query_performance` 与 `get_brand_seller_profiles`）。`get_competitor_overview` 在 README 和市场页上，不在知识库那份 158 的类目表里。落地页卡片上的 `manage_ads_campaigns` 和 `get_account_profit` 与知识库／README 的函数名不是同一串字符；知识库里战役管理的终端工具是 `execute_ads_campaign_mgmt_actions`，账号利润是 `get_account_profit_and_loss_*`。本站没有 `tools/list`，不能把任何一列当成线上清单
- 站点口径也不同。知识库的表是 Amazon 的 US、UK、DE、JP、CA、AU、FR、ES、IT、NL、PL、SE、MX，以及 Walmart 与 TikTok Shop 的 US。落地页写 24 个市场。不要把 24 抄成知识库已经逐国列出的名单
- 多账号：落地页写一条连接可以拉多个亚马逊账号；知识库写每次连接对应一个账号，不能同时查多个账号。跟做时以连接后实际出现的卖家账号为准
- 知识库写不能直接写 Seller Central、Walmart Seller Center 或 TikTok Shop（多数写入发生在 Helium 10 或平台界面），同时又列出战役动作和标成 DESTRUCTIVE 的刊登同步。两句都在同一页。不要把「不能直接写后台」理解成写工具不存在
- TikTok Shop 利润用 TACoS 而不是 ACoS；知识库写财务数据可能滞后 7 天到 2 个月，响应里带数据状态（Actual／Partially Estimated／Estimated）
- 知识库注：2026-10-13 起，Profits 的账号级 Sessions 改用亚马逊店铺级数字，不再把 SKU 相加，账号级 Sessions 可能变高
- 广告若返回 `FEATURE.ADS_ACCESS_DISABLED`，知识库的解释是广告资料不在 Managed 模式。切到 Managed 会触发上面的 2% 费用，先停下来问人
- README 的许可证是 Helium 10 Proprietary License：可安装使用，禁止修改、衍生和再分发。这不是一份可复制的服务端实现

## 来源与核验状态

**公开可核验**

- 主链：[Introducing the Helium 10 MCP](https://www.helium10.com/blog/helium-10-mcp/)
- 辅链：[Getting Started with Helium 10 MCP](https://kb.helium10.com/hc/en-us/articles/51580564409883-Getting-Started-with-Helium-10-MCP)、[Claude 连接器](https://claude.com/marketplace/connectors/helium-10)、[落地页](https://www.helium10.com/tools/mcp/)、[GitHub helium10/Helium10-MCP](https://github.com/helium10/Helium10-MCP)
- 探针表见文首。采编日 2026-11-02（Asia/Shanghai）。未 OAuth、未 `tools/list`、未调用数据工具或写工具。

## 据公开帖摘要

博客（Raeanna Murray，发布 July 16, 2026，修改 September 2, 2026）宣布 Helium 10 MCP：在 Claude、ChatGPT、Cursor 等工具里查询 Research、Ads 和 Profits，用 OAuth 连一次账号。它写的能力是反向 ASIN、关键词缺口、排名追踪、刊登打分、广告活动数据、ROAS 下降的原因分析，以及在工具里对广告做动作；还可以问产品或账号级的 P&L、利润率、COGS 和费用。文末写 Diamond 用户现已可用，没有额外 MCP 费用。

知识库（页首 October 15, 2026）把范围写成 Amazon、Walmart 和 TikTok Shop，158 个工具、27 个功能类目，Diamond+ 含每月 1,000 次 API 调用。写操作包括广告战役管理、Keyword Tracker、My List、网红文件夹、COGS，以及先草稿的 Ads Rules。Claude 市场页要求有效的 Diamond 计划，并列出连接器上的一部分工具名（本站从该页抽出 34 个，见上表）。落地页重复「Diamond、无额外费用」，并给出 40+ 工具、24 个市场、9 年关键词趋势、4.5M+ 商家和每月 $7B+ 亚马逊销售额等营销数字；这些数字只属于落地页，本站没有复核。

GitHub 仓库不是空的。README 描述同一个托管端点、浏览器 OAuth，以及一份比知识库短的工具表，并附带 `helium10-listing-builder` skill：编排刊登工具，破坏性同步前要人确认。

## English brief

Helium 10’s hosted MCP is `https://mcp.helium10.com/mcp`. The July 16, 2026 blog (modified September 2) says Diamond accounts can query Research, Ads, and Profits from Claude, ChatGPT, and Cursor with no extra MCP fee. The October 15 knowledge base states 158 tools in 27 categories, 1,000 calls a month on Diamond and above, Amazon plus Walmart and TikTok Shop (US for the latter two), and names write tools for ads, Keyword Tracker, and COGS. Only Ads Rules are described there as draft-first and approval-gated; `sync_listing_to_amazon` is marked destructive. The landing page says “40+ tools,” and the GitHub README (not an empty repo) tables 32 tool names and says schemas are discovered at runtime. The Claude marketplace page requires Diamond and, on 2026-11-02, exposed 34 tool-name strings. Those counts are source statements, not a Lab `tools/list`. Anonymous initialize the same day returned HTTP 401 with an empty body and a Bearer challenge. No OAuth and no tool calls. This is Helium 10 account data, not the Amazon Selling Partner plugin, Amazon Ads official MCP, Keepa, AMZScout, or SoldScope. A human approves plan spend, the Managed-ads fee, and every write.
