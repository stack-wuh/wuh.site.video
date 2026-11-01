/* 镜 50 · Act 6 像极了 · 局部帧 [0,160) · 160f
   只有天空：晚霞铺满，暖金与胭脂，云边开始发亮；画面中央偏上留一块稍暗的蓝。
   固定仰角；云的流动继续放慢（FN-22）；PT-03 光尘；PT-06 金色细点在末段浮出；GR-08；无字幕。
   尾帧：将浮出的金点（TR-12 30f → S51）。
   导出 DuskSky 供 S51/S52 承接：同一片天、同一蓝块、同一组金点。 */
import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CV, FILM, FN, GRADES, STROKE } from '../motion-tokens';
import { DustField } from '../components/DustField';

const GRADE = GRADES['GR-08'];
export const SKY_GRADIENT = `linear-gradient(180deg, ${FILM.nightBlue} 0%, ${colors.muted} 22%, ${colors.accent} 42%, ${FILM.fireGold} 58%, ${colors.accent} 70%, ${colors.accent} 82%, ${colors.gold} 92%, ${colors.paperDeep} 100%)`;
const band = (y: number, amp: number, h: number) =>
  `M-80 ${y} Q 260 ${y - amp} 600 ${y} T 1360 ${y} T 2000 ${y} L 2000 ${y + h} L-80 ${y + h} Z`;
const crest = (y: number, amp: number) => `M-80 ${y} Q 260 ${y - amp} 600 ${y} T 1360 ${y} T 2000 ${y}`;

/** 云海与天际（S50/S51/S52 同一份）；points 为蓝块里那几粒金点。 */
export const DuskSky: FC<{ f: number; points?: boolean }> = ({ f, points = false }) => {
  const drift = FN.cloudSlow(f, 220) * 1920;
  const pointStep = CV.hardStep3(Math.max(0, Math.min(1, (f - 120) / 40)));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: SKY_GRADIENT }} />
      {/* 两片金之间的薄霭：第 6 行落在这里，避开上下的最亮处 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 700,
          height: 220,
          background: `linear-gradient(180deg, transparent 0%, ${colors.muted} 34%, ${colors.muted} 66%, transparent 100%)`,
          opacity: 0.18,
        }}
      />
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
        <g transform={`translate(${-drift * 0.4}, 0)`}>
          <path d={band(250, 40, 130)} fill={colors.paperMuted} opacity={0.14} />
          <path d={crest(250, 40)} fill="none" stroke={colors.gold} strokeWidth={STROKE.S1} opacity={0.12 + 0.1 * pointStep} />
        </g>
        <g transform={`translate(${-drift * 0.7}, 0)`}>
          <path d={band(420, 46, 170)} fill={colors.paperDeep} opacity={0.18} />
          <path d={band(420, 46, 170)} fill={FILM.fireGold} opacity={0.08} />
          <path d={crest(420, 46)} fill="none" stroke={colors.gold} strokeWidth={STROKE.S1} opacity={0.16 + 0.1 * pointStep} />
        </g>
        <g transform={`translate(${-drift}, 0)`}>
          <path d={band(640, 52, 200)} fill={colors.muted} opacity={0.14} />
          <path d={crest(640, 52)} fill="none" stroke={colors.gold} strokeWidth={STROKE.S1} opacity={0.2} />
        </g>
        <path d={band(880, 58, 220)} fill={colors.paperDeep} opacity={0.3} />
        {/* 一块稍暗的蓝：中央偏上 */}
        <ellipse cx={960} cy={330} rx={520} ry={210} fill={FILM.nightBlue} opacity={0.34} style={{ filter: 'blur(40px)' }} />
        {points
          ? Array.from({ length: 12 }).map((_, i) => (
              <circle
                key={i}
                cx={720 + random(`s50-gold-${i}`) * 560}
                cy={240 + random(`s50-gold-${i}-y`) * 180}
                r={1.5 + random(`s50-gold-${i}-r`) * 1.4}
                fill={colors.gold}
                opacity={pointStep}
              />
            ))
          : null}
      </svg>
    </AbsoluteFill>
  );
};

const S50: FC = () => {
  const frame = useCurrentFrame();
  const veil = GRADE.veil;
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <DuskSky f={frame} points />
      <DustField act={6} count={16} seedBase="s50" />
      <AbsoluteFill style={{ background: GRADE.base.color, mixBlendMode: GRADE.base.blend, opacity: GRADE.base.opacity, pointerEvents: 'none' }} />
      {veil ? <AbsoluteFill style={{ background: veil.gradient, mixBlendMode: veil.blend, opacity: veil.opacity, pointerEvents: 'none' }} /> : null}
    </AbsoluteFill>
  );
};

export default S50;
