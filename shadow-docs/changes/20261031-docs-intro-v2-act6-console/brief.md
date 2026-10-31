---
{
  "schema": "shadow-dev/v1",
  "name": "20261031-docs-intro-v2-act6-console",
  "type": "docs",
  "scope": "video-materials",
  "status": "published",
  "baseBranch": "main",
  "branch": "docs/20261031-docs-intro-v2-act6-console",
  "files": [
    "shadow-docs/changes/20261031-docs-intro-v2-act6-console",
    "videos/preprod-wuh-site-intro-v2/assets/motion-spec.md",
    "videos/preprod-wuh-site-intro-v2/assets/script.md",
    "videos/preprod-wuh-site-intro-v2/assets/storyboard.md",
    "videos/preprod-wuh-site-intro-v2/boards.tsx",
    "videos/preprod-wuh-site-intro-v2/shots-data.ts",
    "videos/wuh-site-intro-v2/shots-manifest.json"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": 31,
    "pullRequestUrl": "https://github.com/stack-wuh/wuh.site.video/pull/31"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "3ef1512e0afbab8794a1979b0b64e49477f5f72c",
    "verifiedAt": "2026-10-31T15:03:19.585Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:31",
    "planHash": "a70869aea3bfbc5082cba9da987f680c838cac76bfd1804967fca1d1cae1fec5",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        "shadow-docs/changes/20261031-docs-intro-v2-act6-console",
        "videos/preprod-wuh-site-intro-v2/assets/motion-spec.md",
        "videos/preprod-wuh-site-intro-v2/assets/script.md",
        "videos/preprod-wuh-site-intro-v2/assets/storyboard.md",
        "videos/preprod-wuh-site-intro-v2/boards.tsx",
        "videos/preprod-wuh-site-intro-v2/shots-data.ts",
        "videos/wuh-site-intro-v2/shots-manifest.json"
      ],
      "message": "docs(video-materials): intro.v2 入院幕重构——暗色控制台 + 墨点光标交互",
      "title": "intro.v2 入院幕重构：暗色控制台 · 八块功能 · 墨点光标",
      "body": "## 概述\n\n第六幕「入院」从「八镜顺次播放」重构为**暗色控制台交互**：面板列出八个功能块，墨点光标点击一块 → 块放大铺满全屏展示 → 收束回面板 → 光标移向下一个；八块累计点亮，最后全亮收束成《坐忘歌》纸页。科技风与全片纸感形成「从纸面走进控制台」的反差。\n\n## 变更\n\n- `script.md`：第六幕空间层声明加入控制台框架；1.1 / 1.2 同步。\n- `storyboard.md`：S35–S42 重写为控制台循环（帧数不变：114f = 16+82+16、120f = 18+84+18）；累积点亮态写死；S34 钤印红光 → 面板显影，S42 八块全亮 → 纸页。\n- `motion-spec.md`：新增 `FN-39 console-panel` / `FN-40 block-expand` / `FN-41 ink-cursor`（令牌 122，矩阵 57/57）；S35–S42 矩阵行重写；`FN-18` 改挂 S55。\n- `boards.tsx`：新增 ConsoleBoard 简板（4×2 八块 + 高亮块 + 墨点光标），S35–S42 命中。\n- `shots-data.ts` / `shots-manifest.json`：重新生成；manifest 顺带校正 s07 标题（S7 资料卡修订的同步）。\n\n## 验证\n\n- `node scripts/shots.mjs import --unit wuh-site-intro-v2` → 57 镜 / 8 幕 / 7658 帧。\n- motion-spec 矩阵 57/57；令牌 122（FN-39/40/41 入表）。\n- animatic S35–S42 简板为控制台（八块 + 光标）；帧数与幕结构不变。"
    }
  },
  "knowledge": {
    "action": "无需变更",
    "target": null,
    "reason": "入院幕叙事框架重写为暗色控制台交互；无新长期事实"
  }
}
---

# 第六幕「入院」重构：暗色控制台 · 八块功能 · 墨点光标

## 动机

用户评审：入院幕八个功能镜头顺次播放，缺少「产品控制台」的交互感。改为：深色控制台面板列出八个功能块，墨点光标点击一块 → 该块放大铺满全屏展示 → 展示完收回面板 → 光标移向下一个；八块全亮后收束。科技风与全片纸感形成「从纸面走进控制台」的反差。时长仍 924f，八镜内容不丢。

## 复杂度评级

- **评级:** S
- **理由:** 仅前期艺术文档与 animatic 简板（script / storyboard / motion-spec / boards / shots-data）；帧数与幕结构不变，不改视频合成契约。

## 决策

- **选型:** 暗色控制台（用户拍板）：细线网格、等宽标签、扫描线；八块（首页/封面/书架/音乐/留言板/热力图/设计系统/页面漫游）；墨点光标点击 → 块放大铺满 → 收束回面板 → 下一块；块累计点亮；总 924f。
- **对比方案:** 电视墙（预览泄露内容）；玻璃 dashboard（偏作品集）。
- **理由:** 交互叙事与「控制台」科技感；墨点光标延续全片语言；八镜内容保留。

## 任务

### Phase 1

- [x] 剧本第六幕加入控制台框架（面板 / 点击 / 展开 / 收回）— `videos/preprod-wuh-site-intro-v2/assets/script.md`
- [x] 分镜 S35–S42 重写为控制台循环（入场点击展开 / 持续展示 / 出场收回），帧数不变 — `videos/preprod-wuh-site-intro-v2/assets/storyboard.md`
- [x] motion-spec 新增 `console-panel` / `block-expand` / `ink-cursor` 令牌并更新 S35–S42 行 — `videos/preprod-wuh-site-intro-v2/assets/motion-spec.md`
- [x] animatic 新增 ConsoleBoard 简板（八块网格 + 高亮块 + 光标）— `videos/preprod-wuh-site-intro-v2/boards.tsx`
- [x] 重新生成 shots-data — `videos/preprod-wuh-site-intro-v2/shots-data.ts`

## 结果

- 实际耗时: —
- 验证: —（S 级：diff 走查 + shots-data 57 镜/7658f 对账；animatic 简板 S35–S42 为控制台）

## 知识评估

- **预期影响:** 无需变更
- **候选卡片:** 无
- **理由:** 单幕叙事框架重写，无新长期事实。
