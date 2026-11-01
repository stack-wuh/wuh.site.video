---
{
  "schema": "shadow-dev/v1",
  "name": "20261101-build-quality-gate",
  "type": "build",
  "scope": "video-materials",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "build/20261101-build-quality-gate",
  "files": [
    ".github/workflows/quality-gate.yml",
    "package.json",
    "pnpm-lock.yaml",
    "scripts/shots.mjs",
    "shadow-docs/knowledge/video-studio-structure.md",
    "videos/preprod-site-film/boards.tsx",
    "videos/site-film/shots/s31.tsx",
    "videos/site-film/shots/s34.tsx",
    "videos/site-film/shots/s36.tsx",
    "videos/wuh-site-intro-v2/motion-tokens.ts",
    "videos/wuh-site-intro-v2/shots/s12.tsx",
    "videos/wuh-site-intro-v2/shots/s13.tsx",
    "videos/wuh-site-intro-v2/shots/s17.tsx",
    "videos/wuh-site-intro-v2/shots/s18.tsx",
    "videos/wuh-site-intro-v2/shots/s19.tsx",
    "videos/wuh-site-intro-v2/shots/s20.tsx",
    "videos/wuh-site-intro-v2/shots/s32.tsx",
    "videos/wuh-site-intro-v2/shots/s39.tsx",
    "videos/wuh-site-intro-v2/shots/s52.tsx",
    "videos/wuh-site-intro-v2/shots/s54.tsx"
  ],
  "github": {
    "repository": "stack-wuh/wuh.site.video",
    "issue": 44,
    "issueUrl": "https://github.com/stack-wuh/wuh.site.video/issues/44",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "2c5684ec2304f35b00d54be4f1a1bff97d47fdbe",
    "verifiedAt": "2026-11-01T04:11:30.635Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:44",
    "planHash": "0ab316955f7301615288b92e190ec767839f18cc9af906b09adc6b7dbf536840",
    "updatedAt": null,
    "lastError": null,
    "worktree": "/Users/wuhong/shadow-desktop/github/wuh.site.video/.worktrees/20261101-build-quality-gate",
    "issuePlan": {
      "title": "[build] 建立 oxlint + TypeScript 7 质量门（本地 + CI）",
      "titleRaw": null,
      "supplement": "",
      "body": "## 动机\n仓库目前只有 `typecheck` 脚本，没有 lint。typecheck 门曾在 `95f45ec` 加入 `render-film.yml`，3 分钟后因 intro-v2 的存量类型错误在 `d96aafd` 撤下。结果是 7 个真实类型错误（令牌引错源，运行时颜色为 `undefined`）留在 main 上，18 条 lint 级问题（未使用 import / 变量 / 参数）无人发现。本机 `pnpm typecheck` 在段错误风暴期反复 `exit 139` 空输出，类型检查结果不可信；CI 上 TypeScript 5.9 需约 8 秒。\n\n本变更用 oxlint（Rust，实测 0.49s / 219 文件）与 TypeScript 7（Go 原生编译器，实测 0.997s）建立同一套本地 + CI 质量门，并把存量问题一次清零。\n\n## 引用规范\n- `norms/code-style.md`\n  - 当前结论: 禁新增 `any`；不为绕过编译器错误而扩大类型或关闭检查；渐进式治理，不顺手重写无关代码。\n  - 适用 scope: 全部新增与修改代码\n- `shadow-docs/knowledge/video-studio-structure.md`\n  - 当前结论: `pnpm typecheck`（node 22 下）零错误是验证方式；tsc/CLI 也会静默段错误（exit 139 空日志）；不用 node 24 跑重 JS 任务。\n  - 适用 scope: `brand/`, `videos/`, `scripts/`, `src/Root.tsx`, `package.json`\n- `shadow-docs/knowledge/render-stability-playbook.md`\n  - 当前结论: typecheck 没绿就渲染＝白烧数十分钟；先绿后渲是硬门槛；段错误风暴有潮汐。\n  - 适用 scope: `videos/`, `brand/ident/`, `scripts/`, `out/`, `package.json`, `.github/workflows/`\n\n## 决策\n- **选型:** `oxlint@1.90.0`（固定版本）+ `typescript@7.0.2`；新增 `lint` / `typecheck` / `check` 脚本与 `.github/workflows/quality-gate.yml`（PR + push main）；存量 19 条 oxlint warning 与 7 个类型错误一次清零。\n- **对比方案:** 保持 TypeScript 5.9——零升级风险，但本机 tsc 仍会 exit 139，类型检查结果不可信，「快速自查」只有 oxlint 一半成立；ESLint 全家桶 / Biome——依赖重、慢一个数量级，Biome 的格式化会一次性改 24k 行，且两者都不做类型检查，tsc 仍须保留。\n- **理由:** 实测 TypeScript 7 与 5.9 对同一 tsconfig 报出同样的 7 个错误，0.997s 完成；原生 Go 二进制不跑 V8，可绕开本机段错误风暴。`@remotion/*` 与 `remotion` 均未 import `typescript`，构建链不依赖编译器 API，升级风险可控。oxlint 默认规则实测 0.49s 发现 18 条问题；开启 react 插件后多发现 1 条（s36 渲染期变量重赋值），一并修正。\n- **执行注意:** 本 worktree 的 `node_modules` 是指向 `wuh.site.video-shot-pipeline` 的软链。安装新依赖前先解除软链并在本 worktree 独立安装，避免污染另一条工作线。若 TypeScript 7 在 apply 中遇阻，回退 5.9 时门禁脚本无需改动，只改依赖版本。\n- **基线修正（apply 实测）:** `main` 不含 `videos/zhi-guo-xiang`（PR #42 未合入），该单元的 2 条告警不属本 change，随其分支处理；`main` 的 intro-v2 r3 新增 `s54.tsx` 的 2 条告警已纳入本 change。总告警数仍为 19（17 条 unused + 1 条 spread + 1 条 react immutability）。\n\n## 任务\n### Phase 1 存量清零\n\n- [x] 修正 7 处令牌引用错源（`paperMist` / `paperDeep` / `lampAmber` / `statusGreen` 用错导入源） — `videos/wuh-site-intro-v2/shots/s12.tsx`, `s13.tsx`, `s17.tsx`, `s18.tsx`, `s19.tsx`, `s20.tsx`\n- [x] 清理 17 条未使用 import / 变量 / 参数与 1 条冗余 spread（s52） — `videos/wuh-site-intro-v2/motion-tokens.ts`, `s32.tsx`, `s39.tsx`, `s52.tsx`, `s54.tsx`, `videos/site-film/shots/s31.tsx`, `s34.tsx`, `videos/preprod-site-film/boards.tsx`, `scripts/shots.mjs`\n- [x] 消除 s36 渲染期变量重赋值告警（用预计算代替可变累加） — `videos/site-film/shots/s36.tsx`\n- [x] 验证：`oxlint --react-plugin --deny-warnings src videos brand scripts` 零输出 — 观察点\n\n### Phase 2 工具与门禁\n\n- [x] `package.json`：devDependencies 加 `oxlint@1.90.0`、`typescript` 升 `7.0.2`；scripts 加 `lint` / `typecheck` / `check` — `package.json`\n- [x] 更新 lockfile — `pnpm-lock.yaml`\n- [x] 新增质量门工作流：PR + push main，ubuntu-24.04，node 22，pnpm 10，`pnpm lint` + `pnpm typecheck`，timeout 10min — `.github/workflows/quality-gate.yml`\n- [x] 验证：`pnpm check` 零 warning / 零 error — 观察点\n\n### Phase 3 验证\n\n- [x] 知识回写评估：验证命令由 `pnpm typecheck` 改为 `pnpm check`，补 TypeScript 7 / oxlint 口径 — `shadow-docs/knowledge/video-studio-structure.md`\n\n### Release 观察点（不参与 apply/review 门槛）\n\n- CI `quality-gate` 在 PR 上跑绿 — release 建 PR 后回填 run 链接。\n- intro-v2 受影响镜头抽帧或短段渲染走查 — 本机 `remotion still` 连续 4 次 SIGSEGV（bundling 阶段，node 24 / mise node 22 均复现），属既有段错误风暴；替代观察点：tsc 确认令牌属性存在 + grep 确认引用源修正。待风暴退去或 CI 出片后补。\n\n完整 brief：shadow-docs/changes/20261101-build-quality-gate/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261101-build-quality-gate\",\"type\":\"build\",\"scope\":\"video-materials\",\"status\":\"reviewed\",\"branch\":\"build/20261101-build-quality-gate\",\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261101-build-quality-gate/brief.md\",\"cliVersion\":\"1.8.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "build"
      ]
    },
    "release": {
      "files": [
        ".github/workflows/quality-gate.yml",
        "package.json",
        "pnpm-lock.yaml",
        "scripts/shots.mjs",
        "shadow-docs/changes/20261101-build-quality-gate/brief.md",
        "shadow-docs/knowledge/video-studio-structure.md",
        "shadow-docs/menu.md",
        "videos/preprod-site-film/boards.tsx",
        "videos/site-film/shots/s31.tsx",
        "videos/site-film/shots/s34.tsx",
        "videos/site-film/shots/s36.tsx",
        "videos/wuh-site-intro-v2/motion-tokens.ts",
        "videos/wuh-site-intro-v2/shots/s12.tsx",
        "videos/wuh-site-intro-v2/shots/s13.tsx",
        "videos/wuh-site-intro-v2/shots/s17.tsx",
        "videos/wuh-site-intro-v2/shots/s18.tsx",
        "videos/wuh-site-intro-v2/shots/s19.tsx",
        "videos/wuh-site-intro-v2/shots/s20.tsx",
        "videos/wuh-site-intro-v2/shots/s32.tsx",
        "videos/wuh-site-intro-v2/shots/s39.tsx",
        "videos/wuh-site-intro-v2/shots/s52.tsx",
        "videos/wuh-site-intro-v2/shots/s54.tsx"
      ],
      "message": "build(ci): 引入 oxlint 与 TypeScript 7 质量门",
      "title": "build(ci): 引入 oxlint 与 TypeScript 7 质量门",
      "body": "## 变更\n- 引入 `oxlint@1.90.0`（react 插件 + `--deny-warnings`）与 `typescript@7.0.2`（原生 Go 编译器），新增 `lint` / `check` 脚本\n- 新增 `.github/workflows/quality-gate.yml`：PR 与 `push main` 跑 `pnpm lint` + `pnpm typecheck`\n- 修正 intro-v2 7 处令牌引用错源（`paperMist` / `paperDeep` / `lampAmber` / `statusGreen`），运行时颜色由 `undefined` 恢复为定义值\n- 清理 19 条存量 lint 告警（17 条未使用符号 + 1 条冗余 spread + 1 条 react immutability）\n\n## 影响\n- 行为/触发面变化：PR 与 main push 新增质量门；intro-v2 的 s12/s13/s17/s18/s19/s20 六个镜头颜色恢复\n- 明确不受影响的范围：渲染链路、Composition 时长、站点产物、其他视频单元\n\n## 验证\n- `pnpm check` → oxlint 零输出、`tsc --noEmit` 零错误，exit 0\n- `tsc` 7.0.2 / `oxlint` 1.90.0；`pnpm install --frozen-lockfile` exit 0\n- 未覆盖项：CI `quality-gate` 绿灯与 intro-v2 像素走查待本 PR 触发后回填；本机 `remotion still` 连续 4 次 SIGSEGV（既有段错误风暴）\n\n## 关联\n- Closes #44\n- brief: shadow-docs/changes/20261101-build-quality-gate/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/video-studio-structure.md",
    "reason": "验证方式改为 pnpm check；补 TypeScript 7 / oxlint 口径；段错误边界：TS7 类型检查稳定，Remotion bundling 仍受 V8 风暴影响"
  }
}
---

# 建立 oxlint + TypeScript 7 质量门（本地 + CI）

## 动机

仓库目前只有 `typecheck` 脚本，没有 lint。typecheck 门曾在 `95f45ec` 加入 `render-film.yml`，3 分钟后因 intro-v2 的存量类型错误在 `d96aafd` 撤下。结果是 7 个真实类型错误（令牌引错源，运行时颜色为 `undefined`）留在 main 上，18 条 lint 级问题（未使用 import / 变量 / 参数）无人发现。本机 `pnpm typecheck` 在段错误风暴期反复 `exit 139` 空输出，类型检查结果不可信；CI 上 TypeScript 5.9 需约 8 秒。

本变更用 oxlint（Rust，实测 0.49s / 219 文件）与 TypeScript 7（Go 原生编译器，实测 0.997s）建立同一套本地 + CI 质量门，并把存量问题一次清零。

## 复杂度评级

- **评级:** M
- **理由:** 不改变 API / 协议 / 数据格式契约；触及构建脚本、CI 与 13 个源文件的机械修正；错误可由 `pnpm check` 机检、发现成本低。但 intro-v2 的 7 处令牌修正会让成片恢复本来应有的颜色，属局部行为变更，故不降为 S。
- **期望验证深度:** unit（本地 `pnpm check` 与 CI `quality-gate` 双绿，机器探针即完成证据）
- **取证策略:** observation

## 领域模型

- **限界上下文:** video-materials — 视频工程、品牌令牌、分镜组件与素材的唯一维护地。下游为 B 站成片发布；反腐边界是不收博客 / 桌面端物料，不做发布排期管理。
- **统一语言增量:** 质量门（quality gate）——本地 `pnpm check` 与 PR `quality-gate` 工作流执行的同一组二值判定；类型检查器 = TypeScript 7；lint = oxlint。
- **聚合与不变量:**
  - `INV-1 质量门`：`pnpm check` 必须零 oxlint warning、零 tsc error；任一不满足即判红。
  - `INV-2 令牌引用`：分镜组件引用的颜色令牌必须在其导入源的类型上存在（tsc 机检）；不允许用内联色值或 `as any` 绕过。
  - `INV-3 门禁一致性`：本地与 CI 使用同一 node 大版本（22）与同一 lockfile 版本；CI 红灯必须能用本机同一命令复现。
- **领域事件:** PR 创建或更新时触发 `quality-gate`；红则不得合并。main push 同样运行，守住直接推送。

## 引用规范

- `norms/code-style.md`
  - 当前结论: 禁新增 `any`；不为绕过编译器错误而扩大类型或关闭检查；渐进式治理，不顺手重写无关代码。
  - 适用 scope: 全部新增与修改代码
- `shadow-docs/knowledge/video-studio-structure.md`
  - 当前结论: `pnpm typecheck`（node 22 下）零错误是验证方式；tsc/CLI 也会静默段错误（exit 139 空日志）；不用 node 24 跑重 JS 任务。
  - 适用 scope: `brand/`, `videos/`, `scripts/`, `src/Root.tsx`, `package.json`
- `shadow-docs/knowledge/render-stability-playbook.md`
  - 当前结论: typecheck 没绿就渲染＝白烧数十分钟；先绿后渲是硬门槛；段错误风暴有潮汐。
  - 适用 scope: `videos/`, `brand/ident/`, `scripts/`, `out/`, `package.json`, `.github/workflows/`

## 决策

- **选型:** `oxlint@1.90.0`（固定版本）+ `typescript@7.0.2`；新增 `lint` / `typecheck` / `check` 脚本与 `.github/workflows/quality-gate.yml`（PR + push main）；存量 19 条 oxlint warning 与 7 个类型错误一次清零。
- **对比方案:** 保持 TypeScript 5.9——零升级风险，但本机 tsc 仍会 exit 139，类型检查结果不可信，「快速自查」只有 oxlint 一半成立；ESLint 全家桶 / Biome——依赖重、慢一个数量级，Biome 的格式化会一次性改 24k 行，且两者都不做类型检查，tsc 仍须保留。
- **理由:** 实测 TypeScript 7 与 5.9 对同一 tsconfig 报出同样的 7 个错误，0.997s 完成；原生 Go 二进制不跑 V8，可绕开本机段错误风暴。`@remotion/*` 与 `remotion` 均未 import `typescript`，构建链不依赖编译器 API，升级风险可控。oxlint 默认规则实测 0.49s 发现 18 条问题；开启 react 插件后多发现 1 条（s36 渲染期变量重赋值），一并修正。
- **执行注意:** 本 worktree 的 `node_modules` 是指向 `wuh.site.video-shot-pipeline` 的软链。安装新依赖前先解除软链并在本 worktree 独立安装，避免污染另一条工作线。若 TypeScript 7 在 apply 中遇阻，回退 5.9 时门禁脚本无需改动，只改依赖版本。
- **基线修正（apply 实测）:** `main` 不含 `videos/zhi-guo-xiang`（PR #42 未合入），该单元的 2 条告警不属本 change，随其分支处理；`main` 的 intro-v2 r3 新增 `s54.tsx` 的 2 条告警已纳入本 change。总告警数仍为 19（17 条 unused + 1 条 spread + 1 条 react immutability）。

## 任务

### Phase 1 存量清零

- [x] 修正 7 处令牌引用错源（`paperMist` / `paperDeep` / `lampAmber` / `statusGreen` 用错导入源） — `videos/wuh-site-intro-v2/shots/s12.tsx`, `s13.tsx`, `s17.tsx`, `s18.tsx`, `s19.tsx`, `s20.tsx`
- [x] 清理 17 条未使用 import / 变量 / 参数与 1 条冗余 spread（s52） — `videos/wuh-site-intro-v2/motion-tokens.ts`, `s32.tsx`, `s39.tsx`, `s52.tsx`, `s54.tsx`, `videos/site-film/shots/s31.tsx`, `s34.tsx`, `videos/preprod-site-film/boards.tsx`, `scripts/shots.mjs`
- [x] 消除 s36 渲染期变量重赋值告警（用预计算代替可变累加） — `videos/site-film/shots/s36.tsx`
- [x] 验证：`oxlint --react-plugin --deny-warnings src videos brand scripts` 零输出 — 观察点

### Phase 2 工具与门禁

- [x] `package.json`：devDependencies 加 `oxlint@1.90.0`、`typescript` 升 `7.0.2`；scripts 加 `lint` / `typecheck` / `check` — `package.json`
- [x] 更新 lockfile — `pnpm-lock.yaml`
- [x] 新增质量门工作流：PR + push main，ubuntu-24.04，node 22，pnpm 10，`pnpm lint` + `pnpm typecheck`，timeout 10min — `.github/workflows/quality-gate.yml`
- [x] 验证：`pnpm check` 零 warning / 零 error — 观察点

### Phase 3 验证

- [x] 知识回写评估：验证命令由 `pnpm typecheck` 改为 `pnpm check`，补 TypeScript 7 / oxlint 口径 — `shadow-docs/knowledge/video-studio-structure.md`

### Release 观察点（不参与 apply/review 门槛）

- CI `quality-gate` 在 PR 上跑绿 — release 建 PR 后回填 run 链接。
- intro-v2 受影响镜头抽帧或短段渲染走查 — 本机 `remotion still` 连续 4 次 SIGSEGV（bundling 阶段，node 24 / mise node 22 均复现），属既有段错误风暴；替代观察点：tsc 确认令牌属性存在 + grep 确认引用源修正。待风暴退去或 CI 出片后补。

## 结果

- 实际耗时: 约 15 分钟（11:59 建 worktree → 12:14 收口）
- 验证:
  | 不变量 | 观察点 |
  |---|---|
  | INV-1 | 观察点：`pnpm check` → oxlint 零输出、`tsc --noEmit` 零错误，exit 0 |
  | INV-2 | 观察点：`pnpm exec tsc --version` → 7.0.2；`tsc --noEmit` 零错误；7 处令牌引用已改到定义源（s12/s13 → `FILM_COLORS`，s17/s18/s19 → `colors`，s20 → `FILM_COLORS`） |
  | INV-3 | 观察点：`pnpm install --frozen-lockfile --ignore-workspace` → exit 0；`quality-gate.yml` 与本地同为 node 22 / pnpm 10 / 同一 lockfile；CI run 待 release 回填 |
- 证据缺口:
  - task-9：CI `quality-gate` 需 PR 触发，apply 阶段未推送；release 建 PR 后回填 run 链接。
  - task-10：本机 `remotion still` 连续 3 次 SIGSEGV（bundling 阶段，node 24 与 mise node 22 均复现），属既有段错误风暴；像素证据缺口，替代观察点为 tsc 确认令牌属性存在 + grep 确认引用源修正。待风暴退去或 CI 出片后补。

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/video-studio-structure.md`
- **理由:** 该卡的「验证方式」需从 `pnpm typecheck` 改为 `pnpm check`；新增 TypeScript 7 原生编译器 + oxlint 口径。实测 TS7 `tsc --noEmit` 零错误（约 1s），本机段错误风暴只影响 Remotion/webpack bundling（`remotion still` 3 次 SIGSEGV），不影响 TS7 类型检查。`render-stability-playbook.md` 的「typecheck 先绿后渲」仍成立，无需改动。
