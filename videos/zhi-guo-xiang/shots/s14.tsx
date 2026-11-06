/* S14 · 烟灰落在她肩上 150f
 * v10 §五：一层灰烬（DustField 小粒子，慢落 + 微风）。
 * 字幕安全窗：本镜 in = cut（0），out = s15 的 ink（12f）→ end ≤ 150 − 12 − 12 = 126，
 * 原来 138 会压进出场墨洇，收到 126；start 12 已是 cut 镜的下限，不动。文案逐字未改。 */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';

const S14: FC = () => (
  <Scene name="p-ash" zoom={[1.0, 1.045]} dim={0.04}>
    <DustField act={3} count={40} seedBase="s14-ash" wind={7} />
    <Caption cue="s14" tone="ink" />
  </Scene>
);

export default S14;
