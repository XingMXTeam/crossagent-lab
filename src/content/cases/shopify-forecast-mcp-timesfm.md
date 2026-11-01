---
title: "GitHub：shopify-forecast-mcp 用 TimesFM 2.5 读 Shopify 做预测（Alpha，只读 scope）"
titleEn: "GitHub: shopify-forecast-mcp — TimesFM 2.5 forecasts on Shopify Admin (alpha, read scopes)"
summary: "据仓库 mcostigliola321/shopify-forecast-mcp 与 PyPI：这是一个商家本机 MCP（MIT，Alpha v0.1.0），把 Google TimesFM 2.5 接到 Shopify Admin GraphQL，用来做收入和需求预测、促销对照、异常、时段比较和季节性。README 点名的工具是 forecast_revenue、forecast_demand、analyze_promotion、detect_anomalies、compare_periods、compare_scenarios、get_seasonality；安装命令是 uvx shopify-forecast-mcp，客户端写明 Claude Desktop、Claude Code、Cursor。环境变量是 SHOPIFY_FORECAST_SHOP 与 SHOPIFY_FORECAST_ACCESS_TOKEN，scope 为 read_orders、read_all_orders、read_products、read_inventory。PyPI 0.1.0 的摘要与 README 一致，要求 Python >=3.11 且 <3.12。仓库创建于 2026-04-16T01:35:46Z，最后推送 2026-04-20T16:39:27Z，采编时 1 star。README 称首次运行会下载约 400MB 权重。本站未安装 uvx，未配置店铺 token，未调用工具。"
summaryEn: "Per GitHub mcostigliola321/shopify-forecast-mcp and PyPI: a merchant-local MCP (MIT, alpha v0.1.0) wires Google TimesFM 2.5 to Shopify Admin GraphQL for revenue and demand forecasts, promo comparison, anomalies, period comparison, and seasonality. The README names forecast_revenue, forecast_demand, analyze_promotion, detect_anomalies, compare_periods, compare_scenarios, and get_seasonality. Install is uvx shopify-forecast-mcp, for Claude Desktop, Claude Code, and Cursor. Env vars are SHOPIFY_FORECAST_SHOP and SHOPIFY_FORECAST_ACCESS_TOKEN, with scopes read_orders, read_all_orders, read_products, and read_inventory. PyPI 0.1.0 matches that summary and requires Python >=3.11,<3.12. The repo was created 2026-04-16T01:35:46Z, last pushed 2026-04-20T16:39:27Z, and had 1 star at editorial check. The README says the first run downloads about 400MB of weights. Lab did not install uvx, did not set a store token, and did not call tools."
category: ops-finance
agents: ["Claude Desktop", "Claude Code", "Cursor"]
tools: ["uvx shopify-forecast-mcp", "forecast_revenue", "forecast_demand", "analyze_promotion", "detect_anomalies", "compare_periods", "compare_scenarios", "get_seasonality"]
source: GitHub
sourceUrl: https://github.com/mcostigliola321/shopify-forecast-mcp
sourceType: public
date: 2026-11-01
dateNote: "2026-11-01（Asia/Shanghai）采编 https://github.com/mcostigliola321/shopify-forecast-mcp README 与 PyPI shopify-forecast-mcp。GitHub API 于采编日核对：created 2026-04-16T01:35:46Z，pushed 2026-04-20T16:39:27Z，stars 1（会变），license MIT。PyPI 版本 0.1.0，summary 与 README 首句一致，requires_python >=3.11,<3.12，wheel 上传时间 2026-04-19T21:02:49Z。README 称首次下载 TimesFM 权重约 400MB。未安装 uv、未执行 uvx、未写入 SHOPIFY_FORECAST_ACCESS_TOKEN、未调用任一工具、未登录 Shopify。"
featured: false
prompt: |
  You answer forecast questions for one Shopify store using the local MCP
  shopify-forecast-mcp only, and only if it is already configured on this
  machine. You do not change the store.

  Shop domain the operator already set: {{shop_domain}}
  Question: {{question}}
  Horizon in days, if they named one: {{horizon_days_or_empty}}

  Rules:
  1) Call only forecast_revenue, forecast_demand, analyze_promotion,
     detect_anomalies, compare_periods, compare_scenarios, or
     get_seasonality when that tool is actually available. If the server
     is missing, Python is not 3.11, or a call errors, say so. Do not
     invent revenue, units, confidence bands, lift, or stockout dates.
  2) Quote numbers only from this session's tool output. Label them
     TimesFM output over the store's Admin data, not a finance close.
  3) Documented scopes are read_orders, read_all_orders, read_products,
     and read_inventory. Do not create purchase orders, change prices,
     set inventory, or edit discounts. A reorder flag is not an order.
  4) Never ask for SHOPIFY_FORECAST_ACCESS_TOKEN, the shop password, or
     a custom-app secret in chat. Those stay in the local MCP env.
  5) The README's ~400MB first-run download, "under 10 seconds" later
     runs, and example promo results are source claims. Do not promise
     them. Alpha v0.1.0 may change before 0.2.
  6) This server is Shopify Admin only. Do not answer FBA, Amazon, or
     Flipkart questions with it.
  Output: (a) tools called and status, (b) figures the tool returned,
  (c) unknowns, (d) ACTIONS REQUIRING HUMAN APPROVAL (any reorder, promo,
  or price decision).
---

## 解决什么问题

Shopify 后台看得到历史订单，但「下个月大概卖多少、哪几个 SKU 会先不够、上次促销相对基线抬了多少」通常还要导出再建模。`shopify-forecast-mcp` 的公开做法是：在商家自己的机器上起一个 MCP，用 **Google TimesFM 2.5** 读 **Shopify Admin GraphQL** 的订单、商品和库存，把预测、促销对照和异常直接交回 Claude Desktop、Claude Code 或 Cursor。

README 写明这是 **Alpha v0.1.0**，MIT，安装入口是 `uvx shopify-forecast-mcp`。文档中的 token scope 只有读：`read_orders`、`read_all_orders`、`read_products`、`read_inventory`。所以它解决的是「用本店历史做预测」，不是改价、改库存或发采购单。

与站内相近篇错位：

- [ReplenishRadar](/cases/replenishradar-shopify-amazon-inventory-mcp/)：Shopify 加 FBA 的库存位置、断货风险和**草稿 PO**，批准后才发送。本条只有 Shopify，输出是 TimesFM 预测，不是采购单。
- [n8n 多平台库存同步](/cases/n8n-shopify-amazon-flipkart-inventory-sync/)：把同一库存数推到 Shopify、Amazon 与 Flipkart。本条不写渠道库存，也不接 FBA。

## 人审闸门（必须人工确认）

1. **按预测去采购、改价、改折扣或改库存** — 工具返回的是预测和对照。下单与改站必须人在 Admin 或采购流程里另做决定。
2. **创建自定义应用并签发 Admin token** — scope 按 README 保持在上列四项只读。人在 Shopify 后台批准，不要把 `SHOPIFY_FORECAST_ACCESS_TOKEN` 贴进聊天。
3. **首次运行下载约 400MB TimesFM 权重** — 这是 README 的体积说法。是否占用这台机器的磁盘和网络，由人确认。
4. **把 Alpha 示例（30 天区间、促销提升、场景毛利）写进对客户或财务的承诺** — 禁止。示例是 README 里的问法说明；本站没有跑出任何数字。
5. **在 Python 3.12 或更高版本上认定已经装好** — PyPI 要求 `>=3.11,<3.12`。版本不符就停，不要换一套口头数字充数。
6. **拿这个 MCP 回答亚马逊 FBA 或其他渠道** — 禁止。数据源是这一家 Shopify 店的 Admin。

## 可复现步骤

前置（公开 README／PyPI；本站未执行）：

1. 一台可以跑 `uv` 的机器，Python 满足 `>=3.11,<3.12`
2. 你有权管理的 Shopify 店。按仓库 `docs/SETUP.md` 做自定义应用，打开 `read_orders`、`read_all_orders`、`read_products`、`read_inventory`，令牌只放环境变量 `SHOPIFY_FORECAST_SHOP` 与 `SHOPIFY_FORECAST_ACCESS_TOKEN`
3. 客户端：Claude Desktop、Claude Code 或 Cursor，配置一条本地 stdio MCP，命令 `uvx`，参数 `shopify-forecast-mcp`

跟做（只读公开材料）：

1. 打开 [GitHub README](https://github.com/mcostigliola321/shopify-forecast-mcp) 与 [PyPI 0.1.0](https://pypi.org/project/shopify-forecast-mcp/0.1.0/)，确认摘要仍是 TimesFM 2.5 + Shopify Admin GraphQL，许可证 MIT
2. 先在终端看进程能否起来：`uvx shopify-forecast-mcp`（stdio，没有客户端时 Ctrl-C 退出）。这是 README 的自检写法，**本站没跑**
3. 写入客户端配置并重启。第一次真正预测时，README 称会下载约 400MB 权重
4. 只问只读问题，例如下一窗口的收入区间、某段促销相对基线、或哪些天落在预测区间外。工具名以 README 的七个为准：`forecast_revenue`、`forecast_demand`、`analyze_promotion`、`detect_anomalies`、`compare_periods`、`compare_scenarios`、`get_seasonality`
5. README 还写了不把 token 放进环境变量的本机路径（`shopify store execute` 的浏览器 OAuth，作者注明不能用于 Docker）。两条路径本站都没有执行
6. 任何「该补货」只当作预测提示，回到 Admin 核对现库存后再人工决定

## 预期结果与失败限制

**预期（README／PyPI 声称）：**

- 本地 MCP 与同库 CLI，核心是 TimesFM 2.5 加 Shopify Admin GraphQL
- 七个工具覆盖收入预测、需求与补货提示、历史促销对照、异常日、时段比较、2–4 个情景、季节性说明
- 返回形式写成带置信区间的 markdown 表（README 的产品说明，不是本站样例）
- PyPI 版本 **0.1.0**，分类为 Alpha；仓库许可证 **MIT**

**失败／边界：**

- 本站**未**安装 `uvx`、**未**挂店铺 token、**未**调用工具，因此没有可引用的预测数字
- Python 不在 `>=3.11,<3.12` 时，按 PyPI 元数据不应安装成功
- 只读 scope 不够或 token 无效时，工具应失败；不要用模型记忆补一张收入表
- 星标在采编时为 **1**，之后会变。Alpha 说明写明 0.2 之前 API 可能改
- 首次权重大小「约 400MB」是 README 句子。后续「少于 10 秒」也是 README 句子，本站未计时
- 不覆盖 FBA，不代替多渠道库存同步或草稿采购单

## 来源与核验状态

**公开可核验**

- 主链：[github.com/mcostigliola321/shopify-forecast-mcp](https://github.com/mcostigliola321/shopify-forecast-mcp)
- 辅链：[PyPI shopify-forecast-mcp 0.1.0](https://pypi.org/project/shopify-forecast-mcp/0.1.0/)
- 采编：2026-11-01（Asia/Shanghai）。**未**安装、**未**授权店铺、**未**调用工具。本站未实测 — 无探针表。

## 据公开帖摘要

README 把项目定义成商家侧 MCP：连接 Google TimesFM 2.5 与 Shopify Admin GraphQL，用于预测、需求计划、促销分析和异常检测，并写明没有逐店再训练。快速开始分三步：安装 `uv`、按 `docs/SETUP.md` 取得只读 Admin token、把 `uvx shopify-forecast-mcp` 写进 Claude Desktop 配置。同一 README 列出上面七个工具，并给出收入、补货提示、促销对照和情景规划的问法示例。作者还写了 Docker 镜像与一条匹配的 CLI（`uvx --from shopify-forecast-mcp shopify-forecast ...`）。许可证 MIT；TimesFM 权重的许可证作者指向 Apache 2.0。仓库创建于 2026-04-16T01:35:46Z，最后推送 2026-04-20T16:39:27Z，采编时星标 1。PyPI 0.1.0 的 wheel 上传于 2026-04-19T21:02:49Z。

## English brief

`shopify-forecast-mcp` is a public alpha (v0.1.0, MIT) that runs TimesFM 2.5 against one Shopify store’s Admin GraphQL from a local `uvx` MCP, with seven read-side tools for forecasts, promos, anomalies, scenarios, and seasonality. PyPI requires Python >=3.11 and <3.12. Lab on 2026-11-01 (Asia/Shanghai) read the README and PyPI metadata only — no install, no token, no tool call. Do not turn a forecast into a purchase order without a separate human decision.
