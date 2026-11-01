/* S30 · 掌心摊开，三枚金针。赠予者不在画里 240f */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { Needles } from '../components/Needles';

const S30: FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [10, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Scene name="p-palm2" zoom={[1.04, 1.1]}>
      <Needles count={3} origin={[640, 620]} len={620} spread={150} tilt={-5} opacity={t} />
    </Scene>
  );
};

export default S30;
