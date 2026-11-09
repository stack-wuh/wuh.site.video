/* S11 · Act 2 旧屋 · 局部帧 [0,288) · 288f · 绝对 1584–1872
 *
 * 幕间呼吸：从绿灯拉开——旧站 2021 全年页面在时间轴上排成一条走廊，
 * 墨点沿轴走完 2021、停在年末（216=绝对 1800=拍90 plateau）；
 * 长后拉+横移组合（288f，全片第一次真正的慢，constant-slow），
 * 焦点保持墨点、景深拉大；末 20f 纸缘亮起带出下幕（268–288）。
 * 转场：入「切」，出「切」。无字幕（幕间呼吸）。
 * 尾帧：墨点停在 2021 年末，纸缘微光。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 288;
const STOP_AT = 216; // 墨点停 2021 年末（拍90）

/** 时间轴走廊：12 个页面卡沿轴排开（2021 全年 12 月） */
const CorridorPage: FC<{ month: number; x: number }> = ({ month, x }) => (
  <div style={{ position: 'absolute', left: x, top: 0, width: 190, height: 260, borderRadius: 4, background: colors.paper, border: `1px solid ${colors.paperMuted}`, opacity: 0.85 }}>
    <div style={{ position: 'absolute', left: 16, top: 14, fontFamily: fontFamilies.mono, fontSize: 15, color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>2021·{String(month).padStart(2, '0')}</div>
    <div style={{ position: 'absolute', left: 16, right: 16, top: 52, height: 1, background: colors.muted, opacity: 0.35 }} />
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ position: 'absolute', left: 16, top: 74 + i * 34, width: 150 - i * 30, height: 10, background: colors.muted, opacity: 0.22 }} />
    ))}
  </div>
);

const S11: FC = () => {
  const frame = useCurrentFrame();
  // 长后拉 + 横移（constant-slow）：全片第一次真正的慢
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.1, 0.88], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: interpolate(frame, [0, TOTAL], [-60, 160], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    y: 0,
    rot: 0,
  };
  // 墨点沿轴走（0–216 plateau：先匀速走，末 60f 渐停）
  const dotX = interpolate(frame, [0, STOP_AT], [180, 2180], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  // 末 20f 纸缘亮起
  const edge = interpolate(frame, [268, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={2} count={40} seedBase="s11" />

          {/* 时间轴走廊（FN-19 常驻）：横向主轴 + 12 页面卡 */}
          <div style={{ position: 'absolute', left: 140, right: 140, top: 560 }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 2, background: colors.muted, opacity: 0.5 }} />
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ position: 'absolute', left: 130 + i * 180, top: -4, width: 10, height: 10, borderRadius: 5, background: colors.muted, opacity: 0.55 }} />
            ))}
            {/* 页面卡悬于轴上 */}
            <div style={{ position: 'absolute', left: 60, top: -420 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <CorridorPage key={i} month={i + 1} x={i * 360} />
              ))}
            </div>
            {/* 墨点（焦点本体） */}
            <div
              style={{
                position: 'absolute',
                left: dotX,
                top: -12,
                width: 22,
                height: 22,
                borderRadius: 11,
                background: colors.ink,
                boxShadow: `0 0 16px 4px rgba(0,0,0,0.18)`,
                transform: 'translateX(-11px)',
              }}
            />
            {/* 走过的小墨迹（足迹感） */}
            {Array.from({ length: Math.floor((dotX - 180) / 180) }).map((_, i) => (
              <div key={i} style={{ position: 'absolute', left: 180 + i * 180, top: -5, width: 10, height: 10, borderRadius: 5, background: colors.ink, opacity: 0.25 }} />
            ))}
          </div>

          {/* 2022 纸页纸缘（末 20f 亮起带出下幕） */}
          <div
            style={{
              position: 'absolute',
              right: 90,
              top: 160,
              bottom: 160,
              width: 160,
              backgroundImage: `linear-gradient(270deg, ${FILM_COLORS.greyMist}, transparent)`,
              opacity: edge * 0.55,
              pointerEvents: 'none',
            }}
          />
        </AbsoluteFill>
      </CameraRig>
      <PaperGrain opacity={0.07} />
      <Grade id="GR-01" />
    </AbsoluteFill>
  );
};

export default S11;
