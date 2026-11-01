/* 镜 34 · 幕五 雪与火 · local [0,140) · 140f
   大雪落在断墙上，墙是焦黑的；远处有火光，风把火吹斜；雪与火在同一画面里。无血、无人、无屠杀。 */
import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase } from '../components/ArtBase';
import { FILM } from '../motion-tokens';

const FLAKES = Array.from({ length: 60 }, (_, i) => i);

const S34: FC = () => {
  const f = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: colors.ink }}>
      <ArtBase name="g13" zoom={[1.02, 1.06]} shiftX={[10, -10]}>
        {FLAKES.map((i) => {
          const s = `s34-${i}`;
          const x = ((random(`${s}-x`) * 2100 + f * (1.2 + random(`${s}-v`)) - 100) % 2100) - 90;
          const y = ((random(`${s}-y`) * 1200 + f * (2.2 + random(`${s}-w`) * 2)) % 1200) - 60;
          const r = 1 + random(`${s}-r`) * 2.2;
          return <div key={s} style={{ position: 'absolute', left: x, top: y, width: r, height: r, borderRadius: '50%', background: colors.paper, opacity: 0.35 + random(`${s}-o`) * 0.4 }} />;
        })}
        <div
          style={{
            position: 'absolute',
            right: '18%',
            top: '46%',
            width: 260,
            height: 200,
            background: `radial-gradient(circle, ${FILM.fireGold} 0%, transparent 64%)`,
            opacity: 0.22 + 0.08 * Math.sin(f / 8),
            filter: 'blur(12px)',
            mixBlendMode: 'screen',
          }}
        />
      </ArtBase>
      <AbsoluteFill style={{ background: colors.ink, opacity: 0.16 }} />
    </AbsoluteFill>
  );
};

export default S34;
