---
title: "Jungle Scout 官方 MCP：把 Cobalt 亚马逊情报接到 Claude／ChatGPT／Gemini／Copilot"
titleEn: "Jungle Scout official MCP — Cobalt Amazon intelligence inside Claude, ChatGPT, Gemini, and Copilot"
summary: "据 Jungle Scout 产品页与 Getting Started（2026-07-08）：Jungle Scout MCP 把 Cobalt 的亚马逊市场情报接到已批准的 AI 平台，用自然语言问市场份额、竞品、价格带、关键词与 SoV、属性与品牌表现等；不替代 Cobalt 控制台。页面点名 Claude、ChatGPT、Gemini、Copilot 及经批准的内部环境；新客走演示表单，现有客户找 CSM。本站 2026-11-03（Asia/Shanghai）在产品页与入门文未发现可匿名调用的公开 MCP URL，故无 initialize 探针；未登录、未 tools/list、未调用工具。非 Pipeworx 等非官方网关。"
summaryEn: "Jungle Scout’s product page and Getting Started (2026-07-08): Jungle Scout MCP connects Cobalt’s Amazon marketplace intelligence to approved AI platforms so teams can ask about share, competitors, price tiers, keywords/SoV, attributes, and brand performance in plain English. It does not replace Cobalt. Named clients include Claude, ChatGPT, Gemini, Copilot, and approved custom environments; new customers request a demo, existing ones talk to a CSM. Lab on 2026-11-03 (Asia/Shanghai) found no anonymous public MCP URL on those pages, so no initialize probe. No login, no tools/list, no tool calls. Not an unofficial Pipeworx gateway."
category: sourcing
agents: ["Claude", "ChatGPT", "Gemini", "Microsoft Copilot", "Claude Cowork"]
tools: ["Jungle Scout MCP", "Cobalt", "market share", "keyword SoV", "price tiers"]
source: 官网
sourceUrl: https://www.junglescout.com/products/jungle-scout-mcp/
sourceType: public
date: 2026-11-03
dateNote: "2026-11-03（Asia/Shanghai）采编产品页 https://www.junglescout.com/products/jungle-scout-mcp/ 、入门文 https://www.junglescout.com/resources/articles/getting-started-with-jungle-scout-mcp/ （页署 July 8, 2026）、介绍文 https://www.junglescout.com/resources/articles/your-ai-tools-now-fluent-in-amazon/ 。FAQ：由 Cobalt 情报驱动；不替代 Cobalt；能力随 Cobalt 订阅与数据权限变化；起步为演示表单或 CSM。产品页营销句含 “40,000 active seller engagements” 与 “18% of Amazon’s GMV”——仅属页面声称，本站未复核。同日在上述页面 HTML 中未抽出可匿名 POST 的托管 MCP URL，故未做 initialize。未把 https://gateway.pipeworx.io/jungle-scout/mcp （第三方非官方包装）当作 Jungle Scout 官方端点写入本条 sourceUrl。"
featured: false
prompt: |
  You research Amazon categories only through Jungle Scout MCP when the
  operator’s org already connected Cobalt-backed access in their AI client.
  You do not replace Cobalt dashboards or invent market share.

  Question: {{share | competitors | price tiers | keywords SoV | attributes | brand}}
  Category / brand / ASIN the operator already named: {{input}}

  Rules:
  1) If the client has no Jungle Scout / Cobalt MCP connection, stop. Do not
     call unofficial gateways (e.g. Pipeworx jungle-scout packs) unless the
     operator explicitly named that third-party URL.
  2) Quote figures only as a Jungle Scout MCP tool returned them this
     session. Label them Cobalt-backed marketplace estimates or connected
     account data as the tool states — not a Lab census of Amazon GMV.
  3) Marketing claims on the product page (e.g. 40,000 engagements, 18% GMV)
     are not this session’s measurements.
  4) Do not buy Cobalt, sign a demo contract, or change ads/listings from
     chat. Agentic follow-ups (Slack, Drive, trackers) wait for a named yes.
  5) Never ask for Jungle Scout, Cobalt, or Amazon passwords in chat.
  Output: (a) tools called, (b) fields returned, (c) unknowns,
  (d) ACTIONS REQUIRING HUMAN APPROVAL.
---

## 解决什么问题

品牌与电商团队已经会用 Claude、ChatGPT、Gemini 或 Copilot 写纪要，但通用模型拿不到可信的亚马逊品类份额、价格带和关键词 SoV。Jungle Scout 产品页把 [Jungle Scout MCP](https://www.junglescout.com/products/jungle-scout-mcp/) 写成：把 **Cobalt** 的亚马逊市场情报接到这些 AI 工具里，用自然语言问「谁在涨份额」「哪个价格带在长」「谁占着核心词」，再把答案收成 briefing、QBR 或表格——少一次导出仪表盘、少一次找分析师。

[Getting Started（2026-07-08）](https://www.junglescout.com/resources/articles/getting-started-with-jungle-scout-mcp/) 写明：MCP **不替代** Cobalt；它扩展 Cobalt，让同一套情报出现在对话工作流里。能力随 Cobalt 订阅与数据权限变化，文中举例覆盖市场份额与增长、品牌／卖家、ASIN、价格带、关键词与 SoV、属性、品牌表现，以及在可用时的关联销售与广告数据。

起步路径：新客提交演示表单；现有 Jungle Scout／Cobalt 客户找 CSM 或客户成功。产品页 FAQ 还写：接到 Claude Cowork 一类 agent 时，可以把洞察继续写成 brief、Slack 提醒或存档——那是厂商叙述的 agentic 闭环，不是本站实测。

与站内相近篇错位：

- [Helium 10 MCP](/cases/helium10-mcp-amazon-seller-research-ads/)：另一家选品／广告／利润托管 MCP，有公开 `https://mcp.helium10.com/mcp` 可匿名探到 401。Jungle Scout 本条在采编日**没有**在官方页抽出同类公开 URL。
- [Keepa 官方 MCP](/cases/keepa-amazon-mcp/)：价格史与 Product Finder，面向 Keepa API 订阅。Jungle Scout MCP 叙事是 Cobalt 品类／竞品情报。
- [AMZScout Skill+MCP](/cases/amzscout-mcp-niche-validation/)：AMZScout 自有市场数据。不是 Cobalt。
- 第三方 Pipeworx `mcp-jungle-scout` 包装（GitHub pipeworx-io）自称非官方、要自备 Jungle Scout API key。本条只采官方产品页／入门文，不把该网关写成 Jungle Scout 官方端点。

## 人审闸门（必须人工确认）

1. **先确认组织已开通** — 官方路径是演示或 CSM，不是本站代注册。
2. **数字只引用工具返回** — 产品页 “40,000 active seller engagements”“18% of Amazon’s GMV” 是营销句，禁止抄进账号结论。
3. **不把非官方网关当成官方** — 除非操作者自己点名第三方 URL，否则不要去 Pipeworx 等包装上「补」官方缺失的公开端点。
4. **agentic 后续动作要人点头** — 发 Slack、改 tracker、存 Drive、买加购，都不是默认自动执行。
5. **不替代人工决策** — 入门文：MCP 加快取数与解读，团队仍决定怎么做。
6. **凭证不进聊天** — 不索要 Jungle Scout／Cobalt／Amazon 密码或令牌。

## 可复现步骤

前置（据产品页与入门文；本站未开通）：

1. Cobalt／Jungle Scout 侧已批准的 MCP 访问（CSM 或演示流程）
2. 支持 MCP 连接的客户端（文中点名 Claude、ChatGPT、Gemini、Copilot 等；可用性随平台与组织配置变化）
3. 明确的品类、竞品、时间窗问题（入门文建议把问题写具体）

跟做（公开材料；本站未登录）：

1. 读产品页 FAQ 与 Getting Started，确认这是 Cobalt 情报的对话入口，不是新的独立数据源
2. 按 CSM／演示指引在客户端完成连接（本站无公开 URL 可粘贴探活）
3. 先问只读品类／竞品／价格带／关键词问题；只引用该次工具字段
4. 若客户端未出现 Jungle Scout 工具，停在「未连接」，不要改用非官方包装充数

## 预期结果与失败限制

**预期（文档表述，不是本站实测）：**

- 在已连接的 AI 客户端里，用自然语言取得 Cobalt 支撑的品类与竞品回答
- 把回答整理成 briefing、scorecard、表格或规划笔记（取决于客户端能力）
- 关联销售／广告数据「where available」，深度由订阅决定

**失败与边界：**

- 采编日官方页**无**可匿名 initialize 的公开 MCP URL → 本条无 401／200 探针表
- 不是 Cobalt UI 的替代；保存的 Cobalt segment／看板能力以官方说明为准（帮助中心另有 Catalyst／Cobalt／MCP 选型文，本条未整页搬迁）
- 通用模型本身不会“突然会算份额”；价值在于接到 Jungle Scout 数据

## 来源与核验状态

**公开可核验**

- 主链：[Jungle Scout MCP 产品页](https://www.junglescout.com/products/jungle-scout-mcp/)
- 辅链：[Getting Started](https://www.junglescout.com/resources/articles/getting-started-with-jungle-scout-mcp/)、[Your AI tools, now fluent in Amazon](https://www.junglescout.com/resources/articles/your-ai-tools-now-fluent-in-amazon/)
- 2026-11-03（Asia/Shanghai）采编。未登录、未发现官方公开 MCP URL、未调用工具。

## English brief

Jungle Scout MCP is Cobalt’s Amazon marketplace intelligence exposed to approved AI clients (Claude, ChatGPT, Gemini, Copilot, and approved custom setups). Official pages say it does not replace Cobalt; access is via demo or CSM. Lab on 2026-11-03 (Asia/Shanghai) found no anonymous public MCP URL on the product/getting-started pages, so there is no initialize probe. Not Helium 10, Keepa, AMZScout, or unofficial Pipeworx wrappers.
