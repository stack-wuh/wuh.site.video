/* 镜 25 · 幕四 驴 · local [0,240) · 240f
   青驴驮着行囊走过渡口，倚天剑挂在驴背上；她走在驴侧，只有背影。
   字幕逐字对拍：「滴滴答答」四字与四蹄起落同帧（镜内 20／32／44／56f），其余各 10f。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase, Plate } from '../components/ArtBase';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';

const CHAR_STARTS = [0, 7, 14, 20, 32, 44, 56, 68, 78, 88, 98, 108, 118, 128, 138, 148, 158];

const S25: FC = () => {
  const f = useCurrentFrame();
  const travel = interpolate(f, [0, 240], [80, -120], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bob = Math.sin((f / 40) * Math.PI * 2) * 3;

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <ArtBase name="g04" zoom={[1.08, 1.12]} shiftX={[-travel * 1.6, -travel * 1.6 - 220]}>
        <div style={{ transform: `translateY(${bob}px)` }}>
          <Plate name="xiang20" height="66%" left={980} driftX={travel * 0.6} bottom={-40} opacity={0.96} />
        </div>
        <DustField act={2} count={18} seedBase="s25" />
      </ArtBase>
      <Caption text="小毛驴滴滴答答，倚天剑伴我走天涯。" start={0} end={208} poem charStarts={CHAR_STARTS} />
    </AbsoluteFill>
  );
};

export default S25;
