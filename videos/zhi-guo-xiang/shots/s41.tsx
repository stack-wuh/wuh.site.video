/* S41 · 云霞与烟花叠印 240f */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { Fireworks } from '../components/Fireworks';

const S41: FC = () => {
  const f = useCurrentFrame();
  const blend = interpolate(f, [0, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Scene name="u-g18-sky" zoom={[1.02, 1.06]} warm={0.14}>
      <div style={{ opacity: 0.55 * blend, mixBlendMode: 'screen' }}>
        <Fireworks seed="s41" bursts={[{ x: 900, y: 320, at: 0, scale: 1.3 }, { x: 1350, y: 420, at: 40, scale: 0.9 }]} />
      </div>
    </Scene>
  );
};

export default S41;
