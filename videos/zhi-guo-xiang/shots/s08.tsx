/* S8 · 一滴墨落下，洇开，把要写的那个字吃掉 180f */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Slide } from '../components/SceneKit';
import { InkPaper, POEM_COLS } from '../components/InkPaper';

const S08: FC = () => {
  const f = useCurrentFrame();
  const blot = interpolate(f, [40, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Slide zoom={[1.0, 1.02]}>
      <InkPaper base="p-paper-close-lamp" lines={[POEM_COLS[6], POEM_COLS[7]]} progress={0.88} size={60} right="24%" top="6%" blot={blot} blotAt={{ x: 1392, y: 528, r: 74 }} />
    </Slide>
  );
};

export default S08;
