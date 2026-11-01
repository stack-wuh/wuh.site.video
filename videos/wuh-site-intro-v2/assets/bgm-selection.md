# wuh-site-intro-v2 配乐选曲与响度

> 全部曲目 Kevin MacLeod（incompetech.com），CC BY 4.0。B 站简介署名：

```
Music: "Meditation Impromptu 01" — Kevin MacLeod (incompetech.com)
Music: "Meditation Impromptu 02" — Kevin MacLeod (incompetech.com)
Music: "Heartbreaking" — Kevin MacLeod (incompetech.com)
Music: "Prelude and Action" — Kevin MacLeod (incompetech.com)
Music: "Dreams Become Real" — Kevin MacLeod (incompetech.com)
Music: "Take the Lead" — Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 4.0
https://creativecommons.org/licenses/by/4.0/
```

## 曲目与来源

| 归一化产物（public/wuh-site-intro-v2/score/） | 来源 | 原始 LUFS / TP | 增益 | 归一后 LUFS / TP |
|---|---|---|---|---|
| `meditation-01.m4a` | `public/site-film/meditation.m4a` | -23.3 / -2.1 | +6.3 dB | -17.3 / -1.4 |
| `meditation-02.m4a` | `assets/bgm/meditation-impromptu-02.mp3` | -22.7 / -2.4 | +5.7 dB | -17.2 / -1.2 |
| `heartbreaking.m4a` | `assets/bgm/heartbreaking.mp3` | -31.3 / -10.8 | +14.3 dB | -17.2 / -1.4 |
| `prelude-and-action.m4a` | `public/wuh-site-intro-v2/prelude.m4a` | -13.2 / +0.1 | -3.8 dB | -17.1 / -3.6 |
| `dreams-become-real.m4a` | `videos/site-film/assets/bgm-candidate-dreams-become-real.m4a` | -24.4 / -9.4 | +7.4 dB | -17.0 / -2.0 |
| `take-the-lead.m4a` | `public/site-film/lead.m4a` | -11.4 / +0.5 | -5.6 dB | -17.1 / -4.9 |

统一滤镜：`volume=<gain>dB,alimiter=limit=0.85:level=false`，AAC 256k。限幅把峰值压到约 -1.4 dBTP，避免混音削波；六轨响度差从原来的近 20 dB 收到 0.3 dB 内。

## 分段编排（渲染帧，含 120f 片头）

| 段 | 起帧 | 时长 | 曲目（startFrom） | 音量 |
|---|---|---|---|---|
| Act1–2 | 120 | 1872 | Meditation 01（0s） | 0.85 |
| Act3 | 1962 | 1020 | Meditation 02（0s） | 0.82 |
| Act4 留白 | 2952 | 810 | Heartbreaking（30s） | 0.90 |
| Act5 灯亮 | 3732 | 828 | Prelude and Action（0s） | 白闪真空 0.12 |
| Act6 入院 | 4530 | 1230 | Dreams Become Real（0s） | 0.78 |
| Act7 坐忘 | 5730 | 1098 | Meditation 01（80s） | 0.80 |
| Act8 此刻 | 6798 | 1068 | Take the Lead（120s） | 0.88 |
| 终章 | 7836 | 578 | Heartbreaking（0s） | 0.92 → 末 120f 淡出 |

段间 30f 真交叉淡化（后段提前 30f 进入，前段同步淡出）。

## 修复记录

- **片尾静音**：旧版终章 `startFrom=8100`（270s）越过 `lead.m4a` 实际曲长 224.6s，导致成片最后 46.9s 静音；新版终章改用 `Heartbreaking` 0s 起，片尾 180f 有音乐并淡出。
- **白闪真空错位**：旧版 Prelude 的真空下沉在渲染帧 3976–4026，实际白闪峰值在 4120；新版对齐到 4120（段内 388），下沉 358–408。
- **响度不齐**：旧版各轨原始响度差近 20 dB（meditation -23.3、lead -11.4、heartbreaking -31.3）；新版逐轨归一到 -17 LUFS。

> 源曲 `meditation-impromptu-02.mp3` 的头标称 249s，实际可解码 213.5s；本片只用前 34s，不受影响。
