/* S2 · 展开旧纸 150f——特写手与纸 */
import type { FC } from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { Scene, InkGrade } from '../components/SceneKit';
import { colors } from '../../../brand/tokens';

const S02: FC = () => (
  <Scene name="u-paper" zoom={[1.04, 1.0]} dim={0.05}>
    <AbsoluteFill style={{ background: colors.ink, opacity: 0.08 }} />
    <InkGrade />
    {/* 纸背景本身即 S3 的纸：此镜只做一次缓推 */}
    <Img src={staticFile('zhi-guo-xiang/scene/u-paper.jpg')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0 }} />
  </Scene>
);

export default S02;
