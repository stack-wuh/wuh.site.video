import type { FC } from 'react';

/**
 * 音轨唯一事实源（独立 Composition，shot-spec §4）——BGM 段编排在 Phase 6 落地。
 * 当前为无声占位：子集镜渲染不命中本 comp；全片 assemble 前必须换成真实 BGM 编排。
 */
export const WuhSiteIntroV3Audio: FC = () => null;
