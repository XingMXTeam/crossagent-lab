---
title: "n8n：产品图经 GPT-4o Vision 生成 Shopify／Woo 刊登"
titleEn: "n8n — product photo to Shopify or Woo listing with GPT-4o Vision"
summary: "据 n8n 模板：Webhook 或手机上传图片，UploadToURL 托管后由 GPT-4o Vision 生成标题、HTML 描述、SEO 标签与类目，再写入 Shopify 或 WooCommerce。可先存草稿等人审。"
summaryEn: "n8n template: webhook or mobile upload, CDN host, GPT-4o Vision copy, then Shopify or WooCommerce. Draft mode available for review."
category: listing
agents: ["GPT-4o"]
tools: ["n8n", "UploadToURL", "OpenAI GPT-4o Vision", "Shopify", "WooCommerce"]
source: n8n
sourceUrl: https://n8n.io/workflows/13541-create-e-commerce-listings-from-images-with-uploadtourl-gpt-4o-shopify/
sourceType: public
date: 2026-10-17
dateNote: "模板页 Last update 约 8 months ago；2026-10-17 采编"
featured: false
prompt: |
  You write one ecommerce listing from a product photo plus the seller's facts.
  Image URL: {{image_url}}
  Authoritative facts (do not contradict): brand, materials, pack quantity, dimensions, price, currency, SKU, language, platform (shopify|woocommerce).

  Return JSON only:
  {
    "title": "70 characters or fewer",
    "handle": "url-slug",
    "html_description": "semantic HTML; no medical, safety, or certification claims unless the facts state them",
    "bullets": ["up to 5 features grounded in the image or the facts"],
    "seo_title": "",
    "seo_description": "",
    "suggested_category": "",
    "tags": [],
    "confidence": 0.0,
    "unknowns": ["specs you could not see and that were not in the facts"]
  }
  Do not invent price, weight, or certifications.
  Leave publishImmediately false unless the operator already chose live publish.
---

## 据公开帖摘要

n8n 模板（作者 Jitesh Dugar）把一张产品图做成店铺商品资料。入口是 Webhook：可以是手机上传的图片文件，也可以是远程图片地址。UploadToURL 把图放到 CDN，并返回可供店铺使用的链接。GPT-4o Vision 看图后写出标题、HTML 描述、SEO 标签和建议类目。随后按目标平台组包：Shopify 创建商品并写入 SEO metafields；WooCommerce 经 REST 创建商品，并带 Yoast SEO 字段与营销短文案。SKU、价格和库存会先清洗再入库。

模板把 `publishImmediately` 设为 `false` 列为可选项，这样新建商品保持草稿，等人复核后再发布。页内还建议利用模型返回的 `confidenceScore` 做过滤，示例阈值是高于 0.9 才自动发布。运行前要安装社区节点 `n8n-nodes-uploadtourl`，并配置 UploadToURL、OpenAI，以及 Shopify 或 WooCommerce 凭证。用变量 `DEFAULT_PLATFORM` 选择平台。可选把结果记到 Google Sheets，或在生成草稿时通知 Slack。

模板页「预期结果」写有「人工刊登时间减少 95%（每件从 15 分钟到 30 秒）」。这是模板上的营销表述，不是经核验的实测。

适合跨境 DTC：供应商图或仓库实拍进入 Shopify／Woo 目录，先草稿、后上架。

## 要点

- 一条工作流覆盖 Shopify 与 WooCommerce，用 `DEFAULT_PLATFORM` 切换。
- 文案侧包含五点特征、不超过 70 个字符的 SEO 标题，以及由品名生成的 URL handle。
- 上传前可加水印或缩放；可用标签把商品分到不同区域店。

## 注意

社区节点和第三方图床要单独安装并授权。视觉模型可能看错材质、件数或合规说法，默认应走草稿。价格和 SKU 以 Webhook 入参为准，不要让模型自造成本。模板 Last update 约 8 months ago，上线前对照当前 n8n 节点与店铺 API 字段。
