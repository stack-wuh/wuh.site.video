/* f-clouddrift —— 云海在走（2026-11-07 · shots-b 新建）。
 *
 * 为什么不用 b-mistflow：MistFlow 是**纸白 + screen**，它假定底图云是灰的；但 v12 的
 * 断肠崖 / 华山云海 / 雾中白衣这几张新底图本身已经是大面积留白的白云——白雾叠在白云上
 * 抽帧几乎看不见（S18 第一版就是这样，画面像一张静帧）。
 *
 * 这一层换成**低饱和的灰**（colors.muted / colors.paperMuted）做 multiply：
 * 白云上压一层很淡的灰影在横向漂，读作「云的影子在走」，而不是「有人把画面调暗」。
 * 只铺在 band 指定的画面高度带里（云在哪就铺到哪），每团都是几十 px 模糊的软椭圆。
 *
 * 确定性：random(seed)；颜色只取 brand/tokens。
 */
import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';

const W = 1920;

export const CloudDrift: FC<{
  seed?: string;
  /** 云团数量（5–8 比较稳） */
  count?: number;
  /** 整体浓度 0–1.2（0.8 = 常态） */
  intensity?: number;
  /** 云所在的画面高度带（0–1，相对 1080） */
  band?: [number, number];
  /** 横向漂移速度（px/帧，正右负左；0.2–0.6 很慢） */
  speed?: number;
  /** 单团灰影的浓度上限（0.05–0.10 之间最像云，别超过 0.14） */
  dark?: number;
}> = ({ seed = 'cloud', count = 6, intensity = 0.85, band = [0.34, 1.0], speed = 0.35, dark = 0.075 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'multiply' }}>
      {Array.from({ length: count }).map((_, i) => {
        const s = `${seed}-cloud-${i}`;
        const size = 520 + random(`${s}-w`) * 620;
        const span = W + size;
        const x = ((random(`${s}-x`) * span + f * speed * (0.7 + random(`${s}-v`) * 0.7)) % span) - size;
        const top = band[0] + random(`${s}-y`) * (band[1] - band[0]);
        const h = 150 + random(`${s}-h`) * 170;
        /* 呼吸：让每一团的浓淡不同步（否则会读成一条带子在平移） */
        const breathe = 0.72 + 0.28 * Math.sin((f / (110 + random(`${s}-b`) * 90)) * Math.PI * 2 + random(`${s}-ph`) * 6.28);
        return (
          <div
            key={s}
            style={{
              position: 'absolute',
              left: x,
              top: top * 1080 - h / 2,
              width: size,
              height: h,
              borderRadius: '50%',
              background: `radial-gradient(ellipse at 50% 50%, ${i % 3 === 0 ? colors.muted : colors.paperMuted} 0%, transparent 70%)`,
              opacity: breathe * dark * intensity,
              filter: `blur(${26 + random(`${s}-bl`) * 30}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};