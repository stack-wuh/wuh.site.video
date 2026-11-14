---
{
  "schema": "shadow-dev/v1",
  "name": "20261114-feature-wuh-site-intro-v3-redesign",
  "type": "feature",
  "scope": "videos/preprod-wuh-site-intro-v3,videos/wuh-site-intro-v3,public/wuh-site-intro-v3",
  "status": "committed",
  "baseBranch": "main",
  "branch": "feature/20261114-feature-wuh-site-intro-v3-redesign",
  "files": [
    "videos/preprod-wuh-site-intro-v3/assets/asset-registry.md",
    "videos/preprod-wuh-site-intro-v3/assets/materials.md",
    "videos/preprod-wuh-site-intro-v3/assets/motion-spec.md",
    "videos/preprod-wuh-site-intro-v3/assets/script.md",
    "videos/preprod-wuh-site-intro-v3/assets/storyboard.md",
    "videos/preprod-wuh-site-intro-v3/assets/style-anchor.md",
    "videos/wuh-site-intro-v3/shots-manifest.json"
  ],
  "github": {
    "repository": "stack-wuh/wuh.site.video",
    "issue": 64,
    "issueUrl": "https://github.com/stack-wuh/wuh.site.video/issues/64",
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
    "checkpoint": "52eace6c7d4efd4681f459af03fa4d1e90fad546",
    "planHash": "899b692907485dafe3a2bf569450e7ca9fb027d68f0aeda6f976461c976bfdff",
    "updatedAt": null,
    "lastError": null,
    "commit": {
      "files": [
        "shadow-docs/changes/20261114-feature-wuh-site-intro-v3-redesign/brief.md",
        "videos/preprod-wuh-site-intro-v3/assets/asset-registry.md",
        "videos/preprod-wuh-site-intro-v3/assets/materials.md",
        "videos/preprod-wuh-site-intro-v3/assets/script.md",
        "videos/preprod-wuh-site-intro-v3/assets/storyboard.md",
        "videos/preprod-wuh-site-intro-v3/assets/style-anchor.md",
        "videos/wuh-site-intro-v3/shots-manifest.json"
      ],
      "message": "feat(video-materials): 前期重做 Phase 1-3"
    },
    "issuePlan": {
      "title": "[feature] wuh.site 介绍片 v3 全流程重做：亮色信息密度 · 产品发布片方向",
      "titleRaw": "[feature] wuh.site 介绍片 v3 全流程重做：亮色信息密度 · 产品发布片方向",
      "supplement": "用户判定 v3 现有成片（4:46 深空数据流）不再修补，要求全流程重新设计与重做，指定 ds-flash 执行；两项拍板：全流程重做 + 亮色信息密度型。本 change 只做前期（素材库/风格锚点/剧本/分镜/动效规范/机器对账），剧本评审后另立制作 change。详见 shadow-docs/changes/20261114-feature-wuh-site-intro-v3-redesign/brief.md",
      "body": "## 动机\n用户对 v3 现有成片（2026-11-12 CI 版，4:46 / 62 镜 / 深空数据流）的判决是不再修补，而是**重新设计和重做**，且指定本轮由 ds-flash 模型执行。取证（Lead 抽帧走查 2026-11-14）：成片主体近黑，多帧整屏只有几行小字与星点；数据镜把真实数据缩成角落里的小 chip；「科技感」被实现成「空」，信息密度反而低于 v3 首版。v3 首版的原始反馈（截图当主角 / 镜头平庸 / 没有科技感）在科技重构后只解决了「暗」，没解决「内容展示」。\n\n用户两项拍板（2026-11-14）：\n1. **全流程重做**——重采素材 → 新剧本 → 新分镜 → 新视觉 → 新成片，不是视觉层返工；\n2. **亮色信息密度型**——产品发布片气质，大字号数据 / 图表 / 代码为主角，跳出「全黑留白」。\n\n因此本 change 只做**前期重做**（素材库 + 风格锚点 + 剧本 + 分镜 + 动效规范 + 机器对账），剧本与前期定稿后另立 change 进正式制作。时间轴、分镜表、manifest 全部按新叙事重新生成，v3 既有 62 镜与 manifest 不再沿用。\n\n## 引用规范\n- `shadow-docs/knowledge/video-production-flow.md`\n  - 当前结论: 两段式（前期五件套 → 正式制作）；前期含素材库/剧本/分镜/动效规范/资产层；帧数真源唯一、字幕字数硬表、内联预览交付口径\n  - 适用 scope: videos/preprod-wuh-site-intro-v3/, videos/wuh-site-intro-v3/, scripts/\n- `shadow-docs/knowledge/video-studio-structure.md`\n  - 当前结论: 品牌令牌唯一事实源；`shots.mjs` 三件套（import/sync/check）与 strictTransitions/strictAssets 激活规则；分镜组件禁用内联色值字体\n  - 适用 scope: brand/, videos/, scripts/\n- `shadow-docs/knowledge/render-stability-playbook.md`\n  - 当前结论: 渲染一律 GitHub Actions；本机只做静态门与音频 mux\n  - 适用 scope: .github/workflows/, scripts/, public/\n\n## 决策\n- **选型:** 全流程重做 + 亮色信息密度型视觉。新叙事以「站点的真实数字与时间」为骨：七年编年压缩为约 6 幕，正片约 3:10（5700f @30fps，90 BPM 节拍网格），全片约 3:21（FilmShell 片头 150 + 片尾 180）。素材全部重采到 2026-11-14 基准；风格锚点定义浅纸/墨/朱红/数据强调色的完整系统与版式族；分镜按「每镜一个可读信息主体」重写；动效以数据滚动/图表生长/版面切换/动能字幕为主。\n- **对比方案:**\n  - B 只做视觉层返工（保住 62 镜时间轴）——弃：用户明确要重新设计，叙事不换等于换皮。\n  - C 分幕混血（前半纸墨后半科技）——弃：风格断裂，且正是被否定的旧路。\n  - D 沿用 v3 剧本只换视觉——弃：4:46 的信息密度与节奏本身就是问题，重画也救不回。\n- **理由:** 用户已两次在视觉层返工上碰壁（v3 首版、科技重构），问题在叙事密度与视觉语法，不在单个镜头；重新设计 narrative + system 是唯一能同时解决「截图当主角 / 平庸 / 空黑」的路径。前期定稿门 + 制作前 3 镜风格样片门，防止在大规模实装后才发现方向错误。\n\n## 任务\n### Phase 1 素材与风格系统\n- [ ] materials v4（2026-11-14 基准）：站点事实 / git 数据 / 线上 API / 金句 / 衍生项目全量刷新，含 v3→v4 漂移表与新可拍点 — `videos/preprod-wuh-site-intro-v3/assets/materials.md`\n- [ ] style-anchor v2：亮色信息密度视觉系统（色板/字体/版式族/数据可视化语汇/截图证据窗规则/签名点/禁用清单）— `videos/preprod-wuh-site-intro-v3/assets/style-anchor.md`\n- [ ] asset-registry v2（零资产决策）：登记「本片零图片资产、全部 Remotion 矢量与真实数据绘制」，说明数据源与生产期数据文件口径 — `videos/preprod-wuh-site-intro-v3/assets/asset-registry.md`\n\n### Phase 2 剧本（用户定稿门）\n- [ ] script v2：新叙事（片名候选 / 幕结构 / 情绪节奏 / 逐幕文案与金句规划），每处标 materials 编号 — `videos/preprod-wuh-site-intro-v3/assets/script.md`\n- [ ] 用户剧本评审：交付差异化的新叙事 + 时长 + 视觉样例说明，拿到定稿意见 — 评审记录写入本 brief「结果」\n\n### Phase 3 分镜与动效规范\n- [ ] storyboard v2：7 列逐镜表（镜号/时长·帧窗/画面/镜头语言/文案·字幕/转场/尾帧）+ 帧数对账 + 每镜四问自查 — `videos/preprod-wuh-site-intro-v3/assets/storyboard.md`\n- [ ] motion-spec v2：令牌化（曲线/弹性/节奏/版式切换/数据滚动/图表生长/动能字幕/签名点）+ 全镜覆盖矩阵 + 实现基元列 — `videos/preprod-wuh-site-intro-v3/assets/motion-spec.md`\n\n### Phase 4 前期机器对账与交付\n- [ ] `shots.mjs import` 生成新 manifest（帧数唯一真源），对账全绿 — `videos/wuh-site-intro-v3/shots-manifest.json`\n- [ ] `shots.mjs check` 全绿（帧数/字数）+ script↔storyboard 文案逐行对账\n- [ ] 前期定稿：写清制作 change 的输入清单（风格锚点/令牌/资产/镜表）并交用户，下一步另立 production change\n\n## 补充\n用户判定 v3 现有成片（4:46 深空数据流）不再修补，要求全流程重新设计与重做，指定 ds-flash 执行；两项拍板：全流程重做 + 亮色信息密度型。本 change 只做前期（素材库/风格锚点/剧本/分镜/动效规范/机器对账），剧本评审后另立制作 change。详见 shadow-docs/changes/20261114-feature-wuh-site-intro-v3-redesign/brief.md\n\n完整 brief：shadow-docs/changes/20261114-feature-wuh-site-intro-v3-redesign/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261114-feature-wuh-site-intro-v3-redesign\",\"type\":\"feature\",\"scope\":\"videos/preprod-wuh-site-intro-v3,videos/wuh-site-intro-v3,public/wuh-site-intro-v3\",\"status\":\"committed\",\"branch\":\"feature/20261114-feature-wuh-site-intro-v3-redesign\",\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261114-feature-wuh-site-intro-v3-redesign/brief.md\",\"cliVersion\":\"1.9.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    }
  }
}
---

# wuh.site 介绍片 v3 重做：全流程重新设计（亮色信息密度 · 产品发布片方向）

## 动机

用户对 v3 现有成片（2026-11-12 CI 版，4:46 / 62 镜 / 深空数据流）的判决是不再修补，而是**重新设计和重做**，且指定本轮由 ds-flash 模型执行。取证（Lead 抽帧走查 2026-11-14）：成片主体近黑，多帧整屏只有几行小字与星点；数据镜把真实数据缩成角落里的小 chip；「科技感」被实现成「空」，信息密度反而低于 v3 首版。v3 首版的原始反馈（截图当主角 / 镜头平庸 / 没有科技感）在科技重构后只解决了「暗」，没解决「内容展示」。

用户两项拍板（2026-11-14）：
1. **全流程重做**——重采素材 → 新剧本 → 新分镜 → 新视觉 → 新成片，不是视觉层返工；
2. **亮色信息密度型**——产品发布片气质，大字号数据 / 图表 / 代码为主角，跳出「全黑留白」。

因此本 change 只做**前期重做**（素材库 + 风格锚点 + 剧本 + 分镜 + 动效规范 + 机器对账），剧本与前期定稿后另立 change 进正式制作。时间轴、分镜表、manifest 全部按新叙事重新生成，v3 既有 62 镜与 manifest 不再沿用。

## 复杂度评级

- **评级:** L
- **理由:** ① 契约变更：新叙事结构 + 新视觉系统（风格锚点 v2 / 新动效令牌语义），分镜表 `shots.mjs import` 解析契约沿用（7 列 + 尾帧列，不激活资产外键）但全表重建；② 触及面：preprod-wuh-site-intro-v3 五件套全量重写 + `videos/wuh-site-intro-v3/shots-manifest.json` 重建（后续制作 change 重写全部镜文件与装配层）；③ 可发现性：叙事与视觉质量无机器断言，靠剧本/风格评审门 + 成片抽帧走查；帧数/文案/资产可机检。
- **期望验证深度:** unit（本 change：`shots.mjs import`/`check` 全绿 + 文案与帧数对账）；成片验收留给制作 change 的 runtime/field 门。
- **取证策略:** observation

## 领域模型

- **限界上下文:** video-materials — 视频工程与素材的唯一维护地；本 change 在**前期制作**上下文里重做 wuh-site-intro-v3 单元的叙事与视觉规范。上游：站点真实事实（x.wuh.site 源码/线上 API/GitHub）；下游：正式制作 change（镜文件、动效实装、CI 出片）。反腐边界：本 change 不改站点仓库、不做发布排期、不写镜文件。
- **统一语言增量:**
  - **亮色信息密度**：本片视觉基调——浅纸底 + 墨色字 + 朱红点缀 + 一种数据强调色；画面信息密度显著高于 v3（每镜至少一个可读数据/文本主体，禁止整屏空场）。
  - **数据主角**：一切数字/图表/代码/文案本身成为画面主体与运动主体；网站截图只作**证据窗**（小尺寸、短驻留、被推走），禁整屏截图当主角。
  - **签名点**：朱红印章 / 手写「wuh.site」/ 墨点作为跨幕的克制签名元素（首尾必有，中段点缀）。
  - **帧数真源**：`shots-manifest.json` 是唯一帧数机器真源，storyboard 对账表由 `shots.mjs import` 反生成。
- **聚合与不变量:**
  - `INV-1 分镜时间轴`：各幕 Σ durationFrames = 正片 totalFrames，且 manifest 与 storyboard 逐镜帧窗一致；观察点：`node scripts/shots.mjs import --unit wuh-site-intro-v3 && node scripts/shots.mjs check --unit wuh-site-intro-v3`。
  - `INV-2 文案真源`：storyboard 第 5 列逐字照抄 script 定稿字幕，字数须满足 2.5s≤20 / 5s≤40 / 10s≤82 硬表；观察点：`shots.mjs check` 字数项 + 人工逐行对账。
  - `INV-3 素材真实`：画面引用的每个数字/日期/引语必须能在 materials v4（2026-11-14 快照）溯源；观察点：逐镜走查对照 materials 编号。
  - `INV-4 零截图 / 零图片资产`：正片不出现网站截图、书封、页面快照；本片不启用资产外键（分镜表不声明「资产外键」）；观察点：逐镜走查 + `asset-registry.md` 零资产登记。
  - `INV-5 用户定稿门`：script 未经用户评审通过不得进分镜；分镜/动效定稿后方可另立制作 change；观察点：brief 评审记录段。
- **领域事件:** 剧本评审通过 → 分镜与动效规范产出 → `import`/`check` 全绿 → 前期定稿，制作 change 立项。

## 引用规范

- `shadow-docs/knowledge/video-production-flow.md`
  - 当前结论: 两段式（前期五件套 → 正式制作）；前期含素材库/剧本/分镜/动效规范/资产层；帧数真源唯一、字幕字数硬表、内联预览交付口径
  - 适用 scope: videos/preprod-wuh-site-intro-v3/, videos/wuh-site-intro-v3/, scripts/
- `shadow-docs/knowledge/video-studio-structure.md`
  - 当前结论: 品牌令牌唯一事实源；`shots.mjs` 三件套（import/sync/check）与 strictTransitions/strictAssets 激活规则；分镜组件禁用内联色值字体
  - 适用 scope: brand/, videos/, scripts/
- `shadow-docs/knowledge/render-stability-playbook.md`
  - 当前结论: 渲染一律 GitHub Actions；本机只做静态门与音频 mux
  - 适用 scope: .github/workflows/, scripts/, public/

## 决策

- **选型:** 全流程重做 + 亮色信息密度型视觉。新叙事以「站点的真实数字与时间」为骨：七年编年压缩为约 6 幕，正片约 3:10（5700f @30fps，90 BPM 节拍网格），全片约 3:21（FilmShell 片头 150 + 片尾 180）。素材全部重采到 2026-11-14 基准；风格锚点定义浅纸/墨/朱红/数据强调色的完整系统与版式族；分镜按「每镜一个可读信息主体」重写；动效以数据滚动/图表生长/版面切换/动能字幕为主。
- **对比方案:**
  - B 只做视觉层返工（保住 62 镜时间轴）——弃：用户明确要重新设计，叙事不换等于换皮。
  - C 分幕混血（前半纸墨后半科技）——弃：风格断裂，且正是被否定的旧路。
  - D 沿用 v3 剧本只换视觉——弃：4:46 的信息密度与节奏本身就是问题，重画也救不回。
- **理由:** 用户已两次在视觉层返工上碰壁（v3 首版、科技重构），问题在叙事密度与视觉语法，不在单个镜头；重新设计 narrative + system 是唯一能同时解决「截图当主角 / 平庸 / 空黑」的路径。前期定稿门 + 制作前 3 镜风格样片门，防止在大规模实装后才发现方向错误。

## 用户评审记录（2026-11-14）

用户对前期方案四项拍板（全部一次通过，不返工）：

1. **片名**：A《七年，一座站》（副题 `wuh.site · 2019 → 2026`）
2. **片长与结构**：3:21（正片 3:10 / 5700f）+ 六幕 + 冷开场，接受比旧版 4:46 压缩
3. **声音**：无配音，字幕即画面（动能排版）
4. **第五幕诚实时刻**：保留（上周合并 9 个 PR、访问统计重做：10,760 → 近 90 天 5,440，从此口径可解释）

评审依据：`script.md` v2 + `style-anchor.md` v2（亮色信息密度、站点同源色板/字体/语汇、零网站截图）。

## 任务

### Phase 1 素材与风格系统
- [x] materials v4（2026-11-14 基准）：站点事实 / git 数据 / 线上 API / 金句 / 衍生项目全量刷新，含 v3→v4 漂移表与新可拍点 — `videos/preprod-wuh-site-intro-v3/assets/materials.md`
- [x] style-anchor v2：亮色信息密度视觉系统（色板/字体/版式族/数据可视化语汇/截图证据窗规则/签名点/禁用清单）— `videos/preprod-wuh-site-intro-v3/assets/style-anchor.md`
- [x] asset-registry v2（零资产决策）：登记「本片零图片资产、全部 Remotion 矢量与真实数据绘制」，说明数据源与生产期数据文件口径 — `videos/preprod-wuh-site-intro-v3/assets/asset-registry.md`

### Phase 2 剧本（用户定稿门）
- [x] script v2：新叙事（片名候选 / 幕结构 / 情绪节奏 / 逐幕文案与金句规划），每处标 materials 编号 — `videos/preprod-wuh-site-intro-v3/assets/script.md`
- [x] 用户剧本评审：交付差异化的新叙事 + 时长 + 视觉样例说明，拿到定稿意见 — 评审记录写入本 brief「结果」

### Phase 3 分镜与动效规范
- [ ] storyboard v2：7 列逐镜表（镜号/时长·帧窗/画面/镜头语言/文案·字幕/转场/尾帧）+ 帧数对账 + 每镜四问自查 — `videos/preprod-wuh-site-intro-v3/assets/storyboard.md`
- [ ] motion-spec v2：令牌化（曲线/弹性/节奏/版式切换/数据滚动/图表生长/动能字幕/签名点）+ 全镜覆盖矩阵 + 实现基元列 — `videos/preprod-wuh-site-intro-v3/assets/motion-spec.md`

### Phase 4 前期机器对账与交付
- [ ] `shots.mjs import` 生成新 manifest（帧数唯一真源），对账全绿 — `videos/wuh-site-intro-v3/shots-manifest.json`
- [ ] `shots.mjs check` 全绿（帧数/字数）+ script↔storyboard 文案逐行对账
- [ ] 前期定稿：写清制作 change 的输入清单（风格锚点/令牌/资产/镜表）并交用户，下一步另立 production change

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/video-production-flow.md`（「用户否决式重做」的判定口径：视觉层返工两次仍失败 → 换叙事与视觉系统；前期先出 3 镜风格样片门再铺全量）
- **理由:** 这是同一单元第三次返工，第一次从「视觉层修」升级为「叙事层重做」，其流程判据值得沉淀；本 change 只做前期，验证深度不升级卡片（待制作 change 成片后复核）
