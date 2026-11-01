import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CM, FILM, FN, GRADES, STROKE } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';

/**
 * 镜 29 · 纸页（local 0–159）·「后来，江湖上开始讲她的故事。」
 * CM-13 slow-fast-slow 横移——全片唯一一次「赶」；PT-10 笔迹描边生长；FN-23 纸摞升高。
 * 尾 16f TR-10 stack-wipe：纸摞扫过画幅，露出远山雾（接 S30 的 AscendScene 背景）。
 */
const S29: FC = () => {
  const frame = useCurrentFrame();
  const pan = CM.ramp(frame, 160, -340);
  const wipe = Math.min(1, Math.max(0, (frame - 144) / 15));
  const pile = FN.paperAction(frame, 'stack');
  const sheets = Math.min(26, 6 + Math.floor(pile / 4));
  const brushX = 980 + Math.sin(frame / 18) * 120;
  const brushY = 500 + Math.cos(frame / 26) * 60;
  const trail = Math.min(1, frame / 110);
  const grade = GRADES['GR-01'];
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* 被纸页盖住的远山雾：尾帧 wipe 后露出，接 S30 */}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${FILM.nightBlue} 0%, ${colors.bg} 56%)` }}>
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
          <path d="M0 430 L260 300 L420 380 L620 240 L860 400 L1080 290 L1320 410 L1600 330 L1920 430" fill="none" stroke={colors.muted} strokeWidth={STROKE.S1} opacity={0.5} />
          <path d="M0 500 L320 390 L520 470 L760 350 L980 470 L1220 380 L1480 480 L1740 410 L1920 470" fill="none" stroke={colors.muted} strokeWidth={STROKE.S0} opacity={0.28} />
        </svg>
      </AbsoluteFill>
      <div style={{ position: 'absolute', inset: 0, transform: `translate(${pan.x - wipe * 2700}px, ${-wipe * 300}px) rotate(${wipe * 3}deg)` }}>
        {/* 摊开的纸页：像摊开的账 */}
        <div style={{ position: 'absolute', left: -500, top: -200, width: 2920, height: 1480, background: colors.paperDeep, transform: 'rotate(-1.2deg)' }} />
        <div style={{ position: 'absolute', left: 1180, top: -120, width: 1400, height: 1360, background: colors.paperMuted, transform: 'rotate(1.4deg)', opacity: 0.95 }} />
        <path d="M300 120 L246 980 M1520 60 L1480 1020" stroke={colors.paperMuted} strokeWidth={STROKE.S1} opacity={0.8} />
        {/* 墨字密密的：竖列短横，字不必看清（PT-10 生长） */}
        {Array.from({ length: 13 }).map((_, c) =>
          Array.from({ length: 14 }).map((_, r) => {
            const grow = Math.min(1, Math.max(0, (frame - 8 - c * 3 - r) / 30));
            return (
              <div
                key={`${c}-${r}`}
                style={{ position: 'absolute', left: 120 + c * 132, top: 120 + r * 44, width: (60 + (r % 4) * 14) * grow, height: 1, background: colors.ink, opacity: 0.5 }}
              />
            );
          }),
        )}
        <path d="M420 610 Q 700 566 900 624 T 1180 660" fill="none" stroke={colors.ink} strokeWidth={STROKE.S1} opacity={0.55} strokeDasharray={900} strokeDashoffset={900 * (1 - trail)} />
        {/* 一只手在抄，笔尖游走 */}
        <div style={{ position: 'absolute', left: brushX, top: brushY }}>
          <svg viewBox="0 0 320 180" style={{ width: 320, height: 180, overflow: 'visible' }}>
            <path d="M0 90 L180 58" stroke={colors.ink} strokeWidth={STROKE.S3} strokeLinecap="round" />
            <path d="M-14 96 Q0 84 6 90 Q2 102 -14 96 Z" fill={colors.ink} />
            <path d="M150 40 Q120 66 150 96 L286 118 L318 40 L214 18 Q172 18 150 40 Z" fill={colors.paper} stroke={colors.ink} strokeWidth={STROKE.S1} />
            <path d="M168 52 Q206 40 244 50" fill="none" stroke={colors.ink} strokeWidth={STROKE.S1} opacity={0.5} />
          </svg>
        </div>
        {/* 尾帧：纸页摞起，摞得很高 */}
        {Array.from({ length: sheets }).map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: 1290 + (i % 3) * 5, top: 972 - i * 9 - pile, width: 430, height: 9, background: i % 2 ? colors.paper : colors.paperMuted, borderTop: `1px solid ${colors.ink}`, opacity: 0.95 }} />
        ))}
        {frame >= 110 ? (
          <div style={{ position: 'absolute', left: 1460, top: 966 - pile - sheets * 9, transform: 'rotate(-18deg)' }}>
            <svg viewBox="0 0 220 120" style={{ width: 220, height: 120 }}>
              <path d="M40 60 Q60 18 120 20 L200 24 L200 96 L120 96 Q60 96 40 60 Z" fill={colors.paper} stroke={colors.ink} strokeWidth={STROKE.S1} />
              <path d="M60 44 Q96 30 130 34 M60 62 Q98 50 132 54" fill="none" stroke={colors.ink} strokeWidth={STROKE.S1} opacity={0.5} />
            </svg>
          </div>
        ) : null}
      </div>
      <DustField act={4} count={12} seedBase="s29" />
      <AbsoluteFill style={{ background: grade.base.color, mixBlendMode: grade.base.blend, opacity: grade.base.opacity }} />
      {grade.veil ? <AbsoluteFill style={{ background: grade.veil.gradient, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} /> : null}
      <Caption text="后来，江湖上开始讲她的故事。" start={0} end={120} tone="ink" />
    </AbsoluteFill>
  );
};

export default S29;
