/* S3 · 他读：前四行墨旧，第五行只剩「其」 210f——读下去 */
import type { FC } from 'react';
import { Slide } from '../components/SceneKit';
import { InkPaper, POEM_COLS } from '../components/InkPaper';

const S03: FC = () => (
  <Slide zoom={[1.0, 1.035]} driftY={[0, 26]} dim={0.03}>
    <InkPaper
      base="p-paper-close-dusk"
      lines={[...POEM_COLS.slice(0, 6), '其']}
      progress={1}
      size={54}
      right="14%"
      top="9%"
      blot={0.5}
      blotOn={6}
    />
  </Slide>
);

export default S03;
