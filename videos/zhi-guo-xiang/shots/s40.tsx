/* 镜 40 · 幕五 教人 · local [0,160) · 160f
   她手里的书卷合上，抬起头，开口（不出声）；前排弟子点头；廊下经幡被风吹动。
   字幕 0–160。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase, Plate } from '../components/ArtBase';
import { Caption } from '../components/Caption';

const S40: FC = () => {
  const f = useCurrentFrame();
  const flag = Math.sin(f / 26) * 8;

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <ArtBase name="g17" zoom={[1.06, 1.10]}>
        <div
          style={{
            position: 'absolute',
            right: '10%',
            top: '6%',
            width: 16,
            height: 220,
            background: colors.paper,
            opacity: 0.5,
            transform: `translateX(${flag}px) rotate(${flag * 0.2}deg)`,
            transformOrigin: 'top center',
          }}
        />
        <Plate name="nun-full" height="54%" right={140} bottom={-30} opacity={0.95} />
      </ArtBase>
      <AbsoluteFill style={{ background: colors.paper, opacity: 0.06 }} />
      <Caption text="后来，我开始教人。" start={0} end={160} />
    </AbsoluteFill>
  );
};

export default S40;
