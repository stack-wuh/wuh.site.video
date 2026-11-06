/* S10 · 她的掌心摊开，三枚金针 180f */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { Needles, PALM2_NEEDLES } from '../components/Needles';
import { Caption } from '../components/Caption';

/* 底图 p-palm2 = out/art-v11/p-palm2/cand-3（2026-11-06 换图）。
 * cand-3 掌心凹处实测（1920×1080 原图）≈ x 900–1300 / y 450–700；
 * 底图在 Scene 里 1.04→1.1 推近，取中景 1.07 落针：origin [880,572]（三针组中心 ≈ 掌心 1050,590）。
 * 针槽真值走 PALM2_NEEDLES，S25 用同一个常量、只 drop 一枚。 */

const S10: FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [10, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Scene name="p-palm2" zoom={[1.04, 1.1]}>
      <Needles count={3} {...PALM2_NEEDLES} opacity={t} />
      <Caption text="他留下三枚金针，说可以许三个愿望。" start={20} end={164} tone="ink" />
    </Scene>
  );
};

export default S10;