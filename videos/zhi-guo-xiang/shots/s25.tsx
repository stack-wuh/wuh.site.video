/* S25 · 华山一别（210f · 入「墨洇」）
 *
 * v12 分镜 Act 6：华山云海，他和小龙女的背影并肩走远，越来越小。底图 `p-huashan-farewell`。
 * 两个人都在底图里，代码不叠人，只做两件「留不住」：
 *   · CloudDrift —— 云海在走（灰影在白云上横向漂，speed 0.28：山里的云，慢）；
 *   · 镜头极缓后拉（1.06 → 1.0）—— 画框往外让，他们被留在原地，越走越小。
 */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';
import { CloudDrift } from '../components/f-clouddrift';

const S25: FC = () => (
  <Scene name="p-huashan-farewell" zoom={[1.06, 1.0]} warm={0.03}>
    <CloudDrift seed="s25-cloud" count={7} intensity={0.9} band={[0.18, 0.99]} speed={0.28} />
    <Caption cue="s25" tone="ink" />
  </Scene>
);

export default S25;