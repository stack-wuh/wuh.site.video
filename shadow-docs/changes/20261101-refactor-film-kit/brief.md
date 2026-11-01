---
{
  "schema": "shadow-dev/v1",
  "name": "20261101-refactor-film-kit",
  "type": "refactor",
  "scope": "video-studio",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "refactor/20261101-refactor-film-kit",
  "files": [
    "brand/film-kit",
    "shadow-docs/changes/20261101-refactor-film-kit",
    "shadow-docs/knowledge/video-studio-structure.md",
    "shadow-docs/menu.md",
    "videos/site-film/components",
    "videos/wuh-site-intro-v2/components"
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
    "verifiedCommit": "d9f152369edf61c00f102fde2455b4e33130c47d",
    "verifiedAt": "2026-11-01T06:04:50.667Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": null,
    "planHash": "799a3cd52e649b4aee18194f88da88cbec808e50ae85d3415be95348396793ca",
    "updatedAt": null,
    "lastError": null,
    "worktree": "/Users/wuhong/shadow-desktop/github/wuh.site.video/.worktrees/20261101-refactor-film-kit",
    "release": {
      "files": [
        "brand/film-kit",
        "shadow-docs/changes/20261101-refactor-film-kit",
        "shadow-docs/knowledge/video-studio-structure.md",
        "shadow-docs/menu.md",
        "videos/site-film/components",
        "videos/wuh-site-intro-v2/components"
      ],
      "message": "refactor(video-studio): brand/film-kit 组件公共层——五件上收 + 单元垫片",
      "title": "refactor(video-studio): brand/film-kit 组件公共层——五件上收 + 单元垫片",
      "body": "## 概述\n\n把两个正片单元重复实现的分镜组件上收为品牌公共层 `brand/film-kit/`，以「公共层 + 单元 re-export 垫片」迁移：既有 shots 的 import 一律不改、零行为变化。迁移动因：CameraRig/ShotShell 两单元逐字节相同（仅注释差一行），DustField 已是三份分叉；新单元（致郭襄正片在即）不会继续复制。延续 brand/ident 与 brand/motion.ts「上游共享 + 单元扩展」的既有模式。\n\n## 资产清单\n\n| 资产 | 迁移前分布 | 判定 | 说明 |\n|---|---|---|---|\n| CameraRig（含 ParallaxLayer/CamState） | v2 + site-film 逐字节相同 | 上收 | 公共版保留三层摄影机语义，去掉两家各自的 motion-spec § 编号；两单元垫片单行 re-export |\n| ShotShell | v2 + site-film 完全相同 | 上收 | 两单元垫片单行 re-export |\n| DustField | v2 + site-film + brand/ident 三份分叉 | 上收 v2 实现 | 公共版参数化：密度表由调用方 `acts` 注入；v2 垫片留 4 行适配器注入 DUST（表 3.5.1）；site-film 旧分叉（算术 seed，随机源不同）不迁；BrandDust（ident 专用边缘淡出）不动 |\n| Caption | 仅 v2 | 上收 | 零影片数据依赖，纯 re-export 垫片 |\n| PaperGrain | 仅 v2 | 上收 | 零影片数据依赖，纯 re-export 垫片 |\n| Grade | 仅 v2 | 不抽 | 4 行组件绑定 v2 私有 GRADES 数据形状；site-film 的 GRADES 是另一种形状（数组/lut）且在 shots 里当数据用，无 Grade 组件 |\n| Console 套件 | 仅 v2（s35–s42） | 不抽 | TILE_LABELS/TILE_RECTS 是影片内容（站点功能名），参数化反而更绕 |\n| 音频编排（fadeVol/SEGMENTS） | 两单元各自实现 | 不抽 | 编排数据全私有，fadeVol 单点使用，收益低于扰动 |\n| motion-tokens 通用令牌 | 两单元 re-export brand/motion | 不动 | 现状已是目标模式 |\n\n## 变更\n\n- 新增 `brand/film-kit/`：`CameraRig.tsx` / `ShotShell.tsx` / `Caption.tsx` / `PaperGrain.tsx` / `DustField.tsx`（acts 注入）\n- `videos/wuh-site-intro-v2/components/`：CameraRig / ShotShell / Caption / PaperGrain 改为单行 re-export 垫片；DustField 留适配器注入 DUST\n- `videos/site-film/components/`：CameraRig / ShotShell 改单行 re-export 垫片（DustField 旧分叉不动）\n- `shadow-docs/knowledge/video-studio-structure.md`：登记 film-kit 组件层、垫片接入方式与不抽口径；`shadow-docs/menu.md` 增「跨单元组件」路由\n\n## 迁移说明\n\n- 垫片保证既有 `../components/X` import 全部不变；`export *` 同时透传类型（CamState 等），全量 tsc 校验。\n- 公共层与原实现逐字节 diff：ShotShell/Caption/PaperGrain 仅 import 路径（`../../../brand/tokens` → `../tokens`）；CameraRig 仅去掉 § 编号注释；DustField 仅参数化（`acts[act] ?? acts[1]` ≡ 原 `DUST[act] ?? DUST[1]`，种子/位置/透明度公式未动）。\n- 硬约束遵守：`videos/self-intro/` 未触碰；`wuh-site-intro-v2` 的 shots/*.tsx 与帧时序零改动（与 main 零 diff）。\n\n## 验证\n\n- `pnpm check`（oxlint 1.90.0 + TypeScript 7.0.2）：lint 退出码 0、typecheck 退出码 0（明确绿/红，非静默）\n- `node scripts/shots.mjs check --unit wuh-site-intro-v2`：58 镜 Σ=8260 帧\n- `node scripts/shots.mjs check`（默认 site-film）：45 镜 Σ=7200 帧\n- 12 个改动/新增 TSX 全部通过 esbuild 语法校验；`videos/*/shots/` 与 main 零 diff\n- **证据缺口**：像素零变化的最终取证待 CI 出片抽帧对账（仓库纪律：本地不渲染）\n\n## 知识\n\n- 更新 `shadow-docs/knowledge/video-studio-structure.md`：brand/film-kit 成为跨单元组件唯一维护地，登记垫片接入与不抽口径（review 结论 passed，knowledge action=更新）。"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/video-studio-structure.md",
    "reason": "brand/film-kit 组件公共层是本仓新的长期结构事实（与 brand/ident 平级）：五个跨单元组件、垫片迁移模式与 site-film DustField 旧分叉保留口径需登记进结构卡，供新单元接入"
  }
}
---

# film-kit：跨单元分镜组件公共层与垫片迁移

## 动机

site-film 与 wuh-site-intro-v2 重复实现同一批分镜组件——CameraRig/ShotShell 两单元逐字节相同（仅 doc 注释 § 编号差一行），DustField 三处分叉（v2 为符合 random(seed) 纪律的现代版）。新单元（致郭襄正片在即）面临继续复制。brand/ident 与 brand/motion.ts 已确立「上游共享 + 单元 re-export 扩展」模式（2026-10-29 FilmShell change 已实证令牌再导出零视觉变化），本变更把该模式延伸到组件层：新建 `brand/film-kit/`，以「公共层 + 原路径垫片」低风险迁移，既有 shots/*.tsx 的 import 一律不改、零行为变化。

### 盘点清单（逐文件 diff 验证）

| 资产 | 所在 | 状态 | 结论 |
|---|---|---|---|
| CameraRig（含 ParallaxLayer/CamState） | v2 + site-film | 逐字节相同，仅注释 § 编号差一行 | 抽 |
| ShotShell | v2 + site-film | 完全相同（diff 为空） | 抽 |
| DustField | v2 + site-film + brand/ident(BrandDust) | 三份分叉：v2 用 remotion random(seed)；site-film 算术 seed 旧版（粒子位置不同）；BrandDust 带 ident 专用边缘淡出 | 抽 v2 实现为参数化组件；site-film 旧版不迁（随机源不同，替换会改变已发布影片像素）；BrandDust 不动 |
| Caption | 仅 v2 | 零影片数据依赖（只用 brand tokens） | 抽（纯 re-export 垫片） |
| PaperGrain | 仅 v2 | 零影片数据依赖 | 抽（纯 re-export 垫片） |
| Grade | 仅 v2 | 4 行组件绑定 v2 私有 GRADES 表；site-film 的 GRADES 是另一形状（数组/lut）且直接在 shots 里当数据用 | 不抽：无第二消费者、绑定影片私有数据形状 |
| Console 套件 | 仅 v2（s35–s42） | TILE_LABELS/TILE_RECTS 是 v2 影片内容（站点功能名） | 不抽：面板瓦片是影片内容，参数化反而更绕 |
| motion-tokens 通用令牌 | 两单元 | 现状已是目标模式（re-export brand/motion + 影片私有扩展）；FN-11–43 锚定 v2 motion-spec | 不动 |
| 音频 fadeVol/段编排 | v2（fadeVol+SEGMENTS）；site-film（内联 interpolate） | 模式相似但编排数据全私有；fadeVol 2 行单点使用 | 不抽：收益低于扰动 |

Import 全图已核：所有消费方都走单元内相对路径（`../components/X`），src/、self-intro、preprod 均不引用——垫片覆盖全部消费方，零 shots/*.tsx 改动。

## 复杂度评级
- **评级:** M
- **理由:** 无契约变更（单元原路径公开导出名与语义不变）；触及面为两正片单元组件 import 链（58+45 镜全量消费）与 brand 新目录；可发现性高（pnpm check + shots check 双绿 + grep 清零多重机器探针）。
- **期望验证深度:** unit（可重复机器探针：pnpm check / shots.mjs check 双单元 / import grep 清零 / esbuild 语法校验）
- **取证策略:** observation（渲染像素零变化的最终取证在 CI 出片；本地不渲染是仓库纪律）

## 领域模型

- **限界上下文:** video-materials — 品牌令牌、分镜组件与素材的唯一维护地。上游为 brand/motion.ts 令牌层与 brand/tokens.ts；下游为 videos/<unit>/ 各单元消费。反腐边界：film-kit 不反向依赖 videos/，密度表等影片私有配置由调用方注入。
- **统一语言增量:** film-kit＝brand 下跨单元可复用分镜组件层（与 ident 平级）；垫片＝单元原路径文件改为 re-export，保证既有 import 不变。
- **聚合与不变量:**
  - `INV-1 shots 清单（聚合根 videos/<unit>/shots）`: wuh-site-intro-v2 check 58 镜 Σ8260、site-film check 45 镜 Σ7200 迁移前后不变；所有 shots/*.tsx 零改动（wuh-site-intro-v2 正在 CI 出片，帧时序不得动）。
  - `INV-2 单元公开导出（聚合根 videos/<unit>/components）`: 原路径导出名与语义不变（CameraRig/ParallaxLayer/CamState/ShotShell/Caption/PaperGrain/DustField），`pnpm check` 跑出明确绿。
  - `INV-3 渲染像素（聚合根 film comp）`: 两单元渲染输出零变化——site-film DustField 旧分叉与 brand/ident/dust.tsx 保持不动；像素级取证留 CI 出片观察点。
- **领域事件:** brief approve → apply 建层迁移 → review 对账 INV-1/2/3 → release 出 PR（正文含盘点表与迁移说明）；合入后新单元直接从 film-kit 取件。

## 引用规范
- shadow-docs/knowledge/video-studio-structure.md
  - 当前结论: 三层结构，brand 唯一事实源；质量门 `pnpm check`（oxlint 1.90.0 + TS 7.0.2）；本机 shadow-dev CLI 须绕开沙箱
  - 适用 scope: brand/ videos/ scripts/
- shadow-docs/knowledge/render-stability-playbook.md
  - 当前结论: 改 N 处引用必须 grep 清零；typecheck 必须跑出明确绿/红，静默失败不算验证
  - 适用 scope: videos/ brand/
- shadow-dev-workflow norms/code-style.md（通用）
  - 当前结论: 不为未来场景提前增加抽象；文件名遵循所在包相邻约定；渐进式治理，不顺手扩大范围
  - 适用 scope: 全仓

## 决策
- **选型:** 方案 A — `brand/film-kit/` 公共层 + 单元原路径垫片
- **对比方案:** B `brand/components/`（同样可行但命名过泛，ident 已示范按语义命名目录）；C 只合并三件套不建层（改动最小，但 Caption/PaperGrain 这类零依赖通用件仍留单元，新片继续复制）。
- **理由:** 延续 brand/ident 与 brand/motion.ts 的「上游共享 + 单元再导出」既有模式，垫片保证 import 不改、可整体回退。DustField 因 act→密度表是影片私有配置，公共版参数化（`acts` 注入、`Record<number,{count,speed,gold}>`），v2 原文件留 4 行适配器注入 DUST——唯一非纯 re-export 的垫片。Grade/Console/音频编排/motion-tokens 不抽的理由见盘点清单（code-style：不为未来场景提前抽象）。CameraRig 公共版注释去掉两单元各自的 motion-spec § 编号，保留三层摄影机说明。

## 任务
### Phase 1
- [x] 建 brand/film-kit/ 五件 — `brand/film-kit/{CameraRig,ShotShell,Caption,PaperGrain,DustField}.tsx` — 以 v2 现行实现为源建公共层；DustField 参数化（acts 注入）
- [x] v2 垫片 — `videos/wuh-site-intro-v2/components/{CameraRig,ShotShell,Caption,PaperGrain}.tsx` — 单行 re-export；`DustField.tsx` — 适配器注入 DUST
- [x] site-film 垫片 — `videos/site-film/components/{CameraRig,ShotShell}.tsx` — 单行 re-export（DustField 旧分叉不迁）

### Phase 2
- [x] 机器探针全绿 — `pnpm check`；`node scripts/shots.mjs check --unit wuh-site-intro-v2`（58 镜 Σ8260）；默认 site-film check（45 镜 Σ7200）；改动 TSX esbuild 语法校验；import 引用 grep 清零

## 结果
- 实际耗时: —
- 验证: —

## 知识评估
- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/video-studio-structure.md
- **理由:** film-kit 成为组件层唯一维护地，结构卡的「三层结构 / 家族片头片尾」段需补一行组件层口径。
