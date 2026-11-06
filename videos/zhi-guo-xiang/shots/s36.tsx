/* S36 · 海面云霞，与十六岁那夜的烟花叠在同一帧 210f */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { AbsoluteFill } from 'remotion';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';
import { Fireworks } from '../components/Fireworks';

const S36: FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, 120], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Scene name="p-sea" zoom={[1.0, 1.04]} warm={0.08}>
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: t }}>
        <Fireworks seed="s34" bursts={[{ x: 980, y: 300, at: 0, scale: 1.6 }, { x: 1500, y: 360, at: 60, scale: 1.2 }]} />
      </AbsoluteFill>
      <Caption text="很多年后，有人在海边读到这张纸。" start={30} end={194} tone="ink" />
    </Scene>
  );
};

export default S36;
