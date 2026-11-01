/* S26 · 火塘一圈剪影 360f */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { FILM } from '../motion-tokens';

const S26: FC = () => {
  const f = useCurrentFrame();
  const flick = 0.5 + 0.5 * Math.sin(f / 6) * Math.sin(f / 15);
  return (
    <Scene name="u-g05-fire" zoom={[1.0, 1.05]} dim={0.1}>
      <AbsoluteFill style={{ background: FILM.fireGold, opacity: 0.05 + 0.04 * flick, mixBlendMode: 'soft-light' }} />
    </Scene>
  );
};

export default S26;
