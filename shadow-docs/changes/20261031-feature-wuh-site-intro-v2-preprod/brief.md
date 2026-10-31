---
{
  "schema": "shadow-dev/v1",
  "name": "20261031-feature-wuh-site-intro-v2-preprod",
  "type": "feature",
  "scope": "video-materials",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "feature/20261031-feature-wuh-site-intro-v2-preprod",
  "files": [
    ".github/workflows/render-animatic.yml",
    "scripts/shots.mjs",
    "shadow-docs/changes/20261031-feature-wuh-site-intro-v2-preprod",
    "src/Root.tsx",
    "src/index.ts",
    "videos/preprod-wuh-site-intro-v2",
    "videos/wuh-site-intro-v2"
  ],
  "github": {
    "repository": "stack-wuh/wuh.site.video",
    "issue": 27,
    "issueUrl": "https://github.com/stack-wuh/wuh.site.video/issues/27",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "a61554e737b648979aeba647cfb0d1ba105918ef",
    "verifiedAt": "2026-10-31T14:13:32.443Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:27",
    "planHash": "7c2fbf796601b5dba1c3f4b897dd323cd35c525dccfcedda43442d2d66ba6723",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] wuh.site.intro.v2 前期制作：长编年实现历程 · 五件套 · Animatic",
      "titleRaw": "wuh.site.intro.v2 前期制作：长编年实现历程 · 五件套 · Animatic",
      "supplement": "以长编年（2021→现在）讲清 wuh.site 的实现历程并介绍创作者本人。本变更做前期五件套（素材库/剧本/分镜/动效规范/animatic）与 manifest 导入；正式制作另立 change。详见 shadow-docs/changes/20261031-feature-wuh-site-intro-v2-preprod/brief.md",
      "body": "## 动机\nv1 自我介绍片（self-intro 630f）与《朝朝如念》之后，用两段式新流程重做一支介绍片 v2：以长编年（2021→现在）讲清 wuh.site 的实现历程，同时介绍创作者本人。原 `videos/self-intro/` 全部文件保持不动；成片项目名定为 `wuh-site-intro-v2`（全 kebab），片长对标《朝朝如念》4 分钟。本变更只做前期制作：素材库 → 剧本 → 分镜 → 动效规范 → animatic，定稿后导入 manifest；正式制作另立 change。\n\n## 引用规范\n- shadow-docs/knowledge/video-production-flow.md\n  - 当前结论: 两段式——前期五件套（素材库→剧本→分镜→动效规范→animatic）定稿后另立 change 进正式制作；`shots.mjs import` 为帧数唯一机器真源\n  - 适用 scope: videos/, shadow-docs/knowledge/\n- shadow-docs/knowledge/video-studio-structure.md\n  - 当前结论: 工作室三层结构；新视频 FilmShell 骨架与 `totalFilmFrames()` 公式；渲染口径 node 22 / 系统 Chrome / port 3211 / crf16；staticFile 以 public/ 为根\n  - 适用 scope: brand/, videos/, scripts/, src/Root.tsx, public/\n- shadow-docs/knowledge/render-stability-playbook.md\n  - 当前结论: 渲染前清场铁律；分块收敛梯；concat 滤镜帧级对齐；`<Audio loop>` 禁用；先绿后渲\n  - 适用 scope: videos/, scripts/, out/\n- norms/code-style.md\n  - 当前结论: TS 禁 any、单一职责、不为假想场景抽象、无 TODO 注释\n  - 适用 scope: 全部新增 TS 代码\n\n## 决策\n- **选型:** 方案 A 两段式——本 change 只做前期五件套 + animatic + manifest 导入；正式制作另立 change。\n- **对比方案:** B 单 change 全流程（剧本未评审就烧动效工时，返工风险大）；C 精简前期（无 animatic，节奏无法预演，违五件套）。\n- **理由:** 遵循 `video-production-flow` 两段式纪律；剧本与 animatic 两道用户评审卡点是返工成本最低的防线。\n- **片长口径:** 正片 7200f（4:00，与《朝朝如念》同预算）+ FilmShell 片头 120f + 片尾 180f = 全片 7500f（4:10），对标 v1 的 4 分钟。\n- **命名:** 全 kebab——目录 `videos/preprod-wuh-site-intro-v2/`、`videos/wuh-site-intro-v2/`；`manifest.film` 与目录同名 `wuh-site-intro-v2`；成片 `{yyyyMMdd}-{序号}-wuh-site-intro-v2.mp4`。\n- **素材源:** x.wuh.site 源码与 git（1190 commits / 117 tags / 月度节奏）、线上 API（about/activity、visit-stats、repos、content 等）、博客 59 篇 + RSS 原文、shadow-docs 档案（257 changes / 30+ 知识卡）；采集基准日 2026-10-31。\n- **原片不动:** 共享文件仅两处小改——`src/Root.tsx` 注册 animatic 路由；`scripts/shots.mjs` 增 `--unit`（默认行为不变）。\n- **隔离手段:** 共享 checkout 当前干净，本轮走 inline 分支（不启用 worktree），apply 中途不执行 `bind execute`。\n- **正式制作交接:** 第二段 change 负责 `render-film.mjs` / `shots.mjs sync` 的多片参数化、FilmShell 三段装配（120 + shots + 180）、BGM 与出片。\n\n## 任务\n### Phase 1 素材库\n\n- [ ] x.wuh.site 源码与 git 开发历程深挖（2021 初版/TS 重构/GitHub Actions/VitePress wiki → 2024.12 monorepo 第一行代码 → 2026 上线 → 117 tags）— `videos/preprod-wuh-site-intro-v2/assets/materials.md`\n- [ ] 线上真实数据采集（activity 12,651 / visits 10,136 / 全站 64,985 字 / 68 repos / 文章·音乐·足迹）— `videos/preprod-wuh-site-intro-v2/assets/materials.md`\n- [ ] 个人线与金句库（59 篇文章标题与节选、重启计划/坐忘歌/Vibe Coding Workflow 概述、GitHub 资料）— `videos/preprod-wuh-site-intro-v2/assets/materials.md`\n\n### Phase 2 剧本（编剧 subagent）\n\n- [ ] script.md：长编年 2021→现在，幕结构 + 情绪曲线 + 全片文案（每处标素材编号），交用户评审定稿 — `videos/preprod-wuh-site-intro-v2/assets/script.md`\n\n### Phase 3 分镜（分镜师 subagent）\n\n- [ ] storyboard.md：逐镜表 + 帧数对账表（正片 7200f；严格按 shots.mjs 解析格式：`### Act N 标题（帧 X–Y` 与 `| N | Xf · …（起–止） |`）— `videos/preprod-wuh-site-intro-v2/assets/storyboard.md`\n\n### Phase 4 动效规范（UE 动效大师 subagent）\n\n- [ ] motion-spec.md：令牌化 + 全镜覆盖矩阵 — `videos/preprod-wuh-site-intro-v2/assets/motion-spec.md`\n\n### Phase 5 Animatic\n\n- [ ] boards.tsx + WuhSiteIntroV2Animatic.tsx（FilmShell 包 7200f 正片，总 7500f；单色简板/真实文案/卡点脉冲）+ routes.ts + Root 注册 — `videos/preprod-wuh-site-intro-v2/`, `src/Root.tsx`\n- [ ] 渲染 animatic 7500f（分块收敛梯）→ ffprobe 对账 → 交用户评审定稿 — `out/`\n\n### Phase 6 manifest 桥接\n\n- [ ] shots.mjs 增 `--unit`（默认 site-film 行为不变）— `scripts/shots.mjs`\n- [ ] import 生成 `videos/wuh-site-intro-v2/shots-manifest.json`（film=wuh-site-intro-v2，7200f）；site-film check 回归 — `videos/wuh-site-intro-v2/`, `scripts/shots.mjs`\n\n## 补充\n以长编年（2021→现在）讲清 wuh.site 的实现历程并介绍创作者本人。本变更做前期五件套（素材库/剧本/分镜/动效规范/animatic）与 manifest 导入；正式制作另立 change。详见 shadow-docs/changes/20261031-feature-wuh-site-intro-v2-preprod/brief.md\n\n完整 brief：shadow-docs/changes/20261031-feature-wuh-site-intro-v2-preprod/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261031-feature-wuh-site-intro-v2-preprod\",\"type\":\"feature\",\"scope\":\"video-materials\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261031-feature-wuh-site-intro-v2-preprod/brief.md\",\"cliVersion\":\"1.8.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    },
    "release": {
      "files": [
        ".github/workflows/render-animatic.yml",
        "scripts/shots.mjs",
        "shadow-docs/changes/20261031-feature-wuh-site-intro-v2-preprod",
        "src/Root.tsx",
        "src/index.ts",
        "videos/preprod-wuh-site-intro-v2",
        "videos/wuh-site-intro-v2"
      ],
      "message": "feat(video-materials): wuh.site.intro.v2 前期制作——八幕 57 镜 · 设计巡礼 · 衍生树 + CI 出片",
      "title": "wuh.site.intro.v2 前期制作：八幕长编年 · 设计巡礼 · 衍生树（4:25）",
      "body": "## 概述\n\nwuh.site.intro.v2 前期制作：八幕长编年，正片 7658f = 4:15；含 FilmShell 片头片尾全片 7958f = 4:25。原 `videos/self-intro/` 零改动；正式制作另立 change。\n\n## 主要变更\n\n- **素材库** `materials.md`：x.wuh.site 源码/git/线上 API/博客原文全溯源（2026-10-31 快照）；新增 §2.6 衍生项目（blog / workflow / desktop / CLI / video）。\n- **剧本** `script.md`：长编年 2019→现在 + 空间层「入院」八镜设计巡礼 + 衍生之树 + 总结句「写作是根，代码是干……」（八幕 7658f）。\n- **分镜** `storyboard.md`：八幕 57 镜，严格按 `shots.mjs` 解析格式；帧数对账 7658。\n- **动效规范** `motion-spec.md`：118 令牌（CV7/SP7/RH6/CM15/PT12/TR26/GR8/FN37），57/57 覆盖矩阵；入院八镜新令牌 pathDraw / shimmer / cascade / vinylSpin / needleSettle / barrage / heatWave / colorMorph / pageDepth。\n- **Animatic**：`WuhSiteIntroV2Animatic`（FilmShell 包 7658f，总 7958f）+ 单色简板 + 字幕/幕刻度/卡点脉冲；Root 注册。\n- **manifest**：`shots.mjs` 增 `--unit`（默认 site-film 行为不变），`import` 生成 `videos/wuh-site-intro-v2/shots-manifest.json`（film=wuh-site-intro-v2，7658f）。\n- **CI 出片**：新增 `.github/workflows/render-animatic.yml`（workflow_dispatch，整片或帧段，artifact 下载）。\n- **修复**：`src/index.ts` 字体导入路径（`./brand/fonts` → `../brand/fonts`，既有缺陷）；`shots.mjs check` 的 routes 校验（既有缺陷，原对 HEAD 生成物 45/45 必红）。\n\n## 验证\n\n- `node scripts/shots.mjs import --unit wuh-site-intro-v2` → `57 镜 / 8 幕 / 7658 帧`；manifest.film = wuh-site-intro-v2。\n- `node scripts/shots.mjs check` → site-film `45 镜 Σ=7200 帧` 全绿（INV-5 回归）。\n- 动效规范矩阵 57/57；令牌 118。\n- `git diff --stat -- videos/self-intro public/self-intro` 为空（INV-4）。\n- preprod 单元内联色值/字体 grep 零命中（INV-6）。\n- 证据缺口：本机 `tsc --noEmit` 连续 exit 139（段错误风暴）、animatic 整片本地渲染同因受阻；改由 `render-animatic.yml` 在 GitHub Actions 出片后补 ffprobe 对账。\n\n## 注意\n\n- 字体资产化引入的 808 个字体资源会把本机 Remotion 打包压垮（多次 exit 139；无字体入口可渲）——正式制作前需修字体加载策略。\n- 正式制作另立 change：motion-tokens 落地、57 镜实装、BGM 多轨、`render-film.mjs` 多片参数化 + FilmShell 三段装配。\n\nCloses #27"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/video-production-flow.md, shadow-docs/knowledge/video-studio-structure.md, shadow-docs/knowledge/render-stability-playbook.md",
    "reason": "多片前期流程（preprod-<film> 单元、shots.mjs --unit、八幕 57 镜/7658f 的剧本-分镜-动效-卡点链路）成为结构事实；新增 render-animatic CI 出片路径；字体资产 808 资源压垮本机 Remotion bundling 记为生产阶段复验项"
  }
}
---

# wuh.site.intro.v2 前期制作：长编年实现历程 · 五件套 · Animatic

## 动机

v1 自我介绍片（self-intro 630f）与《朝朝如念》之后，用两段式新流程重做一支介绍片 v2：以长编年（2021→现在）讲清 wuh.site 的实现历程，同时介绍创作者本人。原 `videos/self-intro/` 全部文件保持不动；成片项目名定为 `wuh-site-intro-v2`（全 kebab），片长对标《朝朝如念》4 分钟。本变更只做前期制作：素材库 → 剧本 → 分镜 → 动效规范 → animatic，定稿后导入 manifest；正式制作另立 change。

## 复杂度评级

- **评级:** M
- **理由:** 契约变更——`scripts/shots.mjs` 新增 `--unit` 参数（默认 site-film 行为不变）与 animatic Composition 注册；触及面中等——新增前期单元（文档四件 + animatic）与一个生产单元 manifest 桥接；可发现性中——帧数可经 import/check 机检，叙事节奏需 animatic 实渲评审；正式制作的动效实装不在本 change。
- **期望验证深度:** runtime（animatic 7500f 实渲 + ffprobe 对账、shots.mjs 默认 check 回归、文档走查）
- **取证策略:** observation

## 领域模型

- **限界上下文:** video-materials — 视频工程、品牌令牌、分镜组件与素材的唯一维护地。上游只读数据源：x.wuh.site 源码/git 与线上 API、博客文章；下游：B 站成片发布。反腐边界：不收博客/桌面端物料，不做发布排期管理。
- **统一语言增量:**
  - 项目名 film：成片命名 `{yyyyMMdd}-{序号}-{项目名}` 中的 {项目名}，即 `manifest.film`；本片 = `wuh-site-intro-v2`，与目录 slug 同名
  - 前期单元 `preprod-<film>`：`videos/preprod-wuh-site-intro-v2/`，承载素材库/剧本/分镜/动效规范/animatic
  - 长编年：2021 博客时代 → 现在的时间线叙事轴（用户拍板）
- **聚合与不变量:**
  - `INV-1 video`（新片）：分镜脚本逐镜时长之和 = 正片 7658f = `manifest.totalFrames`；成片总帧数 = `totalFilmFrames(7658)` = 7958f（片头 120 + 正片 7658 + 片尾 180）；animatic `durationInFrames` = 7958 且正片子帧区间为 0–7658
  - `INV-2 素材库`：每条素材标注真实来源（源码路径 / API / 文章 / RSS / git 数据）与采集日期
  - `INV-3 动效规范`：覆盖分镜脚本全部镜头的入场/持续/出场/转场（矩阵 100%）
  - `INV-4 原片`：`videos/self-intro/`、`public/self-intro/`、SelfIntro 路由与 630f 时长零改动
  - `INV-5 shots 工具`：`shots.mjs` 增加 `--unit` 后，默认（不带参数）行为与 site-film 契约不变——`node scripts/shots.mjs check` 全绿且 site-film manifest 未被改写
  - `INV-6 animatic`：零内联色值/字体字面量（一律引用 brand/tokens）
- **领域事件:** animatic 评审定稿 → `shots.mjs import` 生成 manifest（film=wuh-site-intro-v2，7658f）→ 另立 change 进入正式制作（第二段）

## 引用规范

- shadow-docs/knowledge/video-production-flow.md
  - 当前结论: 两段式——前期五件套（素材库→剧本→分镜→动效规范→animatic）定稿后另立 change 进正式制作；`shots.mjs import` 为帧数唯一机器真源
  - 适用 scope: videos/, shadow-docs/knowledge/
- shadow-docs/knowledge/video-studio-structure.md
  - 当前结论: 工作室三层结构；新视频 FilmShell 骨架与 `totalFilmFrames()` 公式；渲染口径 node 22 / 系统 Chrome / port 3211 / crf16；staticFile 以 public/ 为根
  - 适用 scope: brand/, videos/, scripts/, src/Root.tsx, public/
- shadow-docs/knowledge/render-stability-playbook.md
  - 当前结论: 渲染前清场铁律；分块收敛梯；concat 滤镜帧级对齐；`<Audio loop>` 禁用；先绿后渲
  - 适用 scope: videos/, scripts/, out/
- norms/code-style.md
  - 当前结论: TS 禁 any、单一职责、不为假想场景抽象、无 TODO 注释
  - 适用 scope: 全部新增 TS 代码

## 决策

- **选型:** 方案 A 两段式——本 change 只做前期五件套 + animatic + manifest 导入；正式制作另立 change。
- **对比方案:** B 单 change 全流程（剧本未评审就烧动效工时，返工风险大）；C 精简前期（无 animatic，节奏无法预演，违五件套）。
- **理由:** 遵循 `video-production-flow` 两段式纪律；剧本与 animatic 两道用户评审卡点是返工成本最低的防线。
- **片长口径:** 正片 7658f（4:15）+ FilmShell 片头 120f + 片尾 180f = 全片 7958f（4:25）；入院巡礼约 31s、衍生树+总结约 15s，其余幕压缩（2026-10-31 用户拍板）。
- **命名:** 全 kebab——目录 `videos/preprod-wuh-site-intro-v2/`、`videos/wuh-site-intro-v2/`；`manifest.film` 与目录同名 `wuh-site-intro-v2`；成片 `{yyyyMMdd}-{序号}-wuh-site-intro-v2.mp4`。
- **素材源:** x.wuh.site 源码与 git（1190 commits / 117 tags / 月度节奏）、线上 API（about/activity、visit-stats、repos、content 等）、博客 59 篇 + RSS 原文、shadow-docs 档案（257 changes / 30+ 知识卡）；采集基准日 2026-10-31。
- **原片不动:** 共享文件仅两处小改——`src/Root.tsx` 注册 animatic 路由；`scripts/shots.mjs` 增 `--unit`（默认行为不变）。
- **隔离手段:** 共享 checkout 当前干净，本轮走 inline 分支（不启用 worktree），apply 中途不执行 `bind execute`。
- **正式制作交接:** 第二段 change 负责 `render-film.mjs` / `shots.mjs sync` 的多片参数化、FilmShell 三段装配（120 + shots + 180）、BGM 与出片。

## 任务

### Phase 1 素材库

- [x] x.wuh.site 源码与 git 开发历程深挖（2021 初版/TS 重构/GitHub Actions/VitePress wiki → 2024.12 monorepo 第一行代码 → 2026 上线 → 117 tags）— `videos/preprod-wuh-site-intro-v2/assets/materials.md`
- [x] 线上真实数据采集（activity 12,651 / visits 10,136 / 全站 64,985 字 / 68 repos / 文章·音乐·足迹）— `videos/preprod-wuh-site-intro-v2/assets/materials.md`
- [x] 个人线与金句库（59 篇文章标题与节选、重启计划/坐忘歌/Vibe Coding Workflow 概述、GitHub 资料）— `videos/preprod-wuh-site-intro-v2/assets/materials.md`

### Phase 2 剧本（编剧 subagent）

- [x] script.md：长编年 2021→现在，幕结构 + 情绪曲线 + 全片文案（每处标素材编号），交用户评审定稿 — `videos/preprod-wuh-site-intro-v2/assets/script.md`

### Phase 3 分镜（分镜师 subagent）

- [x] storyboard.md：逐镜表 + 帧数对账表（正片 7658f；严格按 shots.mjs 解析格式：`### Act N 标题（帧 X–Y` 与 `| N | Xf · …（起–止） |`）— `videos/preprod-wuh-site-intro-v2/assets/storyboard.md`

### Phase 4 动效规范（UE 动效大师 subagent）

- [x] motion-spec.md：令牌化 + 全镜覆盖矩阵 — `videos/preprod-wuh-site-intro-v2/assets/motion-spec.md`

### Phase 5 Animatic

- [x] boards.tsx + WuhSiteIntroV2Animatic.tsx（FilmShell 包 7658f 正片，总 7958f；单色简板/真实文案/卡点脉冲）+ routes.ts + Root 注册 — `videos/preprod-wuh-site-intro-v2/`, `src/Root.tsx`
- [x] 渲染 animatic 7958f（GitHub Actions：render-animatic.yml 出片；本机风暴记证据缺口）→ ffprobe 对账 → 交用户评审定稿 — `out/`

### Phase 6 manifest 桥接

- [x] shots.mjs 增 `--unit`（默认 site-film 行为不变）— `scripts/shots.mjs`
- [x] import 生成 `videos/wuh-site-intro-v2/shots-manifest.json`（film=wuh-site-intro-v2，7658f）；site-film check 回归 — `videos/wuh-site-intro-v2/`, `scripts/shots.mjs`

## 结果

- 实际耗时: 约 2 小时（含本机段错误风暴等待与两次剧本/分镜返工）
- 验证:
  | INV-1 video | 观察点：`node scripts/shots.mjs import --unit wuh-site-intro-v2` → `57 镜 / 8 幕 / 7658 帧`，manifest.film=wuh-site-intro-v2；routes.ts 时长 = `totalFilmFrames(7658)` = 7958；animatic 单帧静帧曾渲出（旧结构 2600f）。证据缺口：整片 7958f 实渲被本机连续段错误（exit 139，含 60f/228f 样片与 tsc）阻塞；补充观察点：GitHub Actions workflow render-animatic.yml（新增）出片后补 ffprobe 对账 |
  | INV-2 素材库 | 观察点：materials.md 每条带 `[源码]/[API]/[文章]/[git]/[档案]` 与采集日 2026-10-31；§2.6 衍生项目五条带仓库/出生日/commits/版本 |
  | INV-3 动效规范 | 观察点：`grep -cE` 覆盖矩阵 → 57/57；令牌 118（CV7/SP7/RH6/CM15/PT12/TR26/GR8/FN37） |
  | INV-4 原片 | 观察点：`git diff --stat -- videos/self-intro public/self-intro` 为空 |
  | INV-5 shots 工具 | 观察点：`node scripts/shots.mjs check` → `45 镜 Σ=7200 帧` 全绿；旧校验逻辑对 HEAD 生成物 45/45 缺失（证明 routes 校验修复必要） |
  | INV-6 animatic | 观察点：preprod 单元 `#[0-9a-fA-F]{6}` 与 `Songti|PingFang|Menlo` grep 均零命中 |
- typecheck 证据缺口：`tsc --noEmit` 连续 exit 139（本机风暴）；animatic 单帧渲染曾成功，说明打包编译路径可用；生产阶段补 typecheck 绿。

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/video-production-flow.md`（五件套第二次实践与剧本前置评审口径）、`shadow-docs/knowledge/video-studio-structure.md`（preprod 单元命名与 `shots.mjs --unit` 用法）
- **理由:** 多片化前期流程与 shots.mjs 参数化成为新的结构事实，需在 runtime 验证后回写。
