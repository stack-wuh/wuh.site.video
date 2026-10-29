import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../tokens';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const edgeFade = (y: number): number =>
  Math.min(Math.max(y / 90, 0), 1, Math.max((1080 - y) / 90, 0));

/** 品牌光尘：确定性 seeds；上下边缘 90px 淡出，杜绝回绕跳变（site-film 开场闪烁的教训） */
export const BrandDust: FC<{ count?: number; gold?: number }> = ({ count = 40, gold = 0.8 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({ length: count }).map((_, i) => {
        const seed = i * 97 + 17;
        const x0 = (seed * 7) % 1920;
        const size = 2 + (seed % 4);
        const red = seed % 10 >= gold * 10;
        const y = ((seed * 31 + frame * 0.26) % 1260) - 90;
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
              background: red ? colors.seal : colors.gold,
              opacity: (0.25 + breathe * 0.45) * edgeFade(y),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export { CLAMP };
