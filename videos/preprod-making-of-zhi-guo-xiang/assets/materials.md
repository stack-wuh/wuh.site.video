# 《致郭襄》创作历程片 · 素材库（materials.md）

> 单元：`preprod-making-of-zhi-guo-xiang` · 全条目标来源 · 2026-11-07 建库
> 受众：朋友/熟人圈 · 结构：版本演化对比（骨架）+ 关键转折故事 + 幕后工作流穿插 + 情感互文收尾
> 口径：《风陵 · 致郭襄》成片自 2026-11-01 首渲至 2026-11-07 交付（v12），历经 11 个版本状态演进（用户口径「11 版」）；本文档为唯一版本映射真源。

---

## 1 · 版本映射表（2026-11-07 用户核对定稿）

| 序 | 版本 | 日期 | 画面母带 | 帧数/时长 | 关键内容 | 呈现方式 |
|---|---|---|---|---|---|---|
| 01–07 | v1–v7 | 11-01 前 | **无画面存档** | — | script v1（record-script-v1）→ v2–v6 剧本迭代、storyboard-v6、audit-v7、52 镜前期五件套 | 文档快照卡 + 旁白叙述 |
| 08 | v8 | 11-01 | `2026110101-zhi-guo-xiang.mp4`（299M） | 7500f / 250s | 52 镜首渲（CI run 41270162934 全绿，bundle 41s → 矩阵 → assemble 4m17s） | 画面 |
| 09 | 中间版 A（未编号） | 11-02 | `20261102000434-zhi-guo-xiang.mp4`（286M） | 7100f / 236.7s | 删 400f 的中间态（高码率 ~10M，疑本地渲） | 画面 |
| 10 | 中间版 B（未编号） | 11-02 | `20261102145146-zhi-guo-xiang.mp4`（280M） | 7100f / 236.7s | 同帧数另一中间态 | 画面 |
| 11 | v9 | 11-03 | `20261103010105-zhi-guo-xiang.mp4`（194M） | 7350f / 245s | 245s 口径定版、真声定策（11-04 对账） | 画面 |
| 12 | v10 | 11-06 | `20261107041725-zhi-guo-xiang.mp4`（195M） | 7350f / 245s | 38 镜 + 镜内转场（12 处非硬切）+ 配音 v6/mix v6 | 画面 |
| 13 | v11 | 11-07 | `20261107044211-zhi-guo-xiang.mp4`（220M） | 9060f / 302s | 41 镜 / 4:52、旁白 v7（25 条人声）、字幕查表调用 | 画面 |
| 14 | v12（交付） | 11-07 | **CI artifact `20261107082556-zhi-guo-xiang`**（run 42354695452，233.6MB） | 9060f / 302s | 40 镜（删金针手镜）、原著校正、行级字幕、旁白按镜重铺（漂移 −16.17s → 中位 1.51s） | 画面 |

注：
- `2026110101` 的多份拷贝（` 2`/` 3`/` 4`，299M–331M）与 `zhi-guo-xiang-final.zip`（18M，镜级段包）为同一渲染的副本，只取主文件。
- 早期 v1–v7 只有文档线（用户确认）；若后续想起其他存档再补。
- v12 本地交付件 `out/final/fengling-zhi-guo-xiang-v12.mp4`（242MB）已不在原位，以 CI artifact 为准（2027-02-05 前取回）。

## 2 · 成片母带清单（一律不入 git）

来源：`~/Desktop/remotion/`（本机桌面）。母带与 zip 全部不进仓（成片不入库纪律）；历程片只取**压缩后的片段**入 `public/making-of-zhi-guo-xiang/segments/`。

| # | 文件 | 探针实测 | 用途 |
|---|---|---|---|
| M1 | 2026110101-zhi-guo-xiang.mp4 | 7500f / 250s / 1080p30 / 613kbps | v8 代表段、同镜位对比基线 |
| M2 | 20261102000434-zhi-guo-xiang.mp4 | 7100f / 236.7s / 10.1Mbps | 演化快剪（若内容与 B 重复则降级备用） |
| M3 | 20261102145146-zhi-guo-xiang.mp4 | 7100f / 236.7s / 9.9Mbps | 同上 |
| M4 | 20261103010105-zhi-guo-xiang.mp4 | 7350f / 245s / 6.7Mbps | v9 代表段 |
| M5 | 20261107041725-zhi-guo-xiang.mp4 | 7350f / 245s / 6.7Mbps | v10 代表段（转场对比） |
| M6 | 20261107044211-zhi-guo-xiang.mp4 | 9060f / 302s / 6.1Mbps | v11 代表段（41 镜时代） |
| M7 | zhi-guo-xiang-animatic.mp4（本机）/ `out/zhi-guo-xiang-animatic-aiyi.mp4`（仓内 out/） | 7500f / 250s / 179kbps | 前期 animatic（单色简板）——「先简后精」叙事素材 |
| M8 | CI artifact `20261107082556-zhi-guo-xiang`（run 42354695452，233.6MB） | 9060f / 302s | v12 交付画面（**已下载** 2026-11-07 → `~/Desktop/remotion/v12-final/`，ffprobe 9060f 对账 ✓） |

镜级产物（run 42354695452 附带 `shot-s01`–`shot-s40`，共 40 个）：同镜位跨版本对比的高精度素材源，且带镜号，免抽帧定位。

## 3 · 录音素材（真人声）

| # | 文件 | 来源 | 日期 | 用途 |
|---|---|---|---|---|
| A1 | `~/Desktop/remotion/配音/自己的声音-full.mp3`（2.3M） | 用户真声全片旁白 | 11-07 10:02 | 幕后花絮（录音过程感）、历程片旁白备选 |
| A2 | `~/Desktop/remotion/开头.m4a`（457K） | 用户真声 | 11-07 09:50 | v11→v12 真声段素材，花絮 |
| A3 | `~/Desktop/remotion/结尾.m4a`（414K） | 用户真声 | 11-07 10:10 | 同上 |
| A4 | 正片 TTS 旁白 v6（22 段）/ 真声段 m01–m07、m54–m62 | edge-tts + 真声 | 11-06/07 | 「AI 声 → 真人声」演化叙事素材 |

纪律：真声/录音入库走 `public/<slug>/tts/` 例外（无版权问题）；真人**照片不入库**。

## 4 · BGM 决策（2026-11-07 用户拍板）

- **复用正片版权床**：陈致逸《爱意（金风玉露变奏）》（139.46s，版权曲，**不入库**，工作副本只在 `out/`；正片床 `bgm-bed-v8.wav` 302s 由 `videos/zhi-guo-xiang/assets/music/bgm-plan-v8.md` 记录）。
- 历程片如另剪床段，需按正片同判据重算避让；mux 本地两遍/单遍 amix 纪律同正片，成片不入库。
- 结尾情感互文段直接沿用正片床尾段——与《风陵 · 致郭襄》声学同源。

## 5 · 文档快照（v1–v7 证据线，全部在 git）

| 类别 | 文件 | 演化看点 |
|---|---|---|
| 剧本线 | `videos/zhi-guo-xiang/assets/record-script-v1.md` → `script-v2…v6`、`v8`、`v9`、`v10`（真源） | v10 原著校正定稿；v7 剧本档缺号（audit-v7 补位） |
| 分镜线 | `preprod-zhi-guo-xiang/assets/storyboard-v12.md`（现真源）、`zhi-guo-xiang/assets/storyboard-v6/v8/v9.md` | 52 镜 → 38 镜 → 41 镜 → 40 镜 |
| 人物 | `preprod-zhi-guo-xiang/assets/character-design.md` | 五段年龄、杨过不露脸、正片零红 |
| 美术 | `videos/zhi-guo-xiang/assets/art-direction.md` | 水墨底图、生图纪律 |
| 配音线 | `vo-script-v2…v7`、`vo-read-v8`、`vo-review-*`、`vo-decision-matrix.md` | TTS → 真声的决策全程 |
| 审计 | `audit-v7.md` | v7 时代画面缺陷清单（五处画面缺陷修复对照） |
| 交付 | `RELEASE-v12.md` | 六个关键决定（原著校正/删金针镜/旁白按镜铺/行级字幕/推拉修复/收剑去动画） |
| 评审 | `shadow-docs/changes/20261101-feature-zhi-guo-xiang-production/design-v10.md` | 四席评审、初稿 10 条事实错误留痕 |

## 6 · CI 渲染记录（关键 run）

| run | 时间（UTC） | 内容 | 备注 |
|---|---|---|---|
| 41260324683 | 11-01 | animatic 7500f 出片 | 前期里程碑 |
| 41270162934 | 11-01 | 52 镜矩阵全绿 + assemble（bundle 41s → 矩阵 → assemble 4m17s） | 首次成片（v8） |
| 41285587793 | 11-01 | s06/s21 水墨底图样片子集 | 改一镜看一帧的流程实证 |
| 42258912553 | 11-06 | cancelled | v10 期间重试链 |
| 42335808244 / 42337056416 / 42338822779 | 11-07 | v12 中间态渲染 | 41 镜时代 |
| 42342065194 / 42342927194 | 11-07 | cancelled | 重试链 |
| 42344361099 | 11-07 | success | 删金针镜后首渲 |
| **42354695452** | 11-07 | **success（v12 交付）** | artifact `20261107082556-zhi-guo-xiang` + shot-s01…s40 |

另：v10 时代 CI 矩阵抖动（apt 锁争用 → job 超时 cancelled）与三级兜底（rerun → 子集 run → 逐镜 artifact 本地 concat）是幕后工作流章节素材。

## 7 · 素材片段规划（segments，供 prep-making-of.mjs 消费）

> 片段一律**无声**（声轨在装配层做）；统一 1080p30 H.264；`-vN` 版本号纪律；单段 ≤50MB。
> 段表真源 = `segments.json`（`node scripts/prep-making-of.mjs` 产段，`--check` 对账）。已产段：`seg-evolution-v8-open-v1`、`seg-animatic-open-v1`（各 240f / 8s / 192–223KB，check 全绿）。其余候选段在剧本/分镜定稿后回填段表。

| 候选段 | 内容 | 来源 | 预估 |
|---|---|---|---|
| seg-evolution-reel | 每版开场 8–10s 快剪，11 状态推进（v1–v7 用文档卡代画面） | M1–M8 + 文档快照 | 90–110s |
| seg-s21-before/after | S21 求揭面：v10 前后同镜位对比（救人 → 递针求揭面的重写） | M4/M5/M6/M8 镜级 | 15–20s |
| seg-s11-needle | v11 仍在、v12 被删的金针手镜（删镜决策可视化） | M6 vs M8 | 10–15s |
| seg-voice-journey | TTS 旁白一句 → 真声同句对比 | A4（正片已有）/ A1–A3 | 12–18s |
| seg-drift-fix | 旁白漂移 −16.17s 的「事故现场」（按幕铺 vs 按镜铺波形示意） | 正片 v10 vs v12 + cues 数据 | 15–20s |
| seg-ci-matrix | CI 矩阵并发渲染屏录/日志卡（52 job 并发 → 抖动 → 兜底） | gh run 页面录屏（待录）或日志卡代码渲染 | 10–15s |
| seg-animatic-vs-final | 同镜位 animatic 简板 vs v12 成品 | M7 vs M8 | 12–15s |

## 8 · 待办与风险

- [x] M8 从 CI 下载（`gh run download 42354695452`）到 `~/Desktop/remotion/v12-final/`，ffprobe 9060f 对账 ✓
- [x] 预处理脚本落地并 runtime 实证（`scripts/prep-making-of.mjs`：干跑/实跑/check/--only 四路径全过，oxlint 0 告警）
- [ ] 两份 7100f（M2/M3）内容差异抽帧确认，决定是否都用
- [ ] 正式段表回填（依赖剧本/分镜定稿）
- [ ] CI 矩阵屏录素材（或降级为日志卡代码渲染）
