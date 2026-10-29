import type { CSSProperties } from 'react';
import { colors } from '../../brand/tokens';
import { CURVES } from '../../brand/motion';

/**
 * site-film 动效令牌库 —— motion-spec.md v1.1（§1–§6）的 Remotion 落地。
 * 通用基元已上收 brand/motion，此处再导出以保持各镜 scene 的既有 import 不变；
 * 本文件只保留影片私有的结构锚点、调色、粒子与转场常量。
 */

/* 品牌级通用基元（曲线/弹性/节奏/键击/元素动效）——单一事实源在 brand/motion */
export {
  CURVES,
  SPRINGS,
  BPM,
  BEAT,
  HALF_BEAT,
  TYPE,
  inkRise,
  writeFade,
  typeChars,
  numRoll,
  paperBreathe,
  glowPulse,
  eqBars,
  dyeDrain,
  sealStamp,
  sealTilt,
} from '../../brand/motion';

/* ─── §5 结构锚点（90 BPM = 20f/拍） ─── */
export const ANCHORS = {
  typeFirstChar: 220, // 打字机首字（键击区间 220–500，3.3f/字）
  brandReveal: 500,
  act2: 700,
  blackout: 1160,
  act3: 1800,
  manifestoB: 2200,
  sealStamp: 2420, // 全片第一重音（第 121 拍）
  act4: 2800, // 白闪剪点（第 140 拍）
  eqFreeze: 3780, // 整拍冻结
  eqReprise: 3790, // 半拍再起（D-2）
  act5: 4700, // 鼓点全停
  act6: 5600,
  rush21: { from: 3440, to: 3460, scale: 1.9 },
  rush42: { from: 6700, to: 6720, scale: 1.8 },
  act7: 6550, // 反拍
  inkDrop: 7030, // 反拍（落版起手，镜 45 私有网格原点）
  finale: 7200, // 终击（第 360 拍）
} as const;

export const RUSH13 = { from: 2370, to: 2420, scale: 2.6, easing: CURVES.cineEaseIn };

/* §5.4 白闪曲线（唯一白闪，2770–2815 跨切点） */
export const WHITE_FLASH = { riseStart: 2770, cut: 2800, hold: 3, release: 12, color: '#FFF8F0' } as const;

/* ─── §6 七幕调色（GRADES，LUT 底色 + 雾光 + 全局滤镜；色值以 brand tokens 校准的规范示意值） ─── */
export type Grade = {
  id: string;
  act: number;
  lut: { color: string; blend: CSSProperties['mixBlendMode']; opacity: number };
  veil: { color: string; blend: CSSProperties['mixBlendMode']; opacity: number };
  filter: { saturate: number; brightness?: number };
};

export const GRADES: Grade[] = [
  { id: 'grade-ink-black', act: 1, lut: { color: '#16130F', blend: 'multiply', opacity: 0.38 }, veil: { color: '#16130F', blend: 'normal', opacity: 0.45 }, filter: { saturate: 0.9 } },
  { id: 'grade-ash-grey', act: 2, lut: { color: '#3A3A38', blend: 'multiply', opacity: 0.45 }, veil: { color: '#8A8A86', blend: 'screen', opacity: 0.08 }, filter: { saturate: 0.55 } },
  { id: 'grade-seal-red', act: 3, lut: { color: colors.seal, blend: 'soft-light', opacity: 0.3 }, veil: { color: colors.seal, blend: 'screen', opacity: 0.12 }, filter: { saturate: 1.05 } },
  { id: 'grade-warm-gold', act: 4, lut: { color: colors.gold, blend: 'soft-light', opacity: 0.22 }, veil: { color: '#F5E9C8', blend: 'screen', opacity: 0.06 }, filter: { saturate: 1.0 } },
  { id: 'grade-warm-paper', act: 5, lut: { color: '#F3EAD8', blend: 'soft-light', opacity: 0.3 }, veil: { color: '#FFF8EC', blend: 'screen', opacity: 0.08 }, filter: { saturate: 0.95 } },
  { id: 'grade-electric-blue', act: 6, lut: { color: '#0E1622', blend: 'multiply', opacity: 0.5 }, veil: { color: '#DCEBFF', blend: 'screen', opacity: 0.1 }, filter: { saturate: 0.85 } },
  { id: 'grade-fade-black', act: 7, lut: { color: '#060505', blend: 'multiply', opacity: 0.5 }, veil: { color: '#16130F', blend: 'normal', opacity: 0.4 }, filter: { saturate: 0.8, brightness: 0.85 } },
];

/* 钤印朱红 / 暖金光尘（值同 brand/tokens） */
export const SEAL_RED = colors.seal;
export const WARM_GOLD = colors.gold;

/* Act 6 冷白电蓝板面专用色（motion-spec §7 grade-electric-blue 同源 + agent 授权扩展） */
export const COLD = {
  bg: '#0B111B',
  panel: '#0C1626',
  panelDeep: '#0D1626',
  panelAlt: '#0E1826',
  panelLine: '#0D1728',
  gradient: 'linear-gradient(180deg, #0D1727, #0A1220)',
  pill: '#0C1524',
  electric: '#4DA3FF',
  electricSoft: '#9CC8FF',
  coldWhite: '#DCEBFF',
  coldDim: '#7E93B4',
  bleedBlack: '#04070C',
} as const;

/* ─── §3.1 光尘粒子场（七幕密度/速度/配色比） ─── */
export const DUST = {
  1: { count: 70, speed: 'slow', gold: 0.9 },
  2: { count: 25, speed: 'slow', gold: 0.85 },
  3: { count: 90, speed: 'mid', gold: 0.7 },
  4: { count: 60, speed: 'mid', gold: 0.95 },
  5: { count: 30, speed: 'slowest', gold: 0.9 },
  6: { count: 40, speed: 'fast', gold: 0.1 },
  7: { count: 90, speed: 'slow', gold: 0.9 },
} as const;
export const DUST_SPEED = { slow: 8, mid: 16, fast: 30, slowest: 3 } as const; // px/s @30fps
