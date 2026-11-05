/* S16 · 驴蹄踩过水洼，一行蹄印 150f */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';

const S16: FC = () => (
  <Scene name="p-hoof" zoom={[1.06, 1.0]} driftX={[-20, 20]}>
  </Scene>
);

export default S16;
