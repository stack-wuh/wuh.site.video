# 《致郭襄》创作历程片 · 动效规范 v1（轻量令牌 + 全镜覆盖矩阵）

> 2026-11-07 · 初稿。令牌前缀 `MO-`（making-of 私有），通用基元复用 `brand/motion` 与 film-kit；组件零内联色值，一切颜色/字体引 `brand/tokens`。
> 转场占用镜内遮罩（ShotShell 同构）：`ink` 墨洇单侧 20f / `dry` 飞白 10f / `cut` 0f，不动 `durationFrames`/`startFrame`。

## 一 · 令牌表

### 曲线与节拍

| 令牌 | 值 | 用途 |
|---|---|---|
| MO-EASE-INOUT | cubic-bezier(0.65, 0, 0.35, 1) | 卡片推近、镜头缓动 |
| MO-EASE-OUT | cubic-bezier(0.22, 1, 0.36, 1) | 元素入场 |
| MO-EASE-BACK | cubic-bezier(0.34, 1.56, 0.64, 1) | 计数角标弹跳、卡片落塔 |
| MO-BEAT-FLASH | 25f | 快闪节拍（s02 每版一拍） |
| MO-BEAT-TRIPLE | 40f | 三连闪节拍（s03） |
| MO-BREATHE | 30–90f | 留白镜呼吸窗 |

### 版本计数角标（本片视觉签名）

| 令牌 | 值 |
|---|---|
| MO-COUNTER-POS | 右下角（s02）/ 居中放大（s30） |
| MO-COUNTER-DIGIT-POP | 数字切换：缩 0.92→1.0，MO-EASE-BACK，8f |
| MO-COUNTER-TICK | 每次翻动配咔哒音效点（音效在装配层） |
| MO-COUNTER-FINAL | 「11」定格放大 1.0→1.15 缓推，120f |

### 对比语言（演化骨架专用）

| 令牌 | 值 |
|---|---|
| MO-CUT-FLIP | 同帧位对切：2 帧内完成，间隔 15f（s09/s21） |
| MO-CMP-LABEL | 对比角标：左上角小字「v8 / v12」等，淡入 6f |
| MO-SPEED-08 | 0.8× 变速直放（s10） |

### 数据卡语言（文档快照 / CI 卡 / 波形卡）

| 令牌 | 值 |
|---|---|
| MO-CARD-RISE | 卡片自下 12f 淡入上浮，MO-EASE-OUT |
| MO-CARD-STACK | 堆塔：每张 4f 间隔落下 + 2f 微弹 |
| MO-TYPE-WRITER | 打字机：2f/字，光标闪烁 8f 周期 |
| MO-X-STAMP | 红叉缩放砸落（SEAL 同构，×4 连击，间隔 12f）——生图翻车卡专用 |
| MO-GRID-LIGHT | CI 方块：波次点亮，每波 6f，绿变 4f |
| MO-WAVE-DRIFT | 波形错位：正弦漂移，峰值标注 −16.17s |
| MO-WAVE-SNAP | 波形吸附：每句 4f 吸附归位 |

### 字幕系统

| 令牌 | 值 |
|---|---|
| MO-CAP-IN | 淡入 4f，下移 6px 入 |
| MO-CAP-OUT | 淡出 4f |
| MO-CAP-WINDOW | 安全窗 = 镜首遮罩后 12f / 镜尾遮罩前 12f（同正片 v12 纪律） |
| MO-CAP-MAX | 一镜一句（旁白句一一对应镜）；纯留白镜无字幕 |

### 调色

| 令牌 | 值 |
|---|---|
| MO-GRADE-PAPER | 纸面底色（引 brand/tokens 纸色） |
| MO-GRADE-INK | 墨色（引 brand/tokens 墨色） |
| MO-GRADE-SEAL | 朱印红（引 brand/tokens 印章色）——仅伪托印/落版印 |
| 纪律 | 素材镜（M1–M8 片段）不调色，保母带原貌（演化对比的真实性优先） |

## 二 · 全镜覆盖矩阵（41 镜 × 入场/持续/出场/转场）

| 镜 | 入场 | 持续 | 出场 | 转场(in) |
|---|---|---|---|---|
| s01 | MO-CARD-RISE | MO-GRADE-PAPER 静置 | 2f 硬收 | cut |
| s02 | MO-COUNTER-POS 淡入 | MO-BEAT-FLASH×6 + MO-COUNTER-DIGIT-POP | MO-COUNTER-TICK 收 | cut |
| s03 | MO-BEAT-TRIPLE | 三连闪 | MO-BREATHE 30f 黑场 | cut |
| s04 | MO-CARD-RISE | MO-EASE-INOUT 缓推 | — | ink |
| s05 | MO-CARD-RISE | 列表滚动定格 | — | cut |
| s06 | MO-CARD-STACK | 横移叠换×3 | — | cut |
| s07 | MO-CARD-STACK×7 | MO-COUNTER-DIGIT-POP×7 | 塔定格 | cut |
| s08 | —（直放） | 原速直放 | 2f 硬收 | dry |
| s09 | MO-CUT-FLIP | 对切×2 | — | cut |
| s10 | MO-CMP-LABEL 淡入 | MO-SPEED-08 直放 | — | ink |
| s11 | MO-GRID-LIGHT 首波 | 波次点亮×N | 汇拢收格 | cut |
| s12 | —（直放） | 原速直放 | — | cut |
| s12b | —（直放） | 原速直放 | — | cut |
| s13 | MO-CARD-RISE | 逐行显影 | — | ink |
| s14 | 诗行逐行浮现 | MO-GRADE-SEAL 印章砸落 | 印章定场 | cut |
| s15 | —（跳切） | 三段跳切 | — | cut |
| s16 | —（直放） | 原速直放 | — | cut |
| s17 | MO-TYPE-WRITER | 逐条打字 | 末条定格 | cut |
| s18 | —（跳切） | 双段跳切 | — | cut |
| s19 | MO-CARD-RISE | MO-EASE-INOUT 缓推 | — | ink |
| s20 | MO-EASE-OUT 急推 | 特写定住 | — | cut |
| s21 | MO-CUT-FLIP | 对切×2 | — | cut |
| s22 | MO-CARD-RISE | 双数字对置 | 中缝划痕 4f | cut |
| s22b | —（直放） | 原速直放 | — | cut |
| s22c | MO-CARD-RISE | MO-TYPE-WRITER + MO-X-STAMP×4 | 末叉定格 | cut |
| s22d | MO-CMP-LABEL 淡入 | 左右分屏对置（左黑底剪影 + 反光点） | 反光点闪烁定格 | cut |
| s23 | MO-CMP-LABEL「TTS」 | 波形条律动 | — | dry |
| s24 | MO-CARD-RISE×3 | MO-WAVE 呼吸 | — | cut |
| s25 | MO-CARD-RISE | MO-WAVE-DRIFT | 峰值标注定格 | cut |
| s26 | MO-CARD-RISE | MO-WAVE-SNAP | 归位定格 | cut |
| s26b | —（直放） | 原速直放 | — | cut |
| s27 | MO-CARD-RISE | 日志滚动 | 红行定格 | dry |
| s28 | MO-CARD-RISE | 步进箭头×3 | 末步定场 | cut |
| s29 | MO-CARD-RISE | 两格点亮 | — | cut |
| s29b | MO-CARD-RISE | 日志流滚动 + MO-EASE-INOUT 缓推 | 淡出 6f | cut |
| s30 | MO-COUNTER-FINAL 起手 | 缓慢放大 | 定格 | ink |
| s31 | —（直放） | 原速直放 | — | cut |
| s32 | —（直放） | 原速直放 | — | cut |
| s33 | —（直放） | 原速直放 | — | cut |
| s34 | MO-EASE-INOUT 缓推 | 原速直放 | — | cut |
| s35 | MO-CARD-RISE | 片名定场 | MO-GRADE-SEAL 印 + BGM 淡出 | ink |

41/41 全覆盖：每镜入场/持续/出场/转场四格均有令牌，无空格。

## 三 · 素材镜纪律

- 直放镜（s08/s10/s12/s12b/s15/s16/s18/s22b/s23/s26b/s31–s34）不加滤镜不加推拉（s34 例外：缓推近），保母带原貌。
- 跳切镜（s15/s18/s21/s09）只在镜内硬切，不做跨镜图层（正片 v10 已证跨镜图层在逐镜渲链路里产 0 像素）。
- 素材段文件名带 `-vN`；换段必升版本号并同步改镜组件 `staticFile` 引用。

## 四 · 验证方式

- animatic 逐镜走查：矩阵每行可指认画面行为
- 帧数对账：storyboard 二节 = manifest 合计 = ffprobe
- 字幕窗口：MO-CAP-WINDOW 自动对账（Caption 组件内断言）
- pnpm check 全绿（oxlint + tsc）
