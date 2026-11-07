# 配音流水线（v6）

四步，全部可重跑。设计说明见 `shadow-docs/changes/20261101-feature-zhi-guo-xiang-production/design-v10.md` §四。

```
lines.json  ──gen_edge.py──▶  scripts/voice/mp3/*.mp3
                              │
                              ▼
                        build_track.py  ──▶  public/zhi-guo-xiang/tts/voice-track-v6.wav
                              │
                              ▼
                        verify.py       （逐句 RMS / F0 / 对照区静音回读）
```

| 文件 | 作用 |
|---|---|
| `lines.json` | **唯一事实来源**。22 段台词 `{id, s(绝对秒), v(male\|female), t(文本)}` |
| `gen_edge.py` | edge-tts 批量合成。定角：男 云健 `zh-CN-YunjianNeural` −26% / −6Hz；女 晓晓 `zh-CN-XiaoxiaoNeural` −28% / −4Hz |
| `build_track.py` | 转 48k / RMS 归一 / 角色偏移 / 10ms 淡入出 / tanh 软限幅，拼成 245.00s 立体声轨 |
| `verify.py` | 从成品轨回读每句的 RMS 与 F0，并检查 10 个对照区为数字静音 |
| `edit_captions.py` | 按终裁删除 / 移动 shot 里的 `<Caption>` |
| `decode-ncm.py` | 网易云 `.ncm` 解码器（正确算法：key_box 折叠 + `base64decode(md[22:])`） |

## 本机（macOS）怎么跑

系统 python 没有 `edge-tts`/`numpy`，用 harness 自带 python 建 venv（`edge-tts` 只装 venv 即可；
`numpy` 在 venv 里可能因 macOS 代码签名 dlopen 失败，混音脚本改用 harness python 跑）：

```bash
PY=/Users/wuhong/.dsh/dsh-runtimes/dsh-next-primary-runtime/dependencies/python/bin/python3
$PY -m venv .tmp/venv && .tmp/venv/bin/pip install edge-tts
.tmp/venv/bin/python scripts/voice/gen_edge.py                 # 出 scripts/voice/mp3/*.mp3
$PY scripts/voice/build_track.py                               # 出 voice-track-v6.wav
$PY scripts/voice/verify.py                                    # 逐句回读 + 对照区
$PY scripts/build-bgm-mix.py                                   # 出 .tmp/bgm/mix-v6.wav
node scripts/duck-voice.mjs --mode plan                        # 只出参数（结论已过期，见文件头）
```

## v6 改稿要点（design-v10 §4.2/§4.3）

- 开场白 a01–a04 全部重写并重排落点；**新增 a05**「那首诗，是郭襄写的。」@27.5
- **b08 拆两条**：b08a @150.2「三枚金针，我用掉了一枚。」/ b08b @157.6「那一枚，只求看一眼他的脸。」
- **b06 前移** 130.6 → 129.4（让开 S21「转身走开」的 115–165f 纯音乐段）
- 其余 a06/a07/a08/a10/a12/b01–b05/b07/b09/b11/b12/d01 台词不动
- 实测有声 140.16s / 25 个连续区间（含诗六行），最长空档 56.96–74.00（17.0s）

## 注意

- **诗六行不动。** `public/zhi-guo-xiang/tts/line-01..06.wav` 是 qwen 灵心，INV-5 锁死。
  重跑 `build_track.py` 不会覆盖它们，只读。
- **edge-tts 输出恒为 24kHz MP3**，即使写成 `.wav`。必须先转 48k，否则 `wave` 读不了。
- `(1 + rate) × 净语音 = 常数`（误差 <0.5%），所以真要精确控某句时长，一行试一次音就能反解 rate，不用试错。
- 全片绝对时间映射：`绝对秒 = manifest.startFrame / 30 + 4.0`。
- 男声仍是 edge-tts 云健**占位**；用户已定最终换本人真声（直接录音 44.1k/16bit/mono，S38 硬上限 5.5s），
  替换时只换 `mp3/`（或 `.tmp/audition/v2e/wav/`）里 male 那几条源、落点不用改，重跑 `build_track.py` 即可。