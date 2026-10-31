---
title: "Kuudo：基于 SP-API 的 Seller Central MCP（私有 beta，多 marketplace）"
titleEn: "Kuudo: Selling Partner MCP on SP-API (private beta, multi-marketplace)"
summary: "据 Kuudo 功能页（schema dateModified 2026-10-22）与 GitHub KuudoAI/amazon-selling-partner-mcp：第三方 Managed／Private Cloud MCP，把 Selling Partner API 操作映射成 Agent 工具（订单、Listing、定价、FBA、报表等），页内称 341 operations、40+ services、22 marketplaces；与亚马逊官方 Claude／Quick 卖家插件对照做了 token 体积测量（页内 2026-10-22）。仓库公开；产品写 Explore the private beta。本站 2026-10-31 只读公开页与 README，未申请 beta、未授权 LWA、未调用工具。"
summaryEn: "Per Kuudo’s feature page (schema dateModified 2026-10-22) and GitHub KuudoAI/amazon-selling-partner-mcp: a third-party Managed/Private Cloud MCP that maps Selling Partner API operations into agent tools (orders, listings, pricing, FBA, reports, etc.). The page claims 341 operations, 40+ services, and 22 marketplaces, and publishes a 2026-10-22 token-footprint comparison vs Amazon’s official connector. The repo is public; the product invites a private beta. Lab on 2026-10-31 read public pages and the README only — no beta, no LWA, no tool calls."
category: ops-finance
agents: ["Claude", "ChatGPT", "Claude Code", "Cursor", "Gemini", "n8n", "Make"]
tools: ["Kuudo Selling Partner MCP", "SP-API", "github.com/KuudoAI/amazon-selling-partner-mcp"]
source: 官网
sourceUrl: https://www.kuudo.com/features/amazon-selling-partner-mcp/
sourceType: public
date: 2026-10-31
dateNote: "2026-10-31（Asia/Shanghai）采编 https://www.kuudo.com/features/amazon-selling-partner-mcp/ （页内 JSON-LD dateModified=2026-10-22）与 https://github.com/KuudoAI/amazon-selling-partner-mcp README。未点 Request beta、未创建 Kuudo 密钥、未 LWA、未 tools/list 远程端点。"
featured: false
prompt: |
  You work on one Amazon seller account through Kuudo Selling Partner MCP
  only. Prefer read-only questions until the operator enables writes.

  Question: {{question}}
  Marketplace the operator named: {{marketplace}}

  Rules:
  1) Use only Kuudo SP tools the connector exposes. If a tool is missing
     or errors, say so. Do not invent order, inventory, fee, or Buy Box
     figures.
  2) Name the seller account and marketplace before any write. Preview
     listing patches field-by-field and wait for explicit approval in chat
     before submit — match the page's "never auto-submit" skill guidance.
  3) Never ask for Seller Central passwords, LWA refresh tokens, or Kuudo
     API keys in chat.
  4) Do not treat this as Amazon's first-party Claude Selling Partner
     connector (sellingpartner-ai.amazon.com). Kuudo is a third-party MCP.
  5) Ads work needs Kuudo Ads MCP or another Ads surface — do not pretend
     SP tools change Sponsored ads.
  6) Private beta and seat/plan limits are product terms — confirm in
     Kuudo before promising access.
---

## 解决什么问题

卖家或代理想在 Claude／ChatGPT／Cursor 里直接问订单、库存、Listing、费用，又不想自己维护一整套 SP-API 客户端。Kuudo 公开页把这条路径写成：**在官方 Selling Partner API 之上的 MCP**，Managed MCP 或 Private Cloud 部署；Agent 调工具，人仍保留审批与限额。

页内强调与**亚马逊官方**卖家连接器的差异：官方插件面向 Claude／Amazon Quick 等其选择的客户端；Kuudo 宣称任意 MCP 客户端、多 marketplace、以及更小的入口工具定义体积（页内 2026-10-22 测量方法说明）。

与站内相近篇错位：

- [亚马逊卖家插件](/cases/amazon-selling-partner-claude-plugin/)／[Agentic Toolkit](/cases/amzn-selling-partner-agentic-toolkit/)：亚马逊一方。Kuudo 是第三方，GitHub `KuudoAI/amazon-selling-partner-mcp`。
- [DataDoe](/cases/datadoe-amazon-seller-vendor-ads-mcp/)：Seller＋Vendor＋Ads 同一远程 MCP。Kuudo 本页主讲 Selling Partner／Seller Central；广告另有 Ads MCP 产品线（页内交叉销售）。
- [amzn-sp-api-local-mcp](/cases/amzn-sp-api-local-mcp/)：社区／示例向本地 MCP。Kuudo 是商业 Managed／Private Cloud 包装。

## 人审闸门（必须人工确认）

1. **写入 Listing、价格、发货、买家消息、Feed** — 须人在聊天或产品流程中明确批准；先读后写。
2. **申请／开通 private beta、付费档、席位与组织** — 页内有 Pro／Scale 席位表述；须账号所有人批。
3. **LWA／Kuudo API key／OAuth 材料进聊天** — 禁止。
4. **把页内 341 operations、22 markets、token 对比数字写成亚马逊官方指标** — 禁止；那是 Kuudo 页内测量与产品声称。
5. **在未授权 marketplace 上改货** — 先确认账号参与的站点。

## 可复现步骤

前置（公开材料；本站未申请 beta）：

1. 可读功能页与 GitHub README
2. 要实机：按页内「Explore the private beta」／Managed MCP 或 Private Cloud 指引拿到服务 URL 与认证，并完成卖家 LWA 授权
3. 在 ChatGPT／Claude／Claude Code／Cursor 等客户端添加自定义 MCP（页内分客户端说明）

跟做（只读公开材料）：

1. 打开 [功能页](https://www.kuudo.com/features/amazon-selling-partner-mcp/)
2. 对照 GitHub [KuudoAI/amazon-selling-partner-mcp](https://github.com/KuudoAI/amazon-selling-partner-mcp) 与 Registry 名 `io.github.KuudoAI/amazon-selling-partner-mcp`（页内写法）
3. 先只跑只读问题（订单、库存、报表），确认账号与 marketplace 名称
4. 写操作前按页内 Skill 指引：预览字段、等人说 yes，再提交
5. 需要广告时走单独的 Ads MCP，不要假设 SP 工具能改竞价

## 预期结果与失败限制

**预期（页面声称）：**

- **341** Selling Partner API operations、**40+** services，映射为 MCP 工具
- 区域：NA／EU／APAC；页内列举 **22** marketplaces
- 部署：Managed MCP 或 Private Cloud
- 入口定义体积对比（页内 2026-10-22，cl100k_base）：官方连接器入口约 **3,794** tokens vs Kuudo 约 **478** tokens（测量范围见页内说明，不是一次真实任务账单）

**失败／边界：**

- **Private beta** — 无邀请则可能连不上
- 本站未授权，不能复述任何真实卖家数据
- 写权限受卖家角色与 Kuudo 配置约束；限制检查失败时应停
- Vendor Central 深度能力以 Kuudo 其他页为准；本条 sourceUrl 是 Selling Partner／Seller 功能页

## 来源与核验状态

**公开可核验**

- 主链：[Kuudo Amazon Selling Partner MCP](https://www.kuudo.com/features/amazon-selling-partner-mcp/)
- 辅链：[GitHub KuudoAI/amazon-selling-partner-mcp](https://github.com/KuudoAI/amazon-selling-partner-mcp)
- 采编：2026-10-31（Asia/Shanghai）。**未** beta、**未** LWA、**未**远程 tools/list。

## English brief

Kuudo documents a third-party Selling Partner MCP on SP-API (private beta; Managed or Private Cloud), claiming 341 operations across 22 marketplaces and publishing a 2026-10-22 token comparison vs Amazon’s official connector. Lab read the public page and GitHub README only — no beta access, no live seller calls.
