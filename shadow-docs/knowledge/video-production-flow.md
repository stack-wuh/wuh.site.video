---
title: 视频制作流程（前期三件套 → 正式制作 → 渲染出片）
domain: video-materials
keywords: [制作流程, 前期, 分镜, storyboard, motion-spec, animatic, 正式制作, 素材库, 分镜师, UE, 多代理, 多片, FilmShell, shell, 三段装配]
scope: [videos/, shadow-docs/knowledge/, scripts/, src/Root.tsx, .github/workflows/]
status: active
source:
  - changes/20261025-feature-site-film-preprod/brief.md
  - changes/20261025-feature-site-film-production/brief.md
  - changes/20261031-feature-wuh-site-intro-v2-production/brief.md
verified: 2026-11-01
verified-depth: runtime
verified-scope: site-film《朝朝如念》4:00 成片全流程实证（素材库→分镜 45 镜→动效规范 108 令牌→animatic→正式制作→分段渲染出片）；2026-11-01 第二片 wuh-site-intro-v2 正式制作落地（57 镜 / 124 令牌 / FilmShell 三段装配 / render-film --unit + CI film 输入），本片出片待 CI 实证
---

# 视频制作流程（前期三件套 → 正式制作 → 渲染出片）

## 当前结论

长片（≥2min）按**两段式**推进，前期定稿后再正式制作，避免在错误叙事上烧动效工时：

1. **前期四件套**（一次 change 完成，评审通过后另立 change 正式制作）：
   - 素材库 `materials.md`：八节真实素材全溯源（源码细节/API 数据/金句库），每条标注来源
   - 分镜脚本 `storyboard.md`：逐镜表（镜号/画面/镜头语言/文案/时长/转场/音效点）+ **帧数对账表**（各幕相加=总帧数）
   - 动效规范 `motion-spec.md`：令牌化（曲线/弹性/镜头/粒子/转场/调色）+ **全镜覆盖矩阵**（每镜入场/持续/出场/转场必有令牌）
   - Animatic 分镜板：真实内容**单色简板**（非空框）预演节奏，用户定稿后进正式制作
2. **正式制作**：令牌库先行（motion-tokens.ts 落地规范）→ 七幕场景实装 → 配乐多轨接线（90 BPM 对拍）→ 分段渲染出片
3. **多片化（2026-11-01 落地）**：单元自包含——`videos/<unit>/film.config.json` 声明 shell（intro/outro 帧）时，`shots.mjs sync` 给 film/audio 路由算「片头+正片+片尾」时长；`render-film.mjs --unit` 派生 composition 前缀（site-film→SiteFilm、wuh-site-intro-v2→WuhSiteIntroV2）、缓存目录、音轨 id 与中间产物，并做三段装配（片头/片尾直接对 film comp 取 frameRange，与逐镜段一起 concat）；CI `render-film.yml` 用 `film` 输入跑任意单元。默认 `--unit site-film` 行为零变化
3. **专家多代理**：分镜师、UE 动效大师以专职 subagent 并行产出文档，协调方只做对账与整合；场景实装可多幕并行（独立文件、零共享状态）

## 执行约束

- 分镜师 brief 必含：总帧数硬约束、素材编号引用要求、对账表自查；UE 大师 brief 必含：覆盖矩阵行数要求、Remotion 可实现约束（不引 UE 专属概念）
- 片长变更在前期阶段做（改分镜数字重排即可）；正式制作开始后改片长=重渲全片
- 真实数据优先：能抓 API 就抓（如 /api/music/playlist?playlistId=、/api/about/activity），素材库全条目标注抓取日期
- 配乐全部 CC-BY 可溯源，署名清单随片交付（B 站简介用）；下载的音频用 ffprobe/afinfo 验格式（原站可能误发视频文件）

## 适用边界

本机（Intel MBP 2019）个人出片流水线。渲染可靠性见 [[render-stability-playbook]]。

## 验证方式

- storyboard 帧数对账表合计 = animatic/成片 ffprobe 帧数
- motion-spec 覆盖矩阵 45/45（或全镜数）走查
- 素材库每条有来源标注
- 成片 ffprobe：帧数/时长/音轨三项
- 多片：`shots.mjs check`（默认 site-film）与 `shots.mjs check --unit <film>` 双绿；带 shell 的单元成片帧数 = 片头 + 正片 + 片尾
