import type { FC, ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import type { CamState } from '../motion-tokens';

/** CameraRig —— motion-spec §3.4 三层虚拟摄影机（FrameMask → CameraRig → 内容层）。
 *  镜头令牌只动 rig；内容层做视差补偿：层位移 = 镜头位移 × (depth − 1) × −1。 */
export const ParallaxLayer: FC<{ depth: number; cam: CamState; blurBase?: number; children: ReactNode }> = ({
  depth,
  cam,
  blurBase = 3,
  children,
}) => (
  <AbsoluteFill
    style={{
      transform: `translate(${cam.x * (depth - 1) * -1}px, ${cam.y * (depth - 1) * -1}px) scale(${1 + (cam.scale - 1) * depth})`,
      filter: `blur(${blurBase * Math.abs(depth - 1)}px)`,
    }}
  >
    {children}
  </AbsoluteFill>
);

export const CameraRig: FC<{ cam: CamState; children: ReactNode }> = ({ cam, children }) => (
  <AbsoluteFill style={{ overflow: 'hidden' }}>
    <AbsoluteFill
      style={{
        transform: `scale(${cam.scale}) translate(${cam.x}px, ${cam.y}px) rotate(${cam.rot}deg)`,
        transformOrigin: cam.origin ?? 'center',
      }}
    >
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);
