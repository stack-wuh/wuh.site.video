/* 镜 47 · Act 6 像极了 · 局部帧 [0,150) · 150f
   云越过山脊，像水漫过堤；一束光从云隙落到窗台那页空纸上，纸亮了一下。
   前景窗台、后景云与光；PT-13 光带 ≤40% 画幅、三档硬切（CV-06）；
   末 40f 焦点由云落到纸（CM-11，只作用于景别层，不作用于人物）；GR-08；无字幕。
   尾帧：光中的空纸（TR-01 → S48）。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CM, CV, FILM, FN, GRADES, STROKE } from '../motion-tokens';

const GRADE = GRADES['GR-08'];
const SILL_Y = 858;
const PAGE = { left: 700, top: 872, width: 520, height: 100 } as const;
const band = (y: number, amp: number, h: number) =>
  `M-80 ${y} Q 160 ${y - amp} 400 ${y} T 800 ${y} T 1200 ${y} T 1600 ${y} T 2000 ${y} L 2000 ${y + h} L-80 ${y + h} Z`;
const crest = (y: number, amp: number) =>
  `M-80 ${y} Q 160 ${y - amp} 400 ${y} T 800 ${y} T 1200 ${y} T 1600 ${y} T 2000 ${y}`;

const S47: FC = () => {
  const frame = useCurrentFrame();
  const drift = FN.cloudSlow(frame, 150) * 1920;
  const lit = CV.hardStep3(Math.max(0, Math.min(1, (frame - 30) / 80)));
  const pull = CM.focusPull(Math.max(0, frame - 110), 39);
  const veil = GRADE.veil;
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* 后景：云越过山脊；焦点在末尾让给纸（放大 3% 防止景深模糊在画框边缘露底） */}
      <AbsoluteFill style={{ filter: `blur(${8 - pull}px)`, transform: 'scale(1.03)' }}>
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, ${FILM.nightBlue} 0%, ${colors.muted} 26%, ${colors.accent} 56%, ${FILM.fireGold} 76%, ${colors.gold} 92%, ${colors.paperDeep} 100%)`,
          }}
        />
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
          <g transform={`translate(${-drift * 0.5}, 0)`}>
            <path d={band(300, 42, 160)} fill={colors.paperMuted} opacity={0.2} />
            <path d={crest(300, 42)} fill="none" stroke={colors.gold} strokeWidth={STROKE.S1} opacity={0.16} />
          </g>
          <g transform={`translate(${-drift * 0.85}, 0)`}>
            <path d={band(452, 46, 190)} fill={colors.paper} opacity={0.3} />
            <path d={crest(452, 46)} fill="none" stroke={colors.gold} strokeWidth={STROKE.S1} opacity={0.24} />
          </g>
          <path d="M0 640 L210 566 L392 624 L588 548 L780 618 L986 560 L1200 626 L1418 572 L1622 630 L1920 566 L1920 1080 L0 1080 Z" fill={colors.ink} opacity={0.52} />
          <path d="M0 690 L240 646 L470 684 L700 638 L946 682 L1190 642 L1436 686 L1688 648 L1920 678" fill="none" stroke={colors.ink} strokeWidth={STROKE.S0} opacity={0.34} />
          <g transform={`translate(${-drift}, 0)`}>
            <path d={band(596, 26, 60)} fill={colors.paperMuted} opacity={0.42} />
            <path d={crest(596, 26)} fill="none" stroke={colors.gold} strokeWidth={STROKE.S1} opacity={0.3} />
          </g>
          <g transform={`translate(${-drift}, 0)`}>
            <path d={band(700, 40, 220)} fill={colors.paperDeep} opacity={0.38} />
          </g>
          {/* 云隙里那一点更亮的光：承接 S46 尾帧的同一处，光带从这里落到纸上 */}
          <ellipse cx={980} cy={520} rx={260} ry={120} fill={colors.paper} opacity={0.2} style={{ filter: 'blur(40px)' }} />
          <ellipse cx={980} cy={520} rx={150} ry={70} fill={colors.gold} opacity={0.22} style={{ filter: 'blur(40px)' }} />
        </svg>
        {/* PT-13 光带：宽 560 ≤ 40% 画幅，三档硬切；自云隙落向窗台 */}
        <div
          style={{
            position: 'absolute',
            left: 700,
            top: 470,
            width: 560,
            height: 390,
            transform: 'rotate(4deg)',
            transformOrigin: 'top center',
            background: `linear-gradient(180deg, transparent 0%, ${colors.paper} 18%, ${colors.paper} 78%, transparent 100%)`,
            opacity: 0.08 + 0.16 * lit,
            mixBlendMode: 'screen',
          }}
        />
      </AbsoluteFill>
      {/* 前景：窗台与那页空纸 */}
      <AbsoluteFill style={{ filter: `blur(${pull}px)` }}>
        <div style={{ position: 'absolute', left: -20, top: SILL_Y, width: 1960, height: 250, background: `linear-gradient(180deg, ${colors.paperDeep} 0%, ${colors.ink} 100%)`, opacity: 0.9 }} />
        <div style={{ position: 'absolute', left: 0, top: SILL_Y, width: 1920, height: 2, background: colors.paperMuted, opacity: 0.4 }} />
        <div
          style={{
            position: 'absolute',
            left: PAGE.left,
            top: PAGE.top,
            width: PAGE.width,
            height: PAGE.height,
            background: colors.paper,
            transform: 'rotate(-0.8deg)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: PAGE.left,
            top: PAGE.top,
            width: PAGE.width,
            height: PAGE.height,
            background: colors.paper,
            mixBlendMode: 'screen',
            opacity: 0.1 + 0.26 * lit,
            transform: 'rotate(-0.8deg)',
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: GRADE.base.color, mixBlendMode: GRADE.base.blend, opacity: GRADE.base.opacity, pointerEvents: 'none' }} />
      {veil ? <AbsoluteFill style={{ background: veil.gradient, mixBlendMode: veil.blend, opacity: veil.opacity, pointerEvents: 'none' }} /> : null}
    </AbsoluteFill>
  );
};

export default S47;
