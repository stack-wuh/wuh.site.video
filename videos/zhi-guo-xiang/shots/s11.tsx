/* S11 · 城头夜空，第一朵烟花 180f */
import type { FC } from 'react';
import { AbsoluteFill } from 'remotion';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';
import { Fireworks } from '../components/Fireworks';

const S11: FC = () => (
  <Scene name="p-citynight" zoom={[1.0, 1.04]}>
    <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.95 }}>
      <Fireworks seed="s11" bursts={[{ x: 860, y: 330, at: 30, scale: 2.4 }]} />
    </AbsoluteFill>
    <Caption text="那一夜，满城烟花是为她放的。" start={16} end={164} />
  </Scene>
);

export default S11;
