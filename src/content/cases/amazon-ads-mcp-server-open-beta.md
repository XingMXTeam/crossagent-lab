---
title: "亚马逊广告官方 MCP：自然语言读写 Ads API，写操作先审后发"
titleEn: "Amazon Ads official MCP — natural language to Ads API, review before launch"
summary: "据 Amazon Ads 官网（2026-02-02）：Ads MCP Server 进入开放测试，把自然语言转成 Ads API 调用，可接 Claude／ChatGPT／Gemini；含建号、报表、一国扩多国、以及一键拼好待审的 Sponsored Products 整条链路。面向有活跃 API 凭证的 Ads 合作伙伴，全球可用。"
summaryEn: "Amazon Ads (2026-02-02): Ads MCP Server open beta turns natural language into Ads API calls for Claude/ChatGPT/Gemini; tools cover accounts, reports, locale expansion, and end-to-end Sponsored Products drafts that still need human review. Global open beta for partners with active API credentials."
category: ads
agents: ["Claude", "ChatGPT", "Gemini"]
tools: ["Amazon Ads MCP Server", "Amazon Ads API", "Sponsored Products"]
source: 官网
sourceUrl: https://advertising.amazon.com/library/news/amazon-ads-mcp-server-open-beta
sourceType: public
date: 2026-02-02
dateNote: "官网文标 February 2, 2026；Paula Despins；2026-10-19 采编"
featured: false
prompt: |
  You are connected to Amazon Ads only through the official Amazon Ads MCP Server.
  Advertiser / profile context: {{profile_or_account_id}}
  Marketplace / locale: {{marketplace}}
  Goal for this session: {{goal}}

  Rules:
  1) Prefer read tools first (performance, reporting, billing). Cite only fields the tools returned; never invent ACOS, spend, or conversions.
  2) For writes (create/update/delete campaign, ad group, ad, bid, budget, locale expansion): output a CHANGESET table — action | entity | old | new | reason | data_cited — then wait for human review/approval before any write tool.
  3) If using a pre-built Sponsored Products “ready-to-launch” workflow, treat the result as a draft until a person approves.
  4) Do not place unrestricted broad match. Prefer exact/phrase negatives over budget spikes.
  5) If a required credential or tool is missing, say so and stop; do not invent API responses.
---

## 据公开帖摘要

Amazon Ads 官网文「Introducing the Amazon Ads MCP Server」（Paula Despins，2026-02-02）宣布 **Amazon Ads MCP Server** 进入开放测试。MCP 作为开放标准，把 AI Agent 接到 Amazon Ads API：自然语言被转成结构化 API 调用，广告主与合作伙伴可用同一集成对接自建 Agent，或 Claude、ChatGPT、Gemini 等平台，而不必为每个工作流单独写对接。

文中写明，连接后 Agent 可触达的能力包括：创建、更新或删除活动；跑表现与报表查询；管账号级设置；读计费与财务数据。作者也强调：仅有连通性不够——广告工作常跨多系统，传统 API 一次暴露一步，Agent 自己拼流程容易不可靠。因此 Ads MCP 还带**预置工具／工作流**，把多步操作收成一次调用，例子包括：建号、出报表、开活动、把已在美加跑的活动扩到另一国，以及**一条提示语拼出完整 Sponsored Products 活动（活动＋广告组＋广告）**，生成「待审即可上线」的稿，仍需人审。

可用性：面向持有**活跃 API 凭证**的 Amazon Ads partners，**全球**开放测试。本条不引用厂商未给出的效果数字；上线前仍要核对账号权限、写操作审批与审计。

## 要点

- 官方 Ads MCP 解决「Agent ↔ Ads API」的标准连接，适合已有 Ads API 资格的跨境卖家／代理。
- 预置 SP 建活动与扩国家工具降低拼 API 成本，但文案明确**先生成再审**，不要默认自动花钱。
- 与仓内 Tirnav「自建 SP-API＋Ads MCP」文不同：本条是 **Amazon Ads 官方 MCP** 产品页。

## 注意

开放测试范围、工具清单与凭证要求以 advertising.amazon.com 现文为准。写操作（改出价、预算、删活动）必须人批；不要在未确认凭证类型时承诺「任何卖家账号都能直接连」。
