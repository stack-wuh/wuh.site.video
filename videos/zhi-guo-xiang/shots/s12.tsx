/* S12 · 满城烟花炸开，火金铺满夜空 210f
 * v11 §3.3（用户意见 5）：底图沿用现有 p-citynight；烟花语言换成团块（见 a-fireworks.tsx），
 * 并补上 design 要求的第三件事——**城中屋脊被照亮**：暖光从烟花落点扩散到屋顶，
 * 用几片低不透明度、错开角度的暖色光斑染色（screen），不是全屏泛白。
 *
 * 三层景深错峰（每 18–24f 一朵，远的先画）：
 *   远 s≈0.6 → 中 s≈1.0 → 近 s≈1.5（近景大而亮、远景小而糊）
 * 时间：34f 中景 → 54f 远 → 76f 近 → 94f 远 → 120f 中 → 142f 远 → 164f 近 → 186f 中收尾。
 * 0–20f 是入本镜的墨洇（转场归 ShotShell），第一朵 34f 才爆——入场动效不会被墨吃掉。
 * 本镜无字幕（旁白无此镜）。
 */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { A_Fireworks, CloudGlow, type FireworkBurst } from '../components/a-fireworks';
import { colors } from '../../../brand/tokens';
import { CLAMP, FILM } from '../motion-tokens';

/** 三层景深的烟花表：at 错峰 18–24f，x 分散满城，火金与赭红交替。 */
const BURSTS: FireworkBurst[] = [
  { x: 830, y: 318, at: 34, scale: 1.0, hue: 'gold' },
  { x: 400, y: 246, at: 54, scale: 0.6, hue: 'ochre' },
  { x: 1000, y: 250, at: 76, scale: 1.5, hue: 'gold', rise: true },
  { x: 1530, y: 232, at: 94, scale: 0.58, hue: 'gold' },
  { x: 1330, y: 300, at: 120, scale: 1.05, hue: 'ochre' },
  { x: 1180, y: 214, at: 142, scale: 0.6, hue: 'gold' },
  { x: 560, y: 206, at: 164, scale: 1.45, hue: 'gold', rise: true },
  { x: 620, y: 262, at: 186, scale: 1.0, hue: 'ochre' },
];

/** 一朵烟花「照亮屋顶」的包络：爆开后 20f 达峰，之后留一条余晖。 */
const pulse = (f: number, at: number) => interpolate(f, [at, at + 20, at + 82], [0, 1, 0.22], CLAMP);

/** 屋脊光斑：基准落在城墙/城楼那一带（art 实测 p-citynight 屋顶面 y≈700–760）；
 *  near 两朵里谁更亮，光心就朝谁偏——读作「光从烟花扩散到屋顶」。 */
const ROOFS = [
  { x: 330, y: 762, near: [54, 76] as const, w: 560, h: 190, rot: -5, gold: true },
  { x: 900, y: 744, near: [34, 76] as const, w: 660, h: 205, rot: 3, gold: true },
  { x: 1400, y: 716, near: [94, 120] as const, w: 620, h: 195, rot: -3, gold: false },
];

const RoofGlow: FC<{ f: number }> = ({ f }) => (
  <>
    {ROOFS.map((r) => {
      const pA = pulse(f, r.near[0]);
      const pB = pulse(f, r.near[1]);
      const p = Math.max(pA, pB);
      if (p <= 0.02) return null;
      const drift = (pB > pA ? 1 : -1) * 40 * p;
      const col = r.gold ? FILM.fireGold : colors.accent;
      return (
        <div
          key={`${r.x}-${r.y}`}
          style={{
            position: 'absolute',
            left: r.x - r.w / 2 + drift,
            top: r.y - r.h / 2,
            width: r.w,
            height: r.h,
            transform: `rotate(${r.rot}deg)`,
            pointerEvents: 'none',
          }}
        >
          {/* 片 1：大而虚的一层，给屋脊整体染色 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: `radial-gradient(ellipse 58% 44% at 50% 54%, ${col} 0%, transparent 72%)`,
              opacity: 0.17 * p,
              filter: 'blur(26px)',
              mixBlendMode: 'screen',
            }}
          />
          {/* 片 2：偏左上一小块更亮的光，让照亮有「来源方向」而不是均匀铺开 */}
          <div
            style={{
              position: 'absolute',
              left: r.w * 0.12,
              top: r.h * 0.18,
              width: r.w * 0.46,
              height: r.h * 0.4,
              borderRadius: '50%',
              background: `radial-gradient(ellipse, ${col} 0%, transparent 68%)`,
              opacity: 0.13 * p,
              filter: 'blur(16px)',
              mixBlendMode: 'screen',
            }}
          />
        </div>
      );
    })}
  </>
);

const S12: FC = () => {
  const f = useCurrentFrame();

  /* 三处云光（近景两朵 + 中景一朵）与整体亮度 */
  const glowA = pulse(f, 76);
  const glowB = pulse(f, 120);
  const glowC = pulse(f, 164);
  const overall = Math.max(glowA, glowB, glowC) * 0.7 + 0.3 * pulse(f, 34);

  return (
    <Scene name="p-citynight" zoom={[1.04, 1.1]} dim={0.05}>
      {/* 云被由下往上照亮：跟着近景两朵走，中景补一条赭红 */}
      <CloudGlow at={76} x={1000} y={700} intensity={glowA} width={1500} height={600} />
      <CloudGlow at={120} x={1330} y={710} intensity={glowB} width={1200} height={520} hue="ochre" />
      <CloudGlow at={164} x={560} y={700} intensity={glowC} width={1320} height={560} />

      <A_Fireworks seed="s12" bursts={BURSTS} />

      {/* 城中屋脊被照亮：片状暖光（低不透明度、两片错角，避免读成一个大椭圆） */}
      <RoofGlow f={f} />

      {/* 整体暖光：很轻的一档，只把夜空从冷蓝往火金方向提一点（不是全屏泛白） */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: FILM.fireGold,
          opacity: 0.05 * overall,
          mixBlendMode: 'soft-light',
        }}
      />
    </Scene>
  );
};

export default S12;