---
title: "Reddit：AMZ Vault 一个 MCP 管 Amazon 日程席位，写操作先入人审队列"
titleEn: "Reddit: AMZ Vault — one Amazon MCP with scheduled seats; writes stage for human approval"
summary: "据 r/mcp 帖（作者披露自建付费产品，约 2 个月前发帖，id 1wapz9d）：把 Seller Central 与 Ads API 接到一个 MCP，按部门切出定时 agent「席位」；写操作不直达线上，先带理由进审批队列。帖文自称当时约 110 工具（75 只读、29 暂存写、6 写）。辅证 docs 页 og 描述写 146 tools：97 read-only、29 staged writes（数字会变）。端点 https://www.amz-vault.com/mcp 。本站 2026-11-03（Asia/Shanghai）匿名 initialize → HTTP 401，www-authenticate 为 Bearer／OAuth，resource_metadata 指向 /.well-known/oauth-protected-resource/mcp。未 OAuth、未 tools/list、未调用工具。"
summaryEn: "r/mcp post (paid-product disclosure, id 1wapz9d): one MCP over Seller Central and Ads API with scheduled department “seats”; mutating tools stage changes with reasoning for a human queue. The post claimed ~110 tools (75 read-only, 29 staged writes, 6 writes). Supporting docs og:description states 146 tools: 97 read-only, 29 staged writes (counts move). Endpoint https://www.amz-vault.com/mcp. Lab anonymous initialize on 2026-11-03 (Asia/Shanghai) returned HTTP 401 with Bearer/OAuth and resource_metadata /.well-known/oauth-protected-resource/mcp. No OAuth, no tools/list, no tool calls."
category: ops-finance
agents: ["Claude", "ChatGPT", "Claude Code", "Cursor"]
tools: ["AMZ Vault MCP", "https://www.amz-vault.com/mcp", "staged writes", "department seats"]
source: Reddit
sourceUrl: https://www.reddit.com/r/mcp/comments/1wapz9d/one_mcp_server_runs_my_amazon_business_on_a/
sourceType: public
date: 2026-11-03
dateNote: "Reddit r/mcp，id 1wapz9d，标题 One MCP server runs my Amazon business on a schedule. Every write stages for human approval before it reaches the live account. 作者披露为自建付费产品；页面显示约 2 months ago（相对 2026-11-03 采编日）。同日辅证 https://www.amz-vault.com/docs （og:description：146 tools: 97 read-only, 29 staged writes with human approval；正文给出 Claude 连接器与自定义连接器地址 https://www.amz-vault.com/mcp ）、https://www.amz-vault.com/demo （只读虚构品牌演示，帖文称不能把客户端指到演示上）。匿名 POST https://www.amz-vault.com/mcp initialize（无 Authorization）→ HTTP 401，正文 Unauthorized；www-authenticate 含 Bearer realm=\"OAuth\"、resource_metadata=\"https://www.amz-vault.com/.well-known/oauth-protected-resource/mcp\"、error=invalid_token。未打开 metadata、未 OAuth、未 tools/list、未调用读写工具。帖文里的 110／75／29／6 与 docs 的 146／97／29 不是同一组数，均作来源声称，不是本站 tools/list。"
featured: false
prompt: |
  You help an operator understand AMZ Vault MCP
  (https://www.amz-vault.com/mcp) after they finished OAuth in their own
  client. Reads may answer; writes only stage for a human queue.

  Goal: {{read P&L | ads audit | inventory gate | explain staging | other}}
  Department / seat the operator named: {{seat}}

  Rules:
  1) If initialize returns HTTP 401 or OAuth is missing, stop. Do not invent
     orders, fees, ACoS, inventory, or recoverable amounts.
  2) Quote numbers only as a tool in this session returned them. The Reddit
     first-week figures (~$1,100 ads, ~$900/mo fees) and any demo P&L are
     author claims or fictitious brand data — never this account.
  3) Tool counts disagree across sources (post ~110; docs og 146 / 97
     read-only / 29 staged). Do not treat either as a live tools/list.
  4) Mutating tools stage only. Do not apply bids, budgets, negatives,
     listings, or prices until a human names the queue item and says yes.
  5) Never paste Amazon, Ads, or AMZ Vault passwords, refresh tokens, or
     MCP bearer secrets into chat.
  Output: (a) tools called, (b) fields returned, (c) unknowns,
  (d) ACTIONS REQUIRING HUMAN APPROVAL (staged queue items).
---

## 解决什么问题

卖家每天要在广告、目录、库存、费用和账号健康之间来回切。r/mcp 帖 [1wapz9d](https://www.reddit.com/r/mcp/comments/1wapz9d/one_mcp_server_runs_my_amazon_business_on_a/) 的作者（披露：自建付费产品）把 Seller Central 与 Ads API 接到**一个** MCP，再按部门切成定时 agent「席位」。帖文强调三件事：工具太多会撑爆客户端上下文，所以席位只看见本部门切片；写操作一律先暂存、带理由进审批队列；库存状态可以拦住广告席位，避免对快断货 SKU 加投。

公开端点写在 docs：[https://www.amz-vault.com/mcp](https://www.amz-vault.com/mcp)。Claude 可用连接器目录里的 AMZ Vault，或自定义连接器粘贴同一地址；ChatGPT 文档写需开发者模式与付费档自定义连接器。演示页 [https://www.amz-vault.com/demo](https://www.amz-vault.com/demo) 是虚构品牌只读演示，帖文明确说不能把 MCP 客户端指到演示上。

与站内相近篇错位：

- [SellerForge MCP](/cases/reddit-sellerforge-amazon-mcp/)：另一条 Reddit 帖（1wni6ho），强调只读、不改 Seller Central／Ads。AMZ Vault 帖明确有暂存写与写动作。
- [DataDoe Amazon MCP](/cases/datadoe-amazon-seller-vendor-ads-mcp/)：托管 Seller／Vendor／Ads 一端点，写操作默认关。AMZ Vault 的公开叙事中心是席位切片 + 人审队列。
- [亚马逊广告官方 MCP](/cases/amazon-ads-mcp-server-open-beta/)：只覆盖 Ads API。本帖把卖家侧与广告放在同一 MCP 叙事里。
- [OpenTabs](/cases/reddit-opentabs-amazon-seller-browser-mcp/)：本机浏览器会话桥。AMZ Vault 是对方托管 OAuth MCP。

## 人审闸门（必须人工确认）

1. **写操作只进队列** — 帖文：出价、预算、否词、Listing、价格等变动先暂存，人批准后才上线。队列里的预览不是已经改站。
2. **库存闸门优先于广告席位** — 帖文：库存状态可在平台层挡住广告席位的提案。不要在对话里绕过这个闸去“先加预算”。
3. **帖内经营数字不是本账号** — 作者写首周抓到断货 ASIN 仍在投的广告、约 $1,100 无效花费、约 $900／月可追回费用。那是作者自述，不是 Lab 计量，也不是你的账号。
4. **工具数量两套口径** — 帖文约 110（75／29／6）；docs og 写 146（97 只读／29 暂存写）。都当作来源声称。本站没有 `tools/list`。
5. **OAuth 只在对方同意页完成** — 不索要 Seller Central、Ads 或 AMZ Vault 密码／刷新令牌／MCP Bearer。
6. **演示数据勿当真** — `/demo` 是虚构品牌。不要把演示 P&L 抄进真实复盘。

## 可复现步骤

前置（据 [该帖](https://www.reddit.com/r/mcp/comments/1wapz9d/one_mcp_server_runs_my_amazon_business_on_a/) 与 [docs](https://www.amz-vault.com/docs)）：

1. 支持远程 MCP 的客户端（docs 点名 Claude、ChatGPT 付费档自定义连接器等）
2. 真实 Amazon 账号走 OAuth（帖文：没有可外发的活 MCP 给外人戳）
3. AMZ Vault 账号／席位权限由账号所有人配置

跟做（公开材料 + 本站匿名探活；**未** OAuth）：

1. 读 Reddit 帖与 docs，分清「席位切片」「暂存写」「演示页不可连」
2. 在客户端加入 `https://www.amz-vault.com/mcp`，浏览器完成 AMZ Vault 登录授权
3. 本站匿名 `initialize` → HTTP 401 Unauthorized；有 Bearer／OAuth 挑战与 `resource_metadata`
4. 人完成 OAuth 后先问只读（P&L、库存、广告表现）。任何暂存写的队列项交给人点批准／拒绝
5. 不要对 `/demo` 配置 MCP URL

## 预期结果与失败限制

**预期（来源表述，不是本站实测）：**

- 定时席位按部门看到工具切片，而不是一次加载全部 schema
- 写工具产生可审计的暂存项；人拒绝则线上不变
- docs 称工具清单从运行中的服务器生成，避免和线上漂移

**失败与边界：**

- 匿名 initialize：**HTTP 401**
- 帖文工具数与 docs og 不一致；以你连接后客户端实际列出的工具为准
- 无公开匿名可调用的卖家数据端点；演示页不是 MCP 面
- 帖文经济账（Max 五小时窗口占比等）是作者自述，本站未复核

## 来源与核验状态

**公开可核验**

- 主链：[r/mcp 1wapz9d](https://www.reddit.com/r/mcp/comments/1wapz9d/one_mcp_server_runs_my_amazon_business_on_a/)
- 辅链：[docs](https://www.amz-vault.com/docs)、[demo](https://www.amz-vault.com/demo)、端点 `https://www.amz-vault.com/mcp`
- 探针：2026-11-03（Asia/Shanghai）匿名 initialize → 401。未 OAuth、未调用工具。

## English brief

AMZ Vault’s public MCP is `https://www.amz-vault.com/mcp`. A r/mcp post (1wapz9d) describes scheduled department seats over Seller Central and Ads API, with every mutating tool staging into a human approval queue. The post’s tool counts (~110) disagree with the docs og:description (146 / 97 read-only / 29 staged). Lab anonymous initialize on 2026-11-03 (Asia/Shanghai) returned HTTP 401 with an OAuth Bearer challenge. No OAuth and no tool calls. Distinct from SellerForge’s read-only Reddit case and from DataDoe’s default-off write Actions.
