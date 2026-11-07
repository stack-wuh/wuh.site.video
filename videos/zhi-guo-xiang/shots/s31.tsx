/* S31 · 峨眉晨课（210f · 入「墨洇」）
 *
 * v12 分镜 Act 7：峨眉山晨雾，晨课，弟子两列背影，她走过，不出声。底图 `p-morning`。
 * 两列弟子、长阶与她都在底图里——**不叠任何代码人物**（试过的两版代码人都像贴纸，见 v11 结论）。
 * 镜内只做两件：「晨雾还没散」+「晨光在呼吸」：
 *   · MistFlow —— 山门前的雾极慢地朝镜头推（period 300，薄，不敢盖住弟子背影）；
 *   · DustField —— 光尘；dim 随一个慢正弦在 0.02 → 0 之间呼吸，像天光在亮起来。
 * 镜头：全·固定，1.0 → 1.04 极缓推。
 */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { ShotScene } from '../components/e-scene';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { MistFlow } from '../components/b-mistflow';
import { CLAMP } from '../motion-tokens';

/** 本镜时长（manifest durationFrames——ShotScene 用它算推拉进度，不读 useVideoConfig） */
const TOTAL = 210;

const S32: FC = () => {
  const f = useCurrentFrame();
  /* 晨光呼吸：0.6 个周期走完本镜的慢正弦，只在 0.02 的幅度里 */
  const breathe = 0.5 + 0.5 * Math.sin((f / Math.max(1, TOTAL)) * Math.PI * 2 * 0.6);
  const dim = interpolate(breathe, [0, 1], [0.022, 0.004], CLAMP);
  return (
    <ShotScene name="p-morning" total={TOTAL} frame={f} zoom={[1.0, 1.04]} dim={dim}>
      <MistFlow seed="s32-dawn" intensity={0.5} period={300} count={4} />
      <DustField act={6} count={20} seedBase="s32-dawn" wind={5} />
      <Caption cue="s31" tone="ink" />
    </ShotScene>
  );
};

export default S32;