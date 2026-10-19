# CrossAgent Lab — 用例写作薄模板

**Purpose one-liner：** 写「别人怎么用 Agent 做跨境实活」的可核验条目，不是工具导航；公开出处可追溯，人审闸门写死，本站未跑过就明说。

**EN note：** Cases show real agent/MCP workflows for cross-border sellers — cite public sources, never invent metrics or Lab live tests.

---

## Frontmatter 必填清单（勿改 schema）

对应 `src/content/config.ts`，缺一不可（可选字段按需）：

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | ✓ | 中文标题，说清动作／场景 |
| `titleEn` | 可选 | 英文标题 |
| `summary` | ✓ | 1–2 句：谁用什么做什么；数字须有出处 |
| `summaryEn` | 可选 | 英文摘要 |
| `category` | ✓ | `sourcing` / `listing` / `customer-service` / `ads` / `ops-finance` / `logistics` |
| `agents` | ✓ | 字符串数组，如 `["Cursor", "Claude"]` |
| `tools` | ✓（可 `[]`） | 工具／端点／token 名 |
| `source` | ✓ | 枚举：编辑撰写／示例/编辑合成／公开分享／博客／Reddit／X／Hacker News／GitHub／n8n／官网／掘金／知乎 |
| `sourceUrl` | 可选 | 原文 URL（有则务必填） |
| `sourceType` | 可选 | `public` \| `editorial` \| `synthetic` |
| `date` | ✓ | 来源日期（公开帖发布日优先） |
| `dateNote` | 可选 | 采编日、校正说明 |
| `featured` | 默认 false | 首页精选 |
| `prompt` | ✓ | 可复制 Prompt（HITL／禁造数写进规则） |

**不要**为模板新增 Astro 字段；核验徽章写在正文 H2，靠 markdown 渲染即可。

---

## 正文 H2 固定顺序（必须按此顺序）

1. `## 解决什么问题` — 卖家／运营卡在哪一步；本用例省哪类操作（事实级，不编 ROI%）
2. `## 人审闸门（必须人工确认）` — 花钱、出单、改价、发信、删改店铺前必须人点头的清单
3. `## 可复现步骤` — 公开材料可跟做；写清账号、token、MCP URL、客户端配置等前置；步骤编号
4. `## 预期结果与失败限制` — 跟做后大概看到什么；缺 scope／无账号／工具未返回时会怎样；明确「勿把营销上限抄进客户报价」类边界
5. `## 来源与核验状态` — **只选一个主徽章**（行首加粗即可）：
   - **公开可核验** — 官方页／博客／文档／公开仓库可点开核对
   - **官方模板** — 厂商提供的官方 workflow／模板
   - **教程复现** — 第三方教程步骤，本站按文跟做或仅转述
   - **本站未实测** — 仅采编公开材料，Lab 未跑 live
   - **编辑合成** — 编辑据公开能力合成的示意流程（须与 `sourceType: synthetic` 一致）
   
   徽章下一行写：主链接、采编日、与站内相关用例的区分（若有）。可在段落中补充「本站未实测」等说明，但主徽章只留一个。
6. `## 据公开帖摘要` — 只写出处里有的事实；数字、日期、URL 可点；禁止脑补覆盖面／转化率

**可选（放在以上六节之后）：**

7. `## English brief` — 短英文摘要，方便 EN 读者扫一眼（非必填）

页脚已有「读原文」与 Prompt 盒；正文不必重复整段 prompt。

---

## 写作规则

1. **不发明数字** — 承运商数、国数、tools 数、折扣%、价格均须带来源句或链；没有就写「来源未写明」。
2. **不宣称本站实测** — 除非当真在 Lab 跑过并留下可复核记录；默认用「据公开…」「本站未实测」。
3. **Amazon／渠道覆盖** — 仅当出处明确写了 Amazon／某 marketplace 才写；Easyship 类物流 MCP 勿默认写成「已接 Amazon」。
4. **人审优先** — Prompt 与「人审闸门」节一致：出单、取件、扣 credits、对外发送须确认。
5. **凭证安全** — Token／密钥只写「放环境变量／客户端配置」，禁止示例里贴真实 secret。
6. **与站内用例区分** — 若有相近篇（轨迹聚合 vs 履约 MCP、税则插件 vs landed-cost），用一两句说清差异，避免读者以为重复。
7. **语言** — 正文中文为主；专有名词、工具名、API 保留英文原文。

---

## 最小检查清单（发 PR 前）

- [ ] Frontmatter 全过 schema；`sourceUrl` 可打开
- [ ] 六个 H2 齐全且顺序正确；主核验徽章只一个
- [ ] 正文数字均可回溯到摘要节或外链
- [ ] Prompt 含 HITL／禁造数规则
- [ ] 未改 `config.ts`／`[slug].astro`（除非另有明确需求）
