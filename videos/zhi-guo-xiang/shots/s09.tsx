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
import { Caption } from '../components/Caption';
import { FireLine, WarmBloom } from '../components/e-firelight';
import { EmberField } from '../components/e-emberfield';
import { GroundMist } from '../components/c-fog';
import { DustField } from '../components/DustField';

const TOTAL = 360;

const S09: FC = () => {
  const f = useCurrentFrame();
  return (
    <ShotScene name="p-beast-villa" total={TOTAL} frame={f} zoom={[1.07, 1.0]} dim={0.07}>
      {/* ② 院中火把：四个暖点，各自闪 */}
      <FireLine seedBase="s09-torch" band={{ x0: 600, x1: 1340, y0: 552, y1: 640 }} count={3} halo={80} core={2.6} opacity={0.8} period={26} />
      {/* 廊下灯笼：比火把小、比火把低，沿台阶排一列 */}
      <FireLine seedBase="s09-lantern" band={{ x0: 700, x1: 1200, y0: 640, y1: 720 }} count={4} halo={42} core={1.8} opacity={0.55} period={38} />
      {/* 火把在院墙上洇的暖光（很宽，很淡） */}
      <WarmBloom at={{ x: 940, y: 640 }} r={600} squash={0.4} opacity={0.14} period={26} breath={0.35} blur={90} />
      {/* 火光落在台阶与地面上的那一块（暖光要落地，人才站得住） */}
      <WarmBloom at={{ x: 960, y: 760 }} r={520} squash={0.24} opacity={0.1} period={26} phase={1.2} breath={0.3} blur={70} />

      {/* ④ 余烬 */}
      <EmberField seedBase="s09" at={{ x: 940, y: 660 }} spread={520} rise={300} count={8} period={120} sizeBase={0.9} opacity={0.8} />

      {/* ① 后拉时压一档夜色（退开之后庄园在外面，天更冷） */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(40,34,27,0.74) 0%, rgba(40,34,27,0.46) 32%, rgba(40,34,27,0.58) 100%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />

      {/* 夜：只在最上面留一档冷（天比地冷），暗部仍旧是暖深墨褐 */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(20,26,34,0.3) 0%, transparent 30%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />

      {/* ③ 贴地雾 */}
      <GroundMist seedBase="s09" y={910} drift={-0.6} opacity={0.5} />
      <DustField act={3} count={18} seedBase="s09-night" wind={6} />

      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 80% 76% at 50% 52%, transparent 40%, rgba(36,31,26,0.62) 100%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
      <Caption cue="s09" tone="paper" />
    </ShotScene>
  );
};

export default S09;