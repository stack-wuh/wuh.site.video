/* 镜 1 · 幕一 白纸 · local [0,180) · 180f
   纸白满幅，一页未写的纸：无字、无印、无题款；纸纤维在侧光里可见；只有纸面呼吸与一缕侧光缓慢右移。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase } from '../components/ArtBase';
import { DustField } from '../components/DustField';

const S01: FC = () => {
  const f = useCurrentFrame();
  const sweep = (f / 180) * 7 - 2;

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <ArtBase name="g01" zoom={[1.0, 1.028]}>
        <AbsoluteFill
          style={{
            background: `linear-gradient(100deg, transparent 30%, ${colors.paper} 58%, transparent 78%)`,
            opacity: 0.35,
            transform: `translateX(${sweep}%)`,
            mixBlendMode: 'soft-light',
          }}
        />
        <DustField act={1} count={8} seedBase="s01" />
      </ArtBase>
    </AbsoluteFill>
  );
};

export default S01;
