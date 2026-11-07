/* e-emberfield —— 火星/灰烬粒子场（A 组私有：s06 火塘、s07 瞳火、s09 山庄、s15 英雄大会）。
 *
 * 与 DustField 的分工：DustField 是**全画幅**的光尘（纸尘/金尘，圆形、贴纸底）；
 * 本组件是**有火源**的粒子——从 at 处升起、升到一半最亮、越高越淡越小，
 * 用来让「火塘/火把/烟花余烬」有活物感。周期取模而不是一次性生命，整镜都不断火。
 *
 * 确定性：全部 random(seed)（禁 Math.random），同一 seed 两遍渲染逐像素一致。
 * 颜色只取 brand/tokens 与 motion-tokens（全片无红：火金 + 暖金）。
 */
import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { FILM } from '../motion-tokens';

const TAU = Math.PI * 2;

export const EmberField: FC<{
  seedBase: string;
  /** 火源中心（1920×1080 基准） */
  at: { x: number; y: number };
  count?: number;
  /** 火源横向散开（px） */
  spread?: number;
  /** 一团火升到多高（px） */
  rise?: number;
  /** 一轮上升的帧数 */
  period?: number;
  /** 粒子尺寸倍率 */
  sizeBase?: number;
  /** 整层浓度 */
  opacity?: number;
  /** 横向风（px/帧，正右负左） */
  windX?: number;
}> = ({ seedBase, at, count = 14, spread = 140, rise = 240, period = 90, sizeBase = 1, opacity = 1, windX = 0 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {Array.from({ length: count }).map((_, i) => {
        const s = `${seedBase}-ember-${i}`;
        const cycle = period * (0.7 + random(`${s}-cyc`) * 0.7);
        const t = (f + random(`${s}-ph`) * cycle) % cycle;
        const k = t / cycle; // 0 起 → 1 灭
        const x0 = at.x + (random(`${s}-x`) - 0.5) * spread;
        const drift = (random(`${s}-dx`) - 0.5) * spread * 0.7;
        const x = x0 + drift * k + Math.sin(t / 10 + random(`${s}-sw`) * TAU) * 14 + windX * f;
        const y = at.y - k * rise * (0.55 + random(`${s}-ry`) * 0.7);
        const size = (1.1 + random(`${s}-sz`) * 2.2) * sizeBase * (1 - 0.3 * k);
        const o = Math.pow(Math.sin(k * Math.PI), 0.85) * (0.38 + random(`${s}-o`) * 0.4) * opacity;
        const gold = random(`${s}-g`) > 0.35;
        const col = gold ? FILM.fireGold : colors.gold;
        return (
          <div
            key={s}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: size / 2,
              background: col,
              opacity: o,
              boxShadow: `0 0 ${size * 3}px ${col}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};