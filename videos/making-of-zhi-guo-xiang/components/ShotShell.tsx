/* 历程片 ShotShell —— 自 zhi-guo-xiang 单元逐字复制（2026-11-08，task-4）。
 * 单元自包含纪律（shot-spec §3 import 白名单）：跨单元 import 禁止，故整组件落本单元。
 * 两片转场口径相同：ink 墨洇 20f / dry 飞白 10f / cut 0f（v12 同源）。改本片转场只改这里。
 */
import type { FC, ReactNode } from 'react';
import { useId } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors } from '../../../brand/tokens';
import { PT } from '../motion-tokens';
import { TRANSITION_SIDE, type Transition } from '../shots/manifest';

type MaskProps = { coverage: number };

/** 纸翻：纸色纵向擦除 + 1px 暗边（上一「页」向右侧退开）。coverage 1 = 满幅纸色。 */
const PageMask: FC<MaskProps> = ({ coverage }) => {
  const wipe = (1 - coverage) * 100; // 左侧已被擦开的百分比
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: colors.paper, clipPath: `inset(0 0 0 ${wipe}%)` }} />
      {coverage > 0.02 && coverage < 0.98 ? (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${wipe}%`,
            width: 2,
            background: 'rgba(24,19,14,0.4)',
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

/** 飞白：横向干笔擦——纸底 + 多条错位细墨线，各自速度不同（干笔的丝路）。coverage 1 = 满幅纸底 + 定格丝路。 */
const DRY_STREAKS = [
  { top: '5%', h: 8, w: 52, x: -40, speed: 1.12, alpha: 0.62 },
  { top: '14%', h: 4, w: 38, x: -22, speed: 1.34, alpha: 0.5 },
  { top: '22%', h: 10, w: 64, x: -52, speed: 1.02, alpha: 0.7 },
  { top: '33%', h: 3, w: 30, x: -12, speed: 1.46, alpha: 0.42 },
  { top: '41%', h: 6, w: 46, x: -34, speed: 1.2, alpha: 0.58 },
  { top: '52%', h: 12, w: 58, x: -46, speed: 0.98, alpha: 0.74 },
  { top: '63%', h: 4, w: 34, x: -16, speed: 1.4, alpha: 0.46 },
  { top: '72%', h: 7, w: 50, x: -38, speed: 1.1, alpha: 0.6 },
  { top: '83%', h: 5, w: 42, x: -26, speed: 1.28, alpha: 0.52 },
  { top: '92%', h: 9, w: 56, x: -44, speed: 1.04, alpha: 0.66 },
] as const;
const DryMask: FC<MaskProps> = ({ coverage }) => {
  const c = Math.max(0, Math.min(1, coverage));
  const travel = (1 - c) * 120; // 干笔丝路随 coverage 横移；coverage 1 时定格在同一落点（相邻镜同帧无缝）
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: c }}>
      <AbsoluteFill style={{ background: colors.paper }} />
      {DRY_STREAKS.map((s) => (
        <div
          key={s.top}
          style={{
            position: 'absolute',
            top: s.top,
            left: 0,
            width: `${s.w}%`,
            height: s.h,
            borderRadius: s.h,
            background: `linear-gradient(90deg, transparent 0%, ${colors.ink} 10%, ${colors.ink} 90%, transparent 100%)`,
            opacity: s.alpha,
            transform: `translateX(${s.x + travel * s.speed}%)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/* ─── 墨洇（v11 §二）：全屏墨色晕开 ─────────────────────────────────────────
 * 用户原话：「既然出现了墨点、而且有晕开的动效，那么转场就可以换成墨色晕开全屏」。
 *
 * 不是从中心缩放的圆，是**倒墨**：墨从画面左下角灌进来，一条斜向扫掠前沿一路推到右上角。
 * 前沿不是一条边，是 100 团墨按各自在倒墨方向上的投影先后涌起：
 *   · 1 片主导墨塘（左下角 5 团大团，覆盖画面 50–60%）
 *   · 70 团网格抖动中团（R 96–182）沿前沿成串、彼此叠成实块
 *   · 22 团小团（R 28–94）补在边缘上，把轮廓咬碎
 *   · 3 团右上角收尾团（墨推到对角的最后一下）
 * 边界 = 点位扰动（双频摆动）+ 两级湍流位移，没有一处是圆的。
 *
 *   coverage 1 → 满屏实墨 colors.ink（#2b2620，即设计稿 #2A2622 系；末端由封口层压成整屏纯色）
 *   coverage 0 → 零墨（不产生 DOM，画面逐像素干净）
 *
 * 三种质感叠在同一处前沿：
 *   ① 实墨块 —— 不透明 colors.ink，模糊 ≤6（峰值 2），边靠位移造，不靠高斯糊
 *   ② 飞白拖尾 —— 沿倒墨方向的细长干笔，只落在前沿前的纸面上
 *   ③ 湿边 —— 交界处一圈宽 80–140px 的极淡墨晕（ink 0.085，糊 22px）；墨块内部没有描边、没有细黑线
 * 浓淡只发生在前沿 100–200px 的窄带里；墨里不掺白雾。
 *
 * 时机：20f 单侧里前 12f 走完 ~80% 的形，后 8f 推到满墨（u=0.86 起封口成纯色）；
 * 露出侧走同一条形但慢 20%（u = coverage^1.2）。
 * 全部随机来自 remotion `random(seed)`，模块级一次算定；逐帧只改半径/位置，形状不「沸腾」。
 */
const TAU = Math.PI * 2;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** 墨洇遮罩所在的 z 层。字幕不跟着被墨吞，字幕层要压在这之上（design-v11 §1.2）。 */
export const INK_MASK_Z = 20;

/** 倒墨方向：左下角 → 右上角（|D| ≈ 0.9986）。垂直向 = (0.57, 0.82)。 */
const INK_DX = 0.82;
const INK_DY = -0.57;
/** 扫掠投影全长：任意点投到倒墨方向上，0 = 左下角，1 = 右上角 */
const INK_LEN = INK_DX * 1920 - INK_DY * 1080; // 2190
const inkProjection = (x: number, y: number) => clamp01((x * INK_DX + (1080 - y) * -INK_DY) / INK_LEN);
/** 投影位 → 墨涌到这里的时刻：前 80% 画面压在 u 的 0–0.53，最后 20% 压在 0.53–0.79，
 *  再叠半径生长与末端外扩，落在「前 12f 走完 80% 的形、后 8f 推满」上。 */
const inkArrival = (p: number) => (p <= 0.8 ? 0.6625 * p : 0.53 + (p - 0.8) * 1.3);
const inkFrontAt = (u: number) => clamp01(u <= 0.53 ? u / 0.6625 : 0.8 + (u - 0.53) / 1.3);
/** 单团半径生长：t^0.7 —— 墨点一落纸就迅速洇开，再缓一点 */
const inkGrow = (t: number) => Math.pow(clamp01(t), 0.7);

type InkBlob = { x: number; y: number; R: number; a: number; w: number };
/** 139 团墨（确定性，random(seed) 一次算定），彼此重叠成一片连着的墨，不是散落圆点：
 *  · 88 团网格抖动中团（R 140–220）—— 实块主体；R 大于格距，邻团必然叠在一起
 *  · 24 团小团（R 18–52）—— 前沿外的飞溅
 *  · 6 团左下角墨塘（R 220–340）—— 一开始就涌起，主导墨量（画面 50–60%）
 *  · 3 团右上角收尾（R 240–360）—— 墨推到对角的最后一下 */
function makeInkBlobs(): InkBlob[] {
  const blobs: InkBlob[] = [];
  const cols = 11;
  const rows = 8;
  const cw = 1920 / cols;
  const ch = 1080 / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const x = (c + 0.5) * cw + (random(`ink-grid-x${i}`) - 0.5) * cw * 0.55;
      const y = (r + 0.5) * ch + (random(`ink-grid-y${i}`) - 0.5) * ch * 0.55;
      blobs.push({
        x,
        y,
        R: 140 + random(`ink-grid-r${i}`) * 80,
        a: inkArrival(inkProjection(x, y)) + (random(`ink-grid-a${i}`) - 0.5) * 0.05,
        w: 0.12 + random(`ink-grid-w${i}`) * 0.08,
      });
    }
  }
  for (let i = 0; i < 24; i++) {
    const x = random(`ink-sat-x${i}`) * 1920;
    const y = random(`ink-sat-y${i}`) * 1080;
    blobs.push({
      x,
      y,
      R: 18 + random(`ink-sat-r${i}`) * 34,
      a: inkArrival(inkProjection(x, y)) + (random(`ink-sat-a${i}`) - 0.5) * 0.07,
      w: 0.1 + random(`ink-sat-w${i}`) * 0.08,
    });
  }
  for (let i = 0; i < 6; i++) {
    blobs.push({
      x: 100 + random(`ink-pour-x${i}`) * 520,
      y: 740 + random(`ink-pour-y${i}`) * 300,
      R: 220 + random(`ink-pour-r${i}`) * 120,
      a: 0.01 + random(`ink-pour-a${i}`) * 0.06,
      w: 0.45,
    });
  }
  for (let i = 0; i < 3; i++) {
    blobs.push({
      x: 1360 + random(`ink-far-x${i}`) * 420,
      y: 140 + random(`ink-far-y${i}`) * 280,
      R: 240 + random(`ink-far-r${i}`) * 120,
      a: 0.56 + random(`ink-far-a${i}`) * 0.1,
      w: 0.18,
    });
  }
  // 12 团贴边团：圆心压在画面四边上（一半在画外），专门堵掉边框上的纸色细缝
  for (let i = 0; i < 12; i++) {
    const side = i % 4;
    const t = 0.12 + Math.floor(i / 4) * 0.34 + random(`ink-edge-t${i}`) * 0.2;
    const x = side === 0 ? 0 : side === 1 ? 1920 : t * 1920;
    const y = side === 2 ? 0 : side === 3 ? 1080 : t * 1080;
    blobs.push({
      x,
      y,
      R: 150 + random(`ink-edge-r${i}`) * 110,
      a: inkArrival(inkProjection(x, y)) + (random(`ink-edge-a${i}`) - 0.5) * 0.05,
      w: 0.16 + random(`ink-edge-w${i}`) * 0.1,
    });
  }
  return blobs;
}
const INK_BLOBS: readonly InkBlob[] = makeInkBlobs();

const BLOB_POINTS = 16;
/** 每团的有机形皮肤：强各向异性（墨迹是被拉长的，不是圆）、朝向、双频摆动、逐点半径扰动。 */
const INK_SKIN = INK_BLOBS.map((_, i) => ({
  squash: 0.5 + random(`ink-squash${i}`) * 0.55,
  rot: random(`ink-rot${i}`) * TAU,
  phase: random(`ink-phase${i}`) * TAU,
  lobe: 0.2 + random(`ink-lobe${i}`) * 0.14,
  grain: Array.from({ length: BLOB_POINTS }, (_, j) => random(`ink-grain${i}-${j}`) - 0.5),
}));

/** 闭合有机形：扰动半径点 → Catmull-Rom 转三次贝塞尔。团不是圆，边不是弧。 */
function organicBlob(b: InkBlob, skin: (typeof INK_SKIN)[number], r: number): string {
  const pts = skin.grain.map((g, i) => {
    const ang = (i / BLOB_POINTS) * TAU + skin.rot;
    const k =
      1 +
      skin.lobe * Math.sin(ang * 2 + skin.phase) +
      skin.lobe * 0.62 * Math.sin(ang * 3 - skin.phase * 1.7) +
      g * 0.22;
    const rr = Math.max(0.5, r * k);
    return [b.x + Math.cos(ang) * rr, b.y + Math.sin(ang) * rr * skin.squash];
  });
  const n = pts.length;
  const f = (v: number) => v.toFixed(1);
  let d = `M ${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    d += ` C ${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(
      p2[1] - (p3[1] - p1[1]) / 6,
    )} ${f(p2[0])} ${f(p2[1])}`;
  }
  return `${d} Z`;
}

/** 边缘絮状物：每团 3 枚小滴 + 大团再加 2 条向外的手指。只有落在实墨轮廓外的那部分看得见，
 *  所以它们自动长在墨的边界上，把光滑弧线咬碎。 */
const INK_FRINGE = INK_BLOBS.map((_, i) => ({
  drops: Array.from({ length: 4 }, (_, j) => ({
    ang: random(`ink-drop-a${i}-${j}`) * TAU,
    dist: 1.02 + random(`ink-drop-d${i}-${j}`) * 0.12,
    r: 2 + random(`ink-drop-r${i}-${j}`) * 7,
  })),
  fingers: Array.from({ length: 2 }, (_, j) => ({
    ang: random(`ink-fing-a${i}-${j}`) * TAU,
    dist: 1.04 + random(`ink-fing-d${i}-${j}`) * 0.12,
    len: 0.18 + random(`ink-fing-l${i}-${j}`) * 0.26,
    w: 3 + random(`ink-fing-w${i}-${j}`) * 8,
  })),
}));

/** 飞白拖尾：8 道细长干笔贴着前沿（位置每帧由前沿算，所以永远在前沿前的纸面上）。 */
const INK_TAILS = Array.from({ length: 8 }, (_, i) => ({
  /** 沿前沿线的垂直位置（px，约 ±800） */
  b: (random(`ink-tail-b${i}`) - 0.5) * 1500,
  /** 离前沿多远（投影位） */
  d0: 0.015 + random(`ink-tail-d${i}`) * 0.06,
  len: 110 + random(`ink-tail-l${i}`) * 200,
  w: 1.4 + random(`ink-tail-w${i}`) * 2.8,
  o: 0.16 + random(`ink-tail-o${i}`) * 0.2,
  skew: (random(`ink-tail-s${i}`) - 0.5) * 0.3,
}));

/** 纸纤维渗点：46 枚，只在前沿附近显影——墨里看不出，纸面上就是洇开的碎点。 */
const INK_SPRAY = Array.from({ length: 46 }, (_, i) => {
  const x = random(`ink-spray-x${i}`) * 1920;
  const y = random(`ink-spray-y${i}`) * 1080;
  const big = random(`ink-spray-big${i}`) > 0.86;
  return {
    x,
    y,
    p: inkProjection(x, y),
    r: big ? 3 + random(`ink-spray-r${i}`) * 6 : 0.6 + random(`ink-spray-r${i}`) * 1.6,
    o: big ? 0.5 + random(`ink-spray-o${i}`) * 0.3 : 0.7 + random(`ink-spray-o${i}`) * 0.3,
  };
});

const TAIL_ANGLE = (Math.atan2(INK_DY, INK_DX) * 180) / Math.PI;
const rad2deg = (v: number) => (v * 180) / Math.PI;
/** 前沿线上的点：p = 投影位，b = 垂直位置（px）。 */
const frontPoint = (p: number, b: number) => {
  const cc = (p * INK_LEN - 615.6) / 0.9973;
  return [0.57 * b + 0.82 * cc, 0.82 * b - 0.57 * cc] as const;
};

/**
 * 墨洇遮罩。coverage 1 = 满屏实墨（吞没到底），coverage 0 = 零墨（露出完成）。
 * dir='out' = 墨倒进来（吞没），dir='in' = 墨退开（露出，慢 20%）。
 */
const InkMask: FC<MaskProps & { dir: 'in' | 'out' }> = ({ coverage, dir }) => {
  const c = clamp01(coverage);
  const uid = `ink${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  if (c <= 0.002) return null; // 无墨：不产生 DOM，画面逐像素干净
  if (c >= 0.9995) return <AbsoluteFill style={{ pointerEvents: 'none', zIndex: INK_MASK_Z, background: colors.ink }} />; // 峰值帧两侧同像素实墨

  // 墨退比墨来慢 ~20%：露出侧用 c^0.88（u 更大 = 墨退得更慢）
  const u = dir === 'in' ? Math.pow(c, 0.88) : c;
  const front = inkFrontAt(u);
  // 末端外扩：最后 20% 的墨由「团一起涨一圈」补齐，比压一层纯色更像墨在洇
  const swell = 1 + 0.22 * smoothstep(clamp01((u - 0.74) / 0.14));
  const radii = INK_BLOBS.map((b) => b.R * inkGrow((u - b.a) / b.w) * swell);
  const paths = INK_BLOBS.map((b, i) => organicBlob(b, INK_SKIN[i], radii[i]));
  const closed = smoothstep(clamp01((u - 0.76) / 0.06)); // 封口：u≥0.82 整屏压成纯墨（吞没末帧/露出首帧都是实墨，且兜住边缘针孔）

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: INK_MASK_Z }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" preserveAspectRatio="none" style={{ display: 'block' }}>
        <defs>
          {/* 边靠位移造：低频湍流把团揉歪（0.009/0.013 ±36px），高频湍流打碎边毛（0.09/0.12 ±5px）。
              最后只柔化 2–5px（峰值 2）—— 够消锯齿，不够糊成暗角。 */}
          <filter id={`${uid}-rough`} filterUnits="userSpaceOnUse" x="-160" y="-160" width="2240" height="1400" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.009 0.013" numOctaves={3} seed={13} result="lobe" />
            <feDisplacementMap in="SourceGraphic" in2="lobe" scale={36} xChannelSelector="R" yChannelSelector="G" result="d1" />
            <feTurbulence type="fractalNoise" baseFrequency="0.075 0.1" numOctaves={3} seed={37} result="grit" />
            <feDisplacementMap in="d1" in2="grit" scale={9} xChannelSelector="R" yChannelSelector="B" result="d2" />
            <feGaussianBlur in="d2" stdDeviation={0.8 + 0.8 * (1 - u)} />
          </filter>
          {/* 湿边专用：先按墨块形状糊 22px（宽而软），不加位移 —— 它就是交界处的一道潮晕 */}
          <filter id={`${uid}-wet`} filterUnits="userSpaceOnUse" x="-200" y="-200" width="2320" height="1480">
            <feGaussianBlur stdDeviation={22} />
          </filter>
        </defs>

        {/* 湿边（lead 定的形）：只在墨与纸的交界处出现——把同一批形状往外扩 ~110px、压到 0.085、
            再糊 22px。它垫在实墨**下面**，墨块内部一点看不见，所以墨里没有任何细黑线。
            观感：实墨外沿一圈宽 80–140px 的极淡墨晕，就是纸吸墨的那道潮边。 */}
        <g filter={`url(#${uid}-wet)`}>
          {INK_BLOBS.map((b, i) => {
            const r = radii[i];
            if (r < 30) return null;
            const k = (r + 110) / r;
            return (
              <path
                key={`c${i}`}
                d={paths[i]}
                fill={colors.ink}
                opacity={0.085}
                transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)}) scale(${k.toFixed(3)}) translate(${(-b.x).toFixed(1)} ${(-b.y).toFixed(1)})`}
              />
            );
          })}
        </g>
        {/* 实墨块（不透明）+ 填隙 + 边缘絮状物 */}
        <g filter={`url(#${uid}-rough)`}>
          {/* 填隙：同一批形状放大 5% 垫底，把邻团之间的凹角填死（墨块内部不许有针孔） */}
          {INK_BLOBS.map((b, i) => {
            const r = radii[i];
            if (r < 12) return null;
            const k = 1.05;
            return (
              <path
                key={`p${i}`}
                d={paths[i]}
                fill={colors.ink}
                transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)}) scale(${k}) translate(${(-b.x).toFixed(1)} ${(-b.y).toFixed(1)})`}
              />
            );
          })}
          {INK_BLOBS.map((b, i) => (radii[i] > 1 ? <path key={i} d={paths[i]} fill={colors.ink} /> : null))}

          {/* 边缘絮状物：小滴 + 向外的手指，只长在实墨轮廓外 */}
          {INK_BLOBS.map((b, i) => {
            const r = radii[i];
            const local = (u - b.a) / b.w;
            if (r < 26 || local < 0.12 || local > 0.95) return null;
            const skin = INK_SKIN[i];
            const fringe = INK_FRINGE[i];
            return (
              <g key={`f${i}`}>
                {fringe.drops.map((d, j) => (
                  <ellipse
                    key={`d${j}`}
                    cx={(b.x + Math.cos(d.ang + skin.rot) * r * d.dist).toFixed(1)}
                    cy={(b.y + Math.sin(d.ang + skin.rot) * r * d.dist * skin.squash).toFixed(1)}
                    rx={d.r.toFixed(1)}
                    ry={(d.r * 0.72).toFixed(1)}
                    fill={colors.ink}
                  />
                ))}
                {r > 78
                  ? fringe.fingers.map((fg, j) => {
                      const ang = fg.ang + skin.rot;
                      const len = r * fg.len;
                      const cx = b.x + Math.cos(ang) * (r * fg.dist + len / 2);
                      const cy = b.y + Math.sin(ang) * (r * fg.dist + len / 2) * skin.squash;
                      return (
                        <ellipse
                          key={`g${j}`}
                          cx={cx.toFixed(1)}
                          cy={cy.toFixed(1)}
                          rx={(len / 2).toFixed(1)}
                          ry={fg.w.toFixed(1)}
                          fill={colors.ink}
                          transform={`rotate(${rad2deg(ang).toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})`}
                        />
                      );
                    })
                  : null}
              </g>
            );
          })}
        </g>

        {/* 飞白拖尾：贴着前沿、顺着倒墨方向的细长干笔（位置由前沿算，所以永远在前沿前的纸面上） */}
        {INK_TAILS.map((t, i) => {
          const [tx, ty] = frontPoint(front + t.d0, t.b);
          if (tx < -200 || tx > 2120 || ty < -200 || ty > 1280) return null;
          const drift = smoothstep(clamp01((u - 0.02) / 0.1)) * (1 - smoothstep(clamp01((u - 0.82) / 0.12)));
          const o = t.o * drift;
          if (o < 0.03) return null;
          return (
            <ellipse
              key={i}
              cx={tx.toFixed(1)}
              cy={ty.toFixed(1)}
              rx={(t.len / 2).toFixed(1)}
              ry={t.w.toFixed(2)}
              fill={colors.ink}
              opacity={o.toFixed(3)}
              transform={`rotate(${(TAIL_ANGLE + t.skew * 60).toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)})`}
            />
          );
        })}

        {/* 渗纸碎点：同一套「离前沿多远」判定，窄带内显影 */}
        {INK_SPRAY.map((s, i) => {
          const d = s.p - front;
          const band = smoothstep(clamp01((d + 0.1) / 0.06)) * (1 - smoothstep(clamp01((d - 0.03) / 0.07)));
          const o = s.o * band;
          if (o < 0.03) return null;
          return <circle key={i} cx={s.x.toFixed(1)} cy={s.y.toFixed(1)} r={s.r.toFixed(2)} fill={colors.ink} opacity={o.toFixed(3)} />;
        })}

        {/* 封口：末端整屏压成实墨（兜住几何缝隙，只在覆盖 >90% 后介入，看不出来） */}
        {closed > 0.002 ? <rect x="0" y="0" width="1920" height="1080" fill={colors.ink} opacity={closed.toFixed(3)} /> : null}
      </svg>
    </AbsoluteFill>
  );
};

/** 按类型派发遮罩；cut 返回 null（不产生任何 DOM，保证逐像素不变） */
const TransitionMask: FC<{ type: Transition; coverage: number; dir: 'in' | 'out' }> = ({ type, coverage, dir }) => {
  if (type === 'page') return <PageMask coverage={coverage} />;
  if (type === 'dry') return <DryMask coverage={coverage} />;
  if (type === 'ink') return <InkMask coverage={coverage} dir={dir} />;
  return null;
};

/**
 * 全局视觉下沉（shot-spec §4）：暖黑底 + 纸纹垫底随每镜自渲染；装配层不再叠全片 overlay。
 *
 * 镜内转场（design-v11 §二）：转场只在**本镜首/尾帧内占用**，durationFrames / startFrame 不动。
 * in  = 进入本镜的 inbound（首 side 帧遮罩，从满遮罩退开）；
 * out = 本镜的 outbound = 下一镜的 inbound（尾 side 帧遮罩，盖满到最后一帧）。
 * 单侧帧数来自 shots.mjs 的 TRANSITION_SIDE：墨洇 20（总 40）/ 纸翻 18 / 飞白 10 / 硬切 0。
 *
 * 字幕安全窗：字幕 start ≥ in 单侧帧 + 12，end ≤ duration − out 单侧帧 − 12；
 * 墨层 zIndex = INK_MASK_Z（20），字幕层必须压在其上（design-v11 §1.2）。
 * cut 时两值均为 0 且**不渲染任何遮罩层**——默认参数下画面逐像素不变。
 */
export const ShotShell: FC<{ children: ReactNode; in?: Transition; out?: Transition; duration?: number }> = ({
  children,
  in: inTransition = 'cut',
  out: outTransition = 'cut',
  duration,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // 全片装配层里 ShotShell 挂在 Sequence 内，useVideoConfig 给的是根 comp 时长——优先用 manifest 传入的本镜时长
  const total = duration ?? durationInFrames;
  const inSide = TRANSITION_SIDE[inTransition];
  const outSide = TRANSITION_SIDE[outTransition];
  const inCoverage =
    inSide > 0 ? interpolate(frame, [0, inSide], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const outCoverage =
    outSide > 0 ? interpolate(frame, [total - outSide, total - 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {children}
      <AbsoluteFill
        style={{ background: colors.bgLift, opacity: PT.paperGrain.opacity, mixBlendMode: PT.paperGrain.blend, pointerEvents: 'none' }}
      />
      {inSide > 0 ? <TransitionMask type={inTransition} coverage={inCoverage} dir="in" /> : null}
      {outSide > 0 ? <TransitionMask type={outTransition} coverage={outCoverage} dir="out" /> : null}
    </AbsoluteFill>
  );
};