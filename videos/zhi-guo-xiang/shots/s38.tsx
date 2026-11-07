/* S38 · 尾 · 海边黄昏（210f · 入「硬切」）
 *
 * 用户改动（2026-11-07 11:0x）：**不要照片、不要翻面、不要手写字**——就是他空手坐在礁石上看落日。
 * 底图 `p-him-watch`（美术生成中；空手、姿势同 `p-him-sit`；图名照此写，不等图）。
 * 本镜只做用户点名的三件事：海风、衣角（在底图里）、极缓推：
 *   · DustField —— 海风（wind 正 = 向右），极淡的暖尘掠过画面；
 *   · 镜头 1.0 → 1.03 极缓推（他坐着，画面往前挪一点点）。
 * 不叠云、不叠水纹：底图是实物调的，代码再画会读成划痕。
 */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';

const S38: FC = () => (
  <Scene name="p-him-watch" zoom={[1.0, 1.03]} warm={0.05} dim={0.02}>
    <DustField act={6} count={22} seedBase="s38-breeze" wind={14} />
    <Caption cue="s38" tone="ink" />
  </Scene>
);

export default S38;