/* 镜 9 · 幕二 余烬 · local [0,60) · 60f
   火塘将熄，灰里还剩一点暗金余烬；她的手拢在膝上，指尖有一点光；背景全暗。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase, Plate } from '../components/ArtBase';

const S09: FC = () => {
  const f = useCurrentFrame();
  const glow = 0.6 + 0.4 * Math.sin(f / 7);

  return (
    <AbsoluteFill style={{ background: colors.ink }}>
      <ArtBase name="g05" zoom={[1.10, 1.16]} shiftY={[10, -10]}>
        <div style={{ position: 'absolute', inset: 0, background: colors.ink, opacity: 0.55 }} />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '58%',
            width: 700,
            height: 520,
            marginLeft: -350,
            marginTop: -260,
            mixBlendMode: 'screen',
            opacity: 0.9,
          }}
        >
          <Plate name="j6" height="100%" opacity={0.95} blend="screen" />
        </div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '52%',
            width: 180,
            height: 180,
            marginLeft: -90,
            marginTop: -90,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(233,217,174,0.35) 0%, transparent 66%)',
            opacity: glow,
          }}
        />
      </ArtBase>
    </AbsoluteFill>
  );
};

export default S09;
