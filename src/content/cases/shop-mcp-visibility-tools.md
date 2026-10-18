---
title: "Shop MCP 上线后：9 个 AI 购物可见性检测工具公开页对照"
titleEn: "After Shop MCP: what nine public AI-shopping visibility checkers actually claim"
summary: "Shopify 于 2026-10-13 上线 Shop MCP 后，多家工具提供 UCP、Storefront MCP、商品字段或 robots/llms 的免费扫描。本篇只对照各公开页写明的能力与费用说法；分数是对方自述，不是本站实测，也不能代替 Shopify 后台的官方资格判定。"
summaryEn: "After Shop MCP (2026-10-13), nine public scanners and apps describe UCP, Storefront MCP, product-field, or robots/llms checks. This roundup only restates what their pages claim. Scores are vendor-defined, not Lab measurements, and they do not replace Shopify's official eligibility."
category: ops-finance
agents: ["ChatGPT"]
tools: ["Shop MCP", "GetVisible", "Heartly", "Orbilo", "UCP Checker", "Open for Agents", "scaile", "UCPtools", "UCPhub", "AgentReady"]
source: 官网
sourceUrl: https://shopify.dev/changelog/posts/add-shopping-and-shop-pay-checkout-to-any-agent-with-shop-mcp
sourceType: public
date: 2026-10-18
dateNote: "Shop MCP changelog 为 2026-10-13；下列公开页于 2026-10-18（Asia/Shanghai）核对"
featured: false
prompt: |
  You help a cross-border Shopify merchant who sells to customers in the United States review AI-shopping visibility.

  I will paste:
  - Notes I copied from Shopify Help (Selling on ChatGPT, Agentic storefronts, Catalog requirements), and
  - The text of ONE free public scan from GetVisible, Heartly, Orbilo, UCP Checker, Open for Agents, scaile, UCPtools, UCPhub, or AgentReady.

  Do this:
  1) Split findings into protocol (/.well-known/ucp, MCP/REST, robots.txt, llms.txt), product fields (GTIN, description, schema, price/stock), and policies (returns, shipping) — only if the paste actually says so.
  2) Mark each line STATED BY THE TOOL or NOT STATED. Do not invent scores, traffic, conversion, or accuracy.
  3) List what this scan cannot prove: a completed purchase, a ChatGPT recommendation, or official Shopify Catalog eligibility.
  4) Give the admin checks I should do myself before paying anyone to "fix" a score: Sales channels → Agentic → Sources → Shopify Catalog, plus Terms / Privacy / Return policies.

  Rules:
  - Vendor scores mean what that vendor's page says they mean. A high score is not a promise ChatGPT will recommend the store.
  - If a number is not in the pasted page or scan, say it is missing.
  - Checkout for ChatGPT referrals still happens on the merchant's own checkout.
---

## 据公开页摘要

对卖美国顾客的 Shopify 跨境卖家，ChatGPT 等 AI 渠道通过 **Shopify Catalog** 发现商品。店铺可以设在美国以外，但需要面向美国顾客，并满足 Catalog 与政策等条件。官方说明见 [Selling on ChatGPT](https://help.shopify.com/en/manual/online-sales-channels/agentic-storefronts/chatgpt)。Shop MCP（`mcp.shop.com`）于 2026-10-13 上线：Agent 可搜索 Catalog、建车并用 Shop Pay 结账，见 [Shopify changelog](https://shopify.dev/changelog/posts/add-shopping-and-shop-pay-checkout-to-any-agent-with-shop-mcp)。

检测工具是另一层：多数是免费扫描，再提供报告、监控、App 或代修。它们**不能代替**后台里的官方资格核对。官方项请走配套清单：[Shopify × ChatGPT 可售卖：10 项中文自检](https://crossagent.maoxunxing.com/guides/shopify-chatgpt-cn-self-check-10/)。

下列 URL 于 2026-10-18（Asia/Shanghai）按公开页面核对。页上的示例分数只是对方营销页的示意，不是本站重跑的结果。

| 维度 | 常见测什么 | 通常不测什么 |
|------|------------|--------------|
| 协议层 | `/.well-known/ucp`、MCP/REST、robots.txt、llms.txt | 真实下单是否成功 |
| 商品层 | GTIN、描述、结构化数据、库存/价格字段 | 你在后台未发布的变体 |
| 业务层 | 退货/运费政策是否可读 | 广告出价，或 SEO 排名保证 |

## 工具对照

### 1. GetVisible

- **URL：** https://getvisible.store/
- **运营方：** 页上写明 MK-Way。
- **测什么：** 按公开店面扫商品目录；条码、图片、描述；Agent 通道（Storefront MCP、UCP、爬虫）；结构化数据；robots、llms.txt、退货与运费政策是否可读。页上提到面向 ChatGPT、Google AI Mode、Copilot、Perplexity、Claude、Grok。
- **费用 / 获客：** 页上写 **Free while in beta**；无需装 App；**姓名 + 邮箱解锁完整报告**（PDF / .md）。可预约 MK-Way 代修。
- **来源：** https://getvisible.store/

### 2. Heartly · UCP Visibility Test

- **URL：** https://www.heartly.io/ucp-visibility-test
- **测什么：** 公开路径依次为 `/.well-known/ucp` → REST/MCP → catalog/search · search_catalog → 最多 3 个样例商品字段 → variant 级 checkout_url。自述满分 100，分项为 Discovery 15 / Commerce interface 20 / Catalog 15 / Product data 40 / Checkout handoff 10。页上强调高分不等于 ChatGPT 一定会推荐。
- **费用 / 获客：** **免费、无需账号**；不登录、不导入商品；扫描缓存约 1 小时。Heartly 另有闪购 / MCP 产品线。
- **来源：** https://www.heartly.io/ucp-visibility-test

### 3. Orbilo

- **URL：** https://orbilo.co/
- **测什么：** 同一次检查覆盖 **UCP**、**WebMCP**、**Access**（robots / bot 规则）；0–100，并给分项修复建议；可做日更监控。
- **费用 / 获客：** **检查免费、无需账号**；监控一站永久免费。付费计划页上写 **起价 $29/月**（多站团队）。另有 MCP Server，供助手调用 `check_site`。
- **来源：** https://orbilo.co/ · https://orbilo.co/mcp

### 4. UCP Checker

- **URL：** https://ucpchecker.com/
- **测什么：** 拉取 `/.well-known/ucp`，按声明的 release 校验；Discovery / Conformance / Capability 加权成 UCP Score（0–100）；可测 catalog.search / lookup。另有 Playground、Validator、目录与周报。页上写约 2 万+ 店有有效 profile（以对方公开数为准）。
- **费用 / 获客：** **检查与校验免费、无需账号**；Alerts / Dashboard 需账号。页上定位为独立参考（PactMode Ltd）。
- **来源：** https://ucpchecker.com/ · https://ucpchecker.com/developer-tools

### 5. Open for Agents（Shopify App）

- **URL：** https://apps.shopify.com/open-for-agents
- **站点：** https://www.openforagents.com/about
- **开发者：** Enoki Limited（NZ）。
- **测什么：** **只读**比对 Admin、Storefront Catalog 的 **UCP/MCP** 与公开店面证据；找缺失或异常暴露的商品；留证据与告警。页上写明不改店，不存顾客、订单或支付数据。
- **费用 / 获客：** App Store 标价 **Free**；App 页写 2026-07-22 上线。
- **来源：** https://apps.shopify.com/open-for-agents

### 6. scaile · Agentic Commerce Readiness Check

- **URL：** https://scaile.tech/tools/agentic-commerce
- **测什么：** 只读 Agent 路径：robots → 目录 → 商品页 → 政策 → 结账表面。分成三级（理解推荐 / 可比 / 可行动），对照 OpenAI Product Feed、schema.org、Agentic Commerce Protocol 等公开规范。**不真下单**。
- **费用 / 获客：** **免费、无需注册**；**邮箱换 PDF 报告**（页上写明）。公司为 SCAILE TECHNOLOGIES GmbH，汉堡。
- **来源：** https://scaile.tech/tools/agentic-commerce

### 7. UCPtools（Shopify App + Web）

- **URL：** https://ucptools.dev/shopify-app · https://ucptools.dev/
- **测什么：** 商品结构化数据、llms.txt、UCP；可生成并托管 `/llms.txt`。Pro 可周重扫，并做 Agent simulation。
- **费用 / 获客：** App **Free** 安装；**Pro $9/月**（或 $90/年）。Web 赞助位在另一页标 **$199/月**，与 App 账单分开。
- **来源：** https://ucptools.dev/shopify-app · https://ucptools.dev/sponsor

### 8. UCPhub

- **URL：** https://ucphub.ai/
- **测什么 / 做什么：** 不以「输入域名瞬时扫描」为主。它给 **非 Shopify 原生 UCP** 的平台做连接器。页上写 **WooCommerce live**；Shopify 写明 **native UCP, no connector needed**。含 reference agent demo。
- **费用 / 获客：** Demo 可试用；销售走联系页。适合非 Shopify 栈也要接 UCP 的卖家或代理。
- **来源：** https://ucphub.ai/ · https://ucphub.ai/contact/

### 9. AgentReady（agentready.market）

- **URL：** https://www.agentready.market/
- **测什么：** Access、结构化数据、目录属性、交易轨（含 UCP MCP 等）。自述为确定性评分，不做真实购买。另有横向对比文：[5 commerce tools compared](https://www.agentready.market/research/agent-readiness-scanner-commerce-compared)（2026-10-08）。
- **费用 / 获客：** **免费扫描**。Pro 为控制台（页上写一次付费、14 天退款；本篇不抄具体价目表数字）。
- **来源：** https://www.agentready.market/

## 卖家怎么用

这些步骤不是官方承诺。

1. 先过官方资格，见 [10 项中文自检](https://crossagent.maoxunxing.com/guides/shopify-chatgpt-cn-self-check-10/)，再跑 1～2 个免费扫描。
2. **Shopify 店：** GetVisible、Open for Agents、UCPtools 更贴 Catalog 与 MCP。**跨平台协议：** Heartly、UCP Checker、Orbilo。
3. 任何工具的「Ready」都不等于 ChatGPT 一定出单。官方写明 ChatGPT 是发现型引荐，结账仍在你自己的结账页。
4. 字段缺口（GTIN、描述、schema）和协议缺口要分开处理。清单与工具页以后若改版，订阅 [CrossAgent Lab 简报](https://crossagent.maoxunxing.com/newsletter/) 看更新。

本篇是独立对照，不是付费排名。做可公开复现工作流的工具方见 [赞助](https://crossagent.maoxunxing.com/sponsor/)。

## 英文摘要

Shop MCP launched 2026-10-13 ([changelog](https://shopify.dev/changelog/posts/add-shopping-and-shop-pay-checkout-to-any-agent-with-shop-mcp)). Cross-border Shopify merchants selling to the US can appear in ChatGPT via Shopify Catalog if eligible ([ChatGPT channel help](https://help.shopify.com/en/manual/online-sales-channels/agentic-storefronts/chatgpt)). The store may sit outside the US; selling to US customers is required.

These products are public scanners or apps that check UCP, Storefront MCP, product fields, robots/llms, or Admin-vs-catalog drift. Most are free or freemium, with an email unlock or a paid fix/monitor upsell. **Scores are vendor-defined. This page did not re-run them.** Companion checklist: [10-item CN self-check](https://crossagent.maoxunxing.com/guides/shopify-chatgpt-cn-self-check-10/).

| Tool | URL | Checks (per public page) | Free / lead-gen note |
|------|-----|--------------------------|----------------------|
| GetVisible | https://getvisible.store/ | Catalog, GTIN/desc/images, MCP/UCP/crawlers, schema, policies | Free in beta; name+email unlocks full report |
| Heartly UCP test | https://www.heartly.io/ucp-visibility-test | UCP discovery → transport → catalog → sample fields → checkout_url | Free, no account |
| Orbilo | https://orbilo.co/ | UCP + WebMCP + Access; optional daily monitor | Free check; paid from $29/mo for teams |
| UCP Checker | https://ucpchecker.com/ | `/.well-known/ucp` score, validators, playground | Free checks |
| Open for Agents | https://apps.shopify.com/open-for-agents | Read-only Admin vs UCP/MCP vs public evidence | Free Shopify app |
| scaile readiness | https://scaile.tech/tools/agentic-commerce | Agent path + feed/schema levels; no purchase | Free; email for PDF |
| UCPtools | https://ucptools.dev/shopify-app | Schema, llms.txt, UCP; Pro re-check | Free + Pro $9/mo |
| UCPhub | https://ucphub.ai/ | UCP connectors (Woo live; Shopify native) | Demo / sales contact |
| AgentReady | https://www.agentready.market/ | Access, schema, catalog, transaction rails | Free scan; Pro console |

## 来源

| 资源 | URL |
|------|-----|
| Shop MCP changelog | https://shopify.dev/changelog/posts/add-shopping-and-shop-pay-checkout-to-any-agent-with-shop-mcp |
| Selling on ChatGPT | https://help.shopify.com/en/manual/online-sales-channels/agentic-storefronts/chatgpt |
| Agentic storefronts overview | https://help.shopify.com/en/manual/online-sales-channels/agentic-storefronts |
| Shopify Catalog requirements | https://help.shopify.com/en/manual/shopify-catalog/requirements |
| Catalog & discovery | https://help.shopify.com/en/manual/online-sales-channels/agentic-storefronts/products |
| GetVisible | https://getvisible.store/ |
| Heartly UCP Visibility Test | https://www.heartly.io/ucp-visibility-test |
| Orbilo | https://orbilo.co/ |
| Orbilo MCP | https://orbilo.co/mcp |
| UCP Checker | https://ucpchecker.com/ |
| UCP Checker developer tools | https://ucpchecker.com/developer-tools |
| Open for Agents | https://apps.shopify.com/open-for-agents |
| Open for Agents about | https://www.openforagents.com/about |
| scaile readiness | https://scaile.tech/tools/agentic-commerce |
| UCPtools Shopify app | https://ucptools.dev/shopify-app |
| UCPtools | https://ucptools.dev/ |
| UCPtools sponsor | https://ucptools.dev/sponsor |
| UCPhub | https://ucphub.ai/ |
| UCPhub contact | https://ucphub.ai/contact/ |
| AgentReady | https://www.agentready.market/ |
| AgentReady comparison | https://www.agentready.market/research/agent-readiness-scanner-commerce-compared |
