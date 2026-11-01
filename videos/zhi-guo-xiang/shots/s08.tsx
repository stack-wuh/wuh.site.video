/* 镜 8 · 幕二 风陵渡 · local [0,180) · 180f
   客栈火塘边：一圈人的侧影深浅不一，讲的人换了一个又一个（只有剪影交接）；她坐在最外圈，
   不说话只听；火光只照亮她右眼一点反光（L3，local 60–160，≤2px FILM.fireGold，左眼在暗面）；
   全画面没有一张正脸。火塘低机位越过人群的肩；30f rack focus 从说话人移到她，再回火塘。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CV, FILM, FN, GRADES, STROKE } from '../motion-tokens';
import { DustField } from '../components/DustField';
import { Caption } from '../components/Caption';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const RING = [
  { x: 392, s: 0.84 },
  { x: 526, s: 0.92 },
  { x: 668, s: 0.98 },
  { x: 812, s: 0.9 },
  { x: 946, s: 0.82 },
];
const FLOOR = 806;

const S08: FC = () => {
  const frame = useCurrentFrame();
  const speaker = frame < 55 ? 1 : frame < 105 ? 2 : frame < 150 ? 3 : -1;
  const rest = frame < 150 ? 1 : 1 - CV.hardStep3(clamp01((frame - 150) / 6));
  const focusHer = CV.inOut(clamp01((frame - 30) / 30)) * (1 - CV.inOut(clamp01((frame - 160) / 20)));
  const glowBlur = 6 * (1 - CV.hardStep3(focusHer));
  const embers = frame >= 150 ? 0.38 : 1;
  const grade = GRADES['GR-02'];
  const fire = FN.flameStep(frame);

  return (
    <AbsoluteFill style={{ background: colors.bg, overflow: 'hidden' }}>
      <AbsoluteFill style={{ filter: `saturate(${grade.saturate})` }}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${FILM.nightBlue} 0%, ${colors.bg} 52%, ${colors.bgLift} 100%)` }} />
        {/* 火光：不用全屏 radial；低机位地面一片暖 */}
        <AbsoluteFill style={{ top: 560, height: 520, background: `linear-gradient(180deg, transparent, ${colors.accent})`, opacity: 0.2 * (0.8 + 0.2 * fire) }} />
        <AbsoluteFill style={{ left: 300, top: 620, width: 660, height: 420, background: `linear-gradient(160deg, ${colors.accent}, transparent 70%)`, opacity: 0.12 + 0.04 * fire, filter: `blur(${glowBlur}px)` }} />

        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
          {/* 里圈：一圈人的侧影，深浅不一 */}
          <g opacity={rest}>
            {RING.map((p, i) => {
              const breathe = FN.bodyIdle(frame + i * 17, 1.2) * p.s;
              const active = i === speaker;
              return (
                <g key={p.x} transform={`translate(${p.x} ${FLOOR + breathe + (active ? -5 : 0)}) scale(${p.s})`} opacity={0.55 + (i % 3) * 0.14}>
                  <circle cx={0} cy={-150} r={15} fill={colors.ink} />
                  <path d="M-38 -128 Q-44 -70 -40 0 L40 0 Q44 -70 38 -128 Q0 -146 -38 -128 Z" fill={colors.ink} />
                  <path d="M-30 -126 Q0 -142 30 -126" fill="none" stroke={FILM.fireGold} strokeWidth={STROKE.S1} opacity={0.22} />
                  {active ? (
                    <g transform={`rotate(${-24 + 5 * Math.sin(frame / 9)} -26 -116)`}>
                      <path d="M-26 -116 L-52 -168" stroke={colors.ink} strokeWidth={7} strokeLinecap="round" />
                    </g>
                  ) : null}
                </g>
              );
            })}
          </g>

          {/* 火塘：不红，只用火金 */}
          <ellipse cx={620} cy={FLOOR + 6} rx={150} ry={24} fill={colors.accent} opacity={0.18} />
          <path d={`M520 ${FLOOR} L720 ${FLOOR}`} stroke={colors.ink} strokeWidth={STROKE.S2} opacity={0.9} />
          {[0, 1, 2, 3, 4].map((i) => {
            const h = (46 + (i % 3) * 22) * (0.85 + 0.15 * fire) * embers;
            const x = 570 + i * 26;
            return (
              <g key={i} opacity={(0.62 + 0.2 * (i % 2)) * embers}>
                <path d={`M${x} ${FLOOR - 4} Q${x - 8} ${FLOOR - h * 0.5} ${x + 2} ${FLOOR - h} Q${x + 12} ${FLOOR - h * 0.5} ${x + 10} ${FLOOR - 4} Z`} fill={i % 2 ? colors.gold : FILM.fireGold} />
              </g>
            );
          })}
          {/* 余烬：火将熄也不灭 */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle key={`e-${i}`} cx={556 + i * 27} cy={FLOOR + 2 - (i % 2) * 3} r={1.6} fill={FILM.fireGold} opacity={0.45 + 0.35 * FN.flameStep(frame + i * 3)} />
          ))}

          {/* 她：外圈侧影，只给右眼一点反光（L3，60–160）；余烬里她始终留在画内 */}
          <g>
            <path d={`M1404 ${FLOOR - 248} Q1368 ${FLOOR - 246} 1372 ${FLOOR - 208} L1362 ${FLOOR - 196} L1374 ${FLOOR - 190} Q1378 ${FLOOR - 160} 1410 ${FLOOR - 154} Q1462 ${FLOOR - 150} 1468 ${FLOOR - 90} Q1472 ${FLOOR - 30} 1452 ${FLOOR} L1358 ${FLOOR} Q1348 ${FLOOR - 70} 1360 ${FLOOR - 140} Q1370 ${FLOOR - 180} 1378 ${FLOOR - 198} Q1380 ${FLOOR - 236} 1404 ${FLOOR - 248} Z`} fill={colors.ink} />
            <path d={`M1368 ${FLOOR - 204} Q1372 ${FLOOR - 172} 1396 ${FLOOR - 160}`} fill="none" stroke={FILM.fireGold} strokeWidth={STROKE.S1} opacity={0.5} />
            <path d={`M1362 ${FLOOR - 148} Q1394 ${FLOOR - 166} 1428 ${FLOOR - 150}`} fill="none" stroke={FILM.fireGold} strokeWidth={STROKE.S1} opacity={0.32} />
            <circle cx={1376} cy={FLOOR - 206} r={1} fill={FILM.fireGold} opacity={FN.eyeGlint(frame, 60, 160)} />
          </g>

          {/* 近处越过人群的肩：前景两团背影，压住画框 */}
          <g opacity={rest}>
            <path d={`M-40 1080 L-40 ${FLOOR + 30} Q120 ${FLOOR - 40} 300 ${FLOOR + 40} Q420 ${FLOOR + 110} 430 1080 Z`} fill={colors.ink} />
            <path d={`M1960 1080 L1960 ${FLOOR + 10} Q1810 ${FLOOR - 50} 1650 ${FLOOR + 60} Q1540 ${FLOOR + 140} 1520 1080 Z`} fill={colors.ink} />
            <circle cx={212} cy={FLOOR + 84} r={64} fill={colors.ink} />
            <circle cx={1760} cy={FLOOR + 96} r={58} fill={colors.ink} />
          </g>
        </svg>

        <DustField act={2} count={12} seedBase="s08" />
      </AbsoluteFill>

      <AbsoluteFill style={{ background: grade.base.color, mixBlendMode: grade.base.blend, opacity: grade.base.opacity }} />
      {grade.veil ? <AbsoluteFill style={{ background: grade.veil.gradient, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} /> : null}
      <Caption text="说的人很多，见过的人很少。" start={20} end={180} />
    </AbsoluteFill>
  );
};

export default S08;
