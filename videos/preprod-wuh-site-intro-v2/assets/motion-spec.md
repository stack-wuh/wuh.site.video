# 《朝朝如念》｜wuh.site 介绍片 v2 · 动效设计规范（Motion Spec）

## 1. 版本与适用范围

> 版本 **v2**（2026-10-31）｜对齐 `assets/storyboard.md` **v2**（八幕 / **57 镜** / **7500 帧**；新增「入院」空间层）、`assets/script.md` v2 定稿、`assets/materials.md` v1
> 规格：正片 **7500 帧 = 4:10 @30fps**；FilmShell 片头 120 + 片尾 180 → 全片 **7800 帧 = 4:20**｜**90 BPM，1 拍 = 20 帧**｜57 镜｜**全片无 SFX**
> 范围：仅正片 0–7500；120f 片头、180f 片尾由 FilmShell 承担，不在本规范内。
> 输入：`storyboard.md` v2、`script.md` v2、`materials.md` v1、`brand/motion.ts`、`brand/tokens.ts`、`brand/fonts.ts`；结构参照 `videos/preprod-site-film/assets/motion-spec.md`，内容全部按本片重写。
> **令牌总账：122 枚唯一令牌** = 曲线 7 + 弹性 7 + 节奏 6 + 镜头 15 + 粒子与材质 12 + 转场 26 + 调色 8 + 高频函数 41（复用 brand 10 + 新增 31）。原 108 令牌口径保留为骨架，新增「入院」空间层 12 个函数与 2 个转场。
> **覆盖声明：第 4 节矩阵 57/57 行 × 4 列**，每格均引用第 3 节令牌编号；转场列挂出镜尾帧并写明交接态；`※` 标注入场侧承接例外（效果在入镜头内完成）。

**编号前缀**

| 前缀 | 类别 | 数量 |
|---|---|---|
| `CV` | 运动曲线 Curve | 7 |
| `SP` | 弹性 Spring | 7 |
| `RH` | 节奏网格 Rhythm | 6 |
| `CM` | 镜头运动 Camera | 15 |
| `PT` | 粒子与材质 Particle/Texture | 12 |
| `TR` | 转场 Transition | 26 |
| `GR` | 调色 Grade | 8 |
| `FN` | 高频动效函数 Function | 41 |

---

## 2. 设计基调

### 2.1 一句话

**纸上的编年史。** 镜头是一双读旧账本的眼睛——看纸、看字、看墨点沿着时间轴慢慢走；不是无人机，不是科技发布会。新增的「入院」是这双眼睛第一次在一间暗色控制台里逐块检视这座房子：面板、墨点光标、块放大与收束，看的仍是封面、书架、唱片、留言板、热力图与页面纵深——暖光从暗色控制台里透出，始终停在纸与光的语汇里。

### 2.2 四条不可违反的基调

1. **纸上编年史。** 暖黑纸（`colors.bg`）与暖白纸（`colors.paper`）两种底，纸纤维噪点全程 ≤8%；需要区分纸面与纯底时只做 ±1 阶明度抬亮，不新增色相。年份、引语、题记用衬线；代码、数字、坐标用等宽；字幕是唯一黑体。
2. **墨点是时间轴的原点。** 2019 年落下（S1）、2025 年停在四步（S23 / S24）、入院时铺成 46 枚（S35）、2026 年重新洇开（S56 / S57 与开篇同形同位）。墨点统一暖黑芯、褐边；**只有印章用朱红**。
3. **数据可视化全部纸面化。** 提交柱＝纸柱、热力＝暖色格、版本＝光点雨、榜单＝纸页、书架＝书封墙。**禁止纯科技蓝发光 UI**；连旧站线框也只给中性冷灰微光，不给蓝色辉光。
4. **全片无 SFX。** 只写音乐点与节拍，不写音效资产；所有「落、点、闪」的听感由音乐与画面承担。场景树中禁止出现 `<Audio>`。

### 2.3 节奏性格

- **两起一坐，两段缓**：2021–2024 缓慢起身，2025 长坐，2026 两次起身；**Act 6 入院**是「暖的缓」——看房子；**Act 7 坐忘**是「深的缓」——坐下来。两段缓让 Act 8 的「满」不显得吵。
- **全片没有一次急推**：禁止 `cam-rush`、whip-pan、俯冲式 scale 冲击；速度曲线只允许缓起缓停。
- **唯一一次白闪**：S31→S32，峰值 4000f（第 201 拍），纯白只保持 3f；此前所有克制都为它让路。
- **第一记重音在 2520f**：2024-12-08 提交回车；重音靠「从空到有一行字」的落差与纸面轻震，不靠镜头冲击。
- **Act 7 零运镜**：S45 / S46（5664–6024）是全片唯一连续零运镜段，只有字的落下与光的变化，禁止漂移、呼吸、卡点切镜。
- **Act 6 入院（暗色控制台交互）**：8 镜统一按 16+82+16（114f）或 18+84+18（120f）三段呼吸；入场＝`TR-25` 红光→`FN-39` 面板→`FN-41` 墨点光标点击→`FN-40` 块放大；持续＝各块展示；出场＝`FN-40` 反向收束回面板 + `FN-41` 光标移向下一块；S42 八块全亮后收束成朱红晕光+纸页。除纸页翻卷 6–10f 交叉外不用溶解。

### 2.4 动效三原则

1. **状态先于运动。** 每镜先交付一个可冻结的交接态，再谈运动；转场优先「同一状态匹配」，其次才用溶解。
2. **留白先于信息。** 落定后至少留半拍到两拍（RH-02 / RH-06）再进下一事件；字幕与画面不同时争抢注意力。
3. **光从纸里来。** 光只从纸面、晨光、灯火、钤印与屏幕里的页面矩形里出现；不使用屏幕式发光、霓虹、扫描线、科技网格。

---

## 3. 令牌体系

### 3.1 曲线令牌（CV，7 枚）

| 编号 | 令牌 | Remotion 配方 | 用途 |
|---|---|---|---|
| `CV-01` | `cine-ease-out` | `Easing.out(Easing.cubic)`（同 `CURVES.cineEaseOut`） | 默认入场、落定、释放 |
| `CV-02` | `cine-ease-in` | `Easing.in(Easing.cubic)`（同 `CURVES.cineEaseIn`） | 墨滴落体、曲线断电下坠、蓄力、出场 |
| `CV-03` | `cine-ease-in-out` | `Easing.inOut(Easing.cubic)`（同 `CURVES.cineEaseInOut`） | 所有镜头运动、位移、交叉溶解 |
| `CV-04` | `cine-accent` | `Easing.out(Easing.back(1.2))`（同 `CURVES.cineAccent`） | 灯亮、回弹、压印收尾；本片只低幅使用 |
| `CV-05` | `staccato` | `interpolate(frame, [0, 0.28D, 0.72D, D], [0, 0.82, 0.88, 1], { easing: CV-03 })`（D=令牌时长） | 顿挫：行级替换、白闪前摇、骤停 |
| `CV-06` | `white-flash-in` | `Easing.in(Easing.quad)`（同 `CURVES.whiteFlashIn`） | 唯一白闪末段涨满（4f） |
| `CV-07` | `num-roll-out` | `Easing.out(Easing.poly(4))`（同 `CURVES.numRollOut`） | 数字、计数、页数落定 |

### 3.2 弹性令牌（SP，7 枚）

| 编号 | 令牌 | spring config | 用途 |
|---|---|---|---|
| `SP-01` | `seal-stamp` | `{ damping: 11, stiffness: 220, mass: 0.9 }`（同 `SPRINGS.sealStamp`） | 印章 squash + 微旋 |
| `SP-02` | `spring-pop` | `{ damping: 9, stiffness: 180, mass: 0.8 }`（同 `SPRINGS.springPop`） | 小元素轻弹出；仅卡、灯、节点，克制使用 |
| `SP-03` | `heavy-glide` | `{ damping: 200, stiffness: 60 }`（同 `SPRINGS.heavyGlide`） | 纸页、纸卡、书封重落 |
| `SP-04` | `cam-follow` | `{ damping: 200, stiffness: 90 }`（同 `SPRINGS.camFollow`） | 镜头跟随预烘焙目标 |
| `SP-05` | `drag-follow` | `{ damping: 14, stiffness: 160 }`（同 `SPRINGS.dragFollow`） | 试墨拖拽、笔尖跟随 |
| `SP-06` | `block-drop` | `{ damping: 16, stiffness: 140, mass: 1 }`（新增） | 基石坠落，过冲 ≤6% |
| `SP-07` | `card-land` | `{ damping: 22, stiffness: 110, mass: 1.2 }`（新增） | 卡片落位压实，无回弹 |

### 3.3 节奏令牌（RH，6 枚）

| 编号 | 令牌 | 帧数 | 用途 |
|---|---|---|---|
| `RH-01` | `beat` | **20f** | 主网格；事件落点默认吸附整拍 |
| `RH-02` | `half-beat` | **10f** | 半拍；卡片入位、字落下、灯逐盏 |
| `RH-03` | `double-beat` | **40f** | 2 拍；纸页推移、段落停顿 |
| `RH-04` | `sixteenth` | **5f** | 16 分格；热力格、版本雨、技能灯 |
| `RH-05` | `phrase` | **80f** | 4 拍短语；题记、金句的句级节奏 |
| `RH-06` | `rest-2` | **40f** | 2 拍静止；落定后的留白，不安排事件 |

> 所有令牌时长以帧计；30fps，不用秒。对拍容差：元素事件 ±2f；幕界与重音锚点 0f。

### 3.4 镜头运动令牌（CM，15 枚）

> 统一三层 `CameraRig`：`FrameMask`（取景框，`overflow: hidden`）→ `CameraRig`（推拉摇移升降全在这层）→ 内容三层（远景 depth 0.4 / 主体 1.0 / 前景 1.6）。视差公式 `层位移 = 镜头位移 × (depth − 1) × −1`；景深等效 `blur = 基准值 × |depth − 1|`。镜头令牌一律 `CV-03`；「匀速」段落用 `CM-15` 的 `plateau` 档，不用线性。

| 编号 | 令牌 | 配方 | 典型参数 |
|---|---|---|---|
| `CM-01` | `cam-hold` | 全参数恒定；可叠 `CM-02`（Act 7 零运镜段禁止叠） | — |
| `CM-02` | `cam-drift` | `translate ±4px` + `rotate ±0.15°` 低频正弦，周期 120f，与 `FN-05` 相位错开 | 常驻 |
| `CM-03` | `cam-dolly-in` | `scale 1→1+D`，`CV-03`，`transformOrigin` 对准落点 | D=0.02–0.05；S14 绿灯 1.05 |
| `CM-04` | `cam-dolly-out` | `scale 1→1−D`，`CV-03` | D=0.02–0.10；S15 长后拉、S43 纸页退成窗框 |
| `CM-05` | `cam-pan` | `translateX` 为主 + `rotate ±0.5°` 微倾 | 60–120f；S23 正侧、S39 轻微横摇、S51 斜向跟摇 |
| `CM-06` | `cam-tilt` | `translateY` + `rotateX ≤2°` 近似俯仰；叠 `CM-12` 视差 | S5 微俯、S16 下摇、S35 下移 12%、S55 斜下摇 |
| `CM-07` | `cam-truck` | 纯 `translateX`，无 rotate；「匀速」用 `CM-15 plateau` | S3、S6、S13、S30、S36、S41、S49 |
| `CM-08` | `cam-crane` | `translateY` + 前后层视差差模拟吊臂弧线，`CV-03` | S12 俯降、S28 火簇上摇、S48 桌面俯降 |
| `CM-09` | `cam-follow` | 目标路径预烘焙，rig 用 `SP-04` 追随，无过冲 | S6、S18 轻跟纸流 |
| `CM-10` | `cam-orbit` | 同心旋转：camera `rotate(θ)`、内容层 `rotate(−θ)` 保持相对静止；或椭圆参数化做 2.5D 弧线 | S38 黑胶同心、S50 星轨 |
| `CM-11` | `cam-macro` | `scale 1.1–1.6` + 浅景深（`CM-12`），焦点锁定 | S9、S11、S19、S20、S38、S44、S47、S52、S56 |
| `CM-12` | `dof-parallax` | 三层 depth 0.4 / 1.0 / 1.6；位移与 blur 按 3.4 节公式 | 全片常驻 |
| `CM-13` | `dof-focus-pull` | 两层 blur 交叉插值，`CV-03` | 常规 20f；S8 / S31 快速档 18f；S43 末 20f |
| `CM-14` | `dof-breath` | 全层 blur 基准 ±0.5px 低频正弦，周期 120f | 常驻；Act 4 / Act 7 减半 |
| `CM-15` | `cam-ramp` | 速度包络：`constant-slow`（前后 10% 极缓、中段近匀速）、`slow-fast-slow`、`slow-pause-slow`；分段用 `CV-03`，禁线性 | S3、S10、S13、S15、S19、S24、S29、S31、S49、S51、S53 |

> **本片没有 `cam-rush`。** 分镜明确「全片没有一次急推」；S20 的 2520f 重音不使用推镜撞击，改用 `FN-17` 纸面轻震 + `CM-03` 缓推。

### 3.5 粒子与材质令牌（PT，12 枚）

| 编号 | 令牌 | 配方 | 用途 |
|---|---|---|---|
| `PT-01` | `ink-drop` | 局部 radial blob（核心 10–14px），`translateY` 自由落体 30f，`CV-02`；触纸触发 `PT-02` | S1、S22、S23、S35、S39、S40、S57 |
| `PT-02` | `ink-bloom` | 触纸 6f 洇开：scale 0.2→1 + 三层 blur（12/6/2px）错峰收缩；噪声位移 mask 预渲染 | S1、S34、S42 朱红晕开 |
| `PT-03` | `ink-ripple` | 双圆环 scale 0→3 + opacity 0.6→0，错 8f，半径 ≤6% 画幅 | S1、S40 / S54 峰值墨点圈 |
| `PT-04` | `ink-speck` | 每字 2–3 颗 3px 粒子，初速向上外侧 + 微重力，life 18f（600ms） | S56 打字机溅墨 |
| `PT-05` | `dust-field` | N 颗 2–5px 光尘，`random("sXX-dust-i")` 定位/速度/相位；下坠漂移 + 水平正弦；opacity 正弦 120f | 全片贯穿；密度见表 3.5.1 |
| `PT-06` | `dust-ascend` | `PT-05` 反重力变体：速度取负、灰化、低 opacity | S24 空白段尘埃 |
| `PT-07` | `paper-grain` | 预渲染噪点 tile，`mixBlendMode: overlay`，opacity ≤8% | 全片纸底 |
| `PT-08` | `paper-fiber` | 空白处纸纤维生长：种子化 1px 短 strokes 从边缘长出，30f | S24 8–11 月空白 |
| `PT-09` | `version-rain` | 116 颗版本光点（v1.0.1→v1.4.97）斜落，落点沿 2026-08-22→10-27 区间；每颗落定闪 6f | S49 预告、S51 版本雨 |
| `PT-10` | `star-orbit` | 星轨环：1 圈轨道 + 3 节点，参数化 `x=cx+rx·cosθ, y=cy+ry·sinθ`；慢转 | S49 末、S50、S51 起 |
| `PT-11` | `spark-cluster` | 21 颗提交火花向 2025-12 刻度聚拢，火苗短促、不做爆炸 | S28 |
| `PT-12` | `paper-flow` | 纸页流：约 12 张代表纸页做翻飞/位移，密度由翻页频率与计数表达；不逐页渲染 30/59 个节点 | S18 |

**表 3.5.1 `PT-05` 光尘密度曲线（按幕）**

| 幕 | 密度（颗） | 速度档 | 配色 |
|---|---|---|---|
| Act 1 墨点 | 40–60 | 慢 | 暖金 90 / 朱红 10 |
| Act 2 旧屋 | 30 | 慢 | 暖金 85 / 灰 15 |
| Act 3 第一行 | 40→55（随纸流上扬） | 中 | 暖金 80 / 朱红 20 |
| Act 4 留白 | 10–18 | 极慢 | 灰金 90 / 朱红 10 |
| Act 5 灯亮 | 50 | 中 | 暖金 90 / 灯火琥珀 10 |
| Act 6 入院 | 25–35（控制台微尘） | 慢 | 暖金 80 / 灯火琥珀 20 |
| Act 7 坐忘 | 15 | 极缓 | 暖金 70 / 纸白 30 |
| Act 8 此刻 | 70（版本雨后增密） | 慢→快→慢 | 暖金 90 / 朱红 10 |

### 3.6 转场令牌（TR，26 枚）

> 默认协议：**交接态匹配**——出镜最后一帧冻结交接态，入镜第一帧从同一状态起步（位置、scale、opacity、光点位置、纸纹相位一致）；必要时叠 6–10f 交叉溶解。硬切只允许在同材质段落（如 2970 曲线断电）；6132 纸页淡出属同材质软过渡，不做异质硬切。`※` 为入场侧承接：效果在入镜头内完成，出镜尾只保持冻帧。

| 编号 | 令牌 | 配方 | 时长/尾帧 |
|---|---|---|---|
| `TR-01` | `handoff-match` | 默认交接：冻结 + 状态匹配；必要时 6f 交叉 | 0–6f |
| `TR-02` | `cross-dissolve` | 两镜 opacity 交叉，`CV-03` | 6–10f |
| `TR-03` | `page-flip` | `FN-23` 全屏化：rotateY 0→−90°（或 +90°），纸缘阴影扫过，剪点落在半翻 | 20–30f |
| `TR-04` | `paper-seam-push` | 纸缝/窗框作 wipe：mask 边缘穿越 + camera scale 1→1.08；参数 `aperture: 'seam' 或 'window'` | 20–40f |
| `TR-05` | `paper-unfold` | 纸页自折线展开：`clipPath inset` 100%→0 + `rotateX 2°→0` | 24–36f |
| `TR-06` | `mask-sweep` | 一张纸页/色带横扫画面，带走/带出内容 | 20–30f |
| `TR-07` | `sink-to-bed` | 内容 opacity→0.2、blur→2px、scale→0.98，沉为底纹 | 24f |
| `TR-08` | `screen-enter` | 推入屏幕：scale 1→1.12 + mask 收至屏幕矩形 | 24f |
| `TR-09` | `window-shrink` | UI 缩为旁窗：scale 1→0.4 + 移至角落；入镜终端 0.6→1 | 18f |
| `TR-10` | `light-sink` | brightness 1→0.35 + 暗角 0→0.6，光自己退 | 40–60f |
| `TR-11` | `paper-edge-follow` | 跟纸缘入画：mask 边缘随纸缘推进；S35 末墨点放大成纸缘后由它接管 | 24f |
| `TR-12` | `line-to-seal` | 代码行压缩为印面：text scale 1→0.82、clip 成矩形、朱红边框描出 | 22f |
| `TR-13` | `dust-reveal` | 尘埃/气泡 opacity 0.6→0，下一场景 opacity 0→1 | 30f |
| `TR-14` | `focus-emerge` | 出镜元素 blur 0→8px 退场，入镜光点/照片卡 blur 8→0 浮出 | 20f |
| `TR-15` | `defocus-darken` | 列表 blur 0→6px + brightness 1→0.55 | 40f |
| `TR-16` | `white-light-line` | 1–2px 横线，宽度 0→40%、opacity 0→0.3；不铺满屏 | 10f（3986–3996） |
| `TR-17` | `white-flash` | 暖白 `FILM_COLORS.flashWhite` 30%→100%（4f，`CV-06`）→ 纯白 3f（4000–4003）→ 释放 12f（4003–4015，`CV-01`）；全片唯一 | 跨 3996–4015（峰值 4000） |
| `TR-18` | `morning-bleed` | 晨光/暖光带从边缘或顶部渗入，`GR-06` 雾光层 opacity 0→0.5 | 40f |
| `TR-19` | `page-fade-to-scene` | 纸页 opacity 1→0，书桌场景从下方显影（brightness 1.4→1） | 30f |
| `TR-20` | `disc-morph` | 书封翻面成黑胶圆盘剪影 / 光点汇成唱片；参数 `mode: 'cover' 或 'dots'`；rotateY + scale + clip | 30f |
| `TR-21` | `disc-dim` | 圆盘退暗/淡出，下一场景从金线显影 | 20f |
| `TR-22` | `fleet-fade` | 舰队 opacity→0 + 上浮 6px，回到开篇纸面（入场侧） | 24f |
| `TR-23` | `stack-slide` | 纸山/纸页堆横移出画，露出时间轴（入场侧） | 30f |
| `TR-24` | `final-fade` | brightness 1→0 + 暗角收至 0；墨点余光保留到 7498 | 20f（7480–7500） |
| `TR-25` | `seal-red-unfold` | 钤印红光局部晕开（radial ≤40% 画幅）→ 纸页翻起/立起成窗；参数 `target: 'page' 或 'window'` | 16f |
| `TR-26` | `gold-line` | 碟缘光拉伸成 2px 金线（scaleX 0→1）→ 旋转垂落成留言板纵线（scaleY 0→1）；参数 `direction: 'h-to-v'` | 16f |

### 3.7 调色令牌（GR，8 枚）

> 每个 grade = **底色层**（纯色/色值 + blend + opacity）＋**雾光层**（渐变 + screen，禁止全屏 radial）＋**全局滤镜**（saturate / brightness）。叠加层挂在 `FrameMask` 之上、内容之下；幕间切换前 40f 做 opacity 交叉（`CV-03`）。色值只从 `brand/tokens` 的 `colors` 引用；品牌没有的灰调/晨光/空白纸值，统一放进影片私有 `motion-tokens.ts` 的 `FILM_COLORS`，场景内禁止内联。

| 编号 | 令牌 | 底色层 | 雾光层 | 全局滤镜 | 用途 |
|---|---|---|---|---|---|
| `GR-01` | `warm-black` | `colors.bg` multiply @35% | 四边 linear-gradient 暗角 | saturate 0.90 | Act 1、暗场、S19、S23、S31、S35 控制台 |
| `GR-02` | `warm-white-paper` | `colors.paper` 铺底 | `FILM_COLORS.paperMist` screen @6% | saturate 0.98 | 纸面主场景（S2–S7、S17、S33–S34、S36–S48、S56–S57） |
| `GR-03` | `seal-red` | `colors.seal` soft-light @18% | 印章局部 radial（≤240px） | saturate 1.02 | S3、S7、S9、S21、S34、S42、S47 |
| `GR-04` | `warm-gold` | `colors.gold` soft-light @20% | `FILM_COLORS.goldMist` screen @6% | saturate 1.00 | S5 暖光、S8 暗暖、S17 暖金、S28 火簇、S29 柱体、S32 灯火、S35 控制台 |
| `GR-05` | `ash-grey` | `FILM_COLORS.grey` multiply @30% | `FILM_COLORS.greyMist` screen @6% | saturate 0.55 | S16–S17、S23–S27 沉默段 |
| `GR-06` | `dawn` | `colors.gold` soft-light @25% | 顶部 `FILM_COLORS.dawnLight` linear-gradient | saturate 1.00，brightness 1.02 | S28 暖光带、S43 七月光、S48–S49 晨光 |
| `GR-07` | `night-lights` | `colors.bg` multiply @40% | 局部 `FILM_COLORS.lampAmber` 窗光（每个窗独立 radial，不铺屏） | saturate 0.95 | S32、S42 灯火夜景 |
| `GR-08` | `fade-black` | `FILM_COLORS.nearBlack` multiply @60% | 暗角收拢 | brightness 1→0 | S25 末、S57 末 |

**表 3.7.1 `FILM_COLORS`（影片私有常量，声明在 `motion-tokens.ts`；场景内禁止内联）**

| 名称 | 规范示意值 | 用途 |
|---|---|---|
| `FILM_COLORS.grey` | `#3A3A38` | `GR-05` 灰调底色 |
| `FILM_COLORS.greyMist` | `#8A8A86` | `GR-05` 雾光 |
| `FILM_COLORS.goldMist` | `#F5E9C8` | `GR-04` 雾光 |
| `FILM_COLORS.paperMist` | `#FFF8EC` | `GR-02` 雾光 |
| `FILM_COLORS.flashWhite` | `#FFF8F0` | `TR-17` 白闪暖白；峰值仍为纯白 |
| `FILM_COLORS.blankPaper` | `#F6F1E7` | 6-7 空白纸页（暖白，不是纯白） |
| `FILM_COLORS.nearBlack` | `#060505` | `GR-08` 收黑底色 |
| `FILM_COLORS.statusGreen` | `#6FA36F` | S14 三节点绿灯（全片唯一绿色，不做发光） |
| `FILM_COLORS.lampAmber` | `#D9A05B` | `GR-07` 窗灯琥珀 |
| `FILM_COLORS.dawnLight` | `#F3E6C8` | `GR-06` 晨光 |
| `FILM_COLORS.wireGrey` | `#B9B4A8` | S4 / S5 旧站线框冷灰微光（非蓝） |

> 表中十六进制仅为规范示意；实现时场景只能引用 `GRADES` / `FILM_COLORS` 常量，不得写 `#RRGGBB` 或 `rgba(...)` 字面量。

### 3.8 高频动效函数（FN，41 枚）

#### 3.8.1 复用 `brand/motion.ts` 既有基元（10 枚）

| 编号 | 令牌 | 现有签名 | 本片用法 |
|---|---|---|---|
| `FN-01` | `ink-rise` | `inkRise(frame, delay=0): CSSProperties` | 年份、标签、小字、标注、信笺节点浮起 |
| `FN-02` | `write-fade` | `writeFade(frame, delay=0, slow=false): CSSProperties` | 题记、宣言、金句、落版数字；S55 用默认档 |
| `FN-03` | `typewriter-type` | `typeChars(frame, total, start=TYPE.firstChar): number` | S20 代码键入、S56 标语；**建议扩展 `fpc?: number` 第四参**，S20 传 2.4、S56 传 5 |
| `FN-04` | `num-roll` | `numRoll(frame, delay, dur, from, to): number` | 页数、提交数、榜单阅读数、柱顶数字 |
| `FN-05` | `paper-breathe` | `paperBreathe(frame, amp=1): CSSProperties` | 纸面呼吸；Act 4 / Act 7 传 amp 0.5 |
| `FN-06` | `glow-pulse` | `glowPulse(frame, amp=1, period=60): CSSProperties & { opacity }` | 灯火、墨点余光、印章朱晕；极淡档 amp 0.4 |
| `FN-07` | `eq-bars` | `eqBars(frame, freezeAt?): number[]` | S38 三墨柱、S52 波形/EQ；直接循环 |
| `FN-08` | `dye-drain` | `dyeDrain(frame, delay=0): CSSProperties` | S10 PM2 熄灭、S16 整页蒙灰、S52 播放键降级变灰 |
| `FN-09` | `seal-stamp` | `sealStamp(frame, delay, fps, tilt): CSSProperties` | 所有印章（日期章、闲章、提交章、重启钤印、22px 联系章、小章） |
| `FN-10` | `seal-tilt` | `sealTilt(seed: string): number` | 每个印章的藏印微旋，seed 用镜号 |

#### 3.8.2 新增建议（31 枚，签名供 `motion-tokens.ts` 落地）

| 编号 | 令牌 | 建议签名 | 说明 |
|---|---|---|---|
| `FN-11` | `block-drop` | `blockDrop(frame, delay, fps): CSSProperties` | 基石 120px 下落 + `SP-06` 回弹 ≤6%，`opacity 0→1` |
| `FN-12` | `card-fly` | `cardFly(frame, delay, dur, from: Pose, to: Pose): CSSProperties` | 弧线飞入/滑入/退出；`Pose = { x, y, rot, scale }`，`CV-01`/`SP-07` |
| `FN-13` | `cascade-stagger` | `cascadeStagger(index, step=20, base=0): number` | 万能错峰，返回 delay；20f＝整拍，10f＝半拍 |
| `FN-14` | `cursor-blink` | `cursorBlink(frame, start, period=20, count=2): number` | 返回 0/1；S20 两闪、S57 停住不再闪 |
| `FN-15` | `line-replace` | `lineReplace(frame, delay, dur=12): { opacity: number; flash: number }` | 行级替换：旧行退、新行入，`flash` 驱动低强度白闪 |
| `FN-16` | `pipeline-node` | `pipelineNode(frame, delay, fps): CSSProperties` | 节点 scale pop + 绿色进度覆盖层；绿色只在 S14 使用 |
| `FN-17` | `paper-shake` | `paperShake(frame, delay, amp=2, decay=12): CSSProperties` | 盖章/回车时纸面 2px 位移 + 0.15° 旋转，指数衰减 |
| `FN-18` | `bar-grow` | `barGrow(frame, delay, fps): CSSProperties` | 垂直生长柱：纸柱/桅杆灯柱 scaleY 0→1（origin bottom），带纸纹/灯芯 |
| `FN-19` | `counter-flip` | `counterFlip(frame, delay, dur, from, to): { value: number; flip: number }` | 数字翻牌：`flip` 驱动 rotateX；先快后慢 |
| `FN-20` | `heat-wave` | `heatWave(frame, delay, col, row, step=0.5): CSSProperties` | 热力格按 `col+row` 波次点亮；opacity + scaleY |
| `FN-21` | `path-draw` | `pathDraw(frame, delay, dur, length): CSSProperties` | `strokeDasharray/offset`；笔锋、时间轴、双曲线、流水线、细线 |
| `FN-22` | `pen-glow` | `penGlow(frame, x, y): CSSProperties` | 28px 局部 radial 笔尖微光；只允许固定小尺寸 |
| `FN-23` | `page-flip` | `pageFlip(frame, delay, dur, dir: 'left' 或 'right'): CSSProperties` | rotateY + 纸缘阴影；`transform-origin` 在折线侧 |
| `FN-24` | `light-on` | `lightOn(frame, delay, fps): CSSProperties` | 灯亮：opacity + 2px 上浮 + 小 scale pop（`SP-02`） |
| `FN-25` | `needle-settle` | `needleSettle(frame, delay, amp=2): number` | 仪表/唱针：0→微偏→0 的阻尼正弦，返回角度；S38 唱针 12f |
| `FN-26` | `vinyl-spin` | `vinylSpin(frame, period=150): number` | 黑胶 5s/圈（150f）线性旋转；物理匀速，品牌线性禁例的显式例外 |
| `FN-27` | `version-dot-land` | `versionDotLand(frame, delay, seed): { y: number; flash: number }` | 版本光点斜落 + 落定闪一次 |
| `FN-28` | `orbit-drift` | `orbitDrift(frame, cx, cy, rx, ry, omega, phase): { x, y }` | 星轨/刻度环参数化；omega 可为 0（静态环） |
| `FN-29` | `letterpress` | `letterpress(frame, delay, step): CSSProperties` | 铅字压印：逐字 opacity + `translateY(2px)→0` + 文本压痕阴影 |
| `FN-30` | `shimmer-sweep` | `shimmerSweep(frame, delay, dur=45): CSSProperties` | 骨架屏微光横扫：120–240px 线性亮带 `translateX` 掠过，`mixBlendMode: screen`，opacity 峰值 0.12；1.5s=45f |
| `FN-31` | `book-cascade` | `bookCascade(frame, index, step=10, cols=36, rows=54): CSSProperties` | 书封级联落架：scale 0.92→1 + opacity 0→1 + translateY 8→0；逻辑网格 36×54，渲染预算 ≤240 可见封面（平铺），step 半拍 10f |
| `FN-32` | `barrage-bubbles` | `barrageBubbles(frame, index, side: 'left' 或 'right', step=10): CSSProperties` | 弹幕气泡左右交替：`translateX ±40px→0` + opacity，半拍错峰；无 SFX |
| `FN-33` | `color-morph` | `colorMorph(frame, delay, dur, from: Theme, to: Theme): CSSProperties` | 酒红/素雅主题插值：`interpolateColors` 驱动底色与文字色；每级 20f，两级各卡一拍；100–900 色卡用 `FN-13` 错峰 |
| `FN-34` | `page-depth` | `pageDepth(frame, delay, dur, path: PageRect[]): CSSProperties` | @view-transition 页面矩形纵深：首页→/music→/guestbook→/footprint→/topics，5 个矩形逐页 scale 1→1.12 + 纵深位移，每页半拍；用 CSS transform 模拟，不调用浏览器 view-transition API |
| `FN-35` | `ink-timeline` | `inkTimeline(frame, delay, count=46, sweep=40): Array<{ x: number; y: number; lit: number }>` | 站点墨点时间轴：46 枚墨点沿时间轴排布，2 拍（40f）内依次点亮；最后一枚可放大成纸缘 |
| `FN-36` | `hover-shift` | `hoverShift(frame, delay, activeIndex, from: number, to: number): CSSProperties` | 站内 hover 泛化：条目 `translateX 0→−6px` + 染色插值，10f；本片用定时 activeIndex 模拟 hover，不接真实鼠标 |
| `FN-37` | `marquee-drift` | `marqueeDrift(frame, speed=40): CSSProperties` | 迷你播放器跑马灯：内容首尾复制、`translateX` 线性循环 ~40px/s；物理匀速例外 |
| `FN-38` | `heat-deepen` | `heatDeepen(frame, day, activity, start, end): { background: string; opacity: number }` | 单格热力随帧从浅暖到深暖的连续插值（按 activity 决定终值），全局同一时间轴 ramp；无逐格扫描、无波浪；159 个活动日沉得更深 |
| `FN-39` | `console-panel` | `consolePanel(frame, activeIndex, litSet): CSSProperties` | 暗色控制台面板（分镜称 consoleShell）：细线网格 + 扫描线 + 8 块 tile（4×2）+ 等宽标签；品牌朱红/暖金高亮；`litSet` 保留已点亮块，累积不清空 |
| `FN-40` | `block-expand` | `blockExpand(frame, tileRect, progress): CSSProperties` | tile 边界 → 全屏的正向/反向最大化（分镜称 windowMax）：`clipPath` + `scale` + 四角边框残留；`progress 0→1` 展开、`1→0` 收束；与 `CM-03` 配合 |
| `FN-41` | `ink-cursor` | `inkCursor(frame, path, clickFrame): { dot: CSSProperties; ripple: number }` | 墨点光标（分镜称 cursorMove）：贝塞尔路径移动 + 悬停环 + 点击涟漪；`dot` 为暖黑墨点，`ripple` 0→1；全片墨点语言的延续，点击涟漪为局部环形，不是全屏 radial |

### 3.9 与 `brand/motion.ts` 的对账

| brand 导出 | 令牌 | 处理 |
|---|---|---|
| `CURVES.cineEaseOut` | `CV-01` | 直接复用 |
| `CURVES.cineEaseIn` | `CV-02` | 直接复用 |
| `CURVES.cineEaseInOut` | `CV-03` | 直接复用 |
| `CURVES.cineAccent` | `CV-04` | 直接复用 |
| `CURVES.whiteFlashIn` | `CV-06` | 直接复用 |
| `CURVES.numRollOut` | `CV-07` | 直接复用 |
| `SPRINGS.sealStamp` | `SP-01` | 直接复用 |
| `SPRINGS.springPop` | `SP-02` | 直接复用 |
| `SPRINGS.heavyGlide` | `SP-03` | 直接复用 |
| `SPRINGS.camFollow` | `SP-04` | 直接复用 |
| `SPRINGS.dragFollow` | `SP-05` | 直接复用 |
| `BPM = 90` / `BEAT = 20` / `HALF_BEAT = 10` | `RH-01` / `RH-02` | 直接复用；`RH-03`–`RH-06` 为组合常量 |
| `TYPE.framesPerChar = 3.3` | `FN-03` | 复用默认值；S20 / S56 通过新增 `fpc` 参数覆盖 |
| `inkRise` | `FN-01` | 直接复用 |
| `writeFade` | `FN-02` | 直接复用 |
| `typeChars` | `FN-03` | 复用 + 建议扩展 `fpc` |
| `numRoll` | `FN-04` | 直接复用 |
| `paperBreathe` | `FN-05` | 直接复用 |
| `glowPulse` | `FN-06` | 直接复用 |
| `eqBars` | `FN-07` | 直接复用 |
| `dyeDrain` | `FN-08` | 直接复用 |
| `sealStamp` | `FN-09` | 直接复用 |
| `sealTilt` | `FN-10` | 直接复用 |
| — | `CV-05` | 新增：`staccato` |
| — | `SP-06` / `SP-07` | 新增：`block-drop` / `card-land` |
| — | `RH-03`–`RH-06` | 新增：2 拍 / 16 分格 / 4 拍 / 2 拍静止 |
| — | `CM-01`–`CM-15` | 新增：镜头 rig 与景深 |
| — | `PT-01`–`PT-12` | 新增：粒子与材质 |
| — | `TR-01`–`TR-26` | 新增：转场（含入院红光翻页、金线垂落） |
| — | `GR-01`–`GR-08` | 新增：调色 |
| — | `FN-11`–`FN-41` | 新增：元素动效函数（含入院 12 个） |

### 3.10 落地文件建议

建议新建 `videos/preprod-wuh-site-intro-v2/motion-tokens.ts`（只本片使用）：

- `export { CURVES, SPRINGS, BPM, BEAT, HALF_BEAT, TYPE, inkRise, writeFade, typeChars, numRoll, paperBreathe, glowPulse, eqBars, dyeDrain, sealStamp, sealTilt } from '../../brand/motion';`
- `ANCHORS`：第 5 节的 15 个节奏锚点 + 9 个幕界帧。
- `GRADES`：`GR-01`–`GR-08`，色值从 `brand/tokens` 的 `colors` 引用；品牌没有的灰调、近黑、晨光、空白纸值放 `FILM_COLORS`。
- `DUST_DENSITY`：表 3.5.1。
- `TRANSITIONS`：`TR-01`–`TR-26` 的时长与参数（如 `whiteFlash: { riseStart: 3996, peak: 4000, hold: 3, release: 12 }`、`sealRedUnfold: { target: 'page' 或 'window' }`）。
- `SEEDS`：`s01-ink`、`s35-dot-{i}`、`s51-rain-{i}`、`s56-speck-{char}-{i}` 等命名约定，供 `random(seed)` 使用。

---

## 4. 全镜覆盖矩阵（57/57）

> 每镜一行，四列分别为 **入场（镜内起手）/ 持续（镜内常驻）/ 出场（镜内收束）/ 转场（挂出镜尾帧 + 交接态）**。`※` 表示转场效果在入镜头内完成（入场侧承接）；未标记者为出镜尾侧处理或默认交接。帧号为 storyboard v2 定稿，不得改动。Act 6 每镜按 16+82+16 或 18+84+18 写死入口/持续/出口。

| 镜 | 帧区间 | 入场 | 持续 | 出场 | 转场（尾帧/交接态） |
|---|---|---|---|---|---|
| 1 | 0–120 | `PT-01` 墨滴悬停（seed=s01-ink）；`PT-07` 纸纹；`GR-01` 暖黑 | `CM-03` 推 100→103%；`CM-12` 浅景深；`CM-14` 景深呼吸；`PT-05` 极稀光尘 | `PT-02` 触纸 80f 洇开 6f；`PT-03` 双涟漪（≤6% 画幅）；`CV-02` 落体 | `TR-01` @120；交接：暖黑纸面+静墨点；S2 自墨点起笔 |
| 2 | 120–300 | `FN-21` 笔锋线 120–160；`FN-02` 题记错峰 2f（80ms，`CV-01`）；`GR-02` | `FN-05` 纸面呼吸；`PT-05` 光尘；`CM-04` 后拉 100→98%（240–300） | `FN-06` 极淡余墨光点；题记冻帧 | `TR-02` @300（294–300 交叉 6f）；交接：纸面题记+余墨光点 |
| 3 | 300–396 | `CM-07` 横移 4%（`CM-15` plateau）；`PT-07`；`GR-02` | `FN-09` 日期章 ×2（330/366，6f，`SP-01`）；`FN-10` 微旋；`FN-17` 轻震 | `FN-23` 纸缘微翘；双日期并置 | `TR-03` @396 纸卡翻面；交接：双日期纸面 → 2020-04 日历页 |
| 4 | 396–468 | `FN-23` 翻面 12f；`FN-19` 30→0（前 48f 24 页、后 18f 6 页）；`GR-05` 冷线框 | `FN-19` 先快后慢；`FN-05`；`CV-07` | 「0」468 定格；冷线框微光 | `TR-02` @468（6–10f）；交接：数字 0+冷线框微光；※入场侧 S5 线框淡入 |
| 5 | 468–570 | `FN-02` 线框淡入 468–480；`FN-11` 基石 ×4（480/500/520/540）；`SP-06` | `CM-06` 微俯 2.5D；`CM-12` 视差；`FN-06` 区域点亮；`CM-03` 100→102%（540–570） | `GR-04` 整页暖光亮起 | `TR-01` @570；交接：暖光旧站首屏 |
| 6 | 570–630 | `CM-07` 侧向跟移 60f；`FN-12` 卡片弧线飞入（半拍一卡，`SP-07`）；`CM-13` 20f（列表→内容栏） | `CM-09` 跟移（`SP-04`）；`FN-12` 落位；`PT-07` | 卡片队列落定；610–630 留 1 拍空（`RH-06`） | `TR-07` @630；交接：文章列表冻帧；※入场侧 S7 列表沉为底纹 |
| 7 | 630–720 | `TR-07` 承接下沉；`FN-12` 资料卡自下浮起 20f（654–674）；`FN-02` bio write-fade（674–694）；`CM-03` 100→104%（694–720） | `FN-04` 68 repos 数字落定；`FN-05` 纸纹呼吸；无大字标签 | `CM-03` 极缓推；`FN-23` 右缘掀缝（720） | `TR-04` @720（aperture=seam）；交接：掀缝纸面 → 旧站内页；※入场侧 S8 完成穿越 |
| 8 | 720–816 | `TR-04` 承接穿越；`CM-03` 推进；`CM-13` 20f（纸纹→年份牌）；`FN-01` 「2021」浮起 | `CM-06` 年份微沉降；`CM-12` 视差；`GR-04` 暗暖调；`FN-05` | 年份牌落定；旧站内页铺开 | `TR-01` @816；交接：年份牌+旧站内页 |
| 9 | 816–966 | `CM-11` 微距俯拍；`FN-09` 闲章 6f（~880）；`FN-10` | `CM-04` 极缓后拉（880–966）；`CM-02` 微漂；`CM-12` 浅景深；`GR-03` | 闲章冻帧、朱色未干；`FN-12` 章旁元素微避让 | `TR-02` @966（8f）；交接：朱印+旧站纸面 |
| 10 | 966–1092 | `CM-07` 横移 20f；`FN-24` PM2 亮（~1010）；`FN-08` PM2 熄（曝光 −8%） | `CM-15` slow-fast-slow；`FN-24` Docker 亮（~1060，`CV-04`，`SP-02`）；Nginx 常亮 | 双牌并亮；`FN-12` PM2 退画外 | `TR-01` @1092；交接：Docker+Nginx 双牌亮面 |
| 11 | 1092–1200 | `CM-06` 低机位仰拍；`FN-06` Nginx 牌低强度 | `CM-13` 20f（牌→设计稿）；`FN-12` 设计稿掠入 | 设计稿横扫出画、带起遮罩纸页 | `TR-06` @1200；交接：纸页遮罩；※入场侧 S12 纸页落下展开 |
| 12 | 1200–1380 | `TR-06` 承接；`TR-05` 纸页展开；`CM-08` 正俯缓降 8%；`FN-12` 两摞纸推移 40f（`RH-03`） | `FN-29` 竖排标题落；`FN-02` 宣言逐行；`RH-06` 2 拍静止 | 宣言落定；`FN-24` 笔电掀盖屏幕微亮 | `TR-08` @1380（※入场侧 S13 入屏 1380–1410）；交接：掀盖笔电 |
| 13 | 1380–1524 | `TR-08` 承接；`CM-11` 屏幕微距；`FN-15` 行级替换（低强度） | `CM-07` 随替换行；`CV-05` 缓-顿-缓；`FN-01` 类型标注浮出 | `FN-24` 编译通过徽标亮起 | `TR-09` @1524（※入场侧 S14 缩为终端旁窗）；交接：编辑器+通过徽标 |
| 14 | 1524–1656 | `TR-09` 承接缩窗；`CM-11` 俯拍终端；`FN-21` 流水线纵线；`FN-16` 三节点转绿 | `CM-08` 沿流水线下降；`FN-06` 绿灯克制辉光；`GR-01` | `CM-03` 100→105% 推近绿灯；暗场+一点绿灯 | `TR-01` @1656；交接：暗场+绿灯；S15 自绿灯拉开 |
| 15 | 1656–1872 | `CM-04` 长后拉 + `CM-07` 横移（216f 最缓）；`CM-12` 景深拉大 | `CM-15` constant-slow（`CV-03`）；`PT-05`；`FN-21` 时间轴走廊；`PT-01` 墨点走完 2021 | `CM-03` 末 20f 轻推纸缘 | `TR-11` @1872；交接：时间轴末端+纸缘微光；※入场侧 S16 跟纸缘入画 |
| 16 | 1872–1962 | `TR-11` 承接；`CM-06` 下摇 4%；`FN-08` 整页蒙灰；`GR-05` | `FN-05`；`PT-07`；`GR-04` 页眉一点暖光 | 纸页整版入画、灰调静止 | `TR-01` @1962；交接：灰调纸页 |
| 17 | 1962–2118 | `FN-29` 暖句逐字浮出；`GR-05`→`GR-04`（半句透暖金） | `CM-01` 锁定；`FN-05`；末 30f `CM-03` 3%（2088–2118） | 暖句停住；`FN-23` 灰纸掀角 | `TR-03` @2118；交接：暖句+掀角纸页 |
| 18 | 2118–2352 | `TR-03` 承接；`CM-06` 侧面低机位；`PT-12` 纸页流（2023 先 30 页、2024 再 59 页） | `PT-12`；`FN-04` 30→59（右上固定，`RH-01`）；`FN-19` 页数翻牌；`CM-09` 轻跟纸流 | 纸页堆成小山；`FN-06` 山顶页光；`RH-06` 骤停（2342–2352） | `TR-23` @2352；交接：纸山+页光；※入场侧 S19 纸山移开 |
| 19 | 2352–2424 | `TR-23` 承接；`CM-11` 微距推轨；`CM-15` 缓→几乎静止；`GR-05`→`GR-01` 压暗 40% | `CM-13` 日期虚焦→实焦（2390–2410）；`CM-14` 呼吸一次 100.5→100（2400） | 日期实焦独占画面；边缘全暗 | `TR-01` @2424；交接：日期特写+暗场 |
| 20 | 2424–2556 | `TR-01` 承接；`CM-11` 屏幕微距；`FN-14` 两闪（2424/2444，光标层）；`FN-03` 键入 2.4f/字（2434–2516） | `CM-07` 跟行尾；`FN-03`；`GR-01` | `FN-17` 回车轻震 @2520；`CM-03` 100→103% 推近该行 | `TR-01` @2556 + `TR-12`（※入场侧 S21 2556–2578）；交接：单行代码+暗底 |
| 21 | 2556–2652 | `TR-12` 承接（2556–2578）；`CM-11` 正俯微距；`FN-09` 章 8f（~2600）；`FN-10` | `RH-06` 静止 2 拍（2600–2640）；`CM-03` 2%（2640–2652）；`FN-06` 朱红晕 | 红印冻帧 | `TR-01` @2652；交接：朱印+纸面 |
| 22 | 2652–2862 | `CM-06` 俯拍时间轴；`PT-01` 墨点 ×4（每 12f）；`FN-01` 小字标注 | `CM-07` 随点横移；`PT-01` 后 3 点加速；`FN-21` 七点弧线；`PT-05` | `FN-06` 7 点同亮；主时间轴向右延伸进暗 | `TR-10` @2862（2842–2862 暗角加深）；交接：亮点连线+前方暗场 |
| 23 | 2862–2970 | `TR-10` 承接；`FN-21` 提交曲线；`CV-02` 断电下坠后骤停；`PT-01` ×4 墨点；`CM-05` 正侧 | `CM-04` 极缓后退；`GR-01`；`PT-05` 极稀 | 四墨点悬停暗场 | `TR-01` @2970；交接：暗场+四墨点 |
| 24 | 2970–3126 | `FN-21` 时间轴串四点；`FN-01` 标注落定；`CM-11` 微距横移 | `CM-15` 空白段速度≈0；`PT-08` 纸纤维生长；`PT-06` 尘埃上浮；`PT-05` | 空白尽头灰尘落定；尘埃散开露出刻度盘微光 | `TR-13` @3126；交接：尘埃+刻度盘微光；※入场侧 S25 刻度盘显出 |
| 25 | 3126–3246 | `TR-13` 承接；`FN-29` 衬线大字「0」；`FN-25` 指针 0→微动→0 | `CM-03` 1% 呼吸推拉（周期 60f）；`CM-14`；`PT-05` | 「0」占满画面并微微失焦（`CM-13` 3226–3246） | `TR-14` @3246；交接：大字 0 虚焦；※入场侧 S26 照片卡浮出 |
| 26 | 3246–3378 | `TR-14` 承接；`FN-12` 照片卡浮现 20f（`SP-03`）；`GR-05`；`PT-07` 颗粒 | `CM-11` 微距横移海平线 | 海面照片卡冻结左侧 | `TR-01` @3378；交接：海面照片卡 |
| 27 | 3378–3510 | `FN-12` 第二卡右滑（`SP-07`）；`GR-05` | `CM-04` 100→102%（并排后）；`CM-01` | 海雾双卡并排静置 | `TR-01` @3510；交接：海雾双卡 |
| 28 | 3510–3642 | `FN-24` 2025-12 刻度亮；`PT-11` 21 火花聚拢；`FN-04` →21；`CM-08` 上摇 3% | `CM-11` 微距俯拍刻度；`PT-11` | 火簇停刻度上方；余光在天顶连成暖光带（`FN-06`/`GR-06`） | `TR-18` @3642；交接：火簇余光+顶部暖带 |
| 29 | 3642–3768 | `TR-18` 承接（火簇余光→青纸）；`PT-01` 墨点雨（71/151 密度）；`FN-04` 71/151 苔痕中心滚动；`CM-06` 低机位微距 | `CM-04` 雨势加大后拉；`CM-15` 缓-密-缓；`PT-07` 湿纸苔痕 | 雨歇双苔痕 | `TR-05` @3768；交接：湿纸+双苔痕；※入场侧 S30 首页从湿纸显影 |
| 30 | 3768–3900 | `TR-05` 承接；`FN-12` 卡片飞入（半拍一卡）；`FN-13`；`CM-07` 侧向跟移 | `CM-13` 锁定入位点；`CM-12` 背景柱虚化；`FN-12` | 文章列表铺满首屏 | `TR-15` @3900（3882–3900 失焦压暗）；交接：满屏文章列表；※入场侧 S31 列表失焦 |
| 31 | 3900–3996 | `TR-15` 承接；`CM-13` 18f 拉焦到日期；`CM-15` 40f 压暗；`GR-01` | `RH-06` 骤停半拍（3976–3996）；`PT-05` 骤稀 | `TR-16` 白光一线 0→30%（3986–3996） | `TR-16`→`TR-17` @3996；交接：黑场+白光线；※入场侧 S32 白闪峰值 4000 |
| 32 | 3996–4116 | `TR-17` 承接（3996–4003，`CV-06`）；4015 后 `FN-24` 各区块灯次第亮（每拍，`SP-02`）；`FN-13`；`CM-03` 缓推 Hero | `FN-24`；`GR-07` 灯火；`PT-05` | 整页灯全亮、暖光稳定 | `TR-05` @4116；交接：全亮新站首屏；※入场侧 S33 文章区展开纸笺 |
| 33 | 4116–4260 | `TR-05` 承接；`CM-03` dolly-in 至纸笺；`FN-29` 标题落下 | `CM-11` 纸纹/墨色；`FN-05`；`GR-02` | 纸笺与空印位就绪 | `TR-01` @4260；交接：纸笺特写+空印位 |
| 34 | 4260–4440 | `FN-29` 引文逐行压入（每行贴拍）；`CM-11` 正俯；`CM-03` 1% 级缓推 | `FN-29`；`RH-06` 停 2 拍（4380–4420） | `FN-09` 钤印 6f @4380；`FN-17` 轻震；`PT-02` 朱红晕开；`GR-03` | `TR-25` @4440（target=page；※入场侧 S35 红光→纸页翻起）；交接：朱红晕光 |
| 35 | 4440–4554 | `TR-25` 承接（4440–4456 红光→暗色控制台）；`FN-39` 面板（8 tile，litSet=∅，`GR-01` 暗色底）；`FN-41` 墨点光标移向块 1、悬停、点击涟漪；`FN-40` 块 1 展开铺满 + `CM-03` 推近 | `FN-35` 46 枚墨点 2 拍扫过（4456–4496）；`FN-36` hover-shift 染色左移；`CM-06` 下移 12%；`PT-05` | `FN-40` 反向收束回 tile（4538–4554）；`FN-41` 光标移向块 2；面板 litSet={1} | `TR-01` @4554；交接：控制台面板（1/8 亮），块 2 待展开；※入场侧 S36 面板+光标+展开 |
| 36 | 4554–4668 | `TR-01` 承接；`FN-39` 面板（litSet={1}）；`FN-41` 光标移向块 2、悬停、点击；`FN-40` 块 2 展开铺满 + `CM-03` 2% | `FN-21` 山峦/涟漪双曲线逐段描边（每 2 拍一段）；`FN-02` 标题 write-fade；`FN-09` / `FN-10` 「wuh.site」落款如钤；`CM-07` 沿山脊横移 | `FN-40` 反向收束；`FN-41` 光标移向块 3；面板 litSet={1,2} | `TR-01` @4668；交接：面板（2/8 亮），块 3 待展开；※入场侧 S37 面板+光标+展开 |
| 37 | 4668–4782 | `TR-01` 承接；`FN-39` 面板（litSet={1,2}）；`FN-41` 光标移向块 3、悬停、点击；`FN-40` 块 3 展开铺满 + `CM-03` | `FN-30` shimmer 45f 横扫；`FN-31` 36×54 书封 cascade（半拍一卡）；`FN-12` / `SP-03` 抽出一本「阅读中」；`CM-07` / `CM-03`；`CM-12` | `FN-40` 反向收束；`FN-41` 光标移向块 4；面板 litSet={1,2,3} | `TR-01` @4782；交接：面板（3/8 亮），块 4 待展开；※入场侧 S38 面板+光标+展开 |
| 38 | 4782–4902 | `TR-01` 承接；`FN-39` 面板（litSet={1,2,3}）；`FN-41` 光标移向块 4、悬停、点击；`FN-40` 块 4 展开铺满 + `CM-03`；`TR-20`（mode=cover）圆盘成形 | `FN-26` 黑胶 5s/圈（120f=288°）；`FN-25` 唱针 12f 落定 4820；`FN-07` EQ 相位差；`FN-37` 440px 迷你播放器跑马灯；`FN-28` 年份刻度环；`CM-10` 同轴 | `FN-06` 唱针抬起；`TR-21` 碟面退暗；`TR-26` 金线拉伸成块 5 纵线；`FN-40` 反向收束；`FN-41` 光标移向块 5；面板 litSet={1,2,3,4} | `TR-01` @4902；交接：面板（4/8 亮），块 5 待展开；※入场侧 S39 面板+光标+展开 |
| 39 | 4902–5016 | `TR-01` 承接；`FN-39` 面板（litSet={1,2,3,4}）；`FN-41` 光标移向块 5、悬停、点击；`FN-40` 块 5 展开铺满 + `CM-03` | `FN-01` / `FN-13` 信笺节点生长（今天/昨天/前天）；纵线裂成左右两列；`FN-32` 弹幕气泡交替滑入；`CM-05` 轻微横摇 | `FN-40` 反向收束；`FN-41` 光标移向块 6；面板 litSet={1,2,3,4,5} | `TR-01` @5016；交接：面板（5/8 亮），块 6 待展开；※入场侧 S40 面板+光标+展开 |
| 40 | 5016–5136 | `TR-01` 承接；`FN-39` 面板（litSet={1,2,3,4,5}）；`FN-41` 光标移向块 6、悬停、点击；`FN-40` 块 6 展开铺满 + `CM-03` / `CM-11` 40f 全景 | `FN-38` 365 格暖色缓慢加深（全局 ramp；159 日沉得更深；无波浪扫描）；`PT-03` 峰值格墨点圈；`FN-24` 380px 足迹两点亮；`CM-03` / `CM-13` 40f 推峰值 | `FN-40` 反向收束；`FN-41` 光标移向块 7；面板 litSet={1,2,3,4,5,6} | `TR-01` @5136；交接：面板（6/8 亮），块 7 待展开；※入场侧 S41 面板+光标+展开 |
| 41 | 5136–5250 | `TR-01` 承接；`FN-39` 面板（litSet={1,2,3,4,5,6}）；`FN-41` 光标移向块 7、悬停、点击；`FN-40` 块 7 展开铺满 + `CM-03` | `FN-33` 酒红/素雅换装插值；`SP-05` / `FN-12` 试墨拖拽；`FN-13` 色卡 stagger；`CM-07` / `CM-15` 分屏微甩 | `FN-40` 反向收束；`FN-41` 光标移向块 8；面板 litSet={1,2,3,4,5,6,7} | `TR-01` @5250；交接：面板（7/8 亮），块 8 待展开；※入场侧 S42 面板+光标+展开 |
| 42 | 5250–5364 | `TR-01` 承接；`FN-39` 面板（litSet={1,2,3,4,5,6,7}）；`FN-41` 光标移向块 8、悬停、点击；`FN-40` 块 8 展开铺满 + `CM-03` 一镜前飞 | `FN-34` @view-transition 页面矩形纵深（首页→/music→/guestbook→/footprint→/topics，每页半拍）；`FN-24` 灯次第亮；`FN-12` 8 图标围合；`CM-03` 一镜前飞 | `FN-09` 22px 钤印落定 5320；`FN-40` 反向收束；`FN-39` 8/8 全亮（扫描线加速）；`FN-41` 光标回中心；`PT-02` 朱红晕开；`TR-25` 预滚（5348–5364） | `TR-25` @5364（target=window；※入场侧 S43 红光成纸页→推窗）；交接：八块全亮→朱红晕光+纸页边缘 |
| 43 | 5364–5496 | `TR-25` 承接（5364–5380 红光→纸页立起成窗）；`CM-04` 纸页特写缓退成窗框 | `CM-04` 推窗 40f；`GR-06` 七月光；`CM-13` 末 20f 窗棂→窗台纸页；`PT-05` | 窗光铺满、窗台纸页微亮 | `TR-01` @5496；交接：窗光+纸页 |
| 44 | 5496–5664 | `TR-01` 承接；`FN-04` 榜单滚动由快到停（末 30f 静止）；`FN-29` 1,748 落定；`CM-11` 微距 | `CM-03` 3%（落定后）；`PT-05` 极稀；`GR-02` | 榜单定格；`FN-23` 第一名纸页翻起一半 | `TR-03` @5664；交接：榜单+翻起纸页；※入场侧 S45 纸页翻面 |
| 45 | 5664–5844 | `TR-03` 承接；`FN-29` 前两句竖排逐字（半拍/字，`RH-02`）；`CM-01` 严格零运镜 | `CM-01`；`GR-02`；仅字与光的变化 | 两句停上半、下半留白 | `TR-01` @5844；交接：上阕纸面（同页连续） |
| 46 | 5844–6024 | `FN-29` 后两句落下；`CM-01` 严格零运镜 | `CM-01`；末 20f `CM-03` 1% 下移（6004–6024） | 四句完整；落款位空 | `TR-01` @6024；交接：四句纸面+空落款位 |
| 47 | 6024–6132 | `FN-21` 落款笔锋；`FN-09` 小章「忘」4f（~6070）；`FN-10`；`CM-11` 微距俯拍 | `CM-04` 100→102%（6088–6132）；`FN-05` | 整页字与印静止 | `TR-19` @6132；交接：坐忘歌整页；※入场侧 S48 晨光渗入、纸页淡出为书桌 |
| 48 | 6132–6300 | `TR-19` 承接；`GR-06` 晨光角度 4s 偏移 20°；`CM-08` 俯拍缓降 | `CM-11` 划改 20f 特写（`FN-21` 划线、`FN-29` 改写「读书日」）；`CM-08` | 晨光铺满桌面；日历格改写完成 | `TR-01` @6300；交接：晨光书桌 |
| 49 | 6300–6432 | `FN-23` 书页被风合上；`GR-06` 晨光移右缘；`FN-21` 墨点 2026-06→07 | `CM-07`+`CM-03` 组合；`CM-13` 书桌→远处光点；`CM-15` 全片第二缓；`PT-05`→`PT-10` 预聚 | 晨光收拢；远处光点聚成星轨环（`PT-10`） | `TR-01` @6432；交接：星轨环微光 |
| 50 | 6432–6528 | `PT-10` 星轨成形；`FN-21` 三节点连线；`CM-11` 微距→星轨全景（`CM-03`+`CM-13` 40f）；`FN-02` v1.0.1 | `FN-28` 星轨缓转；`CM-10` 同心缓转；`FN-06` 节点微光 | 星轨成形、缓转 | `TR-01` @6528；交接：星轨环+中心版本号 |
| 51 | 6528–6650 | `PT-09` 116 点版本雨（斜落）；`FN-27` 每点落定闪；`CM-05` 斜向跟摇 | `CM-15` 与雨同向、末 20f 减速；`PT-09`；`FN-28` | 雨歇；时间轴密布 116 点微光（6620） | `TR-02` @6650（8f）；交接：光点密轴 → 音乐页 |
| 52 | 6650–6800 | `TR-02` 承接；`FN-12` 440px 迷你播放器滑入；`CM-11` 微距对准左下播放器 | `FN-21` API 连接线；`FN-08` / `FN-24` 降级（播放键变灰、显示不可播）；`FN-07` 波形/EQ 起；`FN-37` 跑马灯；`CM-13` 拉焦到 API 线 | 波形扩散成整页工作流文档（6782–6800，`TR-06` 预滚） | `TR-06` @6800（※入场侧 S53 工作流页显影）；交接：波形扩散 |
| 53 | 6800–6990 | `TR-06` 承接；`FN-13` 六阶段传送带左移；`CM-03` 正面缓推 6s10f | `FN-02` 金句前半→后半（6960 落定，`RH-05`）；`CM-15` 6960 停推；`FN-05` | 金句占满主位；六阶段沉为底纹（`TR-07` 镜内同配方） | `TR-03` @6990；交接：金句页+底纹 |
| 54 | 6990–7122 | `TR-03` 承接；`FN-20` 365 格热力逐格（16 分格 5f）；`CM-11` 40f 全景 + `CM-03` / `CM-13` 40f 推峰值 | `FN-20`；159 日更亮；`PT-03` 峰值墨点圈；`PT-05` | 峰值格特写+墨点圈 | `TR-01` @7122；交接：热力峰值特写 |
| 55 | 7122–7272 | `CM-04` 缓拉全景；`FN-02` 五组数字错峰 2f（80ms）；`FN-21` 细线连回；`CM-06` 斜下摇 | `CM-01` 静止段；`FN-05`；`GR-04`；`FN-24` 12 技能灯逐盏亮；`FN-18` 桅杆灯柱升起；`FN-12` / `FN-13` 舰队卡片堆叠；`FN-06` 极淡 | 五组数字与舰队角落同亮（7200 数字落定） | `TR-22` @7272；交接：数字+舰队一角；※入场侧 S56 舰队淡出回开篇纸面 |
| 56 | 7272–7404 | `TR-22` 承接（12f 快速档）；`FN-03` 每字 5f（7284–7394，`RH-04`）；`FN-22` 28px 笔尖微光；`PT-04` 每字 2–3 颗 3px | `CM-11` 微距跟笔尖（`SP-05`）；`FN-03`；`PT-04`；`PT-05` 浮游 | `CM-03` 100→104%（7394–7404）；墨点未落尽 | `TR-01` @7404；交接：题记纸面+浮游墨点 |
| 57 | 7404–7500 | `FN-14` 光标停（不闪）；`FN-29` 落款小字；`PT-01` 极小墨点（~7440，同 S1 seed/位置） | `CM-11` 微距落款；`FN-06` 墨点余光极淡；`GR-08` 渐起 | `TR-24` 7480–7500 收黑；墨点余光将熄 | `TR-24` @7500；交接：黑场+墨点余光 → FilmShell 片尾；误差 0 |

**矩阵自查**

- 行数：**57/57**；镜号 1–57 连续；4 列每格均引用至少一枚令牌；所有引用编号在 3.1–3.8 定义域内。
- 转场：26 枚全部使用；`※` 入场侧承接共 28 处：S5、S7、S8、S12、S13、S14、S16、S19、S21、S25、S26、S30、S31、S32、S33、S35、S36、S37、S38、S39、S40、S41、S42、S43、S45、S48、S53、S56。
- 节奏：0 / 720 / 4440 / 7500 整拍；2520 / 4000 / 4380 / 4820 / 5320 / 6620 / 6760 / 6960 / 7200 重音；468 贴最近拍；S38 黑胶 5s/圈按绝对时间、不对拍；Act 7 的 S45 / S46（5664–6024）零运镜。
- 禁项：全片无 `cam-rush`、无二次纯白、无 `<Audio>`、无全屏 radial-gradient。

---

## 5. 节奏锚点表

### 5.1 storyboard v2 §4.1 指定锚点（逐条动效响应）

| 帧 | 拍位 | 事件 | 动效响应 |
|---|---|---|---|
| **80f** | 第 5 拍 | 第一滴墨触纸（S1） | `PT-01` 自由落体 50–80f（`CV-02`，30f）；80f 触发 `PT-02` 触纸洇开 6f + `PT-03` 双涟漪 24f；`CM-03` 全程极缓推不抢拍；音乐低频起，画面不加闪、不加震 |
| **240f** | 第 13 拍 | 题记落定（S2） | `FN-02` 最后一组字 240f 落定；`FN-05` 呼吸相位对齐 240f；`CM-04` 后拉 100→98% 自 240f 起（60f）；整拍误差 0 |
| **468f** | 第 24.4 拍（贴最近拍） | 30 天倒计时归零（S4） | `FN-19` 最后 3 页 438/448/458 每 10f 一翻；「0」468f 定格；`FN-19` 终点允许 ±2f；`TR-02` 468–478 交叉溶解 |
| **720f** | 第 37 拍 | Act 2 起（S8） | `TR-04` 纸缝穿越 700–720 尾段起势、720f 峰值；`CM-03` 720–760 继续推进；`GR-04` 40f 交叉入暗暖；`FN-01` 年份牌 740f 起浮；幕界整拍误差 0 |
| **2520f** | 第 127 拍 | 2024-12-08 提交回车——全片第一记重音（S20） | `FN-17` 纸面轻震 2520f 起（amp 2px / 0.15°，衰减 12f）；`CM-03` 2520–2556 缓推 100→103%；键入必须在 2516f 前完成；不加白闪、不加闪光、不加速推；重音由「空文件→一行字」的落差承担 |
| **4000f** | 第 201 拍 | 白闪峰值——全片唯一纯白（S31→S32） | `TR-16` 3986–3996 白光一线 0→30%；`TR-17` 3996–4000 暖白 `FILM_COLORS.flashWhite` 30%→100%（`CV-06` 4f）；4000–4003 纯白 3f；4003–4015 释放（`CV-01` 12f）；`FN-24` 灯亮必须等 4015 后再起 |
| **4380f** | 第 220 拍 | 重启计划钤印（S34） | `FN-09` 钤印 6f 结束于 4380f；`FN-10` 终值；`PT-02` 朱红晕开 4380–4400；`FN-17` 轻震 4380f；随后 `RH-06` 停 2 拍（4380–4420）；`TR-25` 4440f 推门入院 |
| **4440f** | 第 223 拍 | Act 6 入院开场（S35） | `TR-25` 钤印红光晕开→暗色控制台（4440–4456，16f）；`FN-39` 面板（litSet=∅）；`FN-41` 光标移向块 1、悬停、点击；`FN-40` 块 1 展开铺满 + `CM-03` 缓推 8%；`GR-04` 控制台暖光；`FN-35` 墨点时间轴铺开；幕界整拍误差 0 |
| **4820f** | 第 242 拍 | 唱针落定（S38，入院幕内音乐点） | `FN-25` 唱针 12f 落定于 4820f；`FN-26` 黑胶 5s/圈绝对时间继续；`FN-07` EQ 相位差起伏；不加速、不对拍，落针即音乐点 |
| **5320f** | 第 267 拍 | 联系钤印（S42，入院幕唯一重音） | `FN-09` 22px 钤印 6f 结束于 5320f；`FN-10` 终值；`FN-39` 面板 8/8 全亮；`FN-40` 反向收束；`PT-02` 朱红晕开；`FN-17` 轻震；`TR-25` 5364f 红光成《坐忘歌》纸页→推窗 |
| **6620f** | 第 332 拍 | 版本雨落满 116 点（S51） | `PT-09` 最后一批光点 6620f 落定；`FN-27` 每颗落定闪 6f；`CM-05`/`CM-15` 末 20f 减速至停；`GR-07` 亮点密轴；计数只作字幕，画面不滚数字 |
| **6760f** | 第 339 拍 | 播放器可用（S52） | `FN-08` / `FN-24` 播放键从不可播降级切到可播；`FN-07` 波形与 EQ 起；`FN-37` 迷你播放器跑马灯持续；`CM-13` 焦点在播放器与 API 连接线之间；不出现黑胶特写 |
| **6960f** | 第 349 拍 | 方法论金句落定（S53） | `FN-02` 后半句 6946–6960 落定；`CM-03` 6960f 停推；`CM-15` 停；`FN-13` 六阶段传送带同步减速；`TR-03` 6990f 翻页 |
| **7200f** | 第 361 拍 | 落版数字落定（S55） | `FN-02` 五组数字最后一组 7200f 落定；`FN-24` 12 技能灯同步停；`CM-04` / `CM-06` 已停在数字与舰队同框；`FN-06` 极淡余光；整拍误差 0 |
| **7500f** | 第 376 拍 | 全片归零（S57） | 7404f `FN-14` 光标停（不闪）；7410–7440 `FN-29` 落款小字；7440f `PT-01` 一滴墨（同 S1 seed/位置）；7480–7500 `TR-24` 收黑（brightness→0 + 暗角收拢）；7500f 画面与音乐同帧归零，交 FilmShell 片尾 |

### 5.2 幕界帧（补充；不硬卡拍）

| 帧 | 拍位 | 幕界 | 动效响应 |
|---|---|---|---|
| 0 | 第 1 拍 | Act 1 起 | `GR-01` 暖黑 + `PT-05` 光尘 30f 渐显；全片原点 |
| 720 | 第 37 拍 | Act 1→2 | `TR-04` 纸缝穿越峰值；`GR-04` 40f 交叉；整拍 |
| 1872 | 第 94.6 拍 | Act 2→3 | `TR-11` 纸缘入画；鼓点撤走，画面切 `GR-05` 灰调；允许 ±10f 呼吸，镜边界不动 |
| 2862 | 第 144.1 拍 | Act 3→4 | `TR-10` 8f 光收暗 + `GR-01`；速度骤降，`CM-15` 进入极缓档 |
| 3642 | 第 183.1 拍 | Act 4→5 | `TR-18` 暖光带落地成柱；鼓点回归视觉密度 |
| 4440 | 第 223 拍 | Act 5→6 | `TR-25` 红光晕开→纸页翻起；入院 8 镜进入 16+82+16 呼吸；整拍 |
| 5364 | 第 269.2 拍 | Act 6→7 | `TR-25`（target=window）红光成《坐忘歌》纸页→推窗；鼓退场；允许 ±10f 呼吸 |
| 6432 | 第 322.6 拍 | Act 7→8 | `TR-01` 星轨环交接；16 分密度进入；允许 ±10f 呼吸 |
| 7500 | 第 376 拍 | Act 8→片尾 | `TR-24` 收黑；与音乐同帧归零；整拍误差 0 |

> 幕界规则：仅 0 / 720 / 4440 / 7500 落在整拍；其余幕界在非整拍处，允许 ±10f 的呼吸位移在幕内消化，**镜边界帧号不动**。

---

## 6. 实现约束（Remotion 可落地）

### 6.1 原语白名单

只允许：`interpolate(frame, [...], [...], { easing })`、`spring({ frame, fps, config })`、`Easing.*`、`interpolateColors`（仅 `FN-33`）、CSS `opacity`、`transform`（translate / scale / rotate / rotateX / rotateY）、`filter`（blur / grayscale / brightness / saturate）、`clipPath`、`mixBlendMode`、`linear-gradient`、**局部** `radial-gradient`、SVG `strokeDasharray` / `strokeDashoffset`。禁止 UE / After Effects 专属概念：景深用双层/三层 blur 等效，bloom 用复制层 blur + `screen` 等效，升降用 translateY，俯仰用 translateY + rotateX 近似，@view-transition 用 `FN-34` 的 CSS transform 模拟，不调用浏览器 API。

### 6.2 禁内联色值与字体字面量

- 颜色：场景组件一律从 `brand/tokens` 的 `colors` 引用；品牌没有的灰调、近黑、晨光、空白纸、状态绿，只在 `videos/preprod-wuh-site-intro-v2/motion-tokens.ts` 的 `FILM_COLORS` 里声明一次，场景内禁止出现 `#RRGGBB`、`rgba(...)`、`hsl(...)` 字面量。
- 字体：一律 `fontFamily: fontFamilies.serif / sans / mono`（`brand/tokens`）。衬线＝年份 / 引语 / 题记；黑体＝字幕；等宽＝代码 / 数字 / 坐标。禁止在场景里写 `"Noto Serif SC"` 等字面量。
- 调色：只通过 `GR-01`–`GR-08` 叠加层实现；禁止场景内直接改 `filter` 做全局调色（局部 `FN-08` 除外）。

### 6.3 确定性随机

- 所有粒子、抖动、纸纤维、版本光点、书封 cascade 一律 `import { random } from 'remotion'`，用 `random(seed)`；禁止 `Math.random()`、`Date.now()`、`performance.now()`。
- seed 命名：`s01-ink`、`s22-dot-{i}`、`s24-fiber-{i}`、`s35-dot-{i}`、`s37-book-{i}`、`s51-rain-{i}`、`s56-speck-{char}-{i}`。
- 同一 seed 在预览与最终渲染中必须得到同一结果；不得依赖组件挂载顺序。

### 6.4 禁止全屏 radial-gradient

- `radial-gradient` 只允许挂在有明确小尺寸的元素上：笔尖微光 28px（`FN-22`）、印章朱晕 ≤240px、墨点核心 10–14px、单颗光尘 2–5px、`TR-25` 钤印红光 ≤40% 画幅（局部元素，不满屏）。
- 全画幅暗角、晨光、灯火氛围一律用四边 `linear-gradient` 或 `clipPath` 遮罩叠加；禁止在 `AbsoluteFill` 上写满屏 `background: radial-gradient(...)`（Chrome 全屏径向渐变易产生 banding 且渲染慢）。
- 纸纹用预渲染噪点 tile（`PT-07`），不要在每帧里跑 `feTurbulence`。
- `FN-39` 的扫描线用重复 `linear-gradient` 叠层 + 极缓 `translateY`，不做全屏大图 `background-position` 滚动。

### 6.5 禁止 `<Audio>` 与 SFX

- 本片 v1 冻结无 SFX：场景树中禁止 `<Audio>`、禁止音效资产、禁止波形可视化（S52 的波形是画面图形，不是音频分析）。
- 「音效·音乐点」列只作为节拍与剪辑密度参考；音乐由最终合成层负责，动效只对齐拍网格与锚点。
- 需要「听感」的落、点、闪，全部由画面动作承担（纸震、涟漪、灯亮、字落下、唱针落下）。

### 6.6 特效只用合成友好属性

- 允许动画：`opacity`、`transform`、`filter`、`clipPath`、`mixBlendMode`、`strokeDashoffset`、`interpolateColors` 产出的颜色值。
- 禁止动画：`width` / `height` / `top` / `left` / `margin` / `padding` 等布局属性；`box-shadow` 动画；`background-position` 大图滚动；`document` / `window` 事件驱动。
- 文本防跳宽：数字统一 `fontVariantNumeric: 'tabular-nums'`；代码与坐标用等宽。

### 6.7 镜头 rig 与景深

- 三层结构统一：`FrameMask` → `CameraRig` → 远景（depth 0.4）/ 主体（1.0）/ 前景（1.6）。
- 视差：`层位移 = 镜头位移 × (depth − 1) × −1`；景深：`blur = 基准值 × |depth − 1|`。
- 镜头运动一律 `CV-03`；「匀速」用 `CM-15` 的 `plateau` 档；线性例外仅 `FN-26` 黑胶 5s/圈与 `FN-37` 跑马灯。
- 禁止 `cam-rush`、whip-pan、俯冲式 scale 冲击；全片没有急推。

### 6.8 白闪与重音的唯一性

- `TR-17` 全片只允许一次：3996–4015，峰值 4000f，纯白 3f，释放至 4015f。其他任何镜头不得让画面到达纯白；S32 灯亮用暖金，不用白；6-7 空白纸页用 `FILM_COLORS.blankPaper`（暖白，不是纯白）。
- 2520f 是全片第一记重音：只用 `FN-17` 纸面轻震 + `CM-03` 缓推，不加白闪、不加闪光、不加速推。
- 4380f 重启钤印、5320f 联系钤印：只用 `FN-09` + `PT-02` + `FN-17`，与 2520f 同一力度语言；5320f 是 Act 6 唯一重音。
- 6620f / 6960f / 7200f 的重音由光点密度、金句落定与数字落定承担，不再叠加震动。

### 6.9 Act 6 入院呼吸与 Act 7 零运镜

- **Act 6 入院（4440–5364，暗色控制台）**：8 镜统一按 16+82+16（114f）或 18+84+18（120f）三段呼吸；入场＝`TR-25` 红光→`FN-39` 面板（litSet 累积）→`FN-41` 光标移动/悬停/点击→`FN-40` 块放大铺满；持续＝该块原展示令牌；出场＝`FN-40` 反向收束回面板 + `FN-41` 光标移向下一块；S42 八块全亮后收束成朱红晕光+纸页（`TR-25` target=window）。除纸页翻卷 6–10f 交叉外不用溶解；禁止卡点切镜。
- **Act 7 坐忘（5364–6432）**：S45 / S46（5664–6024）严格 `CM-01`，禁止 `CM-02` 漂移、禁止 `CM-14` 呼吸、禁止卡点切镜；只允许 `FN-29` 字的落下与 `GR-02` 光的极缓变化。S43 无字幕，纯画面留白。
- `FN-05` 在 Act 4 / Act 7 传 `amp 0.5`；`CM-12` 景深基准减半；`PT-05` 用极稀档。
- Act 4 同样走减法：S23–S28 不使用弹性过冲、不使用快节奏 stagger；`PT-05` 密度降到 10–18 颗。

### 6.10 数据可视化口径（写进实现常量，禁止手滑）

- 版本雨 116 颗＝`v1.0.1 → v1.4.97`；**117 是 tag 总数（含 v2.0.0）**，只在 S55 落版数字出现，版本雨不得画 117 颗。
- 热力图是 **365 个日格**，强度由当日活动数决定，总活动 12,651；159 天有活动；峰值格 2026-07-24 · 1,263。不要把 12,651 画成 12,651 个格子。S40（入院）与 S54（此刻）两处热力图共用同一数据口径；S40 是空间层现况快照。
- Act 6 控制台为 **8 块 tile（4×2）**，S35–S42 每镜点亮一块，S42 收束时 **8/8 全亮**；`FN-39` 的 `litSet` 累积，已亮块不清空。
- Act 6 首页墨点时间轴为 **46 枚**（46 篇公开文章），不是 143 个 Issue；S35 的 46 枚墨点按 2 拍扫过。
- 2025-12 火星 21 颗＝21 个提交；S23 四墨点＝2025-06 三次 + 2025-07 一次，共 4 颗。
- 书架逻辑网格 36×54，`FN-31` 渲染预算 ≤240 个可见封面（平铺/复用），不逐格建 1944 个 DOM 节点。
- 页数 30 / 59 用 `FN-04` 计数与纸页密度表达；`PT-12` 只渲染约 12 张代表纸页，不逐页建 30/59 个 DOM 节点。
- 所有数字 `tabular-nums`；坐标用等宽（`114.585, 22.55` / `114.23, 22.62`）。

### 6.11 字体与文本

- 字体资产：`@fontsource` 入仓的 **Noto Serif SC / Noto Sans SC**（`brand/fonts.ts`），等宽为 **Menlo**；场景一律通过 `brand/tokens` 的 `fontFamilies` 引用。
- `fontFamilies.serif`（Noto Serif SC / Songti SC）：年份、引语、题记、落款、榜单标题。
- `fontFamilies.sans`（Noto Sans SC / PingFang SC）：字幕（唯一黑体）。
- `fontFamilies.mono`（Menlo）：代码、数字、坐标、日期水印、提交原文。
- 字距：题记与《坐忘歌》用宽字距；代码与数字不额外加字距。字幕不参与任何镜头运动，固定在 FrameMask 层。

### 6.12 交接态协议（实现级）

1. 每镜最后一帧必须能作为静态冻帧渲染；出镜尾不得停在运动中途的模糊帧。
2. 下一镜第一帧从同一状态起步：同一纸面、同一光点位置、同一墨点半径、同一窗口位置、同一圆盘角度；需要时叠 6–10f `TR-02`。
3. `※` 入场侧承接的镜头：转场效果在入镜头内完成，出镜尾只保持冻帧；实现时把出镜末帧与入镜首帧做像素级对比验收。
4. 硬切只允许同材质段落（如 2970 曲线断电）；6132 纸页淡出属同材质软过渡，不是硬切；异质硬切一律禁止。
5. 每次转场完成后至少留 `RH-02` 半拍再启动镜内事件，避免「转场未完成就开演」；Act 6 的 16/82/16 与 18/84/18 已把这条写进镜长。

---

## 附：设计决策记录

- **D-1（全片无急推）**：分镜明确「全片没有一次急推」，因此不设 `cam-rush`；2520f 第一记重音用纸面轻震 + 缓推，不用镜头撞击。`CM-15` 只保留 `constant-slow` / `slow-fast-slow` / `slow-pause-slow` 三档，无快推档。
- **D-2（白闪跨切点）**：白闪峰值 4000f 位于 S32 头部（剪点 3996f），曲线为 3996–4000 由 30% 涨满、4000–4003 纯白、4003–4015 释放；S32 的灯亮必须从 4015f 之后开始，否则会被白场吃掉。全片仅此一次，其他任何帧不得到达纯白。
- **D-3（打字机速率）**：`TYPE.framesPerChar = 3.3` 保留为品牌默认；S20 的提交原文 34 字必须在 2520f 前打完，故使用 2.4f/字（2434–2516，光标闪与键入并行、不阻塞字符输出）；S56 标语 22 字按分镜「每字约 5f」使用 5f/字（7284–7394）。两者都通过 `typeChars` 新增的 `fpc` 参数覆盖，不修改品牌默认值。
- **D-4（数据口径）**：版本雨 116 颗、tag 总数 117、热力日格 365、活动总量 12,651、有活动 159 天、峰值 1,263、Act 6 首页 46 篇文章、2025-12 火星 21 颗、S23 四墨点——全部写入 `motion-tokens.ts` 常量，画面不得自行推导。Act 6 是空间层，使用 2026-10-31 现况快照，不是 6 月底计数。
- **D-5（黑胶绝对时间）**：S38 的 120f 镜长对应 5s/圈（150f）的 288°，**不为了凑整圈加速或减速**；`FN-26` 用线性旋转，针臂在 4820f 落定，镜头在 4902f 切走时唱片尚未转满一圈。分镜与 animatic 不得把转速改成 120f/圈。
- **D-6（「匀速」的落地）**：分镜写「匀速横移」的镜头（S3 等）用 `CM-15 plateau` 实现：前后 10% 极缓起停、中段近匀速；既保留「匀速」的观感，又守住品牌「镜头运动禁线性」的约束。
- **D-7（Act 6 控制台三段式）**：入院 8 镜按 16+82+16 或 18+84+18 写死；入场用 `FN-39` / `FN-41` / `FN-40` 完成「面板→光标→块放大」，持续段展示该块内容，出场用 `FN-40` 反向收束回面板；S42 8/8 全亮后统一收束成朱红晕光+纸页。除纸页翻卷 6–10f 交叉外不用溶解。
- **D-9（控制台累积点亮）**：`FN-39` 的 `litSet` 按镜累加——S35 0/8、S36 1/8、S37 2/8、S38 3/8、S39 4/8、S40 5/8、S41 6/8、S42 7/8→8/8；已亮 tile 在后续镜的面板中保持亮，不清空；S42 出场才统一收束成朱红晕光+纸页。
- **D-8（空间层现况快照）**：Act 6 的 46 篇文章、12,651 格活动、365 天、159 天有活动、峰值 1,263 均取 2026-10-31 快照；它不推进时间，位于 2026-06-21 钤印之后、七月推窗之前。字幕与画面数字不得与前后幕的编年数字混用。
