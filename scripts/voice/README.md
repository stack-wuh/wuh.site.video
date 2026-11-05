# 配音流水线（v5）

四步，全部可重跑。设计说明见 `videos/zhi-guo-xiang/assets/vo-script-v5.md`。

```
lines.json  ──gen_edge.py──▶  .tmp/audition/v2e/mp3/*.mp3
                              │
                              ▼
                        build_track.py  ──▶  public/zhi-guo-xiang/tts/voice-track-v5.wav
                              │
                              ▼
                        verify.py       （逐句 RMS / F0 回读）
```

| 文件 | 作用 |
|---|---|
| `lines.json` | **唯一事实来源**。20 段台词 `{id, s(绝对秒), v(male\|female), t(文本)}` |
| `gen_edge.py` | edge-tts 批量合成。定角：男 云健 `zh-CN-YunjianNeural` −26% / −6Hz；女 晓晓 `zh-CN-XiaoxiaoNeural` −28% / −4Hz |
| `build_track.py` | 转 48k / RMS 归一 / 角色偏移 / 10ms 淡入出 / tanh 软限幅，拼成 245.00s 立体声轨 |
| `verify.py` | 从成品轨回读每句的 RMS 与 F0，确认没有空段、没有串角色 |
| `edit_captions.py` | 按终裁删除 / 移动 shot 里的 `<Caption>` |
| `decode-ncm.py` | 网易云 `.ncm` 解码器（正确算法：key_box 折叠 + `base64decode(md[22:])`） |

## 注意

- **诗六行不动。** `public/zhi-guo-xiang/tts/line-01..06.wav` 是 qwen 灵心，INV-5 锁死。
  重跑 `build_track.py` 不会覆盖它们，只读。
- **edge-tts 输出恒为 24kHz MP3**，即使写成 `.wav`。必须先转 48k，否则 `wave` 读不了。
- `(1 + rate) × 净语音 = 常数`（误差 <0.5%），所以真要精确控某句时长，一行试一次音就能反解 rate，不用试错。
- 全片绝对时间映射：`绝对秒 = manifest.startFrame / 30 + 4.0`。