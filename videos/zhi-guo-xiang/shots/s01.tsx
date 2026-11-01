/* S1 · 纸角被风掀起，一只手按住 150f */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';

const S01: FC = () => <Scene name="p-rock-paper" zoom={[1.0, 1.05]} driftX={[8, -8]} warm={0.1} />;

export default S01;
