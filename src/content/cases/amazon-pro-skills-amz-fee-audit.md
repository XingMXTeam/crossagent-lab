---
title: "Amazon Pro Skills：用 amz-fee-audit 审 Payments 报表找 FBA 费用异常"
titleEn: "Amazon Pro Skills — amz-fee-audit for Payments-report FBA fee anomalies"
summary: "据公开仓库 jaygptpro/amazon-pro-skills：`amz-fee-audit` 是给 Claude Code 用的技能，卖家粘贴 Payments 报表行即可对照五类费用异常（尺码档错分、退款未退 referral、重复履约费、仓储差异、报销缺口），并起草 Seller Support「FBA Fee Discrepancies」工单材料；零 MCP／零 API key。技能内举例数字仅为演示，本站未核销。"
summaryEn: "Public repo jaygptpro/amazon-pro-skills: amz-fee-audit is a Claude Code skill that reviews pasted Payments rows for five fee-anomaly types and drafts Seller Support FBA Fee Discrepancies case packets — no MCP/API keys. Worked-example dollar amounts are illustrative only; Lab did not verify recoveries."
category: ops-finance
agents: ["Claude Code"]
tools: ["amz-fee-audit", "Amazon Pro Skills", "Amazon Payments report", "Seller Support FBA Fee Discrepancies"]
source: GitHub
sourceUrl: https://github.com/jaygptpro/amazon-pro-skills
sourceType: public
date: 2026-05-23
dateNote: "仓库 created 2026-05-23；README／SKILL 现文 2026-10-24 核对 Asia/Shanghai；安装：npx skills add JayGPTPro/amazon-pro-skills；亦可 --skill amz-fee-audit。与站内官方 Selling Partner Agentic Toolkit 区分：那边走 SP-API 连接器，这边是本地技能＋粘贴报表"
featured: false
prompt: |
  You are running the amz-fee-audit skill framework. I will paste Payments report rows
  and optional actual dimensions/weights. You have no SP-API access in this chat.

  Period: {{date_range}}
  Marketplace: {{marketplace}}
  Pasted rows: {{payments_tsv_or_csv_snippet}}
  Actual dims/weight if known: {{L_W_H_weight_per_sku}}

  Do this:
  1) Map each row to one of the five anomaly types from the skill (or NONE).
  2) For each finding: SKU/order | anomaly type | evidence rows | expected vs actual
     fee logic | delta. If the FBA fee table value is unknown, say UNKNOWN — do not invent.
  3) Draft Seller Support case packets under FBA Fee Discrepancies (not SAFE-T).
  4) List structural fixes (e.g. update listed dimensions) separately from recovery claims.

  Rules:
  - Use only pasted figures. Never invent recovery totals or “typical two-week” outcomes.
  - Do not file cases, send email, or change listings. Mark those HUMAN APPROVAL REQUIRED.
  - Do not ask me to paste SP-API refresh tokens or account passwords.
---

## 解决什么问题

FBA 卖家常觉得「费用偏高」却说不清是哪一行错了：尺码档被抬高、退款后 referral 未按比例退回、同一订单重复扣履约费、已移除库存仍收仓储等。公开技能包 **Amazon Pro Skills** 里的 `amz-fee-audit` 让 Claude Code 在**不接 SP-API** 的前提下，根据卖家粘贴的 Payments 报表行做结构化对照，并按异常类型起草给 Seller Support「FBA Fee Discrepancies」渠道的材料。

它解决的是「报表审阅与工单草稿」，不是自动改价或自动开 Case。与站内「Amazon Selling Partner Agentic Toolkit／官方 Connector」不同：那边经 Seller Central OAuth 调直播工具且写操作人审；本条是本地技能＋你粘贴的数据。与「SAFE-T 报销」也不同：技能正文写明费用超收走 **FBA Fee Discrepancies**，不要走 SAFE-T。

## 人审闸门（必须人工确认）

1. **在 Seller Support 正式提交 Fee Discrepancies Case** — 技能只出草稿，提交须人
2. **修改 Listing 尺寸／重量／包装类型** — 结构性修复影响后续计费，须人确认
3. **把完整 Payments 导出、税号、银行信息贴进不可信对话／工单截图** — 最小化粘贴；脱敏订单号外的 PII
4. **把技能文内演示用的美元金额当成你的可追回承诺** — 禁止；那是文档举例
5. **使用非官方「代提报销」第三方并授权账号** — 本条不涉及；若考虑须另审

## 可复现步骤

前置：

1. 已安装 Claude Code（或兼容 skills 安装器的客户端）
2. 安装技能（README）：`npx skills add JayGPTPro/amazon-pro-skills -g`；或按 skills.sh：`npx skills add https://github.com/jaygptpro/amazon-pro-skills --skill amz-fee-audit`
3. 从 Seller Central 导出目标时段 **Payments** 报表；可选：准备 SKU 实測外箱尺寸与重量
4. **不要**提供 SP-API refresh token；本技能声明零外部工具

跟做（据 `amz-fee-audit/SKILL.md`，非本站实测）：

1. 在 Claude Code 会话中触发 fee audit／Payments 分析意图，或显式调用该 skill
2. 粘贴报表行＋已知尺寸；让技能按五类异常建预期费用并逐行比对
3. 输出：异常列表、证据行、差额逻辑、按异常类型拆分的 Case 叙述、结构性修复
4. 人工核对 FBA 费用表与尺寸后，再决定是否在 Seller Support 开 Case
5. 若确认是尺码档问题：先改 Listing 尺寸，再追历史差额，避免下月重复

## 预期结果与失败限制

**预期（技能文档描述）：**

- 五类框架：尺码档错分、缺 referral 退款、重复履约费、仓储差异、报销政策缺口
- 输出模板含 anomalies、total recovery available、Cases to open、structural fixes
- 质量自检：每条异常须落在五类之一，且带报表证据行

**失败／边界：**

- 未贴报表或缺少尺寸 → 无法做尺码档判断；费用表版本过期会导致「预期费」算错
- README 称技能包共 **67** 条（以仓库现文为准）；本条只采编 `amz-fee-audit`
- 技能「Worked example」中的单价／件数／总额为**演示叙事**，本站未核销任何追回金额
- 本站**未**用真实 Payments 文件跑该技能

## 来源与核验状态

**公开可核验**

- 主仓：[jaygptpro/amazon-pro-skills](https://github.com/jaygptpro/amazon-pro-skills)
- 技能原文：[`amz-fee-audit/SKILL.md`](https://raw.githubusercontent.com/jaygptpro/amazon-pro-skills/main/amz-fee-audit/SKILL.md)
- 目录页：[skills.sh — amz-fee-audit](https://www.skills.sh/jaygptpro/amazon-pro-skills/amz-fee-audit)
- 采编：2026-10-24（Asia/Shanghai）。**未做 live 实测**。

## 据公开帖摘要

GitHub 仓库 `JayGPTPro/amazon-pro-skills`（README 现文称 **67** 条生产向 Claude Code 技能，免费开源；安装 `npx skills add JayGPTPro/amazon-pro-skills -g`）在「Financial recovery and reconciliation」分组下列出 `amz-fee-audit`。技能 frontmatter 说明：审计 Amazon Payments，查找错误 FBA 履约费（错误 size tier）、退款后缺失的 referral 退回、重复扣费、FBA 仓储差异等，并按发现产出 FBA fee-discrepancy case packet；**零 tools**，由用户粘贴报表行。

`SKILL.md` 将异常固定为五类，步骤为：收集输入 → 按现行 FBA 表建预期费用 → 逐行比对 → 汇总差额 → 在 Seller Support > Fulfillment by Amazon > **FBA Fee Discrepancies** 开 Case（明确不要走 SAFE-T）→ 给出结构性修复 → 质量检查。文内 Worked example 用假设尺码档错分故事说明流程；其中美元数字仅为例，不能当行业平均追回额。

## English brief

Public `amz-fee-audit` skill in `jaygptpro/amazon-pro-skills` walks Claude Code through five Payments-report fee-anomaly types and drafts FBA Fee Discrepancies case packets without MCP/API keys. Lab cites the repo/SKILL only — **no live Payments audit**. Treat worked-example dollar amounts as fiction for teaching, not recovery promises.
