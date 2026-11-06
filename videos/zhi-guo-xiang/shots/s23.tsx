/* S23 · 街边孩子跳着唱童谣，天真 180f
 * v10 §五：底图 p-kids 已烤入三个孩子与走远的她；driftX 是既有的手持晃，不再叠横向 sway，
 * 也不叠 CrowdFigure（会与烤入的孩子重人）——只补一层光尘，给童谣一点「轻」。
 * 转场：入飞白（10f）/ 出硬切 → 字幕 start 从 16 挪到 22。 */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';

const S23: FC = () => (
  <Scene name="p-kids" zoom={[1.0, 1.05]} driftX={[10, -10]}>
    <DustField act={3} count={28} seedBase="s23-kids" />
    <Caption text="峨眉有个郭女侠，等郎等到白了发。" start={22} end={164} tone="ink" />
  </Scene>
);

export default S23;