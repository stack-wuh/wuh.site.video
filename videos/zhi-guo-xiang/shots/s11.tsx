/* 镜 11 · 幕二 风陵渡 · local [0,120) · 120f
   掌心慢慢合拢，把三枚针握进手里，指缝里漏出一点金；背景仍是暗；末段露出一点素色袖口。
   CM-09 微距固定；合掌 40f（FN-13 clench）；末 30f 后拉 2% 露出袖口；尾帧指缝一线金。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CM, CV, FN, GRADES, STROKE } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const NEEDLES = [0, 1, 2];
const FINGERS = [
  { kx: 838, ky: 606, mx: 846, my: 526, m: 'M838 606 L846 526', d: 'M846 526 L858 462', a: 120, b: 60 },
  { kx: 916, ky: 600, mx: 922, my: 518, m: 'M916 600 L922 518', d: 'M922 518 L934 452', a: 120, b: 60 },
  { kx: 994, ky: 600, mx: 990, my: 520, m: 'M994 600 L990 520', d: 'M990 520 L1004 470', a: -120, b: -60 },
  { kx: 1072, ky: 612, mx: 1066, my: 546, m: 'M1072 612 L1066 546', d: 'M1066 546 L1084 506', a: -120, b: -60 },
];

const S11: FC = () => {
  const frame = useCurrentFrame();
  const base = CM.macro(frame, 120, 1.03, 1.06);
  const pull = CM.dollyOut(Math.max(0, frame - 90), 30, 0.02);
  const cam = { ...base, scale: base.scale * pull.scale };
  const clench = FN.handAction(frame, 'clench');
  const leak = CV.hardStep3(clamp01((frame - 48) / 9));
  const lit = 0.08 + 0.03 * (FN.flameStep(frame) - 0.7) / 0.3;
  const cuffAt = frame >= 96 ? 1 : 0;
  const cuffSlide = CV.out(clamp01((frame - 90) / 30));
  const grade = GRADES['GR-02'];

  return (
    <AbsoluteFill style={{ background: colors.bg, overflow: 'hidden' }}>
      <AbsoluteFill style={{ filter: `saturate(${grade.saturate})` }}>
        <CameraRig cam={cam}>
          <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.bg} 0%, ${colors.bgLift} 74%, ${colors.bg} 100%)` }} />

          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
            {/* 掌与腕：与 S10 尾帧同构 */}
            <path d="M850 906 L866 1080 L1054 1080 L1070 906 Z" fill={colors.paper} stroke={colors.ink} strokeWidth={STROKE.S1} />
            <path d="M760 620 Q742 764 802 850 Q872 912 960 914 Q1058 912 1118 842 Q1158 762 1140 620 Q1050 562 960 562 Q870 562 760 620 Z" fill={colors.paper} stroke={colors.ink} strokeWidth={STROKE.S1} />
            <path d="M826 744 Q900 730 988 764 Q1046 786 1096 764" fill="none" stroke={colors.ink} strokeWidth={STROKE.S1} opacity={0.26} />
            <path d="M812 812 Q900 790 986 822 Q1034 840 1082 822" fill="none" stroke={colors.ink} strokeWidth={STROKE.S1} opacity={0.24} />
            <path d="M880 660 Q902 742 890 828" fill="none" stroke={colors.ink} strokeWidth={STROKE.S0} opacity={0.18} />

            {/* 三枚金针：被手掌慢慢合起握进去 */}
            <defs>
              <radialGradient id="s11-needle">
                <stop offset="0%" stopColor={colors.gold} stopOpacity={0.95} />
                <stop offset="100%" stopColor={colors.gold} stopOpacity={0} />
              </radialGradient>
            </defs>
            {NEEDLES.map((i) => {
              const y = 706 + i * 10;
              return (
                <g key={i} opacity={1 - 0.4 * clench.t}>
                  <path d={`M926 ${y + 1.4} L972 ${y + 1.4}`} stroke={colors.bg} strokeWidth={STROKE.S0} opacity={0.25} />
                  <path d={`M926 ${y} L972 ${y}`} stroke={colors.paperMuted} strokeWidth={STROKE.S0} />
                  <circle cx={972} cy={y} r={1.9} fill="url(#s11-needle)" />
                </g>
              );
            })}

            {/* 五指两节：40f 合拢，指尖落到掌心的针上 */}
            {FINGERS.map((f, i) => (
              <g key={i} transform={`rotate(${f.a * clench.t} ${f.kx} ${f.ky})`}>
                <g transform={`rotate(${f.b * clench.t} ${f.mx} ${f.my})`}>
                  <path d={f.d} fill="none" stroke={colors.ink} strokeWidth={63.6} strokeLinecap="round" />
                  <path d={f.m} fill="none" stroke={colors.ink} strokeWidth={63.6} strokeLinecap="round" />
                  <path d={f.d} fill="none" stroke={colors.paper} strokeWidth={61.2} strokeLinecap="round" />
                  <path d={f.m} fill="none" stroke={colors.paper} strokeWidth={61.2} strokeLinecap="round" />
                </g>
              </g>
            ))}
            <g transform={`rotate(${58 * clench.t} 794 806)`}>
              <path d="M794 806 Q748 782 716 740" fill="none" stroke={colors.ink} strokeWidth={71.6} strokeLinecap="round" />
              <path d="M794 806 Q748 782 716 740" fill="none" stroke={colors.paper} strokeWidth={69.2} strokeLinecap="round" />
            </g>

            {/* 指缝里漏出一点金：2–3 帧硬切，不渐亮 */}
            <g opacity={leak}>
              <path d="M942 764 L948 782" stroke={colors.gold} strokeWidth={STROKE.S1} opacity={0.85} />
              <path d="M962 770 L962 788" stroke={colors.gold} strokeWidth={STROKE.S1} opacity={0.7} />
              <path d="M982 764 L976 780" stroke={colors.gold} strokeWidth={STROKE.S1} opacity={0.85} />
            </g>

            {/* 末段袖口：素色一截，随 2% 后拉滑入 */}
            <g opacity={cuffAt} transform={`translate(0 ${40 * (1 - cuffSlide)})`}>
              <path d="M846 1000 Q940 962 1076 998 L1092 1080 L830 1080 Z" fill={colors.paperMuted} stroke={colors.ink} strokeWidth={STROKE.S1} />
              <path d="M846 1000 Q940 962 1076 998" fill="none" stroke={colors.ink} strokeWidth={STROKE.S0} opacity={0.35} />
            </g>
          </svg>

          <AbsoluteFill style={{ background: `linear-gradient(118deg, ${colors.paper} 0%, transparent 56%)`, mixBlendMode: 'screen', opacity: lit }} />
          <DustField act={2} count={10} seedBase="s11" />
        </CameraRig>
      </AbsoluteFill>

      <AbsoluteFill style={{ background: grade.base.color, mixBlendMode: grade.base.blend, opacity: grade.base.opacity }} />
      {grade.veil ? <AbsoluteFill style={{ background: grade.veil.gradient, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} /> : null}
    </AbsoluteFill>
  );
};

export default S11;
