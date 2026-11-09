/* S44 · Act 7 坐忘 · 局部帧 [0,168) · 168f · 绝对 5786–5954
 *
 * 推窗入七月：纸页在余红里立起、化作一扇窗（0–18 承接纸页），推窗 40f
 * （18–58，矩形纵深收束成窗框），GR-06 七月光涌入（58–84）；
 * 窗外晨光 + 极稀光尘；末 20f rack focus 窗棂→窗台纸页（148–168）。
 * 转场：入「纸翻」（18f，承接上镜纸页边缘），出「切」。无字幕（留白）。
 * 尾帧：窗光铺满、窗台纸页微亮。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 168;

const S44: FC = () => {
  const frame = useCurrentFrame();
  // 纸页立起化窗（0–18）：纸面从全幅收为一扇窗（矩形 inset 收束）
  const toWindow = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  // 推窗 40f（18–58）：窗框纵深收束 + 景深变化
  const push = interpolate(frame, [18, 58], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  // 七月光涌入（58–84）
  const lightIn = interpolate(frame, [58, 84], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  // 末 20f rack：窗台纸页微亮
  const rack = interpolate(frame, [148, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.12, 1.02], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: 0,
    y: 0,
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={7} count={16} seedBase="s44" />

          {/* 窗外：晨光渐亮的天空（七月光） */}
          <AbsoluteFill style={{ background: `linear-gradient(180deg, ${FILM_COLORS.dawnLight} 0%, ${FILM_COLORS.goldMist} 55%, ${FILM_COLORS.paperMist} 100%)`, opacity: lightIn }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', opacity: lightIn * 0.5 }}>
            <span style={{ fontFamily: fontFamilies.serif, fontSize: 30, color: colors.ink, opacity: 0.4, letterSpacing: '0.4em' }}>七月</span>
          </div>

          {/* 窗棂（十字窗框：矩形纵深收束成窗框） */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: interpolate(push, [0, 1], [80, 200]), height: 26, background: colors.ink, opacity: 0.92 - push * 0.1, boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: interpolate(push, [0, 1], [80, 200]), height: 26, background: colors.ink, opacity: 0.92 - push * 0.1 }} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: interpolate(push, [0, 1], [110, 340]), width: 26, background: colors.ink, opacity: 0.92 - push * 0.1 }} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, right: interpolate(push, [0, 1], [110, 340]), width: 26, background: colors.ink, opacity: 0.92 - push * 0.1 }} />
            {/* 纸页余红残影（0–18 收束） */}
            {frame < 18 ? <AbsoluteFill style={{ background: `linear-gradient(160deg, rgba(201,111,74,0.35), rgba(30,24,18,0.85))`, opacity: 1 - toWindow }} /> : null}
          </div>

          {/* 窗台纸页（末 20f rack 微亮） */}
          <div style={{ position: 'absolute', right: 420, bottom: 150, width: 300, height: 200, borderRadius: 4, background: colors.paper, border: `1px solid ${colors.paperMuted}`, opacity: 0.7 + rack * 0.3, transform: `rotate(-1.6deg)`, boxShadow: `0 14px 40px rgba(0,0,0,${0.2 - rack * 0.1})` }}>
            <div style={{ position: 'absolute', left: 26, top: 30, width: 200, height: 12, background: colors.ink, opacity: 0.3 }} />
            <div style={{ position: 'absolute', left: 26, top: 56, width: 150, height: 10, background: colors.muted, opacity: 0.22 }} />
          </div>
        </AbsoluteFill>
      </CameraRig>
      <PaperGrain opacity={0.06} />
      <Grade id="GR-06" />
    </AbsoluteFill>
  );
};

export default S44;
