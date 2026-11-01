import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CameraRig } from '../components/CameraRig';
import { CM, CV, FILM, FN, GRADES } from '../motion-tokens';
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
          cx={x + p.x * scale + (random(`${seed}-x${i}`) - 0.5) * 12}
          cy={y + p.y * scale * 1.1}
          r={p.r}
          fill={p.o > 0.7 ? FILM.fireGold : colors.muted}
          opacity={(0.3 + p.o * 0.7) * open}
        />
      ))}
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <line key={`r${i}`} x1={x} y1={y} x2={x + Math.cos(a) * 38 * open} y2={y + Math.sin(a) * 34 * open} stroke={FILM.fireGold} strokeWidth={1.2} opacity={0.32 * open} />;
      })}
    </g>
  );
};

/** S19 更多烟花（2340–2430）：固定仰角全景；逐朵开在不同位置，末 20f 光开始退。 */
const S19: FC = () => {
  const f = useCurrentFrame();
  const fade = CV.hardStep3(Math.min(1, Math.max(0, (f - 70) / 20)));
  const dim = 1 - 0.55 * fade;
  const rim = 0.3 * (1 - CV.hardStep3(Math.min(1, Math.max(0, (f - 66) / 24))));
  return (
    <AbsoluteFill>
      <CameraRig cam={CM.hold()}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${FILM.nightBlue} 0%, ${colors.bg} 80%)` }} />
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
          <g opacity={dim}>
            <Firework x={520} y={300} t0={0} seed="s19-a" scale={9} />
            <Firework x={1280} y={212} t0={16} seed="s19-b" scale={10} />
            <Firework x={980} y={430} t0={46} seed="s19-c" scale={8} />
          </g>
          {/* 城头剪影被反复照亮 */}
          <rect x={0} y={884} width={1920} height={196} fill={colors.ink} />
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x={i * 160} y={850} width={98} height={38} fill={colors.ink} />
          ))}
          <path d="M0 850 H1920" stroke={FILM.fireGold} strokeWidth={1.2} opacity={rim} />
          <path d="M0 826 L340 826 L400 870 L0 884 Z" fill={colors.ink} />
          <path d="M1920 806 L1588 816 L1536 872 L1920 886 Z" fill={colors.ink} />
        </svg>
        {/* 光开始退：三档硬切 */}
        <AbsoluteFill
          style={{
            background: `linear-gradient(200deg, ${FILM.fireGold} 0%, ${colors.bg} 56%)`,
            mixBlendMode: 'screen',
            opacity: 0.09 * (1 - fade),
          }}
        />
      </CameraRig>
      <Grade id="GR-05" />
    </AbsoluteFill>
  );
};

export default S19;
