# wuh-site-intro-v3 资产登记表（站点真实素材资产层）

> 2026-11-08 首轮登记。行格式：`| 编号 | 类型(S/P) | 名称 | 文件路径或∅ | 来源与抓取日期 | 说明 |`，`shots.mjs import/check --unit wuh-site-intro-v3` 机检（INV-2/INV-4）。
> **本片裁定：不接 AI 生图**——C 型（角色）**不激活**，全部视觉资产为「站点真实素材」：wuh.site 线上页面高清截图 / GitHub 数据源页面截图 / 站点静态资源（书封）。
> **∅ 语义 = 未入库**：分镜资产列引用 P/S 编号而文件为 ∅ → check 红（引用即承诺已入库）。
> **版本纪律**：入库文件名必须带 `-vN` 后缀（如 `s05-music-v1.png`）；**换图必升级版本号并同步改镜组件 `staticFile` 引用**（shot-spec §8：staticFile 资产不在镜级缓存键 import 闭包内，只换内容不改引用 = 像素漂移）。
> 路径约定：采集件 `public/wuh-site-intro-v3/site/`（staticFile 以 public/ 为根，渲染依赖必进 git）；采集脚本 `scripts/harvest-site-shots.mjs`（清单驱动，登记表反驱动）。
> 采集规格（待确认点 2，首轮执行值）：1920×1080 视口 · **DPR 2**（出图 3840×2160）· PNG · 亮色主题（站点默认）· 每图等待 `document.fonts.ready` + 静置。

## 场景（S）——站点页面级截图

| 编号 | 类型 | 名称 | 文件 | 来源与抓取日期 | 说明 |
|---|---|---|---|---|---|
| S01 | S | 首页 Hero（题记落笔） | `public/wuh-site-intro-v3/site/s01-home-hero-v1.png` | wuh.site `/` · 2026-11-08 | 「wuh.site · 朝朝如念」+「雾失楼台，月迷津渡」+ 打字机标语 + 精选博客头部；1-1 题记镜打底 |
| S02 | S | 首页墨点时间轴（文章列表） | `public/wuh-site-intro-v3/site/s02-home-timeline-v1.png` | wuh.site `/`（滚动至精选博客）· 2026-11-08 | 墨点列表（真实浏览数）+ 年度总结 + 微信读书区；6-1 打底 |
| S03 | S | 文章页《再读〈坐忘歌〉》 | `public/wuh-site-intro-v3/site/s03-post-165-v1.png` | wuh.site `/post/165` · 2026-11-08 | 生成式水墨封面 + 首字下沉「常」+ 1,842 阅读 + 赞 2 + 目录纸卷；6-2 / 7-2 / 7-3 打底 |
| S04 | S | 微信读书书架 | `public/wuh-site-intro-v3/site/s04-weread-v1.png` | wuh.site `/weread` · 2026-11-08 | 「共 146 本」抬头 + 真封面书列（阅读日期）；6-3 打底 |
| S05 | S | 音乐年轮 / 黑胶 | `public/wuh-site-intro-v3/site/s05-music-v1.png` | wuh.site `/music` · 2026-11-08 | 年轮 2025→2018 刻度带 + 黑胶 + 「爱意听了 7,920 遍」+ 曲目真实播放数 + 巨型年份水印；6-4 打底 |
| S06 | S | 留言板 | `public/wuh-site-intro-v3/site/s06-guestbook-v1.png` | wuh.site `/guestbook` · 2026-11-08 | 720px 窄栏纵线节点；6-5 打底 |
| S07 | S | About 弹幕聊天室 | `public/wuh-site-intro-v3/site/s07-about-barrage-v1.png` | wuh.site `/about`（点击「见字如面」展开）· 2026-11-08 | Dialog 1120×720 + 气泡左右分列 + greeting 气泡；6-5 打底（交互采集成功） |
| S08 | S | About 热力图 | `public/wuh-site-intro-v3/site/s08-about-heatmap-v1.png` | wuh.site `/about`（滚动至热力图居中）· 2026-11-08 | 「综合活动热力图」365 格金格全览 + 输出平台卡 + 联系方式 + 最近日志；6-6 打底 |
| S09 | S | 足迹地图 | `public/wuh-site-intro-v3/site/s09-footprint-v1.png` | wuh.site `/footprint` · 2026-11-08 | 380px 暗色地图「我在这里」；4-3 / 6-6 打底 |
| S10 | S | 设计系统换装 | `public/wuh-site-intro-v3/site/s10-design-color-v1.png` | wuh.site `/design/system-color` · 2026-11-08 | 酒红/素雅 + 全阶色卡 + 试墨；6-7 打底 |
| S11 | S | 话题聚合 | `public/wuh-site-intro-v3/site/s11-topics-v1.png` | wuh.site `/topics` · 2026-11-08 | `#label` 聚合页；6-8 页面漫游之一 |
| S12 | S | About 最近日志（跨平台聚合） | `public/wuh-site-intro-v3/site/s12-about-recent-v1.png` | wuh.site `/about`（滚动至最近日志）· 2026-11-08 | 微信读书动态列表 + 足迹 + 留言板触发卡；2026-11-04 #569 新 feat；8 段 8-5 打底 |

## 底图·道具（P）——元素截图与静态资源

| 编号 | 类型 | 名称 | 文件 | 来源与抓取日期 | 说明 |
|---|---|---|---|---|---|
| p-hero-wordmark | P | 题记字「wuh.site · 朝朝如念」 | ∅ | 裁自 S01 · 2026-11-08 | 1-1 题记镜前景层；分镜定稿后按构图裁切入库 |
| p-heatmap-crop | P | 热力图区块（干净裁切） | ∅ | 裁自 S08 · 2026-11-08 | 6-6 前景层；数据令牌 NUM-ROLL 配合 |
| p-post-cover-165 | P | 生成式封面样本（山峦/涟漪） | ∅ | 裁自 S03 顶部 · 2026-11-08 | 6-2 前景层 |
| p-music-player | P | 迷你播放器（440px） | ∅ | 裁自 S05/S01 左下 · 2026-11-08 | 6-4 / 8-2 前景层 |
| p-books | P | 146 本真封面书封 | ∅ | wuh.site `/api/weread/books`（v2 已采集 146 张于 `public/wuh-site-intro-v2/books/`）· 抓取 2026-11-01 | 6-3 书墙单元；2026-11-08 API 抽样与 v2 序一致（前五本同序），正式制作时复核后复用或重抓 |
| p-init-commit | P | 第一行代码提交物证（GitHub UI） | `public/wuh-site-intro-v3/site/gh01-init-commit-v1.png` | github.com/stack-wuh/x.wuh.site/commit/e1b8cdd · 2026-11-08 | 3-3 物证层：`feat(init): 基于nextjs构建的monorepos项目`；站点数据源页面（GitHub 侧） |
| p-issues-cms | P | Issues 即 CMS（blog 仓库 Issue 列表） | `public/wuh-site-intro-v3/site/gh02-issues-blog-v1.png` | github.com/stack-wuh/blog/issues · 2026-11-08 | 1-3「写作即提 Issue」起点物证 |

## 采集执行口径

1. 脚本 `scripts/harvest-site-shots.mjs`：登记表反驱动清单（本表 S/P 全集），系统 Chrome `--headless=new --remote-debugging-port=0` 短命进程 + 零依赖 CDP（net+crypto 手写 WS 客户端）；支持滚动（**文本锚点** `scroll.text` 定位段落标签 > CSS selector > y/ratio 兜底）、交互（S07 按「见字如面」文本点击展开弹幕）、DPR 2、`document.fonts.ready` 静置；采集完 kill 进程 + 清理临时 profile（清场铁律）。**本机执行需解除沙箱**（Chrome 起辅助进程与绑端口），用 `dangerouslyDisableSandbox` 跑
2. **首轮采集已完成（2026-11-08）**：14/14 入库，共 41MB；`--check` 绿。翻车与修正记录：s03 首采误用 `/posts/165`（404 页）→ 站点路由实为 `/post/[number]`（单数）；s08/s12 滚动像素猜测失准 → 改文本锚点（「综合活动热力图」「最近日志」）+ block:center；s07 弹幕触发词实为「见字如面」。**站点默认主题为暗色暖棕（酒红系）**——非亮色，登记备查（风格锚点含义见分镜）
3. P 型裁切件在分镜定稿后按构图需求二次裁切入库（首轮 ∅ 属预期，check 红到入库为止是特性）
4. 尺寸：3840×2160 PNG，单图 0.4–5.5MB；全量 41MB 进 `public/`，未超 100MB 阈值，保持 PNG
