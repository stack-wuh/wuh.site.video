/* S06 · 她走出客栈，夜里的渡口 150f
 * v10 §五：雾 / 水汽——一层极低密度的 DustField 极缓横移，别的一概不动。 */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { DustField } from '../components/DustField';

const S06: FC = () => (
  <Scene name="p-still" zoom={[1.02, 1.07]} dim={0.05}>
    <DustField act={1} count={14} seedBase="s06-mist" wind={6} />
  </Scene>
);

export default S06;
