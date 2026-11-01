/* S20 · 街边孩子跳着唱童谣 240f */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';

const S20: FC = () => <Scene name="p-kids" zoom={[1.0, 1.06]} driftX={[-24, 24]} warm={0.1} />;

export default S20;
