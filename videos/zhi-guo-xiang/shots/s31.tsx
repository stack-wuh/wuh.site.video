/* S31 · 笔悬着 210f */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { InkPaper } from '../components/InkPaper';

const S31: FC = () => (
  <Scene name="p-brush" zoom={[1.12, 1.15]} warm={0.08} dim={0.02}>
    <InkPaper lines={['其实我只是爱上了峨眉山上的云和']} progress={0.82} size={46} right="30%" top="26%" />
  </Scene>
);

export default S31;
