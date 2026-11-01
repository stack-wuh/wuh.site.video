/* S3 · 六行诗微距 180f——诗行1落点 */
import type { FC } from 'react';
import { Scene, Poem } from '../components/SceneKit';

const S03: FC = () => (
  <Scene name="u-paper" zoom={[1.0, 1.05]} driftX={[8, -8]}>
    <Poem text="我走过山时，山不说话，" start={30} end={170} />
  </Scene>
);

export default S03;
