/* S20 · Act 4 留白 · 局部帧 [0,108) · 108f · 绝对 2928–3036
 *
 * 「先看后说」：现有曲线断电内容保留，节拍补到 ≥4（键击月标 + 断电冲击环 + 点坠落 + 压暗）。
 * 编排四问：
 *   承接 = s19 交出的亮点连线+前方暗场（首帧七点余光熄灭中）；
 *   触发 = 提交曲线自高点滑落后「断电骤停」（chartCut ease-in）——断电即本镜主动作，HUD 读数同步切换；
 *   展开 = 帧级节奏：0–16 余光熄灭 → 16–52 曲线画/收（键击月标 2024-12/2025-06/2025-07 随段显字）→ 52 断电重音（冲击环+溅粒）→ 52–76 四点坠落悬停（间隔 8/6/5/5）→ 76–108 暗场扩大；
 *   交接 = 尾帧：四数据点悬停暗场（交接态：暗场+四点，交 s21 四步长静）。
 * 逐拍帧表（fps=30）：
 *   [0–16]   上镜七点余光残线淡出（afterglow 1→0）；
 *   [16–44]  CURVE 反向收缩+分段熄灭（chartCut 真长度 ease-in）；月标键击：2024-12 起 18（2f/字）、2025-06 起 28、2025-07 起 38；
 *   [52]     断电骤停 = 绝对 2980 = ANCHORS.curveCut = 拍149 对音（絕不动）：shockwave 双环 rgb(212,163,115) + sparkBurst×12 @ 断点 (980,585)，HUD STREAM→PAUSED；
 *   [52–76]  四数据点坠落悬停（52/60/66/71，各 8f drop 26px）；
 *   [76–108] spaceDeep 压暗 0.1→0.35 + cam 极缓后退 1.0→0.965 + handheld 微动不断。
 * 时间轴零改动：108f / CUT_AT 52 / 曲线窗 16–52 / 点坠落窗 原样；转场：入「切」，出「切」。无字幕（先看后说）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { chartCut, FILM_COLORS2, handheld, shockwave, sparkBurst, springIn, typeCharsAt } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 108;
const CUT_AT = 52; // 绝对 2980 = 拍149

/** 原始曲线路径（高点→下滑→断点）：2024-12 高点 10 → 2025-06 三点 → 2025-07 一点 */
const CURVE = 'M 480 260 L 700 430 L 790 500 L 880 545 L 980 585';
/** 断点（冲击锚点） */
const CUT_X = 980;
const CUT_Y = 585;
/** 月标键击（真实月份段标；随曲线段显字，2f/字） */
const MONTH_TAGS = [
  { text: '2024-12', start: 18, x: 430, y: 208 },
  { text: '2025-06', start: 28, x: 606, y: 462 },
  { text: '2025-07', start: 38, x: 1014, y: 648 },
];

const S20: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hh = handheld('s20-cam', frame, 0.8);
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.0, 0.965], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: hh.dx,
    y: hh.dy,
    rot: hh.rot,
  };
  // 7 点余光熄灭（0–16）
  const afterglow = 1 - interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // ★DAT-06 断电：已描曲线反向收缩（16–52 骤停；真长度驱动，路径 d 见 CURVE）
  const cut = chartCut(frame, 16, 36, CURVE);
  // 断电重音（52=拍149 对音）：冲击双环 + 溅粒
  const wave = shockwave(frame, CUT_AT);
  const burst = sparkBurst('s20-cut', frame, CUT_AT, 12);
  // 四数据点坠落悬停（52 起，间隔 8/6/5/5）
  const DOT_DELAY = [52, 60, 66, 71];
  const DOT_XY = [
    { x: 880, y: 545 },
    { x: 940, y: 575 },
    { x: 985, y: 596 },
    { x: 1020, y: 610 },
  ];

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s20v2" stars={40} grid />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 上镜 7 点余光（熄灭中，数据色残线） */}
          {afterglow > 0 ? (
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: afterglow * 0.5, pointerEvents: 'none' }}>
              <path d="M 330 640 L 505 430 L 680 220 Q 1450 380, 1700 470" fill="none" stroke={FILM_COLORS2.dataDim} strokeWidth={1.4} />
            </svg>
          ) : null}

          {/* 提交曲线（断电，琥珀数据色） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d={CURVE} fill="none" stroke={FILM_COLORS2.data} strokeWidth={2.2} {...cut.stroke} opacity={cut.opacity} style={{ filter: 'drop-shadow(0 0 6px rgba(212,163,115,0.3))' }} />
          </svg>
          {/* 曲线分段熄灭后的残迹（52–72 折线收缩） */}
          {frame >= CUT_AT && frame < 76 ? (
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: interpolate(frame, [CUT_AT, 72], [0.35, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), pointerEvents: 'none' }}>
              <path d="M 480 260 L 700 430" fill="none" stroke={FILM_COLORS2.dataDim} strokeWidth={1.6} opacity={0.5} />
            </svg>
          ) : null}

          {/* 月标键击（2024-12 / 2025-06 / 2025-07，随曲线段 typeCharsAt 显字；标识不滚） */}
          {MONTH_TAGS.map((t) => {
            const typed = typeCharsAt(frame, t.text.length, t.start, 2);
            if (typed <= 0) return null;
            return (
              <span
                key={t.text}
                style={{
                  position: 'absolute',
                  left: t.x,
                  top: t.y,
                  fontFamily: fontFamilies.mono,
                  fontSize: 16,
                  color: FILM_COLORS2.textMuted,
                  opacity: 0.72,
                  fontVariantNumeric: 'tabular-nums',
                  whiteSpace: 'pre',
                }}
              >
                {t.text.slice(0, typed)}
              </span>
            );
          })}

          {/* 断电重音（52=拍149 对音）：冲击双环 + 溅粒（锚断点，zIndex 高于曲线） */}
          {wave ? (
            <div style={{ position: 'absolute', left: CUT_X, top: CUT_Y, width: 0, height: 0, zIndex: 30 }}>
              <div style={wave.ring1} />
              <div style={wave.ring2} />
            </div>
          ) : null}
          <div style={{ position: 'absolute', left: CUT_X, top: CUT_Y, width: 0, height: 0, zIndex: 30 }}>
            {burst.map((p, i) => (
              <div key={`burst-${i}`} style={p.style} />
            ))}
          </div>

          {/* 四数据点坠落悬停（间隔 8/6/5/5，琥珀辉光；springIn 位移入场） */}
          {DOT_XY.map((p, i) => {
            const local = frame - DOT_DELAY[i];
            if (local < 0) return null;
            const drop = interpolate(local, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
            const pop = springIn(frame, DOT_DELAY[i], fps, 14, 180, 0.8);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: p.x - 13,
                  top: p.y + drop * 26 - 13,
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  background: FILM_COLORS2.data,
                  opacity: Math.min(0.92, pop * 1.2),
                  transform: `scale(${0.5 + pop * 0.5})`,
                  boxShadow: `0 0 16px 4px rgba(212,163,115,0.3)`,
                }}
              />
            );
          })}

          {/* 暗场扩大（极缓后退 + spaceDeep 收进） */}
          <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep, opacity: interpolate(frame, [76, TOTAL], [0.1, 0.35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), pointerEvents: 'none' }} />
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · COMMITS" readout={frame >= CUT_AT ? 'PAUSED' : 'STREAM · 2024-12'} />
      <Grade2 id="GR2-04" />
    </AbsoluteFill>
  );
};

export default S20;
