/* 镜 52 · 幕六 落 · local [0,160) · 160f
   叠印不动；第 6 行落在两片金之间，压在中下部、避开最亮的地方；末字落在 7199，最后一帧仍是完整的叠印，不黑。
   字幕 0–159、fadeOut=false（末镜不淡出）。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase } from '../components/ArtBase';
import { Caption } from '../components/Caption';
import { Fireworks } from '../components/Fireworks';

const S52: FC = () => {
  const f = useCurrentFrame();
  const settle = interpolate(f, [0, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <ArtBase name="g18" zoom={[1.06, 1.06]}>
        <div style={{ opacity: 0.5 * settle, mixBlendMode: 'screen' }}>
          <Fireworks
            seed="s51"
            bursts={[
              { x: 780, y: 340, at: -60, scale: 1.25 },
              { x: 1280, y: 420, at: -20, scale: 0.95 },
            ]}
          />
        </div>
      </ArtBase>
      <AbsoluteFill style={{ background: colors.paper, opacity: 0.05 }} />
      <Caption text="像极了十六岁那年的烟花。" start={0} end={159} fadeOut={false} />
    </AbsoluteFill>
  );
};

export default S52;
