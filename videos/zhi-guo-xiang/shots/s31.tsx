/* S31 · 满城烟花炸开，她仰头 420f——全片最亮 */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { AbsoluteFill } from 'remotion';
import { Scene } from '../components/SceneKit';
import { Fireworks } from '../components/Fireworks';

const S31: FC = () => {
  const f = useCurrentFrame();
  const lit = interpolate(f, [0, 60, 420], [0, 1, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Scene name="p-her-up" zoom={[1.0, 1.05]}>
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.95 }}>
        <Fireworks
          seed="s31"
          bursts={[
            { x: 520, y: 300, at: 20, scale: 1.5 },
            { x: 1180, y: 220, at: 70, scale: 1.8 },
            { x: 820, y: 380, at: 140, scale: 1.2 },
            { x: 1480, y: 420, at: 200, scale: 1.0 },
            { x: 340, y: 480, at: 260, scale: 1.1 },
          ]}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: '#ffd27a', mixBlendMode: 'soft-light', opacity: 0.18 * lit }} />
    </Scene>
  );
};

export default S31;
