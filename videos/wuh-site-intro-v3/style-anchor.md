# v3 风格锚点 V2 —— 品牌暖黑科技 · 年度报告数据流（2026-11-11 用户定稿）

> 状态：定稿门通过（样片 s02/s33/s45，run 42854673264）。本文件是 Phase 3 全量重实装的风格宪法；实现基元查技能 `remotion-capabilities.md`，镜级契约查 `shot-spec.md`。

## 0. 家族边界（硬豁免，不许动）

- **s01（Intro）/ s60–s62（Out）内容保持家族式设计**——Intro/Out 是全系列片的家族签名，不参与本片风格重构。
- 但它们的**边界转场**走 V2 口径（遮罩属转场层非镜内容，见 §4）。
- 转场遮罩的水墨家族原件仍在 zhi-guo-xiang 等单元自己的 ShotShell 里；v3 的 ShotShell 已换 V2。

## 1. 色板（唯一合法色源 = FILM_COLORS2，禁内联色值、禁蓝青族）

| 令牌 | 值 | 用途 |
|---|---|---|
| `space` | `#0f0e0c` | 暖黑底（brand bg 同源） |
| `spaceDeep` | `#0a0908` | 更深底 / 转场收口实色 |
| `data` | `#d4a373` | 数据主色：大数字/图表/时间线（brand accent 同源） |
| `dataDim` | `#8a6b47` | 数据次级 |
| `gold` | `#E9D9AE` | 落定/SLAM 高光（brand gold 同源） |
| `paperWhite` | `#f5f0e8` | 主文字（brand paper 同源） |
| `textMuted` | `#8a8272` | 次级文字 |
| `sealRed` | `#7A1F16` | 钤印朱红：手作签名/强调（brand seal 同源） |

辉光统一 `glowText(color, intensity)` / `rgba(212,163,115,…)`；调色 `Grade2 id="GR2-0X"`（原 GR-0X 同幕号映射）。

## 2. 三种镜型配方（视觉语法反转：数据/内容当主角，网站截图降级证据）

- **数据镜**（凡量必滚）：`bigNum` 全屏大数字滚动落定（SLAM+辉光）/ `chartBar` 数据行同窗生长 / `timelineFlow` 时间线流动；示例 s45。
- **叙事镜**（旧屋/第一行/重启等）：内容主角化——金句/关键句大字号 kinetic（writeFade + glowText，serif 大字）；网站截图降级证据快闪；暖黑底 + DeepSpace 星点。示例：s45 题名区写法。
- **过程镜**（代码/提交/部署）：终端 HUD 化——等宽字号数据行、`HudChrome` 读数、线框窗口（border + 辉光），不再仿真浏览器 chrome。

## 3. 证据快闪（PROOF-FLASH）口径

网站截图（`staticFile('wuh-site-intro-v3/site/…')`）一律降级：辉光小窗（琥珀 1px 边 + 外辉光 + 深色投影）出现 **≤2s 即退场**（60f 内），或干脆不用。**禁止整屏铺底当主角**（v1 的原罪）。示例：s33 右下播放器小窗 / s45 开场文章页。

## 4. 转场 = 光晕呼吸（BloomMask，ShotShell 全局）

- 出镜：缓亮（brightness 1→1.08）+ 琥珀辉光自中心呼吸晕开 → 末 28% 收进近黑；入镜：从近黑显影、辉光收敛落定。两侧接缝帧同为整屏 `spaceDeep` 实色。
- 单侧帧数沿用 `TRANSITION_SIDE`（ink 20/page 18/dry 10/cut 0）——**manifest 与字幕安全窗零改动**。
- 镜文件零工作：转场由 ShotShell 自动生效，`cut` 仍为逐像素零 DOM。

## 5. 手作签名点（克制保留）

印章（朱红框 + serif 字 + 微辉光）/ 墨点元素：每镜**至多一处**，有则留无则不强加；全片首尾必有着落（s01 家族 Intro 本身即签名，尾段 s62 家族收黑）。

## 6. 底与组件

- 底：`<DeepSpace seed="sNNv2" stars={…} grid [horizon]>`（星点粒子场 + 微网格 + 数据流星 + 扫描线 + 暗角；全 noise/seed 确定性）。
- HUD：`<HudChrome label="…" readout="…"/>` 每镜一枚（zIndex 25，字幕之下）。
- 删除：PaperGrain / DustField / 旧 Grade / ConsolePanel / ExpandWindow 引用。
- 保留：CameraRig（镜头运动守恒）、Caption / SeqCaption（字幕样式不动，暖纸白在暖黑上成立）。

## 7. 确定性与时间轴铁律

- `random(seed)` only；禁 `Date.now`/`Math.random`/渲染期网络请求。
- **时间轴零改动**：TOTAL、interpolate 窗口帧号、对音锚点（拍N）、Caption appearAt、尾帧交接态语义——重写只动视觉层。

## 8. BGM（Phase 4）

科技 CC-BY 电子/氛围曲目替换 v2 纸墨曲族；多轨交叉淡化对拍 90 BPM 口径与避让结构不变；署名清单随片交付。
