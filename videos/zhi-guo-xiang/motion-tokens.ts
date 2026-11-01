import type { CSSProperties } from 'react';
import { interpolate } from 'remotion';
import { colors } from '../../brand/tokens';
import { CURVES } from '../../brand/motion';

/**
 * 《风陵 · 致郭襄》动效令牌库 —— motion-spec 106 枚的 Remotion 落地。
 * 品牌通用基元（曲线/弹性/节奏/键击）再导出；本文件只放影片私有色、锚点、调色、
 * 节奏网格与 FN 函数。场景禁止内联色值/字体；粒子随机只用 random(seed)。
 *
 * 令牌总账：CV 6 + SP 4 + RH 7 + CM 13 + PT 13 + TR 12 + GR 8 + FG 19 + FN 24 = 106。
 * FG（人物/物）在 components/Figure.tsx 与 components/Objects.tsx 落地。
 */

export { CURVES, SPRINGS, BEAT, TYPE, writeFade } from '../../brand/motion';

export const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/* FILM 私有色：全文唯一声明处（motion-spec §3.7.1） */
export const FILM = {
  snowCyan: '#7E8E96',
  nightBlue: '#11161C',
  fireGold: '#E8B96A',
} as const;

/* S0–S3 线宽（character-design §6.1） */
export const STROKE = { S0: 0.8, S1: 1.2, S2: 2.0, S3: 3.0 } as const;

/* 剪影正负形（FG-06） */
export const SILHOUETTE = {
  onPaper: { fill: colors.ink, stroke: colors.paper },
  onInk: { fill: colors.paper, stroke: colors.ink },
} as const;

/* RH 节奏网格（90 BPM，1 拍 = 20f） */
export const RH = { beat: 20, half: 10, step: 40, phrase: 80, rest: 40, charCell: 12, hold: 60 } as const;

/* 六幕帧界 */
export const ACT_FRAMES = [
  { act: 1, start: 0, end: 720 },
  { act: 2, start: 720, end: 1620 },
  { act: 3, start: 1620, end: 3120 },
  { act: 4, start: 3120, end: 4080 },
  { act: 5, start: 4080, end: 6000 },
  { act: 6, start: 6000, end: 7200 },
] as const;

/* 节奏锚点（storyboard 52 镜） */
export const ANCHORS = {
  act2: 720,
  act3: 1620,
  firstFirework: 1980,
  firstEye: 2220,
  huashan: 2700,
  act4: 3120,
  swordFirst: 3120,
  ascend: 3840,
  breakpoint: 4320,
  snow: 4560,
  ordain: 4860,
  act6: 6000,
  fengling: 6540,
  finalLine: 7040,
  lastFrame: 7199,
} as const;

/* CV 曲线（6） */
export const CV = {
  out: CURVES.cineEaseOut,
  in: CURVES.cineEaseIn,
  inOut: CURVES.cineEaseInOut,
  sineOut: (t: number) => 1 - Math.cos((t * Math.PI) / 2),
  plateau: (t: number) => interpolate(t, [0, 0.12, 0.88, 1], [0, 0.35, 0.92, 1], { ...CLAMP, easing: CURVES.cineEaseInOut }),
  hardStep3: (t: number) => Math.round(t * 3) / 3,
} as const;

/* SP 弹性（4） */
export const SP = {
  heavyGlide: { damping: 200, stiffness: 60 },
  dragFollow: { damping: 14, stiffness: 160 },
  springPop: { damping: 9, stiffness: 180, mass: 0.8 },
  camFollow: { damping: 200, stiffness: 90 },
} as const;

/* CM 镜头（13） */
export type CamState = { scale: number; x: number; y: number; rot: number; origin?: string };
const TAU = Math.PI * 2;
export const CM = {
  hold: (): CamState => ({ scale: 1, x: 0, y: 0, rot: 0 }),
  drift: (frame: number, amp = 4): CamState => ({ scale: 1, x: Math.sin((frame / 120) * TAU) * amp, y: Math.cos((frame / 120) * TAU) * amp * 0.75, rot: Math.sin((frame / 120) * TAU) * 0.15 }),
  dollyIn: (frame: number, dur: number, d = 0.03): CamState => ({ ...CM.hold(), scale: 1 + d * interpolate(frame, [0, dur], [0, 1], CLAMP) }),
  dollyOut: (frame: number, dur: number, d = 0.02): CamState => ({ ...CM.hold(), scale: 1 - d * interpolate(frame, [0, dur], [0, 1], CLAMP) }),
  pan: (frame: number, dur: number, dist: number): CamState => ({ ...CM.hold(), x: dist * CV.plateau(Math.min(1, frame / dur)) }),
  tilt: (frame: number, dur: number, dist: number): CamState => ({ ...CM.hold(), y: dist * CV.plateau(Math.min(1, frame / dur)) }),
  truck: (frame: number, dur: number, dist: number): CamState => ({ ...CM.hold(), x: -dist * CV.plateau(Math.min(1, frame / dur)) }),
  follow: (frame: number, dur: number, x: number, y: number): CamState => ({ ...CM.hold(), x: x * CV.plateau(Math.min(1, frame / dur)), y: y * CV.plateau(Math.min(1, frame / dur)) }),
  macro: (frame: number, dur: number, from = 1.1, to = 1.3): CamState => ({ ...CM.hold(), scale: from + (to - from) * CV.out(Math.min(1, frame / dur)) }),
  parallax: (cam: CamState, depth: number): CamState => ({ ...cam, x: cam.x * (depth - 1) * -1, y: cam.y * (depth - 1) * -1, scale: 1 + (cam.scale - 1) * depth }),
  focusPull: (frame: number, dur: number): number => interpolate(frame, [0, dur], [8, 0], { ...CLAMP, easing: CURVES.cineEaseInOut }),
  breath: (frame: number): number => 0.5 + 0.5 * Math.sin((frame / 120) * TAU),
  ramp: (frame: number, dur: number, dist: number): CamState => ({ ...CM.hold(), x: dist * CV.inOut(Math.min(1, frame / dur)) }),
} as const;

/* PT 粒子与材质（13） */
export const PT = {
  paperGrain: { opacity: 0.06, blend: 'overlay' as CSSProperties['mixBlendMode'] },
  paperFiber: { opacity: 0.05 },
  dust: { count: 24, speed: 8, gold: 0.25 },
  ash: { count: 40, speed: 0.6, sway: 3 },
  snow: { count: 50, speed: 1.8, angle: 28 },
  gold: { count: 30, bloom: 18, fall: 60 },
  cloud: { drift: 0.03, dur: 150 },
  reed: { count: 8, amp: 3, period: 60 },
  water: { line: 1, stagger: 6 },
  strokeGrow: { dur: 60 },
  lamp: { radius: 80 },
  needle: { radius: 4 },
  lightBand: { width: 0.4 },
} as const;

/* TR 转场（12） */
export const TR = {
  handoff: 'match',
  dissolve: 8,
  hardCut: 0,
  duskBleed: 20,
  focusEmerge: 20,
  lightOpen: 90,
  whiteMatch: 0,
  eyeline: 0,
  dotOut: 8,
  stackWipe: 16,
  twinFrame: 0,
  goldSuperimpose: 30,
} as const;

/* GR 调色（8） */
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
const WARM_TOP = 'linear-gradient(180deg, rgba(232,185,106,0.45), rgba(232,185,106,0) 46%)';
export const GRADES: Record<GradeId, Grade> = {
  'GR-01': { id: 'GR-01', base: { color: colors.paper, blend: 'soft-light', opacity: 0.16 }, veil: { gradient: VIGNETTE, blend: 'normal', opacity: 0.5 }, saturate: 0.98 },
  'GR-02': { id: 'GR-02', base: { color: colors.bg, blend: 'multiply', opacity: 0.4 }, veil: { gradient: `linear-gradient(180deg, rgba(17,22,28,0.5), rgba(17,22,28,0.12))`, blend: 'screen', opacity: 0.06 }, saturate: 0.92 },
  'GR-03': { id: 'GR-03', base: { color: colors.accent, blend: 'soft-light', opacity: 0.18 }, veil: { gradient: `linear-gradient(180deg, rgba(126,142,150,0.35), rgba(126,142,150,0.08))`, blend: 'screen', opacity: 0.06 }, saturate: 0.95 },
  'GR-04': { id: 'GR-04', base: { color: colors.paperDeep, blend: 'multiply', opacity: 0.2 }, veil: { gradient: `linear-gradient(180deg, rgba(126,142,150,0.35), rgba(126,142,150,0.08))`, blend: 'screen', opacity: 0.05 }, saturate: 0.6 },
  'GR-05': { id: 'GR-05', base: { color: FILM.fireGold, blend: 'soft-light', opacity: 0.22 }, veil: { gradient: `linear-gradient(180deg, rgba(233,217,174,0.4), rgba(233,217,174,0.08))`, blend: 'screen', opacity: 0.06 }, saturate: 1.0 },
  'GR-06': { id: 'GR-06', base: { color: colors.accent, blend: 'soft-light', opacity: 0.15 }, veil: { gradient: WARM_TOP, blend: 'screen', opacity: 0.5 }, saturate: 0.98 },
  'GR-07': { id: 'GR-07', base: { color: colors.ink, blend: 'multiply', opacity: 0.25 }, veil: { gradient: `linear-gradient(180deg, rgba(138,130,114,0.3), rgba(138,130,114,0.06))`, blend: 'screen', opacity: 0.04 }, saturate: 0.9 },
  'GR-08': { id: 'GR-08', base: { color: FILM.fireGold, blend: 'soft-light', opacity: 0.18 }, veil: { gradient: `linear-gradient(180deg, rgba(126,142,150,0.3), rgba(126,142,150,0.06))`, blend: 'screen', opacity: 0.06 }, saturate: 1.0 },
};

/* DUST 光尘分幕配置（PT-03） */
export const DUST = {
  1: { count: 18, speed: 6, gold: 0.15 },
  2: { count: 26, speed: 9, gold: 0.2 },
  3: { count: 30, speed: 12, gold: 0.3 },
  4: { count: 22, speed: 8, gold: 0.2 },
  5: { count: 28, speed: 10, gold: 0.25 },
  6: { count: 20, speed: 6, gold: 0.35 },
} as const;

/* FN 高频函数（24） */
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const FN = {
  subtitleLine: (frame: number, start: number, text: string) => {
    const chars = Math.max(0, Math.floor((frame - start) / 2));
    return { shown: text.slice(0, chars), opacity: interpolate(frame, [start, start + 14], [0, 1], CLAMP) };
  },
  poemLine: (frame: number, start: number, text: string, lock?: number) => {
    const chars = Math.max(0, Math.floor((frame - start) / 2));
    const end = lock ?? start + text.length * 2;
    return { shown: text.slice(0, chars), opacity: frame >= end ? 1 : interpolate(frame, [start, start + 14], [0, 1], CLAMP) };
  },
  charCell12: (frame: number, local: number) => {
    const shown = Math.floor(clamp01((frame - local) / 12) * 12) / 12;
    return { shown, opacity: frame >= local ? 1 : 0 };
  },
  textLock: (frame: number, lock: number) => (frame >= lock ? 1 : interpolate(frame, [lock - 14, lock], [0, 1], CLAMP)),
  paperBreathe: (frame: number, amp = 0.4) => 1 + Math.sin((frame / 120) * TAU) * (amp / 100),
  freezeHold: (frame: number, at: number) => Math.min(frame, at),
  gaitWalk: (frame: number, step: number, mode: 'human' | 'donkey' = 'human') => {
    const phase = (frame % step) / step;
    const leg = Math.sin(phase * TAU) * (mode === 'donkey' ? 18 : 14);
    const bob = Math.abs(Math.sin(phase * TAU)) * (mode === 'donkey' ? 2 : 1.5);
    return { leg, bob };
  },
  bodyIdle: (frame: number, amp = 1.5) => Math.sin((frame / 90) * TAU) * amp,
  clothSway: (frame: number, amp = 8, phase = 0) => Math.sin((frame / 40) * TAU + phase) * amp,
  ribbonLag: (frame: number, lag = 6, amp = 4) => Math.sin(((frame - lag) / 40) * TAU) * amp,
  headLift: (frame: number, deg = 8, dur = 30) => deg * CV.out(clamp01(frame / dur)),
  eyeGlint: (frame: number, start: number, end: number) => (frame >= start && frame <= end ? 1 : 0),
  handAction: (frame: number, mode: 'brush' | 'clench' | 'offer' = 'brush') => {
    const d = mode === 'brush' ? 30 : mode === 'clench' ? 40 : 26;
    return { t: CV.out(clamp01(frame / d)), x: Math.sin(clamp01(frame / d) * Math.PI) * (mode === 'offer' ? 18 : 6) };
  },
  swordCycle: (frame: number) => {
    const draw = clamp01(frame / 40);
    const sheathed = frame > 70 ? clamp01((frame - 70) / 30) : 0;
    return { draw, sheathed };
  },
  doorGap: (frame: number, local: number) => (local < 200 ? 1 : 1 + 5 * CV.sineOut(clamp01((local - 200) / 39))),
  doorOpen: (frame: number, local: number) => 60 * CV.inOut(clamp01((local - 0) / 90)),
  lightStep: (frame: number, steps = 11) => Math.min(steps, Math.floor(frame / 4)),
  flameStep: (frame: number) => 0.7 + 0.3 * Math.round(Math.sin((frame / 6) * TAU) * 2) / 2,
  fireworkBloom: (frame: number, seed: string, count = 30) =>
    Array.from({ length: count }).map((_, i) => {
      const a = (i / count) * TAU;
      const spread = 18 * CV.out(clamp01(frame / 18));
      const fall = 60 * clamp01((frame - 18) / 60);
      return { x: Math.cos(a) * spread, y: Math.sin(a) * spread + fall, r: 1.5 + (i % 3), o: 1 - clamp01(fall / 60) };
    }),
  ashDrift: (frame: number, seed: string, count = 40) =>
    Array.from({ length: count }).map((_, i) => ({ x: Math.sin((frame + i * 17) / 40) * 3, y: (frame * 0.6 + i * 7) % 560, r: 0.5 + (i % 3) * 0.3 })),
  figureToDot: (frame: number, dur = 120) => ({ scale: 1 - 0.98 * CV.inOut(clamp01(frame / dur)), opacity: 1 - 0.4 * clamp01(frame / dur) }),
  cloudSlow: (frame: number, dur = 150) => (frame / dur) * 0.03,
  paperAction: (frame: number, mode: 'stack' | 'fold' = 'stack') => (mode === 'stack' ? Math.floor(frame / 10) * 8 : 20 * CV.out(clamp01(frame / 20))),
  turnAway: (frame: number, local = frame) => {
    const rot = local < 120 ? 0 : 14 * CV.inOut(clamp01((local - 120) / 24));
    const walk = local < 144 ? 0 : (local - 144) * 0.6;
    const fade = local < 180 ? 1 : 1 - 0.85 * CV.inOut(clamp01((local - 180) / 120));
    return { rot, walk, fade };
  },
} as const;

export const TOKEN_STATS = { CV: 6, SP: 4, RH: 7, CM: 13, PT: 13, TR: 12, GR: 8, FG: 19, FN: 24, total: 106 } as const;
