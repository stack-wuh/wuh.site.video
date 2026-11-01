import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CameraRig } from '../components/CameraRig';
import { CV, FILM, FN, GRADES, STROKE } from '../motion-tokens';
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

const TORCHES = [260, 470, 690, 910, 1140, 1360, 1590, 1810];

/** S20 余烬与城头调动（2430–2560）：从天空极缓下摇到城头；远处火把在动、人马在调；尾帧灰落在她肩上。 */
const S20: FC = () => {
  const f = useCurrentFrame();
  const cam = { scale: 1, x: 0, y: -46 * CV.plateau(Math.min(1, f / 130)), rot: 0 };
  const pull = CV.inOut(Math.min(1, Math.max(0, (f - 50) / 40)));
  const ashBlur = 2.4 * pull;
  const torchBlur = 2.4 * (1 - pull);
  const shoulder = CV.hardStep3(Math.min(1, Math.max(0, (f - 100) / 12)));
  return (
    <AbsoluteFill>
      <CameraRig cam={cam}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.bg} 0%, ${colors.bgLift} 46%, ${colors.bg} 100%)` }} />
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
          {/* 近处屋檐垂着烟 */}
          <path d="M0 0 L1920 0 L1920 150 L1560 158 L1300 214 L420 206 L180 162 L0 170 Z" fill={colors.ink} />
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M${260 + i * 90} ${212 + i * 8} Q960 ${190 + i * 14} ${1660 - i * 70} ${216 + i * 6}`}
              fill="none"
              stroke={colors.muted}
              strokeWidth={STROKE.S0}
              opacity={0.18 - i * 0.04}
            />
          ))}
        </svg>
        {/* 火金的余烬与灰：30–50 颗，慢落 + 横摆 */}
        {Array.from({ length: 42 }).map((_, i) => {
          const s = `s20-ash-${i}`;
          const x = random(`${s}-x`) * 1920;
          const y = ((random(`${s}-y`) * 1080 + f * (0.4 + random(`${s}-v`) * 0.4)) % 1080) - 20;
          const warm = i % 4 === 0;
          return (
            <div
              key={s}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 1 + random(`${s}-w`) * 1.6,
                height: 1 + random(`${s}-h`) * 1.4,
                borderRadius: '50%',
                background: warm ? FILM.fireGold : colors.paperMuted,
                opacity: (warm ? 0.4 : 0.22) + random(`${s}-o`) * 0.2,
                filter: `blur(${ashBlur}px)`,
                transform: `translate(${x + Math.sin((f + i * 17) / 40) * 3}px, ${y}px)`,
              }}
            />
          );
        })}
        {/* 城头：火把在动，人马在调，只是光点与影 */}
        <div style={{ position: 'absolute', inset: 0, filter: `blur(${torchBlur}px)` }}>
          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
            <rect x={0} y={660} width={1920} height={220} fill={colors.ink} />
            {Array.from({ length: 12 }).map((_, i) => (
              <rect key={i} x={i * 160} y={626} width={98} height={36} fill={colors.ink} />
            ))}
            {TORCHES.map((x, i) => {
              const move = Math.sin((f / 46) * Math.PI * 2 + i * 1.3) * 14;
              const flame = FN.flameStep(f + i * 3);
              return (
                <g key={x} transform={`translate(${move} 0)`}>
                  <rect x={x} y={584} width={1.2} height={44} fill={colors.muted} opacity={0.5} />
                  <circle cx={x} cy={580} r={3} fill={colors.accent} opacity={0.55 * flame} />
                  <circle cx={x} cy={580} r={1.6} fill={colors.gold} opacity={0.8 * flame} />
                </g>
              );
            })}
            {/* 人马调动：只是影 */}
            {[0, 1, 2].map((i) => {
              const x = 300 + i * 560 + Math.sin(f / 60 + i) * 30 + f * (i % 2 === 0 ? 0.5 : -0.35);
              return (
                <g key={i} transform={`translate(${x} ${652 - i * 4})`} opacity={0.9}>
                  <ellipse cx={0} cy={0} rx={44} ry={15} fill={colors.ink} />
                  <circle cx={30} cy={-16} r={6} fill={colors.ink} />
                  {[-26, -8, 10, 26].map((lx) => (
                    <path key={lx} d={`M${lx} 8 L${lx + Math.sin(f / 8 + lx) * 4} 34`} stroke={colors.ink} strokeWidth={5} strokeLinecap="round" />
                  ))}
                </g>
              );
            })}
          </svg>
        </div>
        {/* 她的肩：只入画一角，灰落上去 */}
        <div style={{ position: 'absolute', left: -80, bottom: -140, width: 620, height: 520, opacity: shoulder }}>
          <svg viewBox="0 0 620 520" style={{ width: '100%', height: '100%' }}>
            <path d="M0 260 Q220 190 420 268 L620 520 L0 520 Z" fill={colors.ink} />
            <path d="M40 276 Q226 206 402 272" fill="none" stroke={FILM.snowCyan} strokeWidth={STROKE.S1} opacity={0.5} />
            <circle cx={318} cy={238} r={2.4} fill={colors.paperMuted} opacity={f >= 122 ? 0.75 : 0} />
          </svg>
        </div>
      </CameraRig>
      <Grade id="GR-02" />
    </AbsoluteFill>
  );
};

export default S20;
