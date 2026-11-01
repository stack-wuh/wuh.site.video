---
{
  "schema": "shadow-dev/v1",
  "name": "20261101-fix-wuh-site-intro-v2-r3",
  "type": "fix",
  "scope": "video-studio",
  "status": "published",
  "baseBranch": "main",
  "branch": "fix/20261101-fix-wuh-site-intro-v2-r3",
  "files": [
    "brand/ident",
    "shadow-docs/changes/20261101-fix-wuh-site-intro-v2-r3",
    "videos/preprod-wuh-site-intro-v2",
    "videos/wuh-site-intro-v2"
  ],
  "github": {
    "repository": "stack-wuh/wuh.site.video",
    "issue": null,
    "issueUrl": null,
    "pullRequest": 43,
    "pullRequestUrl": "https://github.com/stack-wuh/wuh.site.video/pull/43"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "f3f956e3396a0404b2e407f93ce341568d4a30d0",
    "verifiedAt": "2026-11-01T03:49:07.411Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:43",
    "planHash": "d2773b3f6af23cad4bf8eb2c5342e32cda663b42a1a8613344875a146f95a1f1",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        "brand/ident",
        "shadow-docs/changes/20261101-fix-wuh-site-intro-v2-r3",
        "videos/preprod-wuh-site-intro-v2",
        "videos/wuh-site-intro-v2"
      ],
      "message": "fix(video-studio): intro.v2 r3——片头 150f · 金句/年度放慢 · 坐忘歌四列右起",
      "title": "intro.v2 成片修订 r3：片头 150f · 金句/年度放慢 · 坐忘歌四列右起",
      "body": "## 概述\n\n三项审看修订（用户要求本轮暂缓渲染）：\n\n1. **片头放慢（仅 v2）**：Family Intro 120→150f（5s）；`FilmShell`/`BrandIntro` 增加可选 `intro`/`duration` 参数，默认 120 不变，其他家族片不受影响；墨滴/墨晕/标题/打字/钤印按 1.25 倍后移，钤印后留 25f。\n2. **金句放慢**：S18 234→300f，五句等间隔 42f（每句约 1.4s），汇总页 230–288，字幕 258。\n3. **年度切换放慢**：S38 150→230f，年份 24f/年（约 0.8s），题签改为 14f 常规淡入，避免字未落定就切走。\n4. **坐忘歌版式**：S45/S46 改为同一行四列、右起（常默→少思→不怒→不恼）；S45 写右二列，S46 同位置续左二列，不再上下两排。\n\n## 变更\n\n- `brand/ident/FilmShell.tsx`、`BrandIntro.tsx`：可选片头时长（v2=150，其他默认 120）。\n- `videos/wuh-site-intro-v2/`：film.config intro 150；S18/S38/S45/S46；motion-tokens 锚点/ACT_FRAMES；音轨八段按 8590f 重排；manifest/routes 重生成。\n- `videos/preprod-wuh-site-intro-v2/`：分镜/动效规范/剧本帧总账 8260/8590、锚点 +66/+146、S18/S38/S45/S46 描述；animatic 数据与锚点重生成。\n\n## 验证\n\n- `shots.mjs import` → 58 镜 / 8 幕 / 8260 帧；`sync/check --unit wuh-site-intro-v2` 全绿；site-film check 回归绿。\n- 音频八段全部落在 0–8590，源曲 `startFrom+段长` 均小于曲长，7 处交叉淡化 30f；Prelude 白闪真空仍对齐局部 388f（渲染峰值 4216f）。\n- esbuild 语法校验 8 个改动 TSX 全 OK；`tsc --noEmit` 本机长时间无输出（与并行 tsc 争用/段错误），未取得结果，留给 CI bundle 实证。\n- **按用户要求暂不触发 CI 渲染**；合并后等确认再出片。\n\n## 知识\n\n- 无需变更：节奏/版式修订，帧总账按前期文档同步。"
    }
  },
  "knowledge": {
    "action": "无需变更",
    "target": null,
    "reason": "节奏/版式修订，帧总账按前期文档同步；无长期工程事实"
  }
}
---

# intro.v2 成片修订 r3：片头放慢 · 金句/年度切换放慢 · 坐忘歌四列右起

## 动机

审看后三项：

1. **家族 Intro 偏快**：BrandIntro 120f 内墨滴/标题/打字/钤印依次完成，钤印 100f 后仅 20f（0.67s）停留。
2. **金句与年度切换偏快**：S18 五句金句间隔 34/30/27/24/21f（0.7–1.1s/句）；S38 年度最爱每 13f 换一年（0.43s/年），低于舒适阅读时间。
3. **坐忘歌版式**：S45/S46 虽为竖排，但四句被拆成上、下两排；古书规范是同一行四列、从右到左、从上到下。

## 复杂度评级

- **评级:** L
- **理由:** 片头 150f + S18 300f + S38 230f 改变帧契约（正片 8114→8260f，全片 8414→8590f）；分镜/动效规范/剧本/animatic/manifest/锚点/音频全部联动；S45/S46 版式重排。

## 决策

- **片头（用户拍板，仅 v2）:** v2 片头 120→150f（5s）；FilmShell/BrandIntro 增加可选 intro/duration 参数，默认 120，其他家族片不变；墨滴/墨晕/标题/打字/钤印按 1.25 倍后移，钤印后留 25f 停住。
- **金句（用户拍板，延长）:** S18 234→300f；五句等间隔 42f（20–230），每句约 1.4s；汇总页 230–288，字幕 258。
- **年度（用户拍板，延长；“切换音乐”指 S38）:** S38 150→230f；年份 24f/年（18–210，8 年，约 0.8s/年），题签用 14f 常规淡入（不再用 28f slow，避免字未落定就切走）；出场 212–230。
- **坐忘歌（用户拍板）:** 四句同一行四列、右起（常默→少思→不怒→不恼）；S45 写右两句，S46 同位置续写左两句，不再上下两排；帧数不变。
- **帧契约:** 正片 8260f（4:35.3）；全片 150 + 8260 + 180 = 8590f（4:46.3）。
- **暂不渲染:** 合并后等用户确认再触发 CI。

## 任务

### Phase 1 帧契约与文档

- [x] 分镜/动效规范/剧本：S18 300f、S38 230f、正片 8260/全片 8590、锚点 +66/+146、S45/S46 版式说明 — `videos/preprod-wuh-site-intro-v2/assets/`
- [x] manifest 重导 + animatic 数据/锚点重生成（58 镜 / 8260f） — `videos/wuh-site-intro-v2/shots-manifest.json`, `videos/preprod-wuh-site-intro-v2/shots-data.ts`

### Phase 2 片头/镜头/音频

- [x] FilmShell/BrandIntro 可选 intro 参数（v2=150，其他默认 120）；v2 film.config intro 150 — `brand/ident/`, `videos/wuh-site-intro-v2/film.config.json`
- [x] S18 300f：五句 42f、汇总页/字幕重排 — `videos/wuh-site-intro-v2/shots/s18.tsx`
- [x] S38 230f：年份 24f/年、题签 14f 淡入、出场重排 — `videos/wuh-site-intro-v2/shots/s38.tsx`
- [x] S45/S46 四列右起同一行（S45 右两句、S46 左两句） — `videos/wuh-site-intro-v2/shots/s45.tsx`, `s46.tsx`
- [x] motion-tokens 锚点/ACT_FRAMES；音轨八段按 8590f 重排 — `videos/wuh-site-intro-v2/motion-tokens.ts`, `WuhSiteIntroV2Audio.tsx`

### Phase 3 验证

- [x] `shots.mjs sync/check`、tsc、animatic 数据对账、音频段边界校验
- [x] 审查、提交、合并（**暂不渲染**）

## 结果

- 实际耗时: 约 1.5 小时
- 验证:
  - 契约：v2 片头 120→150f（FilmShell/BrandIntro 可选 intro 参数，其他家族片默认 120）；S18 234→300f（五句 42f）；S38 150→230f（年份 24f/年）；正片 8114→8260f（4:35.3）；全片 8414→8590f（4:46.3）。
  - `shots.mjs import` → 58 镜 / 8 幕 / 8260 帧；`sync/check --unit wuh-site-intro-v2` 全绿（58 镜 Σ8260）；site-film check 回归绿。
  - 坐忘歌 S45/S46 改为同一行四列、右起（常默→少思→不怒→不恼）；S45 写右二列、S46 同位置续左二列，不再上下两排。
  - 音频八段按 8590f 重排；静态对账 8 段全部落在 0–8590，源曲 startFrom+段长均小于曲长，7 处交叉淡化 30f；Prelude 白闪真空仍对齐局部 388f（渲染峰值 4216f）。
  - esbuild 语法校验：8 个改动 TSX 全部 OK；`tsc --noEmit` 本机长时间无输出（与另一并行 tsc 争用/段错误），未取得结果，留给 CI bundle 实证。
  - **证据缺口（用户要求暂缓渲染）:** 成片 8590 帧、片头 150f、S18/S38 观感与坐忘歌版式待用户确认后 CI 出片验证。

## 知识评估

- **预期影响:** 无需变更
- **候选卡片:** 无
- **理由:** 节奏/版式修订，帧总账按前期文档同步。
