---
title: "Shopify 售后邮件闸门包（抽取不等于决策；Slack 人批后才退款）"
slug: shopify-returns-email-hitl-gate
summary: "把「Claude 只抽字段、Code／Shopify 判资格与金额、Slack 批准才 refundCreate」收成可导入的闸门配方。模型永不自行退款。"
bound_case_urls:
  - https://crossagent.maoxunxing.com/cases/n8n-shopify-email-return-refunds-claude/
  - https://crossagent.maoxunxing.com/cases/n8n-shopify-gmail-claude-support-hitl/
clients:
  - "n8n"
  - "Anthropic Claude"
  - "Slack"
  - "Gmail"
  - "Shopify Admin API"
requires_own_keys:
  - "Shopify 退款写权限，以及模板要求的受保护客户数据权限，由买家自己的应用持有。"
  - "Gmail 由买家自己授权。"
  - "Slack Bot 由买家自己的 workspace 安装。"
  - "Anthropic API 由买家自备。"
  - "以上全部买家自备。本站不代持。"
verification_level: docs_cited
price_usd: 49
price_note: "试价带顶，落在 $19–$49／包区间上沿。含写操作人审闸门。数字上与曝光位同为 $49，买的是安装包，不是版位。付款链接未开。"
library_included: false
deliverables:
  - "n8n 节点顺序骨架（Gmail returns 标签 → 抽取 → Code 政策 → suggestedRefund → Slack 审批 → refundCreate）"
  - "Claude 抽取-only Prompt（禁止判资格／金额）"
  - "政策开关表模板（final-sale、收货窗、DMARC、多币种则交人）"
  - "Slack 审批人 ID／幂等键／Sheets 审计行 checklist"
  - "与客服起草邮件闸门篇的分工说明（回信 vs 退款）"
human_gates:
  - "模型只抽取字段（单号、商品、原因等）。禁止模型判断退货资格或退款金额。"
  - "资格与金额走代码和 Shopify suggestedRefund。Slack 批准之后才 refundCreate。模型永不自行退款。"
  - "换货、店信用、未收到货、多币种、DMARC 失败、final-sale 一律交人。这条流程退的是钱，不创建 Shopify Return 对象。货回仓或接受先退之后，才由人点批准。"
  - "客服起草邮件是另一条闸门：退款、credits、取消、改地址永远只进草稿，不自动发送。本包不把那条直发白名单套到退款上。"
  - "意图不在发送白名单、置信度不够、订单邮箱与发件人不匹配、线程里已有往来或内容不清：走草稿或人工升级，不直发。"
  - "Shopify、Gmail、Slack、Anthropic 凭证只放买家自己的 n8n credentials。禁止贴进 prompt。限制 Slack 审批人 ID，保留幂等键和 Sheets 审计行。本站不代持这些密钥。"
changelog:
  - date: "2026-11-07"
    note: "草稿骨架。按 n8n 公开模板整理闸门顺序。本站未在真实店铺执行退款。付款链接未开。本页不含 zip。"
status: draft
stripe_payment_link: null
category: after-sales
verification_facts:
  - "据 n8n 官方模板和公开说明采编：邮件退货退款一条，客服起草邮件闸门一条。"
  - "本站未在真实店铺执行 refundCreate，也未替任何店铺发信。"
  - "模板编辑器里的试跑，用例写明是 dry-run。那不是本站已经退过款。"
install_steps:
  - "先分清两篇绑定用例：一篇是退款闸门（批准后才 refundCreate），一篇是客服回信闸门（退款类只进草稿）。不要并成一个自动退款机器人。"
  - "节点顺序按这个骨架接：Gmail 里带 returns 标签的未读邮件，Claude 只抽取字段，Code 节点做政策，再取 suggestedRefund，Slack 审批，最后才 refundCreate。"
  - "抽取 Prompt 只返回 JSON 字段。写明不得判断资格、不得给出退款金额。缺单号就标成空，交给人。"
  - "填政策开关表：final-sale、收货窗口、DMARC、多币种。命中任一项就停在人，不往下写退款。"
  - "Slack 审批人填买家自己的成员 ID，占位符用 YOUR_SLACK_APPROVER_ID。幂等键和 Sheets 审计行打勾之后，才允许批准写退款。"
  - "凭证只进买家的 n8n credentials。占位名：YOUR_SHOPIFY_ADMIN_TOKEN、YOUR_GMAIL_OAUTH、YOUR_SLACK_BOT_TOKEN、YOUR_ANTHROPIC_API_KEY。不要把值写进本页、对话或仓库。"
  - "上线前用样本邮件做 dry-run。确认没有真实退款、没有对外发信，再考虑把审批人从观察名单收紧到生产名单。"
see_also_case_urls:
  - https://crossagent.maoxunxing.com/cases/n8n-claude-shopify-slack-ops-agent/
  - https://crossagent.maoxunxing.com/cases/reddit-n8n-chatgpt-refund-fraud-alerts/
---
