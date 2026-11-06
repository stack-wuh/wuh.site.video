/* S17 · 她背着剑走过渡口，剑柄斜出右肩，剑穗随步 210f
 * v10 §五：底图 p-xiang-sword-ferry 已经有她、背上的剑与剑穗（人物与剑都在画里），
 * 不叠第二个人；接一层渡口横风（DustField wind，向左），把芦苇与尘土吹向同一侧，
 * 让「剑穗随步」有风的方向。 */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { DustField } from '../components/DustField';

const S17: FC = () => (
  <Scene name="p-xiang-sword-ferry" zoom={[1.02, 1.06]} driftX={[-30, 30]} warm={0.05}>
    <DustField act={4} count={26} seedBase="s17-reeds" wind={-18} />
  </Scene>
);

export default S17;
