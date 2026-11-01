import type { FC, ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import { colors } from '../../../brand/tokens';
import { PT } from '../motion-tokens';

/** 全局视觉下沉（shot-spec §4）：暖黑底 + 纸纹垫底随每镜自渲染；装配层不再叠全片 overlay。 */
export const ShotShell: FC<{ children: ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: colors.bg }}>
    {children}
    <AbsoluteFill
      style={{ background: colors.bgLift, opacity: PT.paperGrain.opacity, mixBlendMode: PT.paperGrain.blend, pointerEvents: 'none' }}
    />
  </AbsoluteFill>
);
