import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CameraRig } from '../components/CameraRig';
import { XiangFigure, YangGuoFigure } from '../components/Figure';
import { CM, CV, FN, GRADES, STROKE } from '../motion-tokens';
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
const FOG = [
  { y: 760, h: 100, o: 0.3, amp: 0.2 },
  { y: 830, h: 140, o: 0.26, amp: 0.4 },
  { y: 900, h: 180, o: 0.22, amp: 0.6 },
];

/** S23 雾合（2880–3000）：雾从山谷漫上来，把他站的地方填平；她在左前景原地不动。 */
const S23: FC = () => {
  const f = useCurrentFrame();
  const huashanLocal = f + 180; // 3-4 连续 local：S22 走 0–179，S23 从 180 起
  const pose = FN.turnAway(179);
  const fade = FN.turnAway(huashanLocal).fade;
  const drift = FN.cloudSlow(f, 150);
  const rise = 86 * CV.sineOut(Math.min(1, f / 120));
  const farBlur = 3.6 * CV.inOut(Math.min(1, f / 20));
  return (
    <AbsoluteFill>
      <CameraRig cam={CM.hold()}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.paper} 0%, ${colors.paperMuted} 64%, ${colors.paperDeep} 100%)` }} />
        <div style={{ position: 'absolute', inset: 0, filter: `blur(${farBlur}px)` }}>
          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
            <path d="M0 470 L300 400 L560 452 L820 372 L1100 450 L1400 390 L1680 456 L1920 420" fill="none" stroke={colors.muted} strokeWidth={STROKE.S0} opacity={0.3} />
            <path d="M0 530 L360 470 L680 516 L980 456 L1280 520 L1620 468 L1920 512" fill="none" stroke={colors.muted} strokeWidth={STROKE.S0} opacity={0.18} />
          </svg>
        </div>
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
          <path d="M300 1080 L440 850 L640 780 L820 812 L980 748 L1180 772 L1360 742 L1560 828 L1700 1080 Z" fill={colors.ink} opacity={0.38} />
          <path d="M440 850 L640 780 L820 812 L980 748" fill="none" stroke={colors.ink} strokeWidth={STROKE.S1} opacity={0.45} />
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
        </svg>
        {/* 他：轮廓先散、肩线最后消失；120f 内 opacity 到 0.15 */}
        <div
          style={{
            position: 'absolute',
            left: 1270,
            bottom: 326,
            width: 100,
            height: 300,
            transform: `translateX(${pose.walk}px) rotate(${pose.rot}deg)`,
            transformOrigin: 'bottom center',
            opacity: fade,
          }}
        >
          <YangGuoFigure style={{ width: '100%', height: '100%' }} />
        </div>
        {/* 她在左前景原地不动 */}
        <div style={{ position: 'absolute', left: 913, bottom: 328, width: 94, height: 250 }}>
          <XiangFigure age="16" pose="back" style={{ width: '100%', height: '100%' }} />
        </div>
        {/* 雾从山谷漫上来，把刚才他站的地方填平 */}
        {FOG.map((c, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: -120 + i * 40,
              right: -120,
              bottom: 1080 - c.y - c.h + rise + i * 12,
              height: c.h,
              borderRadius: '50%',
              background: colors.paper,
              opacity: c.o,
              transform: `translateX(${Math.sin((f + i * 40) / 90) * 26 * c.amp}px)`,
            }}
          />
        ))}
      </CameraRig>
      <Grade id="GR-07" />
    </AbsoluteFill>
  );
};

export default S23;
