/* S5 · 灯芯被拨亮，暖光扩大一圈 150f */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';

const S05: FC = () => {
  const f = useCurrentFrame();
  const grow = interpolate(f, [0, 60, 150], [0, 1, 0.92], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <Scene name="p-lamp" zoom={[1.0, 1.04]} warm={0.06 + grow * 0.1} dim={0.12 - grow * 0.1} />;
};

export default S05;
