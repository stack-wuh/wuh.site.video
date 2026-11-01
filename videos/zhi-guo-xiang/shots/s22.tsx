import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CameraRig } from '../components/CameraRig';
import { XiangFigure, YangGuoFigure } from '../components/Figure';
import { CM, FN, GRADES, STROKE } from '../motion-tokens';
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

const CLOUDS = [
  { y: 880, amp: 1, o: 0.3, h: 56 },
  { y: 940, amp: 1.6, o: 0.22, h: 72 },
  { y: 1010, amp: 0.6, o: 0.36, h: 96 },
];

/** S22 华山背影（2700–2880）：他背立右侧三分之一，120f 起肩先动，三步入雾；她在他身后，只有背影。 */
const S22: FC = () => {
  const f = useCurrentFrame();
  const turn = FN.turnAway(f);
  const drift = FN.cloudSlow(f, 150);
  return (
    <AbsoluteFill>
      <CameraRig cam={CM.hold()}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.paper} 0%, ${colors.paperMuted} 64%, ${colors.paperDeep} 100%)` }} />
        {/* 远山与云海：云在脚下翻 */}
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
          <path d="M0 470 L300 400 L560 452 L820 372 L1100 450 L1400 390 L1680 456 L1920 420" fill="none" stroke={colors.muted} strokeWidth={STROKE.S0} opacity={0.3} />
          <path d="M0 530 L360 470 L680 516 L980 456 L1280 520 L1620 468 L1920 512" fill="none" stroke={colors.muted} strokeWidth={STROKE.S0} opacity={0.18} />
          {/* 巨岩 */}
          <path d="M300 1080 L440 850 L640 780 L820 812 L980 748 L1180 772 L1360 742 L1560 828 L1700 1080 Z" fill={colors.ink} opacity={0.38} />
          <path d="M440 850 L640 780 L820 812 L980 748" fill="none" stroke={colors.ink} strokeWidth={STROKE.S1} opacity={0.45} />
          <path d="M0 900 Q480 860 960 892 T1920 880 L1920 1080 L0 1080 Z" fill={colors.paper} opacity={0.55} />
          {CLOUDS.map((c, i) => (
            <path
              key={i}
              d={`M-200 ${c.y} Q180 ${c.y - c.h} 520 ${c.y - c.h * 0.4} T1180 ${c.y - c.h * 0.2} T1820 ${c.y - c.h * 0.5} T2120 ${c.y}`}
              fill="none"
              stroke={colors.muted}
              strokeWidth={i === 2 ? 1.2 : STROKE.S0}
              opacity={c.o}
              transform={`translate(${drift * 1200 * c.amp} 0)`}
            />
          ))}
          {/* 雾从山谷起：先只到他的膝下 */}
          <path d="M0 946 Q420 918 980 944 T1920 930" fill="none" stroke={colors.muted} strokeWidth={STROKE.S0} opacity={0.24} />
        </svg>
        {/* 他：深墨长袍、空袖、长发半束；始终背影，无脸无剑 */}
        <div
          style={{
            position: 'absolute',
            left: 1270,
            bottom: 326,
            width: 100,
            height: 300,
            transform: `translateX(${turn.walk}px) rotate(${turn.rot}deg)`,
            transformOrigin: 'bottom center',
            opacity: turn.fade,
          }}
        >
          <YangGuoFigure style={{ width: '100%', height: '100%' }} />
        </div>
        {/* 她：在他身后三步，只有背影（L1） */}
        <div style={{ position: 'absolute', left: 913, bottom: 328, width: 94, height: 250 }}>
          <XiangFigure age="16" pose="back" style={{ width: '100%', height: '100%' }} />
        </div>
        {/* 他走进的雾：尾帧他的影子一半没进雾里 */}
        <div style={{ position: 'absolute', left: 1050, right: 0, bottom: 0, height: 360, background: `linear-gradient(180deg, ${colors.paper} 0%, ${colors.paper} 60%, ${colors.paperMuted} 100%)`, opacity: 0.45 }} />
      </CameraRig>
      <Grade id="GR-07" />
    </AbsoluteFill>
  );
};

export default S22;
