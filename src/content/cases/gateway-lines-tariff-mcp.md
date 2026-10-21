---
title: "Gateway Lines Tariff MCP：持牌海运 NVOCC 的免费关税工具"
titleEn: "Gateway Lines Tariff MCP: free US duty tools from a licensed ocean NVOCC"
summary: "据 Gateway 产品页：持牌海运 NVOCC／货代提供免费 Tariff Calculator MCP（mcp.gatewaylines.com），三个只读工具 landed_cost、classify_hts、policy_changes_since；客人邮箱每周 10 次，运费客户不限次；可装 ChatGPT App Directory。与 Avalara Cross-Border MCP 错位：这边免企业 OAuth，那边需 Avalara 账号。"
summaryEn: "Per Gateway's product page: a licensed ocean NVOCC/freight forwarder offers a free Tariff Calculator MCP at mcp.gatewaylines.com with three read-only tools — landed_cost, classify_hts, policy_changes_since. Guests get 10 lookups per week by email; Gateway freight customers get unlimited. Listed in the ChatGPT App Directory. Differs from Avalara Cross-Border MCP: free carrier MCP vs Avalara account + OAuth."
category: logistics
agents: ["Cursor", "Claude", "ChatGPT", "Claude Code"]
tools: ["Gateway Tariff Calculator MCP", "mcp.gatewaylines.com", "landed_cost", "classify_hts", "policy_changes_since"]
source: 官网
sourceUrl: https://tariff.gatewaylines.com/mcp
sourceType: public
date: 2026-10-19
dateNote: "产品页 schema dateModified=2026-10-19；2026-10-21（Asia/Shanghai）采编并核对端点 HTTP 200；本站未用邮箱或货运账号实测工具调用"
featured: false
prompt: |
  You are a cross-border ops assistant connected to the Gateway Tariff
  Calculator MCP (https://mcp.gatewaylines.com). Guest or freight-customer
  sign-in is handled in the browser by the MCP client. Never ask for
  passwords, API keys, or freight-account credentials in chat.

  Import query (fill only known fields):
  - Product description: {{description}}
  - HTS code if known: {{hts_code}}
  - Country of origin: {{e.g. CN|CA|VN}}
  - Declared value + currency: {{value}}
  - Goal: {{landed_cost | classify_hts | policy_changes_since}}

  Rules:
  1) Use only landed_cost, classify_hts, or policy_changes_since. If a tool
     is missing or returns an error, say so. Do not invent duty rates,
     stacking, or Federal Register citations.
  2) Report figures exactly as returned, including base duty, Section 301 /
     232 / 338 / AD/CVD lines if present, and any "upcoming" effective dates.
  3) If HTS is unknown, prefer classify_hts candidates first. Do not pick a
     code yourself and present it as final classification.
  4) Mark all output as planning estimates from the live engine — not a
     customs ruling. Classification is the importer's responsibility.
  5) If Avalara Cross-Border MCP or Easyship MCP is also connected, you may
     compare rows side by side, but do not buy labels or file entries.
  Output: (a) tool calls used, (b) duty/classification table from the live
  response, (c) open questions, (d) ACTIONS REQUIRING HUMAN APPROVAL
  (classification, customer quotes, booking freight).
---

## 解决什么问题

跨境卖家／进口商发货前要问：这个 HTS 编码从某国进美国，今天要交多少关税？有没有 Section 301／232／338 或 AD/CVD 叠加？下周政策会不会变？

模型训练数据答不准，也给不出 Federal Register 出处。Gateway Lines（自称 FMC-licensed NVOCC 与海运货代）把自家报价用的关税引擎接到 MCP，让 Claude／ChatGPT／Cursor／Claude Code 在会话里查 live 税则，而不是猜。

与站内 [Avalara Cross-Border MCP 用例](/cases/avalara-cross-border-mcp-hs-tariff/) 错位：Avalara 需企业账号 + OAuth，覆盖多国税则库与 PGA 等合规字段；Gateway 是承运商侧免费 MCP，客人邮箱即可试用（每周 10 次），侧重美国进口落地成本与政策变更。与 [Easyship MCP](/cases/easyship-mcp-crossborder-shipping/) 也不同：Easyship 管多承运商比价与面单；Gateway 本 MCP **不**持有货件记录，**不能**进客户账号。

## 人审闸门（必须人工确认）

以下动作不得由 Agent 自动执行：

1. **确定最终 HTS 编码** — 归类由进口商／持牌报关行确认；`classify_hts` 只给候选
2. **把关税数字写进客户报价、商品定价或 DDP 承诺** — 先人工核对返回与适用日期
3. **据工具结果提交报关、申报或决定是否订舱** — 页内写明输出是规划估算，不是海关裁定
4. **在浏览器登录页用货运账号或邮箱完成验证** — 由本人操作；勿把凭证贴进对话
5. **Easyship 侧买面单或约取件** — 沿用 Easyship 用例闸门（若同时接了）

## 可复现步骤

前置（据产品页）：

1. 支持远程 MCP 的客户端：Claude、ChatGPT、Claude Code、Cursor 等
2. 端点：`https://mcp.gatewaylines.com`（2026-10-21 匿名 HEAD 返回 HTTP 200；**不是**工具调用测试）
3. 客人：邮箱验证，每邮箱滚动 7 天 10 次查询，无账号、无卡
4. Gateway 运费客户：登录页选 “I ship with Gateway”，用 `app.gatewaylines.com` 账号，取消周限额

步骤：

1. **ChatGPT**：打开产品页「Install in ChatGPT」（写明已在 OpenAI App Directory 上架）→ Install → 浏览器完成登录／邮箱验证
2. **Claude／Claude Code／Cursor**：Settings → Connectors → Add custom connector；Name 填 `Gateway Tariff MCP`，URL 填 `https://mcp.gatewaylines.com`；**OAuth Client ID／Secret 留空**（页内写 Claude 会自行注册）
3. 确认客户端列出三个只读工具：`landed_cost`、`classify_hts`、`policy_changes_since`
4. 试查落地成本：给出 HTS（或产品描述）、原产国、申报价值，调用 `landed_cost`
5. 无编码时先 `classify_hts`，人工确认候选后再算税
6. 发货前问政策：用 `policy_changes_since` 看新动作、生效日与出处
7. 如同时接了 Avalara 或 Easyship：并排列出，人工判断差异；**不要**把页内示例里的具体税率抄进客户报价（示例仅说明返回结构）

## 预期结果与失败限制

**预期（据产品页描述）：**

- `landed_cost`：美国进口关税与落地成本；含 base duty 及适用的 Section 301／232／338、AD/CVD 等叠加，以及政府费用；可给产品描述代替编码（先返回候选归类，该步写明免费）
- `classify_hts`：按 US Harmonized Tariff Schedule 的候选编码、官方描述与 base duty；候选不是裁定
- `policy_changes_since`：政策变更、费率变化、生效／到期日，各带来源
- 引擎对日期敏感：可同时返回「今天应付」与「已公布、尚未生效」的动作（页内以 Canada Section 338 示例说明结构）

**失败与边界：**

- 客人超 10 次／滚动周 → 需等额度恢复，或改用货运客户账号
- 本站**未**用邮箱或货运账号调用工具，没有真实返回结果；本页**不**把产品页示例里的税率当作实测数据
- 页内声明：数字为规划估算，不是海关裁定；归类是进口商法律责任，入关前应请持牌报关行确认
- 服务器只读关税数据，不持货件、不进客户账号
- HTS 错 → 结果全错；Agent 不替你做最终归类
- 公开材料未写明与 Avalara 的交叉引用或企业合同价：来源未写明

## 来源与核验状态

**公开可核验**

- 主链接：[Gateway Tariff Calculator MCP](https://tariff.gatewaylines.com/mcp)（工具说明、连接步骤、额度、免责声明）
- 端点：`https://mcp.gatewaylines.com`（2026-10-21 匿名 HEAD → HTTP 200）
- schema：产品页 JSON-LD 含 `dateModified":"2026-10-19"`（WebSite／WebApplication）
- 组织联系：同站 Organization schema 列出 `sales@gatewaylines.com`、`support@gatewaylines.com`
- 采编：2026-10-21（Asia/Shanghai）。本站仅采编公开材料，**未实测**工具调用。与 Avalara／Easyship 用例的区别见首节。

## 据公开帖摘要

**产品页（tariff.gatewaylines.com/mcp，采编日仍显示）：**

- 自称：「The first tariff calculator MCP from a licensed ocean freight carrier」；引擎与 Gateway 自用报价同一套，由 FMC-licensed NVOCC／ocean freight forwarder 运营
- 端点：`https://mcp.gatewaylines.com`；ChatGPT App Directory 可一键安装；Claude 等粘贴 URL，OAuth 字段留空
- 三个只读工具：`landed_cost`、`classify_hts`、`policy_changes_since`
- 额度：Guest = 每邮箱滚动 7 天 10 lookups，无账号无卡；Gateway freight customer = unlimited
- 覆盖叙述：base duty + Section 301／232／338／AD/CVD 等；Federal Register 与 CBP 引用写入 payload
- 数据源叙述：USITC Harmonized Tariff Schedule、Federal Register、USTR、CBP guidance；政策变更进 changelog，工具读同一 feed
- 免责：planning estimates，not a customs ruling

**端点核验（本站，2026-10-21）：** 对 `https://mcp.gatewaylines.com` 发 HEAD，HTTP 200；响应头含 `access-control-allow-headers` 等 MCP 相关字段。这只说明端点可达，**不是** `landed_cost` 等工具的实测。

## English brief

Gateway Lines publishes a free Tariff Calculator MCP at `https://mcp.gatewaylines.com` with three read-only tools — `landed_cost`, `classify_hts`, `policy_changes_since` — backed by the same live US tariff engine the carrier uses for freight quotes. Guests get 10 lookups per rolling week via email; Gateway freight customers get unlimited. It is listed in the ChatGPT App Directory; Claude/Cursor connect by pasting the URL with OAuth fields blank. Pair conceptually with Avalara Cross-Border MCP (enterprise account + OAuth, broader compliance library) and Easyship MCP (rates/labels). This Lab page cites the public product page (`dateModified` 2026-10-19) and a 2026-10-21 anonymous endpoint check only — **no authenticated tool calls**. A human confirms HTS classification and any customer-facing duty figure.
