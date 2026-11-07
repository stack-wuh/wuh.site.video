/* b-footprints —— 雪径脚印（design-v11 §3.6：她走过处留一串脚印，末 30f 新雪把最近两枚盖住）。
 *
 *  v10 的脚印是底图里画好的、被抹平的一行；v11 底图 p-snow-walk 只画雪脊与人，不画脚印，
 *  所以这里补整串：
 *   · footprintTrail() 沿一条二次曲线按透视排点（近大远小、近疏远密），瓣形 = 鞋头 + 跟印；
 *   · FootprintTrail 把点画成「压下去的雪」（灰褐影 + 墨心 + 下缘一线亮）；
 *   · cover 0→1 时，最近的两枚被新雪（纸白软斑）淡入盖住——孤独感来自「连痕迹也留不住」。
 *
 *  确定性：random(seed)；颜色只取 brand/tokens。
 */
import type { FC } from 'react';
import { AbsoluteFill, random } from 'remotion';
import { colors } from '../../../brand/tokens';

export type FootPoint = { x: number; y: number; s: number; rot: number };

type Pt = { x: number; y: number; s: number };

/** 沿 from→to 的二次曲线排 count 个脚印点：t 走透视（近疏远密），大小从 from.s 收到 to.s。 */
export const footprintTrail = (from: Pt, ctrl: Pt, to: Pt, count: number, seed: string): FootPoint[] =>
  Array.from({ length: count }).map((_, i) => {
    const raw = count > 1 ? i / (count - 1) : 0;
    /* 透视：近端（raw=0）间距大、远端挤在一起 */
    const t = Math.pow(raw, 1.45);
    const mt = 1 - t;
    const x = mt * mt * from.x + 2 * mt * t * ctrl.x + t * t * to.x;
    const y = mt * mt * from.y + 2 * mt * t * ctrl.y + t * t * to.y;
    const s = from.s + (to.s - from.s) * t;
    /* 左右脚交替：小幅横向错开 + 各自的旋转；随机只用来打散，同一 seed 恒定 */
    const side = i % 2 === 0 ? -1 : 1;
    const jitterX = (random(`${seed}-jx-${i}`) - 0.5) * s * 0.5;
    const jitterY = (random(`${seed}-jy-${i}`) - 0.5) * s * 0.35;
    return {
      x: x + side * s * 0.3 + jitterX,
      y: y + jitterY,
      s,
      rot: (random(`${seed}-rot-${i}`) - 0.5) * 16,
    };
  });

const Print: FC<{ p: FootPoint; opacity: number }> = ({ p, opacity }) => (
  <g transform={`translate(${p.x} ${p.y}) rotate(${p.rot})`} opacity={opacity}>
    {/* 压下去的雪：外圈灰褐影 */}
    <ellipse cx={0} cy={0} rx={p.s * 0.42} ry={p.s * 0.56} fill={colors.muted} opacity={0.34} />
    {/* 墨心（薄薄一层，不能读成洞） */}
    <ellipse cx={0} cy={p.s * 0.08} rx={p.s * 0.3} ry={p.s * 0.4} fill={colors.ink} opacity={0.16} />
    {/* 脚尖 */}
    <circle cx={0} cy={-p.s * 0.44} r={p.s * 0.17} fill={colors.ink} opacity={0.12} />
    {/* 下缘一线亮雪：让凹痕有厚度 */}
    <path
      d={`M${-p.s * 0.3} ${p.s * 0.3} Q0 ${p.s * 0.52} ${p.s * 0.3} ${p.s * 0.3}`}
      fill="none"
      stroke={colors.paper}
      strokeWidth={Math.max(0.6, p.s * 0.06)}
      opacity={0.55}
    />
  </g>
);

export const FootprintTrail: FC<{
  points: FootPoint[];
  /** 0–1：新雪盖住最近 coverCount 枚脚印的进度 */
  cover?: number;
  /** 被盖住的脚印枚数（默认最近两枚） */
  coverCount?: number;
  /** 整层不透明度 */
  opacity?: number;
}> = ({ points, cover = 0, coverCount = 2, opacity = 1 }) => (
  <AbsoluteFill style={{ pointerEvents: 'none', opacity }}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
      {/* 脚印：近处的更实一点（观众是从近处往远处看的） */}
      {points.map((p, i) => (
        <Print key={i} p={p} opacity={Math.max(0.42, Math.min(1, p.s / 26))} />
      ))}
      {/* 新雪：只盖最近的两枚；软边、比脚印大一圈，像一层刚落下的雪压上去 */}
      {cover > 0.001
        ? points.slice(0, coverCount).map((p, i) => (
            <g key={`cover-${i}`} opacity={cover} style={{ filter: 'blur(2.6px)' }}>
              <ellipse cx={p.x} cy={p.y + p.s * 0.1} rx={p.s * 0.95} ry={p.s * 1.15} fill={colors.paper} opacity={0.95} />
              <ellipse cx={p.x - p.s * 0.2} cy={p.y - p.s * 0.25} rx={p.s * 0.6} ry={p.s * 0.5} fill={colors.paper} opacity={0.55} />
            </g>
          ))
        : null}
      {/* 雪粒被风推过脚印的那几笔：只在新雪盖上之后出现 */}
      {cover > 0.001
        ? points.slice(0, coverCount).map((p, i) => (
            <path
              key={`drift-${i}`}
              d={`M${p.x - p.s * 1.4} ${p.y + p.s * 0.5} Q${p.x} ${p.y + p.s * 0.2} ${p.x + p.s * 1.5} ${p.y + p.s * 0.55}`}
              fill="none"
              stroke={colors.paper}
              strokeWidth={p.s * 0.18}
              strokeLinecap="round"
              opacity={cover * 0.7}
            />
          ))
        : null}
    </svg>
  </AbsoluteFill>
);