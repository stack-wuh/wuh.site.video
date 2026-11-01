/* 镜 18 · 幕三 眼 · local [0,120) · 120f
   人群的肩与后脑在前景；她只给一只眼与颧骨一角——眼里有一点正在开的金（L3 2220–2320），
   无眼白、无瞳孔、无目光；脸的中轴不入画，其余全在暗里。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase, Plate } from '../components/ArtBase';
import { FILM } from '../motion-tokens';

const S18: FC = () => {
  const f = useCurrentFrame();
  const glow = interpolate(f, [0, 30, 80, 100], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const pulse = 0.55 + 0.45 * Math.sin(f / 6);

  return (
    <AbsoluteFill style={{ background: colors.ink }}>
      <ArtBase name="g07" zoom={[1.24, 1.30]} shiftX={[30, 6]}>
        <AbsoluteFill style={{ background: colors.ink, opacity: 0.55 }} />
        <div style={{ position: 'absolute', right: '4%', top: '8%', height: '92%', opacity: 0.96 }}>
          <Plate name="dark" height="100%" opacity={0.95} blend="normal" />
        </div>
        <div
          style={{
            position: 'absolute',
            right: '26%',
            top: '34%',
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: FILM.fireGold,
            opacity: glow * pulse,
            boxShadow: `0 0 12px ${FILM.fireGold}`,
          }}
        />
      </ArtBase>
    </AbsoluteFill>
  );
};

export default S18;
