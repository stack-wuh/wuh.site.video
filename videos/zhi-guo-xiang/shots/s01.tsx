/* S01 · 序·海边：他坐在礁石上读纸（全片唯一一次出现） 210f
 * v10 §五：底图 p-him-ink 已有人物（背影读纸），不叠第二个人；
 * 接一层海风——DustField 带 wind 的暖金/纸尘按海风方向低压掠过，补「海风动衣角」的画内动势。 */
import type { FC } from 'react';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';

const S01: FC = () => (
  <Scene name="p-him-ink" zoom={[1.0, 1.05]} warm={0.1}>
    <DustField act={1} count={22} seedBase="s01-sea" wind={18} />
    <Caption cue="s01" tone="ink" />
  </Scene>
);

export default S01;
