/* S21 · 她听见了，没有回头 150f */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';

const S21: FC = () => (
  <Scene name="p-noturn" zoom={[1.0, 1.05]} dim={0.05}>
    <Caption text="她没有解释。" start={14} end={136} />
  </Scene>
);

export default S21;
