/* S06 · Act 2 旧屋 · 局部帧 [0,132) · 132f · 绝对 720–852
 * V2 暖黑数据流（2026-11-11 风格重构）：「纸缝推入+衬线年份牌」改写为「年度报告年份牌数据镜」——
 * ① 光缝 wipe 穿越（0–24 原窗）：spaceDeep 实色推入，推界一道琥珀光缝（镜内穿越语汇）；
 * ② 巨大琥珀 mono 年份「2021」自纵深浮起（20–60，落定 60=绝对 780=拍39 对音不变），
 *    blur 去除 + 落定微沉降（60–80 原窗），glowText 常驻；
 * ③ 下方线框数据条目面板铺开（50–90 原窗）：档案行 + 月份读数（旧站内页的数据版）。
 * 转场：入「切」出「切」。无字幕（幕首）。
 * 尾帧：年份牌落定，数据条目在下方铺开（交接态语义保持）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS2, glowText } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 132;

const S06: FC = () => {
  const frame = useCurrentFrame();
  // 光缝 wipe 穿越（0–24）：spaceDeep 自右向左推满（推界琥珀光缝）
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
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s06v2" stars={56} grid horizon />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 巨大琥珀年份「2021」（自纵深浮起 → 落定 → 微沉降；数据牌主角） */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 170,
              textAlign: 'center',
              fontFamily: fontFamilies.mono,
              fontSize: 340,
              fontWeight: 700,
              lineHeight: 1,
              color: FILM_COLORS2.data,
              fontVariantNumeric: 'tabular-nums',
              opacity: yearP * 0.95,
              transform: `scale(${1.6 + (1 - 1.6) * yearP}) translateY(${settle * 10}px)`,
              filter: `blur(${(1 - yearP) * 10}px)`,
              ...glowText(FILM_COLORS2.data, 0.42),
            }}
          >
            2021
          </div>

          {/* 下方线框数据条目面板（档案行，落定后透出） */}
          <div style={{ position: 'absolute', left: 220, right: 220, top: 620, opacity: interpolate(frame, [50, 90], [0, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
            <span style={{ position: 'absolute', left: 0, top: -38, fontFamily: fontFamilies.mono, fontSize: 18, letterSpacing: '0.3em', color: FILM_COLORS2.dataDim }}>2021 · ARCHIVE</span>
            <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 1, background: FILM_COLORS2.line, opacity: 0.8 }} />
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ position: 'absolute', left: 0, top: 40 + i * 78, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 9, height: 9, borderRadius: 5, background: FILM_COLORS2.data, opacity: 0.6, boxShadow: `0 0 8px rgba(212,163,115,0.4)` }} />
                <div style={{ width: 560 - i * 110, height: 13, background: FILM_COLORS2.paperWhite, opacity: 0.22 }} />
                <div style={{ width: 70, height: 11, background: FILM_COLORS2.dataDim, opacity: 0.4 }} />
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </CameraRig>

      {/* 光缝 wipe 前景（0–24，镜内穿越语汇；推界一道琥珀光缝） */}
      {frame < 26 ? (
        <>
          <AbsoluteFill style={{ pointerEvents: 'none', clipPath: `inset(0 0 0 ${wipe}%)`, background: FILM_COLORS2.spaceDeep }} />
          <div
            style={{
              position: 'absolute',
              left: `${wipe}%`,
              top: 0,
              bottom: 0,
              width: 3,
              background: FILM_COLORS2.data,
              opacity: 0.75,
              boxShadow: `0 0 22px 6px rgba(212,163,115,0.45)`,
              pointerEvents: 'none',
            }}
          />
        </>
      ) : null}

      <HudChrome label="wuh.site · ARCHIVE" readout="2021 · ACT 02" />
      <Grade2 id="GR2-04" />
    </AbsoluteFill>
  );
};

export default S06;
