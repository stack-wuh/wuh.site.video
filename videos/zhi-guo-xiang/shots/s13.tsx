/* S13 · 她的侧后，手举在面前，指间夹着第二枚金针，针尖朝下；背景城头虚焦 180f
 *
 * v12 分镜：近·侧后，浅景深。底图 `p-needle-up`（新，art-v12；她的手、指间那枚金针、虚焦的城头都在画里——
 * **针不归代码画**，画坏了不如不画）。
 *
 * 代码只做「浅景深」与「城里的光」：
 *   ① 背景虚焦：几团大片、极淡的暖光斑（城头灯火在景深外化成光斑），各自缓慢漂移；
 *   ② 冷光：城头黄昏的冷调从左上压过来（soft-light 一层很淡的青灰），把她从城墙上拔出来；
 *   ③ 浮尘：逆光里的一层尘。
 * 镜头：1.02 → 1.06 极缓推。
 * 转场：入「墨洇」，出「墨洇」。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ShotScene } from '../components/e-scene';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { LightWash } from '../components/LightWash';
import { CLAMP, FILM } from '../motion-tokens';

const TOTAL = 180;
/** 背景光斑（虚焦的城头灯火）：只补在她抬手那一侧的空处（x 1300–1750 / y 250–430），
 *  底图里已经有一串虚焦灯，所以只加得很少、很慢。 */
const BOKEH = [
  { x: 1450, y: 300, r: 118, a: 0.1, ph: 0.2 },
  { x: 1650, y: 420, r: 92, a: 0.08, ph: 1.7 },
  { x: 1320, y: 236, r: 74, a: 0.07, ph: 3.1 },
] as const;
/** 第二枚金针在底图上的位置（实测：柄 (1108,206) → 尖 (992,404)）——只让光沿着它走，不重画针 */
const NEEDLE = { from: { x: 1108, y: 206 }, to: { x: 992, y: 404 } };

const S14: FC = () => {
  const f = useCurrentFrame();
  return (
    <ShotScene name="p-needle-up" total={TOTAL} frame={f} zoom={[1.02, 1.06]} dim={0.04}>
      {/* ② 城头黄昏的冷调：从左上压过来 */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(126deg, ${FILM.snowCyan} 0%, transparent 46%)`,
          opacity: 0.1,
          mixBlendMode: 'soft-light',
          pointerEvents: 'none',
        }}
      />

      {/* ① 背景虚焦的光斑：大、软、几乎没有边（不在焦点上的东西只有光） */}
      {BOKEH.map((b, i) => {
        const drift = Math.sin((f / 120) * Math.PI * 2 + b.ph) * 10;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: b.x - b.r + drift,
              top: b.y - b.r,
              width: b.r * 2,
              height: b.r * 2,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${FILM.fireGold} 0%, transparent 66%)`,
              opacity: b.a,
              filter: 'blur(26px)',
              mixBlendMode: 'screen',
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* ② 金针上走的一道反光：从针柄滑到针尖（针是底图画的，这里只给光） */}
      {(() => {
        const k = interpolate(f, [24, 132], [0, 1], CLAMP);
        const x = NEEDLE.from.x + (NEEDLE.to.x - NEEDLE.from.x) * k;
        const y = NEEDLE.from.y + (NEEDLE.to.y - NEEDLE.from.y) * k;
        const fade = Math.sin(Math.PI * Math.min(1, Math.max(0, k)));
        return (
          <>
            <div
              style={{
                position: 'absolute',
                left: x - 30,
                top: y - 30,
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${FILM.fireGold} 0%, transparent 64%)`,
                opacity: 0.4 * fade,
                filter: 'blur(9px)',
                mixBlendMode: 'screen',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: x - 2,
                top: y - 2,
                width: 4,
                height: 4,
                borderRadius: 2,
                background: colors.gold,
                opacity: 0.7 * fade,
                mixBlendMode: 'screen',
                pointerEvents: 'none',
              }}
            />
          </>
        );
      })()}

      {/* ③ 逆光里的浮尘 */}
      <DustField act={4} count={16} seedBase="s14-motes" wind={4} />

      {/* 景深：前景与四角压暗（浅景深的框感），但别压掉她举着的那只手 —— 由 LightWash 铺一层 */}
      <LightWash
        shape="ellipse 76% 72% at 52% 46%"
        stops={[['transparent', 44], [colors.ink, 100]]}
        strength={0.22}
        blend="multiply"
      />
      <Caption cue="s13" tone="paper" />
    </ShotScene>
  );
};

export default S14;