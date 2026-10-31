---
{
  "schema": "shadow-dev/v1",
  "name": "20261031-docs-intro-v2-s18-quotes",
  "type": "docs",
  "scope": "video-materials",
  "status": "published",
  "baseBranch": "main",
  "branch": "docs/20261031-docs-intro-v2-s18-quotes",
  "files": [
    "shadow-docs/changes/20261031-docs-intro-v2-s18-quotes",
    "videos/preprod-wuh-site-intro-v2/assets/materials.md",
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
    "pullRequest": 32,
    "pullRequestUrl": "https://github.com/stack-wuh/wuh.site.video/pull/32"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "a0e1aa8c24e718a0d548e8b731a947a60449c151",
    "verifiedAt": "2026-10-31T15:29:45.467Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:32",
    "planHash": "e5e9749ec72af2bed5cea7fe89e40e02f3d6818e8249f8fbc59cdf6320b5db4a",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        "shadow-docs/changes/20261031-docs-intro-v2-s18-quotes",
        "videos/preprod-wuh-site-intro-v2/assets/materials.md",
        "videos/preprod-wuh-site-intro-v2/assets/motion-spec.md",
        "videos/preprod-wuh-site-intro-v2/assets/script.md",
        "videos/preprod-wuh-site-intro-v2/assets/storyboard.md",
        "videos/preprod-wuh-site-intro-v2/boards.tsx",
        "videos/preprod-wuh-site-intro-v2/shots-data.ts",
        "videos/wuh-site-intro-v2/shots-manifest.json"
      ],
      "message": "docs(video-materials): intro.v2 S18 重做——金句渐进 · 纸页承载 · 汇总页",
      "title": "intro.v2 S18 重做：金句渐进 · 纸页承载 · 汇总页",
      "body": "## 概述\n\n第 18 镜「继续写」从「右上角计数 30→59 + 纸页翻飞」重做为**金句渐进**：五句博客金句随页翻出、停住、被下一页带走，切换渐密（34→30→27→24→21f）；页流收拢叠成纸山，顶页落汇总：大数「89 篇」+「2023 · 30｜2024 · 59」。写作的证物从数量回到字本身；尾帧（纸山+页光）与骤停留白不变。\n\n## 变更\n\n- `script.md`：3-2 画面意图与来源；题记层声明补金句用法；§5.1 金句表新增 #11–#15 并更新 #10 回环；§5.3 移除已用句并留言去向。\n- `materials.md`：金句库四行补 #165《再读〈坐忘歌〉》溯源。\n- `storyboard.md`：S18 行重写（帧数不变 234f）；头部例外声明补第三条。\n- `motion-spec.md`：S18 矩阵行重写；新增 `FN-42 quote-turn` / `FN-43 sum-page`；`PT-12` 表述更新（令牌 124，矩阵 57/57）。\n- `boards.tsx`：新增 QuoteBoard 简板（纸页 + 墨字金句 + 89 篇汇总），S18 命中 quote 规则。\n- `shots-data.ts`：由 storyboard 重生成（57 镜 / 8 幕 / 7658f）。\n\n## 验证\n\n- `node scripts/shots.mjs import --unit wuh-site-intro-v2` → 57 镜 / 8 幕 / 7658 帧；manifest 无 diff（title 取自字幕，字幕未变）。\n- animatic `shots-data.ts` 重生成：57 / 8 / 7658，S18 visual / cam 更新。\n- motion-spec 矩阵 57/57；FN 令牌 43 枚（总账 124）。\n- `shots.mjs check` 的 57 处 `shots/sNN.tsx` 缺失为生产期预期（preprod 尚无镜组件）；本地 `tsc` 因 node_modules 已清不可用，交 CI 打包门禁。"
    }
  },
  "knowledge": {
    "action": "无需变更",
    "target": null,
    "reason": "单镜表现手法替换，无新长期事实"
  }
}
---

# 第 18 镜「继续写」重做：金句渐进 · 纸页承载 · 汇总页

## 动机

用户评审：S18 用「右上角计数 30→59 + 纸页翻飞」表现写作量，太像报表；改为让博客金句逐句落纸、切换渐密，最后给出汇总（89 篇 + 两年分解）。写作的证物回到「字」本身，也与全片题记 / 闲章 / 打字机的「字」线同构。

## 复杂度评级

- **评级:** S
- **理由:** 仅前期艺术文档与 animatic 简板（script / storyboard / motion-spec / boards / shots-data / materials 溯源）；帧数与幕结构不变，不改视频合成契约。

## 决策

- **选型（用户拍板）:** 纸页承载——金句写在翻动的纸页上，随页翻出、切换渐密（34→30→27→24→21f），页流收拢叠成纸山，顶页落汇总「89 篇」+「2023 · 30｜2024 · 59」；尾帧（纸山+页光）不变，骤停留白保留。
- **金句（用户拍板，节引）:** ①「人生一世不过 3 万多天，实在是太短了。」②「欲望，是最恐怖的东西。」③「日不过三餐，夜不过一宿，四季的衣服 8 套已经足够了。」④「上班就好好上班……下班了就好好生活。」⑤「玩累了就看看书、写写字。」均出自 #165《再读〈坐忘歌〉》原文，全片未用过；不标年份，按题记层处理，时间锚点由字幕承担。
- **汇总（用户拍板）:** 大数「89 篇」+ 分解「2023 · 30｜2024 · 59」。
- **回环:** 第 ④⑤ 句与 6-6 的「此乐何极~」同源，前段在 S18、尾句在 6-6，构成回声（同「代码写诗」2-1 / 6-8 手法）。
- **对比方案:** 全屏金句卡（字离开纸面，抢戏）；墨点落字（与 S1 / S44 墨点重）——均未采用。
- **理由:** 延续 S17 / S19 纸页语言；「一句（S17）→ 多句渐密（S18）→ 停 → 一行代码（S19 / S20）」的递进，比重音前堆页数更有层次。

## 任务

### Phase 1

- [x] script：3-2 画面意图与来源、§5.1 金句表新增五行、§5.3 移除已用句、题记层例外声明 — `videos/preprod-wuh-site-intro-v2/assets/script.md`
- [x] materials：金句库四行补 #165 溯源 — `videos/preprod-wuh-site-intro-v2/assets/materials.md`
- [x] storyboard：S18 行重写、头部例外声明补第三条 — `videos/preprod-wuh-site-intro-v2/assets/storyboard.md`
- [x] motion-spec：S18 行重写、新增 `FN-42 quote-turn` / `FN-43 sum-page`（令牌 124，矩阵 57/57） — `videos/preprod-wuh-site-intro-v2/assets/motion-spec.md`
- [x] boards：新增 QuoteBoard 简板（纸页 + 墨字金句 + 汇总页） — `videos/preprod-wuh-site-intro-v2/boards.tsx`
- [x] 重新生成 shots-data / manifest（57 镜 / 7658f 不变） — `videos/preprod-wuh-site-intro-v2/shots-data.ts`, `videos/wuh-site-intro-v2/shots-manifest.json`

## 结果

- 实际耗时: 约 40 分钟（含线上文章取证与金句溯源）
- 验证: `shots.mjs import` → 57 镜 / 8 幕 / 7658f；manifest 无 diff（title 取自字幕，字幕未变）；animatic `shots-data.ts` 由 storyboard 重生成（57 / 8 / 7658，S18 visual / cam 两行更新）；motion-spec 矩阵 57 行、FN 令牌 43 枚（总账 124）；S18 简板命中 quote 规则（「写过的话」）落 QuoteBoard；`shots.mjs check` 因生产期 `shots/sNN.tsx` 尚未生成报 57 处缺失（preprod 阶段预期，非本 change 引入）；本地 `tsc` 不可用（node_modules 已清），交 CI 打包门禁。

## 知识评估

- **预期影响:** 无需变更
- **候选卡片:** 无
- **理由:** 单镜表现手法替换，无新长期事实。
