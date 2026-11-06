/* S03 · 渡口黄昏，云与河都静着 150f
 * v10 §五：全片没有一处水面动画——这里接 WaveField（河面横纹相位推移，只铺在水与倒影带里），
 * 再叠一层低密度浮尘当云气。镜头与底图不动，画自己动。 */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { WaveField } from '../components/WaveField';
import { DustField } from '../components/DustField';

const S03: FC = () => (
  <Scene name="p-ferry" zoom={[1.0, 1.05]} warm={0.06}>
    <WaveField seed="s03-river" band={[0.28, 0.58]} amp={5} speed={0.14} opacity={0.34} />
    <DustField act={2} count={16} seedBase="s03-cloud" wind={12} />
  </Scene>
);

export default S03;
