/* S27 · 两枚金针放进经卷夹层，经卷合上 180f */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { Needles } from '../components/Needles';

const S27: FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Scene name="p-sutra" zoom={[1.0, 1.05]} warm={0.06}>
      <Needles count={2} origin={[560, 620]} len={620} spread={120} tilt={-16} opacity={t} />
    </Scene>
  );
};

export default S27;
