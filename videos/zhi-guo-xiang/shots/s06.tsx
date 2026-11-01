/* 镜 6 · 幕二 风陵渡 · local [0,180) · 180f
   她在坡上牵驴等船：中景，人物占画幅四分之一；双环髻 + 发带 2 条、雪青斗篷、风帽放下；
   衣角被风扯三次、双手握缰；只给 3/4 背（L1）；青驴低头、驴背空着。
   CM-02/CM-10 侧后方固定、浅景深；末 20f 船影靠近（CM-11）；字幕 0–180 逐字照抄。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CM, CV, FILM, FN, GRADES, PT, STROKE } from '../motion-tokens';
import { CameraRig, ParallaxLayer } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Donkey, Ferry } from '../components/Objects';
import { XiangFigure } from '../components/Figure';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const GUSTS = [22, 82, 142];
const WATER = Array.from({ length: 10 }, (_, i) => i);

const S06: FC = () => {
  const frame = useCurrentFrame();
  const cam = CM.drift(frame, 1.8);
  const gust = GUSTS.reduce((sum, at) => sum + Math.sin(Math.PI * clamp01((frame - at) / 30)), 0);
  const sway = FN.clothSway(frame, 2 + gust * 5);
  const idle = FN.bodyIdle(frame, 1.2);
  const boatIn = CV.out(clamp01((frame - 158) / 18));
  const boatFocus = CM.focusPull(frame - 150, 20) * 0.25;
  const grade = GRADES['GR-03'];

  return (
    <AbsoluteFill style={{ background: colors.bg, overflow: 'hidden' }}>
      <AbsoluteFill style={{ filter: `saturate(${grade.saturate})` }}>
        <CameraRig cam={cam}>
          <ParallaxLayer depth={1.5} cam={cam} blurBase={0.7}>
            <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.bg} 0%, ${colors.bgLift} 44%, ${FILM.snowCyan} 96%)`, opacity: 0.9 }} />
            <AbsoluteFill style={{ top: 210, height: 250, background: `linear-gradient(180deg, transparent, ${colors.accent})`, opacity: 0.26 }} />
            <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
              <path d="M0 430 L300 404 L640 424 L980 396 L1320 426 L1620 402 L1920 420" fill="none" stroke={colors.muted} strokeWidth={STROKE.S0} opacity={0.38} />
              <rect x={0} y={432} width={1920} height={22} fill={colors.ink} opacity={0.55} />
            </svg>
            {/* 对岸来船：末 20f 靠近（CM-11） */}
            <div style={{ position: 'absolute', left: 1370, top: 452, width: 160, opacity: 0.4 + 0.28 * boatIn, filter: `blur(${boatFocus}px)`, transform: `translate(${-110 * boatIn}px, ${78 * boatIn}px) scale(${1 + 0.55 * boatIn})` }}>
              <Ferry style={{ width: '100%' }} />
            </div>
          </ParallaxLayer>
          {/* 河面 */}
          <AbsoluteFill style={{ top: 454 }}>
            <AbsoluteFill style={{ background: `linear-gradient(180deg, ${FILM.snowCyan} 0%, ${colors.bgLift} 22%, ${colors.bg} 100%)`, opacity: 0.5 }} />
          </AbsoluteFill>
          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
            {WATER.map((i) => {
              const shimmer = 0.5 + 0.5 * Math.sin(((frame + i * PT.water.stagger) / 15) * Math.PI * 2);
              return <rect key={i} x={90 + (i % 3) * 140} y={470 + i * 34} width={1720 - i * 120} height={PT.water.line} fill={i % 2 ? colors.paperMuted : colors.muted} opacity={0.05 + 0.1 * shimmer * (1 - i / 14)} />;
            })}
          </svg>

          {/* 坡岸 + 岸苇（PT-08） */}
          <ParallaxLayer depth={0.4} cam={cam} blurBase={0.9}>
            <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
              <path d="M0 1080 L0 786 L1920 690 L1920 1080 Z" fill={colors.ink} opacity={0.95} />
              <path d="M0 786 L1920 690" fill="none" stroke={colors.accent} strokeWidth={STROKE.S1} opacity={0.3} />
              {[0, 1, 2, 3, 4].map((i) => {
                const rs = Math.sin((frame / PT.reed.period) * Math.PI * 2 + i * 0.8) * PT.reed.amp;
                return <path key={i} d={`M${26 + i * 56} 1080 Q ${44 + i * 56 + rs} 968 ${54 + i * 56 + rs + 16} ${868 - (i % 3) * 42}`} fill="none" stroke={colors.ink} strokeWidth={STROKE.S1} opacity={0.7} />;
              })}
            </svg>
          </ParallaxLayer>

          {/* 檐影：压住她的轮廓线，脸不入画 */}
          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
            <path d="M1260 0 L1920 0 L1920 86 L1330 34 Z" fill={colors.ink} opacity={0.92} />
            <path d="M1260 0 L1920 0 L1920 620 L1520 300 Z" fill={colors.ink} opacity={0.16} />
          </svg>

          {/* 青驴：低头、长耳、驴背空着 */}
          <div style={{ position: 'absolute', left: 900, top: 658, width: 240, height: 192, transform: `translateY(${FN.bodyIdle(frame + 9, 0.8)}px) rotate(4deg)`, transformOrigin: '20% 60%' }}>
            <div style={{ width: '100%', height: '100%', transform: 'scaleX(-1)' }}>
              <Donkey style={{ width: '100%' }} />
            </div>
          </div>

          {/* 她：3/4 背，斗篷、风帽放下、发带 2 条；风扯衣角三次 */}
          <div style={{ position: 'absolute', left: 560, top: 560, width: 320, height: 300, transform: `translateY(${idle}px)` }}>
            <svg viewBox="0 0 320 300" style={{ position: 'absolute', inset: 0 }}>
              <path d="M160 58 Q 92 72 82 168 Q 74 246 74 296 L246 296 Q 246 246 238 168 Q 228 72 160 58 Z" fill={FILM.snowCyan} stroke={colors.ink} strokeWidth={STROKE.S1} opacity={0.96} />
              <path d="M132 62 Q160 46 188 62 Q186 84 160 88 Q134 84 132 62 Z" fill={FILM.snowCyan} stroke={colors.ink} strokeWidth={STROKE.S0} opacity={0.9} />
              <g transform={`rotate(${gust * 9} 96 288)`}>
                <path d="M84 262 Q60 276 48 294 L92 296 Z" fill={FILM.snowCyan} stroke={colors.ink} strokeWidth={STROKE.S0} opacity={0.9} />
              </g>
            </svg>
            <div style={{ position: 'absolute', left: 103.75, top: 0, width: 112.5, height: 300, transform: 'rotate(-4deg)', transformOrigin: 'bottom center' }}>
              <XiangFigure age="16" pose="stand" style={{ width: '100%', height: '100%' }} />
            </div>
            <svg viewBox="0 0 320 300" style={{ position: 'absolute', inset: 0 }}>
              <g transform={`translate(${-gust * 9 + sway} 0)`}>
                <path d="M145 26 Q126 40 116 82" fill="none" stroke={FILM.snowCyan} strokeWidth={STROKE.S1} opacity={0.95} />
                <path d="M175 26 Q156 40 146 82" fill="none" stroke={FILM.snowCyan} strokeWidth={STROKE.S1} opacity={0.95} />
              </g>
              <circle cx={146} cy={196} r={5} fill={colors.paper} stroke={colors.ink} strokeWidth={STROKE.S0} />
              <circle cx={174} cy={196} r={5} fill={colors.paper} stroke={colors.ink} strokeWidth={STROKE.S0} />
            </svg>
          </div>

          {/* 缰绳：始终没松 */}
          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
            <path d={`M706 ${756 + idle} Q 820 ${748 + idle} 948 742`} fill="none" stroke={colors.paperMuted} strokeWidth={STROKE.S1} opacity={0.85} />
            <path d={`M734 ${756 + idle} Q 840 ${762 + idle} 948 742`} fill="none" stroke={colors.paperMuted} strokeWidth={STROKE.S1} opacity={0.7} />
          </svg>

          <DustField act={2} count={22} seedBase="s06" />
        </CameraRig>
      </AbsoluteFill>

      <AbsoluteFill style={{ background: grade.base.color, mixBlendMode: grade.base.blend, opacity: grade.base.opacity }} />
      {grade.veil ? <AbsoluteFill style={{ background: grade.veil.gradient, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} /> : null}
      <Caption text="那一年她十六岁，在风陵渡听人说神雕侠。" start={0} end={180} />
    </AbsoluteFill>
  );
};

export default S06;
