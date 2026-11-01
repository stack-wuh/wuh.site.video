/* 镜 12 · 幕二 风陵渡 · local [0,60) · 60f
   渡船离岸，船尾的风把芦花带起；她的背影在船头，没有回头；河面把土黄的暮色拉长。
   岸边低机位固定，船向画外走（CM-04 后拉 2%）；芦花在前景虚化掠过、尾帧落回；
   起帧一线金接 S11 的指缝金光，尾帧船成一个小点、空渡口。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CM, CV, FILM, FN, GRADES, PT, STROKE } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { Ferry } from '../components/Objects';
import { XiangFigure } from '../components/Figure';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const LEFT = [0, 1, 2, 3];
const RIGHT = [0, 1, 2];
const WATER = Array.from({ length: 12 }, (_, i) => i);

const S12: FC = () => {
  const frame = useCurrentFrame();
  const cam = CM.dollyOut(frame, 60, 0.02);
  const t = CV.plateau(clamp01(frame / 60));
  const sweep = CV.plateau(clamp01(frame / 60));
  const lift = 1 - CV.inOut(clamp01((frame - 42) / 18));
  const goldLine = 1 - CV.hardStep3(clamp01(frame / 12));
  const grade = GRADES['GR-03'];

  return (
    <AbsoluteFill style={{ background: colors.bg, overflow: 'hidden' }}>
      <AbsoluteFill style={{ filter: `saturate(${grade.saturate})` }}>
        <CameraRig cam={cam}>
          {/* 暮色与河面 */}
          <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.bg} 0%, ${colors.bgLift} 42%, ${FILM.snowCyan} 92%)`, opacity: 0.94 }} />
          <AbsoluteFill style={{ top: 220, height: 300, background: `linear-gradient(180deg, transparent, ${colors.accent})`, opacity: 0.27 }} />
          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
            <path d="M0 506 L320 486 L700 502 L1080 482 L1460 504 L1920 488" fill="none" stroke={colors.muted} strokeWidth={STROKE.S0} opacity={0.36} />
            <path d="M0 520 L360 508 L760 520 L1160 506 L1560 522 L1920 512" fill="none" stroke={colors.muted} strokeWidth={STROKE.S0} opacity={0.18} />
            {WATER.map((i) => {
              const sh = 0.5 + 0.5 * Math.sin(((frame + i * PT.water.stagger) / 14) * Math.PI * 2);
              return <rect key={i} x={80 + (i % 4) * 120} y={540 + i * 44} width={1760 - i * 120} height={PT.water.line} fill={i % 3 === 0 ? colors.accent : colors.paperMuted} opacity={0.05 + 0.1 * sh * (1 - i / 16)} />;
            })}
          </svg>

          {/* 船与她的背影：船头，不回头；尾帧成一个小点 */}
          <div
            style={{
              position: 'absolute',
              left: 420,
              top: 500,
              width: 460,
              height: 200,
              transform: `translate(${900 * t}px, ${-96 * t}px) scale(${1 - 0.86 * t})`,
              transformOrigin: 'center center',
            }}
          >
            <div style={{ position: 'absolute', left: 0, top: 66, width: '100%' }}>
              <Ferry style={{ width: '100%' }} />
            </div>
            <div style={{ position: 'absolute', left: 296, top: 6, width: 60, height: 160, transform: `rotate(${FN.clothSway(frame, 1.4)}deg)`, transformOrigin: 'bottom center' }}>
              <XiangFigure age="16" pose="back" style={{ width: '100%', height: '100%' }} />
            </div>
            {/* 船尾水线：起帧一线金，接 S11 指缝的金 */}
            <div style={{ position: 'absolute', left: 40, top: 190, width: 380, height: 1.2, background: colors.gold, opacity: 0.85 * goldLine }} />
            <div style={{ position: 'absolute', left: 70, top: 196, width: 300, height: 1, background: colors.paperMuted, opacity: 0.4 }} />
          </div>

          {/* 前景芦花：虚化掠过，尾帧落回 */}
          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, filter: 'blur(6px)' }} preserveAspectRatio="none">
            {[LEFT, RIGHT].map((group, side) =>
              group.map((i) => {
                const x = side === 0 ? 70 + i * 92 : 1630 + i * 96;
                const h = 560 + (i % 3) * 70;
                const sway = Math.sin((frame / PT.reed.period) * Math.PI * 2 + i + side) * (PT.reed.amp + 2) + 14 * lift;
                const shift = (side === 0 ? -1 : 1) * 110 * sweep;
                return (
                  <g key={`${side}-${i}`} transform={`translate(${shift} ${6 * (1 - lift)})`}>
                    <path d={`M${x} 1080 Q${x + sway * 0.4} ${1080 - h * 0.55} ${x + sway} ${1080 - h}`} fill="none" stroke={colors.ink} strokeWidth={STROKE.S2} />
                    {[0, 1, 2, 3, 4].map((k) => {
                      const a = (-46 + k * 22 + 18 * lift) * (Math.PI / 180);
                      return (
                        <path
                          key={k}
                          d={`M${x + sway} ${1080 - h} l${Math.sin(a) * 34} ${-Math.cos(a) * 34}`}
                          stroke={colors.ink}
                          strokeWidth={STROKE.S1}
                          opacity={0.85}
                        />
                      );
                    })}
                  </g>
                );
              }),
            )}
          </svg>

          <DustField act={2} count={16} seedBase="s12" />
        </CameraRig>
      </AbsoluteFill>

      <AbsoluteFill style={{ background: grade.base.color, mixBlendMode: grade.base.blend, opacity: grade.base.opacity }} />
      {grade.veil ? <AbsoluteFill style={{ background: grade.veil.gradient, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} /> : null}
    </AbsoluteFill>
  );
};

export default S12;
