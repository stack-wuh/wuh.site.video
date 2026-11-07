/* S25 · 华山 · 她站在原地（210f · 入「墨洇」）
 *
 * v12 分镜 Act 6：她站在原地，风把斗篷吹向一侧；**脸 3**：眼泪掉下来（侧脸，极短）。底图 `p-tears`。
 * 脸在底图里（只给侧脸轮廓，不画正脸），本镜无字幕、无代码人物，只做风与机位：
 *   · DustField wind −26 —— 与底图吹向一侧的斗篷同向，风是这一镜唯一在动的东西；
 *   · 镜头 「近·侧后 → 侧脸」：zoom 1.0→1.045 的同时横向让一点（driftX −8→10），
 *     机位绕过去半寸，把一个背影看成一张侧脸——不靠代码转头。
 */
import type { FC } from 'react';
import { useCurrentFrame } from 'remotion';
import { ShotScene } from '../components/e-scene';
import { DustField } from '../components/DustField';

/** 本镜时长（manifest durationFrames——ShotScene 用它算推拉进度，不读 useVideoConfig） */
const TOTAL = 210;

const S26: FC = () => {
  const f = useCurrentFrame();
  return (
    <ShotScene name="p-tears" total={TOTAL} frame={f} zoom={[1.0, 1.03]} driftX={[-8, 10]} dim={0.02} warm={0.02}>
    <DustField act={6} count={44} seedBase="s26-wind" wind={-26} />
    </ShotScene>
  );
};

export default S26;