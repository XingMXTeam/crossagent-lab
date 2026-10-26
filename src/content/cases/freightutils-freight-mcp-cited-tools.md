---
title: "FreightUtils MCP：带出处信封的货运数学／ADR／HS／UK 关税（Claude／Cursor，匿名可读）"
titleEn: "FreightUtils MCP: cited freight math, ADR, HS & UK duty for Claude/Cursor (anonymous read)"
summary: "据 FreightUtils 官网／MCP／定价页与本站 2026-10-26（Asia/Shanghai）匿名探活：远程 MCP https://www.freightutils.com/api/mcp（亦可 npx freightutils-mcp），宣称 25 个只读货运工具、带 typed outputSchema 与 _source／citation 信封；无登录即可评测。本站实测 initialize／tools/list／health → HTTP 200、serverInfo.version=2.22.5、tools_registered=25；hs_code_lookup(\"cotton t-shirt\") → HS 610910；get_subscribe_link → Pro £19／月、50,000 次；cbm_calculator(10×120×80×100cm) → 9.6 m³。不做订舱／申报／扣款。"
summaryEn: "Per FreightUtils public home/MCP/pricing pages plus a 2026-10-26 (Asia/Shanghai) anonymous Lab probe: remote MCP at https://www.freightutils.com/api/mcp (or npx freightutils-mcp) exposes 25 read-only freight tools with typed schemas and a _source/citation envelope; no login required to evaluate. Lab verified initialize/tools/list/health HTTP 200, serverInfo.version 2.22.5, tools_registered 25; hs_code_lookup(\"cotton t-shirt\") → HS 610910; get_subscribe_link → Pro £19/mo, 50,000 requests; cbm_calculator(10×120×80×100 cm) → 9.6 m³. No booking, filing, or payment tools."
category: logistics
agents: ["Cursor", "Claude", "Claude Code", "Cline"]
tools: ["FreightUtils MCP", "freightutils.com/api/mcp", "freightutils-mcp", "cbm_calculator", "chargeable_weight_calculator", "adr_lookup", "hs_code_lookup", "uk_duty_calculator", "unlocode_lookup", "get_subscribe_link"]
source: 官网
sourceUrl: https://www.freightutils.com/mcp
sourceType: public
date: 2026-10-26
dateNote: "2026-10-26（Asia/Shanghai）采编首页、/mcp、/pricing；同日匿名 POST https://www.freightutils.com/api/mcp：initialize → HTTP 200（serverInfo.name=freightutils-mcp, version=2.22.5）；tools/list → HTTP 200（25 tools）；GET /api/mcp/health → HTTP 200（status=ok, tools_registered=25, mcp_version=2.22.5）；tools/call hs_code_lookup／get_subscribe_link／cbm_calculator → 均 HTTP 200（见正文核验摘录）。未使用 API key；未订阅 Pro；未做 ADR 合规裁定或报关。"
featured: false
prompt: |
  You are a freight reference assistant connected to the FreightUtils
  hosted MCP (https://www.freightutils.com/api/mcp) or the local
  freightutils-mcp package. Prefer FreightUtils tools for CBM, LDM,
  chargeable weight, ADR lookups, HS (6-digit WCO), UK duty estimates,
  UN/LOCODE, airline/airport codes, and similar reference maths.

  Query (fill only known fields):
  - Goal: {{cbm | chargeable_weight | adr | hs | uk_duty | unlocode | other}}
  - Dimensions / pieces / weight if relevant: {{...}}
  - Goods description or UN number: {{...}}
  - Origin / destination / mode if relevant: {{...}}

  Rules:
  1) Call FreightUtils tools for figures. Quote result + citation/_source
     exactly as returned. If a tool errors or is missing, say so — do not
     invent CBM, LDM, HS codes, duty rates, ADR classes, or totals.
  2) Answers are reference information with a named source — not legal,
     customs, or dangerous-goods compliance advice (FreightUtils MCP page).
     Tell the human to check the cited authority before acting.
  3) All listed tools are read-only: none book freight, file declarations,
     track shipments, rate carriers, or pay. Never attempt checkout or
     subscribe on behalf of the human (get_subscribe_link returns a URL only).
  4) Anonymous free tier is limited (pricing: 25 requests/day per IP;
     Claude shared allowance and Claude Code daily caps per MCP docs).
     Before any paid Pro subscribe (£19/mo per get_subscribe_link /
     pricing page) or API-key upgrade, wait for an explicit human yes.
  5) If Avalara, Gateway, border.bot, EximAgent, or Easyship MCP is also
     connected, you may compare rows side by side, but do not file entries,
     buy labels, or promise customer quotes from unverified numbers.
  6) HS results are 6-digit international level unless a tool says otherwise;
     national 8–10 digit lines and duty for non-UK destinations need human
     / destination-tariff confirmation.
  Output: (a) tool calls used, (b) table from the live response including
  citation/_source, (c) open questions, (d) ACTIONS REQUIRING HUMAN
  APPROVAL (final HS for declaration, customer-facing quote, ADR acceptance,
  Pro subscribe / API key purchase, any filing or booking).
---

## Lab 探针成品（先看结果）

**方法：** 匿名 · 无 API key · 无登录 · 2026-10-26（Asia/Shanghai）  
**端点：** `POST/GET https://www.freightutils.com/api/mcp`（及 `/health`）

| 探针 | 结果 |
|------|------|
| `initialize` | HTTP **200** · `serverInfo.name=freightutils-mcp` · version **2.22.5** |
| `tools/list` | HTTP **200** · **25** tools |
| `GET …/health` | HTTP **200** · `status=ok` · `tools_registered=25` · `mcp_version=2.22.5` |
| `hs_code_lookup("cotton t-shirt")` | HTTP **200** · HS **610910**（medium confidence + `FUZZY_BEST_MATCH` 警告） |
| `cbm_calculator` 10×120×80×100 cm | HTTP **200** · **9.6 m³** |
| `get_subscribe_link` | HTTP **200** · Pro **£19**/mo · **50,000**/mo · 定价 URL（工具注明 Agents must not checkout） |

同日匿名 `GET /api/hs?q=cotton%20t-shirt` 亦返回 `610910`（与 MCP 一致）。公开首页 CBM 示例与上表 9.6 m³ 一致——上表为 **Lab tools/call**，非仅抄营销页。

![FreightUtils anonymous Lab probe — health, tools/list, HS 610910](/demos/freightutils-probe-demo.gif)

*静音循环 · 本站 2026-10-26 Asia/Shanghai 匿名探针关键返回 · 非厂商广告片*

### 公开声称 vs 本站探针

| 公开页声称 | 本站探针 | 差注 |
|------------|----------|------|
| MCP 页：「25 freight tools」；health 文案期望 `tools_registered":25`（[freightutils.com/mcp](https://www.freightutils.com/mcp)） | `tools/list` → HTTP **200** · tools.length=**25**；`GET …/health` → tools_registered=**25** | 一致 |
| MCP 页：「Free tier, no login」「No account, no sign-in, no API key」 | 无 key／无登录：`initialize`／`tools/list`／health／`hs_code_lookup`／`cbm_calculator`／`get_subscribe_link` 均 HTTP **200** | 一致 |
| 首页／MCP：freightutils-mcp **v2.22.5**（npm 叙述） | `initialize` → `serverInfo.name=freightutils-mcp` · version=**2.22.5**；health mcp_version=**2.22.5** | 一致 |
| Health：`status":"ok"` 且工具已注册（MCP 页 Health check） | `GET https://www.freightutils.com/api/mcp/health` → HTTP **200** · `status=ok` | 一致 |
| 首页 build-time 示例：CBM **10 × 120×80×100 cm → 9.6 m³**（`GET /api/cbm?…`） | MCP `cbm_calculator` 同参 → HTTP **200** · totalCbm=**9.6**（`cbmPerPiece=0.96`） | 一致 |
| MCP 工具：`hs_code_lookup` 搜 WCO HS 2022 六位码（页写 Search 6,940…；首页数据集表写 6,937 — **公开页两数并存，勿合并**） | `hs_code_lookup({"query":"cotton t-shirt"})` → HTTP **200** · HS **610910** · description「T-shirts… of cotton…」· confidence **medium** · warning **`FUZZY_BEST_MATCH`**；同日 REST `GET /api/hs?q=cotton%20t-shirt` 亦 **610910** | 一致（结果码）；差注：公开首页示例用 “coffee”，非本 query；FUZZY 警告以 Lab 返回为准 |
| MCP-only `get_subscribe_link`：Pro **50,000**/month 与价格（定价页／工具） | `get_subscribe_link` → HTTP **200** · monthly_price=**£19** · monthly_limit=**50000** · `url=https://www.freightutils.com/pricing` · note：Agents must not complete checkout | 一致 |
| 定价页：Anonymous **£0** · **25 requests/day** · No signup | （本日未打满限额压测） | 仅公开（本站未测） |
| 定价页 Free 文案「All **24** endpoints」vs MCP **25** tools（含 `get_subscribe_link`） | Lab 只核验 MCP tools.length=**25**；未逐一对照 24 REST endpoints | 口径不同（见注）：引用时 REST／MCP 分开说 |
| MCP 页公开示例：UN 1203 ADR／exemption 等 | 本日未调用 `adr_lookup`／`adr_exemption_calculator`／`uk_duty_calculator` | 仅公开（本站未测） |

**本站未跑（对照表外重申）：** 完整 25 工具扫遍；UK duty／ADR live；Pro 订阅／粘贴 API key；订舱、申报、报关裁定。

> 人审：HS 为 WCO 6 位参考层；带 `FUZZY_BEST_MATCH` 时不得直接写入报关单或客户报价。

**本站未跑：** 完整 25 工具扫遍；`uk_duty_calculator`／`adr_lookup` 的 live 断言；Pro 订阅／粘贴 API key；订舱、申报、报关裁定、危险品放行。公开页上的 ADR／UK duty **示例勿与上表实测混淆**。

> 人审提醒：HS 为 WCO 6 位参考层；带 FUZZY 警告时不得直接写入报关单或客户报价。闸门见下一节后的「人审闸门」。

## 解决什么问题

跨境／货代／TMS 与 Agent 工作流常卡在同一类「参考层」问题：这票货 CBM／计费重／欧洲路运 LDM 怎么算？UN 号走 ADR 什么分类、能否小量豁免？商品大概落在哪个 6 位 HS？进英国大概多少 duty／VAT？港口／机场 UN/LOCODE 是什么？模型训练数据容易胡猜，且**说不清出处**。

FreightUtils 把自己定位为**中立货运参考层**（官网：No freight to sell. No carrier to push.）：把确定性计算与主数据源查询接到 MCP／REST，每条成功回答带 `confidence`、`_source` 与可引用的 `citation` 信封——不做订舱、申报、轨迹、承运商报价或法律裁定（MCP 页边界说明）。

与站内相近篇错位：

- [Avalara Cross-Border MCP](/cases/avalara-cross-border-mcp-hs-tariff/)：企业税则库 MCP（需 Avalara 账号 + OAuth）；面向**已知 HS** 的关税／PGA／进口限制；**不**主打 CBM／ADR／计费重信封。
- [Gateway Lines Tariff MCP](/cases/gateway-lines-tariff-mcp/)：美国进口承运商侧**免费**关税 MCP；侧重 US landed cost／HTS；**不是**中立货运数学工具箱。
- [border.bot HS／landed-cost MCP](/cases/border-bot-hs-landed-cost-mcp/)：产品 URL／描述 → **目的国**税则 + duty／税／费／landed cost；远程 MCP + OAuth + **预付 credits**；本站匿名 MCP 为 401。FreightUtils 则是**匿名可读**的货运参考层，HS 公开叙述为 **WCO 6 位**，另有 UK duty 活取 GOV.UK。
- [EximAgent trade MCP](/cases/eximagent-trade-mcp-hs-tariff-ofac/)：贸易情报 + HS／走廊关税／OFAC SDN + 找进口商；Google OAuth + 月订阅叙述；**不是** ADR／CBM／LDM 工具箱。
- [Easyship MCP](/cases/easyship-mcp-crossborder-shipping/)：履约侧比价／打单／履约 MCP；**会**走向运单与发货动作。FreightUtils **明确不订舱、不打单**。
- FreightUtils：CBM／计费重／LDM／托盘装载／ADR 2025／HS 2022／UK duty／UN/LOCODE／航空公司与机场码等 **25** 个只读工具 + 出处信封；免费匿名评测；Pro 据工具与定价页为 **£19／月、50,000 次／月**。

## 人审闸门（必须人工确认）

以下动作不得由 Agent 自动执行：

1. **把 HS／UK duty／ADR 结果写进报关单、客户报价或承运商接受依据** — MCP 页写明答案是带出处的参考信息，不是法律／海关／危险品合规意见；须对照所引权威文本并由人确认
2. **确定最终报关税则（尤其 8–10 位国别税号）或 DDP／checkout 承诺** — `hs_code_lookup` 公开为 WCO 6 位层；本站样例对 “cotton t-shirt” 还带 FUZZY_BEST_MATCH 警告，须人审
3. **危险品放行／混装／隧道限制决策** — `adr_*` 工具返回参考数据；接受与否由持证人员决定
4. **订阅 Pro、购买／粘贴 API key、提高限额** — `get_subscribe_link` 只返回定价 URL，并注明 Agents must not attempt to complete checkout；须账号所有人在浏览器亲自操作
5. **订舱、打单、申报、改价、对外发信承诺时效／运费** — 工具集为只读参考层，不含这些动作
6. **在共享 Claude 额度打满或匿名日限额将尽时继续盲打计费路径** — 见 MCP 页 Limits 与定价页 429 说明

## 可复现步骤

前置（据公开 MCP／首页／定价 + 本站探活）：

1. 支持远程 Streamable HTTP MCP 的客户端（MCP 页：Claude Connectors、Claude Code、Cursor、Cline 等），**或**本机 Node 可跑 `npx freightutils-mcp`
2. **评测可不登录、不配 API key**（MCP 页：Free tier, no login；定价：Anonymous 25 requests/day）
3. 远程端点：`https://www.freightutils.com/api/mcp`（health 另报 alias；本站对该 URL 实测成功）
4. （可选）更高限额：注册免费 key（定价叙述 100 requests/day）或 Pro；远程用 `X-API-Key`／`Authorization: Bearer`，本地用环境变量 `FREIGHTUTILS_API_KEY`——**示例勿贴真实 key**
5. 自检：`curl https://www.freightutils.com/api/mcp/health` → 期望 `status":"ok"` 且 `tools_registered":25`（本站 2026-10-26 已见）

步骤：

1. **Claude（claude.ai／桌面／移动／Cowork）**：Customize → Connectors → Add custom connector，粘贴 `https://www.freightutils.com/api/mcp`（MCP 页：No account, no sign-in, no API key）。或从 Claude connector directory 一键添加。

2. **Claude Code**：

   ```bash
   claude mcp add --transport http freightutils https://www.freightutils.com/api/mcp
   ```

3. **Cursor（远程 URL，与本站探活同一端点）** — 在 `~/.cursor/mcp.json`（或项目 MCP 配置）加入：

   ```json
   {
     "mcpServers": {
       "freightutils": {
         "url": "https://www.freightutils.com/api/mcp"
       }
     }
   }
   ```

4. **Cursor／Claude Desktop（本地 stdio，据 MCP 页）**：

   ```json
   {
     "mcpServers": {
       "freightutils": {
         "command": "npx",
         "args": ["-y", "freightutils-mcp"]
       }
     }
   }
   ```

5. 连接后先让助手 `tools/list` 或直接试问（公开「What AI agents can do」示例 + 本站已跑通的只读调用）：

   - `Calculate CBM for 10 pieces 120×80×100 cm`
   - `Look up HS for cotton t-shirt`
   - `What is the FreightUtils Pro subscribe link and price?`
   - （公开示例，**勿当作本站 ADR 实测**）`Look up UN 1203 and check if 200 litres qualifies for ADR exemption`

6. （可选）对照 REST：官网首页展示同引擎的 `GET /api/cbm`、`GET /api/hs?q=…` 等；本站同日匿名 `GET /api/hs?q=cotton%20t-shirt` 亦返回 `610910`（与 MCP 一致）。

7. 如同时接了 Avalara／Gateway／border.bot／EximAgent／Easyship：并排列出税则／运费／履约行，**人工**判断差异；不要把参考数字直接写成客户报价或报关结论。

## 预期结果与失败限制

**预期（公开文档 + 本站匿名工具返回）：**

- `tools/list`：25 个工具（本站计数 25，与 MCP 页／health `tools_registered` 一致），分组含 Calculators、ADR、Customs／trade、Codes／places／equipment，以及 MCP-only 的 `get_subscribe_link`
- 成功调用返回 FreightUtils v1 envelope：`result` + `confidence` + `_source` + `citation`（MCP 页示例结构）；v2.22.5 起每次成功 tool call 计 1 次限额（MCP 页）
- 本站样例：`hs_code_lookup("cotton t-shirt")` → `610910`（描述：T-shirts… of cotton…），confidence medium + FUZZY_BEST_MATCH 警告；`cbm_calculator` 10×120×80×100 cm → **9.6 m³**；`get_subscribe_link` → `https://www.freightutils.com/pricing`，Pro **£19**／月、**50,000** requests／月
- 计费叙述（定价页 + 工具）：Anonymous **£0**、**25** requests／day；免费注册 key **100**／day；Pro **£19**／month、**50,000**／month；超额 **429**（定价 FAQ）

**失败与边界：**

- 匿名／共享额度用尽 → 429 或 Claude 被告知额度重置（MCP Limits：claude.ai 等共享 5,000 tool calls／日／UTC 零点；Claude Code 按调用方地址 25／日；配 key 后走 key 限额）
- 工具可能返回 warnings／medium confidence（本站 HS 样例即是）——**不能**当最终归类
- 本站**未**调用完整 25 工具集；**未**跑 `uk_duty_calculator`／`adr_lookup` 的 live 断言（公开页有示例，勿与本站实测混淆）
- 不做订舱／申报／轨迹／承运商比价；需要履约动作请用人审后的承运商／Easyship 等流程
- 定价页 Free 文案写 “All 24 endpoints”，MCP 工具为 **25**（含 MCP-only `get_subscribe_link`）——引用时分开表述

## 来源与核验状态

**公开可核验**

探针表见文首「Lab 探针成品」；此处保留主链接与采编说明。

- 主链接：[The freight MCP server](https://www.freightutils.com/mcp)（URL、25 tools、只读边界、Limits、envelope、contact@freightutils.com）
- 首页：[The neutral freight reference layer](https://www.freightutils.com/)（数据集表、构建时 live 示例、npm v2.22.5 叙述）
- 定价：[API Pricing](https://www.freightutils.com/pricing)（Anonymous／Free key／Pro £19／月／50k；contact@freightutils.com）
- 联系：公开页反复给出 `contact@freightutils.com`（MCP 页、定价 FAQ）
- 端点探活（本站，2026-10-26 Asia/Shanghai，**无 API key**）：

```
POST https://www.freightutils.com/api/mcp  method=initialize
→ HTTP 200  serverInfo.name=freightutils-mcp  version=2.22.5

POST …/api/mcp  method=tools/list
→ HTTP 200  tools.length=25

GET  https://www.freightutils.com/api/mcp/health
→ HTTP 200  status=ok  tools_registered=25  mcp_version=2.22.5

POST …/api/mcp  tools/call hs_code_lookup {"query":"cotton t-shirt"}
→ HTTP 200  hscode=610910

POST …/api/mcp  tools/call get_subscribe_link {}
→ HTTP 200  monthly_price=£19  monthly_limit=50000

POST …/api/mcp  tools/call cbm_calculator {120×80×100cm ×10}
→ HTTP 200  totalCbm=9.6
```

- 采编：2026-10-26（Asia/Shanghai）。公开文档 + 匿名 initialize／list／health／3 次只读 tools/call；**未**订阅 Pro、**未**做报关或 ADR 合规裁定。与 Avalara／Gateway／border.bot／EximAgent／Easyship 的区别见「解决什么问题」。

## 据公开帖摘要

**MCP 页（freightutils.com/mcp）：**

- 定位：A neutral reference layer for AI agents — 25 freight tools with typed, source-cited responses. No freight to sell, no carrier to push.
- 远程 URL：`https://www.freightutils.com/api/mcp`；Claude Connector 无需账号／登录／API key
- 全部 25 工具只读：none books, files, pays for or changes anything
- 工具组：Freight calculations（cbm／chargeable_weight／ldm／pallet／consignment／shipment_summary／unit_converter／emissions 等）；ADR 2025（adr_lookup／exemption／lq_eq）；Customs（hs_code_lookup／uk_duty_calculator／incoterms／ics2_check）；Codes／places（airline／airport／nearest_airport／unlocode／container／uld／vehicle／validate／resolve_reference）；MCP-only `get_subscribe_link`
- Envelope：`result` + `confidence` + `_source` + `citation`；As of v2.22.5 every successful tool call costs exactly one HTTP request against your rate limit
- Limits：Claude 共享 5,000 tool calls／日（UTC 重置）等；Anonymous 与 Pro 见定价；问题联系 `contact@freightutils.com`

**首页：**

- 中立参考层；Reference data and deterministic calculations only — not booking, filing, tracking, carrier rating, or legal determination
- 数据集示例：ADR 2025 verified；HS 2022（页表写 6,937 codes；MCP `hs_code_lookup` 文案写 Search 6,940…——以工具／页当面文案为准，勿合并成第三个数）；UN/LOCODE 116,232 等
- npm：freightutils-mcp v2.22.5

**定价页：**

- Free Anonymous £0 — 25 requests/day，No signup
- Free registered key — 100 requests/day（页文案）
- Pro — 页面与 `get_subscribe_link`：**£19**/mo，50,000 requests/month
- 超额 429；企业／更高量联系 `contact@freightutils.com`
- FAQ：Is the API really free? Yes…

**本站工具返回摘要（2026-10-26）：**

- HS 610910 + citation／warnings 如上
- Pro link 工具明确：Agents must not attempt to complete checkout themselves
- CBM 9.6 m³ 与首页公开 CBM 示例（10 × 120×80×100 cm → 9.6 m³）一致

## English brief

FreightUtils hosts a neutral, read-only freight MCP at `https://www.freightutils.com/api/mcp` (also `npx freightutils-mcp`) with 25 typed, source-cited tools — CBM/LDM/chargeable weight, ADR 2025, WCO HS 2022 (6-digit), live UK duty via GOV.UK, UN/LOCODE, airline/airport codes, and more. Public pricing: anonymous 25 req/day free; Pro £19/mo for 50,000 requests (also returned by `get_subscribe_link`). Differs from Avalara/Gateway/border.bot/EximAgent (tariff/landed-cost/trade-intel products) and Easyship (labels/fulfilment): FreightUtils does not book, file, track, or rate carriers. This Lab page cites public docs plus a 2026-10-26 Asia/Shanghai anonymous probe (initialize/tools/list/health HTTP 200, v2.22.5, 25 tools; live `hs_code_lookup` → 610910; `cbm_calculator` → 9.6 m³; Pro link £19/50k) — no API key, no Pro checkout, no customs filing. A human confirms declarations, customer quotes, ADR acceptance, and any paid subscribe.
