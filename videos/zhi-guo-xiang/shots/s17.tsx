/* S17 · 驴与剑过渡口 270f——诗行3落点，驴蹄四拍 */
import type { FC } from 'react';
import { Scene, Poem } from '../components/SceneKit';

const S17: FC = () => (
  <Scene name="u-g04-ferry" zoom={[1.02, 1.07]} driftX={[-8, 10]}>
    <Poem text="小毛驴滴滴答答，倚天剑伴我走天涯。" start={30} end={250} />
  </Scene>
);

export default S17;
