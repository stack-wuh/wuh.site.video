import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CameraRig } from '../components/CameraRig';
import { CM, CV, FILM, FN, GRADES, RH, STROKE } from '../motion-tokens';
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

/** S18 她的眼（2220–2340，L3）：长焦只切一只眼与颧骨一角，脸的中轴不入画；反光 ≤2px。 */
const S18: FC = () => {
  const f = useCurrentFrame();
  const focus = CV.inOut(Math.min(1, f / 30));
  const glint = FN.eyeGlint(f, 0, 99);
  const recede = CV.hardStep3(Math.min(1, Math.max(0, (f - 100) / RH.beat)));
  const flicker = glint * (0.75 + 0.25 * Math.round(Math.sin(f / 6) * 2) / 2);
  const cam = { ...CM.macro(f, 120, 1.06, 1.12), origin: '1740px 520px' };
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${FILM.nightBlue} 0%, ${colors.bg} 70%)` }} />
        {/* 烟花从上方落下的余照：三档硬切退光 */}
        <AbsoluteFill
          style={{
            background: `linear-gradient(200deg, ${FILM.fireGold} 0%, ${colors.bg} 46%)`,
            mixBlendMode: 'screen',
            opacity: 0.1 * (1 - recede),
          }}
        />
        {/* 前景人肩与后脑：镜头层景深，只给虚化的影 */}
        <div style={{ position: 'absolute', inset: 0, filter: `blur(${8 - 4 * focus}px)` }}>
          <div style={{ position: 'absolute', left: -160, bottom: -260, width: 720, height: 780, borderRadius: '50% 50% 0 0', background: colors.ink }} />
          <div style={{ position: 'absolute', left: 560, bottom: -320, width: 820, height: 860, borderRadius: '50% 50% 0 0', background: colors.ink }} />
          <div style={{ position: 'absolute', right: -220, bottom: -300, width: 760, height: 820, borderRadius: '50% 50% 0 0', background: colors.ink }} />
        </div>
        {/* 她：只切一只眼与颧骨一角，中轴在画外 */}
        <div style={{ position: 'absolute', right: -150, top: 120, width: 620, height: 760 }}>
          <svg viewBox="0 0 620 760" style={{ width: '100%', height: '100%' }}>
            <circle cx={560} cy={330} r={300} fill={colors.ink} />
            {/* 夜里只给边缘一线光：≤1.2px */}
            <path d="M340 92 Q262 220 272 348 Q282 470 366 566" fill="none" stroke={FILM.fireGold} strokeWidth={STROKE.S1} opacity={0.16 * (1 - recede)} />
            <circle cx={430} cy={60} r={78} fill={colors.ink} />
            <path d="M290 620 Q420 520 560 600 L640 760 L290 760 Z" fill={colors.ink} />
            {/* 颧骨一角与眼睑一线：结构线不超过 2 条 */}
            <path d="M320 452 Q406 512 508 486" fill="none" stroke={colors.paperMuted} strokeWidth={STROKE.S1} opacity={0.2} />
            <path d="M370 308 Q412 290 456 306" fill="none" stroke={colors.paperMuted} strokeWidth={STROKE.S1} opacity={0.24} />
            {/* 眼里一点正在开的金：≤2px，无眼白、无瞳孔、无目光 */}
            <circle cx={412} cy={302} r={1} fill={FILM.fireGold} opacity={flicker} />
          </svg>
        </div>
        {/* 金屑从她与镜头之间落过 */}
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
          {Array.from({ length: 7 }).map((_, i) => {
            const s = `s18-gold-${i}`;
            const x = 240 + random(`${s}-x`) * 1500;
            const y = 80 + ((random(`${s}-y`) * 900 + f * (1.4 + random(`${s}-v`))) % 900);
            return <circle key={s} cx={x + Math.sin((f + i * 19) / 26) * 8} cy={y} r={1.4 + random(`${s}-r`) * 1.2} fill={FILM.fireGold} opacity={0.24 + random(`${s}-o`) * 0.3} />;
          })}
        </svg>
      </CameraRig>
      <Grade id="GR-02" />
    </AbsoluteFill>
  );
};

export default S18;
