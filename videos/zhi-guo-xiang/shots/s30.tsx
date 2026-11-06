/* S30 · 道装侧影，灯焰 180f
 * v10 §五：只有 zoom/drift 的空镜。底图 p-daogu 已画入道装侧影与灯盏，不再叠人物/雪；
 * 只补一层灯焰：暖光呼吸 + 末段一小簇金光炸开（storyboard：某一瞬像一朵极小的烟花——
 * 这是她提笔的原因，母题·火之三）。火形已在底图里，代码只给「光」，不重画火。
 * 转场：入硬切 / 出硬切。S30 的字幕 v5 已删（21→14），本镜无字幕。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { colors } from '../../../brand/tokens';
import { CLAMP } from '../motion-tokens';

/** 底图实测灯焰 (1230,740)，zoom 1.0→1.04 之后约 (1235,744)。 */
const FLAME = { x: 1235, y: 744 };

const S30: FC = () => {
  const f = useCurrentFrame();
  /* 呼吸：11f 一个来回（很轻，不移位）；爆开只在 104–150f 这一瞬 */
  const breathe = 0.5 + 0.5 * Math.sin(f / 11);
  const burst = interpolate(f, [104, 118, 150], [0, 1, 0], CLAMP);
  const glow = 0.16 + breathe * 0.05 + burst * 0.05;
  const r = 96 + burst * 18;
  return (
    <Scene name="p-daogu" zoom={[1.0, 1.04]} warm={0.05} dim={0.1}>
      <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen', opacity: glow }}>
        <div
          style={{
            position: 'absolute',
            left: FLAME.x - r,
            top: FLAME.y - r,
            width: r * 2,
            height: r * 2,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.gold} 0%, ${colors.paper} 26%, transparent 68%)`,
            filter: 'blur(18px)',
          }}
        />
      </AbsoluteFill>
      {burst > 0 ? (
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {Array.from({ length: 7 }).map((_, i) => {
            const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
            const d = 8 + burst * 26;
            return (
              <circle
                key={i}
                cx={FLAME.x + Math.cos(a) * d}
                cy={FLAME.y + Math.sin(a) * d * 0.8}
                r={1.2 + burst * 0.8}
                fill={colors.gold}
                opacity={0.7 * burst}
              />
            );
          })}
        </svg>
      ) : null}
    </Scene>
  );
};

export default S30;