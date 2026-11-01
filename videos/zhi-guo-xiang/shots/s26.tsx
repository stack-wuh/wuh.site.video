/* 镜 26 · 幕四 少林山门 · local [0,80) · 80f
   少林山门：石阶湿着，松影横斜；山门半开，门里很暗；无人。末 20f 一片松针掠过前景。 */
import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase } from '../components/ArtBase';

const NEEDLES = Array.from({ length: 7 }, (_, i) => i);

const S26: FC = () => {
  const f = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <ArtBase name="g11" zoom={[1.0, 1.04]} shiftY={[8, -6]}>
        {NEEDLES.map((i) => {
          const s = `s26-${i}`;
          const t = Math.max(0, f - (40 + i * 5));
          return (
            <div
              key={s}
              style={{
                position: 'absolute',
                left: 300 + random(`${s}-x`) * 1300 - t * (2 + random(`${s}-v`) * 2),
                top: 120 + random(`${s}-y`) * 300 + t * 4,
                width: 26,
                height: 1.4,
                background: colors.ink,
                opacity: 0.35 * Math.min(1, t / 12),
                transform: `rotate(${-18 + random(`${s}-r`) * 36}deg)`,
              }}
            />
          );
        })}
      </ArtBase>
      <AbsoluteFill style={{ background: colors.ink, opacity: 0.08 }} />
    </AbsoluteFill>
  );
};

export default S26;
