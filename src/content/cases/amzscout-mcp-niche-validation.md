---
title: "AMZScout Skill+MCP：用真实市场数据做 Niche 与竞品研究"
titleEn: "AMZScout Skill + MCP for niche & competitor research"
summary: "据 GitHub README：托管 MCP 把 AMZScout 市场情报接到 Claude/ChatGPT/Cursor，覆盖选品、关键词、Listing 与 PPC 规划提示。"
summaryEn: "GitHub README: hosted MCP endpoint feeds structured Amazon intelligence into Claude/ChatGPT/Cursor."
category: sourcing
agents: ["Claude", "ChatGPT", "Cursor"]
tools: ["AMZScout MCP"]
source: GitHub
sourceUrl: https://github.com/amzscout-corp/amzscout-skill-mcp
sourceType: public
date: 2026-10-01
dateNote: "约；以仓库现文为准"
featured: false
prompt: |
  Using AMZScout MCP tools, validate this niche idea: [describe product].
  Return: demand vs competition signals, top competitors, keyword opportunities, and listing optimization gaps.
  Label every number as tool-sourced. Do not fabricate BSR or sales.
---

## 据公开帖摘要

官方仓库写明远程 Streamable HTTP MCP（`chatbot.amzscout.net/mcp`），能力表含 Product Discovery、Niche Validation、Competitor Research、Keyword、Listing Optimization、PPC Planning 等；并附 Prompt 库示例。AI 输出仅供参考，需人工复核。
