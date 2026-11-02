/* S14 · 烟灰落在她肩上 120f */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';

const S14: FC = () => (
  <Scene name="p-ash" zoom={[1.0, 1.045]} dim={0.04}>
    <Caption text="他留下三枚金针，说可以许三个愿望。" start={12} end={108} />
  </Scene>
);

export default S14;
