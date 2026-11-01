/* 镜 43 · 幕五 挂剑 · local [0,180) · 180f
   剑挂上横钉，剑穗垂下来、微微晃；剑鞘上的三道火燎痕朝里；窗外是天色；墙上只这一件东西。
   字幕 0–180。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase, Plate } from '../components/ArtBase';
import { Caption } from '../components/Caption';

const S43: FC = () => {
  const f = useCurrentFrame();
  const hang = interpolate(f, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const swing = Math.sin(f / 26) * 3 * Math.max(0, 1 - f / 90);

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <ArtBase name="g16" zoom={[1.02, 1.06]}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: hang,
            transform: `rotate(${swing * 0.4}deg)`,
            transformOrigin: '50% 30%',
          }}
        >
          <Plate name="sword" height="30%" left={700} bottom={560} opacity={1} />
        </div>
      </ArtBase>
      <AbsoluteFill style={{ background: colors.ink, opacity: 0.06 }} />
      <Caption text="剑挂在墙上，再没取下来。" start={0} end={180} />
    </AbsoluteFill>
  );
};

export default S43;
