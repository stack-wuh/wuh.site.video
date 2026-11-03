/* S27 · 晨课，弟子两列背影，她走过，不出声 210f */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';

const S27: FC = () => (
  <Scene name="p-morning" zoom={[1.0, 1.05]}>
    <Caption text="十六岁出门，四十岁出家。" start={18} end={192} tone="ink" />
  </Scene>
);

export default S27;
