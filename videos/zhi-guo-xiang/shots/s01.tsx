/* S1 · 序·海边：他坐在礁石上读纸（全片唯一一次出现） 240f */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';

const S01: FC = () => (
  <Scene name="p-him-ink" zoom={[1.0, 1.05]} warm={0.1}>
    <Caption text="我想给你讲一个故事。" start={20} end={220} />
  </Scene>
);

export default S01;
