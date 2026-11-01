# 《风陵 · 致郭襄》｜四分钟武侠诗电影 · 动效设计规范（Motion Spec）
## 1. 版本与适用范围
| 项 | 值 |
|---|---|
| 版本 | **v1**（2026-11-01）｜对齐 `script.md` 定稿、`storyboard.md` v1（52 镜）、`character-design.md` v1（硬约束） |
| 正片 | **0–7200**（7200f / 4:00 @30fps）｜六幕｜**52 镜**｜末帧 7199 |
| 全片 | **7500f = 4:10** = FilmShell 片头 **120** + 正片 **7200** + 片尾 **180** |
| 节拍 | **90 BPM，1 拍 = 20f**；只作卡点参考，不选曲、不定音轨 |
| 声音 | **全片无 SFX**；禁 `<Audio>`；BGM 与音轨留正式制作 |
| 范围 | 本规范只覆盖正片 0–7200；片头 120f、片尾 180f 由 FilmShell 承担 |
| 输入 | `script.md` / `storyboard.md` / `character-design.md` / `materials.md` / `brand/tokens.ts` / `brand/motion.ts` |
| 输出 | 本文件；令牌落地于 `videos/preprod-zhi-guo-xiang/motion-tokens.ts`（私有色只声明一次） |
## 2. 设计基调
**纸上的回望。** 镜头不是航拍，是一双在纸上移动的眼睛；人不被照亮，人被墨写出。

- **人如墨影，物如刀刻。** 人是一个闭合 path、单色填充、至多两条 1.2px 结构线；物是断线刻出的形，2px 主轮廓、局部 3px 承重线；景是 0.8px 远线、平涂、留白。
- **全片没有一次急推、没有一次甩镜。** 镜头只许缓起缓停；「匀速」用 `CM-05` 的 plateau 档，不用线性。
- **唯一一次「赶」是 4-3（S29）。** 是纸页翻动比人快，不是镜头比人快；用 `CM-13` 的 slow-fast-slow 包络，仍然没有撞击感。
- **两次「亮」同暖金。** 第一次 1980f 的烟花从下往上打，她被照亮；第二次 6000f 的云霞从平处铺开，她自己看见。两次共用 `FILM.fireGold` + `GR-05`。
- **三次眼、三次光。** S8 火塘（听来的火）、S18 烟花（别人放的火）、S38 佛前灯（她自己点的灯）；只给反光，不给目光。
- **正片零红。** `colors.seal` 只出现在 FilmShell 片头那枚印；剑穗、金针身、灯、火都不许红。
## 3. 令牌体系
> 令牌总账 **106 枚** = CV 6 + SP 4 + RH 7 + CM 13 + PT 13 + TR 12 + GR 8 + FG 19 + FN 24。矩阵引用全部落在 §3 定义域内；CV/SP/RH 作为配方参数被间接引用，场景内只写令牌名，不写色值。
### 3.1 曲线令牌（CV，6）
| 编号 | 令牌 | Remotion 配方 | 用途 |
|---|---|---|---|
| `CV-01` | cine-ease-out | `Easing.out(Easing.cubic)`（`CURVES.cineEaseOut`） | 默认入场、落定、字幕落笔 |
| `CV-02` | cine-ease-in | `Easing.in(Easing.cubic)` | 退场、光退、下坠 |
| `CV-03` | cine-ease-in-out | `Easing.inOut(Easing.cubic)` | 镜头运动、溶解、门开 |
| `CV-04` | sine-out | `Easing.out(Easing.sin)` | 极缓收：云、雾、山脊、后拉 |
| `CV-05` | plateau | `interpolate(t,[0,.12,.88,1],[0,.35,.92,1],{easing:CV-03})` | 「匀速」横移/跟移；禁线性 |
| `CV-06` | hard-step-3 | `Math.round(interpolate(t,[0,1],[0,3]))/3` | 半透明渐变的 2–3 帧硬切替代 |
### 3.2 弹性令牌（SP，4）
| 编号 | 令牌 | spring config | 用途 |
|---|---|---|---|
| `SP-01` | heavy-glide | `{ damping: 200, stiffness: 60 }` | 门、雾、云、重物落定，无过冲 |
| `SP-02` | drag-follow | `{ damping: 14, stiffness: 160 }` | 剑穗、发带、缰绳的滞后跟随 |
| `SP-03` | spring-pop | `{ damping: 9, stiffness: 180, mass: 0.8 }` | 金针尖、灯芯的极轻弹性；振幅 ≤4% |
| `SP-04` | cam-follow | `{ damping: 200, stiffness: 90 }` | 镜头追随预烘焙目标（S25 跟驴） |
### 3.3 节奏令牌（RH，7）
| 编号 | 令牌 | 帧数 | 用途 |
|---|---|---|---|
| `RH-01` | beat | **20f** | 主网格；幕界与重音吸附整拍 |
| `RH-02` | half-beat | **10f** | 半拍；字落、灯亮、事件错峰 |
| `RH-03` | step | **40f** | 上山一步；S30/S31 五步 0–199 |
| `RH-04` | phrase | **80f** | 4 拍短语；诗行与呼吸段 |
| `RH-05` | rest | **40f** | 2 拍静止；落定后的留白 |
| `RH-06` | char-cell | **12f** | S25「滴滴答答」单字格 |
| `RH-07` | hold | **60f** | 定格呼吸；S33 暖白、S42 空钉 |
### 3.4 镜头令牌（CM，13）
| 编号 | 令牌 | 配方 | 典型参数 |
|---|---|---|---|
| `CM-01` | cam-hold | 全参数恒定；可叠 `CM-02` | 全片默认 |
| `CM-02` | cam-drift | `translate ±4px` + `rotate ±0.15°` 低频正弦，周期 120f | 常驻，幅度减半 |
| `CM-03` | cam-dolly-in | `scale 1→1+D`，`CV-03`，origin 对准落点 | D=0.015–0.04；S32 断点后 4% |
| `CM-04` | cam-dolly-out | `scale 1→1−D`，`CV-04` | D=0.02；S24/S41 |
| `CM-05` | cam-pan | `translateX` + `rotate ±0.3°`，`CV-05` plateau | S3 3%、S17 6% |
| `CM-06` | cam-tilt | `translateY` + `rotateX ≤2°`，`CV-03` | S15 上摇 3%、S20 下摇、S37 上摇 |
| `CM-07` | cam-truck | 纯 `translateX`，与主体同步，`CV-05` | S25 侧向跟驴 |
| `CM-08` | cam-follow | 目标路径预烘焙，rig 用 `SP-04` 追随 | S13 跟马 30f、S25 跟驴 |
| `CM-09` | cam-macro | `scale 1.1–1.6` + 浅景深，焦点锁定 | S4/S9/S10/S11/S27/S28/S29/S35/S36/S42 |
| `CM-10` | dof-parallax | 三层 depth 0.4 / 1.0 / 1.6；`层位移 = 镜头位移 ×(depth−1)×−1` | 全片常驻 |
| `CM-11` | dof-focus-pull | 两层 blur 交叉插值，`CV-03` | 常规 20f；S8 30f、S49 40f |
| `CM-12` | dof-breath | 全层 blur 基准 ±0.5px 低频正弦，周期 120f | 常驻；幕四/幕六减半 |
| `CM-13` | cam-ramp | slow-fast-slow 包络，分段 `CV-03`，禁线性 | **仅 S29**；全片唯一一次「赶」 |
### 3.5 粒子与材质令牌（PT，13）
| 编号 | 令牌 | 配方 | 用途 |
|---|---|---|---|
| `PT-01` | paper-grain | 预渲染噪点 tile，`mixBlendMode: overlay`，opacity ≤8% | 全片纸底 |
| `PT-02` | paper-fiber | 种子化 1px 短 strokes，静态，opacity ≤8% | 纸纤维；S1/S2 |
| `PT-03` | dust-field | N 颗 2–5px，`random('sNN-dust-i')`，正弦 opacity 120f | 全片贯穿；暗场极稀 |
| `PT-04` | ash-fall | 30–50 颗灰点，0.4–0.8px/f 下落 + ±3px 横摆 | S20–S21 烟灰 |
| `PT-05` | snow-fall | 40–60 颗纸白点，28° 斜落，1.2–2.4px/f | S34–S35 雪 |
| `PT-06` | gold-shard | 24–36 颗 2–4px 金屑，18f 绽开 + 60f 下落，`random(seed)` | S16–S19、S51 |
| `PT-07` | cloud-drift | 2–3 层纸/墨云，`translateX ≤3%/150f`，`CV-04` | S22–S24、S45–S51 |
| `PT-08` | reed-sway | 7–9 根芦苇，正弦 ±3px，按索引错相，60f 周期 | S5–S7、S12、S25 |
| `PT-09` | water-line | 横向 1px 水纹段，opacity 6f 错峰，无噪声位移 | S3、S5 |
| `PT-10` | stroke-grow | `strokeDasharray/offset` 生长，30–90f，`CV-04` | S2 山脊、S3 水线、S28–S29 纸字 |
| `PT-11` | lamp-core | 局部 radial **≤80px**，三档 opacity 用 `CV-06` 2f 硬切 | 仅佛前灯 S36–S38 |
| `PT-12` | needle-tip | 局部 radial **≤4px**，固定 opacity，仅 2f 硬切 | S10–S11 金针尖 |
| `PT-13` | light-band | 局部 linear-gradient 光带，宽 ≤40% 画幅，三档 `CV-06` | S47 云隙落纸 |
### 3.6 转场令牌（TR，12）
| 编号 | 令牌 | 配方 | 时长/尾帧 |
|---|---|---|---|
| `TR-01` | handoff-match | 冻结出镜尾帧，入镜首帧同状态起步；必要时 2f 交叉 | 0–2f；默认 |
| `TR-02` | dissolve-8 | 两层 opacity 交叉，`CV-03` | 6–10f |
| `TR-03` | hard-cut-same | 同材质硬切：纸接纸、墨接墨、暖光接暖光 | 0f |
| `TR-04` | dusk-bleed | 纸白→暮色：`GR-03` 20f 交叉 + 暖帘三档 `CV-06` | 20f；S4→S5 |
| `TR-05` | focus-emerge | 出镜 blur 0→8px，入镜 blur 8→0 + opacity 0→1，`CV-01`；只用于无人镜 | 20f；S42→S43 |
| `TR-06` | light-open | 门缝 6px → 60° 开；光矩形 `clipPath` 从缝内扩出，不铺满屏 | 0f 切 + 90f 开；S31→S32 |
| `TR-07` | white-match-cut | 暖白满屏同亮度硬切，入镜雪从同一明度起步 | 0f；S33→S34 |
| `TR-08` | eyeline-match | 抬头角与视线方向匹配后硬切，不做特效 | 0f；S49→S50 |
| `TR-09` | dot-out | 人缩成点后冻 8f，再同材质硬切；J1 的物理落点 | 8f + 0f；S24→S25 |
| `TR-10` | stack-wipe | 纸摞升高扫过画幅，露出远山雾 | 16f；S29→S30 |
| `TR-11` | twin-frame | 同一 `<AscendBack f={0–239}>`、同一 local 帧、同一组令牌；尾帧像素差分 0 | 0f；S30→S31 |
| `TR-12` | gold-superimpose | 蓝块中金点浮出，叠成烟花；两片金 opacity 交叉 30f | 30f；S50→S51 |
### 3.7 调色令牌（GR，8）
> 每个 grade = 底色层 + 雾光层 + 全局滤镜；雾光层只许 `linear-gradient` 或 `clipPath`，不许全屏 radial。幕间切换前 40f 做 opacity 交叉；半透明帘一律 `CV-06` 量化成 2–3 帧硬切。

| 编号 | 令牌 | 底色层 | 雾光层 | 全局滤镜 | 用途 |
|---|---|---|---|---|---|
| `GR-01` | paper-white | `colors.paper` 铺底 | 纸白雾 `screen @6%` | saturate 0.98 | S1–S4、S28–S29 |
| `GR-02` | ink-night | `colors.bg` multiply @40% | `FILM.nightBlue` `screen @6%` | saturate 0.92 | S8–S11、S16–S21 |
| `GR-03` | dusk-earth | `colors.accent` soft-light @18% | `FILM.snowCyan` `screen @6%` | saturate 0.95 | S5–S7、S12–S15、S25–S27 |
| `GR-04` | snow-ash | `colors.paperDeep` multiply @20% | `FILM.snowCyan` `screen @5%` | saturate 0.60 | S34–S35 |
| `GR-05` | warm-gold | `FILM.fireGold` soft-light @22% | `colors.gold` `screen @6%` | saturate 1.00 | S16–S19、S32–S33、S45–S52 |
| `GR-06` | lamp-warm | `colors.accent` soft-light @15% | `FILM.fireGold` `screen @4%`，只落在灯侧 | saturate 0.98 | S36–S44 禅房 |
| `GR-07` | mountain-ink | `colors.ink` multiply @25% | `colors.muted` `screen @4%` | saturate 0.90 | S2、S22–S24、S26、S30–S31 |
| `GR-08` | cloud-dusk | `FILM.fireGold` soft-light @18% + `FILM.snowCyan` soft-light @8% | `colors.gold` `screen @6%` | saturate 1.00 | S45–S51 峨眉云霞 |
**3.7.1 私有色声明（全文唯一声明处；场景只引用，不写 hex / rgba / hsl）**

| 令牌 | 定义位置 | 校准 | 只用于 |
|---|---|---|---|
| `FILM.snowCyan` | `motion-tokens.ts` 的 `FILM` 常量 | 雪青：纸白与灰之间的冷青灰，明度高于 `colors.muted` | 郭襄衣、青驴边光、石青、雪夜边线 |
| `FILM.nightBlue` | 同上 | 夜蓝：`colors.bg` 向冷偏移一阶，仍不到纯黑 | 3-2 夜空、雪夜底 |
| `FILM.fireGold` | 同上 | 火金：`colors.gold` 向暖偏移一阶，与 `colors.accent` 同族但更亮 | 两次「亮」、佛前灯局部 ≤80px、金针尖 ≤4px |
### 3.8 人物与图形令牌（FG，19｜承接 `character-design.md` §9.4）
| 编号 | 令牌 | Remotion 配方 | 用途 |
|---|---|---|---|
| `FG-01` | `FIGURE.xiang(age)` | 闭合 path ≤24 锚点（只用 C/Q）；`fill` 单色、`stroke="none"`；内部至多 2 条 1.2px 结构线，opacity ≤0.35；age ∈ 16/20/30/40a/40b/old | 郭襄五段六态；头身比 6.5/6.8/7.0/7.0/7.0/6.2 |
| `FG-02` | `FIGURE.yangguo` | path + 空袖 60×22 钉在肩点，左袖 44px；只给肩线与后脑一弧；无脸、无颈线、无剑 | S22–S24 华山别 |
| `FG-03` | `FIGURE.fengling` | `FIGURE.xiang('16')` 同源 path ×0.93；单层衣、无腰带结、无手、发线 2 条、衣褶 1 条 | S48–S49 风陵师太 |
| `FG-04` | `POSE.ascendBack(f)` | f ∈ 0–239；y 929→670、scale 1→0.92、上背前倾 2°、肩线水平；0–199 五步、200–239 立定 | **S30 / S31 共用**；第 239 帧像素差分 0 |
| `FG-05` | `STROKE.S0–S3 + F` | S0=0.8 / S1=1.2 / S2=2.0 / S3=3.0 / F=填充无描边；随镜头缩放，不开 `non-scaling-stroke` | 全片线宽唯一来源 |
| `FG-06` | `SILHOUETTE.onPaper / onInk` | onPaper：`colors.ink` 填充 + `colors.paper` 收口；onInk：`colors.paper` 填充 + `colors.ink` 收口；明度差 ≥70%，边光 ≤1.2px | 人与山的正负形；禁 glow/blur/描边发光 |
| `FG-07` | `FILM.snowCyan` | 在 `motion-tokens.ts` 的 `FILM` 常量声明一次（§3.7.1）；场景 `fill/stroke` 只引用，不内联 | 雪青衣、驴边光、石青 |
| `FG-08` | `FILM.nightBlue` | 同上，只在 `FILM` 声明一次；场景只引用 | 夜空、雪夜 |
| `FG-09` | `FILM.fireGold` | 同上，只在 `FILM` 声明一次；场景只引用 | 两次「亮」、灯芯、针尖 |
| `FG-10` | `OBJECT.qinglv` | 侧影 260×340；四腿交替；身 S2、缰 S1；身 `colors.ink`、边光 `FILM.snowCyan`、缰 `colors.paperMuted` | S6 牵、S25 走、S36 只见缰 |
| `FG-11` | `OBJECT.jian` | 直刃汉剑：身 90、格方 18、鞘 96、穗 40 双股；刃 S2、格 S3、穗 S1；三态 `onBack` / `inSnow` / `onWall`；`onBack`/`onWall` 火燎痕朝内不可见，`inSnow` 可见 3 道；穗 `paperMuted` 不红 | S25、S35、S43、S44 |
| `FG-12` | `OBJECT.dukou` | 岸线 15°；芦苇 7–9 根、冰凌 3–5、渡船一弧；岸 S1、船 S2、苇 S1、冰 S0 | S5、S6、S7、S12、S25 同形三变 |
| `FG-13` | `OBJECT.shanmen` | 石阶 11 级（级高递减）、两柱一梁、门扇两片、门缝 1px、雾 3 条横线；柱 S3、梁 S2、阶 S1、雾 S0 | S30–S32、S48–S49 |
| `FG-14` | `OBJECT.jingjuan` | 经折装 5 折、展开 240×90、竖行 8 行以 8px 短横替代；边 S1、行 S1 | S36、S40 |
| `FG-15` | `OBJECT.foxiang` | 头形一弧 + 肩线 + 一只手 + 低眉一条弧；头 S2、眉 S2、手 S1；ink + snowCyan 边 | S37 仅此一镜 |
| `FG-16` | `OBJECT.tieluohan` | 40px 小铁人、圆头、三处关节、合掌；ink 填充 + `colors.accent` 1px | S27 递出 |
| `FG-17` | `OBJECT.jinzhen` | 三枚并排、长 46px、身 0.8px、间距 10；身 `paperMuted`、尖 `colors.gold` ≤2px | S10–S11 唯一 |
| `FG-18` | `FIGURE.crowd` | 12–20 个剪影/背影，无个体、无正脸，色温压暗（灰、褐、土黄） | S8、S13–S15、S17、S21、S28 |
| `FG-19` | `FIGURE.dizi` | 两列素衣背影，无个体特征，不抢焦点 | S39–S41 晨课 |
### 3.9 高频动效函数（FN，24）
| 编号 | 令牌 | 建议签名 / 配方 | 用途 |
|---|---|---|---|
| `FN-01` | subtitle-line | `subtitleLine(frame, start, text)`：逐字 2f 错峰 + `writeFade` 14f，`CV-01` | 10 条白话字幕 |
| `FN-02` | poem-line | `poemLine(frame, start, text, lock)`：衬线、2f/字、末字锁 `lock` | 诗六行；S2/S3/S25/S30/S32/S52 |
| `FN-03` | char-cell-12 | `charCell12(frame, local)` → `{shown, opacity}`；local 20/32/44/56 四个 12f 格 | S25 四字四蹄 |
| `FN-04` | text-lock | `textLock(frame, 7199)`：锁后恒 1，不再淡出 | S52 末字 |
| `FN-05` | paper-breathe | `paperBreathe(frame, 0.4)`：120f 周期、振幅 0.4 | S1/S2/S33/S52 |
| `FN-06` | freeze-hold | `freezeHold(frame, at)`：把子组件冻在 `at`；出镜尾必用 | 全片 |
| `FN-07` | gait-walk | `gaitWalk(frame, step, mode)`：human 40f/步、腿摆 ±14°、身浮 1.5px；donkey 12f/蹄、四蹄循环 48f | S25 驴、S30/S31 人 |
| `FN-08` | body-idle | `bodyIdle(frame, amp=1.5)`：90f 正弦，人群与她的站姿 | S8/S14/S21/S39/S40 |
| `FN-09` | cloth-sway | `clothSway(frame, amp=8, phase)`：三角波，后摆 ±8px，相位＝步相 | S6/S12/S14/S25/S30/S31/S48 |
| `FN-10` | ribbon-lag | `ribbonLag(frame, 6, 4)`：滞后步相 6f、摆幅 ±4px | 发带、衣带、剑穗；S30/S31/S43 |
| `FN-11` | head-lift | `headLift(frame, deg, dur)`：`CV-01`；S38 15f、S49 30f；风陵 8°、她 12° | S38、S49 |
| `FN-12` | eye-glint | `eyeGlint(frame, start, end)`：≤2px `FILM.fireGold`，2f 硬切进出，无 glow | S8 1140–1240、S18 2220–2320、S38 5100–5160 |
| `FN-13` | hand-action | `handAction(frame, mode)`：`brush-rest` 30f、`clench` 40f、`offer` 20f+6f 释放 | S4、S11、S13、S27 |
| `FN-14` | sword-cycle | `swordCycle(frame, phase)`：拔 40f、停 20f、收 30f；沿刃轴 transform，出雪带一小片 `PT-05` | S35 |
| `FN-15` | door-gap | `doorGap(frame, local)`：local 200–239，门缝 1→6px，`CV-04` | S30/S31 |
| `FN-16` | door-open | `doorOpen(frame, local)`：0→60°，90f，`SP-01`；光矩形 `clipPath` 从缝内扩出 | S32 |
| `FN-17` | light-step | `lightStep(frame, 11)`：11 级石阶，每级 4f 错峰，每级 2f 硬切 | S32 |
| `FN-18` | flame-step | `flameStep(frame)`：三档 opacity、2f 硬切、每 6f 1px 抖动 | S9/S15/S34/S36/S37/S38 |
| `FN-19` | firework-bloom | `fireworkBloom(frame, seed, center)`：18f 绽开 + 60f 下落，24–36 颗金屑 | S16–S19、S51 |
| `FN-20` | ash-drift | `ashDrift(frame, seed)`：30–50 颗灰点，慢落 + 横摆 | S20–S21 |
| `FN-21` | figure-to-dot | `figureToDot(frame, 120)`：scale 1→0.02、opacity 1→0.6 | S24 |
| `FN-22` | cloud-slow | `cloudSlow(frame, 150)`：`translateX ≤3%`，`CV-04` | S45–S51 |
| `FN-23` | paper-action | `paperAction(frame, mode)`：`stack` 每页 +8px、10f 错峰；`fold` 20f 合卷 | S28/S29/S40 |
| `FN-24` | turn-away | `turnAway(frame, local)`：肩先动 14°、头不转、三步入雾 12f/步 | S22–S24 |
## 4. 全镜覆盖矩阵（52/52）
> 首列为镜号与帧；后四列即 **入场 / 持续 / 出场 / 转场**。每格引用 §3 已定义令牌；转场列写「出镜尾帧 → 交接态」，「→ Sx：…」读作本镜尾帧冻结为该交接态、由 Sx 首帧承接，溶解/硬切令牌写在箭头前。帧号为定稿，不得改动。

| 镜·帧 | 入场 | 持续 | 出场 | 转场（尾帧 → 交接态） |
|---|---|---|---|---|
| S1 0–180 | `PT-01` `PT-02` `GR-01` | `CM-01` `CM-02` `FN-05` `PT-03` | `FN-06` 纸面冻帧 | `TR-01` → S2：纸白满幅 / 侧光右上 |
| S2 180–420 | `PT-10` `CV-04` `GR-07` | `CM-01` `PT-01` `FN-05` | `CM-11` 远山退淡 `FN-06` | `TR-01` → S3：墨青山脊 / 留白六成 |
| S3 420–660 | `PT-09` `PT-10` `CM-05` | `CM-05` `CM-10` `PT-03` | `PT-09` 收静线 `FN-06` | `TR-02` 8f → S4：墨蓝水线 |
| S4 660–720 | `TR-02` `FG-01(old)` `FN-13` | `CM-09` `CM-02` | `FN-13` 手退出 10f `FN-06` | `TR-04` 20f → S5：纸面静物 → 纸白化暮色 |
| S5 720–800 | `TR-04` `GR-03` `PT-09` | `CM-01` `PT-08` `PT-03` | `CM-11` 水面浅景深 | `TR-01` → S6：土黄渡口大全景 |
| S6 800–980 | `FG-01(16)` `FG-10` `FG-07` `FN-09` | `CM-02` `FN-09` `PT-08` `CM-10` | `CM-11` 船影靠近 `FN-06` | `TR-01` → S7：牵驴背影 / 河面船影 |
| S7 980–1080 | `FG-01(16)` `FN-18` `GR-03` | `CM-11` `PT-08` | `FN-06` 灯下剪影 | `TR-03` → S8：灯下剪影 → 暖光接暖光 |
| S8 1080–1260 | `TR-03` `FG-18` `GR-02` `FN-08` | `CM-10` `CM-11` `FN-12` `PT-03` | `FN-12` 收 20f `FN-06` | `TR-01` → S9：火塘余烬 / 她的侧影 |
| S9 1260–1320 | `FN-18` `PT-03` `GR-02` | `CM-09` `FN-18` | `FN-06` 余烬未灭 | `TR-02` 8f → S10：余烬微光 |
| S10 1320–1440 | `TR-02` `FG-17` `CM-09` `SP-03` | `CM-09` `PT-12` `PT-03` | `FN-06` 掌心金针 | `TR-01` → S11：掌心金针 |
| S11 1440–1560 | `FG-17` `FN-13` | `CM-09` `PT-12` | `CM-03` 后拉 2% `FN-06` | `TR-01` → S12：合掌 / 指缝一线金 |
| S12 1560–1620 | `FG-01(16)` `FG-12` `FN-09` | `CM-04` `PT-08` `CM-10` | `CM-04` `FN-06` | `TR-02` 8f → S13：空渡口 |
| S13 1620–1700 | `TR-02` `FG-18` `GR-03` `CM-08` | `CM-08` `FN-13` | `FN-06` 军报展开 | `TR-01` → S14：城门口人群 |
| S14 1700–1860 | `FG-01(16)` `FG-18` `FN-08` | `CM-01` `FN-08` `PT-03` | `FN-09` 人群挤紧 `FN-06` | `TR-01` → S15：人群外一点 |
| S15 1860–1980 | `FG-18` `CM-06` | `CM-06` `CM-10` `PT-03` | `FN-18` 灯全亮 `FN-06` | `TR-01` → S16：满城抬头前一刻 |
| S16 1980–2100 | `PT-06` `FN-19` `GR-05` `FG-09` | `CM-01` `PT-06` `PT-01` | `PT-06` 未落 `FN-06` | `TR-01` → S17：火金夜空 |
| S17 2100–2220 | `FG-18` `CM-05` `GR-05` | `CM-05` `PT-06` `PT-03` | `PT-06` 金屑落 `FN-06` | `TR-01` → S18：仰头人群剪影 |
| S18 2220–2340 | `FG-01(16)` `CM-09` `CM-10` | `FN-12` `PT-06` | `FN-12` 收 `FN-06` | `TR-01` → S19：一只被照亮的眼睛 |
| S19 2340–2430 | `PT-06` `GR-05` `CM-01` | `PT-06` `PT-01` | `CV-02` 光退 `FN-06` | `TR-01` → S20：将散的火金 |
| S20 2430–2560 | `PT-04` `PT-06` `CM-06` | `CM-06` `PT-04` `FN-20` | `FN-20` 灰落肩 `FN-06` | `TR-01` → S21：肩上的灰 |
| S21 2560–2700 | `FG-01(16)` `FG-18` `CM-01` | `FN-08` `PT-04` `GR-02` | `CM-11` 余光退 `FN-06` | `TR-02` 8f → S22：空场与一点余光 |
| S22 2700–2880 | `TR-02` `FG-01(16)` `FG-02` `PT-07` `GR-07` | `CM-01` `PT-07` `FN-08` | `FN-24` 入雾 `FN-06` | `TR-01` → S23：雾中背影 |
| S23 2880–3000 | `PT-07` `CM-11` | `PT-07` `CM-10` | `FG-02` opacity→0.15 `FN-06` | `TR-01` → S24：云海与小剪影 |
| S24 3000–3120 | `FG-01(16)` `FG-02` `PT-07` `CM-04` | `FN-21` `PT-07` | `FN-21` 成点 `FN-06` | `TR-09` 8f+0f → S25：云海与小点 |
| S25 3120–3360 | `TR-09` `FN-01` `FG-01(20)` `FG-10` `FG-11` `FN-03` | `CM-07` `CM-08` `FN-07` `FN-09` `PT-08` | `FN-03` 第四蹄 `FN-06` | `TR-01` → S26：驴背剑穗垂着 |
| S26 3360–3440 | `FG-13` `GR-07` `CM-01` | `PT-03` `PT-01` | `PT-08` 松针掠过 `FN-06` | `TR-01` → S27：门内暗处 |
| S27 3440–3600 | `FG-01(20)` `FG-16` `FN-13` | `CM-09` `CM-10` `PT-03` | `FN-13` 合拢 `FN-06` | `TR-01` → S28：合掌里的铁罗汉 |
| S28 3600–3680 | `FN-23` `FG-18` `CM-09` `GR-01` | `CM-09` `PT-10` | `FN-23` 推纸入画 `FN-06` | `TR-01` → S29：纸页叠起 |
| S29 3680–3840 | `FN-23` `CM-13` `PT-10` | `CM-13` `CM-09` `PT-03` | `FN-23` 摞高 `FN-06` | `TR-10` 16f → S30：高高的纸摞 |
| S30 3840–4080 | `TR-10` `FG-04` `FG-01(40a)` `GR-07` | `FN-07` `FN-09` `FN-10` `PT-07` | `FG-04` f239 `FN-15` `FN-06` | `TR-11` → S31：门缝一线光 / 将暗未暗（像素差 0） |
| S31 4080–4320 | `TR-11` `FG-04` `FG-01(40a)` `GR-07` f0 | `FN-07` `FN-09` `FN-10` `PT-07` | `FG-04` f239 `FN-15` `FN-06` | `TR-06` → S32：同一帧 / 门缝一线光 |
| S32 4320–4500 | `TR-06` `FN-16` `GR-05` `CM-03` | `FN-17` `CM-03` | `FN-06` 满门的光 | `TR-01` → S33：暖白满屏 |
| S33 4500–4560 | `GR-05` `FN-06` | `FN-05` `CM-01` | `FN-06` 冻帧 | `TR-07` 0f → S34：静止的暖白 → 同亮度硬切 |
| S34 4560–4700 | `TR-07` `PT-05` `GR-04` | `CM-02` `PT-05` `FN-18` | `PT-05` 盖墙一半 `FN-06` | `TR-01` → S35：雪墙与火光 |
| S35 4700–4860 | `FG-11` `FN-14` `PT-05` | `CM-09` `CM-06` `FN-14` `PT-05` | `FN-14` 收鞘 `PT-05` | `TR-02` 8f → S36：剑入鞘 |
| S36 4860–4980 | `TR-02` `FG-10` `FG-14` `GR-06` `FN-18` | `CM-09` `FN-18` `PT-01` | `FN-06` 案上三物 | `TR-01` → S37：缰绳与经卷并置 |
| S37 4980–5100 | `FG-15` `CM-06` `GR-06` | `CM-06` `FN-18` `PT-03` | `FN-06` 手印与灯同框 | `TR-01` → S38：灯与手 |
| S38 5100–5220 | `FG-01(40b)` `FN-11` | `FN-12` `CM-11` `PT-11` | `CM-11` 焦点移窗 `FN-06` | `TR-01` → S39：窗口天光 |
| S39 5220–5320 | `FG-19` `FG-01(40b)` `GR-06` | `CM-11` `PT-07` `FN-08` | `FN-06` 庭院晨课 | `TR-01` → S40：弟子列队 / 她在廊下 |
| S40 5320–5480 | `FG-01(40b)` `FG-19` `FN-23` | `CM-01` `FN-08` | `FN-06` 合卷 | `TR-01` → S41：合卷 / 弟子点头 |
| S41 5480–5640 | `FG-01(40b)` `FG-19` `CM-04` | `CM-04` `PT-03` | `FN-06` 空庭院 | `TR-02` 8f → S42：空庭院 / 影子还长 |
| S42 5640–5700 | `TR-02` `GR-06` `CM-09` `FN-06` | `PT-07` `CM-09` | `FN-06` 空钉 | `TR-05` 20f → S43：横钉空着 |
| S43 5700–5880 | `TR-05` `FG-11` `SP-02` `GR-06` | `CM-01` `FN-10` `PT-07` | `CM-11` 焦点移窗 `FN-06` | `TR-01` → S44：墙上的剑 / 穗子不动 |
| S44 5880–6000 | `FG-01(40b)` `FG-11` `GR-06` | `CM-01` `FN-06` | `CM-11` 光移墙 `FN-06` | `TR-02` 8f → S45：窗光 |
| S45 6000–6120 | `TR-02` `GR-08` `PT-07` `CM-03` | `CM-03` `PT-07` `PT-01` | `FN-06` 窗框与霞 | `TR-01` → S46：晚霞铺开一角 |
| S46 6120–6270 | `PT-07` `GR-08` `FN-22` | `CM-01` `FN-22` `PT-03` | `FN-06` 云海 | `TR-01` → S47：云海中央一点更亮 |
| S47 6270–6420 | `PT-07` `CM-11` `GR-08` | `CM-11` `PT-13` | `FN-06` 光中的空纸 | `TR-01` → S48：光中的空纸 |
| S48 6420–6540 | `FG-03` `GR-08` `FN-09` | `CM-02` `FN-09` `PT-07` | `FN-06` 阶上背影 | `TR-01` → S49：阶上背影 |
| S49 6540–6720 | `FG-03` `FN-11` `CM-02` | `CM-11` `GR-08` | `FN-06` 晚霞满天 | `TR-08` 0f → S50：视线交接 |
| S50 6720–6880 | `TR-08` `PT-07` `GR-08` | `FN-22` `PT-03` | `PT-06` 金点将浮 `FN-06` | `TR-12` 30f → S51：将浮出的金点 |
| S51 6880–7040 | `TR-12` `PT-06` `GR-05` | `CM-01` `PT-06` | `FN-06` 叠印稳定 | `TR-01` → S52：云霞与烟花同一帧 |
| S52 7040–7200 | `FN-02` `GR-05` | `FN-04` `FN-05` | `FN-04` 7199 冻结 | `TR-01` → FilmShell 片尾：叠印＋第 6 行完整 |
**矩阵自查**：52/52 行；每行 4 个相位格；所有引用在 §3 定义域内；4-4/5-1 共用 `FG-04`、`FG-01(40a)`、`GR-07` 与 `TR-11`。
## 5. 关键节奏
### 5.1 上山：40f/步、五步/立定
- **步频**：40f/一步（`RH-03` `FN-07`）；local 0–199 五步，200–239 立定；首步右脚，承重右→左→右→左→右。
- **位移**：脚底 y 929→670，总 259px，`CV-04` 缓出；scale 1→0.92（`FG-04`）；衣摆 ±8px、发带/衣带滞后 6f ±4px（`FN-09` `FN-10`）。
- **门缝与同构**：local 200–239 门缝 1→6px、光落阶上 ≤6px（`FN-15`）；S30 local＝全局−3840、S31 local＝全局−4080，同一 `<AscendBack f={0–239}>`、同 seed 雾/光尘、同调色层，**第 239 帧像素差分 0**（`FG-04` `TR-11`）。
### 5.2 S25「滴滴答答」四字与四蹄
- **四格**：滴 3140–3151（镜内 20–31，第 1 蹄@20）／滴 3152–3163（32–43，第 2 蹄@32）／答 3164–3175（44–55，第 3 蹄@44）／答 3176–3187（56–67，第 4 蹄@56）；每字 `RH-06` 12f。
- **其余**：「小毛驴」三字于 3120–3140 先落（20f，`FN-01`）；四字 3140–3188 逐字；其余 10 字各 10f（3188–3288），3288–3328 两拍收束（`RH-03`）。行区间 3120–3328（208f）。驴步 `FN-07` donkey 档 12f/蹄、四蹄循环 48f；只有前四蹄与四字同帧。
### 5.3 4320 断点：四件事同帧
**4320** = S31 第 239 帧（重放末帧）＝ 门开一线（S30/S31 local 239，门缝 6px）＝ 诗第 5 行「其」字起笔（S32 local 0）＝ 人称「她」→「我」切换。S32 起帧亦为 4320（分镜口径的第 4 件）；同帧、不同说法，帧号不动。
### 5.4 两处「亮」的起落拍
- **第一次·烟花**：起 1980f（第 99 拍 / S16），落 2430f（第 121.5 拍 / S20 起），峰值 1980–2340；`PT-06` `FN-19` `GR-05` `FG-09`。从下往上打光。
- **第二次·云霞**：起 6000f（第 300 拍 / S45），落 7200f（第 360 拍 / 正片末），峰值 6880–7040；`PT-07` `PT-06` `GR-05` `GR-08` `FG-09`。从平处铺开。两次同暖金，不同来处。
### 5.5 三次眼、三次光
S8 1140–1240 火塘（听来的火）／S18 2220–2320 烟花（别人放的火）／S38 5100–5160 佛前灯（她自己点的灯）；时长 100f／100f／60f，各 `FN-12`，均 L3：只给一只眼与颧骨一角，反光 ≤2px `FILM.fireGold`，无眼白、无瞳孔、无目光，脸的中轴不入画。
### 5.6 幕界与字幕拍位
幕界 0/720/1620/3120/4080/6000/7200 = 第 0/36/81/156/204/300/360 拍；16 条字幕起帧全部整拍：200/440/800/1100/1700/2560/3000/3140/3440/3680/3860/4320/5320/5700/6540/7040。
## 6. 交接态协议
1. **每镜最后一帧必须能冻成静帧**；出镜尾不得停在运动模糊中途。下一镜首帧从同一纸面、同一光位、同一剪影、同一门缝宽度起步。
2. **优先级**：同状态匹配（`TR-01`）→ 同材质硬切（`TR-03`）→ 6–10f 溶解（`TR-02`）→ 跨材质硬切只在同亮度/同材质时允许（`TR-07`）。
3. **S30→S31→S32**：S30 与 S31 共用 `FG-04`、`FG-01(40a)`、`GR-07` 与 `TR-11`，第 239 帧像素差分 0；S31 尾帧与 S32 首帧是同一帧，S32 的 `FN-16` 从该帧的门缝 6px 起开。
4. **非默认交接**（逐镜交接态见 §4 第 4 列）：

| 交接 | 令牌 | 说明 |
|---|---|---|
| S4→S5 | `TR-04` | 纸白化入暮色，20f；暖帘三档 `CV-06`，不做连续渐变 |
| S7→S8 | `TR-03` | 灯下暖光接火塘暖光，同材质硬切 |
| S9→S10 | `TR-02` | 余烬微光 → 掌心，8f 溶解；人物镜不用 blur |
| S24→S25 | `TR-09` | 云海小点冻 8f 后同材质硬切，J1 的物理落点 |
| S29→S30 | `TR-10` | 纸摞升高扫过画幅，16f 后露出远山雾 |
| S30→S31 | `TR-11` | 同组件、同 local 帧、同 seed；像素差分 0 |
| S31→S32 | `TR-06` | 同一帧起，门缝 6px → 60°；光从缝内扩出 |
| S33→S34 | `TR-07` | 暖白满屏同亮度硬切，雪从同一明度起步 |
| S42→S43 | `TR-05` | 空钉 → 剑挂墙，blur 8→0，20f；无人镜 |
| S44→S45 | `TR-02` | 暗室窗光 → 窗框，8f 溶解；人物镜不用 blur |
| S49→S50 | `TR-08` | 抬头角与视线方向匹配，0f 硬切，J4 |
| S50→S51 | `TR-12` | 蓝块金点浮出成烟花，两片金 30f 交叉 |
| S52→片尾 | `TR-01` | 7199 叠印＋第 6 行完整交给 FilmShell；正片内无黑场 |
其余溶解（`TR-02` 8f）：S3→S4、S9→S10、S12→S13、S21→S22、S35→S36、S41→S42、S44→S45；其余全部 `TR-01` 同状态交接。
5. **验收**：每个交接点做首尾帧像素对比；`TR-11` 必须 0 差分；`TR-07` 允许亮度差 ≤2 阶；其余允许 ≤1px 位移差。
## 7. 技术约束
- **全屏 `radial-gradient` 禁用。** 局部 radial 只允许三处：佛前灯 `PT-11` ≤80px、金针尖 `PT-12` ≤4px、朱砂印 ≤240px（仅 FilmShell）。暗角、晨光、灯侧光一律用四边 `linear-gradient` 或 `clipPath`。
- **半透明渐变改硬切。** `GR` 雾光层、门缝光、灯芯晕、`PT-13` 光带，全部用 `CV-06` 量化为 2–3 帧硬切；上述叠加层禁止连续 opacity 渐变（转场溶解仍按 `TR-02` 执行）。
- **禁 `<Audio>`。** 场景树不出现音频节点；「驴蹄/门开/剑出雪」三下由画面承担。
- **人物禁 glow / blur / 描边发光。** 人物 path 不做 `filter`，边光 ≤1.2px，明度差 ≥70%；`SILHOUETTE.onPaper/onInk` 只用实色；`CM-11`/`CM-12` 的景深属镜头层，不作用于人物 path。
- **随机只用 `random(seed)`。** 禁 `Math.random()`、`Date.now()`、`performance.now()`；seed 命名 `sNN-dust-i`、`sNN-snow-i`、`sNN-gold-i`、`sNN-ash-i`、`sNN-reed-i`；同 seed 在预览与渲染中同结果。
- **禁 `feTurbulence` / 墨迹扩散 / 位移噪声。** 纸纹用预渲染 tile（`PT-01`）；水纹用 `PT-09` 线段；山脊用 `PT-10` 描边生长。
- **线宽只用 `FG-05` 的 S0–S3 + F。** 不新增线宽，不开 `non-scaling-stroke`。
- **只动合成友好属性**：`opacity`、`transform`、`filter`（仅景深/调色）、`clipPath`、`mixBlendMode`、`strokeDasharray/offset`；禁 `width/height/top/left` 动画。
- **字体与素材**：只用 `brand/tokens` 的 `fontFamilies`；不引入新字体、不使用图片/影像素材。
## 8. 禁止项
| 禁止 | 替代 |
|---|---|
| 急推 | `CM-03` 缓推 ≤4%、`CM-13` slow-fast-slow；全片无 `cam-rush` |
| 甩镜 | `CM-05` 横移 ≤6%、rotate ≤0.3°；无 whip-pan |
| 正片红 | `colors.seal` 只在 FilmShell 片头；剑穗/针身 `paperMuted`，灯与火不红 |
| 写实脸 / 动漫脸 | L0–L3 四级制；无正脸、无双眼、无嘴、无鼻梁高光 |
| 杨过正脸 | `FG-02`：背影 + 空袖 + 雾；无侧脸、无下颌线、无剑 |
| 16 岁持剑 | 剑首现 S25（约 20 岁）；幕二、幕三无任何剑形 |
| SFX | 禁 `<Audio>`；三下「无声的响」由画面承担 |
| 镜头内切歌 | 不选曲、不切歌；只用 90 BPM 拍网格作卡点参考 |
## 9. 自查
- **矩阵**：52/52 行；208/208 格（4 相位 × 52）均有令牌；所有令牌引用在 §3 定义域内。
- **令牌总数**：**106** = CV 6 + SP 4 + RH 7 + CM 13 + PT 13 + TR 12 + GR 8 + FG 19 + FN 24。
- **零内联色值**：全文只写令牌名；三枚私有色只在 `motion-tokens.ts` 的 `FILM` 常量声明一次；场景无 hex / rgba / hsl。
- **零全屏 radial-gradient**：局部 radial 仅 `PT-11`、`PT-12`、FilmShell 朱砂印三处。
- **4-4 / 5-1 同构**：同一 `FG-04`、同一 local 帧、同一组令牌；第 239 帧像素差分 0。
- **帧数**：52 镜相加 7200；FilmShell 120 + 7200 + 180 = 7500；末帧 7199。
- **文本**：16 条字幕逐字未改；诗六行不改；「峨嵋」只在诗内。
- **禁项**：无 `<Audio>`、无 `Math.random()`、无 `feTurbulence`、无墨迹扩散、无人物 glow/blur。
## 10. 裁定记录（原待确认，2026-11-01）
1. **S25 行区间改为 3120–3328（208f）**：「小毛驴」三字 3120–3140 先落；「滴滴答答」四字 3140–3188 各 12f；其余 10 字 3188–3288；3288–3328 收束。剧本、分镜、本规范同步。
2. **S25 字数按 17 字重算**：3（小毛驴）+ 4（滴滴答答）+ 10（，倚天剑伴我走天涯。）；剧本 §4 的「其余 14 字 / 188f」已改为「其余 10 字 / 208f」。
3. **S30/S31 门缝统一 1px→6px**：f0–199 恒 1px，f200–239 开至 6px；`character-design.md` 与 `storyboard.md` 已同步。
4. **「全片唯一一次亮」统一改为「第一次亮」**：`script.md` 3-2、`materials.md` §2、`storyboard.md` S16 已同步；全片总纲仍是「两次亮」。
