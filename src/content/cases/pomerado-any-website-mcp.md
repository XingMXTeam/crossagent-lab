---
title: "Pomerado：把无官方 API 的网站变成托管 MCP 工具"
titleEn: "Pomerado: turn websites without an official API into hosted MCP tools"
summary: "据 pomerado.ai、YC 与 Product Hunt 公开页：YC F26 把任意网站做成托管 API／MCP；Free 100 次调用／天，Premium $50／月。Keyless MCP（mcp.pomerado.ai/mcp/keyless）可 find／run 只读工具。2026-10-24 本站用 keyless 对 Best Buy 跑通一次只读商品搜索（job succeeded；返回 SKU／价／链接以工具输出为准）。"
summaryEn: "Public pomerado.ai + YC + Product Hunt: YC F26 turns sites into hosted API/MCP; Free 100 calls/day, Premium $50/mo. Keyless MCP supports find/run read-only tools. Lab 2026-10-24: one successful Best Buy read-only product search via keyless (job succeeded; SKU/price/URLs as returned)."
category: ops-finance
agents: ["Claude", "Cursor", "Codex"]
tools: ["Pomerado MCP", "mcp.pomerado.ai/mcp/keyless", "find_website_tool", "run_read_only_website_tool"]
source: 官网
sourceUrl: https://pomerado.ai/
sourceType: public
date: 2026-10-16
dateNote: "Product Hunt 公开页标 Launched／#5 Day（约 2026-10-16）；YC 公司页 Batch Fall 2026；定价与 keyless 探针于 2026-10-24（Asia/Shanghai）核对"
featured: false
prompt: |
  You help a cross-border operator connect an agent to a public website that has no official MCP/API.
  Pomerado MCP is already configured (prefer keyless for demos: https://mcp.pomerado.ai/mcp/keyless).

  Task site / goal: {{site_or_task}}
  Mode: READ ONLY unless the user explicitly approves a write.

  Rules:
  1) Call find_website_tool with a clear intent sentence, then run_read_only_website_tool for read effects.
     Use run_website_tool only after explicit human approval.
  2) Never invent listings, rates, or tracking events. Quote tool output only.
  3) Never paste passwords, TOTP seeds, or durable tokens into chat. Use Pomerado answer_url flows for logins.
  4) If maintenance.status is repairing, keep polling get_job — do not cancel or restart blindly.
  Output: (a) tools/job ids used, (b) structured results table, (c) ACTIONS REQUIRING HUMAN APPROVAL
  before any write, login save, or booking.
---

## Lab 探针成品（先看结果）

**方法：** keyless · 无登录 · 2026-10-24（Asia/Shanghai）  
**端点：** `https://mcp.pomerado.ai/mcp/keyless`

| 探针 | 结果 |
|------|------|
| `initialize` 后 `tools/list` | 可见 `find_website_tool`、`run_read_only_website_tool`、`get_job` 等 |
| keyless 只读 Best Buy「USB-C hub」，zip `94105`，limit 2 | job `job_03cb9e74b667e72386ce73c5eb0d4263` · `status=succeeded` · `total_results=543` · 样例商品名含 Belkin 5-Port Hub · `price_minor=2499`（USD cents）· 带 `product_url`（以该次工具输出为准） |

**本站未跑：** 登录态；写操作（下单、预约、提交表单、改账户）；承运商轨迹页专项。官网／YC「7x faster」「100x cheaper」**不是**本站基准测试。

> 人审提醒：价格与库存以该次工具输出和来源页为准，不得直接写入客户报价。闸门见「人审闸门」。

## 解决什么问题

跨境运营里大量承运商后台、卖家门户、消费站**没有官方 MCP／稳定公开 API**，Agent 只能靠浏览器点选，慢且易碎。Pomerado 宣称把任意网站做成**托管、可复用的 deterministic 工具**，经 MCP 给 Claude／Cursor／Codex 等调用，适合「无官方 API 怎么接 Agent」的对照用例。

与站内 Easyship／Ship 类「厂商自建 MCP」不同：那些是官方物流／购物 API 的 MCP 封装；Pomerado 侧重**网站 → 工具**的生成与托管。与 Avalara／Gateway Lines 关税库也不同：本篇不讲税则内容，只讲连接层。

## 人审闸门（必须人工确认）

1. **任何会改网站状态的调用**（下单、预约、提交表单、改账户）— 只用 `run_website_tool` 且须人确认；演示默认 `run_read_only_website_tool`
2. **保存网站登录／2FA 到 Pomerado** — 须人在其 answer_url／控制台完成，禁止把密码贴进对话
3. **把工具返回的价格／库存／轨迹当成交承诺写进客户报价** — 须人工复核来源页
4. **取消处于 maintenance repairing 的 job** — 公开说明勿取消，以免无结果结束
5. **为「新站点」触发 build_website_tool 若会消耗付费档额度** — 先核对 Free／Premium 限额再跑

## 可复现步骤

前置：

1. MCP 客户端支持远程 HTTP MCP
2. **试用（官网 setup prompt）：**  
   `https://mcp.pomerado.ai/mcp/keyless`（Claude Code 示例：`claude mcp add --transport http pomerado https://mcp.pomerado.ai/mcp/keyless`）
3. 或账号 MCP：`https://mcp.pomerado.ai/mcp` 后浏览器登录（见 [docs getting-started](https://docs.pomerado.ai/getting-started)）
4. 定价公开页：Free **$0**／月 — **100** tool calls／天、**10** new integrations／月；Premium **$50**／月 — **1,000** calls／天、**100** integrations／月；Business Contact us

跟做（keyless 只读演示，本站 2026-10-24 已跑通一条）：

1. `initialize` 后 `tools/list` — 可见 `find_website_tool`、`run_read_only_website_tool`、`get_job` 等
2. `find_website_tool`：带必填 **intent**（一句话说明用途）与任务描述
3. 对返回的 **read** 工具调用 `run_read_only_website_tool`（传入 `tool_id` 与 input）
4. 若返回 job：按需 `get_job` 直至 `status=succeeded`／failed；结果一次性发放
5. 人工打开 `product_url`／站点页核对；需要写操作时再单独审批

## 预期结果与失败限制

**预期：**

- find 返回已有集成工具目录项（含 site url、effect=read／write、input_schema）
- 只读 run 返回结构化字段（以该工具 schema 为准）
- 本站示例（keyless，Best Buy「USB-C hub」，zip `94105`，limit 2）：job `job_03cb9e74b667e72386ce73c5eb0d4263`，`status=succeeded`；工具返回 `total_results=543`；样例商品名含 Belkin 5-Port Hub，`price_minor=2499`（USD cents），带 `product_url`（**以该次工具输出为准，不是本站手工编造的目录价**）

**失败／边界：**

- 缺 `intent` → `invalid_request`
- 无现成工具时需 `build_website_tool`（可能更慢、受套餐限额约束）
- 营销数字「7x faster」「100x cheaper」来自官网／YC 文案，**不是**本站基准测试
- Keyless 与登录账号的额度／权限可能不同；以控制台与文档为准

## 来源与核验状态

**公开可核验**

探针表见文首「Lab 探针成品」；此处保留主链接与采编说明。

- 产品：[pomerado.ai](https://pomerado.ai/)（定价 Free／Premium／Business；keyless setup prompt）
- YC：[ycombinator.com/companies/pomerado](https://www.ycombinator.com/companies/pomerado)（Batch **Fall 2026**，Active）
- Product Hunt：[producthunt.com/products/pomerado](https://www.producthunt.com/products/pomerado)（公开标 **#5 Day**；第三方 launch 索引记 2026-10-16 上市）
- 文档：[docs.pomerado.ai/getting-started](https://docs.pomerado.ai/getting-started)
- 联系（Terms／公开资料常见）：`founders@pomerado.ai`
- 采编／探针：2026-10-24（Asia/Shanghai）。**本站完成 1 次 keyless 只读 Best Buy 搜索**；未测登录态、未测写操作、未测承运商轨迹页专项。

## 据公开帖摘要

Pomerado（YC F26）在官网定位为：把 legacy portals、consumer sites、internal tools 转为托管 API／MCP，强调比浏览器 Agent 更快／更便宜、自愈集成、代管登录与 2FA。定价页写明 Free（100 calls／天）与 Premium（$50／月）。官网 setup prompt 给出 keyless MCP URL，并建议先用 read-only 任务验证。

Product Hunt 产品页显示 Day Rank #5；YC 公司页确认 Fall 2026 batch。本站不重复站内已有的 Gateway Lines／Agent Stack Directory 条目；本篇只覆盖「无官方 API → Pomerado 工具」连接层。

## English brief

Pomerado (YC F26) hosts MCP tools generated from websites that lack first-party APIs. Public pricing lists a free tier (100 calls/day) and Premium at $50/mo. On 2026-10-24 the Lab verified keyless MCP and one read-only Best Buy search job that succeeded — use that as a reproducible pattern for seller-portal/carrier-site demos, with HITL before any write.
