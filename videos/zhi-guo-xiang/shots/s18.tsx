/* S18 · 茶楼说书人 240f——判词第一次（善意的误读） */
import type { FC } from 'react';
import { Scene, Poem } from '../components/SceneKit';

const S18: FC = () => (
  <Scene name="u-g10-teahouse" zoom={[1.0, 1.06]}>
    <Poem text="大家都说我因为爱着杨过大侠，才在峨嵋山上出了家，" start={40} end={220} />
  </Scene>
);

export default S18;
