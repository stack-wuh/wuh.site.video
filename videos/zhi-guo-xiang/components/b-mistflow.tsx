/* b-mistflow —— 朝镜头流动的雾（design-v11 §3.4 末拍：雾气向镜头方向流动）。
 *
 *  做法：几团纸白雾斑，各自从远处（小、淡）涨向近处（大、散、淡出）循环；循环端点不透明度为 0，
 *  所以不会出现雾团突然出现/消失的跳。intensity 由镜头给（0–1.2），镜头自己控制何时雾起。
 *  叠在画面层最上面（foreground mist），才能有「雾擦过镜头」的感觉。
 *
 *  v11 调参记：雾斑**不能**做到能盖满画幅——四团大椭圆叠起来会把整帧冲成一张白纸
 *  （抽帧见过 f48/62/76 全白）。所以单团上限压到 1900×420、单团 opacity ≤0.13·intensity，
 *  靠层数而不是靠单团浓度出「近处雾厚」。
 *
 *  确定性：random(seed)；颜色只取 brand/tokens。
 */
import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';

const TAU = Math.PI * 2;

export const MistFlow: FC<{
  seed?: string;
  /** 雾量（0 = 无，1 = 常态，1.2 = 浓） */
  intensity?: number;
  /** 每团雾走完一轮的帧数（越小越快） */
  period?: number;
  /** 雾团数量 */
  count?: number;
}> = ({ seed = 'mist', intensity = 1, period = 200, count = 5 }) => {
  const f = useCurrentFrame();
  if (intensity <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {Array.from({ length: count }).map((_, i) => {
        const s = `${seed}-mist-${i}`;
        const phase = random(`${s}-ph`);
        const p = (((f / period + phase) % 1) + 1) % 1;
        const cx = 0.12 + random(`${s}-x`) * 0.76;
        const cy = 0.44 + random(`${s}-y`) * 0.36;
        const baseW = 460 + random(`${s}-w`) * 520;
        const baseH = 80 + random(`${s}-h`) * 90;
        const grow = 0.8 + p * 1.5;
        const w = baseW * grow;
        const h = baseH * grow;
        /* 端点淡入淡出：p=0/1 时 0，中段最浓；再来一点呼吸，避免整团像贴纸 */
        const bell = Math.sin(p * Math.PI) ** 1.35;
        const breathe = 0.82 + 0.18 * Math.sin((f / 42) * TAU + random(`${s}-b`) * TAU);
        const x = cx * 1920 - w / 2 + Math.sin((f / 96) * TAU + phase * TAU) * 26;
        const y = cy * 1080 - h / 2 - p * 34;
        return (
          <div
            key={s}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: w,
              height: h,
              borderRadius: '50%',
              background: `radial-gradient(ellipse at 50% 50%, ${colors.paper} 0%, transparent 62%)`,
              opacity: bell * breathe * 0.135 * intensity,
              filter: 'blur(18px)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};