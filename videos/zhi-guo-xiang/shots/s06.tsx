/* S06 · 客栈火塘，一圈剪影；她坐在最外圈，只听 210f
 *
 * v12 分镜：全·火塘低机位，浅景深。底图 `p-firecircle`（火塘、一圈剪影、烟火气全在画里）。
 * 代码只让火活：
 *   ① 火光：WarmBloom 压在火塘心（实测 955,745）上呼吸——火塘是这一镜唯一的光源；
 *   ② 火星：EmberField 从火塘心升起（周期取模，整镜不断火）；
 *   ③ 浅景深：前景（画面下沿）一道压暗的虚焦，视线被压在火与那圈人上。
 * 不叠第二套火焰、不画人。
 * 转场：入「墨洇」，出「墨洇」。
 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ShotScene } from '../components/e-scene';
import { Caption } from '../components/Caption';
import { WarmBloom } from '../components/e-firelight';
import { LightWash } from '../components/LightWash';
import { EmberField } from '../components/e-emberfield';
import { DustField } from '../components/DustField';

const TOTAL = 270;
/** 火塘心（p-firecircle 实测） */
const FIRE = { x: 955, y: 745 };

const S06: FC = () => {
  const f = useCurrentFrame();
  return (
    <ShotScene name="p-firecircle" total={TOTAL} frame={f} zoom={[1.0, 1.045]} dim={0.03}>
      {/* ① 火光呼吸（24f ≈ 火苗的频率，不是镜头呼吸） */}
      <WarmBloom at={FIRE} r={230} squash={0.86} opacity={0.26} period={22} breath={0.5} blur={46} />
      {/* 火光在火塘周围地面上的第二层反光（更宽、更淡） */}
      <WarmBloom at={{ x: FIRE.x, y: FIRE.y + 40 }} r={430} squash={0.42} opacity={0.1} period={22} phase={1.1} breath={0.45} blur={70} />

      {/* ② 火星 */}
      <EmberField seedBase="s06" at={{ x: FIRE.x, y: FIRE.y - 6 }} spread={150} rise={300} count={16} period={84} sizeBase={1} opacity={1} />
      <DustField act={3} count={20} seedBase="s06-firelight" wind={3} />

      {/* ③ 浅景深：前景虚焦 + 四角压暗，只留中间那圈人 */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(43,38,32,0.34) 0%, transparent 22%, transparent 66%, rgba(43,38,32,0.46) 100%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
      <LightWash
        shape="ellipse 74% 66% at 50% 56%"
        stops={[['transparent', 44], ['rgba(43,38,32,0.34)', 100]]}
        strength={1}
        blend="multiply"
      />
      <Caption cue="s06" tone="paper" />
    </ShotScene>
  );
};

export default S06;