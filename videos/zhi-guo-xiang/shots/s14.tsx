import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { Caption } from '../components/Caption';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { XiangFigure } from '../components/Figure';
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

const LAMPS = [880, 1060, 1240, 1420, 1600, 1780];
const WALL = Array.from({ length: 13 }).map((_, i) => ({
  x: 380 + i * 132 + random(`s14-wall-${i}-x`) * 60,
  h: 400 + random(`s14-wall-${i}-h`) * 180,
  w: 150 + random(`s14-wall-${i}-w`) * 90,
  ph: random(`s14-wall-${i}-p`) * Math.PI * 2,
}));

/** S14 她被挤出人群（1700–1860）：人群的背挤成一堵墙，她站在墙外；全镜她不动，动的是人群。 */
const S14: FC = () => {
  const f = useCurrentFrame();
  const push = CV.out(Math.min(1, Math.max(0, (f - 140) / 20)));
  const sheX = 250 - 12 * push;
  const wallX = -10 - 26 * push;
  return (
    <AbsoluteFill>
      <CameraRig cam={CM.hold()}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.bgLift} 0%, ${colors.bg} 82%)` }} />
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
          {/* 远处屋檐与灯一盏盏亮 */}
          <path d="M600 372 L1920 340 L1920 392 L600 404 Z" fill={colors.ink} opacity={0.9} />
          {LAMPS.map((x, i) => (
            <g key={x} opacity={f >= i * RH.beat ? 1 : 0}>
              <rect x={x} y={392} width={1.2} height={22} fill={colors.muted} opacity={0.5} />
              <circle cx={x} cy={418} r={2.4} fill={colors.gold} />
            </g>
          ))}
        </svg>
        {/* 人群的背：一堵会呼吸的墙 */}
        {WALL.map((b, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: b.x,
              bottom: 70 + (i % 3) * 18,
              width: b.w,
              height: b.h,
              transform: `translateX(${wallX}px) translateY(${FN.bodyIdle(f + i * 9, 3)}px)`,
              opacity: 0.96,
            }}
          >
            <svg viewBox="0 0 100 160" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <circle cx={50} cy={26} r={22} fill={colors.ink} />
              <path d="M18 54 Q50 38 82 54 L96 160 L4 160 Z" fill={colors.ink} />
            </svg>
          </div>
        ))}
        {/* 她站在墙外：手拢在袖里，肩线绷着，脸不入画 */}
        <div
          style={{
            position: 'absolute',
            left: 250,
            bottom: 120,
            width: 158,
            height: 420,
            transform: `translateX(${sheX - 250}px) rotate(-3deg)`,
            transformOrigin: 'bottom center',
          }}
        >
          <XiangFigure age="16" pose="stand" style={{ width: '100%', height: '100%' }} />
        </div>
      </CameraRig>
      <DustField act={3} />
      <Grade id="GR-03" />
      <Caption text="九月廿四，她的生日。" start={0} end={160} />
    </AbsoluteFill>
  );
};

export default S14;
