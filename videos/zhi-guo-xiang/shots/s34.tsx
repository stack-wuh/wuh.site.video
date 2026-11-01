/* S34 · 眼里映着光 300f——长焦近景（用 u-fireworks 天空 + 代码反光点） */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { FILM } from '../motion-tokens';

const S34: FC = () => {
  const f = useCurrentFrame();
  const glow = interpolate(f, [0, 40, 240, 300], [0.2, 1, 1, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const flick = 0.55 + 0.45 * Math.sin(f / 7);
  return (
    <Scene name="u-fireworks-v2" zoom={[1.3, 1.42]} driftY={[-20, -34]} dim={0.3}>
      <AbsoluteFill
        style={{
          position: 'absolute', left: '50%', top: '52%', width: 6, height: 6, borderRadius: '50%',
          background: FILM.fireGold, opacity: glow * flick, boxShadow: `0 0 16px ${FILM.fireGold}`,
        }}
      />
    </Scene>
  );
};

export default S34;
