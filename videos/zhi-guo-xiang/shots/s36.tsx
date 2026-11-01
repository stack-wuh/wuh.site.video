/* S36 · 他把纸翻过来。背面有字，墨色如新 150f */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Slide } from '../components/SceneKit';
import { InkPaper, POEM_COLS } from '../components/InkPaper';

const S36: FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [10, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Slide zoom={[1.06, 1.0]}>
      <InkPaper base="p-paper-back" lines={[POEM_COLS[6], POEM_COLS[7], POEM_COLS[8]]} progress={t} size={44} right="22%" top="12%" />
    </Slide>
  );
};

export default S36;
