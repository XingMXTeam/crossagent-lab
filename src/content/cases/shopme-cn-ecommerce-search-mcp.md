---
title: "Shopme MCP：在 Agent 里搜淘宝／天猫／小红书货源"
titleEn: "Shopme MCP for Taobao / Tmall / Xiaohongshu product search in agents"
summary: "据 Shopme 公开 MCP 页与 shopmeskills/mcp 仓库：托管端点可挂 ChatGPT／自定义 Agent，工具含 search_products；开源包宣称零 API key 搜淘宝／天猫／小红书。2026-10-24 本站探针：工具列表与服务说明可读，但匿名 Guest 的 text／image 能力为 false，search_products 返回 unavailable；npm 上 @shopmeagent/cn-ecommerce-search-mcp 未找到（404）。"
summaryEn: "Public Shopme MCP page + shopmeskills/mcp repo: hosted endpoint for ChatGPT/custom agents with search_products; open-source package claims zero-key Taobao/Tmall/XHS search. Lab probe 2026-10-24: tools/list and service info OK, but anonymous guest text/image capabilities were false and search_products returned unavailable; npm package @shopmeagent/cn-ecommerce-search-mcp was 404."
category: sourcing
agents: ["ChatGPT", "Cursor", "Claude"]
tools: ["Shopme MCP", "mcp-test.shopmeagent.com", "search_products", "@shopmeagent/cn-ecommerce-search-mcp", "@shopmeagent/logistics-tracking-mcp"]
source: 官网
sourceUrl: https://shopmeagent.com/mcp
sourceType: public
date: 2026-10-18
dateNote: "get_shopme_service_info 返回 updatedAt 2026-10-18；GitHub README 与 MCP 页于 2026-10-24（Asia/Shanghai）核对；同日探针记录见站内采编说明"
featured: false
prompt: |
  You help a cross-border seller source products from Chinese marketplaces via Shopme MCP.
  Assume the client already connected https://mcp-test.shopmeagent.com/mcp (or the open-source
  cn-ecommerce-search MCP when published). Do not ask the user to paste OAuth tokens into chat.

  Task:
  - Keyword (Chinese OK): {{keyword}}
  - Optional platform filter if the connected tools support it: {{taobao|tmall|xhs|any}}
  - Goal: shortlist candidates for further human review (not purchase)

  Rules:
  1) Call only tools the connected Shopme MCP actually exposes (e.g. search_products,
     get_connection_info, get_shopme_service_info). If search is unavailable or capabilities
     show text/image false, say so — do not invent products, prices, or stock.
  2) Report titles, platforms, and Shopme product links exactly as returned. Mark price and
     availability unknown when the tool says so.
  3) Never buy, pay, message sellers, or change a Shopme account. Open returned Shopme links
     for humans to verify SKU and terms.
  4) Do not treat image similarity as the same SKU/model. Do not invent ROI or resale profit.
  Output: (a) tools called, (b) candidate table from live response, (c) capability/allowance
  notes from get_connection_info, (d) ACTIONS REQUIRING HUMAN APPROVAL before any spend.
---

## 解决什么问题

跨境选品／货源侧常要在淘宝、天猫、小红书等站来回搜同款与工厂向 listing，再手工拷到运营表。Shopme 把中国站商品检索接到 MCP 后，可在 ChatGPT／Cursor 等客户端里用自然语言做**只读搜品与候选清单**，减少在浏览器与聊天之间切换。

它解决的是「在 Agent 会话里发现中国站货源候选」，**不是**一键下单或支付。与站内 Easyship／轨迹聚合类用例不同：那边是履约与物流；这边是**货源检索**。与 Avalara／Gateway Lines 关税 MCP 也不同：那些是税则／关税；Shopme 不声称做 HS 归类。

## 人审闸门（必须人工确认）

以下动作**不得**由 Agent 自动执行：

1. **在 Shopme 或原站下单／支付** — 本连接按公开页为只读购物协助，不能代买
2. **把工具返回的标题／相似图当成同一 SKU 或正品证明** — 须打开 Shopme 商品页人工核对规格
3. **把未核验的价格／库存写入客户报价或采购单** — 公开页写明 price／inventory 可能不可用或过期
4. **自动重试 search 在 503／busy／unavailable 之后** — 公开页要求等待说明的重试时间，勿循环打爆额度
5. **把 OAuth client secret、回调链、验证码贴进可分享对话** — 禁止；按 MCP 页 Advanced OAuth 说明配置

Guest／账号日额度以 `get_connection_info` 返回为准；查连接与额度按公开说明为免费，但仍建议人工扫一眼再决策。

## 可复现步骤

前置（公开材料）：

1. MCP 客户端（ChatGPT 自定义 MCP／Cursor／Claude 等）支持远程 Streamable HTTP 或本地 stdio
2. **托管（公开 MCP 页）：** Server URL `https://mcp-test.shopmeagent.com/mcp`；可 Guest「Use without an account」，或 OAuth 连 Shopme 账号（公开 client id `shopme-chatgpt-pilot`，无 client secret）
3. **开源（GitHub README）：** 配置 `npx -y @shopmeagent/cn-ecommerce-search-mcp`（README 称零 API key；**2026-10-24 在 npm registry 查询该包名为 404，尚未可 `npx` 安装**）
4. 同仓库另有 `@shopmeagent/logistics-tracking-mcp`（npm 可见 version `1.0.0`），与搜品包不同，勿混为一谈

跟做路径（据[Shopme MCP 页](https://shopmeagent.com/mcp)与 [shopmeskills/mcp](https://github.com/shopmeskills/mcp)；**搜品 live 结果本站未拿到**）：

1. 在客户端添加上述 MCP → 确认工具列表含 `search_products`／`get_connection_info`（托管探针还见到 `get_product_detail`、`get_shopme_service_info`）
2. 先调用 `get_connection_info`：确认 `connection_mode`、剩余额度与 **capabilities**（text／image／joint）
3. 若 capabilities 允许：用中文关键词调用 `search_products`（例：`不锈钢保温杯`）；只输出工具返回的候选与 Shopme 链接
4. 打开返回的 Shopme 商品页人工核对 SKU／价格／购买条款；Agent 不得下单
5. 若返回 `unavailable`／503：按公开页「勿自动重试」；问服务说明或稍后再查连接

本页文末 Prompt 可复制；先填 `{{…}}`，再在已配置 MCP 的会话使用。

## 预期结果与失败限制

**预期（公开材料描述）：**

- 托管 MCP：自然语言搜品；结果带 Shopme 商品链接；平台枚举在工具 schema 中见 `taobao`／`xhs`（以当次 schema 为准）
- 开源 README：工具 `search_products`／`get_product_detail`／`parse_product_link`；平台写明淘宝、天猫、小红书
- 服务说明工具（本站探针）：Guest access available；购物摘要称可覆盖淘宝与小红书等发现场景（`get_shopme_service_info`，updatedAt 2026-10-18）

**本站 2026-10-24 探针（Asia/Shanghai）事实：**

- `initialize` 成功；`serverInfo.name` = `shopme`，version `0.1.0`
- `get_connection_info`：`connection_mode=anonymous`，`capabilities.text/image/joint/readOnlyDetail` 均为 **false**；`usage.access=available`；`resetAt` 对应 UTC 2026-10-25 00:00（Asia/Shanghai 2026-10-25 08:00）
- `search_products`（关键词「不锈钢保温杯」）→ `status=error`，`code=unavailable`（原文要求勿自动重试）
- npm：`@shopmeagent/cn-ecommerce-search-mcp` **404**；`@shopmeagent/logistics-tracking-mcp@1.0.0` 存在
- 从 GitHub 源码本地构建后，`parse_product_link` 对淘宝 URL 可解析出 platform／productId（本地、无网络）；对 `https://api.shopmeagent.com` 的搜品 HTTP 调用返回 **401**（未宣称本站已打通生产搜品）

**失败／边界：**

- Guest 额度用尽或能力关闭 → 搜品不可用；需按页连接 Shopme 账号
- 图片相似 ≠ 同款 SKU；未知规格保持未知
- 来源未写 Amazon 渠道覆盖时，本页也不写
- 勿把营销式「货源优势」写成已验证 ROI

## 来源与核验状态

**公开可核验**

- 主文：[Shopme MCP](https://shopmeagent.com/mcp)
- 仓库：[github.com/shopmeskills/mcp](https://github.com/shopmeskills/mcp)（含 `packages/cn-ecommerce-search-mcp` 与 logistics 包）
- 联系（MCP 页公开）：`eric.bai@shopmeagent.com`（Hermes／Custom agents 与故障排查）
- 采编／探针：2026-10-24（Asia/Shanghai）。托管连接与服务说明可核验；**中文关键词 live 搜品未成功**（unavailable + npm 未发布）。徽章按「公开材料可点开核对」计；搜品结果勿写成 Lab 实测成功。

## 据公开帖摘要

Shopme 在 [shopmeagent.com/mcp](https://shopmeagent.com/mcp) 提供面向 Agent 的购物 MCP：可 Guest 起步或连接 Shopme 账号；Server URL 为 `https://mcp-test.shopmeagent.com/mcp`；OAuth 使用公开 client `shopme-chatgpt-pilot`（无 secret，PKCE）。页上写明助手可检索信息，**不能**代买、支付或改账号；结果须到 Shopme 商品页核对。

开源仓库 [shopmeskills/mcp](https://github.com/shopmeskills/mcp) README 描述两套能力：（1）物流轨迹 MCP（17track，3100+ carriers 说法来自 README）；（2）CN E-commerce Search — 淘宝／天猫／小红书，配置示例 `npx -y @shopmeagent/cn-ecommerce-search-mcp`，宣称 zero-config、无 API key。工具表列出 `search_products`、`get_product_detail`、`parse_product_link`。

本站探针与公开页一致的部分：工具名、只读定位、Guest／OAuth 双路径。不一致／阻塞：npm 搜品包未发布；匿名 Guest 搜品能力关闭时返回 `unavailable`。数字（如日额度次数）以当次 `get_connection_info` 为准，本页不编造固定「3 次调用／2 次搜索」除非工具当场返回该字段。

## English brief

Shopme exposes a hosted MCP for China-marketplace product discovery (Taobao / XHS called out on public materials) plus an open-source search package in GitHub. Lab checks on 2026-10-24 verified connect + service info, but anonymous search was unavailable and the npm search package was missing — treat live sourcing results as blocked until capabilities or publish status change.
