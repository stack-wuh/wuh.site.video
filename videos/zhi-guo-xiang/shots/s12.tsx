/* S12 · 襄阳城头黄昏：城墙横贯下方三分之一，垛口灯笼，护城河反光，远处蒙古营火连成一线 210f
 *
 * v12 分镜：大远·固定，云压得低。底图 `p-city-wall`（新，art-v12；城墙、垛口灯笼、护城河都在画里）。
 * 战云压城的一镜，什么都不该动得太快：
 *   ① 云：MistFlow 压得很低、走得很慢（period 260）——云在山脊上翻；
 *   ② 营火：地平线上一条极淡的暖光带在呼吸（远，所以不描点，只给一带光）；
 *   ③ 护城河：WaveField 只铺在水带（y 0.72–0.90），低频低幅；
 *   ④ 浮尘：一层薄薄的光尘。
 * 不推不摇（固定）。
 * 转场：入「墨洇」，出「墨洇」。
 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ShotScene } from '../components/e-scene';
import { Caption } from '../components/Caption';
import { WaveField } from '../components/WaveField';
import { MistFlow } from '../components/b-mistflow';
import { WarmBloom } from '../components/e-firelight';
import { DustField } from '../components/DustField';

const TOTAL = 210;

const S13: FC = () => {
  const f = useCurrentFrame();
  return (
    <ShotScene name="p-city-wall" total={TOTAL} frame={f} zoom={[1.0, 1.035]} warm={0.1}>
      {/* ① 压得低的云 */}
      <MistFlow seed="s13-cloud" intensity={0.75} period={260} count={5} />
      {/* ② 远处营火连成的那一线：不描点，只在地平线上洇一带暖光，慢慢呼吸 */}
      <WarmBloom at={{ x: 960, y: 722 }} r={980} squash={0.1} opacity={0.06} period={64} breath={0.45} blur={72} />

      {/* ③ 护城河：横纹只在水带里 */}
      <WaveField seed="s13-moat" band={[0.86, 0.99]} amp={2.6} speed={0.08} opacity={0.14} rows={5} />
      {/* ④ 浮尘 */}
      <DustField act={4} count={18} seedBase="s13-dusk" wind={8} />

      {/* 战云压城：上缘压一档，城墙那一带留亮 */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(24,29,36,0.34) 0%, rgba(24,29,36,0.08) 26%, transparent 44%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 86% 82% at 52% 56%, transparent 46%, rgba(24,29,36,0.32) 100%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
      <Caption cue="s12" tone="paper" />
    </ShotScene>
  );
};

export default S13;