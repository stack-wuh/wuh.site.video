import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { DUST } from '../motion-tokens';

/** PT-03 光尘粒子场（seed 确定性；密度/速度/暖金配比随幕取 DUST 配置）。
 *  全片无红：金尘用 colors.gold，纸尘用 colors.paperMuted。
 *  wind：水平风漂移（px/秒，正右负左），给雪/雨斜落用；默认 0 时像素与旧版一致。 */
export const DustField: FC<{ act: number; count?: number; seedBase?: string; wind?: number }> = ({
  act,
  count,
  seedBase,
  wind = 0,
}) => {
  const frame = useCurrentFrame();
  const cfg = DUST[act as keyof typeof DUST] ?? DUST[1];
  const total = count ?? cfg.count;
  const base = seedBase ?? `act${act}`;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {Array.from({ length: total }).map((_, i) => {
        const seed = `${base}-dust-${i}`;
        const x0 = random(seed) * 1920;
        const size = 2 + random(`${seed}-size`) * 3;
        const gold = random(`${seed}-gold`) < cfg.gold;
        const y = ((random(`${seed}-y`) * 1140 + frame * (cfg.speed / 30)) % 1140) - 20;
        const sway = Math.sin((frame + random(`${seed}-ph`) * 120) / 40) * 24;
        /* 风漂移只在 wind≠0 时参与取模：wind=0 保留旧版的 x0+sway（可越界 24px），像素不变 */
        const xRaw = x0 + sway + (wind * frame) / 30;
        const x = wind === 0 ? x0 + sway : ((xRaw % 1920) + 1920) % 1920;
        const breathe = 0.5 + 0.5 * Math.sin((frame / 120) * Math.PI * 2 + random(`${seed}-ph2`) * 6.28);
        return (
          <div
            key={seed}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: size / 2,
              background: gold ? colors.gold : colors.paperMuted,
              opacity: 0.18 + breathe * 0.4,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
