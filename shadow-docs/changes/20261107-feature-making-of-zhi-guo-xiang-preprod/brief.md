---
{
  "schema": "shadow-dev/v1",
  "name": "20261107-feature-making-of-zhi-guo-xiang-preprod",
  "type": "feature",
  "scope": "video-materials",
  "status": "committed",
  "baseBranch": "main",
  "branch": "feature/20261107-feature-making-of-zhi-guo-xiang-preprod",
  "files": [
    ".github/workflows/render-animatic.yml",
    "public/making-of-zhi-guo-xiang",
    "scripts/prep-making-of.mjs",
    "shadow-docs/changes/20261107-feature-making-of-zhi-guo-xiang-preprod",
    "src/Root.tsx",
    "videos/making-of-zhi-guo-xiang",
    "videos/preprod-making-of-zhi-guo-xiang"
  ],
  "github": {
    "repository": "stack-wuh/wuh.site.video",
    "issue": 54,
    "issueUrl": "https://github.com/stack-wuh/wuh.site.video/issues/54",
    "pullRequest": 55,
    "pullRequestUrl": "https://github.com/stack-wuh/wuh.site.video/pull/55"
  },
  "review": {
    "conclusion": "pending",
    "verifiedCommit": null,
    "verifiedAt": null
  },
  "workflow": {
    "operation": null,
    "checkpoint": "91dd65e724c0760d98cdc2120be9375452ab7dfe",
    "planHash": "f5f4aa3565995ca671b62774520a19399d30834f1e1df3c2729dc29eb86759a9",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] 《致郭襄》创作历程片（making-of）前期：素材库 · 剧本 · 分镜 · animatic",
      "titleRaw": "《致郭襄》创作历程片（making-of）前期：素材库 · 剧本 · 分镜 · animatic",
      "supplement": "为《风陵·致郭襄》11 版迭代历程立项 making-of 短片（熟人圈受众，方案 C：Remotion 主装配 + ffmpeg 预混剪段）。本 change 只做前期五件套（轻量）：素材库（版本映射表 + ffmpeg 预处理脚本）→ 剧本（四线结构）→ 分镜（4:00±30s）→ 动效规范 → animatic CI 出片交用户定稿；正式制作另立 change。详见 shadow-docs/changes/20261107-feature-making-of-zhi-guo-xiang-preprod/brief.md",
      "body": "## 动机\n《风陵 · 致郭襄》v12 已交付（40 镜 / 八幕 / 4:52 / 9060f），全片经 11 个版本迭代，过程资产完整：Desktop 留有 8 份时间戳成片母带（2026110101×2 → 20261107044211），仓库内文档演化线 script-v1~v10 / storyboard-v6~v12 / vo-script-v2~v8、RELEASE-v12 六个关键决定（原著校正、删金针手镜、旁白按镜重铺 −16.17s→中位 1.51s 等）、CI 渲染史与删镜记录、真人录音素材（配音/开头.m4a/结尾.m4a）均在。受众定位熟人圈；四线结构：版本演化对比做骨架、每章一个转折故事、幕后工作流穿插、与正片的情感互文收尾。现在做前期，避免在错误叙事上烧混剪工时。\n\n## 引用规范\n- `shadow-docs/knowledge/video-production-flow.md`\n  - 当前结论: 长片两段式推进（前期一次 change，评审定稿后另立 change 正式制作）；素材库全条目标来源；分镜逐镜表 + 帧数对账表 + 旁白字数硬表；animatic 单色简板 CI 出片；版权 BGM 不进 public、发布前本地 mux；渲染只走 CI\n  - 适用 scope: videos/, scripts/, src/Root.tsx\n- `shadow-docs/knowledge/video-studio-structure.md`\n  - 当前结论: 单元自包含（videos/<slug>/ 独立成片单元）；staticFile 以 public/ 为根；组件零内联色值一律引 brand/tokens；渲染工具链口径（node 22 / 系统 Chrome / --port 3211 / 本机执行绕开沙箱）；文件存放纪律——能由源码+资产确定性重生的不进 git、渲染依赖必进\n  - 适用 scope: videos/, brand/, scripts/, public/\n\n## 决策\n- **选型:** 方案 C——Remotion 主装配 + ffmpeg 预混剪段。内容拆两类镜：素材镜（11 版对比、录音花絮）由预处理脚本统一为 1080p30 片段入 public/，Remotion 里 OffthreadVideo 装配 + 代码包装（版本计数角标、滑动对比转场、字幕系统）；原生镜（章节卡、转场、结尾情感段）直接画水墨同族画面。节奏迭代走 Remotion Studio 本地预览，定稿后 CI 出片验收\n- **对比方案:** A 全流水线（混剪节奏每调一次走代码+CI 回环，工时翻倍以上，弃）；B NLE 快剪 + Remotion 包装件（最快但跳出工作室体系：无机检、不可重生、NLE 内风格跑偏，情感互文线打折，弃）\n- **理由:** 熟人圈受众要求与正片同源的视觉语言（情感互文成立），混剪内容要求快速试节奏；预处理前置把「素材对齐」从逐镜代码解耦。本单元分镜表**不声明**「资产外键」表头（INV-S7 不激活）——混剪素材是视频片段而非 C/S/P 图像资产，溯源由素材库 materials.md 承担；片段文件沿用 -vN 版本号纪律（换段必升版并同步改组件引用，staticFile 不在镜级缓存键 import 闭包内）\n\n## 任务\n### Phase 1 素材层\n- [ ] 版本映射表：Desktop 时间戳母带 + 仓库文档版本线 → 11 版编号/日期/关键决定一览（用户口述核对） — `videos/preprod-making-of-zhi-guo-xiang/assets/materials.md`\n- [ ] ffmpeg 预处理脚本：母带裁段 → 统一 1080p30 H.264 → 按清单输出片段（-vN 命名）入 public/ — `scripts/prep-making-of.mjs`, `public/making-of-zhi-guo-xiang/`\n- [ ] 素材库定稿：版本片段 / 真人录音（配音、开头/结尾.m4a）/ 文档快照 / CI 记录，全条目标来源与用途 — `videos/preprod-making-of-zhi-guo-xiang/assets/materials.md`\n\n### Phase 2 前期五件套（轻量）\n- [ ] 剧本：四线结构章节化（演化骨架 + 每章转折故事 + 工作流穿插 + 情感收束），旁白逐句标素材编号 + 字数硬表 — `videos/preprod-making-of-zhi-guo-xiang/assets/script.md`\n- [ ] 分镜：逐镜表（镜号/画面/镜头语言/文案/时长/转场/音效点）+ 帧数对账表；片长 4:00±30s 内定稿锁定 — `videos/preprod-making-of-zhi-guo-xiang/assets/storyboard.md`\n- [ ] 动效规范：轻量令牌 + 全镜覆盖矩阵（对比滑动转场 / 版本计数角标 / 字幕系统） — `videos/preprod-making-of-zhi-guo-xiang/assets/motion-spec.md`\n- [ ] animatic：new-video 脚手架生成 preprod 单元 + 单色简板（真实内容构图节拍）+ Root 注册 + CI 出片交用户定稿 — `videos/preprod-making-of-zhi-guo-xiang/`, `src/Root.tsx`\n\n### Phase 3 评审收口\n- [ ] 用户 animatic 定稿；记录定稿意见与正式制作 change 的输入清单 — brief 本节\n\n## 补充\n为《风陵·致郭襄》11 版迭代历程立项 making-of 短片（熟人圈受众，方案 C：Remotion 主装配 + ffmpeg 预混剪段）。本 change 只做前期五件套（轻量）：素材库（版本映射表 + ffmpeg 预处理脚本）→ 剧本（四线结构）→ 分镜（4:00±30s）→ 动效规范 → animatic CI 出片交用户定稿；正式制作另立 change。详见 shadow-docs/changes/20261107-feature-making-of-zhi-guo-xiang-preprod/brief.md\n\n完整 brief：shadow-docs/changes/20261107-feature-making-of-zhi-guo-xiang-preprod/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261107-feature-making-of-zhi-guo-xiang-preprod\",\"type\":\"feature\",\"scope\":\"video-materials\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261107-feature-making-of-zhi-guo-xiang-preprod/brief.md\",\"cliVersion\":\"1.9.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    },
    "commit": {
      "files": [
        "videos/making-of-zhi-guo-xiang/shots-manifest.json",
        "videos/preprod-making-of-zhi-guo-xiang"
      ],
      "message": "feat(video-materials): 历程片分镜 v2——增补生图审核环两镜（s22c/s22d）\n\n- 定稿意见落地：四·镜头也错了末尾增补 s22c（正脸四轮崩·MO-X-STAMP）/ s22d（剪影暗部主义对照卡），act5 900→1380f\n- 正片 7200→7680f（256s），全片 7980f（4:26），后续 15 镜起帧 +480，ANCHORS 同步\n- script.md 37 句 + 字数硬表 37/37 绿；storyboard v2 对账表闭合；motion-spec 41/41 覆盖 + MO-X-STAMP 令牌\n- manifest 与 shots-data 同源重生成（41 镜连续无缝对账）"
    }
  }
}
---

# 《致郭襄》创作历程片（making-of）前期：素材库 · 剧本 · 分镜 · 动效 · animatic

## 动机

《风陵 · 致郭襄》v12 已交付（40 镜 / 八幕 / 4:52 / 9060f），全片经 11 个版本迭代，过程资产完整：Desktop 留有 8 份时间戳成片母带（2026110101×2 → 20261107044211），仓库内文档演化线 script-v1~v10 / storyboard-v6~v12 / vo-script-v2~v8、RELEASE-v12 六个关键决定（原著校正、删金针手镜、旁白按镜重铺 −16.17s→中位 1.51s 等）、CI 渲染史与删镜记录、真人录音素材（配音/开头.m4a/结尾.m4a）均在。受众定位熟人圈；四线结构：版本演化对比做骨架、每章一个转折故事、幕后工作流穿插、与正片的情感互文收尾。现在做前期，避免在错误叙事上烧混剪工时。

## 复杂度评级

- **评级：** M
- **理由：** ① 契约变更：新增 preprod 单元与 animatic Composition 注册（Root.tsx 加 import + 路由 spread），不改既有四单元契约；② 触及面：新目录 `videos/preprod-making-of-zhi-guo-xiang/` + 预处理脚本 + `public/making-of-zhi-guo-xiang/` 素材段，独立命名空间零交集；③ 可发现性：slug `making-of-zhi-guo-xiang` 全新，术语沿用素材库/分镜/animatic 既有词汇
- **期望验证深度:** runtime（预处理脚本实跑出标准段；animatic CI 出片，帧数对账表合计 = ffprobe 帧数）

## 引用规范

- `shadow-docs/knowledge/video-production-flow.md`
  - 当前结论: 长片两段式推进（前期一次 change，评审定稿后另立 change 正式制作）；素材库全条目标来源；分镜逐镜表 + 帧数对账表 + 旁白字数硬表；animatic 单色简板 CI 出片；版权 BGM 不进 public、发布前本地 mux；渲染只走 CI
  - 适用 scope: videos/, scripts/, src/Root.tsx
- `shadow-docs/knowledge/video-studio-structure.md`
  - 当前结论: 单元自包含（videos/<slug>/ 独立成片单元）；staticFile 以 public/ 为根；组件零内联色值一律引 brand/tokens；渲染工具链口径（node 22 / 系统 Chrome / --port 3211 / 本机执行绕开沙箱）；文件存放纪律——能由源码+资产确定性重生的不进 git、渲染依赖必进
  - 适用 scope: videos/, brand/, scripts/, public/

## 决策

- **选型:** 方案 C——Remotion 主装配 + ffmpeg 预混剪段。内容拆两类镜：素材镜（11 版对比、录音花絮）由预处理脚本统一为 1080p30 片段入 public/，Remotion 里 OffthreadVideo 装配 + 代码包装（版本计数角标、滑动对比转场、字幕系统）；原生镜（章节卡、转场、结尾情感段）直接画水墨同族画面。节奏迭代走 Remotion Studio 本地预览，定稿后 CI 出片验收
- **对比方案:** A 全流水线（混剪节奏每调一次走代码+CI 回环，工时翻倍以上，弃）；B NLE 快剪 + Remotion 包装件（最快但跳出工作室体系：无机检、不可重生、NLE 内风格跑偏，情感互文线打折，弃）
- **理由:** 熟人圈受众要求与正片同源的视觉语言（情感互文成立），混剪内容要求快速试节奏；预处理前置把「素材对齐」从逐镜代码解耦。本单元分镜表**不声明**「资产外键」表头（INV-S7 不激活）——混剪素材是视频片段而非 C/S/P 图像资产，溯源由素材库 materials.md 承担；片段文件沿用 -vN 版本号纪律（换段必升版并同步改组件引用，staticFile 不在镜级缓存键 import 闭包内）

## 待确认点

1. Desktop 8 份时间戳母带 → 11 版编号/日期/关键决定的映射，Phase 1 首任务由用户口述核对
2. 本地 Remotion Studio 预览混剪（OffthreadVideo 多段）流畅度未实证，Phase 2 animatic 阶段验证
3. BGM 选路：复用正片版权床（本地 mux）或 CC-BY 溯源曲，Phase 2 选曲定

## 任务

### Phase 1 素材层
- [x] 版本映射表：Desktop 时间戳母带 + 仓库文档版本线 → 11 版编号/日期/关键决定一览（用户口述核对） — `videos/preprod-making-of-zhi-guo-xiang/assets/materials.md`
- [x] ffmpeg 预处理脚本：母带裁段 → 统一 1080p30 H.264 → 按清单输出片段（-vN 命名）入 public/ — `scripts/prep-making-of.mjs`, `public/making-of-zhi-guo-xiang/`
- [x] 素材库定稿：版本片段 / 真人录音（配音、开头/结尾.m4a）/ 文档快照 / CI 记录，全条目标来源与用途 — `videos/preprod-making-of-zhi-guo-xiang/assets/materials.md`

### Phase 2 前期五件套（轻量）
- [x] 剧本：四线结构章节化（演化骨架 + 每章转折故事 + 工作流穿插 + 情感收束），旁白逐句标素材编号 + 字数硬表 — `videos/preprod-making-of-zhi-guo-xiang/assets/script.md`
- [x] 分镜：逐镜表（镜号/画面/镜头语言/文案/时长/转场/音效点）+ 帧数对账表；片长 4:00±30s 内定稿锁定 — `videos/preprod-making-of-zhi-guo-xiang/assets/storyboard.md`
- [x] 动效规范：轻量令牌 + 全镜覆盖矩阵（对比滑动转场 / 版本计数角标 / 字幕系统） — `videos/preprod-making-of-zhi-guo-xiang/assets/motion-spec.md`
- [x] animatic：new-video 脚手架生成 preprod 单元 + 单色简板（真实内容构图节拍）+ Root 注册 + CI 出片交用户定稿 — `videos/preprod-making-of-zhi-guo-xiang/`, `src/Root.tsx`

### Phase 3 评审收口
- [ ] 用户 animatic 定稿；记录定稿意见与正式制作 change 的输入清单 — brief 本节

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 新增
- **候选卡片:** `shadow-docs/knowledge/video-production-flow.md`（并入「混剪型单元」小节）或新增 making-of-pipeline 卡（apply 阶段按 domain+keywords+scope 查重后定）
- **理由:** ffmpeg 预处理 → public 素材段 → OffthreadVideo 装配 → 本地 Studio 预览 / CI 出片回环是新流程口径；animatic 定稿后凭实证更新，正式制作 change 完成后补全链路实证
