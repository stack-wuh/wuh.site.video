/* S22 · 第三枚金针（210f · 入「墨洇」）
 *
 * v12 分镜 Act 5：她的指间夹着第三枚金针，举到他面前（只见手与针，不见他的脸）。底图 `p-needle-third`。
 * **手与针都在底图里**——所以代码**不再画一枚针**（再画一枚就会出现「两根针」）：
 * 本镜只做雾的呼吸：
 *   · CloudDrift —— 背景全是雾，雾在针后面慢慢走（intensity 0.5：很淡，不能把手和针洗掉）；
 *   · 针尖的一点火光金 —— 全镜唯一的暖（很淡的呼吸，不重画针）；
 *   · DustField —— 雾里那点极少的浮尘（金尘配比取 Act 5），让雾有厚度。
 * 镜头：特写，1.0 → 1.04，慢到几乎不动。
 */
import type { FC } from 'react';
import { useCurrentFrame } from 'remotion';
import { ShotScene } from '../components/e-scene';
import { Caption } from '../components/Caption';
import { CloudDrift } from '../components/f-clouddrift';
import { InkBloom } from '../components/InkBloom';
import { useBreath } from '../components/use-breath';
import { FILM } from '../motion-tokens';
import { DustField } from '../components/DustField';

/** 本镜时长（manifest durationFrames——ShotScene 用它算推拉进度，不读 useVideoConfig） */
const TOTAL = 210;

const S23: FC = () => {
  const f = useCurrentFrame();
  /* 针尖的呼吸：很慢的一条正弦（周期 100f），只改亮度不改位置 */
  const breath = useBreath(100);
  return (
  <ShotScene name="p-needle-third" total={TOTAL} frame={f} zoom={[1.0, 1.04]} dim={0.02}>
    <CloudDrift seed="s23-fog" count={5} intensity={0.5} band={[0.05, 0.92]} speed={0.22} dark={0.055} />
    <InkBloom
      progress={0.42 + 0.1 * breath}
      at={{ x: 1148, y: 178, r: 30 }}
      color={FILM.fireGold}
      opacity={0.09 + 0.04 * breath}
      blur={10}
      style={{ mixBlendMode: 'screen' }}
    />
    <DustField act={5} count={18} seedBase="s23-air" wind={3} />
    <Caption cue="s22" tone="ink" />
  </ShotScene>
  );
};

export default S23;