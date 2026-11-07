/* S18 · 崖边背影（240f · 入「墨洇」）
 *
 * v12 分镜 Act 5：他站在崖边，背影，右袖空垂，雾从谷底漫上来。底图 `p-cliff-edge`。
 * **人物全在底图里**（背影 + 空袖是美术画的，代码不叠第二个身影），本镜只做「雾往上长」：
 *   · RisingFog —— 从画面下缘那条崖线往上吃（ridgeY 880，吃满 ~360px），前 20f 归 inbound 墨洇，
 *     20f 后雾才起；末段略过 1.0（1.06），像要漫出画面（末 30f/末 1f 跟本镜时长走，不写死）；
 *   · CloudDrift —— 崖下云海本身在走（灰影压在白云上才看得见）；
 *   · DustField —— 崖风（wind 负 = 向左，与他的长发同向）。
 * 镜头：中景背影，1.0 → 1.05 缓推，越推越觉得他离崖口近。
 */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { ShotScene } from '../components/e-scene';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { RisingFog } from '../components/c-fog';
import { CloudDrift } from '../components/f-clouddrift';
import { CLAMP } from '../motion-tokens';

/** 他脚下那条崖线（1920×1080）：雾从这儿往上漫，先吃脚，再吃腰。 */
const RIDGE_Y = 880;

/** 本镜时长（manifest durationFrames——ShotScene 用它算推拉进度，不读 useVideoConfig） */
const TOTAL = 240;

const S19: FC = () => {
  const f = useCurrentFrame();
  /* 210f → 240f 都成立：末 30f 吃满、末 1f 略过 1.0 */
  const fog = interpolate(f, [20, TOTAL - 31, TOTAL - 1], [0.06, 1, 1.06], CLAMP);
  return (
    <ShotScene name="p-cliff-edge" total={TOTAL} frame={f} zoom={[1.0, 1.05]} dim={0.02}>
      <CloudDrift seed="s19-cloud" count={6} intensity={0.7} band={[0.42, 0.99]} speed={0.34} />
      <RisingFog progress={fog} seedBase="s19-valley" ridgeY={RIDGE_Y} rise={360} count={9} strength={0.95} />
      <DustField act={5} count={22} seedBase="s19-wind" wind={-9} />
      <Caption cue="s18" tone="ink" />
    </ShotScene>
  );
};

export default S19;