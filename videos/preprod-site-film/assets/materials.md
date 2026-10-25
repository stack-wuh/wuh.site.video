# site-film 素材库（v1 · 2026-10-25 采集）

> 来源标注：[源码] = x.wuh.site 仓库路径；[API] = wuh.site 线上接口；[文章] = 线上文章原文。全部真实可溯，INV-3 达标。

## 一、首页板块 [源码]

1. **Hero 落笔显现**：衬线「wuh.site · 朝朝如念」+「雾失楼台，月迷津渡」，标题/标语/按钮/社交 0/80/160/240ms 依次 write-fade 落笔（HomeView/HeroSection.tsx、styles/index.ts）
2. **打字机标语（招牌镜头）**：「写作是抵抗遗忘的方式，代码是构建世界的语言。」逐字打出（100ms+随机 40ms），光标 28px 径向微光追随，每字溅出 2-3 颗 3px 墨点粒子（600ms 消散），句下 accent 短划线（components/TypewriterMoto/index.tsx）
3. **联系纸张弹窗 + 钤印**：8 社交图标 → paper 风 Dialog + 22px 方形钤印（微/Q/T/G/豆/云/D）；微信 tagline「代码写诗，工具作画」；GitHub「开源是一种信仰」（HomeView/ContactArea.tsx、ContactConfig.ts）
4. **墨点时间轴**：年份衬线标签 + 6px accent 墨点 + 标题 + 彩色标签 + N 浏览；hover 染色左移（HomeView/index.tsx）
5. **微信读书书架**：近口懒加载 + 1.5s 微光横扫骨架屏 → 36×54 书封投影 +「阅读中/已读完」（HomeView/WereadSection.tsx）
6. **精选项目卡**：仓库名 + 描述 + 语言 + ☆N（HomeView/ProjectsSection.tsx）
7. **菱形分隔线**：双细线 + 菱形水墨装饰（HomeView/index.tsx OrnamentDivider）

## 二、内容页 [源码]

8. **信笺留言板 /guestbook**：720px 窄栏，留言挂 1px 纵线（9px 圆点节点，当日 accent）+ 衬线斜体「今天/昨天/前天」（guestbook/GuestbookPageView）
9. **About 弹幕聊天室**：触发卡双头像 → 1120×720 大窗，气泡左右分列、发送状态三态、双头像改昵称、「共 N 条 →」链信笺版（about/components/GuestbookBarrageDialog.tsx）
10. **生成式文章封面**：山峦/涟漪双曲线 SVG + 大标题 + 落款「wuh.site」（post/components/PostCover）
11. **藏印微旋标签**：文头标签按 hash 微旋 ±1.6°，像随意钤章（post/components/PostHeader sealTilt）
12. **目录纸卷**：sticky 侧栏章节跟随滚动居中 + 回顶/点赞工具列 + 第 N/M 篇 + 约 N 分钟读（post/PostView、post-toc.ts）
13. **文末版权页**：6 圆钮分享 + 生成分享图 PNG + 导出全文（post/PostView ShareCard）
14. **点赞浮动按钮**：圆钮组，赞后「已赞 N」（post/components/FloatingActions）

## 三、工具页 [源码]

15. **音乐年轮 /music**：年份数字本身当刻度带（选中放大、按距缩淡）+ 巨型年份水印 120-210px 6% 透明（music/MusicView、styles Rail/Watermark）
16. **黑胶碟心**：播放 5s/圈慢转，conic 高光 + repeating-radial 唱纹；切年换面：淡出→轻转 120°→淡入 620ms（连续切自动收短 240ms）
17. **曲目行**：补零 mono 编号 hover 翻播放键；三墨柱 EQ（0.9s 循环、相位差 0.18s，暂停冻结 scaleY 0.35）；本卷最热「按语」引言体 + 最爱徽章
18. **全局迷你播放器**：左下 440px 纸卡 dock + 书耳 + 歌名跑马灯（components/player/GlobalAudioPlayer）
19. **About 全家桶**：Hero「About · 吴尒红」+ GitHub 资料行 + 平台卡（GitHub/语雀/公众号）+ 暖色活动热力图 + 时间线筛选 + 足迹地图 380px + 弹幕入口
20. **足迹页 /footprint**：全幅地图 + 标记切换「地名+日期+照片九宫格+B 站视频+游记」（footprint/page.tsx）
21. **设计系统页 /design/system-color**：酒红/素雅即时换装 + 100-900 全阶色卡（实时 getComputedStyle）+「试墨拖拽」demo
22. **主题页 /topics/[label]**：`#标签名` 大标题 + 墨点时间轴复用

## 四、设计语言 [源码]

23. **微光呼吸 × 书写显现**：rise-fade（上移 12px）/ write-fade（落笔 4px）两套 keyframes；`.reveal` 纯 CSS scroll-driven（animation-timeline: view()，entry 0→35%）；`@view-transition` 零 JS 页面切换；reduced-motion 全站关停（styles/motion.ts）
24. **书卷/印章隐喻命名体系**：钤印、墨点、纸卷、书耳、按语、题注、年轮、试墨——整站视觉概念一以贯之（locales/zh/site.ts、home.ts）
25. **三语界面**：zh/en/ja 全量词典随动（含打字机句）

## 五、真实数据 [API]（2026-10-25 采集）

- **年度统一活动**：`/api/about/activity` → 2025-10-26 至 2026-10-25 共 **10,330 次活动**，365 天逐日六维（visits/published/updated/comments/guestbook/projectUpdates/githubContributions）——热力图逐格真数据
- **足迹**：`/api/footprints` → 梧桐山 114.23,22.62（2025-09-20）、杨梅坑 114.585,22.55（2025-08-15）
- **年度浏览量**：2019:3,117 / 2020:3,563 / 2021:3,935 / 2022:2,139 / 2023:2,183 / 2024:2,319 / 2025:0 / 2026:4,387（历史最高）· 合计 **21,643**
- **文章**：46 篇（sitemap），最高《再读〈坐忘歌〉》1,673 阅读；最新《Vibe Coding Workflow 概述》
- **工程**：1168 commits（2024-12-08 起，685 天，峰值 2026-09 · 288/月）；版本 v1.0.1 → v2.0.0 共 107 tags；72 次性能打磨
- **上线日**：2026-06-14（流量切换，用户定稿）

## 六、VibeCoding · 影子工作流（2026-10-25 采集，用户点名补充）

- **工作流本体** [源码：shadow-dev-workflow 仓库]：2026-06-27 `feat: initial release — 6-stage dev workflow plugin` 诞生 → **247 commits · 12 个版本 tag（至 v6.3.1）** · propose→apply→review→release→publish 五段式 + 知识沉淀体系
- **沉淀规模** [源码：x.wuh.site/shadow-docs]：**254 个已归档 brief**（254 次完整工作流循环）· **40 张知识卡片** · 147 个 shadow 相关提交 · domain.md 上下文地图
- **叙事咬合**：06-14 流量切换上线 → **06-27 工作流诞生** → 此后 107 个版本高速迭代至 v2.0.0 ——「把开发方法本身做成 AI 工作流」与网站爆发期同步
- **Meta 时刻**：本视频由 shadow-dev-workflow 驱动制作（本 brief 即工作流循环的一部分，分镜师/UE 动效大师为工作流内多代理协作）——片尾可落「This film is made with shadow-dev-workflow」
- **六段式可拍概念**：propose（提案卡）/ apply（分镜师·UE 大师并行）/ review（质量门禁）/ release（PR）/ publish（发版 tag）——每段可转译为一幕「AI 舰队协作」视觉

## 七、人文金句库 [文章]

- 「不怒百神和畅，不恼心地清凉。」—— 司马承祯《坐忘歌》（《再读〈坐忘歌〉》核心引句）
- 「人生一世不过 3 万多天，实在是太短了。」
- 「日不过三餐，夜不过一宿……比起物质上的富足我更倾向于精神上的进步。」
- 「上班就好好上班……下班了就好好生活，玩游戏、写代码、找朋友聊天，玩累了就看看书、写写字。此乐何极~」
- 「欲望，是最恐怖的东西。」
- **《重启计划》宣言（叙事枢纽）**：「两天重新读了一下过去写过的博客，才发现我已经很久没有继续写博客了。……这样不好。」→「每周发布一篇博客，无限进步，开始重启计划~~」（2026-06-21）
- 站点题记体系：「朝朝如念」「雾失楼台，月迷津渡」「写作是抵抗遗忘的方式，代码是构建世界的语言。」「驿寄梅花，鱼传尺素」「代码写诗，工具作画」「开源是一种信仰」「点赞吧~」「天才向左，疯子向右」

## 八、最值得进宣传片的 Top 10 [源码+API 综合排序]

1. 打字机标语 + 笔尖微光 + 墨点粒子（站点签名动画，第一镜复刻）
2. 音乐年轮：年轮刻度 + 黑胶碟心慢转 + 切年换面 120° + 巨型年份水印
3. 三墨柱 EQ（暂停冻结细节）+ 书耳跑马灯迷你播放器
4. 目录纸卷：active 章节随阅读滚动居中跟随
5. 生成式文章封面（山峦曲线 + wuh.site 落款）
6. 联系纸张弹窗 + 钤印方章 + 「代码写诗，工具作画」
7. About 暖色热力图（10,330 真数据逐格）+ 足迹地图（梧桐山/杨梅坑）
8. 弹幕聊天室（左右气泡/发送三态）vs 信笺留言板（纵线节点）双版对比
9. scroll-driven reveal + view-transition 页面漫游连拍
10. 墨点时间轴 hover 染色 + 书架骨架 shimmer（性能叙事）
