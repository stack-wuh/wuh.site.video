/* 镜 4 · 幕一 手 · local [0,60) · 60f
   一只年老的手把笔搁在砚边，墨已干；只给右手与砚的局部，纸面留白占大半，不拍脸（L0）。
   笔落定后停一拍；末 10f 手退出画外要慢，最后只剩笔与砚。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase, Plate } from '../components/ArtBase';

const S04: FC = () => {
  const f = useCurrentFrame();
  const exit = interpolate(f, [46, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <ArtBase name="g01" zoom={[1.02, 1.05]}>
        <div
          style={{
            position: 'absolute',
            right: 120 - exit * 90,
            bottom: -60 + exit * 70,
            height: '104%',
            opacity: 1 - exit * 0.55,
          }}
        >
          <Plate name="j9" height="100%" opacity={0.98} />
        </div>
      </ArtBase>
      <AbsoluteFill style={{ background: colors.paper, opacity: 0.12 }} />
    </AbsoluteFill>
  );
};

export default S04;
