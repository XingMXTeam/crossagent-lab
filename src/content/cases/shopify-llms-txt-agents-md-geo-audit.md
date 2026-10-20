---
title: "Agent 审 Shopify 店的 llms.txt／agents.md 与 Product JSON-LD，并列 5 个买家 AI 提问"
titleEn: "Agent audits a Shopify store's llms.txt / agents.md and Product JSON-LD, then lists 5 buyer prompts for ChatGPT/Perplexity"
summary: "据 Shopify 2026-05-28 changelog：店铺默认提供 /agents.md，/llms.txt 与 /llms-full.txt 默认镜像同一内容，可用主题模板分别覆盖。Agent 按 Shopify 文档与 Surfient 公开 GEO checklist 审这三个文件和 Product JSON-LD，输出缺口清单与 5 个买家会问 AI 的 prompt；改主题代码前必须人工确认。"
summaryEn: "Per Shopify's 2026-05-28 changelog, every store serves a default /agents.md, and /llms.txt and /llms-full.txt mirror it unless a theme template overrides them. An agent audits these files plus Product JSON-LD against Shopify docs and Surfient's public GEO checklist, returns a gap list and 5 buyer prompts to test in ChatGPT/Perplexity. A human approves any theme-code change."
category: listing
agents: ["ChatGPT", "Claude", "Cursor", "Perplexity"]
tools: ["Shopify theme templates", "agents.md.liquid", "llms.txt.liquid", "llms-full.txt.liquid", "Product JSON-LD", "Schema.org", "Rich Results Test"]
source: 官网
sourceUrl: https://shopify.dev/changelog/customize-llmstxt-llms-fulltxt-and-agentsmd
sourceType: public
date: 2026-05-28
dateNote: "Shopify changelog 标注 May 28, 2026；Surfient checklist 标注 Updated April 21, 2026；2026-10-20（Asia/Shanghai）采编并核对全部来源；本站未在真实店铺实测"
featured: false
prompt: |
  You are a GEO (AI discoverability) auditor for a cross-border Shopify store.
  You have read-only access. Do not edit theme code, publish anything, or
  change products. Never invent numbers, rankings, or citation results.

  Inputs I give you (paste text; leave unknown fields blank):
  - Store URL: {{store_url}}
  - Target market + language: {{e.g. US / English}}
  - Text of /agents.md, /llms.txt, /llms-full.txt (fetched as-is)
  - robots.txt text
  - Product JSON-LD from 3 product pages (view-source, application/ld+json)
  - Main category + 3 top products: {{category}}, {{products}}

  Tasks:
  1) Say whether /llms.txt and /llms-full.txt differ from /agents.md. Per
     Shopify docs they mirror /agents.md unless llms.txt.liquid or
     llms-full.txt.liquid exists. Do not recommend a custom template unless
     there is a clear gap; the managed default stays in sync automatically.
  2) Check each Product JSON-LD for: name, description, sku, gtin (only if
     real), brand, image (array), offers.price, offers.priceCurrency,
     offers.availability. Mark each field present / missing / suspicious.
     Never propose a fake GTIN.
  3) Check robots.txt for explicit rules on AI crawlers (GPTBot,
     PerplexityBot, ClaudeBot, Google-Extended). Report only what the text says.
  4) Write 5 buyer prompts a shopper in {{target_market}} might ask ChatGPT
     or Perplexity about {{category}} (comparison, use case, shipping/returns
     to the market, price range, "best X for Y"). Mark them as test prompts,
     not search-volume data.
  Output: (a) gap table, (b) proposed file/template diffs as drafts only,
  (c) 5 test prompts, (d) ACTIONS REQUIRING HUMAN APPROVAL before any
  theme-code edit or publish.
---

## 解决什么问题

跨境卖家开始问：「ChatGPT／Perplexity 会推荐我的店吗？」很多店铺不知道店里已经有 `/agents.md`，也没查过 Product 结构化数据是否完整。

本用例让 Agent 做三件事：

1. 读店铺的 `/agents.md`、`/llms.txt`、`/llms-full.txt`，判断是否需要自定义模板
2. 按公开 checklist 审 Product JSON-LD 字段缺口
3. 写 5 个买家会问 AI 的测试 prompt，供人工在 ChatGPT／Perplexity 里手动测

它省的是「逐页翻源码 + 对照清单」的操作，不是保证被 AI 引用。

与站内「Shop MCP 上线后：9 个 AI 购物可见性检测工具」不同：那篇对照第三方扫描工具的公开说法；本篇是 Agent 按 Shopify 官方模板文档和公开 checklist **自己审文件与 schema**，不依赖某个扫描器的分数。

## 人审闸门（必须人工确认）

以下动作不得由 Agent 自动执行：

1. **在主题里新增或修改** `agents.md.liquid`／`llms.txt.liquid`／`llms-full.txt.liquid` — Shopify 文档写明：加模板后由你自己维护内容，不再自动同步
2. **修改主题里的 JSON-LD 代码或发布主题** — 先在未发布主题副本上改，人工验证后再发布
3. **改 robots.txt 对 AI 爬虫的放行／屏蔽策略** — 属于站点政策决定
4. **填写 GTIN** — 没有真实 GTIN 就留空；Surfient checklist 明确提醒不要伪造
5. **把测试 prompt 的回答当成「排名」或「流量」写进汇报或报价** — 单次 AI 回答不等于数据

## 可复现步骤

前置：一个 Shopify 店铺（主题代码编辑权限仅在人工改动时需要）；任意可读网页文本的 Agent（ChatGPT／Claude／Cursor 等）。

1. 用浏览器或 `curl` 打开 `https://{店铺域名}/agents.md`、`/llms.txt`、`/llms-full.txt`，复制原文
2. 打开 `/robots.txt`，复制原文
3. 打开 3 个商品页，查看源码，复制 `application/ld+json` 里的 Product 块
4. 把以上内容和目标市场、主类目一起贴进文末 Prompt 盒，让 Agent 输出缺口表
5. Agent 判断三个文件是否相同。按 Shopify 文档，没有自定义模板时三者都镜像 `/agents.md` 默认内容
6. 如需自定义：人工在 **Online Store > Themes > Edit code** 新建模板。注意模板只能用 `request` 和 `agents` 对象（如 `agents.store_name`、`agents.mcp_endpoint_url`、`agents.sitemap_url`），不能用 `shop`、`collections` 等常规全局对象
7. 用 Rich Results Test 或 Schema.org validator 验证改后的 Product JSON-LD
8. 人工把 Agent 写的 5 个 prompt 逐条输入 ChatGPT、Perplexity，记录是否提到本店；每周用同一组 prompt 复测

## 预期结果与失败限制

**预期：**

- 一张缺口表：三个文件是否一致、Product JSON-LD 各字段 present／missing、robots.txt 对 AI 爬虫的规则
- 模板或 JSON-LD 的修改**草稿**（不自动上线）
- 5 个测试 prompt，例如「best {品类} for {用途} that ships to {国家}」「{品牌} vs {竞品} for {场景}」

**失败与边界：**

- Agent 只能审你贴进来的文本；它不能替你证明 ChatGPT／Perplexity 会引用本店
- Shopify 文档说多数店铺用托管默认文件即可；自定义模板后要自己保持内容最新
- llms 模板的 Liquid 上下文受限，不能直接遍历商品列表；Surfient 建议的 `products.ndjson`、热门 URL 列表等需另行维护
- Surfient 的「首次被引用天数」等数字是厂商自述，勿抄进客户报价或承诺
- 需要持续监测时可用付费服务（如 ReSO AI 公开定价页列出免费一次性审计与 $599/月方案）；本站未用过，也不做推荐排名

## 来源与核验状态

**公开可核验**

- 主链接：[Shopify changelog — Customize /llms.txt, /llms-full.txt and /agents.md](https://shopify.dev/changelog/customize-llmstxt-llms-fulltxt-and-agentsmd)（May 28, 2026）
- 模板文档：[agents.md.liquid](https://shopify.dev/docs/storefronts/themes/architecture/templates/agents-md-liquid)、[llms.txt.liquid](https://shopify.dev/docs/storefronts/themes/architecture/templates/llms-txt-liquid)、[llms-full.txt.liquid](https://shopify.dev/docs/storefronts/themes/architecture/templates/llms-full-txt-liquid)
- Checklist：[Surfient — The Shopify AI SEO / GEO checklist for 2026](https://www.surfient.com/guides/shopify-ai-seo-checklist)（Updated April 21, 2026）
- 付费方案参考：[ReSO AI 定价页](https://resollm.ai/pricing/)
- 采编：2026-10-20（Asia/Shanghai），当日逐一打开核对。本站**未在真实店铺实测**。与「Shop MCP 可见性检测工具」对照篇的区别见首节。

## 据公开帖摘要

**Shopify（2026-05-28 changelog 与模板文档）：**

- 每个店铺默认有 `agents.md`，地址 `/agents.md`；`/llms.txt` 和 `/llms-full.txt` 默认指向同一内容
- 在 **Online Store > Themes > Edit code** 可加 `templates/agents.md.liquid`（控制 `/agents.md`，并作为另两条路径的默认）、`templates/llms.txt.liquid`、`templates/llms-full.txt.liquid`
- 查找顺序：专用模板 → `agents.md.liquid` → Shopify 生成的默认内容
- 文档写明 `agents.md` 是面向购物 Agent 的规范描述，含 UCP discovery 与 MCP 端点、只读浏览 URL、店铺政策等；它不同于主题根目录给编码 Agent 看的 `AGENTS.md`
- 文档建议多数店铺用托管默认文件；加模板后需自行维护
- 这些模板必须是 Liquid，不能是 JSON 模板；只提供 `request` 与 `agents` 对象
- 文件在主域名根路径提供，不带语言或 Markets 子目录前缀，没有本地化版本

**Surfient checklist（Updated April 21, 2026）：**

- 48 项、六层：Feed、Schema、Content、Authority、Crawler access、Measurement
- Schema 层：每个商品页要有 Product JSON-LD，含 name／description／sku／gtin13／brand／image（三张以上）／offers（price、priceCurrency、availability、priceValidUntil）；所有 schema 在 Rich Results Test 与 Schema.org validator 零错误
- Crawler 层：robots.txt 明确放行或屏蔽 GPTBot、PerplexityBot、ClaudeBot、Google-Extended 等；在根目录发布 llms.txt，llms-full.txt 汇总最可引用内容
- 提醒：没有真实 GTIN 时不要用自动生成值冒充
- Measurement 层：每周用固定 prompt 组在至少三个 AI 引擎做品牌提及扫描

**ReSO AI 定价页：** 免费一次性方案含 AISO 报告、6 项技术修复和 1 篇博客；$599/月方案跟踪 30 个 prompt，覆盖 ChatGPT、Perplexity、Google AI Overviews。

## English brief

Shopify (changelog 2026-05-28) serves a default `/agents.md` for every store; `/llms.txt` and `/llms-full.txt` mirror it unless you add `llms.txt.liquid` or `llms-full.txt.liquid`. Templates only get the `request` and `agents` objects. In this workflow an agent reads the three files, robots.txt, and Product JSON-LD, checks them against Shopify docs and Surfient's public 48-item GEO checklist, drafts fixes, and writes 5 buyer test prompts for ChatGPT/Perplexity. Humans approve any theme edit or publish. Public sources only — **no live Lab test**.
