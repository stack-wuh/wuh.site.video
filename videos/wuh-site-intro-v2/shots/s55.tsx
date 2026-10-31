/* 镜 55 · Act 8 此刻 · 局部帧 [0,140) · 140f
   总结纸页铺满画幅（白边自 s54 收束溶解）：六母题——墨点、纸页、代码行、黑胶、灯、钤印——
   以 ≤12% 低透明度浮雕逐个叠印在同一张纸上（overlay + motif-still，每个约 15f）；
   镜头自纸面一角缓移到整页（CM-06）；右下极小等宽脚注于末 30f 浮现（数字不占字幕）；
   尾帧纸页翻起、打字机光标在纸面亮起；GR-02。 */
import type { FC } from 'react';
import type { CSSProperties } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS, penGlow, writeFade } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';
import { Caption } from '../components/Caption';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const MONO = fontFamilies.mono;
const SERIF = fontFamilies.serif;
const CURSOR = { x: 498, y: 451 };

const ShotSummaryPage: FC = () => {
  const frame = useCurrentFrame();
  /* 镜头：自纸面一角缓移到整页 */
  const cam = {
    scale: interpolate(frame, [0, 120], [1.05, 1], { ...CLAMP, easing: CURVES.cineEaseInOut }),
    x: interpolate(frame, [0, 120], [-26, 0], { ...CLAMP, easing: CURVES.cineEaseInOut }),
    y: interpolate(frame, [0, 120], [-18, 0], { ...CLAMP, easing: CURVES.cineEaseInOut }),
    rot: 0,
  };
  const edge = interpolate(frame, [0, 24], [0.85, 0], { ...CLAMP, easing: CURVES.cineEaseOut });
  const footnote = writeFade(frame, 110);
  const flipP = interpolate(frame, [126, 140], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const cursorIn = interpolate(frame, [128, 136], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });

  /* 母题浮雕：写入口味不高于 12%，逐个叠印 */
  const motif = (delay: number): CSSProperties => {
    const wf = writeFade(frame, delay);
    return { ...wf, opacity: 0.12 * Number(wf.opacity ?? 1) };
  };

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <CameraRig cam={cam}>
        <AbsoluteFill style={{ transform: `rotateY(${-4 * flipP}deg)`, transformOrigin: 'left center' }}>
          <DustField act={8} seedBase="s55" />
          {/* 1 墨点 */}
          <div style={{ ...motif(16), position: 'absolute', left: 320, top: 300, width: 80, height: 74, borderRadius: '50%', background: colors.ink, filter: 'blur(7px)' }} />
          {/* 2 纸页 */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            <g style={motif(31)}>
              <g transform="translate(700 250)">
                <rect x={36} y={30} width={150} height={202} fill="none" stroke={colors.ink} strokeWidth={1.6} transform="rotate(-5 111 131)" />
                <rect x={70} y={18} width={150} height={202} fill="none" stroke={colors.ink} strokeWidth={1.6} transform="rotate(4 145 119)" />
              </g>
            </g>
          </svg>
          {/* 3 代码行 */}
          <div style={{ ...motif(46), position: 'absolute', left: 1180, top: 300 }}>
            {[220, 170, 240, 130, 190, 110].map((w) => (
              <div key={w} style={{ width: w, height: 3, borderRadius: 1.5, background: colors.ink, marginBottom: 16 }} />
            ))}
          </div>
          {/* 4 黑胶（母题静帧，非特写运镜） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            <g style={motif(61)}>
              <g transform="translate(1480 400)">
                <circle cx={86} cy={86} r={78} fill="none" stroke={colors.ink} strokeWidth={1.4} />
                <circle cx={86} cy={86} r={58} fill="none" stroke={colors.ink} strokeWidth={1.1} />
                <circle cx={86} cy={86} r={36} fill="none" stroke={colors.ink} strokeWidth={1} />
                <circle cx={86} cy={86} r={7} fill={colors.ink} />
                <line x1={86} y1={8} x2={86} y2={26} stroke={colors.ink} strokeWidth={1.4} />
              </g>
            </g>
          </svg>
          {/* 5 灯 */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            <g style={motif(76)}>
              <g transform="translate(470 640)">
                <path d="M 30 74 L 110 74 L 90 30 L 50 30 Z" fill="none" stroke={colors.ink} strokeWidth={1.8} />
                <line x1={70} y1={74} x2={70} y2={150} stroke={colors.ink} strokeWidth={1.8} />
                <line x1={40} y1={152} x2={100} y2={152} stroke={colors.ink} strokeWidth={1.8} />
                {[38, 62, 86].map((x) => (
                  <line key={x} x1={x} y1={162} x2={x} y2={176} stroke={colors.ink} strokeWidth={1} opacity={0.8} />
                ))}
              </g>
            </g>
          </svg>
          {/* 6 钤印 */}
          <div style={{ ...motif(91), position: 'absolute', left: 780, top: 720 }}>
            <div style={{ width: 70, height: 70, border: `2px solid ${colors.seal}`, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 46, height: 46, border: `1px solid ${colors.seal}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: SERIF, fontSize: 24, color: colors.seal }}>忘</span>
              </div>
            </div>
          </div>
          {/* 右下脚注：数字退成最小号等宽 */}
          <div
            style={{
              ...footnote,
              position: 'absolute',
              right: 140,
              bottom: 96,
              fontFamily: MONO,
              fontSize: 14,
              letterSpacing: '0.08em',
              color: colors.muted,
              fontVariantNumeric: 'tabular-nums',
              opacity: Number(footnote.opacity ?? 0) * 0.85,
            }}
          >
            1,190 提交 · 46 篇文章 · 117 版本 · 12,651 格 · 257 归档 · 39 知识卡
          </div>
          {/* 出场：打字机光标在纸面亮起 */}
          <div style={{ position: 'absolute', left: CURSOR.x - 1.5, top: CURSOR.y - 30, width: 3, height: 60, background: colors.ink, opacity: cursorIn * 0.9 }} />
          <div style={{ ...penGlow(frame, CURSOR.x, CURSOR.y), opacity: 0.8 * cursorIn }} />
        </AbsoluteFill>
      </CameraRig>
      {/* 入场：s54 的总结纸页白边溶解 */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 14, background: FILM_COLORS.flashWhite, opacity: edge }} />
        <div style={{ position: 'absolute', left: 0, bottom: 0, right: 0, height: 14, background: FILM_COLORS.flashWhite, opacity: edge }} />
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 12, background: FILM_COLORS.flashWhite, opacity: edge }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 12, background: FILM_COLORS.flashWhite, opacity: edge }} />
      </AbsoluteFill>
      <PaperGrain opacity={0.06} />
      <Grade id="GR-02" />
      <Caption text="写作是根，代码是干；方法、工具、桌面与影像，是后来长出的枝。" appearAt={20} />
    </AbsoluteFill>
  );
};

export default ShotSummaryPage;
