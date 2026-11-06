/* S04 · 客栈火塘，一圈剪影，她坐最外圈 180f
 * v10 §五：火塘是这一镜唯一的活物。底图 p-firecircle 的火苗与烟已经画进画面，不再叠第二套火焰；
 * 接两层：DustField 的光尘（金尘） + 少量火星从火塘升起（确定性 random，暖金，全片无红）。 */
import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { DustField } from '../components/DustField';
import { FILM } from '../motion-tokens';

const EMBERS = 14;

/** 火星：从火塘心（底图实测 ≈ 940,690）升起，升到一半最亮，越升越淡。
 *  用周期取模而不是一次性生命，整镜都有火星（不会前半段有、后半段熄）。 */
const Embers: FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {Array.from({ length: EMBERS }).map((_, i) => {
        const seed = `s04-ember-${i}`;
        const cycle = 78 + random(`${seed}-cycle`) * 66;
        const t = (f + random(`${seed}-phase`) * cycle) % cycle;
        const k = t / cycle; // 0 起 → 1 熄
        const x0 = 930 + (random(`${seed}-x`) - 0.5) * 130;
        const rise = 130 + random(`${seed}-rise`) * 170;
        const x = x0 + Math.sin(t / 9 + random(`${seed}-sway`) * 6.28) * 20 + t * 0.35;
        const y = 700 - k * rise;
        const size = 1.2 + random(`${seed}-size`) * 2;
        const opacity = Math.sin(k * Math.PI) * (0.45 + random(`${seed}-o`) * 0.35);
        return (
          <div
            key={seed}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: size / 2,
              background: FILM.fireGold,
              opacity,
              boxShadow: `0 0 ${size * 3.5}px ${FILM.fireGold}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const S04: FC = () => (
  <Scene name="p-firecircle" zoom={[1.0, 1.05]}>
    <DustField act={2} count={30} seedBase="s04-firelight" wind={5} />
    <Embers />
  </Scene>
);

export default S04;
