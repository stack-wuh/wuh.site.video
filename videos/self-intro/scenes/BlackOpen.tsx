import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';

const TEXT = '代码是另一种写作';

export const BlackOpen: FC = () => {
  const frame = useCurrentFrame();
  const fadeOut = interpolate(frame, [75, 90], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{ justifyContent: 'center', alignItems: 'center', opacity: fadeOut }}
    >
      <div style={{ display: 'flex' }}>
        {TEXT.split('').map((char, i) => {
          const opacity = interpolate(frame - i * 5, [0, 20], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <span
              key={i}
              style={{
                opacity,
                fontFamily: fontFamilies.serif,
                fontSize: 88,
                color: colors.paper,
                letterSpacing: '0.08em',
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
