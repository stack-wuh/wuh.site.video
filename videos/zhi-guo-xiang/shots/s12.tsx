/* 镜 12 · 幕二 离渡 · local [0,60) · 60f
   渡船离岸，船尾的风把芦花带起；她的背影在船头，没有回头；河面把土黄的暮色拉长。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase, Plate } from '../components/ArtBase';
import { FILM } from '../motion-tokens';

const S12: FC = () => {
  const f = useCurrentFrame();
  const away = interpolate(f, [0, 60], [0, -120], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const small = interpolate(f, [0, 60], [1, 0.86], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <ArtBase name="g04" zoom={[1.06, 1.12]} shiftX={[-10, 24]}>
        <div
          style={{
            position: 'absolute',
            left: 420 + away,
            bottom: 60,
            height: '42%',
            transform: `scale(${small})`,
            transformOrigin: 'bottom center',
            opacity: 0.9,
          }}
        >
          <Plate name="xiang16" height="100%" opacity={0.95} />
        </div>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 300 + i * 90 - f * (1.2 + i * 0.2),
              top: 700 - i * 26 + Math.sin((f + i * 20) / 16) * 8,
              width: 10,
              height: 4,
              borderRadius: 2,
              background: colors.paperMuted,
              opacity: 0.5 - i * 0.06,
            }}
          />
        ))}
        <div style={{ position: 'absolute', inset: 0, background: FILM.fireGold, opacity: 0.05, mixBlendMode: 'soft-light' }} />
      </ArtBase>
    </AbsoluteFill>
  );
};

export default S12;
