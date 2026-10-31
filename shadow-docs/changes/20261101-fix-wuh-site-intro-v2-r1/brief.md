---
{
  "schema": "shadow-dev/v1",
  "name": "20261101-fix-wuh-site-intro-v2-r1",
  "type": "fix",
  "scope": "video-studio",
  "status": "published",
  "baseBranch": "main",
  "branch": "fix/20261101-fix-wuh-site-intro-v2-r1",
  "files": [
    "brand/ident/BrandOutro.tsx",
    "public/wuh-site-intro-v2",
    "shadow-docs/changes/20261101-fix-wuh-site-intro-v2-r1",
    "videos/preprod-wuh-site-intro-v2",
    "videos/wuh-site-intro-v2"
  ],
  "github": {
    "repository": "stack-wuh/wuh.site.video",
    "issue": null,
    "issueUrl": null,
    "pullRequest": 35,
    "pullRequestUrl": "https://github.com/stack-wuh/wuh.site.video/pull/35"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "a229d6a586e31812f058fa77cf3ffcd1805a9046",
    "verifiedAt": "2026-10-31T17:22:54.842Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:35",
    "planHash": "8f374cbe08908b813c3dee14b5f0cf3153dbb043147d775b2239d4bb14521331",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        "brand/ident/BrandOutro.tsx",
        "public/wuh-site-intro-v2",
        "shadow-docs/changes/20261101-fix-wuh-site-intro-v2-r1",
        "videos/preprod-wuh-site-intro-v2",
        "videos/wuh-site-intro-v2"
      ],
      "message": "fix(video-studio): intro.v2 成片修订 r1——片尾停留 · 入院 150f/块 · 五处 v1 语言 · BGM 重排",
      "title": "intro.v2 成片修订 r1：片尾停留 · 入院节奏 · 书墙/歌单/对话框/页面呼吸回归 v1 · BGM 重排",
      "body": "## 概述\n\n成片审看后的八项修订 + BGM 重排：\n\n1. **片尾保留最后一帧**：BrandOutro 去掉末尾 164–176f 收黑，最后一帧停在片尾整版（站训 + 署名 + 制作行）。\n2. **入院面板放慢**：每块 150f（16+118+16；S38/S40 为 18+114+18），Act6 924→1200f，全片 7958→8234f（4:34.5）。\n3. **S42 页面呼吸改 v1 表达**：五张页面卡半拍连击 + reveal 行 0→35% 书写 + 连续 dolly，保留联系弹窗与 22px 钤印（5600f 重音）。\n4. **S7 头像**：换 GitHub 真头像（`public/wuh-site-intro-v2/avatar.png`），低饱和圆形裁切。\n5. **S38 音乐**：黑胶随年份刻度环转动（2018→2025，每 13f 一年），逐年展示当年最爱（v1 抓取的八年真实数据）；唱针 4920f 落定；跑马灯同步曲名。\n6. **S18 出处**：每页金句角落小字「#165《再读〈坐忘歌〉》· 2026-07-05」；分镜声明改为「标注出处与发布日期、不推进时间线」。\n7. **S37 真实书墙**：微信读书书架 146 本真封面（2026-11-01 快照）cascade 落架 + shimmer + 抽出一本（真书名/作者/「阅读中」）。\n8. **S39 留言板改 v1 对话框**：1120×720「About · 弹幕聊天室」，左右分列气泡 + 三态小字 + 结尾聚光。\n- **BGM**：按 8234f 重排七段；Act5 复燃段改用 Prelude and Action；白闪真空（3976–4015）音量下沉 0.15；片尾 180f 淡出。\n\n## 变更\n\n- `brand/ident/BrandOutro.tsx`、`videos/preprod-wuh-site-intro-v2/assets/*`（分镜/动效规范/剧本/素材库 §2.8）、`videos/preprod-wuh-site-intro-v2/shots-data.ts`、`WuhSiteIntroV2Animatic.tsx` 锚点。\n- `videos/wuh-site-intro-v2/`：`motion-tokens.ts`（锚点/ACT_FRAMES）、`WuhSiteIntroV2Audio.tsx`（七段重排）、`books.ts`（146 本）、`shots/s07|s18|s35–s42`、manifest/routes 重生成。\n- `public/wuh-site-intro-v2/`：`avatar.png`、`books/`（146 张，2.9MB）、`prelude.m4a`。\n\n## 验证\n\n- `shots.mjs import` → 57 镜 / 8 幕 / **7934 帧**；`sync/check --unit wuh-site-intro-v2` 全绿；默认 site-film check（45 镜 Σ7200）回归绿。\n- 静态对账：57 镜 0 色值字面量 / 0 禁用 API / import 全部可解析；重写四镜字幕与分镜逐字一致。\n- 同时纠正动效规范矩阵 S54–S57 的旧 Act8 口径（衍生树 300f / 总结 / 打字机 / 落款）。\n- **证据缺口**：成片 8234 帧对账与人工走查待合并后 CI 出片。"
    }
  },
  "knowledge": {
    "action": "无需变更",
    "target": null,
    "reason": "成片修订在既有流程与契约内；帧总账按前期文档同步"
  }
}
---

# intro.v2 成片修订 r1：片尾停留 · 入院节奏 · 五处 v1 语言回归 · BGM 重排

## 动机

成片审看后八项修订：(1) 片尾最后 16f 收黑导致播放结束时空白——保留最后一帧；(2) 入院八块各 2.7s 展示太快看不完——每块延长到 150f；(3) S42 页面呼吸改为 v1（五页连击 + reveal 书写）表达；(4) S7 头像换 GitHub 真头像；(5) S38 黑胶随年度刻度转动，逐年展示当年最爱歌曲（真实数据）；(6) S18 金句补出处（标题 + 发布时间）；(7) S37 书架改为真实书墙（微信读书 146 本封面）；(8) S39 留言板改为 v1 对话框表达。BGM 按新时间轴重排并引入 Prelude and Action。

## 复杂度评级

- **评级:** L
- **理由:** 改变帧契约（Act6 924→1200f，正片 7658→7934f，全片 7958→8234f）——分镜/规范/剧本总账、manifest、animatic、锚点、音轨、八镜内部时序全部联动；另有三处镜头内容重写与两处真实素材入库。

## 决策

- **片尾（用户拍板）:** BrandOutro 去掉末尾 164–176f 收黑，最后一帧停在片尾整版（站训 + 署名 + 制作行）；墨点坠落保留。
- **入院节奏（用户拍板 150f/块）:** 六镜 16+118+16，两镜（S38/S40）18+114+18；Act6 = 1200f；正片 7934f = 4:24.5；全片 8234f = 4:34.5。
- **S42 页面呼吸（用户拍板，v1 表达）:** 五张页面卡（/, /music, /guestbook, /footprint, /topics）半拍连击入场、每页 reveal 行 0→35% 书写显现、连续 dolly 推进；保留联系弹窗 8 图标 + 22px 钤印与面板收束。
- **S7 头像（用户拍板）:** 用 GitHub 真头像（stack-wuh，下载入 `public/wuh-site-intro-v2/avatar.png`），低饱和圆形裁切。
- **S38 音乐（用户拍板）:** 黑胶外圈年份刻度环 2018→2025，每 13–14f 走一年；每年展示当年最爱（v1 2026-10-25 抓取：2018 诱惑的街 (Live)/林志炫、2019 腻味/金玟岐、2020 少年不凡/刘美麟、2021 风月缠绵（金风玉露变奏）/陈致逸、2022 归期/钱润玉、2023–2025 爱意（金风玉露变奏）/陈致逸）；迷你播放器跑马灯同步曲名。
- **S18 出处（用户拍板）:** 每页金句角落小字「#165《再读〈坐忘歌〉》· 2026-07-05」；分镜「无日期题记性引用」声明改为「标注出处与发布日期、不推进时间线」。
- **S37 书墙（用户拍板）:** 微信读书书架 146 本（wuh.site /api/weread/books，2026-11-01 快照）封面入库，真实书墙 cascade + shimmer，抽出一本显示真书名/作者/「阅读中」。
- **S39 留言板（用户拍板，v1 表达）:** 1120×720「About · 弹幕聊天室」对话框——左右分列气泡（左纸色/右朱红，带尾巴与发送三态小字），气泡弹入、结尾聚光；留言沿用 v1 五条。
- **BGM（用户拍板，加 Prelude）:** 按 8234f 重排七段；Act5 复燃段用 Prelude and Action（转码入 public）；3976–4015 白闪段音量下沉 0.4 再回升；45f 交叉淡化；禁用 `<Audio loop>`。
- **知识评估（预期）:** 无需变更——均为既有约定内的成片修订；帧契约按前期文档同步更新。

## 任务

### Phase 1 契约与素材

- [x] 分镜/动效规范/剧本/素材库：新帧总账（7934/8234）、Act6 150f、锚点 +276、S7/S18/S37/S38/S39/S42 行重写、书架快照 §2.8 — `videos/preprod-wuh-site-intro-v2/assets/`
- [x] manifest 重导 + animatic 数据与锚点重生成（57 镜 / 7934f） — `videos/wuh-site-intro-v2/shots-manifest.json`, `videos/preprod-wuh-site-intro-v2/shots-data.ts`
- [x] 素材入库：GitHub 头像、微信读书 146 张封面、Prelude and Action 转码 — `public/wuh-site-intro-v2/`

### Phase 2 镜头修订

- [x] BrandOutro：去收黑、停最后一帧 — `brand/ident/BrandOutro.tsx`
- [x] motion-tokens 锚点与 ACT_FRAMES 更新 — `videos/wuh-site-intro-v2/motion-tokens.ts`
- [x] S07 头像 / S18 出处 — `videos/wuh-site-intro-v2/shots/s07.tsx`, `s18.tsx`
- [x] S35–S42 时序 150f（16+118+16 / 18+114+18） — `videos/wuh-site-intro-v2/shots/`
- [x] S37 真实书墙 / S38 年度最爱随黑胶 / S39 v1 对话框 / S42 v1 页面呼吸 — `videos/wuh-site-intro-v2/shots/`
- [x] 音轨重排 + Prelude 段 + 白闪下沉 — `videos/wuh-site-intro-v2/WuhSiteIntroV2Audio.tsx`

### Phase 3 验证

- [x] `shots.mjs sync/check --unit wuh-site-intro-v2`：57 镜 / 7934f；site-film 回归零变化；静态对账 — `videos/wuh-site-intro-v2/`

## 结果

- 实际耗时: 约 2 小时
- 验证:
  - 契约：Act6 924→1200f（六镜 16+118+16、S38/S40 18+114+18）；正片 7658→7934f；全片 7958→8234f；锚点 +276（唱针 4920/第 247 拍、联系钤印 5600/第 281 拍）；顺带纠正动效规范矩阵 S54–S57 的旧 Act8 口径（衍生树 300f / 总结 140f / 打字机 / 落款）。
  - `shots.mjs import` → 57 镜 / 8 幕 / 7934 帧；`sync/check --unit wuh-site-intro-v2` 全绿；默认 site-film check 45 镜 Σ7200 回归绿。
  - 静态对账：57 镜 0 处色值字面量、0 处禁用 API、全部 import 可解析（含 books.ts 146 条）；重写四镜（S37/S38/S39/S42）字幕与分镜逐字一致；S07 换 GitHub 真头像、S18 每页补出处小字。
  - 素材：avatar.png（159×159，4KB）、books/ 146 张封面（2.9MB，下载 0 失败）、prelude.m4a（98.8s）。
  - 音频：七段重排（起帧 120/1992/2982/3762/4560/5760/6828），白闪真空 3976–4015 音量下沉 0.15，片尾 180f 淡出；BrandOutro 去掉末尾收黑、停最后一帧。
  - **证据缺口:** 成片 8234 帧对账与人工走查待 CI 出片（合并后自动触发 render-film，film=wuh-site-intro-v2）。

## 知识评估

- **预期影响:** 无需变更
- **候选卡片:** 无
- **理由:** 成片修订在既有流程与契约内；帧总账按前期文档同步
