---
title: "头程／HS／landed cost 探针包（FreightUtils + border.bot）"
slug: logistics-hs-landed-cost-probe
summary: "装上后，Agent 能用 FreightUtils 查出带出处的 HS／CBM；报关与 DDP 必须人审。"
result_en: "Install → cited HS/CBM via FreightUtils. Human confirms before filing or DDP."
bound_case_urls:
  - https://crossagent.maoxunxing.com/cases/freightutils-freight-mcp-cited-tools/
  - https://crossagent.maoxunxing.com/cases/border-bot-hs-landed-cost-mcp/
clients:
  - "Cursor"
  - "Claude Desktop"
  - "Claude Code"
requires_own_keys:
  - "FreightUtils：匿名可用；Pro key 由买家自备。"
  - "border.bot（可选）：买家 OAuth 与 credits。"
  - "Lab 不转售密钥。"
verification_level: hybrid
price_usd: 4.99
price_note: "草稿标价 $4.99。Buy 为占位，付款链接未开。ZIP 现可下载，Stripe 上线后改为付款解锁。"
library_included: false
deliverables:
  - "SKILL.md 与 FreightUtils／border.bot MCP 配置骨架（不含密钥）"
human_gates:
  - "不得把 HS／duty／landed cost 写进报关、客户报价或 DDP 承诺。"
  - "8–10 位国别税号、订舱、打单、申报和改价由人决定。"
  - "Pro key、OAuth 与扣费由买家自己确认。本站不代持密钥。"
changelog:
  - date: "2026-11-07"
    note: "短详情页。标价 $4.99。Buy 为占位。demo 与 v0.1.0 zip 上页。付款链接未开。"
status: draft
stripe_payment_link: null
category: logistics
verification_facts:
  - "FreightUtils：本站 2026-10-26（Asia/Shanghai）匿名探针 initialize／tools/list／health 为 HTTP 200，写在绑定用例里。"
  - "border.bot：匿名访问 MCP 为 401。本站未完成 OAuth，未实调 classify。"
  - "核验口径以绑定用例为准。本页不写访问量或购买人数。"
install_steps:
  - "解压 zip，把 SKILL.md 装进 Cursor、Claude Desktop 或 Claude Code 的技能目录。"
  - "按 references/mcp-freightutils.json 添加 FreightUtils 远程 MCP。匿名不填密钥。"
  - "可选：买家自备 border.bot OAuth 与 credits。报关与 DDP 等人审。"
see_also_case_urls:
  - https://crossagent.maoxunxing.com/cases/eximagent-trade-mcp-hs-tariff-ofac/
  - https://crossagent.maoxunxing.com/cases/gateway-lines-tariff-mcp/
cta: buy
demo: /demos/logistics-hs-demo.gif
demo_video: /demos/logistics-hs-demo.mp4
demo_caption: "Lab anonymous probe 2026-11-07 Asia/Shanghai · HS 610910 · not a vendor ad"
zip: /skills/logistics-hs-landed-cost-v0.1.0.zip
install_prompt: "Read https://crossagent.maoxunxing.com/skills/logistics-hs-landed-cost-probe/ and install the logistics-hs-landed-cost skill pack (SKILL.md + MCP skeletons)."
---
