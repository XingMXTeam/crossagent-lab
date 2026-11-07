---
title: "Amazon 评论挖掘 → Listing 改写（差评分诊版）"
summary: "把公开评论逐条分诊成四类根因，聚成带买家原话的痛点簇，再按证据改写英文 Title 与 5 Bullets——每处改动回链评论条号。中文输入，英文交付。"
result_en: "Reviews in → four-way triage, pain clusters with verbatim buyer phrases, and an evidence-traced English title + bullets rewrite."
bound_case_urls:
  - https://crossagent.maoxunxing.com/cases/review-mining-pain-points-chatgpt/
  - https://crossagent.maoxunxing.com/cases/n8n-amazon-reviews-apify-gemini/
  - https://crossagent.maoxunxing.com/cases/cosmo-listing-title-bullets-chatgpt/
clients:
  - "Claude Code"
  - "Codex"
  - "Cursor"
requires_own_keys:
  - "自己的 Agent 运行时订阅（Claude Code／Codex／Cursor 任一，须支持 Agent Skills 标准）。本站不提供账号与密钥。"
  - "评论数据自备：公开评论页整理，或卖家自己后台导出。本站不代抓、不提供付费墙数据。"
verification_level: sample_run
price_pending: false
price_usd: 49
price_note: "$49 一次性，经 Stripe 付款（链接在下方购买区，付款后自动跳回本页）。原型预览 zip 仍可免费下载先试跑。"
library_included: false
deliverables:
  - "01 差评分诊表：每条 1–3 星评论归入 文不对版／品质问题／不会用／不归商品 四类之一，带判定依据与建议动作"
  - "02 痛点聚类：达标痛点簇＋买家原话短语（逐字摘录、回链条号）＋须保住的正面卖点簇"
  - "03 英文 Title ＋ 5 Bullets 成品：按买家意图组织，每个卖点回链证据，可粘贴到 Seller Central（卖家核完参数后）"
  - "04 改写对照与运行日志：改前→改后→依据→合规自检、删除清单、NCX 结构提示、人工待核清单"
human_gates:
  - "成品标 DRAFT：包装清单、参数、材质与认证逐项对实物核过，才许改成可发布版。"
  - "② 品质问题只转产品待办，永远不许用文案掩盖；分诊边界拿不准时停下来问卖家，不许硬判。"
  - "发布由卖家自己在 Seller Central 完成。本 Skill 不代发、不代改店铺。"
changelog:
  - date: "2026-11-07"
    note: "原型预览版（草稿）。v0.1.0：SKILL.md＋模板可下载预览。用公开数据集演示跑 run-02 跑通标准模式并留档。当时尚未定价，付款未开。"
  - date: "2026-11-07"
    note: "正式定价 $49（一次性），Stripe 付款开放，购买区 Buy 按钮直达付款链接。"
status: draft
stripe_payment_link: "https://buy.stripe.com/00wdR9fPf05x0Mqahy6AM05"
category: listing
verification_facts:
  - "演示跑 run-02（2026-11-07）：公开数据集切片 415 条带星级评论全量跑完，低星 89 条逐条分诊，Gate 标准模式通过。"
  - "分诊抽查 18 条复核，一致率 94.4%；1 处改判已回改并留痕。复核为同一执行者二次判定，非双人盲审。"
  - "样本产品的水泵失效信号 50 条只转产品待办，未用文案掩盖；成品标 DRAFT，参数待卖家核。"
install_steps:
  - "下载下方原型预览 zip，解压得到 amazon-review-to-listing/ 文件夹：SKILL.md＋templates/ 模板。"
  - "把整个文件夹放进你的 Agent 技能目录（Claude Code 为 ~/.claude/skills/；Codex／Cursor 按各自的技能目录约定）。"
  - "准备输入三件——评论文件、自家产品中文卖点稿、现有 Listing（可选）——放进同一个工作文件夹。"
  - "在 Agent 里点名这个 Skill 运行。先看它输出的 Gate 确认段（总条数、星级分布、缺失项），确认后再让它继续。"
  - "拿到 output/ 四件后，先逐项核人工待核清单；核完才把 03 的 Title 与五点粘进 Seller Central。"
see_also_case_urls:
  - https://crossagent.maoxunxing.com/cases/competitor-listing-deconstruction-chatgpt/
  - https://crossagent.maoxunxing.com/cases/claude-code-crossborder-listing-rewrites/
  - https://crossagent.maoxunxing.com/cases/negative-review-response-chatgpt/
cta: mailto
zip: /skills/amazon-review-to-listing/amazon-review-to-listing-v0.1.0-prototype.zip
run_stats:
  - value: "415"
    label: "条评论跑完 · 全部带星级与全文"
  - value: "89"
    label: "条低星逐条分诊（1★ 45 / 2★ 20 / 3★ 24）"
  - value: "8 · 70 · 3 · 7"
    label: "四类分诊计数：文不对版 · 品质问题 · 不会用 · 不归商品（另 1 条无法判定）"
  - value: "3"
    label: "个达标痛点簇：噪音预期 / 容量口径 / 水位信息"
  - value: "94.4%"
    label: "分诊抽查复核一致率（抽 18 条）"
run_note: "样例产品：Veken 84 oz 宠物饮水机（演示跑 run-02，2026-11-07）。评论来自公开研究数据集切片，卖点稿为模拟稿；这是公开数据集演示跑，非真实卖家案例。"
before_title: "84oz Large Capacity — A Full Week Without Refilling! · Ultra Silent — Completely Noiseless, Perfect for Bedroom"
after_title: "Veken 84oz/2.5L Pet Water Fountain for Cats & Small Dogs, 3 Flow Modes, Low-Noise Pump (Rated <40 dB), Triple Filtration, BPA-Free, with 3 Carbon Filters, Pre-Filter Sponge & Silicone Mat"
inputs:
  - "竞品评论文件：CSV 或文本，每条含星级、标题、正文。门槛为低星（1–3 星）≥50 条、总数 ≥80 条；不足时转小样本模式并通篇标注。来源只能是公开评论页或卖家自有后台导出。"
  - "自家产品中文卖点稿：材质／容量／尺寸等可验证参数、包装清单、真实差异点。认证有才写，并注明证书名称；卖点稿里没有的参数，一律不进成品。"
  - "自家现有 Listing（可选）：英文标题＋五点。给了就做改写对照，不给就从零起草并标注。"
scope_for:
  - "差评分诊：判断每条差评到底是谁的问题——页面没写清、产品本身、使用门槛，还是与商品无关——再决定 Listing 能不能救、该不该救。"
  - "痛点聚类：把可干预的差评聚成簇，保留买家原话短语，并单独提取 4–5 星里被反复夸的卖点，改写时保住。"
  - "证据改写：按买家意图（不是关键词堆砌）重写 Title 与 5 Bullets，每处改动回链评论条号，过一遍 Amazon 合规红线。"
scope_not:
  - "不抓数据：不代抓评论、不绕登录墙、不提供付费墙后的数据。"
  - "不治产品病：故障、耐久、安全类品质问题只转产品／供应链待办，不写文案掩盖。"
  - "不编数字：不编造搜索量、认证、参数与买家原话；不承诺转化率、排名或 NCX 结果。"
  - "不做差评回复：本 Skill 不生成评论回复话术，也不含任何索评、诱导好评文案。"
provenance:
  - "第一方原创：四类分诊体系、Gate 前置检查、成簇门槛与原话回链规则、改写对照表与全部模板，均为 CrossAgent 本站撰写。参考的公开方法来源（n8n 工作流模板、Ooty 与 ZonGuru 的公开指南、X 上的跨境改写实践帖）只作方法灵感，未复制其 Prompt 原文、代码或文案表达；出处见下方绑定用例与对照阅读。"
  - "演示跑声明：本页样例为公开数据集演示跑，非真实卖家案例。卖点稿是按公开说明书反推的模拟稿；改写成品标 DRAFT，上架前须由卖家对实物逐项核对。"
  - "样例数据来自公开研究数据集（McAuley-Lab/Amazon-Reviews-2023，Pet_Supplies 切片），商用案例展示条款确认中。本页只引用评论短摘录，不再分发数据集内容。"
preview_files:
  - /skills/amazon-review-to-listing/SKILL.md
  - /skills/amazon-review-to-listing/templates/review-triage-table.md
  - /skills/amazon-review-to-listing/templates/review-triage-table.csv
  - /skills/amazon-review-to-listing/templates/listing-rewrite-comparison.md
---
