/* S38 · 华山他走进雾里 360f */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { colors } from '../../../brand/tokens';

const S38: FC = () => {
  const f = useCurrentFrame();
  const rise = interpolate(f, [0, 360], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Scene name="u-huashan-v2" zoom={[1.02, 1.08]} dim={0.06}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute', left: -180, right: -180,
            bottom: `${2 + i * 14 + rise * (24 - i * 5)}%`,
            height: '16%',
            background: `linear-gradient(180deg, transparent, ${colors.paper} 60%, transparent)`,
            opacity: (0.5 - i * 0.1) * (0.35 + 0.65 * rise),
            filter: 'blur(16px)',
          }}
        />
      ))}
    </Scene>
  );
};

export default S38;
