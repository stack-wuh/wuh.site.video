/* S35 · 他睁眼，云霞与十六岁的烟花叠在同一帧 150f */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { AbsoluteFill } from 'remotion';
import { Scene } from '../components/SceneKit';
import { Fireworks } from '../components/Fireworks';

const S35: FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, 90], [0, 0.55], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Scene name="p-him-sit" zoom={[1.14, 1.18]} warm={0.16}>
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: t }}>
        <Fireworks seed="s35" bursts={[{ x: 980, y: 300, at: 0, scale: 1.2 }, { x: 1500, y: 360, at: 40, scale: 0.9 }]} />
      </AbsoluteFill>
    </Scene>
  );
};

export default S35;
