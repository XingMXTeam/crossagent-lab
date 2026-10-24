---
title: "HN：Agora 做给 Agent 的百万店统一货盘——Shopify／Woo 也可被搜到"
titleEn: "HN: Agora’s universal agent catalog — Shopify/Woo merchants stay discoverable when agents shop"
summary: "据 HN（id 50200816，约 2026-10-22）链到的 Agora 博客：在亚马逊阻 Agent、沃尔玛开 Agent Gateway 的背景下，Agora 把约 100 万家网购店（含 Shopify／Woo）收成统一目录，给浏览器 Agent 稳定选择器、给程序 Agent REST；支付走 Stripe token，默认结账前停给人确认。博客自述约月 1500 万次 Agent 请求——本站未复测。"
summaryEn: "HN (item 50200816, ~2026-10-22) → Agora blog: while Amazon blocks shopping agents and Walmart opens a gateway, Agora indexes ~1M stores (Shopify/Woo/custom) into one catalog with /agent DOM contracts and a REST API; Stripe tokens only, human confirm before pay by default. Blog claims ~15M agent requests/month — Lab did not re-measure."
category: ops-finance
agents: ["browser AI agent", "MCP／API agent", "Perplexity／Operator 类"]
tools: ["Agora /agent routes", "agents.md", "llms.txt", "REST cart/checkout", "Stripe PaymentIntent"]
source: Hacker News
sourceUrl: https://news.ycombinator.com/item?id=50200816
sourceType: public
date: 2026-10-22
dateNote: "HN 发帖日约 2026-10-22（pencildiver）；博客同日署名 Param Jaggi；2026-10-24 采编 Asia/Shanghai。分数／评论数会变。与站内 Shop MCP／Checkout WebMCP 区分：那边是 Shopify 官方结账协议，这边是跨店统一货盘"
featured: false
prompt: |
  You help a cross-border Shopify/Woo merchant understand agent-shopping discoverability.
  You do not place real orders or spend money.

  Store platform: {{shopify|woocommerce|custom}}
  Store URL: {{store_url}}
  Question: {{e.g. how agents find us / what to publish / risks}}

  Do this:
  1) Summarize Agora’s two agent interfaces from public docs only: browser /agent pages vs REST API.
  2) List what a merchant should verify on their own storefront for agent buyers
     (stable product data, price/stock truth, checkout handoff) — without inventing Agora coverage.
  3) If checking Agora: open public manifest routes or agents.md; report only what the page returns.
  4) Never complete payment. If a flow reaches pay, stop and mark HUMAN CONFIRMATION REQUIRED.

  Rules:
  - Cite blog/HN numbers only as “source claims”, not Lab measurements.
  - Do not invent catalog size, request volume, or that this store is already indexed.
  - Output: (a) facts from sources, (b) unknowns, (c) ACTIONS REQUIRING HUMAN APPROVAL.
---

## 解决什么问题

当购物 Agent 被大站挡住或只能走单一零售商 Gateway 时，独立站／跨境 Shopify、Woo 商家担心「人找不到、Agent 更找不到」。Agora 公开博文提出另一条路：把多平台商品收进**统一货盘**，让 Agent 用同一套搜索／购物车／结账契约跨店找货，而不是逐个站点学 DOM。

对卖家而言，价值在「Agent 购物流量是否还能扫到我这种非巨头店」，不是再装一个卖家后台 MCP。与站内「Shop MCP／Checkout WebMCP」不同：那些是 Shopify 官方给 Agent 的店内／结账协议；本条是第三方跨店目录与 Agent 界面。与「Agent-ready 加购审计」互补：那边测单店加购是否真通，这边讲跨店发现层怎么公开宣称工作。

## 人审闸门（必须人工确认）

1. **完成付款／绑定支付方式** — 博客写明 Agent 默认在支付前停下；任何人用 Agent 下单须本人确认
2. **向 Agora 或分发伙伴开通付费 business／API 额度** — 涉及订阅与 credits，须人批
3. **把店铺商品／价格策略交给第三方索引前的合同与品牌审阅** — 须法务／运营确认
4. **把博客中的「约 100 万店」「约月 1500 万请求」写进对外销售材料当承诺** — 须标注为来源自述且过期失效
5. **用 Agent 持有买家银行卡号或平台登录密码** — 禁止；设计应只传支付 token

## 可复现步骤

前置：

1. 可读 HN 帖与博客（无需卖家账号即可读概念）
2. 若验证浏览器接口：任意现代浏览器或浏览器 Agent
3. 若验证程序接口：博客称基础搜索可匿名；v1 与无头结账需付费 business 账户与 API key（**不要**把 key 贴进聊天）

跟做（公开材料，非本站实测）：

1. 打开 HN `item?id=50200816`，进入博客《Building a universal catalog for agents》
2. 阅读「两种入口」：浏览器走 `/agent/...` 稳定选择器与 `data-agent-*`；程序走 REST（搜索／购物车／PaymentIntent／结账／订单查询）
3. 按文中指引查看公开 manifest：`GET /api/agent-routes`，或阅读 `/agents.md`、`/llms.txt`
4. 卖家自检（与 Agora 是否已收录无关）：商品页价格／库存是否机器可读、加购后购物车是否有行、结账是否可交给人确认支付
5. **不要**在验证流程里提交真实付款

## 预期结果与失败限制

**预期（博客自述）：**

- 目录日更；在商品／加购决策点做价格与库存 live check
- 浏览器 Agent 可用稳定 DOM 契约；程序 Agent 可用 JSON API
- 支付经 Stripe token；Agent 默认不碰卡号
- 商家 0% 佣金（博客商业模式：向做 Agent／分发的企业收订阅与用量）

**失败／边界：**

- 博客自述覆盖约 **100 万／估 2500 万** 网店，未索引到的店 Agent 仍可能找不到
- 日更快照可能导致搜索排序与下单瞬间库存不一致；结账阶段应再校验
- 本站**未**复测请求量、未验证任一具体跨境店是否在索引中
- HN 帖分与评论数会变；勿把低分讨论当成效果证明

## 来源与核验状态

**公开可核验**

- 主链：[HN item 50200816](https://news.ycombinator.com/item?id=50200816) → [Agora 博客](https://www.searchagora.com/blog/building-a-universal-catalog-for-agents)（2026-10-22，Param Jaggi）
- 采编：2026-10-24（Asia/Shanghai）。数字均为博客自述，**本站未 live 实测**。

## 据公开帖摘要

Hacker News 帖（`https://news.ycombinator.com/item?id=50200816`，作者 pencildiver，约 2026-10-22）标题为 “Building a universal e-commerce catalog for agents”，链到 Agora 博客。博文背景：亚马逊阻拦购物 Agent；沃尔玛公开 Agent Profiles、Agent Gateway（MCP）与 Agent 条款。Agora 自称把 Shopify、WooCommerce 与部分自建站商品收成统一数据模型，提供：

- 浏览器专用 `/agent` 界面（稳定 id／`data-agent-*`、商品 JSON 块、显式 cart／checkout 状态）
- 程序 REST（搜索、购物车、Stripe PaymentIntent、结账、订单跟踪）
- 公开契约：`/api/agent-routes`、`/agents.md`、`/llms.txt`

博客给出的规模数字（仅作来源复述）：约 **100 万** 店；目标写到 2027 年底覆盖估约 **2500 万** 店；约 **月 1500 万** 次 Agent 请求；分发伙伴点名 Glance、Samsung TV Shopping。排序称不售卖；向构建方收订阅／credits，商家 0% commission。权限模型比沃尔玛 Agent Profiles 简单，花费限额留给 Agent 侧执行。

## English brief

HN (2026-10-22) points at Agora’s post on a universal agent catalog over ~1M Shopify/Woo/custom stores, with `/agent` DOM contracts and REST checkout via Stripe tokens (human confirm by default). Lab cites HN + blog only — **no live traffic or indexing test**. Treat catalog size and “~15M requests/month” as source claims.
