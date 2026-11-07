/* S01 · 序·海边：他坐在礁石上看落日 180f
 *
 * v12 分镜（用户 2026-11-07 改）：中·背影固定，海风动衣角。
 * 底图 `p-him-watch`（美术生成中：他**空手**坐在礁石上看海，姿势/衣服/光线同 p-him-sit，只是手里没有纸）。
 * 手里不再有照片、纸上也不再有落日——这一镜就是「他在看落日」。
 *
 * 本镜只做「风」与「光」，不叠任何实物：
 *   ① 海风：DustField 定向风（wind 26，左来右去），纸尘与金尘被风压低掠过画面；
 *   ② 海雾擦镜头：MistFlow 低浓度朝镜头方向流（period 260），读作海面起风时贴水的一层水汽；
 *   ③ 落日的暖光：海面那道金光轻轻呼吸（WarmBloom，周期 ~3s），另给整帧一档很淡的暖调呼吸；
 *   ④ 极缓推 1.0 → 1.05（背影固定，只有这一点点进）。
 *
 * 转场：入「切」，出「切」。字幕本轮不接。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { ShotScene } from '../components/e-scene';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { MistFlow } from '../components/b-mistflow';
import { WarmBloom } from '../components/e-firelight';
import { CLAMP } from '../motion-tokens';

const TOTAL = 180;
/** 海面那道金光（落日在海上拉出的光带，1920×1080 基准） */
const SUN_PATH = { x: 960, y: 250 };

const S01: FC = () => {
  const f = useCurrentFrame();
  /* 落日呼吸：很慢，整镜只走两轮多一点 */
  const breath = interpolate(f, [0, 90, TOTAL - 1], [0.055, 0.085, 0.06], CLAMP);

  return (
    <ShotScene name="p-him-watch" total={TOTAL} frame={f} zoom={[1.0, 1.05]} driftX={[-2, 4]} warm={0.1 + 0.02 * breath}>
      {/* ③ 海面金光：被风揉着，亮一下、暗一下 */}
      <WarmBloom at={SUN_PATH} r={320} squash={0.5} opacity={breath} period={96} breath={0.5} blur={46} />

      {/* ② 贴水的水汽：朝镜头方向慢慢推过来 */}
      <MistFlow seed="s01-spray" intensity={0.55} period={260} count={4} />

      {/* ① 海风里的纸尘/金尘（风把衣角与尘一起掀起来） */}
      <DustField act={1} count={20} seedBase="s01-wind" wind={26} />

      {/* 角晕：把视线收到礁石上那个人 */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 82% 78% at 52% 48%, transparent 46%, rgba(43,38,32,0.28) 100%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
      <Caption cue="s01" tone="paper" />
    </ShotScene>
  );
};

export default S01;