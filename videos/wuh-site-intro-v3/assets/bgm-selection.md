# wuh-site-intro-v3 配乐选曲与响度（V2 科技版）

> 全部曲目 Kevin MacLeod（incompetech.com），CC BY 4.0。**2026-11-11 随「品牌暖黑科技」风格重构换电子/氛围族**（用户拍板「同步换科技 BGM」）；段界/startFrom/交叉淡化/白闪避让结构与 V1 纸墨版完全同构（时间轴真源不动，只换曲）。V1 家族曲族保留在 `public/wuh-site-intro-v3/score/` 供回滚。归一：单遍 loudnorm **-17 LUFS / TP -1.4** → AAC 192k（`score-tech/`）。B 站简介署名：

```
Music: "Spacial Harvest" — Kevin MacLeod (incompetech.com)
Music: "Deep Haze" — Kevin MacLeod (incompetech.com)
Music: "Crypto" — Kevin MacLeod (incompetech.com)
Music: "Voltaic" — Kevin MacLeod (incompetech.com)
Music: "Digital Lemonade" — Kevin MacLeod (incompetech.com)
Music: "As I Figure" — Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 4.0
https://creativecommons.org/licenses/by/4.0/
```

## 分段编排（WuhSiteIntroV3Audio · 绝对帧 0–8590）

| 段 | from | dur | 曲目 | startFrom | 情绪 |
|---|---|---|---|---|---|
| 1 | 150 | 1872 | spacial-harvest | 0 | Act1–2 静·勤（深空氛围铺底） |
| 2 | 1992 | 1086 | deep-haze | 0 | Act3 温 |
| 3 | 3048 | 810 | crypto | 900 | Act4 痛·断电（暗电子脉） |
| 4 | 3828 | 828 | voltaic | 0 | Act5 燃（白闪真空 4089=局部 261，压低 20f→真空 20f→释放 30f；preludeVol 原样） |
| 5 | 4626 | 1310 | digital-lemonade | 0 | Act6 奇（入院巡礼） |
| 6 | 5906 | 1098 | spacial-harvest | 2400 | Act7 深（坐忘回捞） |
| 7 | 6974 | 1068 | as-i-figure | 3600 | Act8 扬（版本雨→树） |
| 8 | 8012 | 578 | deep-haze | 0 | 终章归（末 120f 淡出） |

段间 30f 真交叉淡化；禁 `<Audio loop>`；时长核验：每段 startFrom+dur 秒数均 ≤ 曲长（spacial-harvest 173.0 / deep-haze 122.1 / crypto 204.1 / voltaic 196.1 / digital-lemonade 180.1 / as-i-figure 216.9）。
