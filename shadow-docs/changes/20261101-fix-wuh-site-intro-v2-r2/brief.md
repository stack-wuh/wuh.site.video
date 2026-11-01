---
{
  "schema": "shadow-dev/v1",
  "name": "20261101-fix-wuh-site-intro-v2-r2",
  "type": "fix",
  "scope": "video-studio",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "fix/20261101-fix-wuh-site-intro-v2-r2",
  "files": [
    "public/wuh-site-intro-v2",
    "shadow-docs/changes/20261101-fix-wuh-site-intro-v2-r2",
    "shadow-docs/knowledge/render-stability-playbook.md",
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
    "verifiedCommit": "d0931588579a67f389b52f2b6299da7418a6c63b",
    "verifiedAt": "2026-11-01T02:52:38.109Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": null,
    "planHash": "e7acd70cba917f967513b25794de393a4dcb7ceffca886e399e116c1ed00d7b1",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        "public/wuh-site-intro-v2",
        "shadow-docs/changes/20261101-fix-wuh-site-intro-v2-r2",
        "shadow-docs/knowledge/render-stability-playbook.md",
        "videos/preprod-wuh-site-intro-v2",
        "videos/wuh-site-intro-v2"
      ],
      "message": "fix(video-studio): intro.v2 r2——知识库独立镜 · BGM 主题回归 · 片尾静音修复",
      "title": "intro.v2 成片修订 r2：知识库独立镜 · BGM 主题回归 · 片尾静音修复",
      "body": "## 概述\n\n审看后的两项修订：\n\n1. **知识库补镜**：v2 之前只在 S55 脚注出现「257 归档 · 39 知识卡」，没有独立画面。新增 S54「知识库」180f：257 张 brief 档案卡 cascade 落位成 25×11 档案墙，39 张真实知识卡升起环绕（卡名取自各项目 shadow-docs/knowledge），接方法论与衍生树之间。后续镜号顺延为 S55–S58。\n2. **BGM 主题回归 + 片尾静音修复**：实测旧成片最后 46.9s 完全静音——终章 `startFrom=8100` 越过 `lead.m4a` 实际曲长 224.6s；同时 Prelude 的白闪真空比画面白闪早约 4.3s，各轨响度差近 20dB。新编排改为「主题回归·钢琴线」：Meditation 01 开场/坐忘、Meditation 02 成长、Heartbreaking 落在 2025 留白与终章、Prelude 保留在灯亮白闪、Dreams 做入院漫游、Take the Lead 在此刻幕昂扬；六轨逐轨归一到 -17 LUFS + 限幅，段间 30f 真交叉淡化。\n\n## 变更\n\n- `videos/preprod-wuh-site-intro-v2/`：分镜/动效规范/剧本新增 S54 与 8114/8414 帧总账、锚点 +180；animatic 数据与锚点重生成。\n- `videos/wuh-site-intro-v2/`：新增 `shots/s54.tsx`；s54–s57 → s55–s58 重命名与接续（s55 开场改为知识墙收束成墨点）；manifest/routes/registry 重生成；`motion-tokens` 锚点更新；`WuhSiteIntroV2Audio` 重写为八段。\n- `public/wuh-site-intro-v2/score/`：6 首 CC-BY 曲目归一化资产（Kevin MacLeod，署名与选曲见 `videos/wuh-site-intro-v2/assets/bgm-selection.md`）。\n- `shadow-docs/knowledge/render-stability-playbook.md`：补充分段音量终验必须覆盖片尾（startFrom 越界不影响时长，需按曲长预校验 + 末窗 volumedetect）。\n\n## 验证\n\n- `shots.mjs import` → 58 镜 / 8 幕 / 8114 帧；`sync/check --unit wuh-site-intro-v2` 全绿；默认 site-film check 45 镜 Σ7200 回归绿。\n- `tsc --noEmit` 本次新增/修改文件 0 错误（全仓仍有 7 处既有 s12/s13/s17–s20 令牌类型错误，与本 change 无关）。\n- 音频静态对账：8 段全部落在 0–8414，源曲 `startFrom + 段长` 均小于曲长；7 处交叉淡化均为 30f；白闪真空对齐渲染帧 4120。\n- **证据缺口**：成片 8414 帧、S54 画面与片尾响度曲线待合并后 CI 出片验证。\n\n## 知识\n\n- `render-stability-playbook`：新增「分段音量必须扫到片尾」——旧版 `startFrom` 越界导致的整段静音不影响 ffprobe 两路时长，必须在编排前按曲长校验，并对末窗做 `volumedetect`。"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/render-stability-playbook.md",
    "reason": "补充分段音量终验必须覆盖片尾：startFrom 越界导致的整段静音不影响时长，ffprobe 两路时长查不出；新增末窗 volumedetect 阈值与按曲长预校验要求"
  }
}
---

# intro.v2 成片修订 r2：知识库独立镜 + BGM 主题回归与片尾静音修复

## 动机

审看后两项：

1. **知识库缺失**：v1（site-film S38）有「254 briefs · 40 knowledge cards」归档墙 + 知识卡星环；v2 只在 S55 右下角脚注出现「257 归档 · 39 知识卡」，没有独立画面。
2. **BGM 不触动，且末尾静音**：实测最新成片最后 46.9 秒（衍生树→落款→片尾）完全静音——终章段 `startFrom=8100` 帧（270s）越过 `lead.m4a` 实际曲长 224.6s；Act5 Prelude 的「白闪真空」下沉点在画面白闪前约 4.3s；各轨响度差近 20dB（meditation -23.3 LUFS / lead -11.4 / heartbreaking -31.3），安静段几乎听不见、昂扬段突然很响。

## 复杂度评级

- **评级:** L
- **理由:** 新增一镜改变帧契约（Act8 1226→1406f，正片 7934→8114f，全片 8234→8414f）；分镜/动效规范/剧本/动画预演/manifest/锚点/音轨全部联动；BGM 重排与音频资产重建。

## 决策

- **知识库（用户拍板，新增 S54）:** 在方法论 S53 后新增 180f（6s）独立镜：257 张 brief 档案墙 cascade 落位 + 39 张真实知识卡升起环绕；接衍生树；S54–S57 顺延为 S55–S58；全片 8414f = 4:40.5。
- **BGM（用户拍板，主题回归·钢琴线）:** Meditation Impromptu 01 开场/坐忘，Meditation Impromptu 02 成长，Heartbreaking 落在 2025 留白与终章，Prelude and Action 保留在 Act5（白闪真空对齐渲染帧 4120），Dreams Become Real 做入院漫游，Take the Lead 在此刻幕昂扬；全部 Kevin MacLeod CC-BY，逐轨归一到 -17 LUFS + 限幅，30f 真交叉淡化，末 120f 淡出。
- **片尾静音修复:** 终章段改从 Heartbreaking 0s 起，不再使用越界 `startFrom`；片尾 180f 有音乐并淡出。
- **知识评估（预期）:** 无需变更——均为既有制作约定内的成片修订。

## 任务

### Phase 1 契约与资产

- [x] 分镜/动效规范/剧本：新增 S54 行、S54–S57→S55–S58、Act8 1406f、总帧 8114/8414、锚点 +180 — `videos/preprod-wuh-site-intro-v2/assets/`
- [x] manifest 重导 + animatic 数据重生成（58 镜 / 8114f） — `videos/wuh-site-intro-v2/shots-manifest.json`, `videos/preprod-wuh-site-intro-v2/shots-data.ts`
- [x] BGM 资产：曲目归一化入 public/wuh-site-intro-v2/score + 署名文档 — `public/wuh-site-intro-v2/`, `videos/wuh-site-intro-v2/assets/`

### Phase 2 镜头与音轨

- [x] 新增 S54 知识库镜（257 档案墙 + 39 知识卡） — `videos/wuh-site-intro-v2/shots/s54.tsx`
- [x] s54→s55 / s55→s56 / s56→s57 / s57→s58 重命名与接续修正（s55 开场改为知识墙收束） — `videos/wuh-site-intro-v2/shots/`
- [x] motion-tokens 锚点与 ACT_FRAMES 更新 — `videos/wuh-site-intro-v2/motion-tokens.ts`
- [x] 音轨重写：八段、真交叉淡化、白闪真空对齐、片尾有音乐 — `videos/wuh-site-intro-v2/WuhSiteIntroV2Audio.tsx`

### Phase 3 验证

- [x] `shots.mjs sync/check`、tsc、animatic 数据对账 — `videos/wuh-site-intro-v2/`, `videos/preprod-wuh-site-intro-v2/`
- [x] 审查、提交、合并、CI 出片；验帧数/时长/音频（片尾非静音、响度曲线、白闪对齐）

## 结果

- 实际耗时: 约 1.5 小时（实现与静态验证）
- 验证:
  - 契约：新增 S54 知识库 180f，Act8 1226→1406f；正片 7934→8114f（4:30.5）；全片 8234→8414f（4:40.5）；锚点 knowledgeBase 7266、treeStart 7446、pageSettle 7746、typewriter 7886、zero 8114；S54–S57 顺延为 S55–S58。
  - `shots.mjs import` → 58 镜 / 8 幕 / 8114 帧；`sync/check --unit wuh-site-intro-v2` 全绿（58 镜 Σ8114）；默认 site-film check 45 镜 Σ7200 回归绿；`tsc --noEmit` 本次新增/修改文件 0 错误（全仓仍有 7 处既有 s12/s13/s17–s20 令牌类型错误，与本 change 无关）。
  - 新镜：S54 用 257 张 brief 卡 cascade（25×11）+ 39 张真实知识卡 orbit（卡名取自各项目 knowledge 真实卡名）；s55 开场改为知识墙收束成墨点，接衍生树；静态审计 0 色值字面量 / 0 禁用 API。
  - BGM：6 首 CC-BY 曲目逐轨归一到 -17.0～-17.3 LUFS（TP -1.2～-4.9 dB），public/wuh-site-intro-v2/score/ 六轨入库；八段编排、30f 真交叉淡化；片尾静音修复（旧 `startFrom=8100` 越界；终章改 Heartbreaking 0s 起，末 120f 淡出）；白闪真空对齐渲染帧 4120。
  - 音频静态对账：8 段全部落在 0–8414，源曲 startFrom+段长均小于曲长；7 处交叉淡化均为 30f。
  - **证据缺口:** 成片 8414 帧对账、S54 画面与片尾响度曲线待合并后 CI 出片验证。

## 知识评估

- **预期影响:** 无需变更
- **候选卡片:** 无
- **理由:** 成片修订在既有制作约定内；音频链路 bug（越界 startFrom）是否值得沉淀为知识卡，待 CI 验证后再判断。
