---
{
  "schema": "shadow-dev/v1",
  "name": "20261101-fix-wuh-site-intro-v2-r4",
  "type": "fix",
  "scope": "video-studio",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "fix/20261101-fix-wuh-site-intro-v2-r4",
  "files": [
    "shadow-docs/changes/20261101-fix-wuh-site-intro-v2-r4",
    "videos/preprod-wuh-site-intro-v2",
    "videos/wuh-site-intro-v2"
  ],
  "github": {
    "repository": "stack-wuh/wuh.site.video",
    "issue": null,
    "issueUrl": null,
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "47b5dab955122f927a6888772960f4094519e97e",
    "verifiedAt": "2026-11-01T05:39:20.453Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": null,
    "planHash": "bb96c4de2167d00e8712c703d81fa408b175eff9cc255586507b5a6f864fe555",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        "shadow-docs/changes/20261101-fix-wuh-site-intro-v2-r4",
        "videos/preprod-wuh-site-intro-v2",
        "videos/wuh-site-intro-v2"
      ],
      "message": "fix(video-studio): intro.v2 r4——S47 四列右起 · S56 脚注可读",
      "title": "intro.v2 r4：S47 四列右起 · S56 脚注可读",
      "body": "## 概述\n\nr3 审看后的两处残留修复：\n\n1. **S47 落款镜版式回退**：r3 只改了 S45/S46，S47 落款镜背景仍是旧的两行两列——3:38 四列右起正确、3:41 进 S47 又变回上下两排。现改为与 S46 完全一致的同一行四列、右起（常默最右→少思→不怒→不恼），全部已落定。\n2. **S56 数字脚注不可读**：右下角「1,190 提交 · … · 39 知识卡」只在末 30f（约 1s）以 14px 浮现。现提前到 60f 起（显示约 2.7s），字号 16，保持「退成脚注、不占字幕」。\n\n## 变更\n\n- `videos/wuh-site-intro-v2/shots/s47.tsx`：四列右起、去 LOWER_TOP。\n- `videos/wuh-site-intro-v2/shots/s56.tsx`：脚注 writeFade 110→60、字号 14→16。\n- `videos/preprod-wuh-site-intro-v2/assets/{storyboard,motion-spec}.md`：S47/S56 行同步。\n\n## 验证\n\n- `shots.mjs check --unit wuh-site-intro-v2`（58 镜 Σ8260）与 site-film check 回归绿；s47/s56 esbuild 语法 OK。\n- **证据缺口**：CI 出片后抽帧验 S47 四列右起与 S56 脚注可读。\n\n## 知识\n\n- 无需变更：版式与可读性微调。"
    }
  },
  "knowledge": {
    "action": "无需变更",
    "target": null,
    "reason": null
  }
}
---

# intro.v2 成片修订 r4：S47 四列右起 · S56 脚注可读

## 动机

r3 审看后两处残留：

1. **S47 落款镜版式回退**：r3 只改了 S45/S46，S47 落款镜把四句作为背景重画，仍是旧的两行两列——3:38 S46 四列右起正确，3:41 进 S47 又变回上下两行两列。
2. **S56 数字脚注不可读**：右下角「1,190 提交 · 46 篇文章 · … · 39 知识卡」只在末 30f（约 1s）以 14px 浮现，读不清也看不出意义。

## 复杂度评级

- **评级:** S
- **理由:** 两处局部修改，不动帧数/时间轴/音频。

## 决策

- **S47（用户拍板，四列右起）:** 背景四句改为与 S46 完全一致的同一行四列、右起（常默最右→少思→不怒→不恼最左），全部 landed；去掉两行两列与 LOWER_TOP。
- **S56（用户拍板，提前加长）:** 数字脚注从末 30f 提前到局部 60f 起（显示约 2.7s），字号 14→16；保持「退成脚注、不占字幕」定位。

## 任务

### Phase 1 修改

- [x] S47 背景四列右起（同 S46 landed 版式） — `videos/wuh-site-intro-v2/shots/s47.tsx`
- [x] S56 脚注 60f 起、字号 16 — `videos/wuh-site-intro-v2/shots/s56.tsx`
- [x] 分镜/动效规范对应描述同步 — `videos/preprod-wuh-site-intro-v2/assets/`

### Phase 2 验证

- [x] `shots.mjs check` 回归、esbuild 语法校验
- [x] 审查、提交、合并、CI 出片；抽帧验 S47 四列与 S56 脚注可读

## 结果

- 实际耗时: 约 30 分钟
- 验证:
  - S47 背景四句改为与 S46 完全一致的四列右起（DOM 顺序 不恼→不怒→少思→常默，全部 landed），去掉 LOWER_TOP 两行两列；帧数不变。
  - S56 脚注 writeFade(110)→writeFade(60)（显示约 2.7s）、字号 14→16。
  - 分镜/动效规范 S47、S56 行同步；`shots.mjs check --unit wuh-site-intro-v2`（58 镜 Σ8260）与 site-film check 回归绿；s47/s56 esbuild 语法 OK。
  - **证据缺口:** CI 出片后抽帧验 S47 四列右起与 S56 脚注可读。

## 知识评估

- **预期影响:** 无需变更
- **候选卡片:** 无
- **理由:** 版式与可读性微调，无长期工程事实。
