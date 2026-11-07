---
title: 视频制作流程（前期五件套 → 正式制作 → 渲染出片）
domain: video-materials
keywords: [制作流程, 前期, 分镜, storyboard, motion-spec, animatic, 正式制作, 素材库, 分镜师, UE, 多代理, 多片, FilmShell, shell, 三段装配, 诗电影, 文学改编, character-design, 本地 BGM mux, unit, scope, 资产层, 资产登记表, asset-registry, 导演列, 尾帧, 字数硬表, 风格锚点, 定妆三视图, INV-S7]
scope: [videos/, shadow-docs/knowledge/, scripts/, src/Root.tsx, .github/workflows/]
status: active
source:
  - changes/20261025-feature-site-film-preprod/brief.md
  - changes/20261025-feature-site-film-production/brief.md
  - changes/20261031-feature-wuh-site-intro-v2-production/brief.md
  - changes/archive/20261101-feature-zhi-guo-xiang-preprod/brief.md
  - changes/20261101-feature-zhi-guo-xiang-production/brief.md
  - changes/20261107-feature-asset-registry-shot-schema/brief.md
  - changes/archive/20261107-feature-making-of-zhi-guo-xiang-preprod/brief.md
verified: 2026-11-07
verified-depth: runtime
verified-scope: 2026-11-07 资产层机检落地（asset-registry.md 登记表 + 导演列解析 + 字数硬表 + INV-S7：fixture 六轮红绿拒绝路径 + site-film/wuh-site-intro-v2/zhi-guo-xiang 三单元双绿 + zhi-guo-xiang import 幂等 diff 为空；资产层生图生产流程本身待首片 runtime 实证）。site-film《朝朝如念》4:00 成片全流程实证（素材库→分镜 45 镜→动效规范 108 令牌→animatic→正式制作→分段渲染出片）；2026-11-01 第二片 wuh-site-intro-v2 正式制作落地（57 镜 / 124 令牌 / FilmShell 三段装配 / render-film --unit + CI film 输入），本片出片待 CI 实证；2026-11-01 第三片《风陵·致郭襄》前期：52 镜 / 7200f、人物视觉设定、106 令牌 / 52×4 矩阵、animatic 7500f CI 出片（run 41260324683）、本地 BGM 4320 断点 mux 试听版；2026-11-01 第三片正式制作出片：52 镜一镜一文件 + 共享件整合，CI run 41270162934 全绿（bundle → 52 镜矩阵 → assemble），ffprobe 7500f / 250s，本地 mux 250s，断点静默实测 137.8–148.8s
---

# 视频制作流程（前期五件套 → 正式制作 → 渲染出片）

## 当前结论

长片（≥2min）按**两段式**推进，前期定稿后再正式制作，避免在错误叙事上烧动效工时：

1. **前期五件套 + 人物视觉设定**（一次 change 完成，评审通过后另立 change 正式制作）：
   - 素材库 `materials.md`：全节真实素材全溯源（源码细节/API 数据/金句库），每条标注来源
   - 剧本 `script.md`：用户与编剧 subagent 对话定稿；叙事轴、幕结构、情绪曲线、全片文案（每处标素材编号）
   - 人物视觉设定 `character-design.md`：与分镜并行；剪影/服饰/物/面部等级/标准姿态
   - **资产层（2026-11-07 新增，与分镜并行）**：风格锚点（冻结风格块+参考机制三选一）→ 角色定妆图+正/侧/背三视图（身份锚：PuLID / --oref / 角色 LoRA 三选一）→ 场景空镜图（prompt 必写「无人物」）；产出登记进**资产登记表** `videos/preprod-<unit>/assets/asset-registry.md`（编号三型 C=角色 / S=场景 / P=底图·道具，文件 `∅`=未入库）——方法论基座见 shadow-dev-workflow 技能 `ai-director.md`
   - 分镜脚本 `storyboard.md`：逐镜表（镜号/画面/镜头语言/文案/时长/转场/音效点）+ **导演列（2026-11-07：第 8 列「资产」= C/S/P 编号外键、第 9 列「尾帧」= 本镜结束停在哪；表头声明「资产外键」才激活，strictTransitions 同构）**+ **旁白字数硬表**（三锚点 (2.5s,20)/(5s,40)/(10s,82) 分段线性内插）+ **帧数对账表**（各幕相加=总帧数）
   - 动效规范 `motion-spec.md`：令牌化（曲线/弹性/镜头/粒子/转场/调色）+ **全镜覆盖矩阵**（每镜入场/持续/出场/转场必有令牌）
   - Animatic 分镜板：真实内容**单色简板**（非空框）预演节奏，用户定稿后进正式制作
2. **正式制作**：令牌库先行（motion-tokens.ts 落地规范）→ 七幕场景实装 → 配乐多轨接线（90 BPM 对拍）→ 分段渲染出片
3. **多片化（2026-11-01 落地）**：单元自包含——`videos/<unit>/film.config.json` 声明 shell（intro/outro 帧）时，`shots.mjs sync` 给 film/audio 路由算「片头+正片+片尾」时长；`render-film.mjs --unit` 派生 composition 前缀（site-film→SiteFilm、wuh-site-intro-v2→WuhSiteIntroV2）、缓存目录、音轨 id 与中间产物，并做三段装配（片头/片尾直接对 film comp 取 frameRange，与逐镜段一起 concat）；CI `render-film.yml` 用 `film` 输入跑任意单元。默认 `--unit site-film` 行为零变化
4. **内联预览页交付（2026-11-07 落地，历程片 making-of 实证）**：animatic/成片评审交付走 Gen UI 内联预览 fragment——抽 12–16 帧**镜中点帧**（成片帧 = 内容帧 + 片头 120f；抽镜首会吃到墨洇/转场遮罩出黑帧）+ 读 `shots-data.ts`/manifest 镜元数据（章/帧窗/镜头语言/字幕），拼数据驱动 HTML：走片 player（缩略图跳镜 + 自动走片）+ 八幕结构条 + 镜头序列 chips + 动效令牌图例。**混剪型单元接线同正式单元**：preprod 单元（shots-data/boards/`<Pascal>Animatic`）+ manifest 放 `videos/<slug>/shots-manifest.json` + `render-animatic.yml` unit choice 增补即可 CI 出片；母带在仓库外（`~/Desktop/remotion`）由 `scripts/prep-making-of.mjs` 清单化裁段入 `public/`（无声、`-vN`、`--check` 对账）
4. **专家多代理**：分镜师、UE 动效大师以专职 subagent 并行产出文档，协调方只做对账与整合；场景实装可多幕并行（独立文件、零共享状态）

## 文学改编 / 诗电影（2026-11-01 实证）

- `preprod-<film>` 单元（如 `preprod-zhi-guo-xiang`）：素材库 → 剧本 → 人物视觉设定（与分镜并行）→ 分镜 → 动效规范 → animatic；`shots.mjs import --unit <film>` 为帧数真源。
- 剧本以诗作文本为骨架；必须显式声明「情感蒙太奇非编年」与顺序取舍；文学改编另建「原著事实核对表」与「诗作托名考据」。
- 人物视觉设定独立成 `character-design.md`：五段年龄、杨过不露脸、正片零红、4-4/5-1 标准姿态。
- Animatic CI：`render-animatic.yml` 的 `unit` / `scope` 下拉；产物 `A{yyyyMMdd}{HHmmss}-{film}.mp4`。
- 版权 BGM：不进 `public/`；CI 出无声画面，发布前本地 `amix` / `adelay` 两遍 mux（禁用 `<Audio loop>`）。示例见 `videos/preprod-zhi-guo-xiang/assets/music.md`。**自制旁白 wav 例外**——无版权问题的 TTS/录音走 `public/<film>/tts/` 入库（见 [[tts-voiceover-pipeline]]），mux 时叠成第三路。
- 正式制作（2026-11-01 实证）：52 镜一镜一文件、零共享状态，六幕交 subagent 并行实装；`ZhiGuoXiang.tsx` 只遍历 `shots-manifest.json` + `ShotShell`，装配层不写镜头内容。共享件在整合阶段统一收口（Caption/Figure/AscendScene/Objects），避免 52 镜各写一份。
- 逐字对拍与末帧：字幕组件用 `charStarts` 给逐字落点（S25「滴滴答答」四字 20/32/44/56 与四蹄同帧）；末镜用 `fadeOut={false}` 保证最后一行在正片末帧完整，不靠延长 `end` 绕过淡出。
- 出片口径：CI 只出画面 + 静默轨，ffprobe 帧数必须等于 `片头 + 正片 + 片尾`；本地 mux 后再验**该片当前版本的片长**与断点静默窗口，最后交用户验收。致郭襄 v9 = 7350f / 245s，断点静默 143.46–151.0s（旧口径 7500f / 250s、静默 137.8–148.8s 属 v8 前，已过期）。mux 支持 BGM 之外叠第三路人声整轨（`--voice`）：人声轨自带片长静音底，不再 `adelay`，走单遍 `amix=inputs=3`——先合 BGM 再叠人声的两级 amix 会把音轨截到第一遍结尾（实测 143.45s），别用。

## v10 转场与出片兜底（2026-11-06 实证）

- **镜内转场**：转场类型进机器分镜表第 7 列（= 进入本镜的 inbound），`shots.mjs import` 解析成 manifest 的 `transition`；`page` 纸翻 18f/侧、`dry` 飞白 10f、`ink` 墨洇 12f、`cut` 0。遮罩只在 `ShotShell` 镜首/镜尾占用，`durationFrames`/`startFrame` 一个字节不动；字幕安全窗 = `start ≥ in+12`、`end ≤ dur−out−12`。跨镜图层在「逐镜渲 + concat」链路里产 0 像素，别做。
- **CI 矩阵抖动与兜底**：`render-film.yml` 首波 20 个 job 并发跑 `apt-get install` 会锁争用，慢 job 撞 15 分钟 job 超时被 cancelled（表现为「几镜缺产物、assemble 报缺镜」）。处理：① `gh run rerun --failed`；② 仍红就 `-f shots="sNN"` 子集 run 单镜；③ 终极兜底 = 逐镜 artifact（`shot-*`，保留 90 天）+ 本地 concat：cache 命名 `out/shots/<unit>/sNN-<shotHash>.mp4`，把 artifact 放回该目录，`node scripts/render-film.mjs --assemble` 在本机偶发 Node 段错误，可直接用 ffmpeg 复刻 concat 滤镜（`trim=end_frame` + `concat=n`，libx264 veryfast crf16 yuv420p 30fps）。
- **片头/片尾**：CI assemble 未跑成时，用 CI 的 `remotion-bundle` artifact + 本机 `@remotion/renderer` 的 `renderMedia({frameRange:[0,119] / [7170,7349]})` 补渲（本机 `npx remotion render` 会 exit 139，别用 CLI）。
- **抽帧偏移**：成片帧号 = manifest 帧号 + FilmShell 片头 120f；按 manifest 直接抽帧会抽到前一镜。
- **v10 出品**：38 镜 / 正片 7050f / 全片 7350f / 245.0s；转场 12 处非硬切；配音 v6（22 段 140.16s）+ mix v6（峰值 −1.0 dBFS、0 削波）。细节见 change brief 与 `design-v10.md`。

## 资产层机检口径（2026-11-07 落地，shots.mjs）

- **import 落 manifest 新字段**（表头声明「资产外键」的单元）：P 编号→`firstFrameAsset`（经登记表映射文件路径，∅ 引用落 null）、C→`characterIds`、S→`environmentId`（**每镜一场景**，多场景 import 拒绝）、尾帧→`endFrameDesc`
- **import 只挡结构错误**：未登记编号（die）/多场景（die）/字数硬表（die）/字段不一致——∅ 引用与文件存在性**留给 check**，因为分镜（前期）先于资产生成（正式制作）是常态，animatic CI 依赖 manifest 先存在
- **check 全量红**：引用 ∅ 资产、登记表非 ∅ 行文件不存在（全量查，不限被引用行）、firstFrameAsset 缺 `-vN` 版本后缀或文件不存在、字数超标——报错指名镜号与编号
- **登记表即资产层待办**：首轮登记（致郭襄 v12）P 编号全部 `∅`，check 红到入库为止——这是特性不是缺陷
- **引用即承诺已入库**；入库文件名必须带 `-vN` 后缀，**换图必升级版本号并同步改镜组件 `staticFile` 引用**（staticFile 资产不在镜级缓存键的 import 闭包内，只换内容不改引用=像素漂移）

## 执行约束

- **渲染只走 CI，本机不渲**（2026-11-04 用户定策）：成片用 `gh workflow run render-film.yml -f film=<unit>`；改一镜看一帧用 `-f shots="s10 s25 s29"`（子集不触发 assemble，一两分钟回镜级产物），再 `gh run download` + `ffmpeg` 抽帧看图。本机仅保留版权 BGM mux 与静态门。细则见 [[render-stability-playbook]] 首节
- 分镜师 brief 必含：总帧数硬约束、素材编号引用要求、对账表自查；UE 大师 brief 必含：覆盖矩阵行数要求、Remotion 可实现约束（不引 UE 专属概念）
- 片长变更在前期阶段做（改分镜数字重排即可）；正式制作开始后改片长=重渲全片
- 真实数据优先：能抓 API 就抓（如 /api/music/playlist?playlistId=、/api/about/activity），素材库全条目标注抓取日期
- 配乐默认 CC-BY 可溯源，署名清单随片交付（B 站简介用）；下载的音频用 ffprobe/afinfo 验格式（原站可能误发视频文件）。**版权曲目例外**：不进 `public/`，CI 只出无声画面，发布前本地 mux（见 `videos/preprod-zhi-guo-xiang/assets/music.md` 示例）。

## 适用边界

本机（Intel MBP 2019）个人出片流水线。渲染可靠性见 [[render-stability-playbook]]。

## 验证方式

- storyboard 帧数对账表合计 = animatic/成片 ffprobe 帧数
- motion-spec 覆盖矩阵 45/45（或全镜数）走查
- 素材库每条有来源标注
- 成片 ffprobe：帧数/时长/音轨三项
- 多片：`shots.mjs check`（默认 site-film）与 `shots.mjs check --unit <film>` 双绿；带 shell 的单元成片帧数 = 片头 + 正片 + 片尾
- 本地 BGM mux：ffprobe 帧数/时长；`silencedetect` 断点静默；`volumedetect` 峰值有余量
