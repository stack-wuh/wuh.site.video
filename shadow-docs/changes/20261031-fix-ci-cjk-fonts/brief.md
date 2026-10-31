---
{
  "schema": "shadow-dev/v1",
  "name": "20261031-fix-ci-cjk-fonts",
  "type": "fix",
  "scope": "ci-render",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "fix/20261031-fix-ci-cjk-fonts",
  "files": [
    ".github/workflows/render-animatic.yml",
    "shadow-docs/changes/20261031-fix-ci-cjk-fonts",
    "shadow-docs/knowledge/render-stability-playbook.md"
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
    "verifiedCommit": "a0e1aa8c24e718a0d548e8b731a947a60449c151",
    "verifiedAt": "2026-10-31T15:36:22.673Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": null,
    "planHash": "c65542263f7f55e797f8552d068350b37715e8281ff996ffab35475fd86192e8",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        ".github/workflows/render-animatic.yml",
        "shadow-docs/changes/20261031-fix-ci-cjk-fonts",
        "shadow-docs/knowledge/render-stability-playbook.md"
      ],
      "message": "fix(ci): render-animatic 补 CJK 字体块与哨兵——修复 slate mono 中文方框",
      "title": "fix(ci): render-animatic 补 CJK 字体块——修复 animatic 中文方框乱码",
      "body": "## 概述\n\n修复 CI 渲染的 CJK 字体缺失：render-animatic 云端首跑时，slate 的 `mono` 语境中文全成 .notdef 方框——Ubuntu runner 无中文字体，`Menlo, monospace` 无字形回退；serif / sans 正常（品牌 Noto SC 随 bundle 的 webfont）。实查发现 render-film.yml 早已自带完整字体块，是 render-animatic 漏抄了这一步。\n\n## 变更\n\n- `.github/workflows/render-animatic.yml`：segments job 照搬 render-film 的字体块（`fonts-noto-cjk` + `fonts-noto-cjk-extra` + fontconfig 别名 `Menlo→Noto Sans Mono CJK SC` + `fc-match` 自证），并补 `fc-list :lang=zh` 哨兵——缺中文字体直接失败，不再静默渲方框。\n- `shadow-docs/knowledge/render-stability-playbook.md`：新增「CI 字体缺失」坑位与字体契约（bundled webfont 自洽；非 bundled family 依赖渲染主机，新增 family 必须同步检查所有 workflow）；frontmatter 补关键词、source 与 verified。\n\n## 验证\n\n- Ruby YAML 解析通过；`render-film.yml` 实查已有同款字体块，本次未改动。\n- 字体生效以修复后下一次 CI 运行为准：重跑 render-animatic 验证 slate 中文恢复。"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/render-stability-playbook.md",
    "reason": "CI 渲染字体契约（首个云端字体坑实证）"
  }
}
---

# CI 渲染字体修复：CJK 缺失导致 mono 文本乱码

## 动机

首跑 render-animatic 的 animatic 左上角 slate 出现方框乱码：`mono`（Menlo, monospace）语境下的汉字在 GitHub Ubuntu runner 上无字形回退——runner 未装任何中文字体，Chromium 把每个汉字画成 .notdef。serif / sans 中文正常（品牌 Noto SC webfont 随 bundle 加载），构成根因反证。本机 macOS 因 Menlo→苹方回退从未暴露。实查发现生产链路 render-film.yml 早已自带完整字体块（fonts-noto-cjk + Menlo→Noto Sans Mono CJK 别名 + fc-match 自证），是 v2 的 render-animatic 在复制 apt 行时漏抄了字体步骤。

## 复杂度评级

- **评级:** S
- **理由:** 两个 workflow 各加一行安装与一个哨兵步骤，知识卡补一条坑位；不改渲染代码与帧契约。

## 决策

- **修渲染环境（用户拍板）:** render-animatic 的 segments job 照搬 render-film 现成的字体块（`fonts-noto-cjk` + `fonts-noto-cjk-extra` + fontconfig 别名 + `fc-cache` + `fc-match` 自证）；render-film 已有该步骤，无需改动。
- **字体哨兵:** 安装后 `fc-list :lang=zh | grep -q .`，为空即失败——镜像变更导致字体丢失会立即暴露，不再悄悄渲出方框。
- **不改 mono 栈:** 把「Noto Sans SC」塞进 mono 会让 Linux 上拉丁字变比例字体、失去等宽观感；fontsource 无 Noto Sans Mono CJK 包。系统字体是正解。
- **知识沉淀:** render-stability-playbook 增加 CI 字体契约条目（bundled webfont 自洽；非 bundled family 依赖渲染主机，CI 必须显式安装并自检；新增 family 同步检查所有 workflow）。

## 任务

### Phase 1

- [x] render-animatic：segments job 照搬 render-film 的 CJK 字体块（安装 + 别名 + 自证）并补 fc-list 哨兵 — `.github/workflows/render-animatic.yml`
- [x] 知识卡：render-stability-playbook 增加 CI 字体契约 — `shadow-docs/knowledge/render-stability-playbook.md`

## 结果

- 实际耗时: 约 20 分钟
- 验证: `.github/workflows/render-animatic.yml` 的 segments job 增加与 render-film 相同的字体块 + `fc-list :lang=zh` 哨兵；Ruby YAML 解析通过；render-film.yml 实查已具备同款字体块（本次未改动）。字体效果以修复后下一次 CI 运行为准——重跑 render-animatic 验证 slate 中文恢复。

## 知识评估

- **预期影响:** 更新
- **目标卡片:** shadow-docs/knowledge/render-stability-playbook.md
- **理由:** 新增 CI 渲染字体契约（首个云端渲染字体坑实证）
