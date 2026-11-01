/* 镜 5 · 幕二 风陵渡 · local [0,80) · 80f
   黄河渡口大全景：河面横贯、左岸芦苇压低、浅水冰凌反光、土黄暮色压在天边、对岸渡船很小；无人。
   入场 TR-04：前 20f 纸白 → 暮色（CV-06 三档硬切）；CM-01 固定 + CM-02 微漂；
   PT-09 水纹、PT-08 芦苇、PT-03 光尘；CM-11 浅景深只压远岸；尾帧暮色沉一寸。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CM, CV, FILM, GRADES, PT, RH, STROKE, TR } from '../motion-tokens';
import { CameraRig, ParallaxLayer } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { Ferry } from '../components/Objects';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const REEDS = Array.from({ length: PT.reed.count }, (_, i) => i);
const WATER_LINES = Array.from({ length: 16 }, (_, i) => i);

const S05: FC = () => {
  const frame = useCurrentFrame();
  const cam = CM.drift(frame, 2.5);
  const paperToDusk = 1 - CV.hardStep3(clamp01(frame / TR.duskBleed));
  const duskSink = 0.05 * CV.hardStep3(clamp01((frame - RH.step - RH.half) / 12));
  const grade = GRADES['GR-03'];

  return (
    <AbsoluteFill style={{ background: colors.bg, overflow: 'hidden' }}>
      <AbsoluteFill style={{ filter: `saturate(${grade.saturate})` }}>
        <CameraRig cam={cam}>
          {/* 天与远岸：暮色像从纸背渗上来 */}
          <ParallaxLayer depth={1.6} cam={cam} blurBase={0.8}>
            <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.bg} 0%, ${colors.bgLift} 46%, ${FILM.snowCyan} 96%)`, opacity: 0.92 }} />
            <AbsoluteFill style={{ top: 250, height: 320, background: `linear-gradient(180deg, transparent, ${colors.accent})`, opacity: 0.28 + duskSink }} />
            <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
              <path d="M0 512 L280 470 L560 498 L860 458 L1180 500 L1480 468 L1720 496 L1920 476" fill="none" stroke={colors.muted} strokeWidth={STROKE.S0} opacity={0.42} />
              <path d="M0 528 L340 500 L660 520 L980 492 L1320 522 L1640 502 L1920 516" fill="none" stroke={colors.muted} strokeWidth={STROKE.S0} opacity={0.2} />
              <rect x={0} y={508} width={1920} height={12} fill={colors.ink} opacity={0.42} />
            </svg>
            {/* 对岸渡船：一弧，很小，压在水平线上 */}
            <div style={{ position: 'absolute', left: 1292, top: 486, width: 208, opacity: 0.62 }}>
              <Ferry style={{ width: '100%' }} />
            </div>
          </ParallaxLayer>

          {/* 河面：PT-09 横向水纹，1px，6f 错峰；浅水冰凌反光 */}
          <AbsoluteFill style={{ top: 540 }}>
            <AbsoluteFill style={{ background: `linear-gradient(180deg, ${FILM.snowCyan} 0%, ${colors.bgLift} 26%, ${colors.bg} 100%)`, opacity: 0.34 }} />
          </AbsoluteFill>
          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
            {WATER_LINES.map((i) => {
              const y = 556 + i * 31;
              const split = 0.34 + (i % 4) * 0.11;
              const shimmer = 0.5 + 0.5 * Math.sin(((frame + i * PT.water.stagger) / 14) * Math.PI * 2);
              const fade = 1 - i / (WATER_LINES.length + 4);
              return (
                <g key={i} opacity={(0.05 + 0.13 * shimmer) * fade}>
                  <rect x={0} y={y} width={1920 * split} height={PT.water.line} fill={i % 3 === 0 ? colors.accent : colors.paperMuted} />
                  <rect x={1920 * split + 90} y={y} width={1920 * (0.78 - split)} height={PT.water.line} fill={colors.muted} />
                </g>
              );
            })}
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={`ice-${i}`}
                x={228 + i * 116}
                y={688 + i * 62}
                width={48 - i * 7}
                height={STROKE.S0}
                fill={colors.paper}
                opacity={0.12 + 0.22 * CV.hardStep3(clamp01((frame - i * 9) / 18))}
              />
            ))}
          </svg>

          {/* 左岸：岸线 15°，芦苇压低，逆风偏向河心 */}
          <ParallaxLayer depth={0.4} cam={cam} blurBase={1.2}>
            <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
              <path d="M0 1080 L0 604 L430 700 L560 1080 Z" fill={colors.ink} opacity={0.94} />
              <path d="M0 604 L430 700" fill="none" stroke={colors.accent} strokeWidth={STROKE.S1} opacity={0.32} />
              {REEDS.map((i) => {
                const baseX = 54 + i * 52;
                const baseY = 618 + i * 11;
                const lean = 26 + (i % 3) * 6;
                const sway = Math.sin((frame / PT.reed.period) * Math.PI * 2 + i * 0.9) * PT.reed.amp;
                const h = 132 + (i % 4) * 34;
                return (
                  <g key={i}>
                    <path d={`M${baseX} ${baseY} Q ${baseX + (lean + sway) * 0.5} ${baseY - h * 0.56} ${baseX + lean + sway} ${baseY - h}`} fill="none" stroke={colors.ink} strokeWidth={STROKE.S1} opacity={0.9} />
                    <path d={`M${baseX + lean + sway} ${baseY - h} q 9 -8 16 -13`} fill="none" stroke={colors.ink} strokeWidth={STROKE.S0} opacity={0.78} />
                  </g>
                );
              })}
            </svg>
          </ParallaxLayer>

          <DustField act={2} count={18} seedBase="s05" />
        </CameraRig>
      </AbsoluteFill>

      <AbsoluteFill style={{ background: grade.base.color, mixBlendMode: grade.base.blend, opacity: grade.base.opacity }} />
      {grade.veil ? <AbsoluteFill style={{ background: grade.veil.gradient, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} /> : null}
      {/* S4 纸白 → 暮色：三档硬切，不做连续渐变 */}
      <AbsoluteFill style={{ background: colors.paper, opacity: paperToDusk }} />
    </AbsoluteFill>
  );
};

export default S05;
