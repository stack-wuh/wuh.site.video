import type { CSSProperties } from 'react';
import { interpolate, random } from 'remotion';
import { colors } from '../../brand/tokens';
import { CURVES } from '../../brand/motion';

/**
 * wuh-site-intro-v2 动效令牌库 —— motion-spec v2（124 枚）的 Remotion 落地。
 * 品牌级通用基元（曲线/弹性/节奏/键击/元素动效）上收 brand/motion，此处再导出；
 * 本文件只放影片私有的锚点、调色、数据口径与 FN-11–FN-43 新增函数。
 * 约束：场景内禁止内联色值/字体；粒子随机一律 random(seed)；镜头运动禁线性。
 */

/* 品牌级通用基元——单一事实源在 brand/motion */
export {
  CURVES,
  SPRINGS,
  BPM,
  BEAT,
  HALF_BEAT,
  TYPE,
  inkRise,
  writeFade,
  numRoll,
  paperBreathe,
  glowPulse,
  eqBars,
  dyeDrain,
  sealStamp,
  sealTilt,
} from '../../brand/motion';

/* ─── 表 3.7.1 影片私有色（场景内禁止内联色值） ─── */
export const FILM_COLORS = {
  grey: '#3A3A38',
  greyMist: '#8A8A86',
  goldMist: '#F5E9C8',
  paperMist: '#FFF8EC',
  flashWhite: '#FFF8F0',
  blankPaper: '#F6F1E7',
  nearBlack: '#060505',
  statusGreen: '#6FA36F',
  lampAmber: '#D9A05B',
  dawnLight: '#F3E6C8',
  wireGrey: '#B9B4A8',
} as const;

/* ─── §5 节奏锚点（storyboard v3 · 7658 时间轴） ─── */
export const ANCHORS = {
  firstInk: 80, // 第一滴墨触纸（第 5 拍）
  inscription: 240, // 题记落定（第 13 拍）
  countdownZero: 468, // 30 天倒计时归零
  act2: 720, // 第 37 拍 · 纸缝穿越
  act3: 1872,
  firstLine: 2520, // 第一记重音：提交回车（第 127 拍）
  act4: 2862,
  act5: 3642,
  whiteFlash: 4000, // 唯一纯白峰值（第 201 拍）
  sealRestart: 4380, // 重启钤印（第 220 拍）
  act6: 4440, // 入院（第 223 拍）
  needle: 4920, // 唱针落定（第 247 拍）
  sealContact: 5600, // 联系钤印（第 279 拍）
  act7: 5640,
  act8: 6708,
  versionRain: 6896, // 116 点落满（第 345.8 拍）
  playerOn: 7036, // 播放器可用（第 352.8 拍）
  quoteSettle: 7236, // 方法论金句（第 362.8 拍）
  treeStart: 7266, // 衍生树起（第 364.3 拍）
  pageSettle: 7566, // 总结纸页（第 379.3 拍）
  typewriter: 7706, // 打字机起（第 386.3 拍）
  zero: 7934, // 归零（第 397.7 拍）
} as const;

/* ─── 幕界（帧号不动） ─── */
export const ACT_FRAMES = [
  { act: 1, start: 0, end: 720 },
  { act: 2, start: 720, end: 1872 },
  { act: 3, start: 1872, end: 2862 },
  { act: 4, start: 2862, end: 3642 },
  { act: 5, start: 3642, end: 4440 },
  { act: 6, start: 4440, end: 5640 },
  { act: 7, start: 5640, end: 6708 },
  { act: 8, start: 6708, end: 7934 },
] as const;

/* ─── §3.7 八幕调色（GRADES：底色层 + 雾光层 + 全局滤镜） ─── */
export type GradeId = 'GR-01' | 'GR-02' | 'GR-03' | 'GR-04' | 'GR-05' | 'GR-06' | 'GR-07' | 'GR-08';

export type Grade = {
  id: GradeId;
  base: { color: string; blend: CSSProperties['mixBlendMode']; opacity: number };
  veil?: { gradient: string; blend: CSSProperties['mixBlendMode']; opacity: number };
  saturate: number;
  brightness?: number;
};

const VIGNETTE =
  'linear-gradient(180deg, rgba(0,0,0,0.38), rgba(0,0,0,0) 18%, rgba(0,0,0,0) 82%, rgba(0,0,0,0.42)), linear-gradient(90deg, rgba(0,0,0,0.32), rgba(0,0,0,0) 16%, rgba(0,0,0,0) 84%, rgba(0,0,0,0.32))';
const DAWN_TOP = 'linear-gradient(180deg, rgba(243,230,200,0.5), rgba(243,230,200,0) 45%)';

export const GRADES: Record<GradeId, Grade> = {
  'GR-01': { id: 'GR-01', base: { color: colors.bg, blend: 'multiply', opacity: 0.35 }, veil: { gradient: VIGNETTE, blend: 'normal', opacity: 0.6 }, saturate: 0.9 },
  'GR-02': { id: 'GR-02', base: { color: colors.paper, blend: 'soft-light', opacity: 0.18 }, veil: { gradient: `linear-gradient(180deg, rgba(255,248,236,0.5), rgba(255,248,236,0.12))`, blend: 'screen', opacity: 0.06 }, saturate: 0.98 },
  'GR-03': { id: 'GR-03', base: { color: colors.seal, blend: 'soft-light', opacity: 0.18 }, saturate: 1.02 },
  'GR-04': { id: 'GR-04', base: { color: colors.gold, blend: 'soft-light', opacity: 0.2 }, veil: { gradient: `linear-gradient(180deg, rgba(245,233,200,0.45), rgba(245,233,200,0.1))`, blend: 'screen', opacity: 0.06 }, saturate: 1.0 },
  'GR-05': { id: 'GR-05', base: { color: FILM_COLORS.grey, blend: 'multiply', opacity: 0.3 }, veil: { gradient: `linear-gradient(180deg, rgba(138,138,134,0.35), rgba(138,138,134,0.08))`, blend: 'screen', opacity: 0.06 }, saturate: 0.55 },
  'GR-06': { id: 'GR-06', base: { color: colors.gold, blend: 'soft-light', opacity: 0.25 }, veil: { gradient: DAWN_TOP, blend: 'screen', opacity: 0.5 }, saturate: 1.0, brightness: 1.02 },
  'GR-07': { id: 'GR-07', base: { color: colors.bg, blend: 'multiply', opacity: 0.4 }, saturate: 0.95 },
  'GR-08': { id: 'GR-08', base: { color: FILM_COLORS.nearBlack, blend: 'multiply', opacity: 0.6 }, veil: { gradient: VIGNETTE, blend: 'normal', opacity: 0.8 }, saturate: 0.8 },
};

/* ─── §6.10 数据口径（写死，画面不得自行推导） ─── */
export const DATA = {
  commits: 1190,
  tags: 117,
  versions: 116,
  articles: 46,
  issues: 143,
  activity: 12651,
  visits: 10136,
  words: 64985,
  activeDays: 159,
  heatDays: 365,
  peakDay: '2026-07-24',
  peakActivity: 1263,
  sparksDec: 21,
  archives: 257,
  knowledge: 39,
} as const;

/* 月度活动总量（2025-11 → 2026-10 窗口，材料§2.2）——热力图按此分配到日 */
const MONTH_ACTIVITY = [
  { month: '2025-12', days: 31, total: 31 },
  { month: '2026-03', days: 31, total: 117 },
  { month: '2026-04', days: 30, total: 97 },
  { month: '2026-05', days: 31, total: 248 },
  { month: '2026-06', days: 30, total: 269 },
  { month: '2026-07', days: 31, total: 5744 },
  { month: '2026-08', days: 31, total: 809 },
  { month: '2026-09', days: 30, total: 1533 },
  { month: '2026-10', days: 31, total: 3803 },
] as const;

/** 365 格热力（真实总量口径：12,651 分到 159 个活动日，峰值 2026-07-24 · 1,263） */
export const heatCells = (): Array<{ day: number; activity: number; month: string }> => {
  const cells: Array<{ day: number; activity: number; month: string }> = [];
  const activePerMonth = MONTH_ACTIVITY.map((m) => Math.max(1, Math.round((m.total / DATA.activity) * DATA.activeDays)));
  const activeSum = activePerMonth.reduce((a, b) => a + b, 0);
  activePerMonth[activePerMonth.length - 1] += DATA.activeDays - activeSum;
  MONTH_ACTIVITY.forEach((m, mi) => {
    const picks = new Set<number>();
    let guard = 0;
    while (picks.size < activePerMonth[mi] && guard < m.days * 8) {
      picks.add(Math.floor(random(`heat-${m.month}-${guard}`) * m.days));
      guard += 1;
    }
    const share = m.total / Math.max(1, picks.size);
    for (let d = 0; d < m.days; d += 1) {
      cells.push({ day: cells.length, activity: picks.has(d) ? Math.max(1, Math.round(share * (0.4 + random(`heat-v-${m.month}-${d}`) * 1.6))) : 0, month: m.month });
    }
  });
  const peak = cells.find((c) => c.month === '2026-07' && c.activity > 0);
  if (peak) {
    const scale = DATA.peakActivity / Math.max(1, peak.activity);
    cells.forEach((c) => {
      if (c.month === '2026-07' && c.activity > 0) c.activity = Math.round(c.activity * scale * (0.6 + random(`heat-s-${c.day}`) * 0.8));
    });
    peak.activity = DATA.peakActivity;
  }
  return cells;
};

/* 控制台纹理（FN-39 专用；字符串常量集中在此，场景/组件不得内联） */
export const CONSOLE_LINES = {
  scan: 'repeating-linear-gradient(0deg, rgba(245,240,232,0.035) 0px, rgba(245,240,232,0.035) 1px, transparent 1px, transparent 4px)',
  grid: 'repeating-linear-gradient(0deg, rgba(245,240,232,0.035) 0px, rgba(245,240,232,0.035) 1px, transparent 1px, transparent 48px), repeating-linear-gradient(90deg, rgba(245,240,232,0.035) 0px, rgba(245,240,232,0.035) 1px, transparent 1px, transparent 48px)',
} as const;

/* ─── §3.6 转场常量 ─── */
export const TRANSITIONS = {
  whiteFlash: { lineStart: 3986, cut: 3996, peak: 4000, hold: 3, release: 12 },
  redUnfold: { dur: 16 },
  pageSeam: { dur: 30 },
} as const;

/** TR-16/TR-17 全片唯一白闪：3986 一线白光 0→30%，3996→4000 涨满，4000–4003 纯白，4003–4015 释放 */
export const whiteFlashOpacity = (frame: number): number => {
  if (frame < TRANSITIONS.whiteFlash.lineStart) return 0;
  if (frame < TRANSITIONS.whiteFlash.cut) return interpolate(frame, [TRANSITIONS.whiteFlash.lineStart, TRANSITIONS.whiteFlash.cut], [0, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (frame < TRANSITIONS.whiteFlash.peak) return interpolate(frame, [TRANSITIONS.whiteFlash.cut, TRANSITIONS.whiteFlash.peak], [0.3, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.whiteFlashIn });
  if (frame < TRANSITIONS.whiteFlash.peak + TRANSITIONS.whiteFlash.hold) return 1;
  return interpolate(frame, [TRANSITIONS.whiteFlash.peak + TRANSITIONS.whiteFlash.hold, TRANSITIONS.whiteFlash.peak + TRANSITIONS.whiteFlash.hold + TRANSITIONS.whiteFlash.release], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
};

/* ─── §3.5 PT 光尘密度（表 3.5.1） ─── */
export const DUST = {
  1: { count: 50, speed: 8, gold: 0.9 },
  2: { count: 30, speed: 8, gold: 0.85 },
  3: { count: 48, speed: 16, gold: 0.8 },
  4: { count: 14, speed: 3, gold: 0.9 },
  5: { count: 50, speed: 16, gold: 0.9 },
  6: { count: 30, speed: 8, gold: 0.8 },
  7: { count: 15, speed: 3, gold: 0.7 },
  8: { count: 70, speed: 8, gold: 0.9 },
} as const;

/* ─── §3.8 高频动效函数（FN-11–FN-43 新增） ─── */
export type Pose = { x: number; y: number; rot: number; scale: number };

/** FN-03 变体：可指定每字帧数的键击量化（S20 用 2.4、S56 用 5；品牌默认 3.3 不动） */
export const typeCharsAt = (frame: number, total: number, start: number, fpc: number): number =>
  Math.min(total, Math.max(0, Math.floor((frame - start) / fpc)));

/** FN-11 block-drop 基石坠落：120px 下落 + 过冲 ≤6% */
export const blockDrop = (frame: number, delay: number, fps: number): CSSProperties => {
  const t = frame - delay;
  const p = interpolate(t, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const overshoot = t > 14 && t < 26 ? Math.sin(((t - 14) / 12) * Math.PI) * 0.06 : 0;
  return { opacity: interpolate(t, [0, 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), transform: `translateY(${(1 - p) * -120 - overshoot * 120}px)` };
};

/** FN-12 card-fly 卡片弧线飞入/滑入（Pose 插值） */
export const cardFly = (frame: number, delay: number, dur: number, from: Pose, to: Pose): CSSProperties => {
  const p = interpolate(frame - delay, [0, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  return {
    opacity: p,
    transform: `translate(${from.x + (to.x - from.x) * p}px, ${from.y + (to.y - from.y) * p}px) rotate(${from.rot + (to.rot - from.rot) * p}deg) scale(${from.scale + (to.scale - from.scale) * p})`,
  };
};

/** FN-13 cascade-stagger 万能错峰：返回 delay */
export const cascadeStagger = (index: number, step = 20, base = 0): number => base + index * step;

/** FN-14 cursor-blink 光标闪烁：前 count 次按 period 闪，之后停住 */
export const cursorBlink = (frame: number, start: number, period = 20, count = 2): number => {
  const t = frame - start;
  if (t < 0 || t >= period * 2 * count) return 0;
  return Math.floor(t / period) % 2 === 0 ? 1 : 0;
};

/** FN-15 line-replace 行级替换：旧行退、新行入（flash 驱动低强度闪白） */
export const lineReplace = (frame: number, delay: number, dur = 12): { opacity: number; flash: number } => {
  const t = frame - delay;
  const opacity = interpolate(t, [0, dur * 0.5, dur], [1, 0.15, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const flash = t >= 0 && t < dur ? Math.sin((t / dur) * Math.PI) * 0.35 : 0;
  return { opacity, flash };
};

/** FN-16 pipeline-node 流水线节点：scale pop + 绿色进度覆盖 */
export const pipelineNode = (frame: number, delay: number, fps: number): { transform: string; opacity: number; green: number } => {
  const s = interpolate(frame - delay, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineAccent });
  return { transform: `scale(${0.88 + s * 0.12})`, opacity: Math.min(1, s), green: Math.min(1, s) };
};

/** FN-17 paper-shake 纸面轻震：2px 位移 + 0.15° 旋转，指数衰减 */
export const paperShake = (frame: number, delay: number, amp = 2, decay = 12): CSSProperties => {
  const t = frame - delay;
  if (t < 0 || t > decay * 3) return { transform: 'translate(0, 0) rotate(0deg)' };
  const env = Math.exp(-t / decay) * (t === 0 ? 0 : 1);
  return { transform: `translate(${Math.sin(t * 2.4) * amp * env}px, ${Math.cos(t * 1.9) * amp * 0.6 * env}px) rotate(${Math.sin(t * 1.7) * 0.15 * env}deg)` };
};

/** FN-18 bar-grow 纸柱/灯柱纵向生长（origin bottom） */
export const barGrow = (frame: number, delay: number, fps: number): CSSProperties => {
  const p = interpolate(frame - delay, [0, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  return { transform: `scaleY(${p})`, transformOrigin: 'bottom', opacity: Math.min(1, p * 2) };
};

/** FN-19 counter-flip 数字翻牌（先快后慢，flip 驱动 rotateX） */
export const counterFlip = (frame: number, delay: number, dur: number, from: number, to: number): { value: number; flip: number } => {
  const t = frame - delay;
  const value = interpolate(t, [0, dur], [from, to], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.numRollOut });
  const flip = t >= 0 && t < dur ? Math.sin((t / dur) * Math.PI * 6) * 32 : 0;
  return { value: Math.round(value), flip };
};

/** FN-20 heat-wave 热力格按 (col+row) 波次点亮（S54 入场用；S40 用 FN-38 渐深） */
export const heatWave = (frame: number, delay: number, col: number, row: number, step = 0.5): CSSProperties => {
  const at = delay + (col + row) * step;
  const p = interpolate(frame - at, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  return { opacity: p, transform: `scaleY(${0.4 + p * 0.6})` };
};

/** FN-21 path-draw 描边生长 */
export const pathDraw = (frame: number, delay: number, dur: number, length: number): CSSProperties => {
  const p = interpolate(frame - delay, [0, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  return { strokeDasharray: `${length}`, strokeDashoffset: `${length * (1 - p)}` };
};

/** FN-22 pen-glow 28px 笔尖微光（只允许固定小尺寸径向） */
export const penGlow = (frame: number, x: number, y: number): CSSProperties => ({
  position: 'absolute',
  left: x - 14,
  top: y - 14,
  width: 28,
  height: 28,
  borderRadius: 14,
  background: `radial-gradient(circle, rgba(245,233,200,0.9), rgba(245,233,200,0))`,
  opacity: 0.75 + 0.25 * Math.sin(frame / 3),
});

/** FN-23 page-flip 纸页翻面（dir 决定折线侧） */
export const pageFlip = (frame: number, delay: number, dur: number, dir: 'left' | 'right'): CSSProperties => {
  const p = interpolate(frame - delay, [0, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  return { transform: `rotateY(${(dir === 'left' ? -1 : 1) * p * 90}deg)`, transformOrigin: dir === 'left' ? 'left center' : 'right center', opacity: 1 - p * 0.6 };
};

/** FN-24 light-on 灯亮：2px 上浮 + 小 pop */
export const lightOn = (frame: number, delay: number, fps: number): CSSProperties => {
  const t = frame - delay;
  const s = interpolate(t, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineAccent });
  return { opacity: Math.min(1, Math.max(0, t / 6)), transform: `translateY(${(1 - s) * 2}px) scale(${0.92 + s * 0.08})` };
};

/** FN-25 needle-settle 唱针/仪表：0→微偏→0 阻尼正弦 */
export const needleSettle = (frame: number, delay: number, amp = 2): number => {
  const t = frame - delay;
  if (t < 0) return -9;
  return Math.sin(t / 3.2) * amp * Math.exp(-t / 10);
};

/** FN-26 vinyl-spin 黑胶 5s/圈（线性，物理匀速例外） */
export const vinylSpin = (frame: number, period = 150): number => ((frame % period) / period) * 360;

/** FN-27 version-dot-land 版本光点斜落 + 落定闪一次 */
export const versionDotLand = (frame: number, delay: number, seed: string): { y: number; flash: number; drift: number } => {
  const t = frame - delay;
  const dur = 16;
  const p = interpolate(t, [0, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const flash = t >= dur ? Math.max(0, 1 - (t - dur) / 6) : 0;
  return { y: (1 - p) * -70, flash, drift: (random(seed) - 0.5) * 40 };
};

/** FN-28 orbit-drift 星轨参数化 */
export const orbitDrift = (frame: number, cx: number, cy: number, rx: number, ry: number, omega: number, phase: number): { x: number; y: number } => {
  const a = omega * frame + phase;
  return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
};

/** FN-29 letterpress 铅字压印（逐字调用） */
export const letterpress = (frame: number, delay: number, step: number): CSSProperties => {
  const t = frame - delay;
  const p = interpolate(t, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  return { opacity: p, transform: `translateY(${(1 - p) * 2}px)`, textShadow: `0 ${p * 1.5}px 0 rgba(15,14,12,0.35)` };
};

/** FN-30 shimmer-sweep 骨架屏微光横扫（施加在亮带上） */
export const shimmerSweep = (frame: number, delay: number, dur = 45): CSSProperties => {
  const p = interpolate(frame - delay, [0, dur], [-0.3, 1.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const o = frame - delay >= 0 && frame - delay <= dur ? Math.sin(((frame - delay) / dur) * Math.PI) * 0.12 : 0;
  return { transform: `translateX(${p * 100}%)`, opacity: o, mixBlendMode: 'screen' };
};

/** FN-31 book-cascade 书封级联落架 */
export const bookCascade = (frame: number, index: number, step = 10): CSSProperties => {
  const t = frame - index * step;
  const p = interpolate(t, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  return { opacity: p, transform: `scale(${0.92 + p * 0.08}) translateY(${(1 - p) * 8}px)` };
};

/** FN-32 barrage-bubbles 弹幕气泡左右交替滑入 */
export const barrageBubbles = (frame: number, index: number, side: 'left' | 'right', step = 10): CSSProperties => {
  const t = frame - index * step;
  const p = interpolate(t, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  return { opacity: p, transform: `translateX(${(1 - p) * (side === 'left' ? -40 : 40)}px)` };
};

/** FN-33 color-morph 主题换装插值（仅此处允许 interpolateColors 语义：调用方传色值） */
export const colorMorph = (frame: number, delay: number, dur: number, from: string, to: string): { progress: number; from: string; to: string } => {
  const p = interpolate(frame - delay, [0, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  return { progress: p, from, to };
};

/** FN-34 page-depth 页面矩形纵深（施加在单页矩形上） */
export const pageDepth = (frame: number, delay: number, dur: number, index: number): CSSProperties => {
  const p = interpolate(frame - delay - index * 10, [0, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  return { transform: `scale(${1 + p * 0.12}) translateY(${(index - 2) * p * 18}px)`, opacity: 0.2 + p * 0.8 };
};

/** FN-35 ink-timeline 46 枚墨点依次点亮（2 拍扫过） */
export const inkTimeline = (frame: number, delay: number, count = DATA.articles, sweep = 40): Array<{ x: number; y: number; lit: number }> =>
  Array.from({ length: count }).map((_, i) => ({
    x: 140 + i * (1640 / count),
    y: 620 + Math.sin(i * 0.9) * 26,
    lit: interpolate(frame - delay - (i / count) * sweep, [0, 4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  }));

/** FN-36 hover-shift 条目 hover 染色左移（定时 activeIndex 模拟） */
export const hoverShift = (frame: number, delay: number, index: number, activeIndex: number): CSSProperties => {
  const p = interpolate(frame - delay - Math.max(0, activeIndex - index) * 4, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const active = index === activeIndex ? p : index < activeIndex ? 1 : 0;
  return { transform: `translateX(${-6 * active}px)`, background: `rgba(212,163,115,${0.06 + active * 0.1})` };
};

/** FN-37 marquee-drift 跑马灯（线性，物理匀速例外） */
export const marqueeDrift = (frame: number, speed = 40): CSSProperties => ({ transform: `translateX(${-((frame * speed) / 30) % 240}px)` });

/** FN-38 heat-deepen 热力整盘缓慢加深（全局同一 ramp，无扫描） */
export const heatDeepen = (frame: number, activity: number, start: number, end: number): { background: string; opacity: number } => {
  const p = interpolate(frame, [start, end], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const weight = Math.min(1, activity / DATA.peakActivity);
  const base = 0.16 + weight * 0.6 * (0.35 + p * 0.65);
  const warm = activity === 0 ? `rgba(138,130,114,${0.06 + p * 0.04})` : `rgba(212,163,115,${base})`;
  return { background: warm, opacity: activity === 0 ? 1 : 0.55 + p * 0.45 };
};

/** FN-39 console-panel 暗色控制台面板入场（8 tile · litSet 累积） */
export const consolePanel = (frame: number, revealDelay: number): CSSProperties => {
  const p = interpolate(frame - revealDelay, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  return { opacity: p, transform: `scale(${0.98 + p * 0.02})` };
};

/** FN-40 block-expand tile 边界 → 全屏的正向/反向最大化 */
export const blockExpand = (frame: number, tileRect: { x: number; y: number; w: number; h: number }, progress: number): CSSProperties => {
  const p = Math.min(1, Math.max(0, progress));
  const insetX = (tileRect.w / 2) * (1 - p);
  const insetY = (tileRect.h / 2) * (1 - p);
  return {
    clipPath: `inset(${tileRect.y + insetY}px ${tileRect.x + insetX}px ${1080 - tileRect.y - tileRect.h + insetY}px ${tileRect.x + insetX}px)`,
    transform: `scale(${1 - p * 0.001})`,
  };
};

/** FN-41 ink-cursor 墨点光标：路径移动 + 悬停 + 点击涟漪 */
export const inkCursor = (frame: number, from: { x: number; y: number }, to: { x: number; y: number }, moveStart: number, moveDur: number, clickFrame: number): { dot: CSSProperties; ripple: number } => {
  const p = interpolate(frame - moveStart, [0, moveDur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const x = from.x + (to.x - from.x) * p;
  const y = from.y + (to.y - from.y) * p;
  const ripple = interpolate(frame - clickFrame, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  return {
    dot: { position: 'absolute', left: x - 6, top: y - 6, width: 12, height: 12, borderRadius: 6, background: colors.accent, boxShadow: `0 0 14px rgba(212,163,115,0.8)`, opacity: frame < moveStart ? 0 : 1 },
    ripple,
  };
};

/** FN-42 quote-turn 金句页：第 index 句的落纸/停住/被下一页带走 */
export const quoteTurn = (frame: number, index: number, intervals: readonly number[], start = 20, pageTurnDur = 10): { page: CSSProperties; text: CSSProperties; phase: number } => {
  const at = start + intervals.slice(0, index).reduce((a, b) => a + b, 0);
  const local = frame - at;
  const phase = Math.min(1, Math.max(0, local / intervals[index]));
  const enter = interpolate(local, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const exit = interpolate(local, [intervals[index] - pageTurnDur, intervals[index]], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  return {
    page: { transform: `translateY(${(1 - enter) * 24 - exit * 40}px) rotate(${exit * -4}deg)`, opacity: enter * (1 - exit), transformOrigin: 'left top' },
    text: { opacity: enter * (1 - exit) },
    phase,
  };
};

/** FN-43 sum-page 汇总页：大数落定 + 分解压上 */
export const sumPage = (frame: number, start: number, dur: number): { page: CSSProperties; big: CSSProperties; small: CSSProperties } => {
  const p = interpolate(frame - start, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const s = interpolate(frame - start - dur * 0.55, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  return { page: { opacity: p, transform: `translateY(${(1 - p) * 16}px)` }, big: { opacity: p }, small: { opacity: s } };
};
