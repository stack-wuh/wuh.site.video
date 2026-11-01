/* S5 · 穿云 120f——云吞画面 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { colors } from '../../../brand/tokens';

const S05: FC = () => {
  const f = useCurrentFrame();
  const white = interpolate(f, [70, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <>
      <Scene name="u-g18-sky" zoom={[1.0, 1.1]} />
      <AbsoluteFill style={{ background: colors.paper, opacity: white }} />
    </>
  );
};

export default S05;
