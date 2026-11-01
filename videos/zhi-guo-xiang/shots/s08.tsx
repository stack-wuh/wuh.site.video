/* S8 · 一滴墨落下 180f——微距 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { colors } from '../../../brand/tokens';

const S08: FC = () => {
  const f = useCurrentFrame();
  const drop = interpolate(f, [30, 44, 60], [0, 1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const spread = interpolate(f, [44, 170], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Scene name="u-paper" zoom={[1.1, 1.16]} dim={0.12}>
      <AbsoluteFill style={{ mixBlendMode: 'multiply' }}>
        <div
          style={{
            position: 'absolute', left: '50%', top: '48%',
            width: 30 + spread * 210, height: 26 + spread * 170,
            marginLeft: -(15 + spread * 105), marginTop: -(13 + spread * 85),
            borderRadius: '50%',
            background: `radial-gradient(ellipse, ${colors.ink} 0%, rgba(15,14,12,0.5) 46%, transparent 74%)`,
            opacity: 0.75 * drop,
            filter: `blur(${2 + spread * 5}px)`,
          }}
        />
      </AbsoluteFill>
    </Scene>
  );
};

export default S08;
