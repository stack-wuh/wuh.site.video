/* S35 · 她搁笔，看向窗外；窗外云霞 180f
 * v10 §五：只有 zoom/drift 的空镜——只补一层时间感：室内光尘缓落（第六幕暖金比高、速度最慢）。
 * 转场：入硬切 / 出纸翻（s36 入场 18f）→ 字幕 end 收在 180−18−12=150。 */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';

const S35: FC = () => (
  <Scene name="p-window" zoom={[1.0, 1.04]} warm={0.04}>
    <DustField act={6} count={18} seedBase="s35-time" />
    <Caption text="舍不得写完的那一句，她留在了纸的背面。" start={16} end={150} />
  </Scene>
);

export default S35;
