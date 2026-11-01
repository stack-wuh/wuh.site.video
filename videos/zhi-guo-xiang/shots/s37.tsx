/* S37 · 字幕·满城烟火本是军情 300f */
import type { FC } from 'react';
import { Scene, Poem } from '../components/SceneKit';

const S37: FC = () => (
  <Scene name="u-fireworks-v2" zoom={[1.04, 1.1]} dim={0.24}>
    <Poem text="满城烟火，本是军情。" start={40} end={270} />
  </Scene>
);

export default S37;
