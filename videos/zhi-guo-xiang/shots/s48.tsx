/* 镜 48 · Act 6 像极了 · 局部帧 [0,120) · 120f
   峨眉山门：石阶上立着年轻女弟子（风陵师太）——与十六岁郭襄同源剪影 ×0.93、双环髻、雪青；
   单层衣、无腰带结、无手、发线 2 条、衣褶 1 条；身高 279px（6.6 头身）、脚底 y=713、x=0.52W。
   低机位仰视固定（CM-02 半幅微漂）；袖口 4px 被风吹起三次（FN-09）；PT-07 阶下雾；GR-08；无字幕。
   尾帧：阶上背影（TR-01 → S49）。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CM, FILM, FN, GRADES, STROKE } from '../motion-tokens';
import { FenglingFigure } from '../components/Figure';
import { Gate } from '../components/Objects';

const GRADE = GRADES['GR-08'];
const FIG_H = 300 * 0.93;
const FIG_W = (FIG_H * 120) / 320;
const FOOT_Y = 0.66 * 1080;
const FIG_X = 0.52 * 1920;
const STEP_Y = Array.from({ length: 11 }, (_, i) => 660 + 20 * i + 1.8 * i * i);

const S48: FC = () => {
  const frame = useCurrentFrame();
  const cam = CM.drift(frame, 2);
  const sway = FN.clothSway(frame, 4, 0);
  const drift = FN.cloudSlow(frame, 220) * 1920;
  const veil = GRADE.veil;
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${FILM.nightBlue} 0%, ${colors.muted} 28%, ${colors.accent} 58%, ${FILM.fireGold} 80%, ${colors.gold} 100%)`,
        }}
      />
      <AbsoluteFill style={{ transform: `translate(${cam.x}px, ${cam.y}px) rotate(${cam.rot}deg)` }}>
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
          {/* 高空两层云 */}
          <g transform={`translate(${-drift * 0.5}, 0)`}>
            <path d="M-80 214 Q 260 176 560 214 T 1160 214 T 1760 214 L 2000 214 L 2000 300 L-80 300 Z" fill={colors.paperMuted} opacity={0.16} />
            <path d="M-80 268 Q 300 236 640 268 T 1320 268 T 2000 268" fill="none" stroke={colors.gold} strokeWidth={STROKE.S1} opacity={0.16} />
            <path d="M-80 330 Q 320 300 660 330 T 1340 330 T 2000 330 L 2000 410 L-80 410 Z" fill={colors.paperDeep} opacity={0.2} />
          </g>
          {/* 门前平台与 11 级石阶（级高递减、越近越宽） */}
          <rect x={600} y={596} width={720} height={64} fill={colors.paperDeep} opacity={0.18} />
          <path d="M600 596 L1320 596" stroke={colors.muted} strokeWidth={STROKE.S0} opacity={0.3} />
          {STEP_Y.map((y, i) => {
            const y2 = STEP_Y[i + 1] ?? 1080;
            const half = 330 + i * 58;
            return (
              <g key={y}>
                <rect x={960 - half} y={y} width={half * 2} height={y2 - y} fill={colors.paperDeep} opacity={0.05 + i * 0.02} />
                <path d={`M${960 - half} ${y} L${960 + half} ${y}`} stroke={colors.muted} strokeWidth={STROKE.S0} opacity={0.32} />
              </g>
            );
          })}
          {/* 雾在阶下：三条横线 */}
          <path d="M210 930 L1710 930" stroke={colors.paper} strokeWidth={STROKE.S0} opacity={0.28} />
          <path d="M310 975 L1610 975" stroke={colors.paper} strokeWidth={STROKE.S0} opacity={0.2} />
          <path d="M410 1020 L1510 1020" stroke={colors.paper} strokeWidth={STROKE.S0} opacity={0.14} />
        </svg>
        {/* 山门在她身后：灭点居中偏上 */}
        <Gate gap={1} style={{ position: 'absolute', left: 700, top: 96, width: 520, height: 520, opacity: 0.88 }} />
        {/* 弟子的背影：只给轮廓（L1），袖口 4px 随风三次 */}
        <div style={{ position: 'absolute', left: FIG_X - FIG_W / 2, top: FOOT_Y - FIG_H, width: FIG_W, height: FIG_H }}>
          <FenglingFigure sway={sway} style={{ width: '100%', height: '100%', display: 'block' }} />
        </div>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, transparent 72%, ${colors.paperMuted} 100%)`, opacity: 0.14 }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: GRADE.base.color, mixBlendMode: GRADE.base.blend, opacity: GRADE.base.opacity, pointerEvents: 'none' }} />
      {veil ? <AbsoluteFill style={{ background: veil.gradient, mixBlendMode: veil.blend, opacity: veil.opacity, pointerEvents: 'none' }} /> : null}
    </AbsoluteFill>
  );
};

export default S48;
