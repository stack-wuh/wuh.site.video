/* S18 · 绝情谷 · 断肠崖（210f · 入「墨洇」）
 *
 * v12 分镜 Act 5：大远景，断肠崖高耸，谷底云雾翻涌，崖壁松影。底图 `p-cliff`。
 * 崖、谷、云全在底图里（**本镜无人**）；代码只让这张画有空气：
 *   · CloudDrift —— 谷底的云海在走（灰影在白云上横向漂，period 不写死，speed 0.4px/f）；
 *   · DustField —— 崖壁间极少量光尘随崖风横掠，松影那阵风有了体积。
 * 镜头：固定 → 极缓推（1.0 → 1.045），推速交给 Scene 的 zoom 曲线，镜内不做第二套运镜。
 * 颜色只取 brand/tokens；随机只用 deterministic 的 seed（CloudDrift/DustField 内部已走 random）。
 */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';
import { CloudDrift } from '../components/f-clouddrift';
import { DustField } from '../components/DustField';

const S18: FC = () => (
  <Scene name="p-cliff" zoom={[1.0, 1.045]} dim={0.02}>
    {/* 云海两层不同速度：快的一层出「云在走」，慢的一层出「云很厚」 */}
    <CloudDrift seed="s18-valley" count={7} intensity={1} band={[0.3, 0.99]} speed={0.4} dark={0.085} />
    <CloudDrift seed="s18-valley-deep" count={5} intensity={0.6} band={[0.46, 0.99]} speed={0.16} dark={0.08} />
    <DustField act={5} count={20} seedBase="s18-pine" wind={6} />
    <Caption cue="s18" tone="ink" />
  </Scene>
);

export default S18;