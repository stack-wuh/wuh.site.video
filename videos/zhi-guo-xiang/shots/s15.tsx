import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { CM, CV, FN, GRADES, RH } from '../motion-tokens';
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

const LAMPS = [180, 420, 700, 980, 1260, 1540, 1800];
const HEADS = Array.from({ length: 12 }).map((_, i) => ({
  x: 20 + i * 158 + random(`s15-h${i}-x`) * 48,
  base: 690 + random(`s15-h${i}-y`) * 150,
  h: 300 + random(`s15-h${i}-h`) * 110,
  w: 128 + random(`s15-h${i}-w`) * 52,
  tilt: 12 + random(`s15-h${i}-t`) * 10,
  ph: random(`s15-h${i}-p`) * Math.PI * 2,
  tiptoe: i === 4 || i === 8,
}));

/** S15 所有视线朝天（1860–1980）：极缓上摇 3% 带一点手持感；焦点始终在纸，人全虚。 */
const S15: FC = () => {
  const f = useCurrentFrame();
  const lift = CV.plateau(Math.min(1, f / 120));
  const cam = { ...CM.hold(), y: 34 * lift, rot: 0.08 * Math.sin(f / 60) };
  return (
    <AbsoluteFill>
      <CameraRig cam={cam}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.bg} 0%, ${colors.bgLift} 38%, ${colors.bg} 100%)` }} />
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
          {LAMPS.map((x, i) => (
            <g key={x} opacity={f >= 36 + i * RH.half ? 1 : 0}>
              <rect x={x} y={120} width={1.2} height={26} fill={colors.muted} opacity={0.45} />
              <circle cx={x} cy={156} r={2.4} fill={colors.gold} opacity={f >= 36 + i * RH.half ? FN.flameStep(f + i * 3) : 0} />
            </g>
          ))}
        </svg>
        {/* 所有脸都朝天、朝纸、朝城门：没有一张转向她 */}
        <div style={{ position: 'absolute', inset: 0, filter: 'blur(2.6px)' }}>
          {HEADS.map((h, i) => {
            const shake = Math.sin((f + i * 13) / 24) * (i === 2 ? 4 : 0);
            const raise = h.tiptoe ? 20 : 0;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: h.x,
                  bottom: h.base + raise,
                  width: h.w,
                  height: h.h,
                  transform: `translateY(${Math.sin((f / 90) * Math.PI * 2 + h.ph) * 2}px)`,
                }}
              >
                <svg viewBox="0 0 100 160" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                  <g transform={`rotate(${-h.tilt + shake} 50 62)`}>
                    <circle cx={50} cy={34} r={20} fill={colors.ink} />
                    <circle cx={38} cy={20} r={6} fill={colors.ink} />
                  </g>
                  <path d="M14 68 Q50 50 86 68 L100 160 L0 160 Z" fill={colors.ink} />
                </svg>
              </div>
            );
          })}
        </div>
        {/* 军报在人手里传，纸边被捏皱 */}
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
          <g transform="translate(756 792) rotate(-4)">
            <path
              d="M0 0 L60 -4 L72 8 L140 -2 L210 6 L300 -3 L392 2 L400 62 L318 70 L236 64 L150 72 L66 66 L0 70 Z"
              fill={colors.paper}
              opacity={0.9}
            />
            <path d="M18 18 L370 14" stroke={colors.ink} strokeWidth={1.2} opacity={0.3} />
            <path d="M22 34 L356 30" stroke={colors.ink} strokeWidth={1.2} opacity={0.22} />
          </g>
          <ellipse cx={742} cy={836} rx={26} ry={34} fill={colors.ink} transform="rotate(-18 742 836)" />
          <ellipse cx={1180} cy={832} rx={26} ry={34} fill={colors.ink} transform="rotate(22 1180 832)" />
        </svg>
      </CameraRig>
      <DustField act={3} />
      <Grade id="GR-03" />
    </AbsoluteFill>
  );
};

export default S15;
