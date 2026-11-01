/* S25 · 晨课，弟子两列背影，她走过，不出声 210f */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';

const S25: FC = () => (
  <Scene name="p-morning" zoom={[1.0, 1.05]}>
    <Caption text="四十岁，她在峨眉山出了家。" start={18} end={192} tone="ink" />
  </Scene>
);

export default S25;
