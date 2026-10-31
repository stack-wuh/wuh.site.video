---
{
  "schema": "shadow-dev/v1",
  "name": "20261031-feature-wuh-site-intro-v2-production",
  "type": "feature",
  "scope": "video-production",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "feature/20261031-feature-wuh-site-intro-v2-production",
  "files": [
    ".github/workflows/render-film.yml",
    "scripts/render-film.mjs",
    "scripts/shots.mjs",
    "shadow-docs/changes/20261031-feature-wuh-site-intro-v2-production",
    "shadow-docs/knowledge/render-stability-playbook.md",
    "shadow-docs/knowledge/video-production-flow.md",
    "src/Root.tsx",
    "videos/wuh-site-intro-v2"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "869c90997824372153bd6bf5769c6e54615f63b9",
    "verifiedAt": "2026-10-31T16:23:30.894Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": null,
    "planHash": "1e1565408dd543795f6a6b7ca97f85d67a572ed228144c809c8e11af8d4c27ee",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        ".github/workflows/render-film.yml",
        "scripts/render-film.mjs",
        "scripts/shots.mjs",
        "shadow-docs/changes/20261031-feature-wuh-site-intro-v2-production",
        "shadow-docs/knowledge/render-stability-playbook.md",
        "shadow-docs/knowledge/video-production-flow.md",
        "src/Root.tsx",
        "videos/wuh-site-intro-v2"
      ],
      "message": "feat(video-production): wuh.site.intro.v2 正式制作——57 镜实装 · 124 令牌 · FilmShell 三段装配",
      "title": "wuh.site.intro.v2 正式制作：八幕 57 镜实装 · 124 令牌 · 三段装配出片",
      "body": "## 概述\n\nwuh.site.intro.v2 正式制作：按前期定稿（八幕 57 镜 / 7658f）实装镜头、124 令牌、七段配乐与 FilmShell 三段装配；全片 7958f = 4:25.3。`videos/self-intro/` 与 `videos/site-film/` 零行为变化。\n\n## 变更\n\n- `videos/wuh-site-intro-v2/`：motion-tokens（124 令牌：brand 10 + FN-11–43 + 八幕锚点/调色/数据口径/heatCells）、components（ShotShell / CameraRig / DustField / PaperGrain / Caption / Grade / Console）、57 个 `shots/sNN.tsx`、WuhSiteIntroV2（FilmShell 120+7658+180）、WuhSiteIntroV2Audio（七段复用三轨：片头静默 / 45f 淡入 / 片尾 180f 淡出）、`film.config.json`、sync 生成的 manifest/registry/routes。\n- `scripts/shots.mjs`：sync/check 读 `film.config.json` 的 shell 声明生成 film/audio 路由时长（无配置 = 原口径）。\n- `scripts/render-film.mjs`：`--unit`（默认 site-film）派生 composition 前缀 / 缓存 / 音轨 / 中间产物；shell 单元装配「片头 + shots + 片尾」三段；终验对 filmTotalFrames（7958）。\n- `.github/workflows/render-film.yml`：`film` 输入（默认 site-film），plan / shots / assemble 全链路参数化。\n- `src/Root.tsx`：注册 WuhSiteIntroV2 路由。\n- 知识卡：video-production-flow 增「多片化」；render-stability-playbook 增 FilmShell 三段装配。\n\n## 验证\n\n- `shots.mjs sync/check --unit wuh-site-intro-v2`：57 镜 Σ=7658 全绿；routes 的 film/audio 时长为 7958。\n- 默认 `shots.mjs check`（site-film）：45 镜 Σ=7200 回归绿。\n- 57 镜静态对账：0 处色值字面量、0 处禁用 API、58 条 import 全部解析、字幕逐镜逐字（s02 题记按分镜补 Caption；s47 画面落款不上字幕）。\n- `render-film.yml` YAML 解析通过；两个渲染脚本 `node --check` 通过。\n- **证据缺口**：整片 CI 出片（ffprobe 7958 帧 + volumedetect + 人工走查）待合并后以 `film=wuh-site-intro-v2` 触发 render-film；本机无 node_modules，tsc 交 CI 打包门禁。"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/video-production-flow.md, shadow-docs/knowledge/render-stability-playbook.md",
    "reason": "多片生产落地：57 镜 / 124 令牌 / FilmShell 三段装配 / render-film --unit 与 CI film 输入"
  }
}
---

# wuh.site.intro.v2 正式制作：57 镜实装 · 124 令牌 · 三段装配出片

## 动机

前期五件套定稿并审片通过（八幕 57 镜 / 7658f；FilmShell 120+180 → 7958f / 4:25.3）。本 change 进入第二段：把分镜与动效规范落成 57 个镜头组件、令牌库、配乐与三段装配，经 render-film CI 出片 `{yyyyMMdd}-{序号}-wuh-site-intro-v2.mp4`。`videos/self-intro/` 与 `videos/site-film/` 均不动。

## 复杂度评级

- **评级:** L
- **理由:** 57 镜实装 + 124 令牌落地 + 渲染脚本与 CI 多片参数化 + 音轨七段编排；帧契约已由 manifest 锁定（7658 / 7958），叙事与动效决策已在前期冻结，本阶段是把规范变成像素。

## 决策

- **单元结构:** 照 site-film——`motion-tokens.ts`（brand 10 个基元再导出 + 33 个新函数 + 八幕锚点 / 调色 / 转场常量）、`components/`（ShotShell / CameraRig 视差景深 / DustField）、`shots/sNN.tsx`×57、`WuhSiteIntroV2.tsx`（FilmShell 包 7658f → 7958f）、`WuhSiteIntroV2Audio.tsx`；`shots/` 视图与 routes 由 `shots.mjs sync --unit wuh-site-intro-v2` 生成。
- **FilmShell 三段装配:** 成片 = 品牌片头 120f + 57 镜 7658f + 品牌片尾 180f；meta =「雾失楼台，月迷津渡」/「2019 → 2026 · wuh.site 实现历程」/「WUH.SITE INTRO V2 · 2026-10」。
- **shell 声明:** `videos/wuh-site-intro-v2/film.config.json` = `{ "shell": { "intro": 120, "outro": 180 } }`；`shots.mjs sync` 读到则 film / audio 路由时长用 `totalFilmFrames()`；`render-film.mjs` 读到则装配时渲染片头 / 片尾帧段（对 film comp 取 frameRange）并按 intro + shots + outro 拼接。site-film 无此文件，行为不变。
- **多片参数化:** `render-film.mjs` 增 `--unit`（默认 site-film）；composition 前缀、音频 id、缓存目录、中间产物、状态文件随 unit 派生；输出命名沿用 `{yyyyMMdd}-{序号}-{manifest.film}.mp4`。`render-film.yml` 增 `film` 输入（默认 site-film），plan / shots / assemble 读对应 manifest 并传 `--unit`。
- **配乐（用户拍板）:** 复用 `public/site-film` 三轨做分段编排；片头 120f 静默、正片 45f 淡入、片尾 180f 淡出；禁用 `<Audio loop>`（playbook 实证）。
- **实装编排:** 骨架（tokens / components / film / audio / 渲染链路）先落地；57 镜按幕分八批实装（独立文件、零共享状态），每批以分镜行 + 矩阵行 + 令牌为唯一依据。
- **验证口径:** `shots.mjs sync/check` 57 镜 / 7658f；CI 打包过；整片出片 ffprobe 7958 帧 + 音轨 volumedetect；site-film 默认回归不变（`--unit` 缺省行为零改动）。

## 任务

### Phase 1 骨架

- [x] motion-tokens：124 令牌落地（brand 10 复用 + 33 新函数 + 八幕锚点 / 调色 / 转场常量） — `videos/wuh-site-intro-v2/motion-tokens.ts`
- [x] components：ShotShell / CameraRig / DustField 与共用基元 — `videos/wuh-site-intro-v2/components/`
- [x] film + audio：WuhSiteIntroV2（FilmShell 装配）与 WuhSiteIntroV2Audio（分段编排） — `videos/wuh-site-intro-v2/`
- [x] shell 声明与 sync：film.config.json + shots.mjs sync 支持 shell 时长（site-film 行为不变） — `videos/wuh-site-intro-v2/film.config.json`, `scripts/shots.mjs`
- [x] 生成物与注册：sync 产出 manifest / registry / routes；Root 注册 — `videos/wuh-site-intro-v2/`, `src/Root.tsx`

### Phase 2 镜头实装（按幕八批）

- [x] Act 1 s01–s07（序章 · 720f） — `videos/wuh-site-intro-v2/shots/`
- [x] Act 2 s08–s15（手艺年 · 1152f） — `videos/wuh-site-intro-v2/shots/`
- [x] Act 3 s16–s22（第一行 · 990f） — `videos/wuh-site-intro-v2/shots/`
- [x] Act 4 s23–s28（留白 · 780f） — `videos/wuh-site-intro-v2/shots/`
- [x] Act 5 s29–s34（复燃 · 798f） — `videos/wuh-site-intro-v2/shots/`
- [x] Act 6 s35–s42（入院 · 924f） — `videos/wuh-site-intro-v2/shots/`
- [x] Act 7 s43–s49（坐忘 · 1068f） — `videos/wuh-site-intro-v2/shots/`
- [x] Act 8 s50–s57（现在 · 1226f） — `videos/wuh-site-intro-v2/shots/`

### Phase 3 渲染链路

- [x] render-film.mjs：`--unit` + shell 三段装配（片头 / 片尾帧段 + shots 拼接） — `scripts/render-film.mjs`
- [x] render-film.yml：`film` 输入（默认 site-film），按片读 manifest 并传 `--unit` — `.github/workflows/render-film.yml`

### Phase 4 验证

- [x] `shots.mjs sync/check --unit wuh-site-intro-v2` 57 镜 / 7658f；site-film 默认 check 回归零变化 — `videos/wuh-site-intro-v2/`, `scripts/shots.mjs`
- [x] 静态对账：57 镜纪律扫描（色值字面量 / 禁用 API / 导入解析 / 字幕逐字） — `videos/wuh-site-intro-v2/shots/`

## 结果

- 实际耗时: 约 4 小时（骨架与链路 ~1.5h，57 镜八批并行 ~1.5h，收口与对账 ~1h）
- 验证:
  - 骨架：motion-tokens 落地 124 令牌（FN-43 枚）+ FILM_COLORS/GRADES/ANCHORS/DATA/heatCells；components 7 个；WuhSiteIntroV2（FilmShell 120+7658+180）+ WuhSiteIntroV2Audio 七段编排；`film.config.json` shell=120/180。
  - `shots.mjs sync` 生成 registry（57 镜）/routes：film 与 audio 路由均为 7958（shell 感知）；`check --unit wuh-site-intro-v2` 全绿（57 镜 Σ=7658）；默认 `check`（site-film）45 镜 Σ=7200 回归绿——`--unit`/shell 改动零影响。
  - 静态对账：57 镜 0 处色值字面量、0 处禁用 API（Math.random/<Audio/TODO）、58 条 import 全部解析（motion-tokens/components 导出齐全）、每镜文件头与默认导出合规；字幕逐镜逐字对上分镜（s02 题记按分镜补 Caption 与画面文字并置，s12 多行写法、s54 五段数据驱动均已核对；s47 为画面落款、按分镜不上字幕）。
  - `render-film.yml` / `render-animatic.yml` Ruby YAML 解析通过；`node --check` 对两个渲染脚本语法通过。
  - **证据缺口:** 整片 CI 出片（ffprobe 7958 帧 + volumedetect + 人工走查）需合并后由 `render-film` 以 `film=wuh-site-intro-v2` 触发；本机无 node_modules 不可渲、tsc 交 CI 打包门禁。

## 知识评估

- **预期影响:** 更新
- **目标卡片:** shadow-docs/knowledge/video-production-flow.md, shadow-docs/knowledge/render-stability-playbook.md
- **理由:** 第二片成片实证——57 镜实装、多片渲染参数化、shell 三段装配与 CI 出片路径
