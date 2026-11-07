/* S29 · 街边孩子唱童谣（210f · 入「墨洇」）
 *
 * v12 分镜 Act 6：街边几个孩子跳着唱童谣，天真；她远远走过。底图 `p-kids`。
 * 孩子与她都在底图里（**不叠代码人物**）；本镜只做两件很轻的事：
 *   · 手持微晃（driftX 左右各 10px）——童谣是「跳着」唱的，机器也跟着轻晃；
 *   · 一层暖金光尘（Act 6 暖金比最高）——给这首童谣一点「轻」。
 * 镜头：全·固定 + 手持，不推拉（推拉会把这句天真拍重）。
 */
import type { FC } from 'react';
import { useCurrentFrame } from 'remotion';
import { ShotScene } from '../components/e-scene';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';

/** 本镜时长（manifest durationFrames——ShotScene 用它算推拉进度，不读 useVideoConfig） */
const TOTAL = 210;

const S30: FC = () => {
  const f = useCurrentFrame();
  return (
    <ShotScene name="p-kids" total={TOTAL} frame={f} zoom={[1.0, 1.04]} driftX={[10, -10]}>
    <DustField act={6} count={26} seedBase="s30-street" wind={6} />
    <Caption cue="s29" tone="ink" />
    </ShotScene>
  );
};

export default S30;