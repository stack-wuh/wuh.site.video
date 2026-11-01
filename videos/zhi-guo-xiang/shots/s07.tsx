/* 镜 7 · 幕二 灯亮 · local [0,100) · 100f
   渡口的灯一盏盏亮起；她从坡上走下，走向灯，驴跟在她身后半步；她不回头。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase, Plate } from '../components/ArtBase';
import { FILM } from '../motion-tokens';

const LAMPS = [
  { x: 1490, y: 470, at: 0 },
  { x: 1610, y: 496, at: 14 },
  { x: 1730, y: 520, at: 28 },
  { x: 1360, y: 512, at: 46 },
];

const S07: FC = () => {
  const f = useCurrentFrame();
  const walk = interpolate(f, [0, 100], [60, -140], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <ArtBase name="g04" zoom={[1.04, 1.08]} shiftX={[18, -22]}>
        {LAMPS.map((l, i) => {
          const lit = interpolate(f, [l.at, l.at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <div key={i} style={{ position: 'absolute', left: l.x, top: l.y, width: 90, height: 90, opacity: lit }}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${FILM.fireGold} 0%, transparent 62%)`,
                  opacity: 0.55,
                  filter: 'blur(6px)',
                }}
              />
              <div style={{ position: 'absolute', left: 42, top: 40, width: 6, height: 8, borderRadius: 3, background: FILM.fireGold }} />
            </div>
          );
        })}
        <Plate name="xiang16" height="46%" left={980} driftX={walk} bottom={-30} opacity={0.92} />
      </ArtBase>
      <AbsoluteFill style={{ background: colors.ink, opacity: 0.08 }} />
    </AbsoluteFill>
  );
};

export default S07;
