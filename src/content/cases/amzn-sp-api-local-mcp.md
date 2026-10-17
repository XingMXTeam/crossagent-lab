---
title: "亚马逊官方 Local MCP：在 Claude／Cursor 里开发 SP-API"
titleEn: "Amazon official Local MCP for SP-API in Claude and Cursor"
summary: "据官方讨论 #382：npm 包同时提供开发助手与工作流两套本地 MCP。助手覆盖文档、目录、示例、迁移与代码审阅；工作流用自然语言拼多步调用。除实调外，多数工具不需要凭证。"
summaryEn: "Official discussion #382: one npm package ships a local SP-API dev assistant and a workflow server. Live calls need LWA; the other tools run without credentials."
category: ops-finance
agents: ["Claude", "Cursor"]
tools: ["@amazon-sp-api-release/sp-api-dev-mcp", "SP-API", "npx"]
source: GitHub
sourceUrl: https://github.com/amzn/selling-partner-api-samples/discussions/382
sourceType: public
date: 2026-10-17
dateNote: "Discussion #382 Last Updated May 2026；2026-10-17 采编"
featured: true
prompt: |
  You are an SP-API integration assistant using Amazon's official local MCP
  (@amazon-sp-api-release/sp-api-dev-mcp). Do not use a third-party SP-API or Ads MCP.

  Goal: {{goal}}
  Language: {{python|java|javascript|csharp|php}}
  Marketplace: {{marketplace_id}}
  Existing code (optional): {{code}}

  1) Use sp_api_reference and sp_api_explore_catalog. Name endpoints, required roles, and parameters you actually retrieved.
  2) Use sp_api_generate_code_sample in the chosen language. Keep SDK method names from the tool output.
  3) If code is pasted, use sp_api_optimize. Group findings by the pillars the tool returns (scheduling, errors, rate limits, batching, pagination, notifications, reports, caching, API modernness).
  4) For a version upgrade, use sp_api_migration_assistant and list breaking changes before any refactor.
  5) Do not call sp_api_execute and do not run a live workflow unless the user explicitly asks and confirms LWA credentials are set locally.
  Output: endpoint list, code sample, open questions, and ACTIONS REQUIRING HUMAN APPROVAL.
---

## 据公开帖摘要

2026-05-28，Selling Partner Developer Services 的解决方案架构师 Tong S. 在 `amzn/selling-partner-api-samples` Discussion #382 发布 Local MCP for SP-API。npm 包 `@amazon-sp-api-release/sp-api-dev-mcp` 里有两台可分开启用的本地服务：`sp-api-dev-assistant-mcp-server` 与 `sp-api-workflow-mcp-server`。客户端用 `npx` 写入 MCP 配置。帖文列出的宿主包括 Claude Desktop、Cursor、VS Code 与 Kiro。运行前提是 Node.js 20 及以上。

开发助手的工具是：`sp_api_reference`（用自然语言检索官方文档）、`sp_api_explore_catalog`（浏览端点的参数、结构与示例）、`sp_api_execute`（带鉴权与签名的实调）、`sp_api_generate_code_sample`（生成 Python、Java、JavaScript、C#、PHP 示例）、`sp_api_migration_assistant`（版本迁移；帖文举例 Orders v0 到 v2026-01-01）、`sp_api_optimize`（按架构要点审阅集成代码）。帖文写明：这些工具在本地运行且不需要凭证，只有 `sp_api_execute` 例外。

工作流服务让开发者用自然语言描述目标。助手选择端点，再用基于 Amazon States Language 的引擎逐步搭流程。帖文列出的状态包括 Task、Choice、Wait、Pass、Succeed 与 Fail。会打到真实 SP-API 的工作流需要凭证。

这是亚马逊官方的开发者 MCP。它和仓库里已有的 Tirnav 第三方「SP-API + Ads」运营 MCP 不是同一产品：这边帮助写集成与示例，不代替卖家账号上的运营连接器。

## 要点

- 一个包、两条启动命令，分别对应开发助手与工作流服务。
- 示例配置把 `SP_API_CLIENT_ID`、`SP_API_CLIENT_SECRET`、`SP_API_REFRESH_TOKEN` 放在环境变量里。只查文档或生成示例时，按帖文可以不填。
- 适合先检索端点、生成 SDK 片段、做版本对照和代码审阅，再决定是否实调。

## 注意

`sp_api_execute` 和带实调的工作流会请求真实 SP-API。不要把生产凭证写进可分享的配置。讨论 Last Updated 为 May 2026，端点名与迁移目标版本以 SP-API 现行文档为准。
