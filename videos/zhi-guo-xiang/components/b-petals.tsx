/* b-petals —— 春拍落花（design-v11 §3.4 第一拍：春·淡青雾 + 落花）。
 *
 *  处理：不是「樱花雨」——水墨片里的落花只给 30 粒左右的小瓣，纸白偏暖（paperDeep）
 *  与琥珀（accent）两色交替、低不透明度，片片带自己的翻转；落在路面上才看得见，
 *  所以不要大粒子、不要高饱和。
 *
 *  确定性：全部 random(seed)；颜色只取 brand/tokens。
 */
import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';

const W = 1920;
const H = 1080;
const SPAN_X = W + 160;
const SPAN_Y = H + 60;
const TAU = Math.PI * 2;

export const Petals: FC<{
  seed: string;
  count?: number;
  /** 整层不透明度 */
  opacity?: number;
  /** 横向风（px/秒，正右负左）：春拍用很轻的左风，让花朝镜头偏左飘 */
  wind?: number;
}> = ({ seed, count = 30, opacity = 0.8, wind = -13 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: count }).map((_, i) => {
          const s = `${seed}-petal-${i}`;
          const depth = random(`${s}-d`);
          const fall = (0.5 + depth * 1.5) * 1;
          const y = ((random(`${s}-y`) * SPAN_Y + f * fall) % SPAN_Y) - 30;
          const sway = Math.sin((f / (26 + random(`${s}-sr`) * 34)) * TAU + random(`${s}-ph`) * TAU) * (5 + depth * 16);
          const xRaw = random(`${s}-x`) * SPAN_X + sway + (wind * f) / 30;
          const x = ((xRaw % SPAN_X) + SPAN_X) % SPAN_X - 80;
          const r = 4.4 + depth * 7.2;
          const rot = random(`${s}-r0`) * 180 + f * (2.2 + random(`${s}-rs`) * 5.5);
          /* 花瓣形状：细长、一头尖；不是圆点（v11 抽帧返工：圆点读成脏点/噪点） */
          const shape = `M0 ${-r} C ${r * 0.62} ${-r * 0.45}, ${r * 0.58} ${r * 0.5}, 0 ${r} C ${-r * 0.58} ${r * 0.5}, ${-r * 0.62} ${-r * 0.45}, 0 ${-r} Z`;
          const color = i % 3 === 0 ? colors.accent : colors.muted;
          return (
            <path
              key={s}
              d={shape}
              fill={color}
              opacity={0.5 + depth * 0.38}
              transform={`translate(${x} ${y}) rotate(${rot}) scale(0.55 1)`}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};