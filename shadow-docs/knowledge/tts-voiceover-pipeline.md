---
title: 配音管线（TTS 双声部 · 落点对位 · Token Plan 白名单）
domain: video-materials
keywords: [配音, TTS, 旁白, 诗行, 双声部, 男声, 女声, 音色, longanhuan, longanlingxin, longanlufeng, Token Plan, 白名单, 401, 落点表, 对位, 回落谷, 念念, 声音复刻, qwen-tts, final.wav, WAV 头]
scope: [public/zhi-guo-xiang/tts/, videos/zhi-guo-xiang/, shadow-dev-cli 仓 tools/qwen-tts/]
status: active
source:
  - changes/20261101-feature-zhi-guo-xiang-production/brief.md
  - shadow-dev-cli 仓 tools/qwen-tts/（tts.py 与 assemble_track.py，20261104 会话驱动产出后入仓；见其 qwen-tts-voiceover 知识卡）
verified: 2026-11-04
verified-depth: runtime
verified-scope: Token Plan（sk-sp- Key）实调 15 次全成功：5s 试听、整诗连读（18.9s）、诗六行逐行×2 版（安欢/灵心）、男声框架句两句（含「念念」改版）、灵心 L5 试听；音色白名单 401 实证——CosyVoice v3 全系（*_v3）、3.0-flash 池（longanfengyue）、3.1 整模型均 401；WAV 头 nframes 坏值复现并由 sanitize_wav 修复；2026-11-04 灵心定稿重出 + 245s 整轨拼装完成，RMS 验证 8 落点有声/对照区静音
---

# 配音管线（TTS 双声部 · 落点对位 · Token Plan 白名单）

## 当前结论

《风陵 · 致郭襄》配音走**双声部**设计（工具载体 shadow-dev-cli 仓 `tools/qwen-tts/tts.py`；流程细节见 shadow-dev-workflow 的 `shadow-dev-tts` 技能；shadow-dev-cli 仓另有 `media-tts` 域知识卡）：

- **男声 = 讲述者**（用户本人视角，海边读纸人）：只说两句——S01「念念，我想给你讲一个故事。」（4–11s，近讲干声）与 S38「这个故事，我讲完了，念念~」（~239–244s，全片最后一个人声，音乐已自然静默）。当前为 TTS 占位（`longanlufeng` 龙安鲁风），**待用户以本人声音替换**——录制成品 wav 或走声音复刻均可，模型支持。
- **女声 = 诗六行**（纸的声音，她自己的声音）：**已定稿 `longanlingxin` 龙安灵心（知心温暖音）**，`line-01..06.wav` 均为灵心版（2026-11-04 重出）；`poem-full.wav` 为龙安欢整诗连读版（试听参考，未定稿用）。
- **旁白整轨已拼装**：`voice-track-full.wav`（245.0s 人声轨，44.1k/16bit/mono，20.6MB，人声共 24.7s）——落点起点（秒）：男 S01=4.0、L1=189.0、L2=191.6、L3=196.0、L4=215.0、L5=228.5、L6=235.0、男 S38=239.5。拼装工具 shadow-dev-cli 仓 `tools/qwen-tts/assemble_track.py`（纯 wave 模块，防重叠断言 + RMS 验证：8 落点全有声、静音对照区 RMS=0）。BGM 不混入，装配层 mux 时人声/BGM 各占一路。
- 诗行**逐字不改**（INV-5），TTS 输入即 v9 定稿文本（含「峨嵋」原字）。

## 落点表（245s 时间轴 · 踩音乐回落谷）

| 时间 | 内容 | 状态 |
|---|---|---|
| 4–11s S01 | 男声「念念，我想给你讲一个故事。」 | 占位已出 `frame-open.wav` |
| 15–186s | **无配音**（字幕+音乐独挑） | 禁区：62–80 烟花高潮、83–88「她不知道」、138–144 童谣、143.5–151 茶棚静默、157–163 拈针、201–214 墨滴 |
| ~189–195s S31 | 女 L1+L2（我走过山时／我路过海时） | 待定稿女声后逐行重出 |
| ~196–201s | 女 L3（小毛驴——全片唯一带笑意的一句） | 同上 |
| ~215–220s | 女 L4（判词——念得平，不辩解） | 同上 |
| ~228–234s S37 | 女 L5（墨滴吃掉的字在纸背补全，声音也补全） | 同上 |
| ~235–239s S38 | 女 L6（说漏了——最慢、近耳语） | 同上 |
| ~239–244s | 男声「这个故事，我讲完了，念念~」 | 占位已出 `frame-close.wav` |

对位福利：v9 §八音乐对位已把每个落点排在回落谷/衰减尾/自然静默上，人声轨叠 BGM 几乎不需要 ducking。旁白轨与 BGM 各占一路进 `SiteFilmAudio` 装配层 mux。

## 执行约束（实证坑位）

- **Token Plan `qwen-audio-3.0-tts-plus` 音色严格白名单**：实测可用 `longanhuan_v3.6`（女·元气）、`longanlingxin`（女·知心温暖）、`longanlufeng`（男·明亮开朗）；CosyVoice v3 全系、3.0-flash 池、3.1 整模型一律 401 `InvalidApiKey`（误导性报错，实为音色/模型不在白名单）。换音色前先小句实测再批量。
- **服务端 WAV 头 nframes 是占位坏值**（5s 音频标成 ~6.8h），工具 `sanitize_wav` 落盘前重写；绕过工具手工拼轨必须同样修复。
- 模型支持**指令控制**与**声音复刻**（500+ 克隆音色）——替换男声为本人声音走复刻可行，样本几秒即可。
- 「~」波浪号结尾 TTS 处理不稳定（软尾音/忽略/怪停顿皆有可能），定稿前人工听；备选「……」。
- 诗行入库命名 `public/zhi-guo-xiang/tts/line-NN.wav`，框架句 `frame-open/close.wav`；44.1kHz/16bit/mono。
- 字幕同步：配音加「念念」后 v9 字幕表 S01/S38 尚未同步，改字幕须连 storyboard.md（机器真源）一起对齐。

## 适用边界

适用于本片及后续视频的配音生产。不涉及 BGM 选曲与 mux 链路（见 render-stability-playbook）；不涉及分镜与动效。

## 验证方式

逐句试听 + `wave` 回读（头字段自洽、时长合理、44.1kHz/16bit/mono）。换音色先用单句探白名单再批量出。成片 mux 后按落点表核对「人声出现时音乐在回落谷」。
