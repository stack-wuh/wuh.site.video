---
title: 视频工作室结构与渲染工具链
domain: video-materials
keywords: [工作室结构, 分镜, 视频, 脚手架, new-video, 渲染, render, chrome, 端口, 段错误, 崩溃, 沙箱, node22]
scope: [brand/, videos/, scripts/, src/Root.tsx, package.json]
status: active
source:
  - ../../../x.wuh.site/shadow-docs/changes/20261024-feature-wuh-site-video-studio/brief.md
verified: 2026-10-24
verified-depth: runtime
verified-scope: 2026-10-24 新仓首渲实测：node 22.23.2 直跑 remotion render 出 out/self-intro.mp4（635KB，330/330 帧）；tsc 零错误（TSC-OK）；new-video 冒烟生成走查；studio 预览 SelfIntro 注册与三段 Sequence 时间轴截图确认、零 console 报错。node 24 V8 段错误为 4 份 macOS 崩溃报告实证（崩溃栈分属解析/GC/编译三处），硬件内存嫌疑未做诊断、标注待验证。
---

# 视频工作室结构与渲染工具链

## 当前结论

仓库为「工作室三层」结构：`brand/tokens.ts` 是色板与字体栈的唯一事实源；`videos/<slug>/` 是自包含的视频单元（组件 + Composition 注册 + 专属 assets/）；`shared-assets/` 放跨视频素材；`scripts/new-video.mjs` 生成新视频骨架；`src/Root.tsx` 是全部 Composition 的注册中心。

渲染工具链口径：node 22.23.2（`.mise.toml` 钉死）；`--browser-executable` 指向系统 Chrome（chrome-headless-shell 在本机网络下载卡死，不用）；`--port=3211`（Remotion 内部服务默认 3000 与 x.wuh.site Next dev server 冲突）；`--crf=16`（B 站二压留余量）。

## 执行约束

- 分镜组件禁止内联色值/字体字面量，一律引用 `brand/tokens`；白名单仅 SplitScreen 的 macOS 红绿灯 3 色（#e06c60/#e0b050/#7db27a）
- 新视频走 `pnpm new-video <slug>` 生成骨架，手动在 `src/Root.tsx` 注册并加 `render:<slug>` 脚本，沿用上述渲染口径
- 本机执行安装、渲染、shadow-dev CLI 一律绕开沙箱：沙箱内 pnpm 安装卡死、V8 段错误、CLI 挂起（均实测复现）
- 渲染无输出超过 2 分钟先 kill 进程重试；`--log=verbose` 走 stderr 无缓冲可见进度；重试可过的随机崩溃不再当新故障排查
- 不用 node 24 跑重 JS 任务（V8 堆随机段错误，崩溃报告实证）；若换机器，本卡工具链口径需重验后再沿用

## 适用边界

适用于本机（Intel MBP 2019 / i5-8279U）个人出片流水线。不适用于云渲染（Remotion Lambda 等场景本卡口径未验证）；硬件诊断完成前，「内存硬件嫌疑」仅为假设，不作为结论引用。

## 验证方式

- `pnpm typecheck`（node 22 下）零错误
- `grep -rn "#[0-9a-fA-F]{6}" videos src`（排除 tokens.ts）仅剩红绿灯白名单；`grep "Songti\|PingFang\|Menlo" videos src` 零命中
- `pnpm render:<slug>` 出片且时长帧数正确
- `node scripts/new-video.mjs <slug>` 生成后 `node --check` 与产物走查

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
