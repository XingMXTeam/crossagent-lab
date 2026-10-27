---
title: "ShopsForBots MCP：Agent 可查的店铺目录（UCP／声明 MCP，匿名只读）"
titleEn: "ShopsForBots MCP: agent-queryable shop directory (UCP / declared MCP, anonymous read)"
summary: "据 ShopsForBots 首页／llms.txt／bot 文档与本站 2026-10-27（Asia/Shanghai）匿名探活：远程 MCP https://shopsforbots.com/mcp，宣称目录约 50 万家带机器可读信号的网店；无登录即可评测。本站实测 initialize／tools/list → HTTP 200、serverInfo.name=shopsforbots、version=1.0.0、4 tools；get_stats → total=500128、全 Shopify、generated_at=2026-10-19T08:45:04Z；search_shops(q=coffee,limit=2) → total=3655；get_shop(allbirds.com) → score=63 且返回声明 MCP URL。声明 MCP ≠ 本站已测购；对方与本站均未调用店铺侧 MCP、未下单。"
summaryEn: "Per ShopsForBots public home/llms.txt/bot docs plus a 2026-10-27 (Asia/Shanghai) anonymous Lab probe: remote MCP at https://shopsforbots.com/mcp lists ~500k shops with machine-readable signals; no login to evaluate. Lab verified initialize/tools/list HTTP 200, serverInfo.name=shopsforbots, version=1.0.0, 4 tools; get_stats total=500128 all Shopify generated_at=2026-10-19T08:45:04Z; search_shops(q=coffee,limit=2) total=3655; get_shop(allbirds.com) score=63 with a declared MCP URL. Declared MCP ≠ Lab-verified purchase; neither party called shop MCPs or bought anything."
category: listing
agents: ["Cursor", "Claude", "Claude Code", "Cline"]
tools: ["ShopsForBots MCP", "shopsforbots.com/mcp", "search_shops", "get_shop", "list_categories", "get_stats"]
source: 官网
sourceUrl: https://shopsforbots.com/
sourceType: public
date: 2026-10-27
dateNote: "2026-10-27（Asia/Shanghai）采编首页、/llms.txt、/bot/、/.well-known/mcp.json；同日匿名 POST https://shopsforbots.com/mcp：initialize → HTTP 200（serverInfo.name=shopsforbots, version=1.0.0）；tools/list → HTTP 200（4 tools）；tools/call get_stats／search_shops／get_shop／list_categories → 均 HTTP 200（见正文探针表）。未登录；未调用任何店铺侧 MCP；未下单／填表／登录店铺。"
featured: false
prompt: |
  You help a cross-border operator discover online shops that publish
  machine-readable agent signals (UCP manifest, declared MCP endpoint,
  llms.txt) via the ShopsForBots hosted MCP
  (https://shopsforbots.com/mcp). Prefer ShopsForBots tools for directory
  search and shop-record lookup.

  Query (fill only known fields):
  - Goal: {{find shops | look up one domain | category stats}}
  - Free-text q / domain: {{...}}
  - Optional filters: category, country (ISO alpha-2), platform, protocol,
    min_score, status, limit

  Rules:
  1) Call only ShopsForBots tools that tools/list exposes. Quote fields
     exactly as returned (domain, score, protocols, capabilities, mcp[],
     note). If a tool errors or is missing, say so — do not invent shop
     counts, scores, MCP URLs, or checkout success.
  2) "MCP" / protocols including "mcp" in a shop record means the shop's
     UCP manifest **declares** an MCP endpoint. ShopsForBots and this Lab
     have NOT called that endpoint and have NOT tested purchase. Never
     claim a shop is purchase-verified.
  3) All four directory tools are read-only. Never buy, pay, log in to a
     shop, fill forms, or call a shop's declared MCP on behalf of the human
     without an explicit separate human yes (that is outside this directory
     MCP).
  4) Fair use: public llms.txt / well-known card cite ~60 requests/min per
     IP. For bulk, prefer their static index; for commercial use contact
     bot@shopsforbots.com (llms.txt) — wait for human approval before any
     commercial outreach or paid placement.
  5) Scores are heuristic (v1). Unknown country/fields may be null. The
     corpus is currently Shopify-dominated per their own notice — do not
     restate as "all of ecommerce."
  Output: (a) tools called, (b) table from the live response, (c) open
  questions, (d) ACTIONS REQUIRING HUMAN APPROVAL (calling a shop MCP,
  any purchase/login, commercial license email, sponsoring CrossAgent).
---

## Lab 探针成品（先看结果）

**方法：** 匿名 · 无 API key · 无登录 · 2026-10-27（Asia/Shanghai）  
**端点：** `POST https://shopsforbots.com/mcp`（Streamable HTTP／JSON-RPC）

| 探针 | 结果 |
|------|------|
| `initialize` | HTTP **200** · `serverInfo.name=shopsforbots` · `title=ShopsForBots` · `version=**1.0.0**` |
| `tools/list` | HTTP **200** · **4** tools：`search_shops`／`get_shop`／`list_categories`／`get_stats`（均 `readOnlyHint=true`） |
| `get_stats` | HTTP **200** · `total=**500128**` · `by_platform.shopify=500128` · `by_protocol.ucp=500128`／`mcp=500126` · `score_mean=63` · `generated_at=**2026-10-19T08:45:04Z**` · `score_version=v1` |
| `search_shops` `{"q":"coffee","limit":2}` | HTTP **200** · `total=**3655**` · 样例 `1157coffee.com`／`1208coffeeroasters.com` · `score=63` · `protocols=["ucp","mcp"]` · `platform=shopify` |
| `get_shop` `{"domain":"allbirds.com"}` | HTTP **200** · `name=Allbirds` · `score=63` · `status=verified` · `mcp=["https://weareallbirds.myshopify.com/api/ucp/mcp"]` · `manifest=https://www.allbirds.com/.well-known/ucp` |
| `list_categories` | HTTP **200** · 15 类（含 `unknown=243473`、`fashion=44390`、`food_drink=25793` 等，与 `get_stats.by_category` 一致） |

`initialize.instructions` 与每次工具 `note` 均写明：*「MCP declared」means the shop's UCP manifest names an MCP endpoint; we have NOT called it. No purchase testing.*

**本站未跑：** 调用任何**店铺侧**声明 MCP（含 Allbirds 返回的 URL）；对任一店铺下单／加购／登录／填表；打满 60 req／min 压测；商业授权邮件；付费赞助下单。

> **声明 MCP ≠ 本站已测购。** 目录里的 `protocols` 含 `mcp`，只表示对方在 UCP 清单里**写出了** MCP 端点；CrossAgent Lab **没有**对该端点做 `tools/list`／购物流实测。

### 公开声称 vs 本站探针

| 公开页声称 | 本站探针 | 差注 |
|------------|----------|------|
| 首页统计：**500,128** shops listed；valid UCP **500,128**；EU **44,586**；Last check run **2026-10-19** | `get_stats` → `total=500128` · `with_valid_ucp=500128` · `eu_company_country=44586` · `generated_at=2026-10-19T08:45:04Z` | 一致 |
| 首页 notice／llms.txt：样本、**mostly Shopify**；「MCP declared」未实测购 | `by_platform.shopify=500128`；工具 `note` 同文案；本站未调店铺 MCP、未购 | 一致（边界） |
| `/llms.txt`＋`/.well-known/mcp.json`：MCP `https://shopsforbots.com/mcp`；tools 四名；无 auth；fair use **60**/min | `initialize`／`tools/list` 匿名 HTTP **200**；well-known `authentication.required=false` · `rate_limit.requests=60` | 一致 |
| `/bot/`：Cursor 配置示例 `url: https://shopsforbots.com/mcp`；curl `search_shops` `q=coffee` | 同端点 `search_shops(q=coffee,limit=2)` → HTTP **200** · `total=3655` | 一致（只读搜索） |
| 商业联系：`bot@shopsforbots.com`（llms.txt） | 公开文本可见；本站**未发信** | 仅公开（本站未测外联） |

---

## 解决什么问题

跨境／Agent 购物工作流常卡在：**哪些网店已经放出机器可读入口**（UCP 清单、声明 MCP、`llms.txt`），而不是再靠人肉翻店。模型容易把「有 MCP 字样」说成「已经能代客下单」——二者不是一回事。

ShopsForBots 把自己定位为**只读目录**：自己对每个域名做只读检查并打分，再经 MCP／REST／WebMCP 把目录交给 Agent。它**不是**履约打单工具，也**不是**已验证购物流。

与站内相近篇错位：

- [Shopme MCP](/cases/shopme-cn-ecommerce-search-mcp/)：中国站（淘宝／天猫／小红书）**搜品**；不是全球「Agent 就绪店」目录。
- [Pomerado](/cases/pomerado-any-website-mcp/)：把**任意网站**生成托管 MCP 工具；不是现成店铺信号目录。
- [Easyship MCP](/cases/easyship-mcp-crossborder-shipping/)：履约比价／出单；会走向运单动作。ShopsForBots **只查目录，不下单**。
- [FreightUtils](/cases/freightutils-freight-mcp-cited-tools/)：货运数学／税则参考层；与零售店发现无关。
- ShopsForBots：匿名可读的 **UCP／声明 MCP 店铺目录**（本站探针日 `total=500128`，全为 Shopify 平台标记）；强调声明 ≠ 已测购。

## 人审闸门（必须人工确认）

以下动作不得由 Agent 自动执行：

1. **调用店铺侧声明的 MCP URL、对店铺下单／加购／结账** — 目录只记录「清单里写了端点」；购物流须人另开验收
2. **把 heuristic score 写成质量／可信／价格担保** — 对方写明分数测机器可读性，不测质量、价格或诚信
3. **把「500,128／全网店」写成覆盖全网** — 公开 notice：样本、当前以 Shopify 为主
4. **商业批量使用／转售目录数据** — llms.txt：private fair use；commercial → `bot@shopsforbots.com`，须人批准后再发
5. **打满限额后继续盲打或绕过 429** — fair use ~60 req／min／IP；bulk 应用静态 `index.json`
6. **对外承诺「本站已验证可代客购买某店」** — Lab 与对方均未做 purchase testing

## 可复现步骤

前置（据公开 `/bot/`／llms.txt／well-known + 本站探活）：

1. 支持远程 Streamable HTTP MCP 的客户端（Cursor、Claude Code、Cline 等）
2. **评测可不登录、不配 API key**（well-known：`authentication.required=false`）
3. 远程端点：`https://shopsforbots.com/mcp`
4. 自检：对端点 `initialize` → 期望 HTTP 200 且 `serverInfo.name=shopsforbots`（本站 2026-10-27 已见）

步骤：

1. **Cursor（远程 URL，与本站探活同一端点）** — 在 MCP 配置加入（`/bot/` 公开示例）：

   ```json
   {
     "mcpServers": {
       "shopsforbots": {
         "type": "http",
         "url": "https://shopsforbots.com/mcp"
       }
     }
   }
   ```

2. **stdio-only 客户端（据 `/bot/`）**：

   ```json
   {
     "mcpServers": {
       "shopsforbots": {
         "command": "npx",
         "args": ["-y", "mcp-remote", "https://shopsforbots.com/mcp"]
       }
     }
   }
   ```

3. 连接后先 `tools/list`，再试只读调用（与本站已跑通）：

   - `get_stats` — 看 `total`／平台／协议计数与 `generated_at`
   - `search_shops` with `q=coffee`, `limit=2` — 看 `total` 与样例 `domain`／`protocols`
   - `get_shop` with `domain=allbirds.com` — 看 `score`、`mcp[]`、`note`
   - （可选）`list_categories` — 拿 category id 再过滤 `search_shops`

4. **不要**把返回的店铺 `mcp` URL 自动接进客户端去下单。若要测某店购物流，须人另开任务、另做人审。

5. （可选）对照 REST：`GET https://shopsforbots.com/api/search?q=coffee&limit=2`、`GET https://shopsforbots.com/api/shop/allbirds.com`（公开文档）；本站用例以 MCP tools/call 为准。

## 预期结果与失败限制

**预期（公开文档 + 本站匿名工具返回）：**

- `tools/list`：**4** 个只读工具（与 llms.txt／well-known `tools` 数组一致）
- `get_stats`：本站见 `total=500128`、全 `shopify`、`generated_at=2026-10-19T08:45:04Z`、`score_mean=63`；`note` 重申未测购
- `search_shops`：按 `q`／过滤返回 `results[]`（`domain`、`score`、`protocols`、`capabilities`、`page`／`record` 链接等）；本站 `q=coffee` → `total=3655`
- `get_shop`：单域完整记录；本站 allbirds.com → 声明 MCP `https://weareallbirds.myshopify.com/api/ucp/mcp`，**未**由本站调用
- 限流叙述：~60 requests／min／IP；bulk 用 `/api/index.json`

**失败与边界：**

- 超额 → 429（公开 fair use）；应停手或改静态索引
- `country` 等字段常为 `null`（llms.txt：多数空，有证据才填）— 勿脑补国别
- 目录「verified」是对方检查状态枚举，**不是** CrossAgent「已测购」徽章
- 本站**未**调用店铺 MCP，**未**验证 checkout／cart 真能走通
- 数据会随对方 check run 更新；引用时写明本站探针日与 `generated_at`

## 来源与核验状态

**公开可核验**

- 主链接：[ShopsForBots](https://shopsforbots.com/)（首页统计、what this is (and is not) notice）
- Agent 文档：[Crawler / bot information](https://shopsforbots.com/bot/)（MCP URL、四工具、配置示例、fair use）
- [llms.txt](https://shopsforbots.com/llms.txt)（MCP／API、商业联系 `bot@shopsforbots.com`、声明 MCP 边界）
- Server card：[/.well-known/mcp.json](https://shopsforbots.com/.well-known/mcp.json)（version 1.0.0、tools、rate_limit 60）
- 端点探活（本站，2026-10-27 Asia/Shanghai，**无登录**）：

```
POST https://shopsforbots.com/mcp  method=initialize
→ HTTP 200  serverInfo.name=shopsforbots  version=1.0.0

POST …/mcp  method=tools/list
→ HTTP 200  tools.length=4
   (search_shops, get_shop, list_categories, get_stats)

POST …/mcp  tools/call get_stats {}
→ HTTP 200  total=500128  by_platform.shopify=500128
            generated_at=2026-10-19T08:45:04Z  score_mean=63

POST …/mcp  tools/call search_shops {"q":"coffee","limit":2}
→ HTTP 200  total=3655  (e.g. 1157coffee.com, 1208coffeeroasters.com)

POST …/mcp  tools/call get_shop {"domain":"allbirds.com"}
→ HTTP 200  score=63  mcp=[https://weareallbirds.myshopify.com/api/ucp/mcp]
```

- 采编：2026-10-27（Asia/Shanghai）。公开文档 + 匿名 initialize／list／4 次只读 tools/call；**未**调店铺 MCP、**未**下单、**未**发商业邮件。与 Shopme／Pomerado／Easyship／FreightUtils 的区别见首节。

## 据公开帖摘要

**首页（shopsforbots.com）：**

- 定位：Shops that welcome AI agents — list shops that publish machine-readable entry points；check every domain ourselves
- 统计条（采编时可见）：**500,128** shops listed；**500,128** with a valid UCP manifest；**44,586** in the EU；Last check run **2026-10-19**
- Notice：样本非全网、当前以 Shopify 为主；「MCP declared」= UCP 清单点名 MCP 端点、**未测试**；分数测机器可读性；never buy / log in / fill forms

**llms.txt：**

- MCP：Streamable HTTP，tools `search_shops`／`get_shop`／`list_categories`／`get_stats`；server card `/.well-known/mcp.json`
- Fair use 60 requests／min／IP；bulk 用静态 index；commercial → `bot@shopsforbots.com`
- Notes：MCP declared = 未对店铺端点做 tools/list／POST；不测购买；scores heuristic v1

**/bot/：**

- User-Agent `ShopsForBotsChecker`；只读 GET；honour robots；no logins／forms／purchases
- Agent access：REST + MCP + WebMCP；配置 JSON 与 curl 示例（含 `q=coffee`）

**本站工具返回摘要（2026-10-27）：**

- `serverInfo.version=1.0.0`；四工具只读
- 目录 `total=500128` 与首页一致；`search_shops(q=coffee)` → 3655 hits
- `get_shop(allbirds.com)` 返回声明 MCP URL + 标准 `note`（未测购）

## English brief

ShopsForBots hosts an anonymous, read-only MCP at `https://shopsforbots.com/mcp` (v1.0.0) with four tools — `search_shops`, `get_shop`, `list_categories`, `get_stats` — over a directory of shops that publish UCP / declared-MCP / llms.txt signals. Lab probe 2026-10-27 Asia/Shanghai (no login): initialize/tools/list HTTP 200; `get_stats` → total **500128**, all Shopify, `generated_at=2026-10-19T08:45:04Z`; `search_shops(q=coffee,limit=2)` → total **3655**; `get_shop(allbirds.com)` → score **63** with a **declared** MCP URL. Public pages and every tool `note` stress: declared MCP ≠ tested call; no purchase testing. Differs from Shopme (CN marketplace search), Pomerado (website→tool host), Easyship (labels), FreightUtils (freight maths). A human must approve any shop-MCP call, purchase, or commercial-use email to `bot@shopsforbots.com`.
