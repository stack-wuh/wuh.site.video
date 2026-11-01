import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { Caption } from '../components/Caption';
import { CameraRig } from '../components/CameraRig';
import { XiangFigure } from '../components/Figure';
import { CM, CV, FILM, GRADES, STROKE } from '../motion-tokens';
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

const MOVERS = Array.from({ length: 12 }).map((_, i) => ({
  x0: 1950 + random(`s21-m${i}-x`) * 260,
  speed: 22 + random(`s21-m${i}-s`) * 8,
  delay: random(`s21-m${i}-d`) * 16,
  bottom: 40 + random(`s21-m${i}-y`) * 190,
  h: 280 + random(`s21-m${i}-h`) * 180,
  w: 108 + random(`s21-m${i}-w`) * 66,
  turn: random(`s21-m${i}-t`) > 0.5 ? 6 : -6,
}));

/** S21 人群散尽（2560–2700）：人群自右向左流出画，没有一个人回头；她只给侧脸一条线（L2）。 */
const S21: FC = () => {
  const f = useCurrentFrame();
  const rim = 1 - CV.hardStep3(Math.min(1, Math.max(0, (f - 110) / 30)));
  return (
    <AbsoluteFill>
      <CameraRig cam={CM.hold()}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.bgLift} 0%, ${colors.bg} 76%)` }} />
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
          {/* 远处的灯一盏盏暗下去 */}
          {[720, 940, 1180, 1420, 1660].map((x, i) => (
            <g key={x} opacity={0.5 - i * 0.07}>
              <rect x={x} y={356} width={1.2} height={20} fill={colors.muted} opacity={0.4} />
              <circle cx={x} cy={380} r={2.2} fill={colors.accent} opacity={0.5} />
            </g>
          ))}
        </svg>
        {/* 她仍站在原处：侧后、暗里，只余一点光 */}
        <div style={{ position: 'absolute', left: 520, bottom: 120, width: 150, height: 400, transform: 'rotate(-2deg)', transformOrigin: 'bottom center' }}>
          <XiangFigure age="16" pose="stand" style={{ width: '100%', height: '100%' }} />
          <svg viewBox="0 0 120 320" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            {/* L2：侧脸一条线（额—鼻—唇—颌），无眼无嘴 */}
            <path d="M60 24 Q72 28 76 40 L80 44 L74 48 Q74 52 70 56 L63 60" fill="none" stroke={colors.paperMuted} strokeWidth={STROKE.S1} opacity={0.55} />
            <path d="M60 24 Q72 28 76 40 L80 44 L74 48 Q74 52 70 56 L63 60" fill="none" stroke={FILM.fireGold} strokeWidth={STROKE.S1} opacity={0.5 * rim} />
          </svg>
        </div>
        {/* 人群一边散一边还在说前线的事：肩与背影从画面前流过，无人回头 */}
        {MOVERS.map((m, i) => {
          const x = m.x0 - m.speed * Math.max(0, f - m.delay);
          if (x < -260 || x > 2180) return null;
          return (
            <div key={i} style={{ position: 'absolute', left: 0, bottom: m.bottom, width: m.w, height: m.h, opacity: 0.94, transform: `translateX(${x}px)` }}>
              <svg viewBox="0 0 100 160" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                <g transform={`rotate(${m.turn} 50 60)`}>
                  <circle cx={50} cy={24} r={20} fill={colors.ink} />
                  <circle cx={38} cy={11} r={5.6} fill={colors.ink} />
                </g>
                <path d="M16 54 Q50 38 84 54 L98 160 L2 160 Z" fill={colors.ink} />
              </svg>
            </div>
          );
        })}
        {/* 一地烟灰 */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 120, background: `linear-gradient(180deg, ${colors.bg} 0%, ${colors.bgLift} 100%)`, opacity: 0.7 }} />
        {Array.from({ length: 30 }).map((_, i) => {
          const s = `s21-ash-${i}`;
          return (
            <div
              key={s}
              style={{
                position: 'absolute',
                left: random(`${s}-x`) * 1920,
                bottom: random(`${s}-y`) * 96,
                width: 1 + random(`${s}-w`) * 2,
                height: 1,
                borderRadius: '50%',
                background: colors.paperMuted,
                opacity: 0.18 + random(`${s}-o`) * 0.2,
              }}
            />
          );
        })}
      </CameraRig>
      <Grade id="GR-02" />
      <Caption text="满城烟火，本是军情。" start={0} end={120} />
    </AbsoluteFill>
  );
};

export default S21;
