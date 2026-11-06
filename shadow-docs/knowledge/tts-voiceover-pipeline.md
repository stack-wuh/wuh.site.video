---
title: 配音管线（edge-tts 双声部 · v6 落点对位 · BGM ducking 实测）
domain: video-materials
keywords: [配音, TTS, edge-tts, 云健, 晓晓, 灵心, 旁白, 诗行, 双声部, 男声, 女声, 音色, ducking, sidechaincompress, BGM, 混音, 落点表, 对位, 男声真声, 声音复刻, qwen-tts, voice-track-v6, mix-v6, 可移植路径]
scope: [scripts/voice/, scripts/build-bgm-mix.py, scripts/mux-bgm.mjs, scripts/duck-voice.mjs, public/zhi-guo-xiang/tts/, videos/zhi-guo-xiang/]
status: active
source:
  - changes/20261101-feature-zhi-guo-xiang-production/design-v10.md §四
  - changes/20261101-feature-zhi-guo-xiang-production/brief.md
  - shadow-dev-cli 仓 tools/qwen-tts/（历史：灵心诗行；见其 qwen-tts-voiceover 知识卡）
verified: 2026-11-06
verified-depth: runtime
verified-scope: 本机 macOS 实跑通过 gen_edge.py（edge-tts 7.3.1，25/25 成功）→ build_track.py（voice-track-v6.wav：48kHz/16bit/2ch/245.000s，峰值 −0.36 dBFS，22 段）→ verify.py（22 落点 RMS 全有值、10 个对照区 RMS=−99）→ build-bgm-mix.py（mix-v6.wav：245.000s，峰值 −1.00 dBFS，0 削波，最小余量 5.7 dB）；duck-voice.mjs --mode plan / --mode measure 均可跑（measure 的 mean_volume 已能解析 stderr）
---

# 配音管线（edge-tts 双声部 · v6 落点对位 · BGM ducking 实测）

## 当前结论（v6 口径）

**台词唯一事实源是 `scripts/voice/lines.json`**（`{id, s(绝对秒), v(male|female), t(文本)}`，22 段）。
`vo-script-v5.md` 的表格是设计说明，不是执行源；改台词只改 `lines.json`，再跑
`gen_edge.py → build_track.py → verify.py`。

- **男声（讲述者）= edge-tts 云健** `zh-CN-YunjianNeural` rate −26% / pitch −6Hz（占位）。
  **用户已定最终换本人真声、走直接录音（不做声音复刻）**：44.1kHz/16bit/mono，
  S38（d01）硬上限 5.5s（245.0s 片长截断）；替换后只需换 male 源、落点不动，重跑 `build_track.py`。
- **女声（独白）= edge-tts 晓晓** `zh-CN-XiaoxiaoNeural` rate −28% / pitch −4Hz。
- **诗六行 = qwen 灵心（`longanlingxin`）**，`public/zhi-guo-xiang/tts/line-01..06.wav`，
  **INV-5 锁死、逐字不改**；`build_track.py` 只读不覆盖。诗行仍是 qwen、独白是 edge，
  两个引擎两个人（F0 差约 2%，换人不断层），这是有意的：「独白是回忆，诗是写字」。
- **成品人声轨：`public/zhi-guo-xiang/tts/voice-track-v6.wav`**——48kHz/16bit/2ch，**245.000s**，
  峰值 **−0.36 dBFS**；22 段台词 + 诗六行 = 25 个连续有声区间，**有声 140.16s = 57.2%**，
  最长空档 56.96–74.00（17.0s）。中间产物在 `.tmp/audition/v2e/wav/`（gitignore）。
- **BGM 混音：`.tmp/bgm/mix-v6.wav`**——245.000s / 48k / stereo，峰值 **−1.00 dBFS（0.891）**，
  0 削波；逐段 ducking 后**最小余量 5.7 dB**（唯一低于 6.5 目标的是 a10 句尾自然收弱的 79.07–80.50）。
- **BGM 两遍对位不变**：第一遍 abs 4.00–143.46 ↔ 曲 0–139.46；断点 143.46–151.00；
  第二遍 abs 151.00–245.00 ↔ 曲 **45.45754**–139.46（**零交叉起播**，修掉 45.46 处的 click）。

## 落点表（v6 · 245s 时间轴 · 22 段）

绝对秒 = manifest.startFrame/30 + 4.0。`s` 是落点，实测起/止见 `verify.py` 回读。
字数为净汉字。

| id | 声部 | 起 | 净字 | 台词 |
|---|---|---|---|---|
| a01 | 男 | 5.2 | 12 | 没什么原因。就是……想讲给你听。 |
| a02 | 男 | 10.4 | 23 | 那天晚上在海边，太阳沉下去那会儿，我忽然想起一首诗。 |
| a03 | 男 | 17.9 | 15 | 上周末你发来晚霞，跟那天一模一样。 |
| a04 | 男 | 22.9 | 10 | 我才想起来，你是襄阳人。 |
| a05 | 男 | 27.5 | 8 | 那首诗，是郭襄写的。 |
| a06 | 男 | 34.3 | 25 | 郭襄的襄，就是襄阳的襄。那年她十六岁，一个人从襄阳跑出来。 |
| a07 | 男 | 44.4 | 11 | 家里没人信她能走这么远。 |
| a08 | 男 | 48.9 | 22 | 风陵渡只是黄河边的一个小渡口。她本来是要路过的。 |
| a10 | 男 | 74.0 | 22 | 放这场烟花的人，站在城里最高的地方，看了她一整夜。 |
| a12 | 男 | 88.8 | 12 | 往后的二十四年，让她自己讲。 |
| b01 | 女 | 94.3 | 10 | 后来我就背着剑出门了。 |
| b02 | 女 | 101.0 | 16 | 一个渡口走到下一个渡口。走了很多年。 |
| b03 | 女 | 108.6 | 24 | 我每到一个渡口都问，有没有一个只有一只袖子的人经过。 |
| b05 | 女 | 124.6 | 15 | 我赶到的时候，雪已经把脚印盖住了。 |
| b06 | 女 | **129.4** | 7 | 我每次都晚三天。（v6 从 130.6 前移，让开 S21 转身走开的纯音乐段） |
| b07 | 女 | 143.3 | 4 | 我听见了。 |
| b08a | 女 | 150.2 | 10 | 三枚金针，我用掉了一枚。（v6 起由 b08 拆两条） |
| b08b | 女 | 157.6 | 11 | 那一枚，只求看一眼他的脸。 |
| b09 | 女 | 163.2 | 23 | 十六岁出门，四十岁出家。中间二十四年，我没安过一个家。 |
| b11 | 女 | 177.6 | 16 | 出家那天，我把金针夹进经书里，没烧掉。 |
| b12 | 女 | 184.3 | 12 | 灯一挑亮，我就看见那年的火。 |
| d01 | 男 | 239.0 | 13 | 晚霞还会有。到时候，我讲我们的。 |
| p1–p6 | 灵心 | 189.0 / 191.6 / 196.0 / 215.0 / 228.5 / 235.0 | — | 诗六行（qwen，定稿不动） |

**逐句窗口预算**（排时间轴用，实测口径）：男声占用 **3.33 字/秒**、女声 **3.38 字/秒**（v5 成品轨逐句回读）。
v6 从生成音频实读的最紧三处：a02 实占 6.07s（收 16.70，距 a03 落点 1.2s）、
a03 收 22.29（距 a04 落点 0.61s）、b06 收 ~131.55（设计目标是 <131.5，超约 50ms，
131.5–133.0 仍有 1.45s 纯音乐）。**a05 与 a06 语义近但按 design §4.2 保留两句**。

## 混音链路（v6 实测）

- 脚本：`scripts/build-bgm-mix.py`（numpy；`PROJ` 由 `__file__` 反推，可移植）。
  输入 `public/zhi-guo-xiang/bgm/ai-yi.flac`（139.4595s，母版峰值 −0.35 dBFS），输出 `.tmp/bgm/mix-v6.wav`。
- **铺床**：`BASE_DB = −11`；序段 4.0–34.0 段 +2dB（人声余量 >11dB，让音乐站出来）。
- **ducking 判据**（spec §6.1 公式在 v6 实际线上反算，**不照抄旧表的压深**）：
  从人声轨检测 36 个有声区间 → 每段量床的 `p90`；`p90 < −14` 不压；
  `depth = clamp(round0.5(p90+17), 2.5, 9.0)`；包络 −0.15s 起压 / +0.35s 放完（60ms 平滑）；
  间隔 <3s 合并 → **24 段 → 12 段**（避免「呼噜」）。
- **角色电平**：女独白 +2dB（晓晓比云健低 1.5dB，抬回同一线）；全人声 +1dB（给句尾余量）。
- **峰值**：软上限 0.891；v6 原始和峰 +1.11 dBFS → 整体衰减 2.11 dB，最终 **−1.00 dBFS**，0 削波。
- **实测余量**：33 个 ≥0.8s 的人声段，**最小 5.7 dB**（79.07–80.50，a10「看了她一整夜」自然收弱），
  其余 ≈9.7–18.9 dB；**没有 <4dB 的段**。若将来余量不足，**只能压床**（design §4.4：
  成片余量只剩 0.85dB，抬人声会削波），优先级：加深 duck → 降 BASE_DB → 侧链 EQ 挖孔。
- **第二遍起播**：`PASS2_SRC = 45.45754`（曲内零交叉；起播样本 −0.2268 不在零交叉会产生 click）。
  `mux-bgm.mjs` 的 `atrim` 同值；`duck-voice.mjs` 的 `PASS2_OFFSET` 同值。

## 执行约束（实证坑位）

- **本机没有 edge-tts、系统 python 没有 numpy。** 用 harness python 建 `.tmp/venv` 装 edge-tts；
  `build_track.py`/`verify.py` 是纯 `wave`（任意 python）；`build-bgm-mix.py` 需要 numpy，
  **用 harness python 跑**（venv 里 pip 装的 numpy 在 macOS 上会因代码签名 dlopen 失败）。
  完整命令见 `scripts/voice/README.md`。
- **edge-tts 输出恒为 24kHz MP3**，必须先转 48k；MP3 首尾带静音（0.1–1s 级），
  排重叠时以「实测有声区间」为准，不要拿 mp3 时长当口播长度。
- **停顿只能靠 `lines.json` 的 `s` 造**：`gen_edge.py` 没有 SSML break 通道，标点只给自然停顿。
- **男声仍是 TTS 占位**：最终换本人真声（直接录音，不复刻）。替换后所有落点不用改。
- `duck-voice.mjs` 的 `LANDINGS`（21 条 v9 字幕）与 `CONTROL_WINDOWS` **已过期**
  （现 14 条字幕 / 22 段人声，11–23s 早已有 a02–a04），`--mode plan` 的时间预算/重叠/对照窗
  **结论不可用**；只有 filter_complex 拓扑与 ffmpeg 封装（含已修的 stderr 解析）有效。
  成片混音走 `build-bgm-mix.py`，`duck-voice.mjs` 只作参数沙盘。
- **BUG1（已修）**：`duck-voice.mjs` 的 `ffQuiet` 成功路径只返回 stdout，
  而 `volumedetect` 写 stderr（实测 stdout 命中 0、stderr 1）——这是「语音−BGM=−70dB」废数字的真根因；
  现改 `spawnSync` 合并两路。**BUG2（已兜底）**：`DEFAULTS` 补 `level_sc: 1`，
  否则 render 模式会拼出 `level_sc=undefined`。BUG3/BUG4（B/C 输入索引、不带 --voice 只出 7346 帧）
  本次未复现、未修，用 `build-bgm-mix.py` 路线绕开。
- **历史坑（qwen 灵心时代，仍适用）**：Token Plan 音色白名单严格（不可用音色报 401 `InvalidApiKey`，
  误导性报错）；服务端 WAV 头 nframes 是坏值，需 `sanitize_wav`；「~」结尾 TTS 处理不稳定。
- **字幕同步**：S01/S38 加「念念」等改动要连 `storyboard-v9.md`（机器真源）、
  `shots-manifest.json` 与 `lines.json` 一处不落。
- 诗行/框架句入库命名 `public/zhi-guo-xiang/tts/line-NN.wav` / `frame-open|close.wav`。

## 适用边界

适用于本片及后续视频的配音生产与「人声轨 + 两遍 BGM」的混音。不涉及选曲、
Remotion 内嵌音频（禁用 `<Audio loop>`）、转场与镜头。

## 验证方式

1. `verify.py`：逐句 RMS 有值（v6 全部 −18.1 ~ −24.8 dBFS）、F0 判男女（个别句有倍周期伪影，RMS 为准）、
   10 个对照区 RMS = −99.0（数字静音）。
2. `build-bgm-mix.py`：看输出末段的「每段人声 vs 床余量表」，最小余量 ≥4dB；
   峰值 ≤0.891 且无削波。
3. 成片 mux 后抽帧听 3 处：151.00s 第二遍起播（无 click）、143.46–151.00 断点、239.0 后片尾清唱。