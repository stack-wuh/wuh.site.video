/* S16 · Act 3 第一行 · 局部帧 [0,72) · 72f · 绝对 2466–2538
 *
 * V3 批次 A 重做（2026-11-12 六门验收 + 审计返工单 · 重音前摇呼吸镜：呼吸语义保留，微动不断）：
 * 【承接】首帧承接 s15 尾帧交出的「89 篇汇总静住」——汇总收起，本镜在数据轴残影上锁定
 *         一个日期，为 s17「新站第一行」蓄力。
 * 【触发】主动作 = rack focus 对焦锁定：数据轴残影虚化居后（2023/2024/2025 刻度，blur 随
 *         对焦收敛），日期「2024-12-08」等宽大字虚→实（24–54 原窗，实焦 54=绝对
 *         2520=拍126 对音，絕不动）——锁定瞬间金色辉光点亮 + shockwave 单环 + 金粒微溅，
 *         HUD readout SEARCHING…→LOCKED。
 * 【展开】逐拍帧表（局部帧，fps=30，前摇呼吸镜）：
 *   [0–23]    数据轴残影驻留（blur 8 居后）+ handheld('s16-cam',0.9) + DeepSpace 星漂不断；
 *   [18–36]   shimmerSweep 微光扫过日期（搜索扫描感）；
 *   [24–54]   对焦收敛：轴上扫描亮带 0→560 画出（原窗），日期 blur 9→0、opacity 0.4→1；
 *   [54]      LOCK：glowText 金色辉光脉冲（54→58→72 收敛）+ shockwave('233,217,174') 单环
 *             + sparkBurst('s16-burst',8 粒金) + 画面呼吸一次（54–62 scale +0.012，原窗）；
 *   [54–72]   背景压暗 40%（原窗，边缘全暗、日期独占）——尾帧交接态。
 * 【交接】尾帧 = 日期实焦独占画面、边缘全暗（manifest endFrameDesc：日期实焦独占画面，
 *         边缘全暗）→ 交 s17「2024-12-08 新站第一行代码」重音镜。
 * 意义一句话：全片的目光在数据轴上搜索、对焦、锁定——2024 年 12 月 8 日，新站的生日被点亮。
 * 时间轴零改动：72f / 对焦 24–54（实焦 54 对音）/ 压暗 24–54 / 呼吸 54–62 原样；无 Caption（前摇）。
 * 转场：入「切」，出「切」。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import {
  FILM_COLORS2,
  glowText,
  handheld,
  sheenSweep,
  shockwave,
  sparkBurst,
} from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 72;
const LOCK_AT = 54; // 实焦锁定 = 绝对 2520 = 拍126（对音，絕不动）

const S16: FC = () => {
  const frame = useCurrentFrame();
  const focus = interpolate(frame, [24, LOCK_AT], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const breathe = interpolate(frame, [LOCK_AT, 62, TOTAL], [0, 0.012, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // 锁定瞬间（54）：金色单环 + 金粒微溅
  const wave = shockwave(frame, LOCK_AT, '233,217,174');
  const burst = sparkBurst('s16-burst', frame, LOCK_AT, 8, true);
  const lockGlow = interpolate(frame, [LOCK_AT, LOCK_AT + 4, TOTAL], [0.5, 0.9, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hh = handheld('s16-cam', frame, 0.9);
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.06, 1.14], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }) + breathe,
    x: hh.dx,
    y: hh.dy,
    rot: hh.rot,
  };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s16v2" stars={44} grid />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 数据轴残影（虚化背景：2024 刻度被拉近） */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 600, filter: `blur(${4 + (1 - focus) * 4}px)`, opacity: 0.4 - focus * 0.2 }}>
            <div style={{ position: 'absolute', left: 100, right: 100, top: 0, height: 2, background: FILM_COLORS2.line }} />
            <div style={{ position: 'absolute', left: 100, top: -1, width: interpolate(frame, [24, LOCK_AT], [0, 560], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut }), height: 4, background: `linear-gradient(90deg, ${FILM_COLORS2.dataDim}, ${FILM_COLORS2.data})`, boxShadow: `0 0 14px 3px rgba(212,163,115,0.35)`, opacity: focus }} />
            {['2023', '2024', '2025'].map((y, i) => (
              <span key={y} style={{ position: 'absolute', left: 180 + i * 620, top: 20, fontFamily: fontFamilies.mono, fontSize: 34, color: y === '2024' ? FILM_COLORS2.data : FILM_COLORS2.textMuted, fontVariantNumeric: 'tabular-nums' }}>{y}</span>
            ))}
          </div>
          {/* 日期特写（虚→实 rack focus；实焦即辉光；18–36 微光扫描） */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 400,
              textAlign: 'center',
              fontFamily: fontFamilies.mono,
              fontSize: 120,
              color: FILM_COLORS2.paperWhite,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.1em',
              filter: `blur(${(1 - focus) * 9}px)`,
              opacity: 0.4 + focus * 0.6,
              ...(focus > 0.9 ? glowText(FILM_COLORS2.gold, lockGlow, '233,217,174') : {}),
            }}
          >
            2024-12-08
            {frame >= 18 && frame <= 36 && focus < 0.9 ? <div style={sheenSweep(frame, 18, 18)} /> : null}
          </div>
          {/* 锁定瞬间（54）：金色单环 + 金粒，锚日期视觉中心（960, 460） */}
          {frame >= LOCK_AT ? (
            <div style={{ position: 'absolute', left: 960, top: 460, width: 0, height: 0, zIndex: 30, pointerEvents: 'none' }}>
              {wave ? <div style={wave.ring2} /> : null}
              {burst.map((p, i) => (
                <div key={`burst-${i}`} style={p.style} />
              ))}
            </div>
          ) : null}
          {/* 背景压暗 40%（边缘全暗，日期独占） */}
          <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep, opacity: interpolate(frame, [24, LOCK_AT], [0, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), pointerEvents: 'none' }} />
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · LOCATE" readout={frame >= LOCK_AT ? 'LOCKED · 2024-12-08' : 'SEARCHING…'} />
      <Grade2 id="GR2-03" />
    </AbsoluteFill>
  );
};

export default S16;
