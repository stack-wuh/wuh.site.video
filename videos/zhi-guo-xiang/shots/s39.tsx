/* 镜 39 · 幕五 晨课 · local [0,100) · 100f
   庭中弟子站成两列，素衣，全是背影；她在廊下看着；阶上有薄雾，檐角挂着一点晨光。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase, Plate } from '../components/ArtBase';

const S39: FC = () => {
  const f = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <ArtBase name="g17" zoom={[1.02, 1.06]} shiftX={[-10, 12]}>
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: -160,
              right: -160,
              bottom: `${4 + i * 14}%`,
              height: '14%',
              background: `linear-gradient(180deg, transparent, ${colors.paper} 60%, transparent)`,
              opacity: 0.3 - i * 0.08,
              filter: 'blur(14px)',
              transform: `translateX(${Math.sin((f + i * 50) / 60) * 24}px)`,
            }}
          />
        ))}
        <Plate name="nun-full" height="46%" right={120} bottom={-20} opacity={0.94} />
      </ArtBase>
      <AbsoluteFill style={{ background: colors.paper, opacity: 0.08 }} />
    </AbsoluteFill>
  );
};

export default S39;
