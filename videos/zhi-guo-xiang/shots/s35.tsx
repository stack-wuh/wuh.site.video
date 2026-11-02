/* S35 · 纸背：第五、六行写得完整，墨色如新 240f */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Slide } from '../components/SceneKit';
import { InkPaper, POEM_COLS } from '../components/InkPaper';
import { Caption } from '../components/Caption';

const S35: FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [10, 140], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Slide zoom={[1.02, 1.08]} driftY={[0, -30]}>
      <InkPaper base="p-paper-back" lines={[POEM_COLS[6], POEM_COLS[7], POEM_COLS[8]]} progress={t} size={52} right="24%" top="9%" />
      <Caption text="她把一生，写成了一首诗。" start={18} end={222} tone="ink" />
    </Slide>
  );
};

export default S35;
