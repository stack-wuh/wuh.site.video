import { Easing, interpolate, spring } from 'remotion';
import { evolvePath } from '@remotion/paths';
import { noise2D, noise3D } from '@remotion/noise';
import type { CSSProperties } from 'react';

/**
 * 品牌级动效基元（brand 层）——跨视频共用的曲线、弹性、节奏网格与元素动效。
 * 影片私有锚点、调色与粒子配置留在各自 videos/<slug>/motion-tokens.ts。
 * 约束：禁 Math.random()（用 Remotion random(seed)）；镜头运动禁线性。
 */

/* ─── 曲线基元 ─── */
export const CURVES = {
  cineEaseOut: Easing.out(Easing.cubic),
  cineEaseIn: Easing.in(Easing.cubic),
  cineEaseInOut: Easing.inOut(Easing.cubic),
  cineAccent: Easing.out(Easing.back(1.2)),
  whiteFlashIn: Easing.in(Easing.quad),
  numRollOut: Easing.out(Easing.poly(4)),
} as const;

/* ─── 弹性参数（SPRINGS，spring config 表） ─── */
export const SPRINGS = {
  sealStamp: { damping: 11, stiffness: 220, mass: 0.9 },
  springPop: { damping: 9, stiffness: 180, mass: 0.8 },
  heavyGlide: { damping: 200, stiffness: 60 },
  camFollow: { damping: 200, stiffness: 90 },
  dragFollow: { damping: 14, stiffness: 160 },
} as const;

/* ─── 节奏网格（90 BPM = 20f/拍 @30fps） ─── */
export const BPM = 90;
export const BEAT = 20;
export const HALF_BEAT = 10;

/* ─── 键击量化 ─── */
export const TYPE = { framesPerChar: 3.3, fast: 3, firstChar: 220 } as const;

/* ─── 元素动效纯函数 ─── */

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

/** paper-breathe 纸面呼吸（120f 周期；振幅减半 → amp 传 0.5） */
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

/* ═══ 官方基元层（2026-11-10 Remotion 能力整合，shot-spec 决策记录 #9–#11）═══
 * 原则：官方 API 优先，禁重复造轮子——镜内新动效先查本层。
 * 能力地图、令牌→基元决策表与样板：技能 remotion-capabilities.md。
 * 版本纪律：@remotion/* 与 remotion 同版本钉死（现 4.0.538，无 ^）。
 */

/** 描画笔画形状（evolvePath 口径：dashoffset 为数值，可直入 SVG attr / CSS style） */
export type InkStroke = { strokeDasharray: string; strokeDashoffset: number };

/** 描画基元（@remotion/paths evolvePath）：真实路径长度驱动 progress∈[0,1]。
 * 消灭「猜 pathLen」——猜大必歪：起步死区（偏移超出真长度的段不可见）+ 变速扭曲。 */
export const inkDraw = (progress: number, pathD: string): InkStroke => {
  const p = Math.max(0, Math.min(1, progress));
  const { strokeDasharray, strokeDashoffset } = evolvePath(p, pathD);
  return { strokeDasharray, strokeDashoffset };
};

/** 手持颤动（@remotion/noise noise2D）：有机、非正弦；amp=1 时位移 ≤3px / 转 ≤0.35° */
export const handheld = (seed: string, frame: number, amp = 1): { dx: number; dy: number; rot: number } => ({
  dx: noise2D(`${seed}-x`, frame / 45, 0) * 3 * amp,
  dy: noise2D(`${seed}-y`, frame / 38, 0) * 2.4 * amp,
  rot: noise2D(`${seed}-r`, frame / 60, 0) * 0.35 * amp,
});

/** 漂移场（noise3D）：尘埃/纸纹粒子的连续方向角，替代 Math.sin 波场 */
export const driftAngle = (seed: string, x: number, y: number, t: number): number =>
  noise3D(seed, x / 260, y / 260, t / 90) * Math.PI;

/** 弹性入场：spring 驱动位移+透明度+微缩（入场默认弹性，线性=例外需注释说明） */
export const springEnter = (frame: number, delay: number, fps: number, fromY = 18, config = SPRINGS.springPop): CSSProperties => {
  const s = spring({ frame: frame - delay, fps, config });
  return {
    opacity: Math.min(1, s * 1.6),
    transform: `translateY(${(1 - s) * fromY}px) scale(${0.96 + 0.04 * s})`,
  };
};

/* 转场曲线吸收：官方 @remotion/transitions presentation 的两侧镜像实现。
 * 跨镜交接态协议不变（shot-spec §3 规则 4）——出镜尾/入镜首各自实现自己的一半，
 * 本组令牌保证两侧曲线同形（同 easing 同窗口），拼接无缝。
 * TransitionSeries 只用于镜内多场景切换（不进装配层，镜级缓存不动）。 */
export const TRANS = {
  /** TRANS-SLIDE 侧滑：出镜向左推出 / 入镜自右侧进入（1920 宽，cineEaseInOut 同形） */
  slideOut: (frame: number, dur: number): CSSProperties => ({
    transform: `translateX(${interpolate(frame, [0, dur], [0, -1920], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut })}px)`,
  }),
  slideIn: (frame: number, dur: number): CSSProperties => ({
    transform: `translateX(${interpolate(frame, [0, dur], [1920, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut })}px)`,
  }),
  /** TRANS-WIPE 扫换：出镜自左收走 / 入镜自右展开（clipPath 单侧） */
  wipeOut: (frame: number, dur: number): CSSProperties => ({
    clipPath: `inset(0 0 0 ${interpolate(frame, [0, dur], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut })}%)`,
  }),
  wipeIn: (frame: number, dur: number): CSSProperties => ({
    clipPath: `inset(0 ${interpolate(frame, [0, dur], [100, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut })}% 0 0)`,
  }),
  /** TRANS-FLASH 白场交接（交接态已在用，曲线统一：入白 whiteFlashIn / 出白 cineEaseOut） */
  flashVeil: (frame: number, dur: number): CSSProperties => ({
    opacity: interpolate(frame, [0, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.whiteFlashIn }),
  }),
  flashReveal: (frame: number, dur: number): CSSProperties => ({
    opacity: interpolate(frame, [0, dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut }),
  }),
} as const;
