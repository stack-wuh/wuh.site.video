/* S32 · 剑与匣（210f · 入「墨洇」）
 *
 * v12 分镜 Act 7：灯下，倚天剑解下、平放进木匣、合上。
 * **2026-11-07 用户定：收剑入匣的动效难看，整段动画删掉，镜头与时长不动。**
 * 于是本镜回到「底图自己说话」：剑、匣、灯都在 `p-sword-case` 画里，
 * 只留极缓的推近（1.0 → 1.03）与天光呼吸，不再叠任何代码画出来的剑影/盖面/火星。
 * 镜头：近·固定，极缓推。
 */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { ShotScene } from '../components/e-scene';
import { Caption } from '../components/Caption';
import { useBreath } from '../components/use-breath';
import { CLAMP } from '../motion-tokens';

/** 本镜时长（manifest durationFrames——ShotScene 用它算推拉进度，不读 useVideoConfig） */
const TOTAL = 210;

const S32: FC = () => {
  const f = useCurrentFrame();
  /* 灯火呼吸：极浅，只在 0.012 的幅度里，避免变成「特效」 */
  const breathe = useBreath(TOTAL / 0.5);
  const dim = interpolate(breathe, [0, 1], [0.014, 0.004], CLAMP);
  return (
    <ShotScene name="p-sword-case" total={TOTAL} frame={f} zoom={[1.0, 1.03]} warm={0.03} dim={dim}>
      <Caption cue="s32" tone="ink" />
    </ShotScene>
  );
};

export default S32;
