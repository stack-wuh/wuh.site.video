import { useCurrentFrame } from 'remotion';

/** useBreath —— 「会呼吸的光」的时间基元。
 *
 *  v12 收编：全片有 13 个镜头各自手写过同一行
 *  `0.5 + 0.5 * Math.sin((f / N) * Math.PI * 2)`，
 *  差别只有周期 N（90 / 150 / 300 …）。抽成一个 hook，周期与相位显式传。
 *
 *  返回 **0–1** 的呼吸值（raw）；`depth` 用来把呼吸压浅：
 *  返回 `1 - depth + depth * raw`，depth=0 就是恒为 1（不呼吸），depth=0.35 是「从 0.65 到 1」。
 *
 *  确定性：只用 Math.sin + 帧号，天然可复现，不含 Math.random / Date.now。
 */
export const useBreath = (period: number, phase = 0, depth = 1): number => {
  const f = useCurrentFrame();
  const raw = 0.5 + 0.5 * Math.sin((f / Math.max(1, period)) * Math.PI * 2 + phase);
  return 1 - depth + depth * raw;
};
/** 区间形态：返回 `from + (to - from) * raw`。
 *  用于「直流 + 幅度」的写法（如 0.035 + 0.012·sin），等价改写为 useBreathBetween(0.023, 0.047, 96)。 */
export const useBreathBetween = (from: number, to: number, period: number, phase = 0): number => {
  const raw = useBreath(period, phase, 1);
  return from + (to - from) * raw;
};
