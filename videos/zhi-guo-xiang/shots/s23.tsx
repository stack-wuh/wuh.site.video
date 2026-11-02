/* S23 · 茶棚，她张了一下口；锣响；她把那碗茶喝完 210f */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';

const S23: FC = () => (
  <Scene name="p-teastall" zoom={[1.0, 1.04]} dim={0.03}>
    <Caption text="二十四年，她一直走在路上。" start={16} end={194} tone="ink" />
  </Scene>
);

export default S23;
