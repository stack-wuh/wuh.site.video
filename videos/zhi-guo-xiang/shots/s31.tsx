/* S31 · 背影空袖大雕掠过 300f——只给背影与雕影 */
import type { FC } from 'react';
import { useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { colors } from '../../../brand/tokens';

const S31: FC = () => {
  const f = useCurrentFrame();
  const eagleX = 1500 - f * 4.5;
  const eagleY = 240 + Math.sin(f / 30) * 14;
  return (
    <Scene name="u-guest-out" zoom={[1.08, 1.14]} driftY={[4, -8]} dim={0.22}>
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
        {f < 330 ? (
          <path
            d={`M${eagleX} ${eagleY} q 40 -14 84 0 q -20 -10 -44 -8 q -22 -6 -40 8 Z`}
            fill={colors.ink}
            opacity={0.75}
          />
        ) : null}
      </svg>
    </Scene>
  );
};

export default S31;
