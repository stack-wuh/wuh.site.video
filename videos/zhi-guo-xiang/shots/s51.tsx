/* 镜 51 · 幕六 叠 · local [0,160) · 160f
   十六岁那夜的烟花从云层里浮出来，与晚霞叠在同一帧上；两层暖金贴合、不分彼此。
   烟花以极慢速度在云里绽开（0.1× 速度、半透），两层边缘互相渗透。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase } from '../components/ArtBase';
import { Fireworks } from '../components/Fireworks';

const S51: FC = () => {
  const f = useCurrentFrame();
  const blendIn = interpolate(f, [0, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <ArtBase name="g18" zoom={[1.02, 1.06]}>
        <div style={{ opacity: 0.5 * blendIn, mixBlendMode: 'screen' }}>
          <Fireworks
            seed="s51"
            bursts={[
              { x: 780, y: 340, at: 0, scale: 1.25 },
              { x: 1280, y: 420, at: 34, scale: 0.95 },
            ]}
          />
        </div>
      </ArtBase>
      <AbsoluteFill style={{ background: colors.paper, opacity: 0.06 }} />
    </AbsoluteFill>
  );
};

export default S51;
