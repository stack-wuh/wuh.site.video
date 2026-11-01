/* S43 · 纸背最后一行 180f——全片最后一句 */
import type { FC } from 'react';
import { Scene, Poem } from '../components/SceneKit';

const S43: FC = () => (
  <Scene name="u-paper" zoom={[1.02, 1.06]} dim={0.02}>
    <Poem text="像极了十六岁那年的烟花。" start={30} end={170} />
  </Scene>
);

export default S43;
