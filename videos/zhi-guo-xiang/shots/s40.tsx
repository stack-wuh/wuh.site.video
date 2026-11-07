/* S40 · 尾 · 海 · 天还没黑（180f · 入「墨洇」· 末镜）
 *
 * 用户改动（2026-11-07 11:0x）：金在上一镜已经收完，这一镜就是海。底图 `p-sea`（空镜，无人）。
 * 代码只做两层「天还没黑」：
 *   · WaveField —— 海面横纹相位慢推（只铺地平线以下，rows 10、amp 6：金收完后海也静了）；
 *   · 一层极淡的冷（FILM.snowCyan，screen 0 → 0.05）——不是入夜，是天光从暖转清。
 * 镜头：空镜·固定（1.0 → 1.02）。末镜 outbound 记「切」，镜内不做淡出。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { ShotScene } from '../components/e-scene';
import { Caption } from '../components/Caption';
import { WaveField } from '../components/WaveField';
import { FILM, CLAMP } from '../motion-tokens';

/** 本镜时长（manifest durationFrames——ShotScene 用它算推拉进度，不读 useVideoConfig） */
const TOTAL = 180;

const S41: FC = () => {
  const f = useCurrentFrame();
  const cool = interpolate(f, [0, 110, 179], [0, 0.03, 0.055], CLAMP);

  return (
    <ShotScene name="p-sea" total={TOTAL} frame={f} zoom={[1.0, 1.02]} warm={0.01}>
      <WaveField seed="s41-sea" band={[0.66, 1.0]} amp={6} speed={0.08} opacity={0.26} rows={10} />
      <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen', background: FILM.snowCyan, opacity: cool }} />
      <Caption cue="s40" tone="ink" />
    </ShotScene>
  );
};

export default S41;