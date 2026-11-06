/* S33 · 笔悬着 210f
 * v10 §五（P0）/ script §P0-2：全片最长的一次不动——笔尖一滴墨将落未落。
 * 只补这一层：InkBloom 在笔尖处极慢积聚（progress 0 → 0.22），不落。
 * 转场：入硬切 / 出硬切。本镜无字幕。 */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { InkPaper } from '../components/InkPaper';
import { InkBloom } from '../components/InkBloom';
import { CLAMP } from '../motion-tokens';

/** 底图实测笔尖墨滴 (1030,605)，zoom 1.12→1.15 之后约 (1040,612)；
 *  InkBloom 的纵向中心比 at.y 略低（0.35·r·progress），所以 at.y 取 598 让墨积在滴上。 */
const TIP = { x: 1039, y: 607 };

const S33: FC = () => {
  const f = useCurrentFrame();
  const gather = interpolate(f, [0, 200], [0, 0.22], CLAMP);
  return (
    <Scene name="p-brush" zoom={[1.12, 1.15]} warm={0.08} dim={0.02}>
      <InkPaper lines={['其实我只是爱上了峨眉山上的云和']} progress={0.82} size={46} right="46%" top="18%" />
      <InkBloom progress={gather} at={TIP} r={80} blur={2} opacity={0.9} />
    </Scene>
  );
};

export default S33;