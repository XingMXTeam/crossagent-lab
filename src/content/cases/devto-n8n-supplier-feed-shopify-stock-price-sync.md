---
title: "DEV：免费 n8n 模板把供应商库存和价格同步到 Shopify（默认 dry-run）"
titleEn: "DEV: a free n8n template syncs supplier stock and prices to Shopify (dry-run on by default)"
summary: "据 Arturas Tikkivo 2026-10-27 的 DEV 帖：一份免费 n8n 模板每 6 小时拉取供应商 CSV 或 JSON，按 SKU 匹配 Shopify 变体，只回写有变化的库存和价格；不创建、不编辑、不删除商品，标题、描述和图片也不会送出。模板里 dryRun 默认为 true，先发 Slack 摘要。作者写库存写入要带 changeFromQuantity，并给 mutation 加上 @idempotent；超过 maxPriceChangePercent 的价格先扣下，超过 maxZeroPercent 的缺货清零会停跑。本站未导入、未在任何店铺执行。"
summaryEn: "Arturas Tikkivo’s DEV post (2026-10-27): a free n8n template pulls a supplier CSV or JSON every 6 hours, matches Shopify variants by SKU, and writes only stock and price that changed. It does not create, edit, or delete products, and it never sends titles, descriptions, or images. dryRun defaults to true and posts a Slack summary. The author says stock writes need changeFromQuantity and an @idempotent directive; price jumps over maxPriceChangePercent are held, and a feed that would zero more than maxZeroPercent of tracked variants stops the run. Lab did not import or execute it."
category: ops-finance
agents: ["n8n"]
tools: ["n8n", "Shopify Admin GraphQL", "inventorySetQuantities", "productVariantsBulkUpdate", "Slack"]
source: 博客
sourceUrl: https://dev.to/tikkivo/a-free-n8n-template-to-sync-supplier-stock-and-prices-to-shopify-with-dry-run-mode-c73
sourceType: public
date: 2026-11-02
dateNote: "DEV Community 帖，作者 Arturas Tikkivo，页面 Posted on Oct 27（相对 2026 年语境为 2026-10-27）。source 枚举没有 DEV，本条用「博客」，原文 URL 即该帖。2026-11-02（Asia/Shanghai）只读帖文与文内模板 JSON。作者写在 n8n 2.44.5 上对测试用 Shopify API 跑过。本站未导入工作流、未创建 Shopify 应用、未兑换 client_credentials 令牌、未使用 shpat_、未向任何店铺写入库存或价格、未向 Slack 发消息。帖文没有提到 Claude 或其他 LLM 节点；模板节点里也没有模型调用。"
featured: false
prompt: |
  You are reviewing a dry run of the Tikkivo supplier-feed → Shopify
  stock and price template before any live write. Do not call Shopify.
  Do not invent on-hand counts or costs.

  I will paste:
  - The Config fields I intend to use (no secrets): locationId, skuPrefix,
    markup, minMarginPercent, priceEnding, maxPriceChangePercent,
    stockBuffer, zeroMissingSkus, maxZeroPercent, dryRun
  - A few feed rows: SKU, stock, cost
  - The matching Shopify variants I already exported: SKU, price, available

  Do this:
  1) Normalize SKUs the way the post describes (trim, upper-case). If two
     Shopify variants share a SKU, mark both DO NOT TOUCH.
  2) For each matched SKU, show the stock after stockBuffer and the price
     from the posted formula. Hold any price move larger than
     maxPriceChangePercent. Do not invent a compare-at price.
  3) If zeroMissingSkus is true, list SKUs that would go to 0 because they
     are missing from the feed. If that share of stock-tracked variants
     would exceed maxZeroPercent, say SAFETY STOP and write nothing.
  4) SKUs that are in the feed but not in Shopify are report-only. Never
     propose creating a product, title, image, or description.

  Rules:
  - End with: DO NOT SET dryRun TO FALSE until a human has read this on a
    development store.
  - Never ask me to paste the client secret, shpat_ token, or Slack webhook.
  - This workflow has no LLM step. Do not add one in order to "fix" a SKU.
---

## 解决什么问题

代销或分销的小店，每周都要把供应商的库存和价格文件抄进 Shopify。抄晚了，店还在卖供应商周二已经断货的东西；抄错价，要么亏，要么标出离谱的数字。Arturas Tikkivo 在 DEV 上放出的免费 n8n 模板，做的是这一件窄事：下载 CSV 或 JSON，按 SKU 找到变体，**只更新有变化的库存和售价**。

帖文写明它不会创建、编辑或删除商品，标题、描述和图片根本不会出现在请求里。`dryRun` 在模板里默认是 `true`：计划照样算完，然后只把摘要发到 Slack。这是卖家运营自动化，人通过干跑和两条安全阈值留在回路里。帖文没有 Claude，模板 JSON 里也没有模型节点。它不是对话代理；若要和 Agent 栈放在一起，也只是旁边的库存／价格作业，作业本身不靠模型决定写不写。

与站内相近篇错位：

- [n8n：Shopify、Amazon 与 Flipkart 库存同步](/cases/n8n-shopify-amazon-flipkart-inventory-sync/)：Google Sheets 当主数据，每 10 分钟把**同一可售数**推到三个渠道，不改售价。本模板只碰 Shopify，数据来自供应商文件，库存和价格都可能改，而且默认不写。
- [ReplenishRadar MCP](/cases/replenishradar-shopify-amazon-inventory-mcp/)：Shopify 加 FBA 的断货风险和**草稿采购单**，公开路径上要经理批准才发送。本模板不创建采购单；关掉 dry-run 之后，它写的是 Shopify 库存和价格。
- [Amazon n8n 库存预警](/cases/amz-n8n-inventory-alerts-approval-gate/)：用 SP-API 算可售天数，AI 起草补货，采购必须人批。本模板没有 LLM，也没有采购动作；人批的是「这份供应商文件可以写进这家店」。

## 人审闸门（必须人工确认）

1. **第一次必须停在 dry-run** — 模板 Config 里 `dryRun` 为 `true`。帖文的安装顺序是：先看 Slack 报告，数字对了再改成 `false` 并激活。在开发店上做这件事，不要用在售店当第一次试验。
2. **SKU 是唯一键** — 作者描述：两边都 trim 并转成大写再比。Shopify 里两个变体共用一个 SKU 时，两个都不改，报告里会指出。映射含糊就停，不要猜。
3. **`zeroMissingSkus` 会把「文件里没有的 SKU」库存打成 0** — 模板默认值是 `true`。自己的货如果和供应商货混在同一店，必须设 `skuPrefix`（例如只处理 `SUP-`），否则「不在文件里 → 0」会打到自有库存。`maxZeroPercent` 默认 30：若将要被打成 0 的、可管库存的变体比例超过这个值，整次运行在写入前抛错停住。作者给过一条自己的拒绝句：`Safety stop: 7 of 7 stock-tracked variants are missing from the feed and would be set to 0 (limit 30%)`。阈值挡的是大面积清零，不是小范围错 SKU。
4. **`maxPriceChangePercent` 默认 50** — 变动大于该比例的价格留在 Slack 里等人看，不写入。作者的测试文件把成本 18.20 写成 180.0，按他的标价会把 38.99 的花瓶标成 396.99。这是他的例子，不是本站的店。
5. **密钥不进对话** — Shopify Dev Dashboard 应用的 client id／secret 放在 n8n Custom Auth 凭证里，用 `client_credentials` 换 24 小时 Admin API token。旧应用的永久 `shpat_` 只放 Header Auth。供应商文件若要登录，用 Header／Basic／Query Auth 凭证，不要把密码写进 Config。Slack incoming webhook 要同时填进 Config 和错误分支节点，因为错误分支是另一次执行，读不到 Config。作者还写：24 小时 token 会出现在已保存的执行数据里；在意的话，关掉成功执行的保存。
6. **Slack 摘要不是批准按钮** — 干跑只是报告。把 `dryRun` 改成 false 并打开每 6 小时的 schedule，仍然是人在 n8n 里做的动作。

## 可复现步骤

前置（帖文 Setup，作者估计大约 10 分钟；本站未做）：

1. 在 Shopify Dev Dashboard 建应用，scope 为 `read_products`、`write_products`、`read_inventory`、`write_inventory`，安装到店上，复制 client id 和 secret
2. n8n 建 Custom Auth，body 里放 client id 和 secret，选到「Get Shopify token」节点。该节点向 `{shop}/admin/oauth/access_token` 发送 `grant_type: client_credentials`
3. 填 Config：店铺 URL、`locationId`（Locations 页面 URL 末尾的数字，写成 `gid://shopify/Location/…`）、feed URL、列名、加价规则、Slack webhook。模板 JSON 里的默认值是：`apiVersion` 为 `2026-10`，`dryRun` true，`markup` 2.2，`priceEnding` 0.99，`minMarginPercent` 35，`maxPriceChangePercent` 50，`stockBuffer` 0，`zeroMissingSkus` true，`maxZeroPercent` 30，`notifyWhenNothingChanged` false
4. 把同一条 Slack webhook 再贴进错误告警节点。Workflow settings → Error workflow 选这份工作流自己
5. 列名必须和文件表头一致。作者写，列名不对时运行会停，并列出真实表头，而不是静默变成「0 条匹配」

跟做（帖文「What it does」；本站未导入）：

1. 每 6 小时或手动执行。Config 保存店铺、库位、文件地址、列名和价格规则
2. 用 client id／secret 换 24 小时 token。旧的 `shpat_` 应用则删掉这个节点，两个 Shopify HTTP 节点改走 `X-Shopify-Access-Token`
3. 下载供应商 CSV 或 JSON。欧洲文件常见分号、小数逗号和 Excel BOM；作者写解析器会识别 `;`、`,`、tab 和 `|`，去掉 BOM，并把库存值 `>100` 读成 100
4. 用 Admin GraphQL 分页读变体的 SKU、价格，以及该库位的 available。作者把 API `2026-04` 起的变化写成：`inventorySetQuantities` 的每一条数量都要 `changeFromQuantity`，mutation 还要 `@idempotent(key: …)`。模板把 GraphQL 版本钉在 Config 的 `2026-10`。`changeFromQuantity` 是刚才读到的库存；中间若有订单，Shopify 回 `CHANGE_FROM_QUANTITY_STALE`，这次记为错误，下次用新数字再写。幂等键用 execution id 和批次号，限流重试不会写两次
5. 计划节点按 SKU 分桶：匹配上的比较库存和价格；Shopify 有、文件没有的，在 `zeroMissingSkus` 打开且可管库存时打成 0，否则不动；文件有、店里没有的只报告，不建档；没有 SKU、不在 `skuPrefix` 里、不跟踪数量、不在所选库位、或 Shopify 侧 SKU 重复的，跳过
6. 价格规则按帖文公式：`price = cost × markup`，再不低于 `cost / (1 − minMarginPercent / 100)`，然后**向上**取整到 `priceEnding`（0.99；设为 -1 则只四舍五入到分）。作者用 `markup = 2.2` 举的例子：成本 `8,40` → 18.48 → 18.99；成本 `11,00` → 24.20 → 24.99。低加价的例子：markup 1.3、成本 10.00 得到 13.00（他写成只有 23% 毛利），`minMarginPercent = 35` 时变成 15.38，再向上到 15.99。这些是帖文算式，不是本站的报价
7. `dryRun` 为 true 时，IF 节点直接去 Slack。作者贴过一份自己的干跑摘要（8 行文件、10 个变体、将改 5 条库存和 6 条价格，并点名 SUP-1001 等 SKU）。那是他的运行记录。本站没有这份文件，也不能把那些 SKU 当成某家店的现状
8. `dryRun` 为 false 时才分批写入：库存每批最多 100 条 `inventorySetQuantities`，价格用 `productVariantsBulkUpdate`，一次请求最多 10 个商品。写完用 GraphQL alias 回读 Shopify 说自己改了多少，而不是用请求条数充当成功数
9. 没有变化时默认不发 Slack，除非打开 `notifyWhenNothingChanged`。生产运行失败走错误分支，另发一条 Slack

公开帖：[DEV — A free n8n template to sync supplier stock and prices to Shopify](https://dev.to/tikkivo/a-free-n8n-template-to-sync-supplier-stock-and-prices-to-shopify-with-dry-run-mode-c73)。

## 预期结果与失败限制

**预期（帖文概述）：**

- 一个库位、一份供应商文件、只同步库存和价格
- 默认干跑，Slack 里能看见将改、未改、未匹配、跳过和被扣下的涨价
- 限流以 HTTP 200 加 `errors[].extensions.code = "THROTTLED"` 的形式出现。n8n 的 Retry on fail 不会触发。作者用分页表达式重试：写请求最多 6 次、间隔 2 秒。若变体列表最后一页的 `hasNextPage` 不是 false，计划节点在写入前停止，避免把没读到的一半误当成「不在文件里」然后清零
- 作者写自己在 n8n 2.44.5 上、对测试 Shopify API 跑通过，并注明用 AI 工具帮助起草了这篇帖

**失败／边界：**

- 本站**未**导入 JSON、**未**建应用、**未**换 token、**未**对任何店铺写入。任何「某 SKU 已改成某价格」都不来自本站
- 一个工作流只同步一个库位。第二个仓库要复制工作流并改 `locationId`。不做 compare-at、汇率换算，也不创建变体
- 干跑报告里的数字来自你自己的文件和店。作者的 SUP- 示例不能抄进对外报价
- 安全阈值减少的是「整份坏文件把店清零」和「单价跳变直接写上」，不保证 SKU 列没有对错货
- 这不是跨 Amazon／Flipkart 的库存主数据，也不是补货采购单

## 来源与核验状态

**教程复现**

- 主链：[DEV Community — A free n8n template to sync supplier stock and prices to Shopify (with dry-run mode)](https://dev.to/tikkivo/a-free-n8n-template-to-sync-supplier-stock-and-prices-to-shopify-with-dry-run-mode-c73)
- 作者 Arturas Tikkivo，页面 Posted on Oct 27。采编 2026-11-02（Asia/Shanghai）。本站未实测 — 未导入、未执行。无探针表。

## 据公开帖摘要

帖文描述一份可导入的 n8n 模板（作者计为 15 个节点加设置便签）：每 6 小时或手动执行；用应用的 client id／secret 换 24 小时 token，或改走旧的 `shpat_`；下载 CSV／JSON；分页读取 Shopify 变体；按 SKU 做同步计划；dry-run 只报告，关闭后才批量写库存和价格；Slack 摘要列出 changed、unchanged、unmatched、skipped 和 errors。写入范围只有库存和价格。

作者把 GraphQL `2026-04` 的 `inventorySetQuantities` 变化、HTTP 200 的 THROTTLED、欧洲 CSV、以及「坏文件不得清空全店」写成这篇模板比一个下午更长的原因。价格向上取整是故意的，避免 18.48 被收成 17.99 吃掉毛利。帖末注明用 AI 工具帮助起草，并要求先在开发店的 dry-run 模式里测试。

## English brief

Arturas Tikkivo’s 2026-10-27 DEV post publishes a free n8n workflow: every six hours, download a supplier CSV or JSON, match Shopify variants by SKU, and update only stock and price. Products, titles, descriptions, and images are out of scope. `dryRun` defaults to true and Slack gets the plan. Stock mutations use `changeFromQuantity` plus `@idempotent` (required from Admin API 2026-04; the template pins `2026-10`). Throttled GraphQL responses can be HTTP 200. Price moves over `maxPriceChangePercent` (default 50) are held. If turning missing SKUs into zero would hit more than `maxZeroPercent` (default 30) of stock-tracked variants, the run stops before writing. There is no LLM node. Lab did not import or run it. A human reads the dry-run on a development store before `dryRun` is set to false. This is Shopify-only supplier sync, not the Sheets-to-Shopify/Amazon/Flipkart quantity workflow, not ReplenishRadar draft POs, and not an FBA reorder alert.
