/* 镜 2 · 幕一 山不说话 · local [0,240) · 240f
   山脊横过纸面下三分之一，墨青与赭石，纸纤维可见。前 90f 山脊以极缓的墨渗长成，此后静止；末 30f 远山退淡。
   字幕 20–200（诗第 1 行，difference 取字色）。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase } from '../components/ArtBase';
import { Caption } from '../components/Caption';

const S02: FC = () => {
  const f = useCurrentFrame();
  const grow = interpolate(f, [0, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const recede = interpolate(f, [210, 240], [0, 0.22], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.25 + 0.75 * grow,
          filter: `blur(${(1 - grow) * 3}px)`,
          transform: `scale(${1.04 - 0.04 * grow})`,
          transformOrigin: '50% 78%',
        }}
      >
        <ArtBase name="g02" zoom={[1.0, 1.02]} />
      </div>
      <AbsoluteFill style={{ background: colors.paper, opacity: recede }} />
      <AbsoluteFill style={{ mixBlendMode: 'difference' }}>
        <Caption text="我走过山时，山不说话，" start={20} end={200} poem bottom={600} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default S02;
