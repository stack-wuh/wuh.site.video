/* 镜 47 · 幕六 光落纸 · local [0,150) · 150f
   云越过山脊，像水漫过堤；一束光从云隙落到窗台那页空纸上，纸亮了一下。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase } from '../components/ArtBase';

const S47: FC = () => {
  const f = useCurrentFrame();
  const beam = interpolate(f, [0, 60, 120], [0, 1, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <ArtBase name="g18" zoom={[1.06, 1.08]}>
        <div
          style={{
            position: 'absolute',
            left: '44%',
            top: '-10%',
            width: 260,
            height: '90%',
            background: `linear-gradient(180deg, ${colors.paper} 0%, transparent 82%)`,
            opacity: 0.16 * beam,
            transform: 'rotate(12deg)',
            filter: 'blur(8px)',
            mixBlendMode: 'screen',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '22%',
            bottom: '16%',
            width: 220,
            height: 60,
            background: colors.paper,
            opacity: 0.35 + 0.55 * beam,
            boxShadow: `0 0 40px ${colors.paper}`,
          }}
        />
      </ArtBase>
    </AbsoluteFill>
  );
};

export default S47;
