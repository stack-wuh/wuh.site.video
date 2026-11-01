/* 镜 20 · 幕三 烟落 · local [0,130) · 130f
   火金的余烬与灰从天上落下；远处城头火把在动、人马在调（只是光点与影，不辨面目）；近处屋檐垂着烟。
   从天空极缓下摇到城头。 */
import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase } from '../components/ArtBase';
import { FILM } from '../motion-tokens';

const ASH = Array.from({ length: 40 }, (_, i) => i);

const S20: FC = () => {
  const f = useCurrentFrame();
  const tilt = (f / 130) * 26;

  return (
    <AbsoluteFill style={{ background: colors.ink }}>
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${-tilt}px) scale(1.06)`, transformOrigin: '50% 30%' }}>
        <ArtBase name="g07" zoom={[1.05, 1.07]}>
          {ASH.map((i) => {
            const s = `s20-${i}`;
            const x = random(`${s}-x`) * 1920;
            const y = ((random(`${s}-y`) * 800 + f * (0.5 + random(`${s}-v`))) % 1080);
            const sway = Math.sin((f + random(`${s}-p`) * 80) / 40) * 12;
            return <div key={s} style={{ position: 'absolute', left: x + sway, top: y, width: 2, height: 1, background: FILM.fireGold, opacity: 0.25 + 0.3 * random(`${s}-o`) }} />;
          })}
          {/* 城头火把在动 */}
          {[520, 700, 940, 1180].map((x, i) => (
            <div
              key={x}
              style={{
                position: 'absolute',
                left: x + Math.sin((f + i * 30) / 22) * 8,
                top: 620 + (i % 2) * 26,
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: FILM.fireGold,
                opacity: 0.5 + 0.3 * Math.sin((f + i * 40) / 9),
                boxShadow: `0 0 10px ${FILM.fireGold}`,
              }}
            />
          ))}
        </ArtBase>
      </div>
      <AbsoluteFill style={{ background: colors.ink, opacity: 0.2 }} />
    </AbsoluteFill>
  );
};

export default S20;
