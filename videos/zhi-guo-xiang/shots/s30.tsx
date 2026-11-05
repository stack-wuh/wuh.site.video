/* S30 · 道装侧影，灯焰 180f */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';

const S30: FC = () => (
  <Scene name="p-daogu" zoom={[1.0, 1.04]} warm={0.05} dim={0.1}>
  </Scene>
);

export default S30;
