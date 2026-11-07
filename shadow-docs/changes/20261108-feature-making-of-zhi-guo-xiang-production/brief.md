---
{
  "schema": "shadow-dev/v1",
  "name": "20261108-feature-making-of-zhi-guo-xiang-production",
  "type": "feature",
  "scope": "video-materials",
  "status": "published",
  "baseBranch": "main",
  "branch": "feature/20261108-feature-making-of-zhi-guo-xiang-production",
  "files": [
    "public/making-of-zhi-guo-xiang",
    "scripts/prep-making-of.mjs",
    "shadow-docs/changes/20261108-feature-making-of-zhi-guo-xiang-production",
    "src/Root.tsx",
    "videos/making-of-zhi-guo-xiang",
    "videos/preprod-making-of-zhi-guo-xiang"
  ],
  "github": {
    "repository": "stack-wuh/wuh.site.video",
    "issue": 56,
    "issueUrl": "https://github.com/stack-wuh/wuh.site.video/issues/56",
    "pullRequest": 57,
    "pullRequestUrl": "https://github.com/stack-wuh/wuh.site.video/pull/57"
  },
  "review": {
    "conclusion": "pending",
    "verifiedCommit": null,
    "verifiedAt": null
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:57",
    "planHash": "7351d77958aeb945cdfde90808c13b2a81eb9856d938372cd04b98b6c850dc72",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] 《致郭襄》创作历程片（making-of）正式制作：机器接线 · 素材段 · 逐镜实装 · 真声 · CI 出片",
      "titleRaw": "《致郭襄》创作历程片（making-of）正式制作：机器接线 · 素材段 · 逐镜实装 · 真声 · CI 出片",
      "supplement": "前期五件套已定稿（PR #55，41 镜 / 7980f / 37 句）。本 change 进第二段：shots.mjs 机器接线（分镜重排 s01–s41 + 重导入三绿）→ 素材段回填 13 段（M6 定位 + M2/M3 确认）→ 逐镜实装（一镜一文件，按章并行）→ 真声配音（37 句录音稿 → 用户录制 → 按镜对位）→ CI 出片 + 本地 mux。详见 shadow-docs/changes/20261108-feature-making-of-zhi-guo-xiang-production/brief.md",
      "body": "## 动机\n前期五件套已定稿归档（41 镜 / 正片 7680f / 全片 7980f / 37 句 / animatic v2 CI 出片 7980f，PR #55）。animatic 节奏与结构已过用户评审（含定稿增补 s22c/s22d 生图审核环）。现在进入第二段：把定稿分镜变成可交付成片。开工前机检盘点发现三件必须先处理的事：① `shots.mjs check --unit making-of-zhi-guo-xiang` 红 132 处（manifest transition 字段被字幕文本污染、分镜表列序不合规范六列、字母后缀镜号不过连续性规则、备注误触发 strictAssets）；② 素材段 13 个候选只产 2 个，M6 金针手镜段位仍是占位；③ 生产单元（film comp / audio comp / routes / 逐镜文件）尚不存在。\n\n## 引用规范\n- shadow-docs/knowledge/video-production-flow.md\n  - 当前结论: 两段式管线；多片化单元自包含；混剪型单元接线（manifest 在 videos/<slug>/、render-animatic 已证）；资产层机检口径（-vN 纪律、引用即承诺已入库）；渲染只走 CI、本机不渲；旁白按镜铺不按幕铺\n  - 适用 scope: videos/, scripts/, .github/workflows/\n- shadow-docs/knowledge/tts-voiceover-pipeline.md\n  - 当前结论: 真声直接录音先例（不做声音复刻）；落点对位表；逐句窗口预算 3.33 字/秒；混音 ducking 判据与单位坑\n  - 适用 scope: scripts/voice/, public/*/tts/\n- skills/shadow-dev-video/shot-spec.md\n  - 当前结论: 镜级契约 INV-S1–S7（一镜一文件一缓存、转场挂出镜尾帧+交接态协议、装配层零镜内容）\n  - 适用 scope: videos/making-of-zhi-guo-xiang/\n- shadow-docs/knowledge/render-stability-playbook.md（若 CI 矩阵抖动：rerun → 子集 run → 逐镜 artifact 本地 concat 三级兜底）\n\n## 决策\n- **选型:** 方案 A——先机器接线再产段再逐镜；配音走**真声**（用户拍板：正片已用真声配掉 TTS，历程片沿用；37 句录音稿 → 用户逐句录制 → 按镜对位）；计数口径定 **v2–v12 = 11 个编号版**（用户拍板，v1=初稿起点；钩子句「十一个版本」不变，materials.md 口径注回填）。\n- **对比方案:** ① 绕过 shots.mjs 自写校验——弃，对账是资产，绕过=漂移重演；② 镜号保留字母后缀、改 shots.mjs 适配——弃，为单点改共享机器，重编号零工具风险；③ 先逐镜后回填素材段——弃，素镜 staticFile 引用会二次返工。\n- **理由:** 镜号重排 s01–s41 连续编号只改 id 不改帧位，animatic 节奏定稿不动、无 CI 重渲必要；s02 计数角标「六版快闪 vs 01→07」矛盾随重排一并修正（七态快闪 M1–M7 各 30f，对账不变）；M6 金针手镜段位靠 v11 manifest git 考古定位后抽帧验看回填。\n\n## 任务\n### Phase 1 · 机器接线与素材段（本机，不依赖渲染）\n- [ ] 分镜表重排规范六列（镜号连续 s01–s41、句N→全文、时长列对齐 import 解析、备注改词不触发 strictAssets、s02 七态快闪修正）→ shots-data.ts id 同步（帧位/ANCHORS 帧号不动）→ 重导入 manifest（transition 修为转场类型）→ `shots.mjs import/check/sync` 三绿 — `videos/preprod-making-of-zhi-guo-xiang/assets/storyboard.md` `shots-data.ts` `videos/making-of-zhi-guo-xiang/shots-manifest.json`\n- [ ] M2/M3 内容差异抽帧确认 + M6 金针手镜抽帧定位（v11 manifest git 考古 → 秒换算 → 抽帧验看）→ materials.md §8 回填 — `videos/preprod-making-of-zhi-guo-xiang/assets/materials.md`\n- [ ] segments.json 回填 13 段 in/out → `prep-making-of.mjs` 产段 → `--check` 对账全绿 → 段文件入库 — `videos/preprod-making-of-zhi-guo-xiang/assets/segments.json` `public/making-of-zhi-guo-xiang/segments/`\n- [ ] 生产单元骨架：film.config.json（shell 120/180）+ motion-tokens.ts（MO-* 全量落地）+ MakingOf.tsx 装配（只遍历 manifest + ShotShell，零镜内容）+ MakingOfAudio.tsx 骨架 + src/Root.tsx 注册 → sync 生成 routes → check 双绿 — `videos/making-of-zhi-guo-xiang/` `src/Root.tsx`\n\n### Phase 2 · 逐镜实装（subagent 按章并行，一镜一文件）\n- [ ] 素材镜 13 面：s02 快闪 reel / s03 / s08 / s10 / s12 / s12b / s15 / s16 / s18 / s22b / s23 / s26b / s31–s34 直放（s34 缓推例外；跳切只在镜内硬切）— `videos/making-of-zhi-guo-xiang/shots/`\n- [ ] 卡片镜 16 面：s04–s07 / s13 / s14 / s17 / s19–s22 / s22c / s22d / s24–s26 / s27–s30 / s35（文档快照/CI 卡/波形卡/帧数卡/剪影对照/落版；MO-CARD-RISE / MO-TYPE-WRITER / MO-X-STAMP / MO-GRID-LIGHT / MO-WAVE-* / MO-COUNTER-*）— `videos/making-of-zhi-guo-xiang/shots/`\n- [ ] 交接态协议走查 + 覆盖矩阵 41/41 对账 + oxlint/tsc 绿 — `videos/making-of-zhi-guo-xiang/`\n\n### Phase 3 · 声音（本机音频域）\n- [ ] 录音稿 `vo-script.md`（37 句 + 槽位 + 重音停顿注，逐句小段 44.1k/16bit/mono）交用户录制 — `videos/preprod-making-of-zhi-guo-xiang/assets/vo-script.md`\n- [ ] 真声对位：行→镜映射、镜内顺序排、重叠=0 核验 → voice-track 入库 — `public/making-of-zhi-guo-xiang/tts/`\n- [ ] BGM 床：版权曲两遍铺 266s + 按正片判据重算 ducking → 本地 mux（BGM/人声/静默底；峰值/断点/余量三验）— 本机，不入库\n\n### Phase 4 · CI 出片与验收\n- [ ] push → `gh workflow run render-film.yml --ref <branch> -f film=making-of-zhi-guo-xiang` → 矩阵 41 job → assemble → 下载 → ffprobe 7980f 对账\n- [ ] 抽帧走查（镜中点帧 = 内容帧 +120f）+ 内联预览页交用户定稿意见\n- [ ] 意见单镜返工（workflow_dispatch shots 子集）→ 终验 → review/publish/release\n\n## 补充\n前期五件套已定稿（PR #55，41 镜 / 7980f / 37 句）。本 change 进第二段：shots.mjs 机器接线（分镜重排 s01–s41 + 重导入三绿）→ 素材段回填 13 段（M6 定位 + M2/M3 确认）→ 逐镜实装（一镜一文件，按章并行）→ 真声配音（37 句录音稿 → 用户录制 → 按镜对位）→ CI 出片 + 本地 mux。详见 shadow-docs/changes/20261108-feature-making-of-zhi-guo-xiang-production/brief.md\n\n完整 brief：shadow-docs/changes/20261108-feature-making-of-zhi-guo-xiang-production/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261108-feature-making-of-zhi-guo-xiang-production\",\"type\":\"feature\",\"scope\":\"video-materials\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261108-feature-making-of-zhi-guo-xiang-production/brief.md\",\"cliVersion\":\"1.9.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    },
    "worktree": "/Users/wuhong/shadow-desktop/github/wuh.site.video/.worktrees/20261108-feature-making-of-zhi-guo-xiang-production",
    "commit": {
      "files": [
        "videos/making-of-zhi-guo-xiang",
        "videos/preprod-making-of-zhi-guo-xiang"
      ],
      "message": "feat(making-of): 数据动效 retrofit 九镜——MO-NUM-ROLL/ODOMETER/SLAM + MO-CHART-GROW 令牌入库（motion-tokens/spec 矩阵 v3 重排），s02/s07 角标滚轮、s11 0→52 滚动、s23 双数冲线、s27/s28/s29/s30 生长入场、s29/s30 数字滚定、s36 1→11 逐版快滚；共享 Odometer 组件"
    }
  }
}
---

# 《致郭襄》创作历程片（making-of）正式制作：机器接线 · 素材段回填 · 逐镜实装 · 真声配音 · CI 出片

## 动机

前期五件套已定稿归档（41 镜 / 正片 7680f / 全片 7980f / 37 句 / animatic v2 CI 出片 7980f，PR #55）。animatic 节奏与结构已过用户评审（含定稿增补 s22c/s22d 生图审核环）。现在进入第二段：把定稿分镜变成可交付成片。开工前机检盘点发现三件必须先处理的事：① `shots.mjs check --unit making-of-zhi-guo-xiang` 红 132 处（manifest transition 字段被字幕文本污染、分镜表列序不合规范六列、字母后缀镜号不过连续性规则、备注误触发 strictAssets）；② 素材段 13 个候选只产 2 个，M6 金针手镜段位仍是占位；③ 生产单元（film comp / audio comp / routes / 逐镜文件）尚不存在。

## 复杂度评级

- **评级:** L
- **理由:** 契约变更——本单元首次接入 shots.mjs 机器（分镜表重排 + 重导入，帧数真源易主 manifest）并新建生产单元（routes/film comp/audio comp 生成物链）；触及面——41 个镜文件 + 素材段入库 + 三路音频 + CI 出片 + Root 注册；可发现性——帧数/转场/段版本错任一处都会在成片层显形。
- **期望验证深度:** runtime（CI 出片 + ffprobe 对账 + 抽帧走查 + mux 三验 + 用户验收）
- **取证策略:** assert-first（结构不变量全部有 CLI 机检观察点：shots.mjs check / prep-making-of.mjs --check / ffprobe；出片层走 CI run 观察）

## 领域模型

- **限界上下文:** video-materials（视频制作域）——making-of 是 `videos/` 下自包含单元，与 zhi-guo-xiang 正片单元共享 brand/film-kit 与机器（shots.mjs / render-film.yml / prep-making-of.mjs），内容零共享；下游 = CI 渲染域（只吃 manifest + routes + staticFile 依赖物）。反腐边界：不改正片单元任何文件；不为单点需求改 shots.mjs 共享机器。
- **统一语言增量:** 素材镜（M 段直放镜，staticFile 引 `segments/-vN` 段文件）；卡片镜（代码绘制文档快照/CI 卡/波形卡，零生图）；段（segments.json 产段，`-vN` 纪律）；混剪型单元（manifest 常驻 `videos/<slug>/` 的单元）。无命令键增量。
- **聚合与不变量:**
  - `INV-1 帧数真源`：Σ durationFrames = 7680；全片 = 片头 120 + 正片 7680 + 片尾 180 = 7980；manifest 与分镜表/幕表对账一致；transition ∈ {page,dry,ink,cut} 且首镜 inbound=cut（观察点：`node scripts/shots.mjs check --unit making-of-zhi-guo-xiang` 退出码 0）
  - `INV-2 镜组件纪律`：一镜一文件、局部帧 0 起、无 `<Audio>`、import 白名单、禁 `Date.now`/`Math.random`、不透明底、确定性（观察点：白名单 grep 清零 + CI 镜级产物 nb_frames = durationFrames）
  - `INV-3 素材段`：segments.json 引用的母带存在、段文件 `-vN` 命名、nb_frames ±2 @1080p30、单段 ≤50MB、镜组件 staticFile 引用与文件名严格一致（观察点：`node scripts/prep-making-of.mjs --check` 退出码 0 + staticFile 引用清单 grep）
  - `INV-4 人声对位`：37 句行→镜全映射、镜内重叠=0、句间间隔合规、字幕窗安全（首句 +0.6s / 句间 0.35s / 末句 ≤ 镜尾 −0.25s）（观察点：对位校验报告 + 字幕窗口对账）
  - `INV-5 版权纪律`：版权 BGM 不进 git 不进 CI；真声走 `public/<slug>/tts/` 例外；成片不入库（观察点：git status 走查 + .gitignore）
  - `INV-6 出片对账`：CI 成片 ffprobe = 7980f / 266.0s = 片头+正片+片尾；mux 后峰值 ≤ −1 dBFS、0 削波（观察点：ffprobe + assemble 终验日志 + volumedetect）
- **领域事件:** 分镜重导入（帧数真源易手机器）→ 素材段入库（渲染依赖可解析）→ 逐镜实装全绿（可渲）→ CI run success（成片存在）→ mux 完成（可验收）→ 用户定稿（可发布）

## 引用规范

- shadow-docs/knowledge/video-production-flow.md
  - 当前结论: 两段式管线；多片化单元自包含；混剪型单元接线（manifest 在 videos/<slug>/、render-animatic 已证）；资产层机检口径（-vN 纪律、引用即承诺已入库）；渲染只走 CI、本机不渲；旁白按镜铺不按幕铺
  - 适用 scope: videos/, scripts/, .github/workflows/
- shadow-docs/knowledge/tts-voiceover-pipeline.md
  - 当前结论: 真声直接录音先例（不做声音复刻）；落点对位表；逐句窗口预算 3.33 字/秒；混音 ducking 判据与单位坑
  - 适用 scope: scripts/voice/, public/*/tts/
- skills/shadow-dev-video/shot-spec.md
  - 当前结论: 镜级契约 INV-S1–S7（一镜一文件一缓存、转场挂出镜尾帧+交接态协议、装配层零镜内容）
  - 适用 scope: videos/making-of-zhi-guo-xiang/
- shadow-docs/knowledge/render-stability-playbook.md（若 CI 矩阵抖动：rerun → 子集 run → 逐镜 artifact 本地 concat 三级兜底）

## 决策

- **选型:** 方案 A——先机器接线再产段再逐镜；配音走**真声**（用户拍板：正片已用真声配掉 TTS，历程片沿用；37 句录音稿 → 用户逐句录制 → 按镜对位）；计数口径定 **v2–v12 = 11 个编号版**（用户拍板，v1=初稿起点；钩子句「十一个版本」不变，materials.md 口径注回填）。
- **对比方案:** ① 绕过 shots.mjs 自写校验——弃，对账是资产，绕过=漂移重演；② 镜号保留字母后缀、改 shots.mjs 适配——弃，为单点改共享机器，重编号零工具风险；③ 先逐镜后回填素材段——弃，素镜 staticFile 引用会二次返工。
- **理由:** 镜号重排 s01–s41 连续编号只改 id 不改帧位，animatic 节奏定稿不动、无 CI 重渲必要；s02 计数角标「六版快闪 vs 01→07」矛盾随重排一并修正（七态快闪 M1–M7 各 30f，对账不变）；M6 金针手镜段位靠 v11 manifest git 考古定位后抽帧验看回填。

## 任务

### Phase 1 · 机器接线与素材段（本机，不依赖渲染）
- [x] 分镜表重排规范六列（镜号连续 s01–s41、句N→全文、时长列对齐 import 解析、备注改词不触发 strictAssets、s02 七态快闪修正）→ shots-data.ts id 同步（帧位/ANCHORS 帧号不动）→ 重导入 manifest（transition 修为转场类型）→ `shots.mjs import/check/sync` 三绿 — `videos/preprod-making-of-zhi-guo-xiang/assets/storyboard.md` `shots-data.ts` `videos/making-of-zhi-guo-xiang/shots-manifest.json`
- [x] M2/M3 内容差异抽帧确认 + M6 金针手镜抽帧定位（v11 manifest git 考古 → 秒换算 → 抽帧验看）→ materials.md §8 回填 — `videos/preprod-making-of-zhi-guo-xiang/assets/materials.md`
- [x] segments.json 回填 13 段 in/out → `prep-making-of.mjs` 产段 → `--check` 对账全绿 → 段文件入库 — `videos/preprod-making-of-zhi-guo-xiang/assets/segments.json` `public/making-of-zhi-guo-xiang/segments/`
- [x] 生产单元骨架：film.config.json（shell 120/180）+ motion-tokens.ts（MO-* 全量落地）+ MakingOf.tsx 装配（只遍历 manifest + ShotShell，零镜内容）+ MakingOfAudio.tsx 骨架 + src/Root.tsx 注册 → sync 生成 routes → check 双绿 — `videos/making-of-zhi-guo-xiang/` `src/Root.tsx`

### Phase 2 · 逐镜实装（subagent 按章并行，一镜一文件）
- [x] 素材镜 13 面：s02 快闪 reel / s03 / s08 / s10 / s12 / s12b / s15 / s16 / s18 / s22b / s23 / s26b / s31–s34 直放（s34 缓推例外；跳切只在镜内硬切）— `videos/making-of-zhi-guo-xiang/shots/`
- [x] 卡片镜 16 面：s04–s07 / s13 / s14 / s17 / s19–s22 / s22c / s22d / s24–s26 / s27–s30 / s35（文档快照/CI 卡/波形卡/帧数卡/剪影对照/落版；MO-CARD-RISE / MO-TYPE-WRITER / MO-X-STAMP / MO-GRID-LIGHT / MO-WAVE-* / MO-COUNTER-*）— `videos/making-of-zhi-guo-xiang/shots/`
- [x] 交接态协议走查 + 覆盖矩阵 41/41 对账 + oxlint/tsc 绿 — `videos/making-of-zhi-guo-xiang/`

### Phase 3 · 声音（本机音频域）
- [x] 录音稿 `vo-script.md`（37 句 + 槽位 + 重音停顿注，逐句小段 44.1k/16bit/mono）交用户录制 — `videos/preprod-making-of-zhi-guo-xiang/assets/vo-script.md`
- [ ] 真声对位：行→镜映射、镜内顺序排、重叠=0 核验 → voice-track 入库 — `public/making-of-zhi-guo-xiang/tts/`
- [ ] BGM 床：版权曲两遍铺 266s + 按正片判据重算 ducking → 本地 mux（BGM/人声/静默底；峰值/断点/余量三验）— 本机，不入库

### Phase 4 · CI 出片与验收
- [x] push → `gh workflow run render-film.yml --ref <branch> -f film=making-of-zhi-guo-xiang` → 矩阵 41 job → assemble → 下载 → ffprobe 7980f 对账
- [x] 抽帧走查（镜中点帧 = 内容帧 +120f）+ 内联预览页交用户定稿意见
- [ ] 意见单镜返工（workflow_dispatch shots 子集）→ 终验 → review/publish/release

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/video-production-flow.md（历程片正式制作实证：混剪型单元 production 端接线、真声多句按镜铺）；tts-voiceover-pipeline.md（若真声录制/对位出新坑）
- **理由:** 混剪型单元此前只实证到 animatic 端；production 端接线（生产单元骨架 + 素材镜 staticFile 段引用 + 真声 37 句对位）是新证据，落地后回写。
