/* S25 · 掌心摊开，剩两枚 180f */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { Needles } from '../components/Needles';

const S25: FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // 新底图是亮底水墨掌（均值 232/225/207），字幕改用 ink 墨色字，纸白字会看不见
  return (
    <Scene name="p-palm" zoom={[1.0, 1.06]}>
      {/* 针窝在掌心凹处（底图实测 x≈880 / y≈650），针长与 S10 同值——同一批针，只少一枚 */}
      <Needles count={2} origin={[800, 640]} len={300} spread={62} tilt={-26} opacity={t} />
    </Scene>
  );
};

export default S25;
