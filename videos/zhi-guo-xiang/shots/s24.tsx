import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { Caption } from '../components/Caption';
import { CameraRig } from '../components/CameraRig';
import { XiangFigure } from '../components/Figure';
import { CM, CV, FN, GRADES, RH, STROKE } from '../motion-tokens';
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

const SEA = [
  { y: 820, h: 46, o: 0.22, s: 1 },
  { y: 880, h: 62, o: 0.16, s: 1.5 },
  { y: 948, h: 84, o: 0.26, s: 0.7 },
  { y: 1010, h: 96, o: 0.18, s: 1.2 },
];

/** S24 她站在岩边（3000–3120）：她没有追，也没有转身；末 40f 后拉 2%，她成一个小点。 */
const S24: FC = () => {
  const f = useCurrentFrame();
  const dot = FN.figureToDot(f, 120);
  const zoom = 1 - 0.02 * CV.sineOut(Math.min(1, Math.max(0, (f - 80) / RH.rest)));
  const wind = FN.clothSway(f, 8);
  const drift = FN.cloudSlow(f, 150);
  return (
    <AbsoluteFill>
      <CameraRig cam={{ ...CM.hold(), scale: zoom }}>
        <AbsoluteFill style={{ transform: 'scale(1.06)' }}>
          <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.paper} 0%, ${colors.paperMuted} 64%, ${colors.paperDeep} 100%)` }} />
          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
            <path d="M0 420 L280 372 L560 412 L860 356 L1180 416 L1500 364 L1920 404" fill="none" stroke={colors.muted} strokeWidth={STROKE.S0} opacity={0.38} />
            {/* 岩边：她站的地方 */}
            <path d="M240 1080 L340 852 L620 792 L880 800 L1030 862 L1100 1080 Z" fill={colors.ink} opacity={0.38} />
            <path d="M340 852 L620 792 L880 800" fill="none" stroke={colors.ink} strokeWidth={STROKE.S1} opacity={0.45} />
            {/* 脚下云在翻：画面下三分之一是云海 */}
            <path d="M0 846 Q320 806 640 836 T1280 826 T1920 846 L1920 1080 L0 1080 Z" fill={colors.paper} opacity={0.55} />
            {SEA.map((c, i) => (
              <path
                key={i}
                d={`M-200 ${c.y} Q260 ${c.y - c.h} 620 ${c.y - c.h * 0.35} T1380 ${c.y - c.h * 0.2} T2120 ${c.y - c.h * 0.55} T2200 ${c.y}`}
                fill="none"
                stroke={colors.muted}
                strokeWidth={i === 3 ? 1.2 : STROKE.S0}
                opacity={c.o}
                transform={`translate(${Math.sin((f + i * 33) / 70) * 22 * c.s + drift * 900 * c.s} 0)`}
              />
            ))}
            {/* 他只余一道 0.8px 肩线，20f 后全无 */}
            {f < 20 ? <path d="M1290 706 L1350 702" stroke={colors.muted} strokeWidth={STROKE.S0} opacity={0.5} /> : null}
          </svg>
          {/* 她的背影：风把衣角吹起；3000f 后成小点 */}
          <div
            style={{
              position: 'absolute',
              left: 700,
              bottom: 290,
              width: 49,
              height: 130,
              transform: `translateX(${wind * 0.35}px) scale(${dot.scale})`,
              transformOrigin: 'bottom center',
              opacity: dot.opacity,
            }}
          >
            <XiangFigure age="16" pose="back" style={{ width: '100%', height: '100%' }} />
          </div>
        </AbsoluteFill>
      </CameraRig>
      <Grade id="GR-07" />
      <Caption text="他没有回头。" start={0} end={80} tone="ink" />
    </AbsoluteFill>
  );
};

export default S24;
