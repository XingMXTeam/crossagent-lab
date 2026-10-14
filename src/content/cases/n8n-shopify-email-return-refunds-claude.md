---
title: "Shopify 邮件退货退款：Claude 抽取 + 代码判政策 + Slack 人审"
titleEn: "Shopify email returns — Claude extract, code policy, Slack approval"
summary: "据 n8n 官方模板（约一周前更新）：Gmail returns 标签进线，Claude 只抽单号/商品/原因，资格与金额走代码与 Shopify suggestedRefund，Slack 批准后才 refundCreate。"
summaryEn: "Official n8n template (updated ~7d ago): Claude extracts return details; eligibility & amounts stay in code/Shopify; Slack must approve before refundCreate."
category: customer-service
agents: ["Anthropic Claude"]
tools: ["n8n", "Gmail", "Shopify GraphQL", "Slack", "Google Sheets"]
source: n8n
sourceUrl: https://n8n.io/workflows/20389-process-shopify-email-return-refunds-with-gmail-claude-slack-and-google-sheets/
sourceType: public
date: 2026-10-07
dateNote: "模板页写 Last update 约 7 days ago（相对 2026-10-14）"
featured: true
prompt: |
  Extract structured return fields from this customer email. Return JSON only:
  {order_number, line_items[{sku_or_name, qty}], reason, requested_resolution, language}.
  Do not decide eligibility or refund amount — policy and Shopify APIs handle that.
  If order_number is missing, set order_number to null.
  Email:
  {{email_body}}
---

## 据公开帖摘要

模板流程：每分钟扫带 `returns` 标签的未读 Gmail → Claude 抽取单号、退货行、原因与诉求 → 无单号则 Slack 提醒并回邮件索要 → 有单号则校验 DMARC、GraphQL 拉单，并在 **Code 节点**做所有权、状态、收货窗口、final-sale 标签与行匹配 → 合格则调 Shopify suggestedRefund，Slack 审批按钮最长等 48 小时 → 批准后 `refundCreate`（带幂等键），回写 Slack / 可选 Gmail 回复 / Google Sheets「Returns log」。

## 要点

- 模型**只做抽取**；资格规则不在 LLM 里。
- 编辑器试跑是 dry-run，不真实退款、不发信。
- 换货、店信用、未收到货、多币种、DMARC 失败一律交人。
- 工作流退的是钱，**不创建** Shopify Return 对象——需在货回仓或你接受先退后，再点批准。

## 注意

退款写权限与客户受保护数据权限按模板要求配置；生产务必限制 Slack 审批人 ID，并保留 Sheets 审计行。
