/* S10 · 逆光里一个戴面具的男子走出来：深墨长袍，右袖空垂，只见后背与侧影 210f
 *
 * v12 分镜：中·逆光剪影，缓推。底图 `p-masked-man`（新，art-v12；面具、空袖、背影都在画里，
 * 火光已经在面具边缘描了一圈金）。人物一律来自底图——本镜不画人。
 *
 * 代码只加光（逆光的「光」要活，剪影才立得住）：
 *   ① 背后的火：WarmBloom 在他身后大面积呼吸（比人物亮一档，人物才成剪影）；
 *   ② 轮廓金边：RimLight 一道窄长的暖光贴在他肩/面具那一侧，随火光轻抖；
 *   ③ 余烬 + 浮尘：火塘方向的灰往上飘。
 * 缓推：1.0 → 1.06。
 * 转场：入「墨洇」，出「墨洇」。
 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ShotScene } from '../components/e-scene';
import { WarmBloom, RimLight } from '../components/e-firelight';
import { EmberField } from '../components/e-emberfield';
import { DustField } from '../components/DustField';

const TOTAL = 210;
/** 光从画面右侧的火塘来（逆光）：光源在他身后偏右 */
const BACKLIGHT = { x: 1380, y: 520 };
/** 轮廓金边贴的那条线（近后脑—肩—右袖一侧） */
const RIM = { x: 1108, y: 470 };

const TAU = Math.PI * 2;

const S10: FC = () => {
  const f = useCurrentFrame();
  const flick = 0.82 + 0.18 * Math.sin((f / 32) * TAU);

  return (
    <ShotScene name="p-masked-man" total={TOTAL} frame={f} zoom={[1.0, 1.06]} dim={0.02}>
      {/* ① 背后的火：大、软、呼吸（逆光的底） */}
      <WarmBloom at={BACKLIGHT} r={720} squash={0.92} opacity={0.2} period={34} breath={0.4} blur={110} />
      {/* 火心更亮一点的那一层（在人物右后方，被他的轮廓挡住一半） */}
      <WarmBloom at={{ x: BACKLIGHT.x + 90, y: BACKLIGHT.y + 40 }} r={300} squash={0.9} opacity={0.14} period={34} phase={1.4} breath={0.45} blur={60} />

      {/* ② 轮廓金边：贴着肩线的一道窄光（面具边缘那一圈金由底图给，这里只补火的抖动） */}
      <RimLight at={RIM} len={470} width={13} angle={86} amount={0.55 * flick} blur={12} />
      <RimLight at={{ x: RIM.x - 34, y: RIM.y - 210 }} len={190} width={9} angle={64} amount={0.4 * flick} blur={9} />

      {/* ③ 余烬与浮尘 */}
      <EmberField seedBase="s10" at={{ x: 1200, y: 1120 }} spread={880} rise={630} count={11} period={140} sizeBase={0.9} opacity={0.75} windX={-0.05} />
      <DustField act={3} count={16} seedBase="s10-firelight" wind={4} />

      {/* 角晕：把剪影压到画中间 */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 78% 74% at 56% 50%, transparent 44%, rgba(24,29,36,0.45) 100%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
    </ShotScene>
  );
};

export default S10;