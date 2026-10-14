---
title: "ChatGPT + Tariff Code Compliance：用版本化税则证据做 HS/HTS 研究"
titleEn: "ChatGPT Tariff Code Compliance plugin for versioned HTS research"
summary: "据 Tariff Code Compliance 公开文档：在 ChatGPT 接插件/MCP，对当前税则版本做归类研究、引用证据与否决项；结果为非约束性研究，不可当报关裁定。"
summaryEn: "Public docs: ChatGPT plugin/MCP for tariff research against versioned evidence; non-binding research only."
category: logistics
agents: ["ChatGPT"]
tools: ["Tariff Code Compliance", "HTS / tariff graph"]
source: 官网
sourceUrl: https://www.tariffcodecompliance.com/docs/chatgpt
sourceType: public
date: 2026-09-01
dateNote: "约；文档页未标精确发布日，以现文为准"
featured: false
prompt: |
  Product for import research (not a filing):
  Description: [materials, function, how sold]
  Destination: [country]
  Using connected Tariff Code Compliance tools when available:
  1) Confirm account/tariff system and the exact schedule version used
  2) Propose candidate codes with reasoning, rejected alternatives, and customer-facing source links
  3) List missing facts that would change the heading
  4) If coverage unavailable, say so — do not invent a code or swap tariff versions
  Label output as non-binding research; a licensed broker/importer must review before entry.
---

## 据公开帖摘要

文档说明可在 ChatGPT Business & Operations 安装公开插件，或经 Developer mode 接 MCP（`api.prod.tariffcodecompliance.com/.../mcp`）。能力覆盖税则研究、关税估算与海关研究；要求输出写明税则体系与版本、证据链接、假设与不确定点。明文写：结果是非约束性研究支持，不是法律意见或 binding ruling；工具只读税则证据，不写目录、不代申报。
