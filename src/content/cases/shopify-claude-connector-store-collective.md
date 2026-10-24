---
title: "Shopify Claude 连接器：聊天里建店、管店，并从 Collective 选货"
titleEn: "Shopify connector for Claude — preview a store, manage it, source Collective products"
summary: "据 Shopify Help：Claude 连接器可生成店面预览并认领成店、管理已有店铺（商品／库存／订单只读／折扣／分析），以及按描述从 Shopify Collective 搜货并导入；退款、结账、改支付与上线主题等仍被官方挡住，须在 Admin 做人审。"
summaryEn: "Shopify Help: the Claude connector can generate and claim storefront previews, manage an owned store (catalog, inventory, read-only orders, discounts, analytics), and import Shopify Collective products from a natural-language brief. Refunds, payments, live-theme edits stay blocked — finish those in Admin."
category: ops-finance
agents: ["Claude", "Claude Duet"]
tools: ["Shopify connector for Claude", "Shopify Collective", "claim-storefront-preview", "create-product", "set-inventory", "run-analytics-query"]
source: 官网
sourceUrl: https://help.shopify.com/en/manual/ai-powered-tools/connecting-ai-tools/shopify-connector-for-claude
sourceType: public
date: 2026-10-21
dateNote: "Shopify @Shopify 公开帖称 Claude Duet 首日已接 Shopify（约 2026-10-21）；能力以 Help 现文为准；2026-10-24 采编 Asia/Shanghai。与站内「Build with AI 总览」篇区分：本条专写 Claude 连接器动作表与 Collective 选货闸门"
featured: false
prompt: |
  You are connected to my Shopify store through the official Shopify connector for Claude.
  Data access and staff permissions are already approved outside this chat. Do not ask me
  to paste Admin API tokens into the conversation.

  Goal today: {{goal}}
  Store: {{store_name_or_domain}}
  Optional Collective brief: {{aesthetic_or_product_keywords}}
  Optional SKU / product name: {{sku_or_title}}

  Do this:
  1) Confirm which store the connector is on (get-shop-info). If wrong, ask me to switch-shop.
  2) Prefer dedicated connector actions over free-form GraphQL. Name each action you call.
  3) For catalog/inventory/discounts/analytics: report only fields the connector returned.
  4) For Shopify Collective: propose matching Collective products from my brief; import only
     after I say yes, and only after the Collective app is installed if prompted.
  5) Never attempt refunds, cancel/capture orders, gift cards, plan/payment/tax/domain changes,
     or edits to the live published theme. If I ask for those, tell me to use Shopify Admin.

  Rules:
  - One task per turn for analytics questions.
  - Say so when write access or a tool is missing — do not invent stock, prices, or orders.
  - Output: (a) actions called, (b) results table, (c) ACTIONS REQUIRING HUMAN APPROVAL.
---

## 解决什么问题

跨境／DTC 卖家要在 Claude 里开店或管店时，常卡在两件事：一是店面与商品要在 Admin 和聊天之间来回拷；二是想快速补货却不想自备库存。Shopify 官方 **Claude 连接器**把「生成店面预览 → 认领成店 → 管商品／库存／折扣／分析」，以及「用自然语言从 Shopify Collective 选货导入」接到同一会话里。

它解决的是「在 Claude 会话里调用已授权的 Shopify 能力」，不是又一个独立建站 SaaS。与站内「Shopify Build with AI 总览」篇不同：那边是多助手入口综述；本条按 Help 现文写清 **Claude 专用动作名、Collective 导入、以及官方明确禁止的写操作**。与「Shop MCP／Agent 买家结账」也不同：那边面向购物 Agent，这边面向店主运营。

## 人审闸门（必须人工确认）

以下动作**不得**由 Agent 自动当成已完成；Help 写明部分动作即使用户批了写权限也会被挡住，须运营在 Shopify Admin 处理：

1. **退款、取消／捕获订单、标记已付款、处理退货、创建或调整礼品卡** — 官方写明即使批准写权限也不可经连接器做
2. **改套餐、支付、税费、域名** — 须 Admin
3. **编辑已发布主题、发布或删除主题** — 连接器只能改未发布副本；上线须人在 Admin 发布
4. **认领店面预览成正式店铺、购买域名、安装 Digital Products／Collective App** — 涉及账号与计费，须人点确认
5. **从 Collective 批量导入供应商货盘、改零售价后上架** — 导入前人工看清供货与履约条款
6. **把 API／连接器授权截图或 token 贴进可分享对话** — 禁止；授权只在 Claude／Shopify 官方流程里完成

订单与顾客记录按 Help 为**只读**；改库存、建折扣、改商品状态前仍须人口头确认范围。

## 可复现步骤

前置（据 Help 现文）：

1. Claude 账号（含连接器可用的套餐／地区以 Anthropic 侧为准）
2. 桌面浏览器打开 Claude 的 [Shopify connector 安装页](https://claude.com/marketplace/connectors/shopify)，按引导跳到 Shopify Admin 批准数据访问级别
3. 若要从预览开新店：准备好稍后在 Admin 完成支付、运费、税费与去密码保护上线
4. 若要用 Collective：店铺可安装 Shopify Collective App（导入时若未装会被提示安装）

跟做路径（公开 Help，非本站实测）：

1. 在 Claude 对话里点名 Shopify，确认连接器已对本会话开启
2. **新店**：描述业态 → 生成 storefront previews → 选中后 `claim-storefront-preview` 认领；认领后按「AI 工具建店」帮助页在 Admin 收尾
3. **已有店**：连接器绑定你拥有的店；可 `search_products`／`create-product`／`update-product`、`get-inventory-levels`／`set-inventory`、`list-orders`／`get-order`（只读）、`create-discount`（百分比码）、`run-analytics-query`
4. **Collective 选货**：描述想卖的风格／品类 → 审阅推荐 → 点 Import；无 App 时先安装再继续
5. 大批量改状态：`bulk-update-product-status` 单次最多 **50** 个商品（Help 表）；中断则回 Admin 收尾
6. 敏感能力（页面／菜单／metafield／markets／翻译）走 `graphql_*` 时，连接器会先要你确认

## 预期结果与失败限制

**预期（Help 描述）：**

- 可生成并认领店面预览；或管理已连接店铺的商品、集合、库存、百分比折扣与分析表／图
- 订单与顾客可查不可改；数字商品可走 Digital Products App 上传文件／链接
- Collective 导入商品以供应商履约，零售价由你定
- 动作名会显示在聊天里（如 `create-product`、`set-inventory`、`run-analytics-query`）

**失败／边界：**

- 连接器关闭或未点名 Shopify → Claude 可能只给 Admin 操作说明而不调工具
- 无写权限／员工权限不足 → 只能读；缺 App → Collective／数字商品流程会停在安装提示
- 本站**未**在 Claude 里实测建店、改库存或 Collective 导入；数字与限制只复述 Help
- 标准 Shopify 套餐费用仍适用；Help 称连接器本身无额外 Shopify 手续费，Claude 订阅费付给 Anthropic

## 来源与核验状态

**公开可核验**

- 主文：[Shopify Help — Shopify connector for Claude](https://help.shopify.com/en/manual/ai-powered-tools/connecting-ai-tools/shopify-connector-for-claude)
- 相关：[Building and managing your store with third-party AI tools](https://help.shopify.com/en/manual/ai-powered-tools/connecting-ai-tools)、[Collective discovery（含 AI 选货）](https://help.shopify.com/en/manual/online-sales-channels/shopify-collective/retailers/discovery)、[Claude Marketplace — Shopify](https://claude.com/marketplace/connectors/shopify)
- 采编：2026-10-24（Asia/Shanghai）。本站仅采编公开材料，**未做 live 实测**。

## 据公开帖摘要

Shopify Help《Shopify connector for Claude》说明：可在 Claude 聊天里描述业务并生成店面预览，认领后成为店主；或连接已有店铺，处理商品、集合、库存、订单（只读）、顾客（只读）、百分比折扣与分析。另支持按描述从 **Shopify Collective** 目录匹配并导入供应商商品；若未安装 Collective App，导入时会提示安装。

Help 明确列出连接器**不能**做的事：改已发布主题／发布／删主题；改套餐、支付、税费、域名；退款与订单资金类操作；以及大批量中途失败时须回 Admin 收尾。安装不在 App Store，而从 Claude 侧连接器页跳转 Admin 授权。动作表给出数十个具名 action（如 `claim-storefront-preview`、`create-product`、`set-inventory`、`run-analytics-query`、`graphql_mutation` 等）。配套总览页写明 ChatGPT 插件与 Claude 连接器均可建店预览、管店并从 Collective 选货；Grok／Gemini／Muse／Copilot 等能力子集不同。

Shopify 官方 X 账号约 2026-10-21 称 Claude Duet 首日即可在聊天里设计店铺并用 Duet 跟进表现；本条能力边界仍以 Help 为准，不引用未核验的转化率。

## English brief

Official Shopify Help documents the Claude connector: generate/claim storefront previews, manage an owned store (catalog, inventory, read-only orders, %-off codes, analytics), and import Shopify Collective products from a natural-language brief. Refunds, payments, plan/tax/domain, and live-theme publish stay Admin-only. Lab cites Help + related pages only — **no live Claude test** on 2026-10-24 (Asia/Shanghai).
