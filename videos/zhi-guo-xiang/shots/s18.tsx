/* S18 · 山路背影，剑在背上，斗篷与剑穗被风吹向一侧 210f
 * v10 §五：底图 p-xiang-sword-road 已经有她、剑与斗篷（斗篷正被吹向画面左侧），
 * 不叠第二个人；接一层向左的风场（DustField wind，雪/尘斜落），与斗篷同一风向。 */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { DustField } from '../components/DustField';

const S18: FC = () => (
  <Scene name="p-xiang-sword-road" zoom={[1.0, 1.05]} driftX={[10, -10]} dim={0.03}>
    <DustField act={4} count={54} seedBase="s18-gale" wind={-24} />
  </Scene>
);

export default S18;
