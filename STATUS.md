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

- 卡片与用例详情都进 `/want/{slug}/`：邮箱必填，备注可选，页上展示用例标题和规范 URL
- 表单直接 POST 到 FormSubmit（不用访客的邮件客户端），`_next` 回到 `/want/{slug}/thanks/`
- 收件：`xunxing1989@gmail.com`。首次需在该邮箱点 FormSubmit 的 Activate Form；激活前的提交按 FormSubmit 说明暂存约 30 天
- 不进 Mailchimp：mxteam 只有 Email / First / Last / Birthday，放不下链接和备注，也会把「想要这条」记成周报订阅

## 订阅（Mailchimp）

- Audience：mxteam（`u=c3b0164459768548b7bef380c` / `id=1103acd526`）
- Tag：CrossAgent Lab（`tags=4555940`）
- 表单：`/newsletter/#subscribe` 完整表单；首页 compact 表单
- 未新建 Audience（免费版限额）；未升级付费

## UI（对齐 agentusecases.ai）

- Brand → Agents chips → meta 行（条数 · Updated · Sources · RSS · 赞助 · 隐私 · 导航）
- Feed：`N 条较新用例` + `Wed, Oct 7 · 以下精选`
- 卡片：avatar · 标题 · 摘要 · Agent New · 来源 · Mon YYYY · 查看 Prompt / 分享 / 我想要这个 → `/want/{slug}/`
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
