import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CameraRig } from '../components/CameraRig';
import { CM, CV, FILM, FN, GRADES, RH } from '../motion-tokens';
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

const Firework: FC<{ x: number; y: number; t0: number; seed: string; scale?: number; hold?: number }> = ({
  x,
  y,
  t0,
  seed,
  scale = 6,
  hold = 1,
}) => {
  const f = useCurrentFrame();
  const age = f - t0;
  if (age < 0) return null;
  const open = CV.hardStep3(Math.min(1, age / 18));
  const shards = FN.fireworkBloom(age <= 18 ? age : 18 + (age - 18) * hold, seed, 30);
  const pts = Array.from({ length: 16 })
    .map((_, i) => {
      const a = (i / 16) * Math.PI * 2;
      const r = (26 + random(`${seed}-p${i}`) * 46) * (0.35 + open * 1.35) * (scale / 6);
      return `${x + Math.cos(a) * r},${y + Math.sin(a) * r * 0.86}`;
    })
    .join(' ');
  return (
    <g>
      <polygon points={pts} fill={FILM.fireGold} opacity={0.14 * open} />
      {shards.map((p, i) => (
        <circle
          key={i}
          cx={x + p.x * scale + (random(`${seed}-x${i}`) - 0.5) * 12}
          cy={y + p.y * scale * 1.2 + (random(`${seed}-y${i}`) - 0.5) * 12}
          r={p.r}
          fill={p.o > 0.55 ? FILM.fireGold : colors.muted}
          opacity={0.35 + p.o * 0.65}
        />
      ))}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const r = 40 * open * (scale / 6);
        return <line key={`r${i}`} x1={x} y1={y} x2={x + Math.cos(a) * r} y2={y + Math.sin(a) * r} stroke={FILM.fireGold} strokeWidth={1.2} opacity={0.4 * open} />;
      })}
    </g>
  );
};

/** S16 第一朵烟花（1980–2100）：固定大全景；右上炸开，10f 后光反打在纸纹上；不推。 */
const S16: FC = () => {
  const f = useCurrentFrame();
  const reflect = CV.hardStep3(Math.min(1, Math.max(0, (f - RH.half) / 8)));
  const tear = Array.from({ length: 18 })
    .map((_, i) => {
      const a = (i / 18) * Math.PI * 2;
      const r = (120 + random(`s16-tear-${i}`) * 220) * CV.hardStep3(Math.min(1, f / 10));
      return `${1460 + Math.cos(a) * r},${296 + Math.sin(a) * r * 0.78}`;
    })
    .join(' ');
  return (
    <AbsoluteFill>
      <CameraRig cam={CM.hold()}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${FILM.nightBlue} 0%, ${colors.bg} 74%)` }} />
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
          <path d="M0 520 Q420 494 900 512 T1920 500" fill="none" stroke={colors.muted} strokeWidth={0.8} opacity={0.14} />
          <path d="M0 596 Q500 574 1020 590 T1920 582" fill="none" stroke={colors.muted} strokeWidth={0.8} opacity={0.1} />
          <Firework x={1460} y={296} t0={0} seed="s16-a" scale={10} hold={0.32} />
          <polygon points={tear} fill={FILM.fireGold} opacity={0.1 * reflect} />
          <Firework x={420} y={386} t0={98} seed="s16-b" scale={4.6} />
          {/* 城垛与屋檐的剪影 */}
          <rect x={0} y={872} width={1920} height={208} fill={colors.ink} />
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x={i * 160} y={836} width={98} height={40} fill={colors.ink} />
          ))}
          <path d="M0 812 L380 812 L440 862 L0 878 Z" fill={colors.ink} />
          <path d="M1920 790 L1600 800 L1548 860 L1920 872 Z" fill={colors.ink} />
        </svg>
        {/* 烟花的光反打在纸纹上：三档硬切，不连续渐变 */}
        <AbsoluteFill
          style={{
            background: `linear-gradient(215deg, ${FILM.fireGold} 0%, ${colors.bg} 58%)`,
            mixBlendMode: 'screen',
            opacity: 0.1 * reflect,
          }}
        />
      </CameraRig>
      <Grade id="GR-02" />
      <Grade id="GR-05" />
    </AbsoluteFill>
  );
};

export default S16;
