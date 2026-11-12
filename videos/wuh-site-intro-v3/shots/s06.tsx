/* S06 · Act 2 旧屋 · 局部帧 [0,132) · 132f · 绝对 720–852
 *
 * V3 批次 A 重做（2026-11-12 六门验收 + 审计返工单 · 幕首呼吸镜：节拍保留，微动不断）：
 * 【承接】首帧承接 s05 尾帧交出的「右缘纸缝透光 + 2021 →」——光缝 wipe 穿越（0–24 原窗）
 *         把观众正式送进 2021 幕；spaceDeep 推界一道琥珀光缝。
 * 【触发】主动作 = 巨大琥珀 mono 年份「2021」自纵深浮起（20–60，blur 10→0 + scale 1.6→1），
 *         落定 60=绝对 780=拍39（对音，絕不动）：落定瞬间 shockwave 双环 + sheenSweep 金光
 *         扫过年份牌 + 辉光脉冲——幕牌铿锵挂上。
 * 【展开】逐拍帧表（局部帧，fps=30，幕首呼吸镜）：
 *   [0–24]    光缝 wipe 穿越（spaceDeep 自右向左推满，推界琥珀光缝；handheld('s06-cam',1.0)）；
 *   [20–60]   年份牌自纵深浮起（scale 1.6→1 + blur 去除，位移+形变入场）；
 *   [60]      落定=拍39：shockwave('212,163,115') 双环 + sheenSweep(60–76) + 辉光脉冲（60→64→80 收敛）；
 *   [60–80]   落定微沉降（translateY 10px，原窗）；
 *   [54–78]   下方档案行 staggerLand(3,54,24,'accel') 逐行 springIn 落位（位移入场，禁止原地淡入）；
 *   [80–132]  呼吸段：DeepSpace 星漂/数据流星/扫描线不断 + 年份辉光呼吸（微动不算静止）——尾帧交接态。
 * 【交接】尾帧 = 年份牌落定、档案行在下方铺开（manifest endFrameDesc：年份牌落定，旧站内页
 *         在下方铺开）→ 交 s07 金句「代码写诗，工具作画。」
 * 意义一句话：2021 的大幕被一枚年份数据牌钉开——这一年，旧站要在手艺上长出筋骨。
 * 时间轴零改动：132f / wipe 0–24 / 年份浮起 20–60（落定 60 对音）/ 沉降 60–80 / 档案面板原窗 50–90 带内重排 原样；
 * 无 Caption（幕首）。转场：入「切」出「切」。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import {
  FILM_COLORS2,
  glowText,
  handheld,
  sheenSweep,
  shockwave,
  springIn,
  staggerLand,
} from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 132;
const YEAR_LAND = 60; // 年份落定 = 绝对 780 = 拍39（对音，絕不动）
/** 档案行 springIn 落定表（accel）：[54, 66, 78] */
const ROW_LANDS = staggerLand(3, 54, 24, 'accel');

const S06: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 光缝 wipe 穿越（0–24）：spaceDeep 自右向左推满（推界琥珀光缝）
  const wipe = interpolate(frame, [0, 24], [100, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  // 年份自纵深浮起（20–60 落定）：scale 1.6→1 + blur 去除 + 落定微沉降
  const yearP = interpolate(frame, [20, YEAR_LAND], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const settle = interpolate(frame, [YEAR_LAND, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  // 落定瞬间（60）：双环 + 金光横扫 + 辉光脉冲
  const wave = shockwave(frame, YEAR_LAND, '212,163,115');
  const yearGlow = interpolate(frame, [YEAR_LAND, YEAR_LAND + 4, YEAR_LAND + 20], [0.42, 0.85, 0.42], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // 幕首呼吸（80–132）：年份辉光呼吸（微动不算静止）
  const breathe = 0.4 + 0.05 * Math.sin(frame / 13);
  const hh = handheld('s06-cam', frame, 1.0);
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.12, 1.03], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: hh.dx,
    y: interpolate(frame, [0, TOTAL], [30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) + hh.dy,
    rot: hh.rot,
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
              ...glowText(FILM_COLORS2.data, frame >= YEAR_LAND ? yearGlow * breathe : yearGlow),
            }}
          >
            2021
            {frame >= YEAR_LAND - 4 && frame <= YEAR_LAND + 12 ? <div style={sheenSweep(frame, YEAR_LAND - 4, 16)} /> : null}
          </div>

          {/* 年份落定瞬间（60）：双环冲击，锚在年份牌视觉中心（960, 340） */}
          {wave ? (
            <div style={{ position: 'absolute', left: 960, top: 340, width: 0, height: 0, zIndex: 28, pointerEvents: 'none' }}>
              <div style={wave.ring1} />
              <div style={wave.ring2} />
            </div>
          ) : null}

          {/* 下方线框数据条目面板（档案行 staggerLand springIn 落位） */}
          <div style={{ position: 'absolute', left: 220, right: 220, top: 620, opacity: interpolate(frame, [50, 64], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
            <span style={{ position: 'absolute', left: 0, top: -38, fontFamily: fontFamilies.mono, fontSize: 18, letterSpacing: '0.3em', color: FILM_COLORS2.dataDim }}>2021 · ARCHIVE</span>
            <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 1, background: FILM_COLORS2.line, opacity: 0.8 }} />
            {[0, 1, 2].map((i) => {
              const p = springIn(frame, ROW_LANDS[i], fps);
              return (
                <div key={`row-${i}`} style={{ position: 'absolute', left: 0, top: 40 + i * 78, display: 'flex', alignItems: 'center', gap: 16, opacity: Math.min(1, p * 1.4), transform: `translateX(${(1 - p) * -28}px)` }}>
                  <div style={{ width: 9, height: 9, borderRadius: 5, background: FILM_COLORS2.data, opacity: 0.6, boxShadow: `0 0 8px rgba(212,163,115,0.4)` }} />
                  <div style={{ width: 560 - i * 110, height: 13, background: FILM_COLORS2.paperWhite, opacity: 0.22 }} />
                  <div style={{ width: 70, height: 11, background: FILM_COLORS2.dataDim, opacity: 0.4 }} />
                </div>
              );
            })}
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
