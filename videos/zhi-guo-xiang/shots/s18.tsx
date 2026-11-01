/* S18 · 同一时刻：一枚针按进一个落水者的穴道 240f */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { Needles } from '../components/Needles';

const S18: FC = () => (
  <Scene name="p-rescue" zoom={[1.02, 1.08]} dim={0.04}>
    <Needles count={1} origin={[430, 700]} len={300} tilt={-58} shadow={false} />
  </Scene>
);

export default S18;
