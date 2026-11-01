/* S1 · 黄昏海面 870f——大远固定，云在动 */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';

const S01: FC = () => <Scene name="u-sea" zoom={[1.0, 1.06]} driftY={[4, -6]} warm={0.1} />;

export default S01;
