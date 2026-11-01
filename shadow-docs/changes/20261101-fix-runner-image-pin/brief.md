---
{
  "schema": "shadow-dev/v1",
  "name": "20261101-fix-runner-image-pin",
  "type": "fix",
  "scope": "ci-render",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "fix/20261101-fix-runner-image-pin",
  "files": [
    ".github/workflows/render-animatic.yml",
    ".github/workflows/render-film.yml",
    "shadow-docs/changes/20261101-fix-runner-image-pin"
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
    "verifiedCommit": "09849501f939ad230b12b20fbc984bc9e4bf9c51",
    "verifiedAt": "2026-11-01T02:10:43.862Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": null,
    "planHash": "30b3db4d09e8de9cb6bdbbdbc5efeb236ef4ff897f862d7715f291ee3c5f5e3c",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        ".github/workflows/render-animatic.yml",
        ".github/workflows/render-film.yml",
        "shadow-docs/changes/20261101-fix-runner-image-pin"
      ],
      "message": "fix(ci): runner 钉版 ubuntu-24.04——规避 ubuntu-latest 迁移 Ubuntu 26 告警",
      "title": "CI runner 钉版：ubuntu-latest → ubuntu-24.04",
      "body": "## 概述\n\nGitHub 公告（actions/runner-images#14748）：`ubuntu-latest` 标签自 2026-10-19 起迁移 Ubuntu 26。将两个渲染 workflow 的 `runs-on` 显式钉到已验证镜像 `ubuntu-24.04`，避免流水线在未验证环境上运行，同时消除迁移告警。\n\n## 变更\n\n- `.github/workflows/render-animatic.yml`：4 处 `runs-on` → `ubuntu-24.04`，加钉版注释。\n- `.github/workflows/render-film.yml`：3 处 `runs-on` → `ubuntu-24.04`，加钉版注释。\n\n## 验证\n\n- 两个 workflow YAML 解析通过；`ubuntu-latest` 仅剩注释文本。\n- **冒烟验证**：合并后以 render-animatic `scope=intro-outro`（unit=wuh-site-intro-v2）跑一次（plan + bundle + 2 段，不重渲全片），确认 apt/Chrome/字体在钉版镜像上正常、迁移告警消失。"
    }
  },
  "knowledge": {
    "action": "无需变更",
    "target": null,
    "reason": "runner 标签钉版；无新长期事实"
  }
}
---

# CI runner 镜像钉版：ubuntu-latest → ubuntu-24.04

## 动机

GitHub 公告（actions/runner-images#14748）：`ubuntu-latest` 标签自 2026-10-19 起迁移到 Ubuntu 26。两个渲染 workflow 的 7 处 job 均使用 `ubuntu-latest`，迁移后可能在未验证的镜像上运行（`google-chrome-stable` 路径、`apt` 包、fontconfig 行为均按当前镜像校准）。将 runner 显式钉到已验证的 `ubuntu-24.04`，环境冻结、告警消除；升级 Ubuntu 26 另行验证后切换。

## 复杂度评级

- **评级:** S
- **理由:** 仅 `runs-on` 标签替换与注释；不改渲染逻辑。

## 决策

- **钉版（用户拍板）:** `runs-on: ubuntu-latest` → `runs-on: ubuntu-24.04`（render-animatic 4 处、render-film 3 处），并加一行注释说明原因与升级路径。
- **验证口径:** 合并后以 render-animatic 的 `scope=intro-outro` 做轻量冒烟（2 段渲染，验证 apt/Chrome/字体在新钉版镜像上正常），不重渲全片。

## 任务

### Phase 1

- [x] render-animatic.yml：4 处 runs-on 钉版 + 注释 — `.github/workflows/render-animatic.yml`
- [x] render-film.yml：3 处 runs-on 钉版 + 注释 — `.github/workflows/render-film.yml`

## 结果

- 实际耗时: 约 15 分钟
- 验证:
  - 两个 workflow 共 7 处 `runs-on` 由 `ubuntu-latest` 钉为 `ubuntu-24.04`（render-animatic 4 处、render-film 3 处），并加钉版注释；YAML 解析通过。
  - **冒烟验证:** 合并后以 render-animatic `scope=intro-outro`（unit=wuh-site-intro-v2）跑一次（2 段 + plan + bundle，不重渲全片），确认 apt/Chrome/字体在钉版镜像上正常且迁移告警消失。

## 知识评估

- **预期影响:** 无需变更
- **候选卡片:** 无
- **理由:** runner 标签钉版是运维选择，代码注释可读；无新长期事实
