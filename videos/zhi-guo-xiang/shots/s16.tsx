/* 镜 16 · 幕三 第一朵 · local [0,120) · 120f
   城头之上的夜空：第一朵烟花炸开，火金铺满画面右上，城垛与屋檐成剪影，灰蓝的夜被金撕开一道口。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase } from '../components/ArtBase';
import { Fireworks } from '../components/Fireworks';
import { FILM } from '../motion-tokens';

const S16: FC = () => {
  const f = useCurrentFrame();
  const flash = Math.max(0, 0.1 * Math.sin(((f - 30) / 18) * Math.PI)) * (f > 30 ? 1 : 0);

  return (
    <AbsoluteFill style={{ background: colors.ink }}>
      <ArtBase name="g07" zoom={[1.02, 1.06]}>
        <Fireworks seed="s16" bursts={[{ x: 1380, y: 300, at: 22, scale: 1.15 }]} />
        <AbsoluteFill style={{ background: FILM.fireGold, opacity: flash, mixBlendMode: 'screen' }} />
      </ArtBase>
      <AbsoluteFill style={{ background: colors.ink, opacity: 0.1 }} />
    </AbsoluteFill>
  );
};

export default S16;
