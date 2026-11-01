/* S36 · 烟灰落肩 240f */
import type { FC } from 'react';
import { random, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { colors } from '../../../brand/tokens';

const ASH = Array.from({ length: 30 }, (_, i) => i);

const S36: FC = () => {
  const f = useCurrentFrame();
  return (
    <Scene name="u-fireworks-v2" zoom={[1.16, 1.22]} dim={0.3}>
      {ASH.map((i) => {
        const s = `s36-${i}`;
        const y = ((random(`${s}-y`) * 1000 + f * (0.6 + random(`${s}-v`))) % 1000);
        const drift = Math.sin((f + random(`${s}-p`) * 80) / 40) * 14;
        return <div key={s} style={{ position: 'absolute', left: random(`${s}-x`) * 1920 + drift, top: y, width: 2, height: 1, background: colors.paperMuted, opacity: 0.3 }} />;
      })}
    </Scene>
  );
};

export default S36;
