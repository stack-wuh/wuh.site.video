/* 镜 45 · Act 6 像极了 · 局部帧 [0,120) · 120f
   禅房窗：暗室只余窗光 → 窗外晚霞刚起，暖金压在远山脊上；窗台一页空纸。
   末 30f 极缓推 1.5%（CM-03）；PT-07 云 ≤3%；GR-08；无字幕。
   尾帧：窗框与霞（TR-01 → S46）。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CM, CV, FILM, FN, GRADES, STROKE } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';

const GRADE = GRADES['GR-08'];
const WIN = { left: 470, top: 190, width: 980, height: 640 } as const;
const SILL_Y = WIN.top + WIN.height;
const band = (y: number, amp: number, h: number) =>
  `M-60 ${y} Q 130 ${y - amp} 320 ${y} T 720 ${y} T 1120 ${y} L 1120 ${y + h} L-60 ${y + h} Z`;
const crest = (y: number, amp: number) => `M-60 ${y} Q 130 ${y - amp} 320 ${y} T 720 ${y} T 1120 ${y}`;

/** 窗内一片天：上云、远山脊、阶下云海；与 S46/S47 同一套云形。 */
const WindowSky: FC<{ frame: number }> = ({ frame }) => {
  const dusk = CV.hardStep3(Math.min(1, frame / 100));
  const drift = FN.cloudSlow(frame, 150) * WIN.width;
  return (
    <>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${FILM.nightBlue} 0%, ${colors.muted} 34%, ${colors.accent} 64%, ${FILM.fireGold} 84%, ${colors.gold} 100%)`,
        }}
      />
      {/* 晚霞刚起：一条软边的暖带，三档硬切 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 340,
          width: 980,
          height: 210,
          background: `linear-gradient(180deg, transparent 0%, ${FILM.fireGold} 38%, ${FILM.fireGold} 72%, transparent 100%)`,
          opacity: 0.12 + dusk * 0.2,
        }}
      />
      <svg viewBox="0 0 980 640" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
        <g transform={`translate(${-drift * 0.5}, 0)`}>
          <path d={band(272, 24, 72)} fill={colors.paperMuted} opacity={0.34} />
          <path d={crest(272, 24)} fill="none" stroke={colors.gold} strokeWidth={STROKE.S1} opacity={0.18} />
        </g>
        <g transform={`translate(${-drift * 0.75}, 0)`}>
          <path d={band(324, 28, 84)} fill={colors.paperDeep} opacity={0.42} />
        </g>
        <path d="M0 470 L142 436 L286 466 L424 428 L566 464 L706 434 L846 472 L980 442 L980 640 L0 640 Z" fill={colors.ink} opacity={0.5} />
        <path d="M0 512 L184 488 L338 510 L502 482 L664 510 L826 488 L980 508" fill="none" stroke={colors.ink} strokeWidth={STROKE.S0} opacity={0.36} />
        <g transform={`translate(${-drift}, 0)`}>
          <path d={band(486, 22, 160)} fill={colors.paper} opacity={0.56} />
          <path d={crest(486, 22)} fill="none" stroke={colors.gold} strokeWidth={STROKE.S1} opacity={0.3} />
        </g>
        <g transform={`translate(${-drift * 1.25}, 0)`}>
          <path d={band(548, 28, 120)} fill={colors.paperMuted} opacity={0.4} />
        </g>
      </svg>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${FILM.snowCyan} 0%, transparent 72%)`,
          opacity: 0.45 - 0.3 * dusk,
        }}
      />
    </>
  );
};

const S45: FC = () => {
  const frame = useCurrentFrame();
  const cam = CM.dollyIn(Math.max(0, frame - 90), 29, 0.015);
  const spill = 0.04 + 0.09 * CV.hardStep3(Math.min(1, frame / 100));
  const veil = GRADE.veil;
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.ink} 0%, ${colors.bg} 62%, ${colors.ink} 100%)` }} />
        <div style={{ position: 'absolute', left: WIN.left, top: WIN.top, width: WIN.width, height: WIN.height, overflow: 'hidden' }}>
          <WindowSky frame={frame} />
        </div>
        {/* 窗框：素净，只一根中棂 */}
        <div style={{ position: 'absolute', left: WIN.left - 14, top: WIN.top - 14, width: WIN.width + 28, height: 14, background: colors.paperMuted, opacity: 0.3 }} />
        <div style={{ position: 'absolute', left: WIN.left - 14, top: SILL_Y, width: WIN.width + 28, height: 14, background: colors.paperMuted, opacity: 0.34 }} />
        <div style={{ position: 'absolute', left: WIN.left - 14, top: WIN.top - 14, width: 14, height: WIN.height + 28, background: colors.paperMuted, opacity: 0.3 }} />
        <div style={{ position: 'absolute', left: WIN.left + WIN.width, top: WIN.top - 14, width: 14, height: WIN.height + 28, background: colors.paperMuted, opacity: 0.3 }} />
        <div style={{ position: 'absolute', left: WIN.left + WIN.width / 2 - 4, top: WIN.top, width: 8, height: WIN.height, background: colors.ink, opacity: 0.5 }} />
        {/* 窗台与一页空纸 */}
        <div style={{ position: 'absolute', left: WIN.left - 80, top: SILL_Y + 14, width: WIN.width + 160, height: 42, background: colors.paperDeep, opacity: 0.4 }} />
        <div style={{ position: 'absolute', left: 790, top: SILL_Y - 34, width: 300, height: 58, background: colors.paper, opacity: 0.94, transform: 'rotate(-1.2deg)' }} />
        <div style={{ position: 'absolute', left: WIN.left - 20, top: SILL_Y + 8, width: WIN.width + 40, height: 96, background: `linear-gradient(180deg, ${FILM.fireGold} 0%, transparent 100%)`, opacity: spill }} />
      </CameraRig>
      <AbsoluteFill style={{ background: GRADE.base.color, mixBlendMode: GRADE.base.blend, opacity: GRADE.base.opacity, pointerEvents: 'none' }} />
      {veil ? <AbsoluteFill style={{ background: veil.gradient, mixBlendMode: veil.blend, opacity: veil.opacity, pointerEvents: 'none' }} /> : null}
    </AbsoluteFill>
  );
};

export default S45;
