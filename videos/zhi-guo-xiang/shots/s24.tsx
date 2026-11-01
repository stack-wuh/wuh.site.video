/* S24 · 掌心摊开，剩两枚 180f */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { Needles } from '../components/Needles';

const S24: FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Scene name="p-palm" zoom={[1.0, 1.06]}>
      <Needles count={2} origin={[700, 640]} len={560} spread={160} tilt={-6} opacity={t} />
    </Scene>
  );
};

export default S24;
