import type { FC } from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { colors } from '../../brand/tokens';
import { BlackOpen } from './scenes/BlackOpen';
import { NameCard } from './scenes/NameCard';
import { SplitScreen } from './scenes/SplitScreen';

// 黑场 0-90 / 名字 90-180 / 左右分屏 180-330
export const SelfIntro: FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(1200px 800px at 50% 40%, ${colors.bgLift} 0%, ${colors.bg} 70%)`,
      }}
    >
      <Sequence durationInFrames={90}>
        <BlackOpen />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <NameCard />
      </Sequence>
      <Sequence from={180} durationInFrames={150}>
        <SplitScreen />
      </Sequence>
    </AbsoluteFill>
  );
};
