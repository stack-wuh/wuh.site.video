# preprod-site-film · 动效设计规范（Motion Spec）

> 版本 v1.1（对齐 storyboard v1.1：5400 → 7200 帧定档，七幕 45 镜）｜ 2026-10-25
> 输入：`assets/materials.md`（八节素材）+ `assets/storyboard.md` **v1.1**（45 镜七幕 · **7200 帧 = 240 秒（4:00）@30fps**）
> 总监视角：纸上电影（Cinematic Paper Film）。一切动效服务「静 → 抑 → 扬 → 游 → **缓** → 进 → 归」的节奏曲线，慢节奏重鼓为骨架，全片仅 3 处急推（镜 13/21/42）+ 1 处白闪（镜 15）；Act 5 创作人文为全片节奏最低点——鼓点全停，动效走「极简呼吸档」（§5.7）。
> **INV-4 达标声明**：第 7 节覆盖矩阵 45 行 × 4 列（入场/持续/出场/转场），每格均引用第 1–6 节定义的令牌，无镜无令牌；帧号已按 v1.1 时间轴回填。

---

## 0. 总则与实现约定

1. **原语白名单**：只使用 Remotion 可实现的能力——`interpolate(frame, [...], [...], {easing})`、`spring({frame, fps, config})`、`Easing.*`、`clipPath`、CSS `filter`（blur/grayscale/brightness/saturate）、`transform`（translate/scale/rotate）、`mixBlendMode`、`linear/radial/conic-gradient`、SVG `strokeDasharray/strokeDashoffset`。
2. **帧单位**：全片 30fps，令牌时长一律以帧（f）计；素材中的毫秒值按 30fps 折算（100ms=3f、600ms=18f、620ms≈19f、1.5s=45f）。
3. **确定性渲染**：粒子/抖动一律 `random(seed)` 种子化，禁 `Math.random()`——保证逐帧渲染可复现。
4. **禁线性**：所有镜头运动与元素入场出场禁用线性插值（分镜 §4.2）；例外仅限物理匀速体（黑胶旋转 `vinyl-spin`、跑马灯 `marquee-drift`、数据流匀速段）。
5. **UE 等效注解**：分镜表中源自三维/实拍语言的概念，一律给出「等效实现」注解，如：景深＝双层视差 + `filter: blur`；辉光 bloom＝复制层 blur + `screen` 叠加；升降＝translateY；光圈收缩＝vignette 半径插值；升格＝拉长插值区间（时间重映射）。本文已内嵌这些注解。
6. **令牌命名**：英文 kebab-case + 中文注释；同令牌可带参数变体（如 `tr-fade-dark(hold: 30f)`、`write-fade(慢档)`），参数不改变令牌身份。
7. **pre-render 输出**：`reduced-motion` 规则不适用（分镜 §4.3）。

---

## 1. 运动曲线体系（35 个令牌）

### 1.1 曲线基元（4 个）——所有令牌的地基

| 令牌 | 中文注释 | Remotion 配方 | 用途 |
|---|---|---|---|
| `cine-ease-out` | 电影级入场（快起缓停） | `Easing.out(Easing.cubic)`（≈ cubic-bezier(0.215,0.61,0.355,1)） | 元素入场、释放、落定 |
| `cine-ease-in` | 电影级出场（缓起加速） | `Easing.in(Easing.cubic)` | 元素出场、蓄力、急推 |
| `cine-ease-in-out` | 电影级往复（两端缓） | `Easing.inOut(Easing.cubic)` | 全部镜头运动（推拉摇移跟升降，分镜 §4.2 指定） |
| `cine-accent` | 强调回弹（过冲一点再收回） | `Easing.out(Easing.back)`（overshoot 取 1.2 收敛）或欠阻尼 spring | 强调时刻、点亮、弹出收尾 |

> 约定：interpolate 区间统一写法 `[0, D]`（D=令牌时长），输出区间见各令牌；所有入场令牌支持 `delay`（首参 frame-delay），delay 吸附拍网格（见 §5）。

### 1.2 元素动效令牌（31 个）

**书写系（站点签名语言，[材料§四.23] rise-fade / write-fade 的电影化移植）**

| 令牌 | 中文注释 | 配方 | 时长 |
|---|---|---|---|
| `ink-rise` | 墨升（上移 12px 显现） | `translateY: 12→0` + `opacity: 0→1`，`cine-ease-out` | 20f |
| `write-fade` | 落笔显现（下沉 4px 落墨） | `translateY: 4→0` + `opacity: 0→1` + `blur(2px)→0`，`cine-ease-out`；**慢档变体 28f**（Act 5 极简呼吸专用，§5.7） | 14f |
| `typewriter-type` | 打字机逐字（键击即节拍层） | 逐字 opacity 0→1（每字 3–4f，键击量化见 §5.6）；随机抖动 `random(charSeed)*1.2f`（素材 40ms）；可选光标联动 `caret-glow`、每字触发 `ink-speck`；快书变体 2.5–3f/字（镜 45） | 按字数 |
| `caret-glow` | 光标 28px 径向微光追随 | radial-gradient 圆盘（28px，暖金，opacity 0.5–0.9 + 4f 噪声闪烁），x 位置=已出字符累计宽度，`cine-ease-out` 追随；**呼吸闪烁变体**（镜 35：三记亮灭各 6f） | 常驻 |
| `path-draw` | 双曲线/SVG 描边生长 | `strokeDasharray=L; strokeDashoffset: L→0`，`cine-ease-in-out`（描边要有起收笔的呼吸）；**慢档变体 ×2 时长**（Act 5 书摘划线） | 30–60f |

**印章系（钤印是全片重音符号，规格统一 22px 方形，分镜 §4.3）**

| 令牌 | 中文注释 | 配方 | 时长 |
|---|---|---|---|
| `seal-stamp` | 钤印落章（squash + 微旋 + 红晕） | scale `1.25→0.9→1`（压扁回弹）+ `spring({damping:11, stiffness:220, mass:0.9})` + rotate 落至 `seal-tilt` 值；落章帧同步 `red-blaze` 起晕 | 18f + 晕染 |
| `seal-tilt` | 藏印微旋（像随意钤章） | `rotate = (hash(seed) % 32 − 16) / 10` → ±1.6°，静态终值或常驻属性 | 0f |

**弹性与重量系**

| 令牌 | 中文注释 | 配方 | 时长 |
|---|---|---|---|
| `spring-pop` | 弹性弹出（气泡/卡窗） | `spring({damping:9, stiffness:180, mass:0.8})`，scale `0.6→1`（约 8% 过冲）；**Act 5 禁用**（§5.7） | ~15f |
| `heavy-glide` | 重量感滑落（过阻尼，无回弹） | `spring({damping:200, stiffness:60})` 或 `interpolate` + `cine-ease-out` 拉长至 40–60f；带 1–2f 微沉降（translateY +2px 回 0）；**拍立得落纸变体**（Act 5 镜 34：落定带 ±1° 微旋后归正，Act 5 内压至 ≤40f） | 40–60f |
| `flip-reveal` | 翻转显形（书封/碟面） | `rotateY: 0→180°`，`perspective(1200px)`，正面/背面 backface 交换，`cine-ease-in-out` | 24f |

**循环呼吸系（持续令牌，全片「画面在呼吸」的底层）**

| 令牌 | 中文注释 | 配方 | 周期 |
|---|---|---|---|
| `paper-breathe` | 纸面呼吸（4s 周期） | `scale 1→1.008` 或 `translateY ±3px`，正弦 `Math.sin(frame/120*2π)`；Act 5 振幅减半 | 120f（4s） |
| `glow-pulse` | 辉光脉冲（2s 周期） | `opacity ±6%` / `scale ±1.5%` 正弦；心跳变体：周期 80f 双峰（0f、12f 两记），用于镜 10 暗红伏笔；**极淡档**（Act 5 地图光点/镜 43 热力微闪） | 60f / 80f |
| `eq-bounce` | 三墨柱 EQ 循环 | scaleY 正弦循环 0.9s=27f，三柱相位差 0.18s≈5.4f→5f；振幅参数化（镜 43 低振幅变体） | 27f |
| `eq-freeze` | EQ 冻结（暂停即冻结） | 停止循环，当前 scaleY 6f 内收敛至 **0.35** 并保持（素材[§三.17]）；伴随 `saturate 0.92` 轻去色 | 收敛 6f |
| `vinyl-spin` | 黑胶慢转（5s/圈） | `rotate: 0→360°` 线性 150f 循环；conic 高光层同速叠转，repeating-radial 唱纹静态 | 150f |
| `marquee-drift` | 歌名跑马灯 | `translateX` 线性循环 ~40px/s，内容首尾复制无缝衔接 | 常驻 |
| `gold-drift` | 光尘漂移（持续态） | 见 §3 `dust-field` 持续模式（速度取低档）；**极缓档**（Act 5） | 常驻 |

**信息与状态系**

| 令牌 | 中文注释 | 配方 | 时长 |
|---|---|---|---|
| `num-roll` | 数字滚动（计数收数） | 数值 `interpolate` + `Easing.out(Easing.quart)`，`fontVariantNumeric: tabular-nums` 防跳宽；终点落拍（§5） | 30–45f |
| `cascade-stagger` | 级联错峰（万能 stagger） | 基底动画任选（`ink-rise`/`flip-reveal`/`heavy-glide`/`glow-pulse`）+ 每项 delay `index × step`；step 2–4f（书封/色卡）、20f（灯笼/幕段）；排序参数：index / wave(col+row，热力图) / seeded-random | 按项数 |
| `hover-dye` | 染色左移（hover 泛化） | 色彩/背景色插值至 accent + `translateX: 0→−6px`，`cine-ease-out`；变体：换色 A/B（镜 29）、点亮（镜 16） | 10f |
| `dye-drain` | 去色变灰（沉默幕语言） | `filter: grayscale(0→0.85)` + `brightness →0.9`，慢速 `cine-ease-in-out` | 40f |
| `heat-wave` | 热力图波浪生长/熄灭 | 格子按 `col+row` 波次 delay（0.5f/格）；生长=opacity 0→1 + scaleY 0.2→1（轻 spring）；熄灭=反向 + 灰化（`dye-drain` 局部）；单点复燃变体：波纹半径 1 格/3f 外扩（镜 14） | 按格数 |
| `ripple-bloom` | 标记涟漪绽开 | 圆环 scale 0→3 + opacity 0.6→0，双环错 8f，`cine-ease-out` | 24f/环 |
| `orbit-drift` | 环绕轨道（星环/刻度带） | 椭圆参数化 `x=cx+rx·cosθ, y=cy+ry·sinθ`，θ=θ0+ω·frame；按角距缩放缩淡（选中年放大、远处 0.6 倍 + opacity 0.4）；ω 可为 0（静态星环只公转视差） | 常驻 |
| `chat-bubble` | 气泡交替滑入 + 三态轮显 | 左右气泡 `translateX ±40px→0`（`spring-pop`）左右交替；发送三态（发送中→已发→已读）各 12f 轮换 | 15f/条 |
| `drag-follow` | 拖拽跟随（试墨块） | 位置 spring 追随预烘焙轨迹 `spring({damping:14, stiffness:160})` | 常驻 |
| `glitch-flick` | 字符 glitch 一闪 | RGB 三层复制错位 ±2px + `hue-rotate` 抖动 + opacity 抽帧（6f 窗口，`random` 种子化）；低振幅变体（镜 30 三语标识轻闪） | 6f |
| `photo-develop` | 照片显影渐现（拍立得） | `filter: brightness 1.5→1 + saturate 0→1 + blur 3px→0`（从曝光过度到成像），`cine-ease-out`（Act 5 镜 34，素材[§三.20]足迹照片） | 45f |
| `recurse-zoom` | 画中画递归（Meta 拉出） | 2–3 层「屏中屏」位图嵌套：层 i 预缩放 `0.94^i` + opacity 错峰；主机位 `cam-dolly-out` 时各层按 zoom 匹配点交叉淡入，形成无限回退错觉（等效实现：预渲染嵌套帧，无需真递归） | 210f |
| `ink-bloom` | 墨晕扩散成字/成图 | 墨点 radial blob：scale 0.2→1 + 多层 blur 复制（blur 12/6/2px）错峰收缩，模拟墨在纸上洇开，`cine-ease-out`；**洇开慢档变体 90f**（Act 5 镜 32 墨入纸纤维） | 30f |
| `surface-tension` | 墨点表面张力微颤 | blob 边缘 `border-radius` 四值正弦游移 + `scale 1±0.012`（8f 微周期），欲滴感 | 30f 循环 |

---

## 2. 镜头运动语法（15 个令牌）

### 2.1 Rig 分层约定（等效实现：虚拟摄影机）

每镜统一三层容器结构，镜头令牌只动 `CameraRig`，内容层只做视差补偿：

```tsx
<AbsoluteFill style={{ overflow: 'hidden' }}>                      // FrameMask 取景框
  <AbsoluteFill style={{                                           // CameraRig 镜头（推拉摇移跟升降全在这层）
    transform: `scale(${cam.scale}) translate(${cam.x}px, ${cam.y}px) rotate(${cam.rot}deg)`,
    transformOrigin: cam.origin,                                   // 急推/俯冲的落点即 origin
  }}>
    <AbsoluteFill style={{ transform: `translate(${bg.x}px,${bg.y}px) scale(${bg.z})`,
                          filter: `blur(${bg.blur}px)` }}>         // 远景层 depth=0.4
    <AbsoluteFill>…主体内容 depth=1.0…</AbsoluteFill>              // 主体层
    <AbsoluteFill style={{ transform: `translate(${fg.x}px,${fg.y}px) scale(${fg.z})`,
                          filter: `blur(${fg.blur}px)` }}>         // 前景层 depth=1.6
```

- **视差公式**：`层位移 = 镜头位移 × (depth − 1) × −1`（远 0.4 / 主 1.0 / 前 1.6，前层取反向放大系数）。
- **景深等效**：`blur = 基准值 × |depth − 1|`（焦点在主体层时远景 blur 2–6px、前景 blur 4–8px）。
- 镜头令牌一律 `cine-ease-in-out`；急推 `cam-rush` 例外用 `cine-ease-in`（蓄力撞点）。

### 2.2 镜头令牌表（11 个机位令牌 + 4 个景深令牌）

| 令牌 | 中文注释 | 配方（CameraRig 参数） | 典型参数 |
|---|---|---|---|
| `cam-hold` | 固定机位 | 全参数恒定；可叠 `cam-drift` 微活 | — |
| `cam-dolly-in` | 推（前推） | `scale: 1→1+D`，`cine-ease-in-out`；慢速变体 D=0.02/镜（镜 1 超慢 2%）；**超慢档 D≤0.005/镜**（Act 5 镜 32「近乎静止的极缓微推」）；中速 D=0.10–0.18 | 60–300f |
| `cam-dolly-out` | 拉（后拉） | `scale: 1→1−D` + 视野揭示；终极拉镜变体（镜 40）D=0.45/210f | 40–210f |
| `cam-pan` | 摇（水平横摇） | `translateX` 为主 + `rotate ±0.5°` 微倾模拟摇 headed；广角变体幅度大（镜 27） | 60–120f |
| `cam-tilt` | 摇（俯仰摇） | `translateY` + `rotateX` 微量（≤2°，等效实现：以 translateY+scale 近似俯仰） | 60–220f |
| `cam-truck` | 移（横移） | 纯 `translateX`，无 rotate；微甩变体（whip-pan，镜 29）：首尾 6f 加 `motion-blur` 等效（`blur(3px)` 脉冲） | 70–150f |
| `cam-follow` | 跟（跟随主体） | 目标点位置预烘焙，rig 用 `spring({damping:200, stiffness:90})` 追随（无过冲的「跟拍手感」） | 常驻 |
| `cam-crane` | 升降 | `translateY`（等效实现：竖移 + 前后层视差放大系数差异模拟吊臂弧线）；上行/下行变体 | 60–220f |
| `cam-dive` | 俯冲急降 | `scale 1→1.6` + `translateY +` + 前景层 blur 增大冲屏，`cine-ease-in`（坠落感加速） | 30–45f |
| `cam-orbit` | 环绕摇移 | `translateX` 正弦 + `rotate ±1.5°` + 前后层反向位移（等效实现：2.5D 弧线）；同轴变体（镜 23 顶视）= 内容层 `rotate` 与 rig 反向抵消，画面中心不变 | 90–170f |
| `cam-rush` | 急推（全片仅 3 处：镜 13/21/42） | `scale: 1→S`（S=1.8–2.6），`cine-ease-in`，`transformOrigin` 对准目标点；终点必落指定锚帧（§5.3）；落点 0 顿帧直接接 spring 事件 | 20–50f |
| `cam-drift` | 微移漂移（固定机位的呼吸） | `translate ±4px`、`rotate ±0.15°` 低频正弦（与 `paper-breathe` 同周期，相位错开）；Act 5 振幅减半 | 常驻 |
| `dof-parallax` | 景深双层视差 | §2.1 公式；镜 1「前后两层光尘虚实景深」即此令牌 + `dust-field` 双实例（远层 blur 4px/近层 blur 1px）；Act 5 镜 33 书封墙投影层叠同用 | 常驻 |
| `dof-focus-pull` | 焦点转移（焦点切换） | 两层 blur 交叉插值：`键盘层 blur 0→5px` 同时 `屏幕层 blur 5→0px`，`cine-ease-in-out` | 20–30f |
| `dof-breath` | 景深呼吸 | 全层 blur 基准值 ±0.5px 低频正弦（4s 周期，与 `paper-breathe` 同相） | 常驻 |

---

## 3. 粒子与光影语言（9 个令牌）

### 3.1 `dust-field` 光尘粒子场（全片贯穿母题）

- **生成**：N 颗粒子，`random("dust-"+act+"-"+i)` 决定初始位、尺寸（2–5px）、速度档（慢 8px/s / 中 16 / 快 30）。
- **运动**：下坠漂移 `y = (y0 + t·v) % H` + 水平正弦摆动；持续态即 `gold-drift`。
- **呼吸式明暗**：`opacity = base × (0.55 + 0.45·sin(2π·frame/120 + φi))`，周期 120f（镜 1 意图「4 秒周期呼吸」）。
- **密度曲线（随幕，分镜 §4.3，v1.1 七幕）**：

| 幕 | 密度（颗） | 速度档 | 配色比 |
|---|---|---|---|
| Act 1 序 | 60–80 | 慢 | 暖金 90 / 钤红 10 |
| Act 2 沉默 | 20–30 | 慢 | 灰金 85 / 钤红 15（去饱和） |
| Act 3 复燃 | 90（向钤印点偏置聚拢） | 中 | 暖金 70 / 钤红 30 |
| Act 4 巡礼 | 60（均匀） | 中 | 暖金 95 / 钤红 5 |
| Act 5 人文 | 25–35（极缓漂浮） | 极慢 | 暖金 90 / 钤红 10（纸色雾提亮） |
| Act 6 工作流 | 40 | 快 | 冷白 70 / 电蓝 20 / 暖金 10 |
| Act 7 归一 | 90 → 收拢至 0（镜 44） | 慢→停 | 暖金 90 / 钤红 10 |

### 3.2 其余粒子与光影令牌

| 令牌 | 中文注释 | 配方 |
|---|---|---|
| `ink-speck` | 墨点粒子（打字溅出） | 每字触发 2–3 颗 3px 粒子：初速随机向上外侧 + 微重力，life 18f（600ms，素材[§一.2]），opacity→0 + scale→0.4 |
| `dust-ascend` | 尘埃上浮 | `dust-field` 反重力变体：`v` 取负、灰化配色、opacity 低；**暖变体**（镜 39/43「46 篇文章化作暖光悬浮」：暖金提亮 + 极慢速） |
| `converge-point` | 粒子聚拢成点 | 每粒子目标点=目标位，位置 `interpolate(p→target)` + `cine-ease-in`（先散后吸的加速感）；目标参数：**画面中心墨点**（镜 44）/ **纵深灭点**（镜 35「光尘向屏幕深处聚去」） |
| `data-stream` | 数据光流 | 定向拖尾：细长圆角矩形（渐变 白→accent→透明）沿方向高速位移，`mixBlendMode: screen`；密度/方向参数化（镜 4 屏幕光流、镜 39 双轴互掷、镜 14 光河） |
| `sweep-light` | 扫光 | 120–240px 宽线性渐变亮带（白 0→12%→0）`translateX` 掠过，`screen`；骨架 shimmer（镜 18）与黑胶 conic 高光（镜 23）皆此令牌变体 |
| `bloom-glow` | 辉光 bloom（等效实现） | 内容层复制一份：`filter: blur(12–24px) brightness(1.4)` + `opacity 0.2–0.35` + `mixBlendMode: screen`；强度参数化（钤印/白闪时刻冲满） |
| `red-blaze` | 红光晕染（钤印血色） | radial-gradient（钤印朱红→透明）scale 0→满幅 + opacity 先涨后衰，`screen`；镜 13 燎原变体（满幅保持）、镜 31 晕开变体（渐衰且色温转暖纸） |
| `paper-grain` | 宣纸肌理垫底 | 噪点纹理 tile（SVG feTurbulence 预渲染 PNG 亦可）全程垫底，`opacity ≤ 8%`，`mixBlendMode: overlay`；**Act 5 提亮为主背景**（分镜 §4.3：Act 5 段宣纸质感提亮） |

---

## 4. 转场语法（42 个令牌，覆盖分镜表全部转场列）

> 转场一般占用**出镜的末段帧**（镜边界帧号不动）；**重音工艺点为「跨切点配方」**——效果起于出镜末、峰值藏剪点、完成于入镜头（白 flash/燎原/星抛即此法）。配方均给出 Remotion 实现与时长。标注 ★ 的七处为分镜 §4.2（v1.1）指定的主要工艺点。

### 4.1 溶解/渐变族（6）

| 令牌 | 中文注释 | 用于镜 | 配方 | 时长 |
|---|---|---|---|---|
| `tr-dolly-blend` | 拉镜溶接（微拉入下镜） | 2 | 出镜末段 `cam-dolly-out(D=0.04)` + opacity 溶解交叉 | 20f |
| `tr-fade-dark` | 渐暗入黑 | 3、7 | 全场 `brightness 1→0` + 黑场 overlay `opacity 0→1`；参数 `hold`：镜 3 hold 0，镜 7 hold 30f（黑场一秒，占镜 8 头 30f） | 30f + hold |
| `tr-fade-black-final` | 终幕渐黑（光圈收缩） | 45 | vignette 遮罩半径 `140%→0%`（光圈收缩等效）+ brightness 同步衰减，`cine-ease-in-out` | 70f（7130–7200） |
| `tr-soft-bloom` | 柔曝过门（**非白闪**） | 30 | `brightness 1→1.6→1` 正脉冲，`cine-ease-in`；**不至纯白**——保全镜 15 唯一白闪的重量（见 D-3） | 15f |
| `tr-atomize` | 画面光尘化 | 43 | 全景元素逐块（网格 12×7）`opacity→0` + 位移散向 `dust-field` 粒子位，`cine-ease-out` | 40f |
| `tr-vinyl-swap` | 切年换面 120° 溶解 | 22、23 | 旧碟面 `opacity→0 + rotate −120°` 交叉新碟面 `rotate 0 + opacity→1`，`cine-ease-in-out`；连续切变体收短至 7f（素材 620ms/240ms） | 19f |

### 4.2 粒子族（12）

| 令牌 | 中文注释 | 用于镜 | 配方 | 时长 |
|---|---|---|---|---|
| `tr-dust-gather` | 光尘向中心聚拢成一点 | 1 | `converge-point` 全屏化：全部粒子 `interpolate(p→中心)` + `cine-ease-in`，末帧留一点冷光接镜 2 笔尖 | 60f |
| `tr-dust-ascend` | 尘埃飘起转场 | 8 | `dust-ascend` 全屏密度 ×3 + 画面 `brightness →0.6` 同步 | 30f |
| `tr-dust-disperse` | 字迹化作光尘飘散 | 41 | 文字层逐字 `translateY −20~−60px` + `blur 6px` + opacity→0，同步喷发 30 颗暖金粒子 | 35f |
| `tr-ink-scatter` | 字化墨点散去 | 9 | 逐字 `scale 1→0.6 + blur 4px`，原地溅出 `ink-speck` ×3/字，字与点同衰 | 30f |
| `tr-ink-drop` ★ | 墨点落纸 | 44 | 墨点 `translateY 0→+12px`（欲滴→坠落 8f，`cine-ease-in`）→ 触纸帧（7030 反拍）`ink-bloom` 起晕接管镜 45 开场 | 30f |
| `tr-bubble-gather` | 气泡聚拢成光点 | 26 | 全部气泡位 `interpolate(→屏幕中心)` + scale→0.2，到点合体为一枚 `bloom-glow` 光点 | 30f |
| `tr-orbit-collapse` | 星环旋转收束成一点 | 38 | 知识卡轨道 `ω ×3` 加速（保持 `cine-ease-in` 包络）+ 轨道半径→0，收束为一点后 `bloom-glow` 一闪 | 35f |
| `tr-converge-burst` | 交汇点爆发光华 | 39 | 交汇点 `bloom-glow` 强度 0.2→0.9（8f）→ `data-stream` 放射状喷出 12 条 + 白核 2f | 30f |
| `tr-light-sink` | 光点吸入黑暗 | 6 | tag 光点逐枚 `translate→画面深处灭点` + scale→0（透视缩小）+ opacity→0，`cine-ease-in` | 40f |
| `tr-red-ember` ★ | 暗红伏笔（墨晕/红晕涨满） | 10 | 深处红点 `glow-pulse` 心跳变体渐强（振幅 ×1→×3）→ `red-blaze` 半径涨满切镜 11 屏幕微光——即分镜 §4.2「镜 10→11 墨晕转场」的落地配方 | 50f |
| `tr-star-toss` | 柱顶光点上抛成星 | 42 | 柱顶光点抛物线 `y = −v·t + ½g·t²` 上抛 + 拖尾（`data-stream` 短段）+ 定格为星点闪烁（`glow-pulse`）；跨切点：星点余辉延入镜 43 开场 10f 消隐 | 20f |
| `tr-photo-ascend` | 照片化作光尘升散 | 34 | 照片 `translateY 0→−60px` + `blur 4px` + opacity→0，同步喷发 40 颗暖金粒子（`dust-ascend` 暖变体），`cine-ease-out`；Act 5 放宽档（§5.7） | 40f |

### 4.3 光效族（4）

| 令牌 | 中文注释 | 用于镜 | 配方 | 时长 |
|---|---|---|---|---|
| `tr-white-flash` ★ | 白闪（**全片唯一**，帧 2800） | 15 | 暖白 overlay `#FFF8F0` opacity `0→1`（涨满 30f，`Easing.in(Easing.quad)`）→ **纯白保持 3f（含剪点 2800=第 140 拍）** → 镜 16 从白释放 `opacity 1→0`（12f，`cine-ease-out`）；叠加 `bloom-glow` 冲满。曲线详见 §5.4 | 45f 跨切点 |
| `tr-glow-engulf` | 光晕放大吞没画面 | 11 | 屏幕光晕 `scale 1→3.2` + `blur 0→8px` + opacity→1 涨满切镜，`cine-ease-in` | 40f |
| `tr-blaze-spread` ★ | 红光燎原/晕开 | 13、31 | `red-blaze` 半径 `0→160%`；燎原变体（镜 13）：涨满跨切点 2420 入镜 14，满幅保持 10f 且饱和度拉满；**晕开入暖纸变体（镜 31→32，七工艺点）**：40f 渐衰且 grade 交叉至 `grade-warm-paper`（红晕融进暖纸素色） | 60f / 40f |
| `tr-data-stream` | 屏幕内容化作数据光流 | 4 | 屏幕内容逐行（8 行）`translateX +80px + blur 3px + opacity→0`，同步 `data-stream` 同向喷出接管画面 | 40f |

### 4.4 几何/遮罩族（16）

| 令牌 | 中文注释 | 用于镜 | 配方 | 时长 |
|---|---|---|---|---|
| `tr-carpet-lift` ★ | 光毯掀页（化流量光河） | 14 | 热力图整面以底边为轴 `rotateX 0→−70°`（`perspective(1600px)`，等效实现：CSS 3D 变换）掀起 + 底面泛光，后缘拖出 `data-stream` | 45f |
| `tr-screen-bleed` ★ | 穿屏递归拉出 | 40 | `recurse-zoom` 主拉至屏幕边框占满 → 边框辉光 `bloom-glow` 涨满 → 边框线 `scale 1.06 + blur` 化入镜 41 黑底（边框即转场遮罩） | 45f |
| `tr-perspective-tilt` | 热力图倾斜成 3D 平面 | 5 | 整面 `perspective(1200px) rotateX 0→18°` + 远端 `scale 0.9` + 远端 blur 2px（等效实现：CSS 3D），`cine-ease-in-out` | 30f |
| `tr-dive-through` | 镜头俯冲进地图 | 27 | `cam-dive` 全屏化：scale 1→1.7 + translateY 冲向地图标记 + 前景 blur 冲屏 6f，落点即镜 28 起点 | 30f |
| `tr-item-zoom` | 条目放大接镜（画中画跳切） | 17 | 被选条目 `scale 1→2.4`（`cine-ease-in`）+ 周边元素 blur 3px 退散，放大画即镜 18 书架首格 | 25f |
| `tr-flip-swap` | 翻转换景 | 18 | `flip-reveal` 全屏化：书封 rotateY 0→90° 时切镜 19（半翻切点，动量衔接） | 20f |
| `tr-page-curl` | 封面向左翻卷 | 19 | `rotateY 0→−90°`（transform-origin: left）+ 右缘渐变阴影位移模拟卷边（等效实现：无真网格卷曲，用阴影位移动画） | 30f |
| `tr-page-turn` | 纵线尽头翻页 | 25 | 整页 `translateX −40px + rotateY 12°` + 右缘阴影扫过，`cine-ease-in-out`（纸页手感） | 30f |
| `tr-verse-fold` ★ | 诗句化作书页翻动 | 32 | 诗句行逐行 `translateY −10px + opacity→0.3` 收拢成页 → 页面 `rotateY 0→−90°` 翻动（transform-origin: left + 纸缘阴影位移）切镜 33，`cine-ease-in-out`；Act 5 放宽档 | 40f |
| `tr-book-to-photo` | 书页合拢化作照片落纸 | 33 | 左右页 `rotateY ±0→合拢`（合书动势）→ 合拢瞬间 `scale 0.96→1` 落纸交叉淡变为拍立得白框（8f crossfade），`cine-ease-in-out` | 35f |
| `tr-scroll-bleed` | 滚动出血接续 | 20 | 页面内容 `translateY` 加速冲出下缘（`cine-ease-in`）+ 下方镜 25 内容上缘提前 10f 入画（出血预揭） | 15f |
| `tr-cursor-lead` | 光标牵引 | 16 | 光标沿贝塞尔路径滑向镜 17 时间轴首点（`cine-ease-in-out`），落点亮起 `glow-pulse` 一记 | 15f |
| `tr-heart-zoom` | 红心放大转场 | 21 | 红心 `scale 1→4` + `blur 0→2px` 冲满切镜 22，`cine-accent`；短变体 20f（镜 21 长度 100f） | 25f/20f |
| `tr-grid-scatter` | 九宫格化整为零散开 | 28 | 九格各自 `translate` 向九个方向 `+120px` + `rotate ±6°` + opacity→0，`cine-ease-out`（散而不乱：方向角均分） | 35f |
| `tr-band-sweep` | 色卡拼成色带横扫 | 29 | 色卡列 `translateX` 依序加速收拢成整色带 → 色带全屏横扫（`translateX −100%→0`，`cine-ease-in`）切镜 30 | 30f |
| `tr-stamp-zoom` | 落章放大 | 37 | publish 钤印 `scale 1→3`（`cine-ease-in`）+ 章面 `bloom-glow` 冲满切镜 38；短变体 20f（镜 37 末段） | 25f/20f |

### 4.5 直切族（2）

| 令牌 | 中文注释 | 用于镜 | 配方 | 时长 |
|---|---|---|---|---|
| `tr-cut-wet-ink` | 湿墨直切（匹配剪辑） | 12 | 0f 硬切；约束：切点两侧最近墨迹位置/行进度匹配（「墨迹未干」），切后 10f 内 `write-fade` 补一笔余韵 | 0f + 余韵 10f |
| `tr-freeze-cut` | 冻结帧切 | 23→24、24→25 | 先 `eq-freeze`（scaleY 0.35）保持 → 0f 硬切；切点吸附拍网格（3780 整拍 / 3890 半拍），音效骤停即切 | 冻结 ≥6f + 0f |

### 4.6 光标族（1）★

| 令牌 | 中文注释 | 用于镜 | 配方 | 时长 |
|---|---|---|---|---|
| `tr-cursor-cut` ★ | 光标闪烁三下切入终端 | 35 | `caret-glow` 呼吸闪烁变体：三记亮灭各 6f（5520/5540/5560，三记整拍，分镜「闪烁三下」）→ 第三记亮起时 **0f 硬切**镜 36 终端深蓝（黑→深蓝直切，电流声同帧起）——即分镜 §4.2「镜 35→36 光标闪烁切入终端」工艺点 | 铺垫 60f + 切点 0f |

### 4.7 字符族（1）

| 令牌 | 中文注释 | 用于镜 | 配方 | 时长 |
|---|---|---|---|---|
| `tr-char-morph` | 命令行字符重组为舰队阵列 | 36 | 逐字符 `translate`（网格化重排至 5×2 舰位）+ 部分字符 `opacity→0` 由 `data-stream` 光点替补，`cine-ease-in-out`（等效实现：字符位移动画 + 预排目标坐标） | 30f |

---

## 5. 节奏与卡点（90 BPM 体系，v1.1 时间轴）

### 5.1 拍网格与吸附规则

- **90 BPM ⇒ 1 拍 = 20f（⅔ 秒）**；半拍 = 10f；16 分格 = 5f。
- **镜边界帧号不动**（INV，分镜 §4.1）。剪切点允许落在反拍（x.5 拍）——这是呼吸错落的来源，不是误差；v1.1 指定反拍切镜：6550（A7 起拍）、7030（落版起手），另有 1670/2610/3030/3630/3890/4010/4470/5250/5750/5930/6450/6730 等自然半拍边界。
- **镜内动效锚点吸附**：入场/落章/急推收点等「事件锚」吸附最近的整拍或半拍网格；**对拍容差 ±4–8f**（分镜给 Act 4，镜 37 五段点同法外延使用），幕边界事件不容差。
- **反拍切入规则**：剪切点在反拍的镜（如镜 45@7030），其镜内事件走「本镜私有网格」（起点 + n×20f），落定/重音事件回归全局整拍——错落起手、整拍收束。
- **半拍填充**：分镜 §4.1 给 6550/7030 各留 6540–6560、7020–7040 半拍填充（音频层）；视觉侧切点帧号不动，转场效果（`tr-dust-disperse` 尾 / `tr-ink-drop` 坠落）恰好吃掉这半拍。

### 5.2 结构锚点对拍表（帧号 → 拍号，v1.1）

| 帧 | 拍号 | 性质 | 对拍动效 |
|---|---|---|---|
| 0 | 0 | 整拍 | 全片起（黑场 + `dust-field` 渐显） |
| 220 | 11 | 整拍 | 打字机首字（分镜 §4.1 指定，键击区间 220–500）；键击走 16 分格（§5.6） |
| 500 | 25 | 整拍 | 镜 3 标题四元素落笔起 |
| 700 | 35 | 整拍 | Act 2 起拍（心跳鼓点始动） |
| 1160 | 58 | 整拍 | 骤暗起（配乐抽空） |
| 1800 | 90 | 整拍 | Act 3 起拍（心跳入） |
| 2200 | 110 | 整拍 | 宣言下半起句（镜 13 起点） |
| **2420** | **121** | **整拍（全片第一重音）** | `seal-stamp` 落章 + `cam-rush` 收点 + `tr-blaze-spread` 起晕，三事件同帧 |
| 2800 | 140 | 整拍 | Act 4 起拍兼白闪剪点 |
| 2920–4680 | 146–234 | 整拍步进 | Act 4「一拍一景」：镜内锚点按 20f 网格呼吸偏移（±4–8f，如镜 30 四页连击 4480/4500/4520/4540） |
| **3780** | **189** | **整拍（骤停卡点）** | `eq-freeze` 冻结帧切（整拍冻结）；**3790（第 189.5 半拍）EQ「再起」**（与 v1.0 相反：先整拍冻结、后半拍复起，见 D-2） |
| 4700 | 235 | 整拍 | Act 5 起拍——**鼓点全停**，此后至 5600 动效豁免对拍（§5.7） |
| 5600 | 280 | 整拍 | Act 6 起拍（电子节拍接管；镜 35 光标三闪 5520/5540/5560 三记整拍铺垫此切点） |
| 5750–5910 | 287.5–295.5 | 半拍网格 ×2 拍间隔 | 镜 37 五段点（5750/5790/5830/5870/5910，等分 40f=2 拍；第四记 5870 最重——机械切分感贴合 Act 6 电子节拍） |
| **6550** | **327.5** | **反拍（A7 起拍）** | `tr-dust-disperse` 尾恰填 6540–6560 半拍；镜 42 动效自 6560（第 328 拍整）起效 |
| 6720 | 336 | 整拍 | 镜 42 `cam-rush` 收点（柱顶重鼓）+ `num-roll` 收数；`tr-star-toss` 6720 起跨切点（星点余辉越过 6730 半拍剪点延入镜 43） |
| **7030** | **351.5** | **反拍（落版起手）** | `tr-ink-drop` 触纸；镜 45 私有网格起算（§5.5） |
| **7200** | **360** | **整拍（终击）** | 最后一记重鼓 + `tr-fade-black-final` 完成 |

### 5.3 三处急推曲线（`cam-rush` 具体参数，v1.1）

| 镜 | 起推帧 → 收点帧 | 时长 | scale | easing | 落点事件（同帧） |
|---|---|---|---|---|---|
| 13 钤印 | 2370 → **2420** | 50f | 1→2.6（origin=钤印落点） | `Easing.in(Easing.cubic)`（先缓后猛，撞点即重音） | `seal-stamp` + `red-blaze`（第 121 拍重鼓） |
| 21 点赞 | 3440 → **3460** | 20f | 1→1.9（origin=点赞钮） | `Easing.in(Easing.quad)`（短促） | `spring-pop`「啵」气泡（第 173 拍） |
| 42 冲顶 | 6700 → **6720** | 20f | 1→1.8（origin=2026 柱顶） | `Easing.in(Easing.cubic)` | 柱顶重鼓 + `num-roll` 收数（第 336 拍）+ `tr-star-toss` 跨切点起 |

> 通用约束：急推禁 ease-out（不许减速撞点）；收点 0 顿帧；收点后第一事件必须在收点帧同帧发生。

### 5.4 白闪曲线（`tr-white-flash`，帧 2770–2815，唯一一处）

```
2770–2800  暖白 overlay opacity 0→1     Easing.in(Easing.quad)   （涨满 30f）
2800–2803  纯白保持 3f                  （剪点 2800 = 第 140 拍，藏在纯白中）
2800–2812  镜16 从白释放 opacity 1→0    Easing.out(Easing.cubic) （12f）
叠注：bloom-glow 强度于 2790–2803 冲满至 0.9；白用 #FFF8F0 暖白，避免死白刺目
```

### 5.5 落版反拍网格（镜 45，7030 起手）

私有网格 = 7030 + n×20（全局半拍错位 +10f），终击回归全局整拍：

| 帧 | 私有拍 | 事件 |
|---|---|---|
| 7030 | 0 | `tr-ink-drop` 触纸（镜 44 末 7022–7030 坠落已备；7020–7040 半拍填充由坠落/触纸吃掉） |
| 7050 | 1 | `ink-bloom` 起晕成「wuh.site · 朝朝如念」（至 7080） |
| 7080–7143 | — | `typewriter-type` 快书变体（3f/字，21 字）再书打字机句 |
| 7150 | 6 | `seal-stamp` 22px 钤印落定（`seal-tilt` 终值） |
| 7130–7200 | — | `tr-fade-black-final` 光圈收缩渐黑（70f） |
| **7200** | —（全局第 360 拍） | **终击重鼓** + 全黑，混响尾音 2s（60f，属音频层） |

### 5.6 键击量化（打字机节拍层）

- 默认档：**3.3f/字**（素材 100ms+随机 40ms 的取整等效），落在 20f 拍的六分格上；镜 45 快书变体 3f/字。
- 首字锚帧 **220**（分镜 §4.1 指定，键击区间 220–500：22 字 × 3.3f ≈ 73f，220–293 打完；短划线 `path-draw` 300–320；`cam-dolly-out` 微拉 320–360；余幅静置呼吸）。
- `caret-glow` 与 `ink-speck` 与键击同帧；逐字事件即音频键击层的时间码来源（实现时导出字符帧表给音频对位）。

### 5.7 Act 5 极简呼吸档（帧 4700–5600，鼓点全停）

分镜 §4.1 明确 Act 5 为「全片最慢呼吸，句子级微动效，禁止卡点切镜」，配乐抽薄至单音钢琴。动效侧对应对拍豁免与减法规则：

- **对拍豁免**：本幕动效不吸附拍网格、不与重鼓对位（无鼓可对）；句级事件间隔 ≥90f。
- **禁用清单**：`spring-pop` 等一切弹性过冲、`cascade-stagger` 弹跳感、急推/whip、glitch、白闪/强光效；转场仅限溶解/翻页/光尘族且时长放宽至 35–40f。
- **只允许**：`write-fade(慢档 28f)`、`ink-bloom(洇开慢档 90f)`、`path-draw(慢档)`、`photo-develop`、`heavy-glide(拍立得落纸 ≤40f)`、`paper-breathe`、`glow-pulse(极淡档)`、`converge-point(纵深灭点变体)`、`gold-drift(极缓档)`、`cam-hold/cam-drift/cam-dolly-in(超慢档)`。
- **镜 32（全片最慢一镜 300f）事件预算 ≤5**：句 1 显影 4740、句 2 显影 4860、角落小字 `ink-rise` 4930、`tr-verse-fold` 起势 4960——其余时间交给 `paper-breathe` + 墨洅 + 光尘极缓漂浮。
- ** Act 5 → Act 6 的情绪交接**：镜 35 用 `tr-cursor-cut` 三闪硬切把「静」交还给「机械节拍」——静与进的对比即此一帧（5600）。

---

## 6. 色彩情绪令牌（7 个幕调色令牌；宣纸肌理 `paper-grain` 定义见 §3.2，在此复引其七幕常驻约定）

> **令牌总账**：§1 曲线 4 + §1 元素 31 + §2 镜头 15 + §3 粒子光影 9 + §4 转场 42 + §6 幕调色 7 = **108 个唯一令牌**。

七幕调色 = 三层叠加约定：**LUT 底色层**（纯色 + blend mode + opacity）＋**雾光层**（渐变 + screen）＋**全局滤镜**（saturate/brightness）。叠加层挂于 FrameMask 之上、转场层之下。色值为示意，落地以站点 brand tokens（玄墨黑 / 钤印朱红 / 暖金 / accent 系）校准。

| 令牌 | 中文注释 | LUT 底色层 | 雾光层 | 全局滤镜 | 光尘联动（§3.1） |
|---|---|---|---|---|---|
| `grade-ink-black` | 玄墨黑（Act 1 序） | `#16130F` multiply @38% | 暗角 radial 45% | saturate 0.9 | 暖金 90/红 10，中密 |
| `grade-ash-grey` | 灰烬冷灰（Act 2 沉默） | `#3A3A38` multiply @45% | 冷灰雾 `#8A8A86` screen @8% | saturate 0.55 | 灰金稀疏 20–30 颗 |
| `grade-seal-red` | 钤印朱红（Act 3 复燃） | `#7A1F16` soft-light @30% | 钤红晕 radial（随 `red-blaze` 事件脉冲） | saturate 1.05 | 金 70/红 30，聚拢 |
| `grade-warm-gold` | 暖阳米金（Act 4 巡礼） | `#E9D9AE` soft-light @22% | 米金 `#F5E9C8` screen @6% | saturate 1.0 | 金 95/红 5，均匀 |
| `grade-warm-paper` | 暖纸素色（Act 5 人文，v1.1 新增） | `#F3EAD8` soft-light @30% | 纸白 `#FFF8EC` screen @8% | saturate 0.95 | 暖金 90/红 10，极缓漂浮；`paper-grain` 提亮为主背景 |
| `grade-electric-blue` | 冷白电蓝（Act 6 工作流） | `#0E1622` multiply @50% | 冷白 `#DCEBFF` screen @10% | saturate 0.85 | 冷白 70/电蓝 20/金 10 |
| `grade-fade-black` | 归于墨黑（Act 7 落版） | 由 `grade-warm-gold` 40f 插值回收 → `#060505`（终点与 `tr-fade-black-final` 合流） | 暗角收至 0 | brightness →0 | 光尘收拢至 0 |
| `paper-grain` | 宣纸肌理（全程垫底） | §3.2 令牌，七幕常驻 `opacity ≤8%`（Act 5 提亮为主背景） | — | — | — |

**幕间调色过渡**：幕切换帧（700/1800/2800/4700/5600/6550）前 40f 起，两 grade 令牌 opacity 交叉插值（`cine-ease-in-out`）；镜 31→32 的 grade 交叉由 `tr-blaze-spread(晕开入暖纸变体)` 承载（红晕中融进暖纸素色）。

**与 brand tokens 的关系（仅建议，不创建文件）**：建议新增 `videos/preprod-site-film/motion-tokens.ts`，结构为三组常量——`CURVES`（§1.1 基元 + spring config）、`SPRINGS`（§1.2 spring 参数表）、`GRADES`（§6 七幕色值，从站点 brand tokens import 或对齐命名），令牌名与本规范 §1–§6 一一对应，供各镜 `<Sequence>` 直接引用。

---

## 7. 45 镜覆盖矩阵（INV-4 对账表，已按 v1.1 回填帧号）

> 每格引用 §1–§6 令牌；参数变体以括号注记；关键帧号为 v1.1 时间轴。★ = 七处工艺点所在镜。

| 镜 | 起止 | 入场令牌 | 持续令牌 | 出场令牌 | 转场令牌 |
|---|---|---|---|---|---|
| 1 | 0–220 | `dust-field`(渐显 30f) + `gold-drift` | `cam-dolly-in`(慢 2%) + `dof-parallax`(双层光尘虚实) + `paper-breathe`(粒子明暗) | `converge-point`(起势) | `tr-dust-gather` |
| 2 | 220–500 | `caret-glow`(点亮) + `typewriter-type`(首字 220) | `typewriter-type` + `ink-speck` + `caret-glow` + `cam-follow`(笔尖) | `path-draw`(短划线 300–320) + `cam-dolly-out`(微拉) | `tr-dolly-blend` |
| 3 | 500–700 | `ink-rise`×4 阶梯(0/2.4/4.8/7.2f) | `paper-breathe`(标题) + `gold-drift`(光尘环绕) | —（亮度交由转场接管） | `tr-fade-dark`(hold 0) |
| 4 | 700–880 | `typewriter-type`(mono) + `caret-glow` | `cam-dolly-in`(过肩) + `dof-focus-pull`(键盘→屏幕) | — | `tr-data-stream` |
| 5 | 880–1040 | `heat-wave`(生长波) + `num-roll`(1,168/685) | `cam-truck`(跟生长方向) | — | `tr-perspective-tilt` |
| 6 | 1040–1160 | `cascade-stagger`(tag 钤亮, glow 基底) + `glow-pulse` | `cam-pan`(低角度横摇) | — | `tr-light-sink` |
| 7 | 1160–1380 | `bloom-glow`(微光渐显 20f) | `cam-hold` + `heat-wave`(熄灭暗浪) + `dye-drain`(全场灰化) | — | `tr-fade-dark`(hold 30f) |
| 8 | 1380–1520 | （前置黑场保持 30f）`ink-rise`(「0」，1420 起) | `cam-dolly-in`(缓推逼近) + `dust-ascend` | `dye-drain`(灰柱颗粒化) | `tr-dust-ascend` |
| 9 | 1520–1670 | `ink-rise`(逐行级联) | `cam-hold` + `cam-drift`(微移漂移) + `paper-breathe` | — | `tr-ink-scatter` |
| 10 | 1670–1800 | `ink-rise`(字卡) + `glow-pulse`(暗红心跳变体) | `cam-crane`(俯角缓降) + `dye-drain`(墨点去色) | `glow-pulse`(红点振幅 ×3) | `tr-red-ember` ★ |
| 11 | 1800–1980 | `path-draw`(山峦/涟漪逐层显影) | `cam-follow`(指尖) + `dof-focus-pull`(浅景深) | `bloom-glow`(光晕涨) | `tr-glow-engulf` |
| 12 | 1980–2200 | `write-fade`(手写逐字落墨) | `cam-tilt`(俯拍下摇) + `paper-breathe`(纸面) | — | `tr-cut-wet-ink` |
| 13 ★ | 2200–2420 | `write-fade`(宣言下半) | `cam-rush`(2370→2420) + `seal-stamp`(2420) + `red-blaze` | `red-blaze`(红墨持涨) | `tr-blaze-spread`(燎原变体，跨切点 2420) |
| 14 | 2420–2610 | `glow-pulse`(单点复燃) + `heat-wave`(波纹复色) | `cam-crane`(上摇) + `cam-dolly-out`(拉远揭示) | — | `tr-carpet-lift` ★ |
| 15 | 2610–2800 | `cascade-stagger`(灯笼点亮, 20f 步进 ×9) + `glow-pulse` | `cam-dolly-in`(一镜到底前飞) | `bloom-glow`(白光涨满 2770–2800) | `tr-white-flash` ★(剪点 2800) |
| 16 | 2800–2920 | （白闪释放 2800–2812）`cascade-stagger`(板块 ink-rise 基底) | `cam-crane`(纵向下移巡阅) | `glow-pulse`(首枚墨点点亮) | `tr-cursor-lead` |
| 17 | 2920–3030 | `hover-dye`(首行染色左移) | `cam-truck`(特写跟光标) + `caret-glow`(光标) | `flip-reveal`(条目起翻) | `tr-item-zoom` |
| 18 | 3030–3120 | `shimmer-sweep`(骨架 45f→压缩 36f) | `cascade-stagger`(书封 flip-reveal 落架, step 3f) + `cam-truck`(横移) | — | `tr-flip-swap` |
| 19 | 3120–3260 | `path-draw`(双曲线生长) + `ink-rise`(大标题) | `cam-dolly-in`(缓推画中画) + `bloom-glow` | — | `tr-page-curl` |
| 20 | 3260–3380 | `seal-tilt`(文首标签 ±1.6°) + `cascade-stagger`(TOC 项) | `cam-crane`(跟随滚动纵移) + `glow-pulse`(TOC active 居中) | — | `tr-scroll-bleed` |
| 21 | 3380–3480 | `cascade-stagger`(6 圆钮, 3380–3420) | `cam-rush`(3440→3460) + `spring-pop`(气泡 3460) + `num-roll`(已赞 N) | `bloom-glow`(红心起光) | `tr-heart-zoom`(短变体) |
| 22 | 3480–3630 | `orbit-drift`(刻度带入环) + `ink-rise`(水印淡入) | `cam-orbit`(环绕弧线) + `orbit-drift`(按距缩放缩淡) + `dof-parallax`(水印视差) | — | `tr-vinyl-swap`(3611–3630) |
| 23 | 3630–3780 | `tr-vinyl-swap` 承接(碟面淡入) | `vinyl-spin`(5s/圈) + `sweep-light`(conic 高光扫唱纹) + `cam-orbit`(同轴变体) | `eq-freeze`(3770 预冻 0.35) | `tr-vinyl-swap` + `tr-freeze-cut`(3780 整拍冻结切) |
| 24 | 3780–3890 | `eq-freeze`(3780–3790 保持) → `eq-bounce`(3790 半拍再起) | `cam-hold`(同框分位) + `marquee-drift`(歌名) | `eq-freeze`(3884 预冻) | `tr-freeze-cut`(3890) |
| 25 | 3890–4010 | `path-draw`(纵线生长) + `cascade-stagger`(节点 ink-rise) | `cam-crane`(沿纵线下行) | — | `tr-page-turn` |
| 26 | 4010–4120 | `spring-pop`(触发卡→1120×720 大窗) | `chat-bubble`(交替滑入+三态) + `cam-dolly-in`(推入) + `cam-drift`(微摇跟随) | — | `tr-bubble-gather` |
| 27 | 4120–4240 | `heat-wave`(逐格波浪点亮) | `cam-pan`(广角横摇) + `dof-parallax`(板块视差) | — | `tr-dive-through` |
| 28 | 4240–4360 | `ripple-bloom`(标记绽开 ×2, 错 8f) | `cam-dive`(俯瞰急降) + `cascade-stagger`(九宫格展开) | — | `tr-grid-scatter` |
| 29 | 4360–4470 | `cascade-stagger`(全阶色卡) + `hover-dye`(换色 A/B) | `cam-truck`(微甩 whip 变体) + `drag-follow`(试墨块) | — | `tr-band-sweep` |
| 30 | 4470–4580 | `cascade-stagger`(页面序列, 4480/4500/4520/4540 四连击) + `write-fade`(reveal entry) | `cam-dolly-in`(高速穿梭) + `glitch-flick`(三语标识低振幅) | — | `tr-soft-bloom`（非白闪，D-3） |
| 31 | 4580–4700 | `spring-pop`(纸卡展开) + `cascade-stagger`(8 图标围合) | `cam-dolly-in`(俯拍轻急推) + `seal-stamp`(落章) | `red-blaze`(晕起) | `tr-blaze-spread`(晕开入暖纸变体 ★，grade 交叉入 Act 5) |
| 32 | 4700–5000 | `write-fade`(慢档，句 4740/4860) + `ink-bloom`(洇开慢档) | `cam-hold` + `cam-drift` + `cam-dolly-in`(超慢 0.5%) + `dof-parallax`(前景光尘炷) + `gold-drift`(极缓档) + `ink-rise`(角落小字 4930) | — | `tr-verse-fold` ★(4960–5000) |
| 33 | 5000–5250 | `dof-parallax`(书墙投影层叠) + `cam-truck`(横移) | `cam-dolly-in`(缓推抽出的书) + `path-draw`(划线慢档 ×3, 错 40f) + `glow-pulse`(微光档) | — | `tr-book-to-photo` |
| 34 | 5250–5500 | `heavy-glide`(拍立得落纸 5300/5380) + `photo-develop`(显影 45f 各随其后) | `cam-hold` + `cam-drift` + `cam-dolly-in`(缓慢微推) + `glow-pulse`(极淡档，地图光点) | — | `tr-photo-ascend` |
| 35 | 5500–5600 | `caret-glow`(呼吸闪烁三记 5520/5540/5560) | `converge-point`(纵深灭点变体) + `cam-dolly-out`(缓慢后拉入暗) | — | `tr-cursor-cut` ★(硬切 5600) |
| 36 | 5600–5750 | `typewriter-type`(命令行快档) + `glitch-flick`(字卡) | `cam-dolly-in`(屏幕微距) + `dof-parallax`(字符景深分层) | — | `tr-char-morph` |
| 37 | 5750–5930 | `cascade-stagger`(五段徽章，五记节拍 5750/5790/5830/5870/5910) | `cam-follow`(侧向跟拍) + `spring-pop`(提案卡展开) + `seal-stamp`(publish 5910) | — | `tr-stamp-zoom`(短变体) |
| 38 | 5930–6120 | `cascade-stagger`(brief 落位, heavy-glide 基底, step 渐密 6f→2f) + `orbit-drift`(知识卡星环) | `cam-truck`(升格慢移) + `cam-dolly-out`(拉起全貌) | — | `tr-orbit-collapse` |
| 39 | 6120–6240 | `path-draw`(双时间轴描绘) | `data-stream`(光点互掷) + `cam-dolly-out`(双轴同框) | `glow-pulse`(交汇脉冲) | `tr-converge-burst` |
| 40 ★ | 6240–6450 | `recurse-zoom`(嵌套视口展开) | `cam-dolly-out`(终极拉镜 210f) + `dof-parallax`(递归层) + `caret-glow`×2(代理铭牌双光标) | — | `tr-screen-bleed` ★ |
| 41 | 6450–6550 | `write-fade`(英文落款) + `ink-rise`(中文小字) | `cam-hold` + `gold-drift` | — | `tr-dust-disperse`(6515–6550，尾填 6540–6560 半拍) |
| 42 | 6550–6730 | （6560 起效）`cascade-stagger`(柱体生长, step 4f) + `num-roll` | `cam-truck`(横向跟移) → `cam-rush`(6700→6720) | `num-roll`(4,387 收数 6720) | `tr-star-toss`(6720 起跨切点) |
| 43 | 6730–6900 | `ink-rise`(全景元素) + `dust-ascend`(暖变体，46 篇暖光浮起；承接镜 42 星点余辉) | `cam-orbit`(缓环) + `paper-breathe` + `dof-breath` + `eq-bounce`(低振幅) + `marquee-drift` + `glow-pulse`(热力微闪) | — | `tr-atomize` |
| 44 | 6900–7030 | `converge-point`(粒子汇聚成墨点，6900–6980) | `cam-dolly-out`(急拉) → `cam-hold`(骤停) + `surface-tension`(张力微颤) | — | `tr-ink-drop` ★(坠落 7022–7030，触纸 7030 反拍) |
| 45 ★ | 7030–7200 | `ink-bloom`(墨晕成字 7050–7080) + `typewriter-type`(快书 7080–7143) | `cam-hold`(微距) + `gold-drift`(环绕) | `seal-stamp`(7150) + `bloom-glow`(收) | `tr-fade-black-final`(7130–7200) |

**矩阵自查（v1.1）**：45/45 行 × 4 列全部有令牌；引用的令牌均在 §1–§6 定义域内；七处工艺点（tr-red-ember / tr-carpet-lift / tr-white-flash / tr-blaze-spread·晕开入暖纸 / tr-cursor-cut / tr-screen-bleed / tr-ink-drop）与分镜 §4.2（v1.1）一一对应；三急推（镜 13/21/42）与唯一白闪（镜 15）落位无误；Act 5 四镜（32–35）全部走 §5.7 极简呼吸档。

---

## 8. 给实现者的开工清单（建议实现顺序）

1. **地基**：建 `videos/preprod-site-film/motion-tokens.ts`（§6 建议）——落地 `CURVES` / `SPRINGS` / `GRADES` 三组常量；同时实现 `CameraRig`（§2.1 三层容器）与 `ParallaxLayer` 两个通用组件。
2. **粒子系统三件套**：`dust-field`（含七幕密度/配色曲线查表）、`ink-speck`、`data-stream`——全部 `random(seed)` 确定性；先跑通镜 1 全镜作为粒子验收样片。
3. **通用小令牌组件**：`ink-rise` / `write-fade`（含慢档）/ `typewriter-type`（含键击帧表导出）/ `seal-stamp`（含 `seal-tilt`）/ `cascade-stagger` / `num-roll` / `photo-develop`——它们覆盖了 45 镜中约七成入场。
4. **转场库**：按 §4 族实现；优先级：七处工艺点（`tr-red-ember` / `tr-carpet-lift` / `tr-white-flash` / `tr-blaze-spread(晕开入暖纸)` / `tr-cursor-cut` / `tr-screen-bleed` / `tr-ink-drop`）→ 直切族 → 其余按镜序补齐。
5. **逐幕合成**：按 Act 1→7 顺序实现，每完成一镜对照 §7 矩阵四列核对；Act 4 批量镜（16–31）用「一拍一景」模板（`cam-crane/truck/dolly-in` 轮换 + `cascade-stagger` 入场）提效；Act 5 四镜单独按 §5.7 减法规则实现，克制优先。
6. **卡点校准 pass**：全片对 §5.2 锚点表逐帧核对——重点 2420（三事件同帧）、3780/3790（冻结→半拍再起）、6720（柱顶）、6550/7030（反拍半拍填充）、7200（终击）；Act 5（4700–5600）确认为对拍豁免区。
7. **调色 pass**：挂 `grade-*` 七幕叠加层与幕间 40f 交叉（镜 31→32 走 `tr-blaze-spread` 晕开入暖纸）；校准 `paper-grain ≤8%`（Act 5 提亮）；复核光尘密度曲线与幕色联动。
8. **终检**：45 镜 × 4 列矩阵回扫（INV-4）+ 帧数对账 7200（= 700+1100+1000+1900+900+950+650）+ 禁线性抽查（镜头运动无一 `Linear`）+ Act 5 事件预算抽查（镜 32 ≤5 个动效事件）。

---

## 附：设计决策记录

- **D-1（镜 42 冲顶收点）**：分镜 §4.1 将 A7 起拍重鼓标于 6550（反拍，第 327.5 拍），镜 42 为 6550–6730。本规范裁定：镜 42 动效自 6560（第 328 拍整）起效（6540–6560 半拍由 `tr-dust-disperse` 尾填充），`cam-rush` 收点与柱顶重鼓落在 **6720 整拍**（第 336 拍），`tr-star-toss` 自 6720 跨切点、星点余辉越过 6730（半拍剪点）延入镜 43——既守「重鼓卡柱顶」意图，又守急推收点必落整拍之规。
- **D-2（镜 23/24 冻结时序，v1.1 修订）**：帧 3780 为镜界且恰为整拍（第 189 拍）。裁定：3770 起 `eq-freeze` 预冻（镜 23 末），3780 `tr-freeze-cut` 硬切（音效骤停即切，**整拍冻结**），3780–3790 保持冻结（半拍），**3790（第 189.5 半拍）`eq-bounce`「再起」**——骤停在整拍、复起在半拍，切分呼吸与 v1.0 相反而更贴「音乐骤停半拍再起」的字面。
- **D-3（镜 30 柔曝）**：分镜概述规定全片唯一白闪在镜 15，而镜 30 转场列写「连拍末帧白闪」。裁定镜 30 使用 `tr-soft-bloom`（brightness 冲 1.6，**不至纯白**），保全镜 15 白闪的唯一性与重量。
- **D-4（叙事顺序）**：宣言日（06-21）晚于上线日（06-14）为情感蒙太奇排序，按分镜要求保留，不作「勘误」。
- **D-5（Act 5 节奏特权）**：镜 32–35（4700–5600）鼓点全停，动效对拍豁免、禁弹性/急推/强光效；镜 32 全片最慢一镜事件预算 ≤5。此幕的「少」即设计本身——它是 Act 6 机械节拍的反衬板。
