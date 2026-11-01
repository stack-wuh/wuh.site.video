/* S25 · 她抬眼，眼里有一点火光 300f */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';

const S25: FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [40, 120, 260], [0, 1, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <Scene name="p-eyefire" zoom={[1.0, 1.05]} warm={0.06 * t} />;
};

export default S25;
