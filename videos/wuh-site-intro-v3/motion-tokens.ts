import type { CSSProperties } from 'react';
import { Easing, interpolate, random, spring } from 'remotion';
import { CURVES, SPRINGS, BPM, BEAT, HALF_BEAT } from '../../brand/motion';

/**
 * 《七年，一座站》动效令牌 —— motion-spec v2 的代码落地（videos/preprod-wuh-site-intro-v3/assets/motion-spec.md）。
 * 色板与字体与 wuh.site wine 亮色主题同源（.tmp/site-design-facts.md）。
 * 纪律：禁 Math.random / Date.now；随机一律 random(seed)；镜内只用局部帧。
 */

export { CURVES, SPRINGS, BPM, BEAT, HALF_BEAT };
export const FPS = 30;

/* ─── 色板（唯一合法色源；禁 inline 色值） ─── */
export const FILM_COLORS = {
  paper: '#F5F0EC',
  paperDeep: '#EBE2D8',
  card: '#FFFBF8',
  ink: '#2A1E16',
  inkSoft: '#5A4438',
  muted: '#8A6E5C',
  hairline: 'rgba(42,30,22,0.14)',
  hairlineSoft: 'rgba(42,30,22,0.07)',
  vermillion: '#C94A44',
  seal: '#8A2A26',
  accent: '#E3B567',
  amber: '#C89060',
  white: '#FFFFFF',
} as const;

/* ─── 字体 ─── */
export const FONTS = {
  serif: '"Noto Serif SC", Georgia, "Songti SC", serif',
  sans: '"Noto Sans SC", "PingFang SC", sans-serif',
  mono: 'Menlo, "Noto Sans Mono CJK SC", monospace',
  brush: '"Ma Shan Zheng", "Noto Serif SC", serif',
} as const;

/* ─── 版式网格（1920×1080） ─── */
export const GRID = {
  W: 1920,
  H: 1080,
  margin: 120,
  content: 1680,
  gutter: 24,
  cols: 12,
  /** 12 列网格第 i 列左边 x（i=0…11） */
  colX: (i: number) => GRID.margin + i * ((GRID.content + GRID.gutter) / GRID.cols),
  /** 12 列网格第 i 列宽度 */
  colW: (span = 1) => (span * (GRID.content + GRID.gutter) - GRID.gutter) / GRID.cols,
} as const;

/* ─── 字阶 ─── */
export const T = {
  hero: 240,
  mega: 200,
  giant: 150,
  act: 112,
  quote: 72,
  line: 52,
  data: 34,
  body: 28,
  label: 22,
  meta: 14,
  micro: 12,
} as const;

/* ─── 弹性（影片增补；brand SPRINGS 已有 sealStamp / springPop / heavyGlide / dragFollow） ─── */
export const SP = {
  ...SPRINGS,
  cardLand: { damping: 26, stiffness: 160, mass: 1 },
  dotDrop: { damping: 14, stiffness: 180, mass: 0.9 },
  badgePop: { damping: 9, stiffness: 260, mass: 0.7 },
  cover: { damping: 28, stiffness: 120, mass: 1 },
  tape: { damping: 200, stiffness: 40 },
} as const;

/* ─── 纯函数工具 ─── */
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** 千分位整数（不依赖 locale，CI 与本机一致） */
export const fmtInt = (n: number): string => {
  const s = String(Math.round(n));
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/** 确定性整型种子（字符串 → 0…997） */
export const seedInt = (seed: string): number => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 997;
  return h;
};

/** 确定性随机（同 seed 同帧同值） */
export const rnd = (seed: string, i = 0) => random(`${seed}-${i}`);

/** 0→1 进度（局部帧；clamp） */
export const progress = (
  frame: number,
  start: number,
  dur: number,
  easing: (v: number) => number = CURVES.cineEaseOut,
): number =>
  interpolate(frame - start, [0, Math.max(1, dur)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

/** 弹性 0→1（局部帧） */
export const springP = (
  frame: number,
  fps: number,
  delay = 0,
  config: (typeof SP)[keyof typeof SP] = SP.springPop,
): number => spring({ frame: frame - delay, fps, config });

/** EN-01 小元素弹性入场（Y +12 → 0） */
export const springIn = (
  frame: number,
  fps: number,
  delay = 0,
  config: (typeof SP)[keyof typeof SP] = SP.springPop,
  dy = 12,
): CSSProperties => {
  const s = springP(frame, fps, delay, config);
  return {
    opacity: clamp01(interpolate(frame - delay, [0, 4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })),
    transform: `translateY(${(1 - s) * dy}px)`,
  };
};

/** NUM-01 里程表滚动（数值插值，ease-out 落定精确值；不 overshoot） */
export const roll = (
  frame: number,
  start: number,
  dur: number,
  from: number,
  to: number,
  easing: (v: number) => number = CURVES.numRollOut,
): number =>
  interpolate(frame - start, [0, Math.max(1, dur)], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

/** NUM-03 落定 slam：末 4f scale 1.04→1 + 纸面 1px 位移（返回 transform/translate） */
export const slam = (frame: number, at: number, dur = 4): { scale: number; dx: number; dy: number; hit: number } => {
  const p = interpolate(frame, [at, at + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseOut,
  });
  const hit = frame >= at && frame < at + dur ? 1 - p : 0;
  return { scale: 1 + 0.04 * (1 - p), dx: 1 * (1 - p), dy: 1 * (1 - p), hit };
};

/** TX-03 光标闪烁（方波，禁正弦） */
export const blink = (frame: number, period = 6, offset = 0): boolean => Math.floor((frame - offset) / period) % 2 === 0;

/** TX-02 打字机：当前应显示字符数 */
export const typedCount = (frame: number, start: number, framesPerChar: number, total: number): number =>
  Math.max(0, Math.min(total, Math.floor((frame - start) / framesPerChar) + 1));

/** GR-06 无缝流动带 x（线性，唯一允许线性的场景之一） */
export const tapeX = (frame: number, speed: number, width: number, phase = 0): number =>
  -(((frame * speed + phase) % width + width) % width);

/** GR-05 / EN-05 级联延迟：越后越快（末点对拍） */
export const cascadeDelay = (i: number, n: number, base: number, dur: number, accel = 0.35): number => {
  const t = n <= 1 ? 0 : i / (n - 1);
  return base + dur * (t - accel * t * t);
};

/** 子集/相位确定性排序（seed 洗牌，返回原索引序列） */
export const shuffled = (n: number, seed: string): number[] => {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rnd(seed, i) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/** INK-04 印章倾角（确定性 ±1.6°） */
export const sealTilt = (seed: string): number => ((seedInt(seed) % 32) - 16) / 10;

/** 缓动别名（令牌常用） */
export const EASE = {
  out: CURVES.cineEaseOut,
  in: CURVES.cineEaseIn,
  inOut: CURVES.cineEaseInOut,
  back: Easing.out(Easing.back(1.2)),
} as const;

/** 延迟透明度（快速工具） */
export const fadeAt = (frame: number, start: number, dur = 10): number =>
  interpolate(frame - start, [0, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });