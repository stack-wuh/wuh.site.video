/* S20 · Act 4 留白 · 局部帧 [0,108) · 108f · 绝对 2928–3036
 *
 * 曲线断电：暗场里 7 点连线余光熄灭（0–16）；提交曲线自 2024-12 高点滑落
 * （★DAT-06 CHART-CUT，16–52 ease-in 骤停=绝对 2980=拍149 对音），
 * 2025-06 三点、2025-07 一点后折线反向收缩+分段熄灭（52–72），
 * 四墨点坠落悬停（52–76，间隔 8/6/5/5）；极缓后退（pull）暗场扩大。
 * 转场：入「切」（承接上镜暗场），出「切」（同材质硬切）。无字幕（先看后说）。
 * 尾帧：四墨点悬停暗场。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { chartCut } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 108;
const CUT_AT = 52; // 绝对 2980 = 拍149

/** 原始曲线路径（高点→下滑→断点）：2024-12 高点 10 → 2025-06 三点 → 2025-07 一点 */
const CURVE = 'M 480 260 L 700 430 L 790 500 L 880 545 L 980 585';

const S20: FC = () => {
  const frame = useCurrentFrame();
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.0, 0.965], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: 0,
    y: 0,
    rot: 0,
  };
  // 7 点余光熄灭（0–16）
  const afterglow = 1 - interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // ★DAT-06 断电：已描曲线反向收缩（16–52 骤停；真长度驱动，路径 d 见 CURVE）
  const cut = chartCut(frame, 16, 36, CURVE);
  // 四墨点坠落悬停（52 起，间隔 8/6/5/5）
  const DOT_DELAY = [52, 60, 66, 71];
  const DOT_XY = [
    { x: 880, y: 545 },
    { x: 940, y: 575 },
    { x: 985, y: 596 },
    { x: 1020, y: 610 },
  ];

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={4} count={12} seedBase="s20" />

          {/* 上镜 7 点余光（熄灭中） */}
          {afterglow > 0 ? (
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: afterglow * 0.5, pointerEvents: 'none' }}>
              <path d="M 330 640 L 505 430 L 680 220 Q 1450 380, 1700 470" fill="none" stroke={colors.paper} strokeWidth={1.4} />
            </svg>
          ) : null}

          {/* 提交曲线（断电） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d={CURVE} fill="none" stroke={colors.paper} strokeWidth={2.2} {...cut.stroke} opacity={cut.opacity} />
          </svg>
          {/* 曲线分段熄灭后的残迹（52–72 折线收缩） */}
          {frame >= CUT_AT && frame < 76 ? (
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: interpolate(frame, [CUT_AT, 72], [0.35, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), pointerEvents: 'none' }}>
              <path d="M 480 260 L 700 430" fill="none" stroke={colors.paper} strokeWidth={1.6} opacity={0.5} />
            </svg>
          ) : null}

          {/* 四墨点坠落悬停（间隔 8/6/5/5） */}
          {DOT_XY.map((p, i) => {
            const local = frame - DOT_DELAY[i];
            if (local < 0) return null;
            const drop = interpolate(local, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
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
                  background: colors.ink,
                  opacity: 0.92,
                  boxShadow: '0 0 14px 3px rgba(0,0,0,0.25)',
                }}
              />
            );
          })}

          {/* 暗场扩大（极缓后退 + GR-01） */}
          <AbsoluteFill style={{ background: colors.bg, opacity: interpolate(frame, [76, TOTAL], [0.1, 0.35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), pointerEvents: 'none' }} />
        </AbsoluteFill>
      </CameraRig>
      <PaperGrain opacity={0.06} />
      <Grade id="GR-01" />
    </AbsoluteFill>
  );
};

export default S20;
