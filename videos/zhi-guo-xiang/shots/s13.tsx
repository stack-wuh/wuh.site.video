import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { CrowdFigure } from '../components/Figure';
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

const LAMPS = [250, 520, 830, 1180, 1530, 1800];
const HANDS = [
  { x: 1114, y: 906, a: -26 },
  { x: 1262, y: 926, a: -8 },
  { x: 1408, y: 894, a: 14 },
];

/** S13 军报入城（1620–1700）：低机位；马自左入向右出，镜头跟 30f 后停；尾帧军报在几只手之间展开。 */
const S13: FC = () => {
  const f = useCurrentFrame();
  const cam = CM.follow(f, 30, -90, 0);
  const ride = CV.plateau(Math.min(1, f / 80));
  const horseX = -440 + ride * 2620;
  const gait = FN.gaitWalk(f, 8, 'donkey');
  const reach = FN.handAction(f, 'offer');
  const unfold = CV.out(Math.min(1, Math.max(0, (f - 44) / 28)));
  const scrollW = 26 + 152 * unfold;
  const scrollH = 30 + 8 * unfold;
  return (
    <AbsoluteFill>
      <CameraRig cam={cam}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.bgLift} 0%, ${colors.bg} 100%)` }} />
        {/* 门洞外的一线暮色 */}
        <div
          style={{ position: 'absolute', left: 700, top: 250, width: 520, height: 620, opacity: 0.34, background: `linear-gradient(180deg, ${colors.accent} 0%, ${colors.bgLift} 52%, ${colors.bg} 100%)` }}
        />
        {/* 城墙、门洞、檐、地面：城内一侧，天还没黑 */}
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, filter: 'blur(0.8px)' }} preserveAspectRatio="none">
          <path d="M0 0 H1920 V1080 H0 Z M700 860 V520 Q700 286 960 286 Q1220 286 1220 520 V860 Z" fill={colors.ink} fillRule="evenodd" opacity={0.97} />
          <rect x={0} y={0} width={1920} height={126} fill={colors.ink} />
          <path d="M0 126 L1920 126 L1920 150 L1690 150 L1620 198 L560 198 L470 150 L0 150 Z" fill={colors.ink} />
          <rect x={0} y={896} width={1920} height={184} fill={colors.paperDeep} opacity={0.05} />
          {Array.from({ length: 24 }).map((_, i) => {
            const s = `s13-ground-${i}`;
            return <rect key={s} x={random(s) * 1920} y={906 + random(`${s}-y`) * 150} width={1 + random(`${s}-w`) * 3} height={0.8} fill={colors.paper} opacity={0.16 + random(`${s}-o`) * 0.2} />;
          })}
          {LAMPS.map((x, i) => (
            <g key={x} opacity={f >= i * RH.half ? 1 : 0}>
              <rect x={x} y={150} width={1.2} height={26} fill={colors.muted} opacity={0.55} />
              <circle cx={x} cy={184} r={2.6} fill={colors.gold} />
            </g>
          ))}
        </svg>
        {/* 城门洞里的人群：只有背影，没有一张脸朝镜头 */}
        <div style={{ position: 'absolute', left: 660, width: 600, bottom: 150, height: 320, overflow: 'hidden', filter: 'blur(1.6px)' }}>
          <CrowdFigure count={8} opacity={0.9} />
        </div>
        {/* 马、骑手、几只手与军报：焦点落在递报的手上 */}
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
          <g transform={`translate(${horseX} 0)`}>
            <g transform={`translate(0 ${gait.bob})`}>
              <ellipse cx={0} cy={782} rx={148} ry={60} fill={colors.ink} />
              <path d="M116 764 Q186 692 228 708 L214 762 Z" fill={colors.ink} />
              <circle cx={240} cy={706} r={15} fill={colors.ink} />
              {[-94, -42, 30, 84].map((lx, i) => (
                <path key={lx} d={`M${lx} 818 L${lx + (i % 2 === 0 ? gait.leg : -gait.leg)} 932`} stroke={colors.ink} strokeWidth={15} strokeLinecap="round" />
              ))}
              <path d="M-6 748 L-26 664 L22 646 L38 734 Z" fill={colors.ink} />
              <circle cx={48} cy={652} r={16} fill={colors.ink} />
              <path d="M54 692 L126 758" stroke={colors.ink} strokeWidth={14} strokeLinecap="round" />
            </g>
          </g>
          {HANDS.map((h, i) => (
            <g key={i} transform={`translate(${h.x + reach.x * 0.6} ${h.y - 18 * reach.t}) rotate(${h.a})`} opacity={f >= 14 ? 1 : 0}>
              <path d="M0 0 L-8 -88" stroke={colors.ink} strokeWidth={17} strokeLinecap="round" />
              <ellipse cx={2} cy={-100} rx={12} ry={16} fill={colors.ink} />
            </g>
          ))}
          <g transform={`translate(${1234 - scrollW / 2} ${806 - scrollH / 2}) rotate(-5)`}>
            <rect width={scrollW} height={scrollH} fill={colors.paper} opacity={0.92} />
            <rect x={3} y={5} width={Math.max(0, scrollW - 6)} height={1} fill={colors.ink} opacity={0.35} />
          </g>
        </svg>
      </CameraRig>
      <DustField act={3} />
      <Grade id="GR-03" />
    </AbsoluteFill>
  );
};

export default S13;
