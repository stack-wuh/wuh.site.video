/* S06 · Act 2 旧屋 · 局部帧 [0,132) · 132f · 绝对 720–852
 *
 * 幕首·入旧屋：从镜 5 的纸缝推入旧站内页——巨大衬线年份「2021」自纵深浮起
 * （20–60，落定 60=绝对 780=拍39），微幅沉降后旧站内页在下方铺开；
 * 暖光转旧屋暗暖调（GR-04 交叉）。
 * 转场：入「切」（承接掀缝纸面，镜内做 wipe 穿越），出「切」。无字幕（幕首）。
 * 尾帧：年份牌落定，旧站内页在下方铺开。
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

const TOTAL = 132;

const S06: FC = () => {
  const frame = useCurrentFrame();
  // 纸缝 wipe 穿越（0–24）：缝自右向左收拢成满幅（clipPath inset 左缘退开）
  const wipe = interpolate(frame, [0, 24], [100, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  // 年份自纵深浮起（20–60 落定）：scale 1.6→1 + blur 去除 + 落定微沉降
  const yearP = interpolate(frame, [20, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const settle = interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.12, 1.03], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: 0,
    y: interpolate(frame, [0, TOTAL], [30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={2} count={26} seedBase="s06" />

          {/* 巨大衬线年份「2021」（自纵深浮起 → 落定 → 微沉降） */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 190,
              textAlign: 'center',
              fontFamily: fontFamilies.serif,
              fontSize: 300,
              lineHeight: 1,
              color: colors.ink,
              opacity: yearP * 0.9,
              transform: `scale(${1.6 + (1 - 1.6) * yearP}) translateY(${settle * 10}px)`,
              filter: `blur(${(1 - yearP) * 10}px)`,
            }}
          >
            2021
          </div>

          {/* 旧站内页在下方铺开（线框 + 墨点时间轴首行，落定后透出） */}
          <div style={{ position: 'absolute', left: 220, right: 220, top: 600, opacity: interpolate(frame, [50, 90], [0, 0.8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 1, background: colors.muted, opacity: 0.4 }} />
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ position: 'absolute', left: 0, top: 40 + i * 78, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 9, height: 9, borderRadius: 5, background: colors.accent, opacity: 0.65 }} />
                <div style={{ width: 560 - i * 110, height: 14, background: colors.ink, opacity: 0.3 }} />
                <div style={{ width: 70, height: 12, background: colors.muted, opacity: 0.24 }} />
              </div>
            ))}
            <span style={{ position: 'absolute', left: 0, top: -34, fontFamily: fontFamilies.serif, fontSize: 26, color: colors.muted, opacity: 0.8 }}>2021</span>
          </div>

          {/* 暗暖调（GR-04 转旧屋）：交叉进入 */}
          <AbsoluteFill style={{ background: FILM_COLORS.lampAmber, mixBlendMode: 'multiply', opacity: interpolate(frame, [40, 100], [0, 0.16], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), pointerEvents: 'none' }} />
        </AbsoluteFill>
      </CameraRig>

      {/* 纸缝 wipe 前景（0–24，镜内穿越语汇） */}
      {frame < 26 ? (
        <AbsoluteFill style={{ pointerEvents: 'none', clipPath: `inset(0 0 0 ${wipe}%)`, background: colors.paper }} />
      ) : null}

      <PaperGrain opacity={0.07} />
      <Grade id="GR-04" />
    </AbsoluteFill>
  );
};

export default S06;
