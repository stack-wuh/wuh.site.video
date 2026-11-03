/* S12 · 满城烟花炸开，火金铺满夜空 210f */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { AbsoluteFill } from 'remotion';
import { Scene } from '../components/SceneKit';
import { Fireworks } from '../components/Fireworks';

const S12: FC = () => {
  const f = useCurrentFrame();
  const lit = interpolate(f, [0, 60, 240], [0, 1, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Scene name="p-citynight" zoom={[1.04, 1.1]}>
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.95 }}>
        <Fireworks
          seed="s12"
          bursts={[
            { x: 420, y: 300, at: 10, scale: 2.8 },
            { x: 1180, y: 200, at: 40, scale: 3.4 },
            { x: 820, y: 380, at: 90, scale: 2.4 },
            { x: 1000, y: 160, at: 120, scale: 3.0 },
            { x: 1500, y: 420, at: 150, scale: 2.2 },
            { x: 650, y: 240, at: 180, scale: 2.6 },
            { x: 300, y: 480, at: 210, scale: 2.4 },
          ]}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: '#ffd27a', mixBlendMode: 'soft-light', opacity: 0.22 * lit }} />
    </Scene>
  );
};

export default S12;
