/* S05 · 有人说起「神雕侠」，她抬眼 150f */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';

const S05: FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [30, 90, 150], [0, 1, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Scene name="p-eyefire" zoom={[1.0, 1.05]} warm={0.06 * t}>
      <Caption text="他叫杨过。江湖上叫他神雕侠。" start={16} end={134} tone="ink" />
    </Scene>
  );
};

export default S05;
