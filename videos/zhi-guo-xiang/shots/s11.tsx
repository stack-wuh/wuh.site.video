/* 镜 11 · 幕二 合掌 · local [0,120) · 120f
   掌心慢慢合拢，把三枚针握进手里，指缝里漏出一点金；末段露出一点素色袖口。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase, Plate } from '../components/ArtBase';
import { FILM } from '../motion-tokens';

const S11: FC = () => {
  const f = useCurrentFrame();
  const close = interpolate(f, [0, 40], [1.04, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const leak = interpolate(f, [30, 70, 110], [0, 0.9, 0.25], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: colors.ink }}>
      <ArtBase name="g01" zoom={[1.08, 1.12]}>
        <AbsoluteFill style={{ background: colors.ink, opacity: 0.94 }} />
        <div style={{ position: 'absolute', left: '12%', right: '12%', top: '6%', bottom: '2%', transform: `scale(${close})` }}>
          <Plate name="j8" height="100%" opacity={1} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 220,
            height: 220,
            marginLeft: -110,
            marginTop: -110,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${FILM.fireGold} 0%, transparent 60%)`,
            opacity: 0.14 * leak,
            filter: 'blur(10px)',
          }}
        />
      </ArtBase>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 55%, transparent 40%, ${colors.ink} 86%)` }} />
    </AbsoluteFill>
  );
};

export default S11;
