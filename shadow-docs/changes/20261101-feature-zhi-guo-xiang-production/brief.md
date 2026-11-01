---
{
  "schema": "shadow-dev/v1",
  "name": "20261101-feature-zhi-guo-xiang-production",
  "type": "feature",
  "scope": "video-production",
  "status": "published",
  "baseBranch": "main",
  "branch": "feature/20261101-feature-zhi-guo-xiang-production",
  "files": [
    ".github/workflows/render-film.yml",
    "scripts/mux-bgm.mjs",
    "shadow-docs/changes/20261101-feature-zhi-guo-xiang-production",
    "src/Root.tsx",
    "videos/zhi-guo-xiang"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": 42,
    "pullRequestUrl": "https://github.com/stack-wuh/wuh.site.video/pull/42"
  },
  "review": {
    "conclusion": "pending",
    "verifiedCommit": null,
    "verifiedAt": null
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:42",
    "planHash": "861092e41475f8e76fd961128fe09f083e2b06d97ecd77dee2640a3b2cfb7c82",
    "updatedAt": null,
    "lastError": null,
    "worktree": "/Users/wuhong/shadow-desktop/github/wuh.site.video/.worktrees/20261101-feature-zhi-guo-xiang-production",
    "commit": {
      "files": [
        ".github/workflows/render-film.yml",
        "scripts/mux-bgm.mjs",
        "shadow-docs/changes/20261101-feature-zhi-guo-xiang-production/brief.md",
        "src/Root.tsx",
        "videos/zhi-guo-xiang/ZhiGuoXiang.tsx",
        "videos/zhi-guo-xiang/ZhiGuoXiangAudio.tsx",
        "videos/zhi-guo-xiang/components/AscendScene.tsx",
        "videos/zhi-guo-xiang/components/CameraRig.tsx",
        "videos/zhi-guo-xiang/components/Caption.tsx",
        "videos/zhi-guo-xiang/components/DustField.tsx",
        "videos/zhi-guo-xiang/components/Figure.tsx",
        "videos/zhi-guo-xiang/components/Objects.tsx",
        "videos/zhi-guo-xiang/components/ShotShell.tsx",
        "videos/zhi-guo-xiang/film.config.json",
        "videos/zhi-guo-xiang/motion-tokens.ts",
        "videos/zhi-guo-xiang/routes.tsx",
        "videos/zhi-guo-xiang/shots/manifest.ts",
        "videos/zhi-guo-xiang/shots/registry.ts",
        "videos/zhi-guo-xiang/shots/s01.tsx",
        "videos/zhi-guo-xiang/shots/s02.tsx",
        "videos/zhi-guo-xiang/shots/s03.tsx",
        "videos/zhi-guo-xiang/shots/s04.tsx",
        "videos/zhi-guo-xiang/shots/s05.tsx",
        "videos/zhi-guo-xiang/shots/s06.tsx",
        "videos/zhi-guo-xiang/shots/s07.tsx",
        "videos/zhi-guo-xiang/shots/s08.tsx",
        "videos/zhi-guo-xiang/shots/s09.tsx",
        "videos/zhi-guo-xiang/shots/s10.tsx",
        "videos/zhi-guo-xiang/shots/s11.tsx",
        "videos/zhi-guo-xiang/shots/s12.tsx",
        "videos/zhi-guo-xiang/shots/s13.tsx",
        "videos/zhi-guo-xiang/shots/s14.tsx",
        "videos/zhi-guo-xiang/shots/s15.tsx",
        "videos/zhi-guo-xiang/shots/s16.tsx",
        "videos/zhi-guo-xiang/shots/s17.tsx",
        "videos/zhi-guo-xiang/shots/s18.tsx",
        "videos/zhi-guo-xiang/shots/s19.tsx",
        "videos/zhi-guo-xiang/shots/s20.tsx",
        "videos/zhi-guo-xiang/shots/s21.tsx",
        "videos/zhi-guo-xiang/shots/s22.tsx",
        "videos/zhi-guo-xiang/shots/s23.tsx",
        "videos/zhi-guo-xiang/shots/s24.tsx",
        "videos/zhi-guo-xiang/shots/s25.tsx",
        "videos/zhi-guo-xiang/shots/s26.tsx",
        "videos/zhi-guo-xiang/shots/s27.tsx",
        "videos/zhi-guo-xiang/shots/s28.tsx",
        "videos/zhi-guo-xiang/shots/s29.tsx",
        "videos/zhi-guo-xiang/shots/s30.tsx",
        "videos/zhi-guo-xiang/shots/s31.tsx",
        "videos/zhi-guo-xiang/shots/s32.tsx",
        "videos/zhi-guo-xiang/shots/s33.tsx",
        "videos/zhi-guo-xiang/shots/s34.tsx",
        "videos/zhi-guo-xiang/shots/s35.tsx",
        "videos/zhi-guo-xiang/shots/s36.tsx",
        "videos/zhi-guo-xiang/shots/s37.tsx",
        "videos/zhi-guo-xiang/shots/s38.tsx",
        "videos/zhi-guo-xiang/shots/s39.tsx",
        "videos/zhi-guo-xiang/shots/s40.tsx",
        "videos/zhi-guo-xiang/shots/s41.tsx",
        "videos/zhi-guo-xiang/shots/s42.tsx",
        "videos/zhi-guo-xiang/shots/s43.tsx",
        "videos/zhi-guo-xiang/shots/s44.tsx",
        "videos/zhi-guo-xiang/shots/s45.tsx",
        "videos/zhi-guo-xiang/shots/s46.tsx",
        "videos/zhi-guo-xiang/shots/s47.tsx",
        "videos/zhi-guo-xiang/shots/s48.tsx",
        "videos/zhi-guo-xiang/shots/s49.tsx",
        "videos/zhi-guo-xiang/shots/s50.tsx",
        "videos/zhi-guo-xiang/shots/s51.tsx",
        "videos/zhi-guo-xiang/shots/s52.tsx"
      ],
      "message": "feat(video): 致郭襄正式制作——52 镜实装 · 共享件整合 · 静默成片 + 本地 BGM mux"
    }
  }
}
---

# 《风陵 · 致郭襄》正式制作：52 镜实装 · 106 令牌 · 三段装配 · 本地 BGM mux

## 动机

前期五件套、人物视觉设定、动效规范与 animatic 已定稿并归档（PR #37、#39）。本 change 进入第二段：把 52 镜分镜照 106 令牌落成 Remotion 镜头文件，经 manifest 驱动装配成 FilmShell 7500f（片头 120 + 正片 7200 + 片尾 180），由 `render-film.yml` CI 出无声画面，再按 `music.md` 做本地 BGM mux，交用户验收。

## 复杂度评级

- **评级:** L
- **理由:** 契约变更——新增生产单元 `videos/zhi-guo-xiang` 的 52 个镜头、106 令牌、FilmShell 装配、静默音轨与本地 BGM mux；触及面大（52 镜 + 装配 + 渲染链路）；可发现性高——`shots.mjs sync/check`、typecheck、CI 7500f ffprobe、本地 mux 250s 均可机检。
- **期望验证深度:** runtime
- **取证策略:** observation

## 领域模型

- **限界上下文:** video-materials — 视频工程、品牌令牌、分镜组件与素材的唯一维护地。上游只读：已归档的 `preprod-zhi-guo-xiang` 五件套与 `music.md`；下游：B 站成片发布。反腐边界：不修改前期资产、不把版权音频提交进仓库。
- **统一语言增量:**
  - **生产单元 `zhi-guo-xiang`**：`videos/zhi-guo-xiang/`，52 镜 + 令牌 + 装配 + 静默音轨；`shots-manifest.json` 为帧数真源。
  - **标准背影 `AscendBack`**：4-4（S30）与 5-1（S31）共用的同一组件、同一 local 帧；第 239 帧像素差分 0。
  - **本地 BGM mux**：成片保持无声；CI 出画面后按 `music.md` 在 4320 断点做两遍混音；音频不入仓。
- **聚合与不变量:**
  - `INV-1 生产单元`：`shots.mjs sync --unit zhi-guo-xiang` 生成 52 镜 manifest/registry/routes；正片 7200f；Composition `ZhiGuoXiang` 与 `ZhiGuoXiangAudio` 均为 7500f（`totalFilmFrames(7200)`）。
  - `INV-2 镜头实装`：52 个 `shots/sNN.tsx` 全部存在，local 帧 0 起；每个镜按分镜画面/镜头语言与动效矩阵令牌实装；零内联 hex/字体字面量（`brand/tokens` + `motion-tokens`）。
  - `INV-3 装配`：FilmShell 120 + 7200 + 180 = 7500f；meta = 《风陵 · 致郭襄》/「四分钟武侠诗电影」/「网络流传 · 托名程灵素」；正片末帧 7199。
  - `INV-4 重讲`：S30/S31 共用 `<AscendBack f={0–239} />` 与 local 帧；第 239 帧像素差分 0。
  - `INV-5 原片`：`videos/site-film/`、`videos/self-intro/`、`videos/wuh-site-intro-v2/`、`videos/preprod-wuh-site-intro-v2/`、`videos/preprod-zhi-guo-xiang/` 零改动。
  - `INV-6 音频`：成片与 CI 产物无声；`ZhiGuoXiangAudio` 不含 `<Audio>`；BGM 仅本地 mux，250s；音频不入仓。
  - `INV-7 验证`：typecheck 绿；`shots.mjs check --unit zhi-guo-xiang` 绿；CI `render-film.yml` `film=zhi-guo-xiang` 出 7500f；ffprobe 帧数/时长/静默音轨；本地 mux ffprobe 250s。
- **领域事件:** CI 7500f 出片 → 本地 BGM mux → 用户验收 → 另立 change 发布/归档。

## 引用规范

- shadow-docs/knowledge/video-production-flow.md
  - 当前结论: 两段式；前期五件套 + 人物视觉设定；文学改编/诗电影；animatic CI 多片；本地 BGM mux
  - 适用 scope: videos/, shadow-docs/knowledge/
- shadow-docs/knowledge/video-studio-structure.md
  - 当前结论: 工作室三层；FilmShell 120+180；`render-film.mjs --unit` 多片；node 22 / port 3211 / crf16；staticFile 以 public/ 为根
  - 适用 scope: brand/, videos/, scripts/, src/Root.tsx, public/
- shadow-docs/knowledge/render-stability-playbook.md
  - 当前结论: 渲染前清场；镜级缓存；分块收敛梯；`<Audio loop>` 禁用；半透明渐变改硬切
  - 适用 scope: videos/, scripts/, out/
- norms/code-style.md
  - 当前结论: TS 禁 any、单一职责、无 TODO；分镜组件禁内联色值/字体
  - 适用 scope: 全部新增 TS 代码

## 决策

- **选型:** 照 intro-v2 生产骨架——`film.config.json` shell 120/180 → `shots.mjs sync --unit zhi-guo-xiang` 反生成 `shots/manifest.ts`/`registry.ts`/`routes.tsx` → `ZhiGuoXiang.tsx` 遍历 manifest + `ShotShell` → `ZhiGuoXiangAudio` 静默轨 → Root 注册。
- **对比方案:** 单文件 52 镜（改一镜重渲全片，弃）；复用 animatic 简板（不是正式视觉，弃）。
- **令牌:** `motion-tokens.ts` 落地 106 枚（brand 再导出 + 影片私有 `FILM.snowCyan/nightBlue/fireGold` + FIGURE/POSE/STROKE/GR/CV/SP/RH/CM/PT/TR/FN）；分镜只引用令牌。
- **实装编排:** 骨架先行；52 镜按幕六批（Act1 S1–S4 / Act2 S5–S12 / Act3 S13–S24 / Act4 S25–S30 / Act5 S31–S44 / Act6 S45–S52），独立文件、零共享状态，可并行 subagent。
- **音频:** 成片与 CI 无声；`scripts/mux-bgm.mjs` 按 `music.md` 做「第一遍 → 门开静默 → 4320 重启 → 末 3s 淡出」；音频路径由用户本地提供，不入仓。
- **渲染:** `render-film.mjs --unit zhi-guo-xiang` / CI `render-film.yml` `film=zhi-guo-xiang`；本地渲染 exit 139 已知，以 CI 出片为准，ffprobe 7500f。
- **隔离手段:** 主仓 main 干净；本 change 用独立 worktree `.worktrees/20261101-feature-zhi-guo-xiang-production`，基线 main，不碰其它 worktree。
- **非目标:** 不改前期资产、不改分镜/动效规范、不改品牌令牌、不提交版权音频。

## 任务

### Phase 1 骨架与令牌

- [x] `motion-tokens.ts`：106 令牌落地（brand 再导出 + FILM 私有色 + FIGURE/POSE/STROKE + CV/SP/RH/CM/PT/TR/GR/FN）— `videos/zhi-guo-xiang/motion-tokens.ts`
- [x] `ShotShell` / `CameraRig` / `DustField`：全局视觉、视差景深、光尘 — `videos/zhi-guo-xiang/components/`
- [x] `ZhiGuoXiang.tsx`（FilmShell 7200f）+ `ZhiGuoXiangAudio.tsx`（静默）+ `film.config.json` — `videos/zhi-guo-xiang/`
- [x] `shots.mjs sync --unit zhi-guo-xiang` 生成 manifest/registry/routes；Root 注册 `zhiGuoXiangRoutes` — `videos/zhi-guo-xiang/`, `src/Root.tsx`

### Phase 2 52 镜实装（按幕六批）

- [x] Act 1 S1–S4（720f）— `videos/zhi-guo-xiang/shots/`
- [x] Act 2 S5–S12（900f）— `videos/zhi-guo-xiang/shots/`
- [x] Act 3 S13–S24（1500f）— `videos/zhi-guo-xiang/shots/`
- [x] Act 4 S25–S30（960f）— `videos/zhi-guo-xiang/shots/`
- [x] Act 5 S31–S44（1920f）— `videos/zhi-guo-xiang/shots/`
- [x] Act 6 S45–S52（1200f）— `videos/zhi-guo-xiang/shots/`

### Phase 3 音频与出片

- [ ] `scripts/mux-bgm.mjs`：按 `music.md` 两遍 mux（静默成片 + 本地音频 → 250s）— `scripts/mux-bgm.mjs`
- [ ] CI `render-film.yml` `film=zhi-guo-xiang` 出 7500f → ffprobe 对账 → 本地 BGM mux → 交用户验收 — `out/`

## 结果

- 实际耗时: —
- 验证: —（L 级逐条 INV 对账：sync/check、typecheck、CI 7500f ffprobe、本地 mux 250s、原片零改动）

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/video-production-flow.md`、`shadow-docs/knowledge/video-studio-structure.md`
- **理由:** 本片是首支「文学改编 / 诗电影」从前期到正式制作的全链路；52 镜实装、静默音轨 + 本地 BGM mux、`render-film --unit` 的多片生产口径应写入流程与结构卡。
