/* S5 · 有人说起「神雕侠」，她抬眼 150f */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';

const S05: FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [30, 90, 150], [0, 1, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <Scene name="p-eyefire" zoom={[1.0, 1.05]} warm={0.06 * t} />;
};

export default S05;
