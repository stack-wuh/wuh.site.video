/* S16 · 第一朵烟花在城头上空炸开，火金铺开，烟尾下垂 180f
 *
 * v12 分镜：大远·固定。底图 `p-citynight`（旧图：城楼剪影横贯下方、夜空压得低，烟花由代码画）。
 *
 * 烟花语言沿用 A 组私有 `a-fireworks.tsx` 的**团块**（宋代烟花是低空一团团火金/赭红爆开，
 * 不是球形对称的菊球）：一团主爆在城头上空，起花先上冲；末段远处再补一小朵赭红，
 * 让夜空不是「放完就死」。城头天际线被照亮的一线与云光都只加光、不泛白。
 *
 * 时间：0–20f 硬切入场；34f 主爆；104f 远处小朵（景深最远那层）。
 * 转场：入「切」，出「切」（下一镜 s17 是抬头看她，同级亮度接得上）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { ShotScene } from '../components/e-scene';
import { A_Fireworks, CloudGlow, type FireworkBurst } from '../components/a-fireworks';
import { CLAMP, FILM } from '../motion-tokens';

const TOTAL = 180;
/** 第一朵：城头上空偏右（避开城楼正脊），起爆 34f */
const MAIN = { x: 1050, y: 296, at: 34 } as const;

const BURSTS: FireworkBurst[] = [
  { x: MAIN.x, y: MAIN.y, at: MAIN.at, scale: 1.5, hue: 'gold', rise: true },
  { x: 430, y: 246, at: 104, scale: 0.58, hue: 'ochre' },
];

const S16: FC = () => {
  const f = useCurrentFrame();
  /* 云被由下往上照亮：起爆后 18f 达峰，之后留一条余晖（不做整屏泛白） */
  const glow = interpolate(f, [MAIN.at, MAIN.at + 18, MAIN.at + 46, TOTAL - 1], [0, 1, 0.78, 0.3], CLAMP);

  return (
    <ShotScene name="p-citynight" total={TOTAL} frame={f} zoom={[1.0, 1.045]} dim={0.03}>
      <CloudGlow at={MAIN.at} x={MAIN.x} y={690} intensity={glow} width={1400} height={600} />
      <A_Fireworks seed="s16" bursts={BURSTS} />
      {/* 城头被照亮的一线：贴着城墙天际线的暖反光（只染光，不重画底图） */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 636,
          height: 128,
          background: FILM.fireGold,
          opacity: 0.12 * glow,
          mixBlendMode: 'screen',
          maskImage: 'linear-gradient(180deg, transparent 0%, #000 48%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 48%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
      {/* 夜色：上缘再压一档，城楼那一带留亮 */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(24,29,36,0.34) 0%, transparent 40%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
    </ShotScene>
  );
};

export default S16;