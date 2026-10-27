---
title: "Reddit：OpenTabs 浏览器会话 MCP（卖家后台是评论用法）"
titleEn: "Reddit: OpenTabs browser-session MCP (Seller Central is the cited use)"
summary: "据 r/amazon_selling_ai 帖（u/ferrants，id 1srtpms，2026-04-21）下 u/opentabs-dev 的评论，以及 opentabs.dev／GitHub README：OpenTabs 是开源（MIT）Chrome 扩展加本机 MCP，把已登录浏览器会话里的网站内部 API 暴露给 Claude Code、Cursor 等客户端。评论把 Seller Central、Vendor Central、Amazon Ads 写成用法：不走 OAuth／LWA／SP-API 审批，适合拉报表、按 ASIN 看库存。产品本身是多应用（README 写 100+ plugins、约 2,000 tools）。2026-10-27 仓库 plugins/ 有 ebay，没有 seller-central 目录。本站未安装扩展，未登录卖家后台，未调用工具。"
summaryEn: "r/amazon_selling_ai post by u/ferrants (id 1srtpms, 2026-04-21) and a comment by u/opentabs-dev, plus opentabs.dev and the GitHub README: OpenTabs is an MIT-licensed Chrome extension plus a local MCP that exposes internal APIs of sites you are already logged into, to Claude Code, Cursor, and other clients. The comment names Seller Central, Vendor Central, and Amazon Ads as uses — no OAuth/LWA/SP-API approval — for pulling a report or checking inventory across ASINs. The product is multi-app (README: 100+ plugins, about 2,000 tools). On 2026-10-27 the repo plugins/ tree included ebay and no seller-central directory. Lab did not install the extension, log into Seller Central, or call tools."
category: ops-finance
agents: ["Claude Code", "Cursor", "Windsurf", "OpenCode"]
tools: ["OpenTabs", "http://127.0.0.1:9515/mcp", "@opentabs-dev/cli", "Chrome extension"]
source: Reddit
sourceUrl: https://www.reddit.com/r/amazon_selling_ai/comments/1srtpms/what_ai_tools_are_you_using_how_are_you_using/
sourceType: public
date: 2026-10-27
dateNote: "Reddit r/amazon_selling_ai，主帖 u/ferrants，id 1srtpms，标题 What AI tools are you using? How are you using them with Amazon?，2026-04-21 16:59 UTC。评论 u/opentabs-dev，2026-04-21 17:12 UTC，链到 https://github.com/opentabs-dev/opentabs 。2026-10-27（Asia/Shanghai）采编。同日直接请求 reddit.com 与 old.reddit.com 的该帖 JSON 得到 HTTP 403 拦截页，评论要点核对自同一 URL 的公开检索摘录，不把摘录当成逐字存档。辅证 https://opentabs.dev 、https://github.com/opentabs-dev/opentabs （README、plugins 目录 API）、https://opentabs.dev/docs/guides/plugin-development 、https://opentabs.dev/docs/reference/mcp-server 、https://opentabs.dev/docs/reference/telemetry 。本站未安装 CLI 或扩展，未调用 Seller Central。"
featured: false
prompt: |
  You help an operator understand OpenTabs (https://opentabs.dev, local MCP
  at http://127.0.0.1:9515/mcp) as a general browser-session bridge.
  Amazon Seller Central, Vendor Central, and Amazon Ads are relevant only
  when the operator already has those sites open and logged in, and only
  for the read they named.

  Goal: {{pull a report | check inventory | explain setup | other}}
  Site the operator named: {{Seller Central | Vendor Central | Amazon Ads | other}}

  Rules:
  1) OpenTabs is not an Amazon-hosted MCP and not DataDoe. Do not describe
     a prebuilt seller-central plugin as shipped. On 2026-10-27 the public
     plugins/ tree had an ebay directory and no seller-central directory.
  2) Do not install plugins, set a tool to Auto, or change Seller Central,
     Vendor Central, or Ads (price, listing, bid, budget, campaign, POA).
     Permission default in the README is off. Anything that clicks, types,
     or calls a write API waits for ACTIONS REQUIRING HUMAN APPROVAL.
  3) Never set OPENTABS_DANGEROUSLY_SKIP_PERMISSIONS. Never paste the local
     Bearer secret from `opentabs config show`, Chrome cookies, or Amazon
     passwords into chat.
  4) If the local server is not running, say so. Do not invent orders,
     inventory, fees, or ad metrics. The Reddit comment's examples are the
     author's suggested workflows, not a Lab measurement.
  5) "No Amazon OAuth/LWA" in that comment is about skipping SP-API app
     approval. The MCP docs still use a local Bearer secret. Do not conflate
     the two.
  Output: (a) what is actually connected, (b) fields a tool returned,
  (c) unknowns, (d) ACTIONS REQUIRING HUMAN APPROVAL.
---

## 解决什么问题

卖家想让 Claude Code 看自己已经登录的 Seller Central、Vendor Central 或 Amazon Ads，又不想先走 SP-API 的开发者审批和 LWA。u/opentabs-dev 在 r/amazon_selling_ai 的回复里把 [OpenTabs](https://github.com/opentabs-dev/opentabs) 说成一条旁路：开源 MCP，Chrome 扩展把 Claude Code 的工具调用送到你在 Chrome 里已经登录的页面（评论点名 seller central、vendor central、amazon ads），因此没有 OAuth／LWA 这套安装。评论里的例子是「拉一份报表」和「按 ASIN 看库存」，并写它跟 Claude Code（终端）配对。

主帖是 u/ferrants 在问大家用 Claude、ChatGPT 还是别的工具拉亚马逊数据、用不用官方 Amazon Ads MCP。OpenTabs 这条是**评论里的一种用法**。产品页和 README 描述的是通用浏览器会话桥：Slack、Discord、GitHub、Jira 以及 README 所称的 100+ plugins。亚马逊卖家场景不能写成这款产品的全部。

与站内相近篇错位：

- [DataDoe Amazon MCP](/cases/datadoe-amazon-seller-vendor-ads-mcp/)：托管端点 `https://mcp.datadoe.com/mcp/v1`，Amazon OAuth，Seller／Vendor／Ads 在对方的数据层里。OpenTabs 不托管你的亚马逊数据，调用发生在你本机浏览器已有的会话上。
- [亚马逊卖家插件](/cases/amazon-selling-partner-claude-plugin/) 与 [Agentic Toolkit](/cases/amzn-selling-partner-agentic-toolkit/)：亚马逊一方的 Seller Central 连接，写操作走官方审批。评论本身也把官方 Ads MCP 和 SP-API 审批写成另一条路。
- [亚马逊广告官方 MCP](/cases/amazon-ads-mcp-server-open-beta/)：Ads API 的官方服务器。评论写：只要广告、且账号支持 Advertising API 时，官方 Ads MCP 就够；它不覆盖卖家侧。
- [SellerForge MCP](/cases/reddit-sellerforge-amazon-mcp/)：读 SellerForge 账号里已经存好的记录，产品页称不能改 Seller Central。OpenTabs 用的是浏览器里的真实站点会话，权限由本机插件开关决定。
- [亚马逊官方 Local MCP](/cases/amzn-sp-api-local-mcp/)：给开发者在本机写 SP-API 调用。OpenTabs 不是那份官方 npm 包。

## 人审闸门（必须人工确认）

1. **默认关闭，人再打开** — README：没有工具会执行，直到你明确启用。三档是 Off、Ask（确认框）、Auto，可按插件或按工具。文档另有 `OPENTABS_DANGEROUSLY_SKIP_PERMISSIONS=1`。本案例禁止打开这个开关。
2. **启用前看源码** — README：启用时可以由 AI 先审插件源码，版本更新后权限重置。Seller Central 上的自建插件在启用前由人读完 adapter。
3. **写操作停下来** — 改价、改 Listing、改库存、确认发货、改广告出价或预算、发站内信，都不在「拉报表／看库存」里。内置浏览器工具可以点击和打字（README 的 Built-in browser tools）。出现点击、输入或写 API，先人批。
4. **本地 Bearer 不是亚马逊令牌** — MCP 文档的 Claude Code／Cursor 示例带 `Authorization: Bearer <secret>`，secret 来自本机 `opentabs config show --json --show-secret`。这是本机桥的密钥。评论里的「没有 OAuth／LWA」指的是不去办亚马逊应用审批。两套凭证都不要贴进聊天。
5. **不要把 Chrome 里的卖家会话交给不认识的插件** — 扩展把调用送进已登录标签页。仓库插件在启用前视为不可信，即使作者写了 Everything starts off。
6. **遥测开关由人决定** — 首页 Safe by default 写 “No telemetry.”。README 写 Anonymous telemetry（opt-out）。[遥测文档](https://opentabs.dev/docs/reference/telemetry)写默认开启、可用一条命令退出，并称不收集插件名和工具调用内容、会收集启动次数、插件数量、会话工具调用总数等匿名计数。三处用词不同。是否退出以你本机配置为准。
7. **这不是付费亚马逊连接器的替代合同** — 评论是作者对自己的开源项目的说明（披露：评论者即仓库维护者）。线程里还有别人推荐的其他产品，本页不收录。

## 可复现步骤

前置（据 [该帖](https://www.reddit.com/r/amazon_selling_ai/comments/1srtpms/what_ai_tools_are_you_using_how_are_you_using/)、[README](https://github.com/opentabs-dev/opentabs/blob/main/README.md)、[MCP 文档](https://opentabs.dev/docs/reference/mcp-server)。本站未安装、未调用）：

1. Node.js 22+ 与 Chrome（README）
2. 你自己的 Chrome 里已经登录要看的站点。没有登录会话，扩展无页可打
3. 支持本机 Streamable HTTP 的客户端，或按文档改用 CLI mode／stdio

跟做（公开文档；命令原文如下，本站一条都没跑）：

1. 读评论里的仓库，再读 README，确认你要的是通用会话桥，而不是一个名叫 Seller Central 的官方连接器。
2. 安装并启动：

   ```text
   npm install -g @opentabs-dev/cli
   opentabs start
   ```

   在 `chrome://extensions/` 打开 Developer mode，Load unpacked，目录为 `~/.opentabs/extension`。
3. 本机 MCP 默认 `http://127.0.0.1:9515/mcp`（文档：端口 9515；扩展走 `/ws`）。Claude Code 文档示例：

   ```text
   claude mcp add --transport http opentabs http://127.0.0.1:9515/mcp \
     --header "Authorization: Bearer <secret>"
   ```

   Cursor 写在 `.cursor/mcp.json`，`type` 为 `http`，URL 相同，header 同样是本地 Bearer。`<secret>` 用 `opentabs config show` 在本机查看，不要外发。文档页脚写 Last Updated: 24 Apr, 2026；端口以你装到的版本文档为准。
4. 上下文太大时，文档给出 Gateway `http://127.0.0.1:9515/mcp/gateway`（两个元工具：`opentabs_list_tools`、`opentabs_call`），或 CLI mode：`opentabs tool list` / `opentabs tool call`，或 `opentabs start --stdio`。
5. 已发布插件用 `opentabs plugin install <plugin-name>`。2026-10-27 对 `plugins/` 的 contents API 返回 **120** 个插件目录，其中有 `ebay`，**没有** `seller-central`、`amazon` 或 `vendor` 目录。README 的「100+ plugins、约 2,000 tools」是仓库自述；本站没有逐个点开工具计数。
6. 卖家后台若没有现成插件，文档的脚手架是通用的：

   ```text
   npx @opentabs-dev/create-plugin seller-central --domain .amazon.com --display "Seller Central"
   ```

   `seller-central` 这个名字是按文档旗标自定的示例（`--domain .example.com` 才会匹配子域，文档以 `.slack.com` 匹配 `app.slack.com` 为例）。它不是仓库里已有的目录。本站未执行脚手架，也未对 `.amazon.com` 做插件。
7. 只把要读的工具从 Off 改成 Ask。Auto 与任何写操作另等人批。审计在本机 `http://127.0.0.1:9515/audit`（文档）。

## 预期结果与失败限制

**预期（评论 + 文档声称，不是本站实测）：**

- 本机进程把 MCP 客户端和 Chrome 扩展接在一起。文档写：无云端中继、无账号；工具调用经 WebSocket 送到扩展，扩展在匹配的标签页里用 `chrome.scripting.executeScript`（MAIN world）执行
- 你已登录的页面上，插件走的是该站前端用的内部 API（README：no screenshots, no DOM scraping 指这条 API 路径）。同一 README 另有不依赖插件的浏览器工具：截图、点击、输入、网络捕获
- 评论声称：Seller Central／Vendor Central／Amazon Ads 可以不办 SP-API 就做「拉报表」「跨 ASIN 看库存」这类只读

**失败与边界：**

- 本站**未**安装 CLI、**未**加载扩展、**未**打开 Seller Central，因此没有订单、库存或广告数字
- 仓库里没有现成的 Seller Central 插件目录。评论没有贴工具名清单。不能把 `ebay` 插件写成亚马逊卖家工具
- 站点 FAQ：内部 API 会变；每个站点要自己的插件。浏览器自动化（点击路径）和 API 插件是两条路
- 2026-10-27 打开 reddit.com 得到 HTTP 403 拦截页。评论日期和要点来自同一 URL 的公开检索摘录，分数／评论数会变（检索摘录约 1 point、约 4 comments）
- 首页「No telemetry」和遥测文档「默认开启」不一致，见人审闸门
- GitHub API 采编日：license MIT，stars 997（会变），`pushed_at` 2026-10-24T04:46:24Z，创建于 2026-02-09

## 来源与核验状态

**公开可核验**

- 主帖：[r/amazon_selling_ai — What AI tools are you using?](https://www.reddit.com/r/amazon_selling_ai/comments/1srtpms/what_ai_tools_are_you_using_how_are_you_using/)（u/ferrants，id `1srtpms`，2026-04-21）
- 评论作者 u/opentabs-dev，同日，链到 GitHub。2026-10-27 本站请求该帖 JSON 被拦截，未保存 HTML 原文
- 仓库：[opentabs-dev/opentabs](https://github.com/opentabs-dev/opentabs)（MIT）
- 站点：[opentabs.dev](https://opentabs.dev)
- 插件开发：[Plugin Development](https://opentabs.dev/docs/guides/plugin-development)
- MCP：[MCP Server](https://opentabs.dev/docs/reference/mcp-server)
- 遥测：[Telemetry](https://opentabs.dev/docs/reference/telemetry)
- 采编：2026-10-27（Asia/Shanghai）。与 DataDoe、亚马逊一方插件、Ads 官方 MCP、SellerForge、SP-API Local MCP 的差别见首节。Lab 未调用任何卖家工具。

## 据公开帖摘要

**Reddit（r/amazon_selling_ai，2026-04-21）：** 主帖问读者用哪些 AI 拉亚马逊数据、用不用官方 Amazon Ads MCP。u/opentabs-dev 回复大意：官方 Ads MCP 适合只做广告且账号支持 Advertising API 的人；Seller Central 一侧（listings、orders、inventory、reports、ppc reports、brand analytics）很多人卡在 SP-API 审批，Ads MCP 也不覆盖卖家侧。作者称自己做了开源 MCP OpenTabs，用 Chrome 扩展把 Claude Code 的工具调用送到已经登录的 Seller Central、Vendor Central、Amazon Ads，因此没有 OAuth／LWA，适合拉报表或按 ASIN 看库存，并给出 GitHub 链接。

**README 与站点（2026-10-27）：** 安装是 `npm install -g @opentabs-dev/cli` 然后 `opentabs start`，扩展从 `~/.opentabs/extension` 加载。口号是 AI 经浏览器会话调用网站自己的 API。安全模型：默认关闭、Ask／Auto、本机审计日志。首页点名 Claude Code、Cursor、Windsurf、OpenCode，以及任何支持 Streamable HTTP 的 MCP 客户端。

**仓库目录（contents API，2026-10-27）：** `plugins/` 下 120 个插件目录，含 `ebay`，不含 seller-central。脚手架文档的必填旗标是插件名和 `--domain`。

## English brief

On 2026-04-21, u/opentabs-dev told r/amazon_selling_ai that OpenTabs, an open-source MCP Chrome extension, routes Claude Code tool calls through a browser already logged into Seller Central, Vendor Central, or Amazon Ads, without an OAuth/LWA or SP-API approval step, for workflows such as pulling a report or checking inventory across ASINs. The product at opentabs.dev is a general local bridge: README claims 100+ plugins and about 2,000 tools, default-off permissions (Off / Ask / Auto), and a local server. Docs put Streamable HTTP at `http://127.0.0.1:9515/mcp` with a local Bearer secret. That secret is not an Amazon token. A 2026-10-27 listing of `plugins/` showed 120 directories, including `ebay` and no `seller-central`. A seller-central plugin would be something the operator scaffolds (`npx @opentabs-dev/create-plugin … --domain .amazon.com`); Lab did not run that command. The homepage says “No telemetry” while the telemetry doc says collection is on by default and can be opted out. Lab did not install the extension or call Seller Central. This is not DataDoe’s hosted Amazon MCP and not Amazon’s first-party Selling Partner plugin. A human enables each tool and approves any click, type, or write.
