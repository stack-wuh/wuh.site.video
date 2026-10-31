---
{
  "schema": "shadow-dev/v1",
  "name": "20261031-build-render-driver-ci",
  "type": "build",
  "scope": "video-materials",
  "status": "published",
  "baseBranch": "main",
  "branch": null,
  "files": [
    ".github/workflows/render-film.yml",
    "scripts/render-all.sh",
    "scripts/render-film.mjs"
  ],
  "github": {
    "repository": "stack-wuh/wuh.site.video",
    "issue": 11,
    "issueUrl": "https://github.com/stack-wuh/wuh.site.video/issues/11",
    "pullRequest": 12,
    "pullRequestUrl": "https://github.com/stack-wuh/wuh.site.video/pull/12"
  },
  "review": {
    "conclusion": "pending",
    "verifiedCommit": null,
    "verifiedAt": null
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:12",
    "planHash": "03858cbbe4c09af5adf620417752276faf5b231542a4a999eed8a35af2129cf3",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[build] 渲染驱动器（A 轨进程隔离）+ CI 云端渲染（B 轨承接）",
      "titleRaw": "[build] 渲染驱动器（A 轨进程隔离）+ CI 云端渲染（B 轨承接）",
      "supplement": "A 轨：render-all.sh 非 Node 外层驱动器——逐镜短命进程，段错误最多损失一镜，退出必通知；render-film.mjs 增 --bundle-dir/--assemble。B 轨：workflow_dispatch 手动触发 CI 渲染，复用同一驱动器，作为本机做不下去时的承接路径。详见 shadow-docs/changes/20261031-build-render-driver-ci/brief.md",
      "body": "## 动机\n本机 V8 段错误（exit 139）会杀死 35 分钟长命编排进程（2026-10-31 实证：全片渲染 2 镜后编排进程段错误、无通知静默死亡）。2026-10-31 用户拍板 A+B 双轨：A 轨把编排循环从 Node 挪到 shell——逐镜短命进程，段错误最多损失一镜；B 轨 GitHub Actions 云端渲染作为 A 轨做不下去时的承接路径。同时修复：内存守卫误拦纯 ffmpeg 装配路径。\n\n## 引用规范\n- shadow-docs/knowledge/render-stability-playbook.md\n  - 当前结论: 渲染前清场；段错误风暴潮汐；内存 <4GB 不启动渲染\n  - 适用 scope: scripts/\n- skills/shadow-dev-video/shot-spec.md（技能仓 main）\n  - 当前结论: §5 渲染管线 v2 + 方案 A 驱动器 / B 轨 CI 承接\n  - 适用 scope: scripts/, .github/\n\n## 决策\n- **选型:** A 轨 = render-film.mjs 增加 --bundle-dir（复用预打包）/ --assemble（缓存终装）+ CHROME_EXECUTABLE/RENDER_CONCURRENCY env 化；render-all.sh 为非 Node 外层驱动（bundle 一次 → 逐镜 --only ×3 重试 → assemble），退出必通知。B 轨 = workflow_dispatch 手动触发，复用同一驱动器，Chrome headless-shell 由 Remotion 在 CI 自动下载\n- **对比方案:** 编排进程内自愈（Node 段错误无法自捕，弃）；Bun 运行时（Remotion 不支持，弃）；Remotion Cloud（留作后续选项，本次不做）\n- **理由:** 用户拍板 A+B；A 零引擎迁移当日落地，B 复用同一驱动器零分叉\n- **CI 字体漂移:** serif 落 Noto Serif SC；sans/mono 替代字体——CI 成片用于链路验证与兜底，像素定稿以本机为准；字体资产化另立 change\n\n## 任务\n### Phase 1 A 轨\n- [ ] render-film.mjs：--bundle-dir / --assemble / CHROME_EXECUTABLE / RENDER_CONCURRENCY；内存守卫不拦纯 ffmpeg 装配 — `scripts/render-film.mjs`\n- [ ] render-all.sh 驱动器：bundle 一次 + 逐镜短命进程 ×3 重试 + 退出必通知 + assemble 终装 — `scripts/render-all.sh`\n### Phase 2 B 轨\n- [ ] render-film.yml：workflow_dispatch（全片/镜号子集）+ CJK 字体 + headless-shell + 产物上传 — `.github/workflows/render-film.yml`\n\n## 补充\nA 轨：render-all.sh 非 Node 外层驱动器——逐镜短命进程，段错误最多损失一镜，退出必通知；render-film.mjs 增 --bundle-dir/--assemble。B 轨：workflow_dispatch 手动触发 CI 渲染，复用同一驱动器，作为本机做不下去时的承接路径。详见 shadow-docs/changes/20261031-build-render-driver-ci/brief.md\n\n完整 brief：shadow-docs/changes/20261031-build-render-driver-ci/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261031-build-render-driver-ci\",\"type\":\"build\",\"scope\":\"video-materials\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261031-build-render-driver-ci/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "build"
      ]
    },
    "commit": {
      "files": [
        ".github/workflows/render-film.yml",
        "scripts/render-all.sh",
        "scripts/render-film.mjs",
        "shadow-docs/changes/20261031-build-render-driver-ci"
      ],
      "message": "build(video-materials): 渲染驱动器 A 轨进程隔离 + CI 云端渲染 B 轨承接"
    }
  }
}
---

# 渲染驱动器（A 轨进程隔离）+ CI 云端渲染（B 轨承接）

## 动机
本机 V8 段错误（exit 139）会杀死 35 分钟长命编排进程（2026-10-31 实证：全片渲染 2 镜后编排进程段错误、无通知静默死亡）。2026-10-31 用户拍板 A+B 双轨：A 轨把编排循环从 Node 挪到 shell——逐镜短命进程，段错误最多损失一镜；B 轨 GitHub Actions 云端渲染作为 A 轨做不下去时的承接路径。同时修复：内存守卫误拦纯 ffmpeg 装配路径。

## 复杂度评级
- **评级:** S
- **理由:** 触及面小——1 个脚本加两个模式参数 + 1 个 shell 驱动器 + 1 个 workflow 文件；无契约变更（缓存键/产物格式不变）；可发现性走查即得
- **期望验证深度:** code-read + assemble 守卫实测（渲染路径待内存窗口期实跑，Issue #9 task-8 统一收口）

## 引用规范
- shadow-docs/knowledge/render-stability-playbook.md
  - 当前结论: 渲染前清场；段错误风暴潮汐；内存 <4GB 不启动渲染
  - 适用 scope: scripts/
- skills/shadow-dev-video/shot-spec.md（技能仓 main）
  - 当前结论: §5 渲染管线 v2 + 方案 A 驱动器 / B 轨 CI 承接
  - 适用 scope: scripts/, .github/

## 决策
- **选型:** A 轨 = render-film.mjs 增加 --bundle-dir（复用预打包）/ --assemble（缓存终装）+ CHROME_EXECUTABLE/RENDER_CONCURRENCY env 化；render-all.sh 为非 Node 外层驱动（bundle 一次 → 逐镜 --only ×3 重试 → assemble），退出必通知。B 轨 = workflow_dispatch 手动触发，复用同一驱动器，Chrome headless-shell 由 Remotion 在 CI 自动下载
- **对比方案:** 编排进程内自愈（Node 段错误无法自捕，弃）；Bun 运行时（Remotion 不支持，弃）；Remotion Cloud（留作后续选项，本次不做）
- **理由:** 用户拍板 A+B；A 零引擎迁移当日落地，B 复用同一驱动器零分叉
- **CI 字体漂移:** serif 落 Noto Serif SC；sans/mono 替代字体——CI 成片用于链路验证与兜底，像素定稿以本机为准；字体资产化另立 change

## 任务
### Phase 1 A 轨
- [x] render-film.mjs：--bundle-dir / --assemble / CHROME_EXECUTABLE / RENDER_CONCURRENCY；内存守卫不拦纯 ffmpeg 装配 — `scripts/render-film.mjs`
- [x] render-all.sh 驱动器：bundle 一次 + 逐镜短命进程 ×3 重试 + 退出必通知 + assemble 终装 — `scripts/render-all.sh`
### Phase 2 B 轨
- [ ] render-film.yml：workflow_dispatch（全片/镜号子集）+ CJK 字体 + headless-shell + 产物上传 — `.github/workflows/render-film.yml`

## 结果
- 实际耗时: —
- 验证: —（node --check / bash -n / --assemble 缺镜守卫实测（43 镜清单精确、exit 1）；--bundle-dir 渲染路径待渲染窗口期实跑）

## 知识评估
- **预期影响:** 更新
- **候选卡片:** render-stability-playbook（编排层段错误保险丝 + 驱动器模式 + Chrome 漂移地板实测值）
- **理由:** 待 site-film 渲染验收（Issue #9 task-8）runtime 实证后回写
