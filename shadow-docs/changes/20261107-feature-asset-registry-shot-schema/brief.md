---
{
  "schema": "shadow-dev/v1",
  "name": "20261107-feature-asset-registry-shot-schema",
  "type": "feature",
  "scope": "video-production",
  "status": "published",
  "baseBranch": "main",
  "branch": "feature/20261107-feature-asset-registry-shot-schema",
  "files": [
    "scripts/captions.mjs",
    "scripts/shots.mjs",
    "shadow-docs/knowledge/video-production-flow.md",
    "shadow-docs/knowledge/video-studio-structure.md",
    "videos/preprod-zhi-guo-xiang/assets/asset-registry.md"
  ],
  "github": {
    "repository": "stack-wuh/wuh.site.video",
    "issue": 52,
    "issueUrl": "https://github.com/stack-wuh/wuh.site.video/issues/52",
    "pullRequest": 53,
    "pullRequestUrl": "https://github.com/stack-wuh/wuh.site.video/pull/53"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "690da826d6f93b7db8e9bed8426fecb94a5a1fb5",
    "verifiedAt": "2026-11-07T11:07:33.238Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:53",
    "planHash": "85bebde2169c60401f7e11e2f62418e3d185fa9282ee3032454938123bf7c217",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] 分镜强 schema 导演列与资产登记表落地(shots.mjs 扩展 + INV-S7 校验)",
      "titleRaw": "[feature] 分镜强 schema 导演列与资产登记表落地(shots.mjs 扩展 + INV-S7 校验)",
      "supplement": "## 动机\n上游 shadow-dev-workflow 20261107-feature-ai-director-video-skill(已 review passed)登记的本仓契约:storyboard 导演列(资产外键/尾帧)、manifest 扩展四字段、INV-S7 首帧资产语义、旁白字数硬表——机器校验由本 change 兑现。实证痛点:致郭襄生图返工多轮,资产引用纯散文无外键校验。\n\n## 方案\n最小契约落地:shots.mjs 表头声明激活(strictTransitions 同构,老单元零感知)+ asset-registry.md 登记表(C/S/P 三型)+ check 三类新校验;致郭襄 v12 首轮登记。\n\n完整 brief:shadow-docs/changes/20261107-feature-asset-registry-shot-schema/brief.md",
      "body": "## 动机\n上游 shadow-dev-workflow 的 `20261107-feature-ai-director-video-skill`(已 review passed)登记了本仓必须兑现的契约:storyboard 逐镜表新增导演列(景别+运镜/光线/构图/尾帧描述/资产外键)、manifest 扩展字段(characterIds/environmentId/firstFrameAsset)、INV-S7 首帧资产语义、旁白字数硬表——其机器校验承诺由本 change 落地。实证痛点:致郭襄生图返工多轮,根因是资产引用纯散文无外键校验。现状利好:①`shots.mjs` 已有「表头声明才严格校验」先例(`strictTransitions`),低风险扩展模式现成;②镜头语言列已含景别+运镜简写、画面列已流通底图编号(`p-ferry` 等)——本 change 把已在发生的引用变成机器可校验的。\n\n## 引用规范\n- 上游 `shadow-dev-workflow/skills/shadow-dev-video/shot-spec.md` §8 + `SKILL.md`(跨仓契约:导演列/manifest 扩展字段/INV-S7/字数硬表)\n  - 当前结论: 契约先行,机器校验随本 change 落地;新列落地前写备注区不破坏既有解析\n  - 适用 scope: scripts/shots.mjs\n- `shadow-docs/knowledge/video-production-flow.md`\n  - 当前结论: 两段式管线、前期五件套+人物视觉设定、分镜师 brief 三必含、渲染只走 CI\n  - 适用 scope: 本 change 将更新(资产层流程并入前期)\n- `shadow-docs/knowledge/video-studio-structure.md`\n  - 当前结论: manifest 帧数唯一真源、staticFile 以 public/ 为根、渲染依赖必进 git、文件存放与版本管理表\n  - 适用 scope: 本 change 将更新(manifest 扩字段与 frames 入库路径)\n\n## 决策\n- **选型:** 方案一最小契约落地——新列落转场列之后(cells[7]/cells[8]),表头声明「资产外键」激活,manifest 增 `characterIds/environmentIds/firstFrameAsset/endFrameDesc`;`asset-registry.md` 人写机检;check 三类新校验;登记表与 frames 目录约定随致郭襄前期首用。\n- **对比方案:** ②全量列升级——景别/光线/构图升独立列并迁移 v12 在途 40 镜真源(否:迁移断裂风险高,且镜头语言列已承载景别+运镜语义,重复建模);③只做约定不改脚本(否:上游承诺的机器校验不兑现,INV-S7 无执法层)。\n- **理由:** `strictTransitions` 先例证明「表头声明才严格」是对共享工具零伤害的扩展模式;方案一让工具先就位、分镜按片自然跟进,不追溯在途真源。文件存在性校验只对已入库(`≠∅`)登记生效——引用即承诺已入库,未生成资产不虚红。本仓无测试套件,observation 取证(fixture CLI 红绿)成本低且可追溯,不为此新建套件文件。\n\n## 任务\n### Phase 1 解析与校验(scripts/shots.mjs)\n\n- [x] task-1 — `scripts/shots.mjs` — parseStoryboard 扩展:表头含「资产外键」时解析 cells[7](资产编号,空白分隔)/cells[8](尾帧描述),缺省跳过;doImport 落 manifest 新字段——P 编号→`firstFrameAsset`(经 registry 映射文件路径)、C→`characterIds`、S→`environmentIds`、尾帧→`endFrameDesc`;INV-1 既有字段与对账逻辑零改动\n- [x] task-2 — `scripts/shots.mjs` — doCheck 扩展:asset-registry.md 解析(编号唯一/类型枚举)+ INV-3/4/5 三类校验(未声明新列单元零激活);check 输出行更新(INV-S1/S2/S6 → 含 S7)\n\n### Phase 2 登记表与知识卡\n\n- [x] task-3 — `videos/preprod-zhi-guo-xiang/assets/asset-registry.md`(新增)— 以 v12 分镜画面列出现过的底图编号(p-him-watch / p-ferry / p-eyefire 等)首轮登记,已入库填路径、未生成填 `∅`;表头写明 C/S/P 三型、版本后缀 `-vN` 纪律与「换图必改引用」\n- [x] task-4 — `shadow-docs/knowledge/video-production-flow.md` + `video-studio-structure.md` — 资产层流程(风格锚点/定妆三视图/场景图→登记表→导演列)、INV-S7、frames 入库目录(母带 `videos/<unit>/assets/frames/` + 渲染件 `public/<unit>/frames/`,仓体 >50MB 时考虑 LFS)回写;补 verified/verified-depth/verified-scope\n\n### Phase 3 取证\n\n- [x] task-5 — 观察点取证 — ①老单元双绿(INV-2)+ import 前后 manifest diff 证明既有字段零变化(INV-1);②fixture storyboard 变体四条拒绝路径红:未登记编号 / 引用 ∅ 资产 / 字数超标 / 版本后缀缺失(INV-3/4/5);③v12 分镜声明新列 + 登记表跑 import/check 全绿\n\n## 补充\n## 动机\n上游 shadow-dev-workflow 20261107-feature-ai-director-video-skill(已 review passed)登记的本仓契约:storyboard 导演列(资产外键/尾帧)、manifest 扩展四字段、INV-S7 首帧资产语义、旁白字数硬表——机器校验由本 change 兑现。实证痛点:致郭襄生图返工多轮,资产引用纯散文无外键校验。\n\n## 方案\n最小契约落地:shots.mjs 表头声明激活(strictTransitions 同构,老单元零感知)+ asset-registry.md 登记表(C/S/P 三型)+ check 三类新校验;致郭襄 v12 首轮登记。\n\n完整 brief:shadow-docs/changes/20261107-feature-asset-registry-shot-schema/brief.md\n\n完整 brief：shadow-docs/changes/20261107-feature-asset-registry-shot-schema/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261107-feature-asset-registry-shot-schema\",\"type\":\"feature\",\"scope\":\"video-production\",\"status\":\"reviewed\",\"branch\":\"feature/20261107-feature-asset-registry-shot-schema\",\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261107-feature-asset-registry-shot-schema/brief.md\",\"cliVersion\":\"1.9.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    },
    "release": {
      "files": [
        "scripts/captions.mjs",
        "scripts/shots.mjs",
        "shadow-docs/changes/20261107-feature-asset-registry-shot-schema/brief.md",
        "shadow-docs/knowledge/video-production-flow.md",
        "shadow-docs/knowledge/video-studio-structure.md",
        "videos/preprod-zhi-guo-xiang/assets/asset-registry.md"
      ],
      "message": "feat(video): 分镜强 schema 导演列与资产登记表落地——shots.mjs 扩展 + INV-S7 校验",
      "title": "feat(video): 分镜强 schema 导演列与资产登记表落地(shots.mjs 扩展 + INV-S7 校验)",
      "body": "## 变更\n- `scripts/shots.mjs`:导演列解析(表头声明「资产外键」激活,strictTransitions 同构,老单元零感知)→ manifest 扩展四字段(characterIds / environmentId / firstFrameAsset / endFrameDesc,经 asset-registry.md 登记表 C/S/P 三型映射);check 升级**帧数+资产+字数三合一**(INV-S1/S2/S6/S7)——引用未入库资产、登记表非 ∅ 行文件缺失(全量查)、firstFrameAsset 缺 -vN 版本后缀、旁白字数超三锚点内插上限均报红并指名镜号;import 只挡结构错误(分镜先于资产生成是前期常态,animatic CI 依赖 manifest 先存在)\n- `videos/preprod-zhi-guo-xiang/assets/asset-registry.md`(新增):C01–C03 角色 / S01–S08 场景 / 13 个 p-xxx 底图编号首轮登记——**登记表即资产层待办清单**(∅=未生成,check 红到入库为止)\n- `shadow-docs/knowledge/video-production-flow.md` + `video-studio-structure.md`:资产层流程(风格锚点→定妆三视图→场景图→登记表→导演列)、机检口径、frames 入库目录(母带 assets/frames/ + 渲染件 public/<unit>/frames/)与 -vN 版本纪律回写;verified 2026-11-07 / runtime\n- `scripts/captions.mjs`:顺手修先存 lint 告警(`[...texts.keys()]` → `texts.keys()`,用户裁定随本 change 例外;commit ce0fd7c 引入的回归)\n\n## 影响\n- **帧数真源零变化**:zhi-guo-xiang import 重跑 diff 为空(40 镜 / 8760f byte 级一致);site-film / wuh-site-intro-v2 / zhi-guo-xiang 三单元 check 双绿,新校验零激活\n- 下一部片启用资产层管线:风格锚点→定妆三视图→登记表→导演列→生图子管线(上游 shadow-dev-workflow 技能已承载方法论)\n- 回滚方式:revert 本 PR,manifest 既有单元不受影响\n\n## 验证\n- L 级五条不变量观察点全闭合:fixture 六轮红绿拒绝路径(未登记编号 / ∅ 引用 / 登记表文件缺失 / 字数超标 / 版本后缀缺失 + 全绿路径)+ 三单元双绿 + import 幂等(详见 brief 结果段)\n- `pnpm check` 全绿:lint 245 文件 0 告警 + typecheck exit 0\n- 环境备注:依赖经 `pnpm install --frozen-lockfile` 补装(node 22.23.2 via mise)\n\n## 关联\n- Closes #52\n- brief: shadow-docs/changes/20261107-feature-asset-registry-shot-schema/brief.md\n- 上游契约: stack-wuh/shadow-dev-workflow#89(skills/shadow-dev-video shot-spec §8)"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/video-production-flow.md,shadow-docs/knowledge/video-studio-structure.md",
    "reason": "资产登记表(C/S/P 编号真源)、导演列解析与 manifest 扩展四字段、INV-S7/字数硬表机检是新长期事实,两卡分别为流程与工具链登记处,已随本 change 回写并补 verified 2026-11-07/runtime/verified-scope(fixture 六轮红绿+三单元双绿+import 幂等;资产层生图生产流程待首片 runtime 实证,已在 verified-scope 注明)"
  }
}
---

# 分镜强 schema 导演列与资产登记表落地(shots.mjs 扩展 + INV-S7 校验)

## 动机

上游 shadow-dev-workflow 的 `20261107-feature-ai-director-video-skill`(已 review passed)登记了本仓必须兑现的契约:storyboard 逐镜表新增导演列(景别+运镜/光线/构图/尾帧描述/资产外键)、manifest 扩展字段(characterIds/environmentId/firstFrameAsset)、INV-S7 首帧资产语义、旁白字数硬表——其机器校验承诺由本 change 落地。实证痛点:致郭襄生图返工多轮,根因是资产引用纯散文无外键校验。现状利好:①`shots.mjs` 已有「表头声明才严格校验」先例(`strictTransitions`),低风险扩展模式现成;②镜头语言列已含景别+运镜简写、画面列已流通底图编号(`p-ferry` 等)——本 change 把已在发生的引用变成机器可校验的。

## 复杂度评级

- **评级:** L
- **理由:** ①契约变更:改 `shots.mjs` import/check 行为与 manifest schema(扩字段)——多单元共用的帧数唯一真源工具;②触及面:scripts/shots.mjs + 新登记表 + 两张知识卡,跨全部视频单元;③可发现性:解析回归可能到下一部片 import 时才炸,非即时可见。三要素齐 L。
- **期望验证深度:** runtime(真实单元双绿 + fixture 拒绝路径红绿)
- **取证策略:** observation(本仓无既有测试套件,assert-first 需为此新建套件文件且端到端取证成本高于真实 CLI 命令;fixture 变体的红绿输出即为最便宜可追溯证据)

## 领域模型

- **限界上下文:** `video-materials` — 视频工程、分镜组件与素材的唯一维护地。上游:shadow-dev-workflow 技能契约(shot-spec §8 / SKILL.md 强 schema);下游:B 站成片发布。反腐边界:不动渲染编排(render-film.mjs / render-all.sh / CI workflows)、不改既有生成物(manifest.ts / registry.ts / routes.tsx)的 TS 语义。
- **统一语言增量:**
  - **资产登记表(asset-registry.md)**:`videos/preprod-<unit>/assets/` 下人写机检的资产编号总表;编号三型 C(角色)/S(场景)/P(底图·道具),每行含编号/类型/名称/文件路径(未入库写 `∅`)/说明。
  - **导演列**:逐镜表转场列之后的可选扩展列——「资产」(外键编号列表)与「尾帧」(尾帧描述);**表头声明「资产外键」才激活解析**,与 `strictTransitions` 同构;未声明的老分镜零感知。
  - **尾帧描述(endFrameDesc)**:本镜结束时画面停在哪——下一镜的衔接锚,manifest 落 `endFrameDesc` 字段。
  - **字数硬表**:旁白字数上限按三锚点 (2.5s,20)/(5s,40)/(10s,82) 分段线性内插、向下取整,超限 check 红(防音画漂移)。
- **聚合与不变量:**
  - `INV-1 帧数真源`:import/check 的帧数语义零变化——Σ durationFrames = totalFrames、startFrame = 前缀和、幕表对账、末镜止帧对账全部保持;manifest 既有字段(id/act/title/startFrame/durationFrames/transition/source)语义不变。
  - `INV-2 向后兼容`:表头未声明「资产外键」的老单元 import/check 行为不变——`node scripts/shots.mjs check --unit site-film` 与 `--unit wuh-site-intro-v2` 双绿,新校验零激活。
  - `INV-3 外键闭合`:声明导演列的单元,资产列引用的每个编号必须命中 asset-registry.md;registry 中文件路径非空(`≠∅`)的行其文件必须真实存在;引用未登记编号或引用未入库(∅)编号 → check 红并指名镜号与编号。
  - `INV-4 字数硬表`:旁白列字数超内插上限 → check 红并报镜号/字数/上限;正常文案(如 v12 逐镜表)全绿。
  - `INV-5 INV-S7 首帧资产语义`:firstFrameAsset 引用的文件必须存在且文件名带版本后缀 `-vN`;镜组件 `staticFile` 引用的底图文件名必须与 registry 登记一致。「换图必改引用」的时序纪律入知识卡(不做时序机检)。
- **领域事件:** import 后 manifest 静默获得新字段(老消费者按字段名读取不受影响);check 从「帧数探针」升级为「帧数+资产+字数」三合一契约探针;新列启用由分镜表头声明驱动,工具先就位、分镜按片跟进。

## 引用规范

- 上游 `shadow-dev-workflow/skills/shadow-dev-video/shot-spec.md` §8 + `SKILL.md`(跨仓契约:导演列/manifest 扩展字段/INV-S7/字数硬表)
  - 当前结论: 契约先行,机器校验随本 change 落地;新列落地前写备注区不破坏既有解析
  - 适用 scope: scripts/shots.mjs
- `shadow-docs/knowledge/video-production-flow.md`
  - 当前结论: 两段式管线、前期五件套+人物视觉设定、分镜师 brief 三必含、渲染只走 CI
  - 适用 scope: 本 change 将更新(资产层流程并入前期)
- `shadow-docs/knowledge/video-studio-structure.md`
  - 当前结论: manifest 帧数唯一真源、staticFile 以 public/ 为根、渲染依赖必进 git、文件存放与版本管理表
  - 适用 scope: 本 change 将更新(manifest 扩字段与 frames 入库路径)

## 决策

- **选型:** 方案一最小契约落地——新列落转场列之后(cells[7]/cells[8]),表头声明「资产外键」激活,manifest 增 `characterIds/environmentIds/firstFrameAsset/endFrameDesc`;`asset-registry.md` 人写机检;check 三类新校验;登记表与 frames 目录约定随致郭襄前期首用。
- **对比方案:** ②全量列升级——景别/光线/构图升独立列并迁移 v12 在途 40 镜真源(否:迁移断裂风险高,且镜头语言列已承载景别+运镜语义,重复建模);③只做约定不改脚本(否:上游承诺的机器校验不兑现,INV-S7 无执法层)。
- **理由:** `strictTransitions` 先例证明「表头声明才严格」是对共享工具零伤害的扩展模式;方案一让工具先就位、分镜按片自然跟进,不追溯在途真源。文件存在性校验只对已入库(`≠∅`)登记生效——引用即承诺已入库,未生成资产不虚红。本仓无测试套件,observation 取证(fixture CLI 红绿)成本低且可追溯,不为此新建套件文件。

## 任务

### Phase 1 解析与校验(scripts/shots.mjs)

- [x] task-1 — `scripts/shots.mjs` — parseStoryboard 扩展:表头含「资产外键」时解析 cells[7](资产编号,空白分隔)/cells[8](尾帧描述),缺省跳过;doImport 落 manifest 新字段——P 编号→`firstFrameAsset`(经 registry 映射文件路径)、C→`characterIds`、S→`environmentIds`、尾帧→`endFrameDesc`;INV-1 既有字段与对账逻辑零改动
- [x] task-2 — `scripts/shots.mjs` — doCheck 扩展:asset-registry.md 解析(编号唯一/类型枚举)+ INV-3/4/5 三类校验(未声明新列单元零激活);check 输出行更新(INV-S1/S2/S6 → 含 S7)

### Phase 2 登记表与知识卡

- [x] task-3 — `videos/preprod-zhi-guo-xiang/assets/asset-registry.md`(新增)— 以 v12 分镜画面列出现过的底图编号(p-him-watch / p-ferry / p-eyefire 等)首轮登记,已入库填路径、未生成填 `∅`;表头写明 C/S/P 三型、版本后缀 `-vN` 纪律与「换图必改引用」
- [x] task-4 — `shadow-docs/knowledge/video-production-flow.md` + `video-studio-structure.md` — 资产层流程(风格锚点/定妆三视图/场景图→登记表→导演列)、INV-S7、frames 入库目录(母带 `videos/<unit>/assets/frames/` + 渲染件 `public/<unit>/frames/`,仓体 >50MB 时考虑 LFS)回写;补 verified/verified-depth/verified-scope

### Phase 3 取证

- [x] task-5 — 观察点取证 — ①老单元双绿(INV-2)+ import 前后 manifest diff 证明既有字段零变化(INV-1);②fixture storyboard 变体四条拒绝路径红:未登记编号 / 引用 ∅ 资产 / 字数超标 / 版本后缀缺失(INV-3/4/5);③v12 分镜声明新列 + 登记表跑 import/check 全绿

## 结果

- 实际耗时: 2026-11-07 单日(propose 与 apply 同日)
- 执行修正(明说): ①`worktree inspect` 对 L 级建议 create,但 brief 未提交(worktree 派生会 BRIEF_NOT_FOUND),按 propose 逃生通道走 **inline 分支**,隔离手段 = 主 checkout 空闲(occupiedBy=null)、本轮独占、不执行 bind execute;②task-5 ③ 调整:v12 登记表首轮全 `∅`(p-xxx 为待生成资产),全绿路径改由 fixture(全入库)承担,真实 v12 声明新列后的 check 红 = **精确到镜号与编号的资产层待办清单**——特性非缺陷;③执行中发现 import 末尾 validate 会挡 ∅ 引用(与「分镜先于资产生成」的前期常态矛盾,animatic CI 依赖 manifest 先存在),修为 `validate(manifest, parsed, mode)`:import 只挡结构错误,check 全量红
- 验证(L 级逐条对账,观察点全部为真实命令输出):

| INV-n | 观察点 |
|---|---|
| INV-1 帧数真源 | `node scripts/shots.mjs import --unit zhi-guo-xiang` 后 `git diff videos/zhi-guo-xiang/shots-manifest.json` → **diff 为空**(40 镜 / 8760f byte 级零变化,既有字段语义不变) |
| INV-2 向后兼容 | `node scripts/shots.mjs check --unit site-film` / `--unit wuh-site-intro-v2` / `--unit zhi-guo-xiang` → 三单元全绿(45 镜 7200f / 58 镜 8260f / 40 镜 8760f),输出无 `/S7`——新校验零激活 |
| INV-3 外键闭合 | fixture:未登记编号 → import die `s02 资产编号「p-noreg」未登记(asset-registry.md)`;∅ 引用 → check 红 `s02 引用未入库资产「p-void」(登记表文件为 ∅——先入库再引用)`;登记表非 ∅ 行文件缺失(全量查) → check 红 `登记表文件不存在: public/test-schema/frames/p-ghost-v1.png(p-ghost)` |
| INV-4 字数硬表 | fixture:5s 镜 67 字 → import die `s01 旁白 67 字 > 上限 40(5s,字数硬表防音画漂移)` |
| INV-5 INV-S7 首帧资产 | fixture:缺版本后缀 → check 红 `s02 firstFrameAsset「public/test-schema/frames/p-bad.png」缺版本后缀 -vN(换图必改引用,缓存键语义)`;绿路径 `p-demo-v1.png` → import/check 全绿(含 `INV-S1/S2/S6/S7 全绿`,manifest 四字段落位正确) |

- **门槛**:`shots.mjs check` 三单元绿;全仓 `pnpm check` → lint `Found 0 warnings and 0 errors`(245 文件)+ typecheck exit 0(全绿)
- **先存回归(已修,用户裁定随本 change 例外)**:全仓 lint 曾存 1 warning @ `scripts/captions.mjs:135`(commit ce0fd7c 2026-11-07 引入,非本 change 动机)——`change amend` 纳入文件集后单行修复(`[...texts.keys()]` → `texts.keys()`,Map 本身可迭代,语义等价),门槛随之全绿
- **环境备注**:本机补装依赖(`pnpm install --frozen-lockfile`,node 22.23.2 via mise——裸 shell 落在 node 24,知识卡口径);shadow-dev CLI 与 node 复合命令三次 exit 139(本机已知随机段错误),重试全过,非新故障
- **未验证项(明说)**:资产层的生图生产流程(风格锚点→定妆→登记→引用)待下一部片 runtime 实证;manifest 扩展字段的 sync 生成物(manifest.ts 可选字段)未在真实单元重跑 sync——既有单元零激活不受影响,下片首用即验

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/video-production-flow.md`、`shadow-docs/knowledge/video-studio-structure.md`
- **理由:** 资产层流程与 manifest 扩展字段是新长期事实,两卡本就是对应流程与工具链的登记处;按 norms/knowledge-cards.md 补 verified/verified-depth/verified-scope
