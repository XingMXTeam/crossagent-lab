# CrossAgent Lab

别人正在用的跨境 Agent 做法。偷一个灵感。
Real things sellers do with AI agents. Steal an idea.

- **生产域名**：https://crossagent.maoxunxing.com（maoxunxing.com 子域；暂不买独立域名）
- **技术**：Astro 4 静态站，`base: '/'`，产物 `dist/`
- **内容**：`src/content/cases/*.md`
- **托管**：Cloudflare Pages 项目 `crossagent-lab`

## 本地开发

```bash
npm install
npm run dev          # http://localhost:4321/
npm run build        # → dist/
npm run preview
```

## 部署（GitHub Actions）

Push 到 `main`（或手动 `workflow_dispatch`）触发 `.github/workflows/deploy.yml`：

1. Node 20 · `npm ci` · `npm run build`
2. `npx wrangler pages deploy dist --project-name=crossagent-lab --branch=main`

仓库 Secrets（须由 TT 配置）：

| Secret | 用途 |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Wrangler Pages deploy |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account |

周更骨架：`.github/workflows/weekly-update.yml`（周一 09:00 CST / `0 1 * * 1` UTC）只做 build 绿灯校验；「搜素材写 MD」由幕僚长例程外完成，不在此 workflow 内。

**手动回退**：`scripts/pages-direct-upload.mjs`（Direct Upload）仍可用。

## 挂到 maoxunxing.com（子域）

已定：**子域** `crossagent.maoxunxing.com` → 本站 `dist/`（根路径 `/`）。

1. Cloudflare DNS：`crossagent` → Pages / 回源
2. 部署 `npm run build` 的 `dist/` 到 Cloudflare Pages
3. 绑定自定义域 `crossagent.maoxunxing.com`
4. **自定义 404**：产物含 `404.html`；Pages 默认可用；Worker 反代需把未知路径回退到 `/404.html`

未采用：主站子路径 `/crossagent-lab/`（若改用需把 `astro.config.mjs` 的 `base` 改为 `'/crossagent-lab/'`）。

## 激活事件

Cloudflare Web Analytics 只有页面浏览，不能发自定义事件（官方 FAQ：Not yet）。两个激活事件走本站 `POST /api/activation`，写入 Workers Analytics Engine，不经过广告脚本：

| 事件 | 何时 |
|---|---|
| `case_detail_open` | 打开 `/cases/<slug>/` |
| `prompt_copy` | 详情页「复制 Prompt」：剪贴板成功为 `via=clipboard`，失败后选中文本为 `via=select` |

属性只有公开 slug、页面语言（`zh-CN`）、`via`。没有邮箱、没有 Prompt 正文。

部署后要在仪表盘里看到数，须先按 `wrangler.toml` 注释绑上 Analytics Engine（变量名 `ACTIVATION`，数据集 `crossagent_activation`）并再部署一次。然后：

1. `GET /api/activation` 应返回 `{ "ok": true, "configured": true }`。`configured: false` 表示绑定还没生效，此时 POST 为 503，不会有计数。
2. 打开一条用例，再点「复制 Prompt」。
3. 用 Account Analytics Read 令牌查询（不要把令牌写进仓库）：

```bash
curl "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/analytics_engine/sql" \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --data "SELECT blob1 AS event, blob2 AS slug, blob3 AS locale, blob4 AS via, SUM(_sample_interval * double1) AS events FROM crossagent_activation WHERE timestamp > NOW() - INTERVAL '14' DAY GROUP BY event, slug, locale, via ORDER BY events DESC"
```

同一条用例详情在 Cloudflare Web Analytics 里仍是页面路径 `/cases/<slug>/`，那是浏览量，不是命名事件。本仓库不记录、也不编造访问数字。

## 新增用例

在 `src/content/cases/` 加 Markdown；`category` 枚举见 `src/content/config.ts`。

## 联系

毛训星 / Momo · me@maoxunxing.com
