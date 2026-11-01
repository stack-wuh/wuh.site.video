---
{
  "schema": "shadow-dev/v1",
  "name": "20261101-fix-output-naming",
  "type": "fix",
  "scope": "ci-render",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "fix/20261101-fix-output-naming",
  "files": [
    ".github/workflows/render-animatic.yml",
    ".github/workflows/render-film.yml",
    "scripts/render-film.mjs",
    "shadow-docs/changes/20261101-fix-output-naming"
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
    "verifiedCommit": "01e770cacd12a2b70bfe69b90fe3021897a552c3",
    "verifiedAt": "2026-11-01T01:13:12.370Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": null,
    "planHash": "7323b80235e710b0974cbdf4413a4dd16332be383af6bf8f6295c9dc088570f1",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        ".github/workflows/render-animatic.yml",
        ".github/workflows/render-film.yml",
        "scripts/render-film.mjs",
        "shadow-docs/changes/20261101-fix-output-naming"
      ],
      "message": "fix(ci): 产物命名统一 {yyyyMMdd}{index}-{项目名}（animatic 加 A 前缀）+ action 升 node24",
      "title": "CI 产物命名统一：{yyyyMMdd}{index}-{项目名} · animatic A 前缀 · action 升 node24",
      "body": "## 概述\n\n统一 CI/CD 产物命名，并清理 Actions 的 Node.js 20 弃用警告：\n\n- **正片**：`{yyyyMMdd}{index}-{项目名}.mp4`（例 `2026110101-wuh-site-intro-v2.mp4`；序号扫描 out/ 同日递增）。\n- **animatic**：`A{yyyyMMdd}{index}-{项目名}.mp4`（例 `A2026110101-wuh-site-intro-v2.mp4`；`A` 前缀区分类型，不再用 `-animatic` 后缀）。\n- **action 升级（node24）**：`checkout@v7`、`setup-node@v7`、`upload-artifact@v7`、`download-artifact@v8`、`pnpm/action-setup@v6`——消除 runner 的 Node.js 20 弃用警告（原 v4 均声明 `using: node20`，被强制跑在 Node 24 上并提示）。\n\n## 变更\n\n- `scripts/render-film.mjs`：命名正则 `^\\d{8}(\\d{2})-{film}\\.mp4$`、最终路径与注释。\n- `.github/workflows/render-film.yml`：注释规范更新；action 版本升级。\n- `.github/workflows/render-animatic.yml`：assemble 内计算日期+序号（`A` 前缀），上传 glob `out/A*-wuh-site-intro-v2.mp4`；action 版本升级。\n\n## 验证\n\n- `node --check scripts/render-film.mjs` 通过；两个 workflow YAML 解析通过；无 `@v4` 残留。\n- 命名模拟：film → `2026110101-wuh-site-intro-v2.mp4`；animatic → `A2026110101-wuh-site-intro-v2.mp4`。\n- **待 CI 实证**：合并后触发 render-film 与 render-animatic 各一次，核对新文件名与 artifact 收发。"
    }
  },
  "knowledge": {
    "action": "无需变更",
    "target": null,
    "reason": "命名规范与 action 运行时升级；无新长期事实"
  }
}
---

# 成片与 animatic 产物命名规范：{yyyyMMdd}{index}-{项目名} · animatic 加 A 前缀

## 动机

用户拍板调整 CI/CD 产物命名：正片与 animatic 统一为「日期 + 两位序号 + 项目名」，其中 animatic 以 `A` 前缀区分类型，避免与正片同名。例：正片 `2026110101-wuh-site-intro-v2.mp4`；animatic `A2026110101-wuh-site-intro-v2.mp4`。同轮清理 Actions 的 Node.js 20 弃用警告：把两个 workflow 的 action 升到 node24 主版本。

## 复杂度评级

- **评级:** S
- **理由:** 仅两处命名逻辑与三处注释/路径；不影响渲染内容与帧契约。

## 决策

- **正片（render-film.mjs）:** 扫描 `^\d{8}(\d{2})-{film}\.mp4$` 续序号（同日递增、不覆盖历史）；输出 `{yyyyMMdd}{index}-{项目名}.mp4`。
- **animatic（render-animatic.yml assemble）:** 扫描 `^A\d{8}(\d{2})-wuh-site-intro-v2\.mp4$` 续序号；输出 `A{yyyyMMdd}{index}-wuh-site-intro-v2.mp4`；artifact 名保持不变（`wuh-site-intro-v2-animatic`）。
- **不新增后缀:** animatic 不再以 `-animatic` 后缀进文件名（用户拍板：文件名太长难辨），类型由 `A` 前缀承担。
- **action 运行时升级（用户拍板）:** `checkout@v7` / `setup-node@v7` / `upload-artifact@v7` / `download-artifact@v8` / `pnpm/action-setup@v6`（均核实 `using: node24`），消除 Node.js 20 弃用警告。

## 任务

### Phase 1

- [x] render-film.mjs：命名正则 / 最终路径 / 注释 — `scripts/render-film.mjs`
- [x] render-film.yml：产物 glob 注释与规范描述 — `.github/workflows/render-film.yml`
- [x] render-animatic.yml：assemble 脚本内命名 + 上传路径 — `.github/workflows/render-animatic.yml`
- [x] 两个 workflow 的 action 升级到 node24 主版本 — `.github/workflows/render-film.yml`, `.github/workflows/render-animatic.yml`

## 结果

- 实际耗时: 约 30 分钟
- 验证:
  - `render-film.mjs`：命名正则改为 `^\\d{8}(\\d{2})-{film}\\.mp4$`、最终路径 `{yyyyMMdd}{index}-{项目名}.mp4`；`node --check` 通过。
  - `render-animatic.yml`：assemble 内新增日期+序号计算（正则字面量 `/^A\\d{8}(\\d{2})-wuh-site-intro-v2\\.mp4$/`），输出 `A{yyyyMMdd}{index}-wuh-site-intro-v2.mp4`，上传 glob `out/A*-wuh-site-intro-v2.mp4`。
  - 两个 workflow 的 action 升级到 node24 主版本（checkout@v7 / setup-node@v7 / upload-artifact@v7 / download-artifact@v8 / pnpm-action-setup@v6），无 @v4 残留；YAML 解析通过。
  - 命名模拟（本地 out/）：film → `2026110101-wuh-site-intro-v2.mp4`；animatic → `A2026110101-wuh-site-intro-v2.mp4`。
  - **待 CI 实证:** 合并后触发 render-film 与 render-animatic 各一次，核对新文件名与 artifact 收发。

## 知识评估

- **预期影响:** 无需变更
- **候选卡片:** 无
- **理由:** 命名规范由用户拍板的产出约定，随代码注释可读，无新长期事实
