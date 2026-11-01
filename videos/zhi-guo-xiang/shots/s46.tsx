/* 镜 46 · 幕六 云 · local [0,150) · 150f
   云海铺满画幅，暖金与胭脂一层层叠；云流动得极慢，比前面任何一段都慢（150f 内位移 ≤3%）。 */
import type { FC } from 'react';
import { AbsoluteFill } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase } from '../components/ArtBase';

const S46: FC = () => (
  <AbsoluteFill style={{ background: colors.bg }}>
    <ArtBase name="g18" zoom={[1.04, 1.06]} shiftX={[-18, 18]}>
      <AbsoluteFill style={{ background: colors.paper, opacity: 0.04 }} />
    </ArtBase>
  </AbsoluteFill>
);

export default S46;
