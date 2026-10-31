/* 镜 24 · Act 4 留白 · 局部帧 [0,156) · 156f
   时间轴串起四点（2025-06 ×3、2025-07 ×1），标注落定；8–11 月刻度连续空白，
   空白处纸纤维渐显、尘埃上浮（PT-08 / PT-06）；CM-11 微距横移，空白段速度≈0；
   尾帧：尽头灰尘落定、尘埃散开露出刻度盘微光；GR-05。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS, inkRise, pathDraw } from '../motion-tokens';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';
import { Caption } from '../components/Caption';

const LINE_X0 = 930;
const LINE_X1 = 2470;
const LINE_Y = 552;
const LINE_LEN = LINE_X1 - LINE_X0;
const DOTS = [1100, 1180, 1260, 1400];
const MONTHS = [
  { x: 1620, label: '08' },
  { x: 1840, label: '09' },
  { x: 2060, label: '10' },
  { x: 2280, label: '11' },
];
/* 承接 s23 尾帧的残余曲线（前 20f 淡出） */
const PEAK = { x: 240, y: 430 };
const CURVE = 'M 240 430 C 430 478, 560 522, 760 540 C 940 554, 1000 552, 1100 552 L 1400 552';
const TAIL = 'M 1400 552 C 1428 553, 1450 554, 1480 556';

/* PT-08 纸纤维：种子化 1px 短笔画，静态渐显 */
const FIBERS = Array.from({ length: 26 }).map((_, i) => {
  const seed = `s24-fiber-${i}`;
  return {
    x: 1660 + random(seed) * 720,
    y: 468 + random(`${seed}-y`) * 190,
    len: 8 + random(`${seed}-len`) * 14,
    rot: -20 + random(`${seed}-rot`) * 40,
    delay: 82 + i * 2.2,
    op: 0.18 + random(`${seed}-op`) * 0.2,
  };
});

/* PT-06 反重力尘埃：空白段极慢上浮 */
const MOTES = Array.from({ length: 12 }).map((_, i) => {
  const seed = `s24-mote-${i}`;
  return {
    x: 1620 + random(seed) * 820,
    y0: 640 + random(`${seed}-y`) * 130,
    speed: 0.12 + random(`${seed}-v`) * 0.2,
    size: 2 + random(`${seed}-s`) * 2,
    delay: 44 + random(`${seed}-d`) * 50,
    gold: random(`${seed}-g`) < 0.9,
  };
});

const ShotTimelineFourSteps: FC = () => {
  const frame = useCurrentFrame();
  /* CM-15 slow-pause-slow：横移中段（空白段）速度几乎为零 */
  const u =
    frame < 96
      ? interpolate(frame, [56, 96], [0, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut })
      : frame < 112
        ? interpolate(frame, [96, 112], [0.5, 0.53], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut })
        : interpolate(frame, [112, 148], [0.53, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const tx = -700 * u;
  const scale = interpolate(frame, [0, 60, 148], [0.97, 1.0, 1.05], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });

  /* 尾帧：灰尘落定 → 刻度盘微光浮现 */
  const residual = 1 - interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const moteY = interpolate(frame, [138, 148], [-28, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const moteP = interpolate(frame, [138, 146], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const dialGlow = interpolate(frame, [140, 156], [0, 0.42], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${tx}px) scale(${scale})` }}>
        <DustField act={4} count={12} seedBase="s24" />
        {/* s23 尾帧残余：断电曲线淡出，只留四点 */}
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          <path d={CURVE} fill="none" stroke={colors.muted} strokeWidth={2} opacity={0.38 * residual} />
          <path d={TAIL} fill="none" stroke={colors.muted} strokeWidth={2} opacity={0.38 * residual} transform="translate(0 230)" />
          <circle cx={PEAK.x} cy={PEAK.y} r={4} fill={colors.muted} opacity={0.8 * residual} />
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
            opacity: 0.8 * residual,
          }}
        >
          2024-12 · 10
        </div>
        {/* 时间轴：穿过四点的直线，向右延入空白 */}
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          <path d={`M ${LINE_X0} ${LINE_Y} L ${LINE_X1} ${LINE_Y}`} fill="none" stroke={colors.muted} strokeWidth={2} opacity={0.6} style={pathDraw(frame, 10, 40, LINE_LEN)} />
          {MONTHS.map((m) => {
            const at = 10 + ((m.x - LINE_X0) / LINE_LEN) * 40;
            const p = interpolate(frame, [at, at + 6], [0, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return <line key={m.label} x1={m.x} y1={LINE_Y - 12} x2={m.x} y2={LINE_Y} stroke={colors.muted} strokeWidth={1.5} opacity={p} />;
          })}
        </svg>
        {/* 四个提交点（承接 s23 的四墨点） */}
        {DOTS.map((x) => (
          <div key={x}>
            <div style={{ position: 'absolute', left: x - 16, top: LINE_Y - 16, width: 32, height: 32, borderRadius: 16, background: `radial-gradient(circle, ${colors.accent} 0%, transparent 68%)`, opacity: 0.24 }} />
            <div style={{ position: 'absolute', left: x - 5, top: LINE_Y - 5, width: 10, height: 10, boxSizing: 'border-box', borderRadius: 5, background: colors.ink, border: `1px solid ${colors.accent}`, opacity: 0.9 }} />
          </div>
        ))}
        {/* 月份标注落定：2025-06（三次）、2025-07（一次） */}
        <div style={{ ...inkRise(frame, 34), position: 'absolute', left: 1110, top: 486, width: 140, textAlign: 'center', fontFamily: fontFamilies.mono, fontSize: 24, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.06em', color: colors.paper }}>
          2025-06
        </div>
        <div style={{ ...inkRise(frame, 46), position: 'absolute', left: 1330, top: 486, width: 140, textAlign: 'center', fontFamily: fontFamilies.mono, fontSize: 24, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.06em', color: colors.paper }}>
          2025-07
        </div>
        {/* 8–11 月空白刻度 */}
        {MONTHS.map((m, i) => (
          <div
            key={m.label}
            style={{ ...inkRise(frame, 64 + i * 12), position: 'absolute', left: m.x - 20, top: 570, width: 40, textAlign: 'center', fontFamily: fontFamilies.mono, fontSize: 20, fontVariantNumeric: 'tabular-nums', color: colors.muted }}
          >
            {m.label}
          </div>
        ))}
        {/* PT-08 纸纤维渐显 */}
        {FIBERS.map((fb, i) => {
          const p = interpolate(frame, [fb.delay, fb.delay + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: fb.x,
                top: fb.y,
                width: 1,
                height: fb.len,
                background: colors.muted,
                opacity: fb.op * p,
                transform: `rotate(${fb.rot}deg)`,
              }}
            />
          );
        })}
        {/* PT-06 尘埃上浮 */}
        {MOTES.map((m, i) => {
          const t = Math.max(0, frame - m.delay);
          const p = interpolate(frame, [m.delay, m.delay + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const breathe = 0.5 + 0.5 * Math.sin(frame / 26 + i);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: m.x,
                top: m.y0,
                width: m.size,
                height: m.size,
                borderRadius: '50%',
                background: m.gold ? colors.gold : colors.muted,
                opacity: p * (0.1 + 0.16 * breathe),
                transform: `translate(${Math.sin(frame / 50 + i * 1.7) * 6}px, ${-t * m.speed}px)`,
              }}
            />
          );
        })}
        {/* 尾帧：一枚灰尘落定，尘埃散开露出刻度盘微光 */}
        <div style={{ position: 'absolute', left: 2350, top: 442, width: 220, height: 220, borderRadius: '50%', background: `radial-gradient(circle, ${FILM_COLORS.goldMist} 0%, transparent 62%)`, opacity: dialGlow }} />
        <div style={{ position: 'absolute', left: 2438, top: 536, width: 4, height: 4, borderRadius: 2, background: colors.gold, opacity: 0.7 * moteP, transform: `translateY(${moteY}px)` }} />
      </AbsoluteFill>
      <PaperGrain opacity={0.05} />
      <Grade id="GR-05" />
      <Caption text="2025 年，新站只走了四步，然后长久地安静。" appearAt={30} />
    </AbsoluteFill>
  );
};

export default ShotTimelineFourSteps;
