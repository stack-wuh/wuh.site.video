---
{
  "schema": "shadow-dev/v1",
  "name": "20261101-docs-zhi-guo-xiang-wrapup",
  "type": "docs",
  "scope": "video-materials",
  "status": "archived",
  "baseBranch": "main",
  "branch": "docs/20261101-docs-zhi-guo-xiang-wrapup",
  "files": [
    "shadow-docs/changes/20261101-docs-zhi-guo-xiang-wrapup",
    "shadow-docs/knowledge/video-production-flow.md",
    "shadow-docs/knowledge/video-studio-structure.md",
    "videos/preprod-zhi-guo-xiang/assets/music.md"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": 39,
    "pullRequestUrl": "https://github.com/stack-wuh/wuh.site.video/pull/39"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "481a6311e20adcb8e7eb8529a7252e1b1ef990c2",
    "verifiedAt": "2026-11-01T02:39:45.333Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:39",
    "planHash": "1b7b3380ec7e653efdf77334ffe00bc155ea2d6412381ca5c0fe082e5ef899db",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        "shadow-docs/changes/20261101-docs-zhi-guo-xiang-wrapup",
        "shadow-docs/knowledge/video-production-flow.md",
        "shadow-docs/knowledge/video-studio-structure.md",
        "videos/preprod-zhi-guo-xiang/assets/music.md"
      ],
      "message": "docs(video-materials): 致郭襄收尾——配乐决策入仓 · 知识卡回写",
      "title": "docs(video-materials): 致郭襄收尾——配乐决策入仓 · 知识卡回写",
      "body": "## 变更\n\n- 新增 `videos/preprod-zhi-guo-xiang/assets/music.md`：陈致逸《爱意（金风玉露变奏）》2:19.46；4320 断点重启；本地 mux；版权口径。\n- 更新 `shadow-docs/knowledge/video-production-flow.md`：前期五件套 + 人物视觉设定；文学改编 / 诗电影；animatic CI 多片；本地 BGM mux；`verified-scope` 更新。\n- 更新 `shadow-docs/knowledge/video-studio-structure.md`：`render-animatic.yml` 的 `unit`/`scope` choice；`A{yyyyMMdd}{index}-{film}.mp4`；`preprod-<film>` 单元；版权音频例外；`verified-scope` 更新。\n\n## 验证\n\n- 两卡 frontmatter / source / verified 走查；关键词 grep 命中。\n- `node scripts/shots.mjs check` → 45 镜 Σ=7200 全绿。\n- 无代码改动。\n\n## 说明\n\n- 音频不入仓；`music.md` 仅记录决策与本地 mux。\n- review / archive 在 PR 合并后于 main 上补跑（与 PR #37 同口径）。"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/video-production-flow.md",
    "reason": "docs change 已完成 music.md 入仓与两卡回写；S 级文档字段/来源/关键词走查 + shots check 回归全绿；PR #39 已合并（481a631）。"
  }
}
---

# 致郭襄前期收尾：配乐决策入仓与知识卡回写

## 动机

PR #37 合入 main 后，前期五件套与 animatic 已归档；但有两个文档尾项停留在合并之后：

1. 配乐决策 `music.md` 只存在于 feature 分支与本地 `out/`，main 的 `videos/preprod-zhi-guo-xiang/assets/` 缺这份决策；正式制作 change 需要它。
2. review 已记录 Knowledge 动作为「更新 → `shadow-docs/knowledge/video-production-flow.md`」，但卡片正文尚未改写；`video-studio-structure.md` 也需要补 animatic CI 多片与 `unit`/`scope` 下拉的事实。

本 change 只收尾文档：把 `music.md` 补进 main，按 2026-11-01 的实证改写两张 active 知识卡。不改代码、不改分镜、不重渲。

## 复杂度评级

- **评级:** S
- **理由:** 纯文档变更——一份配乐决策 + 两张知识卡；无契约变更、无代码触及；可发现性靠字段/来源/关键词 grep 与 `shots.mjs check` 回归。
- **期望验证深度:** code-read
- **取证策略:** observation

## 领域模型

- **限界上下文:** video-materials — 视频工程、品牌令牌、分镜组件与素材的唯一维护地。上游只读：PR #37 的归档 brief 与前期资产；下游：正式制作 change 读取 `music.md` 与知识卡。
- **统一语言增量:**
  - **本地 BGM mux**：版权曲目不进 `public/`；CI 只出无声画面，正式发布前用本地 ffmpeg `amix`/`adelay` 在 4320 断点做两遍混音。
  - **animatic CI 多片**：`render-animatic.yml` 的 `unit` / `scope` 下拉与 `shots` 高级子集；产物 `A{yyyyMMdd}{index}-{film}.mp4`，artifact `<unit>-animatic`。
- **聚合与不变量:**
  - `INV-1 配乐决策`：`music.md` 忠实记录曲目（陈致逸《爱意（金风玉露变奏）》，2:19.46）、4320 断点重启、本地 mux、版权口径；音频不入仓。
  - `INV-2 知识卡`：`video-production-flow.md` 增加诗电影/文学改编与 animatic CI/本地 mux 的当前结论；`video-studio-structure.md` 增加 `unit`/`scope` 下拉与 A 前缀产物；两卡 `verified` / `verified-depth` / `verified-scope` 更新，`source` 指向已归档的 preprod brief。
  - `INV-3 回归`：无代码改动；`node scripts/shots.mjs check` 默认 site-film 保持全绿。
- **领域事件:** 文档 PR 合入 → 两张卡进入 active 事实；正式制作 change 可直接引用 `music.md` 与卡内口径。

## 引用规范

- shadow-docs/knowledge/video-production-flow.md
  - 当前结论: 两段式——前期五件套定稿后另立 change 正式制作；`shots.mjs import` 为帧数唯一机器真源；多片 `--unit` 与 FilmShell 三段装配
  - 适用 scope: videos/, shadow-docs/knowledge/
- shadow-docs/knowledge/video-studio-structure.md
  - 当前结论: 工作室三层结构；FilmShell 120+180 与 `totalFilmFrames()`；node 22 / 系统 Chrome / port 3211 / crf16；staticFile 以 public/ 为根
  - 适用 scope: brand/, videos/, scripts/, src/Root.tsx, public/
- shadow-docs/knowledge/render-stability-playbook.md
  - 当前结论: 渲染前清场；分块收敛梯；`<Audio loop>` 禁用；半透明渐变改硬切
  - 适用 scope: videos/, scripts/, out/
- norms/code-style.md
  - 当前结论: TS 禁 any、单一职责、无 TODO 注释；本 change 不改代码
  - 适用 scope: 全部新增 TS 代码（本 change 无）

## 决策

- **选型:** 单独一个 docs change——补 `music.md` + 改写两张知识卡；不并入正式制作 change，避免正式制作被文档门禁拖住。
- **对比方案:** 并入正式制作 change（文档晚到、review 的知识目标悬空）；不写（卡片过期，正式制作会重复踩坑）。
- **来源:** `music.md` 从主仓本地留底 `out/music.md` 复制（内容与合并后 feature 分支的提交一致）；只入文本，不入音频。
- **版权:** 音频不提交；`music.md` 记录本地 mux 命令与署名口径。
- **隔离手段:** 主仓 checkout 在 main、工作区干净；本 change 走 inline 分支 `docs/20261101-docs-zhi-guo-xiang-wrapup`，不建 worktree。
- **非目标:** 不改代码、不改分镜/动效规范、不重渲 animatic、不改 `render-animatic.yml`。

## 任务

### Phase 1 文档

- [x] 把 `out/music.md` 复制为 `videos/preprod-zhi-guo-xiang/assets/music.md` — `videos/preprod-zhi-guo-xiang/assets/music.md`
- [x] 更新 `video-production-flow.md`：补诗电影/文学改编、`preprod-<film>` 单元、animatic CI 多片、本地 BGM mux；更新 `verified` / `verified-depth` / `verified-scope` 与 `source` — `shadow-docs/knowledge/video-production-flow.md`
- [x] 更新 `video-studio-structure.md`：补 `render-animatic.yml` 的 `unit`/`scope` 下拉、A 前缀产物、`preprod-zhi-guo-xiang` 单元；更新 `verified` / `verified-scope` 与 `source` — `shadow-docs/knowledge/video-studio-structure.md`
- [x] 验证：`grep` 两卡的关键结论与字段；`node scripts/shots.mjs check` 默认全绿 — 观察点

## 结果

- 实际耗时: —
- 验证: —（S 级：文档字段/来源/关键词走查 + `shots.mjs check` 回归）

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/video-production-flow.md`、`shadow-docs/knowledge/video-studio-structure.md`
- **理由:** 本片把「文学改编 / 诗电影」纳入两段式前期，新增 `preprod-<film>` 单元、animatic CI 的 `unit`/`scope` 下拉与 A 前缀产物、版权音乐的本地 BGM mux；这些是跨片长期有效的事实，应写入 active 卡。
