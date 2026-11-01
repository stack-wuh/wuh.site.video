/* 镜 23 · Act 4 留白 · 局部帧 [0,108) · 108f
   承接 s22 暗场收束：7 点连线余光熄灭；提交曲线自 2024-12 高点（10）滑落，
   2025-06 三点、2025-07 一点；曲线「断电」下坠（CV-02）后骤停，化作四墨点悬在暗处；
   CM-05 正侧 → CM-04 极缓后退；无字幕；GR-01。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, pathDraw } from '../motion-tokens';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const PEAK = { x: 240, y: 430 };
const LINE_Y = 552;
/* 四个提交点：2025-06 ×3（1100/1180/1260）、2025-07 ×1（1400），各落半拍 */
const DOTS = [
  { x: 1100, at: 60 },
  { x: 1180, at: 70 },
  { x: 1260, at: 80 },
  { x: 1400, at: 90 },
];
const CURVE = 'M 240 430 C 430 478, 560 522, 760 540 C 940 554, 1000 552, 1100 552 L 1400 552';
const TAIL = 'M 1400 552 C 1428 553, 1450 554, 1480 556';
const REMNANT = Array.from({ length: 7 }).map((_, i) => ({ x: 84 + i * 20, y: 500 + Math.sin(i * 1.35) * 9 }));

const ShotCommitCurvePowerCut: FC = () => {
  const frame = useCurrentFrame();
  const tx = interpolate(frame, [0, 80], [-20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const rot = interpolate(frame, [0, 80], [-0.3, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const back = interpolate(frame, [90, 108], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const scale = 1 - back * 0.03;

  const remnant = 1 - interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  /* 断电：尾段 ease-in 下坠 230px 后钳停 */
  const drop = interpolate(frame, [44, 60], [0, 230], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const curveDim = interpolate(frame, [60, 84], [0.75, 0.38], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cutSpark = interpolate(frame, [44, 46, 54], [0, 0.9, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const peak = interpolate(frame, [26, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${tx}px) rotate(${rot}deg) scale(${scale})` }}>
        <DustField act={4} count={12} seedBase="s23" />
        {/* 上镜七点连线的余光熄灭 */}
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          <polyline points={REMNANT.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke={colors.accent} strokeWidth={1.5} opacity={0.35 * remnant} />
          {REMNANT.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={3} fill={colors.gold} opacity={0.7 * remnant} />
          ))}
        </svg>
        {/* 提交曲线：高点滑落 → 断电下坠 */}
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          <path d={CURVE} fill="none" stroke={colors.muted} strokeWidth={2} opacity={curveDim} style={pathDraw(frame, 6, 34, 1250)} />
          <path d={TAIL} fill="none" stroke={colors.muted} strokeWidth={2} opacity={curveDim} transform={`translate(0 ${drop})`} />
          <circle cx={PEAK.x} cy={PEAK.y} r={4} fill={colors.muted} opacity={0.8 * peak} />
          <circle cx={1400} cy={LINE_Y} r={3} fill={colors.gold} opacity={cutSpark} />
        </svg>
        <div
          style={{
            position: 'absolute',
            left: PEAK.x - 12,
            top: PEAK.y - 54,
            fontFamily: fontFamilies.mono,
            fontSize: 20,
            letterSpacing: '0.08em',
            fontVariantNumeric: 'tabular-nums',
            color: colors.muted,
            opacity: 0.8 * peak,
          }}
        >
          2024-12 · 10
        </div>
        {/* 四枚墨点悬停暗处（2025-06 ×3、2025-07 ×1） */}
        {DOTS.map((d, i) => {
          const p = interpolate(frame, [d.at, d.at + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
          const ring = interpolate(frame, [d.at, d.at + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
          if (p <= 0) return null;
          return (
            <div key={i}>
              <div
                style={{
                  position: 'absolute',
                  left: d.x - 16,
                  top: LINE_Y - 16,
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  background: `radial-gradient(circle, ${colors.accent} 0%, transparent 68%)`,
                  opacity: 0.24 * p,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: d.x - 5,
                  top: LINE_Y - 5,
                  width: 10,
                  height: 10,
                  boxSizing: 'border-box',
                  borderRadius: 5,
                  background: colors.ink,
                  border: `1px solid ${colors.accent}`,
                  opacity: 0.9 * p,
                  transform: `scale(${0.5 + p * 0.5})`,
                }}
              />
              {ring > 0 && ring < 1 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: d.x - 30,
                    top: LINE_Y - 30,
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    border: `1px solid ${colors.muted}`,
                    opacity: 0.3 * (1 - ring),
                    transform: `scale(${0.3 + ring * 1.4})`,
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </AbsoluteFill>
      <PaperGrain opacity={0.05} />
      <Grade id="GR-01" />
    </AbsoluteFill>
  );
};

export default ShotCommitCurvePowerCut;
