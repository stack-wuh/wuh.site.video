/* 镜 02 · S2 山 · 镜内帧 0–239 · 240f ｜ 全局 180–420
   入场 PT-10/CV-04/GR-07：山脊前 90f 自左「墨渗」长成，此后全静；末 30f CM-11 远山退淡。
   持续 CM-01/PT-01/FN-05；出场 FN-06 冻帧 → TR-01 交 S3：墨青山脊 / 留白六成。
   诗第 1 行 20–200；无树、无屋、无人。 */
import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { CM, CV, FN, GRADES, PT, STROKE } from '../motion-tokens';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const G = GRADES['GR-07'];

/* 山脊横过纸面下三分之一：近山实形 + 远山两线（淡） */
const RIDGE =
  'M0 806 C110 792 180 762 290 748 C390 736 450 700 540 708 C640 718 690 764 770 760 C850 756 890 706 990 696 C1090 686 1130 730 1230 744 C1330 758 1390 716 1490 720 C1590 724 1660 754 1760 764 C1830 771 1880 764 1920 760';
const NEAR = `${RIDGE} L1920 1080 L0 1080 Z`;
const FAR =
  'M0 624 C120 596 190 560 300 572 C400 582 450 620 540 606 C650 590 700 548 820 560 C930 570 980 612 1100 604 C1210 596 1270 556 1390 566 C1500 574 1560 606 1680 600 C1790 594 1860 610 1920 604';
const FAR2 =
  'M0 578 C140 552 210 528 330 546 C450 564 500 592 620 578 C740 564 800 528 920 540 C1040 552 1100 584 1220 574 C1340 564 1400 532 1520 542 C1640 552 1700 578 1820 572 C1870 569 1900 576 1920 574';

/** PT-02 纸纤维：种子化 1px 短 strokes，静态 ≤8%，压在墨山上透出纸纹 */
const FiberField: FC<{ seed: string; count?: number }> = ({ seed, count = 90 }) => (
  <svg
    viewBox="0 0 1920 1080"
    preserveAspectRatio="none"
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: PT.paperFiber.opacity }}
  >
    {Array.from({ length: count }).map((_, i) => {
      const x = random(`${seed}-x-${i}`) * 1920;
      const y = random(`${seed}-y-${i}`) * 1080;
      const len = 6 + random(`${seed}-l-${i}`) * 20;
      const bend = (random(`${seed}-b-${i}`) - 0.5) * 8;
      const pale = random(`${seed}-c-${i}`) < 0.25;
      return (
        <path key={i} d={`M${x.toFixed(1)} ${y.toFixed(1)} q${(len / 2).toFixed(1)} ${bend.toFixed(1)} ${len.toFixed(1)} 0`} stroke={pale ? colors.paperMuted : colors.muted} strokeWidth={STROKE.S0} fill="none" />
      );
    })}
  </svg>
);

/* 皴法：48 道墨线 + 24 点墨点，种子化，裁在近山形内 */
const CUN = Array.from({ length: 72 }).map((_, i) => {
  const x = random(`s02-cun-x-${i}`) * 1920;
  const y = 690 + random(`s02-cun-y-${i}`) * 380;
  const o = 0.2 + random(`s02-cun-o-${i}`) * 0.3;
  if (i % 3 === 0) {
    return <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={(0.8 + random(`s02-cun-r-${i}`) * 1.4).toFixed(1)} fill={colors.ink} opacity={o} />;
  }
  const len = 8 + random(`s02-cun-l-${i}`) * 26;
  const tilt = (random(`s02-cun-t-${i}`) - 0.5) * 18;
  return <path key={i} d={`M${x.toFixed(1)} ${y.toFixed(1)} l${len.toFixed(1)} ${tilt.toFixed(1)}`} stroke={colors.ink} strokeWidth={STROKE.S0} opacity={o} />;
});

const S02: FC = () => {
  const f = FN.freezeHold(useCurrentFrame(), 239); // FN-06
  const grow = CV.sineOut(clamp01(f / 90)); // PT-10 墨渗生长 0–90f
  const retreat = CV.inOut(clamp01((f - 210) / 29)); // CM-11 末 30f 远山退淡
  const gradeIn = CV.hardStep3(clamp01(f / 20)); // GR-07 三档硬切入场
  const cam = { ...CM.hold(), scale: FN.paperBreathe(f, 0.4) }; // FN-05
  const farOp = 0.34 * (1 - 0.55 * retreat);
  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <CameraRig cam={cam}>
        <div style={{ position: 'absolute', inset: -40, background: colors.paper }} />
        <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${((1 - grow) * 100).toFixed(2)}% 0 0)` }}>
          <svg viewBox="0 0 1920 1080" preserveAspectRatio="none" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <clipPath id="s02-ridge">
                <path d={NEAR} />
              </clipPath>
            </defs>
            <path d={FAR2} fill="none" stroke={colors.muted} strokeWidth={STROKE.S0} opacity={farOp * 0.6} />
            <path
              d={FAR}
              fill="none"
              stroke={colors.muted}
              strokeWidth={STROKE.S1}
              opacity={farOp}
              style={{ filter: `blur(${(0.3 + 1.6 * retreat).toFixed(2)}px)` }}
            />
            <path d={NEAR} fill={colors.ink} opacity={0.82} />
            <g clipPath="url(#s02-ridge)">
              <rect x={0} y={800} width={1920} height={280} fill={colors.accent} opacity={0.14} style={{ mixBlendMode: 'multiply' }} />
              {CUN}
            </g>
            <path
              d={RIDGE}
              fill="none"
              stroke={colors.ink}
              strokeWidth={STROKE.S2}
              strokeDasharray={2400}
              strokeDashoffset={2400 * (1 - grow)}
              opacity={0.9}
            />
          </svg>
        </div>
        <FiberField seed="s02-fiber" />
      </CameraRig>
      {/* GR-07 山墨：墨 multiply 取半强度，避免压灰纸白天空；veil 随入场硬切 */}
      <AbsoluteFill style={{ background: G.base.color, mixBlendMode: G.base.blend, opacity: G.base.opacity * 0.5 * gradeIn }} />
      <AbsoluteFill
        style={{ backgroundImage: G.veil?.gradient, mixBlendMode: G.veil?.blend, opacity: (G.veil?.opacity ?? 0) * gradeIn }}
      />
      {/* 纸白满幅时 Caption 的 paper 字色不可读：difference 让字在纸上成墨、在山上成纸白 */}
      <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'difference' }}>
        <Caption text="我走过山时，山不说话，" start={20} end={200} poem bottom={600} />
      </div>
    </AbsoluteFill>
  );
};

export default S02;
