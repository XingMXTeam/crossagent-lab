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

## 新增用例

在 `src/content/cases/` 加 Markdown；`category` 枚举见 `src/content/config.ts`。

## 联系

毛训星 / Momo · me@maoxunxing.com
