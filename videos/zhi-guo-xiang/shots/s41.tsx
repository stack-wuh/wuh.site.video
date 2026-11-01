/* 镜 41 · 幕五 散课 · local [0,160) · 160f
   弟子散去，走过庭中石阶；她在廊下目送，只有背影；晨光把她的影子拉长到阶上。
   末 40f 极缓后拉 2%，庭院变大。 */
import type { FC } from 'react';
import { AbsoluteFill } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase, Plate } from '../components/ArtBase';

const S41: FC = () => (
  <AbsoluteFill style={{ background: colors.bg }}>
    <ArtBase name="g17" zoom={[1.0, 1.10]} shiftY={[4, -6]}>
      <AbsoluteFill style={{ background: colors.paper, opacity: 0.1 }} />
      <Plate name="nun-full" height="40%" right={190} bottom={-10} opacity={0.9} />
    </ArtBase>
    <AbsoluteFill style={{ background: colors.paper, opacity: 0.05 }} />
  </AbsoluteFill>
);

export default S41;
