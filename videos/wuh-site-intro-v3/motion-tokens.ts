import type { CSSProperties } from 'react';
import { interpolate, random, spring } from 'remotion';
import { colors } from '../../brand/tokens';
import { CURVES, inkDraw } from '../../brand/motion';
import { numRoll } from '../../brand/motion';
import type { InkStroke } from '../../brand/motion';

/**
 * wuh-site-intro-v3 动效令牌库 —— motion-spec v3（123 枚）的 Remotion 落地。
 * 基座承接 v2（FN-11–FN-43 / GRADES / DUST / heatCells 原样沿用），本文件增量：
 * ① DATA 口径刷新到 2026-11-08 快照；② ANCHORS 对齐 v3 62 镜时间轴；
 * ③ WIN-01–05 窗语汇（真实截图镜专用，素材像素不变形，scale ≤1.06）；
 * ④ DAT-01–08 数据令牌（凡量必滚：ROLL 三档 / SLAM / CHART-GROW·DRAW·CUT / ZERO-HOLD / DOT-CASCADE）；
 * ⑤ FN-44–51（stream-merge / tree-grow / motif-overlay / white-flash / footnote-strip / column-write / card-reveal / fade-black）。
 * 约束：场景内禁止内联色值/字体；粒子随机一律 random(seed)；镜头运动禁线性；截图窗 transform 等比、禁 rotate3d/skew。
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
  inkDraw,
  handheld,
  driftAngle,
  springEnter,
  TRANS,
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

/* ─── §5 节奏锚点（storyboard v3 · 62 镜 · 8260 时间轴；帧 = shots-manifest.json） ─── */
export const ANCHORS = {
  heroIn: 0, // S01 Hero 显影（镜 1）
  countdownZero: 400, // 30 天倒计时归零「0」定格（镜 3，拍20）
  act2: 720,
  act3: 1872,
  warmSettle: 2100, // 「现 1,160 阅读」落定（镜 13，拍105）
  slam89: 2400, // 「89 篇」SLAM 落定（镜 15，拍120）
  firstLine: 2538, // 第一记重音起（镜 17）
  commitSeal: 2724, // 提交章落定（镜 18，对音）
  spark7: 2880, // 第七墨点落定（镜 19，拍144）
  curveCut: 2980, // 曲线断电骤停（镜 20，拍149）
  act4: 2928,
  zeroSettle: 3260, // 大字「0」落定（镜 22，拍163）
  act5: 3708,
  whiteFlashPeak: 4089, // 唯一纯白峰值（镜 28）
  sealRestart: 4446, // 重启钤印（镜 29 内）
  act6: 4506,
  needle: 4886, // 唱针落定（镜 33 内，拍 ~244）
  heatRoll: 5230, // 「13,603」落定带（镜 36，拍262）
  act7: 5786,
  roll1842: 6058, // 「0→1,842」落定带（镜 45，拍303）
  act8: 6854,
  versionRainEnd: 6940, // 118 枚末颗（镜 50，拍347）
  playerOn: 6954, // 播放器可用（镜 51）
  quoteSettle: 7048, // 方法论金句（镜 52）
  knowledgeBase: 7192, // 知识库（镜 53，SLAM 266/40 拍363）
  recentLogs: 7264, // 最近日志（镜 54，v3 新增）
  treeStart: 7370, // 衍生树起（镜 55）
  pageSettle: 7964, // 总结纸页（镜 60）
  typewriter: 8082, // 打字机（镜 61）
  zero: 8260,
} as const;

/* ─── 幕界（帧号不动） ─── */
export const ACT_FRAMES = [
  { act: 1, start: 0, end: 720 },
  { act: 2, start: 720, end: 1872 },
  { act: 3, start: 1872, end: 2928 },
  { act: 4, start: 2928, end: 3708 },
  { act: 5, start: 3708, end: 4506 },
  { act: 6, start: 4506, end: 5786 },
  { act: 7, start: 5786, end: 6854 },
  { act: 8, start: 6854, end: 8260 },
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
  commits: 1208,
  tags: 119,
  versions: 118,
  articles: 46,
  issues: 144,
  activity: 13603,
  visits: 10760,
  words: 64985,
  activeDays: 167,
  heatDays: 365,
  peakDay: '2026-07-24',
  peakActivity: 1263,
  sparksDec: 21,
  archives: 266,
  knowledge: 40,
  ghContrib: 2825,
  workflowCommits: 290,
  workflowVersion: 'v7.4.0',
  workflowSkills: 13,
  cliCommits: 158,
  cliVersion: 'v1.9.0',
  videoCommits: 234,
  books: 146,
  playsAi: 7920,
  zuowangViews: 1842,
  codexViews: 1513,
  restartViews: 1375,
  summary2022Views: 1160,
} as const;

/* 月度活动总量（2025-11-09 → 2026-11-08 窗口，materials v3 §2.2）——热力图按此分配到日 */
const MONTH_ACTIVITY = [
  { month: '2025-12', days: 31, total: 31 },
  { month: '2026-03', days: 31, total: 117 },
  { month: '2026-04', days: 30, total: 97 },
  { month: '2026-05', days: 31, total: 248 },
  { month: '2026-06', days: 30, total: 269 },
  { month: '2026-07', days: 31, total: 5744 },
  { month: '2026-08', days: 31, total: 809 },
  { month: '2026-09', days: 30, total: 1533 },
  { month: '2026-10', days: 31, total: 3846 },
  { month: '2026-11', days: 8, total: 909 },
] as const;

/** 365 格热力（真实总量口径：13,603 分到 167 个活动日，峰值 2026-07-24 · 1,263） */
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

/** FN-47 全片唯一白闪：4086 起 3f 涨满（CV-06），4089–4092 纯白，4092–4104 释放（镜 28 内） */
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
export const blockDrop = (frame: number, delay: number, _fps: number): CSSProperties => {
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
export const pipelineNode = (frame: number, delay: number, _fps: number): { transform: string; opacity: number; green: number } => {
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
export const barGrow = (frame: number, delay: number, _fps: number): CSSProperties => {
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

/** FN-21 path-draw 描边生长（2026-11-10 升级：第 4 参从猜长度 pathLen 改收路径 d 字符串，
 *  真长度由 @remotion/paths evolvePath 计算——猜大必歪：起步死区+变速扭曲） */
export const pathDraw = (frame: number, delay: number, dur: number, pathD: string): CSSProperties => {
  const p = interpolate(frame - delay, [0, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  return inkDraw(p, pathD);
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
export const lightOn = (frame: number, delay: number, _fps: number): CSSProperties => {
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
export const letterpress = (frame: number, delay: number, _step: number): CSSProperties => {
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

/* ═══ v3 增量：§3.5 窗语汇（WIN-01–05）——真实截图镜专用 ═══
 * 铁律：素材像素不变形不扭曲——transform 只允许对窗容器等比 scale/translate，scale ≤ 1.06；
 * 禁 rotate3d / skew / 逐像素位移 / 局部拉伸；禁裸贴全屏（唯一例外镜 28 WIN-05）。 */
export const WIN = {
  maxZoom: 1.06,
  inDur: 24,
  frameDur: 12,
  /** 站点真实 write-fade 节奏 0/80/160/240ms → 帧（30fps） */
  heroZonesF: [0, 2.4, 4.8, 7.2],
} as const;

/** WIN-01 frame-in 入框：窗框点亮 12f + 窗内截图 scale 1.04→1 + opacity 0→1（24f，CV-01） */
export const frameIn = (frame: number, delay: number): CSSProperties => {
  const t = frame - delay;
  const p = interpolate(t, [0, WIN.inDur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  return {
    opacity: p,
    transform: `scale(${1.04 + (1 - 1.04) * p})`,
    boxShadow: `0 0 0 1px rgba(201,111,74,${interpolate(t, [0, WIN.frameDur, WIN.frameDur + 10], [0, 0.9, 0.35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
  };
};

/** WIN-02 light-sweep 点亮：线性亮带掠过（screen，峰值 0.12）+ 窗内 brightness 对比 sweep（20f，CV-03） */
export const lightSweep = (frame: number, delay: number, dur = 20): { sweepX: number; sweepOpacity: number; brightness: number } => {
  const t = frame - delay;
  const p = interpolate(t, [0, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  return {
    sweepX: -300 + p * 2200,
    sweepOpacity: Math.sin(Math.min(1, Math.max(0, p)) * Math.PI) * 0.12,
    brightness: 0.85 + Math.sin(Math.min(1, Math.max(0, p)) * Math.PI) * 0.2,
  };
};

/** WIN-03 pane-pan 展开：窗容器 scale ≤1.06 + 内部等比 translate 巡视（素材等比，禁越界） */
export const panePan = (frame: number, start: number, dur: number, pan: { x: number; y: number }, zoom = 1.06): CSSProperties => {
  const p = interpolate(frame - start, [0, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const z = 1 + (zoom - 1) * Math.min(1, Math.max(0, p));
  return { transform: `scale(${z}) translate(${pan.x * p}px, ${pan.y * p}px)`, transformOrigin: '50% 50%' };
};

/** WIN-04 stream-in 汇入引导（配合 FN-44 streamMerge）：流光 progress + 目标跟入 opacity */
export const streamIn = (frame: number, start: number, settle: number): { progress: number; arrive: number } => {
  const progress = interpolate(frame, [start, settle], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  return { progress, arrive: interpolate(frame, [settle - 14, settle], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) };
};

/** WIN-05 full-light 整页点亮（镜 28 全片唯一）：brightness 0→1 + 分区 write-fade（0/2.4/4.8/7.2f 节奏） */
export const fullLight = (frame: number, start: number): { bright: number; zoneOpacity: (zone: number) => number } => {
  const bright = interpolate(frame, [start, start + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  return {
    bright,
    zoneOpacity: (zone: number) => {
      const z0 = start + (WIN.heroZonesF[zone % 4] ?? 0);
      return interpolate(frame, [z0, z0 + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    },
  };
};

/* ═══ v3 增量：§3.9 数据令牌（DAT-01–08）——凡量必滚；量才滚，标识不滚 ═══ */

/** DAT-01 滚动时长三档（时长与显著性成比例） */
export const ROLL_DUR = { micro: 20, standard: 40, significant: 60 } as const;

/** 千分位（tabular-nums 由样式层配 fontVariantNumeric） */
export const fmtNum = (n: number): string => Math.round(n).toLocaleString('en-US');

/** DAT-03 NUM-SLAM pair：双数同滚同停，末帧 scale 1.05→1 落定（「两数相等」的对比句自带动作） */
export const slamPair = (
  frame: number,
  delay: number,
  dur: number,
  a: { from: number; to: number },
  b: { from: number; to: number },
): { va: number; vb: number; slam: number } => {
  const t = frame - delay;
  const p = interpolate(t, [0, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.numRollOut });
  const slam = interpolate(t, [dur, dur + 6], [1.05, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return { va: a.from + (a.to - a.from) * p, vb: b.from + (b.to - b.from) * p, slam };
};

/** DAT-03 NUM-SLAM single：大数快滚 + 末帧 slam */
export const slamSingle = (frame: number, delay: number, dur: number, from: number, to: number): { v: number; slam: number } => {
  const r = slamPair(frame, delay, dur, { from, to }, { from, to });
  return { v: r.va, slam: r.slam };
};

/** DAT-06 CHART-CUT 曲线断电：已描曲线反向收缩 + 分段熄灭（ease-in 骤停），断点由 PT-01 溅墨。
 *  2026-11-10 升级：pathD 真长度驱动（stroke 供展开到 <path>，不再猜 pathLen） */
export const chartCut = (
  frame: number,
  start: number,
  dur: number,
  pathD: string,
): { stroke: InkStroke; opacity: number } => {
  const p = interpolate(frame - start, [0, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  return { stroke: inkDraw(1 - p, pathD), opacity: 1 - p * 0.35 };
};

/** DAT-07 NUM-ZERO-HOLD 反衬档：指针 0→微偏→0（阻尼），无滚数——禁止假滚 */
export const zeroHold = (frame: number, start: number, dur = 30): number => {
  const t = frame - start;
  const p = interpolate(t, [0, dur * 0.4, dur], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return Math.sin(p * Math.PI) * 4.2; // 指针最大微偏 4.2°，回落 0
};

/** DAT-08 DOT-CASCADE 点序列落位：accel 越落越快（末点对音）/ density 密度编码；每点落定闪 6f */
export const dotCascade = (
  frame: number,
  count: number,
  mode: 'accel' | 'density',
  start: number,
  end: number,
): Array<{ i: number; land: number; flash: number }> => {
  const span = Math.max(1, end - start);
  const out: Array<{ i: number; land: number; flash: number }> = [];
  for (let i = 0; i < count; i += 1) {
    const k = i / Math.max(1, count - 1);
    const eased = mode === 'accel' ? Math.pow(k, 1.65) : k; // accel：间隔递减
    const land = start + eased * span;
    out.push({ i, land, flash: interpolate(frame, [land, land + 2, land + 8], [0, 0.9, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) });
  }
  return out;
};

/* ═══ v3 增量：FN-44–51 ═══ */

/** FN-44 stream-merge 四源流光汇入（镜 54，WIN-04 实例）：sources 路 stagger 16f，先后抵达聚成一页 */
export const streamMerge = (frame: number, start: number, settle: number, sources = 4): Array<{ progress: number; arrive: number }> =>
  Array.from({ length: sources }, (_, i) => streamIn(frame, start + i * 16, settle));

/** FN-45 tree-grow 树干/枝 path 生长 + 标签落位即现（镜 55–59）。
 *  2026-11-10 升级：pathD 真长度驱动（stroke 供展开到 <path>） */
export const treeGrow = (
  frame: number,
  start: number,
  dur: number,
  pathD: string,
): { stroke: InkStroke; label: number } => {
  const p = interpolate(frame - start, [0, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  return {
    stroke: inkDraw(p, pathD),
    label: interpolate(frame - start, [dur * 0.7, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  };
};

/** FN-46 motif-overlay 六母题依次叠印（镜 60）：12f 错峰 ×6，16f 淡入，opacity ≤12% */
export const motifOverlay = (frame: number, start: number, step = 12) => (i: number): number =>
  interpolate(frame, [start + i * step, start + i * step + 16], [0, 0.12], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/** FN-48 footnote-strip 数字脚注（镜 60，r4 纪律）：镜内 20f 起笔、字号 ≥16px 由样式层保证、全落定距镜尾 ≥20f、微滚 */
export const footnoteStrip = (frame: number, start: number, count: number, endFrame: number) => (i: number): { opacity: number; roll: number } => {
  const t0 = start + 20 + i * 6;
  const hardEnd = endFrame - 20;
  return {
    opacity: interpolate(frame, [t0, t0 + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    roll: interpolate(frame, [t0, Math.min(t0 + ROLL_DUR.micro, hardEnd)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.numRollOut }),
  };
};

/** FN-49 column-write 四列右起逐字落版（镜 46，r4 纪律）：列序右→左（常默/少思/不怒/不恼），每字落下极轻压痕 */
export const columnWrite = (frame: number, start: number, cols: number, charsPerCol: number, charStep = 3) => (col: number, ch: number): { opacity: number; press: number } => {
  const colIndex = cols - 1 - col; // 右起
  const t0 = start + colIndex * 14 + ch * charStep;
  const on = frame >= t0;
  return {
    opacity: on ? interpolate(frame, [t0, t0 + 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0,
    press: on ? interpolate(frame, [t0, t0 + 8], [1.06, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1.06,
  };
};

/** FN-50 card-reveal 漫游卡页中字自写（镜 39–43）：reveal mask 扫过 + write-fade 跟随 */
export const cardReveal = (frame: number, delay: number, row: number): { mask: number; ink: number } => {
  const t = frame - delay - row * 8;
  const mask = interpolate(t, [0, 20], [0, 35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return { mask, ink: interpolate(t, [4, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) };
};

/** FN-51 fade-black 末 20f 收黑（镜 62）：brightness→0 + 暗角收拢，墨点余光保留至 8258 */
export const fadeBlack = (frame: number, start: number, dur = 20): { bright: number; veil: number } => ({
  bright: interpolate(frame, [start, start + dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  veil: interpolate(frame, [start, start + dur], [0, 0.8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
});

/* ─── PT 纸面质感（ShotShell 垫底用；与 zhi-guo-xiang 同名同语义） ─── */
export const PT = {
  paperGrain: { opacity: 0.05, blend: 'normal' },
} as const;

/* ═══ V2 深空数据流（2026-11-10 科技感重构，change 20261110-feature-…-tech-restyle）═══
 * 参照系：年度报告数据流——深色底、多图表同屏生长、时间线流动、高信息密度。
 * 语法反转：数据/内容当主角（全屏大数字/图表/kinetic typography），
 * 网站截图降级为「证据快闪」（≤2s 辉光小窗）；手作签名点（印章/墨迹 wordmark）克制保留。
 * 样片门：s01/s33/s45 先行，用户定稿后才全量铺开（不在错误风格上烧 62 镜工时）。 */

/** V2 影片私有色（品牌暖黑科技：站点同源暖黑 + 琥珀数据主色 + 暖金落定 + 钤印朱红签名；场景内禁止内联色值） */
export const FILM_COLORS2 = {
  space: '#0f0e0c', // 暖黑底（brand/tokens bg 同源）
  spaceDeep: '#0a0908',
  panel: 'rgba(23,20,16,0.72)',
  grid: 'rgba(212,163,115,0.07)',
  line: 'rgba(212,163,115,0.24)',
  data: '#d4a373', // 琥珀：数据主色（brand accent 同源）
  dataDim: '#8a6b47',
  gold: '#E9D9AE', // 暖金：落定/SLAM 高光（brand gold 同源）
  paperWhite: '#f5f0e8', // 暖纸白文字（brand paper 同源）
  textMuted: '#8a8272',
  sealRed: '#7A1F16', // 钤印朱红：手作签名/强调（brand seal 同源）
} as const;

/** V2 八幕调色（GR2-01–08）：暖黑基调 + 幕间色温推移（琥珀黎明→暖金对比幕→亮数据终幕） */
export type GradeId2 = 'GR2-01' | 'GR2-02' | 'GR2-03' | 'GR2-04' | 'GR2-05' | 'GR2-06' | 'GR2-07' | 'GR2-08';

export type Grade2Def = {
  id: GradeId2;
  base: { color: string; blend: CSSProperties['mixBlendMode']; opacity: number };
  veil?: { gradient: string; blend: CSSProperties['mixBlendMode']; opacity: number };
  saturate: number;
  brightness?: number;
};

const V2_VIGNETTE =
  'radial-gradient(ellipse 118% 96% at 50% 46%, rgba(10,9,8,0) 52%, rgba(10,9,8,0.55) 88%, rgba(10,9,8,0.82) 100%)';

export const GRADES2: Record<GradeId2, Grade2Def> = {
  'GR2-01': { id: 'GR2-01', base: { color: '#1a1208', blend: 'screen', opacity: 0.16 }, veil: { gradient: 'linear-gradient(180deg, rgba(212,163,115,0.10), rgba(212,163,115,0) 46%)', blend: 'screen', opacity: 0.5 }, saturate: 1.0 },
  'GR2-02': { id: 'GR2-02', base: { color: '#161208', blend: 'screen', opacity: 0.14 }, saturate: 0.98 },
  'GR2-03': { id: 'GR2-03', base: { color: '#1c1408', blend: 'screen', opacity: 0.16 }, veil: { gradient: 'linear-gradient(180deg, rgba(212,163,115,0.07), rgba(212,163,115,0) 40%)', blend: 'screen', opacity: 0.5 }, saturate: 1.02 },
  'GR2-04': { id: 'GR2-04', base: { color: '#050403', blend: 'multiply', opacity: 0.4 }, veil: { gradient: V2_VIGNETTE, blend: 'normal', opacity: 0.7 }, saturate: 0.9, brightness: 0.97 },
  'GR2-05': { id: 'GR2-05', base: { color: '#241505', blend: 'screen', opacity: 0.16 }, veil: { gradient: 'linear-gradient(180deg, rgba(233,217,174,0.08), rgba(233,217,174,0) 44%)', blend: 'screen', opacity: 0.5 }, saturate: 1.04 },
  'GR2-06': { id: 'GR2-06', base: { color: '#1a140a', blend: 'screen', opacity: 0.14 }, saturate: 1.0 },
  'GR2-07': { id: 'GR2-07', base: { color: '#1a1008', blend: 'screen', opacity: 0.16 }, veil: { gradient: 'linear-gradient(180deg, rgba(212,163,115,0.07), rgba(212,163,115,0) 44%)', blend: 'screen', opacity: 0.5 }, saturate: 1.02 },
  'GR2-08': { id: 'GR2-08', base: { color: '#181208', blend: 'screen', opacity: 0.14 }, veil: { gradient: 'linear-gradient(180deg, rgba(212,163,115,0.09), rgba(212,163,115,0) 42%)', blend: 'screen', opacity: 0.55 }, saturate: 1.02, brightness: 1.05 },
};

/* ─── V2 科技令牌 ─── */

/** BIG-NUMBER 全屏大数字滚动：spring-out 落定 + 落定辉光脉冲（年度报告主角基元）。
 *  返回千分位文本与辉光强度（落定瞬间 1→呼吸收敛）。 */
export const bigNum = (
  frame: number,
  delay: number,
  dur: number,
  from: number,
  to: number,
): { text: string; glow: number; slam: number } => {
  const v = numRoll(frame, delay, dur, from, to);
  const landed = frame >= delay + dur;
  const glow = landed ? interpolate(frame, [delay + dur, delay + dur + 3, delay + dur + 26], [0.35, 1, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : interpolate(frame, [delay, delay + 8], [0.12, 0.35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const slam = landed ? interpolate(frame, [delay + dur, delay + dur + 8], [1.045, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1;
  return { text: fmtNum(v), glow, slam };
};

/** 辉光文本样式：主色 text-shadow 三段堆叠（intensity 0–1；rgb 传主色三元组，默认琥珀）。 */
export const glowText = (color: string, intensity = 0.6, rgb = '212,163,115'): CSSProperties => ({
  textShadow: `0 0 ${18 * intensity}px ${color}${Math.round(intensity * 160).toString(16).padStart(2, '0')}, 0 0 ${56 * intensity}px rgba(${rgb},${0.28 * intensity}), 0 0 2px rgba(245,240,232,${0.6 * intensity})`,
});

/** CHART-FLOW 数据行生长：横条按比例生长（对齐大数字滚动窗），返回条宽百分比与辉光。 */
export const chartBar = (
  frame: number,
  delay: number,
  dur: number,
  ratio: number,
): { widthPct: number; glow: number } => {
  const p = interpolate(frame - delay, [0, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.numRollOut });
  return { widthPct: p * ratio * 100, glow: interpolate(p, [0.7, 1], [0.2, 0.55], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) };
};

/** TIMELINE-FLOW 时间线流动：返回线已画比例（inkDraw 用）与第 i 节点的落点闪。 */
export const timelineFlow = (frame: number, start: number, dur: number, nodes: number, nodeGap: number): { progress: number; nodeFlash: (i: number) => number } => {
  const progress = interpolate(frame - start, [0, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  return {
    progress,
    nodeFlash: (i: number) => {
      const at = start + (i + 1) * nodeGap;
      return interpolate(frame, [at, at + 2, at + 10], [0, 0.95, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    },
  };
};

/* ═══ V3 特效解禁层（2026-11-11 用户拍板「不再限制动效权利」+ 内容编排向 v2 看齐）═══
 * v2 的镜是「一场戏」：承接→触发→分层数据表演（帧级节奏数组）→收场交接；
 * v3 此前是「一张海报」：两三个淡入后静止。本层给编排提供弹性/冲击/粒子/逐字/视差原语。 */

/** FX-01 spring 弹入进度（真 spring 物理，带过冲；fps 由 useVideoConfig 取）。
 *  用法：const p = springIn(frame, delay, fps); transform 里用 (1-p) 做位移/scale。 */
export const springIn = (frame: number, delay: number, fps: number, damping = 17, stiffness = 160, mass = 0.9): number => {
  const t = frame - delay;
  if (t <= 0) return 0;
  return spring({ frame: t, fps, config: { damping, stiffness, mass }, durationInFrames: 26 });
};

/** FX-02 帧级节奏数组（v2 LAND/GAPS 手法正体）：count 点在 [start, start+span] 内落定，
 *  mode='accel' 前疏后密（推进感，末点对音），'even' 匀步，'decel' 前密后疏（喘息）。 */
export const staggerLand = (count: number, start: number, span: number, mode: 'accel' | 'even' | 'decel' = 'accel'): number[] =>
  Array.from({ length: count }, (_, i) => {
    const k = i / Math.max(1, count - 1);
    const e = mode === 'accel' ? Math.pow(k, 1.6) : mode === 'decel' ? 1 - Math.pow(1 - k, 1.6) : k;
    return Math.round(start + e * span);
  });

/** FX-03 冲击波双环（落定瞬间效果）：主环粗、副环细快消；rgb 传主色三元组。 */
export const shockwave = (frame: number, landAt: number, rgb = '212,163,115'): { ring1: CSSProperties; ring2: CSSProperties } | null => {
  const t = frame - landAt;
  if (t < 0 || t > 26) return null;
  const r1 = interpolate(t, [0, 20], [0, 190], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const o1 = interpolate(t, [0, 3, 20], [0.85, 0.6, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const r2 = interpolate(t, [0, 14], [0, 120], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const o2 = interpolate(t, [0, 2, 14], [0.6, 0.4, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ring = (r: number, o: number, w: number): CSSProperties => ({
    position: 'absolute',
    left: -r,
    top: -r,
    width: r * 2,
    height: r * 2,
    borderRadius: '50%',
    border: `${w}px solid rgba(${rgb},${o})`,
    boxShadow: `0 0 ${w * 6}px rgba(${rgb},${o * 0.7})`,
  });
  return { ring1: ring(r1, o1, 2.5), ring2: ring(r2, o2, 1.2) };
};

/** FX-04 粒子喷洒（落定瞬间；全 random(seed) 确定性）：count 粒从原点抛射，重力下坠 + 衰减；
 *  gold=true 暖金粒否则琥珀。返回相对锚点的粒子样式数组（外层容器定位在锚点）。 */
export const sparkBurst = (
  seed: string,
  frame: number,
  landAt: number,
  count = 14,
  gold = false,
): Array<{ style: CSSProperties }> => {
  const t = frame - landAt;
  if (t < 0 || t > 34) return [];
  return Array.from({ length: count }, (_, i) => {
    const ang = random(`${seed}-a${i}`) * Math.PI * 2;
    const dist = 40 + random(`${seed}-d${i}`) * 130;
    const life = 16 + random(`${seed}-l${i}`) * 16;
    const p = interpolate(t, [0, life], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
    const x = Math.cos(ang) * dist * p;
    const y = Math.sin(ang) * dist * p * 0.7 + p * p * 60; // 重力下坠
    const o = interpolate(t, [0, life * 0.25, life], [0.95, 0.7, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const s = 2 + random(`${seed}-s${i}`) * 3;
    return {
      style: {
        position: 'absolute',
        left: x,
        top: y,
        width: s,
        height: s,
        borderRadius: s / 2,
        background: gold ? FILM_COLORS2.gold : FILM_COLORS2.data,
        boxShadow: `0 0 6px rgba(${gold ? '233,217,174' : '212,163,115'},${o})`,
        opacity: o,
      },
    };
  });
};

/** FX-05 逐字 kinetic（金句/题名主角化）：每字 spring 弹入（微 y 上浮 + 轻微旋转），
 *  step 每字帧数；落定后辉光随 intensity 呼吸。返回逐字样式（文本渲染由调用方拆字）。 */
export const kineticChars = (
  text: string,
  frame: number,
  start: number,
  step: number,
  fps: number,
  intensity = 0.55,
): Array<{ ch: string; style: CSSProperties }> => {
  const chars = Array.from(text);
  return chars.map((ch, i) => {
    const p = springIn(frame, start + i * step, fps, 15, 190, 0.8);
    const landed = p > 0.98;
    return {
      ch,
      style: {
        display: 'inline-block',
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${(1 - p) * 26}px) rotate(${(1 - p) * 3}deg) scale(${0.9 + p * 0.1})`,
        ...(landed ? glowText(FILM_COLORS2.paperWhite, intensity * (0.7 + 0.3 * Math.sin(frame / 9 + i * 0.7))) : {}),
      },
    };
  });
};

/** FX-06 数据雨帘（背景特效层，低干扰）：cols 列琥珀数字雨匀速下落，头部亮尾迹淡；
 *  opacity 峰值 ≤0.22（信息层之下）。speed px/s。 */
export const dataCurtain = (
  seed: string,
  frame: number,
  cols = 14,
  speed = 140,
): Array<{ x: number; y: number; o: number; text: string }> =>
  Array.from({ length: cols }, (_, i) => {
    const x = (i + 0.5) * (100 / cols) + (random(`${seed}-x${i}`) - 0.5) * 4;
    const cycle = 260 + random(`${seed}-c${i}`) * 240;
    const phase = random(`${seed}-p${i}`) * cycle;
    const y = ((frame * speed) / 30 + phase) % (cycle + 400) - 200;
    const o = interpolate(y, [-160, -60, 900, 1180], [0, 0.22, 0.16, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * (0.5 + random(`${seed}-o${i}`) * 0.5);
    return { x, y, o, text: `${Math.floor(random(`${seed}-n${i}-${Math.floor(frame / 14)}`) * 10)}` };
  });

/** FX-07 三层视差（纵深）：layer 0 远 / 1 中 / 2 近，返回该层 translate（px）；
 *  amp 每层最大位移幅度，随 frame 线性漂移（近层最快）。 */
export const parallax3 = (frame: number, layer: 0 | 1 | 2, amp = 18): { x: number; y: number } => {
  const k = [0.25, 0.55, 1][layer];
  return { x: Math.sin(frame / (210 / k)) * amp * k, y: Math.cos(frame / (260 / k)) * amp * k * 0.6 };
};

/** FX-08 金光横扫（施加在大数字/金句容器上的子层）：亮带从左掠到右，screen 峰值 0.28。 */
export const sheenSweep = (frame: number, start: number, dur = 18): CSSProperties => {
  const p = interpolate(frame - start, [0, dur], [-0.35, 1.35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const o = frame - start >= 0 && frame - start <= dur ? Math.sin(Math.min(1, Math.max(0, p)) * Math.PI) * 0.28 : 0;
  return {
    position: 'absolute',
    top: '-12%',
    bottom: '-12%',
    left: `${p * 100}%`,
    width: 120,
    background: `linear-gradient(90deg, transparent, rgba(233,217,174,${o}), transparent)`,
    mixBlendMode: 'screen',
    filter: 'blur(6px)',
    pointerEvents: 'none',
  } as CSSProperties;
};
