import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { CV, FILM, FN, GRADES, RH } from '../motion-tokens';
import type { GradeId } from '../motion-tokens';

const Grade: FC<{ id: GradeId }> = ({ id }) => {
  const g = GRADES[id];
  return (
    <>
      <AbsoluteFill style={{ background: g.base.color, mixBlendMode: g.base.blend, opacity: g.base.opacity }} />
      {g.veil ? <AbsoluteFill style={{ background: g.veil.gradient, mixBlendMode: g.veil.blend, opacity: g.veil.opacity }} /> : null}
    </>
  );
};

const Firework: FC<{ x: number; y: number; t0: number; seed: string; scale?: number }> = ({ x, y, t0, seed, scale = 6 }) => {
  const f = useCurrentFrame();
  const age = f - t0;
  if (age < 0) return null;
  const open = CV.hardStep3(Math.min(1, age / 18));
  const shards = FN.fireworkBloom(age, seed, 28);
  return (
    <g>
      {shards.map((p, i) => (
        <circle
          key={i}
          cx={x + p.x * scale + (random(`${seed}-x${i}`) - 0.5) * 10}
          cy={y + p.y * scale * 1.15}
          r={p.r}
          fill={p.o > 0.55 ? FILM.fireGold : colors.muted}
          opacity={(0.3 + p.o * 0.7) * open}
        />
      ))}
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <line key={`r${i}`} x1={x} y1={y} x2={x + Math.cos(a) * 34 * open} y2={y + Math.sin(a) * 30 * open} stroke={FILM.fireGold} strokeWidth={1.2} opacity={0.35 * open} />;
      })}
    </g>
  );
};

const HEADS = Array.from({ length: 13 }).map((_, i) => ({
  x: -40 + i * 156 + random(`s17-h${i}-x`) * 44,
  bottom: 40 + random(`s17-h${i}-y`) * 130,
  h: 230 + random(`s17-h${i}-h`) * 110,
  w: 104 + random(`s17-h${i}-w`) * 44,
  tilt: 14 + random(`s17-h${i}-t`) * 8,
}));

/** S17 满城抬头（2100–2220）：低机位横移 6% + 上仰 3%，扫过一片仰起的头；焦点在远端。 */
const S17: FC = () => {
  const f = useCurrentFrame();
  const t = Math.min(1, f / 120);
  const cam = { scale: 1, x: -115 * CV.plateau(t), y: 32 * CV.plateau(t), rot: 0.12 * Math.sin(f / 70) };
  return (
    <AbsoluteFill>
      <CameraRig cam={cam}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${FILM.nightBlue} 0%, ${colors.bg} 78%)` }} />
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
          <Firework x={1520} y={236} t0={0} seed="s17-a" />
          <Firework x={720} y={330} t0={50} seed="s17-b" scale={5} />
          <Firework x={1160} y={420} t0={94} seed="s17-c" scale={3.4} />
          {/* 屋顶与窗：窗一扇扇推开 */}
          <path d="M0 806 L300 790 L620 802 L960 784 L1280 800 L1600 782 L1920 796 L1920 1080 L0 1080 Z" fill={colors.ink} />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <g key={i} transform={`translate(${360 + i * 196} ${824 - (i % 2) * 16}) scale(${f >= 22 + i * RH.half ? 1 : 0.05} 1)`}>
              <rect width={30} height={42} fill={colors.accent} opacity={0.5} />
            </g>
          ))}
          {/* 仰起的人群剪影：她只是千万个抬头的人之一 */}
          {HEADS.map((h, i) => (
            <g key={i} transform={`translate(${h.x} ${1080 - h.bottom - h.h}) scale(${h.w / 100} ${h.h / 160})`}>
              <g transform={`rotate(${-h.tilt} 50 62)`}>
                <circle cx={50} cy={34} r={20} fill={colors.ink} />
                <circle cx={38} cy={20} r={6} fill={colors.ink} />
              </g>
              <path d="M14 68 Q50 50 86 68 L100 160 L0 160 Z" fill={colors.ink} />
            </g>
          ))}
          {/* 孩子坐在肩上 */}
          <g transform="translate(1300 812)">
            <g transform="rotate(-14 30 48)">
              <circle cx={30} cy={24} r={13} fill={colors.ink} />
              <path d="M10 40 Q30 30 50 40 L56 84 L4 84 Z" fill={colors.ink} />
            </g>
            <path d="M-12 86 Q30 52 72 86 L84 196 L-24 196 Z" fill={colors.ink} />
          </g>
          {/* 灯笼的光被烟花盖过 */}
          {[220, 480, 880, 1240, 1620, 1840].map((x) => (
            <g key={x}>
              <rect x={x} y={740} width={1.2} height={18} fill={colors.muted} opacity={0.4} />
              <circle cx={x} cy={762} r={2.2} fill={colors.accent} opacity={0.55} />
            </g>
          ))}
          {/* 金屑开始落 */}
          {Array.from({ length: 18 }).map((_, i) => {
            const s = `s17-gold-${i}`;
            const x = random(`${s}-x`) * 1920;
            const y = ((random(`${s}-y`) * 1080 + f * (1.2 + random(`${s}-v`) * 1.2)) % 1080) - 20;
            return <circle key={s} cx={x + Math.sin((f + i * 17) / 30) * 6} cy={y} r={1.5 + random(`${s}-r`) * 1.6} fill={FILM.fireGold} opacity={0.35 + random(`${s}-o`) * 0.4} />;
          })}
        </svg>
      </CameraRig>
      <DustField act={3} />
      <Grade id="GR-05" />
    </AbsoluteFill>
  );
};

export default S17;
