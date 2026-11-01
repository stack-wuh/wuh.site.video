/* 镜 15 · 幕三 无人回头 · local [0,120) · 120f
   军报在人手里传；镜头从纸抬到人群的脸——所有脸都朝天、朝纸、朝城门，没有一张转向她。
   极缓上摇 3%，焦点始终在纸，人到虚。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase } from '../components/ArtBase';
import { DustField } from '../components/DustField';

const S15: FC = () => {
  const f = useCurrentFrame();
  const tilt = (f / 120) * 32;

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${tilt}px) scale(1.06)`, transformOrigin: '50% 70%' }}>
        <ArtBase name="g06" zoom={[1.04, 1.06]}>
          <DustField act={3} count={14} seedBase="s15" />
        </ArtBase>
      </div>
      <AbsoluteFill style={{ background: colors.ink, opacity: 0.14 }} />
    </AbsoluteFill>
  );
};

export default S15;
