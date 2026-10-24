import type { FC } from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';

export const NameCard: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame, fps, config: { damping: 200 } });
  const opacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ transform: `translateY(${(1 - rise) * 48}px)`, textAlign: 'center' }}>
        <h1
          style={{
            fontFamily: fontFamilies.serif,
            fontSize: 120,
            color: colors.paper,
            margin: 0,
            opacity,
          }}
        >
          吴尒红
        </h1>
        <p
          style={{
            fontFamily: fontFamilies.sans,
            fontSize: 40,
            color: colors.accent,
            letterSpacing: '0.3em',
            marginTop: 24,
            opacity,
          }}
        >
          全栈开发者 · 写字的人
        </p>
      </div>
    </AbsoluteFill>
  );
};
