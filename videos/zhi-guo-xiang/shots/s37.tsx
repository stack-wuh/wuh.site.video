/* 镜 37 · 幕五 佛像 · local [0,120) · 120f
   佛像半身：头形一弧 + 肩线 + 一只手，低眉一条弧；佛前灯在画面前景；不拍全景、不给五官。
   极缓上摇 3%，停在手印上。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase } from '../components/ArtBase';
import { FILM } from '../motion-tokens';

const S37: FC = () => {
  const f = useCurrentFrame();
  const tilt = (f / 120) * 26;

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${tilt}px) scale(1.08)`, transformOrigin: '52% 60%' }}>
        <ArtBase name="g15" zoom={[1.02, 1.04]}>
          <div
            style={{
              position: 'absolute',
              left: '30%',
              bottom: '12%',
              width: 220,
              height: 220,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${FILM.fireGold} 0%, transparent 60%)`,
              opacity: 0.25 + 0.1 * Math.sin(f / 7),
              filter: 'blur(10px)',
              mixBlendMode: 'screen',
            }}
          />
        </ArtBase>
      </div>
      <AbsoluteFill style={{ background: colors.ink, opacity: 0.12 }} />
    </AbsoluteFill>
  );
};

export default S37;
