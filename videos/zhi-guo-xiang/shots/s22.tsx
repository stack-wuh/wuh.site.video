/* S22 · 她听见了，没有回头 150f
 * v10 §五：只有 zoom/drift 的空镜——接一层雪/风（DustField 的 wind 横漂），侧后固定，不加人物。
 * 转场：入硬切 / 出飞白（s23 入场 10f）→ 字幕 end 收在 150−10−12=128。 */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';

const S22: FC = () => (
  <Scene name="p-noturn" zoom={[1.0, 1.05]} dim={0.05}>
    <DustField act={4} count={64} seedBase="s22-snow" wind={-12} />
    <Caption text="她没有解释。" start={34} end={128} tone="ink" />
  </Scene>
);

export default S22;