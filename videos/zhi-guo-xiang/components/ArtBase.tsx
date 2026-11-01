import type { FC, ReactNode } from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

/** 水墨底图层（art-direction v2.1 §一）：AI 底图 + 极缓推拉横移。
 *  底图统一放 public/zhi-guo-xiang/base-<name>.jpg，1920×1080。 */
export const ArtBase: FC<{
  name: string;
  zoom?: [number, number];
  shiftX?: [number, number];
  shiftY?: [number, number];
  children?: ReactNode;
}> = ({ name, zoom = [1.0, 1.04], shiftX = [0, 0], shiftY = [0, 0], children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = durationInFrames > 1 ? frame / (durationInFrames - 1) : 0;
  const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
  const scale = interpolate(t, [0, 1], zoom, clamp);
  const x = interpolate(t, [0, 1], shiftX, clamp);
  const y = interpolate(t, [0, 1], shiftY, clamp);

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Img
        src={staticFile(`zhi-guo-xiang/base-${name}.jpg`)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translate(${x}px, ${y}px)`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

/** 人物/物件贴片（art-direction v2.1 §六）：纸底已归一为近白的 PNG，multiply 融底。
 *  贴片统一放 public/zhi-guo-xiang/fig-<name>.png。 */
export const Plate: FC<{
  name: string;
  height?: string | number;
  right?: number;
  bottom?: number;
  left?: number;
  opacity?: number;
  driftY?: number;
  driftX?: number;
  sway?: number;
  blend?: 'multiply' | 'screen' | 'normal';
}> = ({ name, height = '74%', right, bottom = 0, left, opacity = 1, driftY = 0, driftX = 0, sway = 0, blend = 'multiply' }) => {
  const frame = useCurrentFrame();
  const bob = Math.sin((frame / 96) * Math.PI * 2) * driftY;
  const swing = Math.sin((frame / 120) * Math.PI * 2) * sway;
  return (
    <div
      style={{
        position: 'absolute',
        height,
        bottom,
        right,
        left,
        transform: `translate(${driftX + swing}px, ${bob}px)`,
        opacity,
      }}
    >
      <Img
        src={staticFile(`zhi-guo-xiang/fig-${name}.png`)}
        style={{ height: '100%', width: 'auto', mixBlendMode: blend }}
      />
    </div>
  );
};
