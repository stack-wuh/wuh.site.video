import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CLAMP, CV, FILM, GRADES, STROKE } from '../motion-tokens';
import { DustField } from '../components/DustField';
import { Gate } from '../components/Objects';

/**
 * 镜 26 · 少林山门（local 0–79）· 无字幕。
 * CM-01 低机位仰视固定；FG-13 石阶 11 级（级高递减）+ 门楼两柱一梁 + 雾 3 条横线；
 * 门半开、门里很暗；末 20f 一片松针掠过前景（PT-08 的实体掠过）。GR-07 山墨。
 */
const S26: FC = () => {
  const frame = useCurrentFrame();
  const sweep = interpolate(frame, [60, 79], [1240, -1280], { ...CLAMP, easing: CV.inOut });
  const grade = GRADES['GR-07'];
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${FILM.nightBlue} 0%, ${colors.bgLift} 52%, ${colors.bg} 100%)` }} />
      {/* 山门后的雾光：让门楼的墨形从底上浮起来 */}
      <div style={{ position: 'absolute', left: 0, top: 280, width: 1920, height: 420, background: `linear-gradient(180deg, transparent, ${colors.paperMuted}, transparent)`, opacity: 0.1 }} />
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
        <path d="M0 540 Q 180 448 360 512 Q 520 570 700 470 Q 880 372 1060 508 Q 1240 610 1420 486 Q 1600 380 1800 520 L 1920 500" fill="none" stroke={colors.muted} strokeWidth={STROKE.S0} opacity={0.55} />
        <path d="M0 610 Q 240 540 460 586 Q 700 636 900 548 Q 1140 450 1340 590 Q 1580 720 1780 580 L 1920 604" fill="none" stroke={colors.muted} strokeWidth={STROKE.S0} opacity={0.3} />
        {Array.from({ length: 11 }).map((_, i) => (
          <g key={i}>
            <rect x={560 + i * 7} y={1004 - i * 30} width={800 - i * 14} height={30} fill={colors.paperDeep} opacity={0.14 + i * 0.012} />
            <path d={`M${560 + i * 7} ${1004 - i * 30} L${1360 - i * 7} ${1004 - i * 30}`} stroke={colors.paperMuted} strokeWidth={STROKE.S0} opacity={0.5} />
          </g>
        ))}
        {/* 石阶湿着：三处短反光 */}
        {[[700, 932], [980, 872], [1160, 812]].map(([x, y]) => (
          <path key={x} d={`M${x} ${y} L${x + 120} ${y - 2}`} stroke={colors.paperMuted} strokeWidth={STROKE.S1} opacity={0.55} />
        ))}
        {/* 松影横斜 */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M${160 + i * 120} 1080 L${600 + i * 130} 720`} stroke={colors.ink} strokeWidth={8} opacity={0.1} />
        ))}
        {/* 雾三条横线（FG-13） */}
        {[560, 628, 704].map((y, i) => (
          <path key={y} d={`M0 ${y} Q 480 ${y - 14} 960 ${y} T 1920 ${y}`} fill="none" stroke={colors.muted} strokeWidth={STROKE.S0} opacity={0.34 - i * 0.05} />
        ))}
      </svg>
      <div style={{ position: 'absolute', left: 650, top: 120, width: 620, height: 620 }}>
        <Gate gap={1} style={{ width: '100%', height: '100%', opacity: 0.96 }} />
        {/* 门内暗处：两扇门向内半开，门里很暗 */}
        <div style={{ position: 'absolute', left: '21.9%', top: '20%', width: '56.2%', height: '73.8%', background: colors.bg }} />
        <div style={{ position: 'absolute', left: '21.9%', bottom: '6.2%', width: '56.2%', height: '10%', background: colors.ink, opacity: 0.55 }} />
        <div style={{ position: 'absolute', left: '21.9%', top: '20%', width: '11%', height: '73.8%', background: colors.ink }} />
        <div style={{ position: 'absolute', right: '21.9%', top: '20%', width: '11%', height: '73.8%', background: colors.ink }} />
        <div style={{ position: 'absolute', left: '21.9%', top: '20%', width: '11%', height: 1, background: colors.paperMuted, opacity: 0.5 }} />
        <div style={{ position: 'absolute', right: '21.9%', top: '20%', width: '11%', height: 1, background: colors.paperMuted, opacity: 0.4 }} />
        <div style={{ position: 'absolute', left: '32.9%', top: '20%', width: 2, height: '73.8%', background: colors.paperMuted, opacity: 0.55 }} />
        <div style={{ position: 'absolute', right: '32.9%', top: '20%', width: 2, height: '73.8%', background: colors.paperMuted, opacity: 0.35 }} />
        <div style={{ position: 'absolute', left: '21.9%', top: '20%', width: '56.2%', height: 1, background: colors.paperMuted, opacity: 0.35 }} />
      </div>
      {/* 末 20f 一片松针掠过前景 */}
      <svg viewBox="0 0 900 420" style={{ position: 'absolute', left: 0, top: 60, width: 900, height: 420, transform: `translateX(${sweep}px)`, filter: 'blur(3px)' }}>
        <path d="M40 40 Q 300 90 720 330" fill="none" stroke={colors.ink} strokeWidth={STROKE.S3} />
        {Array.from({ length: 20 }).map((_, i) => {
          const x = 70 + i * 32;
          const y = 52 + i * 14;
          return <path key={i} d={`M${x} ${y} L${x - 18} ${y - 42}`} stroke={colors.ink} strokeWidth={STROKE.S1} opacity={0.8} />;
        })}
      </svg>
      <DustField act={4} count={14} seedBase="s26" />
      <AbsoluteFill style={{ background: grade.base.color, mixBlendMode: grade.base.blend, opacity: grade.base.opacity }} />
      {grade.veil ? <AbsoluteFill style={{ background: grade.veil.gradient, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} /> : null}
    </AbsoluteFill>
  );
};

export default S26;
