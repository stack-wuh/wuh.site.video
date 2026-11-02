/* S19 · 说书人的醒木落下 180f */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { AbsoluteFill } from 'remotion';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';

const S19: FC = () => {
  const f = useCurrentFrame();
  const hit = interpolate(f, [0, 8, 10], [0, 0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Scene name="p-stall" zoom={[1.0, 1.04]} dim={0.06}>
      <AbsoluteFill style={{ background: '#fff6e0', opacity: 0.22 * hit, mixBlendMode: 'screen' }} />
      <Caption text="江湖都说，她为了杨过大侠，终身未嫁。" start={16} end={164} />
    </Scene>
  );
};

export default S19;
