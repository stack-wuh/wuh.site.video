/* S33 · 生日夜满城烟花 360f——全片最亮 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { Fireworks } from '../components/Fireworks';
import { FILM } from '../motion-tokens';

const S33: FC = () => {
  const f = useCurrentFrame();
  const flash = f > 60 && f < 80 ? 0.07 * Math.sin(((f - 60) / 20) * Math.PI) : 0;
  return (
    <Scene name="u-fireworks-v2" zoom={[1.0, 1.05]} dim={0.05}>
      <Fireworks
        seed="s33"
        bursts={[
          { x: 1420, y: 250, at: 10, scale: 1.2 },
          { x: 480, y: 210, at: 90, scale: 1.0 },
          { x: 980, y: 300, at: 170, scale: 0.85 },
          { x: 1600, y: 340, at: 250, scale: 0.9 },
        ]}
      />
      <AbsoluteFill style={{ background: FILM.fireGold, opacity: flash, mixBlendMode: 'screen' }} />
    </Scene>
  );
};

export default S33;
