/* 镜 7 · 幕二 风陵渡 · local [0,100) · 100f
   渡口的灯一盏盏亮起（客栈檐下、船头），光点很小；她从坡上走下，走向灯，驴跟在她身后半步；
   她不回头。固定中全景；前 20f CM-11 rack focus 由河面移到灯；尾帧灯占右上、她走到灯下。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CM, CV, FILM, FN, GRADES, PT, RH, STROKE } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { Donkey } from '../components/Objects';
import { XiangFigure } from '../components/Figure';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const LAMPS = [
  { x: 1240, y: 372, at: 4 },
  { x: 1470, y: 362, at: 22 },
  { x: 1690, y: 352, at: 44 },
  { x: 1148, y: 816, at: 62 },
];
const REEDS = Array.from({ length: 7 }, (_, i) => i);

const S07: FC = () => {
  const frame = useCurrentFrame();
  const move = CV.plateau(clamp01(FN.freezeHold(frame, 96) / 96));
  const follow = CV.plateau(clamp01(FN.freezeHold(frame - RH.half, 86) / 96));
  const focus = CV.inOut(clamp01(frame / RH.beat));
  const waterBlur = 3 * focus;
  const lampBlur = 3 * (1 - focus);
  const grade = GRADES['GR-03'];
  const herX = 360 + 1300 * move;
  const herY = 880 - 170 * move;
  const herS = 0.9 - 0.3 * move;

  return (
    <AbsoluteFill style={{ background: colors.bg, overflow: 'hidden' }}>
      <AbsoluteFill style={{ filter: `saturate(${grade.saturate})` }}>
        <CameraRig cam={CM.drift(frame, 1.6)}>
          {/* 暮色与河面：焦点起点 */}
          <AbsoluteFill style={{ filter: `blur(${waterBlur}px)` }}>
            <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.bg} 0%, ${colors.bgLift} 40%, ${FILM.snowCyan} 88%)`, opacity: 0.92 }} />
            <AbsoluteFill style={{ top: 180, height: 280, background: `linear-gradient(180deg, transparent, ${colors.accent})`, opacity: 0.22 }} />
            <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
              <path d="M0 420 L360 398 L760 416 L1160 392 L1560 418 L1920 400" fill="none" stroke={colors.muted} strokeWidth={STROKE.S0} opacity={0.34} />
              {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                const sh = 0.5 + 0.5 * Math.sin(((frame + i * PT.water.stagger) / 15) * Math.PI * 2);
                return <rect key={i} x={60 + (i % 3) * 180} y={448 + i * 30} width={1560 - i * 130} height={PT.water.line} fill={colors.muted} opacity={0.05 + 0.09 * sh * (1 - i / 10)} />;
              })}
            </svg>
          </AbsoluteFill>

          {/* 坡与岸 */}
          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
            <path d="M0 1080 L0 760 L1180 660 L1920 700 L1920 1080 Z" fill={colors.ink} opacity={0.95} />
            <path d="M0 760 L1180 660 L1920 700" fill="none" stroke={colors.accent} strokeWidth={STROKE.S1} opacity={0.26} />
          </svg>

          {/* 客栈：檐下灯一盏盏亮（墙面半透，让墨色剪影仍可读） */}
          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
            <path d="M1080 330 L1920 296 L1920 760 L1120 760 Z" fill={colors.ink} opacity={0.58} />
            <path d="M1060 330 L1920 292" fill="none" stroke={colors.ink} strokeWidth={STROKE.S3} opacity={0.95} />
            <path d="M1120 366 L1920 336" fill="none" stroke={colors.bg} strokeWidth={STROKE.S1} opacity={0.2} />
            <path d="M1120 470 L1920 446" fill="none" stroke={colors.bg} strokeWidth={STROKE.S0} opacity={0.18} />
            <path d="M1560 336 L1560 760" fill="none" stroke={colors.bg} strokeWidth={STROKE.S0} opacity={0.16} />
            {LAMPS.slice(0, 3).map((l) => (
              <path key={`cord-${l.x}`} d={`M${l.x} ${l.y - 60} L${l.x} ${l.y}`} stroke={colors.ink} strokeWidth={STROKE.S0} opacity={0.8} />
            ))}
          </svg>

          {/* 船头灯（第四盏，最后亮）；船身一线收口，免得墨叠墨 */}
          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
            <path d="M800 880 Q980 926 1160 880 L1120 920 Q980 948 840 920 Z" fill={colors.ink} />
            <path d="M800 880 Q980 926 1160 880" fill="none" stroke={colors.paperMuted} strokeWidth={STROKE.S1} opacity={0.45} />
            <path d="M1148 816 L1148 852" stroke={colors.ink} strokeWidth={STROKE.S1} />
          </svg>

          {/* 灯：光点很小，CV-06 三档硬切 */}
          <div style={{ position: 'absolute', inset: 0, filter: `blur(${lampBlur}px)` }}>
            {LAMPS.map((l) => {
              const lit = frame >= l.at ? FN.flameStep(frame) : 0;
              return (
                <div key={`${l.x}-${l.y}`} style={{ position: 'absolute', left: l.x - 2, top: l.y - 2, width: 4, height: 4, borderRadius: 2, background: colors.gold, opacity: lit }}>
                  <div style={{ position: 'absolute', left: -5, top: -5, width: 14, height: 14, borderRadius: 7, background: colors.accent, opacity: lit * 0.12 }} />
                </div>
              );
            })}
          </div>

          {/* 青驴：跟在她身后半步 */}
          <div style={{ position: 'absolute', left: 220 + 1160 * follow, top: 762 - 150 * follow, width: 190, height: 152, opacity: 0.85 }}>
            <Donkey style={{ width: '100%' }} />
          </div>
          {/* 她：走向灯，不回头 */}
          <div style={{ position: 'absolute', left: herX, top: herY - 300 * herS, width: 120 * herS, height: 300 * herS }}>
            <XiangFigure age="16" pose="walk" style={{ width: '100%', height: '100%' }} />
          </div>

          {/* 岸边残苇 */}
          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
            {REEDS.map((i) => {
              const sway = Math.sin((frame / PT.reed.period) * Math.PI * 2 + i) * PT.reed.amp;
              return <path key={i} d={`M${40 + i * 42} 1050 Q ${58 + i * 42 + sway} 960 ${62 + i * 42 + sway + 14} 900`} fill="none" stroke={colors.ink} strokeWidth={STROKE.S0} opacity={0.5} />;
            })}
          </svg>

          <DustField act={2} count={18} seedBase="s07" />
        </CameraRig>
      </AbsoluteFill>

      <AbsoluteFill style={{ background: grade.base.color, mixBlendMode: grade.base.blend, opacity: grade.base.opacity }} />
      {grade.veil ? <AbsoluteFill style={{ background: grade.veil.gradient, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} /> : null}
    </AbsoluteFill>
  );
};

export default S07;
