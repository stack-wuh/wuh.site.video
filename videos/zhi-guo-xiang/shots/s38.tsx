/* 镜 38 · 幕五 抬眼 · local [0,120) · 120f
   她的侧影在灯前，低头抄经；忽然抬眼看向窗外（不看镜头）；落发、缁衣 + 内领一线雪青；
   L3：只给一只眼与颧骨一角，灯焰在眼里跳一下（5100–5160）。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase, Plate } from '../components/ArtBase';
import { FILM } from '../motion-tokens';

const S38: FC = () => {
  const f = useCurrentFrame();
  const glance = interpolate(f, [0, 15, 60, 90], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const flick = 0.6 + 0.4 * Math.sin(f / 5);

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <ArtBase name="g14" zoom={[1.06, 1.1]}>
        <AbsoluteFill style={{ background: colors.ink, opacity: 0.3 }} />
        <div style={{ position: 'absolute', left: '18%', top: '6%', height: '92%' }}>
          <Plate name="nun-side" height="100%" opacity={0.96} />
        </div>
        {/* 眼睛位置的一点灯焰反光（L3，代码画） */}
        <div
          style={{
            position: 'absolute',
            left: '44.5%',
            top: '38%',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: FILM.fireGold,
            opacity: glance * flick,
            boxShadow: `0 0 14px ${FILM.fireGold}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '16%',
            top: '40%',
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${FILM.fireGold} 0%, transparent 60%)`,
            opacity: 0.2 * flick,
            filter: 'blur(12px)',
            mixBlendMode: 'screen',
          }}
        />
      </ArtBase>
      <AbsoluteFill style={{ background: colors.ink, opacity: 0.16 }} />
    </AbsoluteFill>
  );
};

export default S38;
