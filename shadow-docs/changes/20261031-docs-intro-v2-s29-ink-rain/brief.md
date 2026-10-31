---
{
  "schema": "shadow-dev/v1",
  "name": "20261031-docs-intro-v2-s29-ink-rain",
  "type": "docs",
  "scope": "video-materials",
  "status": "published",
  "baseBranch": "main",
  "branch": "docs/20261031-docs-intro-v2-s29-ink-rain",
  "files": [
    "shadow-docs/changes/20261031-docs-intro-v2-s29-ink-rain",
    "videos/preprod-wuh-site-intro-v2/WuhSiteIntroV2Animatic.tsx",
    "videos/preprod-wuh-site-intro-v2/assets/motion-spec.md",
    "videos/preprod-wuh-site-intro-v2/assets/script.md",
    "videos/preprod-wuh-site-intro-v2/assets/storyboard.md",
    "videos/preprod-wuh-site-intro-v2/shots-data.ts"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": 30,
    "pullRequestUrl": "https://github.com/stack-wuh/wuh.site.video/pull/30"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "825945857aae720f2d510e5747b94ab1bc74b02e",
    "verifiedAt": "2026-10-31T14:47:41.630Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:30",
    "planHash": "9198b873e509ee65061417e6925939c4f70fe7c7b393daab2edc2144e6408b48",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        "shadow-docs/changes/20261031-docs-intro-v2-s29-ink-rain",
        "videos/preprod-wuh-site-intro-v2/WuhSiteIntroV2Animatic.tsx",
        "videos/preprod-wuh-site-intro-v2/assets/motion-spec.md",
        "videos/preprod-wuh-site-intro-v2/assets/script.md",
        "videos/preprod-wuh-site-intro-v2/assets/storyboard.md",
        "videos/preprod-wuh-site-intro-v2/shots-data.ts"
      ],
      "message": "docs(video-materials): intro.v2 视觉修订——S7 资料卡 · S29 墨点春雨 · S40 热力渐深 · 片名雾失楼台",
      "title": "intro.v2 视觉修订：S7 About 资料卡 · S29 墨点春雨 · S40 热力渐深 · 片名「雾失楼台，月迷津渡」",
      "body": "## 概述\n\nintro.v2 三镜视觉修订 + 片名（用户评审）：\n\n- 第 7 镜：自我介绍太直白 → About 小资料卡（头像、68 repos、bio「a boy just ~」、深圳），字幕留白；\n- 第 29 镜：提交柱状图太报表 → 墨点春雨（71 / 151 点落纸成两片苔痕）；\n- 第 40 镜：热力图逐格波浪 → 颜色慢慢加深（全局 ramp，159 天沉得更深）；\n- 片头打字片名：站点 slogan「雾失楼台，月迷津渡」（不用占位「长成」）。\n\n## 变更\n\n- `WuhSiteIntroV2Animatic.tsx`：`META.title` → 「雾失楼台，月迷津渡」。\n- `script.md`：1-4 / 5-1 / 6-6 画面意图；标题统一；字幕总量不变。\n- `storyboard.md`：S7 / S29 / S40 三行；帧数不变（57 镜 / 7658f）。\n- `motion-spec.md`：S7 / S29 / S40 行；新增 `FN-38 heat-deepen`（令牌 119，矩阵仍 57/57）。\n- `shots-data.ts`：重新生成（75 秒级解析，57 镜 / 7658f）。\n\n## 验证\n\n- `shots-data` 57 镜 / 7658 帧；S7 字幕为「无（留白…）」（animatic 自动跳过字幕）。\n- motion-spec 矩阵 57/57、令牌 119（FN-38 入表）。\n- 帧数与幕结构不变；animatic S29 简板自动换为墨点类板面。"
    }
  },
  "knowledge": {
    "action": "无需变更",
    "target": null,
    "reason": "三镜视觉修订与片名对齐（S7 资料卡 / S29 墨点春雨 / S40 热力渐深）；无新长期事实"
  }
}
---

# 第 7 / 29 / 40 镜视觉修订与片名：About 资料卡 · 墨点春雨 · 热力渐深

## 动机

用户评审两处：① 第 29 镜用两根提交柱展示 71 / 151 次提交太像报表、单调，改为「墨点春雨」——墨点落纸，密度即提交密度，洇成两片苔痕，数字极小化；② 第 40 镜热力图由「逐格波浪点亮」改为「颜色慢慢加深」（全局 ramp，159 日沉得更深，无波浪扫描）。两处字幕均不变。③ 第 7 镜自我介绍太直白（三枚标签直报姓名/城市/网名），改为 About 小资料卡（头像、68 repos、bio「a boy just ~」、深圳），不直报姓名，字幕留白。

## 复杂度评级

- **评级:** S
- **理由:** 仅剧本一处画面意图 + 分镜 S29 行 + motion-spec S29 行 + 重新生成 shots-data；无帧数与契约变更。

## 决策

- **选型:** 墨点春雨（用户拍板）：承接火簇余光，纸面转青；三月 71 点、五月 151 点先后落纸，洇成两片深浅苔痕；71 / 151 以极小等宽字落在墨痕中心；雨势即提交密度。
- **对比方案:** 春枝花开（花非站点母题）；心跳脉冲（偏冷）。
- **S40 热力渐深（用户拍板）:** 365 格从浅到深缓慢加深，159 天沉得更深，峰值格圈点；新增 `FN-38 heat-deepen` 令牌替代 `heatWave`。
- **片名（用户拍板）:** 片头打字片名用站点 slogan「雾失楼台，月迷津渡」，不用「长成」；剧本/分镜标题同步。
- **S7 资料卡（用户拍板）:** 用 About 小资料卡（头像、68 repos、bio「a boy just ~」、深圳）代替三标签直报；字幕留白。
- **理由:** 与全片墨点语言一致，不出现柱状图；数据回到纸面。

## 任务

### Phase 1

- [x] 更新剧本 1-4 / 5-1 / 6-6 画面意图、分镜 S7 / S29 / S40 行、motion-spec S7 / S29 / S40 行 — `videos/preprod-wuh-site-intro-v2/assets/script.md`, `videos/preprod-wuh-site-intro-v2/assets/storyboard.md`, `videos/preprod-wuh-site-intro-v2/assets/motion-spec.md`
- [x] 重新生成 shots-data（分镜解析，57 镜 / 7658f 对账）— `videos/preprod-wuh-site-intro-v2/shots-data.ts`

## 结果

- 实际耗时: —
- 验证: —（S 级：diff 走查 + shots-data 57 镜/7658f 对账）

## 知识评估

- **预期影响:** 无需变更
- **候选卡片:** 无
- **理由:** 单镜视觉替换，无新长期事实。
