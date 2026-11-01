/* S4 · 他抬头看云 180f——背影，诗行2落点 */
import type { FC } from 'react';
import { Scene, Poem } from '../components/SceneKit';

const S04: FC = () => (
  <Scene name="u-him" zoom={[1.02, 1.06]} driftY={[6, -4]}>
    <Poem text="我路过海时，海不说话，" start={30} end={170} />
  </Scene>
);

export default S04;
