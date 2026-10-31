---
{
  "schema": "shadow-dev/v1",
  "name": "20261031-feature-site-film-shot-pipeline",
  "type": "feature",
  "scope": "video-materials",
  "status": "proposed",
  "baseBranch": "main",
  "branch": null,
  "files": [
    "package.json",
    "scripts/render-film.mjs",
    "scripts/shots.mjs",
    "shadow-docs/knowledge/video-production-flow.md",
    "src/Root.tsx",
    "videos/site-film"
  ],
  "github": {
    "repository": "stack-wuh/wuh.site.video",
    "issue": 9,
    "issueUrl": "https://github.com/stack-wuh/wuh.site.video/issues/9",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "pending",
    "verifiedCommit": null,
    "verifiedAt": null
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:9",
    "planHash": "8ef76fbcc24d33fa6d977f82c862bd3f09cb9ce613851ec938c1b3397f069f2b",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] site-film 镜级管线迁移：一镜一文件 + 渲染脚本 v2 + 可见性层",
      "titleRaw": "[feature] site-film 镜级管线迁移：一镜一文件 + 渲染脚本 v2 + 可见性层",
      "supplement": "site-film 全量迁移到镜级产出物规范（shot-spec.md，2026-10-31 四项决策定稿）：45 镜一镜一文件、装配重构（manifest 驱动 + ShotShell + SiteFilmAudio）、渲染脚本 v2（镜级缓存 + Node API onProgress + HTML 面板 + 系统通知）。验收：INV-S1..6 + 全片渲染与已交付成片 SSIM 对账 + 三重终验。详见 shadow-docs/changes/20261031-feature-site-film-shot-pipeline/brief.md",
      "body": "## 动机\nsite-film 正式制作以 Act 级文件 + 任意 1440f 分段渲染交付，镜不存在为独立产物（Act 内条件分支 + `frame - 120` 手算偏移），改一镜必全片重渲 30–40 分钟——而成片交付后的用户反馈微调是技能写死的常态流程。2026-10-31 会话定稿镜级产出物规范（技能仓 shadow-dev-video/shot-spec.md，PR #77）：一镜 = 一文件一组件一 Sequence 一缓存，四项决策（manifest 真源/转场挂出镜+交接态协议/SFX v1 冻结/全量迁移）均由用户拍板。本 change 按规范对 site-film 全量迁移，兼作规范 runtime 验证场。\n\n## 引用规范\n- shadow-docs/knowledge/video-studio-structure.md\n  - 当前结论: 三层结构；渲染口径 node 22.23.2/系统 Chrome/port 3211/crf16；Composition durationInFrames 一致性；staticFile 以 public/ 为根；FilmShell/totalFilmFrames 公式（site-film 未接入）\n  - 适用 scope: videos/, scripts/, src/, package.json, public/\n- shadow-docs/knowledge/render-stability-playbook.md\n  - 当前结论: 渲染前清场铁律；分块收敛梯；**拼接必须 concat 滤镜 + trim 帧级对齐（分块容器 ~16ms 余量 → demuxer 拼接重复帧实证）**；Audio 禁 loop（音量按轮重置）；先绿后渲；pkill 只放脚本内\n  - 适用 scope: videos/, scripts/, out/\n- norms/code-style.md\n  - 当前结论: TS 禁 any、命名与 import 顺序、无 TODO 注释\n  - 适用 scope: 全部新增 TS 代码\n\n## 决策\n- **选型:** 按技能 shot-spec.md（PR #77）全量迁移：45 镜拆文件（按幕并行 subagent）→ 装配重构（manifest 驱动 Sequence + ShotShell + SiteFilmAudio）→ 渲染脚本 v2（bundle 一次 + renderMedia 逐镜 + 镜级缓存 + concat 滤镜帧级对齐 + onProgress 三层事件 + HTML 面板 + macOS 通知）\n- **对比方案:** 维持 Act 级（痛点不解决，弃）；惰性迁移改哪幕拆哪幕（装配层双形态最脏，弃）\n- **理由:** 规范已定稿并获用户逐项拍板；本迁移兼作规范 runtime 验证（SSIM 对账已交付成片 out/site-film.mp4，7200f 基准；main 令牌上收已核实值不变，基准有效）\n- **隔离手段:** 共享 checkout 有 self-intro 悬置改动挡分支切换——git worktree 专属工作区（../wuh.site.video-shot-pipeline，自 origin/main 建树；CLI 1.4.0 无 worktree 命令故手工建树，分支创建在建树时完成，brief 分支字段以 reconcile 对账）；渲染任务独占串行纪律照旧\n- **SFX v1 冻结:** 镜渲染无音轨，音轨唯一来源 SiteFilmAudio；将来 SFX 只动渲染拼接层不动契约（shot-spec §7）\n\n## 任务\n### Phase 1 镜级地基\n- [ ] `scripts/shots.mjs`：import（storyboard 一次性导入）/ sync（反生成对账表 + routes.ts）/ check（INV-S1/S2/S6）三命令 — `scripts/shots.mjs`\n- [ ] 分镜表导入生成 shots-manifest.json（45 镜对账 7200 帧） — `videos/site-film/shots-manifest.json`\n- [ ] ShotShell（底色 + 暖纸肌理下沉）与 SiteFilmAudio（五段 BGM 编析迁出） — `videos/site-film/components/ShotShell.tsx`, `videos/site-film/SiteFilmAudio.tsx`\n### Phase 2 逐镜拆分（按幕并行 subagent，7 组 45 镜）\n- [ ] 45 个 `shots/sNN.tsx`：条件分支与手算偏移换算局部帧，import 白名单内自包含 — `videos/site-film/shots/`\n### Phase 3 装配重构\n- [ ] SiteFilm.tsx 纯装配化（manifest 遍历 + ShotShell + 内联音轨）；routes.ts 生成物接入 src/Root.tsx（遍历器不改）；移除 scenes/ — `videos/site-film/SiteFilm.tsx`, `videos/site-film/routes.ts`, `src/Root.tsx`\n### Phase 4 渲染脚本 v2\n- [ ] render-film.mjs 重写：bundle 一次 + renderMedia 逐镜（缓存键 = 镜文件 hash + esbuild 依赖闭包）+ concat 滤镜帧级对齐 + CFR 终装 + 音轨 mux + 三重终验；onProgress 三层事件 + render-status.json + render-progress.html 面板 + osascript 通知（重试静默终败必达）；旧分段渲染保留为兜底 — `scripts/render-film.mjs`, `package.json`\n### Phase 5 验证与收口\n- [ ] shots.mjs check 绿 + pnpm typecheck 绿（先绿后渲） — `videos/site-film/`, `scripts/`\n- [ ] 全镜渲染 + INV-S5 逐镜帧数对账 + 拼接成片与 out/site-film.mp4 SSIM 对账 + 三重终验 — `out/`\n\n## 补充\nsite-film 全量迁移到镜级产出物规范（shot-spec.md，2026-10-31 四项决策定稿）：45 镜一镜一文件、装配重构（manifest 驱动 + ShotShell + SiteFilmAudio）、渲染脚本 v2（镜级缓存 + Node API onProgress + HTML 面板 + 系统通知）。验收：INV-S1..6 + 全片渲染与已交付成片 SSIM 对账 + 三重终验。详见 shadow-docs/changes/20261031-feature-site-film-shot-pipeline/brief.md\n\n完整 brief：shadow-docs/changes/20261031-feature-site-film-shot-pipeline/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261031-feature-site-film-shot-pipeline\",\"type\":\"feature\",\"scope\":\"video-materials\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261031-feature-site-film-shot-pipeline/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    },
    "commit": {
      "files": [
        "package.json",
        "pnpm-lock.yaml",
        "scripts/render-film.mjs",
        "scripts/shots.mjs",
        "shadow-docs/changes/20261031-feature-site-film-shot-pipeline",
        "videos/site-film"
      ],
      "message": "feat(video-materials): site-film 镜级管线迁移——一镜一文件 + 渲染脚本 v2 看门狗 + 可见性层"
    }
  }
}
---

# site-film 镜级管线迁移：一镜一文件 + 渲染脚本 v2 + 可见性层

## 动机
site-film 正式制作以 Act 级文件 + 任意 1440f 分段渲染交付，镜不存在为独立产物（Act 内条件分支 + `frame - 120` 手算偏移），改一镜必全片重渲 30–40 分钟——而成片交付后的用户反馈微调是技能写死的常态流程。2026-10-31 会话定稿镜级产出物规范（技能仓 shadow-dev-video/shot-spec.md，PR #77）：一镜 = 一文件一组件一 Sequence 一缓存，四项决策（manifest 真源/转场挂出镜+交接态协议/SFX v1 冻结/全量迁移）均由用户拍板。本 change 按规范对 site-film 全量迁移，兼作规范 runtime 验证场。

## 复杂度评级
- **评级:** L
- **理由:** 契约变更——装配契约（SiteFilm 纯装配/ShotShell/SiteFilmAudio）、渲染管线 v2（镜级缓存 + Node API）、帧数真源迁移（storyboard→manifest）三重契约同时更替；触及面大——45 镜拆文件 + 2 个脚本重写 + 装配重构；可发现性中——契约可走查（INV-S1..6）、像素级回归需 runtime 渲染对账
- **期望验证深度:** runtime（全镜渲染 + 与已交付成片 SSIM 对账 + 三重终验）

## 领域模型

- **限界上下文:** video-materials — 视频工程、品牌令牌、分镜组件与素材的唯一维护地。上游 x.wuh.site（只读数据源）；下游 B 站成片发布。反腐边界：不收博客/桌面端物料，不做发布排期管理。
- **统一语言增量:**
  - 镜 shot: 一镜一文件的最小产物单元（shots/sNN.tsx，NN 对齐分镜镜号），局部帧 0 起、自包含
  - shots-manifest: 帧数唯一机器真源（镜号/幕/起止帧/时长/源文件），startFrame 前缀和生成
  - ShotShell: 全局视觉（底色/暖纸肌理）下沉的镜包装器，装配层禁止全片视觉 overlay
  - 交接态: 转场出镜尾帧带到、受入镜首帧承接的画面状态（黑场/白场/光点/冻帧）
  - 镜级缓存: 缓存键 = 镜文件 hash + 依赖闭包，命中跳过渲染
- **聚合与不变量:**
  - `video`（videos/site-film/）：
    - INV-S1: Σ durationFrames = totalFrames = SiteFilm `durationInFrames` = 7200
    - INV-S2: 镜号连续唯一、source 文件存在、startFrame = 前缀和、幕边界与 storyboard 幕表一致
    - INV-S3: shots/ 内 import 全在白名单（react/remotion/brand 令牌/本片 motion-tokens/本片 components/），无跨镜 import、无 `<Audio>`
    - INV-S4: 装配层零镜内容、零全片视觉 overlay（SiteFilm.tsx 走查）
    - INV-S5: 每镜渲染 ffprobe nb_frames = durationFrames
    - INV-S6: routes.ts 与 shots-manifest.json 一致（生成物校验）
- **领域事件:** 迁移验收通过（SSIM 零回归 + 三重终验）→ 镜级管线成为正式制作标准口径，video-production-flow 知识卡更新（含前期五件套口径修正）

## 引用规范
- shadow-docs/knowledge/video-studio-structure.md
  - 当前结论: 三层结构；渲染口径 node 22.23.2/系统 Chrome/port 3211/crf16；Composition durationInFrames 一致性；staticFile 以 public/ 为根；FilmShell/totalFilmFrames 公式（site-film 未接入）
  - 适用 scope: videos/, scripts/, src/, package.json, public/
- shadow-docs/knowledge/render-stability-playbook.md
  - 当前结论: 渲染前清场铁律；分块收敛梯；**拼接必须 concat 滤镜 + trim 帧级对齐（分块容器 ~16ms 余量 → demuxer 拼接重复帧实证）**；Audio 禁 loop（音量按轮重置）；先绿后渲；pkill 只放脚本内
  - 适用 scope: videos/, scripts/, out/
- norms/code-style.md
  - 当前结论: TS 禁 any、命名与 import 顺序、无 TODO 注释
  - 适用 scope: 全部新增 TS 代码

## 决策
- **选型:** 按技能 shot-spec.md（PR #77）全量迁移：45 镜拆文件（按幕并行 subagent）→ 装配重构（manifest 驱动 Sequence + ShotShell + SiteFilmAudio）→ 渲染脚本 v2（bundle 一次 + renderMedia 逐镜 + 镜级缓存 + concat 滤镜帧级对齐 + onProgress 三层事件 + HTML 面板 + macOS 通知）
- **对比方案:** 维持 Act 级（痛点不解决，弃）；惰性迁移改哪幕拆哪幕（装配层双形态最脏，弃）
- **理由:** 规范已定稿并获用户逐项拍板；本迁移兼作规范 runtime 验证（SSIM 对账已交付成片 out/site-film.mp4，7200f 基准；main 令牌上收已核实值不变，基准有效）
- **隔离手段:** 共享 checkout 有 self-intro 悬置改动挡分支切换——git worktree 专属工作区（../wuh.site.video-shot-pipeline，自 origin/main 建树；CLI 1.4.0 无 worktree 命令故手工建树，分支创建在建树时完成，brief 分支字段以 reconcile 对账）；渲染任务独占串行纪律照旧
- **SFX v1 冻结:** 镜渲染无音轨，音轨唯一来源 SiteFilmAudio；将来 SFX 只动渲染拼接层不动契约（shot-spec §7）

## 任务
### Phase 1 镜级地基
- [x] `scripts/shots.mjs`：import（storyboard 一次性导入）/ sync（反生成对账表 + routes.ts）/ check（INV-S1/S2/S6）三命令 — `scripts/shots.mjs`
- [x] 分镜表导入生成 shots-manifest.json（45 镜对账 7200 帧） — `videos/site-film/shots-manifest.json`
- [x] ShotShell（底色 + 暖纸肌理下沉）与 SiteFilmAudio（五段 BGM 编析迁出） — `videos/site-film/components/ShotShell.tsx`, `videos/site-film/SiteFilmAudio.tsx`
### Phase 2 逐镜拆分（按幕并行 subagent，7 组 45 镜）
- [x] 45 个 `shots/sNN.tsx`：条件分支与手算偏移换算局部帧，import 白名单内自包含 — `videos/site-film/shots/`
### Phase 3 装配重构
- [x] SiteFilm.tsx 纯装配化（manifest 遍历 + ShotShell + 内联音轨）；routes.ts 生成物接入 src/Root.tsx（遍历器不改）；移除 scenes/ — `videos/site-film/SiteFilm.tsx`, `videos/site-film/routes.ts`, `src/Root.tsx`
### Phase 4 渲染脚本 v2
- [x] render-film.mjs 重写：bundle 一次 + renderMedia 逐镜（缓存键 = 镜文件 hash + esbuild 依赖闭包）+ concat 滤镜帧级对齐 + CFR 终装 + 音轨 mux + 三重终验；onProgress 三层事件 + render-status.json + render-progress.html 面板 + osascript 通知（重试静默终败必达）；旧分段渲染保留为兜底 — `scripts/render-film.mjs`, `package.json`
### Phase 5 验证与收口
- [x] shots.mjs check 绿 + pnpm typecheck 绿（先绿后渲） — `videos/site-film/`, `scripts/`
- [ ] 全镜渲染 + INV-S5 逐镜帧数对账 + 拼接成片与 out/site-film.mp4 SSIM 对账 + 三重终验 — `out/`

## 结果
- 实际耗时: —
- 验证: —（L 级逐条对账：INV-S1..S6 观察点见 shot-spec 不变量节；SSIM 与三重终验输出摘要；证据缺口如实标注）

## 知识评估
- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/video-production-flow.md（镜级管线口径、前期五件套、修正三/四件套表述不一致、分镜师/编剧/UE 大师协作）；render-stability-playbook 视实施新增坑位补充
- **理由:** 镜级管线为工作室新标准口径，须 runtime 验证后回写（verified-depth: runtime）
