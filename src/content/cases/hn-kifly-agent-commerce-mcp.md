---
title: "HN：Kifly 把电商店铺目录交给 Agent（MCP 搜品、购物车、付款链接）"
titleEn: "HN: Kifly exposes a store catalog to AI agents via MCP (search, cart, payment link)"
summary: "据 Show HN（roberttk1，item 49200345，2026-08-06）与 Kifly 官网／MCP／Shopify 文档，以及本站 2026-10-26（Asia/Shanghai）匿名探活：卖家把库存同步进向量化目录，经远程 MCP https://kifly.ai/api/mcp 暴露；店面销售助手可落在 Shopify／WooCommerce。文档列 22 个工具，checkout 只返回付款链接，没有工具单独完成购买。本站无 key 的 initialize／tools/list → HTTP 200（serverInfo.name=kifly，version=1.0.0，22 tools）；无凭证的 search_products → HTTP 401。未搜到商品，未下单。"
summaryEn: "Show HN (roberttk1, item 49200345, 2026-08-06) plus Kifly home/MCP/Shopify docs and a 2026-10-26 (Asia/Shanghai) anonymous Lab probe: sellers sync inventory into a vectorized catalog on remote MCP https://kifly.ai/api/mcp, with a storefront sales agent for Shopify/WooCommerce. Docs list 22 tools; checkout returns a payment link and no tool completes a purchase alone. Lab initialize/tools/list returned HTTP 200 (serverInfo.name=kifly, version=1.0.0, 22 tools); search_products with no credential returned HTTP 401. No product search result and no order."
category: ops-finance
agents: ["Claude", "ChatGPT", "Gemini", "Shopify storefront agent"]
tools: ["Kifly MCP", "https://kifly.ai/api/mcp", "search_products", "get_seller", "list_sellers", "get_policies", "create_cart", "add_to_cart", "get_cart", "update_cart_item", "set_shipping_address", "quick_buy", "checkout", "order_status", "register_buyer", "request_buyer_code", "verify_buyer", "get_buyer_profile", "save_buyer_address", "list_orders", "get_help", "get_platform_limits", "submit_feedback", "request_feature"]
source: Hacker News
sourceUrl: https://news.ycombinator.com/item?id=49200345
sourceType: public
date: 2026-10-26
dateNote: "HN Show HN 标题 Kifly – Expose your ecommerce store to AI agents via MCP，作者 roberttk1，item 49200345，发帖日 2026-08-06。2026-10-26（Asia/Shanghai）采编 HN、https://kifly.ai/、https://kifly.ai/docs/mcp、https://kifly.ai/docs/shopify。同日匿名 POST https://kifly.ai/api/mcp：initialize → HTTP 200（serverInfo.name=kifly，title=Kifly — Agentic Commerce & Payments，version=1.0.0）；tools/list → HTTP 200（22 tools，名称与文档表一致）；tools/call search_products 且不带 Authorization、不带 meta.ucp-agent → HTTP 401。未使用 API key；未发送 UCP profile；未完成搜品或付款。"
featured: false
prompt: |
  You help a Shopify or WooCommerce merchant evaluate Kifly
  (https://kifly.ai/api/mcp) as a buyer-facing catalog MCP.
  You do not place orders or change the merchant's Shopify catalog.

  Store: {{store_domain}}
  Goal: {{discover | cart | checkout_link | seller_setup | policies}}
  Known product query, if any: {{query}}

  Rules:
  1) Call Kifly tools only when a credential or meta.ucp-agent.profile is
     actually configured. If search_products returns 401, say discovery
     was not authorized. Do not invent products, prices, or stock.
  2) checkout returns a payment link. Give that link to a human.
     No tool completes the purchase alone. Never open or pay the link.
  3) Seller setup: imported Shopify products stay drafts until a person
     publishes them. Policies must be published or agents will not answer
     policy questions. Do not publish drafts yourself.
  4) On Shopify, Kifly may fill a missing or very short description only.
     Never ask it to change price, inventory, title, status, handle, or vendor.
  5) x402 USDC settlement is off by default. Do not enable it.
  6) Do not paste kfa_live_ or kfn_live_ keys into chat. Seller keys stay
     scoped to one store and cannot be upgraded to network scope.
  Output: (a) tools actually called and HTTP/status, (b) fields returned,
  (c) unknowns, (d) ACTIONS REQUIRING HUMAN APPROVAL (publish drafts,
  publish policies, confirm the payment link, enable USDC, any fee plan).
---

## 解决什么问题

独立站卖家希望购物 Agent 能搜到自己的货、放进购物车，并走到**卖家自己的付款**，而不是只丢一份只读商品 Feed。Kifly 的做法是：卖家同步库存，做成向量化目录，再经 MCP 暴露。店面上还可以放一个销售助手（Show HN 点名 Shopify、WooCommerce）。

买家侧的网络入口是远程 MCP `https://kifly.ai/api/mcp`。卖家也可以发一把只看自己店的 seller key。付款仍是传统收银加稳定币这条叙事（帖文）；Shopify 文档把 x402 USDC 写成**默认关闭**的可选项。`checkout` 只交回付款链接，没有工具单独把购买做完。

与站内相近篇错位：

- [Shop MCP 可见性检测](/cases/shop-mcp-visibility-tools/)：Shopify 官方 Catalog／`mcp.shop.com` 与 ChatGPT 等渠道资格、第三方扫描器。Kifly 是另一家目录网络，不是 Shop Pay 渠道资格检测。
- [Vercel Shop](/cases/vercel-shop-agent-ready-storefront/)：商家自有域名上的 Next.js／Hydrogen 店面，UCP／MCP 搜品建车在**商家域名**。Kifly 是托管在 `kifly.ai` 的目录 MCP，外加可选的店面助手。
- [Shopify Checkout WebMCP](/cases/hn-shopify-checkout-webmcp/)：结账页浏览器内工具，`complete_checkout` 要买家在页上确认。Kifly 的 `checkout` 返回链接，购买在链接后的收银完成。
- [Agora 统一货盘](/cases/hn-agora-universal-catalog-agents/)：跨店目录与 `/agent` 页面、REST，支付走 Stripe token。Kifly 是卖家同步进自己网络的 MCP 工具集（含买家注册／OTP）。
- [Shopify 聊天连接器](/cases/shopify-chat-connectors-manage-store/)：商家在 ChatGPT／Claude 里**管店**（查单、改价）。Kifly 这条是让 Agent **来买**，Shopify 文档写明不拿订单权限、不拿顾客权限。
- [Anthropic commerce-agents](/cases/hn-anthropic-commerce-agents-merchant-approval/)：开源商家后台蓝图，写操作先暂存。Kifly 是已托管的购物 MCP，不是那份仓库。

## 人审闸门（必须人工确认）

以下动作不得由 Agent 自动执行：

1. **打开并支付 `checkout` 返回的付款链接** — 文档写明：没有工具单独完成购买；买家打开链接并确认
2. **在 Kifly 发布草稿、补类目／图片／大于零的价格** — Shopify 文档：同步进来的是草稿；缺价格、图片或类目就不会对 Agent 可见
3. **发布退货、配送、保修政策，以及配送范围与店铺资料** — 未发布政策时，Agent 会拒绝回答政策问题
4. **打开 Accept x402 USDC** — Shopify 文档：默认关闭；打开后订单仍登记在 Shopify，但是另一条结算
5. **把价格、库存、标题、状态、handle、vendor 交给 Kifly 去改** — Shopify 文档：Kifly 只补缺失或过短的商品描述，不改这些字段；已有正文不被覆盖
6. **把 `kfa_live_`／`kfn_live_` 贴进对话、仓库或工单** — seller key 只能看自己的店，且不能升级成网络范围
7. **把首页 FAQ 的费率写成合同** — 2026-10-26 首页 FAQ 写 Starter 免费、经 Kifly 成交抽 3%，Business 为 $199／月且抽成降到 1%。是否开通由账号所有人决定

## 可复现步骤

前置（据 [MCP 文档](https://kifly.ai/docs/mcp)、[Shopify 文档](https://kifly.ai/docs/shopify)、[首页](https://kifly.ai/) 与本站探活）：

1. 支持远程 Streamable HTTP 的客户端，端点 `https://kifly.ai/api/mcp`。文档写明该端点无状态：请求用 POST；GET（听流）或 DELETE（结束会话）得到 **405**
2. 按要做的事选凭证。文档表：试用可无凭证，但要在 `meta` 里带 UCP agent profile；只接自己的店用 seller key `kfa_live_`；代表人的买家 Agent 用 OAuth 2.1；连接时没有人在场的 headless Agent 用 network key `kfn_live_`
3. 无凭证时的 meta 形如 `{ "meta": { "ucp-agent": { "profile": "https://your-agent.example/.well-known/ucp" } } }`。文档写这能覆盖搜索、卖家、购物车和付款链接；买家身份和订单历史仍要凭证
4. Shopify 卖家：从 App Store 或 Kifly 后台一键安装，批准权限，在主题编辑器里保存 App embed（助手在保存前不出现）。商品须在 Shopify 为 Active 且发布到 Online Store

步骤：

1. **读入口帖**：[HN #49200345](https://news.ycombinator.com/item?id=49200345)。能力以文档和探活为准，不跟帖分数。

2. **Claude**：MCP 文档顶部有装进 Claude Desktop／claude.ai 的按钮，并会要 agent key（在 `/dashboard/api-keys` 生成）。其他宿主把上面的 URL 加进 MCP 配置；需要 header 时再加 `Authorization`。

3. **OAuth 2.1**（文档）：发现地址 `https://kifly.ai/.well-known/oauth-authorization-server`，动态注册 `https://kifly.ai/oauth/register`。注册客户端不需要 Kifly 卖家账号。PKCE S256。claude.ai 一类宿主会自己谈。

4. **卖家 key**（只看自己的目录，不能升到网络范围）：

   ```text
   Authorization: Bearer kfa_live_xxxxxxxxxxxxxxxx
   ```

   示例勿换成真实 key。

5. 连接后先 `tools/list`。文档分组与本站 2026-10-26 名单一致，共 **22** 个：发现 `search_products`、`get_seller`、`list_sellers`、`get_policies`；购物车 `create_cart`、`add_to_cart`、`get_cart`、`update_cart_item`、`set_shipping_address`、`quick_buy`；结账 `checkout`、`order_status`；买家 `register_buyer`、`request_buyer_code`、`verify_buyer`、`get_buyer_profile`、`save_buyer_address`、`list_orders`；支持 `get_help`、`get_platform_limits`、`submit_feedback`、`request_feature`。

6. 文档中的典型顺序：`search_products` → `create_cart`／`add_to_cart` → `set_shipping_address` → `checkout` 把链接交给买家 → `order_status` 直到已付款。超限返回 **429**，并带 `Retry-After`。具体配额数字文档指向 Platform Limits，本站未测到一个数字，这里不补。

7. **Shopify 上线前人工核对**：草稿已发布（价格大于零、至少一张图、有类目）；政策已粘贴；配送范围与店铺名／简介／logo 已设。卸载会立刻停掉 Agent 流量；文档写账号和目录保留 **30** 天。

8. 本站匿名路径只做到 initialize 与 tools/list。不要把「无 meta、无 key 的 search_products」当成已经搜到货。

## 预期结果与失败限制

**预期（公开文档 + 本站匿名返回）：**

- 远程 MCP 为 Streamable HTTP，`https://kifly.ai/api/mcp`
- `tools/list` 为 22 个工具；`checkout` 返回付款链接
- initialize 的 `serverInfo`：`name=kifly`，`title=Kifly — Agentic Commerce & Payments`，`version=1.0.0`。同一次响应的 description 写明：跨卖家发现、购物车、经 kifly.ai 上的 Stripe 付款链接购买实体商品；买家可用邮箱 OTP 注册／恢复并保存地址；`kfn_live_` 看全网，`kfa_live_` 只看一家
- Shopify：Agent 读目录、建车，然后把购物者送到**商家自己的 Shopify checkout**；merchant of record 仍是商家。目录对任意 MCP／UCP Agent 开放，不绑一家助手
- 首页 FAQ（2026-10-26 采编）：Claude 与 ChatGPT 可找到商品；Gemini 做过测试，并称 Siri 走 Gemini。支持协议名单里还有 UCP、MCP、ACP、x402。成交前由人在结账确认

**失败与边界：**

- 不带 `Authorization`、也不带 `meta.ucp-agent.profile` 时，本站 `search_products` → **HTTP 401**，`code=UNAUTHORIZED`。响应要求 Bearer，或在支持的调用上带 UCP profile。**不能**写成匿名搜品已成功。本站**没有**再补 profile 重试，因此也不把「带 profile 就能搜到」写成已测
- seller key 看不到别的店；无凭证路径覆盖不到买家身份和历史订单
- 商品仍是 Kifly 草稿、缺价／图／类目，或 Shopify 侧不是 Active／未上 Online Store，Agent 侧看不到
- 未发布政策时，Agent 不回答政策问题
- 首页营销插图里的示例问句（咖啡、狗粮等）不是本站探活结果
- 本站未安装 Shopify 应用，未注册买家，未走 OTP，未打开付款链接，未启用 USDC

## 来源与核验状态

**公开可核验**

- 主链接：[Show HN: Kifly – Expose your ecommerce store to AI agents via MCP](https://news.ycombinator.com/item?id=49200345)（roberttk1，2026-08-06）
- MCP：[Kifly MCP Integration](https://kifly.ai/docs/mcp)
- Shopify：[Kifly for Shopify](https://kifly.ai/docs/shopify)
- 首页：[kifly.ai](https://kifly.ai/)
- 端点探活（本站，2026-10-26 Asia/Shanghai，**无 API key**，未送 UCP profile）：

```
POST https://kifly.ai/api/mcp  method=initialize
→ HTTP 200
  serverInfo.name=kifly
  serverInfo.title=Kifly — Agentic Commerce & Payments
  serverInfo.version=1.0.0

POST …/api/mcp  method=tools/list
→ HTTP 200  tools.length=22
  名称与文档表一致（见上节）

POST …/api/mcp  tools/call search_products
  （无 Authorization，无 meta.ucp-agent）
→ HTTP 401  code=UNAUTHORIZED
  无商品载荷
```

- 采编：2026-10-26（Asia/Shanghai）。分数会变；2026-10-26 打开 HN 时约 1 point、1 comment。与 Shop MCP、Vercel Shop、Checkout WebMCP、Agora、Shopify 聊天连接器、Anthropic commerce-agents 的区别见首节。

## 据公开帖摘要

**HN（item 49200345，2026-08-06，roberttk1）：**

- 标题：Kifly – Expose your ecommerce store to AI agents via MCP
- 卖家同步库存，建成向量化商品库，经 MCP 可见
- 卖家得到：现有站点（Shopify、WooCommerce 等）上的销售助手；可交给客户或组织的 seller-scoped MCP；在 Claude、ChatGPT、Gemini、Siri 里经全网 MCP `https://kifly.ai/api/mcp` 做发现和结账
- 实体商品的付款：传统方式与稳定币。帖文写基于 UCP，付款经 Stripe、Coinbase、x402（beta），并计划以后支持 OpenUSD
- 作者跟帖：同一套轨道可以让 Telegram bot 等在所处界面对接销售助手并结账
- 演示视频链接在帖内（YouTube `ZVZlqNGTzIM`）。本站未把视频里的画面当成工具返回

**MCP 文档：**

- 传输：Streamable HTTP；宿主连接后自己列出工具和参数
- 四种身份：无凭证 + UCP profile；`kfa_live_`；OAuth 2.1；`kfn_live_`
- 可选的 `ai.kifly.agent.id`（8–64 位，字符集 `A-Z a-z 0-9 . _ : -`）只用于追溯，不改变权限；服务端只存 keyed hash。name 是显示名，不要填邮箱或电话
- `checkout`：买家打开并确认付款链接。没有工具单独完成购买
- 买家工具含注册、验证码、校验（文档表中的 `request_buyer_code`／`verify_buyer`），以及 `order_status`、`get_help`、`get_platform_limits`、反馈工具

**Shopify 文档：**

- 一键安装；Agent 经 Shopify checkout 购买；merchant of record 仍是商家
- 目录先以草稿同步，再由人发布。Kifly 只写缺失或很短的描述，从不写价格、库存、标题、状态、handle、vendor
- 权限：只有 product。无订单、无顾客。Online Store 2.0 主题；助手是 theme app extension
- 可选：Accept x402 USDC，默认关；订单仍进 Shopify
- 卸载后 Agent 流量立即停止；账号与目录保留 30 天

**首页 FAQ（2026-10-26）：**

- Starter 免费，含站内助手不限对话，以及 Instagram DM；经其处理的销售抽成 3%。Business $199／月，抽成 1%，并加上 store agent。WhatsApp、TikTok、iMessage 标为 Soon
- 助手不改价格、不改刊登、不向店铺发布。人在 Claude／ChatGPT 的结账确认购买

## English brief

Kifly (Show HN item 49200345, 2026-08-06) syncs a merchant catalog into a hosted Streamable HTTP MCP at `https://kifly.ai/api/mcp` so agents can search, cart, and receive a payment link. Docs list 22 tools across discovery, cart, checkout, buyer OTP, and support. `checkout` does not complete a purchase. Auth is none plus a UCP agent profile, a seller key `kfa_live_` (one store only), OAuth 2.1, or a network key `kfn_live_`. On Shopify the app keeps the merchant as merchant of record, imports drafts for a human to publish, and writes only a missing or very short description — never price, inventory, title, status, handle, or vendor. x402 USDC is off by default. This is a buyer-commerce network, distinct from Shop MCP catalog eligibility, Vercel Shop on the merchant domain, in-page Checkout WebMCP, Agora’s cross-store catalog, Shopify’s seller chat connectors, and Anthropic’s open-source merchant-agent repo. Lab on 2026-10-26 (Asia/Shanghai), no API key: initialize and tools/list HTTP 200, serverInfo kifly 1.0.0, 22 tools; `search_products` without a credential or UCP profile HTTP 401. Anonymous product search did not succeed. A human publishes drafts and policies, confirms any payment link, and approves USDC or a paid plan.
