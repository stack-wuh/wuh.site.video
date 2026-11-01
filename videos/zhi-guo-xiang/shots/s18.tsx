/* S18 · 山路背影，剑在背上，斗篷与剑穗被风吹向一侧 210f */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';

const S18: FC = () => <Scene name="p-xiang-sword-road" zoom={[1.0, 1.05]} driftX={[10, -10]} dim={0.03} />;

export default S18;
