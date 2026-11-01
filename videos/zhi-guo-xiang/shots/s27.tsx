/* S27 · 听说神雕侠抬眼 300f——眼里有一点火光 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { FILM } from '../motion-tokens';

const S27: FC = () => {
  const f = useCurrentFrame();
  const eye = interpolate(f, [80, 120, 240, 290], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const flick = 0.6 + 0.4 * Math.sin(f / 5);
  return (
    <Scene name="u-g05-fire" zoom={[1.12, 1.2]} dim={0.2}>
      <AbsoluteFill
        style={{
          position: 'absolute', left: '47%', top: '44%', width: 4, height: 4, borderRadius: '50%',
          background: FILM.fireGold, opacity: eye * flick, boxShadow: `0 0 10px ${FILM.fireGold}`,
        }}
      />
    </Scene>
  );
};

export default S27;
