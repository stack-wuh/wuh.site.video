/* e-scene —— SceneKit 的「按本镜时长」版本（A 组私有，s01–s17 用）。
 *
 * 为什么需要它：`<Scene>` 用 `useVideoConfig().durationInFrames` 算 t，但在整片装配层里
 * ShotShell 挂在 `<Sequence>` 内，那里拿到的仍是**根 comp** 的时长（≈8000f）。于是 180f 的一镜
 * zoom 实际只走了 1.000→1.002 —— 全片的推拉等于没有（v11 存量问题，s16/s17 曾各自绕过）。
 * 本组件把时长改成显式 prop（= manifest 的 durationFrames），镜头语言才成立；
 * 其余行为与 Scene/Slide 逐项一致（同一套 InkGrade、同一组 zoom/drift/dim/warm 口径），
 * 所以可以当 Scene/Slide 用。既有镜头继续用 Scene，不受影响。
 */
import type { FC, ReactNode } from 'react';
import { AbsoluteFill, Img, interpolate, staticFile } from 'remotion';
import { colors } from '../../../brand/tokens';
import { InkGrade } from './SceneKit';

const clampOpts = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** 本镜进度 t（0–1），按 manifest 时长而不是根 comp 时长。 */
const useShotT = (frame: number, total: number) => (total > 1 ? frame / (total - 1) : 0);

/** 场景底图：绢本空镜 + 极缓推拉 + 统一调色（时长由 total 显式给）。 */
export const ShotScene: FC<{
  name: string;
  /** 本镜总帧数（manifest durationFrames） */
  total: number;
  frame: number;
  zoom?: [number, number];
  driftX?: [number, number];
  driftY?: [number, number];
  dim?: number;
  warm?: number;
  /** 覆盖进度（0–1）：镜头自己给的缓动曲线（默认按 frame/total 线性） */
  progress?: number;
  /** 底图 CSS filter 串（如三拍季节的 `saturate() brightness() sepia()`）；不传则不加滤镜 */
  grade?: string;
  children?: ReactNode;
}> = ({ name, total, frame, zoom = [1.0, 1.045], driftX = [0, 0], driftY = [0, 0], dim = 0, warm = 0, progress, grade, children }) => {
  const base = useShotT(frame, total);
  const t = progress ?? base;
  const scale = interpolate(t, [0, 1], zoom, clampOpts);
  const x = interpolate(t, [0, 1], driftX, clampOpts);
  const y = interpolate(t, [0, 1], driftY, clampOpts);
  return (
    <AbsoluteFill style={{ background: colors.paper, overflow: 'hidden' }}>
      <Img
        src={staticFile(`zhi-guo-xiang/scene/${name}.jpg`)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translate(${x}px, ${y}px)`,
          filter: grade,
        }}
      />
      {warm > 0 ? <AbsoluteFill style={{ background: '#e9d9ae', mixBlendMode: 'soft-light', opacity: warm }} /> : null}
      {dim > 0 ? <AbsoluteFill style={{ background: colors.ink, opacity: dim }} /> : null}
      <InkGrade />
      {children}
    </AbsoluteFill>
  );
};

/** 推拉与调色，不绑底图——给纸、给代码画的物件用（ShotScene 的无底图版）。 */
export const ShotSlide: FC<{
  total: number;
  frame: number;
  zoom?: [number, number];
  driftX?: [number, number];
  driftY?: [number, number];
  /** 推拉的锚点（CSS transform-origin），默认画面中心 */
  origin?: string;
  dim?: number;
  warm?: number;
  children: ReactNode;
}> = ({ total, frame, zoom = [1.0, 1.045], driftX = [0, 0], driftY = [0, 0], origin = '50% 50%', dim = 0, warm = 0, children }) => {
  const t = useShotT(frame, total);
  const scale = interpolate(t, [0, 1], zoom, clampOpts);
  const x = interpolate(t, [0, 1], driftX, clampOpts);
  const y = interpolate(t, [0, 1], driftY, clampOpts);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: colors.paper }}>
      <AbsoluteFill style={{ transform: `scale(${scale}) translate(${x}px, ${y}px)`, transformOrigin: origin }}>
        {children}
        {warm > 0 ? <AbsoluteFill style={{ background: '#e9d9ae', mixBlendMode: 'soft-light', opacity: warm }} /> : null}
        {dim > 0 ? <AbsoluteFill style={{ background: colors.ink, opacity: dim }} /> : null}
        <InkGrade />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};