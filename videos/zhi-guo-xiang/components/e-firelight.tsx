/* e-firelight —— 火光的三件套（A 组私有：s06 火塘 / s07 瞳火 / s08 灯笼 / s09 火把 /
 * s10 逆光 / s12 面具金边 / s13 营火一线 / s15 英雄大会）。
 *
 * 三件：
 *   · WarmBloom —— 一团会呼吸的暖光（火塘、灯笼、城头被照亮的一带）。加色不加白：用 screen。
 *   · FireLine  —— 一排各自闪烁的暖点（火把阵、营火、灯笼队），每个点一个柔光晕 + 一粒芯。
 *   · RimLight  —— 一条窄长的暖光带，用来当「逆光里描在轮廓上的一线金」（面具边、空袖边）。
 *     它不画形状，只在给定的位置压一道光；位置由调用方按底图实测给。
 *
 * 确定性：闪烁只用 Math.sin（相位来自 random(seed)），不用 Math.random。
 * 颜色只取 brand/tokens + motion-tokens；全片无红。
 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { FILM } from '../motion-tokens';

const TAU = Math.PI * 2;

/** 一团会呼吸的暖光。period = 一次呼吸的帧数；phase 让同一镜里的两盏灯不同步。 */
export const WarmBloom: FC<{
  at: { x: number; y: number };
  r: number;
  /** 峰值浓度（0–1） */
  opacity: number;
  period?: number;
  phase?: number;
  /** 呼吸深度（0 = 不呼吸，1 = 从 0 到峰值） */
  breath?: number;
  color?: string;
  /** 形状：圆 / 横躺的椭圆（火塘、被照亮的一带） */
  squash?: number;
  blur?: number;
  style?: CSSProperties;
}> = ({ at, r, opacity, period = 48, phase = 0, breath = 0.35, color = FILM.fireGold, squash = 1, blur = 30, style }) => {
  const f = useCurrentFrame();
  const b = 1 - breath + breath * (0.5 + 0.5 * Math.sin((f / period) * TAU + phase));
  if (opacity * b <= 0.004) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: at.x - r,
        top: at.y - r * squash,
        width: r * 2,
        height: r * 2 * squash,
        borderRadius: '50%',
        background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${color} 0%, transparent 68%)`,
        opacity: opacity * b,
        filter: `blur(${blur}px)`,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
};

export type FireBand = { x0: number; x1: number; y0: number; y1: number };

/** 一排暖点：火把阵 / 营火一线 / 提灯的队伍。每个点自己闪烁（双频），并带一圈柔光。 */
export const FireLine: FC<{
  seedBase: string;
  band: FireBand;
  count?: number;
  /** 光晕半径（px） */
  halo?: number;
  /** 芯的半径（px） */
  core?: number;
  opacity?: number;
  /** 闪烁周期（帧） */
  period?: number;
  color?: string;
  /** 整排缓慢横向漂移（px/帧） */
  driftX?: number;
}> = ({ seedBase, band, count = 6, halo = 46, core = 2.2, opacity = 1, period = 34, color = FILM.fireGold, driftX = 0 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {Array.from({ length: count }).map((_, i) => {
        const s = `${seedBase}-fire-${i}`;
        const x = band.x0 + random(`${s}-x`) * (band.x1 - band.x0) + driftX * f;
        const y = band.y0 + random(`${s}-y`) * (band.y1 - band.y0);
        const ph = random(`${s}-ph`) * TAU;
        const flick = 0.5 + 0.28 * Math.sin((f / period) * TAU + ph) + 0.12 * Math.sin((f / 7) * TAU + ph * 2);
        const r = halo * (0.7 + random(`${s}-r`) * 0.8);
        const o = (0.4 + random(`${s}-o`) * 0.4) * flick * opacity;
        if (o <= 0.01) return null;
        return (
          <div key={s} style={{ position: 'absolute', left: x, top: y, pointerEvents: 'none' }}>
            <div
              style={{
                position: 'absolute',
                left: -r,
                top: -r,
                width: r * 2,
                height: r * 2,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${color} 0%, transparent 64%)`,
                opacity: 0.5 * o,
                filter: 'blur(6px)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: -core,
                top: -core,
                width: core * 2,
                height: core * 2,
                borderRadius: core,
                background: colors.gold,
                opacity: o,
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** 逆光里描在轮廓上的一线金：一条窄长、两端收尾的光带（rotate 沿轮廓走）。 */
export const RimLight: FC<{
  at: { x: number; y: number };
  /** 长度（px） */
  len: number;
  /** 厚度（px） */
  width?: number;
  /** 角度（deg，0 = 水平） */
  angle?: number;
  /** 0–1 强度 */
  amount: number;
  color?: string;
  blur?: number;
}> = ({ at, len, width = 10, angle = 0, amount, color = FILM.fireGold, blur = 10 }) => {
  if (amount <= 0.004) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: at.x - len / 2,
        top: at.y - width / 2,
        width: len,
        height: width,
        transform: `rotate(${angle}deg)`,
        background: `linear-gradient(90deg, transparent 0%, ${color} 28%, ${color} 72%, transparent 100%)`,
        opacity: 0.55 * Math.min(1, amount),
        filter: `blur(${blur}px)`,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }}
    />
  );
};