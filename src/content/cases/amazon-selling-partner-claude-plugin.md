---
title: "亚马逊卖家插件：Seller Assistant 进入 Amazon Quick，并在 Claude 公测"
titleEn: "Amazon Selling Partner plugin — Seller Assistant in Amazon Quick and Claude beta"
summary: "据 About Amazon（Mary Beth Westmoreland，datePublished 2026-09-23）与 Claude 应用市场连接器页：卖家插件先在 Amazon Quick 上线，并在 Anthropic Claude 公测。它把刊登、实时表现、库存和销售分析接进卖家已在用的 Agent，动作方式对齐 Seller Assistant：人批、有审计。插件公测范围为亚马逊美国站，国际随后。Seller Central 内的 Assistant 数据留在亚马逊基础设施。本站只核对公开页，未登录卖家账号，未调用工具。"
summaryEn: "About Amazon (Mary Beth Westmoreland, datePublished 2026-09-23) and the Claude marketplace connector: a selling partner plugin launches in Amazon Quick and in beta with Claude. It brings listing contributions, live performance, inventory, and sales analytics into the seller’s agent, with Seller Assistant-style human approval and audit trails. Plugin beta is Amazon U.S. stores; international later. In-console Assistant data stays in Amazon infrastructure. Lab read the public pages only — no seller login and no tool calls."
category: ops-finance
agents: ["Claude", "Amazon Quick"]
tools: ["Amazon Selling Partner plugin", "Seller Assistant", "Amazon Quick", "accounts_getMerchants", "call_read_only_tool", "call_write_tool", "functional_feedback", "get_tool_schema", "search_tools", "sellerAssistant_sellerAssistantCreate", "sellerAssistant_sellerAssistantGet"]
source: 官网
sourceUrl: https://www.aboutamazon.com/news/innovation-at-amazon/seller-assistant-plugin-amazon-quick-claude
sourceType: public
date: 2026-10-26
dateNote: "About Amazon 文 datePublished／dateModified 2026-09-23T13:00:08.829Z；作者 Mary Beth Westmoreland，Vice President, Worldwide Selling Partner Experience。配图文件名含 accelerate-2026-seller-assistant。2026-10-26（Asia/Shanghai）采编该文与 https://claude.com/marketplace/connectors/amazon-selling-partner（连接器 URL https://sellingpartner-ai.amazon.com/mcp，页上 8 个工具名，标 beta）。未连接 Seller Central，未调用 MCP。"
featured: false
prompt: |
  You help an Amazon seller understand the Selling Partner plugin
  described by About Amazon (2026-09-23) and the Claude marketplace
  connector “Amazon Selling Partner”. You are not logged into Seller Central
  unless the operator already connected it in their own client.

  Marketplace: {{US | other}}
  Surface: {{Seller Central | Amazon Quick | Claude}}
  Request: {{question}}

  Rules:
  1) Reads: quote only fields a connected tool returned. If nothing is
     connected, answer from the public article and say the account numbers
     are missing. Never invent sales, inventory, ad spend, or acceptance rates.
  2) The “over 90%” recommendation-acceptance line is Amazon’s stated figure.
     Label it Amazon-stated. Do not treat it as this account’s result.
  3) Plugin beta in the article is for sellers in Amazon U.S. stores.
     If marketplace is not US, say international expansion is “to follow”
     and do not claim the plugin is available there.
  4) Any mutating action (price, listing, restock, workflow that acts)
     is a proposal. Stop for seller approval. Do not auto-apply.
  5) Workflows that can act still need the seller’s review before the
     action is carried out, and they keep an audit trail. Do not turn a
     recommend-only workflow into an acting one.
  6) Do not paste account credentials. Quick Plus (free 12 months for
     primary account holders through 2026-12-31, plus up to two co-workers)
     is an offer the account holder accepts in Amazon’s flow, not in chat.
  Output: (a) what the public pages say, (b) what this session actually
  returned, (c) ACTIONS REQUIRING HUMAN APPROVAL.
---

## 解决什么问题

卖家已经在 Seller Central 里用 Seller Assistant 问经营问题，同时也在别的 Agent 里看财务、供应链或广告。About Amazon 这篇要补的是后半段：把 Seller Assistant 的推理、建议和**经人批准后的动作**，带进 Amazon Quick，以及公测中的 Claude。

插件接上的数据，文章点名四类：listing contributions、实时表现、库存、销售分析。文章写它不止只读，还可以像 Seller Central 里的 Seller Assistant 那样行动。外部连接不改亚马逊保护卖家数据的方式：每次插件交互有访问边界、人对动作的批准，以及完整审计。

Seller Central **里面**的 Assistant 另有一句边界：数据留在亚马逊基础设施内，不分享到亚马逊之外。插件是「带着护栏走到卖家已在用的工具」，不是把同一句话自动延伸成「对话里可以随便改价」。

与站内相近篇错位：

- [亚马逊广告官方 MCP](/cases/amazon-ads-mcp-server-open-beta/)：Ads API。对象是持有活跃广告 API 凭证的合作伙伴，能力是活动、报表、计费。不是 Seller Assistant，也不读这篇里的库存／刊登经营插件。
- [Selling Partner Agentic Toolkit](/cases/amzn-selling-partner-agentic-toolkit/)：GitHub 上的官方技能包（分析、月结说明、断货、入库、刊登草稿等），经托管连接器跑，写操作出草稿等人批。本篇不重复那份技能清单。
- [SP-API Local MCP](/cases/amzn-sp-api-local-mcp/)：给开发者的本地 npm MCP，查文档、生成示例、迁移和代码审阅。除实调外多数工具不要卖家凭证。本篇是卖家产品公告，不是那套开发助手。
- 本篇：2026-09-23 的产品公告——Seller Assistant 的记忆与全天工作流，加上 Quick 正式推出、Claude 公测的卖家插件。Claude 市场页给出的是连接器入口和一层工具名，不是 Toolkit 仓库里的技能目录。

## 人审闸门（必须人工确认）

以下动作不得由 Agent 自动执行：

1. **改价、改刊登、补货，或任何会改卖家账号的动作** — 文章：工作流若选择代为执行，卖家仍要在执行前审阅并批准；插件侧同样是 human approval
2. **把「只出建议」的工作流改成「直接执行」** — 预置或自定义工作流都由卖家选模式
3. **把亚马逊写出的「建议接受率超过 90%」当成自己店铺的成绩** — 这是文章与 Eric Burns 引语里的亚马逊数字，须标注为 Amazon-stated
4. **为非美国站开通插件** — 文章：插件公测对象是亚马逊美国站卖家；国际扩张在后
5. **注册 Quick Plus、指定最多两名同事** — 主账号持有人可领 12 个月免费 Quick Plus，截止 2026-12-31，全球主账号持有人可报名。在亚马逊自己的流程里完成，不在对话里代点
6. **把刷新令牌、卖家后台密码或同事邀请链接贴进对话** — 禁止
7. **用插件结果直接给买家或供应商发法律／财务承诺** — 文章强调建议带理由，供卖家评估、调整或换方案

## 可复现步骤

前置（据 [About Amazon 文](https://www.aboutamazon.com/news/innovation-at-amazon/seller-assistant-plugin-amazon-quick-claude) 与 [Claude 连接器页](https://claude.com/marketplace/connectors/amazon-selling-partner)；本站未登录）：

1. 卖家要核对自己的站点。插件公测写的是 **Amazon U.S. stores**
2. 两个表面：Amazon Quick，或 Claude（文章与市场页都标 beta）
3. 市场页连接器 URL 为 `https://sellingpartner-ai.amazon.com/mcp`（页上复制按钮的原文）。作者链接指向 Seller Central。本站未对该 URL 发 initialize

跟做（公开材料，非本站实测）：

1. 读 About Amazon 全文，把「Seller Central 内的 Assistant」和「Quick／Claude 插件」分成两列：数据边界、地理范围、是否要人批
2. **Claude**：市场页写明连接 Seller Central 后，可问销售、库存和刊登表现，建议基于自己的数据；每个动作先审阅再批准，无需切回 Seller Central。页首标 Currently in beta。Anthropic 声明不控制开发者提供的工具，也不保证其行为不变
3. 市场页列出的工具名（2026-10-26 采编，共 8 个）：`accounts_getMerchants`、`call_read_only_tool`、`call_write_tool`、`functional_feedback`、`get_tool_schema`、`search_tools`、`sellerAssistant_sellerAssistantCreate`、`sellerAssistant_sellerAssistantGet`。页上没有这些工具的参数表。没有参数表就不要编造入参
4. **Quick**：文章写卖家可在 Quick 里做定价、刊登或补货 Agent；Quick 会展示打算做什么，并在行动前等待批准。Jigar Thakkar（AWS，Agentic AI for Business）的引语强调插件把卖家业务接到经营其余部分
5. **工作流**（Seller Assistant，不限于插件）：用自然语言描述，设定 guardrails。预置模板覆盖账号健康、订单摘要、价格趋势、选品扩张。自定义也可从零做。选「只提示」或「代执行」；代执行仍须人事前批准。每次动作有审计
6. **记忆**：文章写 Assistant 记住该卖家的定价习惯、库存周期和增长目标；这段记忆在 Seller Central、Quick、Claude 之间跟着走。建议带理由
7. 文章中的连接耗时：Claude 侧约 **60 秒**、无需写代码（正文与 Eric Burns 引语）。这是产品叙述，不是本站计时
8. Quick Plus：主账号持有人全球可报名免费 12 个月，截止 **2026-12-31**；还可再指定 **两名**同事。是否报名由人决定

## 预期结果与失败限制

**预期（文章 + 市场页原文）：**

- 插件把刊登贡献、实时表现、库存、销售分析接进所选 Agent，并能在人批后行动
- Quick 已作为启动表面；Claude 为 beta
- 地理：插件 beta = 美国站；国际随后。这与「Seller Assistant 能力已覆盖全球超过 90% 卖家、使用其母语」不是同一句话。后者讲的是站内 Assistant 的铺开，不是插件已在各国上线
- 站内 Assistant：Amazon Bedrock + Anthropic Claude 模型；数据留在亚马逊基础设施，不向外分享
- 插件交互：访问边界 + 人批 + 审计
- 市场页工具是薄的一层名字（搜索工具、读、写、Seller Assistant 的 create/get 等）。技能怎么拆，见 Toolkit 那一篇，不要从这 8 个名字推出完整 SP-API 列表

**失败与边界：**

- 本站**未**连接卖家账号，**未**调用 `https://sellingpartner-ai.amazon.com/mcp`，**未**看到任何 ASIN 的库存或销售额
- 文章数字全部是亚马逊自述，须加 Amazon-stated：建议接受率超过 90%；活跃用户数十万；站内能力铺到全球超过 90% 卖家；90% 的卖家已在用第三方 AI 工具。没有本店对照实验
- 早期测试者 James Oliver 的引语（「以前要一下午，现在马上完成」）是文章里的个例，不是 Lab 测量
- 非美国站不要按「插件已可用」写操作步骤
- `call_write_tool` 这个名字不等于可以无人值守写入。文章的人批规则覆盖写动作
- 市场页工具名单会变（Anthropic 的免责声明）。采编日见 dateNote

## 来源与核验状态

**公开可核验**

- 主链接：[Amazon gives sellers an even smarter Seller Assistant and a new plugin for Amazon Quick and Anthropic’s Claude](https://www.aboutamazon.com/news/innovation-at-amazon/seller-assistant-plugin-amazon-quick-claude)（Mary Beth Westmoreland；`datePublished` 2026-09-23）
- 连接器：[Amazon Selling Partner](https://claude.com/marketplace/connectors/amazon-selling-partner)（beta；connector URL `https://sellingpartner-ai.amazon.com/mcp`；上列 8 个工具名）
- 采编：2026-10-26（Asia/Shanghai）。只读公开页。未登录 Seller Central，未报名 Quick Plus，未调用 MCP
- 与 Ads MCP、Agentic Toolkit、Local SP-API MCP 的分工见首节

## 据公开帖摘要

**About Amazon（2026-09-23）：**

- Seller Assistant 2023 年上线。后来加上可推理、可计划、可在卖家许可下行动的能力
- 铺开：全球超过 90% 的 selling partners，母语可用；活跃用户数十万；卖家接受建议的比例超过 90%（Amazon-stated）
- 技术：与 AWS、Anthropic 合作；Amazon Bedrock + Claude 模型；25 年零售经验是文章中的表述
- 持久记忆：定价模式、库存周期、增长目标；在 Seller Central、Quick、Claude 间保持
- 建议附带理由。卖家要看图时可以打开 canvas，用实时数据比较定价或看活动
- 工作流：7×24 盯条件并响应，卖家不在线也会跑。例子包括评分跌破 4 星就提醒并起草回应计划，以及发现竞品空档后调价并刷新刊登。护栏由卖家定。审计完整。代执行前仍要人批
- 预置模板：账号健康、订单摘要、价格趋势、选品扩张
- 插件：先 Quick，Claude beta，以后还有更多集成。数据四类见上。Quick 里可建定价／刊登／补货 Agent，行动前展示意图并等待批准
- 可用性：美国站卖家公测；国际随后
- Quick Plus：全球主账号持有人，免费 12 个月，报名截止 2026-12-31；可再给两名同事
- Eric Burns（Anthropic field CTO）引语：卖家每天要做定价、库存和广告决策；Seller Assistant 已在用 Claude 模型；接受率超过 90%（与正文同一亚马逊数字）；Claude 插件把这些洞察放到卖家已有的会计和供应商连接旁边；连接大约 60 秒、不用写代码
- 90% 的亚马逊卖家已使用第三方 AI 工具（Amazon-stated）

**Claude 市场页：**

- 标题 Amazon Selling Partner MCP；状态 beta
- 用途原文方向：问销售、库存、刊登表现；建议基于自己的数据；每个动作审阅批准，不必切回 Seller Central
- 工具名 8 个，见上节。连接器 URL 见上节
- 页底提醒：只连接信任的开发者；Anthropic 不控制工具列表，也不验证其是否按预期工作

## English brief

About Amazon (Mary Beth Westmoreland, published 2026-09-23) announces the next Seller Assistant — persistent memory, guarded workflows with audit trails, and a selling partner plugin that launches in Amazon Quick and in beta with Claude. The plugin connects listing contributions, real-time performance, inventory, and sales analytics, and can act only with human approval. In-Seller-Central Assistant data stays inside Amazon infrastructure. Plugin beta is for Amazon U.S. stores; international expansion comes later. Primary account holders globally can sign up for 12 months of Quick Plus through 2026-12-31 and add up to two co-workers. Amazon states recommendation acceptance above 90%; that figure is Amazon-stated, not a Lab measurement. The Claude marketplace lists connector URL `https://sellingpartner-ai.amazon.com/mcp` and eight tool names (`search_tools`, `call_read_only_tool`, `call_write_tool`, Seller Assistant create/get, and others) but no parameter schemas. This page is the product announcement. It is not the Amazon Ads MCP, not the GitHub agentic-toolkit skill list, and not the local SP-API developer MCP. Lab did not log in or call the connector. A seller approves every price, listing, and restock change.
