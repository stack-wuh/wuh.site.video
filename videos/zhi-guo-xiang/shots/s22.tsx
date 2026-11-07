/* S22 · 谷底水潭（180f · 入「墨洇」）
 *
 * v12 分镜 Act 5：谷底水潭，水面雾，石岸，两个人（她从水里抬头，剪影）。底图 `p-pool`。
 * **两个人都在底图里**；代码只给水光与水面那层雾：
 *   · WaveField —— 只铺**两个人头以下**的水面带（band 0.58–0.97，水纹不横过他们的脸），相位慢推；
 *   · CloudDrift —— 水面上的雾在走（灰影压在灰青水面上，才看得见）；
 *   · GroundMist —— 贴水的一层薄雾，横向极慢漂（drift 负），和「她从水里抬头」的呼吸同速。
 * 镜头：低机位，1.0 → 1.035 极缓推。
 */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';
import { GroundMist } from '../components/c-fog';
import { CloudDrift } from '../components/f-clouddrift';
import { WaveField } from '../components/WaveField';

const S22: FC = () => (
  <Scene name="p-pool" zoom={[1.0, 1.035]} dim={0.03}>
    <WaveField seed="s22-pool" band={[0.58, 0.97]} amp={5} speed={0.1} opacity={0.32} rows={9} />
    <CloudDrift seed="s22-water" count={5} intensity={0.55} band={[0.24, 0.62]} speed={0.24} dark={0.055} />
    <GroundMist seedBase="s22-water" opacity={0.5} y={640} drift={-2} />
    <Caption cue="s22" tone="ink" />
  </Scene>
);

export default S22;