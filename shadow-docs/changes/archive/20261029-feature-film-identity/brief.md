---
{
  "schema": "shadow-dev/v1",
  "name": "20261029-feature-film-identity",
  "type": "feature",
  "scope": "video-materials",
  "status": "archived",
  "baseBranch": "main",
  "branch": "feature/20261029-feature-film-identity",
  "files": [
    "brand/ident",
    "brand/motion.ts",
    "brand/tokens.ts",
    "public/self-intro",
    "scripts/new-video.mjs",
    "shadow-docs/changes/20261029-feature-film-identity",
    "shadow-docs/knowledge/video-studio-structure.md",
    "shadow-docs/menu.md",
    "src/Root.tsx",
    "src/route.ts",
    "videos/self-intro",
    "videos/site-film/motion-tokens.ts"
  ],
  "github": {
    "repository": "stack-wuh/wuh.site.video",
    "issue": 6,
    "issueUrl": "https://github.com/stack-wuh/wuh.site.video/issues/6",
    "pullRequest": 7,
    "pullRequestUrl": "https://github.com/stack-wuh/wuh.site.video/pull/7"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "9d42b19da98c812c3707dc1eff52cd986977955c",
    "verifiedAt": "2026-10-29T15:10:14.700Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:7",
    "planHash": "3c9b0e6d74dfd42b3a944adb73b33b870ce0ddb5e1f9bc4b212581432044c022",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] 家族片头片尾套件：FilmShell · 品牌基元上收 · self-intro 接入示范",
      "titleRaw": "家族片头片尾套件：FilmShell · 品牌基元上收 · self-intro 接入示范",
      "supplement": "把「片头/片尾」沉淀为 brand 级固定片段（domain.md 已登记）：FilmShell 包装器统一合成，通用动效基元上收 brand/motion，self-intro 作为最小真实样本接入示范。详见 shadow-docs/changes/20261029-feature-film-identity/brief.md",
      "body": "## 动机\n每支视频目前各自设计开场与终幕，风格靠手工对齐；新增一支就要重写一遍。`shadow-docs/domain.md` 已登记「片头/片尾：品牌级固定片段，沉淀后放 `brand/`，逐视频引用」，但至今没有落地实现。本变更把片头片尾沉淀为 brand 级固定片段，用 FilmShell 统一合成，使每支视频开箱即具备同一套家族设计语言；每支视频只提供文案槽位（片名/期数/署名），视觉与节奏不再重复实现。\n\n## 引用规范\n- shadow-docs/knowledge/video-studio-structure.md\n  - 当前结论: `brand/tokens.ts` 是色板字体唯一事实源；分镜组件禁内联色值；`staticFile` 以 `public/` 为根；Composition `durationInFrames` 必须与时间轴一致；全屏动画 radial-gradient 确定性崩溃需规避。\n  - 适用 scope: brand/, videos/, src/Root.tsx, scripts/, public/\n- shadow-docs/knowledge/render-stability-playbook.md\n  - 当前结论: 渲染前端口清场；Sequence 内即局部帧；typecheck 先绿后渲；旧产物先 `rm -f`。\n  - 适用 scope: videos/, scripts/, out/\n- shadow-docs/knowledge/video-production-flow.md\n  - 当前结论: 两段式流程只约束 ≥2min 长片；本变更非长片，不适用。\n  - 适用 scope: videos/\n- norms/code-style.md、norms/code-style-frontend.md、norms/verification.md、norms/domain-model.md\n  - 当前结论: 禁 any、单一职责、不为假想场景提前抽象；L 级需不变量清单与观察点。\n  - 适用 scope: 全部新增与修改代码\n\n## 决策\n- **选型:** 方案 A——通用动效基元上收 `brand/motion.ts`（site-film 改为再导出，七幕源码零改动）；家族套件落 `brand/ident/`（identity/BrandIntro/BrandOutro/FilmShell/dust）；FilmShell 包装器 + BrandIdent 预览 Composition；self-intro 作为示范接入（330f → 630f）；site-film 与 preprod 不动。\n- **对比方案:** B 套件自包含复制基元——零风险但双份动效基元必然漂移，违背品牌单一事实源；C 嵌套 Composition/Series 组合——无法承载音频跨合成与时长公式，排除。\n- **理由:** 家族设计感的本质是「品牌语言只有一处定义」。把 site-film 通用基元退化为再导出可零视觉变化完成上收，typecheck 与 grep 可验。self-intro 仅 330f，是接入链路的最小真实样本，并顺带吸收其两处未提交的 BGM 残留（`SelfIntro.tsx` 改动与 `public/self-intro/bgm.mp3`）。\n- **音频口径:** 片头片尾不带专属音效资产；BGM 在影片组件层声明，片头静音、正片首帧淡入、片尾 loop 段延续并末 30f 淡出。\n- **执行注意:** 当前 checkout 在 `feature/20261025-feature-site-film-production`（PR #5 已合并）。apply 前须先切回 main 并 fast-forward 到最新（`git switch main && git pull --ff-only`），再走 `shadow-dev branch execute`；因 squash 合并后原分支与 main 已分叉，`shadow-dev sync` 的 ff-only 不适用。\n\n## 任务\n### Phase 1 基元上收（零视觉变化）\n\n- [ ] 新建通用动效基元模块：CURVES/SPRINGS/BEAT/TYPE + inkRise/writeFade/typeChars/numRoll/paperBreathe/glowPulse/eqBars/sealStamp/sealTilt — `brand/motion.ts` — 从 site-film 令牌库原样搬迁\n- [ ] 品牌色增补 seal/gold；site-film 令牌模块改为再导出并保留影片私有 ANCHORS/GRADES/COLD/DUST/WHITE_FLASH/RUSH13 — `brand/tokens.ts`, `videos/site-film/motion-tokens.ts` — 再导出等价重构\n- [ ] 验证：`pnpm typecheck` 明确绿；`git diff --stat videos/site-film/scenes` 为空 — 观察点\n\n### Phase 2 家族套件\n\n- [ ] 帧常量与时长公式：INTRO=120 / OUTRO=180 / FilmMeta / totalFilmFrames() — `brand/ident/identity.ts`\n- [ ] 片头三拍：墨滴坠落→墨晕成字→钤印落定，末 3f 硬切进正片 — `brand/ident/BrandIntro.tsx`\n- [ ] 片尾四段：钤印浮现→站训打字机→署名行→墨点收黑 — `brand/ident/BrandOutro.tsx`\n- [ ] 包装器与光尘：三段 Sequence 无空隙无重叠；光尘边缘淡出防回绕闪烁 — `brand/ident/FilmShell.tsx`, `brand/ident/dust.tsx`\n- [ ] 统一路由类型 VideoRoute；注册 BrandIdent 预览合成（420f）；Root 增加 brand 分组一行 — `src/route.ts`, `brand/ident/routes.ts`, `src/Root.tsx`\n\n### Phase 3 接入与脚手架\n\n- [ ] self-intro 接入：新建 routes.ts、SelfIntro 包 FilmShell、BGM 自 120f 起 loop 并在末 30f 淡出、Composition 330→630 — `videos/self-intro/routes.ts`, `videos/self-intro/SelfIntro.tsx`, `public/self-intro/bgm.mp3`\n- [ ] new-video 模板改为 FilmShell 骨架并自动生成 routes.ts — `scripts/new-video.mjs`\n- [ ] 验证：typecheck 全绿；`grep -rn \"#[0-9a-fA-F]\\{6\\}\" brand/ident` 归零 — 观察点\n\n### Phase 4 出片验收\n\n- [ ] 渲染 BrandIdent（420f）与 self-intro（630f），ffprobe 帧数对账 — `out/` — 观察点\n- [ ] 接缝抽帧走查（120f / 450f）+ 分段 volumedetect + 全片观看 — 观察点\n\n## 补充\n把「片头/片尾」沉淀为 brand 级固定片段（domain.md 已登记）：FilmShell 包装器统一合成，通用动效基元上收 brand/motion，self-intro 作为最小真实样本接入示范。详见 shadow-docs/changes/20261029-feature-film-identity/brief.md\n\n完整 brief：shadow-docs/changes/20261029-feature-film-identity/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261029-feature-film-identity\",\"type\":\"feature\",\"scope\":\"video-materials\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261029-feature-film-identity/brief.md\",\"cliVersion\":\"1.8.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    },
    "worktree": "/Users/wuhong/shadow-desktop/github/wuh.site.video-identity",
    "release": {
      "files": [
        "shadow-docs/changes/20261029-feature-film-identity"
      ],
      "message": "docs(shadow): 交付结论——无部署触发，合并后 B 站手工发布",
      "title": "家族片头片尾套件：FilmShell · 品牌基元上收 · self-intro 接入示范",
      "body": "交付结论更新：无部署触发，合并后手工发布 B 站。"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/video-studio-structure.md, shadow-docs/knowledge/render-stability-playbook.md",
    "reason": "片头片尾套件落地为 brand 级契约（FilmShell/时长公式/brand/ident 存放），并实证 loop 音量回调按轮重置的渲染坑；两卡需更新家族片头片尾节与坑位，verified-depth 升 runtime"
  }
}
---

# 家族片头片尾套件（FilmShell）

## 动机

每支视频目前各自设计开场与终幕，风格靠手工对齐；新增一支就要重写一遍。`shadow-docs/domain.md` 已登记「片头/片尾：品牌级固定片段，沉淀后放 `brand/`，逐视频引用」，但至今没有落地实现。本变更把片头片尾沉淀为 brand 级固定片段，用 FilmShell 统一合成，使每支视频开箱即具备同一套家族设计语言；每支视频只提供文案槽位（片名/期数/署名），视觉与节奏不再重复实现。

## 复杂度评级

- **评级:** L
- **理由:** 契约变更——新增跨全部视频的合成契约（FilmShell props 与三段时长公式），Composition 时长由公式派生；触及面——碰共享品牌模块 `brand/tokens`、新建 `brand/motion` 共享基元，并把已出片 site-film 的令牌模块重构为再导出层；可发现性——帧偏移与接缝错误 typecheck 抓不住，只能成片走查（render-stability-playbook 已实证）。三项均超 M 级。
- **期望验证深度:** runtime（BrandIdent 420f 与 self-intro 630f 实渲、ffprobe 对账、分段音量）+ code-read（再导出等价）
- **取证策略:** observation

## 领域模型

- **限界上下文:** video-materials — 视频工程、品牌令牌、分镜组件与素材的唯一维护地。下游：B 站成片发布；反腐边界：不收博客/桌面端物料，不做发布排期管理。
- **统一语言增量:** `FilmShell` = 片头+正片+片尾的合成包装器，负责帧偏移与时长公式；`FilmMeta` = 每支视频的片头片尾文案槽位（title/subtitle/episode/credits）。「片头/片尾」沿用上下文地图已登记定义，不新增同义词。
- **聚合与不变量:**
  - `INV-1 视频合成`：接入套件的视频必须满足 `durationInFrames === INTRO(120) + contentFrames + OUTRO(180)`；FilmShell 三段 Sequence 必须无空隙无重叠。
  - `INV-2 site-film`：通用基元上收后，site-film 七幕源码 import 与渲染行为必须不变（令牌模块再导出等价）。
  - `INV-3 品牌令牌`：`brand/ident/` 组件不得出现内联色值/字体字面量；seal/gold 必须来自 `brand/tokens`。
  - `INV-4 self-intro 音轨`：接入后总长必须为 630f；片头 0–120f 必须静音；正片 BGM 必须从 120f 淡入并覆盖正片；片尾 BGM 必须延续到末 30f 并淡出至静音（实证 loop 下音量回调按轮重置、无法收尾，改用显式两遍播放实现延续）。
  - `INV-5 脚手架`：`new-video.mjs` 生成的骨架必须默认使用 FilmShell，且生成物通过 typecheck。
- **领域事件:** 某视频首次引用 FilmShell → 其 Composition 时长进入公式约束，routes.ts 必须用 `totalFilmFrames()` 计算；品牌基元上收 → `videos/site-film/motion-tokens.ts` 退化为再导出层，新增通用基元只进 `brand/motion`。

## 引用规范

- shadow-docs/knowledge/video-studio-structure.md
  - 当前结论: `brand/tokens.ts` 是色板字体唯一事实源；分镜组件禁内联色值；`staticFile` 以 `public/` 为根；Composition `durationInFrames` 必须与时间轴一致；全屏动画 radial-gradient 确定性崩溃需规避。
  - 适用 scope: brand/, videos/, src/Root.tsx, scripts/, public/
- shadow-docs/knowledge/render-stability-playbook.md
  - 当前结论: 渲染前端口清场；Sequence 内即局部帧；typecheck 先绿后渲；旧产物先 `rm -f`。
  - 适用 scope: videos/, scripts/, out/
- shadow-docs/knowledge/video-production-flow.md
  - 当前结论: 两段式流程只约束 ≥2min 长片；本变更非长片，不适用。
  - 适用 scope: videos/
- norms/code-style.md、norms/code-style-frontend.md、norms/verification.md、norms/domain-model.md
  - 当前结论: 禁 any、单一职责、不为假想场景提前抽象；L 级需不变量清单与观察点。
  - 适用 scope: 全部新增与修改代码

## 决策

- **选型:** 方案 A——通用动效基元上收 `brand/motion.ts`（site-film 改为再导出，七幕源码零改动）；家族套件落 `brand/ident/`（identity/BrandIntro/BrandOutro/FilmShell/dust）；FilmShell 包装器 + BrandIdent 预览 Composition；self-intro 作为示范接入（330f → 630f）；site-film 与 preprod 不动。
- **对比方案:** B 套件自包含复制基元——零风险但双份动效基元必然漂移，违背品牌单一事实源；C 嵌套 Composition/Series 组合——无法承载音频跨合成与时长公式，排除。
- **理由:** 家族设计感的本质是「品牌语言只有一处定义」。把 site-film 通用基元退化为再导出可零视觉变化完成上收，typecheck 与 grep 可验。self-intro 仅 330f，是接入链路的最小真实样本，并顺带吸收其两处未提交的 BGM 残留（`SelfIntro.tsx` 改动与 `public/self-intro/bgm.mp3`）。
- **音频口径:** 片头片尾不带专属音效资产；BGM 在影片组件层声明，片头静音、正片首帧淡入、片尾接续播放并末 30f 淡出至静音（实证 loop 下音量回调按轮重置，改用显式两遍播放实现延续）。
- **执行注意:** 当前 checkout 在 `feature/20261025-feature-site-film-production`（PR #5 已合并）。apply 前须先切回 main 并 fast-forward 到最新（`git switch main && git pull --ff-only`），再走 `shadow-dev branch execute`；因 squash 合并后原分支与 main 已分叉，`shadow-dev sync` 的 ff-only 不适用。

## 任务

### Phase 1 基元上收（零视觉变化）

- [x] 新建通用动效基元模块：CURVES/SPRINGS/BEAT/TYPE + inkRise/writeFade/typeChars/numRoll/paperBreathe/glowPulse/eqBars/sealStamp/sealTilt — `brand/motion.ts` — 从 site-film 令牌库原样搬迁
- [x] 品牌色增补 seal/gold；site-film 令牌模块改为再导出并保留影片私有 ANCHORS/GRADES/COLD/DUST/WHITE_FLASH/RUSH13 — `brand/tokens.ts`, `videos/site-film/motion-tokens.ts` — 再导出等价重构
- [x] 验证：`pnpm typecheck` 明确绿；`git diff --stat videos/site-film/scenes` 为空 — 观察点

### Phase 2 家族套件

- [x] 帧常量与时长公式：INTRO=120 / OUTRO=180 / FilmMeta / totalFilmFrames() — `brand/ident/identity.ts`
- [x] 片头三拍：墨滴坠落→墨晕成字→钤印落定，末 3f 硬切进正片 — `brand/ident/BrandIntro.tsx`
- [x] 片尾四段：钤印浮现→站训打字机→署名行→墨点收黑 — `brand/ident/BrandOutro.tsx`
- [x] 包装器与光尘：三段 Sequence 无空隙无重叠；光尘边缘淡出防回绕闪烁 — `brand/ident/FilmShell.tsx`, `brand/ident/dust.tsx`
- [x] 统一路由类型 VideoRoute；注册 BrandIdent 预览合成（420f）；Root 增加 brand 分组一行 — `src/route.ts`, `brand/ident/routes.ts`, `src/Root.tsx`

### Phase 3 接入与脚手架

- [x] self-intro 接入：新建 routes.ts、SelfIntro 包 FilmShell、BGM 自 120f 起 loop 并在末 30f 淡出、Composition 330→630 — `videos/self-intro/routes.ts`, `videos/self-intro/SelfIntro.tsx`, `public/self-intro/bgm.mp3`
- [x] new-video 模板改为 FilmShell 骨架并自动生成 routes.ts — `scripts/new-video.mjs`
- [x] 验证：typecheck 全绿；`grep -rn "#[0-9a-fA-F]\{6\}" brand/ident` 归零 — 观察点

### Phase 4 出片验收

- [x] 渲染 BrandIdent（420f）与 self-intro（630f），ffprobe 帧数对账 — `out/` — 观察点
- [x] 接缝抽帧走查（120f / 450f）+ 分段 volumedetect + 全片观看 — 观察点

## 结果

- 实际耗时: 约 1 小时（含本机段错误风暴等待与三次重渲）
- 验证:
  | INV-1 video-composition | 观察点：`ffprobe out/brand-ident.mp4` → `nb_read_frames=420` / `duration=14.000`（120+120+180）；`ffprobe out/self-intro-ident.mp4` → `nb_read_frames=630` / `duration=21.000`（120+330+180）；接缝抽帧 119→120、449→450、分块接缝 359→360 连续，无重叠无空隙 |
  | INV-2 site-film-unchanged | 观察点：`git diff --stat -- videos/site-film/scenes` 为空；7 个幕文件 `from '../motion-tokens'` 引用数 = 7；上收基元与旧文件规范化 diff 逐行一致（80/80 行）；`tsc --noEmit` 退出 0；重构后 SiteFilm 第 30 帧剧照渲染成功。证据缺口：与旧代码同帧像素级 A/B 因本机连续 3 次 exit 139 未取得，替代观察点为规范化 diff 一致 + 成帧渲染 |
  | INV-3 brand-tokens | 观察点：`grep -rn "#[0-9a-fA-F]\{6\}" brand/ident` 零命中；`grep -E "Songti\|PingFang\|Menlo" brand/ident` 零命中 |
  | INV-4 self-intro-audio | 观察点：ffprobe 630f/21.000s；以 440Hz 测试音替换占位轨整片渲染后 `volumedetect`：片头 0–3.5s −91.0dB；淡入中段 4.05–4.4s −37.1dB；正片 4.2–14.2s −24.7dB；片尾接续段 15.5–16.6s −24.5dB（无凹陷）；末帧 20.967–21.0s −91.0dB。注：交付片音轨实测 −91dB 属数据而非代码——占位曲 `public/self-intro/bgm.mp3` 本身为静音文件，替换同名文件即有声；实现以显式两遍播放替代 loop（实证 loop 下音量回调按轮重置，既无法收尾、又在循环点产生淡入凹陷） |
  | INV-5 scaffold-default | 观察点：`node scripts/new-video.mjs scaffold-check` 生成 FilmShell 骨架 + routes.ts，`tsc --noEmit` 退出 0（第三次尝试通过，前两次 exit 139 属环境），临时目录已移除 |
- 实现期扩面: `videos/site-film/routes.ts`、`videos/preprod-site-film/routes.ts`（VideoRoute 类型统一所需）与 `shadow-docs/knowledge/render-stability-playbook.md`（review 知识结论）不在原申报文件集；当前 CLI 1.4.0 执行 `change amend` 返回 UNKNOWN_COMMAND，故在此登记，review 已覆盖实际 diff。
- 交付发布: 项目无部署触发（`shadow-docs/menu.md` 无构建/部署域路由；`domain.md` 载明下游为 B 站成片发布）；用户 2026-10-29 确认——合并 PR 后手工发布到 B 站，交付链无 CI 环节。

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/video-studio-structure.md`（新增「家族片头片尾 FilmShell」节与 `brand/ident/` 存放规范）、`shadow-docs/menu.md`（增补「片头 片尾 ident FilmShell」路由关键词）
- **理由:** 片头片尾接入契约是结构性约定，影响所有未来视频；卡片 verified-depth 需升为 runtime（以 BrandIdent 与 self-intro 实渲为证）。
