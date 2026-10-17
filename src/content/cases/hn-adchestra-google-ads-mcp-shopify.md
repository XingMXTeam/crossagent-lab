---
title: "HN：Shopify 卖家自建 Google Ads 读写 MCP（Adchestra）"
titleEn: "HN: Shopify sellers' read/write Google Ads MCP (Adchestra)"
summary: "据 Show HN：Shopify 店主跑 Google Ads 难拿正 ROAS，官方 Ads MCP 只读；他们做了托管读写 MCP，连 Ads／GA4／GTM，每次写操作在 Claude 里 Deny／Allow once／Allow always。"
summaryEn: "Show HN: Shopify merchants built a hosted read/write Google Ads MCP (Ads+GA4+GTM) after Google's official MCP stayed read-only; every write needs Deny/Allow once/Allow always in the agent."
category: ads
agents: ["Claude", "Codex", "ChatGPT", "Gemini"]
tools: ["Adchestra MCP", "Google Ads", "GA4", "Tag Manager"]
source: Hacker News
sourceUrl: https://news.ycombinator.com/item?id=49548962
sourceType: public
date: 2026-09-03
dateNote: "Show HN 发帖日；产品页 adchestra.com；2026-10-17 采编"
featured: false
prompt: |
  You are connected to Google Ads + GA4 + Tag Manager via a read/write MCP.
  Goal: find wasted search spend for the last {{days}} days on account {{customer_id}}.

  Steps:
  1) Pull campaigns/ad groups with spend > {{min_spend}} and conversions = 0 (or ROAS below {{roas_floor}}).
  2) Propose negatives and pause/budget moves as a CHANGESET (do not execute yet).
  3) For each write tool call, wait for human Deny / Allow once / Allow always.
  4) After approved writes, summarize: what changed, estimated daily spend impact, what to re-check in 7 days.

  Never create unrestricted broad-match campaigns. Prefer exact/phrase negatives over budget spikes.
  Cite only metrics returned by the MCP tools.
---

## 据公开帖摘要

Show HN（`https://news.ycombinator.com/item?id=49548962`，2026-09-03）：作者 MichalKrk 称与联合创始人为自家 **Shopify 店**跑 Google Ads，难拿到正 ROAS（帖文自述曾出现约 150 USD 换 1 次转化的情况）。请不起代理后转向 AI（作者偏好 Codex 多于 Claude Code），发现 **Google 官方 Ads MCP 只能读、不能改**，于是做了托管 MCP：**可读可写**，覆盖 Google Ads，并打通 Analytics 与 Tag Manager——可查表现、找浪费、创建／更新广告系列。

线程问答要点：写权限如何控？作者答每次 MCP 调用可在客户端选 **Deny／Allow once／Allow always**，读操作可常开、写操作逐条审（产品页 `#how` 有 Claude 审批弹窗示意）。能否建系列与命名？可以，命名习惯主要取决于所用 LLM。能否周一自动出报表？MCP 本身是连接器；若宿主 Agent 支持定时任务即可调度。产品页（adchestra.com）写明从开源 AdLoop 分支的商业托管，月费标价可见于该站；本条不替其背书效果。

## 要点

- 卖家痛点：官方只读 MCP → 需要带审批的写路径。
- 工作流：跨 Ads／GA4／GTM 提问 → 出变更集 → 人审写工具 → 再复盘。
- 适合中小 Shopify 广告主把「找浪费／加否词／暂停废系列」放进对话，而不是把预算全权交给模型。

## 注意

帖文中的 ROAS／花费数字来自作者自述，非独立审计。写广告账户前务必小范围 Allow once，并保留变更日志。Adchestra 为第三方托管，使用前核对 Google 权限范围与隐私条款。
