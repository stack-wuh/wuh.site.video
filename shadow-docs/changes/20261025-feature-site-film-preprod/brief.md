---
{
  "schema": "shadow-dev/v1",
  "name": "20261025-feature-site-film-preprod",
  "type": "feature",
  "scope": "video-materials",
  "status": "published",
  "baseBranch": "main",
  "branch": "feature/20261025-feature-site-film-preprod",
  "files": [
    "package.json",
    "src/Root.tsx",
    "videos/preprod-site-film"
  ],
  "github": {
    "repository": "stack-wuh/wuh.site.video",
    "issue": 2,
    "issueUrl": "https://github.com/stack-wuh/wuh.site.video/issues/2",
    "pullRequest": 3,
    "pullRequestUrl": "https://github.com/stack-wuh/wuh.site.video/pull/3"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "7e0248fc881bbd574530135e9cb71ef72258e6b8",
    "verifiedAt": "2026-10-25T05:02:05.724Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:3",
    "planHash": "af7d1fc2f3326ac5558c9f801ac4f457bcdb3d35f17073bbe25e71d45088b1eb",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] site-film 前期制作：素材库 · 分镜脚本 · 动效规范 · Animatic",
      "titleRaw": "site-film 前期制作：素材库 · 分镜脚本 · 动效规范 · Animatic",
      "supplement": "第二支视频（3 分钟 · 电影感 · 产品深度×人文金句）前期制作：内容素材丰富采集、分镜师分镜脚本、UE 大师动效规范、Remotion animatic 动态样片。评审通过后另立项正式制作。详见 shadow-docs/changes/20261025-feature-site-film-preprod/brief.md",
      "body": "## 动机\nv5《wuh.site · 朝朝如念》已出片保留，但动效保守、功能展示平铺。第二支视频（约 3 分钟，180s = 5400 帧 @30fps）定调**电影感 Cinematic**、内容**产品深度 + 人文金句混合**。按电影工业预流程，先完成内容丰富与前期设计（分镜脚本、动效规范、animatic 动态样片），评审通过后另立 change 做正式制作——「内容丰富了再去做视频、做动效」。\n\n## 引用规范\n- shadow-docs/knowledge/video-studio-structure.md\n  - 当前结论: 工作室三层结构；tokens 纪律；渲染口径（node 22.23.2/系统 Chrome/port 3211/crf 16）；本机渲染不可靠——分段渲染 + 重试阵 + bundle 预打包缓存是既定对策\n  - 适用 scope: brand/, videos/, scripts/, src/Root.tsx, package.json\n- norms/code-style.md\n  - 当前结论: TS 禁 any、命名与 import 顺序、无 TODO 注释\n  - 适用 scope: 全部新增 TS 代码\n\n## 决策\n- **选型:** 方案 B 两段式——本次只做前期制作，animatic 评审通过后另立正式制作 change\n- **对比方案:** A 单变更全流程（前期未评审就烧动效工时，返工风险大）；C 三并行 change（分镜依赖素材、动效依赖分镜，天然串行，过度拆分）\n- **理由:** 用户明确「内容丰富了再去做视频做动效」；animatic 灰盒换取「先评审节奏叙事」，避免在错误叙事上烧正式工时\n- **专家角色:** 分镜师、UE 动效大师以专职 subagent 在 apply 阶段并行产出（用户点名启用），产出落入 assets/ 后由本代理整合对账\n- **隔离手段:** 共享 checkout 有 self-intro BGM 悬置改动，apply 时优先 `shadow-dev worktree plan/execute` 开专属 workspace（M 级非强制，apply 现场定）\n- ** cinematography 基调:** 电影感 Cinematic（镜头运动/景深光尘/粒子氛围/慢节奏重鼓点），内容 = 产品深度 × 人文金句交替推进\n\n## 任务\n### Phase 1 内容素材丰富采集\n- [ ] site 源码功能交互细节深挖（HomeView Projects/Weread/Contact、guestbook 页、topics、design、footprint 页） — `videos/preprod-site-film/assets/materials.md`\n- [ ] 真实数据盘点（评论/点赞数、/api/about/activity 热力图、/api/footprints 足迹、播放次数） — `videos/preprod-site-film/assets/materials.md`\n- [ ] 人文金句库（博客金句摘录、《关于我.md》、读书摘句、站点题记体系） — `videos/preprod-site-film/assets/materials.md`\n### Phase 2 分镜脚本（分镜师 subagent）\n- [ ] 逐镜脚本全表：镜号/画面/镜头语言/文案/时长/转场/音效点，总时长 5400 帧，交用户评审定稿 — `videos/preprod-site-film/assets/storyboard.md`\n### Phase 3 动效设计规范（UE 大师 subagent）\n- [ ] 动效规范：运动曲线体系（缓动/弹性/质感）、粒子与光影语言、转场语法、镜头运动（推拉摇移/景深）、节奏与卡点设计，覆盖全部镜头 — `videos/preprod-site-film/assets/motion-spec.md`\n### Phase 4 Animatic 动态样片\n- [ ] animatic composition（灰盒构图 + 节拍 + 字幕 + 镜头语言指示，5400 帧）+ Root 注册 + render 脚本 — `videos/preprod-site-film/SiteFilmAnimatic.tsx`, `src/Root.tsx`, `package.json`\n- [ ] 分段渲染 animatic 出片 + INV-1..4 对账 + 交用户评审 — `out/preprod-animatic.mp4`\n\n## 补充\n第二支视频（3 分钟 · 电影感 · 产品深度×人文金句）前期制作：内容素材丰富采集、分镜师分镜脚本、UE 大师动效规范、Remotion animatic 动态样片。评审通过后另立项正式制作。详见 shadow-docs/changes/20261025-feature-site-film-preprod/brief.md\n\n完整 brief：shadow-docs/changes/20261025-feature-site-film-preprod/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261025-feature-site-film-preprod\",\"type\":\"feature\",\"scope\":\"video-materials\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261025-feature-site-film-preprod/brief.md\",\"cliVersion\":\"1.8.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    },
    "release": {
      "files": [
        "shadow-docs/changes/20261025-feature-site-film-preprod",
        "shadow-docs/knowledge/video-studio-structure.md",
        "src/Root.tsx",
        "videos/preprod-site-film"
      ],
      "message": "feat(video-materials): site-film 前期制作四件套——素材库/分镜脚本/动效规范/animatic 分镜板",
      "title": "site-film 前期制作：素材库 · 分镜脚本 · 动效规范 · Animatic 分镜板（4:00）",
      "body": "## 概要\nsite-film 前期制作四件套（变更 20261025-feature-site-film-preprod · Issue #2）：\n\n- **素材库** materials.md——八节真实素材全溯源：25 条源码可拍细节、年度统一活动 API（10,330 次/365 天六维）、年度浏览量（21,643/46 篇）、真实足迹、人文金句库（坐忘歌/重启计划宣言/站点题记）、VibeCoding 影子工作流（254 briefs · 40 知识卡 · 12 版本）\n- **分镜脚本** storyboard.md——45 镜七幕 · 7200 帧精确对账 · 色彩情绪曲线 · 90 BPM 卡点体系（v1.1，用户定稿）\n- **动效规范** motion-spec.md——108 令牌（曲线 35/镜头 15/粒子 9/转场 42/调色 7）· 45/45 镜覆盖矩阵 · 七工艺转场点（UE 大师产出）\n- **Animatic 分镜板** SiteFilmAnimatic（7200 帧）——45 镜真实内容单色简板 + 字幕卡 + 卡点脉冲，已渲染终验（240.000s 整）并获用户定稿\n\n## 变更之外\n- 正式制作（全彩 + 108 动效令牌实装 + 配乐）评审后另立项\n- self-intro BGM 悬置改动不入列；落选 BGM 候选清理另议\n\n## 知识更新\nvideo-studio-structure.md（verified-depth: runtime）：轮转编排/渲染前清场/分块微块重试收敛策略、Chrome 部分透明度叠渲染确定性崩溃及 3 帧跳变规避、staticFile 以 public/ 为根、Composition 时长与分段一致性、前期三件套流程。\n\nCloses #2"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/video-studio-structure.md",
    "reason": "两日 runtime 实证回写：长片渲染编排演进（轮转制/渲染前清场孤儿 Chrome/分块与微块重试收敛）、Chrome 部分透明度叠渲染确定性崩溃及 3 帧跳变规避、staticFile 以 public/ 为根、Composition durationInFrames 与分段范围一致性、前期制作三件套流程与分镜师/UE 大师 subagent 协作。verified-depth: runtime"
  }
}
---

# site-film 前期制作：素材库 · 分镜脚本 · 动效规范 · Animatic 动态样片

## 动机
v5《wuh.site · 朝朝如念》已出片保留，但动效保守、功能展示平铺。第二支视频（约 3 分钟，180s = 5400 帧 @30fps）定调**电影感 Cinematic**、内容**产品深度 + 人文金句混合**。按电影工业预流程，先完成内容丰富与前期设计（分镜脚本、动效规范、animatic 动态样片），评审通过后另立 change 做正式制作——「内容丰富了再去做视频、做动效」。

## 复杂度评级
- **评级:** M
- **理由:** 契约变更——新增 animatic Composition 注册与渲染脚本；触及面中等——新视频单元（文档 ×3 + animatic 场景）；可发现性中——文档可走查、样片需 runtime 帧数对账；正式制作的动效实现不在本 change
- **期望验证深度:** runtime（INV-1 帧数对账 ffprobe、INV-2 grep 探针、INV-3/4 文档走查）

## 领域模型

- **限界上下文:** video-materials — 视频工程、品牌令牌、分镜组件与素材的唯一维护地。下游 B 站成片发布；反腐边界：不收博客/桌面端物料，不做发布排期管理。x.wuh.site 仓库仅作只读数据源。
- **统一语言增量:**
  - 分镜脚本 storyboard: 逐镜表（镜号/画面/镜头语言/文案/时长/转场/音效点）
  - 动效规范 motion-spec: 运动曲线体系、粒子光影、转场语法、镜头运动的唯一设计事实源
  - 动态样片 animatic: 灰盒预演片——构图 + 节拍 + 字幕 + 镜头语言，非成片质量，用于叙事节奏评审
- **聚合与不变量:**
  - `video`（videos/preprod-site-film/ 前期单元）:
    - INV-1: 分镜脚本各镜时长之和 = animatic `durationInFrames` = 5400 帧（180s @30fps）
    - INV-2: animatic 零内联色值/字体字面量（brand/tokens + motion-spec 动效令牌）
    - INV-3: 素材库每条素材标注真实数据源（git / RSS / API / 源码文件路径）
    - INV-4: 动效规范覆盖分镜脚本全部镜头的入场/持续/出场/转场
- **领域事件:** animatic 评审通过 → 另立 change 立项正式制作（site-film 前置依赖）

## 引用规范
- shadow-docs/knowledge/video-studio-structure.md
  - 当前结论: 工作室三层结构；tokens 纪律；渲染口径（node 22.23.2/系统 Chrome/port 3211/crf 16）；本机渲染不可靠——分段渲染 + 重试阵 + bundle 预打包缓存是既定对策
  - 适用 scope: brand/, videos/, scripts/, src/Root.tsx, package.json
- norms/code-style.md
  - 当前结论: TS 禁 any、命名与 import 顺序、无 TODO 注释
  - 适用 scope: 全部新增 TS 代码

## 决策
- **选型:** 方案 B 两段式——本次只做前期制作，animatic 评审通过后另立正式制作 change
- **对比方案:** A 单变更全流程（前期未评审就烧动效工时，返工风险大）；C 三并行 change（分镜依赖素材、动效依赖分镜，天然串行，过度拆分）
- **理由:** 用户明确「内容丰富了再去做视频做动效」；animatic 灰盒换取「先评审节奏叙事」，避免在错误叙事上烧正式工时
- **专家角色:** 分镜师、UE 动效大师以专职 subagent 在 apply 阶段并行产出（用户点名启用），产出落入 assets/ 后由本代理整合对账
- **隔离手段:** 共享 checkout 有 self-intro BGM 悬置改动，apply 时优先 `shadow-dev worktree plan/execute` 开专属 workspace（M 级非强制，apply 现场定）
- ** cinematography 基调:** 电影感 Cinematic（镜头运动/景深光尘/粒子氛围/慢节奏重鼓点），内容 = 产品深度 × 人文金句交替推进

## 任务
### Phase 1 内容素材丰富采集
- [x] site 源码功能交互细节深挖（HomeView Projects/Weread/Contact、guestbook 页、topics、design、footprint 页） — `videos/preprod-site-film/assets/materials.md`
- [x] 真实数据盘点（评论/点赞数、/api/about/activity 热力图、/api/footprints 足迹、播放次数） — `videos/preprod-site-film/assets/materials.md`
- [x] 人文金句库（博客金句摘录、《关于我.md》、读书摘句、站点题记体系） — `videos/preprod-site-film/assets/materials.md`
### Phase 2 分镜脚本（分镜师 subagent）
- [x] 逐镜脚本全表：镜号/画面/镜头语言/文案/时长/转场/音效点，总时长 5400 帧，交用户评审定稿 — `videos/preprod-site-film/assets/storyboard.md`
### Phase 3 动效设计规范（UE 大师 subagent）
- [x] 动效规范：运动曲线体系（缓动/弹性/质感）、粒子与光影语言、转场语法、镜头运动（推拉摇移/景深）、节奏与卡点设计，覆盖全部镜头 — `videos/preprod-site-film/assets/motion-spec.md`
### Phase 4 Animatic 动态样片
- [x] animatic composition（灰盒构图 + 节拍 + 字幕 + 镜头语言指示，5400 帧）+ Root 注册 + render 脚本 — `videos/preprod-site-film/SiteFilmAnimatic.tsx`, `src/Root.tsx`, `package.json`
- [x] 分段渲染 animatic 出片 + INV-1..4 对账 + 交用户评审 — `out/preprod-animatic.mp4`

## 结果
- 实际耗时: —
- 验证: —（M 级：INV-1 → storyboard 时长表 vs ffprobe 对账；INV-2 → grep 探针；INV-3/4 → 文档走查；animatic 成片走查）

## 知识评估
- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/video-studio-structure.md（增补：bundle 预打包缓存对策、轮转渲染编排、视频前期制作流程 storyboard/motion-spec/animatic 三件套）
- **理由:** 本会话已 runtime 验证 bundle 缓存与轮转渲染的有效性（v5 段 2-5 实证）；前期三件套为本仓新实践（verified-depth: runtime）
