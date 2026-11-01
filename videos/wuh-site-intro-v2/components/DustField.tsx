import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { DUST } from '../motion-tokens';

/**
 * PT-05 光尘粒子场（seed 确定性；密度/速度/暖金配比随幕取 DUST 配置，表 3.5.1）。
 * 粒子只做下坠 + 水平正弦 + 呼吸 opacity，不做爆炸与闪烁。
 */
export const DustField: FC<{ act: number; count?: number; seedBase?: string }> = ({ act, count, seedBase }) => {
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
        const breathe = 0.5 + 0.5 * Math.sin((frame / 120) * Math.PI * 2 + random(`${seed}-ph2`) * 6.28);
        return (
          <div
            key={seed}
            style={{
              position: 'absolute',
              left: x0 + sway,
              top: y,
              width: size,
              height: size,
              borderRadius: size / 2,
              background: gold ? colors.gold : colors.seal,
              opacity: 0.18 + breathe * 0.4,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
