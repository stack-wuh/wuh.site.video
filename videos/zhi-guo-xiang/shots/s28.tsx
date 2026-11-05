/* S28 · 她把剑从背上取下，放进木匣，合上 210f */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';

const S28: FC = () => (
  <Scene name="p-sword-case" zoom={[1.0, 1.04]} dim={0.06} warm={0.04}>
    <Caption text="剑收进木匣，再也没有取出来。" start={56} end={194} />
  </Scene>
);

export default S28;
