---
title: "n8n＋Claude：按 Shopify 订单起草客服邮件，发送／草稿／升级由规则闸门"
titleEn: "n8n + Claude: draft Shopify support email replies with send/draft/escalate gates"
summary: "据 n8n 官方模板 #20178（约 2026-09-29）与 Amplence 配套文：工作流轮询 Gmail，用 Shopify 订单记录与店规给 Claude 起草回复；Code 节点按意图白名单、置信度与订单邮箱匹配决定「直接发送／存草稿等审／Slack 升级」。模型不退款、不取消、不选路由。"
summaryEn: "n8n template #20178 (~2026-09-29): poll Gmail, draft replies from Shopify order + policies via Claude; Code node routes send vs Gmail draft+Slack vs escalate. Model never refunds, cancels, or chooses the route."
category: customer-service
agents: ["Claude"]
tools: ["n8n", "Gmail", "Shopify Admin GraphQL", "Anthropic Messages API", "Slack"]
source: n8n
sourceUrl: https://n8n.io/workflows/20178-answer-shopify-support-emails-with-gmail-shopify-claude-and-slack/
sourceType: public
date: 2026-09-29
dateNote: "模板 API createdAt 2026-09-29；页面写 Last update 15 days ago（相对采编日）；配套 https://amplence.com/blog/n8n-shopify-customer-support-workflow ；2026-10-20 采编"
featured: false
prompt: |
  You draft Shopify support email replies from order facts only. You do not send mail,
  refund, cancel, or change addresses.

  Inputs I will paste:
  - Customer email text (quoted replies may be stripped already)
  - Shopify order JSON or fields: status, fulfillment, carrier, tracking, ETA, line items, order email
  - Store facts: return window, shipping promise, brand voice, disclosure line

  Output JSON only:
  {
    "intent": "...",
    "language": "...",
    "confidence": 0.0,
    "needs_human": true|false,
    "summary": "one line",
    "reply": "email body"
  }

  Rules:
  - Cite only fields present in the paste. If tracking/ETA missing, say so in the reply.
  - Refunds, credits, cancellations, address changes: set needs_human true; draft only.
  - Never invent order status or carrier events.
  - Do not choose send vs draft vs escalate — a separate Code gate does that.
---

## 解决什么问题

Shopify 店客服邮件常要对照订单状态、物流与店规再回信；纯 LLM 易「猜订单」。本模板把 **Gmail 收件 → Shopify 订单拉取 → Claude 按固定 JSON 起草 → 代码规则决定发送／草稿／Slack 升级** 串成一条可导入的 n8n 工作流，把「写什么」和「发不发」拆开。

与站内「n8n＋Claude＋Shopify＋Slack 处理支持／库存／订单」（#13594）不同：那边偏运营查询与库存；本条专攻 **邮件回复路由与 HITL**。与「邮件退货退款处理」（#20389）也不同：那边聚焦 return／refund 流水；本条是通用客服邮件，且明确退款类一律人审。

## 人审闸门（必须人工确认）

模板公开文案写明：

1. **退款、credits、取消、改地址** — 永远只进草稿等人，不自动发送
2. **意图不在发送白名单、置信度未过阈值、订单邮箱与发件人不匹配、线程内已有往来、内容不清** — 走草稿或 Slack 升级，不直发
3. **首次上线前** — 用模板自带 sample email 跑通 Test workflow；先观察两周草稿再放宽白名单（定制说明）
4. **Anthropic／Shopify／Gmail 凭证** — 只放 n8n credentials，禁止贴进 prompt
5. **对外披露句／签名** — 在 Settings 人工定稿后再允许直发类意图

## 可复现步骤

前置（模板 Requirements）：

1. n8n Cloud 或自托管（仅用 Gmail、HTTP Request、Code、Switch、Slack 等 core nodes）
2. Gmail、Slack 凭证；Anthropic API key（HTTP Header Auth `x-api-key`）
3. Shopify Dev Dashboard 应用，`read_orders` scope，安装到店铺；Custom Auth 换 24h token

跟做（据模板页 Setup）：

1. 在触发器与 Gmail 节点上选 Gmail 凭证；可按需加 label 过滤
2. 配置 Get Shopify token（client_id／client_secret）与订单 GraphQL 查询节点
3. 将 Anthropic key 挂到「Classify and draft with Claude」
4. Slack 节点选团队频道（Settings 里写频道名）
5. 编辑 Settings：店名、子域、退货窗、物流承诺、品牌语气、允许直发的意图列表、置信度门槛（默认文案写 **0.8**）、签名与披露句
6. 点 Test workflow：模板钉了 sample email，可先端到端再接真实客户

配套说明见 Amplence：[n8n Shopify customer support workflow](https://amplence.com/blog/n8n-shopify-customer-support-workflow)。

## 预期结果与失败限制

**预期（公开材料）：**

- 每分钟轮询未读 Inbox；解析订单号（如 `#1042`）或按发件邮箱回查订单
- 一次 GraphQL 取状态、履约、承运商、轨迹、ETA、行项目、订单邮箱
- Claude 返回固定 schema：intent、language、confidence、是否需要人、一行摘要、回复正文
- 路由：**Send**（线程内回复＋披露句）／**Draft**（Gmail 草稿＋Slack 说明原因）／**Escalate**（Slack 摘要＋线程链）／垃圾邮件空操作

**失败／边界：**

- 无 `read_orders` 或 token 失败 → 无法对照订单，应升级人审（按你的闸门配置）
- 本站**未**导入该工作流实测；置信度与白名单行为以你 Settings 为准
- 模板作者 Amplence；成本／阈值细节见配套博客，本页不编数字
- WooCommerce 需替换两个 Shopify HTTP 节点（模板 Customization 所述）

## 来源与核验状态

**官方模板**

- 主链：[n8n #20178 — Answer Shopify support emails with Gmail, Shopify, Claude and Slack](https://n8n.io/workflows/20178-answer-shopify-support-emails-with-gmail-shopify-claude-and-slack/)
- 配套：[amplence.com/blog/n8n-shopify-customer-support-workflow](https://amplence.com/blog/n8n-shopify-customer-support-workflow)
- 采编：2026-10-20（Asia/Shanghai）。本站未 live 跑信。

## 据公开帖摘要

n8n 模板 **#20178**（API `createdAt` 2026-09-29）由 Amplence 构建。公开概述：用 Shopify **订单记录**而不是猜测来回复客服邮件；Claude 根据订单与店规起草；**你的代码**决定发送、存为 Gmail 草稿待审，或转 Slack；**模型永不退款、取消或选择路由**。

流程：Gmail 每分钟拉未读 → 规范化正文并找订单号／发件邮箱 → Shopify app 换 24h token 后一次 GraphQL 取订单字段 → Claude（Anthropic Messages API）产出固定 JSON → Code 节点按意图白名单、置信度门槛、订单邮箱匹配等规则分流 → Send／Draft＋Slack／Escalate／Spam。设置项含店名、子域、退货窗、物流承诺、品牌语气、可直发意图、默认置信度 **0.8**、签名与披露句。Customization：两周草稿表现稳定后再把某意图加入发送列表；退款／credits／取消／改地址始终草稿待人。

## English brief

n8n #20178 drafts Shopify support replies with Claude from live order GraphQL + store facts, then a Code gate chooses send, Gmail draft+Slack, or escalate. Refunds/cancels always human. Lab cites the public template and Amplence companion post — **no live mailbox test**.
