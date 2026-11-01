/* 镜 25 · Act 4 留白 · 局部帧 [0,120) · 120f
   承接 s24「尘埃 + 刻度盘微光」：刻度盘自尘埃显出（TR-13 入场侧）；
   指针 0→微动→0（FN-25），衬线大字「0」压满画面（FN-29），末 20f 微微失焦（CM-13）；
   镜头 1% 呼吸式推拉（周期 60f）；GR-05。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, letterpress, needleSettle } from '../motion-tokens';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';
import { Caption } from '../components/Caption';

const CX = 960;
const PY = 950;
const R = 620;
const NEEDLE_R = 550;

/* 180° 刻度弧：0 在左端（180°），24 格均布 */
const TICKS = Array.from({ length: 25 }).map((_, i) => {
  const deg = 180 + (180 / 24) * i;
  const rad = (deg * Math.PI) / 180;
  const major = i % 6 === 0;
  const inner = major ? R - 30 : R - 16;
  return {
    x1: CX + inner * Math.cos(rad),
    y1: PY + inner * Math.sin(rad),
    x2: CX + R * Math.cos(rad),
    y2: PY + R * Math.sin(rad),
    major,
  };
});

const ARC = `M ${CX - R} ${PY} A ${R} ${R} 0 0 1 ${CX + R} ${PY}`;

/* 尘埃散开：几个较大的浮尘随显影淡出 */
const VEIL = Array.from({ length: 10 }).map((_, i) => {
  const seed = `s25-veil-${i}`;
  return {
    x: 560 + random(seed) * 800,
    y: 360 + random(`${seed}-y`) * 280,
    size: 3 + random(`${seed}-s`) * 4,
  };
});

const ShotZeroGauge: FC = () => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [0, 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const breath = 1 + Math.sin((frame / 60) * Math.PI * 2) * 0.01;
  const defocus = interpolate(frame, [100, 120], [0, 9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });

  /* 指针 0→微动→0（46f 起阻尼回归，绕轴心微旋） */
  const settle = frame >= 46 ? needleSettle(frame, 46, 2) : 0;

  /* 0 附近刻度微微抖动（56–88f 衰减） */
  const trembleEnv = interpolate(frame, [56, 88], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const tremble = frame >= 56 ? Math.sin((frame - 56) / 5) * 0.25 * trembleEnv : 0;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${breath})`, filter: `blur(${defocus}px)`, opacity: 1 - defocus * 0.009 }}>
        <DustField act={4} count={10} seedBase="s25" />
        {VEIL.map((v, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: v.x,
              top: v.y,
              width: v.size,
              height: v.size,
              borderRadius: '50%',
              background: colors.gold,
              opacity: (1 - reveal) * 0.32,
            }}
          />
        ))}
        {/* 刻度盘：弧 + 刻度 + 指针（从尘埃显出） */}
        <AbsoluteFill style={{ opacity: reveal, filter: `blur(${(1 - reveal) * 10}px)` }}>
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            <path d={ARC} fill="none" stroke={colors.muted} strokeWidth={2} opacity={0.5} />
            <g transform={`rotate(${tremble} ${CX} ${PY})`}>
              {TICKS.map((t, i) => (
                <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={colors.paper} strokeWidth={t.major ? 2 : 1} opacity={t.major ? 0.55 : 0.3} />
              ))}
            </g>
            <g transform={`rotate(${settle} ${CX} ${PY})`}>
              <line x1={CX - NEEDLE_R} y1={PY} x2={CX + 70} y2={PY} stroke={colors.accent} strokeWidth={3} strokeLinecap="round" />
            </g>
            <circle cx={CX} cy={PY} r={11} fill={colors.ink} stroke={colors.accent} strokeWidth={1.5} />
          </svg>
        </AbsoluteFill>
        {/* 衬线大字 0 压住整幅 */}
        <div style={{ ...letterpress(frame, 30, 1), position: 'absolute', left: 0, right: 0, top: 210, height: 620, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fontFamilies.serif, fontSize: 520, lineHeight: 1, fontVariantNumeric: 'tabular-nums', color: colors.paper }}>
          0
        </div>
      </AbsoluteFill>
      <PaperGrain opacity={0.05} />
      <Grade id="GR-05" />
      <Caption text="那一年，站点的年度浏览量是 0。" appearAt={26} />
    </AbsoluteFill>
  );
};

export default ShotZeroGauge;
