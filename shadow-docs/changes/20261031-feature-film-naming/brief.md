---
{
  "schema": "shadow-dev/v1",
  "name": "20261031-feature-film-naming",
  "type": "feature",
  "scope": "video-materials",
  "status": "proposed",
  "baseBranch": "main",
  "branch": null,
  "files": [
    ".github/workflows/render-film.yml",
    "scripts/render-film.mjs"
  ],
  "github": {
    "repository": "stack-wuh/wuh.site.video",
    "issue": 25,
    "issueUrl": "https://github.com/stack-wuh/wuh.site.video/issues/25",
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
    "checkpoint": "issue:25",
    "planHash": "85727cd58eedf7030bf2cec16c71ab2085c546eb553a998fdb0ada80f9f9bedf",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] 成片命名规范 {yyyyMMdd}-{序号}-{项目名}",
      "titleRaw": "[feature] 成片命名规范 {yyyyMMdd}-{序号}-{项目名}",
      "supplement": "assemble 终装产物按 {yyyyMMdd}-{序号}-{项目名}.mp4 命名（序号=项目内版本递增），每次渲染不再互相覆盖。详见 shadow-docs/changes/20261031-feature-film-naming/brief.md",
      "body": "## 动机\n成片产物当前固定名 site-film-final.mp4，每次渲染互相覆盖，无法区分版本。用户拍板命名规范：{yyyyMMdd}-{序号}-{项目名}.mp4（如 20261031-01-site-film.mp4）。\n\n## 引用规范\n- shadow-docs/knowledge/video-studio-structure.md\n  - 当前结论: out/ 不进 git（可重生成的都不进）\n  - 适用 scope: scripts/, out/\n\n## 决策\n- **选型:** assemble 输出名按规范生成（本地时区日期；序号扫描 out/ 中同项目成片递增）；CI artifact 名保持稳定（site-film-final，便于 gh run download），**artifact 内的 mp4 文件名**即规范名；上传路径改通配\n- **对比方案:** 单镜产物同规范（破坏缓存键，弃）；序号对齐 CI run id（本机无 run id，弃）\n- **理由:** 用户拍板；仅动交付物命名，零链路风险\n\n## 任务\n### Phase 1\n- [ ] assemble 输出名规范生成（本地时区 + 扫描递增序号），CI artifact 上传路径通配化 — `scripts/render-film.mjs`, `.github/workflows/render-film.yml`\n\n## 补充\nassemble 终装产物按 {yyyyMMdd}-{序号}-{项目名}.mp4 命名（序号=项目内版本递增），每次渲染不再互相覆盖。详见 shadow-docs/changes/20261031-feature-film-naming/brief.md\n\n完整 brief：shadow-docs/changes/20261031-feature-film-naming/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261031-feature-film-naming\",\"type\":\"feature\",\"scope\":\"video-materials\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261031-feature-film-naming/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    },
    "commit": {
      "files": [
        ".github/workflows/render-film.yml",
        "scripts/render-film.mjs",
        "shadow-docs/changes/20261031-build-render-driver-ci/brief.md",
        "shadow-docs/changes/20261031-feature-film-naming",
        "shadow-docs/changes/20261031-feature-site-film-shot-pipeline/brief.md"
      ],
      "message": "feat(video-materials): 成片命名规范 {yyyyMMdd}-{序号}-{项目名}——assemble 产物版本递增 + artifact 通配上传"
    }
  }
}
---

# 成片命名规范——{yyyyMMdd}-{序号}-{项目名}

## 动机
成片产物当前固定名 site-film-final.mp4，每次渲染互相覆盖，无法区分版本。用户拍板命名规范：{yyyyMMdd}-{序号}-{项目名}.mp4（如 20261031-01-site-film.mp4）。

## 复杂度评级
- **评级:** S
- **理由:** 单文件输出名逻辑 + CI artifact 上传通配；无契约变更（缓存键/单镜产物不动）
- **期望验证深度:** code-read + CI run 实测产物名

## 领域模型
- **限界上下文:** video-materials — 成片是本上下文的交付物
- **统一语言增量:** 成片版本名 {yyyyMMdd}-{序号}-{项目名}；序号 = 项目内版本递增（扫描 out/ 现有同项目成片取 max+1，本机与 CI 各自独立递增：CI 侧无共享盘，用 run 产物自证）
- **聚合与不变量:** `video`：INV-N1: assemble 产物文件名必为 {yyyyMMdd}-{序号}-{film}.mp4 且序号当日/历史不重复（扫描递增保证）
- **领域事件:** 无

## 引用规范
- shadow-docs/knowledge/video-studio-structure.md
  - 当前结论: out/ 不进 git（可重生成的都不进）
  - 适用 scope: scripts/, out/

## 决策
- **选型:** assemble 输出名按规范生成（本地时区日期；序号扫描 out/ 中同项目成片递增）；CI artifact 名保持稳定（site-film-final，便于 gh run download），**artifact 内的 mp4 文件名**即规范名；上传路径改通配
- **对比方案:** 单镜产物同规范（破坏缓存键，弃）；序号对齐 CI run id（本机无 run id，弃）
- **理由:** 用户拍板；仅动交付物命名，零链路风险

## 任务
### Phase 1
- [x] assemble 输出名规范生成（本地时区 + 扫描递增序号），CI artifact 上传路径通配化 — `scripts/render-film.mjs`, `.github/workflows/render-film.yml`

## 结果
- 实际耗时: —
- 验证: —

## 知识评估
- **预期影响:** 无需变更（命名属产物细节，随镜级管线卡片口径自然覆盖）
- **候选卡片:** 无
- **理由:** 无新经验
