/* S14 · 雪夜断墙剑 240f */
import type { FC } from 'react';
import { random, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { colors } from '../../../brand/tokens';

const FLAKES = Array.from({ length: 50 }, (_, i) => i);

const S14: FC = () => {
  const f = useCurrentFrame();
  return (
    <Scene name="u-g13-snow" zoom={[1.02, 1.07]} driftX={[6, -6]}>
      {FLAKES.map((i) => {
        const s = `s14-${i}`;
        const x = ((random(`${s}-x`) * 2000 + f * (1 + random(`${s}-v`))) % 2000) - 40;
        const y = ((random(`${s}-y`) * 1180 + f * (2.4 + random(`${s}-w`) * 2)) % 1180) - 40;
        return <div key={s} style={{ position: 'absolute', left: x, top: y, width: 2 + random(`${s}-r`) * 2, height: 2, borderRadius: '50%', background: colors.paper, opacity: 0.4 + random(`${s}-o`) * 0.35 }} />;
      })}
    </Scene>
  );
};

export default S14;
