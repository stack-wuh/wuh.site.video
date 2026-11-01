import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CLAMP, CM, CV, FILM, GRADES, STROKE } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { IronArhat } from '../components/Objects';

/**
 * 镜 27 · 铁罗汉（local 0–159）·「她一路问过去，没有人见过他。」
 * CM-09 微距双人中景 + CM-11 焦点一次往返：掌心 → 少年眼睫 → 铁罗汉；
 * FN-13 递出 20f + 6f 释放（give 118–142）；两人皆 L0：她的侧后与手、少年的发顶与低垂眼睫。
 */
const S27: FC = () => {
  const frame = useCurrentFrame();
  const cam = CM.macro(frame, 160, 1.08, 1.16);
  const focusLash = interpolate(frame, [8, 28, 64, 84], [0, 1, 1, 0], { ...CLAMP, easing: CV.inOut });
  const youthBlur = 7 * (1 - focusLash);
  const palmBlur = 4 * focusLash;
  const give = interpolate(frame, [118, 142], [0, 1], { ...CLAMP, easing: CV.inOut });
  const close = interpolate(frame, [140, 156], [0, 1], { ...CLAMP, easing: CV.out });
  const grade = GRADES['GR-03'];
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <CameraRig cam={cam}>
        {/* 景：山门外虚化的阶与柱 */}
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, filter: 'blur(7px)', opacity: 0.6 }}>
          <rect x={-40} y={-40} width={430} height={1160} fill={colors.ink} opacity={0.5} />
          <rect x={1580} y={-40} width={400} height={1160} fill={colors.ink} opacity={0.4} />
          {[820, 880, 940, 1000].map((y, i) => (
            <rect key={y} x={320} y={y} width={1280} height={36} fill={colors.paperMuted} opacity={0.05 + i * 0.012} />
          ))}
        </svg>
        {/* 她：侧后 + 递出的右手（L0） */}
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, filter: `blur(${palmBlur}px)` }}>
          <path d="M-120 320 Q120 262 300 344 L360 1080 L-120 1080 Z" fill={FILM.snowCyan} opacity={0.82} />
          <circle cx={52} cy={224} r={78} fill={FILM.snowCyan} opacity={0.95} />
          <path d="M2 168 Q52 138 104 172" fill="none" stroke={colors.paperMuted} strokeWidth={STROKE.S3} />
          <circle cx={112} cy={186} r={10} fill={colors.paperMuted} />
          <g transform={`translate(0 ${12 * give})`}>
            <path d="M250 464 L752 564" stroke={FILM.snowCyan} strokeWidth={66} strokeLinecap="round" opacity={0.92} />
            <path d="M706 528 L716 600" stroke={colors.paperMuted} strokeWidth={14} opacity={0.55} />
            <path d="M758 566 Q784 534 820 544 Q848 552 844 582 Q838 610 804 612 Q772 614 758 590 Z" fill={colors.paper} stroke={colors.ink} strokeWidth={STROKE.S1} />
            <path d="M772 552 Q794 540 818 548 M768 570 Q794 560 822 566" fill="none" stroke={colors.ink} strokeWidth={STROKE.S1} opacity={0.45} />
          </g>
        </svg>
        {/* 少年：发顶 + 一线额 + 低垂的眼睫（L0） */}
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, filter: `blur(${youthBlur}px)` }}>
          <circle cx={1250} cy={-10} r={170} fill={colors.ink} />
          <path d="M1080 118 Q1220 252 1420 128 Q1400 212 1250 242 Q1104 226 1080 118 Z" fill={colors.paper} stroke={colors.ink} strokeWidth={STROKE.S1} />
          <path d="M1124 176 Q1144 202 1134 228 M1204 192 Q1224 218 1214 244" fill="none" stroke={colors.ink} strokeWidth={STROKE.S1} opacity={0.7} />
          <path d="M1210 606 Q1170 584 1128 596 L1116 640 Q1150 674 1216 660 Z" fill={colors.paper} stroke={colors.ink} strokeWidth={STROKE.S1} />
          <path d="M1126 600 L1096 588 M1122 618 L1090 610 M1124 636 L1094 632" fill="none" stroke={colors.ink} strokeWidth={STROKE.S1} opacity={0.65} />
        </svg>
        {/* 铁罗汉：40px，从她掌心交到少年掌中 */}
        <div style={{ position: 'absolute', left: 785 + give * 300, top: 526 + give * 40, width: 30, height: 40 }}>
          <IronArhat style={{ width: '100%', height: '100%' }} />
        </div>
        {close > 0.5 ? (
          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
            <path d="M1074 578 Q1068 520 1122 510 Q1190 500 1220 548 Q1248 604 1188 634 Q1112 656 1074 578 Z" fill={colors.paper} stroke={colors.ink} strokeWidth={STROKE.S1} />
            <path d="M1092 546 L1146 546 M1092 574 L1158 574 M1102 602 L1160 602" stroke={colors.ink} strokeWidth={STROKE.S1} opacity={0.55} />
          </svg>
        ) : null}
      </CameraRig>
      <DustField act={4} count={14} seedBase="s27" />
      <AbsoluteFill style={{ background: grade.base.color, mixBlendMode: grade.base.blend, opacity: grade.base.opacity }} />
      {grade.veil ? <AbsoluteFill style={{ background: grade.veil.gradient, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} /> : null}
      <Caption text="她一路问过去，没有人见过他。" start={0} end={120} />
    </AbsoluteFill>
  );
};

export default S27;
