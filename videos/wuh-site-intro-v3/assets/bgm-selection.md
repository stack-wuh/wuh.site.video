# wuh-site-intro-v3 配乐选曲与响度

> 全部曲目 Kevin MacLeod（incompetech.com），CC BY 4.0。**v3 复用 v2 家族基调**（归一化产物自 `public/wuh-site-intro-v2/score/` 同源复制到 `public/wuh-site-intro-v3/score/`），分段编排按 v3 8590f 时间轴重对拍（`WuhSiteIntroV3Audio.tsx`：白闪真空对齐渲染帧 4089）。B 站简介署名：

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

## 分段编排（WuhSiteIntroV3Audio · 绝对帧 0–8590）

| 段 | from | dur | 曲目 | startFrom | 情绪 |
|---|---|---|---|---|---|
| 1 | 150 | 1872 | meditation-01 | 0 | Act1–2 静·勤 |
| 2 | 1992 | 1086 | meditation-02 | 0 | Act3 温 |
| 3 | 3048 | 810 | heartbreaking | 900 | Act4 痛（2025 留白） |
| 4 | 3828 | 828 | prelude-and-action | 0 | Act5 燃（白闪真空 4089=局部 261，压低 20f→真空 20f→释放 30f） |
| 5 | 4626 | 1310 | dreams-become-real | 0 | Act6 奇（入院巡礼） |
| 6 | 5906 | 1098 | meditation-01 | 2400 | Act7 深（坐忘回捞） |
| 7 | 6974 | 1068 | take-the-lead | 3600 | Act8 扬（版本雨→树） |
| 8 | 8012 | 578 | heartbreaking | 0 | 终章归（末 120f 淡出） |

段间 30f 真交叉淡化；禁 `<Audio loop>`；曲目已归一 -17 LUFS / 限幅 0.85（归一详情见 v2 bgm-selection.md，v3 未重处理）。
