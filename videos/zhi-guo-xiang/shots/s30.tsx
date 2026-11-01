/* S30 · 独臂人解围 300f——逆光剪影 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { FILM } from '../motion-tokens';

const S30: FC = () => {
  const f = useCurrentFrame();
  const rim = interpolate0(f);
  function interpolate0(x: number) {
    return x < 40 ? x / 40 : Math.max(0, 1 - (x - 220) / 80);
  }
  return (
    <Scene name="u-guest-out" zoom={[1.1, 1.16]} dim={0.3}>
      <AbsoluteFill style={{ background: FILM.fireGold, opacity: 0.1 * rim, mixBlendMode: 'screen' }} />
    </Scene>
  );
};

export default S30;
