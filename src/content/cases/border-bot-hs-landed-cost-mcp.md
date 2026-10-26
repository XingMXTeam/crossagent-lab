---
title: "border.bot MCP：产品 URL／描述 → 目的国 HS／HTS + landed cost（Claude／Cursor）"
titleEn: "border.bot MCP: product URL/description → destination HS/HTS + landed cost in Claude/Cursor"
summary: "据 border.bot 官网／MCP／定价／联系页：远程 MCP（https://mcp.border.bot/mcp，Streamable HTTP + OAuth 2.1）接入 Claude／ChatGPT／Codex／Cursor 等；粘贴产品页或描述，返回目的国税则编码与 duty／税／费／landed cost。无订阅，预付 credit packs；新账号 10 免费 credits；分类 Mini／Pro 与 landed cost 各 1 credit（Max 分类 3 credits）。页标 Prices as of 2026-10-25。本站未完成账号 OAuth，未实测 classify／landed-cost 工具返回。"
summaryEn: "Per border.bot’s public home/MCP/pricing/contact pages: the remote MCP at https://mcp.border.bot/mcp (Streamable HTTP + OAuth 2.1) connects Claude/ChatGPT/Codex/Cursor and peers. Paste a product URL or description to get the destination tariff code plus duty, tax, fees, and landed cost. No subscription — prepaid credit packs; new accounts get 10 free credits; Mini/Pro classify and landed-cost calc cost 1 credit each (Max classify = 3). Page stamped Prices as of 2026-10-25. This Lab page did not complete OAuth and made no live classify/landed-cost tool calls."
category: logistics
agents: ["Cursor", "Claude", "Claude Code", "ChatGPT", "Codex"]
tools: ["border.bot MCP", "mcp.border.bot/mcp", "classify_product", "calculate_landed_cost", "infer_country_of_origin", "REST API api.border.bot"]
source: 官网
sourceUrl: https://border.bot/mcp
sourceType: public
date: 2026-10-25
dateNote: "首页 Last updated 2026-10-19；MCP 页 Last updated 2026-10-16；定价页 Last updated 2026-10-16 且正文写 Prices as of 2026-10-25。2026-10-25（Asia/Shanghai）采编并核对首页、/mcp、/contact、/pricing、pricing.md、llms.txt；匿名 HEAD/GET mcp.border.bot/mcp → HTTP 401 + OAuth 元数据；匿名 GET api.border.bot/v1/pricing → HTTP 200（公开价目，非工具实测）。本站未完成 OAuth，未调用 classify／calculate。"
featured: false
prompt: |
  You are a cross-border parcel / customs-estimate assistant connected to
  the border.bot hosted MCP (https://mcp.border.bot/mcp). OAuth 2.1 sign-in
  is handled by the MCP client. Never ask for passwords, API keys, or
  access tokens in chat.

  Query (fill only known fields):
  - Product URL (optional): {{url}}
  - Product description: {{description}}
  - Origin country if known: {{e.g. VN|CN}}
  - Destination country: {{e.g. US|GB|DE|CA}}
  - Goods value + currency: {{value}}
  - Shipping cost if known: {{shipping}}
  - Goal: {{classify | landed_cost | both}}

  Rules:
  1) Prefer border.bot tools for destination HS/HTS/CN/UK codes and
     duty/tax/fee/landed-cost lines. If a tool is missing or errors, say so.
     Do not invent HS codes, duty rates, or totals.
  2) Report codes, hierarchy, confidence, alternatives, and each charge
     line exactly as returned. Mark low-confidence or needsReview results
     for human review. Output is an estimate — not a binding ruling or
     customs advice (border.bot MCP FAQ).
  3) If classification is uncertain, list candidates and open questions.
     Do not pick a final code yourself for a customer quote or declaration.
  4) Flag any action that spends workspace credits (classify Mini/Pro = 1,
     Max = 3, landed cost = 1 per pricing page). Wait for an explicit human
     yes before billable calls beyond what the human already approved.
  5) Carrier brokerage/handling fees are not included (product page). Do
     not promise DDP or checkout totals without human confirmation.
  6) If Avalara, Gateway, or EximAgent MCP is also connected, you may
     compare rows side by side, but do not file entries or buy labels.
  Output: (a) tool calls used, (b) table from the live response, (c) open
  questions, (d) ACTIONS REQUIRING HUMAN APPROVAL (final HS, customer-facing
  duty/landed-cost figure, credit spend, checkout/DDP promise).
---

## Lab 探针成品（先看结果）

**方法：** 匿名 · 无 OAuth · 无 Bearer · 2026-10-25（Asia/Shanghai）

| 探针 | 结果 |
|------|------|
| `https://mcp.border.bot/mcp` 匿名 HEAD／GET | **HTTP 401** + OAuth protected-resource 元数据 |
| 匿名 `POST /v1/classify` | **HTTP 401**（需 Bearer） |
| `GET https://api.border.bot/v1/pricing` | **HTTP 200**（packs／actions／`signupBonusCredits=10`；与 classify 无关） |

**本站未跑：** OAuth 与 workspace 登录；`classify`／landed-cost 等工具调用。**没有**真实工具返回的税则或金额。首页示例表**不是**本站实测。

> 人审提醒：匿名 401 不能当成 classify 已测通。闸门见「人审闸门」。

## 解决什么问题

跨境包裹／独立站卖家在结账或报关前常要同时回答：这个 SKU 进美国／英国／欧盟／加拿大该报哪个税则编码？duty、进口税、海关费加起来 landed cost 是多少？能不能在 checkout 先收妥，避免到付？

模型训练数据给不出带层级描述与置信度的目的国税则，也算不准当日报价。border.bot 把「读产品页 → 目的国归类 → duty／税／费／landed cost」接到远程 MCP，让 Claude／ChatGPT／Codex／Cursor 等在会话里调用同一套 dashboard／API 语料——而不是瞎猜。

与站内相近篇错位：

- [Avalara Cross-Border MCP](/cases/avalara-cross-border-mcp-hs-tariff/)：企业税则库 MCP（需 Avalara 账号 + OAuth）；工具面向**已知 HS** 的关税／PGA／进口限制查询；**不**主打「产品 URL → 归类」、**不**做 SMB 预付 credit packs。
- [Gateway Lines Tariff MCP](/cases/gateway-lines-tariff-mcp/)：美国进口承运商侧**免费**关税 MCP（客人邮箱每周限额）；侧重 US landed cost／HTS／政策变更；**无**通用多目的国 credit 产品面。
- [EximAgent trade MCP](/cases/eximagent-trade-mcp-hs-tariff-ofac/)：贸易情报 + HS／走廊关税／OFAC SDN + **按报关记录找进口商**；Google OAuth + 月订阅 credits 叙述；**不是**包裹级 checkout landed-cost 产品。
- border.bot：产品 URL／描述 → 目的国 HS／HTS／CN／UK 等 + landed cost；远程 MCP + REST；**无订阅、预付 packs**；公开联系 partnerships：`info@border.bot`。

## 人审闸门（必须人工确认）

以下动作不得由 Agent 自动执行：

1. **确定最终 HS／HTS／CN／UK 编码** — 官网写明低置信度须审；高价值／管制品须持牌报关行确认或向海关申请 binding ruling
2. **把 duty／税／landed cost 写进客户报价、商品定价或 DDP／checkout 承诺** — 首页示例表注明 Illustrative figures；承运商 brokerage／handling **不含**在计算内
3. **消耗 workspace credits 的 classify／calculate／screen 等计费动作** — Mini／Pro 分类与 landed cost 各 1 credit，Max 分类 3 credits（定价页）；先由人确认是否扣费
4. **在 OAuth／border.bot 登录页授权 MCP 客户端并选择扣费 workspace** — 由账号所有人本人审阅后同意；勿把密码／API key 贴进对话
5. **外发报关、改价、买面单或提交申报** — 工具输出不是海关裁定；MCP FAQ：Border Bot is not a customs broker or adviser
6. **把 denied-party／restrictions 结果当作法律放行依据** — 仅作证据线索，人工决定

## 可复现步骤

前置（据公开 MCP／首页／定价／llms.txt）：

1. 支持远程 Streamable HTTP MCP + OAuth 的客户端（MCP 页列出 Claude、ChatGPT、Cursor、Claude Code、Codex 等共 34 个客户端指南）
2. border.bot 账号（定价／首页：New accounts get 10 credits free；无订阅）
3. 端点：`https://mcp.border.bot/mcp`（**不要**配成 local stdio；助手侧走 OAuth，**不要**往聊天里粘 API key。REST 另用 `https://api.border.bot/v1` + Bearer）
4. 2026-10-25 本站匿名请求该 MCP 端点得到 **HTTP 401**，`www-authenticate` 指向 `https://mcp.border.bot/.well-known/oauth-protected-resource/mcp`（JSON：`resource=https://mcp.border.bot/mcp`，`authorization_servers=["https://mcp.border.bot"]`，`scopes_supported` 含 `mcp:read`／`mcp:write`）。这只说明需 OAuth，**不是**工具调用测试
5. 同日匿名 `GET https://api.border.bot/v1/pricing` → **HTTP 200**（llms.txt 写明该价目接口免费、无需 key）——只核验公开 packs／action credits，**不是** classify 实测

步骤：

1. **Cursor**：在 `~/.cursor/mcp.json` 加入：

   ```json
   {
     "mcpServers": {
       "borderbot": {
         "url": "https://mcp.border.bot/mcp"
       }
     }
   }
   ```

   然后在客户端对 `borderbot` 完成 OAuth，并选择扣费 workspace。或按 MCP 页「Add to Cursor」一键安装。

2. **Claude Code**：`claude mcp add --transport http --scope user borderbot https://mcp.border.bot/mcp`，再 `/mcp` 选 `borderbot` 并登录（或 `claude mcp login borderbot`）。

3. **Claude 桌面／网页**：Customize → Connectors → Add custom connector → 名称 border.bot、URL 同上 → OAuth。Team／Enterprise 需 Owner 先在组织设置添加。

4. **ChatGPT／Codex**：按 MCP 页粘贴同一 URL，认证方式选 OAuth（可用性取决于账号／workspace 计划）。

5. 确认已登录目标 workspace 后，按目标试问（公开「Things to ask」示例，**勿当作本站实测结果**）：
   - `What's the HTS code for an insulated stainless steel water bottle made in China?`
   - `Classify this product for import into the UK: {{product_url}}`
   - `Calculate the landed cost of 20 units of 6109.10 from Vietnam to Germany at €12 each, with €40 shipping.`

6. （可选）无 MCP 时用 REST 对照同一语料：先在 dashboard 建 API client，再 `POST https://api.border.bot/v1/classify`（首页示例 curl）；计费与 MCP 共用 credits。匿名无 token 会 401（本站已见）。

7. （可选）浏览器免费工具：`/tools/hs-code-classifier`、`/tools/landed-cost-calculator` 等——定价写明每访客每 30 天 3 次免费、受 Turnstile 限制；**本站未跑通一次免费分类结果**（未过人机验证流程）。

8. 如同时接了 Avalara／Gateway／EximAgent：并排列出税则／关税行，人工判断差异；**不要**把首页示例表里的示意金额抄进客户报价。

## 预期结果与失败限制

**预期（据公开文档／产品页描述，非本站实测工具返回）：**

- 分类：目的国税则编码（美 HTS 10 位、英／加 10 位、欧盟 CN／TARIC 8 或 10 位、其他 6 位 HS），层级官方描述、置信度、理由、备选；低置信度标 review
- Landed cost：按 code／origin／destination／货值／运费给出 duty／税／费分行与合计；条件性措施单列不加总；承运商 brokerage／handling 不含
- MCP 还可读产品页、推断 origin（llms.txt／MCP「What your assistant can do」）；进阶能力（screen／restrict／comply 等）见产品线页，计费见定价表
- 计费叙述（定价页 + 匿名 `GET /v1/pricing`，2026-10-25）：无订阅；packs Starter 100／$19、Growth 500／$79、Scale 2000／$249、Volume 10000／$990；`signupBonusCredits: 10`；`freeTools.limit: 3`／`windowDays: 30`；失败自动退 credits

**失败与边界：**

- 只加 URL、未完成 OAuth／未选 workspace → 不可用／未认证
- 匿名 MCP → HTTP 401；**不能**据此声称 classify／landed cost 已测通
- 本站**未**完成 OAuth，**没有**真实工具返回的税则或金额；本页**不**把首页示例表当作实测
- 匿名 `POST /v1/classify` → HTTP 401（需 Bearer）；免费价目 `GET /v1/pricing` 可用，与 classify 无关
- credits 不足 → API 错误码含 `insufficient_credits`（首页）；开通前以定价页与账户页为准
- 结果可能过时或错误；对外申报／发货前须海关或持牌报关行确认（MCP FAQ）

## 来源与核验状态

**公开可核验**

探针表见文首「Lab 探针成品」；此处保留主链接与采编说明。

- 主链接：[Connect border.bot to your AI tools](https://border.bot/mcp)（URL、Streamable HTTP、OAuth 2.1、34 客户端指南）
- 首页：[HS codes and landed cost for cross-border parcels](https://border.bot/)（产品流程、REST 示例、credit packs 摘要；Last updated 2026-10-19）
- 定价：[Pricing](https://border.bot/pricing)／[pricing.md](https://border.bot/pricing.md)（packs 与 action credits；Prices as of 2026-10-25）
- 联系：[Contact](https://border.bot/contact)（support／billing／partnerships → `info@border.bot`）
- Agent 发现：[llms.txt](https://border.bot/llms.txt)（MCP 工具名摘要；免费 `GET /v1/pricing` 等）
- 端点探活：`https://mcp.border.bot/mcp` — 2026-10-25 匿名 HEAD／GET → **HTTP 401** + OAuth protected-resource 元数据
- 公开价目：`GET https://api.border.bot/v1/pricing` — 2026-10-25 匿名 → **HTTP 200**（packs／actions／signupBonusCredits=10）
- 采编：2026-10-25（Asia/Shanghai）。本站仅采编公开材料并做匿名探活；**未完成 OAuth，未实测 classify／landed-cost 工具调用**。与 Avalara／Gateway／EximAgent 的区别见「解决什么问题」。

## 据公开帖摘要

**首页（border.bot，Last updated 2026-10-19）：**

- 卖点：Paste a product page or describe the product → destination tariff code + duty, import tax, fees, landed cost；dashboard／API／Claude via MCP
- 示例为示意（Heavyweight tee VN→LA）；表下写 Illustrative figures
- MCP URL：`https://mcp.border.bot/mcp`；Calls use the same credits as the dashboard and the MCP server
- Pricing 摘要：prepaid，no subscription；classification 1 credit、landed-cost 1 credit；new accounts 10 free；packs Starter／Growth／Scale／Volume 如上；另列 Max 分类 3 credits 等 action 表
- 「Prices as of 2026-10-25」；免费工具每访客每 30 天 3 次

**MCP 页（Last updated 2026-10-16）：**

- Transport：Streamable HTTP with OAuth 2.1；客户端自发现登录端点，无凭证可粘贴
- 助手可：Classify products、Calculate landed cost、Read product pages
- Billing：每次连接绑定你批准时选的 workspace；与 dashboard／API 同价；可撤销
- FAQ：非 customs broker；codes／duties 可能错误或过时；terms 适用于 MCP

**定价页／`GET /v1/pricing`（采编日）：**

- Packs：Starter 100／$19.00；Growth 500／$79.00；Scale 2000／$249.00；Volume 10000／$990.00（API `priceCents` 与页表一致）
- Classify modes：mini 1、pro 1、max 3；landed cost calculation 1；多项 free／1 credit 动作见页表
- signupBonusCredits: 10；freeTools limit 3／30 days

**Contact：**

- Product support／Billing／Partnerships and volume／Security → 均为 `info@border.bot`

**端点核验（本站，2026-10-25 Asia/Shanghai）：**

```
HEAD/GET https://mcp.border.bot/mcp
→ HTTP 401
www-authenticate: Bearer realm="OAuth", resource_metadata="https://mcp.border.bot/.well-known/oauth-protected-resource/mcp", scope="mcp:read"

GET https://mcp.border.bot/.well-known/oauth-protected-resource/mcp
→ HTTP 200 JSON
resource=https://mcp.border.bot/mcp
authorization_servers=["https://mcp.border.bot"]
scopes_supported=["mcp:read","mcp:write"]

GET https://api.border.bot/v1/pricing → HTTP 200（公开价目）
POST https://api.border.bot/v1/classify（无 token）→ HTTP 401 unauthorized
```

只说明 MCP 需 OAuth、价目可匿名读；**不是** HS／landed-cost 工具的实测。

## English brief

border.bot hosts a remote MCP at `https://mcp.border.bot/mcp` (Streamable HTTP, OAuth 2.1, no pasted API key) for Claude, ChatGPT, Codex, Cursor, and many other clients. Public pages describe product-URL/description → destination HS/HTS/CN/UK codes plus duty/tax/fee/landed-cost lines, shared prepaid credits with the dashboard and REST API, no subscription, 10 signup credits, and credit packs Starter $19 / Growth $79 / Scale $249 / Volume $990 (Prices as of 2026-10-25). Differs from Avalara (enterprise HS library), Gateway (free US-import carrier MCP), and EximAgent (trade intel + OFAC + importer discovery). This Lab page cites public docs plus 2026-10-25 anonymous MCP HTTP 401 / OAuth metadata and a free `GET /v1/pricing` check only — **no OAuth, no live classify or landed-cost tool calls**. A human confirms final codes, customer-facing totals, credit spend, and any DDP/checkout promise.
