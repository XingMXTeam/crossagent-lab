---
title: "HN：Yedric 给 SaaS 加自然语言（Shopify 应用出身；托管 MCP 匿名 401）"
titleEn: "HN: Yedric — natural language inside a SaaS app (built for Shopify apps; hosted MCP anonymous 401)"
summary: "据 Show HN（aaroneous，item 49924752，created_at 2026-10-01T17:44:00Z）与 yedric.ai：Yedric 用一小段 JS 和 MCP，把自然语言动作嵌进已有 SaaS；作者说最初为自己的 Shopify 应用而做，免费、自带 LLM key，基本接入大约 30 分钟。产品页列出 MESA、Infinite Options、Smile、Tracktor、Uploadery 等应用名，并写 JWT、API key、签名会话和 Shopify session。GitBook 另公布开发者用的托管 MCP https://app.yedric.ai/mcp 。本站 2026-11-02（Asia/Shanghai）对该 URL 做匿名 initialize → HTTP 401，正文为 invalid_token、Missing Authorization header。未完成 OAuth，未调用工具。"
summaryEn: "Show HN (aaroneous, item 49924752, created_at 2026-10-01T17:44:00Z) and yedric.ai: Yedric embeds a natural-language action layer in an existing SaaS with a small JS SDK and MCP. The author says it was built first for their Shopify apps, is free, uses your own LLM key, and a basic setup takes about 30 minutes. The product page names MESA, Infinite Options, Smile, Tracktor, and Uploadery, and mentions JWT, API key, signed session, and Shopify session auth. GitBook publishes a developer MCP at https://app.yedric.ai/mcp. Lab anonymous initialize on 2026-11-02 (Asia/Shanghai) returned HTTP 401 invalid_token, Missing Authorization header. No OAuth and no tool calls."
category: ops-finance
agents: ["Yedric", "Claude", "Claude Code", "Cursor", "ChatGPT"]
tools: ["https://app.yedric.ai/mcp", "Yedric widget", "list_assistants", "get_conversation", "update_assistant_prompt", "AskUserQuestion"]
source: Hacker News
sourceUrl: https://news.ycombinator.com/item?id=49924752
sourceType: public
date: 2026-11-02
dateNote: "HN Show HN 标题 Show HN: Add a natural-language interface to your SaaS w/ Yedric，作者 aaroneous，objectID 49924752，created_at 2026-10-01T17:44:00Z（HN time 1790876640），url https://www.yedric.ai 。2026-11-02（Asia/Shanghai）抓取时 score 4、descendants 0（分数会变）。同日读产品页 https://www.yedric.ai （页面 JS 指向文档 https://shoppad.gitbook.io/yedric/ ）与 MCP 文档 https://shoppad.gitbook.io/yedric/developers/mcp-server.md （托管 URL https://app.yedric.ai/mcp ，OAuth）。匿名 POST 该 URL 的 initialize → HTTP 401，content-type application/json，正文 {\"error\":\"invalid_token\",\"error_description\":\"Missing Authorization header\"}；www-authenticate 为 Bearer error=invalid_token，resource_metadata=https://app.yedric.ai/.well-known/oauth-protected-resource/mcp 。未打开 metadata，未 OAuth，未 tools/list，未调用助手或会话工具。产品页未给出可匿名调用的 MCP URL；文档给出的是这条需登录的开发者端点。未粘贴 widget key。"
featured: false
prompt: |
  You help an operator understand or configure Yedric. Two surfaces
  exist in the public docs. Do not mix them up.

  Surface A — the widget inside a SaaS or Shopify app. End users ask
  in plain language. Actions are whatever that app exposed.
  Surface B — the hosted MCP at https://app.yedric.ai/mcp. It manages
  assistants and reads that organization's conversations. It is not
  the merchant's storefront admin.

  Operator request: {{request}}
  Which surface: {{widget | hosted_mcp | unsure}}

  Rules:
  1) If hosted-MCP initialize returns HTTP 401 / invalid_token, or
     OAuth is not finished, stop. Do not ask for tokens, widget
     secrets (yks_…), or Shopify session tokens in chat. A public
     widget key (yk_…) is still not something to paste here.
  2) Do not invent feature-request counts, hours saved, or conversion
     rates. The Show HN line "80+ distinct feature requests" and any
     figures on yedric.ai are source claims, not this session.
  3) Hosted-MCP writes (update_assistant_prompt, update_assistant,
     update_widget_config, add_knowledge_base_document, run_simulation,
     run_simulation_suite) change the assistant. Wait for an explicit
     yes that names the assistant id and the field.
  4) Widget actions default to Automatic for most built-in actions
     (docs). Before a merchant-facing action can create discounts,
     change orders, or call a third-party MCP, a human sets that
     action to "Ask first" or leaves it Off. Do not flip it to
     Automatic in this chat.
  5) Reading conversations (get_conversation, get_trends) is customer
     data. Quote it only when this session's tool returned it, and
     do not export a transcript into a ticket or email unless the
     operator says SEND.
  Output: (a) which surface, (b) fields actually returned, (c)
  unknowns, (d) ACTIONS REQUIRING HUMAN APPROVAL.
---

## Lab 探针成品（先看结果）

**方法：** 匿名 · 无 OAuth · 无 Bearer · 2026-11-02（Asia/Shanghai）  
**端点：** `POST https://app.yedric.ai/mcp`（`initialize`）。URL 来自 GitBook 的 MCP Server 页，不是 HN 帖正文。

| 探针 | 结果 |
|------|------|
| 匿名 `initialize` | **HTTP 401**。JSON 正文：`{"error":"invalid_token","error_description":"Missing Authorization header"}`。`WWW-Authenticate` 为 Bearer，`error="invalid_token"`，`resource_metadata` 指向 `https://app.yedric.ai/.well-known/oauth-protected-resource/mcp` |

**本站未跑：** 打开 protected-resource 文档、完成 OAuth、`tools/list`、列出或修改助手、读取会话、跑 simulation、在任何 Shopify 店里打开 widget。产品页上的对话条数、节省小时和功能请求数**不是**本站实测。

| 公开页声称 | 本站探针 | 差注 |
| --- | --- | --- |
| GitBook：托管 MCP 在 `https://app.yedric.ai/mcp`，首次连接走 OAuth | 匿名 initialize → HTTP 401，`invalid_token`，Missing Authorization header | 一致（端点在，未授权被拒） |
| 文档列出助手、会话、趋势、simulation 等工具名和参数名 | 未 `tools/list`，未带参调用 | 仅公开（本站未测） |
| HN：免费、自带 LLM key、大约 30 分钟 | 未注册、未计时 | 仅公开（本站未测） |
| 产品页展示的对话量、节省时间和功能请求数 | 未登录后台核对 | 仅公开（本站未测） |

> 人审提醒：401 只说明开发者 MCP 要登录。它不能当成已经改过助手，也不能当成店里的客服已经回答了顾客。

## 解决什么问题

SaaS 每加一个功能，就要决定它放在界面的哪一层，用户还得学会这条产品自己的路径。Show HN 的做法是把这句话倒过来：由软件把用户的原话翻成动作。Yedric 是嵌在**已有应用里**的自然语言层。开发者交出应用能做的动作、文档和用户上下文；用户可以说「把表格导出成 CSV」或「把 logo 颜色改成某个色值」。

作者写，这套东西最初是为自己的 Shopify 应用做的。对话后来变成产品反馈：其中一个应用在帖文所指的「上个月」里整理出 80+ 条不同的功能请求。这是作者对自家应用的说法，不是本站统计，也不是下面产品页上另一组数字。

公开材料其实是两层，不要合成一条：

1. **给终端用户的 widget。** 产品页写：用户说结果，Yedric 用你允许的工具去做，而不是只丢一篇帮助文档。文档里的 Actions 页把每条动作设成 Automatic、Ask first 或 Off。多数动作默认 Automatic。
2. **给开发者的托管 MCP。** GitBook 写 `https://app.yedric.ai/mcp`，用 Claude Desktop、Claude Code、Cursor 或 ChatGPT 管理助手、读会话。令牌范围是所选组织。这不是顾客在店里说话的那条通道，也不是 Shopify Admin。

与站内相近篇错位：

- [Shopify Claude 连接器](/cases/shopify-claude-connector-store-collective/)：商家在 Claude 里管自己的店、从 Collective 选货。Yedric 是应用开发者嵌进 Shopify **应用**里的助手，顾客或商家在那个应用里说话。
- [Reddit：Shopify AI Toolkit 批量改 SEO](/cases/reddit-shopify-ai-toolkit-mcp-bulk/)：卖家用 Claude Code／Cursor 连 Shopify MCP，批量改店里的 SEO 和库存。Yedric 这条的公开重点是 SaaS 产品内部的自然语言，不是卖家编码代理扫一遍全店。
- [n8n：OpenAI＋Shopify MCP 管店](/cases/n8n-shopify-openai-mcp-store-assistant/)：工作流里的操作员助手，凭证在 n8n。Yedric 不是那份 n8n 模板；HN 写的是 JS SDK 加 MCP，费用模型是免费加自带模型 key。

## 人审闸门（必须人工确认）

1. **注册、选择组织、完成 `app.yedric.ai` 的 OAuth** — 由账号所有人在客户端里批准。本站的 401 到此为止。
2. **把 widget secret（文档前缀 `yks_`）、Shopify session、JWT 或签名密钥贴进聊天或仓库** — 禁止。文档写 secret 只留在服务端；页面上可以出现的是 HMAC 结果和公开 key（前缀 `yk_`）。本页不收录任何一把真实 key。
3. **改助手** — 文档中的 `update_assistant_prompt` 会整段替换系统提示；`update_assistant` 可改名称、模型、欢迎语、知识库开关、工具服务器和在线客服排班；`update_widget_config` 改外观；`add_knowledge_base_document` 写入知识库。先点名 assistant id 和将要改的字段。
4. **把面向商家或顾客的动作留在 Automatic** — Actions 文档写：大多数动作默认 Automatic，Yedric 认为相关就会执行；Ask first 才会先问用户；Off 则不用。折扣、改订单、改价、调用外部 MCP 之前，由人把该动作设成 Ask first 或 Off。不要在本对话里改成 Automatic。
5. **把 HN 的「80+」或产品页上的用量数字写进对外材料** — 禁止。前者是作者对某一个应用、帖文发布时间点之前那个月的说法。产品页在 2026-11-02 还展示了另一组数字（当月对话 2,430、相对上月 66%；节省 281 小时 52 分；功能请求 31）。那是页面上的展示，本站没有登录核对，也不能把它说成 HN 那句 80+ 的复核。
6. **导出顾客会话** — `get_conversation` 是完整记录，`get_trends` 含主题、功能请求和痛点。读可以；转发出站要另说一次。

## 可复现步骤

前置：

1. 可读 [HN item 49924752](https://news.ycombinator.com/item?id=49924752) 与 [yedric.ai](https://www.yedric.ai/)（无需账号）
2. 文档索引在产品页脚本指向的 [shoppad.gitbook.io/yedric](https://shoppad.gitbook.io/yedric/)。MCP 页：[developers/mcp-server](https://shoppad.gitbook.io/yedric/developers/mcp-server.md)
3. 要调托管 MCP：支持 HTTP 传输和 OAuth 的客户端（文档点名 Claude Desktop、Claude Code、Cursor、ChatGPT；支持 Dynamic Client Registration 的客户端不用另填 client id）。URL 只有一条：`https://app.yedric.ai/mcp`

跟做（公开材料 + 本站匿名探活；**未** OAuth、**未**改助手）：

1. 打开 HN。标题是 “Show HN: Add a natural-language interface to your SaaS w/ Yedric”，链接到 `https://www.yedric.ai`。作者 aaroneous，created_at 2026-10-01T17:44:00Z。
2. 读产品页时把 logo 和应用名当成页面展示：MESA、Infinite Options、Smile、Tracktor、Uploadery。引言来自 ShopPad 的 Annette Powell（Director of Customer Success）。不要给这些 logo 补下载量或评分。
3. 产品页写的认证是 JWT、API key、签名会话和 Shopify session。安全模式把会话绑到已验证用户。文档中的 Secure Mode 用 HMAC-SHA256 对用户名签名，secret 不进浏览器。
4. 托管 MCP 基址：`https://app.yedric.ai/mcp`。本站匿名 `initialize` → HTTP 401，正文为 `invalid_token` / `Missing Authorization header`。到此停止。
5. 人在客户端完成 OAuth 并选好组织之后，只读问题可以是：有哪些助手、某次会话的记录、某段日期的趋势。文档写明一个容易错的地方：`list_conversations` 的日期是 epoch 毫秒，`get_trends` 的日期是 `YYYY-MM-DD`。本站没有调用，所以没有核实哪一种会被拒绝。
6. 商家侧动作以 Actions 文档为准：内置动作包括 SearchDocs、AskUserQuestion、TalkToHuman、IsHumanSupportOnline、DisplayTable、DisplayDiagram、NavigateToUrl、ShopifyReviewAsk。自定义能力可以接已有 MCP URL、导入 OpenAPI、抓 API 文档，或手写动作。GitBook 索引里还有 Shopify 能力页（订单查询、折扣码、退货、改单等）。本站没有打开那些子页，也不把它们写成已经测过的工具参数。

## 预期结果与失败限制

**预期（来源自述 + 本站匿名返回）：**

- 应用内出现一个能执行被允许动作的助手，而不是只回答「请看文档」
- 开发者用托管 MCP 管理助手配置并阅读会话；未带 Authorization 的 initialize 会被 401 挡住
- 模型 key 由开发者自己提供。产品页写 OpenAI、Anthropic、Gemini 以及兼容接口，平台不加价。HN 写免费。文档索引里另有 Shopify App 的 Plans and Billing 页，本站没有打开，因此**不**把营销页的 free 写成 Shopify 应用商店账单已经核对过

**失败／边界：**

- 未 OAuth 时不能把 401 写成「已经管过助手」或「已经回答了商家」
- 本站没有 `tools/list`。下面这些名字来自 MCP 文档表格，不是线上返回：助手侧 `list_assistants`、`search_assistants`、`get_assistant`、`update_assistant_prompt`、`update_assistant`、`add_knowledge_base_document`、`pull_agent_config`；widget 侧 `get_widget_config`、`update_widget_config`；会话侧 `list_conversations`、`get_conversation`；趋势侧 `get_trends`；simulation 侧 `list_simulations`、`list_simulation_suites`、`run_simulation`、`run_simulation_suite`、`list_suite_runs`、`get_suite_run`、`get_agent_test_job`。文档说未标可选的参数是必填。本页不补文档没写的 JSON schema
- 产品页示例链 `create_discount_code` → `tag_customer_birthday` → `klaviyo.trigger_flow` 是页面上的示意，不是本站调用，也不是上面那份托管 MCP 工具表
- HN 分数在采编时为 4，评论数为 0，之后会变
- 大约 30 分钟是作者和产品页 FAQ 的说法（HN：under 30 minutes；FAQ：about 30 minutes）。本站没有计时

## 来源与核验状态

**公开可核验**

- 主链：[HN item 49924752](https://news.ycombinator.com/item?id=49924752) → [yedric.ai](https://www.yedric.ai/)
- 辅链：[MCP Server](https://shoppad.gitbook.io/yedric/developers/mcp-server.md)、[Actions](https://shoppad.gitbook.io/yedric/going-further/actions.md)、[Secure Mode](https://shoppad.gitbook.io/yedric/developers/secure-mode.md)
- 探针表见文首。采编日 2026-11-02（Asia/Shanghai）。未 OAuth、未改助手、未读会话、未在店铺里发消息。

## 据公开帖摘要

Hacker News Show HN（`item?id=49924752`，作者 aaroneous，created_at 2026-10-01T17:44:00Z）标题是 “Show HN: Add a natural-language interface to your SaaS w/ Yedric”。帖文说 Yedric 让开发者给现有 SaaS 加自然语言界面：暴露应用动作，并提供文档和用户上下文。例子是导出 CSV、修断开的集成、改 logo 颜色。作者写它最初为自己的 Shopify 应用而做；其中一个应用在「上个月」整理出 80+ 条不同的功能请求。技术句是：小型 JS SDK 加 MCP；免费；自带 LLM key；基本实现可以在 30 分钟内跑起来。

产品页把同一主张写成「用户说想要的结果，Yedric 用你的文档、API 和应用自己的工具完成」，并标 100% free、无需信用卡。认证一行写 JWT、API key、签名会话和 Shopify session。模型一行写自带 OpenAI、Anthropic、Gemini。页上的用量模块是另一组数字，见人审第 5 条，不要和帖文的 80+ 当成同一次计数。

## English brief

Show HN on 2026-10-01 introduces Yedric as a JS SDK plus MCP that adds a natural-language action layer to an existing SaaS, built first for the author’s Shopify apps, described as free with a bring-your-own LLM key and about a 30 minute setup. The product page names MESA, Infinite Options, Smile, Tracktor, and Uploadery and mentions Shopify session auth. GitBook, linked from the site, documents a separate hosted MCP at `https://app.yedric.ai/mcp` for managing assistants and reading conversations via OAuth. Lab on 2026-11-02 (Asia/Shanghai) sent one anonymous initialize and received HTTP 401 `invalid_token` / Missing Authorization header. No OAuth and no tool calls. Widget actions are a different surface: the Actions doc says most default to Automatic, so a human sets merchant-facing writes to Ask first. This is not the official Shopify Claude connector, not the seller’s AI Toolkit bulk editor, and not the n8n Shopify MCP assistant.
