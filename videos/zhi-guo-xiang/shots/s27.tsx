/* S27 · 晨课，弟子两列背影，她走过，不出声 210f
 * v10 §五：底图 p-morning 已烤入两列素衣弟子（不再叠 CrowdFigure/DiscipleFigure，会重人）；
 * 只补「她走过」这一层：40b 缁衣背影（落发之后）沿石阶缓步上行，衣摆/布巾滞后一点。
 * 转场：入纸翻（18f）/ 出墨洇（12f）。S27 的字幕 v5 已删（21→14），本镜无字幕。 */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { XiangFigure } from '../components/Figure';
import { CLAMP } from '../motion-tokens';

const S27: FC = () => {
  const f = useCurrentFrame();
  /* 七秒：脚点 1010 → 920（沿阶上行），身高 370 → 300（越走越远，与石阶透视里的弟子同量级）；
   * viewBox 120×320 → 宽 = 高 × 0.375 */
  const t = interpolate(f, [0, 210], [0, 1], CLAMP);
  const footY = 1010 - 90 * t;
  const h = 370 - 70 * t;
  const w = h * 0.375;
  const step = Math.abs(Math.sin(f / 8)) * 3;
  const hem = Math.sin(f / 34) * 3;
  const tail = Math.sin(f / 34 - 0.5) * 4;
  return (
    <Scene name="p-morning" zoom={[1.0, 1.05]}>
      <div
        style={{
          position: 'absolute',
          left: 960 - w / 2 + 6 * t,
          top: footY - h - step,
          width: w,
          height: h,
        }}
      >
        <XiangFigure age="40b" pose="walk" opacity={0.92} flow={{ hem, tail }} style={{ width: '100%', height: '100%' }} />
      </div>
    </Scene>
  );
};

export default S27;