---
{
  "schema": "shadow-dev/v1",
  "name": "20261110-feature-wuh-site-intro-v3-tech-restyle",
  "type": "feature",
  "scope": "videos/wuh-site-intro-v3,public/wuh-site-intro-v3",
  "status": "committed",
  "baseBranch": "feature/20261109-feature-wuh-site-intro-v3-production",
  "branch": "feature/20261110-feature-wuh-site-intro-v3-tech-restyle",
  "files": [
    "brand/motion.ts",
    "public/wuh-site-intro-v3",
    "videos/wuh-site-intro-v3/components/ShotShell.tsx",
    "videos/wuh-site-intro-v3/motion-tokens.ts",
    "videos/wuh-site-intro-v3/shots",
    "videos/wuh-site-intro-v3/style-anchor.md"
  ],
  "github": {
    "repository": "stack-wuh/wuh.site.video",
    "issue": 61,
    "issueUrl": "https://github.com/stack-wuh/wuh.site.video/issues/61",
    "pullRequest": 62,
    "pullRequestUrl": "https://github.com/stack-wuh/wuh.site.video/pull/62"
  },
  "review": {
    "conclusion": "pending",
    "verifiedCommit": null,
    "verifiedAt": null
  },
  "workflow": {
    "operation": null,
    "checkpoint": "3287ae158e068e6ee4d26c5a5cbeab76e15e235f",
    "planHash": "70c3ec06ae98d5b65cbc7ad613cc938aaecb74914993c13343cf72ef5d166b8b",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] v3 科技感重构：年度报告数据流风格 · 62 镜视觉层重实装 · 科技 BGM",
      "titleRaw": "[feature] v3 科技感重构：年度报告数据流风格 · 62 镜视觉层重实装 · 科技 BGM",
      "supplement": "用户成片评审两条风格级反馈（截图当主角/无科技感），四项拍板：全片科技重构 / 年度报告数据流 / 手作签名点保留 / BGM 同步换。时间轴真源（62 镜帧窗/字幕/旁白）不动，返工集中在视觉内容层；先出三镜风格样片（s01/s33/s45）过用户定稿门再铺全量。详见 shadow-docs/changes/20261110-feature-wuh-site-intro-v3-tech-restyle/brief.md",
      "body": "## 动机\nv3 首版成片（run 42658009864，2026-11-09）用户评审两条风格级反馈：①「太依赖网站的布局，全在截网站的图——我需要的是数据展示、内容的展示」；②「镜头太平庸，没有科技感」。取证：19/62 镜直接引站点截图；数据镜也长着网页的样子（s45「1,842」整屏网站截图、数据缩在角落小 chip；ConsolePanel/ExpandWindow 全是仿真浏览器窗）；视觉基座为米色纸墨+印章+大面积黑场，无辉光/网格/粒子/等宽大数字任何科技元素。用户四项拍板（2026-11-10）：**A 全片科技重构 / 年度报告数据流参照 / 手作签名点保留 / BGM 同步换科技曲目**。\n\n时间轴层完全不动：manifest 62 镜帧窗、字幕、旁白对位、90 BPM 网格全保留——返工集中在视觉内容层（镜文件重写 + GRADES/ShotShell/令牌换底），一镜一文件 + CI 并行重渲。\n\n## 引用规范\n- `shadow-docs/knowledge/video-production-flow.md`\n  - 当前结论: 第二段镜级契约 + CI 渲染 + 三重终验 + 内联预览页交付口径\n  - 适用 scope: videos/wuh-site-intro-v3/, public/wuh-site-intro-v3/\n- `shadow-docs/knowledge/render-stability-playbook.md`\n  - 当前结论: 本机不渲；CI 矩阵抖动兜底；CFR 终装\n  - 适用 scope: .github/workflows/, scripts/\n\n## 决策\n- **选型:** 全片换「深空数据流」科技语言（年度报告数据流参照：深色底、多图表同屏生长、时间线流动、高信息密度、数据洪流感）+ 手作签名点克制保留（印章落款/墨点/手写体作全片签名）+ BGM 同步换科技 CC-BY 曲目（电子/氛围类，多轨对拍口径不变）；网站截图降级为证据快闪；数据全屏主角化（大号等宽数字滚动/SLAM、图表生长、kinetic typography）；复用新整合官方基元（spring/noise 场/motion-blur/inkDraw/辉光）\n- **对比方案:** B 分幕混血（Act1-2 纸墨 Act3-8 科技——风格断裂风险，弃）；C 只改语法不动风格（科技感诉求不满足，弃）\n- **理由:** 用户成片评审明确两条诉求；时间轴真源保留使返工集中在视觉层；官方基元层同日落地正好为科技语言供给弹药\n\n## 任务\n### Phase 1 风格系统（深度空数据流基调）\n- [ ] style-anchor v2：深空数据流风格块（媒介/镜头/光线/调色）+ 手作签名点规则 + 证据快闪口径 — `videos/wuh-site-intro-v3/style-anchor.md`\n- [ ] motion-spec v2 增量：科技令牌（BIG-NUMBER 全屏滚动/HUD-CHROME 角标刻度/GLOW-GRID 网格辉光/CHART-FLOW 多图表同屏/TIMELINE-FLOW/DATA-STREAM 数据洪流/SIGNATURE 手作签名点/PROOF-FLASH 证据快闪）+ 全镜覆盖矩阵重排 — `videos/wuh-site-intro-v3/`（motion-spec 登记于 shadow-docs change 目录）\n- [ ] GRADES 深空八幕调色重定义 + ShotShell 换底（近黑深空 + 星点粒子场 noise + 微网格）+ brand tech tokens（辉光/扫描线/等宽大数字基元）— `videos/wuh-site-intro-v3/motion-tokens.ts`, `videos/wuh-site-intro-v3/components/ShotShell.tsx`, `brand/motion.ts`\n\n### Phase 2 风格样片（用户定稿门）\n- [ ] 三镜样片重实装：s01（开场定调）/ s33（书架→数据洪流）/ s45（1,842 全屏大数字主角化，网站截图退为证据快闪）— `videos/wuh-site-intro-v3/shots/`\n- [ ] typecheck + shots check 绿 → CI 单镜渲（shots 子集 s01 s33 s45）→ 抽帧预览交用户定稿 — 拍板后才进 Phase 3\n\n### Phase 3 全量 62 镜批次重实装（按幕并行 subagent，样片风格为基准）\n- [ ] 批次 A1+A2（镜 1–11）— `videos/wuh-site-intro-v3/shots/`\n- [ ] 批次 A3+A4（镜 12–24）— `videos/wuh-site-intro-v3/shots/`\n- [ ] 批次 A5+A6（镜 25–38）— `videos/wuh-site-intro-v3/shots/`\n- [ ] 批次 A7+A8（镜 39–62）— `videos/wuh-site-intro-v3/shots/`\n\n### Phase 4 BGM 科技化 + 音轨\n- [ ] 科技 CC-BY 曲目选编（电子/氛围，多轨交叉淡化对拍 90 BPM 口径）+ 署名清单 — `public/wuh-site-intro-v3/`\n\n### Phase 5 出片与评审\n- [ ] CI render-film 全片 → 三重终验 → 内联预览页交用户评审 — 单镜返工走 shots 子集\n\n## 补充\n用户成片评审两条风格级反馈（截图当主角/无科技感），四项拍板：全片科技重构 / 年度报告数据流 / 手作签名点保留 / BGM 同步换。时间轴真源（62 镜帧窗/字幕/旁白）不动，返工集中在视觉内容层；先出三镜风格样片（s01/s33/s45）过用户定稿门再铺全量。详见 shadow-docs/changes/20261110-feature-wuh-site-intro-v3-tech-restyle/brief.md\n\n完整 brief：shadow-docs/changes/20261110-feature-wuh-site-intro-v3-tech-restyle/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261110-feature-wuh-site-intro-v3-tech-restyle\",\"type\":\"feature\",\"scope\":\"videos/wuh-site-intro-v3,public/wuh-site-intro-v3\",\"status\":\"branched\",\"branch\":\"feature/20261110-feature-wuh-site-intro-v3-tech-restyle\",\"baseBranch\":\"feature/20261109-feature-wuh-site-intro-v3-production\",\"briefPath\":\"shadow-docs/changes/20261110-feature-wuh-site-intro-v3-tech-restyle/brief.md\",\"cliVersion\":\"1.9.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    },
    "commit": {
      "files": [
        ".github/workflows/render-film.yml"
      ],
      "message": "ci(video): 镜作业超时 15→30 分钟——FX 解禁层（146 书脊/365 格/粒子系统）单镜渲染时长顶穿旧上限，三次 15 分钟整点被掐实证"
    }
  }
}
---

# wuh.site 介绍片 v3 科技感重构：年度报告数据流风格 · 62 镜视觉层重实装 · 科技 BGM

## 动机

v3 首版成片（run 42658009864，2026-11-09）用户评审两条风格级反馈：①「太依赖网站的布局，全在截网站的图——我需要的是数据展示、内容的展示」；②「镜头太平庸，没有科技感」。取证：19/62 镜直接引站点截图；数据镜也长着网页的样子（s45「1,842」整屏网站截图、数据缩在角落小 chip；ConsolePanel/ExpandWindow 全是仿真浏览器窗）；视觉基座为米色纸墨+印章+大面积黑场，无辉光/网格/粒子/等宽大数字任何科技元素。用户四项拍板（2026-11-10）：**A 全片科技重构 / 年度报告数据流参照 / 手作签名点保留 / BGM 同步换科技曲目**。

时间轴层完全不动：manifest 62 镜帧窗、字幕、旁白对位、90 BPM 网格全保留——返工集中在视觉内容层（镜文件重写 + GRADES/ShotShell/令牌换底），一镜一文件 + CI 并行重渲。

## 复杂度评级

- **评级:** L
- **理由:** ① 契约变更：风格锚点 v2（深空数据流）+ GRADES 八幕调色重定义 + ShotShell 换底 + 科技令牌增量；② 触及面：videos/wuh-site-intro-v3/ 62 镜全量重写 + brand 层令牌 + public BGM 曲目更换；③ 可发现性：镜级契约（局部帧 0 起/自包含/确定性）全部沿用，新增科技令牌词汇需登记
- **期望验证深度:** runtime（CI 出片 + 抽帧走查 + 三重终验 + 内联预览页评审）
- **取证策略:** observation

## 领域模型

- **限界上下文:** video-materials 正式制作（v3 单元）——把定稿叙事渲染成片。上游：前期五件套（剧本/分镜/动效规范）；下游：CI render-film 出片 + 内联预览页评审。反腐边界：本上下文不改叙事层（帧窗/字幕/旁白真源），只做视觉执行。
- **统一语言增量:** 深空数据流（本片视觉基调：近黑深空底+多图表同屏生长+时间线流动+数据洪流）；手作签名点（印章/墨点/手写体作为科技外壳内的全片签名元素）；证据快闪（网站截图降级为 1–2s 辉光小窗证据，禁整屏主角）
- **聚合与不变量:**
  - `INV-1 时间轴真源`：Σ durationFrames = 8260 = film comp 时长；镜窗/字幕/旁白对位与既有 manifest 一致；观察点：`node scripts/shots.mjs check`（INV-S1/S2/S6 绿）
  - `INV-2 镜级契约`：一镜一文件、局部帧 0 起、自包含、确定性（random(seed)，禁 Date.now/Math.random）、无 `<Audio>`；观察点：typecheck 0 错 + 渲染 nb_frames = durationFrames
  - `INV-3 数据主角化`：无整屏网站截图当主角的镜；网站截图只作证据快闪（≤2s 辉光小窗）或退场；观察点：逐镜走查清单（62 镜画面描述对照）
  - `INV-4 手作签名点`：印章/墨点/手写「wuh.site」作为签名元素全片克制存在（首尾必有、中段点缀）；观察点：抽帧走查
- **领域事件:** 风格样片（s01/s33/s45）CI 渲出 → 用户定稿门 → 全量 62 镜铺开；定稿门不过则回 Phase 1 调风格系统（不在错误风格上烧 62 镜工时）

## 引用规范

- `shadow-docs/knowledge/video-production-flow.md`
  - 当前结论: 第二段镜级契约 + CI 渲染 + 三重终验 + 内联预览页交付口径
  - 适用 scope: videos/wuh-site-intro-v3/, public/wuh-site-intro-v3/
- `shadow-docs/knowledge/render-stability-playbook.md`
  - 当前结论: 本机不渲；CI 矩阵抖动兜底；CFR 终装
  - 适用 scope: .github/workflows/, scripts/

## 决策

- **选型:** 全片换「深空数据流」科技语言（年度报告数据流参照：深色底、多图表同屏生长、时间线流动、高信息密度、数据洪流感）+ 手作签名点克制保留（印章落款/墨点/手写体作全片签名）+ BGM 同步换科技 CC-BY 曲目（电子/氛围类，多轨对拍口径不变）；网站截图降级为证据快闪；数据全屏主角化（大号等宽数字滚动/SLAM、图表生长、kinetic typography）；复用新整合官方基元（spring/noise 场/motion-blur/inkDraw/辉光）
- **对比方案:** B 分幕混血（Act1-2 纸墨 Act3-8 科技——风格断裂风险，弃）；C 只改语法不动风格（科技感诉求不满足，弃）
- **理由:** 用户成片评审明确两条诉求；时间轴真源保留使返工集中在视觉层；官方基元层同日落地正好为科技语言供给弹药

## 任务

### Phase 1 风格系统（深度空数据流基调）
- [ ] style-anchor v2：深空数据流风格块（媒介/镜头/光线/调色）+ 手作签名点规则 + 证据快闪口径 — `videos/wuh-site-intro-v3/style-anchor.md`
- [ ] motion-spec v2 增量：科技令牌（BIG-NUMBER 全屏滚动/HUD-CHROME 角标刻度/GLOW-GRID 网格辉光/CHART-FLOW 多图表同屏/TIMELINE-FLOW/DATA-STREAM 数据洪流/SIGNATURE 手作签名点/PROOF-FLASH 证据快闪）+ 全镜覆盖矩阵重排 — `videos/wuh-site-intro-v3/`（motion-spec 登记于 shadow-docs change 目录）
- [ ] GRADES 深空八幕调色重定义 + ShotShell 换底（近黑深空 + 星点粒子场 noise + 微网格）+ brand tech tokens（辉光/扫描线/等宽大数字基元）— `videos/wuh-site-intro-v3/motion-tokens.ts`, `videos/wuh-site-intro-v3/components/ShotShell.tsx`, `brand/motion.ts`

### Phase 2 风格样片（用户定稿门）
- [ ] 三镜样片重实装：s01（开场定调）/ s33（书架→数据洪流）/ s45（1,842 全屏大数字主角化，网站截图退为证据快闪）— `videos/wuh-site-intro-v3/shots/`
- [ ] typecheck + shots check 绿 → CI 单镜渲（shots 子集 s01 s33 s45）→ 抽帧预览交用户定稿 — 拍板后才进 Phase 3

### Phase 3 全量 62 镜批次重实装（按幕并行 subagent，样片风格为基准）
- [ ] 批次 A1+A2（镜 1–11）— `videos/wuh-site-intro-v3/shots/`
- [ ] 批次 A3+A4（镜 12–24）— `videos/wuh-site-intro-v3/shots/`
- [ ] 批次 A5+A6（镜 25–38）— `videos/wuh-site-intro-v3/shots/`
- [ ] 批次 A7+A8（镜 39–62）— `videos/wuh-site-intro-v3/shots/`

### Phase 4 BGM 科技化 + 音轨
- [ ] 科技 CC-BY 曲目选编（电子/氛围，多轨交叉淡化对拍 90 BPM 口径）+ 署名清单 — `public/wuh-site-intro-v3/`

### Phase 5 出片与评审
- [ ] CI render-film 全片 → 三重终验 → 内联预览页交用户评审 — 单镜返工走 shots 子集

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/video-production-flow.md`（风格级返工的时间轴真源保留口径：视觉层重构不触碰 manifest/字幕/旁白）
- **理由:** 首次风格轴返工实证；样片定稿门挡住 62 镜规模返工风险的流程价值
