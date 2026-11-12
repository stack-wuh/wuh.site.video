/* S12 · Act 3 第一行 · 局部帧 [0,90) · 90f · 绝对 1872–1962
 *
 * V3 批次 A 重做（2026-11-12 六门验收 + 审计返工单）：
 * 【承接】首帧承接 s11 尾帧交出的「2021 年末 + 右缘流光」——「纸翻」转场翻过这一年，
 *         本镜 2022 档案数据页整版入画，幕 3「第一行」开页。
 * 【触发】主动作 = 档案数据页 springIn 落版（0–14 与原 drop 窗一致，位移入场），随后
 *         七行档案行 staggerLand 逐行滑入（8–36）、页眉日期+题名落位、琥珀强调条生长。
 * 【展开】逐拍帧表（局部帧，fps=30）：
 *   [0–14]    档案页 springIn 落版（y 18→0 + scale 0.985→1）+ handheld('s12-cam',0.9)；
 *   [8–36]    七行档案行 staggerLand(7,8,28,'accel') 逐行 springIn 滑入（translateX −24→0），
 *             行首刻度 01–07 随行点亮；
 *   [10–24]   页眉 2022-02-08 + 「2022 年度总结」writeFade 落位；
 *   [40–60]   琥珀强调条 chartBar 生长（40 起 20f）+ 辉光（数据条主角化）；
 *   [58–72]   shimmerSweep 微光横扫页面（档案扫描感）；
 *   [18–90]   缓慢下摇 4%（cam y 0→40 原窗）+ DeepSpace 星漂——尾帧交接态。
 * 【交接】尾帧 = 档案页整版入画静住（manifest endFrameDesc：灰调纸页整版入画，交接态：
 *         深色档案页）→ 交 s13 金句暖段（同页展开）。
 * 意义一句话：翻过 2021，一份 2022 年度总结的档案页整版落定——这一年的故事从这份档案里长出来。
 * 时间轴零改动：90f / 落版 0–14 / 下摇 18–90 原样；无 Caption（入页）。
 * 转场：入「纸翻」出「切」→ ShotShell 光晕呼吸，镜文件零工作。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import {
  FILM_COLORS2,
  chartBar,
  handheld,
  shimmerSweep,
  springIn,
  staggerLand,
  writeFade,
} from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 90;
/** 七行档案行 springIn 落定表（accel）：[8, 13, 18, 23, 26, 31, 36] */
const ROW_LANDS = staggerLand(7, 8, 28, 'accel');

const S12: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 档案页 springIn 落版（0–14）
  const drop = springIn(frame, 0, fps);
  const hh = handheld('s12-cam', frame, 0.9);
  const cam = {
    scale: 1.04,
    x: hh.dx,
    y: interpolate(frame, [18, TOTAL], [0, 40], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }) + hh.dy,
    rot: hh.rot,
  };
  // 琥珀强调条生长（40–60）
  const accent = chartBar(frame, 40, 20, 1);

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s12v2" stars={54} grid />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 档案数据页（线框卡整版，springIn 落版） */}
          <div
            style={{
              position: 'absolute',
              left: 170,
              top: 90,
              right: 170,
              bottom: 90,
              borderRadius: 8,
              background: FILM_COLORS2.panel,
              border: `1px solid ${FILM_COLORS2.grid}`,
              boxShadow: `0 24px 60px rgba(0,0,0,0.55), 0 0 44px rgba(212,163,115,0.08)`,
              opacity: Math.min(1, drop * 1.4),
              transform: `translateY(${(1 - drop) * 18}px) scale(${0.985 + drop * 0.015})`,
            }}
          >
            {/* 页眉：角标日期（标识）+ 题名 + 琥珀强调条 */}
            <div style={{ position: 'absolute', left: 50, top: 40, display: 'flex', alignItems: 'center', gap: 20, ...writeFade(frame, 10) }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 20, color: FILM_COLORS2.textMuted, fontVariantNumeric: 'tabular-nums' }}>2022-02-08</span>
              <span style={{ fontFamily: fontFamilies.serif, fontSize: 26, color: FILM_COLORS2.paperWhite, opacity: 0.9 }}>2022 年度总结</span>
              <div
                style={{
                  width: `${Math.max(2, accent.widthPct)}%`,
                  minWidth: 8,
                  height: 3,
                  background: FILM_COLORS2.data,
                  opacity: 0.8,
                  boxShadow: `0 0 10px rgba(212,163,115,0.4)`,
                }}
              />
            </div>
            <div style={{ position: 'absolute', left: 50, right: 50, top: 110, height: 1, background: FILM_COLORS2.line, opacity: 0.6 }} />
            {/* 数据行占位（staggerLand 逐行滑入，位移入场） */}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const p = springIn(frame, ROW_LANDS[i], fps);
              return (
                <div
                  key={`row-${i}`}
                  style={{
                    position: 'absolute',
                    left: 50,
                    top: 150 + i * 74,
                    width: i % 3 === 2 ? 900 : 1340 - (i % 2) * 180,
                    height: 22,
                    background: FILM_COLORS2.paperWhite,
                    opacity: 0.1 * Math.min(1, p * 1.4),
                    transform: `translateX(${(1 - p) * -24}px)`,
                  }}
                />
              );
            })}
            {/* 行首刻度（档案编号感，随行点亮） */}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const p = springIn(frame, ROW_LANDS[i] + 4, fps);
              return (
                <span
                  key={`tick-${i}`}
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: 152 + i * 74,
                    fontFamily: fontFamilies.mono,
                    fontSize: 13,
                    color: FILM_COLORS2.dataDim,
                    opacity: 0.6 * p,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              );
            })}
            {/* 微光横扫（58–72，档案扫描感） */}
            {frame >= 58 && frame <= 72 ? <div style={{ ...shimmerSweep(frame, 58, 14), borderRadius: 8 }} /> : null}
          </div>
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · ARCHIVE" readout="2022-02-08" />
      <Grade2 id="GR2-03" />
    </AbsoluteFill>
  );
};

export default S12;
