/* S05 · 黄河渡口黄昏，木船系在桩上，远山淡墨，云与河都静着 210f
 *
 * v12 分镜：大远·固定，云在动。底图 `p-ferry`（船、桩、缆绳、芦苇、远山都在画里）。
 * 这一镜是全片的「门」——镜头不动，只让空气动：
 *   ① 河面：WaveField 只铺在水带（y 0.55–0.80，实测水面），低频、低幅、墨色断续；
 *   ② 云与雾：MistFlow 一层慢雾贴山走（period 280，极慢）；
 *   ③ 光尘：DustField 顺河风向右。
 * 不做推进——「静着」是这一镜的内容；动的是云、雾、水。
 * 转场：入「墨洇」，出「墨洇」。
 */
import type { FC } from 'react';
import { useCurrentFrame } from 'remotion';
import { ShotScene } from '../components/e-scene';
import { Caption } from '../components/Caption';
import { WaveField } from '../components/WaveField';
import { MistFlow } from '../components/b-mistflow';
import { DustField } from '../components/DustField';

const TOTAL = 210;

const S05: FC = () => {
  const f = useCurrentFrame();
  return (
    <ShotScene name="p-ferry" total={TOTAL} frame={f} zoom={[1.0, 1.032]} warm={0.08}>
      <WaveField seed="s05-river" band={[0.55, 0.8]} amp={4} speed={0.09} opacity={0.22} rows={8} />
      <MistFlow seed="s05-cloud" intensity={0.6} period={280} count={4} />
      <DustField act={2} count={16} seedBase="s05-air" wind={10} />
      <Caption cue="s05" tone="ink" />
    </ShotScene>
  );
};

export default S05;