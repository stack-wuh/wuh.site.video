/* S38 · 海。天还没黑 150f */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';

const S38: FC = () => (
  <Scene name="p-sea" zoom={[1.0, 1.03]} warm={0.06}>
    <Caption text="这个故事，我讲完了，念念~" start={14} end={136} tone="ink" />
  </Scene>
);

export default S38;
