# wuh.site.video 上下文地图

| 限界上下文 | 职责 | 上游/下游 | 主目录或模块 | 关键术语 |
|---|---|---|---|---|
| video-materials | 视频工程、品牌令牌、分镜组件与素材的唯一维护地 | 下游：B 站成片发布；反腐边界：不收博客/桌面端物料，不做发布排期管理 | brand/, videos/, shared-assets/, scripts/ | 物料 / 分镜 scene / 视频 video / 片头片尾 |

## 术语表增量

- 物料: 品牌令牌 + 分镜组件 + 素材的总称，本仓库的唯一产出物
- 分镜 scene: 最小可复用的视频段组件，一个 Sequence 段一个职责
- 视频 video: `videos/<slug>/` 下独立成片单元（Composition 注册 + 专属 assets/）
- 片头/片尾: 品牌级固定片段，沉淀后放 `brand/`，逐视频引用
