/* S29 · 两枚金针放进经卷夹层，经卷合上 180f */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { Needles } from '../components/Needles';

const S29: FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Scene name="p-sutra" zoom={[1.0, 1.05]} warm={0.06}>
      <Needles count={2} origin={[600, 500]} len={300} spread={60} tilt={30} opacity={t} />
    </Scene>
  );
};

export default S29;
