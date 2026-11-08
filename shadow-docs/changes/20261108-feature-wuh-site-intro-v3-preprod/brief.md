---
{
  "schema": "shadow-dev/v1",
  "name": "20261108-feature-wuh-site-intro-v3-preprod",
  "type": "feature",
  "scope": "video-materials",
  "status": "branched",
  "baseBranch": "main",
  "branch": "feature/20261108-feature-wuh-site-intro-v3-preprod",
  "files": [
    ".github/workflows/render-animatic.yml",
    "public/wuh-site-intro-v3",
    "scripts/harvest-site-shots.mjs",
    "shadow-docs/changes/20261108-feature-wuh-site-intro-v3-preprod",
    "src/Root.tsx",
    "videos/preprod-wuh-site-intro-v3",
    "videos/wuh-site-intro-v3"
  ],
  "github": {
    "repository": "stack-wuh/wuh.site.video",
    "issue": 58,
    "issueUrl": "https://github.com/stack-wuh/wuh.site.video/issues/58",
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
    "checkpoint": "issue:58",
    "planHash": "775b3bf1b45ae6910f57725194289a81a7c3cc5eb1a0a8b74c45f05971145dc3",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] wuh.site 介绍片 v3 前期：素材库刷新 · 站点真实素材资产层 · 剧本 · 分镜 · animatic",
      "titleRaw": "[feature] wuh.site 介绍片 v3 前期：素材库刷新 · 站点真实素材资产层 · 剧本 · 分镜 · animatic",
      "supplement": "wuh-site-intro-v2 基础上按新工作流做 v3：纯字幕、无人物、八幕骨架保留；不接 AI 生图，视觉资产全部来自 wuh.site 本站真实素材（混合素材策略 A）。本 change 做前期：素材库 2026-11-08 快照、资产登记表与采集脚本、剧本（用户评审 gate）、强 schema 分镜、动效规范（数据令牌必备）、animatic CI 出片 + 内联预览页定稿、manifest import。正式制作另立 change。详见 shadow-docs/changes/20261108-feature-wuh-site-intro-v3-preprod/brief.md",
      "body": "## 动机\nwuh-site-intro-v2 已交付（58 镜 / 八幕 / 4:46 / 8590f，纯字幕代码动效片），经 r1–r4 四轮修订后叙事与版式已定。用户裁定 v3 在 v2 基础上按 2026-11-07 新工作流继续优化，四个结构性决策已拍板：①保持纯字幕（无旁白）；②继续无人物；③维持八幕骨架；④**不接 AI 生图——视觉资产全部来自 wuh.site 本站真实素材**。新工作流中适配本片的部分全部落地：强 schema 分镜（导演列+资产外键）、资产登记表机检（S/P 两型，C 不激活）、数据动效令牌必备（凡量必滚）、animatic CI 出片、内联预览页交付。素材基准从 2026-10-31 刷新到 2026-11-08。本 change 只做前期，避免在错误叙事上烧工时；正式制作另立 change。\n\n## 引用规范\n- `shadow-docs/knowledge/video-production-flow.md`\n  - 当前结论: 两段式推进；前期五件套+资产层一次 change；分镜强 schema 导演列+字数硬表+帧数对账；资产登记表 ∅ 语义与版本纪律；animatic CI 出片；内联预览页交付（镜中点帧 +120f 偏移）；渲染只走 CI\n  - 适用 scope: videos/, scripts/, src/Root.tsx, .github/workflows/\n- `shadow-docs/knowledge/video-studio-structure.md`\n  - 当前结论: 单元自包含；staticFile 以 public/ 为根；组件零内联色值引 brand/tokens；渲染工具链口径；文件存放纪律——渲染依赖必进 git\n  - 适用 scope: videos/, brand/, scripts/, public/\n- `shadow-docs/knowledge/render-stability-playbook.md`\n  - 当前结论: 本机不渲；CI 矩阵抖动兜底；抽帧偏移 +片头帧；转场遮罩安全窗\n  - 适用 scope: .github/workflows/, scripts/\n\n## 决策\n- **选型:** 方案 A——混合素材策略。叙事镜「站点真实截图打底 + Remotion 动效叠加」（新工作流混合渲染策略的站点素材版），数据镜纯 Remotion 重绘静态化真实数据（v2 已实证）；资产采集清单驱动（登记表反驱动采集脚本，系统 Chrome 短命进程，采集后清场），每图记来源 URL + 抓取日期入登记表；animatic 简板用已采集真实截图占位（非空框）。\n- **对比方案:** B 全截图混剪（最快但跳出 Remotion 确定性体系，机检/缓存/重渲粒度全丢，水墨风格统一性受损，弃）；C 全 Remotion 重绘 + API 数据（= v2 原路，无新工作流增量，等于不做 v3，弃）\n- **理由:** 用户裁定资源全部从网站找——真实截图是「真实发生过」的最强物证，与 v2 编年叙事的史料感同源；Remotion 叠加动效保住机检与镜级缓存体系；数据镜纯 Remotion 是数据动效令牌（凡量必滚）的主场\n\n## 任务\n### Phase 1 素材层与资产层\n- [ ] 素材库刷新：线上 API 快照（/api/visit-stats/stats、/api/content/posts、/api/about/activity、/api/repos/profile、/api/weread/books）+ 本地 git 快照（x.wuh.site 提交/标签/月度节奏）→ 基准日 2026-11-08 — `videos/preprod-wuh-site-intro-v3/assets/materials.md`\n- [ ] 资产登记表首轮：S/P 两型（C 不激活），清单含页面截图/静态资源/API 数据图三类，标来源与日期 — `videos/preprod-wuh-site-intro-v3/assets/asset-registry.md`\n- [ ] 采集脚本：清单驱动高清截图（系统 Chrome 短命进程，采集后清场）→ `public/wuh-site-intro-v3/`，登记表 ∅ → 文件 — `scripts/harvest-site-shots.mjs`\n\n### Phase 2 前期五件套\n- [ ] 剧本（编剧 subagent）：八幕骨架、编年对账更新至 2026-11-08、v2 修订经验入镜（S47 四列右起 / S56 脚注可读）、金句使用规划 — `videos/preprod-wuh-site-intro-v3/assets/script.md` → **交用户评审定稿后才许进分镜**\n- [ ] 分镜（分镜师 subagent）：七列逐镜表 + 导演列（景别+运镜/光线/构图/尾帧/资产外键）+ 字数硬表 + 帧数对账表 — `videos/preprod-wuh-site-intro-v3/assets/storyboard.md`\n- [ ] 动效规范（UE 动效大师 subagent）：令牌化 + 全镜覆盖矩阵 + 数据动效令牌必备 — `videos/preprod-wuh-site-intro-v3/assets/motion-spec.md`\n- [ ] Animatic：new-video 脚手架 preprod 单元 + 单色简板（真实截图占位）+ Root 注册 + render-animatic.yml unit choice + CI 出片 — `videos/preprod-wuh-site-intro-v3/`, `src/Root.tsx`, `.github/workflows/render-animatic.yml`\n\n### Phase 3 评审收口\n- [ ] 内联预览页交用户定稿；定稿意见记录 — brief 本节\n- [ ] `shots.mjs import --unit wuh-site-intro-v3` → `videos/wuh-site-intro-v3/shots-manifest.json`（帧数机器真源）+ check 全绿\n\n## 补充\nwuh-site-intro-v2 基础上按新工作流做 v3：纯字幕、无人物、八幕骨架保留；不接 AI 生图，视觉资产全部来自 wuh.site 本站真实素材（混合素材策略 A）。本 change 做前期：素材库 2026-11-08 快照、资产登记表与采集脚本、剧本（用户评审 gate）、强 schema 分镜、动效规范（数据令牌必备）、animatic CI 出片 + 内联预览页定稿、manifest import。正式制作另立 change。详见 shadow-docs/changes/20261108-feature-wuh-site-intro-v3-preprod/brief.md\n\n完整 brief：shadow-docs/changes/20261108-feature-wuh-site-intro-v3-preprod/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261108-feature-wuh-site-intro-v3-preprod\",\"type\":\"feature\",\"scope\":\"video-materials\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261108-feature-wuh-site-intro-v3-preprod/brief.md\",\"cliVersion\":\"1.9.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    }
  }
}
---

# wuh.site 介绍片 v3 前期：素材库刷新 · 站点真实素材资产层 · 剧本 · 分镜 · 动效 · animatic

## 动机

wuh-site-intro-v2 已交付（58 镜 / 八幕 / 4:46 / 8590f，纯字幕代码动效片），经 r1–r4 四轮修订后叙事与版式已定。用户裁定 v3 在 v2 基础上按 2026-11-07 新工作流继续优化，四个结构性决策已拍板：①保持纯字幕（无旁白）；②继续无人物；③维持八幕骨架；④**不接 AI 生图——视觉资产全部来自 wuh.site 本站真实素材**。新工作流中适配本片的部分全部落地：强 schema 分镜（导演列+资产外键）、资产登记表机检（S/P 两型，C 不激活）、数据动效令牌必备（凡量必滚）、animatic CI 出片、内联预览页交付。素材基准从 2026-10-31 刷新到 2026-11-08。本 change 只做前期，避免在错误叙事上烧工时；正式制作另立 change。

## 复杂度评级

- **评级:** M
- **理由:** ① 契约变更：新增 preprod 单元与 animatic Composition 注册（Root.tsx + render-animatic.yml unit choice），不动既有单元契约；② 触及面：新目录 `videos/preprod-wuh-site-intro-v3/` + `videos/wuh-site-intro-v3/` + `public/wuh-site-intro-v3/` + 采集脚本，独立命名空间零交集；③ 可发现性：slug 延续 wuh-site-intro 系列，资产登记表/导演列/数据令牌均为既有词汇
- **期望验证深度:** runtime（采集脚本实跑出图；animatic CI 出片，帧数对账 = ffprobe 帧数；shots.mjs check 全绿）
- **取证策略:** observation（机检点随任务标注：import 对账 / check 外键与登记表 / ffprobe 帧数）

## 领域模型

- **限界上下文:** video-materials——视频工程、品牌令牌、分镜组件与素材的唯一维护地。上游：x.wuh.site 仓库与 wuh.site 线上 API（只读采集）；下游：B 站成片发布。反腐边界：不收 AI 生图资产（本片裁定不接生图）、不做发布排期管理。
- **统一语言增量:** 「站点真实素材」——从 wuh.site 线上页面（高清截图）/ 线上 API（静态化数据）/ 站点静态资源（书封、生成式封面）采集的图像与数据资产，登记表 P 型资产的本片唯一来源类型；区别于 AI 生图资产（本片不使用）。
- **聚合与不变量:**
  - `INV-1 帧数对账`：storyboard 帧数对账表 Σ = manifest totalFrames = animatic ffprobe 帧数；观察点 `shots.mjs import` 对账 + `ffprobe -count_frames`
  - `INV-2 资产溯源`：登记表每条真实素材必有来源（URL 或仓库路径）+ 抓取日期；引用即承诺已入库——P 引用 ∅ 或登记文件缺失 → `shots.mjs check` 红（全量查）
  - `INV-3 字数硬表`：文案列按 (2.5s,20)/(5s,40)/(10s,82) 分段线性内插，import 机检拒绝超标行
  - `INV-4 外键`：分镜资产列引用编号必须在登记表内；每镜一场景，多场景 import 拒绝
  - `INV-5 数据令牌覆盖`：motion-spec 凡「量」（计数/帧数/秒数/百分比/进度）必有数据动效令牌；走查项
- **领域事件:** 用户 animatic 定稿 → `shots.mjs import` 落 manifest（帧数机器真源）→ 另立正式制作 change

## 引用规范

- `shadow-docs/knowledge/video-production-flow.md`
  - 当前结论: 两段式推进；前期五件套+资产层一次 change；分镜强 schema 导演列+字数硬表+帧数对账；资产登记表 ∅ 语义与版本纪律；animatic CI 出片；内联预览页交付（镜中点帧 +120f 偏移）；渲染只走 CI
  - 适用 scope: videos/, scripts/, src/Root.tsx, .github/workflows/
- `shadow-docs/knowledge/video-studio-structure.md`
  - 当前结论: 单元自包含；staticFile 以 public/ 为根；组件零内联色值引 brand/tokens；渲染工具链口径；文件存放纪律——渲染依赖必进 git
  - 适用 scope: videos/, brand/, scripts/, public/
- `shadow-docs/knowledge/render-stability-playbook.md`
  - 当前结论: 本机不渲；CI 矩阵抖动兜底；抽帧偏移 +片头帧；转场遮罩安全窗
  - 适用 scope: .github/workflows/, scripts/

## 决策

- **选型:** 方案 A——混合素材策略。叙事镜「站点真实截图打底 + Remotion 动效叠加」（新工作流混合渲染策略的站点素材版），数据镜纯 Remotion 重绘静态化真实数据（v2 已实证）；资产采集清单驱动（登记表反驱动采集脚本，系统 Chrome 短命进程，采集后清场），每图记来源 URL + 抓取日期入登记表；animatic 简板用已采集真实截图占位（非空框）。
- **对比方案:** B 全截图混剪（最快但跳出 Remotion 确定性体系，机检/缓存/重渲粒度全丢，水墨风格统一性受损，弃）；C 全 Remotion 重绘 + API 数据（= v2 原路，无新工作流增量，等于不做 v3，弃）
- **理由:** 用户裁定资源全部从网站找——真实截图是「真实发生过」的最强物证，与 v2 编年叙事的史料感同源；Remotion 叠加动效保住机检与镜级缓存体系；数据镜纯 Remotion 是数据动效令牌（凡量必滚）的主场

## 待确认点

1. 采集范围：关键页面/元素清单（Hero、墨点时间轴、生成式封面、书架、音乐年轮、弹幕、热力图、足迹、设计系统、页面漫游、打字机、播放器）以 asset-registry 首轮登记为准，Phase 1 用户过目
2. 截图分辨率与 DPR（拟 1920×1080 @2x）与亮暗主题取用（拟跟随站点默认亮色），Phase 1 定
3. 书封复用：v2 已采集 146 本真封面在 `public/wuh-site-intro-v2/books/`，v3 重新快照（书目可能变动）还是复用 v2 资产——Phase 1 按材料刷新结果定

## 任务

### Phase 1 素材层与资产层
- [ ] 素材库刷新：线上 API 快照（/api/visit-stats/stats、/api/content/posts、/api/about/activity、/api/repos/profile、/api/weread/books）+ 本地 git 快照（x.wuh.site 提交/标签/月度节奏）→ 基准日 2026-11-08 — `videos/preprod-wuh-site-intro-v3/assets/materials.md`
- [ ] 资产登记表首轮：S/P 两型（C 不激活），清单含页面截图/静态资源/API 数据图三类，标来源与日期 — `videos/preprod-wuh-site-intro-v3/assets/asset-registry.md`
- [ ] 采集脚本：清单驱动高清截图（系统 Chrome 短命进程，采集后清场）→ `public/wuh-site-intro-v3/`，登记表 ∅ → 文件 — `scripts/harvest-site-shots.mjs`

### Phase 2 前期五件套
- [ ] 剧本（编剧 subagent）：八幕骨架、编年对账更新至 2026-11-08、v2 修订经验入镜（S47 四列右起 / S56 脚注可读）、金句使用规划 — `videos/preprod-wuh-site-intro-v3/assets/script.md` → **交用户评审定稿后才许进分镜**
- [ ] 分镜（分镜师 subagent）：七列逐镜表 + 导演列（景别+运镜/光线/构图/尾帧/资产外键）+ 字数硬表 + 帧数对账表 — `videos/preprod-wuh-site-intro-v3/assets/storyboard.md`
- [ ] 动效规范（UE 动效大师 subagent）：令牌化 + 全镜覆盖矩阵 + 数据动效令牌必备 — `videos/preprod-wuh-site-intro-v3/assets/motion-spec.md`
- [ ] Animatic：new-video 脚手架 preprod 单元 + 单色简板（真实截图占位）+ Root 注册 + render-animatic.yml unit choice + CI 出片 — `videos/preprod-wuh-site-intro-v3/`, `src/Root.tsx`, `.github/workflows/render-animatic.yml`

### Phase 3 评审收口
- [ ] 内联预览页交用户定稿；定稿意见记录 — brief 本节
- [ ] `shots.mjs import --unit wuh-site-intro-v3` → `videos/wuh-site-intro-v3/shots-manifest.json`（帧数机器真源）+ check 全绿

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/video-production-flow.md`（并入「站点真实素材资产层」小节——混合渲染策略的非 AI 变体：站点截图打底 + Remotion 叠加；采集脚本与登记表溯源口径）
- **理由:** 资产层首次以「站点真实素材」形态落地（非 AI 生图），采集→登记→机检→animatic 占位链路是新口径；定稿后凭实证更新
