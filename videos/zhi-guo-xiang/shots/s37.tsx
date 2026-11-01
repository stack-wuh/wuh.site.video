/* S37 · 背面最后一行 180f——全片最后一句 */
import type { FC } from 'react';
import { Slide } from '../components/SceneKit';
import { InkPaper, POEM_COLS } from '../components/InkPaper';

const S37: FC = () => (
  <Slide zoom={[1.02, 1.08]} driftY={[0, -30]}>
    <InkPaper base="p-paper-back" lines={[POEM_COLS[8]]} progress={1} size={68} right="28%" top="7%" />
  </Slide>
);

export default S37;
