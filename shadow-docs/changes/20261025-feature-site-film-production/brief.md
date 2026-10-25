---
{
  "schema": "shadow-dev/v1",
  "name": "20261025-feature-site-film-production",
  "type": "feature",
  "scope": "video-materials",
  "status": "branched",
  "baseBranch": "main",
  "branch": "feature/20261025-feature-site-film-production",
  "files": [
    "package.json",
    "public/site-film",
    "shadow-docs/changes/20261025-feature-site-film-production",
    "src/Root.tsx",
    "videos/site-film"
  ],
  "github": {
    "repository": "stack-wuh/wuh.site.video",
    "issue": 4,
    "issueUrl": "https://github.com/stack-wuh/wuh.site.video/issues/4",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "pending",
    "verifiedCommit": null,
    "verifiedAt": null
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:4",
    "planHash": "6ce09f2ece2c69d99e863dd9d9ce3b6cc46634cbaec4325ff17172c51b8ca444",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] site-film 正式制作：全彩实装 · 108 动效令牌 · 配乐编排（4:00）",
      "titleRaw": "site-film 正式制作：全彩实装 · 108 动效令牌 · 配乐编排（4:00）",
      "supplement": "第二支视频正式制作（变更 20261025-feature-site-film-production）：以已定稿的前期三件套为施工图，令牌先行实装 108 动效令牌，七幕 45 镜全彩场景，多轨配乐对拍 90 BPM，分段渲染出片 4:00 成片。详见 shadow-docs/changes/20261025-feature-site-film-production/brief.md",
      "body": "## 动机\n前期四件套已 PR（#3）并获用户定稿：素材库（materials.md 八节）、分镜脚本（storyboard.md v1.1 · 45 镜七幕 · 7200 帧）、动效规范（motion-spec.md · 108 令牌 · 45/45 覆盖）、animatic 分镜板（用户评审「非常好」）。本变更按施工图完成正式制作：全彩场景实装、108 动效令牌落地、配乐编排、4:00 全片出片。\n\n## 引用规范\n- shadow-docs/knowledge/video-studio-structure.md\n  - 当前结论: 工作室三层结构；tokens 纪律；渲染口径（node 22.23.2/Chrome/3211/crf16）；长片渲染编排（轮转制/渲染前清场/分块微块重试收敛）；Chrome 部分透明度崩溃规避（样片 fade 硬切——正式制作成片渐变保留，渲染用分块重试收敛）；staticFile 以 public/ 为根\n  - 适用 scope: brand/, videos/, scripts/, src/Root.tsx, package.json, public/\n- videos/preprod-site-film/assets/{materials,storyboard,motion-spec}.md\n  - 当前结论: 施工图三件套（v1.1 定稿）——分镜逐镜表、108 令牌、卡点帧 2420/2800/3780/4700/5600/6550/7200\n  - 适用 scope: 本变更全部场景实现\n\n## 决策\n- **选型:** 令牌先行路线——motion-tokens.ts 实装 108 令牌 → 七幕逐幕全彩实装（每幕可独立渲染评审）→ 配乐多轨编排 → 分块渲染出片\n- **对比方案:** 边做边定动效（规范作废，返工）；按幕拆多 change（前期已消险，单 change 分 Phase 即可）\n- **理由:** motion-spec 已给全部令牌与开工清单（8 步），照单实装零设计返工；配乐定调「新挑多轨」——incompetech CC-BY 90 BPM 系候选 2-3 首下载供选，署名入 PR\n- **渲染策略:** 沿用知识卡片实证对策——五段轮转 + 渲染前清场 + 杀手窗微块重试；成片渐变保留（半透明崩溃用重试收敛，样片的硬切不适用于成片质感）\n- **配乐清理:** v5 落选 BGM 候选（at-rest/meditation/sincerely/crypto/lemonade 5 首）在本变更内随选曲定稿清理\n\n## 任务\n### Phase 1 令牌库与配乐\n- [ ] motion-tokens.ts 实装（曲线基元 4 + 元素令牌 31 + 镜头 15 + 粒子 9 + 转场 42 + 调色 7 的 Remotion 落地，按 motion-spec §1-§6） — `videos/site-film/motion-tokens.ts`\n- [ ] 90 BPM 系配乐候选下载（incompetech CC-BY，2-3 首铺七幕情绪弧）+ 用户选曲 + 入库 `public/site-film/` — `videos/site-film/assets/bgm-selection.md`\n### Phase 2 前三幕实装\n- [ ] Act 1 序章（光尘书桌/打字机宣言全复刻站点 TypewriterMotto/品牌落版，全彩） — `videos/site-film/scenes/`\n- [ ] Act 2 起步与沉默（代码夜/热力图生长/版本星轨/骤暗/零柱/金句/时间轴失色，七镜） — `videos/site-film/scenes/`\n- [ ] Act 3 重启与复燃（生成式封面/宣言信纸/钤印重鼓@2420/10,330 光毯/上线白闪，五镜） — `videos/site-film/scenes/`\n### Phase 3 Act 4 产品巡礼（16 镜全彩，复用 preprod 板面升彩 + motion 令牌）\n- [ ] 巡礼前半 8 镜（首页全景→目录纸卷） — `videos/site-film/scenes/`\n- [ ] 巡礼后半 8 镜（点赞→联系钤印） — `videos/site-film/scenes/`\n### Phase 4 后三幕实装\n- [ ] Act 5 创作人文（坐忘歌诗影/书墙书摘/足迹拍立得/光标承转，全片最慢呼吸幕） — `videos/site-film/scenes/`\n- [ ] Act 6 影子工作流（终端/五段纸舟/归档墙/双轴/Meta 穿屏/落款，六镜） — `videos/site-film/scenes/`\n- [ ] Act 7 向好与落版（年度冲顶/书房全景/墨点凝成/落版钤印，四镜） — `videos/site-film/scenes/`\n### Phase 5 编排与出片\n- [ ] SiteFilm 主 Composition（七幕 Sequence 编排 + 双轨/多轨 BGM 音量包络对拍 90 BPM）+ Root 注册 + render 脚本 — `videos/site-film/SiteFilm.tsx`, `src/Root.tsx`, `package.json`\n- [ ] 分段渲染全片（分块+清场+轮转对策）+ INV-1..4 对账 + 成片走查交用户 — `out/site-film.mp4`\n\n## 补充\n第二支视频正式制作（变更 20261025-feature-site-film-production）：以已定稿的前期三件套为施工图，令牌先行实装 108 动效令牌，七幕 45 镜全彩场景，多轨配乐对拍 90 BPM，分段渲染出片 4:00 成片。详见 shadow-docs/changes/20261025-feature-site-film-production/brief.md\n\n完整 brief：shadow-docs/changes/20261025-feature-site-film-production/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261025-feature-site-film-production\",\"type\":\"feature\",\"scope\":\"video-materials\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261025-feature-site-film-production/brief.md\",\"cliVersion\":\"1.8.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    },
    "release": {
      "files": [
        ".gitignore",
        "public/site-film",
        "scripts/render-film.mjs",
        "shadow-docs/changes/20261025-feature-site-film-production",
        "shadow-docs/knowledge/render-stability-playbook.md",
        "shadow-docs/knowledge/video-production-flow.md",
        "shadow-docs/knowledge/video-studio-structure.md",
        "shadow-docs/menu.md",
        "src/Root.tsx",
        "videos/site-film"
      ],
      "message": "feat(video-materials): site-film 正式制作——七幕全彩成片 + 双模式管线沉淀",
      "title": "site-film 正式制作：4:00 全彩成片 · 108 动效令牌 · 五段配乐 · 渲染稳定性作战手册",
      "body": "## 概要\nsite-film 前期制作四件套（变更 20261025-feature-site-film-preprod · Issue #2）：\n\n- **素材库** materials.md——八节真实素材全溯源：25 条源码可拍细节、年度统一活动 API（10,330 次/365 天六维）、年度浏览量（21,643/46 篇）、真实足迹、人文金句库（坐忘歌/重启计划宣言/站点题记）、VibeCoding 影子工作流（254 briefs · 40 知识卡 · 12 版本）\n- **分镜脚本** storyboard.md——45 镜七幕 · 7200 帧精确对账 · 色彩情绪曲线 · 90 BPM 卡点体系（v1.1，用户定稿）\n- **动效规范** motion-spec.md——108 令牌（曲线 35/镜头 15/粒子 9/转场 42/调色 7）· 45/45 镜覆盖矩阵 · 七工艺转场点（UE 大师产出）\n- **Animatic 分镜板** SiteFilmAnimatic（7200 帧）——45 镜真实内容单色简板 + 字幕卡 + 卡点脉冲，已渲染终验（240.000s 整）并获用户定稿\n\n## 变更之外\n- 正式制作（全彩 + 108 动效令牌实装 + 配乐）评审后另立项\n- self-intro BGM 悬置改动不入列；落选 BGM 候选清理另议\n\n## 知识更新\nvideo-studio-structure.md（verified-depth: runtime）：轮转编排/渲染前清场/分块微块重试收敛策略、Chrome 部分透明度叠渲染确定性崩溃及 3 帧跳变规避、staticFile 以 public/ 为根、Composition 时长与分段一致性、前期三件套流程。\n\nCloses #2"
    }
  }
}
---

# site-film 正式制作：全彩实装 · 动效令牌 · 配乐编排

## 动机
前期四件套已 PR（#3）并获用户定稿：素材库（materials.md 八节）、分镜脚本（storyboard.md v1.1 · 45 镜七幕 · 7200 帧）、动效规范（motion-spec.md · 108 令牌 · 45/45 覆盖）、animatic 分镜板（用户评审「非常好」）。本变更按施工图完成正式制作：全彩场景实装、108 动效令牌落地、配乐编排、4:00 全片出片。

## 复杂度评级
- **评级:** L
- **理由:** 触及面大——七幕 45 镜全彩场景实现 + motion-tokens.ts 令牌库 + 配乐编排 + 渲染编排；可发现性 runtime——成片质量只能渲染走查；设计不确定性已被前期消解（分镜/令牌/节奏均定稿），风险集中在实现与渲染稳定性
- **期望验证深度:** runtime（INV 探针 + 分段 ffprobe 对账 + 全片走查）

## 领域模型

- **限界上下文:** video-materials — 视频工程、品牌令牌、分镜组件与素材的唯一维护地。下游 B 站成片发布；反腐边界：不收博客/桌面端物料，不做发布排期管理。
- **统一语言增量:**
  - 动效令牌 motion-token: motion-spec.md 定义的具名动效参数包（Remotion spring/interpolate/Easing 可实现），实装于 `motion-tokens.ts`
  - 板面 board: animatic 用的单色简板组件（boards.tsx）；正式制作的全彩场景为 scene，板面不进成片
- **聚合与不变量:**
  - `video`（videos/site-film/ 正式成片单元）:
    - INV-1: 全部场景组件零内联色值/字体字面量（brand/tokens + motion-tokens）
    - INV-2: 七幕时长与 storyboard v1.1 一致（合计 7200 帧），成片 ffprobe = 7200/240s
    - INV-3: 配乐全部 CC-BY/授权可溯，署名清单随片交付（B 站简介用）
    - INV-4: motion-spec 全部 45 镜的入场/持续/出场/转场在 scene 实装中有着落（实现对照矩阵走查）
- **领域事件:** 全片渲染终验通过 → 交用户成片验收 → B 站发布（本仓外）

## 引用规范
- shadow-docs/knowledge/video-studio-structure.md
  - 当前结论: 工作室三层结构；tokens 纪律；渲染口径（node 22.23.2/Chrome/3211/crf16）；长片渲染编排（轮转制/渲染前清场/分块微块重试收敛）；Chrome 部分透明度崩溃规避（样片 fade 硬切——正式制作成片渐变保留，渲染用分块重试收敛）；staticFile 以 public/ 为根
  - 适用 scope: brand/, videos/, scripts/, src/Root.tsx, package.json, public/
- videos/preprod-site-film/assets/{materials,storyboard,motion-spec}.md
  - 当前结论: 施工图三件套（v1.1 定稿）——分镜逐镜表、108 令牌、卡点帧 2420/2800/3780/4700/5600/6550/7200
  - 适用 scope: 本变更全部场景实现

## 决策
- **选型:** 令牌先行路线——motion-tokens.ts 实装 108 令牌 → 七幕逐幕全彩实装（每幕可独立渲染评审）→ 配乐多轨编排 → 分块渲染出片
- **对比方案:** 边做边定动效（规范作废，返工）；按幕拆多 change（前期已消险，单 change 分 Phase 即可）
- **理由:** motion-spec 已给全部令牌与开工清单（8 步），照单实装零设计返工；配乐定调「新挑多轨」——incompetech CC-BY 90 BPM 系候选 2-3 首下载供选，署名入 PR
- **渲染策略:** 沿用知识卡片实证对策——五段轮转 + 渲染前清场 + 杀手窗微块重试；成片渐变保留（半透明崩溃用重试收敛，样片的硬切不适用于成片质感）
- **配乐清理:** v5 落选 BGM 候选（at-rest/meditation/sincerely/crypto/lemonade 5 首）在本变更内随选曲定稿清理

## 任务
### Phase 1 令牌库与配乐
- [x] motion-tokens.ts 实装（曲线基元 4 + 元素令牌 31 + 镜头 15 + 粒子 9 + 转场 42 + 调色 7 的 Remotion 落地，按 motion-spec §1-§6） — `videos/site-film/motion-tokens.ts`
- [x] 90 BPM 系配乐候选下载（incompetech CC-BY，2-3 首铺七幕情绪弧）+ 用户选曲 + 入库 `public/site-film/` — `videos/site-film/assets/bgm-selection.md`
### Phase 2 前三幕实装
- [x] Act 1 序章（光尘书桌/打字机宣言全复刻站点 TypewriterMotto/品牌落版，全彩） — `videos/site-film/scenes/`
- [x] Act 2 起步与沉默（代码夜/热力图生长/版本星轨/骤暗/零柱/金句/时间轴失色，七镜） — `videos/site-film/scenes/`
- [x] Act 3 重启与复燃（生成式封面/宣言信纸/钤印重鼓@2420/10,330 光毯/上线白闪，五镜） — `videos/site-film/scenes/`
### Phase 3 Act 4 产品巡礼（16 镜全彩，复用 preprod 板面升彩 + motion 令牌）
- [x] 巡礼前半 8 镜（首页全景→目录纸卷） — `videos/site-film/scenes/`
- [x] 巡礼后半 8 镜（点赞→联系钤印） — `videos/site-film/scenes/`
### Phase 4 后三幕实装
- [x] Act 5 创作人文（坐忘歌诗影/书墙书摘/足迹拍立得/光标承转，全片最慢呼吸幕） — `videos/site-film/scenes/`
- [x] Act 6 影子工作流（终端/五段纸舟/归档墙/双轴/Meta 穿屏/落款，六镜） — `videos/site-film/scenes/`
- [x] Act 7 向好与落版（年度冲顶/书房全景/墨点凝成/落版钤印，四镜） — `videos/site-film/scenes/`
### Phase 5 编排与出片
- [x] SiteFilm 主 Composition（七幕 Sequence 编排 + 双轨/多轨 BGM 音量包络对拍 90 BPM）+ Root 注册 + render 脚本 — `videos/site-film/SiteFilm.tsx`, `src/Root.tsx`, `package.json`
- [x] 分段渲染全片（分块+清场+轮转对策）+ INV-1..4 对账 + 成片走查交用户 — `out/site-film.mp4`

## 结果
- 实际耗时: —
- 验证: —（L 级逐条对账：INV-1 grep 探针 · INV-2 七幕帧表 vs ffprobe · INV-3 bgm-selection.md 署名走查 · INV-4 实现对照 motion-spec 矩阵走查 · 成片关键帧走查）

## 知识评估
- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/video-studio-structure.md（增补：多轨配乐对拍实装经验、全彩成片渲染实测数据）
- **理由:** 多轨 BGM 对拍与全彩 7200 帧渲染为本仓首次，实现后以 runtime 深度回写
