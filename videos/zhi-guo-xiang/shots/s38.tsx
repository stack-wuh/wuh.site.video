/* S38 · 海。天还没黑 150f
 * v10 §五：收片空镜——接 WaveField（海面一段段铺开、相位随帧推移，让画动、镜头不动）。
 * 转场：入墨洇（12f）/ 末镜出硬切（outSide=0）→ 字幕 start 从 14 挪到 24、end 136 不动。
 * 字幕「这个故事，我讲完了，念念~」逐字不改。 */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';
import { WaveField } from '../components/WaveField';

const S38: FC = () => (
  <Scene name="p-sea" zoom={[1.0, 1.03]} warm={0.06}>
    <WaveField seed="s38-sea" amp={7} speed={0.12} opacity={0.3} band={[0.64, 1.0]} />
    <Caption text="这个故事，我讲完了，念念~" start={24} end={136} tone="ink" />
  </Scene>
);

export default S38;
