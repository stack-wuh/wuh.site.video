/* f-cityfire —— 城破的火与烟（S31 专用，2026-11-07 · shots-b 新建）。
 *
 * 底图 `p-city-fall` 画的是「城门起火、浓烟压城、城墙缺口」；代码只补**烧起来的那一层**，
 * 不画人、不画旗、不画新的火形：
 *   · WarSmoke  贴着火线往上升的墨烟：16 团软烟柱，各自速度/相位/横向漂移都走 random(seed)；
 *               另加一层贴城门的暖金呼吸（screen），让烟是被火照亮的，不是一块灰。
 *   · WarEmbers 火星：从火线升起、升到一半最亮、越升越淡（周期取模，整镜都有，不会中途熄）。
 * 禁纯黑：烟心用 colors.ink，最浓处也只有 0.16 的单团不透明度，靠层数叠浓度。
 * 坐标基准 1920×1080；火线 FIRE_Y 是底图上城墙脚下的那条燃烧带。
 */
import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { FILM } from '../motion-tokens';

const TAU = Math.PI * 2;
/** 火线：烟与火星都从这条线上长出来（城门口燃烧带）。 */
const FIRE_Y = 742;
/** 烟升满这一整段（px）后到画面顶上散掉。 */
const RISE = 780;

export const WarSmoke: FC<{ seed?: string; intensity?: number }> = ({ seed = 's31-fire', intensity = 1 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* 火光：贴着城门的暖金呼吸（screen）——火在下面烧，烟才被照出层次 */}
      <div
        style={{
          position: 'absolute',
          left: 240,
          top: FIRE_Y - 260,
          width: 1500,
          height: 720,
          borderRadius: '50%',
          background: `radial-gradient(ellipse at 50% 68%, ${FILM.fireGold} 0%, transparent 62%)`,
          mixBlendMode: 'screen',
          opacity: (0.11 + 0.05 * Math.sin((f / 7) * TAU) + 0.02 * Math.sin(f / 2.3)) * intensity,
          filter: 'blur(26px)',
        }}
      />
      {/* 烟柱：从火线往上，越往上越散、越淡 */}
      {Array.from({ length: 14 }).map((_, i) => {
        const s = `${seed}-smoke-${i}`;
        const x0 = 120 + random(s) * 1660;
        const size = 250 + random(`${s}-w`) * 420;
        const speed = 0.55 + random(`${s}-v`) * 1.25;
        const phase = random(`${s}-p`) * RISE;
        const raised = (f * speed + phase) % RISE;
        const y = FIRE_Y - raised;
        const k = raised / RISE; // 0 刚起火线 → 1 到顶
        const bell = Math.sin(Math.min(1, k * 1.18) * Math.PI) ** 0.7;
        const drift = Math.sin((f + random(`${s}-d`) * 200) / 92) * 34 + k * 60;
        return (
          <div
            key={s}
            style={{
              position: 'absolute',
              left: x0 + drift - size / 2,
              top: y - size * 0.62,
              width: size,
              height: size * 0.86,
              borderRadius: '50%',
              background: `radial-gradient(ellipse at 50% 52%, ${colors.ink} 0%, ${colors.ink} 34%, transparent 72%)`,
              mixBlendMode: 'multiply',
              opacity: bell * (0.085 + random(`${s}-o`) * 0.065) * intensity,
              filter: `blur(${30 + random(`${s}-b`) * 34}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const WarEmbers: FC<{ seed?: string; count?: number; intensity?: number }> = ({
  seed = 's31-ember',
  count = 26,
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
        const x0 = 300 + random(`${s}-x`) * 1320;
        const rise = 150 + random(`${s}-r`) * 300;
        const x = x0 + Math.sin(t / 8 + random(`${s}-sw`) * TAU) * 20 + t * 0.4;
        const y = FIRE_Y - k * rise;
        const size = 1.2 + random(`${s}-sz`) * 1.9;
        const o = Math.sin(k * Math.PI) * (0.4 + random(`${s}-o`) * 0.36) * intensity;
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