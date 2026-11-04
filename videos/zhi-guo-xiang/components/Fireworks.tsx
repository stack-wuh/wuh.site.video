import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { FILM } from '../motion-tokens';

type Burst = { x: number; y: number; at: number; scale?: number };

const SPARKS = 24;
const LIFE = 72;

/** 宋代烟花（art-direction §五）：起花上冲 + 不规则散射 + 落灰；禁止球形对称菊球。
 *  全部粒子用确定性 random(seed)，两遍渲染一致。 */
export const Fireworks: FC<{ bursts: Burst[]; seed: string }> = ({ bursts, seed }) => {
  const f = useCurrentFrame();

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
        {bursts.map((b, bi) => {
          const t = f - b.at;
          if (t < 0) return null;
          const scale = b.scale ?? 1;
          const rise = Math.min(1, t / 26);
          const riseY = b.y + (1 - rise) * 260 * scale;
          const riseOpacity = t < 26 ? 0.7 : 0;
          const burstT = Math.max(0, t - 26);
          const fade = Math.max(0, 1 - burstT / LIFE);

          return (
            <g key={bi}>
              {/* 起花：一点上冲的火星，带拖尾 */}
              {riseOpacity > 0 ? (
                <line
                  x1={b.x}
                  y1={riseY + 60 * scale}
                  x2={b.x}
                  y2={riseY}
                  stroke={FILM.fireGold}
                  strokeWidth={2.5}
                  opacity={riseOpacity}
                />
              ) : null}
              {/* 爆后的不规则散射 */}
              {burstT > 0 && fade > 0
                ? Array.from({ length: SPARKS }).map((_, i) => {
                    const s = `${seed}-${bi}-${i}`;
                    const ang = -Math.PI / 2 + (random(`${s}-a`) - 0.5) * Math.PI * 1.7;
                    const spd = (2.2 + random(`${s}-v`) * 5.4) * scale;
                    const life = 40 + random(`${s}-l`) * 30;
                    if (burstT > life) return null;
                    const k = burstT;
                    const x = b.x + Math.cos(ang) * spd * k * 1.6;
                    const y = b.y + Math.sin(ang) * spd * k * 1.6 + 0.055 * k * k;
                    const px = b.x + Math.cos(ang) * spd * Math.max(0, k - 4) * 1.6;
                    const py = b.y + Math.sin(ang) * spd * Math.max(0, k - 4) * 1.6 + 0.055 * Math.max(0, k - 4) ** 2;
                    const sparkFade = Math.max(0, 1 - k / life) * (0.55 + 0.45 * Math.sin(random(`${s}-p`) * 20 + k / 3));
                    return (
                      <g key={i} opacity={sparkFade}>
                        <line x1={px} y1={py} x2={x} y2={y} stroke={FILM.fireGold} strokeWidth={2} strokeLinecap="round" />
                        <circle cx={x} cy={y} r={1.7} fill={FILM.fireGold} />
                      </g>
                    );
                  })
                : null}
              {/* 落灰 */}
              {burstT > LIFE / 2
                ? Array.from({ length: 6 }).map((_, i) => {
                    const s = `${seed}-${bi}-ash-${i}`;
                    const k = burstT - LIFE / 2;
                    const x = b.x + (random(`${s}-x`) - 0.5) * 300 * scale;
                    const y = b.y + k * (0.6 + random(`${s}-v`)) + 0.02 * k * k;
                    return <circle key={i} cx={x} cy={y} r={1} fill={FILM.fireGold} opacity={Math.max(0, 0.35 - k / 260)} />;
                  })
                : null}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
