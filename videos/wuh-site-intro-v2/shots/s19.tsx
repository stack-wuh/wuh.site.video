/* 镜 19 · Act 3 第一行 · 局部帧 [0,72) · 72f
   TR-23 纸山横移出画（0–30f）露出时间轴；CM-11 微距推轨 1.20→1.46（缓→几乎静止）；
   CM-13 日期虚焦→实焦（38–58f），2400f（局部 48）呼吸一次 100.5%→100%；背景压暗 40%；
   GR-05→GR-01；无字幕。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS } from '../motion-tokens';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const MOUNTAIN = Array.from({ length: 7 }).map((_, i) => ({
  x: 1180 + Math.sin(i * 1.9 + 0.7) * (180 - i * 18),
  y: 848 - i * 20,
  rot: Math.sin(i * 2.2) * 5,
}));

const ShotDateFocus: FC = () => {
  const frame = useCurrentFrame();
  const slide = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const dim = interpolate(frame, [18, 58], [1, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const focus = interpolate(frame, [38, 58], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const show = interpolate(frame, [14, 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const breath = frame >= 48 ? 0.005 * (1 - interpolate(frame, [48, 64], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut })) : 0;
  const camScale = interpolate(frame, [0, 72], [1.2, 1.46], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }) + breath;
  const gradeP = interpolate(frame, [0, 58], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const dateGlow = (0.16 + 0.04 * Math.sin(frame / 18)) * focus;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${camScale})`, transformOrigin: '50% 50%' }}>
        <div style={{ position: 'absolute', inset: 0, background: colors.bgLift }} />
        <div style={{ position: 'absolute', left: 420, top: 380, width: 1200, height: 520, borderRadius: '50%', background: colors.paper, filter: 'blur(120px)', opacity: 0.05 }} />
        <div style={{ position: 'absolute', inset: 0, filter: `brightness(${dim})` }}>
          {/* 时间轴：年份刻度 + 焦点刻度 */}
          <div style={{ position: 'absolute', left: 0, top: 640, width: 1920, height: 2, background: FILM_COLORS.wireGrey, opacity: 0.5 }} />
          {Array.from({ length: 31 }).map((_, i) => {
            const major = i % 3 === 0;
            return <div key={i} style={{ position: 'absolute', left: 60 + i * 60, top: 640 - (major ? 14 : 7), width: 1, height: major ? 14 : 7, background: colors.muted, opacity: major ? 0.5 : 0.32 }} />;
          })}
          {['2021', '2022', '2023', '2024', '2025', '2026'].map((y, i) => (
            <div key={y} style={{ position: 'absolute', left: 36 + i * 300, top: 668, fontFamily: fontFamilies.mono, fontSize: 20, letterSpacing: '0.08em', color: y === '2024' ? colors.paper : colors.muted, opacity: y === '2024' ? 0.9 : 0.5, fontVariantNumeric: 'tabular-nums' }}>{y}</div>
          ))}
          <div style={{ position: 'absolute', left: 959, top: 612, width: 2, height: 26, background: colors.accent, opacity: 0.85 }} />
          {/* 纸山（TR-23 入场侧横移出画） */}
          <div style={{ position: 'absolute', inset: 0, transform: `translateX(${slide * 1500}px) rotate(${slide * 5}deg)`, transformOrigin: '50% 70%', opacity: 1 - slide * 0.15 }}>
            {MOUNTAIN.map((m, i) => (
              <div key={i} style={{ position: 'absolute', left: m.x - 260, top: m.y - 170, width: 520, height: 340, background: i % 2 === 0 ? FILM_COLORS.paperMist : FILM_COLORS.paperDeep, transform: `rotate(${m.rot}deg)`, boxShadow: `0 22px 50px ${colors.bg}`, opacity: 0.92 }} />
            ))}
            <div style={{ position: 'absolute', left: 790, top: 250, width: 780, height: 440, background: FILM_COLORS.blankPaper, boxShadow: `0 30px 80px ${colors.bg}` }}>
              <div style={{ position: 'absolute', left: 70, top: 96, fontFamily: fontFamilies.serif, fontSize: 96, lineHeight: 1, color: colors.ink, fontVariantNumeric: 'tabular-nums' }}>89<span style={{ fontSize: 40, marginLeft: 8 }}>篇</span></div>
              <div style={{ position: 'absolute', left: 74, top: 250, fontFamily: fontFamilies.mono, fontSize: 20, letterSpacing: '0.14em', color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>2023 · 30｜2024 · 59</div>
            </div>
            <div style={{ position: 'absolute', left: 900, top: 210, width: 560, height: 200, borderRadius: '50%', background: colors.gold, filter: 'blur(64px)', opacity: 0.2 }} />
          </div>
        </div>
      </div>
      <DustField act={3} seedBase="s19" />
      <PaperGrain opacity={0.05} />
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - gradeP }}><Grade id="GR-05" /></div>
      <div style={{ position: 'absolute', inset: 0, opacity: gradeP }}><Grade id="GR-01" /></div>
      {/* 日期实焦层：压在调色之上，独占画面中心 */}
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${camScale})`, transformOrigin: '50% 50%', opacity: show }}>
        <div style={{ position: 'absolute', left: 660, top: 372, width: 600, height: 200, borderRadius: '50%', background: colors.gold, filter: 'blur(70px)', opacity: dateGlow }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 452, textAlign: 'center', fontFamily: fontFamilies.mono, fontSize: 74, letterSpacing: '0.08em', color: colors.paper, fontVariantNumeric: 'tabular-nums', opacity: 0.25 + focus * 0.75, filter: `blur(${(1 - focus) * 9}px)`, transform: `scale(${1 + (1 - focus) * 0.08})`, textShadow: `0 0 30px ${colors.gold}` }}>2024-12-08</div>
      </div>
    </AbsoluteFill>
  );
};

export default ShotDateFocus;
