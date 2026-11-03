/* S14 · 烟灰落在她肩上 150f */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';

const S14: FC = () => (
  <Scene name="p-ash" zoom={[1.0, 1.045]} dim={0.04}>
    <Caption text="她不知道。" start={12} end={138} tone="ink" />
  </Scene>
);

export default S14;
