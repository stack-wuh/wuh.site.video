/* S18 · 山路背影，剑在背上，斗篷与剑穗被风吹向一侧 210f */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';

const S18: FC = () => (
  <Scene name="p-xiang-sword-road" zoom={[1.0, 1.05]} driftX={[10, -10]} dim={0.03}>
    <Caption text="一个渡口接一个渡口，她在找他。" start={16} end={194} tone="ink" />
  </Scene>
);

export default S18;
