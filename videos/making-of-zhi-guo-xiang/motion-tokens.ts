import type { CSSProperties } from 'react';
import { Easing } from 'remotion';

/**
 * 《致郭襄》创作历程片 · 动效令牌库 —— motion-spec v1 全量落地（前缀 MO-）。
 * 品牌通用基元（曲线/弹性/节奏/键击）再导出；本文件只放历程片私有节奏网格、
 * 对比语言、数据卡语言与字幕系统。场景禁止内联色值/字体；随机只用 random(seed)。
 */

export { CURVES, SPRINGS, BEAT, TYPE, writeFade } from '../../brand/motion';
export { colors } from '../../brand/tokens';

export const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/* 纸纹垫底参数（ShotShell 引用；与正片同源） */
export const PT = {
  paperGrain: { opacity: 0.06, blend: 'overlay' as CSSProperties['mixBlendMode'] },
} as const;

/* MO-EASE-* 曲线（motion-spec §一） */
export const MO_EASE = {
  inout: Easing.bezier(0.65, 0, 0.35, 1),
  out: Easing.bezier(0.22, 1, 0.36, 1),
  back: Easing.bezier(0.34, 1.56, 0.64, 1),
} as const;

/* MO-BEAT-* 节拍（快闪/三连闪/呼吸窗） */
export const MO_BEAT = { flash: 25, triple: 40, breatheMin: 30, breatheMax: 90 } as const;

/* MO-COUNTER-* 版本计数角标（本片视觉签名） */
export const MO_COUNTER = {
  digitPopFrames: 8,
  digitPopFrom: 0.92,
  finalFrames: 120,
  finalTo: 1.15,
} as const;

/* MO-CUT-FLIP / MO-CMP-LABEL / MO-SPEED-08 对比语言（演化骨架专用） */
export const MO_CMP = { flipGap: 15, labelFade: 6, speed08: 0.8 } as const;

/* MO-CARD-* 数据卡语言（文档快照 / CI 卡 / 波形卡） */
export const MO_CARD = {
  riseFrames: 12,
  riseShiftPx: 24,
  stackStep: 4,
  stackBounce: 2,
  typePerChar: 2,
  cursorCycle: 8,
} as const;

/* MO-X-STAMP 红叉砸落（SEAL 同构，×4 连击） */
export const MO_X_STAMP = { hits: 4, gap: 12, scaleFrom: 1.6, hitFrames: 6 } as const;

/* MO-GRID-LIGHT CI 方块波次点亮 */
export const MO_GRID = { waveStep: 6, greenFrames: 4 } as const;

/* MO-WAVE-* 波形错位 / 吸附 */
export const MO_WAVE = { driftPeakSec: -16.17, snapFrames: 4 } as const;

/* MO-CAP-* 字幕系统：一镜一句；安全窗 = 镜首入遮罩后 side / 镜尾出遮罩前 side */
export const MO_CAP = { inFrames: 4, outFrames: 4, side: 12, shiftPx: 6 } as const;

/* MO-NUM-* / MO-CHART-* 数据动效（2026-11-08 增补，ai-director §7.5：凡量必滚、静态展示=违规）。
 * 纪律：量才滚、标识不滚（run 号/ID 是身份）；数字落定帧对齐音效点；tabular-nums 防抖。 */
export const MO_NUM = {
  rollFrames: 40, // 普通量 0→N 滚动（ease-out 收尾）
  odometerFrames: 8, // 滚轮每一位滚动一档
  odometerStagger: 2, // 滚轮位间错峰
  slamFrames: 40, // 冲线落定：双数同滚同停
  slamPop: 0.05, // 落定回弹幅度（1.05→1）
} as const;
export const MO_CHART = {
  growFrames: 20, // 单根条形从基线立起
  growStagger: 2, // 条形间错峰
  drawFrames: 60, // 折线描画
} as const;

/* 八幕帧界（真源 shots-manifest.json acts，此处为人读镜像，供分幕调色/节拍用） */
export const ACT_FRAMES = [
  { act: 1, start: 0, end: 360 },
  { act: 2, start: 360, end: 1500 },
  { act: 3, start: 1500, end: 2400 },
  { act: 4, start: 2400, end: 3450 },
  { act: 5, start: 3450, end: 4830 },
  { act: 6, start: 4830, end: 5730 },
  { act: 7, start: 5730, end: 6480 },
  { act: 8, start: 6480, end: 7680 },
] as const;
