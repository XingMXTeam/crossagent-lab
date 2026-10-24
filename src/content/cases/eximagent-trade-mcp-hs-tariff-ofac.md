---
title: "EximAgent 贸易 MCP：在 Cursor／Claude 里查 HS、关税、OFAC 并找进口商"
titleEn: "EximAgent trade MCP: HS codes, tariffs, OFAC screening, and importer discovery in Cursor/Claude"
summary: "据 EximAgent 公开 connectors／MCP 文档与 Compliance 页：托管 MCP（https://mcp.eximagent.ai/mcp，Streamable HTTP）经 OAuth 2.1 + Google 登录接入 Claude／Cursor／ChatGPT／Codex；同一账号可查 HS、走廊关税／remedies、OFAC SDN 筛名（advisory），并按报关记录找进口商。新账号有免费 credits；付费数据请求扣同一余额。本站未做 Google OAuth，未实测工具返回。"
summaryEn: "Per EximAgent's public connectors/MCP docs and Compliance page: the hosted MCP at https://mcp.eximagent.ai/mcp (Streamable HTTP) connects via OAuth 2.1 + Google sign-in to Claude/Cursor/ChatGPT/Codex. The same account can look up HS codes, corridor duties/remedies, OFAC SDN name screens (advisory), and find importers from shipment records. New accounts get free credits; paid data requests draw the same balance. This Lab page did not complete Google OAuth and made no live tool calls."
category: logistics
agents: ["Cursor", "Claude", "Claude Code", "ChatGPT", "Codex"]
tools: ["EximAgent MCP", "mcp.eximagent.ai/mcp", "hscode search", "tariff", "sanctions check", "search run", "OFAC SDN"]
source: 官网
sourceUrl: https://eximagent.ai/docs/integrations/mcp
sourceType: public
date: 2026-10-24
dateNote: "公开页未标独立发布日；2026-10-24（Asia/Shanghai）采编并核对 connectors、MCP 文档、agents 指南、Compliance 产品页与定价页；匿名 HEAD mcp.eximagent.ai/mcp → HTTP 401 + OAuth 元数据；本站未完成 Google OAuth，未调用任何工具"
featured: false
prompt: |
  You are a cross-border trade / compliance assistant connected to the
  EximAgent hosted MCP (https://mcp.eximagent.ai/mcp). OAuth 2.1 + Google
  sign-in is handled by the MCP client. Never ask for passwords, tokens,
  or API keys in chat.

  Query (fill only known fields):
  - Product description: {{description}}
  - HS / HTS if known: {{code}}
  - Export / origin: {{e.g. BR|CN}}  Import / destination: {{e.g. DE|US}}
  - Company or person name to screen (optional): {{name}}
  - Goal: {{hs_lookup | tariff | ofac_screen | find_importers}}

  Rules:
  1) Prefer Compliance-area tools for HS, tariff/duty/landed-cost, and
     OFAC SDN screening; use importer/buyer search only when asked. If a
     tool is missing or returns an error, say so. Do not invent duty
     rates, HS codes, importer lists, or OFAC results.
  2) Report figures and labels exactly as returned, including confidence /
     coverage envelopes. Present only "verified" as fact; treat the rest
     as candidates. Sanctions output is advisory — not a legal opinion.
  3) If HS is unknown or uncertain, list candidates and open questions.
     Do not pick a code yourself and present it as final classification.
  4) Preview / dry-run before buyer search, enrichment, or outreach.
     Never send email or start a billable discovery run without an
     explicit human yes for that batch. A yes to drafting is not a yes
     to sending.
  5) Flag any action that would consume paid credits; wait for human
     confirmation before proceeding. Do not invent UV, traffic, or
     coverage claims for marketing.
  6) If Avalara Cross-Border MCP or Gateway Tariff MCP is also connected,
     you may compare rows side by side, but do not file entries or buy
     labels.
  Output: (a) tool calls used, (b) table from the live response, (c) open
  questions, (d) ACTIONS REQUIRING HUMAN APPROVAL (final HS, quote duty,
  OFAC interpretation, outbound email, credit spend).
---

## 解决什么问题

出口／进口团队在报价与拓客前常要同时回答四件事：这个产品大概是哪个 HS？某条走廊今天的关税／trade remedies 大概多少？对方公司名在不在 OFAC SDN？德国／美国等市场谁在进口这类货、证据是什么？

模型训练数据答不准，也给不出报关记录级证据。EximAgent 把同一套贸易语料接到托管 MCP，让 Claude／Cursor／ChatGPT／Codex 在会话里查 HS、关税、OFAC，并按 shipment records 找进口商——而不是猜。

与站内相近篇错位：

- [Avalara Cross-Border MCP](/cases/avalara-cross-border-mcp-hs-tariff/)：企业税则库 MCP（需 Avalara 账号 + OAuth），工具面向 HS 关税／PGA／进口限制；**不**做「按报关记录找进口商」、**不**做 OFAC SDN 筛名。
- [Gateway Lines Tariff MCP](/cases/gateway-lines-tariff-mcp/)：美国进口承运商侧免费关税 MCP（客人邮箱每周限额）；侧重 US landed cost／HTS／政策变更；**不**覆盖多国走廊拓客与 OFAC。
- EximAgent：贸易情报 + HS／关税／OFAC + 找进口商；Google OAuth；公开定价写明新账号免费 credits，付费数据请求扣同一余额（见定价页）。

## 人审闸门（必须人工确认）

以下动作不得由 Agent 自动执行：

1. **确定最终 HS 编码** — 归类由报关行／合规负责人确认；Agent 只列候选与理由（Compliance 页写明非 binding ruling）
2. **把关税／落地成本数字写进客户报价、商品定价或 DDP 承诺** — 先人工核对工具返回与适用走廊
3. **把 OFAC SDN 结果当作法律意见或放行／拒单依据** — 页内写明 screening is advisory；仅查 OFAC SDN，不覆盖 EU／UN／UK 清单
4. **外发邮件、启动 outreach 批次或删除／分享名单** — 须对该批次单独说 yes；draft ≠ send
5. **消耗付费 credits 的发现／enrich／报价类动作** — 先看 `account credits` 或等价提示，再由人确认是否继续
6. **在 OAuth／Google 登录页授权 MCP 客户端** — 由账号所有人本人审阅后同意；勿把凭证贴进对话

## 可复现步骤

前置（据公开 connectors／MCP／agents 文档）：

1. 支持远程 Streamable HTTP MCP + OAuth 的客户端（Claude、Claude Code、Cursor、ChatGPT、Codex 等）
2. EximAgent 账号（文档写 free to start；connectors FAQ：New accounts receive free credits）
3. 端点：`https://mcp.eximagent.ai/mcp`（**不要**配成 local stdio；**不要**粘贴 API key——助手侧走 Google OAuth）
4. 2026-10-24 本站匿名请求该端点得到 **HTTP 401**，`www-authenticate` 指向 `https://mcp.eximagent.ai/.well-known/oauth-protected-resource`（`authorization_servers` 含 `https://mcp.eximagent.ai`）。这只说明需 OAuth，**不是**工具调用测试

步骤：

1. **Cursor**：在 `~/.cursor/mcp.json` 加入：

   ```json
   {
     "mcpServers": {
       "eximagent": {
         "url": "https://mcp.eximagent.ai/mcp"
       }
     }
   }
   ```

   然后在客户端对 `eximagent` 选 Connect，完成 Google 登录。或已装 CLI 时：`eximagent login` → `eximagent connect cursor`。

2. **Claude Code**：`claude mcp add --transport http eximagent https://mcp.eximagent.ai/mcp --scope user`，再 `/mcp` 选 EximAgent 并登录。无浏览器时用 `claude mcp login eximagent --no-browser`。

3. **Claude 桌面／网页**：Customize → Connectors → Add custom connector → 粘贴 URL → OAuth。Team／Enterprise 需管理员先在 Organization settings 添加。

4. **ChatGPT／Codex**：按 connectors 页粘贴同一 URL 并完成认证（ChatGPT 可用性取决于账号／workspace）。

5. 确认已登录目标账号后，按目标试问（公开页示例，勿当作本站实测结果）：
   - HS：`What's the HS code for frozen shrimp? Show me the closest candidates.`
   - 关税：`What's the duty on green coffee from Brazil into Germany? Include any trade remedies.`
   - 进口商：`Find importers of ceramic tile (HS 6907) in Germany and show the evidence behind the ranking.`
   - OFAC：对公开示例名做 SDN 筛查前，先说明结果为 advisory

6. 若走 CLI 对照同一语料（可选）：`eximagent hscode search`、`eximagent tariff`、`eximagent sanctions check`；买方搜索先 `--dry-run`，确认后再 `--confirmed`。

7. 如同时接了 Avalara 或 Gateway：并排列出关税行，人工判断差异；**不要**把任何页内示例税率／OFAC 示例结果抄进客户报价。

## 预期结果与失败限制

**预期（据公开文档／产品页描述，非本站实测）：**

- Compliance：HS 候选与理由；按走廊查 duty／remedies／landed cost；OFAC SDN 筛名（advisory）
- Outbound：按报关记录找进口商／买方，带 ranking 证据与 coverage／confidence 标签；enrich、email draft（发送须确认）
- Analyst：市场信号、shipment 聚合等（见 agents 指南命令表）
- 计费叙述（定价页，2026-10-24 可见）：Free $0／月含 100 credits；Starter $50／月 500 credits 等；「Sanctions · tariffs · monitoring on every plan」；top-up 自约 $0.12／credit 起；connector 与 CLI 扣同一余额

**失败与边界：**

- 只加 URL、未完成 OAuth → 服务器 unavailable／未认证（MCP 文档排错项）
- 匿名探活 HTTP 401 → 需登录；**不能**据此声称工具已测通
- 本站**未**完成 Google OAuth，**没有**真实工具返回；本页**不**写任何具体税率、进口商名单或 OFAC 命中结果
- OFAC 仅 SDN；非 binding ruling；coverage `partial`／`limited` 只作方向性参考
- credits 耗尽 → 定价页称 always-free skills 仍可用，付费数据可 top-up 或升级；开通前以定价页与账户页为准
- Agent **不能**替你添加 connector（文档写明须人改主机配置）

## 来源与核验状态

**公开可核验**

- 主链接：[EximAgent Docs — MCP server](https://eximagent.ai/docs/integrations/mcp)（URL、Streamable HTTP、OAuth 2.1 + Google、无 per-user key）
- Connectors：[Trade intelligence in your AI assistant](https://eximagent.ai/connectors)（各宿主配置、FAQ：无 API key、credits）
- Agents 指南：[EximAgent for AI agents](https://eximagent.ai/docs/agents)（Outbound／Analyst／Compliance；CLI 命令与安全规则；support@eximagent.ai）
- Compliance 产品页：[AI teammate for HS codes, tariffs & sanctions](https://eximagent.ai/agents/compliance)（OFAC SDN only；advisory；非 binding ruling）
- 定价：[Pricing](https://eximagent.ai/pricing)（Free 100 credits／月等公开档位）
- 端点探活：`https://mcp.eximagent.ai/mcp` — 2026-10-24 匿名 → HTTP 401 + OAuth protected-resource 元数据
- 采编：2026-10-24（Asia/Shanghai）。本站仅采编公开材料，**未完成 OAuth，未实测工具调用**。与 Avalara／Gateway 用例的区别见首节。

## 据公开帖摘要

**connectors 页：**

- 卖点：在已有助手里 Find importers、check duties、look up HS codes；答案 backed by customs records and tariff schedules
- MCP URL：`https://mcp.eximagent.ai/mcp`；Transport：Streamable HTTP（not stdio）；Auth：OAuth 2.1 with dynamic client registration and PKCE；Google sign-in
- FAQ：无需 API key（脚本可用 scoped API keys）；New accounts receive free credits；Paid data requests draw from the same balance（connector 或 CLI）；助手不能自行添加 connector

**MCP 文档：**

- 可问：找进出口商、公司贸易活动、走廊比较、名单 enrich／外联前筛名
- 同一 endpoint；无 per-user URL；工具带 read-only／destructive 标注；外联仍过发送检查（含 sanctions screening）
- 排错：加 URL ≠ 已登录；浏览器无法打开时用 Claude Code `--no-browser` 流程

**agents／Compliance：**

- Compliance：HS、tariffs／duties／landed cost、OFAC SDN（advisory）
- CLI 对应：`hscode search`、`tariff`、`sanctions check`；安全规则要求 preview、禁瞎猜、禁未确认发送
- Compliance 页示例为产品示意（如香蕉 HS、Sample Trading Co. No match）；**不是**本站实测
- 明确：非 binding ruling；只查 OFAC SDN，不含 EU／UN／UK

**定价页（采编日可见表述）：**

- Free：$0／mo，100 credits／mo；含 Qualified buyer research、Partner checks、Sanctions／tariffs／market alerts 等（以页内技能表为准）
- Starter／Growth／Pro：更高月 credits；Smart quotes（duty & landed cost）自 Starter 起
- 「always-free skills keep running」当 credits 用尽；top-up from ~$0.12 per credit

**端点核验（本站，2026-10-24）：** HEAD／请求 `https://mcp.eximagent.ai/mcp` → HTTP 401；`.well-known/oauth-protected-resource` 返回 JSON，`resource` 为该 MCP URL。只说明需 Bearer／OAuth，**不是** HS／关税／OFAC／找进口商工具的实测。

## English brief

EximAgent hosts a trade MCP at `https://mcp.eximagent.ai/mcp` (Streamable HTTP, OAuth 2.1 + Google, no pasted API key) for Claude, Cursor, ChatGPT, and Codex. Public docs describe the same account/corpus as the CLI: HS lookup, corridor tariffs/remedies/landed cost, OFAC SDN screening (advisory only), and importer discovery from shipment records. Pricing pages state free starting credits and that paid data requests share one balance. Differs from Avalara Cross-Border MCP (enterprise tariff library, no importer hunt/OFAC) and Gateway Tariff MCP (free US-import carrier tools). This Lab page cites public docs plus a 2026-10-24 anonymous HTTP 401/OAuth-metadata check only — **no Google OAuth, no live tool calls**. A human confirms final HS, any customer-facing duty figure, OFAC interpretation, outbound email, and credit spend.
