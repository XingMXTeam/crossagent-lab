---
title: "Vercel Shop GA：Next.js 店面给 Agent 可读商品与 UCP／MCP 加购"
titleEn: "Vercel Shop GA — agent-readable Shopify storefront with UCP/MCP cart"
summary: "据 Vercel 官方博客（2026-10-16）：开源 Next.js 模板 Vercel Shop 正式 GA，建在重建后的 Shopify Hydrogen SDK 上；同一商品 URL 对人出页面、对 Agent 出机读价格／库存／选项，并在商家自有域名暴露 UCP／MCP 目录搜索与建车。面向要自建店面且让 Agent 当一等购物者的 Shopify 卖家。"
summaryEn: "Vercel blog (2026-10-16): Vercel Shop GA — open-source Next.js Shopify storefront on rebuilt Hydrogen; same product URL serves people and machine-readable price/availability/options, with UCP/MCP catalog search and cart on the merchant domain."
category: ops-finance
agents: ["Cursor", "Claude"]
tools: ["Vercel Shop", "Shopify Hydrogen SDK", "UCP", "Storefront MCP /api/ucp/mcp", "eve shopping assistant"]
source: 博客
sourceUrl: https://vercel.com/blog/vercel-and-shopify-make-agents-first-class-shoppers
sourceType: public
date: 2026-10-16
dateNote: "Vercel 博客 Published: October 16, 2026；Authors Boris Besemer, Dan Laugharn, Kevin Sundstrom；2026-10-20 采编"
featured: false
prompt: |
  You help a Shopify merchant evaluate making their custom storefront agent-ready
  with Vercel Shop (open-source Next.js template on Shopify Hydrogen).

  Context I will paste:
  - Whether we already use custom Hydrogen / Next.js or Online Store only
  - Domains and whether storefront password is on
  - Goal: {{catalog_for_agents | cart_via_mcp | shopping_assistant | launch_template}}

  Do this:
  1) Restate only capabilities stated in the Vercel Shop GA blog and linked docs:
     machine-readable product pages; UCP/MCP catalog search and cart on merchant domain;
     shared cart with an in-template shopping assistant; setup skills for coding agents.
  2) List merchant HITL gates before any live checkout or spend.
  3) Distinguish this from Shop MCP at mcp.shop.com (Catalog discovery for ChatGPT etc.)
     and from our Lab page on Shop MCP visibility scanners.
  4) Give a minimal verify checklist: product URL machine-readable fields; /.well-known or
     UCP discovery if documented; password gate off for /api/ucp/mcp tests.

  Rules:
  - Do not invent conversion lifts, revenue %, or "agents will buy". Cite only pasted numbers.
  - Do not tell the merchant to call complete_checkout against a live store without explicit yes.
  - If a detail is missing from the paste, say it is missing.
---

## 解决什么问题

跨境／独立站卖家若用自定义店面，Agent 往往只能「读给人看的 HTML」，加购与结账路径不稳定。Vercel Shop 把 **给人看的 Next.js 店面** 与 **给 Agent 用的机读商品信息 + UCP／MCP 搜品／建车** 放进同一套开源模板，减少「另搭一套 Agent 通道」的成本。

它解决的是**商家自有域名上的 Agent 可读店面与购物工具**，不是 Shopify Catalog／Shop MCP（`mcp.shop.com`）那种面向 ChatGPT 等渠道的目录发现。与站内「Shop MCP 可见性检测工具对照」不同：那边测第三方扫描器与 Catalog 资格；本条是 **Vercel＋Shopify 官方模板如何把店面做成 Agent 一等公民**。

## 人审闸门（必须人工确认）

1. **对真实店铺开启／关闭店面密码、切换付费方案** — 影响访问与账单
2. **在生产域部署并绑定 Shopify 凭证** — 暴露目录与建车能力
3. **让 Agent 调用会花钱或出单的结账完成类工具**（若使用）— 须人确认；博客主路径是给人 `continue_url`／结账页
4. **把演示店的「涨收／转化」数字抄进客户承诺** — 博客里品牌案例数字仅作对方自述，本站不核验
5. **把 Client Secret／API key 贴进对话或公开仓库** — 禁止

## 可复现步骤

前置（据[博客](https://vercel.com/blog/vercel-and-shopify-make-agents-first-class-shoppers)与[构建指南](https://vercel.com/kb/guide/build-a-shopify-mcp-agent-on-vercel)公开材料）：

1. 可用的 Shopify 店（指南写明开发店常带密码，`/api/ucp/mcp` 会被挡；测试需关密码的 staging 或按官方 Global Catalog 教程）
2. Node／pnpm；Vercel 与 Shopify 连接按文档
3. 可选：阅读同日配套 KB「How to build a Shopify MCP agent on Vercel」了解 UCP 工具名与鉴权档位

跟做（博客「Get started」）：

1. `pnpm create next-app@latest my-store --example https://github.com/vercel/shop`
2. 按文档连接 Shopify、配置店面
3. 核对：人对商品 URL 看见页面；Agent／工具侧能读价格、库存、选项（博客表述）
4. 确认商家域名上可发现 UCP／MCP 能力，用于搜品与建车（博客表述）
5. 模板内购物助手（eve）与店面共代码、共享购物车 — 按需定制；skills 指引编码 Agent 做 setup／改版

本站**未**实测 vercel.store 或模板部署。

## 预期结果与失败限制

**预期（公开材料）：**

- 开源 Next.js 店面模板 **Vercel Shop** GA；基于重建后的 **Hydrogen SDK**（同文称该 SDK 亦 GA）
- 商品页机读信息；结构化数据与 sitemap 利于搜索／回答引擎
- 商家域名上的 UCP／MCP：搜目录、读商品、建车、取结账链接
- 示例启动命令指向 `https://github.com/vercel/shop`；演示店 [vercel.store](https://vercel.store)

**失败／边界：**

- 店面密码开启时，指南称 UCP 端点会 302 到 `/password`，无绕过 header
- 旧 Storefront MCP 工具名（如 `search_shop_catalog`）已迁移／移除，须用 `/api/ucp/mcp` 现工具（见 KB）
- 博客引用的品牌转化数字**不是**本站复测；勿当保证
- 本条不声称「装上模板就会被 ChatGPT 推荐」— 那是 Catalog／渠道资格，见站内 Shop MCP 相关文

## 来源与核验状态

**公开可核验**

- 主文：[Vercel and Shopify make agents first-class shoppers](https://vercel.com/blog/vercel-and-shopify-make-agents-first-class-shoppers)（2026-10-16）
- 配套：[Build a Shopify MCP agent on Vercel](https://vercel.com/kb/guide/build-a-shopify-mcp-agent-on-vercel)
- 采编：2026-10-20（Asia/Shanghai）。本站仅采编公开材料，**未做 live 部署实测**。

## 据公开帖摘要

2026-10-16，Vercel 博客宣布 **Vercel Shop**（开源 Next.js Shopify 店面模板）**正式 GA**，并基于与 Shopify 合作重建、同日 GA 的 **Hydrogen SDK**。文中称 Agent 常被迫使用为人／搜索引擎设计的页面；更好的体验是把 Agent 当作一等购物者，提供可直接读取的商品信息与专用购物工具。

公开能力点：同一商品 URL 可对人出视觉页、对 Agent 出价格／库存／选项等机读内容；内嵌结构化数据与 sitemap；Shopify 参与的 **UCP** 让 Agent 以标准方式搜目录、读详情、查库存、建车并拿到结账链接；Vercel Shop 在**商家自有域名**上暴露这些能力，使 Agent 可用 MCP 搜品建车而不必「爬页面」。模板还含 **eve** 购物助手，与店面同仓、共享购物车；并含 skills 指导编码 Agent 完成 setup 与定制。启动示例：`pnpm create next-app@latest my-store --example https://github.com/vercel/shop`。演示店 vercel.store 亦用该模板。文中另述 AG1、Bombas、PAIGE 等已用 Shopify＋Next.js＋Vercel；PAIGE 改造后的收入／转化数字为对方案例自述，本页不核验。

## English brief

Vercel Shop GA (2026-10-16) is an open-source Next.js Shopify storefront on the rebuilt Hydrogen SDK. The same product URL serves people and agents; UCP/MCP on the merchant domain supports catalog search and carts. Distinct from Shop MCP Catalog discovery. Lab page cites the public blog and KB only — **no live deploy test**.
