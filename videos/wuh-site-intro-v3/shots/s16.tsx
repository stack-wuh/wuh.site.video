/* S16 · Act 3 第一行 · 局部帧 [0,72) · 72f · 绝对 2466–2538
 *
 * 重音前摇：纸山移开露出时间轴，2024 刻度被拉近；日期「2024-12-08」
 * 虚→实 rack focus（24–54，实焦 54=绝对 2520=拍126），背景压暗 40%；
 * 实焦瞬间画面呼吸一次（54–72）。转场：入「切」，出「切」。无字幕（前摇）。
 * 尾帧：日期实焦独占画面，边缘全暗。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 72;

const S16: FC = () => {
  const frame = useCurrentFrame();
  const focus = interpolate(frame, [24, 54], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const breathe = interpolate(frame, [54, 62, 72], [0, 0.012, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.06, 1.14], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }) + breathe,
    x: 0,
    y: 0,
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={3} count={8} seedBase="s16" />
          {/* 时间轴残影（虚化背景：2024 刻度被拉近） */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 600, filter: `blur(${4 + (1 - focus) * 4}px)`, opacity: 0.4 - focus * 0.2 }}>
            <div style={{ position: 'absolute', left: 100, right: 100, top: 0, height: 2, background: colors.muted }} />
            {['2023', '2024', '2025'].map((y, i) => (
              <span key={y} style={{ position: 'absolute', left: 180 + i * 620, top: 20, fontFamily: fontFamilies.serif, fontSize: 34, color: colors.muted }}>{y}</span>
            ))}
          </div>
          {/* 日期特写（虚→实） */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 400,
              textAlign: 'center',
              fontFamily: fontFamilies.mono,
              fontSize: 120,
              color: colors.paper,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.1em',
              filter: `blur(${(1 - focus) * 9}px)`,
              opacity: 0.4 + focus * 0.6,
              textShadow: focus > 0.9 ? `0 0 30px rgba(245,233,200,0.3)` : 'none',
            }}
          >
            2024-12-08
          </div>
          {/* 背景压暗 40%（边缘全暗，日期独占） */}
          <AbsoluteFill style={{ background: colors.bg, opacity: interpolate(frame, [24, 54], [0, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), pointerEvents: 'none' }} />
        </AbsoluteFill>
      </CameraRig>
      <PaperGrain opacity={0.06} />
      <Grade id="GR-01" />
    </AbsoluteFill>
  );
};

export default S16;
