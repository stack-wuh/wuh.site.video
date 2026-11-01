/* 镜 8 · 幕二 夜话 · local [0,180) · 180f
   客栈火塘边，一圈人的侧影深浅不一；她坐在最外圈，只听；火光只照亮她右眼一点反光（L3 1140–1240）。
   字幕 20–180。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase, Plate } from '../components/ArtBase';
import { Caption } from '../components/Caption';
import { FILM } from '../motion-tokens';

const S08: FC = () => {
  const f = useCurrentFrame();
  const flicker = 0.5 + 0.5 * Math.sin(f / 5.5) * Math.sin(f / 13);
  const eye = interpolate(f, [40, 60, 140, 160], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <ArtBase name="g05" zoom={[1.02, 1.06]}>
        {/* 火光呼吸 */}
        <div
          style={{
            position: 'absolute',
            left: '38%',
            top: '44%',
            width: 520,
            height: 380,
            background: `radial-gradient(circle, ${FILM.fireGold} 0%, transparent 64%)`,
            opacity: 0.18 + 0.1 * flicker,
            filter: 'blur(18px)',
            mixBlendMode: 'soft-light',
          }}
        />
        {/* 她：外圈的一点侧影 */}
        <Plate name="xiang16" height="52%" left={120} bottom={-40} opacity={0.9} />
        {/* L3：眼里一点反光（代码画） */}
        <div
          style={{
            position: 'absolute',
            left: 316,
            top: 432,
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: FILM.fireGold,
            opacity: eye * (0.7 + 0.3 * flicker),
            boxShadow: `0 0 6px ${FILM.fireGold}`,
          }}
        />
      </ArtBase>
      <AbsoluteFill style={{ background: colors.ink, opacity: 0.18 }} />
      <Caption text="说的人很多，见过的人很少。" start={20} end={180} />
    </AbsoluteFill>
  );
};

export default S08;
