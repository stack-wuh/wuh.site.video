import type { FC, ReactNode } from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors } from '../../../brand/tokens';
import { Caption } from './Caption';

/** 统一绢本调色（v3 画风锁）：暖纸底 + 低饱和 + 轻颗粒压色，全片同一道。 */
export const InkGrade: FC = () => (
  <>
    <AbsoluteFill style={{ background: '#f5f0e8', mixBlendMode: 'soft-light', opacity: 0.22 }} />
    <AbsoluteFill style={{ background: '#3a3630', mixBlendMode: 'multiply', opacity: 0.06 }} />
  </>
);

/** 场景底图：绢本空镜 + 极缓推拉 + 统一调色。
 *  图放 public/zhi-guo-xiang/scene/<name>.jpg。 */
export const Scene: FC<{
  name: string;
  zoom?: [number, number];
  driftX?: [number, number];
  driftY?: [number, number];
  dim?: number;
  warm?: number;
  children?: ReactNode;
}> = ({ name, zoom = [1.0, 1.045], driftX = [0, 0], driftY = [0, 0], dim = 0, warm = 0, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = durationInFrames > 1 ? frame / (durationInFrames - 1) : 0;
  const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
  const scale = interpolate(t, [0, 1], zoom, clamp);
  const x = interpolate(t, [0, 1], driftX, clamp);
  const y = interpolate(t, [0, 1], driftY, clamp);
  return (
    <AbsoluteFill style={{ background: colors.paper, overflow: 'hidden' }}>
      <Img
        src={staticFile(`zhi-guo-xiang/scene/${name}.jpg`)}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(${scale}) translate(${x}px, ${y}px)`,
        }}
      />
      {warm > 0 ? <AbsoluteFill style={{ background: '#e9d9ae', mixBlendMode: 'soft-light', opacity: warm }} /> : null}
      {dim > 0 ? <AbsoluteFill style={{ background: colors.ink, opacity: dim }} /> : null}
      <InkGrade />
      {children}
    </AbsoluteFill>
  );
};

/** 淡入淡出包裹（2-3 帧级硬切韵律，遵循渲染稳定 playbook：不做长渐变）。 */
export const Fade: FC<{ inF?: number; outF?: number; children: ReactNode }> = ({ inF = 8, outF = 8, children }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const o = interpolate(f, [0, inF, durationInFrames - outF, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

/** 诗行字幕（居中、衬线、绢底墨字；tone ink 用于亮底）。 */
export const Poem: FC<{ text: string; start: number; end: number }> = ({ text, start, end }) => (
  <Caption text={text} start={start} end={end} poem />
);
