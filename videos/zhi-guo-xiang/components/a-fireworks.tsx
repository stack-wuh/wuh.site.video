/* A 组（shots-a：S11 / S12）私有烟花：**团块语言**，替代 v10 那朵被用户骂的「细白线星形」。
 *
 * 语言（design-v11 §3.3 + storyboard s11/s12）：宋代烟花是「低空一团团火金/赭红爆开」，
 * 不是球形对称菊球、更不是白线星芒。所以一朵烟花的构成是：
 *   ① 团块爆开：14 块大小不一的暖色光团（径向渐变 + 模糊）沿不规则方向撑开，越靠外越暗；
 *   ② 烟尾下垂：爆开 0.6 拍后，几团浊烟从爆心下方垂下来、边垂边被风吹偏；
 *   ③ 余烬飘落：爆开后半程，十几粒小金点带着重力往下掉，边掉边灭；
 *   ④ 景深：调用方给 scale（远景 0.55 / 中景 1.0 / 近景 1.5），组件按 scale 一并缩放尺寸、
 *      加大模糊、压低亮度——三层错峰就是三种「远近不同的城上烟花」。
 *
 * 性能：**不逐元素挂 CSS blur**（一帧上百个模糊层会让本机 Chrome 渲染卡死/崩溃）；
 * 柔边靠径向渐变本身，只有烟尾/热核/云光保留 blur。余烬不用 box-shadow。
 * 确定性：粒子只用 remotion 的 random(seed)，同一个 seed 两遍渲染逐像素一致；禁止 Math.random。
 * 颜色只取 brand/tokens 与 motion-tokens 的 FILM；这里只做「同一色 + 不同 alpha」的 rgba。
 * 转场遮罩归 ShotShell；本组件不画任何全屏黑/白。 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { FILM } from '../motion-tokens';

export type FireworkBurst = {
  /** 爆心（1920×1080 基准） */
  x: number;
  y: number;
  /** 起爆帧（镜内帧） */
  at: number;
  /** 0.55 远 / 1.0 中 / 1.5 近 */
  scale?: number;
  /** 火金（默认）或赭红 */
  hue?: 'gold' | 'ochre';
  /** 起花上冲：爆开前 RISE 帧，从爆心下方 360px 处上冲（S11 的第一朵要这一下） */
  rise?: boolean;
};

const GOLD = FILM.fireGold; // #E8B96A
const CORE = colors.gold; // #E9D9AE
const ACCENT = colors.accent; // #d4a373
const OCHRE = colors.seal; // #7A1F16
const SMOKE = colors.muted; // #8a8272

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** #rrggbb + alpha → rgba()（只换透明度，不引入新色） */
const withAlpha = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a))})`;
};
const easeOut = (t: number) => 1 - (1 - t) ** 3;

const BLOBS = 16;
const SMOKE_N = 5;
const EMBERS = 12;
const PEAK = 13; // 爆开用时（f）：真烟花 0.2–0.4s，比 v10 的 22f 更炸
const LIFE = 104; // 一朵的总寿命（f）
const RISE = 24; // 起花上冲用时（f）

/** 一朵团块烟花。scale 同时决定尺寸、模糊与亮度（远景小而糊、近景大而亮）。 */
const Burst: FC<{ b: FireworkBurst; seed: string; f: number }> = ({ b, seed, f }) => {
  const t = f - b.at;
  const sc = b.scale ?? 1;
  const hue = b.hue ?? 'gold';
  const outer = hue === 'gold' ? GOLD : ACCENT;
  const inner = hue === 'gold' ? CORE : OCHRE;
  const dim = sc < 0.8 ? 0.62 : 1; // 远景压一档亮度

  /* 起花上冲：爆开前 RISE 帧，一点火从爆心下方 340px 处冲上来，拖一条短尾 */
  if (t < 0) {
    if (!b.rise) return null;
    const r = -t / RISE; // 1 → 0：越接近爆心越小
    if (r > 1) return null;
    const ry = b.y + 340 * sc * r;
    return (
      <div key="rise" style={{ position: 'absolute', left: b.x - 26 * sc, top: ry, width: 52 * sc, height: 46 * sc * r + 8 }}>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: 3.4 * sc,
            height: '100%',
            transform: 'translateX(-50%)',
            background: `linear-gradient(180deg, ${withAlpha(GOLD, 0.5 * (1 - r))} 0%, ${withAlpha(GOLD, 0)} 100%)`,
            filter: 'blur(1.2px)',
            mixBlendMode: 'screen',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: 6 * sc,
            height: 6 * sc,
            marginLeft: -3 * sc,
            borderRadius: '50%',
            background: withAlpha(CORE, 0.85),
            boxShadow: `0 0 ${10 * sc}px ${withAlpha(GOLD, 0.7)}`,
            mixBlendMode: 'screen',
          }}
        />
      </div>
    );
  }
  if (t > LIFE) return null;

  const grow = easeOut(clamp01(t / PEAK));
  /* 亮度：起爆 0–5f 一个短促的亮核，之后长尾衰减（不是突然归零） */
  const flash = t < 5 ? 1 - t / 5 : 0;
  const fade = 1 - clamp01((t - PEAK * 0.3) / (LIFE - PEAK * 0.3));
  /* 放射短擦：只在爆开后 36f 内存在，给团块一点「炸」的方向性（短、暖、不连成线，不是白线星） */
  const streak = t < 36 ? 1 - t / 36 : 0;

  return (
    <>
      {/* ① 团块：不规则角向分布 + 由内向外扩张；块本身拉长旋转，避免「一堆圆点」的读法 */}
      {Array.from({ length: BLOBS }).map((_, i) => {
        const s = `${seed}-${b.at}-${i}`;
        const ang = random(`${s}-a`) * Math.PI * 2;
        const spread = (0.3 + random(`${s}-r`) * 1.0) * sc;
        /* 每三块有一块落在近心处：爆开是一团实心的火，不是一圈空心的光点 */
        const dist = (10 + 116 * grow) * spread * (i % 3 === 0 ? 0.38 : 1);
        const lift = -30 * sc * (grow - 0.35 * clamp01((t - PEAK) / 70));
        const cx = b.x + Math.cos(ang) * dist;
        const cy = b.y + Math.sin(ang) * dist * 0.78 + lift;
        const size = (26 + random(`${s}-s`) * 32) * sc * (0.5 + 0.7 * grow);
        const w = size * (0.7 + random(`${s}-w`) * 0.9);
        const h = size * (0.42 + random(`${s}-h`) * 0.55);
        const rot = random(`${s}-rot`) * 180;
        const op = (0.56 + random(`${s}-o`) * 0.36) * fade * (0.75 + 0.45 * grow) * dim;
        const col = random(`${s}-c`) < 0.45 ? inner : outer;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: cx - w / 2,
              top: cy - h / 2,
              width: w,
              height: h,
              borderRadius: '50%',
              transform: `rotate(${rot}deg)`,
              background: `radial-gradient(ellipse, ${withAlpha(col, 0.8 * op)} 0%, ${withAlpha(col, 0.42 * op)} 44%, ${withAlpha(col, 0)} 76%)`,
              filter: sc > 1.2 ? 'blur(1.6px)' : undefined,
              mixBlendMode: 'screen',
            }}
          />
        );
      })}

      {/* 放射短擦：每朵 10 道，长短不一，很快消失——只做「炸开」的动势 */}
      {streak > 0
        ? Array.from({ length: 10 }).map((_, i) => {
            const s = `${seed}-${b.at}-st-${i}`;
            const ang = random(`${s}-a`) * Math.PI * 2;
            const far = (28 + random(`${s}-d`) * 90) * sc * grow;
            const len = (18 + random(`${s}-l`) * 58) * sc * grow;
            const cx = b.x + Math.cos(ang) * far;
            const cy = b.y + Math.sin(ang) * far * 0.85;
            return (
              <div
                key={`st-${i}`}
                style={{
                  position: 'absolute',
                  left: cx - len / 2,
                  top: cy - 1.4 * sc,
                  width: len,
                  height: 2.8 * sc,
                  borderRadius: 2,
                  transform: `rotate(${(ang * 180) / Math.PI}deg)`,
                  background: `linear-gradient(90deg, ${withAlpha(outer, 0)} 0%, ${withAlpha(outer, 0.5 * fade * streak)} 55%, ${withAlpha(outer, 0)} 100%)`,
                  mixBlendMode: 'screen',
                }}
              />
            );
          })
        : null}

      {/* 亮核：赭红那朵给一点火心，火金那朵给一点白心——爆开的「一团」才不是散的 */}
      <div
        style={{
          position: 'absolute',
          left: b.x - 36 * sc,
          top: b.y - 32 * sc,
          width: 72 * sc,
          height: 64 * sc,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${withAlpha(CORE, 0.72 * fade * dim)} 0%, ${withAlpha(outer, 0.5 * fade * dim)} 46%, transparent 78%)`,
          filter: 'blur(6px)',
          mixBlendMode: 'screen',
        }}
      />

      {/* 起爆闪：只 5f，给「炸」一个点（不做全屏闪白） */}
      {flash > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: b.x - 74 * sc,
            top: b.y - 62 * sc,
            width: 148 * sc,
            height: 124 * sc,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${withAlpha(CORE, 0.6 * flash)} 0%, transparent 68%)`,
            filter: 'blur(8px)',
            mixBlendMode: 'screen',
          }}
        />
      ) : null}

      {/* ② 烟尾下垂：爆开 0.5 拍后从爆心下方垂落，上段被火光照暖、下段转成浊灰，边垂边被风带偏 */}
      {t > PEAK * 0.5
        ? Array.from({ length: SMOKE_N }).map((_, i) => {
            const s = `${seed}-${b.at}-smoke-${i}`;
            const k = t - PEAK * 0.5;
            const sx = b.x + (random(`${s}-x`) - 0.5) * 170 * sc + Math.sin((f + i * 40) / 34) * 8 * sc;
            const sy = b.y + 20 * sc + k * (0.9 + random(`${s}-v`) * 0.75) * sc;
            const w = (52 + random(`${s}-w`) * 50) * sc;
            const h = (70 + random(`${s}-h`) * 80) * sc * (1 + k / 130);
            const op = (0.1 + random(`${s}-o`) * 0.1) * (1 - clamp01(k / (LIFE - PEAK)));
            const col = i % 2 === 0 ? ACCENT : SMOKE;
            return (
              <div
                key={`smoke-${i}`}
                style={{
                  position: 'absolute',
                  left: sx - w / 2,
                  top: sy - h / 2,
                  width: w,
                  height: h * 1.16,
                  borderRadius: '50%',
                  background: `radial-gradient(ellipse, ${withAlpha(col, op)} 0%, ${withAlpha(col, op * 0.42)} 52%, transparent 80%)`,
                  filter: `blur(${8 + 5 * sc}px)`,
                  mixBlendMode: 'screen',
                }}
              />
            );
          })
        : null}

      {/* ③ 余烬飘落：爆开后半程重力下坠的小金点 */}
      {t > PEAK * 0.4
        ? Array.from({ length: EMBERS }).map((_, i) => {
            const s = `${seed}-${b.at}-ember-${i}`;
            const k = t - PEAK * 0.4;
            const startAng = random(`${s}-a`) * Math.PI * 2;
            const ex = b.x + Math.cos(startAng) * (26 + 86 * grow) * sc + Math.sin((f + i * 23) / 16) * 7 * sc;
            const ey = b.y + Math.sin(startAng) * 44 * sc + k * (1.1 + random(`${s}-v`) * 1.9) * sc;
            const r = (1.2 + random(`${s}-r`) * 2.1) * Math.max(0.7, sc);
            const op = (0.55 + 0.45 * random(`${s}-o`)) * (1 - clamp01(k / (LIFE * 0.7)));
            return (
              <div
                key={`ember-${i}`}
                style={{
                  position: 'absolute',
                  left: ex - r,
                  top: ey - r,
                  width: r * 2,
                  height: r * 2,
                  borderRadius: '50%',
                  background: withAlpha(GOLD, op),
                  mixBlendMode: 'screen',
                }}
              />
            );
          })
        : null}
    </>
  );
};

/** 天空云带被「由下往上」照亮：爆心正下方一条横的暖光，强度跟着最近的爆开走。
 *  只加光、不压暗底图，所以不会出现「全屏泛白」；S11/S12 共用。
 *  只一层（大范围模糊层越少越稳：本机渲染性能吃紧）。 */
export const CloudGlow: FC<{
  at: number;
  /** 亮的位置与宽度（1920×1080 基准）：通常放在地平线/城墙上方 */
  x: number;
  y: number;
  width?: number;
  height?: number;
  /** 0–1，由调用方按烟花节奏给 */
  intensity: number;
  hue?: 'gold' | 'ochre';
}> = ({ at, x, y, width = 1100, height = 520, intensity, hue = 'gold' }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || intensity <= 0.01) return null;
  const col = hue === 'gold' ? GOLD : ACCENT;
  const rise = clamp01(t / 40); // 光从地平线往上升（不是整块变亮）
  return (
    <div
      style={{
        position: 'absolute',
        left: x - width / 2,
        top: y - height * 0.66,
        width,
        height,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        background: `linear-gradient(0deg, ${withAlpha(col, 0.3 * intensity * rise)} 0%, ${withAlpha(col, 0.14 * intensity * rise)} 38%, ${withAlpha(col, 0)} 78%)`,
        filter: 'blur(24px)',
      }}
    />
  );
};

/** 一组团块烟花；layer 顺序 = 绘制顺序（远的先画）。 */
export const A_Fireworks: FC<{ bursts: FireworkBurst[]; seed: string; opacity?: number; style?: CSSProperties }> = ({
  bursts,
  seed,
  opacity = 1,
  style,
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity, ...style }}>
      {bursts.map((b, i) => (
        <Burst key={`${b.at}-${i}`} b={b} seed={`${seed}-${i}`} f={f} />
      ))}
    </AbsoluteFill>
  );
};