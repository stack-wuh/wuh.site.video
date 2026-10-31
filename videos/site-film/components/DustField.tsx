import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { SEAL_RED, WARM_GOLD } from '../motion-tokens';

/* 光尘粒子场（seed 确定性；密度/速度/暖金配比随幕取 DUST 配置）——自 Act1 上收，全片共用 */
export const DustField: FC<{ act: number; count?: number }> = ({ act, count }) => {
  const frame = useCurrentFrame();
  const speeds = { slow: 8 / 30, mid: 16 / 30, fast: 30 / 30, slowest: 3 / 30 } as const;
  const cfgs = { 1: [70, 'slow', 0.9], 2: [25, 'slow', 0.85], 3: [90, 'mid', 0.7], 4: [60, 'mid', 0.95], 5: [30, 'slowest', 0.9], 6: [40, 'fast', 0.1], 7: [90, 'slow', 0.9] } as const;
  const [n, speed, gold] = cfgs[act as keyof typeof cfgs] ?? cfgs[1];
  const v = speeds[speed as keyof typeof speeds];
  const total = count ?? n;
  return (
    <AbsoluteFill>
      {Array.from({ length: total }).map((_, i) => {
        const seed = i * 97 + act * 13;
        const x0 = (seed * 7) % 1920;
        const size = 2 + (seed % 4);
        const red = seed % 10 >= gold * 10;
        const y = ((seed * 31 + frame * v) % 1100) - 50;
        const sway = Math.sin((frame + seed) / 40) * 24;
        const breathe = 0.55 + 0.45 * Math.sin((frame / 120) * Math.PI * 2 + seed);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x0 + sway,
              top: y,
              width: size,
              height: size,
              borderRadius: size / 2,
              background: red ? SEAL_RED : WARM_GOLD,
              opacity: 0.25 + breathe * 0.45,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
