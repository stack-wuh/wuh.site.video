---
{
  "schema": "shadow-dev/v1",
  "name": "20261109-feature-wuh-site-intro-v3-production",
  "type": "feature",
  "scope": "video-materials",
  "status": "committed",
  "baseBranch": "main",
  "branch": "feature/20261109-feature-wuh-site-intro-v3-production",
  "files": [
    ".github/workflows/render-film.yml",
    "public/wuh-site-intro-v3",
    "src/Root.tsx",
    "videos/preprod-wuh-site-intro-v3",
    "videos/wuh-site-intro-v3"
  ],
  "github": {
    "repository": "stack-wuh/wuh.site.video",
    "issue": 60,
    "issueUrl": "https://github.com/stack-wuh/wuh.site.video/issues/60",
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
    "checkpoint": "64707e65818435f8e7034240c04832d50df3364a",
    "planHash": "bd9393aca87aa3ff0d36eebc7f87c92d363b1741f6612a594803a0ca2d18b3e8",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] wuh.site 介绍片 v3 正式制作：62 镜逐镜实装 · 配乐多轨 · CI 渲染出片",
      "titleRaw": "[feature] wuh.site 介绍片 v3 正式制作：62 镜逐镜实装 · 配乐多轨 · CI 渲染出片",
      "supplement": "前期（PR #59）已交付五件套与 animatic；用户裁定跳过 animatic 定稿门直进成片。本 change 执行第二段：motion-tokens 123 令牌落地 → 62 镜一镜一文件按幕并行实装（真实截图镜 staticFile 打底 + 数据令牌凡量必滚）→ BGM 复用 v2 CC-BY 多轨 90 BPM → CI render-film 出片 → 内联预览页交用户成片评审。详见 shadow-docs/changes/20261109-feature-wuh-site-intro-v3-production/brief.md",
      "body": "## 动机\n前期 change（PR #59 已合入）已交付全部前期五件套：剧本定稿候选（44 条字幕 / 八幕骨架 / 8-5 最近日志新镜）、分镜 62 镜严格九列 schema（import 全绿，`shots-manifest.json` 帧数机器真源）、动效规范 123 令牌（覆盖矩阵 62×4、转场与分镜零偏差、凡量必滚 17 行）、站点真实素材资产层（S01–S12 + 6 P 型全入库）、animatic CI 出片（run 42506743502）。用户裁定跳过 animatic 定稿门（「先做完成片，我再看」），叙事层意见后移至成片评审。本 change 执行第二段：令牌库先行 → 62 镜逐镜实装（一镜一文件、多 agent 按幕并行）→ 配乐多轨 → CI 渲染出片 → 内联预览页交用户评审。\n\n## 引用规范\n- `shadow-docs/knowledge/video-production-flow.md`\n  - 当前结论: 第二段 = 令牌库先行 → 逐镜实装（一镜一文件、局部帧 0 起、自包含、不透明底、转场挂出镜尾帧+交接态）→ 装配层只做 manifest 遍历 + ShotShell + 音轨 → CI 渲染（--ref 必带）→ 三重终验；数据动效令牌必备（凡量必滚）；渲染只走 CI\n  - 适用 scope: videos/, public/, src/Root.tsx, .github/workflows/\n- `shadow-docs/knowledge/video-studio-structure.md`\n  - 当前结论: 单元自包含；staticFile 以 public/ 为根；组件零内联色值引 brand/tokens；渲染依赖必进 git\n  - 适用 scope: videos/, public/, brand/\n- `shadow-docs/knowledge/render-stability-playbook.md`\n  - 当前结论: 本机不渲；CI 矩阵抖动兜底（rerun failed / -f shots 子集 / 逐镜 artifact 本地 concat）；出片三重验证；CFR 终装\n  - 适用 scope: .github/workflows/, scripts/\n\n## 决策\n- **选型:** 逐镜实装按 v2 生产契约 + v3 motion-spec 双材质令牌：62 镜一镜一文件（局部帧 0 起、自包含、不透明底、确定性、无 Audio）；真实截图镜经 `staticFile` 引 `public/wuh-site-intro-v3/site/*-v1.png`（版本号进文件名，换图必改引用）；数据镜落 motion-spec 数据令牌（NUM-ROLL/ODOMETER/SLAM/CHART-GROW/CHART-DRAW/ZERO-HOLD/DOT-CASCADE）；多 agent 按幕切片并行实装（A1+A2 / A3+A4 / A5+A6 / A7+A8，零共享状态，禁本机渲染）；BGM 复用 v2 已入库 CC-BY 曲目（同族一致性 + 署名清单延续）；90 BPM 对拍\n- **对比方案:** A 图生视频氛围镜引入（用户已裁定 AI 生图整体不接，弃）；B 单 agent 串行实装（62 镜串行工时不可接受，弃）；C BGM 重选曲（无必要，v2 曲目即家族基调，弃）\n- **理由:** shot-spec 镜级契约 + 镜级缓存使单镜可独立重渲；多 agent 并行有 v2/zhi-guo-xiang 两次实证；BGM 复用降低交付链路风险\n\n## 任务\n### Phase 1 令牌库与装配骨架\n- [ ] motion-tokens.ts：motion-spec 123 令牌落地（v2 motion-tokens 承接 + 窗语汇 5 + 数据令牌 8 + 高频函数增量） — `videos/wuh-site-intro-v3/motion-tokens.ts`\n- [ ] 装配层与音轨骨架：WuhSiteIntroV3.tsx（manifest 遍历 + ShotShell + FilmShell intro=150 对齐 film.config）+ WuhSiteIntroV3Audio.tsx（90 BPM 多轨交叉淡化，BGM 复用 v2）+ film.config.json — `videos/wuh-site-intro-v3/`\n- [ ] `shots.mjs sync` 生成 manifest.ts / registry.ts / routes.tsx + Root 注册 + render-film.yml film 选项增补 — `videos/wuh-site-intro-v3/`, `src/Root.tsx`, `.github/workflows/render-film.yml`\n\n### Phase 2 逐镜实装（62 镜，按幕并行）\n- [ ] A1+A2（镜 1–11）— `videos/wuh-site-intro-v3/shots/`\n- [ ] A3+A4（镜 12–24）— `videos/wuh-site-intro-v3/shots/`\n- [ ] A5+A6（镜 25–38）— `videos/wuh-site-intro-v3/shots/`\n- [ ] A7+A8（镜 39–62）— `videos/wuh-site-intro-v3/shots/`\n\n### Phase 3 渲染出片与评审\n- [ ] lint/typecheck/check 全绿 → push → CI render-film（--ref 分支）→ 三重终验（ffprobe 帧数 / 两路时长 / 音量）\n- [ ] 内联预览页（镜中点抽帧 + 全量元数据）交用户成片评审；评审意见按镜收取，单镜返工走 shots 子集重渲\n\n## 补充\n前期（PR #59）已交付五件套与 animatic；用户裁定跳过 animatic 定稿门直进成片。本 change 执行第二段：motion-tokens 123 令牌落地 → 62 镜一镜一文件按幕并行实装（真实截图镜 staticFile 打底 + 数据令牌凡量必滚）→ BGM 复用 v2 CC-BY 多轨 90 BPM → CI render-film 出片 → 内联预览页交用户成片评审。详见 shadow-docs/changes/20261109-feature-wuh-site-intro-v3-production/brief.md\n\n完整 brief：shadow-docs/changes/20261109-feature-wuh-site-intro-v3-production/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261109-feature-wuh-site-intro-v3-production\",\"type\":\"feature\",\"scope\":\"video-materials\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261109-feature-wuh-site-intro-v3-production/brief.md\",\"cliVersion\":\"1.9.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    },
    "commit": {
      "files": [
        "brand/motion.ts",
        "package.json",
        "pnpm-lock.yaml",
        "shadow-docs/changes/20261109-feature-wuh-site-intro-v3-production/brief.md",
        "videos/wuh-site-intro-v3/motion-tokens.ts",
        "videos/wuh-site-intro-v3/shots/s14.tsx",
        "videos/wuh-site-intro-v3/shots/s18.tsx",
        "videos/wuh-site-intro-v3/shots/s19.tsx",
        "videos/wuh-site-intro-v3/shots/s20.tsx",
        "videos/wuh-site-intro-v3/shots/s29.tsx",
        "videos/wuh-site-intro-v3/shots/s31.tsx",
        "videos/wuh-site-intro-v3/shots/s51.tsx",
        "videos/wuh-site-intro-v3/shots/s54.tsx",
        "videos/wuh-site-intro-v3/shots/s55.tsx",
        "videos/wuh-site-intro-v3/shots/s56.tsx",
        "videos/wuh-site-intro-v3/shots/s57.tsx",
        "videos/wuh-site-intro-v3/shots/s58.tsx",
        "videos/wuh-site-intro-v3/shots/s59.tsx"
      ],
      "message": "feat(video-materials): Remotion 官方基元层整合——9 包钉 4.0.538 + 描画引擎真长度化\n\n- @remotion/{paths,noise,motion-blur,shapes,transitions,three,captions,sfx,rough-notation}@4.0.538 钉死 + @react-three/fiber 9.8.2\n- brand/motion 官方基元层：inkDraw/handheld/driftAngle/springEnter/TRANS（转场曲线两侧镜像，交接态协议不动）\n- pathDraw/chartCut/treeGrow 第 4 参改收路径 d：真长度驱动，13 处硬编码 dasharray 清零（猜大=起步死区+变速扭曲）\n- 顺修 HEAD 既有 typecheck 红（s14/s29 CSSProperties 可选字段算术）\n- 用户四项拍板：子包全量/协议不动+令牌吸收/three 先行+Blender 契约先行/v3 一并升级（技能 remotion-capabilities.md 同日落地）"
    }
  }
}
---

# wuh.site 介绍片 v3 正式制作：62 镜逐镜实装 · 配乐多轨 · CI 渲染出片

## 动机

前期 change（PR #59 已合入）已交付全部前期五件套：剧本定稿候选（44 条字幕 / 八幕骨架 / 8-5 最近日志新镜）、分镜 62 镜严格九列 schema（import 全绿，`shots-manifest.json` 帧数机器真源）、动效规范 123 令牌（覆盖矩阵 62×4、转场与分镜零偏差、凡量必滚 17 行）、站点真实素材资产层（S01–S12 + 6 P 型全入库）、animatic CI 出片（run 42506743502）。用户裁定跳过 animatic 定稿门（「先做完成片，我再看」），叙事层意见后移至成片评审。本 change 执行第二段：令牌库先行 → 62 镜逐镜实装（一镜一文件、多 agent 按幕并行）→ 配乐多轨 → CI 渲染出片 → 内联预览页交用户评审。

## 复杂度评级

- **评级:** M
- **理由:** ① 契约变更：新增成片单元（film.config.json + 装配层 + 音轨 comp）与 Root 注册、render-film.yml film 选项增补；既有单元契约不动；② 触及面：`videos/wuh-site-intro-v3/`（shots 62 文件 + tokens + 装配 + audio）+ `public/wuh-site-intro-v3/`（BGM 复用 v2 CC-BY 曲目）；③ 可发现性：词汇全部沿用（令牌名/镜文件命名/装配契约 = shot-spec 现行）
- **期望验证深度:** runtime（CI render-film 全矩阵绿；ffprobe 帧数 = film.config 壳 + manifest；抽帧走查；内联预览页交付）
- **取证策略:** observation

## 引用规范

- `shadow-docs/knowledge/video-production-flow.md`
  - 当前结论: 第二段 = 令牌库先行 → 逐镜实装（一镜一文件、局部帧 0 起、自包含、不透明底、转场挂出镜尾帧+交接态）→ 装配层只做 manifest 遍历 + ShotShell + 音轨 → CI 渲染（--ref 必带）→ 三重终验；数据动效令牌必备（凡量必滚）；渲染只走 CI
  - 适用 scope: videos/, public/, src/Root.tsx, .github/workflows/
- `shadow-docs/knowledge/video-studio-structure.md`
  - 当前结论: 单元自包含；staticFile 以 public/ 为根；组件零内联色值引 brand/tokens；渲染依赖必进 git
  - 适用 scope: videos/, public/, brand/
- `shadow-docs/knowledge/render-stability-playbook.md`
  - 当前结论: 本机不渲；CI 矩阵抖动兜底（rerun failed / -f shots 子集 / 逐镜 artifact 本地 concat）；出片三重验证；CFR 终装
  - 适用 scope: .github/workflows/, scripts/

## 决策

- **选型:** 逐镜实装按 v2 生产契约 + v3 motion-spec 双材质令牌：62 镜一镜一文件（局部帧 0 起、自包含、不透明底、确定性、无 Audio）；真实截图镜经 `staticFile` 引 `public/wuh-site-intro-v3/site/*-v1.png`（版本号进文件名，换图必改引用）；数据镜落 motion-spec 数据令牌（NUM-ROLL/ODOMETER/SLAM/CHART-GROW/CHART-DRAW/ZERO-HOLD/DOT-CASCADE）；多 agent 按幕切片并行实装（A1+A2 / A3+A4 / A5+A6 / A7+A8，零共享状态，禁本机渲染）；BGM 复用 v2 已入库 CC-BY 曲目（同族一致性 + 署名清单延续）；90 BPM 对拍
- **对比方案:** A 图生视频氛围镜引入（用户已裁定 AI 生图整体不接，弃）；B 单 agent 串行实装（62 镜串行工时不可接受，弃）；C BGM 重选曲（无必要，v2 曲目即家族基调，弃）
- **理由:** shot-spec 镜级契约 + 镜级缓存使单镜可独立重渲；多 agent 并行有 v2/zhi-guo-xiang 两次实证；BGM 复用降低交付链路风险

## 任务

### Phase 1 令牌库与装配骨架
- [ ] motion-tokens.ts：motion-spec 123 令牌落地（v2 motion-tokens 承接 + 窗语汇 5 + 数据令牌 8 + 高频函数增量） — `videos/wuh-site-intro-v3/motion-tokens.ts`
- [ ] 装配层与音轨骨架：WuhSiteIntroV3.tsx（manifest 遍历 + ShotShell + FilmShell intro=150 对齐 film.config）+ WuhSiteIntroV3Audio.tsx（90 BPM 多轨交叉淡化，BGM 复用 v2）+ film.config.json — `videos/wuh-site-intro-v3/`
- [ ] `shots.mjs sync` 生成 manifest.ts / registry.ts / routes.tsx + Root 注册 + render-film.yml film 选项增补 — `videos/wuh-site-intro-v3/`, `src/Root.tsx`, `.github/workflows/render-film.yml`

### Phase 2 逐镜实装（62 镜，按幕并行）
- [ ] A1+A2（镜 1–11）— `videos/wuh-site-intro-v3/shots/`
- [ ] A3+A4（镜 12–24）— `videos/wuh-site-intro-v3/shots/`
- [ ] A5+A6（镜 25–38）— `videos/wuh-site-intro-v3/shots/`
- [ ] A7+A8（镜 39–62）— `videos/wuh-site-intro-v3/shots/`

### Phase 3 渲染出片与评审
- [ ] lint/typecheck/check 全绿 → push → CI render-film（--ref 分支）→ 三重终验（ffprobe 帧数 / 两路时长 / 音量）
- [ ] 内联预览页（镜中点抽帧 + 全量元数据）交用户成片评审；评审意见按镜收取，单镜返工走 shots 子集重渲

## 范围扩充（2026-11-10，用户四项拍板：Remotion 能力整合）

调研结论：v3 动效只用了 Remotion 的「帧循环 + interpolate」（279 处）——spring 0 处、`@remotion/*` 子包 0 个、SVG 描画全靠猜路径长度（13 处硬编码 dasharray，猜大必歪：起步死区+变速扭曲）。整合四项决策：

1. **子包全量引入**（钉 4.0.538 无 ^）：paths / noise / motion-blur / shapes / transitions / three / captions / sfx / rough-notation + @react-three/fiber 9.8.2
2. **跨镜转场协议不动**：交接态协议保持（shot-spec §3 规则 4），官方 presentation 曲线以两侧镜像令牌吸收（brand/motion `TRANS`）；TransitionSeries 仅限镜内多场景
3. **3D 路线 three 先行**：R3F 就绪即可用（CI 实证先例 = zhi-guo-xiang InkStage）；Blender 管线契约先行（shot-spec §9），首个 3D 镜需求出现再落 CI 基建
4. **v3 一并升级**：描画引擎换真长度驱动——brand/motion 新增官方基元层（inkDraw/handheld/driftAngle/springEnter/TRANS），v3 令牌 pathDraw/chartCut/treeGrow 第 4 参从猜长度 pathLen 改收路径 d 字符串；13 处硬编码 dasharray 全清（s18/s19/s20/s31/s51/s54–s59；s55 的 dasharray=6 虚线 pattern 属合法保留）

验证：typecheck 全仓 0 错（顺修 HEAD 既有红 9 处：s14/s29 的 CSSProperties 可选字段算术、noise2D 三参签名）；触碰文件 lint 清零；shots.mjs check 绿。新效果基元（handheld/springEnter/TRANS）本 change 只入库不强行入镜——v3 视觉语言已定稿，避免无评审的像素漂移。

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/video-production-flow.md`（站点真实素材成片单元的混合渲染实证：staticFile 截图打底镜的令牌纪律与验收口径）
- **理由:** 首部「站点真实素材打底 + Remotion 动效」成片；采集资产直接进镜级缓存链路的实证
