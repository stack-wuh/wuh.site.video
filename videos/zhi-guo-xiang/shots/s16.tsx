/* S16 · 渡口的船靠岸，她上船 240f */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';

const S16: FC = () => <Scene name="p-ferry" zoom={[1.0, 1.06]} driftX={[20, -20]} warm={0.08} />;

export default S16;
