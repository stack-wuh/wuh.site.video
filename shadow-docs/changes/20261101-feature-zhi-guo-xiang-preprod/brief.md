---
{
  "schema": "shadow-dev/v1",
  "name": "20261101-feature-zhi-guo-xiang-preprod",
  "type": "feature",
  "scope": "video-materials",
  "status": "published",
  "baseBranch": "main",
  "branch": "feature/20261101-feature-zhi-guo-xiang-preprod",
  "files": [
    ".github/workflows/render-animatic.yml",
    "shadow-docs/changes/20261101-feature-zhi-guo-xiang-preprod",
    "src/Root.tsx",
    "videos/preprod-zhi-guo-xiang",
    "videos/zhi-guo-xiang"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": 37,
    "pullRequestUrl": "https://github.com/stack-wuh/wuh.site.video/pull/37"
  },
  "review": {
    "conclusion": "pending",
    "verifiedCommit": null,
    "verifiedAt": null
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:37",
    "planHash": "3e2bcd541faac4551e167ac423e69c03366178c8cc8e6b862af1c8a64213b7e7",
    "updatedAt": null,
    "lastError": null,
    "worktree": "/Users/wuhong/shadow-desktop/github/wuh.site.video/.worktrees/20261101-feature-zhi-guo-xiang-preprod",
    "commit": {
      "files": [
        "videos/preprod-zhi-guo-xiang/assets/music.md"
      ],
      "message": "docs(preprod): 配乐决策——陈致逸《爱意》4320 断点重启（本地 mux）"
    }
  }
}
---

# 《致郭襄》前期制作：四分钟武侠诗电影 · 五件套 · Animatic

## 动机

在《朝朝如念》与 wuh.site.intro.v2 之后，用同一套两段式管线做第一支文学改编片：以网络流传、托名程灵素的《致郭襄》为叙事骨架，讲郭襄与杨过之间「从未开始」的遗憾，以及她如何把这份遗憾活成风景。四分钟，正片 7200f（4:00）+ FilmShell 片头 120f + 片尾 180f = 全片 7500f（4:10）。成功标准不是让观众记住「她爱杨过」，而是让观众在结尾意识到——她不是还在等他，她是终于看见了自己。本 change 只做前期五件套与 animatic；剧本定稿由用户与编剧 subagent 对话完成；正式制作另立 change。

## 复杂度评级

- **评级:** M
- **理由:** 契约变更——新增一个前期单元 `preprod-zhi-guo-xiang`、一个 animatic Composition 注册与 manifest unit，并把 `render-animatic.yml` 参数化为多片（缺省行为不变）；触及面中等——五件套文档 + animatic + 一个 CI 工作流；可发现性中——帧数可经 `shots.mjs import/check` 机检，叙事节奏需 animatic 实渲评审；正式制作的镜头实装不在本 change。
- **期望验证深度:** runtime（animatic 7500f 实渲 + ffprobe 对账、`shots.mjs check` 默认回归、文档走查）
- **取证策略:** observation

## 领域模型

- **限界上下文:** video-materials — 视频工程、品牌令牌、分镜组件与素材的唯一维护地。上游只读数据源：《神雕侠侣》《倚天屠龙记》原著文本与回目、网络流传诗作及其托名说明；下游：B 站成片发布。反腐边界：不做原著续写，不引影视剧画面与音乐，不做发布排期管理。
- **统一语言增量:**
  - 项目名 film `zhi-guo-xiang`：本片成片与 `shots-manifest.json` 的唯一标识，与目录同名。
  - 前期单元 `preprod-zhi-guo-xiang`：承载素材库/剧本/分镜/动效规范/animatic 的目录。
  - 诗电影：以诗作文本为叙事骨架、以意象与情绪推进、不追求编年事件密度的类型口径；本片按此类型制作。
  - 三重时空：十六岁（烟花）/ 寻人（青驴江湖）/ 出家（峨眉云霞）三条时间线，加晚年回望的画外视角；本片的叙事结构口径。
  - 重讲结构：前半段「世人的版本」、后半段「她的版本」，同一组镜头两种解释；本片的结构装置。
- **聚合与不变量:**
  - `INV-1 video（新片）`：分镜脚本逐镜时长之和 = 正片 7200f = `manifest.totalFrames`；成片总帧数 = `totalFilmFrames(7200)` = 7500f（片头 120 + 正片 7200 + 片尾 180）；animatic `durationInFrames` = 7500 且正片子帧区间为 0–7200。
  - `INV-2 素材库`：每条素材标注真实来源（原著回目/章节、诗作文本出处与托名说明、视觉参考）与采集日期；「原著事实核对表」覆盖郭襄年表、三件生日礼物、华山别、青驴寻人、少林遇张君宝、四十岁出家、风陵师太、襄阳城破、倚天剑铸造与传承。
  - `INV-3 动效规范`：覆盖分镜脚本全部镜头的入场/持续/出场/转场（矩阵 100%）。
  - `INV-4 原片`：`videos/site-film/`、`videos/self-intro/`、`videos/wuh-site-intro-v2/`、`videos/preprod-wuh-site-intro-v2/`、`public/site-film/`、`public/self-intro/` 零改动。
  - `INV-5 诗作文本`：全片引用《致郭襄》逐字一致（以素材库定稿文本为唯一源），片头或片尾标注「网络流传 · 托名程灵素」；不得改写诗句冒充原文。
  - `INV-6 animatic`：零内联色值/字体字面量（一律引用 `brand/tokens` 与影片私有令牌）。
  - `INV-7 animatic CI`：`render-animatic.yml` 增加 `unit` 输入后，缺省（不传）仍按 `wuh-site-intro-v2` 的 manifest / Composition / 产物名执行，既有用法零变化。
- **领域事件:** 剧本定稿（用户与编剧评审）→ 分镜/动效规范 → animatic 定稿 → `shots.mjs import --unit zhi-guo-xiang` 生成 manifest（film=zhi-guo-xiang，7200f）→ 另立 change 进入正式制作。

## 引用规范

- shadow-docs/knowledge/video-production-flow.md
  - 当前结论: 两段式——前期五件套（素材库→剧本→分镜→动效规范→animatic）定稿后另立 change 进正式制作；`shots.mjs import` 为帧数唯一机器真源；剧本评审是返工成本最低的卡点
  - 适用 scope: videos/, shadow-docs/knowledge/
- shadow-docs/knowledge/video-studio-structure.md
  - 当前结论: 工作室三层结构；FilmShell 120+180 与 `totalFilmFrames()` 公式；渲染口径 node 22 / 系统 Chrome / port 3211 / crf16；staticFile 以 public/ 为根
  - 适用 scope: brand/, videos/, scripts/, src/Root.tsx, public/
- shadow-docs/knowledge/render-stability-playbook.md
  - 当前结论: 渲染前清场铁律；分块收敛梯；`<Audio loop>` 禁用；先绿后渲；本机 Chrome 半透明渐变崩溃规避
  - 适用 scope: videos/, scripts/, out/
- norms/code-style.md
  - 当前结论: TS 禁 any、单一职责、不为假想场景抽象、无 TODO 注释
  - 适用 scope: 全部新增 TS 代码

## 决策

- **选型:** 方案 A 为骨、B 为肉、C 为镜——六行诗作骨架，三重时空作推进，五件物作视觉母题；方案 D 只取片头一行题记「网络流传 · 托名程灵素」。
- **对比方案:** B 单独使用（四条时间线在四分钟内切换易碎）；C 单独使用（情感距离远，需要旁白硬撑）；D 作主线（对不熟悉金庸的观众门槛过高，易炫技）。
- **片长口径:** 正片 7200f（4:00）+ 片头 120f + 片尾 180f = 全片 7500f（4:10）；用户 2026-11-01 拍板四分钟。
- **叙事口径:** 晚年第一人称回望；「重讲」结构（先世人的版本，后她的版本）；核心命题是「一个人如何与得不到共处一生」，不是苦情痴恋；不拍「被拒绝」，杨过从未回应；出家是主动选择，不是逃避。
- **非目标:** 不做原著续写，不做人物百科，不做打斗场面，不追求编年完整。
- **事实口径:** 故事源头为《神雕侠侣》+《倚天屠龙记》，《射雕英雄传》只作父母辈与襄阳的底色；诗作标注托名；素材库建「原著事实核对表」，倚天剑不早于襄阳城破前铸造，十六岁生日时她尚无此剑。
- **视觉口径:** 沿用 `brand/tokens` 纸墨语言；影片私有调色（雪青/夜蓝/火金）落在 `motion-tokens.ts`，不污染 `brand/tokens.ts`；不引入新字体资产（808 字体资源压垮本机 bundling 的教训），用竖排、留白、朱砂印、墨迹形变造书法感。
- **声音口径:** 默认沿用全片无 SFX 口径；「驴蹄/剑鸣/烟花」三声是否破例，在剧本评审时由用户拍板。
- **版权口径:** 不用影视剧画面与音乐，不引原著大段原文；诗标注托名；发布简介注明「金庸同人 · 非商用」。
- **命名:** 全 kebab——目录 `videos/preprod-zhi-guo-xiang/`、`videos/zhi-guo-xiang/`；`manifest.film` 与目录同名 `zhi-guo-xiang`；成片 `{yyyyMMdd}-{序号}-zhi-guo-xiang.mp4`。
- **隔离手段:** 共享 checkout 当前停在 `feature/20261031-feature-wuh-site-intro-v2-production` 分支，且该 change 的 brief 未跟踪。本 change 在 propose 阶段只创建 brief，不切分支、不提交；apply 前必须先让 intro-v2 production 将 brief 提交进其分支（或该 change 合入 main），再从 main 执行 `branch execute`；若需并行，由用户在独立 clone 中执行本 change。
- **正式制作交接:** 第二段 change 负责逐镜实装、令牌落地、BGM / 三声 SFX、FilmShell 三段装配与出片。

## 任务

### Phase 1 素材库

- [x] 原著事实核对表（郭襄年表 / 三件生日礼物 / 华山别 / 青驴寻人 / 少林遇张君宝 / 四十岁出家 / 风陵师太 / 襄阳城破 / 倚天剑铸造与传承）— `videos/preprod-zhi-guo-xiang/assets/materials.md`
- [x] 诗作文本与托名考据（网络版本比对、逐字定稿、作者不可考说明）— `videos/preprod-zhi-guo-xiang/assets/materials.md`
- [x] 意象与视觉参考库（山 / 海 / 青驴 / 倚天剑 / 风陵渡 / 峨眉云霞 / 烟花 / 雪 / 经卷 / 佛像 / 朱砂印）— `videos/preprod-zhi-guo-xiang/assets/materials.md`
- [x] 金庸暗笔库（风陵师太 / 铁罗汉 / 峨眉与武当的对照 / 襄阳）— `videos/preprod-zhi-guo-xiang/assets/materials.md`

### Phase 2 剧本（编剧 subagent；用户与编剧对话定稿）

- [x] `script.md`：六行骨架 + 三重时空 + 重讲结构 + 全片文案（每处标素材编号），交用户评审定稿 — `videos/preprod-zhi-guo-xiang/assets/script.md`

### Phase 3 分镜（分镜师 subagent）

- [x] `storyboard.md`：逐镜表 + 帧数对账表（正片 7200f；严格按 `shots.mjs` 解析格式：`### Act N 标题（帧 X–Y` 与 `| N | Xf · …（起–止） |`） — `videos/preprod-zhi-guo-xiang/assets/storyboard.md`

### Phase 4 动效规范（UE 动效大师 subagent）

- [x] `motion-spec.md`：令牌化（含影片私有调色）+ 全镜覆盖矩阵 — `videos/preprod-zhi-guo-xiang/assets/motion-spec.md`

### Phase 5 Animatic

- [x] `shots-data.ts`（由 storyboard 解析生成，产物入库）+ `boards.tsx` + `ZhiGuoXiangAnimatic.tsx`（FilmShell 包 7200f 正片，总 7500f；真实文案 / 卡点脉冲）+ `routes.ts` + Root 注册 — `videos/preprod-zhi-guo-xiang/`, `src/Root.tsx`
- [x] `render-animatic.yml` 增 `unit` 输入（默认 `wuh-site-intro-v2`，manifest / Composition / 产物名随 unit 派生；既有用法零变化） — `.github/workflows/render-animatic.yml`
- [ ] 渲染 animatic 7500f（CI 分块矩阵）→ ffprobe 对账 → 交用户评审定稿 — `out/`

### Phase 6 manifest 桥接

- [x] `node scripts/shots.mjs import --unit zhi-guo-xiang` 生成 `videos/zhi-guo-xiang/shots-manifest.json`（film=zhi-guo-xiang，7200f）；site-film 默认 `check` 回归 — `videos/zhi-guo-xiang/`, `scripts/shots.mjs`

## 结果

- 实际耗时: —
- 验证: —（apply 阶段填写：animatic ffprobe 对账 + `shots.mjs check` 默认回归 + 文档走查）

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/video-production-flow.md`、`shadow-docs/knowledge/video-studio-structure.md`
- **理由:** 本片首次把「文学改编 / 诗电影」纳入两段式管线，并首次把 `render-animatic.yml` 参数化为多片；若实作成立，流程卡需补一条「诗电影前期口径」与「animatic 多片参数化」的当前结论。propose 只做预评估，不创建或改写卡片。
