# FreightUtils 探针演示（短静音 GIF）

**As of:** 2026-10-26 Asia/Shanghai  
**Asset:** `freightutils-probe-demo.gif`（960×540，循环，无配音）  
**Size:** ~76 KB（远低于 ~3 MB 上限）  
**Stills（可选 QA／社媒）：** `still-01-endpoint.png` … `still-04-hs.png`  
**Probe log:** `probe-facts-2026-10-26.json`

## 演示内容（4 步）

1. **Endpoint** — `https://www.freightutils.com/api/mcp`；anonymous · no API key  
2. **Health + initialize** — HTTP 200；`status=ok`；`mcp_version=2.22.5`；`tools_registered=25`  
3. **tools/list** — HTTP 200；`tools.length=25`  
4. **hs_code_lookup("cotton t-shirt")** — HTTP 200；HS **610910**；confidence medium · `FUZZY_BEST_MATCH`

数字均来自本日匿名 live 调用（见 `probe-facts-2026-10-26.json`），非手填营销示例。

## 如何生成（可复现）

1. 匿名 `curl`：`GET …/health`；`POST …/api/mcp` `initialize`／`tools/list`／`tools/call`（Accept: `application/json, text/event-stream`；响应为 SSE `event: message`）。  
2. Python **Pillow** 按 JSON 关键字段画 4 张步骤卡（深色底、等宽字体）。  
3. **ffmpeg** 合成调色板 GIF：`fps=12`，`palettegen`/`paletteuse`，loop 0。  

未用 asciinema／伪终端录屏（SSE 单行 JSON 可读性差）；步骤卡保证关键行可读。若要「真终端」版，可用 `script`/`asciinema` 重录后仍建议叠一层大号结果字幕。

## 建议嵌入位置

用例页 **「Lab 探针成品（先看结果）」** 内：放在关键结果表**之上或之下**、对照表「公开声称 vs 本站探针」**之前**。

建站拷入仓库后建议路径：

```text
public/demos/freightutils-probe-demo.gif
```

Markdown（Astro content）示例：

```markdown
![FreightUtils anonymous Lab probe — health, tools/list, HS 610910](/demos/freightutils-probe-demo.gif)

*15–30s 静音循环 · 本站 2026-10-26 Asia/Shanghai 匿名探针关键返回 · 非厂商广告片*
```

`alt`／题注勿写「官方演示」；标明 **Lab**／**匿名探针**。

## 验收

- [ ] GIF 可循环播放；第 2／4 步关键数字肉眼可读（200、2.22.5、25、610910）  
- [ ] 文件 &lt; 3 MB（当前 ~76 KB）  
- [ ] 题注含探活日与「Lab／匿名」字样  
- [ ] 不与 Skillry 改版 PR 抢同一文件冲突时：本 GIF 为新增 `public/demos/` 文件即可  
