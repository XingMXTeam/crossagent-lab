---
title: "Reddit：SellerForge 自建 MCP，只读账号健康、报销与 POA"
titleEn: "Reddit: SellerForge MCP reads account health, reimbursements, and POA — no listing or ad writes"
summary: "据 r/mcp 帖（u/Fap_Jesus，id 1wni6ho，2026-09-22）：作者公司在自有 API 上做 MCP，让 Claude 读取 SellerForge 里的卖家记录（账号健康、FBA 库存、已赔付报销、可能可索赔的差异、POA、跟踪关键词、Listing 审计分、广告活动）。帖文称只读、不改 Listing 或广告，并称只读版免费。产品页写明端点与客户端接法，并称该连接不能改 Seller Central 或 Amazon Ads。"
summaryEn: "r/mcp post by u/Fap_Jesus (id 1wni6ho, 2026-09-22): a company MCP over SellerForge’s API so Claude can read account health, FBA inventory, paid reimbursements, possible claimable discrepancies, POA cases, tracked keywords, listing audit scores, and campaigns. The author says it is read-only and that the read-only version is free. The product page lists the endpoint and says the connection cannot change Seller Central or Amazon Ads."
category: ops-finance
agents: ["Claude", "ChatGPT", "Claude Code", "Cursor"]
tools: ["SellerForge MCP", "https://www.sellerforge.ai/api/mcp"]
source: Reddit
sourceUrl: https://www.reddit.com/r/mcp/comments/1wni6ho/i_built_an_mcp_server_for_amazon_sellers/
sourceType: public
date: 2026-09-22
dateNote: "Reddit 发帖日 2026-09-22（id 1wni6ho，作者 u/Fap_Jesus）。2026-10-25（Asia/Shanghai）采编。分数／评论会变（发现时约 2 points／约 3 comments）。产品页作辅证，不是 sourceUrl。"
featured: false
prompt: |
  You answer questions about one Amazon seller account using SellerForge MCP
  only (endpoint https://www.sellerforge.ai/api/mcp). You do not change
  listings, prices, inventory, ads, or cases.

  Question: {{question}}
  Account label the operator already uses: {{account_label}}

  Rules:
  1) Use only read tools the connector actually exposes. If a tool is missing
     or errors, say so. Do not switch to a Selling Partner plugin, Ads MCP,
     or a marketplace research MCP to fill the gap.
  2) If the tool output has no figure, reply "I don't know". Do not estimate
     account health, ODR, late shipment, FBA units, reimbursements,
     keyword rank, audit scores, or campaign metrics.
  3) Quote numbers only as returned. Label them SellerForge records in chat,
     not a ledger and not a Seller Central export you verified.
  4) Never ask for Seller Central, Amazon Ads, or SellerForge passwords,
     cookies, or API secrets in chat.
  5) Do not draft a Plan of Action for submission, open a case, or change
     bids. If any write tool appears, stop. The 2026-09-22 post said write
     permissions were planned; the product page at editorial time said this
     MCP cannot change Seller Central or Amazon Ads.
  6) Before this machine is shared, remind the operator to revoke the
     connector under SellerForge Settings → Connections and inside the AI client.

  Output: (a) fields the tools returned, (b) unknowns, (c) ACTIONS REQUIRING HUMAN APPROVAL.
---

## 解决什么问题

卖家要看账号健不健康、FBA 还有多少货、亚马逊已经赔了什么、还有没有可能索赔的差异、POA 走到哪、自己跟踪的词排第几、Listing 审计分、广告活动现状。这些数若每次从后台导出再贴进聊天，模型就会补猜测。

u/Fap_Jesus 在 r/mcp 写：自己的亚马逊软件公司在**自有 API** 上做了 MCP，连上之后 Claude 读的是 SellerForge 里已经有的卖家记录，而不是让模型现编。帖文点名的范围：账号健康（括号里写 AHR、order defect rate、late shipment）、FBA 库存、亚马逊**已经赔付**的报销、**可能仍可索赔**的差异、plan-of-action cases、tracked keywords、listing audit scores、campaigns。

这是 **SellerForge 账号里的记录**，经他们自己的连接器读出。与站内 [亚马逊官方 Selling Partner Agentic Toolkit](/cases/amzn-selling-partner-agentic-toolkit/) 不同：那边是亚马逊一方的卖家插件，写操作走官方审批。与 [SoldScope MCP](/cases/soldscope-mcp-live-amazon-data/) 也不同：SoldScope 是公开市场的关键词／ASIN 调研，不是这家公司替你存的 POA、报销和审计。

## 人审闸门（必须人工确认）

1. **不改 Seller Central 或 Amazon Ads** — 帖文写只读，不碰 Listing、不碰广告。产品页写：这条 MCP 连接读 SellerForge 数据，不能在 Seller Central 或 Amazon Ads 里改东西。出现写工具就停。
2. **帖文里的「即将开放写权限」不是现在就能改价改广告** — 作者说之后会做写权限，例子是调整广告出价。采编日产品页仍写 MCP 不能改 Seller Central／Ads，也不能自行切换执行模式或绕过额度、角色和更高风险审批。写操作上线与否以你账号里实际工具为准，须人批。
3. **聊天里的数字不是账本** — 作者要求工具在核对不了时返回 “I don't know”，而不是估算。报销、索赔、账号健康分用来对账或申诉前，回到 SellerForge／Seller Central 原文。
4. **不把 SellerForge、Seller Central、Ads 密码贴进对话** — 产品页写授权的是 SellerForge 账号，不是把卖家后台密码交给模型。
5. **共用机器前撤销连接** — 产品页写从 Settings → Connections 撤销；也可在 AI 客户端里删掉该连接器。页内另有 Settings → AI Actions 可暂停执行（这是产品页说法，本站未点过该开关）。

## 可复现步骤

前置（据[该帖](https://www.reddit.com/r/mcp/comments/1wni6ho/i_built_an_mcp_server_for_amazon_sellers/)与[产品页](https://www.sellerforge.ai/mcp)，本站未连接账号、未调用工具）：

1. 已有 SellerForge 账号。帖文称只读版完全免费；产品页的说法是：读取在各方案（含试用）都可用，MCP 含在方案内、无加购费。两处用词不同，本页不把它们收成「全产品免费」。
2. 支持远程 HTTP MCP 的客户端。产品页点名 Claude（网页／桌面自定义连接器）、ChatGPT（开发者模式连接器）、Claude Code、Cursor。

跟做（产品页步骤，界面会随客户端改版；端点不变）：

1. 端点填 `https://www.sellerforge.ai/api/mcp`，并授权 SellerForge 账号（不要在聊天里交密码）
2. **Claude**：Settings → Connectors → Add custom connector，粘贴上述 URL
3. **ChatGPT**：Settings → Connectors，打开 developer mode，新建连接器，把该 URL 当作 server endpoint
4. **Claude Code**：产品页给出的命令是 `claude mcp add --transport http sellerforge https://www.sellerforge.ai/api/mcp`
5. **Cursor**：在 `mcp.json` 的 `mcpServers` 里加名为 `sellerforge` 的项，`url` 为同一端点（页内有示例，不含密钥）
6. 用自然语言问账号健康、报销、POA／升级案例、跟踪关键词、FBA（页内示例也提到 AWD）库存、Listing 审计、广告活动。产品页还列出 document vault；Voice of Customer、AI visibility、decision log 写明需要 Growth 及以上
7. 对不上的数字让工具说不知道。作者给做 MCP 的人两条提示：把工具标成 read-only（否则 Claude 会把读工具当成写、每次征求许可）；工具输出里宁可 “I don't know”，也不要给估出来的数

作者披露：这是其所在公司的连接器。

## 预期结果与失败限制

**预期（来源声称，不是本站实测）：**

- 问句得到的是 SellerForge 已保存的账号记录，而不是模型补的市场数字
- 只读：不改 Listing、不改广告（帖文）；产品页进一步写不能在 Seller Central 或 Amazon Ads 里暂存或应用变更
- 可从 Settings → Connections 撤销该客户端之后的访问

**失败与边界：**

- 工具没有的字段必须空着。作者明确反对用估算填空
- 帖文与产品页对「免费」的表述不一致（见前置）。方案额度、角色、更高风险审批以产品页为准：MCP 不能绕过这些控制
- 产品页声明不隶属、不受 Amazon.com, Inc. 背书；官方 API 范围以该页为准，本站未核对你的卖家角色
- 2026-10-25 打开 reddit.com 被网络拦截，正文核对自公开帖归档（作者、id、日期与上文一致）。分数／评论会变；发现时约 2 points／约 3 comments
- 本站**未**登录 SellerForge，**未**调用 MCP

## 来源与核验状态

**公开可核验**

- 主帖：[r/mcp — I built an MCP server for Amazon sellers](https://www.reddit.com/r/mcp/comments/1wni6ho/i_built_an_mcp_server_for_amazon_sellers/)（u/Fap_Jesus，id `1wni6ho`，2026-09-22）
- 辅证（不是 `sourceUrl`）：[SellerForge MCP 产品页](https://www.sellerforge.ai/mcp)
- 采编：2026-10-25（Asia/Shanghai）。与 [Selling Partner Agentic Toolkit](/cases/amzn-selling-partner-agentic-toolkit/)、[SoldScope MCP](/cases/soldscope-mcp-live-amazon-data/) 的差别见首节。Lab 未重跑工具。

## 据公开帖摘要

**Reddit（r/mcp，2026-09-22）：** 标题 “I built an MCP server for Amazon sellers”。作者写自己运营一家亚马逊软件公司，厌倦为基本问题导出报表，于是在自有 API 上做 MCP。连一次后，Claude 可以读实时的 Seller Central 与 Ads 相关数据，范围即上文列举的健康度、FBA 库存、已赔付报销、可能可索赔的差异、POA、跟踪关键词、Listing 审计分和广告活动。只读，不改 Listing 或广告；作者称决定把只读版做成完全免费。并预告之后会上写权限，例如调整广告出价。两条实现提示：给每个工具加注解，让 Claude 把它们归进 “Read-only tools”，否则读工具会被当成写；工具在无法核实数字时说 “I don't know”，不要估算。文末链到 `https://www.sellerforge.ai/mcp`，并披露这是作者公司的连接器。

**产品页（sellerforge.ai/mcp，2026-10-25 仍可打开）：** 端点 `https://www.sellerforge.ai/api/mcp`。连接步骤覆盖 Claude 自定义连接器、ChatGPT developer mode、Claude Code 的 HTTP `claude mcp add`、Cursor `mcp.json`。撤销路径为 Settings → Connections，也可在 AI 客户端内移除。读工具覆盖账号健康、报销、POA 与升级案例、关键词与排名历史、库存、Listing 审计、广告活动、document vault；Growth 及以上才有 Voice of Customer、AI visibility、decision log。页内写：MCP 不能改 Seller Central 或 Amazon Ads，不能自行选择或更改执行模式，也不能绕过额度、角色检查和更高风险审批。页内把自家连接器与亚马逊一方的 Ads MCP、Selling Partner 插件，以及「把 SP-API 直接桥成 MCP」区分开，并声明不隶属 Amazon。

## English brief

A SellerForge operator (r/mcp, 2026-09-22) published an MCP over their own API so Claude can read SellerForge records: account health, FBA inventory, reimbursements already paid, possible claimable discrepancies, POA cases, tracked keywords, listing audit scores, and campaigns. The author says the read-only build is free and does not change listings or ads, and that tools should refuse unverified numbers. The product page (`https://www.sellerforge.ai/api/mcp`) documents Claude, ChatGPT, Claude Code, and Cursor setup and says this MCP cannot change Seller Central or Amazon Ads. This is not Amazon’s Selling Partner plugin and not SoldScope-style ASIN research. Lab did not call the tools. Revoke the connector before sharing a machine, and do not treat chat figures as a ledger.
