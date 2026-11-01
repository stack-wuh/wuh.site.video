/* 镜 23 · 幕三 雾合 · local [0,120) · 120f
   雾从山谷漫上来，把刚才他站的地方填平；轮廓先散、肩线最后消失；她在左前景原地不动。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase } from '../components/ArtBase';

const S23: FC = () => {
  const f = useCurrentFrame();
  const rise = interpolate(f, [0, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <ArtBase name="g09" zoom={[1.04, 1.08]} shiftY={[6, -10]}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: -200 + Math.sin((f + i * 60) / 70) * 40,
              right: -200,
              bottom: `${-6 + i * 16 + rise * (36 - i * 6)}%`,
              height: `${18 + i * 6}%`,
              background: `linear-gradient(180deg, transparent, ${colors.paper} 55%, transparent)`,
              opacity: (0.55 - i * 0.1) * (0.4 + 0.6 * rise),
              filter: 'blur(14px)',
            }}
          />
        ))}
      </ArtBase>
      <AbsoluteFill style={{ background: colors.paper, opacity: 0.06 + 0.08 * rise }} />
    </AbsoluteFill>
  );
};

export default S23;
