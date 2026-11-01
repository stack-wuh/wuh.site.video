/* 镜 42 · 幕五 空钉 · local [0,60) · 60f
   禅房一面空墙，墙上多了一道横钉，钉上还空着；窗外的天色在墙上一格一格地走。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase } from '../components/ArtBase';

const S42: FC = () => {
  const f = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <ArtBase name="g16" zoom={[1.04, 1.08]} shiftX={[-6, 8]}>
        <AbsoluteFill
          style={{
            background: `linear-gradient(115deg, transparent 40%, ${colors.paper} 62%, transparent 84%)`,
            opacity: 0.1,
            transform: `translateX(${(f / 60) * 8 - 4}%)`,
            mixBlendMode: 'soft-light',
          }}
        />
      </ArtBase>
      <AbsoluteFill style={{ background: colors.ink, opacity: 0.08 }} />
    </AbsoluteFill>
  );
};

export default S42;
