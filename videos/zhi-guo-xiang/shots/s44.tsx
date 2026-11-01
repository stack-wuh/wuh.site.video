/* 镜 44 · 幕五 看它 · local [0,120) · 120f
   她退开一步，站在墙前看那把剑，像看一件旧物；她只看，不碰；窗外天色压下来，室内暗一度。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase, Plate } from '../components/ArtBase';

const S44: FC = () => {
  const f = useCurrentFrame();
  const dark = interpolate(f, [0, 120], [0.06, 0.2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <ArtBase name="g16" zoom={[1.06, 1.10]} shiftX={[8, 18]}>
        <Plate name="sword" height="28%" left={620} bottom={540} opacity={0.92} />
        <Plate name="nun-full" height="58%" right={80} bottom={-40} opacity={0.93} />
      </ArtBase>
      <AbsoluteFill style={{ background: colors.ink, opacity: dark }} />
    </AbsoluteFill>
  );
};

export default S44;
