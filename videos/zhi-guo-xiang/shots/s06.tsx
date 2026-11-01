/* S6 · 笔尖落下，写下一个字 180f */
import type { FC } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Scene } from '../components/SceneKit';
import { InkPaper } from '../components/InkPaper';

const S06: FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(f, [20, durationInFrames - 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Scene name="p-brush" zoom={[1.0, 1.05]} warm={0.08}>
      <InkPaper lines={['其实我只是爱上了峨眉山上的云和']} progress={p} size={46} right="30%" top="26%" />
    </Scene>
  );
};

export default S06;
