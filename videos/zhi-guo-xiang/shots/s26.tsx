/* S26 · 拈针：侧脸；手举在面前，指间夹一枚金针——她看了很久 180f */
import type { FC } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Scene } from '../components/SceneKit';

const S26: FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  /* 极缓推；灯在画外，暖光是唯一光源，前段亮一点，末段收一点——像她把针移出了光 */
  const warm = interpolate(f, [0, durationInFrames * 0.5, durationInFrames], [0.04, 0.09, 0.05], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <Scene name="p-needle-look" zoom={[1.0, 1.035]} warm={warm} dim={0.06} />;
};

export default S26;
