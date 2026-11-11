/* S16 · Act 3 第一行 · 局部帧 [0,72) · 72f · 绝对 2466–2538
 *
 * V2 暖黑数据流重写（2026-11-11 品牌暖黑科技）：「时间轴残影前对焦」改写为「数据轴上
 * 锁定日期」——发光数据轴残影虚化居后（2023/2024/2025 刻度，blur 随对焦收敛）；
 * 日期「2024-12-08」等宽大字虚→实 rack focus（24–54，实焦 54=绝对 2520=拍126），
 * 实焦瞬间琥珀辉光点亮 + 画面呼吸一次（54–72）；HUD 读数 54 处 SEARCHING→LOCKED
 * （读数变化叙事）；背景压暗 40%。
 * 转场：入「切」，出「切」。无字幕（前摇）。
 * 尾帧：日期实焦独占画面，边缘全暗（交接态：日期特写+暗场）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS2, glowText } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

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
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s16v2" stars={44} grid />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 数据轴残影（虚化背景：2024 刻度被拉近） */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 600, filter: `blur(${4 + (1 - focus) * 4}px)`, opacity: 0.4 - focus * 0.2 }}>
            <div style={{ position: 'absolute', left: 100, right: 100, top: 0, height: 2, background: FILM_COLORS2.line }} />
            <div style={{ position: 'absolute', left: 100, top: -1, width: interpolate(frame, [24, 54], [0, 560], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut }), height: 4, background: `linear-gradient(90deg, ${FILM_COLORS2.dataDim}, ${FILM_COLORS2.data})`, boxShadow: `0 0 14px 3px rgba(212,163,115,0.35)`, opacity: focus }} />
            {['2023', '2024', '2025'].map((y, i) => (
              <span key={y} style={{ position: 'absolute', left: 180 + i * 620, top: 20, fontFamily: fontFamilies.mono, fontSize: 34, color: y === '2024' ? FILM_COLORS2.data : FILM_COLORS2.textMuted, fontVariantNumeric: 'tabular-nums' }}>{y}</span>
            ))}
          </div>
          {/* 日期特写（虚→实 rack focus；实焦即辉光） */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 400,
              textAlign: 'center',
              fontFamily: fontFamilies.mono,
              fontSize: 120,
              color: FILM_COLORS2.paperWhite,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.1em',
              filter: `blur(${(1 - focus) * 9}px)`,
              opacity: 0.4 + focus * 0.6,
              ...(focus > 0.9 ? glowText(FILM_COLORS2.gold, focus * 0.5) : {}),
            }}
          >
            2024-12-08
          </div>
          {/* 背景压暗 40%（边缘全暗，日期独占） */}
          <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep, opacity: interpolate(frame, [24, 54], [0, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), pointerEvents: 'none' }} />
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · LOCATE" readout={frame >= 54 ? 'LOCKED · 2024-12-08' : 'SEARCHING…'} />
      <Grade2 id="GR2-03" />
    </AbsoluteFill>
  );
};

export default S16;
