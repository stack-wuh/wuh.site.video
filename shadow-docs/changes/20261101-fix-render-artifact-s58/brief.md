---
{
  "schema": "shadow-dev/v1",
  "name": "20261101-fix-render-artifact-s58",
  "type": "fix",
  "scope": "video-studio",
  "status": "published",
  "baseBranch": "main",
  "branch": "fix/20261101-fix-render-artifact-s58",
  "files": [
    ".github/workflows/render-film.yml",
    "shadow-docs/changes/20261101-fix-render-artifact-s58",
    "videos/wuh-site-intro-v2/shots/s58.tsx"
  ],
  "github": {
    "repository": "stack-wuh/wuh.site.video",
    "issue": null,
    "issueUrl": null,
    "pullRequest": 41,
    "pullRequestUrl": "https://github.com/stack-wuh/wuh.site.video/pull/41"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "d184037e8107dc3854d5abc32c55ef16dc8d0e38",
    "verifiedAt": "2026-11-01T03:21:16.797Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:41",
    "planHash": "ed9632b72608b7d1753ecd11667aab452c006c11a10e086cbf6b86b376c2cc4d",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        ".github/workflows/render-film.yml",
        "shadow-docs/changes/20261101-fix-render-artifact-s58",
        "videos/wuh-site-intro-v2/shots/s58.tsx"
      ],
      "message": "fix(video-studio): render-film artifact 名随成片 · S58 落款上移",
      "title": "render-film artifact 名随成片 · S58 落款上移",
      "body": "## 概述\n\n1. **artifact 命名**：`render-film` 的最终产物文件已经是 `{yyyyMMdd}{index}-{项目名}.mp4`，但 Actions 下载包仍叫 `${FILM}-final`。assemble 后新增一步解析成片 basename，artifact 名改为与成片同名（不含 `.mp4`），例如 `2026110101-wuh-site-intro-v2`；包内文件仍是同名 `.mp4`。\n2. **S58 落款重叠**：验收发现右下落款小字与底部字幕在 8180f 附近重叠；落款文字 `top 880→800`、墨点 `SIGN.y 894→814`，保持右下落款构图，避开字幕。\n\n## 变更\n\n- `.github/workflows/render-film.yml`：assemble 后新增 `Resolve final artifact name` step，upload-artifact 使用动态名。\n- `videos/wuh-site-intro-v2/shots/s58.tsx`：落款文字与墨点同步上移 80px；帧数/时间轴不变。\n\n## 验证\n\n- `render-film.yml` YAML 解析通过；模拟 `2026110101-wuh-site-intro-v2.mp4` → artifact 名 `2026110101-wuh-site-intro-v2`。\n- `shots.mjs check --unit wuh-site-intro-v2` 全绿（58 镜 Σ8114）；`tsc --noEmit` 本次 s58 0 错误（全仓 7 处既有错误不变）。\n- **证据缺口**：CI 出片后验 artifact 名、8414 帧与 S58 落款画面。\n\n## 知识\n\n- 无需变更：命名与构图微调，无长期工程事实。"
    }
  },
  "knowledge": {
    "action": "无需变更",
    "target": null,
    "reason": "命名与落款构图微调，无长期工程事实；artifact 命名规则由 workflow 注释即可读"
  }
}
---

# render-film 产物命名 + S58 落款修复

## 动机

1. **产物命名**：用户要求 render-film 最终产出名遵循 `{yyyyMMdd}{index}-{项目名}`。成片文件本身已符合（本次为 `2026110101-wuh-site-intro-v2.mp4`），但 Actions 的最终 artifact 仍叫 `wuh-site-intro-v2-final`，下载包名不符合规范。
2. **S58 落款重叠**：验收 r2 成片发现 S58 右下落款小字与底部字幕在 8180f 附近重叠；落款上移 80px、墨点同步上移，避开字幕。

## 复杂度评级

- **评级:** S
- **理由:** 两个局部修改；不改帧数/时间轴/音频。

## 决策

- **artifact 名（用户拍板）:** assemble 后解析成片 basename（不含 `.mp4`），artifact 名改为 `2026110101-wuh-site-intro-v2`；包内文件仍是同名 `.mp4`。artifact 名在本 run 内唯一。
- **S58 落款（用户拍板）:** 落款文字 `top 880→800`，`SIGN.y 894→814`；保持「纸面右下落款」构图；只重渲 s58 + 终装（CI 全片跑）。

## 任务

### Phase 1 修改

- [x] render-film.yml：assemble 后解析成片 basename，artifact 名改为同名 — `.github/workflows/render-film.yml`
- [x] S58 落款上移 80px（文字与墨点同步） — `videos/wuh-site-intro-v2/shots/s58.tsx`

### Phase 2 验证

- [x] YAML 解析、`shots.mjs check --unit wuh-site-intro-v2`、`tsc` 新增文件零错误
- [x] 审查、提交、合并、CI 出片；验 artifact 名与 8414 帧、S58 落款不再重叠

## 结果

- 实际耗时: 约 20 分钟
- 验证:
  - `render-film.yml` YAML 解析通过；assemble 后新增「Resolve final artifact name」step，用 `basename "$(ls out/*-${FILM}.mp4 | head -1)" .mp4` 解析 artifact 名；模拟产物 `2026110101-wuh-site-intro-v2.mp4` → artifact 名 `2026110101-wuh-site-intro-v2`。
  - `shots.mjs check --unit wuh-site-intro-v2` 全绿（58 镜 Σ8114）；`tsc --noEmit` 本次 s58 0 错误（全仓 7 处既有错误不变）。
  - S58 落款文字 `top 880→800`、`SIGN.y 894→814`，墨点/涟漪同步；帧数/时间轴不变。
  - **CI 出片验证:** run 41270891070 成功；artifact 名 `2026110101-wuh-site-intro-v2`（与成片同名）；成片 8590f / 286.33s；S58 抽帧 8380 确认落款小字已上移、与底部字幕分离。

## 知识评估

- **预期影响:** 无需变更
- **候选卡片:** 无
- **理由:** 命名与构图微调，无长期工程事实。
