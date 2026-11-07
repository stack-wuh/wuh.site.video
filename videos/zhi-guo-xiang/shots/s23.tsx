/* S23 · 雾里走出的白衣女子（210f · 入「墨洇」）
 *
 * v12 分镜 Act 5：雾里走出一个白衣女子（小龙女，背/侧，无脸）；她站在一边，看他们抱在一起，
 * 退后一步。底图 `p-white-figure` —— **三个人都在这张画里**，代码不叠任何人物，只做「雾漫」：
 *   · RisingFog —— 雾从画面下缘往上吃，只吃到膝下（白衣女子本身就白，雾再高就把她洗没了）；
 *   · CloudDrift —— 雾本身在走（灰影压在白云上才看得见；纸白 screen 在这张留白底图上是隐形的）。
 * 镜头：全·固定（1.0 → 1.02，几乎定死），雾自己在走。
 */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { ShotScene } from '../components/e-scene';
import { Caption } from '../components/Caption';
import { CloudDrift } from '../components/f-clouddrift';
import { RisingFog } from '../components/c-fog';
import { CLAMP } from '../motion-tokens';

/** 本镜时长（manifest durationFrames——ShotScene 用它算推拉进度，不读 useVideoConfig） */
const TOTAL = 210;

const S24: FC = () => {
  const f = useCurrentFrame();
  const fog = interpolate(f, [10, TOTAL - 36, TOTAL - 1], [0.14, 0.82, 0.95], CLAMP);
  return (
    <ShotScene name="p-white-figure" total={TOTAL} frame={f} zoom={[1.0, 1.02]} dim={0.02}>
      <RisingFog progress={fog} seedBase="s24-white" ridgeY={900} rise={260} count={8} strength={0.8} />
      <CloudDrift seed="s24-front" count={5} intensity={0.62} band={[0.36, 0.99]} speed={0.3} dark={0.065} />
      <Caption cue="s23" tone="ink" />
    </ShotScene>
  );
};

export default S24;