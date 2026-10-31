import type { FC } from 'react';
import { AbsoluteFill } from 'remotion';
import { colors } from '../../../brand/tokens';

/** PT-07 纸纤维噪点（静态渐变叠层，≤8%，不跑 feTurbulence、不做逐帧噪声） */
export const PaperGrain: FC<{ opacity?: number }> = ({ opacity = 0.06 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      opacity,
      backgroundImage: `repeating-linear-gradient(0deg, ${colors.paper} 0px, ${colors.paper} 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, ${colors.paper} 0px, ${colors.paper} 1px, transparent 1px, transparent 4px)`,
      mixBlendMode: 'overlay',
    }}
  />
);
