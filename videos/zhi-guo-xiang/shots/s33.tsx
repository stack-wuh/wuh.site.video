/* S33 · 她搁笔，看向窗外；窗外云霞 200f */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';

const S33: FC = () => (
  <Scene name="p-window" zoom={[1.0, 1.04]} warm={0.04}>
    <Caption text="写不下去的那一句，她留在了纸的背面。" start={16} end={184} />
  </Scene>
);

export default S33;
