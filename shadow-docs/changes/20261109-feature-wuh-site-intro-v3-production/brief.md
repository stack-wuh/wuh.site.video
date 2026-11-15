---
{
  "schema": "shadow-dev/v1",
  "name": "20261109-feature-wuh-site-intro-v3-production",
  "type": "feature",
  "scope": "video-materials",
  "status": "proposed",
  "baseBranch": "main",
  "branch": null,
  "files": [
    ".github/workflows/render-film.yml",
    "public/wuh-site-intro-v3",
    "src/Root.tsx",
    "videos/preprod-wuh-site-intro-v3",
    "videos/wuh-site-intro-v3"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
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
    "checkpoint": null,
    "planHash": null,
    "updatedAt": null,
    "lastError": null
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

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/video-production-flow.md`（站点真实素材成片单元的混合渲染实证：staticFile 截图打底镜的令牌纪律与验收口径）
- **理由:** 首部「站点真实素材打底 + Remotion 动效」成片；采集资产直接进镜级缓存链路的实证
