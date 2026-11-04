/* S04 · 客栈火塘，一圈剪影，她坐最外圈 180f */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';

const S04: FC = () => (
  <Scene name="p-firecircle" zoom={[1.0, 1.05]}>
    <Caption text="十六岁那年，她在风陵渡遇见一个人。" start={16} end={164} />
  </Scene>
);

export default S04;
