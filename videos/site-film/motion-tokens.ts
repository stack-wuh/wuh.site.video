import { Easing, interpolate, spring } from 'remotion';
import type { CSSProperties } from 'react';

/**
 * site-film 动效令牌库 —— motion-spec.md v1.1（§1–§6）的 Remotion 落地。
 * 令牌名与规范一一对应；粒度：曲线基元/弹性参数/节奏网格/调色/粒子配置为常量，
 * 元素级动效为纯函数（返回 style 片段），供各镜 scene 直接引用。
 * 约束：禁 Math.random()（用 Remotion random(seed)）；镜头运动禁线性（§0.4）。
 */

/* ─── §1.1 曲线基元（4） ─── */
export const CURVES = {
  cineEaseOut: Easing.out(Easing.cubic),
  cineEaseIn: Easing.in(Easing.cubic),
  cineEaseInOut: Easing.inOut(Easing.cubic),
  cineAccent: Easing.out(Easing.back(1.2)),
  whiteFlashIn: Easing.in(Easing.quad),
  numRollOut: Easing.out(Easing.poly(4)),
} as const;

/* ─── §1.2 弹性参数（SPRINGS，spring config 表） ─── */
export const SPRINGS = {
  sealStamp: { damping: 11, stiffness: 220, mass: 0.9 },
  springPop: { damping: 9, stiffness: 180, mass: 0.8 },
  heavyGlide: { damping: 200, stiffness: 60 },
  camFollow: { damping: 200, stiffness: 90 },
  dragFollow: { damping: 14, stiffness: 160 },
} as const;

/* ─── §5 节奏网格与结构锚点（90 BPM = 20f/拍） ─── */
export const BPM = 90;
export const BEAT = 20;
export const HALF_BEAT = 10;

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

/* §5.6 键击量化 */
export const TYPE = { framesPerChar: 3.3, fast: 3, firstChar: 220 } as const;

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
  { id: 'grade-seal-red', act: 3, lut: { color: '#7A1F16', blend: 'soft-light', opacity: 0.3 }, veil: { color: '#7A1F16', blend: 'screen', opacity: 0.12 }, filter: { saturate: 1.05 } },
  { id: 'grade-warm-gold', act: 4, lut: { color: '#E9D9AE', blend: 'soft-light', opacity: 0.22 }, veil: { color: '#F5E9C8', blend: 'screen', opacity: 0.06 }, filter: { saturate: 1.0 } },
  { id: 'grade-warm-paper', act: 5, lut: { color: '#F3EAD8', blend: 'soft-light', opacity: 0.3 }, veil: { color: '#FFF8EC', blend: 'screen', opacity: 0.08 }, filter: { saturate: 0.95 } },
  { id: 'grade-electric-blue', act: 6, lut: { color: '#0E1622', blend: 'multiply', opacity: 0.5 }, veil: { color: '#DCEBFF', blend: 'screen', opacity: 0.1 }, filter: { saturate: 0.85 } },
  { id: 'grade-fade-black', act: 7, lut: { color: '#060505', blend: 'multiply', opacity: 0.5 }, veil: { color: '#16130F', blend: 'normal', opacity: 0.4 }, filter: { saturate: 0.8, brightness: 0.85 } },
];

/* 钤印朱红 / 暖金光尘（光尘粒子与红晕共用；值同 GRADES） */
export const SEAL_RED = '#7A1F16';
export const WARM_GOLD = '#E9D9AE';

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

/* ─── 元素动效纯函数（§1.2 高频令牌的 style 生成器） ─── */

/** ink-rise 墨升：上移 12px 显现（20f，cine-ease-out） */
export const inkRise = (frame: number, delay = 0): CSSProperties => {
  const p = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseOut,
  });
  return { opacity: p, transform: `translateY(${(1 - p) * 12}px)` };
};

/** write-fade 落笔显现：下沉 4px + 去模糊（14f；慢档 28f） */
export const writeFade = (frame: number, delay = 0, slow = false): CSSProperties => {
  const dur = slow ? 28 : 14;
  const p = interpolate(frame - delay, [0, dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseOut,
  });
  return { opacity: p, transform: `translateY(${(1 - p) * 4}px)`, filter: `blur(${(1 - p) * 2}px)` };
};

/** typewriter-type 键击量化：返回当前应显示的字符数（首字锚 220，3.3f/字） */
export const typeChars = (frame: number, total: number, start = TYPE.firstChar): number =>
  Math.min(total, Math.max(0, Math.floor((frame - start) / TYPE.framesPerChar)));

/** num-roll 数字滚动（30–45f，Easing.out quart） */
export const numRoll = (frame: number, delay: number, dur: number, from: number, to: number): number =>
  interpolate(frame - delay, [0, dur], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.numRollOut,
  });

/** paper-breathe 纸面呼吸（120f 周期；Act 5 振幅减半 → amp 传 0.5） */
export const paperBreathe = (frame: number, amp = 1): CSSProperties => ({
  transform: `scale(${1 + Math.sin((frame / 120) * Math.PI * 2) * 0.008 * amp}) translateY(${Math.sin((frame / 120) * Math.PI * 2) * -3 * amp}px)`,
});

/** glow-pulse 辉光脉冲（60f；心跳变体 80f 双峰；极淡档 → amp 0.4） */
export const glowPulse = (frame: number, amp = 1, period = 60): CSSProperties & { opacity: number } => ({
  opacity: 1 - amp * 0.06 + amp * 0.06 * Math.sin((frame / period) * Math.PI * 2),
});

/** eq-bounce 三墨柱 EQ（27f 循环，相位差 5f；freeze 帧后收敛 0.35） */
export const eqBars = (frame: number, freezeAt?: number): number[] =>
  [0, 1, 2].map((i) => {
    if (freezeAt !== undefined && frame >= freezeAt) {
      return interpolate(frame - freezeAt, [0, 6], [Math.abs(Math.sin((freezeAt - i * 5) / 4)), 0.35], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    }
    return 0.3 + Math.abs(Math.sin(frame / (9 + i * 1.8))) * 0.7;
  });

/** dye-drain 去色变灰（40f 慢速） */
export const dyeDrain = (frame: number, delay = 0): CSSProperties => {
  const p = interpolate(frame - delay, [0, 40], [0, 0.85], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseInOut,
  });
  return { filter: `grayscale(${p}) brightness(${1 - p * 0.1})` };
};

/** seal-stamp 落章变换（18f squash + 微旋；tilt 为 seal-tilt 终值） */
export const sealStamp = (frame: number, delay: number, fps: number, tilt: number): CSSProperties => {
  const s = spring({ frame: frame - delay, fps, config: SPRINGS.sealStamp });
  return {
    transform: `rotate(${tilt}deg) scale(${interpolate(s, [0, 1], [1.25, 0.9 + 0.1 * s])})`,
    opacity: interpolate(frame - delay, [0, 4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  };
};

/** seal-tilt 藏印微旋（hash → ±1.6°） */
export const sealTilt = (seed: string): number => {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) % 997;
  return ((h % 32) - 16) / 10;
};

