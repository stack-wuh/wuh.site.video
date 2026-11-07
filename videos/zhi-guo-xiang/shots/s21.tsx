/* S21 · 她跟着跳下去（180f · 入「硬切」）
 *
 * v12 分镜 Act 5：她冲到崖边，往下看一眼，跟着跳下去；衣摆与斗篷翻起。底图 `p-jump-her`。
 * **人物在底图里**（侧后、倾身向崖外、斗篷被风翻起），代码不叠第二个身影，只做三件：
 *   · 手持微晃 —— 两个不同周期的正弦叠出「手托着机器」的漂移，幅度 2–3px（不是整镜摇）；
 *   · RisingFog —— 谷底雾往上涌，吃掉她脚边那一截崖石；
 *   · DustField —— 斗篷那一侧的风（wind 正 = 向右，与底图翻向右边的斗篷同向）。
 * 入硬切：动作从第 0 帧就成立，镜内不做淡入。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { RisingFog } from '../components/c-fog';
import { CloudDrift } from '../components/f-clouddrift';
import { CLAMP } from '../motion-tokens';

const S21: FC = () => {
  const f = useCurrentFrame();
  /* 手持：20–30f 周期各一条，相位错开；分量加起来不超过 3px，观众只觉得机器在人手里 */
  const sx = Math.sin(f / 23) * 2.2 + Math.sin(f / 9.5 + 1.7) * 0.9;
  const sy = Math.cos(f / 19 + 0.6) * 1.8 + Math.cos(f / 11.3) * 0.7;
  const fog = interpolate(f, [0, 150, 179], [0.2, 0.9, 1], CLAMP);

  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: -12, transform: `translate(${sx}px, ${sy}px)` }}>
        <Scene name="p-jump-her" zoom={[1.02, 1.065]} dim={0.03}>
          <CloudDrift seed="s21-cloud" count={6} intensity={0.62} band={[0.5, 0.99]} speed={0.3} />
          <RisingFog progress={fog} seedBase="s21-valley" ridgeY={900} rise={430} count={10} strength={1} />
          <DustField act={5} count={40} seedBase="s21-wind" wind={22} />
          <Caption cue="s21" tone="ink" />
        </Scene>
      </div>
    </AbsoluteFill>
  );
};

export default S21;