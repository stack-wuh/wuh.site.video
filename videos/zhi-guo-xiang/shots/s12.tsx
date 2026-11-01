/* S12 · 满城烟花炸开，火金铺满夜空 240f */
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
            { x: 520, y: 300, at: 10, scale: 1.5 },
            { x: 1180, y: 220, at: 50, scale: 1.8 },
            { x: 820, y: 380, at: 110, scale: 1.2 },
            { x: 1480, y: 420, at: 160, scale: 1.0 },
            { x: 340, y: 480, at: 210, scale: 1.1 },
          ]}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: '#ffd27a', mixBlendMode: 'soft-light', opacity: 0.16 * lit }} />
    </Scene>
  );
};

export default S12;
