/* S25 · 掌心摊开，剩两枚 180f
 * v10 §2.3/§2.4：与 S10 同一张底图 p-palm2、同一 zoom [1.04,1.1]、同一组针槽真值（PALM2_NEEDLES），
 * 严格只少一枚（drop i=0，保留中间与下面两槽）——「同一只手少了一枚针」到这才成立。 */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { Needles, PALM2_NEEDLES } from '../components/Needles';

const S25: FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Scene name="p-palm2" zoom={[1.04, 1.1]}>
      <Needles count={3} drop={0} {...PALM2_NEEDLES} opacity={t} />
    </Scene>
  );
};

export default S25;