import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CV, FILM, FN, GRADES } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const GRADE = GRADES['GR-06'];

/**
 * S37（5-4 中段，4980–5100，120f）——佛像半身：头形一弧 + 肩线 + 一只手，低眉一条弧。
 * 不拍全景、不给五官（无眼、无嘴、无鼻）；低机位仰视，CM-06 极缓上摇 3%，停在手印上。
 * 佛前灯在画面前景（PT-11 ≤80px，三档硬切）；尾帧：手印与灯焰同框。
 */
const S37: FC = () => {
  const frame = useCurrentFrame();
  const flicker = FN.flameStep(frame);
  const tilt = CV.out(clamp01(frame / 110));
  const cam = { scale: 1, x: 0, y: 34 - 34 * tilt, rot: 0 };
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill style={{ filter: `saturate(${GRADE.saturate})` }}>
          {/* 灯侧的墙更亮，佛是一整块墨：明度差 ≥70% */}
          <AbsoluteFill style={{ background: `linear-gradient(104deg, ${colors.muted} 0%, ${colors.bgLift} 56%, ${colors.bg} 100%)`, opacity: 0.6 }} />
          <AbsoluteFill style={{ background: `linear-gradient(180deg, transparent 0%, ${colors.bg} 100%)`, opacity: 0.55 }} />
          <AbsoluteFill style={{ background: `linear-gradient(120deg, ${FILM.fireGold} 0%, transparent 42%)`, opacity: 0.1 }} />
          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
            {/* 石身：头、颈、肩是一整块墨，画面只取半身 */}
            <circle cx={1230} cy={320} r={205} fill={colors.ink} />
            <path d="M1130 470 L1330 470 L1380 668 L1080 668 Z" fill={colors.ink} />
            <path d="M720 1080 L780 840 Q900 690 1080 640 Q1230 610 1400 650 Q1580 700 1700 880 L1770 1080 Z" fill={colors.ink} />
            {/* 灯侧边光：头弧、肩线、低眉、手印，全部 ≤1.2–2px 的 snowCyan 收口 */}
            <path d="M1050 440 Q1008 248 1150 158" fill="none" stroke={FILM.snowCyan} strokeWidth={2} opacity={0.56} />
            <path d="M790 860 Q930 690 1110 648" fill="none" stroke={FILM.snowCyan} strokeWidth={1.6} opacity={0.4} />
            <path d="M1440 660 Q1600 722 1700 890" fill="none" stroke={FILM.snowCyan} strokeWidth={1.6} opacity={0.24} />
            <path d="M1140 420 Q1230 378 1320 420" fill="none" stroke={FILM.snowCyan} strokeWidth={2} opacity={0.4} />
            {/* 一只手（禅定印）：墨形 + 灯侧收口，掌上四指的起伏 */}
            <path d="M1104 880 Q1108 842 1150 838 Q1174 812 1204 830 Q1230 806 1260 828 Q1290 818 1306 846 Q1344 858 1342 892 Q1338 936 1286 950 Q1230 962 1174 948 Q1116 934 1104 880 Z" fill={colors.ink} stroke={FILM.snowCyan} strokeWidth={1.2} opacity={0.95} />
            <path d="M1150 866 Q1200 880 1250 866 Q1290 858 1316 872" fill="none" stroke={FILM.snowCyan} strokeWidth={1.2} opacity={0.45} />
            <path d="M1166 908 Q1230 926 1294 908" fill="none" stroke={FILM.snowCyan} strokeWidth={1} opacity={0.3} />
          </svg>
          <DustField act={5} count={20} seedBase="s37" />
          {/* 佛前灯：前景局部 radial ≤80px；焰三档 2f 硬切 */}
          <div style={{ position: 'absolute', left: 222, top: 782, width: 156, height: 156, borderRadius: '50%', background: `radial-gradient(circle, ${FILM.fireGold} 0%, transparent 70%)`, opacity: 0.26 + 0.22 * flicker }} />
          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
            <ellipse cx={300} cy={980} rx={150} ry={36} fill={colors.ink} />
            <path d="M150 966 Q300 926 450 966" fill="none" stroke={colors.paperMuted} strokeWidth={1.4} opacity={0.45} />
            <path d="M180 960 Q300 986 420 960" fill="none" stroke={colors.ink} strokeWidth={2} opacity={0.6} />
            <ellipse cx={300} cy={866} rx={12} ry={31} fill={FILM.fireGold} opacity={0.55 + 0.4 * flicker} />
          </svg>
          <AbsoluteFill style={{ background: GRADE.base.color, mixBlendMode: GRADE.base.blend, opacity: GRADE.base.opacity }} />
        </AbsoluteFill>
      </CameraRig>
      {GRADE.veil ? <AbsoluteFill style={{ background: GRADE.veil.gradient, mixBlendMode: GRADE.veil.blend, opacity: GRADE.veil.opacity }} /> : null}
    </AbsoluteFill>
  );
};

export default S37;
