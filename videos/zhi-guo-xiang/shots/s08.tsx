/* S08 · 一个独臂人影从火光里过来，一抬手，两人退了 210f
 * v10 §五：底图 p-him 的门口已经站着那个人（背影、独臂、长发都在画里），所以这里不叠第二个人；
 * 接两层让「火」活着：火塘光晕随火光呼吸（InkBloom 当暖金光晕，screen 混合）+ 火光里的浮尘。 */
import type { FC } from 'react';
import { useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { DustField } from '../components/DustField';
import { InkBloom } from '../components/InkBloom';
import { FILM } from '../motion-tokens';

/** 底图火塘实测 ≈ (930,660)，火苗向上到 y≈560；光晕中心压在火根上。 */
const FIRE = { x: 930, y: 660, r: 170 };

const S08: FC = () => {
  const f = useCurrentFrame();
  /* 24f 一次呼吸——火苗的频率，不是镜头呼吸 */
  const breathe = 0.5 + 0.5 * Math.sin((f / 24) * Math.PI * 2);
  return (
    <Scene name="p-him" zoom={[1.0, 1.05]} dim={0.05}>
      <InkBloom
        progress={0.55 + 0.3 * breathe}
        at={FIRE}
        color={FILM.fireGold}
        opacity={0.1 + 0.06 * breathe}
        blur={30}
        style={{ mixBlendMode: 'screen' }}
      />
      <DustField act={2} count={26} seedBase="s08-emberlight" wind={-3} />
    </Scene>
  );
};

export default S08;
