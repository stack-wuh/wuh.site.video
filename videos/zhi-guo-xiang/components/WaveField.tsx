import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { PT } from '../motion-tokens';

const TAU = Math.PI * 2;

/** 水面/海面波动（v10 §五：全片没有一处水面动画，s03 渡口与 s36 海两处都需要）。
 *  纯代码：水墨水纹一段段铺开（断续的笔触 + 相位推移），让画动，镜头不动。
 *  颜色只用 brand/tokens（ink / muted）；随机全部走 remotion random(seed)，两遍渲染一致。
 *
 *  用法（放在 <Scene> 里，按底图水面范围给 band；不要把线画到岸上/船上时用 style.clipPath）：
 *    <WaveField seed="s03-water" band={[0.5, 0.95]} amp={8} speed={0.16} opacity={0.5} />
 *    <WaveField seed="s36-sea" band={[0.58, 1]} amp={12} speed={0.22} opacity={0.55} />
 *  例：s03 左岸与船体是底图里的画，给 style={{ clipPath: 'polygon(...)' }} 把水纹关在水面内。 */
export const WaveField: FC<{
  /** 随机种子；同一镜一个固定值 */
  seed?: string;
  /** 波幅（px，1920×1080 基准；近处按深度放大） */
  amp?: number;
  /** 相位速度（周期/秒，0.2 ≈ 5 秒一个波） */
  speed?: number;
  /** 整体不透明度 */
  opacity?: number;
  /** 水域上下边界（画面高度比例） */
  band?: [number, number];
  /** 水纹行数（越多越密） */
  rows?: number;
  style?: CSSProperties;
}> = ({ seed = 'wave', amp = 12, speed = 0.18, opacity = 0.5, band = [0.56, 0.98], rows = 12, style }) => {
  const frame = useCurrentFrame();
  const phase = (frame / 30) * speed * TAU;
  const [bandTop, bandBottom] = band;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'multiply', ...style }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: rows }).map((_, i) => {
          const id = `${seed}-w${i}`;
          const t = rows > 1 ? i / (rows - 1) : 1;
          /* 越靠下（越近）波幅越大、墨色越实：一条近大远小的水面 */
          const depth = 0.32 + 0.68 * t;
          const yBase = (bandTop + (bandBottom - bandTop) * t) * 1080;
          const rowAmp = amp * depth * (0.55 + random(`${id}-amp`) * 0.8);
          const cycles = 1.5 + random(`${id}-cyc`) * 1.5;
          const rowPhase = random(`${id}-ph`) * TAU;
          const drift = 1 + (random(`${id}-dr`) - 0.5) * 0.35;
          const width = PT.water.line * (0.7 + random(`${id}-lw`) * 0.8);
          const dash = `${Math.round(80 + random(`${id}-dash`) * 200)} ${Math.round(24 + random(`${id}-gap`) * 70)}`;
          const flow = -(frame * (0.8 + random(`${id}-flow`) * 1.6));
          const steps = 36;
          const pts: string[] = [];
          for (let s = 0; s <= steps; s++) {
            const x = (s / steps) * 1980 - 30;
            const u = (x / 1920) * TAU * cycles + rowPhase + phase * drift;
            const y = yBase + Math.sin(u) * rowAmp + Math.sin(u * 2.1 + 2.4) * rowAmp * 0.22;
            pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
          }
          return (
            <polyline
              key={id}
              points={pts.join(' ')}
              fill="none"
              stroke={i % 5 === 0 ? colors.ink : colors.muted}
              strokeWidth={width}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={dash}
              strokeDashoffset={flow}
              opacity={opacity * (0.14 + 0.62 * t)}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};