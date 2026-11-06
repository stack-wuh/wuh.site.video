/* S07 · 两个醉汉扯她的斗篷 150f
 * v10 §五：底图 p-drunk 已有人物与斗篷，不新增人；接两层——
 * 一层横向风（DustField wind，把雾与尘土吹过画面），一层脚下浅水洼的涟漪（WaveField）。 */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { DustField } from '../components/DustField';
import { WaveField } from '../components/WaveField';

const S07: FC = () => (
  <Scene name="p-drunk" zoom={[1.02, 1.07]} driftX={[10, -10]} dim={0.04}>
    <DustField act={2} count={20} seedBase="s07-wind" wind={26} />
    <WaveField seed="s07-puddle" band={[0.8, 1.0]} amp={4} speed={0.16} opacity={0.2} />
  </Scene>
);

export default S07;
