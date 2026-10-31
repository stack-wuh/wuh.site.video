---
{
  "schema": "shadow-dev/v1",
  "name": "20261031-build-animatic-ci-shot-matrix",
  "type": "build",
  "scope": "video-materials",
  "status": "published",
  "baseBranch": "main",
  "branch": "build/20261031-build-animatic-ci-shot-matrix",
  "files": [
    ".github/workflows/render-animatic.yml",
    "shadow-docs/changes/20261031-build-animatic-ci-shot-matrix"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": 29,
    "pullRequestUrl": "https://github.com/stack-wuh/wuh.site.video/pull/29"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "f10f87e8fe35016c5cc85ae4c0965c88228aeaac",
    "verifiedAt": "2026-10-31T14:32:29.609Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:29",
    "planHash": "359065548eea032efb011ec2a57f175b9e5b7d22a2a5d67fce5bab95dfa26a4f",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        ".github/workflows/render-animatic.yml",
        "shadow-docs/changes/20261031-build-animatic-ci-shot-matrix"
      ],
      "message": "build(ci): render-animatic 镜级矩阵——bundle 一次 + 59 段并行 + concat 帧级对齐",
      "title": "render-animatic CI 镜级矩阵重写：bundle 一次 + 59 段并行 + concat 帧级对齐",
      "body": "## 概述\n\n参考 `render-film.yml` 的 B 轨架构重写 `render-animatic.yml`：单 job 全量渲染 → bundle 一次 + 分段矩阵（片头 120f + 57 镜 + 片尾 180f = 59 段）+ concat 帧级对齐。\n\n## 变更\n\n- **plan**：读 `videos/wuh-site-intro-v2/shots-manifest.json` 生成 59 段（内容帧 +120 偏移；片头 0–119、片尾 7778–7957）\n- **bundle**：`@remotion/bundler` 一次打包，artifact 传给后续 job\n- **segments**：matrix 59 段并行（max-parallel 20、fail-fast 关闭、逐段 ffprobe 帧数校验）\n- **assemble**：concat 滤镜 + `trim=end_frame` 帧级对齐 → 终验 7958 帧 → artifact\n\n## 验证\n\n- diff 走查；PR 合并后在 Actions 跑整片，产物 ffprobe 目标 7958 帧（交付后观察点）。\n\n## 注意\n\n- 单段失败可独立 Rerun failed jobs；`shots` 入参可只重渲指定镜。\n- 片头片尾仍由 FilmShell（BrandIntro 120f + BrandOutro 180f）承担，作为独立段参与矩阵。"
    }
  },
  "knowledge": {
    "action": "无需变更",
    "target": null,
    "reason": "仅 CI workflow 重写，复用 render-film B 轨架构；无新长期事实"
  }
}
---

# render-animatic CI 镜级矩阵重写

## 动机

现有 `.github/workflows/render-animatic.yml` 是单 job 全量渲染（7958f 一次渲完）：耗时长、任一段崩溃即整片重来，没有沿用 `render-film.yml` 的 B 轨镜级矩阵架构。本变更把它重写为 bundle 一次 + 分段矩阵 + concat 终装，单段失败只重跑单段。

## 复杂度评级

- **评级:** S
- **理由:** 仅 CI workflow 单文件重写；不改视频源码与 Composition 契约；可发现性高（Actions 日志与产物帧数直接可见）。
- **期望验证深度:** runtime（一次 Actions run 出片 7958f + 分段 ffprobe 全绿）

## 决策

- **选型:** plan（读 `videos/wuh-site-intro-v2/shots-manifest.json` 生成 59 段：片头 0–119 / 57 镜（内容帧 +120 偏移）/ 片尾 7778–7957）→ bundle 一次 → segments matrix（max-parallel 20、fail-fast 关闭、逐段 ffprobe）→ assemble（concat 滤镜 + `trim=end_frame` 帧级对齐 + 终验 7958f）。
- **对比方案:** 单 job 全量（现状，失败全废）；按幕 8 段（并行度低、重试粒度粗）。
- **理由:** 与 render-film B 轨同构；沿用 render-stability-playbook 的 concat 滤镜帧级对齐；matrix 单段可独立重跑。

## 任务

### Phase 1

- [x] 重写 `render-animatic.yml`：plan（manifest→59 段）/ bundle / segments matrix / assemble — `.github/workflows/render-animatic.yml`

> 合并后验证：在 Actions 跑整片，产物 ffprobe 应为 7958 帧（合并后执行，作为交付后观察点记录）。

## 结果

- 实际耗时: —
- 验证: —（S 级：diff 走查通过；Actions 整片 run 待 PR 合并后执行，产物帧数 7958 为目标观察点）

## 知识评估

- **预期影响:** 无需变更
- **候选卡片:** 无
- **理由:** 架构与 render-film B 轨同构，属已有知识的复用，无新长期事实。
