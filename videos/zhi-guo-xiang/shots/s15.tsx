/* S15 · 高处，一个空袖背影看着这座城 180f
 * v10 §五：底图 p-high 已有空袖背影与画上去的烟花，不叠第二个人；
 * 接两层：城里还没落尽的烟花（Fireworks，screen 混合，尺度比 S11–S13 小——那是远景）
 * 与高处浮尘（DustField）。 */
import type { FC } from 'react';
import { AbsoluteFill } from 'remotion';
import { Scene } from '../components/SceneKit';
import { DustField } from '../components/DustField';
import { Fireworks } from '../components/Fireworks';

const S15: FC = () => (
  <Scene name="p-high" zoom={[1.0, 1.05]} dim={0.05}>
    <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.8 }}>
      <Fireworks
        seed="s15"
        bursts={[
          { x: 1300, y: 560, at: 26, scale: 0.8 },
          { x: 1600, y: 470, at: 92, scale: 0.6 },
          { x: 1180, y: 650, at: 146, scale: 0.5 },
        ]}
      />
    </AbsoluteFill>
    <DustField act={3} count={26} seedBase="s15-high" wind={9} />
  </Scene>
);

export default S15;
