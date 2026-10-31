---
{
  "schema": "shadow-dev/v1",
  "name": "20261031-feature-font-assetization",
  "type": "feature",
  "scope": "video-materials",
  "status": "proposed",
  "baseBranch": "main",
  "branch": null,
  "files": [
    "brand/fonts.ts",
    "brand/tokens.ts",
    "package.json",
    "pnpm-lock.yaml",
    "src/index.ts"
  ],
  "github": {
    "repository": "stack-wuh/wuh.site.video",
    "issue": 23,
    "issueUrl": "https://github.com/stack-wuh/wuh.site.video/issues/23",
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
    "checkpoint": "issue:23",
    "planHash": "a42114a4c7b4fe36132fac51b4492279bce2fffabbda862950ff8c7cd7c12eaa",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] 字体资产化——跨平台字形统一（fontsource 入仓）",
      "titleRaw": "[feature] 字体资产化——跨平台字形统一（fontsource 入仓）",
      "supplement": "tokens 家族名首位切换资产字体（Noto Serif SC / Noto Sans SC，经 @fontsource npm 依赖入仓），全平台（本机 mac / CI linux）字形统一，中文字符不再依赖 fontconfig 兜底。基线影响：全部视频单元字形变化属预期，新基线以本 change 后首次渲染为准。详见 shadow-docs/changes/20261031-feature-font-assetization/brief.md",
      "body": "## 动机\nCI 首次全片出片实证：字体家族名（Songti SC/PingFang SC/Menlo）在 Linux 无解析，中文字符整段消失，fontconfig 别名只是补丁——字形仍是 Noto 替代字形，与本机 Songti/PingFang 存在度量与笔画差异，CI 成片永远到不了像素定稿档。字体资产化是终局：字体文件经 npm 依赖入仓，所有平台（本机 mac / CI linux）加载同一份字形，tokens 家族名全平台解析到同一资产。\n\n## 引用规范\n- shadow-docs/knowledge/video-studio-structure.md\n  - 当前结论: brand/tokens 是字体栈唯一事实源；分镜组件禁内联字体字面量\n  - 适用 scope: brand/, videos/, src/\n- shadow-docs/knowledge/render-stability-playbook.md\n  - 当前结论: 渲染确定性纪律\n  - 适用 scope: scripts/\n\n## 决策\n- **选型:** @fontsource/noto-serif-sc + @fontsource/noto-sans-sc（OFL 许可可分发；woff2 经 npm 入 node_modules 不进 git——规避 LFS；css 的 @font-face + unicode-range 分片由 Remotion webpack 内建 css 支持处理，headless Chrome 按需加载）；tokens 家族名首位改 \"Noto Serif SC\"/\"Noto Sans SC\"，Songti/PingFang 降为兜底；mono 以拉丁为主维持 Menlo + CI 别名兜底\n- **对比方案:** 字体文件直接入仓（触发 >50MB LFS 门槛，弃）；fontconfig 别名永续（字形仍非定稿字形，弃）；Google Fonts CDN 运行时加载（渲染期网络违反确定性纪律，弃）\n- **理由:** 用户拍板走资产化；fontsource 是唯一同时满足「入仓不触 LFS + 免下载 + 跨平台同字形」的路径\n- **基线影响声明:** 合入后全部视频单元字形变化——既有 SSIM 基线失效属预期，新基线以本 change 后首次本机渲染为准\n\n## 任务\n### Phase 1 资产接入\n- [ ] fontsource 依赖与 brand/fonts.ts（css 副作用加载：serif/sans 各 400/700，chinese-simplified + latin 子集） — `package.json`, `brand/fonts.ts`\n- [ ] 入口副作用 import；tokens 家族名首位切换资产字体 — `src/index.ts`, `brand/tokens.ts`\n### Phase 2 验证\n- [ ] typecheck 绿 + CI matrix 全片出片 + 抽帧对比字形（Noto SC 命中、无缺字） — `out/`\n\n## 补充\ntokens 家族名首位切换资产字体（Noto Serif SC / Noto Sans SC，经 @fontsource npm 依赖入仓），全平台（本机 mac / CI linux）字形统一，中文字符不再依赖 fontconfig 兜底。基线影响：全部视频单元字形变化属预期，新基线以本 change 后首次渲染为准。详见 shadow-docs/changes/20261031-feature-font-assetization/brief.md\n\n完整 brief：shadow-docs/changes/20261031-feature-font-assetization/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261031-feature-font-assetization\",\"type\":\"feature\",\"scope\":\"video-materials\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261031-feature-font-assetization/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    },
    "commit": {
      "files": [
        "brand/fonts.ts",
        "brand/tokens.ts",
        "package.json",
        "pnpm-lock.yaml",
        "shadow-docs/changes/20261031-feature-font-assetization",
        "src/index.ts"
      ],
      "message": "feat(video-materials): 字体资产化——fontsource 入仓 + tokens 家族名统一 Noto SC（跨平台字形一致）"
    }
  }
}
---

# 字体资产化——跨平台字形统一

## 动机
CI 首次全片出片实证：字体家族名（Songti SC/PingFang SC/Menlo）在 Linux 无解析，中文字符整段消失，fontconfig 别名只是补丁——字形仍是 Noto 替代字形，与本机 Songti/PingFang 存在度量与笔画差异，CI 成片永远到不了像素定稿档。字体资产化是终局：字体文件经 npm 依赖入仓，所有平台（本机 mac / CI linux）加载同一份字形，tokens 家族名全平台解析到同一资产。

## 复杂度评级
- **评级:** M
- **理由:** 契约变更——brand/tokens 的 fontFamilies 家族名首位改为资产字体，**所有视频单元（site-film/self-intro/preprod/ident）字形统一变化**；触及面中——新增 brand/fonts.ts + src/index.ts 一行副作用 import + 依赖；可发现性——渲染抽帧即可验证
- **期望验证深度:** runtime（typecheck + CI 全片出片 + 抽帧字形对比）

## 领域模型

- **限界上下文:** video-materials — 字体是品牌令牌的一部分（卡片口径：色板与字体栈的唯一事实源在 brand/tokens）。下游全部视频单元。
- **统一语言增量:** 资产字体（经 npm 依赖入仓、渲染时随 bundle 分发的字形文件，家族名与 fontsource 一致）
- **聚合与不变量:**
  - `brand`（brand/tokens.ts + brand/fonts.ts）：INV-F1: fontFamilies 每个栈的首位家族名必须在任何平台均可解析（资产字体或系统字体）；INV-F2: 中文与拉丁字形来源唯一（资产字体），不依赖 runner/本机的 fontconfig 兜底
- **领域事件:** 本 change 合入 → 全平台字形统一为 Noto SC → 既有成片对比基线失效，SSIM 漂移门验收（Issue #9 task-8）改以「资产字体新基线」为准

## 引用规范
- shadow-docs/knowledge/video-studio-structure.md
  - 当前结论: brand/tokens 是字体栈唯一事实源；分镜组件禁内联字体字面量
  - 适用 scope: brand/, videos/, src/
- shadow-docs/knowledge/render-stability-playbook.md
  - 当前结论: 渲染确定性纪律
  - 适用 scope: scripts/

## 决策
- **选型:** @fontsource/noto-serif-sc + @fontsource/noto-sans-sc（OFL 许可可分发；woff2 经 npm 入 node_modules 不进 git——规避 LFS；css 的 @font-face + unicode-range 分片由 Remotion webpack 内建 css 支持处理，headless Chrome 按需加载）；tokens 家族名首位改 "Noto Serif SC"/"Noto Sans SC"，Songti/PingFang 降为兜底；mono 以拉丁为主维持 Menlo + CI 别名兜底
- **对比方案:** 字体文件直接入仓（触发 >50MB LFS 门槛，弃）；fontconfig 别名永续（字形仍非定稿字形，弃）；Google Fonts CDN 运行时加载（渲染期网络违反确定性纪律，弃）
- **理由:** 用户拍板走资产化；fontsource 是唯一同时满足「入仓不触 LFS + 免下载 + 跨平台同字形」的路径
- **基线影响声明:** 合入后全部视频单元字形变化——既有 SSIM 基线失效属预期，新基线以本 change 后首次本机渲染为准

## 任务
### Phase 1 资产接入
- [x] fontsource 依赖与 brand/fonts.ts（css 副作用加载：serif/sans 各 400/700，chinese-simplified + latin 子集） — `package.json`, `brand/fonts.ts`
- [x] 入口副作用 import；tokens 家族名首位切换资产字体 — `src/index.ts`, `brand/tokens.ts`
### Phase 2 验证
- [ ] typecheck 绿 + CI matrix 全片出片 + 抽帧对比字形（Noto SC 命中、无缺字） — `out/`

## 结果
- 实际耗时: —
- 验证: —

## 知识评估
- **预期影响:** 更新
- **候选卡片:** video-studio-structure.md（字体栈口径变更：资产字体优先 + fontsource 路径）
- **理由:** 字体栈唯一事实源的口径变化，须 runtime 验证后回写
