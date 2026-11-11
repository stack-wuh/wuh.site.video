/* S27 · Act 5 灯亮 · 局部帧 [0,96) · 96f · 绝对 3990–4086
 *
 * V2 深空数据流重写（2026-11-11 品牌暖黑科技）：白闪前真空——满屏文章数据行忽然
 * 失焦、压暗（0–18 快速拉焦；18–58 压暗 spaceDeep 交叉，机位不动 scale 1.05 原样）；
 * 日期「2026-06-14」从列表缝隙里浮出（40–60，暖纸白 + 琥珀辉光）；骤停半拍
 * （58–78）；镜内白光线 scaleX 0→1 + opacity 0→0.3（86–96=绝对 4076–4086，
 * 亮度匹配交接白闪涨满）。转场：入「切」，出「切」。无字幕（白闪前真空）。
 * 尾帧：暗场中一线白光。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { FILM_COLORS2, glowText } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 96;

const S27: FC = () => {
  const frame = useCurrentFrame();
  const blur = interpolate(frame, [0, 18], [0, 7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const darken = interpolate(frame, [18, 58], [0, 0.55], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const cam = { scale: 1.05, x: 0, y: 0, rot: 0 };
  const lightW = interpolate(frame, [86, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const lightOp = interpolate(frame, [86, TOTAL], [0, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s27v2" stars={26} grid />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 满屏文章数据行（承接上镜，失焦压暗） */}
          <div style={{ position: 'absolute', left: 150, top: 70, right: 150, bottom: 70, filter: `blur(${blur}px)` }}>
            <div style={{ position: 'absolute', left: 60, top: 40, width: 420, height: 30, borderRadius: 3, background: `rgba(212,163,115,0.45)` }} />
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ position: 'absolute', left: 70, top: 170 + i * 74, width: 1000, height: 60, borderRadius: 4, background: 'rgba(23,20,16,0.85)', border: `1px solid ${FILM_COLORS2.line}`, opacity: 0.9 }} />
            ))}
          </div>
          {/* 日期自缝隙浮出（40–60） */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 430, textAlign: 'center', ...writeFade(frame, 40, true), zIndex: 30 }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 64, color: FILM_COLORS2.paperWhite, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.14em', ...glowText(FILM_COLORS2.paperWhite, 0.45, '245,240,232') }}>2026-06-14</span>
          </div>
          {/* 压暗 */}
          <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep, opacity: darken, pointerEvents: 'none' }} />
        </AbsoluteFill>
      </CameraRig>
      {/* 镜内白光线（中央一线，将亮未亮 → 30% 交白闪） */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 539,
          height: 2,
          background: FILM_COLORS2.paperWhite,
          transform: `scaleX(${lightW})`,
          opacity: lightOp,
          boxShadow: `0 0 24px 6px rgba(245,240,232,${lightOp})`,
        }}
      />
      <HudChrome label="wuh.site · CUTOVER" readout="D-DAY" />
      <Grade2 id="GR2-05" />
    </AbsoluteFill>
  );
};

export default S27;
