/* 镜 49 · 幕六 名 · local [0,180) · 180f
   女弟子抬头看天（抬头 8°，30f 抬到位）；只给下颌 + 颈线；风把发与袖吹向同一侧；天上晚霞正盛。
   末 40f 画面里只剩天。字幕 0–160。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase, Plate } from '../components/ArtBase';
import { Caption } from '../components/Caption';

const S49: FC = () => {
  const f = useCurrentFrame();
  const toSky = interpolate(f, [100, 150], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const lift = interpolate(f, [0, 30], [0, -8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <ArtBase name="g12" zoom={[1.08, 1.12]} shiftY={[lift, lift - 20]}>
        <div style={{ opacity: 1 - toSky }}>
          <Plate name="fengling" height="60%" left={640} bottom={40} opacity={0.96} sway={2} />
        </div>
      </ArtBase>
      <AbsoluteFill style={{ opacity: toSky }}>
        <ArtBase name="g18" zoom={[1.04, 1.06]} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: colors.paper, opacity: 0.3 * toSky, mixBlendMode: 'soft-light' }} />
      <Caption text="风陵师太，峨眉第二代掌门。" start={0} end={160} />
    </AbsoluteFill>
  );
};

export default S49;
