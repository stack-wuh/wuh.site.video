/* S09 · 她抬头：只看见背影与空袖；天上一只大雕的影子掠过 210f
 * v10 §五：那只雕影已经画进底图 p-sleeve（画面上方），不再叠第二只；
 * 接一层高处的浮尘（DustField 低密度 + 慢风），让天空不是死的。 */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { DustField } from '../components/DustField';

const S09: FC = () => (
  <Scene name="p-sleeve" zoom={[1.0, 1.06]} dim={0.03}>
    <DustField act={2} count={30} seedBase="s09-sky" wind={14} />
  </Scene>
);

export default S09;
