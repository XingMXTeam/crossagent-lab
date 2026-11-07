---
title: "头程／HS／landed cost 探针包（FreightUtils + border.bot）"
slug: logistics-hs-landed-cost-probe
summary: "在 Claude／Cursor 里先跑通「可引用的货运数学 + 目的国 HS／landed cost」只读链路，报关与报价一律人审。"
bound_case_urls:
  - https://crossagent.maoxunxing.com/cases/freightutils-freight-mcp-cited-tools/
  - https://crossagent.maoxunxing.com/cases/border-bot-hs-landed-cost-mcp/
clients:
  - "Cursor"
  - "Claude Desktop"
  - "Claude（远程 MCP）"
  - "ChatGPT（可选，border.bot 文档所列客户端）"
requires_own_keys:
  - "FreightUtils：匿名可评测；Pro 或更高限额由买家自购。"
  - "border.bot：买家自建账号、自行完成 OAuth，并自付 credit packs。"
  - "本站不代持、不转售密钥。"
verification_level: hybrid
price_usd: 29
price_note: "试价，落在 $19–$49／包区间内偏低。主路径有 FreightUtils 探针，作第一单骨架。付款链接未开。包内不含曝光位。"
library_included: false
deliverables:
  - "MCP 客户端配置骨架（FreightUtils 远程／npx；border.bot OAuth 步骤清单）"
  - "探针自检脚本大纲（health／initialize／样例只读调用，与用例口径一致）"
  - "HITL 闸门卡（禁止把 HS／duty 写进报关或 DDP 承诺）"
  - "会话 System／Skill 短文（只读、须引 _source／citation）"
  - "与用例页对照的「本站已测／未测」表"
human_gates:
  - "不得把 HS／UK duty／ADR／landed cost 写进报关单、客户报价、商品定价或 DDP／checkout 承诺。FreightUtils 的 HS 是 WCO 6 位参考层；带 FUZZY 警告时不得直接写入报关单或客户报价。"
  - "最终 HS／HTS／CN／UK（含 8–10 位国别税号）由人确定。低置信度须审；高价值或管制品须持牌报关行确认，或向海关申请 binding ruling。"
  - "不得把示例数字当成已含承运商 brokerage／handling。border.bot 首页示例为示意数字。"
  - "危险品放行、混装、隧道限制由持证人员决定。adr 工具只返回参考数据。"
  - "denied-party／restrictions 只作证据线索，不得当作法律放行依据。"
  - "订舱、打单、申报、改价、对外承诺时效或运费，不得由 Agent 自动执行。两套工具都不是海关裁定或报关行。"
  - "订阅 Pro、购买或粘贴 API key、提高限额、border.bot OAuth 与选择扣费 workspace，以及会消耗 credits 的 classify／calculate／screen，由账号所有人亲自确认。本站不代持密钥。"
changelog:
  - date: "2026-11-07"
    note: "草稿骨架。标价为试价。付款链接未开。本页不含 zip。"
status: draft
stripe_payment_link: null
category: logistics
verification_facts:
  - "FreightUtils：本站 2026-10-26（Asia/Shanghai）匿名探针 initialize／tools/list／health 为 HTTP 200，写在绑定用例的 Lab 探针成品里。"
  - "border.bot：匿名访问 MCP 为 401，定价 GET 读到的是公开价目。本站未完成 OAuth，未实调 classify。"
  - "核验口径以绑定用例为准。本页不写访问量或购买人数。"
install_steps:
  - "先读两条绑定用例：FreightUtils 的探针成品，以及 border.bot「未 OAuth、未调用 classify」的边界。确认这条链路只做只读参考。"
  - "在 Cursor 或 Claude Desktop 添加 FreightUtils 远程 MCP，地址用公开端点 https://www.freightutils.com/api/mcp。匿名评测不填密钥。"
  - "买家若自购 Pro 或更高限额，把密钥放进自己的客户端密钥库，环境变量名用 FREIGHTUTILS_API_KEY 这类占位。不要把值写进对话、技能文件或公开仓库。本地可选 npx freightutils-mcp，同样不入库密钥。"
  - "border.bot 由买家自建账号，按所选客户端的 OAuth 清单授权。选择扣费 workspace 之前停下来，由账号所有人确认。"
  - "按用例口径做只读自检：health、initialize，再加一条样例只读调用。回答须带上返回里的 _source 或 citation。"
  - "对照闸门卡再往下做。报关、报价、DDP 承诺、订舱、申报和扣费都等人。样例 HS 或 duty 不得写进报关单。"
see_also_case_urls:
  - https://crossagent.maoxunxing.com/cases/eximagent-trade-mcp-hs-tariff-ofac/
  - https://crossagent.maoxunxing.com/cases/gateway-lines-tariff-mcp/
---
