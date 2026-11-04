/* S21 · 同一时刻：她按着一枚针，扎进落水者的穴道 210f */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { Needles } from '../components/Needles';

const S21: FC = () => (
  <Scene name="p-rescue" zoom={[1.02, 1.08]} dim={0.04}>
    <Needles count={1} origin={[430, 700]} len={300} tilt={-58} shadow={false} />
  </Scene>
);

export default S21;
