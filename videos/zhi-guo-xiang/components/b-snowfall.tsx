/* b-snowfall —— 雪（design-v11 §3.4 冬拍 / §3.6 雪山）：斜落雪片，风向右为正（px/秒）。
 *
 *  与 DustField 的分工：DustField 是光尘（暖金/纸尘、圆点、贴纸底），本组件是雪（冷灰青短斜线 +
 *  近景柔白点），在白纸雪原上仍能被读成「雪」而不是脏点。风的定义与 DustField.wind 对齐（px/秒），
 *  所以「风向右 12px/s」两处可以直接照抄。
 *
 *  确定性：粒子全部 random(seed)，两遍渲染一致（禁 Math.random）。
 *  颜色只取 brand/tokens + motion-tokens（FILM.snowCyan）。
 */
import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { FILM } from '../motion-tokens';

const W = 1920;
const H = 1080;
/** 横向环绕跨度：左右各留 120px 余量，风雪不会在边上突然消失 */
const SPAN_X = W + 240;
const SPAN_Y = H + 80;

export const SnowFall: FC<{
  seed: string;
  /** 雪片数量（远中近合计） */
  count?: number;
  /** 水平风（px/秒，正右负左） */
  wind?: number;
  /** 整层不透明度 */
  opacity?: number;
  /** 下落速度倍率（1 = 常态） */
  speed?: number;
}> = ({ seed, count = 90, wind = 12, opacity = 0.75, speed = 1 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: count }).map((_, i) => {
          const s = `${seed}-flake-${i}`;
          /* depth：0 远（小、慢、淡）/ 1 近（大、快、亮、带拖尾） */
          const depth = random(`${s}-d`);
          const fall = (0.85 + depth * 3.2) * speed;
          const y = ((random(`${s}-y`) * SPAN_Y + f * fall) % SPAN_Y) - 40;
          const swayAmp = 5 + depth * 20;
          const swayRate = 34 + random(`${s}-sr`) * 52;
          const sway = Math.sin((f / swayRate) * Math.PI * 2 + random(`${s}-ph`) * Math.PI * 2) * swayAmp;
          const xRaw = random(`${s}-x`) * SPAN_X + sway + (wind * f) / 30;
          const x = ((xRaw % SPAN_X) + SPAN_X) % SPAN_X - 120;
          const len = 3 + depth * 13;
          const vx = wind / 30;
          const vy = fall;
          const norm = Math.hypot(vx, vy) || 1;
          const k = len / norm;
          const near = depth > 0.8;
          const stroke = i % 5 === 0 ? colors.paper : FILM.snowCyan;
          const a = 0.16 + depth * 0.46;
          return (
            <g key={s}>
              <line
                x1={x - vx * k}
                y1={y - vy * k}
                x2={x}
                y2={y}
                stroke={stroke}
                strokeWidth={1 + depth * 2.2}
                strokeLinecap="round"
                opacity={a}
              />
              {near ? (
                <circle cx={x} cy={y} r={1.6 + depth * 1.8} fill={colors.paper} opacity={0.4 + depth * 0.34} />
              ) : null}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};