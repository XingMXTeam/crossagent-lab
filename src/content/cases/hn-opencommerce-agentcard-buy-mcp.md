---
title: "HN：Opencommerce／Agentcard 给购物 Agent 一条 buy MCP（跨店下单须人确认）"
titleEn: "HN: Opencommerce / Agentcard — one buy MCP for shopping agents (human confirm before checkout)"
summary: "据 Show HN（keyserfaty，item 50304532，2026-10-30T14:35:29Z）与 opencommerce.sh：Opencommerce（Agentcard）宣称用单一 buy 工具覆盖搜索、购物车、结账与订单跟踪，覆盖约 5,000+ 网店（首页写 5,026），用户批准后才由 Agentcard 下单。本站 2026-10-31（Asia/Shanghai）匿名 POST https://mcp.agentcard.sh/mcp initialize → HTTP 200，serverInfo.name=AgentCard、version=1.0.0；tools/list 可见工具名 buy。未完成 OAuth，未下单。"
summaryEn: "Show HN (keyserfaty, item 50304532, 2026-10-30T14:35:29Z) and opencommerce.sh: Opencommerce by Agentcard claims one buy tool for search, cart, checkout, and order tracking across 5,000+ stores (homepage shows 5,026), with Agentcard placing the order only after user approval. Lab anonymous POST to https://mcp.agentcard.sh/mcp on 2026-10-31 (Asia/Shanghai): initialize HTTP 200, serverInfo.name=AgentCard, version=1.0.0; tools/list exposes a buy tool. No OAuth, no purchase."
category: ops-finance
agents: ["Claude", "Claude Code", "Cursor", "custom agent", "AI SDK"]
tools: ["Agentcard MCP", "https://mcp.agentcard.sh/mcp", "buy", "@agent-cards/commerce-sdk", "npx agent-cards"]
source: Hacker News
sourceUrl: https://news.ycombinator.com/item?id=50304532
sourceType: public
date: 2026-10-31
dateNote: "HN Show HN 标题 Show HN: Opencommerce – OpenRouter for commerce, one API for AI agents to buy，作者 keyserfaty，item 50304532，url https://opencommerce.sh，Firebase time 1793370929 = 2026-10-30T14:35:29Z。2026-10-31（Asia/Shanghai）采编该帖、https://opencommerce.sh/ 、https://chat.opencommerce.sh/ 、https://www.agentcard.sh/ 。同日匿名 POST https://mcp.agentcard.sh/mcp initialize → HTTP 200（protocolVersion=2025-03-26，serverInfo.name=AgentCard，version=1.0.0；instructions 称调用工具需经 OAuth 连接 Agentcard 账号）；tools/list → 工具名 buy（自然语言 request／conversation_id，结账须用户后续明确确认）。npm @agent-cards/commerce-sdk 当时 latest 0.18.6。未 OAuth、未调用 buy、未付费、未下单。HN 分数／评论会变（发现时 score 1、descendants 1）。"
featured: false
prompt: |
  You help a shopper research purchases through Agentcard Opencommerce MCP
  at https://mcp.agentcard.sh/mcp only. You do not charge a card yourself.

  Ask: {{purchase_request}}
  conversation_id if continuing: {{conversation_id_or_empty}}

  Rules:
  1) Use only the buy tool on that MCP. Pass the user's words in request.
     Keep the same conversation_id on follow-ups. Do not invent cart lines,
     prices, merchants, or tracking numbers the tool did not return.
  2) Checkout that charges a one-time card happens ONLY after the shopper
     explicitly confirms in a later message. Relay confirmations verbatim
     on the same conversation_id. Never rewrite "yes" into a fresh order
     command.
  3) If initialize or a tool returns an OAuth / authorization challenge,
     stop and tell the operator to finish Agentcard OAuth in the client.
     Do not ask for passwords, card PANs, or client secrets in chat.
  4) new_order / dropping conversation_id is only for an unrelated new
     order the shopper asked for — never to recover from an error.
  5) Do not treat Opencommerce as a seller-ops MCP. It does not manage
     Seller Central, Amazon Ads, or Shopify Admin inventory.
  6) Store counts (about 5,000 / homepage 5,026) and "under 20 seconds"
     are source claims from the 2026-10-30 Show HN / homepage. Do not
     promise them as Lab benchmarks.
---

## 解决什么问题

做「帮用户买东西」的 Agent 时，逐店接 Admin API、或靠浏览器点结账，成本都高。Show HN 与 opencommerce.sh 的公开说法是：Agentcard 的 Opencommerce 给 Agent **一条 buy 工具**——搜索、加购、结账、跟踪走同一条链路；商家集成与浏览器自动化由对方承担；**真正扣款的结账要等人确认**。

这是**买家侧／购物 Agent** 用例，不是卖家后台运营 MCP。与站内相近篇错位：

- [Agora 统一货盘](/cases/hn-agora-universal-catalog-agents/)：跨店发现与结账契约（REST／`/agent` DOM）。本条核验重点是 Agentcard 远程 MCP `buy` 与「人确认后再下单」的公开表述。
- [Kifly](/cases/hn-kifly-agent-commerce-mcp/)、[ShopsForBots](/cases/shopsforbots-agent-ready-shops-mcp/)：店／目录向 Agent 暴露。Opencommerce 自称覆盖约五千家已监测店，用一条 buy。
- [Shop MCP／Checkout WebMCP](/cases/hn-shopify-checkout-webmcp/)：Shopify 官方结账协议。本条是第三方 Agentcard 端点。

## 人审闸门（必须人工确认）

1. **完成付款／绑定支付方式** — tools/list 写明 checkout 会开一次性卡，且只在用户后续明确确认后发生。任何人用 Agent 下单须本人确认。
2. **开通 Agentcard／Opencommerce 账号与计费** — 首页 Standard 写完成订单收 **1%**；Enterprise 另议。须账号所有人批。
3. **把 clientId／clientSecret／OAuth token 贴进聊天或仓库** — 禁止；只放本机客户端或服务端环境变量。
4. **把「约 5,000+ 店」「5,026」「under 20 seconds」写进对外 SLA** — 须标注为来源自述；本站未压测全量店与时延。
5. **把 Opencommerce 当成 Seller Central／Shopify Admin 写库存或改价** — 禁止；公开材料讲的是购物 Agent 买货。

## 可复现步骤

前置：

1. 可读 [HN item 50304532](https://news.ycombinator.com/item?id=50304532) 与 [opencommerce.sh](https://opencommerce.sh/)（无需账号）
2. 要真实下单：Agentcard 账号与 OAuth；支付方式按对方产品流程由人配置（**不要**把密钥贴进聊天）
3. 支持远程 HTTP MCP 的客户端，或按首页示例使用 `@agent-cards/commerce-sdk`／`npx agent-cards@latest init`

跟做（公开材料 + 本站匿名探活；**未** OAuth、**未**下单）：

1. 打开 HN `item?id=50304532`。帖文链到 `https://opencommerce.sh`。作者评论链到无注册演示 `https://chat.opencommerce.sh/`。
2. 远程 MCP：`https://mcp.agentcard.sh/mcp`（Streamable HTTP；对 GET／SSE 返回「Use POST /mcp」）。
3. 匿名 `initialize` → HTTP 200，`serverInfo.name=AgentCard`，`version=1.0.0`；instructions 称调用工具需 OAuth。
4. 匿名 `tools/list` → 工具名 **`buy`**：自然语言 `request`，多轮用同一 `conversation_id`；结账须用户后续明确确认后再经 `request` 原样回传。
5. SDK 路径（首页示例，本站未执行安装）：`import { AgentcardClient, buyTool } from "@agent-cards/commerce-sdk"`。npm 当时 latest **0.18.6**。
6. **不要**在验证流程里提交真实付款。

## 预期结果与失败限制

**预期（来源自述 + 本站匿名返回）：**

- 一条 `buy` 工具覆盖对方已接入商家的自然语言购物流
- 结账默认等人确认；Agentcard 侧处理下单
- 首页展示监测表与约 **5,026** 店；Show HN 写 **5,000+**、搜索到购买「under 20 seconds」
- 匿名即可看到 MCP 握手与工具名；真实购物需 OAuth

**失败／边界：**

- 未 OAuth 时不能完成真实购物；本站未调用 `buy`
- 未接入或监测失败的店，Agent 仍可能买不到
- HN 分数／评论会变；勿把低分讨论当效果证明
- 与卖家运营、广告、跨境报关 MCP 不是同一产品面

## 来源与核验状态

**公开可核验**

- 主链：[HN item 50304532](https://news.ycombinator.com/item?id=50304532) → [opencommerce.sh](https://opencommerce.sh/)（Show HN 2026-10-30）
- 辅链：[chat.opencommerce.sh](https://chat.opencommerce.sh/)、[agentcard.sh](https://www.agentcard.sh/)、MCP `https://mcp.agentcard.sh/mcp`
- 采编／探活：2026-10-31（Asia/Shanghai）。店数与时延为来源自述；本站只核验匿名 initialize／tools/list。

## 据公开帖摘要

Hacker News Show HN（`item?id=50304532`，作者 keyserfaty，2026-10-30T14:35:29Z）标题为 “Show HN: Opencommerce – OpenRouter for commerce, one API for AI agents to buy”。帖文称：给购物 Agent 一条 buy 工具，覆盖搜索、购物车、结账与订单跟踪，约 **5,000+** 网店；无需自建商家集成或跑 Agent 浏览器；用户批准后由 Agentcard 下单；并称搜索到购买可在 20 秒内；监测结果公开在 opencommerce.sh。创始人评论给出无注册演示 chat.opencommerce.sh。

## English brief

Show HN (2026-10-30) launches Opencommerce by Agentcard: one `buy` MCP/API for agents across 5,000+ stores, human approval before Agentcard places the order. Lab (2026-10-31 Asia/Shanghai) verified anonymous initialize/tools/list on `https://mcp.agentcard.sh/mcp` (AgentCard 1.0.0, tool `buy`). No OAuth and no purchase. Treat store counts and latency as source claims.
