---
{
  "schema": "shadow-dev/v1",
  "name": "20261101-feature-zhi-guo-xiang-production",
  "type": "feature",
  "scope": "video-production",
  "status": "committed",
  "baseBranch": "main",
  "branch": "feature/20261101-feature-zhi-guo-xiang-production",
  "files": [
    ".github/workflows/render-film.yml",
    "public/zhi-guo-xiang",
    "scripts",
    "shadow-docs/changes/20261101-feature-zhi-guo-xiang-production",
    "shadow-docs/knowledge",
    "src/Root.tsx",
    "videos/zhi-guo-xiang"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": 50,
    "pullRequestUrl": "https://github.com/stack-wuh/wuh.site.video/pull/50"
  },
  "review": {
    "conclusion": "pending",
    "verifiedCommit": null,
    "verifiedAt": null
  },
  "workflow": {
    "operation": null,
    "checkpoint": "7b81452afb1b89c9ca6a17523177f7ed5b744cc2",
    "planHash": "4b991229aaf9d2ba7b82ce84bdcaf08ff286d8d8bd3413467f114dc9c747ba31",
    "updatedAt": null,
    "lastError": null,
    "worktree": "/Users/wuhong/shadow-desktop/github/wuh.site.video/.worktrees/20261101-feature-zhi-guo-xiang-production",
    "commit": {
      "files": [
        "shadow-docs/changes/20261101-feature-zhi-guo-xiang-production/design-v10.md",
        "videos/zhi-guo-xiang/assets/art-direction.md",
        "videos/zhi-guo-xiang/assets/bgm-ai-yi-map.md",
        "videos/zhi-guo-xiang/assets/script-v9.md",
        "videos/zhi-guo-xiang/assets/storyboard-v9.md"
      ],
      "message": "docs(script): v10 路 B 定调 —— 金针求揭面 · 面具回归 · 四席评审重写方案\n\n- S21 由「扎进落水者的穴道」（救人）改为「把唯一那枚递到他面前，求他取下面具」；补「剩下两枚此后再没动过」\n- 时间线自洽：那一夜一枚没用，寻访多年、每次都晚三天，直到唯一一次赶上才用掉 → S21 留在 act4 原位，S20 醒木↔S21 用针的「同一时刻」成立\n- §4.4 铁律理由改写：从「郭襄自己就没看见」→「她拿唯一一次机会换了一张脸，观众仍然不给；她看见了，我们没有」\n- 金针定义按原著更正（如见你面／托人持针传命），并修 script-v9 §3.2 的「凭此来找我」\n- S25「剩两枚」读法变为舍不得用，与 S26 戏眼「舍不得用掉那枚针」第一次呼应；S25/S29/b11 账目不动\n- art-direction 新增 §十二：面具回归形制、弃用 p-giving 改代码剪影、针位子集约束、手的统一规格、露脸双参考图、生图只认 wan2.7-image-pro、金针无针眼、南宋形制\n- 新增 design-v10.md（四席评审后重写版，含初稿 10 条事实错误留痕）"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/video-production-flow.md",
    "reason": "52 镜实装与共享件整合经 check/扫描/CI 出片/本地 mux 对账；视频制作流程卡补正式制作口径与逐字对拍、出片口径；工作室结构卡补 52 镜矩阵 CI 与 typecheck 门现状"
  }
}
---

# 《风陵 · 致郭襄》v10 定稿：38 镜 · 7050f · 镜内转场 · 求揭面 · 配音 v6

## 动机

v9（38 镜 / 7050f）在四席评审（导演分镜 / 编剧 / 美术 / 声效）后暴露四处来源：剧本误写金针用途（S21 扎针救人 → 与 S25「剩两枚」账目冲突）、手不合人物、男声生硬、转场无设计。v10 按 `design-v10.md` 重写：路 B「第一枚·求揭面」、转场大幅收、杨过给背影、22 个空镜接线、配音 v6 与混音 v6，最后 CI 逐镜出片 + 本地 concat/mux 交片。

## 复杂度评级

- **评级:** L
- **理由:** 契约变更——分镜真源第 7 列转场进 manifest、ShotShell 镜内遮罩（帧数不变）、22 个空镜接线、S21 重做、S25 针位子集、配音 v6 重配与混音链路修坑；触及面大（38 镜 + 8 个共享件 + 5 个音频脚本）；可发现性高——`shots.mjs check`、typecheck、lint、CI 抽帧、ffprobe 帧数/时长、mix 峰值与余量表均可机检。
- **期望验证深度:** runtime
- **取证策略:** observation

## 领域模型

- **限界上下文:** video-materials — 视频工程、品牌令牌、分镜组件与素材的唯一维护地。上游只读：`preprod-zhi-guo-xiang` 的分镜真源；下游：B 站成片发布。反腐边界：不把版权 BGM 提交进仓库；自制旁白 wav 入库。
- **统一语言增量:**
  - **生产单元 `zhi-guo-xiang`**：`videos/zhi-guo-xiang/`，38 镜 + 106 令牌 + 装配 + 静默音轨；`shots-manifest.json` 为帧数与转场真源。
  - **镜内转场**：第 7 列 = 进入本镜的 inbound；`page` 纸翻 18f/侧、`dry` 飞白 10f、`ink` 墨洇 12f、`cut` 0；只在 ShotShell 首尾占用，`durationFrames`/`startFrame` 永不动。
  - **求揭面 S21**：她终于赶上一次，把唯一那枚金针递到他面前求取下面具；他抬手到面具为止、转身走进垭口雾里；针 112–145f 淡出，末 45f 她手还举着、针已不在。
  - **针位子集**：S10/S25 同一底图 `p-palm2`、同一 zoom `[1.04,1.1]`、同一 `PALM2_NEEDLES` 真值；S25 `drop=0` 严格只少一枚。
  - **配音 v6 / 混音 v6**：`lines.json` 22 段；`voice-track-v6.wav` 245.000s；`mix-v6.wav` = BGM 两遍（PASS2 零交叉 45.45754）+ 逐段实测 ducking + 人声；成片 245.0s。
- **聚合与不变量:**
  - `INV-1 生产单元`：`shots.mjs sync --unit zhi-guo-xiang` 生成 38 镜 manifest/registry/routes；正片 7050f；Composition `ZhiGuoXiang` 与 `ZhiGuoXiangAudio` 均 7350f（120 + 7050 + 180）。
  - `INV-2 镜头实装`：38 个 `shots/sNN.tsx` 全部存在，local 帧 0 起；22 个空镜各接 1–2 层真实动效；零内联 hex/字体字面量、无 `Math.random`、无 `<Audio>`。
  - `INV-3 装配`：FilmShell 120 + 7050 + 180 = 7350f / 245.0s；meta = 《风陵 · 致郭襄》/「四分钟武侠诗电影」/「网络流传 · 托名程灵素」。
  - `INV-4 转场`：manifest 每镜带 `transition`；非硬切 12 处（纸翻 s03/s27/s36、飞白 s17/s23、墨洇 s04/s06/s15/s18/s19/s28/s38）；必硬切 s10→s11、s19→s20、s23→s24、s24→s25、S26 入场全部满足；14 条字幕全在安全窗（start ≥ in+12、end ≤ dur−out−12）。
  - `INV-5 原片`：`videos/site-film/`、`videos/self-intro/`、`videos/wuh-site-intro-v2/`、`videos/preprod-wuh-site-intro-v2/` 零改动。
  - `INV-6 音频`：CI 产物无声；`ZhiGuoXiangAudio` 不含 `<Audio>`；BGM 版权文件不入仓、自制旁白 wav 入 `public/zhi-guo-xiang/tts/`；成片 = BGM 两遍 + 人声一路 = 245.0s。
  - `INV-7 验证`：`pnpm typecheck:ci` 绿；`pnpm lint` 0/0；`shots.mjs check --unit zhi-guo-xiang` 绿（38 镜 Σ=7050）；ffprobe 7350f / 245.000s；mix 峰值 −1.0 dBFS、0 削波、人声余量最小 5.7dB。
  - `INV-8 旧件`：`AscendScene`（旧 52 镜 4-4/5-1 共用件）在 38 镜版被 0 镜引用，属遗留件；S30/S31 未共用它（旧 INV-4 作废）。
- **领域事件:** CI 逐镜出片 → 本地 concat + mux → 用户验收 → 另立 change 发布/归档。

## 引用规范

- shadow-docs/knowledge/video-production-flow.md
  - 当前结论: 两段式；分镜真源第 7 列转场；镜内遮罩不改帧；CI 逐镜 + 本地 concat 兜底；配音 v6 / 混音 v6
  - 适用 scope: videos/, shadow-docs/knowledge/
- shadow-docs/knowledge/video-studio-structure.md
  - 当前结论: 工作室三层；FilmShell 120+180；`render-film.mjs --unit` 多片；node 22 / port 3211 / crf16；staticFile 以 public/ 为根
  - 适用 scope: brand/, videos/, scripts/, src/Root.tsx, public/
- shadow-docs/knowledge/render-stability-playbook.md
  - 当前结论: 渲染前清场；镜级缓存；分块收敛梯；`<Audio loop>` 禁用；radial-gradient 本机崩溃条已标 superseded（现走 CI）
  - 适用 scope: videos/, scripts/, out/
- shadow-docs/knowledge/tts-voiceover-pipeline.md
  - 当前结论: edge-tts 男女声 22 段 140.16s；ducking 实测 12 段 3–9dB；mux PASS2 45.45754；男声真声待替换
  - 适用 scope: scripts/voice/, public/zhi-guo-xiang/tts/, scripts/build-bgm-mix.py
- norms/code-style.md
  - 当前结论: TS 禁 any、单一职责、无 TODO；分镜组件禁内联色值/字体
  - 适用 scope: 全部新增 TS 代码

## 决策

- **金针口径（路 B）**：她一生只用掉一枚（求看一眼他的脸），剩下两枚舍不得用；S21 留 act4 原位，「S20 醒木 ↔ S21 用针」同一时刻成立；S25 剩两枚 = 舍不得，与 S26 戏眼呼应；S25/S29/b11 账目不动。
- **杨过永远不给脸**：理由改写为「她拿唯一一次机会换了一张脸，观众仍然不给」；面具回到形制，S21 由 `YangGuoFigure`（背影 + 空袖 + 面具 + 抬手）承担，弃 `p-rescue`/`p-giving`，底图用 `p-footprints` 的无人物雪径。
- **转场**：类型进 manifest（真源分镜表第 7 列），ShotShell 镜内占用首尾帧；不做跨镜图层（CI 逐镜渲 + concat，跨镜层产 0 像素）；不新增音效（复用陷阱 + 混音余量）。
- **接线而非重画**：22 个空镜用已写好的 Figure/Objects/DustField/Fireworks 接入；新增 `WaveField`、从 `InkPaper` 抽出 `InkBloom`、`DustField` 加 `wind`、`Needles` 加 `drop`、Figure 加 `raise/mask/needle`，默认参数保旧像素。
- **配音**：`lines.json` 为唯一事实源；开场 a01–a05 重写、b08 拆两条、b06 前移 129.4；edge-tts 云健/晓晓重配；男声真声本轮不做。
- **混音**：修 `duck-voice.mjs` BUG1/BUG2、PASS2 改零交叉 45.45754；BGM 两遍 + 逐段实测 ducking（不盲目抬人声）；峰值 0.891 上限。
- **出片**：CI `render-film.yml` 逐镜渲；CI assemble 首跑因 5 个矩阵 job 在 runner `apt-get install` 步骤撞 15 分钟 job 超时被取消而缺镜（基础设施抖动，非代码），改用「逐镜 artifact + 本地 concat + 本地 mux」兜底；intro/outro 用 CI bundle + 本机 `@remotion/renderer` 渲染。
- **非目标**：不改前期资产（除机器真源分镜表）、不改品牌令牌、不提交版权 BGM、不重出 `p-needle-look`（需外部生图额度，留待下轮）。

## 任务

### Phase 1 转场与分镜真源

- [x] 分镜真源第 7 列定语义并落 38 行；S21 改求揭面；s01/s38 字幕补「念念」— `videos/preprod-zhi-guo-xiang/assets/storyboard.md`
- [x] `shots.mjs` 解析 transition（别名 → page/dry/ink/cut）+ manifest + 生成物透传 in/out/duration — `scripts/shots.mjs`
- [x] `ShotShell` 镜内遮罩（纸翻/飞白/墨洇/cut）+ 字幕安全窗 — `videos/zhi-guo-xiang/components/ShotShell.tsx`

### Phase 2 视觉与接线

- [x] 新组件 `WaveField`、`InkBloom`；`DustField.wind`、`Needles.drop + PALM2_NEEDLES`、`Figure.raise/mask/needle` — `components/`
- [x] S21 四段重做（她举针 → 他抬手到面具 → 走进垭口雾 → 手还举着针已不在）；抽帧后修正人物尺寸/墨色与走位 — `shots/s21.tsx`
- [x] S10/S25 同底图同 zoom 同针位，S25 严格少一枚；`p-palm2` 采 cand-3 — `shots/s10.tsx`、`s25.tsx`、`public/.../p-palm2.jpg`
- [x] 22 个空镜接 1–2 层动效；14 条字幕按安全窗重排 — `shots/`

### Phase 3 配音与出片

- [x] `lines.json` 22 段定稿；edge-tts 重配 → `voice-track-v6.wav`（245.000s，22 落点全有声、10 对照区静音）— `scripts/voice/`、`public/zhi-guo-xiang/tts/`
- [x] 混音 v6：`mix-v6.wav`（245.000s、峰值 −1.0 dBFS、0 削波、12 段 ducking、余量最小 5.7dB）；修 duck-voice BUG1/2 与 PASS2 — `scripts/build-bgm-mix.py`、`scripts/duck-voice.mjs`、`scripts/mux-bgm.mjs`
- [x] CI 逐镜出片（38 镜）→ 本地 concat 7350f → 与 mix-v6 mux → 抽帧验收 — `out/20261106233000-zhi-guo-xiang-v10-final.mp4`

## 结果

- 实际耗时: 2026-11-06 单日（5 个并行 stream：转场 / 视觉组件 / 配音混音 / 两批接线）
- 验证:
  - INV-1 ✅ `shots.mjs check`：38 镜 Σ=7050；`ZhiGuoXiang` / `ZhiGuoXiangAudio` 均 7350f
  - INV-2 ✅ 38 镜齐备；禁用项扫描 clean（无新增内联 hex/字体、无 `Math.random`、无 `<Audio>`）
  - INV-3 ✅ FilmShell 120 + 7050 + 180 = 7350f；ffprobe 7350f / 245.000s / 1920×1080 / 30fps
  - INV-4 ✅ 非硬切 12 处（纸翻 3 / 飞白 2 / 墨洇 7），必硬切 5 处全满足；14 条字幕全在安全窗（脚本核对）
  - INV-5 ✅ 四套原片目录零改动
  - INV-6 ✅ `ZhiGuoXiangAudio` 纯静默；CI 逐镜产物无声；成片音频 = mix-v6（BGM 两遍 + 人声 v6），245.0s
  - INV-7 ✅ `pnpm typecheck:ci` 绿、`pnpm lint` 0/0、`shots.mjs check` 绿；成片峰值 −1.0 dBFS、0 削波
  - 出片证据：CI run 42240447786（33/38 镜首轮绿；s01/s08/s13/s17 重跑成功，s19 二度撞 apt 超时）→ s19 走子集 run 42246154138、s21 修正版走子集 run 42248238613；主 run 37 镜 artifact + 两个子集成片镜 = 38 镜全 CI 渲染；intro/outro 用 CI bundle + 本机 renderMedia；本地 ffmpeg concat + mux
  - 证据缺口：CI 全片 assemble 未能在 runner 完成（矩阵 apt 争用 → job 超时），最终 concat/mux 在本机执行，已用 ffprobe 与抽帧对账

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/video-production-flow.md`、`render-stability-playbook.md`、`tts-voiceover-pipeline.md`
- **理由:** 镜内转场口径（真源第 7 列 + 帧数不动）、CI 矩阵 apt 争用与「逐镜 artifact + 本地 concat」兜底、配音 v6 与 ducking 实测，均应写入知识卡；`tts-voiceover-pipeline.md` 已由本轮重写为 v6。
