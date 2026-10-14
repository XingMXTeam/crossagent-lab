# CrossAgent Lab — STATUS

更新：2026-10-14（GitHub + Actions 迁入准备）

## 挂载与域名

| 项 | 值 |
|---|---|
| 正式 URL | https://crossagent.maoxunxing.com |
| Pages 项目 | crossagent-lab |
| 最近部署 | `5ab8647a-5222-4d04-8330-2b59edb359fc` (production, Mailchimp mxteam+tag) |
| 前一部署 | `0c500a3c-dc2e-4eac-8f2a-309205a7974e` (production, align agentusecases.ai IA) |
| Astro base | `/` |
| 构建 | 37 pages + rss.xml（25 用例） |

## 我想要这个

- 卡片与用例详情上的按钮是喜欢计数，不是线索表单：无登录、不收集邮箱
- `GET /api/votes` 返回 `{ "<slug>": <count> }`；`POST /api/votes` 正文 `{ id, on }`，响应 `{ id, on, count }`
- Pages Function：`functions/api/votes.ts`，KV 绑定名 **`VOTES`**，计数存在键 `counts`
- 同一浏览器用 `localStorage` 键 `crossagent-votes` 避免重复切换；POST 还要求同源
- `/want/*` 旧 FormSubmit 页还在，但卡片和详情不再链过去。合并前须在 Pages 项目绑上 `VOTES`，否则接口 503
- 不进 Mailchimp

## 订阅（Mailchimp）

- Audience：mxteam（`u=c3b0164459768548b7bef380c` / `id=1103acd526`）
- Tag：CrossAgent Lab（`tags=4555940`）
- 表单：`/newsletter/#subscribe` 完整表单；首页 compact 表单
- 未新建 Audience（免费版限额）；未升级付费

## UI（对齐 agentusecases.ai）

- Brand → Agents chips → meta 行（条数 · Updated · Sources · RSS · 赞助 · 隐私 · 导航）
- Feed：`N 条较新用例` + `Wed, Oct 7 · 以下精选`
- 卡片：avatar · 标题 · 摘要 · Agent New · 来源 · Mon YYYY · 查看 Prompt / 分享 / 我想要这个（喜欢计数）
- `/rss.xml` · About `#privacy` · SponsorBar → `/sponsor/`
- Stripe Payment Link 未改

## 构建 / 部署（GitHub Actions 主路径）

- **仓**：XingMXTeam/crossagent-lab（push `main` → build + deploy）
- **Workflow**：`.github/workflows/deploy.yml` — `npm ci` → `npm run build` → `npx wrangler pages deploy dist --project-name=crossagent-lab --branch=main`
- **Secrets（仓库）**：`CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`
- **周更骨架**：`.github/workflows/weekly-update.yml` — 周一 09:00 CST（cron `0 1 * * 1` UTC）仅 build 校验；内容 MD 由幕僚长例程外写，本 workflow 不 deploy
- **手动回退**：`scripts/pages-direct-upload.mjs`（Direct Upload）仍保留

```bash
cd /workspace/crossagent-lab && npm run build
# 正式：push main → Actions deploy
# 回退：upload-token → pages-direct-upload.mjs → create deployment (branch=main)
```
