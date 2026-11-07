/* S14 · 英雄大会：火把与人群剪影铺满城下，城头高处一个空袖身影站着，背对 210f
 *
 * v12 分镜：全·固定，火光层层。底图 `p-hero-gathering`（新，art-v12；火把、人群背影、城头那个空袖身影都在画里）。
 * 火把要先「层层」：前景几把、中景几把、远处一片更小更淡的——但**都是光，不是火把的形状**。
 *
 * 代码只做火：
 *   ① 近景火把：FireLine 一盏盏（halo 大、闪得慢）
 *   ② 远景火把：FireLine 更小更密更淡（另一条 band）
 *   ③ 火光在人群上方洇的一层暖雾（WarmBloom 横躺）
 *   ④ 灰烬：从人群里升起来的余烬
 * 不推不摇（固定），把「满」交给底图。
 * 转场：入「墨洇」，出「墨洇」。
 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ShotScene } from '../components/e-scene';
import { Caption } from '../components/Caption';
import { FireLine, WarmBloom } from '../components/e-firelight';
import { EmberField } from '../components/e-emberfield';
import { GroundMist } from '../components/c-fog';
import { DustField } from '../components/DustField';

const TOTAL = 210;

const S15: FC = () => {
  const f = useCurrentFrame();
  return (
    <ShotScene name="p-hero-gathering" total={TOTAL} frame={f} zoom={[1.0, 1.03]} dim={0.04}>
      {/* ③ 火光在人群上方洇开的一层暖雾（先给底，再点火） */}
      <WarmBloom at={{ x: 960, y: 690 }} r={780} squash={0.32} opacity={0.1} period={30} breath={0.4} blur={92} />

      {/* ① 近景火把 */}
      <FireLine seedBase="s15-near" band={{ x0: 140, x1: 1780, y0: 600, y1: 820 }} count={7} halo={66} core={2.6} opacity={0.6} period={24} />
      {/* ② 远景火把：小、密、淡（景深最外那层） */}
      <FireLine seedBase="s15-far" band={{ x0: 200, x1: 1720, y0: 560, y1: 650 }} count={11} halo={26} core={1.4} opacity={0.4} period={32} />

      {/* ④ 余烬 */}
      <EmberField seedBase="s15" at={{ x: 960, y: 830 }} spread={1500} rise={340} count={12} period={160} sizeBase={0.85} opacity={0.7} />

      {/* 人群上方的烟与尘 */}
      <GroundMist seedBase="s15" y={880} drift={0.6} opacity={0.42} />
      <DustField act={3} count={20} seedBase="s15-torchlight" wind={5} />

      {/* 城头高处那个人不动，压一档暗让他的轮廓立起来 */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(24,29,36,0.42) 0%, rgba(24,29,36,0.1) 30%, transparent 52%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 84% 80% at 50% 56%, transparent 46%, rgba(24,29,36,0.36) 100%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
      <Caption cue="s14" tone="paper" />
    </ShotScene>
  );
};

export default S15;