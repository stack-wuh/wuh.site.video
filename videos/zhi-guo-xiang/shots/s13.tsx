/* S13 · 她仰头，脸被照亮 180f */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { AbsoluteFill } from 'remotion';
import { Scene } from '../components/SceneKit';
import { Fireworks } from '../components/Fireworks';

const S13: FC = () => {
  const f = useCurrentFrame();
  const lit = interpolate(f, [0, 50, 180], [0, 1, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Scene name="p-her-up" zoom={[1.0, 1.05]}>
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.95 }}>
        <Fireworks
          seed="s13"
          bursts={[
            { x: 620, y: 260, at: 16, scale: 1.4 },
            { x: 1240, y: 210, at: 70, scale: 1.6 },
            { x: 900, y: 340, at: 130, scale: 1.1 },
          ]}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: '#ffd27a', mixBlendMode: 'soft-light', opacity: 0.18 * lit }} />
    </Scene>
  );
};

export default S13;
