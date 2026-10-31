---
{
  "schema": "shadow-dev/v1",
  "name": "20261031-docs-scaffold-knowledge-fix",
  "type": "docs",
  "scope": "video-materials",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "docs/20261031-docs-scaffold-knowledge-fix",
  "files": [
    "shadow-docs/changes/20261031-docs-scaffold-knowledge-fix",
    "shadow-docs/knowledge/video-studio-structure.md"
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
    "verifiedCommit": "de55e011ef33a23e049f4757454affd8c7ff304b",
    "verifiedAt": "2026-10-31T03:41:52.330Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": null,
    "planHash": "f5cac266ed94c560f0e4a11bb40c61aa46a1754bdf980c71c3c4014dd48c399b",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        "shadow-docs/changes/20261031-docs-scaffold-knowledge-fix",
        "shadow-docs/knowledge/video-studio-structure.md"
      ],
      "message": "docs(shadow): 修正脚手架知识口径——routes.ts 自动生成与 typecheck 验证",
      "title": "修正视频脚手架知识口径：routes.ts 自动生成 · typecheck 验证",
      "body": "## 变更\n\n修正 `shadow-docs/knowledge/video-studio-structure.md` 两处与代码不一致的口径：\n\n- 执行约束：`pnpm new-video <slug>` 现自动生成 `routes.ts` 并默认接入 FilmShell，Root 注册只需一行 import + spread；`render:<slug>` 脚本仍手动添加\n- 验证方式：`node --check` 对 `.tsx` 无效，改为「临时 slug 生成 → `pnpm typecheck` → 移除临时目录」\n- frontmatter：追加本次 brief 的 source，刷新 verified\n\n## 验证\n\nS 级：diff 走查 + 与 `scripts/new-video.mjs` 输出逐句核对（FilmShell / routes.ts / totalFilmFrames 三处属实），`package.json` 的 `typecheck` 脚本存在。"
    }
  },
  "knowledge": {
    "action": "无需变更",
    "target": null,
    "reason": "变更本体为知识卡口径修正，diff 已覆盖，无追加知识动作"
  }
}
---

# 修正视频脚手架知识口径（routes.ts 自动生成与 typecheck 验证）

## 动机

家族片头片尾套件（PR #7）合入后，`new-video.mjs` 已自动生成 `videos/<slug>/routes.ts` 并默认接入 FilmShell，但 `shadow-docs/knowledge/video-studio-structure.md` 的两处口径仍描述旧流程：执行约束只写「手动在 Root 注册」，验证方式写的 `node --check` 对 `.tsx` 无效。修正为与代码一致的执行真相，避免下一支视频按旧口径操作。

## 复杂度评级

- **评级:** S
- **理由:** 纯文档口径修正——零行为契约变更、零代码触及、无运行时路径；唯一验收对象是卡片文本与代码事实一致。
- **期望验证深度:** code-read
- **取证策略:** observation

## 引用规范

- shadow-docs/knowledge/video-studio-structure.md
  - 当前结论: `pnpm new-video <slug>` 生成骨架；注册与验证按卡片执行约束/验证方式两节
  - 适用 scope: 本卡片自身（brand/, videos/, scripts/, src/Root.tsx）

## 决策

- **选型:** 原位修订 `video-studio-structure.md` 两处（执行约束、验证方式），并给 frontmatter 追加本次 brief 的 source、刷新 verified。
- **对比方案:** 新建一张「脚手架」卡片——同类主题已在该卡（`keywords` 已含 new-video/脚手架），按 `norms/knowledge-cards.md` 优先更新而非新建；另写文档——仓库无独立文档位，不引入。
- **理由:** 一致性修正应落在执行真相的唯一维护地。

## 任务

### Phase 1 修订

- [x] 执行约束改为：生成器产出组件 + routes.ts，Root 注册只需一行 import 并 spread 进 films 分组，render 脚本仍手动 — `shadow-docs/knowledge/video-studio-structure.md` — 补 routes.ts 自动生成
- [x] 验证方式：`node --check` 改为「临时 slug 生成 → `tsc --noEmit` → 移除」 — `shadow-docs/knowledge/video-studio-structure.md` — 对齐本次脚手架实证
- [x] frontmatter 追加 source 与 verified 并走查卡片与代码事实一致 — `shadow-docs/knowledge/video-studio-structure.md` — 观察点

## 结果

- 实际耗时: —
- 验证: —（S 级：diff 走查 + 卡片与 `scripts/new-video.mjs` 输出逐句核对）

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/video-studio-structure.md`
- **理由:** 本次变更本体即知识修正，review 无需再叠加知识动作。
