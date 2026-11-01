/* 镜 46 · Act 6 像极了 · 局部帧 [0,150) · 150f
   云海铺满画幅：暖金与胭脂一层层叠；150f 内云的位移不超过画幅 3%（FN-22），比前面任何一段都慢。
   固定长焦（CM-01 恒参）；PT-03 极稀光尘；GR-08；无字幕。
   尾帧：云海中央透出一点更亮的光（TR-01 → S47）。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CM, CV, FILM, FN, GRADES, STROKE } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';

const GRADE = GRADES['GR-08'];
const band = (y: number, amp: number, h: number) =>
  `M-80 ${y} Q 140 ${y - amp} 360 ${y} T 760 ${y} T 1160 ${y} L 1160 ${y + h} L-80 ${y + h} Z`;
const crest = (y: number, amp: number) => `M-80 ${y} Q 140 ${y - amp} 360 ${y} T 760 ${y} T 1160 ${y}`;

const S46: FC = () => {
  const frame = useCurrentFrame();
  const drift = FN.cloudSlow(frame, 150) * 1920;
  const glow = CV.hardStep3(Math.max(0, Math.min(1, (frame - 110) / 40)));
  const veil = GRADE.veil;
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={{ ...CM.hold(), scale: 1.06 }}>
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, ${FILM.nightBlue} 0%, ${colors.muted} 28%, ${colors.accent} 60%, ${FILM.fireGold} 80%, ${colors.gold} 94%, ${colors.paperDeep} 100%)`,
          }}
        />
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
          <g transform={`translate(${-drift * 0.35}, 0)`}>
            <path d={band(170, 30, 110)} fill={colors.paperMuted} opacity={0.14} />
            <path d={crest(170, 30)} fill="none" stroke={colors.gold} strokeWidth={STROKE.S1} opacity={0.12} />
          </g>
          <g transform={`translate(${-drift * 0.55}, 0)`}>
            <path d={band(292, 38, 130)} fill={colors.paperDeep} opacity={0.2} />
            <path d={band(292, 38, 130)} fill={FILM.fireGold} opacity={0.08} />
            <path d={crest(292, 38)} fill="none" stroke={colors.gold} strokeWidth={STROKE.S1} opacity={0.16} />
          </g>
          <g transform={`translate(${-drift * 0.8}, 0)`}>
            <path d={band(432, 44, 170)} fill={colors.paper} opacity={0.26} />
            <path d={crest(432, 44)} fill="none" stroke={colors.gold} strokeWidth={STROKE.S1} opacity={0.2} />
          </g>
          <g transform={`translate(${-drift}, 0)`}>
            <path d={band(598, 48, 210)} fill={colors.paperMuted} opacity={0.3} />
            <path d={crest(598, 48)} fill="none" stroke={colors.gold} strokeWidth={STROKE.S1} opacity={0.22} />
          </g>
          <g transform={`translate(${-drift}, 0)`}>
            <path d={band(790, 52, 320)} fill={colors.paperDeep} opacity={0.4} />
          </g>
          {/* 云海中央一点更亮的光：三档硬切 */}
          <ellipse cx={980} cy={520} rx={330} ry={150} fill={colors.paper} opacity={0.2 * glow} style={{ filter: 'blur(46px)' }} />
          <ellipse cx={980} cy={520} rx={210} ry={96} fill={colors.paper} opacity={0.26 * glow} style={{ filter: 'blur(46px)' }} />
          <ellipse cx={980} cy={520} rx={110} ry={52} fill={colors.gold} opacity={0.3 * glow} style={{ filter: 'blur(46px)' }} />
        </svg>
        <DustField act={6} count={18} seedBase="s46" />
      </CameraRig>
      <AbsoluteFill style={{ background: GRADE.base.color, mixBlendMode: GRADE.base.blend, opacity: GRADE.base.opacity, pointerEvents: 'none' }} />
      {veil ? <AbsoluteFill style={{ background: veil.gradient, mixBlendMode: veil.blend, opacity: veil.opacity, pointerEvents: 'none' }} /> : null}
    </AbsoluteFill>
  );
};

export default S46;
