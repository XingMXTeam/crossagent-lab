---
title: "n8n：GPT-4o 在聊天里查询并修改 UnoPim 商品目录"
titleEn: "n8n: query and edit an UnoPim catalog with GPT-4o, then confirm in Slack and Sheets"
summary: "据 n8n 模板 #20267（UnoPim／dripar-webkul，createdAt 2026-10-01）：聊天窗口里由 GPT-4o 工具调用 Agent 操作 UnoPim。六个工具为列出商品、按 SKU 查看、PATCH 更新、列出属性、列出 family、按 code 查看可配置商品。Settings 节点放 locale、channel 和只读开关。写入会回读确认，记入 Google Sheet 并在 Slack 宣布；无法解析的项开 Linear issue。本站未导入该工作流。"
summaryEn: "n8n template 20267 (UnoPim / dripar-webkul, createdAt 2026-10-01): a GPT-4o tool-calling agent with six UnoPim tools (list products, look up a product, PATCH update, list attributes, list families, look up a configurable product). A Settings node holds locale, channel, and a read-only switch. Writes are read back, logged to Google Sheets, and announced in Slack; unresolved gaps open a Linear issue. Lab did not import the workflow."
category: ops-finance
agents: ["OpenAI GPT-4o", "n8n AI Agent"]
tools: ["UnoPim", "n8n Chat Trigger", "Slack", "Google Sheets", "Linear"]
source: n8n
sourceUrl: https://n8n.io/workflows/20267-query-and-edit-unopim-product-catalogs-with-openai-gpt-4o-and-slack
sourceType: public
date: 2026-10-01
dateNote: "n8n 模板 id 20267，作者 UnoPim（username dripar-webkul），模板 API createdAt 2026-10-01。2026-10-25（Asia/Shanghai）采编。Lab 未导入、未执行该工作流。"
featured: false
prompt: |
  You are the catalog assistant for a UnoPim PIM. Default is read-only.
  Do not update a product unless the operator has turned the read-only switch off
  and explicitly asked for this SKU and these fields.

  Locale: {{locale}}
  Channel: {{channel}}
  Request: {{question_or_edit}}
  SKU or configurable code: {{sku_or_code}}

  Rules:
  1) Before any write, list attributes and list families. Use only codes those
     tools returned. If a code or required family field is missing, stop and
     open the gap as unresolved. Do not invent attribute codes or values.
  2) Updates are PATCH of named fields, not a full record replace. After a
     write, believe the change only if a follow-up read of that SKU shows it.
  3) Never publish a product to a storefront from this chat. Incomplete
     products stay unpublished until a person checks name, description, price,
     and status outside this prompt.
  4) Slack messages and Linear issues are notifications. They are not approval
     unless the team has a separate rule that says so.
  5) Do not paste UnoPim API keys, OpenAI keys, or Slack/Linear tokens into chat.

  Output: (a) read-only answer or proposed PATCH, (b) attribute/family codes used,
  (c) ACTIONS REQUIRING HUMAN APPROVAL before the read-only switch is turned off.
---

## 解决什么问题

跨境商品资料先落在 PIM，再同步到店铺。运营常要在目录里查一个 SKU、改一个已有属性，而不是让模型编一个属性代码再写进去。

n8n 模板 #20267 给 UnoPim 目录一个聊天窗口：OpenAI GPT-4o 做工具调用 Agent，挂六个 UnoPim 工具。作者主页简介称 UnoPim 是开源 PIM，并做官方 n8n 节点，把目录接到电商店和 Agent。本模板改的是 **UnoPim 目录字段**。同作者另有模板 [#19443](https://n8n.io/workflows/19443-sync-unopim-product-catalogs-to-shopify-and-log-results-in-sheets-slack-and-jira/)（UnoPim 保存后同步到 Shopify）。那条工作流不在本文件范围内：19443 的说明写未齐套的商品会开 Jira、不发布。不要把 20267 的一次 PATCH 当成店铺已上架。

## 人审闸门（必须人工确认）

1. **只读开关默认保持开启** — Settings 节点里有 read-only switch。在人把它关掉之前，不要执行 Update a product。模板也写：去掉 Update a product 后 Agent 变为只读，changed 分支不会触发。
2. **不自动上架不完整商品** — 本模板没有店铺发布步骤。名称、描述、价格、在售状态不齐时，不要在下游店铺发布。19443 把「能否发布」放在另一条工作流的 IF 节点，须单独审。
3. **PATCH 结果以回读为准** — 模板写：changed 时再从 UnoPim 拉该 SKU，因为写入只有回读到才算数。回读对不上就当没改成。
4. **Slack 与 Linear 是通知，不是审批** — 变更发到 Slack，无法解析的缺口开 Linear issue。模板把它们写成普通节点，不是 Agent 工具。除非你们团队另有规定，否则频道里出现一条消息不等于有人批准。
5. **先对属性与 family 再写** — 模板写 List attributes 与 List families 就是为了阻止 Agent 编造属性代码或漏掉 family 要求的字段。对不上就走 unresolved，不要填一个看起来像的 code。
6. **凭证不进聊天** — UnoPim API key、OpenAI key、Google／Slack／Linear 凭证放在 n8n credentials。模板要求自托管：社区节点装不到 n8n Cloud。

## 可复现步骤

前置（据[模板页](https://n8n.io/workflows/20267-query-and-edit-unopim-product-catalogs-with-openai-gpt-4o-and-slack)，本站未导入）：

1. 自托管 n8n。在 Settings → Community nodes 安装 `n8n-nodes-unopim`
2. UnoPim 3.0 或更新，并已安装 n8n connector package
3. 在 UnoPim 打开 Configuration → Integrations → API Keys 建一把 key。凭证要的四个值来自同一行。URL 填应用根，模板举例 `https://demo.unopim.com`，不是后台地址
4. OpenAI 凭证能调用 `gpt-4o`
5. 准备一张 Google Sheet、一个 Linear team、一个 Slack 频道
6. 先把凭证指到 **staging** UnoPim。模板写系统消息要求写之前确认，因为这把凭证可以打到正式目录

跟做（模板 “How it works”，未在本站跑通）：

1. Chat Trigger 打开团队可用的聊天窗口，使用者不必会 n8n
2. Settings 节点集中放 locale、channel、read-only switch。先保持只读，问一个已有 SKU
3. Agent 使用六个工具：List products（浏览目录）、Look up a product（按 SKU 读全量）、Update a product（PATCH 写回）、List attributes、List families、Look up a configurable product（变体在另一端点，按 code 而不是 SKU）
4. 任何写操作之前先查 attributes 与 families
5. Agent 每条回复以 STATUS 块结束，写出 SKU、字段、旧值、新值、原因。Code 节点解析该块，后面的路由不靠模型再选工具
6. Switch：changed → 回读该 SKU → 前后值追加到 Google Sheet（带 confirmed 标记）→ 发到 Slack；unresolved → 开 Linear issue，而不是编一个值；answered → 直接回到聊天
7. 窗口记忆保留最近十五条消息。要改记忆长度或换模型，按模板 Customization，而不是在生产目录上试

## 预期结果与失败限制

**预期（模板描述）：**

- 只读问答不改目录；关掉只读并明确要求后，按字段 PATCH
- 写成功的判断是回读到，而不是模型自称已改
- 变更进 Sheet 和 Slack；缺口进 Linear
- Update a product 用 PATCH 而不是 PUT，模板写它不能整行替换一条记录
- 声称已改但回读不到时，变更日志记为 not found

**失败与边界：**

- n8n Cloud 装不了该社区节点，模板写明 self-hosted only
- 系统消息可以被改掉。模板提醒分享聊天前先读系统消息，否则 Agent 可能写出你没批准的内容
- Slack／Linear／Sheet 可换成别的节点；换掉它们不改变 Agent 怎么调用 UnoPim，但也不自动变成审批流
- 可配置商品用 code，用 SKU 去查变体端点会走错（模板如此区分）
- 模板页没有给出节省工时或错误率。本页不补
- 本站**未**导入画布、**未**执行、**未**打开模板里的视频便签

## 来源与核验状态

**官方模板**

- 主链：[n8n #20267 — Query and edit UnoPim product catalogs with OpenAI GPT-4o and Slack](https://n8n.io/workflows/20267-query-and-edit-unopim-product-catalogs-with-openai-gpt-4o-and-slack)
- 作者 UnoPim，username `dripar-webkul`。模板 API `createdAt` 为 2026-10-01。简介称 UnoPim 为开源 PIM
- 相关但**不是本条**：[#19443 — Sync UnoPim product catalogs to Shopify](https://n8n.io/workflows/19443-sync-unopim-product-catalogs-to-shopify-and-log-results-in-sheets-slack-and-jira/)（同作者，createdAt 2026-09-10）。本站不为它另写文件，也未导入
- 采编：2026-10-25（Asia/Shanghai）。Lab 未重跑工作流

## 据公开帖摘要

模板 Quick overview：这是 UnoPim 目录的聊天窗口。GPT-4o Agent 用六个 UnoPim 工具回答问题并写回目录。工作流自己路由每条回复：写入会从 UnoPim 回读以确认落地，记入 Google Sheet，并在 Slack 宣布；Agent 无法解析的事项开一张 Linear issue。

How it works 还写到：Chat Trigger 给团队一个不用懂 n8n 的窗口；Settings 放 locale、channel 与只读开关；系统消息教 Agent UnoPim 如何存数据；List attributes 与 List families 在写入前检查，避免编造属性代码或漏掉 family 必填字段；可配置商品走按 code 的另一端点；记忆为最近 15 条；回复末尾的 STATUS 块含 SKU、字段、旧值、新值、原因，由 Code 节点解析后再 Switch。

Setup／Requirements：社区节点 `n8n-nodes-unopim`，仅自托管；UnoPim 3.0+ 且装有 n8n connector；OpenAI key 须能用 gpt-4o；Google Sheets、Linear、Slack 分别承担变更日志、issue 和通知。Additional info：先指向 staging；PATCH 而非 PUT；画布便签里嵌了视频讲解。

## English brief

n8n template 20267 (UnoPim, created 2026-10-01) is a chat window over an UnoPim catalog. A GPT-4o tool-calling agent has six tools: list products, look up a product, PATCH an update, list attributes, list families, and look up a configurable product by code. Locale, channel, and a read-only switch sit on a Settings node. Writes are trusted only after a read-back, then logged to Google Sheets and announced in Slack; unresolved gaps become Linear issues. Keep the read-only switch on until a person enables writes. Slack and Linear are notifications, not approvals. A separate template, 19443, syncs UnoPim to Shopify and is out of scope here. Lab did not import the workflow.
