/* 镜 10 · 幕二 金针 · local [0,120) · 120f
   她的左掌摊开，三枚金针各有一点微光；掌纹清楚；背景全暗，只有掌与针被一束低光照亮。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase, Plate } from '../components/ArtBase';
import { FILM } from '../motion-tokens';

const S10: FC = () => {
  const f = useCurrentFrame();
  const pin = 0.5 + 0.5 * Math.sin(f / 9);

  return (
    <AbsoluteFill style={{ background: colors.ink }}>
      <ArtBase name="g01" zoom={[1.10, 1.14]}>
        <AbsoluteFill style={{ background: colors.ink, opacity: 0.94 }} />
        <div style={{ position: 'absolute', left: '12%', right: '12%', top: '6%', bottom: '2%', opacity: 0.98 }}>
          <Plate name="j7" height="100%" opacity={1} />
        </div>
        {/* 三枚针尖的反光（代码画） */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${44 + i * 3.2}%`,
              top: '46%',
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: FILM.fireGold,
              opacity: 0.45 + 0.4 * pin,
              boxShadow: `0 0 8px ${FILM.fireGold}`,
            }}
          />
        ))}
      </ArtBase>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 55%, transparent 42%, ${colors.ink} 88%)`,
          opacity: interpolate(f, [0, 20], [0.9, 0.75], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      />
    </AbsoluteFill>
  );
};

export default S10;
