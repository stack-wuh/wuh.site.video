/* S16 · 驴蹄踩过水洼，一行蹄印 150f
 * v10 §五：这一镜是蹄印的俯拍特写，驴的尺度对不上（Donkey 不放），接「蹄印涟漪」：
 * 水洼里一圈墨色涟漪慢慢洇开、同时淡掉（用抽出来的 InkBloom，冷灰、multiply），
 * 再叠一层极稀的浮尘。底图与镜头不动。 */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { DustField } from '../components/DustField';
import { InkBloom } from '../components/InkBloom';
import { CLAMP, FILM } from '../motion-tokens';

/** 底图水洼实测：主水洼 ≈ x 600–1200 / y 280–540，取中心 (870,455) 放涟漪。 */
const RIPPLE = { x: 870, y: 455, r: 240 };

const S16: FC = () => {
  const f = useCurrentFrame();
  const progress = interpolate(f, [4, 128], [0.1, 0.72], CLAMP);
  const opacity = interpolate(f, [4, 128], [0.2, 0.02], CLAMP);
  return (
    <Scene name="p-hoof" zoom={[1.06, 1.0]} driftX={[-20, 20]}>
      <InkBloom progress={progress} at={RIPPLE} color={FILM.snowCyan} opacity={opacity} blur={6} />
      <DustField act={4} count={16} seedBase="s16-dust" wind={8} />
    </Scene>
  );
};

export default S16;
