import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CV, FILM, FN, GRADES } from '../motion-tokens';
import { Scripture } from '../components/Objects';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const GRADE = GRADES['GR-06'];

/**
 * S38（5-4 后段，5100–5220，120f）——她的侧影在灯前，低头抄经，忽然抬眼看向窗外（不看镜头）。
 * 落发：头形一弧，无髻、无帽、无戒疤；缁衣 + 内领一线雪青。
 * L3 窗口 local 0–60（5100–5160）：只给一只眼与颧骨一角，灯焰在眼里跳一下，无眼白、无瞳孔。
 * 其后 60f 焦点从她的眼移到窗外的光（用明度与细节退场实现，人物 path 不加模糊）。
 */
const S38: FC = () => {
  const frame = useCurrentFrame();
  const flicker = FN.flameStep(frame);
  const lift = 8 * (1 - CV.out(clamp01(frame / 15)));
  const focus = CV.hardStep3(clamp01((frame - 60) / 55));
  const glint = FN.eyeGlint(frame, 0, 60);
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <AbsoluteFill style={{ filter: `saturate(${GRADE.saturate})` }}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.bg} 0%, ${colors.bgLift} 58%, ${colors.bg} 100%)` }} />
        {/* 窗：窗外是天光，后半段焦点移到这里 */}
        <div style={{ position: 'absolute', left: 1430, top: 168, width: 370, height: 566, overflow: 'hidden', border: `10px solid ${colors.ink}`, boxSizing: 'border-box', opacity: 0.28 + 0.6 * focus }}>
          <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.paper} 0%, ${FILM.snowCyan} 74%, ${colors.muted} 100%)`, opacity: 0.62 }} />
          <div style={{ position: 'absolute', left: '49%', top: 0, width: 8, height: '100%', background: colors.ink, opacity: 0.8 }} />
          <div style={{ position: 'absolute', top: '48%', left: 0, width: '100%', height: 8, background: colors.ink, opacity: 0.8 }} />
        </div>
        {/* 窗光落进来 */}
        <AbsoluteFill style={{ background: `linear-gradient(270deg, ${colors.paper} 0%, transparent 56%)`, opacity: 0.16 * focus }} />
        {/* 案与经卷 */}
        <div style={{ position: 'absolute', left: 560, top: 842, width: 620, height: 238, background: `linear-gradient(180deg, ${colors.ink} 0%, ${colors.bg} 100%)` }} />
        <div style={{ position: 'absolute', left: 560, top: 840, width: 620, height: 2, background: colors.paperMuted, opacity: 0.3 }} />
        <div style={{ position: 'absolute', left: 706, top: 984, width: 246, height: 10, background: colors.bg, opacity: 0.5 }} />
        <div style={{ position: 'absolute', left: 700, top: 862, width: 240, height: 111, transform: 'rotate(-3deg)', opacity: 0.9 - 0.25 * focus }}>
          <Scripture style={{ width: '100%', height: '100%' }} />
        </div>
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
          {/* 她：侧影，缁衣；肩线 / 内领一线雪青 */}
          <path d="M1042 452 L1110 452 L1128 548 L1024 548 Z" fill={colors.ink} />
          <path d="M900 1080 L944 640 Q1012 528 1076 528 Q1162 528 1222 648 L1282 1080 Z" fill={colors.ink} />
          <path d="M952 664 Q1014 556 1076 556" fill="none" stroke={FILM.snowCyan} strokeWidth={1.2} opacity={0.3 - 0.2 * focus} />
          <path d="M1146 372 Q1152 428 1128 470" fill="none" stroke={FILM.snowCyan} strokeWidth={1.2} opacity={0.24 - 0.16 * focus} />
          <path d="M1044 546 L1076 580 L1108 546" fill="none" stroke={FILM.snowCyan} strokeWidth={1.2} opacity={0.75 - 0.45 * focus} />
          {/* 抄经的臂与笔 */}
          <path d="M1006 668 Q972 762 944 836" fill="none" stroke={colors.ink} strokeWidth={34} strokeLinecap="round" />
          <path d="M1000 676 Q974 756 950 820" fill="none" stroke={FILM.snowCyan} strokeWidth={1.2} opacity={0.18} />
          <path d="M946 852 L884 914" stroke={colors.paperMuted} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
          {/* 头：落发一弧，无髻无帽；抬眼 15f */}
          <g transform={`rotate(${lift} 1076 520)`}>
            <circle cx={1076} cy={400} r={76} fill={colors.ink} />
            <path d="M1010 372 Q1024 312 1096 314" fill="none" stroke={FILM.snowCyan} strokeWidth={1.2} opacity={0.32 - 0.2 * focus} />
            {/* L3：只给一只眼与颧骨一角，无眼白、无瞳孔 */}
            <circle cx={1122} cy={392} r={2} fill={FILM.fireGold} opacity={(0.8 + 0.2 * flicker) * glint} />
            <path d="M1094 424 Q1132 428 1152 410" fill="none" stroke={FILM.snowCyan} strokeWidth={1.2} opacity={0.34 * glint} />
          </g>
          {/* 佛前灯：左侧前景，PT-11 局部 radial ≤80px */}
          <ellipse cx={252} cy={1002} rx={118} ry={28} fill={colors.ink} />
          <ellipse cx={252} cy={892} rx={10} ry={25} fill={FILM.fireGold} opacity={0.55 + 0.4 * flicker} />
        </svg>
        <div style={{ position: 'absolute', left: 174, top: 812, width: 156, height: 156, borderRadius: '50%', background: `radial-gradient(circle, ${FILM.fireGold} 0%, transparent 70%)`, opacity: 0.24 + 0.2 * flicker }} />
        <AbsoluteFill style={{ background: GRADE.base.color, mixBlendMode: GRADE.base.blend, opacity: GRADE.base.opacity }} />
      </AbsoluteFill>
      {GRADE.veil ? <AbsoluteFill style={{ background: GRADE.veil.gradient, mixBlendMode: GRADE.veil.blend, opacity: GRADE.veil.opacity }} /> : null}
    </AbsoluteFill>
  );
};

export default S38;
