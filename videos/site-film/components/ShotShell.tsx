import type { FC, ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import { colors } from '../../../brand/tokens';

/* 全局视觉下沉（shot-spec §4）：底色 + 暖纸肌理垫底随每镜自渲染。
   装配层禁止再叠加任何全片视觉 overlay——单镜独立渲染必须自带完整像素。 */
export const ShotShell: FC<{ children: ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: colors.bg }}>
    {children}
    <AbsoluteFill style={{ background: colors.bgLift, opacity: 0.05, pointerEvents: 'none' }} />
  </AbsoluteFill>
);
