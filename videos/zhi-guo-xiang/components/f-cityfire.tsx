/* f-cityfire —— 城破的火光与火星（S31 专用，2026-11-07 · shots-b 新建）。
 *
 * 底图 `p-city-fall` 已经把「城门起火 / 浓烟压城 / 城墙缺口 / 倒伏的旗」画足了（而且整幅很低调，
 * 烟柱比任何代码烟都重）。所以这一层**不画烟**（抽帧判断：暗烟叠在暗烟上只有两种结果——
 * 看不见，或者糊成一团），只补底图动不了的两样：
 *   · GateGlow  城门那团火的呼吸：screen 的暖金，压着火心 (约 520, 810)，随机相位无关的
 *               三频正弦叠加做「火在跳」，幅度压在 0.1 上下，不抢底图那团真的火；
 *   · WarEmbers 火星：从城门火线升起、被风带向右、升到一半最亮、越升越淡
 *               （周期取模，整镜都有，不会中途熄）。
 * 禁纯黑、禁红：火星只用 FILM.fireGold。
 * 坐标基准 1920×1080，火线与火心按 p-city-fall 实测。
 */
import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { FILM } from '../motion-tokens';

/** 城门火心（量自 p-city-fall：火烧在城门洞里，画面左下）。 */
const FIRE = { x: 520, y: 812 };
/** 火星起飞的横向范围（火线宽 ≈ 380–700）。 */
const SPAN_X: [number, number] = [372, 712];
/** 火星升满这一段后熄。 */
const RISE = 420;

export const GateGlow: FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const f = useCurrentFrame();
  /* 三条互质周期的正弦：像火，但完全可复现（同帧同像素） */
  const flick = 0.5 * Math.sin(f / 3.1) + 0.3 * Math.sin(f / 1.7 + 1.3) + 0.2 * Math.sin(f / 5.3 + 0.7);
  const breath = 0.5 + 0.5 * Math.sin((f / 90) * Math.PI * 2);
  const r = 300 + breath * 30;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen' }}>
      <div
        style={{
          position: 'absolute',
          left: FIRE.x - r,
          top: FIRE.y - r * 0.72,
          width: r * 2,
          height: r * 1.44,
          borderRadius: '50%',
          background: `radial-gradient(ellipse at 50% 56%, ${FILM.fireGold} 0%, transparent 64%)`,
          opacity: (0.09 + 0.05 * flick + 0.03 * breath) * intensity,
          filter: 'blur(26px)',
        }}
      />
    </AbsoluteFill>
  );
};

export const WarEmbers: FC<{ seed?: string; count?: number; intensity?: number }> = ({
  seed = 's31-ember',
  count = 28,
  intensity = 1,
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {Array.from({ length: count }).map((_, i) => {
        const s = `${seed}-${i}`;
        const cycle = 64 + random(`${s}-c`) * 86;
        const t = (f + random(`${s}-ph`) * cycle) % cycle;
        const k = t / cycle; // 0 起火线 → 1 熄
        const x0 = SPAN_X[0] + random(`${s}-x`) * (SPAN_X[1] - SPAN_X[0]);
        const rise = RISE * (0.5 + random(`${s}-r`) * 0.9);
        /* 风向右：越升越往右带（与底图烟柱倒向右边的方向一致） */
        const x = x0 + Math.sin(t / 8 + random(`${s}-sw`) * Math.PI * 2) * 14 + k * (60 + random(`${s}-d`) * 130);
        const y = FIRE.y - k * rise;
        const size = 1.2 + random(`${s}-sz`) * 1.9;
        const o = Math.sin(k * Math.PI) * (0.4 + random(`${s}-o`) * 0.34) * intensity;
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
              background: FILM.fireGold,
              opacity: o,
              boxShadow: `0 0 ${size * 3.5}px ${FILM.fireGold}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};