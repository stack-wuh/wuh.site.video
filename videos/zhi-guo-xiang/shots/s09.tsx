/* S09 · 万兽山庄。山间庄园夜：院中火把，兽影伏在廊下，崖顶一只巨大黑雕的剪影 210f
 *
 * v12 分镜：大远·固定，缓慢后拉。底图 `p-beast-villa`（新，art-v12；火把、兽影、雕都在画里）。
 * 代码只做「夜里有人住」这件事：
 *   ① 后拉：1.07 → 1.0（退开后看到整座庄园与崖顶那只雕）；
 *   ② 火把：FireLine 在院中那一带点 4 把（各自闪烁），火光在院墙上洇一层暖光；
 *   ③ 贴地雾：雾从廊下往院子里漫；
 *   ④ 灰烬：几点余烬从火把上飘。
 * 转场：入「墨洇」，出「墨洇」。
 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ShotScene } from '../components/e-scene';
import { FireLine, WarmBloom } from '../components/e-firelight';
import { EmberField } from '../components/e-emberfield';
import { GroundMist } from '../components/c-fog';
import { DustField } from '../components/DustField';

const TOTAL = 210;

const S09: FC = () => {
  const f = useCurrentFrame();
  return (
    <ShotScene name="p-beast-villa" total={TOTAL} frame={f} zoom={[1.07, 1.0]} dim={0.04}>
      {/* ② 院中火把：四个暖点，各自闪 */}
      <FireLine seedBase="s09-torch" band={{ x0: 600, x1: 1340, y0: 552, y1: 640 }} count={3} halo={62} core={2.2} opacity={0.5} period={26} />
      {/* 火把在院墙上洇的暖光（很宽，很淡） */}
      <WarmBloom at={{ x: 940, y: 640 }} r={560} squash={0.4} opacity={0.08} period={26} breath={0.35} blur={90} />

      {/* ④ 余烬 */}
      <EmberField seedBase="s09" at={{ x: 940, y: 660 }} spread={520} rise={300} count={8} period={120} sizeBase={0.9} opacity={0.8} />

      {/* ① 后拉时压一档夜色（退开之后庄园在外面，天更冷） */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(20,26,34,0.62) 0%, rgba(20,26,34,0.3) 34%, rgba(20,26,34,0.46) 100%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />

      {/* ③ 贴地雾 */}
      <GroundMist seedBase="s09" y={910} drift={-0.6} opacity={0.5} />
      <DustField act={3} count={18} seedBase="s09-night" wind={6} />

      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 82% 78% at 50% 50%, transparent 46%, rgba(20,26,34,0.5) 100%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
    </ShotScene>
  );
};

export default S09;