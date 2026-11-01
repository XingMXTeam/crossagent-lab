---
title: "官网：Meta Muse 的 Shopify 连接器（管商品与库存，资金与上线主题要人点头）"
titleEn: "Official: Meta Muse Shopify connector — catalog and inventory in chat, money moves and theme publish need a person"
summary: "据 Shopify Help《Shopify connector for Muse》（2026-11-01 抓取）与 Meta 新闻稿（文内 2026-09-29，页面同时标 2026-10-08）：Muse 可以在注册前先生成一家店、连接已有店，或在连接流程里注册后再回到对话。连上之后能处理商品、集合、库存、折扣和分析；订单与顾客为只读。没有 App Store 安装链接，要在 Muse 里提出连接 Shopify，再跳转批准访问。即便批了写权限，退款、取消或捕获订单、标记已付款、退货和礼品卡仍然被挡；套餐、支付、税费和域名也不能改。已连接的店不能直接改正在对外的主题，改动落在未发布副本上，theme_publish 要再确认。Meta 称 Muse 在美国和加拿大可用，连接器包括 Shopify、Stripe、QuickBooks、Klaviyo 等。本站未登录 Muse，未连接任何店。"
summaryEn: "Per Shopify Help “Shopify connector for Muse” (fetched 2026-11-01) and Meta’s news post (dated September 29, 2026, with October 8, 2026 also on the page): Muse can create a store before signup, connect a store you own, or sign up inside the connect flow and return to chat. After that it can work with products, collections, inventory, discounts, and analytics; orders and customers stay read-only. There is no App Store install link — you ask Muse to connect Shopify and approve access on the redirect. Refunds, cancel or capture, mark paid, returns, and gift cards stay blocked even with write access, as do plan, payments, taxes, and domains. On a connected store the connector does not edit the live theme; edits go to an unpublished copy, and theme_publish asks you to confirm. Meta says Muse is available in the US and Canada, with connectors that include Shopify, Stripe, QuickBooks, and Klaviyo. Lab did not sign in or connect a store."
category: ops-finance
agents: ["Muse"]
tools: ["Shopify connector for Muse", "create-product", "set-inventory", "list-orders", "run-analytics-query", "theme_publish", "create-discount"]
source: 官网
sourceUrl: https://help.shopify.com/en/manual/ai-powered-tools/connecting-ai-tools/shopify-connector-for-muse
sourceType: public
date: 2026-11-01
dateNote: "2026-11-01（Asia/Shanghai）采编 Shopify Help https://help.shopify.com/en/manual/ai-powered-tools/connecting-ai-tools/shopify-connector-for-muse （含动作名 create-product、set-inventory、list-orders、run-analytics-query、theme_publish 等，以及写权限下仍禁止的退款／取消／捕获／标记已付／退货／礼品卡，和不可改 live theme、套餐、支付、税费、域名）。辅链 https://about.fb.com/news/2026/09/introducing-muse-small-business/ ，标题 The Future Is for Everyone: Muse for Small Business，文内日期 September 29, 2026，页面同时显示 October 8, 2026；该文写 Muse 在美国和加拿大可用，并点名 Shopify 等连接器。未登录 Muse，未跳转批准，未连接或创建店铺，未调用任何 action。Canvas 建店在 Help 中标为已宣布但工具内尚不可用。"
featured: false
prompt: |
  You are connected to my Shopify store through the official Shopify
  connector for Muse. Access was approved outside this chat. Do not ask
  me to paste Admin tokens.

  Goal today: {{goal}}
  Store: {{store_name_or_domain}}
  Optional SKU or product name: {{sku_or_title_or_empty}}

  Rules:
  1) Name Shopify in the request so Muse uses the connector. Say which
     store you are on (get-shop-info). If it is the wrong store, ask me
     to switch-shop. Do not invent products, stock, orders, or analytics.
  2) Prefer the named connector actions. Catalog, inventory, percentage
     discounts, and analytics only. One analytics question per turn.
  3) Orders and customers are read-only (list-orders, get-order,
     list-customers). Never refund, cancel, capture, mark paid, process
     a return, or touch gift cards — Help says those stay blocked even
     with write access.
  4) Do not change plan, payments, taxes, or domains. Do not edit the
     live theme. Theme file edits on a connected store belong on an
     unpublished copy. Do not call theme_publish unless I explicitly
     say PUBLISH THEME in this chat, and tell me to confirm the live
     theme in Admin afterward.
  5) Creating a collection publishes it to the online store (Help).
     Ask before create-collection. Discount creates are percentage-off
     codes only; do not claim you edited an existing code.
  6) Status batches stop at 50 products. If a batch stops early, tell
     me to finish in Admin. Do not retry the remainder on your own.
  7) Meta's US/Canada availability note and the connector list are
     product claims. If Muse cannot see Shopify, say so. Do not route
     this task through Claude Desktop MCP or the Shopify AI Toolkit.
  Output: (a) action names called, (b) fields returned, (c) ACTIONS
  REQUIRING HUMAN APPROVAL.
---

## 解决什么问题

已经在用 Meta Muse 管小事的店主，如果店铺在 Shopify，就不想再在聊天和后台之间抄商品、库存和折扣。Shopify Help 把这条路径写成 **Shopify connector for Muse**：在 Muse 里说要连接 Shopify，跳到 Shopify 批准访问，然后在同一对话里处理商品、集合、库存、百分比折扣和分析；订单和顾客只能读。

它解决的是「Muse 会话里调用你批准过的 Shopify 能力」。标准套餐费仍付给 Shopify，Help 写连接器本身不再加一笔 Shopify 手续费；Muse 的订阅费付给 Meta。地区以 Meta 新闻为准：Muse 在美国和加拿大提供。本站没有验证你所在地区能否打开这个连接器。

与站内相近篇错位：

- [Shopify Claude 连接器](/cases/shopify-claude-connector-store-collective/)：Claude 侧的官方连接器，并包含 Collective 选货。本条是 Muse，Help 页没有把 Collective 写成这条连接器的能力。
- [ChatGPT／Claude 管店总览](/cases/shopify-chat-connectors-manage-store/)：Build with AI 上的多助手入口。本条只写 Muse 的 Help 动作与硬限制。
- [Reddit：Shopify AI Toolkit／MCP](/cases/reddit-shopify-ai-toolkit-mcp-bulk/)：Claude Code／Cursor 上的开发者 MCP，直接打 Admin。本条不是那条 MCP，也没有 App Store 安装包。

## 人审闸门（必须人工确认）

以下事项不得由 Muse 当成已经做完。Help 写明其中几项即使批了写权限也会被挡住，必须回 Shopify Admin：

1. **退款、取消或捕获订单、标记已付款、处理退货、创建或调整礼品卡** — 批了写权限也不可经连接器做
2. **改套餐、支付、税费、域名** — 只能在 Admin
3. **改正在对外的主题，或发布主题** — 已连接店铺上，文件编辑落在未发布副本；`theme_publish` 必须你在对话里明确同意，并在 Admin 的 Online Store → Themes 核对当前主题。未保存到账号的预览店，Help 写提交会写到该店当时的 live theme，分享链接前要单独同意
4. **在跳转页批准数据访问、切换店铺、保存预览店到正式账号、购买域名** — 涉及账号与账单，由店主点
5. **新建集合** — Help 写连接器会把新建集合发布到网店。先看清规则再让它创建
6. **把 Admin token 或批准截图贴进可转发的对话** — 禁止
7. **一次改超过 Help 上限的商品状态** — `bulk-update-product-status` 单次最多 50 个。中途停下就回 Admin 收尾，不要让对话自己续跑

订单与顾客记录按 Help 为只读。改库存、建折扣、改商品状态前，仍要人说清范围。

## 可复现步骤

前置（据 Help 与 Meta 新闻；本站未登录）：

1. 能使用 Muse 的账号。Meta 新闻写 Muse 面向美国和加拿大。连接器在手机、网页和 Muse 桌面端；Help 写目前不支持 WhatsApp
2. 三条入口任选其一：注册前先描述业务生成店铺、连接你已经拥有的店、或从 Muse 的连接流程里注册 Shopify 再回到对话
3. 安装方式：Help 写明 **不在 Shopify App Store**，也没有一条直接安装链接。在 Muse 里说连接 Shopify，按跳转登录、选店、批准访问

跟做路径（公开 Help，非本站实测）：

1. 在 Muse 里点名 Shopify，确认这条对话用的是连接器，而不是泛泛的经营建议
2. 问当前店是哪一家（动作名 `get-shop-info`）。不对就 `switch-shop`，并重新授权
3. **商品与库存**：`search_products`／`create-product`／`update-product`，`get-inventory-levels` 先看数量，再 `set-inventory`（要带地点和原因）。状态批量用 `bulk-update-product-status`，单次不超过 50
4. **订单与顾客**：`list-orders`（Help 写一次最多 50）、`get-order`、`list-customers`。只读。退款和取消回 Admin
5. **分析**：`run-analytics-query`。Help 建议一次只问一个具体问题
6. **折扣**：`create-discount` 只建百分比码。Help 写它不修改已有折扣码，也不建固定金额折扣
7. **主题**：已连接的店用 `theme_bash`／`theme_commit` 改未发布副本。要上线时你明确同意后才讨论 `theme_publish`。Help 的总则段仍写连接器不能直接改 live theme；以 Admin 里当前主题为准
8. 页面、菜单、metafield、markets、翻译没有专用动作时走 `graphql_query`／`graphql_mutation`，Help 写这些修改前会再问你
9. Help 把「用 Canvas 从 Muse 设计店铺」标成已宣布、工具里还不可用。不要把 Canvas 当成已经能用的步骤

## 预期结果与失败限制

**预期（Help 描述）：**

- 三种开店／连店路径，批准后可管理商品、集合、库存、百分比折扣和分析
- 订单、顾客、分析为读；库存和商品在写权限与员工权限允许时可以改
- 聊天里能看到动作名，例如 `create-product`、`set-inventory`、`list-orders`、`run-analytics-query`
- 已连接店铺的主题编辑留在未发布副本；发布要确认
- 预览店在保存前有密码，顾客不能购买；查看链接大约 30 分钟过期（Help 的「about 30 minutes」）

**失败／边界：**

- 未在 Muse 里点名 Shopify 时，回答可能只是普通说明，没有调连接器
- 无写权限或员工权限不足时只能读；大批量可能做到一半停下
- 资金类动作、套餐／支付／税费／域名，即使用户同意也做不成
- 预览店的地址，Help 写任何拿到链接的人都可能用 AI 工具查看并修改。不要把链接发到不可信的地方
- 新建集合会发布到网店；数字商品还要人去装 Digital Products 应用并上传文件
- Meta 新闻里的「不经你同意不发布、不发送、不花钱」是产品原则。Shopify 这条连接器的硬限制以 Help 为准
- 本站**未**登录 Muse、**未**批准访问、**未**调用动作。没有样例订单或库存数字
- 美国、加拿大以外是否可用，Help 本页没有写；不要用新闻稿代替你账号里的实际入口

## 来源与核验状态

**公开可核验**

- 主文：[Shopify Help — Shopify connector for Muse](https://help.shopify.com/en/manual/ai-powered-tools/connecting-ai-tools/shopify-connector-for-muse)
- 辅链：[Meta News — Muse for Small Business](https://about.fb.com/news/2026/09/introducing-muse-small-business/)（September 29, 2026；页面同时显示 October 8, 2026）
- 采编：2026-11-01（Asia/Shanghai）。本站只读公开页，**未登录、未连店**。本站未实测 — 无探针表。

## 据公开帖摘要

Shopify Help 说明：Muse 是 Meta 的个人 AI 代理。Shopify 连接器用来在聊天里创建或管理店铺。你可以在还没有 Shopify 账号时先生成一家店，连接已有店，或在连接流程中注册。连接之后可以处理商品、集合、库存、订单、顾客、折扣和分析；其中订单与顾客的具体动作是读取。安装不走 App Store。数据能改什么，取决于你批准的访问级别、员工权限，以及 Muse 自己的连接器设置。

同一页的限制段写明：不能改 live theme、不能在该段所述范围内发布或删除主题；不能改套餐、支付、税费、域名；不能退款、取消或捕获订单、标记已付款、处理退货、调整礼品卡。动作表另给 `theme_publish`（确认后发布）以及未保存店铺与已连接店铺不同的主题落点，见上文闸门。动作表还列出 `create-product`、`set-inventory`、`list-orders`、`run-analytics-query`、`create-discount`、`graphql_mutation` 等名称。

Meta 新闻《The Future Is for Everyone: Muse for Small Business》写：Muse 是已在美国和加拿大提供的个人 AI 代理；小企业可以向它提目标，并连接正在用的工具。文中点名的连接器包括 Asana、Box、Canva、Dropbox、Figma、Granola、HighLevel、Intuit QuickBooks、Klaviyo、Lovable、Notion、Shopify、Slack、Stripe、Zoom，以及 Facebook 与 Instagram 的商业账号。文内原则是：未经你同意，不发布、不发送、不花钱。该文没有 Shopify 动作表；动作边界以 Help 为准。

## English brief

Shopify Help documents the Muse connector: create a store before signup, connect an existing store, or sign up in the connect flow, then manage catalog, inventory, percentage discounts, and analytics, with orders and customers read-only. There is no App Store link. Refunds and other money movements, plan, payments, taxes, and domains stay blocked. Live-theme edits are not allowed on a connected store; `theme_publish` waits for confirmation. Meta’s September 29, 2026 post (page also shows October 8) says Muse is in the US and Canada and lists Shopify among its connectors. Lab fetched those pages on 2026-11-01 (Asia/Shanghai) and did not sign in or connect a store.
