/* 镜 51 · Act 6 像极了 · 局部帧 [0,160) · 160f
   十六岁那夜的烟花从云层里浮出来，与晚霞叠在同一帧上；两层暖金贴合、不分彼此。
   人群、城头、仰望都退掉了，只剩两片金。TR-12：前 30f 两片金 opacity 交叉；
   烟花极慢绽开（FN-19 slow 档）；前景云压过下半，两层边缘互相渗透；CM-01 完全固定；GR-05。
   尾帧：叠印稳定（TR-01 → S52）。
   导出 GoldSuperimpose 供 S52 冻结在同一帧。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CV, FILM, FN, GRADES, STROKE, TR } from '../motion-tokens';
import { DuskSky } from './s50';

const GRADE = GRADES['GR-05'];
export const GOLD_TAIL = 159;
const band = (y: number, amp: number, h: number) =>
  `M-80 ${y} Q 300 ${y - amp} 700 ${y} T 1600 ${y} T 2000 ${y} L 2000 ${y + h} L-80 ${y + h} Z`;
const crest = (y: number, amp: number) => `M-80 ${y} Q 300 ${y - amp} 700 ${y} T 1600 ${y} T 2000 ${y}`;

/** 叠印层：云霞 + 烟花。f 为 S51 的镜内帧；S52 传 GOLD_TAIL 即冻结。 */
export const GoldSuperimpose: FC<{ f: number }> = ({ f }) => {
  const slow = f * 0.12;
  const cross = CV.inOut(Math.min(1, f / TR.goldSuperimpose));
  const bloom = CV.out(Math.min(1, f / 90));
  const shards = FN.fireworkBloom(slow, 's51-gold', 36);
  const veil = GRADE.veil;
  return (
    <AbsoluteFill>
      <DuskSky f={GOLD_TAIL + f} points />
      {/* 第一片金：十六岁的烟花，极慢绽开 */}
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none" opacity={cross}>
        {[0, 1].map((i) => (
          <circle
            key={i}
            cx={980}
            cy={380}
            r={(84 + i * 76) * (0.35 + 0.65 * bloom)}
            fill="none"
            stroke={colors.gold}
            strokeWidth={STROKE.S1}
            opacity={0.16 - i * 0.06}
          />
        ))}
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i / 16) * Math.PI * 2;
          const r1 = 124 * bloom;
          return (
            <line
              key={i}
              x1={980 + Math.cos(a) * 28}
              y1={380 + Math.sin(a) * 28}
              x2={980 + Math.cos(a) * r1}
              y2={380 + Math.sin(a) * r1}
              stroke={colors.gold}
              strokeWidth={STROKE.S0}
              opacity={0.18}
            />
          );
        })}
        {shards.map((s, i) => (
          <circle key={i} cx={980 + s.x * 7} cy={380 + s.y * 7} r={s.r * 1.6} fill={colors.gold} opacity={s.o * 0.85} />
        ))}
        <circle cx={980} cy={380} r={26} fill={FILM.fireGold} opacity={0.5} />
        <circle cx={980} cy={380} r={12} fill={colors.paper} opacity={0.55} />
      </svg>
      {/* 前景云：压过下半，让两层边缘互相渗透 */}
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
        <g transform={`translate(${-FN.cloudSlow(GOLD_TAIL + f, 220) * 1920 * 0.6}, 0)`}>
          <path d={band(470, 44, 300)} fill={colors.paperMuted} opacity={0.24} />
          <path d={crest(470, 44)} fill="none" stroke={colors.gold} strokeWidth={STROKE.S1} opacity={0.3} />
        </g>
      </svg>
      <AbsoluteFill style={{ background: GRADE.base.color, mixBlendMode: GRADE.base.blend, opacity: GRADE.base.opacity, pointerEvents: 'none' }} />
      {veil ? <AbsoluteFill style={{ background: veil.gradient, mixBlendMode: veil.blend, opacity: veil.opacity, pointerEvents: 'none' }} /> : null}
    </AbsoluteFill>
  );
};

const S51: FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <GoldSuperimpose f={frame} />
    </AbsoluteFill>
  );
};

export default S51;
