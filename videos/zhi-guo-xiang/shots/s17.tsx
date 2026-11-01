/* S17 · 说书人的醒木落下 270f */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { AbsoluteFill } from 'remotion';
import { Scene } from '../components/SceneKit';

const S17: FC = () => {
  const f = useCurrentFrame();
  const hit = interpolate(f, [0, 8, 10], [0, 0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Scene name="p-stall" zoom={[1.0, 1.04]} dim={0.06}>
      <AbsoluteFill style={{ background: '#fff6e0', opacity: 0.22 * hit, mixBlendMode: 'screen' }} />
    </Scene>
  );
};

export default S17;
