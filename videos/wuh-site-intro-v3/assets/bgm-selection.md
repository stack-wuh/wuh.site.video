# 《七年，一座站》配乐方案 v1（2026-11-15）

> 曲目：Kevin MacLeod（incompetech.com），CC BY 4.0。已统一 loudnorm **-17 LUFS / TP -1.4** → AAC 192k，落 `public/wuh-site-intro-v3/score-bright/`。
> 时间轴：全片 6030f = 片头 150 + 正片 5700 + 片尾 180（30fps）。段间 30f 真交叉淡化；**禁 `<Audio loop>`**（playbook 实证 loop 音量按轮重置）。
> 状态：v1 初剪，待用户听感评审后换曲/换段（改配乐不需要重渲画面——只换本文件与 `WuhSiteIntroV3Audio.tsx`）。

## B 站/发布署名（随片交付）

```
Music: "Life of Riley" — Kevin MacLeod (incompetech.com)
Music: "Meditation Impromptu 01" — Kevin MacLeod (incompetech.com)
Music: "Take the Lead" — Kevin MacLeod (incompetech.com)
Music: "Digital Lemonade" — Kevin MacLeod (incompetech.com)
Music: "Crypto" — Kevin MacLeod (incompetech.com)
Music: "Inspired" — Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 4.0
https://creativecommons.org/licenses/by/4.0/
```

## 分段编排（绝对帧 0–6030）

| 段 | from | dur | 曲目 | startFrom | 情绪 / 对应幕 | 峰值 |
|---|---|---|---|---|---|---|
| 1 | 0 | 1680 | life-of-riley | 0 | 冷开场 + 第一幕「起点」：明亮、轻快、像翻开旧手账 | 0.78 |
| 2 | 1650 | 930 | meditation-impromptu-01 | 300 | 第二幕「沉默」：钢琴单音托底，全片最薄 | 0.52 |
| 3 | 2550 | 930 | take-the-lead | 0 | 第三幕「重启」：92 BPM 推进，上线（abs 2940）满起来 | 0.82 |
| 4 | 3450 | 1230 | digital-lemonade | 0 | 第四幕「屋里」：放克电子，信息密度最高的一段 | 0.76 |
| 5 | 4650 | 730 | crypto | 1800 | 第五幕「方法」：机械脉冲，版本/流水线/仓库 | 0.72 |
| 6 | 5350 | 680 | inspired | 0 | 第六幕「签名」+ 片尾：温暖上扬，末 90f 淡出 | 0.80 |

段间 30f 交叉淡化；每段 `fadeVol(dur, peak, 30, 30)`。第五幕结束处（abs ~5350）与第六幕开头重叠，形成「方法 → 人」的转暖。

## 选曲理由（初剪判断）

- 全片基调 = 亮色信息密度 / 产品发布片：主体用「明亮电子 + 木吉他/放克」而非旧版深空氛围。
- 第二幕必须最薄（只有钢琴），让「4 / 0」的沉默真的空出来；是全片唯一允许「退音量」的段落。
- 第三、四幕是动能段：`take-the-lead`（≈92 BPM，接近 90 BPM 对拍网格）与 `digital-lemonade` 提供推进与切分。
- 第五幕 `crypto` 的机械感对应 CI/版本雨/仓库横条；第六幕 `inspired` 收暖。

## 待改/待听

1. 一二幕是否太「商务」（inspired/life-of-riley 偏 corporate）——可换更文学的木吉他/钢琴曲。
2. 第二幕钢琴与后期激昂段的落差是否过硬。
3. 段 4/5 的电子音色是否与站点「纸墨」气质冲突。
4. 是否需要在 s26（朱红满屏，abs 2940）做一记 3f 音乐真空（先押后放）——待听感定。