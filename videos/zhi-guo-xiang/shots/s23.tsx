/* S23 · 街边孩子跳着唱童谣，天真 180f */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';

const S23: FC = () => (
  <Scene name="p-kids" zoom={[1.0, 1.05]} driftX={[10, -10]}>
    <Caption text="峨眉有个郭女侠，等郎等到白了发。" start={16} end={164} tone="ink" />
  </Scene>
);

export default S23;
