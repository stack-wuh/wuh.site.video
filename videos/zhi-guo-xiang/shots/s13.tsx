/* 镜 13 · 幕三 军报 · local [0,80) · 80f
   城门内侧，天还没黑：一匹快马自左入向右出，骑手俯身递出军报；檐下灯一盏盏亮；地面薄尘薄雪。
   画面里全是背影与手的局部，没有一张脸朝镜头。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase, Plate } from '../components/ArtBase';
import { FILM } from '../motion-tokens';

const LANTERNS = [188, 402, 640, 906, 1216, 1520, 1760];

const S13: FC = () => {
  const f = useCurrentFrame();
  const ride = interpolate(f, [0, 80], [1150, -60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <ArtBase name="g06" zoom={[1.02, 1.06]} shiftX={[-14, 10]}>
        {LANTERNS.map((x, i) => {
          const lit = interpolate(f, [i * 6, i * 6 + 12], [0.15, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <div
              key={x}
              style={{
                position: 'absolute',
                left: x,
                top: 250 + (i % 3) * 26,
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${FILM.fireGold} 0%, transparent 62%)`,
                opacity: 0.35 * lit,
                filter: 'blur(4px)',
              }}
            />
          );
        })}
        <Plate name="horse" height="34%" left={ride} bottom={-20} opacity={0.95} />
        <AbsoluteFill style={{ background: colors.ink, opacity: 0.12 }} />
      </ArtBase>
    </AbsoluteFill>
  );
};

export default S13;
