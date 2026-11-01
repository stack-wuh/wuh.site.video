/* S29 · 醉汉拉扯 240f——不拍动作，只拍斗篷一角被扯斜 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { colors } from '../../../brand/tokens';

const S29: FC = () => {
  const f = useCurrentFrame();
  const tug = Math.sin(f / 12) * 3;
  return (
    <Scene name="u-guest-out" zoom={[1.14, 1.2]} driftX={[tug, -tug]} dim={0.16}>
      <AbsoluteFill style={{ background: colors.ink, opacity: 0.1 }} />
    </Scene>
  );
};

export default S29;
