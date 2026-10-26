---
title: 视频工作室结构与渲染工具链
domain: video-materials
keywords: [工作室结构, 分镜, 视频, 脚手架, new-video, 渲染, render, chrome, 端口, 段错误, 崩溃, 沙箱, node22, staticFile, 分块渲染, 清场, animatic, storyboard, motion-spec]
scope: [brand/, videos/, scripts/, src/Root.tsx, package.json, public/]
status: active
source:
  - ../../../x.wuh.site/shadow-docs/changes/20261024-feature-wuh-site-video-studio/brief.md
  - changes/20261025-feature-site-film-preprod/brief.md
verified: 2026-10-25
verified-depth: runtime
verified-scope: 2026-10-24/25 两日实测：v5《朝朝如念》2:30 成片 + v6 前期 animatic 4:00 分镜板（7200 帧）出片。实证：分段+轮转编排+渲染前清场+分块重试的收敛策略；Composition 越界拒绝（getRealFrameRanges）；staticFile 以 public/ 为根；Chrome 对部分透明度叠渲染的确定性崩溃及 3 帧跳变规避；前期三件套（素材库→storyboard→motion-spec→animatic）+ 分镜师/UE 大师 subagent 协作出品。硬件内存嫌疑仍未做诊断，标注待验证。
---

# 视频工作室结构与渲染工具链

## 当前结论

仓库为「工作室三层」结构：`brand/tokens.ts` 是色板与字体栈的唯一事实源；`videos/<slug>/` 是自包含的视频单元（组件 + Composition 注册 + 专属 assets/）；`shared-assets/` 放跨视频素材；`scripts/new-video.mjs` 生成新视频骨架；`src/Root.tsx` 是全部 Composition 的注册中心。

渲染工具链口径：node 22.23.2（`.mise.toml` 钉死）；`--browser-executable` 指向系统 Chrome（chrome-headless-shell 在本机网络下载卡死，不用）；`--port=3211`（Remotion 内部服务默认 3000 与 x.wuh.site Next dev server 冲突）；`--crf=16`（B 站二压留余量）。

**素材路径约定**：Remotion `staticFile()` 以 `public/` 为根——音频等静态资产放 `public/<slug>/`（如 `public/site-journey/bgm.mp3`），母带留存 `videos/<slug>/assets/`；**Composition 一致性**：`src/Root.tsx` 的 `durationInFrames` 必须与分段时间轴一致，分段渲染 `--frames` 越界会在启动期被 `getRealFrameRanges` 确定性拒绝（报错在 stderr，易被空日志掩盖）。

**前期制作三件套**（长片预流程）：素材库（materials.md，全条目标注真实数据源）→ 分镜脚本（storyboard.md，逐镜表 + 帧数对账表）→ 动效规范（motion-spec.md，令牌化 + 全镜覆盖矩阵）→ animatic 分镜板（灰盒/单色简板，构图+节拍+字幕，评审节奏后再正式制作）。分镜师、UE 动效大师以专职 subagent 并行产出，协调方负责对账与整合。

## 执行约束

- 分镜组件禁止内联色值/字体字面量，一律引用 `brand/tokens`；白名单仅 SplitScreen 的 macOS 红绿灯 3 色（#e06c60/#e0b050/#7db27a）
- 新视频走 `pnpm new-video <slug>` 生成骨架，手动在 `src/Root.tsx` 注册并加 `render:<slug>` 脚本，沿用上述渲染口径
- 本机执行安装、渲染、shadow-dev CLI 一律绕开沙箱：沙箱内 pnpm 安装卡死、V8 段错误、CLI 挂起（均实测复现）
- 渲染无输出超过 2 分钟先 kill 进程重试；`--log=verbose` 走 stderr 无缓冲可见进度；重试可过的随机崩溃不再当新故障排查
- 内存可用 <4GB 时不启动渲染（崩溃与内存吃紧相关）；连续 3 次段错误立即停手，先跑 Apple 硬件诊断（重启按 D）或 memtest，不做无意义重试
- 不用 node 24 跑重 JS 任务（V8 堆随机段错误，崩溃报告实证）；若换机器，本卡工具链口径需重验后再沿用
- **长片渲染编排（2026-10-25 实证）**：多段轮转制（各段独立重试，一段卡死不阻塞他段）优于顺序重试；**每次尝试前清场孤儿 Chrome**（`pkill -f "remotion-shared-memory-capture"` + `pkill -f "headless=old"`，两次实证清场后首试即过）；长流累积崩溃时**分块化**（360 帧→60 帧微块逐块重试）必然收敛，块齐按 concat 清单三级拼接
- **半透明渐变崩溃规避**：本机 Chrome 对「部分透明度叠渲染」存在确定性崩溃（多板面同型实证）——样片/分镜板的元素 fade 一律用 2–3 帧硬切跳变，规避渐变中途帧
- **tsc/CLI 亦会静默段错误或挂起**（空诊断退出码非零）：重试口径同上；关键长任务日志落文件防覆盖丢证据

## 适用边界

适用于本机（Intel MBP 2019 / i5-8279U）个人出片流水线。不适用于云渲染（Remotion Lambda 等场景本卡口径未验证）；硬件诊断完成前，「内存硬件嫌疑」仅为假设，不作为结论引用。清场/分块/轮转策略已在 7200 帧级出片实证，更长片（>10000 帧）未验证。

## 验证方式

- `pnpm typecheck`（node 22 下）零错误
- `grep -rn "#[0-9a-fA-F]{6}" videos src`（排除 tokens.ts 与 assets/*.md 规范文档）仅剩红绿灯白名单；`grep "Songti\|PingFang\|Menlo" videos src` 零命中
- `pnpm render:<slug>` 出片且时长帧数正确；分段渲染逐段 ffprobe 对账 + 拼接后总帧数对账
- `node scripts/new-video.mjs <slug>` 生成后 `node --check` 与产物走查
- 前期三件套：storyboard 帧数对账表合计 = animatic `durationInFrames` = 成片 ffprobe 帧数

## 关联知识

- 无（本仓首批卡片）

## 文件存放与版本管理（Remotion 项目规范）

| 路径 | 进 git | 说明 |
|---|---|---|
| `videos/<slug>/*.tsx`、`motion-tokens.ts`、`components/` | ✅ | 场景源码，核心资产 |
| `videos/<slug>/assets/*.md`（素材库/分镜/规范/选曲文档） | ✅ | 施工图，评审与复用依赖 |
| `videos/<slug>/assets/bgm*-candidate-*` | ❌ gitignore | 试听候选（本地文件，单首 4–13MB），选中的转为正式轨入 `public/` |
| `public/<slug>/*.m4a` | ✅ | 渲染依赖（staticFile 以 public/ 为根），其他机器/CI 出片必需；单轨 AAC ≤8MB 可接受，>50MB 考虑 LFS |
| `out/`（成片/分段/微块/日志/一次性攻坚脚本） | ❌ gitignore | 渲染产物与临时物；可重生成的都不进 |
| `*.log` | ❌ | 渲染日志 |
| 落选音频候选 | ❌ | 选曲定稿后随变更清理 |

原则：**能由源码+资产确定性重生的不进 git；渲染依赖（staticFile 引用物）必进**。
